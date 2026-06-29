import { EventBus } from '../bus/EventBus.js';
import {
  GraphSyncEvent,
  type FileChangedPayload,
  type BatchReadyPayload,
  type IndexStartedPayload,
  type IndexFinishedPayload,
  type IndexFailedPayload,
} from '../bus/events.js';
import type { IndexProvider } from './IndexProvider.js';
import type { ProviderRegistry } from '../providers/ProviderRegistry.js';
import type { ChangeAnalyzer } from '../analyzer/ChangeAnalyzer.js';
import type { PolicyEngine } from '../policy/PolicyEngine.js';
import type { Debouncer } from '../policy/Debouncer.js';
import type { StateStore } from '../state/StateStore.js';
import type { MetricsRecorder } from '../metrics/MetricsRecorder.js';
import { getLogger } from '../logger/logger.js';
import type { GraphSyncConfig } from '../config/types.js';
import { resolve } from 'node:path';

export class SyncEngine {
  private running = false;
  private indexing = false;

  constructor(
    private bus: EventBus,
    private providerRegistry: ProviderRegistry,
    private analyzer: ChangeAnalyzer,
    private policy: PolicyEngine,
    private debouncer: Debouncer,
    private state: StateStore,
    private metrics: MetricsRecorder,
    private config: GraphSyncConfig,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;

    const log = getLogger();
    log.info('sync engine started');

    this.bus.on(GraphSyncEvent.FileChanged, (payload: unknown) => {
      this.onFileChanged(payload as FileChangedPayload);
    });

    this.bus.on(GraphSyncEvent.BatchReady, (payload: unknown) => {
      this.onBatchReady(payload as BatchReadyPayload).catch((err) => {
        log.error({ error: err instanceof Error ? err.message : String(err) }, 'batch processing failed');
      });
    });
  }

  stop(): void {
    this.running = false;
    this.debouncer.stop();
    this.bus.removeAllListeners();
    this.state.releaseLock();
    const log = getLogger();
    log.info('sync engine stopped');
  }

  async indexManually(mode?: string, source?: string): Promise<void> {
    await this.executeIndex({
      mode: (mode ?? this.config.indexing.default_mode) as 'fast' | 'moderate' | 'full',
      source,
    });
  }

  private onFileChanged(payload: FileChangedPayload): void {
    if (!this.running) return;

    const classified = this.analyzer.classify(payload);
    if (!classified) {
      getLogger().debug({ path: payload.path }, 'file not in any knowledge source, skipping');
      return;
    }

    const decision = this.policy.evaluate(classified.source, true, false);

    if (!decision.reindex) {
      getLogger().debug(
        { source: classified.source, reason: decision.reason },
        'policy engine skipped reindex',
      );
      this.metrics.recordSkip(classified.source, decision.reason);
      return;
    }

    this.debouncer.add(payload, classified.source);
  }

  private async onBatchReady(payload: BatchReadyPayload): Promise<void> {
    if (!this.running) return;
    await this.executeIndex({
      mode: payload.mode as 'fast' | 'moderate' | 'full',
      source: payload.source,
    });
  }

  private async executeIndex(options: {
    mode: 'fast' | 'moderate' | 'full';
    source?: string;
  }): Promise<void> {
    const log = getLogger();
    const provider = this.providerRegistry.getActive();

    if (!provider) {
      log.error('no active provider configured');
      return;
    }

    if (this.indexing) {
      log.info('already indexing, queueing change');
      this.state.enqueue({
        timestamp: new Date().toISOString(),
        source: options.source ?? 'unknown',
        files: [],
        mode: options.mode,
      });
      return;
    }

    if (!this.state.acquireLock()) {
      log.warn('could not acquire lock, another instance may be running');
      return;
    }

    this.indexing = true;
    const projectState = this.state.loadState();

    const startedPayload: IndexStartedPayload = {
      mode: options.mode,
      source: options.source,
      timestamp: new Date(),
    };
    this.bus.emit(GraphSyncEvent.IndexStarted, startedPayload);

    try {
      log.info(
        { mode: options.mode, source: options.source ?? 'all' },
        'starting index',
      );

      const result = await provider.index({
        repoPath: resolve(this.config.provider.repo_path ?? '.'),
        mode: options.mode,
        source: options.source,
      });

      if (result.success) {
        this.policy.markIndexed(options.source ?? '__all__');

        if (options.source && projectState.knowledgeSources) {
          projectState.knowledgeSources[options.source] = {
            status: 'healthy',
            lastIndexedAt: new Date().toISOString(),
            lastMode: options.mode,
          };
        }

        projectState.status = 'idle';
        projectState.lastIndexedAt = new Date().toISOString();
        projectState.lastMode = options.mode;
        projectState.lastCommit = await this.getCurrentCommit().catch(() => null);
        projectState.pendingChanges = this.state.loadQueue().length;
        this.state.saveState(projectState);

        const finishedPayload: IndexFinishedPayload = {
          durationMs: result.durationMs,
          mode: options.mode,
          nodesCreated: result.nodesCreated,
          edgesCreated: result.edgesCreated,
        };
        this.bus.emit(GraphSyncEvent.IndexFinished, finishedPayload);

        log.info(
          { durationMs: result.durationMs, mode: options.mode },
          'index completed',
        );
      } else {
        projectState.status = 'error';
        this.state.saveState(projectState);

        const failedPayload: IndexFailedPayload = {
          error: result.error ?? 'unknown error',
          durationMs: result.durationMs,
          mode: options.mode,
        };
        this.bus.emit(GraphSyncEvent.IndexFailed, failedPayload);

        log.error(
          { error: result.error, durationMs: result.durationMs },
          'index failed',
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      projectState.status = 'error';
      this.state.saveState(projectState);

      this.bus.emit(GraphSyncEvent.IndexFailed, {
        error: message,
        durationMs: 0,
        mode: options.mode,
      } as IndexFailedPayload);

      log.error({ error: message }, 'index crashed');
    } finally {
      this.indexing = false;
      this.state.releaseLock();
    }

    const next = this.state.dequeue();
    if (next) {
      log.info({ source: next.source }, 'processing queued change');
      await this.executeIndex({
        mode: next.mode as 'fast' | 'moderate' | 'full',
        source: next.source,
      });
    }
  }

  isIdle(): boolean {
    return !this.indexing;
  }

  private async getCurrentCommit(): Promise<string | null> {
    try {
      const { execSync } = await import('node:child_process');
      return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch {
      return null;
    }
  }
}
