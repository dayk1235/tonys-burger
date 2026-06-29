import * as chokidar from 'chokidar';
import { resolve } from 'node:path';
import { GraphSyncEvent } from '../bus/events.js';
import { getLogger } from '../logger/logger.js';
function globToBase(pattern, cwd) {
    const stripped = pattern.replace(/\/\*\*(\/\*)?$/, '').replace(/\/\*$/, '');
    return resolve(cwd, stripped || '.');
}
export class FileWatcher {
    bus;
    options;
    watcher = null;
    constructor(bus, options) {
        this.bus = bus;
        this.options = options;
    }
    start() {
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
        const emit = (type) => (path) => {
            const payload = {
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
            .on('error', (err) => {
            log.error({ error: err instanceof Error ? err.message : String(err) }, 'file watcher error');
        });
    }
    stop() {
        if (!this.watcher)
            return Promise.resolve();
        return this.watcher.close();
    }
}
//# sourceMappingURL=FileWatcher.js.map