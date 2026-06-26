import { EngineClassification, PipelineStage, EngineLifecycleState, QualityState, EngineDependency, ResourceProfile } from "./RuntimeTypes";
import { ManifestValidationError } from "./RuntimeErrors";

export interface EngineManifestDefinition {
  name: string;
  version: string;
  classification: EngineClassification;
  pipelinePosition: PipelineStage;
  purpose: string;
  dependencies: EngineDependency[];
  resourceProfile: ResourceProfile;
  qualityThresholds: {
    degraded: number;
    critical: number;
  };
}

export class EngineManifest {
  constructor(public readonly definition: EngineManifestDefinition) {
    this.validate();
  }

  private validate(): void {
    const def = this.definition;
    if (!def.name || def.name.trim().length === 0) {
      throw new ManifestValidationError(def.name, "name", "must be a non-empty string");
    }
    if (!def.version || !/^\d+\.\d+\.\d+$/.test(def.version)) {
      throw new ManifestValidationError(def.name, "version", "must be semver (e.g., 1.0.0)");
    }
    if (!def.purpose || def.purpose.trim().length < 10) {
      throw new ManifestValidationError(def.name, "purpose", "must be at least 10 characters");
    }
    if (def.qualityThresholds.degraded <= 0 || def.qualityThresholds.degraded > 1) {
      throw new ManifestValidationError(def.name, "qualityThresholds.degraded", "must be between 0 and 1");
    }
    if (def.qualityThresholds.critical <= 0 || def.qualityThresholds.critical > 1) {
      throw new ManifestValidationError(def.name, "qualityThresholds.critical", "must be between 0 and 1");
    }
    if (def.qualityThresholds.critical >= def.qualityThresholds.degraded) {
      throw new ManifestValidationError(def.name, "qualityThresholds", "critical threshold must be lower than degraded threshold");
    }
    if (def.resourceProfile.memoryMB < 1) {
      throw new ManifestValidationError(def.name, "resourceProfile.memoryMB", "must be at least 1MB");
    }
    if (def.resourceProfile.maxLatencyMs < 1) {
      throw new ManifestValidationError(def.name, "resourceProfile.maxLatencyMs", "must be at least 1ms");
    }
  }

  get defaultState(): EngineLifecycleState {
    return "INITIALIZED";
  }
}
