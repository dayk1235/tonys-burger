import { PredictionInput, PredictionOperationResult } from "./PredictionTypes";
import { PredictionValidationError } from "./PredictionErrors";

export class PredictionValidator {
  validateInput(input: Record<string, unknown>): PredictionInput {
    if (!input.learningId || typeof input.learningId !== "string") {
      throw new PredictionValidationError("Missing or invalid learningId");
    }
    if (!input.learnedPattern || typeof input.learnedPattern !== "string") {
      throw new PredictionValidationError("Missing or invalid learnedPattern");
    }
    if (!input.context || typeof input.context !== "string") {
      throw new PredictionValidationError("Missing or invalid context");
    }

    return {
      learningId: String(input.learningId),
      learnedPattern: String(input.learnedPattern),
      confidence: Number(input.confidence) || 0,
      businessId: String(input.businessId || ""),
      context: String(input.context),
      timestamp: String(input.timestamp || new Date().toISOString()),
    };
  }

  validateResult(result: unknown): PredictionOperationResult {
    if (!result || typeof result !== "object") {
      throw new PredictionValidationError("Invalid operation result");
    }
    return result as PredictionOperationResult;
  }
}
