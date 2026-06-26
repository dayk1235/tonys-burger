import { PatternDefinition, ObservationRef } from "./PatternTypes";
import { PatternValidationError } from "./PatternErrors";

export class PatternValidator {
  validateDefinition(def: PatternDefinition): void {
    if (!def.name || def.name.trim().length === 0) {
      throw new PatternValidationError("pattern definition name must be non-empty");
    }
    if (typeof def.evaluate !== "function") {
      throw new PatternValidationError(`pattern "${def.name}" must provide an evaluate function`);
    }
    if (def.minSupport < 1) {
      throw new PatternValidationError(`pattern "${def.name}" minSupport must be at least 1`);
    }
    if (def.confidenceThreshold <= 0 || def.confidenceThreshold > 1) {
      throw new PatternValidationError(`pattern "${def.name}" confidenceThreshold must be in (0, 1]`);
    }
    if (def.timeWindowMs < 1000) {
      throw new PatternValidationError(`pattern "${def.name}" timeWindowMs must be at least 1000ms`);
    }
    if (!def.category) {
      throw new PatternValidationError(`pattern "${def.name}" must have a category`);
    }
    if (!def.detectionMethod) {
      throw new PatternValidationError(`pattern "${def.name}" must have a detection method`);
    }
  }

  validateObservations(observations: readonly ObservationRef[]): void {
    for (const obs of observations) {
      if (!obs.id) throw new PatternValidationError("observation missing id");
      if (!obs.category) throw new PatternValidationError(`observation ${obs.id} missing category`);
      if (!obs.timestamp) throw new PatternValidationError(`observation ${obs.id} missing timestamp`);
      if (obs.trustScore < 0 || obs.trustScore > 1) {
        throw new PatternValidationError(`observation ${obs.id} trustScore must be in [0, 1]`);
      }
    }
  }

  validateCorrelationInput(
    observationsA: readonly ObservationRef[],
    observationsB: readonly ObservationRef[]
  ): void {
    if (observationsA.length < 3) {
      throw new PatternValidationError("correlation requires at least 3 observations in each set", {
        setALength: observationsA.length,
      });
    }
    if (observationsB.length < 3) {
      throw new PatternValidationError("correlation requires at least 3 observations in each set", {
        setBLength: observationsB.length,
      });
    }
  }

  validateAnomalyInput(observations: readonly ObservationRef[]): void {
    if (observations.length < 5) {
      throw new PatternValidationError("anomaly detection requires at least 5 observations", {
        count: observations.length,
      });
    }
  }

  validateSequenceInput(observations: readonly ObservationRef[]): void {
    if (observations.length < 3) {
      throw new PatternValidationError("sequence detection requires at least 3 observations", {
        count: observations.length,
      });
    }
  }
}
