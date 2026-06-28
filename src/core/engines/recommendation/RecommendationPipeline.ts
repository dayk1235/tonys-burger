import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  RecommendationInput,
  RecommendationOperationResult,
  RECOMMENDATION_ENGINE_NAME,
} from "./RecommendationTypes";

export class RecommendationPipeline {
  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {}

  async initiateRecommendation(input: RecommendationInput): Promise<RecommendationOperationResult> {
    const recommendationId = `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(RECOMMENDATION_ENGINE_NAME, "recommendation_initiated", {
        recommendationId,
        predictionId: input.predictionId,
        priority: input.priority,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit("recommendation.lifecycle.initiated", {
        recommendationId,
        predictionId: input.predictionId,
        predictionForecast: input.predictionForecast,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      recommendationId,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Recommendation initiated from prediction "${input.predictionId}" (priority: ${input.priority})`,
      metadata: {
        predictionId: input.predictionId,
        predictionForecast: input.predictionForecast,
        confidence: input.confidence,
        priority: input.priority,
      },
    };
  }
}
