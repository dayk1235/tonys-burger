import { getLogger } from '../logger/logger.js';
export class DryRunProvider {
    name = 'dry-run';
    async index(options) {
        const log = getLogger();
        log.info({ mode: options.mode, repoPath: options.repoPath, source: options.source }, '[DRY RUN] would index repository');
        return {
            success: true,
            durationMs: 0,
            mode: options.mode,
        };
    }
    async health() {
        return {
            available: true,
            version: 'dry-run-1.0',
            lastContact: new Date(),
        };
    }
}
//# sourceMappingURL=DryRunProvider.js.map