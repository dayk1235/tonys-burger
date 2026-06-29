import { GraphSyncEvent, } from '../bus/events.js';
import { getLogger } from '../logger/logger.js';
import { resolve } from 'node:path';
export class SyncEngine {
    bus;
    providerRegistry;
    analyzer;
    policy;
    debouncer;
    state;
    metrics;
    config;
    running = false;
    indexing = false;
    constructor(bus, providerRegistry, analyzer, policy, debouncer, state, metrics, config) {
        this.bus = bus;
        this.providerRegistry = providerRegistry;
        this.analyzer = analyzer;
        this.policy = policy;
        this.debouncer = debouncer;
        this.state = state;
        this.metrics = metrics;
        this.config = config;
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        const log = getLogger();
        log.info('sync engine started');
        this.bus.on(GraphSyncEvent.FileChanged, (payload) => {
            this.onFileChanged(payload);
        });
        this.bus.on(GraphSyncEvent.BatchReady, (payload) => {
            this.onBatchReady(payload).catch((err) => {
                log.error({ error: err instanceof Error ? err.message : String(err) }, 'batch processing failed');
            });
        });
    }
    stop() {
        this.running = false;
        this.debouncer.stop();
        this.bus.removeAllListeners();
        this.state.releaseLock();
        const log = getLogger();
        log.info('sync engine stopped');
    }
    async indexManually(mode, source) {
        await this.executeIndex({
            mode: (mode ?? this.config.indexing.default_mode),
            source,
        });
    }
    onFileChanged(payload) {
        if (!this.running)
            return;
        const classified = this.analyzer.classify(payload);
        if (!classified) {
            getLogger().debug({ path: payload.path }, 'file not in any knowledge source, skipping');
            return;
        }
        const decision = this.policy.evaluate(classified.source, true, false);
        if (!decision.reindex) {
            getLogger().debug({ source: classified.source, reason: decision.reason }, 'policy engine skipped reindex');
            this.metrics.recordSkip(classified.source, decision.reason);
            return;
        }
        this.debouncer.add(payload, classified.source);
    }
    async onBatchReady(payload) {
        if (!this.running)
            return;
        await this.executeIndex({
            mode: payload.mode,
            source: payload.source,
        });
    }
    async executeIndex(options) {
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
        const startedPayload = {
            mode: options.mode,
            source: options.source,
            timestamp: new Date(),
        };
        this.bus.emit(GraphSyncEvent.IndexStarted, startedPayload);
        try {
            log.info({ mode: options.mode, source: options.source ?? 'all' }, 'starting index');
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
                const finishedPayload = {
                    durationMs: result.durationMs,
                    mode: options.mode,
                    nodesCreated: result.nodesCreated,
                    edgesCreated: result.edgesCreated,
                };
                this.bus.emit(GraphSyncEvent.IndexFinished, finishedPayload);
                log.info({ durationMs: result.durationMs, mode: options.mode }, 'index completed');
            }
            else {
                projectState.status = 'error';
                this.state.saveState(projectState);
                const failedPayload = {
                    error: result.error ?? 'unknown error',
                    durationMs: result.durationMs,
                    mode: options.mode,
                };
                this.bus.emit(GraphSyncEvent.IndexFailed, failedPayload);
                log.error({ error: result.error, durationMs: result.durationMs }, 'index failed');
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            projectState.status = 'error';
            this.state.saveState(projectState);
            this.bus.emit(GraphSyncEvent.IndexFailed, {
                error: message,
                durationMs: 0,
                mode: options.mode,
            });
            log.error({ error: message }, 'index crashed');
        }
        finally {
            this.indexing = false;
            this.state.releaseLock();
        }
        const next = this.state.dequeue();
        if (next) {
            log.info({ source: next.source }, 'processing queued change');
            await this.executeIndex({
                mode: next.mode,
                source: next.source,
            });
        }
    }
    isIdle() {
        return !this.indexing;
    }
    async getCurrentCommit() {
        try {
            const { execSync } = await import('node:child_process');
            return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
        }
        catch {
            return null;
        }
    }
}
//# sourceMappingURL=SyncEngine.js.map