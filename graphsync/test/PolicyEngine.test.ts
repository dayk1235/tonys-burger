import { describe, it, expect, beforeEach } from 'vitest';
import { PolicyEngine } from '../src/policy/PolicyEngine.js';

describe('PolicyEngine', () => {
  let engine: PolicyEngine;

  beforeEach(() => {
    engine = new PolicyEngine({
      defaultMode: 'fast',
      modeBySource: { code: 'moderate' },
      cooldownSeconds: 60,
    });
    engine.resetCooldowns();
  });

  it('skips when there are no files', () => {
    const decision = engine.evaluate('docs', false, false);
    expect(decision.reindex).toBe(false);
    expect(decision.reason).toContain('no files');
  });

  it('skips ignored files', () => {
    const decision = engine.evaluate('docs', true, true);
    expect(decision.reindex).toBe(false);
    expect(decision.reason).toContain('ignored');
  });

  it('uses full mode for first-time sources', () => {
    const decision = engine.evaluate('docs', true, false);
    expect(decision.reindex).toBe(true);
    expect(decision.mode).toBe('full');
    expect(decision.reason).toContain('first index');
  });

  it('uses configured mode for subsequent indexes', () => {
    engine.evaluate('docs', true, false);
    engine.markIndexed('docs');
    engine.resetCooldowns();

    const decision = engine.evaluate('docs', true, false);
    expect(decision.reindex).toBe(true);
    expect(decision.mode).toBe('fast');
  });

  it('uses source-specific mode when configured', () => {
    engine.evaluate('code', true, false);
    engine.markIndexed('code');
    engine.resetCooldowns();

    const decision = engine.evaluate('code', true, false);
    expect(decision.mode).toBe('moderate');
  });

  it('respects cooldown period', () => {
    engine.evaluate('docs', true, false);
    engine.markIndexed('docs');

    const decision = engine.evaluate('docs', true, false);
    expect(decision.reindex).toBe(false);
    expect(decision.reason).toContain('cooldown');
  });
});
