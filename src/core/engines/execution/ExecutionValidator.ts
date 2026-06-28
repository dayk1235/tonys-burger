import { ExecutionInput, ExecutionOperationResult } from "./ExecutionTypes";
import { ExecutionValidationError } from "./ExecutionErrors";

export class ExecutionValidator {
  validateInput(input: Record<string, unknown>): ExecutionInput {
    if (!input.planId || typeof input.planId !== "string") {
      throw new ExecutionValidationError("Missing or invalid planId");
    }
    if (!input.planSummary || typeof input.planSummary !== "string") {
      throw new ExecutionValidationError("Missing or invalid planSummary");
    }
    if (typeof input.stepCount !== "number" || (input.stepCount as number) < 1) {
      throw new ExecutionValidationError("Missing or invalid stepCount — must be >= 1");
    }

    return {
      planId: String(input.planId),
      planSummary: String(input.planSummary),
      confidence: Number(input.confidence) || 0,
      businessId: String(input.businessId || ""),
      stepCount: Number(input.stepCount) || 1,
      timestamp: String(input.timestamp || new Date().toISOString()),
    };
  }

  validateResult(result: unknown): ExecutionOperationResult {
    if (!result || typeof result !== "object") {
      throw new ExecutionValidationError("Invalid operation result");
    }
    return result as ExecutionOperationResult;
  }
}
