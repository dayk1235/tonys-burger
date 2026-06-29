import { existsSync, accessSync, constants } from 'node:fs';
import { resolve } from 'node:path';
import type { IndexProvider, HealthStatus } from '../sync/IndexProvider.js';
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

export class HealthService {
  constructor(
    private providerRegistry: ProviderRegistry,
    private stateDir: string,
    private binaryPath: string | null,
  ) {}

  async check(): Promise<HealthCheckResult> {
    const provider = await this.checkProvider();
    const binary = this.checkBinary();
    const system = this.checkSystem();
    return { provider, binary, system };
  }

  private async checkProvider(): Promise<ProviderHealth> {
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
    } catch (err) {
      return {
        name: 'unknown',
        available: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  private checkBinary(): BinaryHealth {
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
      } catch {
        executable = false;
      }
    }
    return { path: resolved, exists, executable };
  }

  private checkSystem(): SystemHealth {
    const dir = this.stateDir.replace(/^~/, process.env.HOME || '');
    const stateDirExists = existsSync(dir);
    return {
      stateDir: dir,
      stateDirExists,
      pidLock: false,
    };
  }
}
