import { ExecutionInput, ExecutionOperationResult, ExecutionStep } from "./ExecutionTypes";
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

    const steps = (input.executionSteps as unknown[]) ?? [];
    if (!Array.isArray(steps) || steps.length === 0) {
      throw new ExecutionValidationError("Missing or empty executionSteps");
    }

    return {
      planId: String(input.planId),
      planSummary: String(input.planSummary),
      executionSteps: steps.map((s) => {
        const step = s as Record<string, unknown>;
        return {
          id: String(step.id || ""),
          order: Number(step.order) || 0,
          action: String(step.action || ""),
          description: String(step.description || ""),
          estimatedDuration: String(step.estimatedDuration || ""),
          requiredResources: Array.isArray(step.requiredResources)
            ? (step.requiredResources as string[])
            : [],
          status: "PENDING",
        } as ExecutionStep;
      }),
      expectedOutcome: String((input as Record<string, unknown>).expectedOutcome || input.planSummary || ""),
      rollbackStrategy: String((input as Record<string, unknown>).rollbackStrategy || ""),
      confidence: Number(input.confidence) || 0,
      businessId: String(input.businessId || ""),
      stepCount: Number(input.stepCount) || steps.length,
      timestamp: String(input.timestamp || new Date().toISOString()),
    };
  }

  validateResult(result: unknown): ExecutionOperationResult {
    if (!result || typeof result !== "object") {
      throw new ExecutionValidationError("Invalid operation result");
    }
    return result as ExecutionOperationResult;
  }

  extractFromPlanEvent(payload: Record<string, unknown>): Record<string, unknown> {
    const planEntity =
      (payload.entity as Record<string, unknown> | undefined)?.plan as Record<string, unknown> | undefined;
    const planFlat = payload.plan as Record<string, unknown> | undefined;
    const plan = planEntity ?? planFlat ?? {};

    const steps = Array.isArray(plan.executionSteps) ? plan.executionSteps : [];

    return {
      planId: String(plan.id || ""),
      planSummary: String(plan.expectedOutcome || plan.executionPriority || ""),
      executionSteps: steps,
      expectedOutcome: String(plan.expectedOutcome || ""),
      rollbackStrategy: String(plan.rollbackStrategy || ""),
      confidence: Number(plan.confidence) || 0,
      businessId: String(plan.businessId || ""),
      stepCount: steps.length,
      timestamp: new Date().toISOString(),
    };
  }
}
