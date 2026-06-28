/**
 * @file src/core/adapters/registry/AdapterRegistry.ts
 * @description Registry for all source-specific adapters in Restaurant OS.
 *
 * The AdapterRegistry is the central point of discovery for all
 * registered adapters. It starts empty — adapters are registered
 * at startup or on demand by the Runtime.
 *
 * **Architectural Role:**
 * ```
 * External Source → AdapterRegistry.discover(source) → Adapter
 *                                                           ↓
 * Adapter.transform(input) → CanonicalOrderEvent → ObservationEngine
 *                                                       ↓
 *                                                 Cognitive Pipeline
 * ```
 *
 * The registry ensures that:
 * - Each adapter is uniquely identified by its name
 * - Adapters can be added/removed at runtime
 * - The ObservationEngine can discover the correct adapter for any source
 * - Capabilities can be inspected without instantiating adapters
 */

import type {
  CanonicalOrderAdapter,
} from "../contracts/CanonicalOrderAdapter";
import type {
  AdapterCapabilities,
  AdapterMetadata,
  AdapterSource,
} from "../types";
import {
  UnsupportedSourceError,
} from "../errors";

/**
 * Manages the lifecycle and discovery of source-specific adapters.
 *
 * The registry is source-aware: it maps each adapter to its source provider
 * slug, enabling fast lookup by provider name.
 *
 * **Thread safety:** This registry is designed for single-threaded
 * Node.js usage. Concurrent access is not guarded.
 */
export class AdapterRegistry {
  /** Map of adapter name → adapter instance */
  private readonly adapters: Map<string, CanonicalOrderAdapter> = new Map();

  /** Map of source provider slug → adapter name for fast lookup */
  private readonly providerIndex: Map<string, string> = new Map();

  // ─── Registration ──────────────────────────────────────────────────────

  /**
   * Registers an adapter in the registry.
   *
   * @param adapter - The adapter instance to register.
   * @throws {Error} If an adapter with the same name is already registered.
   * @throws {Error} If the source provider is already registered by another adapter.
   */
  register(adapter: CanonicalOrderAdapter): void {
    if (this.adapters.has(adapter.name)) {
      throw new Error(
        `Adapter "${adapter.name}" is already registered. ` +
        `Use unregister("${adapter.name}") first if you wish to replace it.`,
      );
    }

    const metadata = adapter.getMetadata();
    const provider = metadata.source.provider;

    if (this.providerIndex.has(provider)) {
      const existingName = this.providerIndex.get(provider)!;
      throw new Error(
        `Source provider "${provider}" is already handled by adapter ` +
        `"${existingName}". Each provider can have only one adapter.`,
      );
    }

    this.adapters.set(adapter.name, adapter);
    this.providerIndex.set(provider, adapter.name);
  }

  /**
   * Unregisters an adapter by name.
   *
   * @param name - The name of the adapter to remove.
   * @returns true if the adapter was removed, false if it wasn't registered.
   */
  unregister(name: string): boolean {
    const adapter = this.adapters.get(name);
    if (!adapter) {
      return false;
    }

    // Remove from provider index
    const metadata = adapter.getMetadata();
    const provider = metadata.source.provider;
    if (this.providerIndex.get(provider) === name) {
      this.providerIndex.delete(provider);
    }

    return this.adapters.delete(name);
  }

  // ─── Lookup ────────────────────────────────────────────────────────────

  /**
   * Retrieves an adapter by name.
   *
   * @param name - The unique name of the adapter.
   * @returns The adapter instance, or undefined if not found.
   */
  get(name: string): CanonicalOrderAdapter | undefined {
    return this.adapters.get(name);
  }

  /**
   * Returns all registered adapters.
   *
   * @returns An array of all adapter instances.
   */
  getAll(): CanonicalOrderAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Returns all registered adapter metadata.
   *
   * @returns An array of adapter metadata objects.
   */
  getAllMetadata(): AdapterMetadata[] {
    return this.getAll().map((adapter) => adapter.getMetadata());
  }

  /**
   * Discovers an adapter capable of handling the given source provider.
   *
   * @param provider - The source provider slug (e.g. "uber-eats", "rappi").
   * @returns The matching adapter.
   * @throws {UnsupportedSourceError} If no adapter is registered for the provider.
   */
  getForProvider(provider: string): CanonicalOrderAdapter {
    const adapterName = this.providerIndex.get(provider);
    if (!adapterName) {
      const availableProviders = Array.from(this.providerIndex.keys());
      throw new UnsupportedSourceError(provider, availableProviders);
    }

    const adapter = this.adapters.get(adapterName)!;
    return adapter;
  }

  // ─── Capabilities Discovery ────────────────────────────────────────────

  /**
   * Checks if any registered adapter supports the given source provider.
   *
   * @param provider - The source provider slug to check.
   * @returns true if an adapter is registered for the provider.
   */
  supports(provider: string): boolean {
    return this.providerIndex.has(provider);
  }

  /**
   * Checks if a specific adapter by name supports the given input.
   *
   * @param adapterName - The name of the adapter.
   * @param input - The input to check.
   * @returns true if the adapter can handle the input.
   */
  canHandle(adapterName: string, input: { raw: unknown }): boolean {
    const adapter = this.adapters.get(adapterName);
    if (!adapter) {
      return false;
    }
    return adapter.canHandle(input);
  }

  /**
   * Lists the capabilities of all registered adapters.
   *
   * @returns A record mapping adapter names to their capabilities.
   */
  listCapabilities(): Record<string, AdapterCapabilities> {
    const capabilities: Record<string, AdapterCapabilities> = {};
    for (const [name, adapter] of this.adapters) {
      capabilities[name] = adapter.getCapabilities();
    }
    return capabilities;
  }

  /**
   * Lists all registered source providers.
   *
   * @returns An array of source provider slugs.
   */
  listProviders(): AdapterSource[] {
    return this.getAll().map((adapter) => adapter.getMetadata().source);
  }

  // ─── Status ────────────────────────────────────────────────────────────

  /**
   * Returns the number of registered adapters.
   */
  get count(): number {
    return this.adapters.size;
  }

  /**
   * Returns whether the registry is empty (no adapters registered).
   */
  get isEmpty(): boolean {
    return this.adapters.size === 0;
  }

  /**
   * Removes all registered adapters.
   * Useful for testing or resetting the registry.
   */
  clear(): void {
    this.adapters.clear();
    this.providerIndex.clear();
  }
}

// Singleton instance (lazy) — the Runtime will instantiate and manage this.
// Applications should use the Runtime-managed instance, not this one directly.
export const adapterRegistry = new AdapterRegistry();
