export const PLANNING_ENGINE_NAME = "PlanningEngine";
export const PLANNING_ENGINE_CLASSIFICATION = "Planning";
export const PLANNING_ENGINE_CONTRACT_VERSION = "1.0.0";

export type PlanningStage =
  | "INITIATED"
  | "GOALS_DEFINED"
  | "STEPS_CREATED"
  | "RESOURCES_ALLOCATED"
  | "RISKS_EVALUATED"
  | "PLAN_READY"
  | "COMPLETED"
  | "FAILED";

export type PlanningOperation =
  | "INITIATE"
  | "DEFINE_GOALS"
  | "CREATE_STEPS"
  | "ALLOCATE_RESOURCES"
  | "EVALUATE_RISKS"
  | "BUILD_PLAN"
  | "COMPLETE"
  | "FAIL";

export interface PlanningInput {
  readonly recommendationId: string;
  readonly recommendationAction: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly scope: string;
  readonly timestamp: string;
}

export interface PlanningOperationResult {
  readonly success: boolean;
  readonly planId: string;
  readonly operation: PlanningOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
