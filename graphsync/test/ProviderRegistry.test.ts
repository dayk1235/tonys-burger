import { describe, it, expect } from 'vitest';
import { ProviderRegistry } from '../src/providers/ProviderRegistry.js';
import { DryRunProvider } from '../src/providers/DryRunProvider.js';

describe('ProviderRegistry', () => {
  it('registers and resolves providers by type', () => {
    const registry = new ProviderRegistry();
    const provider = new DryRunProvider();

    registry.register('dry-run', provider);
    registry.setActive('dry-run');

    expect(registry.getActive()).toBe(provider);
    expect(registry.get('dry-run')).toBe(provider);
    expect(registry.get('nonexistent')).toBeNull();
  });

  it('returns null when no active provider is set', () => {
    const registry = new ProviderRegistry();
    expect(registry.getActive()).toBeNull();
  });

  it('lists all registered providers', () => {
    const registry = new ProviderRegistry();
    registry.register('a', new DryRunProvider());
    registry.register('b', new DryRunProvider());
    expect(registry.list()).toEqual(['a', 'b']);
  });

  it('throws when setting active to unregistered type', () => {
    const registry = new ProviderRegistry();
    expect(() => registry.setActive('nonexistent')).toThrow('not registered');
  });
});
