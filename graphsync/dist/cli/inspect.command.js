import pc from 'picocolors';
import { loadConfig } from '../config/Config.js';
import { ProviderRegistry } from '../providers/ProviderRegistry.js';
import { MCPIndexProvider } from '../providers/MCPIndexProvider.js';
import { DryRunProvider } from '../providers/DryRunProvider.js';
import { HealthService } from '../health/HealthService.js';
export async function inspectCommand(configPath) {
    try {
        const config = loadConfig(configPath);
        // Health check
        const registry = new ProviderRegistry();
        if (config.provider.binary) {
            const mcp = new MCPIndexProvider(config.provider.binary, config.provider.timeout_ms ?? 300000);
            registry.register('mcp', mcp);
            registry.setActive('mcp');
        }
        registry.register('dry-run', new DryRunProvider());
        const healthService = new HealthService(registry, config.state.dir, config.provider.binary ?? null);
        const health = await healthService.check();
        console.log(`\n  ${pc.cyan('GraphSync Inspect')} — ${pc.bold(config.project)}\n`);
        // Knowledge Sources
        console.log(`  ${pc.bold('Knowledge Sources')} (${config.knowledge_sources.length})`);
        console.log();
        for (const source of config.knowledge_sources) {
            console.log(`    ${pc.bold(source.id)}`);
            console.log(`      ${pc.dim('Label:')}  ${source.label}`);
            console.log(`      ${pc.dim('Paths:')}  ${source.paths.join(', ')}`);
            console.log();
        }
        // Provider
        console.log(`  ${pc.bold('Provider')}`);
        console.log();
        const p = health.provider;
        console.log(`    ${pc.dim('Type:')}     ${config.provider.type}`);
        console.log(`    ${pc.dim('Status:')}   ${p.available ? pc.green('healthy') : pc.red('unhealthy')}`);
        if (p.error)
            console.log(`    ${pc.dim('Error:')}    ${pc.red(p.error)}`);
        console.log();
        // Binary
        console.log(`  ${pc.bold('Binary')}`);
        console.log();
        const b = health.binary;
        if (b.path) {
            console.log(`    ${pc.dim('Path:')}      ${b.path}`);
            console.log(`    ${pc.dim('Exists:')}   ${b.exists ? pc.green('yes') : pc.red('no')}`);
            console.log(`    ${pc.dim('Exec:')}     ${b.executable ? pc.green('yes') : pc.red('no')}`);
        }
        else {
            console.log(`    ${pc.dim('Status:')}   ${pc.yellow('not configured (dry-run mode)')}`);
        }
        console.log();
        // System
        console.log(`  ${pc.bold('System')}`);
        console.log();
        console.log(`    ${pc.dim('State Dir:')}  ${health.system.stateDir}`);
        console.log(`    ${pc.dim('Exists:')}    ${health.system.stateDirExists ? pc.green('yes') : pc.yellow('no')}`);
        console.log();
        // Watch config
        console.log(`  ${pc.bold('Watch Configuration')}`);
        console.log();
        console.log(`    ${pc.dim('Paths:')}  ${config.watch.paths.join(', ')}`);
        if (config.watch.ignore.length > 0) {
            console.log(`    ${pc.dim('Ignore:')} ${config.watch.ignore.join(', ')}`);
        }
        console.log();
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(pc.red(`\n  ✗ ${message}\n`));
        process.exit(1);
    }
}
//# sourceMappingURL=inspect.command.js.map