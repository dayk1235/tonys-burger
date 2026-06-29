import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';
const DEFAULT_CONFIG = {
    version: 1,
    indexing: {
        default_mode: 'fast',
        debounce_ms: 2000,
        cooldown_seconds: 60,
    },
    provider: {
        type: 'mcp',
        binary: undefined,
        repo_path: '.',
        timeout_ms: 300000,
    },
    state: {
        dir: '~/.graphsync',
    },
};
export function loadConfig(configPath) {
    const paths = configPath
        ? [configPath]
        : [
            resolve('.graphsync.yml'),
            resolve('.graphsync.yaml'),
            resolve('graphsync.yml'),
        ];
    let raw = null;
    let loadedPath = null;
    for (const p of paths) {
        if (existsSync(p)) {
            raw = readFileSync(p, 'utf-8');
            loadedPath = p;
            break;
        }
    }
    if (!raw) {
        throw new Error('No .graphsync.yml found in current directory. ' +
            'Create one or specify a path with --config.');
    }
    const parsed = yaml.load(raw);
    const config = mergeConfig(parsed);
    if (!config.project) {
        throw new Error('.graphsync.yml must specify a "project" name.');
    }
    config.state.dir = config.state.dir || '~/.graphsync';
    return config;
}
function mergeConfig(parsed) {
    return {
        version: parsed.version ?? DEFAULT_CONFIG.version,
        project: parsed.project ?? '',
        watch: {
            paths: parsed.watch?.paths ?? [],
            ignore: parsed.watch?.ignore ?? [],
        },
        knowledge_sources: parsed.knowledge_sources ?? [],
        indexing: {
            default_mode: parsed.indexing?.default_mode ?? 'fast',
            mode_by_source: parsed.indexing?.mode_by_source ?? {},
            debounce_ms: parsed.indexing?.debounce_ms ?? 2000,
            cooldown_seconds: parsed.indexing?.cooldown_seconds ?? 60,
        },
        provider: {
            type: parsed.provider?.type ?? 'mcp',
            binary: parsed.provider?.binary,
            repo_path: parsed.provider?.repo_path ?? '.',
            timeout_ms: parsed.provider?.timeout_ms ?? 300000,
        },
        state: {
            dir: parsed.state?.dir ?? '~/.graphsync',
        },
    };
}
export function resolveHomeDir(p) {
    if (p.startsWith('~/')) {
        return resolve(p.replace(/^~/, process.env.HOME || ''));
    }
    return resolve(p);
}
//# sourceMappingURL=Config.js.map