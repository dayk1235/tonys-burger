import type {
  IndexProvider,
  IndexOptions,
  IndexResult,
  HealthStatus,
} from '../sync/IndexProvider.js';
import { getLogger } from '../logger/logger.js';

export class DryRunProvider implements IndexProvider {
  readonly name = 'dry-run';

  async index(options: IndexOptions): Promise<IndexResult> {
    const log = getLogger();
    log.info(
      { mode: options.mode, repoPath: options.repoPath, source: options.source },
      '[DRY RUN] would index repository',
    );
    return {
      success: true,
      durationMs: 0,
      mode: options.mode,
    };
  }

  async health(): Promise<HealthStatus> {
    return {
      available: true,
      version: 'dry-run-1.0',
      lastContact: new Date(),
    };
  }
}
