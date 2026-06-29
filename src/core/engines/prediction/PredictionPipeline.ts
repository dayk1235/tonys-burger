import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  PredictionInput,
  PredictionOperationResult,
  PredictionEntity,
  PREDICTION_ENGINE_NAME,
} from "./PredictionTypes";
import { PREDICTION_EVENTS } from "./PredictionEvents";
import { PredictionMemory } from "./PredictionMemory";
import { PredictionLifecycle } from "./PredictionLifecycle";
import { PredictionForecaster } from "./PredictionForecaster";
import { PredictionMetrics } from "./PredictionMetrics";

export class PredictionPipeline {
  readonly memory: PredictionMemory;
  readonly lifecycle: PredictionLifecycle;
  readonly forecaster: PredictionForecaster;
  readonly metrics: PredictionMetrics;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.memory = new PredictionMemory();
    this.lifecycle = new PredictionLifecycle();
    this.forecaster = new PredictionForecaster();
    this.metrics = new PredictionMetrics();
  }

  async initiatePrediction(input: PredictionInput): Promise<PredictionOperationResult> {
    const predictionId = `pred-${input.learningId}`;

    const { forecast, evidence, confidence } = this.forecaster.generate(input);

    const now = new Date().toISOString();
    const entity: PredictionEntity = {
      id: predictionId,
      learningId: input.learningId,
      stage: "COMPLETED",
      learnedPattern: input.learnedPattern,
      decisionLabel: input.decisionLabel,
      expectedResult: input.expectedResult,
      forecast,
      confidence,
      supportingEvidence: evidence,
      businessId: input.businessId,
      createdAt: now,
      updatedAt: now,
    };

    await this.memory.store(entity);
    this.metrics.recordInitiated();
    this.metrics.recordConfidence(confidence);
    this.metrics.recordProbability(forecast.probability);
    this.metrics.recordStageChange("INITIATED", "COMPLETED");
    this.metrics.recordCompleted();

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(PREDICTION_ENGINE_NAME, "prediction_completed", {
        predictionId,
        learningId: input.learningId,
        forecast: forecast.outcome,
        probability: forecast.probability,
        confidence,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit(PREDICTION_EVENTS.LIFECYCLE_COMPLETED, {
        entity: {
          prediction: {
            id: entity.id,
            learningId: entity.learningId,
            learnedPattern: entity.learnedPattern,
            decisionLabel: entity.decisionLabel,
            expectedResult: entity.expectedResult,
            forecast: entity.forecast,
            confidence: entity.confidence,
            supportingEvidence: entity.supportingEvidence,
            businessId: entity.businessId,
            stage: entity.stage,
          },
        },
        prediction: {
          id: entity.id,
          learningId: entity.learningId,
          learnedPattern: entity.learnedPattern,
          decisionLabel: entity.decisionLabel,
          expectedResult: entity.expectedResult,
          forecast: entity.forecast,
          confidence: entity.confidence,
          supportingEvidence: entity.supportingEvidence,
          businessId: entity.businessId,
          stage: entity.stage,
        },
        operation: "COMPLETE",
        timestamp: now,
        version: 1,
      });
    }

    return {
      success: true,
      predictionId,
      operation: "INITIATE",
      timestamp: now,
      details: `Prediction completed for learning "${input.learningId}" — outcome: "${forecast.outcome}" (probability: ${forecast.probability})`,
      metadata: {
        learningId: input.learningId,
        learnedPattern: input.learnedPattern,
        decisionLabel: input.decisionLabel,
        forecast: forecast.outcome,
        probability: forecast.probability,
        confidence,
      },
    };
  }
}
