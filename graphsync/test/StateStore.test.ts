import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { StateStore } from '../src/state/StateStore.js';

describe('StateStore', () => {
  const testDir = resolve(tmpdir(), `graphsync-test-state-${Date.now()}`);
  let store: StateStore;

  beforeEach(() => {
    store = new StateStore(testDir, 'test-project');
  });

  afterEach(() => {
    try { rmSync(testDir, { recursive: true, force: true }); } catch { /* ok */ }
  });

  it('creates default state when no file exists', () => {
    const state = store.loadState();
    expect(state.status).toBe('idle');
    expect(state.lastIndexedAt).toBeNull();
    expect(state.lastCommit).toBeNull();
    expect(state.pendingChanges).toBe(0);
    expect(state.knowledgeSources).toEqual({});
  });

  it('persists and reloads state', () => {
    const state = store.loadState();
    state.status = 'indexing';
    state.lastIndexedAt = '2026-06-28T12:00:00.000Z';
    state.lastMode = 'fast';
    state.knowledgeSources['test-source'] = {
      status: 'healthy',
      lastIndexedAt: '2026-06-28T12:00:00.000Z',
      lastMode: 'fast',
    };
    store.saveState(state);

    const loaded = store.loadState();
    expect(loaded.status).toBe('indexing');
    expect(loaded.lastIndexedAt).toBe('2026-06-28T12:00:00.000Z');
    expect(loaded.lastMode).toBe('fast');
    expect(loaded.knowledgeSources['test-source'].status).toBe('healthy');
  });

  it('manages queue correctly', () => {
    expect(store.loadQueue()).toEqual([]);

    store.enqueue({
      timestamp: '2026-06-28T12:00:00.000Z',
      source: 'test-source',
      files: ['test.md'],
      mode: 'fast',
    });

    expect(store.loadQueue()).toHaveLength(1);

    const item = store.dequeue();
    expect(item).not.toBeNull();
    expect(item!.source).toBe('test-source');
    expect(store.loadQueue()).toHaveLength(0);

    expect(store.dequeue()).toBeNull();
  });

  it('acquires and releases lock', () => {
    expect(store.acquireLock()).toBe(true);
    expect(store.acquireLock()).toBe(false);
    store.releaseLock();
    expect(store.acquireLock()).toBe(true);
    store.releaseLock();
  });

  it('creates project directory on save', () => {
    const projectDir = store.getProjectDir();
    expect(existsSync(projectDir)).toBe(false);
    store.saveState(store.loadState());
    expect(existsSync(projectDir)).toBe(true);
  });
});
