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
    if (!input.scope || typeof input.scope !== "string") {
      throw new PlanningValidationError("Missing or invalid scope");
    }

    return {
      recommendationId: String(input.recommendationId),
      recommendationAction: String(input.recommendationAction),
      confidence: Number(input.confidence) || 0,
      businessId: String(input.businessId || ""),
      scope: String(input.scope),
      timestamp: String(input.timestamp || new Date().toISOString()),
    };
  }

  validateResult(result: unknown): PlanningOperationResult {
    if (!result || typeof result !== "object") {
      throw new PlanningValidationError("Invalid operation result");
    }
    return result as PlanningOperationResult;
  }
}
