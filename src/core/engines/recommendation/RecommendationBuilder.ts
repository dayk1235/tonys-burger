import {
  RecommendationInput,
  RecommendationEntity,
  RecommendationStage,
  RecommendationEvaluation,
} from "./RecommendationTypes";

export class RecommendationBuilder {
  buildFromPrediction(
    input: RecommendationInput,
    evaluation: RecommendationEvaluation,
  ): RecommendationEntity {
    const id = `rec-${input.predictionId}`;
    const now = input.timestamp;

    return {
      id,
      predictionId: input.predictionId,
      stage: "COMPLETED",
      recommendedAction: evaluation.recommendedAction,
      priority: evaluation.priority,
      expectedBenefit: evaluation.expectedBenefit,
      expectedRisk: evaluation.estimatedRisk,
      confidence: evaluation.overallConfidence,
      explanation: evaluation.explanation,
      supportingEvidence: {
        learningId: input.supportingEvidence.learningId,
        learnedPattern: input.supportingEvidence.learnedPattern,
        rationale: input.supportingEvidence.rationale,
        expectedResult: input.supportingEvidence.expectedResult,
        confidence: input.supportingEvidence.confidence,
      },
      forecast: {
        outcome: input.forecastOutcome,
        probability: input.forecastProbability,
        factors: [...input.forecastFactors],
      },
      businessId: input.businessId,
      createdAt: now,
      updatedAt: now,
    };
  }

  advanceStage(entity: RecommendationEntity, newStage: RecommendationStage): RecommendationEntity {
    return {
      ...entity,
      stage: newStage,
      updatedAt: new Date().toISOString(),
    };
  }
}
