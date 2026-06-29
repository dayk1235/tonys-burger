import { existsSync, accessSync, constants } from 'node:fs';
import { resolve } from 'node:path';
export class HealthService {
    providerRegistry;
    stateDir;
    binaryPath;
    constructor(providerRegistry, stateDir, binaryPath) {
        this.providerRegistry = providerRegistry;
        this.stateDir = stateDir;
        this.binaryPath = binaryPath;
    }
    async check() {
        const provider = await this.checkProvider();
        const binary = this.checkBinary();
        const system = this.checkSystem();
        return { provider, binary, system };
    }
    async checkProvider() {
        try {
            const provider = this.providerRegistry.getActive();
            if (!provider) {
                return { name: 'none', available: false, error: 'no active provider' };
            }
            const status = await provider.health();
            return {
                name: provider.name,
                available: status.available,
                error: status.error,
            };
        }
        catch (err) {
            return {
                name: 'unknown',
                available: false,
                error: err instanceof Error ? err.message : String(err),
            };
        }
    }
    checkBinary() {
        if (!this.binaryPath) {
            return { path: null, exists: false, executable: false };
        }
        const resolved = resolve(this.binaryPath.replace(/^~/, process.env.HOME || ''));
        const exists = existsSync(resolved);
        let executable = false;
        if (exists) {
            try {
                accessSync(resolved, constants.X_OK);
                executable = true;
            }
            catch {
                executable = false;
            }
        }
        return { path: resolved, exists, executable };
    }
    checkSystem() {
        const dir = this.stateDir.replace(/^~/, process.env.HOME || '');
        const stateDirExists = existsSync(dir);
        return {
            stateDir: dir,
            stateDirExists,
            pidLock: false,
        };
    }
}
//# sourceMappingURL=HealthService.js.map