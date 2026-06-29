import pc from 'picocolors';
import { loadConfig } from '../config/Config.js';
import { StateStore } from '../state/StateStore.js';
export async function statusCommand(configPath) {
    try {
        const config = loadConfig(configPath);
        const stateStore = new StateStore(config.state.dir, config.project);
        const state = stateStore.loadState();
        const formatDate = (d) => {
            if (!d)
                return pc.dim('never');
            return new Date(d).toLocaleString();
        };
        const formatStatus = (s) => {
            switch (s) {
                case 'idle': return pc.green('idle');
                case 'indexing': return pc.cyan('indexing');
                case 'error': return pc.red('error');
                default: return pc.dim(s);
            }
        };
        console.log(`\n  ${pc.cyan('GraphSync Status')} — ${pc.bold(config.project)}\n`);
        console.log(`  ${pc.dim('Status:')}        ${formatStatus(state.status)}`);
        console.log(`  ${pc.dim('Provider:')}      ${state.provider}`);
        console.log(`  ${pc.dim('Last Index:')}    ${formatDate(state.lastIndexedAt)}`);
        console.log(`  ${pc.dim('Last Mode:')}     ${state.lastMode ?? pc.dim('-')}`);
        console.log(`  ${pc.dim('Last Commit:')}   ${state.lastCommit ?? pc.dim('-')}`);
        console.log(`  ${pc.dim('Pending:')}       ${state.pendingChanges} changes\n`);
        const sources = state.knowledgeSources ?? {};
        const sourceKeys = Object.keys(sources);
        if (sourceKeys.length > 0) {
            console.log(`  ${pc.bold('Knowledge Sources')}\n`);
            for (const key of sourceKeys) {
                const s = sources[key];
                const statusColor = s.status === 'healthy' ? pc.green : s.status === 'error' ? pc.red : pc.yellow;
                console.log(`    ${pc.bold(key)}`);
                console.log(`      Status:     ${statusColor(s.status)}`);
                console.log(`      Last Index: ${formatDate(s.lastIndexedAt)}`);
                console.log(`      Last Mode:  ${s.lastMode ?? pc.dim('-')}`);
                console.log();
            }
        }
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(pc.red(`\n  ✗ ${message}\n`));
        process.exit(1);
    }
}
//# sourceMappingURL=status.command.js.map