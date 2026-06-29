import { describe, it, expect } from 'vitest';
import { DryRunProvider } from '../src/providers/DryRunProvider.js';

describe('DryRunProvider', () => {
  const provider = new DryRunProvider();

  it('returns success without actually indexing', async () => {
    const result = await provider.index({
      repoPath: '/test',
      mode: 'fast',
    });
    expect(result.success).toBe(true);
    expect(result.durationMs).toBe(0);
  });

  it('reports healthy', async () => {
    const health = await provider.health();
    expect(health.available).toBe(true);
    expect(health.version).toBe('dry-run-1.0');
  });

  it('has correct name', () => {
    expect(provider.name).toBe('dry-run');
  });
});
