import { EventBus } from '../bus/EventBus.js';
import type { ProviderRegistry } from '../providers/ProviderRegistry.js';
import type { ChangeAnalyzer } from '../analyzer/ChangeAnalyzer.js';
import type { PolicyEngine } from '../policy/PolicyEngine.js';
import type { Debouncer } from '../policy/Debouncer.js';
import type { StateStore } from '../state/StateStore.js';
import type { MetricsRecorder } from '../metrics/MetricsRecorder.js';
import type { GraphSyncConfig } from '../config/types.js';
export declare class SyncEngine {
    private bus;
    private providerRegistry;
    private analyzer;
    private policy;
    private debouncer;
    private state;
    private metrics;
    private config;
    private running;
    private indexing;
    constructor(bus: EventBus, providerRegistry: ProviderRegistry, analyzer: ChangeAnalyzer, policy: PolicyEngine, debouncer: Debouncer, state: StateStore, metrics: MetricsRecorder, config: GraphSyncConfig);
    start(): void;
    stop(): void;
    indexManually(mode?: string, source?: string): Promise<void>;
    private onFileChanged;
    private onBatchReady;
    private executeIndex;
    isIdle(): boolean;
    private getCurrentCommit;
}
//# sourceMappingURL=SyncEngine.d.ts.map