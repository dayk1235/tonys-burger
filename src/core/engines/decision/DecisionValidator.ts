import { DecisionInput, DecisionOperationResult } from "./DecisionTypes";
import { DecisionValidationError } from "./DecisionErrors";

export class DecisionValidator {
  validateInput(input: Record<string, unknown>): DecisionInput {
    if (!input.reasoningId || typeof input.reasoningId !== "string") {
      throw new DecisionValidationError("Missing or invalid reasoningId");
    }
    if (!input.reasoningConclusion || typeof input.reasoningConclusion !== "string") {
      throw new DecisionValidationError("Missing or invalid reasoningConclusion");
    }
    if (!Array.isArray(input.alternatives)) {
      throw new DecisionValidationError("Missing or invalid alternatives array");
    }
    if (input.alternatives.length < 2) {
      throw new DecisionValidationError("At least 2 alternatives required");
    }
    if (!input.businessId || typeof input.businessId !== "string") {
      throw new DecisionValidationError("Missing or invalid businessId");
    }

    return {
      reasoningId: String(input.reasoningId),
      reasoningConclusion: String(input.reasoningConclusion),
      confidence: Number(input.confidence) || 0,
      alternatives: input.alternatives as DecisionInput["alternatives"],
      businessId: String(input.businessId),
      questionText: String(input.questionText || ""),
      urgency: Number(input.urgency) || 0,
    };
  }

  validateResult(result: unknown): DecisionOperationResult {
    if (!result || typeof result !== "object") {
      throw new DecisionValidationError("Invalid operation result");
    }
    return result as DecisionOperationResult;
  }
}
