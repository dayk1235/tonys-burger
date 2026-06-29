import pc from 'picocolors';
import { loadConfig, resolveHomeDir } from '../config/Config.js';
import { getLogger } from '../logger/logger.js';
import { EventBus } from '../bus/EventBus.js';
import { ProviderRegistry } from '../providers/ProviderRegistry.js';
import { MCPIndexProvider } from '../providers/MCPIndexProvider.js';
import { DryRunProvider } from '../providers/DryRunProvider.js';
import { HealthService } from '../health/HealthService.js';
import { MetricsStore } from '../metrics/MetricsStore.js';
import { FileWatcher } from '../watcher/FileWatcher.js';
import { ChangeAnalyzer } from '../analyzer/ChangeAnalyzer.js';
import { PolicyEngine } from '../policy/PolicyEngine.js';
import { Debouncer } from '../policy/Debouncer.js';
import { SyncEngine } from '../sync/SyncEngine.js';
import { StateStore } from '../state/StateStore.js';
import { resolve } from 'node:path';

export async function startCommand(configPath?: string, logLevel?: string): Promise<void> {
  const log = getLogger();

  try {
    const config = loadConfig(configPath);
    const bus = new EventBus();
    const metrics = new MetricsStore();
    const stateStore = new StateStore(config.state.dir, config.project);
    const state = stateStore.loadState();
    const root = resolve(process.cwd(), config.provider.repo_path ?? '.');

    // Provider Registry
    const registry = new ProviderRegistry();

    if (config.provider.binary) {
      const mcp = new MCPIndexProvider(
        config.provider.binary,
        config.provider.timeout_ms ?? 300000,
      );
      registry.register('mcp', mcp);
      registry.setActive('mcp');
      log.info({ binary: config.provider.binary }, 'registered MCP provider');
    }

    registry.register('dry-run', new DryRunProvider());
    log.info('registered dry-run provider');

    if (!registry.getActive()) {
      log.warn('no binary configured, falling back to dry-run mode');
      registry.setActive('dry-run');
    }

    // Health Service
    const healthService = new HealthService(
      registry,
      config.state.dir,
      config.provider.binary ?? null,
    );

    const healthResult = await healthService.check();
    log.info(
      {
        provider: `${healthResult.provider.name}: ${healthResult.provider.available ? 'healthy' : 'unhealthy'}`,
        binary: healthResult.binary.exists ? 'found' : 'not found',
      },
      'health check',
    );

    // Analyzer
    const analyzer = new ChangeAnalyzer(config.knowledge_sources, root);

    // Policy Engine
    const policy = new PolicyEngine({
      defaultMode: config.indexing.default_mode,
      modeBySource: config.indexing.mode_by_source ?? {},
      cooldownSeconds: config.indexing.cooldown_seconds,
    });

    // Debouncer
    const debouncer = new Debouncer(bus, config.indexing.debounce_ms);

    // Sync Engine
    const syncEngine = new SyncEngine(
      bus,
      registry,
      analyzer,
      policy,
      debouncer,
      stateStore,
      metrics,
      config,
    );

    // File Watcher
    const watcher = new FileWatcher(bus, {
      paths: config.watch.paths,
      ignore: config.watch.ignore,
      cwd: root,
    });

    // Initialize state
    state.provider = healthResult.provider.name;
    state.status = 'idle';
    stateStore.saveState(state);

    // Graceful shutdown
    const shutdown = async () => {
      log.info('shutting down...');
      watcher.stop();
      debouncer.stop();
      syncEngine.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    watcher.start();
    syncEngine.start();

    // Trigger initial index on startup
    log.info('triggering initial index...');
    syncEngine.indexManually().catch((err: Error) => {
      log.error({ error: err.message }, 'initial index failed');
    });

    console.log(pc.cyan(`\n  GraphSync — ${config.project}\n`));
    console.log(`  ${pc.green('✓')} watcher    active (${config.watch.paths.length} paths)`);
    console.log(`  ${pc.green('✓')} provider   ${registry.getActive()!.name}`);
    console.log(`  ${pc.green('✓')} sources    ${config.knowledge_sources.length} knowledge sources`);
    console.log(`  ${pc.green('✓')} state      ${stateStore.getProjectDir()}`);
    console.log(`  ${pc.dim('Press Ctrl+C to stop')}\n`);

    log.info(`GraphSync started for project '${config.project}'`);

    // Keep alive
    await new Promise<void>((resolve) => {
      process.on('SIGINT', () => resolve());
      process.on('SIGTERM', () => resolve());
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error({ error: message }, 'failed to start GraphSync');
    console.error(pc.red(`\n  ✗ ${message}\n`));
    process.exit(1);
  }
}
