import type { IndexMode } from '../config/types.js';
export interface SourceState {
    status: 'healthy' | 'error' | 'pending';
    lastIndexedAt: string | null;
    lastMode: IndexMode | null;
}
export interface ProjectState {
    version: number;
    status: 'idle' | 'indexing' | 'error';
    provider: string;
    lastIndexedAt: string | null;
    lastCommit: string | null;
    lastMode: IndexMode | null;
    pendingChanges: number;
    knowledgeSources: Record<string, SourceState>;
}
export interface QueuedChange {
    timestamp: string;
    source: string;
    files: string[];
    mode: string;
}
export declare class StateStore {
    private baseDir;
    private projectDir;
    private statePath;
    private queuePath;
    private lockPath;
    constructor(stateDir: string, projectName: string);
    ensureDirectories(): void;
    loadState(): ProjectState;
    saveState(state: ProjectState): void;
    loadQueue(): QueuedChange[];
    saveQueue(queue: QueuedChange[]): void;
    enqueue(change: QueuedChange): void;
    dequeue(): QueuedChange | null;
    acquireLock(): boolean;
    releaseLock(): void;
    getProjectDir(): string;
    private defaultState;
}
//# sourceMappingURL=StateStore.d.ts.map