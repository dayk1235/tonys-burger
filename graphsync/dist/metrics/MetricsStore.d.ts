import type { MetricsRecorder, IndexMetrics, ProviderMetrics, MetricsSnapshot } from './MetricsRecorder.js';
export declare class MetricsStore implements MetricsRecorder {
    private indexes;
    private skipped;
    private providerChecks;
    recordIndex(metrics: IndexMetrics): void;
    recordSkip(source: string, _reason: string): void;
    recordProviderCheck(metrics: ProviderMetrics): void;
    snapshot(): MetricsSnapshot;
    reset(): void;
}
//# sourceMappingURL=MetricsStore.d.ts.map