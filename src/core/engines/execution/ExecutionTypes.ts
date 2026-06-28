export const EXECUTION_ENGINE_NAME = "ExecutionEngine";
export const EXECUTION_ENGINE_CLASSIFICATION = "Execution";
export const EXECUTION_ENGINE_CONTRACT_VERSION = "1.0.0";

export type ExecutionStage =
  | "INITIATED"
  | "PLAN_VALIDATED"
  | "ACTIONS_DISPATCHED"
  | "PROGRESS_MONITORED"
  | "COMPLETED"
  | "FAILED"
  | "ROLLED_BACK";

export type ExecutionOperation =
  | "INITIATE"
  | "VALIDATE_PLAN"
  | "DISPATCH_ACTIONS"
  | "MONITOR_PROGRESS"
  | "COMPLETE"
  | "FAIL"
  | "ROLLBACK";

export interface ExecutionInput {
  readonly planId: string;
  readonly planSummary: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly stepCount: number;
  readonly timestamp: string;
}

export interface ExecutionOperationResult {
  readonly success: boolean;
  readonly executionId: string;
  readonly operation: ExecutionOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
