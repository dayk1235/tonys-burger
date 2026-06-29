import pino from 'pino';
import { resolve, dirname } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

let loggerInstance: pino.Logger | null = null;

export function createLogger(options?: {
  level?: string;
  logDir?: string;
  project?: string;
  pretty?: boolean;
}): pino.Logger {
  if (loggerInstance) return loggerInstance;

  const level = options?.level ?? 'info';
  const logDir = options?.logDir
    ? resolve(options.logDir.replace(/^~/, process.env.HOME || ''))
    : undefined;
  const project = options?.project ?? 'graphsync';

  const targets: pino.TransportTargetOptions[] = [];

  if (logDir) {
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    const logFile = resolve(logDir, `${project}.log`);
    targets.push({
      target: 'pino/file',
      options: { destination: logFile, mkdir: true },
      level,
    });
  }

  if (options?.pretty) {
    targets.push({
      target: 'pino-pretty',
      options: { colorize: true },
      level,
    });
  } else {
    targets.push({ target: 'pino/file', options: {}, level });
  }

  loggerInstance = pino(
    { level, name: project },
    pino.transport({ targets }),
  );

  return loggerInstance;
}

export function getLogger(): pino.Logger {
  if (!loggerInstance) {
    throw new Error('Logger not initialized. Call createLogger() first.');
  }
  return loggerInstance;
}

export function resetLogger(): void {
  loggerInstance = null;
}
