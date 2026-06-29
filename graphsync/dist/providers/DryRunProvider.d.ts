import type { IndexProvider, IndexOptions, IndexResult, HealthStatus } from '../sync/IndexProvider.js';
export declare class DryRunProvider implements IndexProvider {
    readonly name = "dry-run";
    index(options: IndexOptions): Promise<IndexResult>;
    health(): Promise<HealthStatus>;
}
//# sourceMappingURL=DryRunProvider.d.ts.map