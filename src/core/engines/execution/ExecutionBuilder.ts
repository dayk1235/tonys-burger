import {
  ExecutionInput,
  ExecutionEntity,
  ExecutionStage,
  ExecutionStepResult,
} from "./ExecutionTypes";

export class ExecutionBuilder {
  buildFromPlan(input: ExecutionInput): ExecutionEntity {
    const id = `exec-${input.planId}`;
    const now = input.timestamp;

    return {
      id,
      planId: input.planId,
      stage: "INITIATED",
      executionSteps: [...input.executionSteps],
      stepResults: [],
      completedSteps: 0,
      failedSteps: 0,
      skippedSteps: 0,
      startedAt: "",
      completedAt: "",
      duration: "",
      executionReport: "",
      confidence: input.confidence,
      businessId: input.businessId,
      createdAt: now,
      updatedAt: now,
    };
  }

  advanceStage(entity: ExecutionEntity, newStage: ExecutionStage): ExecutionEntity {
    return {
      ...entity,
      stage: newStage,
      updatedAt: new Date().toISOString(),
    };
  }

  applyResults(
    entity: ExecutionEntity,
    stepResults: readonly ExecutionStepResult[],
    startedAt: string,
    completedAt: string,
    duration: string,
    executionReport: string,
  ): ExecutionEntity {
    return {
      ...entity,
      stepResults: [...stepResults],
      completedSteps: stepResults.filter((s) => s.status === "COMPLETED").length,
      failedSteps: stepResults.filter((s) => s.status === "FAILED").length,
      skippedSteps: stepResults.filter((s) => s.status === "SKIPPED").length,
      startedAt,
      completedAt,
      duration,
      executionReport,
      updatedAt: new Date().toISOString(),
    };
  }
}
