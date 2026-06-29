export const EXECUTION_ENGINE_NAME = "ExecutionEngine";
export const EXECUTION_ENGINE_CLASSIFICATION = "Execution";
export const EXECUTION_ENGINE_CONTRACT_VERSION = "1.1.0";

export type ExecutionStage =
  | "INITIATED"
  | "QUEUED"
  | "PREPARING"
  | "RUNNING"
  | "VERIFYING"
  | "COMPLETED"
  | "ARCHIVED"
  | "FAILED"
  | "CANCELLED";

export type ExecutionOperation =
  | "INITIATE"
  | "QUEUE"
  | "PREPARE"
  | "RUN"
  | "VERIFY"
  | "COMPLETE"
  | "ARCHIVE"
  | "FAIL"
  | "CANCEL";

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

export interface ExecutionStepResult {
  readonly stepId: string;
  readonly action: string;
  readonly status: ExecutionStepStatus;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly duration: string;
  readonly message: string;
}

export interface ExecutionInput {
  readonly planId: string;
  readonly planSummary: string;
  readonly executionSteps: readonly ExecutionStep[];
  readonly expectedOutcome: string;
  readonly rollbackStrategy: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly stepCount: number;
  readonly timestamp: string;
}

export interface ExecutionEntity {
  readonly id: string;
  readonly planId: string;
  readonly stage: ExecutionStage;
  readonly executionSteps: readonly ExecutionStep[];
  readonly stepResults: readonly ExecutionStepResult[];
  readonly completedSteps: number;
  readonly failedSteps: number;
  readonly skippedSteps: number;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly duration: string;
  readonly executionReport: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ExecutionOperationResult {
  readonly success: boolean;
  readonly executionId: string;
  readonly operation: ExecutionOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
