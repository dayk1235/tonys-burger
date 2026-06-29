export declare enum GraphSyncEvent {
    FileChanged = "file:changed",
    BatchReady = "batch:ready",
    IndexStarted = "index:started",
    IndexFinished = "index:finished",
    IndexFailed = "index:failed",
    ProviderUnavailable = "provider:unavailable",
    ProviderAvailable = "provider:available",
    SyncSkipped = "sync:skipped",
    Error = "error"
}
export interface FileChangedPayload {
    path: string;
    type: 'add' | 'change' | 'unlink';
    timestamp: Date;
}
export interface BatchReadyPayload {
    changes: FileChangedPayload[];
    source: string;
    mode: string;
}
export interface IndexStartedPayload {
    mode: string;
    source?: string;
    timestamp: Date;
}
export interface IndexFinishedPayload {
    durationMs: number;
    mode: string;
    nodesCreated?: number;
    edgesCreated?: number;
}
export interface IndexFailedPayload {
    error: string;
    durationMs: number;
    mode: string;
}
export interface ProviderUnavailablePayload {
    provider: string;
    error: string;
}
export interface SyncSkippedPayload {
    reason: string;
    source: string;
}
export interface ErrorPayload {
    message: string;
    source: string;
    error?: Error;
}
//# sourceMappingURL=events.d.ts.map