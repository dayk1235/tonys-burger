import type { IndexProvider, IndexOptions, IndexResult, HealthStatus } from '../sync/IndexProvider.js';
export declare class MCPIndexProvider implements IndexProvider {
    private binaryPath;
    private timeoutMs;
    readonly name = "codebase-memory-mcp";
    private requestId;
    constructor(binaryPath: string, timeoutMs: number);
    index(options: IndexOptions): Promise<IndexResult>;
    health(): Promise<HealthStatus>;
    private handshake;
    private callTool;
    private sendRequest;
}
//# sourceMappingURL=MCPIndexProvider.d.ts.map