import { EventBus } from '../bus/EventBus.js';
export interface FileWatcherOptions {
    paths: string[];
    ignore: string[];
    cwd: string;
}
export declare class FileWatcher {
    private bus;
    private options;
    private watcher;
    constructor(bus: EventBus, options: FileWatcherOptions);
    start(): void;
    stop(): Promise<void>;
}
//# sourceMappingURL=FileWatcher.d.ts.map