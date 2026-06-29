import { RecommendationInput, RecommendationOperationResult } from "./RecommendationTypes";
import { RecommendationValidationError } from "./RecommendationErrors";

export class RecommendationValidator {
  validateInput(input: Record<string, unknown>): RecommendationInput {
    if (!input.predictionId || typeof input.predictionId !== "string") {
      throw new RecommendationValidationError("Missing or invalid predictionId");
    }
    if (!input.forecastOutcome || typeof input.forecastOutcome !== "string") {
      throw new RecommendationValidationError("Missing or invalid forecastOutcome");
    }

    const forecastProbability = Number(input.forecastProbability);
    if (isNaN(forecastProbability) || forecastProbability < 0 || forecastProbability > 1) {
      throw new RecommendationValidationError("Missing or invalid forecastProbability (must be 0-1)");
    }

    return {
      predictionId: String(input.predictionId),
      predictionForecast: String(input.predictionForecast || input.forecastOutcome || ""),
      forecastOutcome: String(input.forecastOutcome),
      forecastProbability,
      forecastFactors: Array.isArray(input.forecastFactors) ? input.forecastFactors : [],
      supportingEvidence: (input.supportingEvidence as RecommendationInput["supportingEvidence"]) ?? {
        learningId: "", learnedPattern: "", rationale: "", expectedResult: "", confidence: 0,
      },
      confidence: Number(input.confidence) || 0,
      businessId: String(input.businessId || ""),
      context: String(input.context || ""),
      expectedResult: String(input.expectedResult || ""),
      timestamp: String(input.timestamp || new Date().toISOString()),
    };
  }

  validateResult(result: unknown): RecommendationOperationResult {
    if (!result || typeof result !== "object") {
      throw new RecommendationValidationError("Invalid operation result");
    }
    return result as RecommendationOperationResult;
  }

  extractFromPredictionEvent(payload: Record<string, unknown>): Record<string, unknown> {
    const predictionEntity =
      (payload.entity as Record<string, unknown> | undefined)?.prediction as Record<string, unknown> | undefined;
    const predictionFlat = payload.prediction as Record<string, unknown> | undefined;
    const prediction = predictionEntity ?? predictionFlat ?? {};

    const forecast = (prediction.forecast as Record<string, unknown>) ?? {};
    const evidence = (prediction.supportingEvidence as Record<string, unknown>) ?? {};

    return {
      predictionId: String(prediction.id || ""),
      predictionForecast: String(forecast.outcome || ""),
      forecastOutcome: String(forecast.outcome || ""),
      forecastProbability: Number(forecast.probability) || 0,
      forecastFactors: Array.isArray(forecast.factors) ? forecast.factors : [],
      supportingEvidence: {
        learningId: String(evidence.learningId || ""),
        learnedPattern: String(evidence.learnedPattern || ""),
        rationale: String(evidence.rationale || ""),
        expectedResult: String(evidence.expectedResult || prediction.expectedResult || ""),
        confidence: Number(evidence.confidence) || 0,
      },
      confidence: Number(prediction.confidence) || 0,
      businessId: String(prediction.businessId || ""),
      context: String(evidence.rationale || prediction.expectedResult || ""),
      expectedResult: String(prediction.expectedResult || ""),
      timestamp: new Date().toISOString(),
    };
  }
}
