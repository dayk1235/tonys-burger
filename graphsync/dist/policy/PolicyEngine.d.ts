import type { IndexMode } from '../config/types.js';
export interface PolicyDecision {
    reindex: boolean;
    mode: IndexMode;
    source: string;
    reason: string;
}
export interface PolicyOptions {
    defaultMode: IndexMode;
    modeBySource: Record<string, IndexMode>;
    cooldownSeconds: number;
}
export interface SourceCooldown {
    sourceId: string;
    lastIndexedAt: number;
}
export declare class PolicyEngine {
    private options;
    private cooldowns;
    private firstSeen;
    constructor(options: PolicyOptions);
    evaluate(source: string, hasFiles: boolean, isIgnored: boolean): PolicyDecision;
    markIndexed(source: string): void;
    isOnCooldown(source: string): boolean;
    private resolveMode;
    resetCooldowns(): void;
}
//# sourceMappingURL=PolicyEngine.d.ts.map