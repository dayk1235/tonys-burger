import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { loadConfig } from '../src/config/Config.js';

describe('Config', () => {
  const tmpDir = resolve(tmpdir(), `graphsync-test-${Date.now()}`);

  beforeEach(() => {
    if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    try { unlinkSync(resolve(tmpDir, '.graphsync.yml')); } catch { /* ok */ }
  });

  it('loads a valid config file', () => {
    writeFileSync(resolve(tmpDir, '.graphsync.yml'), `
version: 1
project: test-project
watch:
  paths:
    - docs/**
  ignore:
    - node_modules/**
knowledge_sources:
  - id: test-source
    label: "Test Source"
    paths:
      - docs/**
indexing:
  default_mode: fast
  debounce_ms: 1000
  cooldown_seconds: 30
provider:
  type: dry-run
state:
  dir: ~/.graphsync
`);
    const config = loadConfig(resolve(tmpDir, '.graphsync.yml'));
    expect(config.project).toBe('test-project');
    expect(config.watch.paths).toEqual(['docs/**']);
    expect(config.watch.ignore).toEqual(['node_modules/**']);
    expect(config.knowledge_sources).toHaveLength(1);
    expect(config.knowledge_sources[0].id).toBe('test-source');
    expect(config.indexing.default_mode).toBe('fast');
    expect(config.indexing.debounce_ms).toBe(1000);
    expect(config.indexing.cooldown_seconds).toBe(30);
    expect(config.provider.type).toBe('dry-run');
  });

  it('throws when no project is specified', () => {
    writeFileSync(resolve(tmpDir, '.graphsync.yml'), `
version: 1
watch:
  paths:
    - docs/**
knowledge_sources: []
indexing:
  default_mode: fast
  debounce_ms: 2000
  cooldown_seconds: 60
provider:
  type: dry-run
state:
  dir: ~/.graphsync
`);
    expect(() => loadConfig(resolve(tmpDir, '.graphsync.yml'))).toThrow('project');
  });

  it('applies defaults for missing optional fields', () => {
    writeFileSync(resolve(tmpDir, '.graphsync.yml'), `
version: 1
project: test
watch:
  paths:
    - docs/**
knowledge_sources: []
indexing:
  default_mode: fast
  debounce_ms: 2000
  cooldown_seconds: 60
provider:
  type: dry-run
`);
    const config = loadConfig(resolve(tmpDir, '.graphsync.yml'));
    expect(config.state.dir).toBe('~/.graphsync');
    expect(config.indexing.debounce_ms).toBe(2000);
  });
});
