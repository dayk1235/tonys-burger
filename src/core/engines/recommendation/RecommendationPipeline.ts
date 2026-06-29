import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  RecommendationInput,
  RecommendationOperationResult,
  RecommendationEntity,
  RECOMMENDATION_ENGINE_NAME,
} from "./RecommendationTypes";
import { RECOMMENDATION_EVENTS } from "./RecommendationEvents";
import { RecommendationMemory } from "./RecommendationMemory";
import { RecommendationLifecycle } from "./RecommendationLifecycle";
import { RecommendationBuilder } from "./RecommendationBuilder";
import { RecommendationEvaluator } from "./RecommendationEvaluator";
import { RecommendationMetrics } from "./RecommendationMetrics";

export class RecommendationPipeline {
  readonly memory: RecommendationMemory;
  readonly lifecycle: RecommendationLifecycle;
  readonly builder: RecommendationBuilder;
  readonly evaluator: RecommendationEvaluator;
  readonly metrics: RecommendationMetrics;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.memory = new RecommendationMemory();
    this.lifecycle = new RecommendationLifecycle();
    this.builder = new RecommendationBuilder();
    this.evaluator = new RecommendationEvaluator();
    this.metrics = new RecommendationMetrics();
  }

  async initiateRecommendation(input: RecommendationInput): Promise<RecommendationOperationResult> {
    const evaluation = this.evaluator.evaluate(input);
    const entity = this.builder.buildFromPrediction(input, evaluation);

    await this.memory.store(entity);
    this.metrics.recordInitiated();
    this.metrics.recordConfidence(entity.confidence);
    this.metrics.recordPriority(entity.priority);
    this.metrics.recordStageChange("INITIATED", "COMPLETED");
    this.metrics.recordCompleted();

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(RECOMMENDATION_ENGINE_NAME, "recommendation_completed", {
        recommendationId: entity.id,
        predictionId: input.predictionId,
        priority: entity.priority,
        action: entity.recommendedAction,
        confidence: entity.confidence,
      });
    }

    if (this.eventBus) {
      const eventPayload: Record<string, unknown> = {
        entity: {
          recommendation: {
            id: entity.id,
            predictionId: entity.predictionId,
            recommendedAction: entity.recommendedAction,
            priority: entity.priority,
            expectedBenefit: entity.expectedBenefit,
            expectedRisk: entity.expectedRisk,
            confidence: entity.confidence,
            explanation: entity.explanation,
            supportingEvidence: entity.supportingEvidence,
            forecast: entity.forecast,
            businessId: entity.businessId,
            stage: entity.stage,
          },
        },
        recommendation: {
          id: entity.id,
          predictionId: entity.predictionId,
          recommendedAction: entity.recommendedAction,
          priority: entity.priority,
          expectedBenefit: entity.expectedBenefit,
          expectedRisk: entity.expectedRisk,
          confidence: entity.confidence,
          explanation: entity.explanation,
          supportingEvidence: entity.supportingEvidence,
          forecast: entity.forecast,
          businessId: entity.businessId,
          stage: entity.stage,
        },
        operation: "COMPLETE",
        timestamp: new Date().toISOString(),
        version: 1,
      };

      await this.eventBus.emit(RECOMMENDATION_EVENTS.LIFECYCLE_INITIATED, eventPayload);
      await this.eventBus.emit(RECOMMENDATION_EVENTS.LIFECYCLE_COMPLETED, eventPayload);
    }

    return {
      success: true,
      recommendationId: entity.id,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Recommendation completed for prediction "${input.predictionId}" — action: "${entity.recommendedAction}" (priority: ${entity.priority}, confidence: ${entity.confidence.toFixed(3)})`,
      metadata: {
        predictionId: input.predictionId,
        priority: entity.priority,
        confidence: entity.confidence,
        action: entity.recommendedAction,
      },
    };
  }
}
