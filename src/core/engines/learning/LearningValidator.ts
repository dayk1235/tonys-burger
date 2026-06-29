import { LearningInput, LearningOperationResult } from "./LearningTypes";
import { LearningValidationError } from "./LearningErrors";

export class LearningValidator {
  validateInput(input: Record<string, unknown>): LearningInput {
    if (!input.decisionId || typeof input.decisionId !== "string") {
      throw new LearningValidationError("Missing or invalid decisionId");
    }
    if (!input.decisionLabel || typeof input.decisionLabel !== "string") {
      throw new LearningValidationError("Missing or invalid decisionLabel");
    }
    if (!input.decisionOutcome || typeof input.decisionOutcome !== "string") {
      throw new LearningValidationError("Missing or invalid decisionOutcome");
    }
    if (!input.expectedResult || typeof input.expectedResult !== "string") {
      throw new LearningValidationError("Missing or invalid expectedResult");
    }

    return {
      decisionId: String(input.decisionId),
      decisionLabel: String(input.decisionLabel),
      decisionOutcome: String(input.decisionOutcome),
      expectedResult: String(input.expectedResult),
      actualResult: String(input.actualResult || "PENDING"),
      confidence: Number(input.confidence) || 0,
      rationale: String(input.rationale || ""),
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

  extractFromDecisionEvent(payload: Record<string, unknown>): Record<string, unknown> {
    const decisionEntity =
      (payload.entity as Record<string, unknown> | undefined)?.decision as Record<string, unknown> | undefined;
    const decisionFlat = payload.decision as Record<string, unknown> | undefined;
    const decision = decisionEntity ?? decisionFlat ?? {};

    const id = String(decision.id || "");
    const alternatives = (decision.alternatives as Array<Record<string, unknown>>) || [];
    const selectedAlternativeId = String(decision.selectedAlternativeId || "");
    const selectedAlternative = alternatives.find((a) => a.id === selectedAlternativeId);

    return {
      decisionId: id,
      decisionLabel: String(decision.selectedLabel || selectedAlternative?.label || ""),
      decisionOutcome: `DECISION_MADE: ${decision.selectedLabel || selectedAlternative?.label || "Unknown"}`,
      expectedResult: String(selectedAlternative?.expectedOutcome || decision.rationale || ""),
      actualResult: "PENDING",
      confidence: Number(decision.confidence) || 0,
      rationale: String(decision.rationale || ""),
      businessId: String(decision.businessId || ""),
      timestamp: new Date().toISOString(),
    };
  }
}
