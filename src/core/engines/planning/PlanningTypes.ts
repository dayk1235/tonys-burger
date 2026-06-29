export const PLANNING_ENGINE_NAME = "PlanningEngine";
export const PLANNING_ENGINE_CLASSIFICATION = "Planning";
export const PLANNING_ENGINE_CONTRACT_VERSION = "1.1.0";

export type PlanningStage =
  | "INITIATED"
  | "ANALYZED"
  | "PLAN_GENERATED"
  | "OPTIMIZED"
  | "VALIDATED"
  | "READY"
  | "COMPLETED"
  | "FAILED"
  | "ARCHIVED";

export type PlanningOperation =
  | "INITIATE"
  | "ANALYZE"
  | "GENERATE_PLAN"
  | "OPTIMIZE"
  | "VALIDATE"
  | "BUILD"
  | "COMPLETE"
  | "FAIL"
  | "ARCHIVE";

export type ExecutionStepStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "SKIPPED";

export interface ExecutionStep {
  readonly id: string;
  readonly order: number;
  readonly action: string;
  readonly description: string;
  readonly estimatedDuration: string;
  readonly requiredResources: readonly string[];
  readonly status: ExecutionStepStatus;
}

export interface PlanningInput {
  readonly recommendationId: string;
  readonly recommendationAction: string;
  readonly priority: string;
  readonly expectedBenefit: string;
  readonly expectedRisk: string;
  readonly explanation: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly scope: string;
  readonly supportingEvidence: {
    readonly learningId: string;
    readonly learnedPattern: string;
    readonly rationale: string;
    readonly expectedResult: string;
    readonly confidence: number;
  };
  readonly forecast: {
    readonly outcome: string;
    readonly probability: number;
    readonly factors: readonly string[];
  };
  readonly timestamp: string;
}

export interface PlanningEntity {
  readonly id: string;
  readonly recommendationId: string;
  readonly stage: PlanningStage;
  readonly executionSteps: readonly ExecutionStep[];
  readonly estimatedDuration: string;
  readonly requiredResources: readonly string[];
  readonly dependencies: readonly string[];
  readonly rollbackStrategy: string;
  readonly expectedOutcome: string;
  readonly executionPriority: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PlanningOperationResult {
  readonly success: boolean;
  readonly planId: string;
  readonly operation: PlanningOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
