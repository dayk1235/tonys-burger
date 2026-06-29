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
      decisionLabel: String(input.decisionLabel || input.learnedPattern || ""),
      expectedResult: String(input.expectedResult || ""),
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

  extractFromLearningEvent(payload: Record<string, unknown>): Record<string, unknown> {
    const learningEntity =
      (payload.entity as Record<string, unknown> | undefined)?.learning as Record<string, unknown> | undefined;
    const learningFlat = payload.learning as Record<string, unknown> | undefined;
    const learning = learningEntity ?? learningFlat ?? {};

    return {
      learningId: String(learning.id || ""),
      learnedPattern: String(learning.decisionLabel || learning.learnedPattern || ""),
      decisionLabel: String(learning.decisionLabel || ""),
      expectedResult: String(learning.expectedResult || ""),
      confidence: Number(learning.confidence) || 0,
      businessId: String(learning.businessId || ""),
      context: String(learning.rationale || learning.expectedResult || ""),
      timestamp: new Date().toISOString(),
    };
  }
}
