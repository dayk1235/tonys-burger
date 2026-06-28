import { EngineManifestDefinition } from "./EngineManifest";
import { CognitiveEngine } from "../engines/observation/ObservationContracts";
import { EngineRegistry } from "./EngineRegistry";

export class EngineLoader {
  private registry: EngineRegistry;

  constructor(registry: EngineRegistry) {
    this.registry = registry;
  }

  async loadFromInstance(
    name: string,
    instance: CognitiveEngine,
    manifestDef: EngineManifestDefinition
  ): Promise<void> {
    await this.registry.register(name, instance, manifestDef);
  }
}
