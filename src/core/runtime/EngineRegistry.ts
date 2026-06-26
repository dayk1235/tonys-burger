import { EngineMetadata, EngineLifecycleState, QualityState } from "./RuntimeTypes";
import { EngineStateMachine } from "./EngineState";
import { EngineManifest, EngineManifestDefinition } from "./EngineManifest";
import { EngineRegistrationError, EngineNotFoundError } from "./RuntimeErrors";
import { CognitiveEngine as CognitiveEngineContract } from "../engines/observation/ObservationContracts";

export interface RegisteredEngine {
  manifest: EngineManifest;
  instance: CognitiveEngineContract;
  state: EngineStateMachine;
  metadata: EngineMetadata;
}

export class EngineRegistry {
  private engines: Map<string, RegisteredEngine> = new Map();

  async register(
    name: string,
    instance: CognitiveEngineContract,
    manifestDef: EngineManifestDefinition
  ): Promise<RegisteredEngine> {
    if (this.engines.has(name)) {
      throw new EngineRegistrationError(name, "an engine with this name is already registered");
    }

    const manifest = new EngineManifest(manifestDef);
    const state = new EngineStateMachine(manifest.defaultState);
    const stateStr = manifest.defaultState;

    const metadata: EngineMetadata = {
      identity: {
        name,
        version: manifestDef.version,
        classification: manifestDef.classification,
        pipelinePosition: manifestDef.pipelinePosition,
        purpose: manifestDef.purpose,
      },
      state: stateStr,
      qualityState: "NORMAL",
      resourceProfile: { ...manifestDef.resourceProfile },
      dependencies: [...manifestDef.dependencies],
      contractHash: this.computeContractHash(instance),
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      healthScore: 1.0,
    };

    const registered: RegisteredEngine = { manifest, instance, state, metadata };
    this.engines.set(name, registered);

    return registered;
  }

  get(name: string): RegisteredEngine {
    const engine = this.engines.get(name);
    if (!engine) {
      throw new EngineNotFoundError(name);
    }
    return engine;
  }

  has(name: string): boolean {
    return this.engines.has(name);
  }

  getAll(): RegisteredEngine[] {
    return Array.from(this.engines.values());
  }

  getByClassification(classification: string): RegisteredEngine[] {
    return this.getAll().filter(
      (e) => e.metadata.identity.classification === classification
    );
  }

  getByPipelineStage(stage: string): RegisteredEngine[] {
    return this.getAll().filter(
      (e) => e.metadata.identity.pipelinePosition === stage
    );
  }

  getByState(state: EngineLifecycleState): RegisteredEngine[] {
    return this.getAll().filter((e) => e.state.current === state);
  }

  unregister(name: string): boolean {
    return this.engines.delete(name);
  }

  count(): number {
    return this.engines.size;
  }

  updateLastActive(name: string): void {
    const engine = this.engines.get(name);
    if (engine) {
      engine.metadata.lastActive = new Date().toISOString();
    }
  }

  updateState(name: string, newState: EngineLifecycleState): void {
    const engine = this.engines.get(name);
    if (engine) {
      if (engine.state.canTransition(newState)) {
        engine.state.transition(newState);
      }
      engine.metadata.state = newState;
      engine.metadata.lastActive = new Date().toISOString();
    }
  }

  updateQualityState(name: string, qualityState: QualityState): void {
    const engine = this.engines.get(name);
    if (engine) {
      engine.metadata.qualityState = qualityState;
    }
  }

  updateHealthScore(name: string, score: number): void {
    const engine = this.engines.get(name);
    if (engine) {
      engine.metadata.healthScore = Math.max(0, Math.min(1, score));
    }
  }

  private computeContractHash(instance: CognitiveEngineContract): string {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
      .filter((k) => typeof (instance as unknown as Record<string, unknown>)[k] === "function")
      .sort()
      .join(",");
    return `v1:${methods}`;
  }
}
