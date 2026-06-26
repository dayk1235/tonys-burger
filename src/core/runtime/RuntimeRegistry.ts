import { RuntimeRegistry } from "../engines/observation/ObservationContracts";
import { CognitiveEngine } from "../engines/observation/ObservationContracts";
import { EngineRegistry } from "./EngineRegistry";
import { EngineNotFoundError } from "./RuntimeErrors";

export class RuntimeRegistryImpl implements RuntimeRegistry {
  constructor(private engineRegistry: EngineRegistry) {}

  async registerEngine(engine: CognitiveEngine): Promise<void> {
    await this.engineRegistry.register(engine.name, engine, {
      name: engine.name,
      version: "1.0.0",
      classification: "Perception",
      pipelinePosition: "OBSERVATION",
      purpose: `Cognitive engine: ${engine.name}`,
      dependencies: [],
      resourceProfile: {
        memoryMB: 64,
        maxLatencyMs: 1000,
        requiredStorageMB: 10,
      },
      qualityThresholds: {
        degraded: 0.7,
        critical: 0.4,
      },
    });
  }

  async deregisterEngine(engineName: string): Promise<void> {
    this.engineRegistry.unregister(engineName);
  }

  getEngine(engineName: string): CognitiveEngine | undefined {
    try {
      const engine = this.engineRegistry.get(engineName);
      return engine.instance;
    } catch (err) {
      if (err instanceof EngineNotFoundError) return undefined;
      throw err;
    }
  }

  async getEnginesByCategory(category: string): Promise<string[]> {
    return this.engineRegistry
      .getByClassification(category)
      .map((e) => e.metadata.identity.name);
  }

  async getEngineState(engineName: string): Promise<string> {
    return this.engineRegistry.get(engineName).state.current;
  }

  async getEngineHealth(engineName: string): Promise<number> {
    return this.engineRegistry.get(engineName).metadata.healthScore;
  }

  async listEngines(): Promise<string[]> {
    return this.engineRegistry.getAll().map((e) => e.metadata.identity.name);
  }

  async isEngineRunning(engineName: string): Promise<boolean> {
    const engine = this.engineRegistry.get(engineName);
    return engine.state.isActive() || engine.state.current === "RUNNING";
  }
}
