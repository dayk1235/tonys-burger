import { Runtime } from "./Runtime";
import { CognitiveEngine } from "../engines/observation/ObservationContracts";
import { EngineManifestDefinition } from "./EngineManifest";

export interface BootConfig {
  engines: Array<{
    name: string;
    instance: CognitiveEngine;
    manifest: EngineManifestDefinition;
  }>;
  configOverrides?: Partial<Runtime["config"]["getAll"]>;
}

export async function bootstrapRuntime(config: BootConfig): Promise<Runtime> {
  const runtime = new Runtime(config.configOverrides);

  await runtime.boot();

  for (const engine of config.engines) {
    await runtime.registerEngine(engine.name, engine.instance, engine.manifest);
  }

  await runtime.start();

  return runtime;
}
