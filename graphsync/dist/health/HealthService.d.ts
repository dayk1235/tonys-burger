import type { ProviderRegistry } from '../providers/ProviderRegistry.js';
export interface HealthCheckResult {
    provider: ProviderHealth;
    binary: BinaryHealth;
    system: SystemHealth;
}
export interface ProviderHealth {
    name: string;
    available: boolean;
    error?: string;
}
export interface BinaryHealth {
    path: string | null;
    exists: boolean;
    executable: boolean;
}
export interface SystemHealth {
    stateDir: string;
    stateDirExists: boolean;
    pidLock: boolean;
}
export declare class HealthService {
    private providerRegistry;
    private stateDir;
    private binaryPath;
    constructor(providerRegistry: ProviderRegistry, stateDir: string, binaryPath: string | null);
    check(): Promise<HealthCheckResult>;
    private checkProvider;
    private checkBinary;
    private checkSystem;
}
//# sourceMappingURL=HealthService.d.ts.map