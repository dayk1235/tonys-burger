export interface IndexMetrics {
    durationMs: number;
    mode: string;
    success: boolean;
    source?: string;
    timestamp: Date;
}
export interface ProviderMetrics {
    name: string;
    healthy: boolean;
    lastContact?: Date;
}
export interface MetricsSnapshot {
    totalIndexes: number;
    successfulIndexes: number;
    failedIndexes: number;
    skippedIndexes: number;
    averageDurationMs: number;
    lastIndexAt: Date | null;
    uptimeMs: number;
}
export interface MetricsRecorder {
    recordIndex(metrics: IndexMetrics): void;
    recordSkip(source: string, reason: string): void;
    recordProviderCheck(metrics: ProviderMetrics): void;
    snapshot(): MetricsSnapshot;
    reset(): void;
}
//# sourceMappingURL=MetricsRecorder.d.ts.map