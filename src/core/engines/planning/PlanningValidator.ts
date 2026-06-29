import { PlanningInput, PlanningOperationResult } from "./PlanningTypes";
import { PlanningValidationError } from "./PlanningErrors";

export class PlanningValidator {
  validateInput(input: Record<string, unknown>): PlanningInput {
    if (!input.recommendationId || typeof input.recommendationId !== "string") {
      throw new PlanningValidationError("Missing or invalid recommendationId");
    }
    if (!input.recommendationAction || typeof input.recommendationAction !== "string") {
      throw new PlanningValidationError("Missing or invalid recommendationAction");
    }

    return {
      recommendationId: String(input.recommendationId),
      recommendationAction: String(input.recommendationAction),
      priority: String(input.priority || "MEDIUM"),
      expectedBenefit: String(input.expectedBenefit || ""),
      expectedRisk: String(input.expectedRisk || ""),
      explanation: String(input.explanation || ""),
      confidence: Number(input.confidence) || 0,
      businessId: String(input.businessId || ""),
      scope: String(input.scope || input.recommendationAction || ""),
      supportingEvidence: (input.supportingEvidence as PlanningInput["supportingEvidence"]) ?? {
        learningId: "", learnedPattern: "", rationale: "", expectedResult: "", confidence: 0,
      },
      forecast: (input.forecast as PlanningInput["forecast"]) ?? {
        outcome: "", probability: 0, factors: [],
      },
      timestamp: String(input.timestamp || new Date().toISOString()),
    };
  }

  validateResult(result: unknown): PlanningOperationResult {
    if (!result || typeof result !== "object") {
      throw new PlanningValidationError("Invalid operation result");
    }
    return result as PlanningOperationResult;
  }

  extractFromRecommendationEvent(payload: Record<string, unknown>): Record<string, unknown> {
    const recEntity =
      (payload.entity as Record<string, unknown> | undefined)?.recommendation as Record<string, unknown> | undefined;
    const recFlat = payload.recommendation as Record<string, unknown> | undefined;
    const recommendation = recEntity ?? recFlat ?? {};

    const evidence = (recommendation.supportingEvidence as Record<string, unknown>) ?? {};
    const forecast = (recommendation.forecast as Record<string, unknown>) ?? {};

    return {
      recommendationId: String(recommendation.id || ""),
      recommendationAction: String(recommendation.recommendedAction || ""),
      priority: String(recommendation.priority || ""),
      expectedBenefit: String(recommendation.expectedBenefit || ""),
      expectedRisk: String(recommendation.expectedRisk || ""),
      explanation: String(recommendation.explanation || ""),
      confidence: Number(recommendation.confidence) || 0,
      businessId: String(recommendation.businessId || ""),
      scope: String(recommendation.recommendedAction || recommendation.priority || ""),
      supportingEvidence: {
        learningId: String(evidence.learningId || ""),
        learnedPattern: String(evidence.learnedPattern || ""),
        rationale: String(evidence.rationale || ""),
        expectedResult: String(evidence.expectedResult || ""),
        confidence: Number(evidence.confidence) || 0,
      },
      forecast: {
        outcome: String(forecast.outcome || ""),
        probability: Number(forecast.probability) || 0,
        factors: Array.isArray(forecast.factors) ? forecast.factors : [],
      },
      timestamp: new Date().toISOString(),
    };
  }
}
