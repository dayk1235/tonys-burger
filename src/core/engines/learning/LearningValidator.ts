import { LearningInput, LearningOperationResult } from "./LearningTypes";
import { LearningValidationError } from "./LearningErrors";

export class LearningValidator {
  validateInput(input: Record<string, unknown>): LearningInput {
    if (!input.decisionId || typeof input.decisionId !== "string") {
      throw new LearningValidationError("Missing or invalid decisionId");
    }
    if (!input.decisionOutcome || typeof input.decisionOutcome !== "string") {
      throw new LearningValidationError("Missing or invalid decisionOutcome");
    }
    if (!input.expectedResult || typeof input.expectedResult !== "string") {
      throw new LearningValidationError("Missing or invalid expectedResult");
    }
    if (!input.actualResult || typeof input.actualResult !== "string") {
      throw new LearningValidationError("Missing or invalid actualResult");
    }

    return {
      decisionId: String(input.decisionId),
      decisionOutcome: String(input.decisionOutcome),
      expectedResult: String(input.expectedResult),
      actualResult: String(input.actualResult),
      confidence: Number(input.confidence) || 0,
      businessId: String(input.businessId || ""),
      timestamp: String(input.timestamp || new Date().toISOString()),
    };
  }

  validateResult(result: unknown): LearningOperationResult {
    if (!result || typeof result !== "object") {
      throw new LearningValidationError("Invalid operation result");
    }
    return result as LearningOperationResult;
  }
}
