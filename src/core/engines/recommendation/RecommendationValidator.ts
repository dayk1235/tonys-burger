import { RecommendationInput, RecommendationOperationResult } from "./RecommendationTypes";
import { RecommendationValidationError } from "./RecommendationErrors";

export class RecommendationValidator {
  validateInput(input: Record<string, unknown>): RecommendationInput {
    if (!input.predictionId || typeof input.predictionId !== "string") {
      throw new RecommendationValidationError("Missing or invalid predictionId");
    }
    if (!input.predictionForecast || typeof input.predictionForecast !== "string") {
      throw new RecommendationValidationError("Missing or invalid predictionForecast");
    }
    if (!input.priority || typeof input.priority !== "string") {
      throw new RecommendationValidationError("Missing or invalid priority");
    }

    return {
      predictionId: String(input.predictionId),
      predictionForecast: String(input.predictionForecast),
      confidence: Number(input.confidence) || 0,
      businessId: String(input.businessId || ""),
      priority: String(input.priority),
      timestamp: String(input.timestamp || new Date().toISOString()),
    };
  }

  validateResult(result: unknown): RecommendationOperationResult {
    if (!result || typeof result !== "object") {
      throw new RecommendationValidationError("Invalid operation result");
    }
    return result as RecommendationOperationResult;
  }
}
