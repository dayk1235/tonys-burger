import pc from 'picocolors';
import { loadConfig } from '../config/Config.js';
import { ProviderRegistry } from '../providers/ProviderRegistry.js';
import { MCPIndexProvider } from '../providers/MCPIndexProvider.js';
import { DryRunProvider } from '../providers/DryRunProvider.js';
import { StateStore } from '../state/StateStore.js';
import { getLogger } from '../logger/logger.js';

export async function indexCommand(
  configPath?: string,
  mode?: string,
  source?: string,
): Promise<void> {
  try {
    const config = loadConfig(configPath);
    const stateStore = new StateStore(config.state.dir, config.project);
    const log = getLogger();

    // Build provider
    const registry = new ProviderRegistry();
    let providerType = 'dry-run';

    if (config.provider.binary) {
      const mcp = new MCPIndexProvider(
        config.provider.binary,
        config.provider.timeout_ms ?? 300000,
      );
      registry.register('mcp', mcp);
      registry.setActive('mcp');
      providerType = 'mcp';
    } else {
      registry.register('dry-run', new DryRunProvider());
      registry.setActive('dry-run');
    }

    const provider = registry.getActive()!;

    console.log(`\n  ${pc.cyan('GraphSync Index')} — ${pc.bold(config.project)}`);
    console.log(`  ${pc.dim('Mode:')}   ${mode ?? 'fast'}`);
    console.log(`  ${pc.dim('Source:')} ${source ?? pc.dim('all')}`);
    console.log(`  ${pc.dim('Provider:')} ${provider.name}\n`);

    const start = Date.now();
    const result = await provider.index({
      repoPath: process.cwd(),
      mode: (mode ?? 'fast') as 'fast' | 'moderate' | 'full',
      source,
    });

    const duration = Date.now() - start;

    if (result.success) {
      const state = stateStore.loadState();
      state.status = 'idle';
      state.lastIndexedAt = new Date().toISOString();
      state.lastMode = result.mode;
      state.provider = provider.name;

      if (source) {
        state.knowledgeSources[source] = {
          status: 'healthy',
          lastIndexedAt: new Date().toISOString(),
          lastMode: result.mode,
        };
      }

      stateStore.saveState(state);

      console.log(`  ${pc.green('✓')} Index completed in ${duration}ms`);
      console.log();
    } else {
      console.error(`  ${pc.red('✗')} Index failed: ${result.error}`);
      console.log();
      process.exit(1);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(pc.red(`\n  ✗ ${message}\n`));
    process.exit(1);
  }
}
