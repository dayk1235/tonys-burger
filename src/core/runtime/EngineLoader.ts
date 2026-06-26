import { EngineManifestDefinition } from "./EngineManifest";
import { CognitiveEngine } from "../engines/observation/ObservationContracts";
import { EngineRegistry } from "./EngineRegistry";

export class EngineLoader {
  private registry: EngineRegistry;

  constructor(registry: EngineRegistry) {
    this.registry = registry;
  }

  async loadFromModule(
    modulePath: string,
    ...constructorArgs: unknown[]
  ): Promise<void> {
    const mod = await this.importModule(modulePath);
    const instance = new mod.EngineClass(...constructorArgs);
    await this.registry.register(mod.Manifest.name, instance, mod.Manifest);
  }

  async loadFromInstance(
    name: string,
    instance: CognitiveEngine,
    manifestDef: EngineManifestDefinition
  ): Promise<void> {
    await this.registry.register(name, instance, manifestDef);
  }

  private async importModule(path: string): Promise<{
    EngineClass: new (...args: unknown[]) => CognitiveEngine;
    Manifest: EngineManifestDefinition;
  }> {
    const mod = await import(path);
    if (!mod.EngineClass || !mod.Manifest) {
      throw new Error(`Module "${path}" must export EngineClass and Manifest`);
    }
    return { EngineClass: mod.EngineClass, Manifest: mod.Manifest };
  }
}
