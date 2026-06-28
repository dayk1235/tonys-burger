import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  PredictionInput,
  PredictionOperationResult,
  PREDICTION_ENGINE_NAME,
} from "./PredictionTypes";

export class PredictionPipeline {
  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {}

  async initiatePrediction(input: PredictionInput): Promise<PredictionOperationResult> {
    const predictionId = `pred-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(PREDICTION_ENGINE_NAME, "prediction_initiated", {
        predictionId,
        learningId: input.learningId,
        pattern: input.learnedPattern,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit("prediction.lifecycle.initiated", {
        predictionId,
        learningId: input.learningId,
        learnedPattern: input.learnedPattern,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      predictionId,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Prediction initiated from learning cycle "${input.learningId}" (pattern: ${input.learnedPattern})`,
      metadata: {
        learningId: input.learningId,
        learnedPattern: input.learnedPattern,
        confidence: input.confidence,
      },
    };
  }
}
