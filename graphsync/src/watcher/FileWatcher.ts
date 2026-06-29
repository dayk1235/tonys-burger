import * as chokidar from 'chokidar';
import { resolve } from 'node:path';
import { EventBus } from '../bus/EventBus.js';
import { GraphSyncEvent, type FileChangedPayload } from '../bus/events.js';
import { getLogger } from '../logger/logger.js';

export interface FileWatcherOptions {
  paths: string[];
  ignore: string[];
  cwd: string;
}

function globToBase(pattern: string, cwd: string): string {
  const stripped = pattern.replace(/\/\*\*(\/\*)?$/, '').replace(/\/\*$/, '');
  return resolve(cwd, stripped || '.');
}

export class FileWatcher {
  private watcher: chokidar.FSWatcher | null = null;

  constructor(
    private bus: EventBus,
    private options: FileWatcherOptions,
  ) {}

  start(): void {
    const log = getLogger();
    const baseDirs = [...new Set(this.options.paths.map((p) => globToBase(p, this.options.cwd)))];
    const ignorePatterns = this.options.ignore.map((p) => resolve(this.options.cwd, p));

    log.info({ paths: baseDirs, ignore: this.options.ignore }, 'starting file watcher');

    this.watcher = chokidar.watch(baseDirs, {
      ignored: ignorePatterns,
      persistent: true,
      ignoreInitial: true,
      followSymlinks: false,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    const emit = (type: FileChangedPayload['type']) => (path: string) => {
      const payload: FileChangedPayload = {
        path,
        type,
        timestamp: new Date(),
      };
      this.bus.emit(GraphSyncEvent.FileChanged, payload);
    };

    this.watcher
      .on('add', emit('add'))
      .on('change', emit('change'))
      .on('unlink', emit('unlink'))
      .on('error', (err: unknown) => {
        log.error({ error: err instanceof Error ? err.message : String(err) }, 'file watcher error');
      });
  }

  stop(): Promise<void> {
    if (!this.watcher) return Promise.resolve();
    return this.watcher.close();
  }
}
