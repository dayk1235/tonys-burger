import {
  PlanningInput,
  PlanningEntity,
  PlanningStage,
  ExecutionStep,
} from "./PlanningTypes";

export class PlanningBuilder {
  buildFromRecommendation(
    input: PlanningInput,
    steps: readonly ExecutionStep[],
    estimatedDuration: string,
    requiredResources: readonly string[],
    dependencies: readonly string[],
    rollbackStrategy: string,
  ): PlanningEntity {
    const id = `plan-${input.recommendationId}`;
    const now = input.timestamp;

    return {
      id,
      recommendationId: input.recommendationId,
      stage: "COMPLETED",
      executionSteps: [...steps],
      estimatedDuration,
      requiredResources: [...requiredResources],
      dependencies: [...dependencies],
      rollbackStrategy,
      expectedOutcome: input.expectedBenefit || input.recommendationAction,
      executionPriority: input.priority,
      confidence: input.confidence,
      businessId: input.businessId,
      createdAt: now,
      updatedAt: now,
    };
  }

  advanceStage(entity: PlanningEntity, newStage: PlanningStage): PlanningEntity {
    return {
      ...entity,
      stage: newStage,
      updatedAt: new Date().toISOString(),
    };
  }
}
