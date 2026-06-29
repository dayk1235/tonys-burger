import type { IndexProvider } from '../sync/IndexProvider.js';

export class ProviderRegistry {
  private providers = new Map<string, IndexProvider>();
  private activeType: string | null = null;

  register(type: string, provider: IndexProvider): void {
    this.providers.set(type, provider);
  }

  setActive(type: string): void {
    if (!this.providers.has(type)) {
      throw new Error(`Provider '${type}' is not registered.`);
    }
    this.activeType = type;
  }

  getActive(): IndexProvider | null {
    if (!this.activeType) return null;
    return this.providers.get(this.activeType) ?? null;
  }

  get(type: string): IndexProvider | null {
    return this.providers.get(type) ?? null;
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }

  getActiveType(): string | null {
    return this.activeType;
  }
}
