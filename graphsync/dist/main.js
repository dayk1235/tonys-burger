#!/usr/bin/env node
import { Command } from 'commander';
import { createLogger } from './logger/logger.js';
import { startCommand } from './cli/start.command.js';
import { stopCommand } from './cli/stop.command.js';
import { statusCommand } from './cli/status.command.js';
import { inspectCommand } from './cli/inspect.command.js';
import { indexCommand } from './cli/index.command.js';
const program = new Command();
program
    .name('graphsync')
    .description('Cognitive graph synchronization engine')
    .version('1.0.0');
program
    .command('start')
    .description('Start the GraphSync watcher and sync engine')
    .option('-c, --config <path>', 'Path to .graphsync.yml')
    .option('--log-level <level>', 'Log level (debug, info, warn, error)', 'info')
    .option('--no-pretty', 'Disable pretty console logging')
    .action(async (opts) => {
    createLogger({
        level: opts.logLevel,
        pretty: opts.pretty,
        logDir: '~/.cache/graphsync',
    });
    await startCommand(opts.config, opts.logLevel);
});
program
    .command('stop')
    .description('Stop a running GraphSync instance')
    .action(async () => {
    createLogger({ level: 'info' });
    await stopCommand();
});
program
    .command('status')
    .description('Show current GraphSync status')
    .option('-c, --config <path>', 'Path to .graphsync.yml')
    .action(async (opts) => {
    createLogger({ level: 'info', pretty: true });
    await statusCommand(opts.config);
});
program
    .command('inspect')
    .description('Inspect knowledge sources and their health')
    .option('-c, --config <path>', 'Path to .graphsync.yml')
    .action(async (opts) => {
    createLogger({ level: 'info', pretty: true });
    await inspectCommand(opts.config);
});
program
    .command('index')
    .description('Manually trigger a repository index')
    .option('-c, --config <path>', 'Path to .graphsync.yml')
    .option('-m, --mode <mode>', 'Index mode (fast, moderate, full)', 'fast')
    .option('-s, --source <source>', 'Specific knowledge source to index')
    .action(async (opts) => {
    createLogger({ level: 'info', pretty: true });
    await indexCommand(opts.config, opts.mode, opts.source);
});
program.parse(process.argv);
//# sourceMappingURL=main.js.map