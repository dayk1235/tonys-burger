import type { ExecutionStage } from "./ExecutionTypes";

export interface ExecutionSubscriber {
  onExecutionInitiated(executionId: string): Promise<void>;
  onExecutionStageChanged(executionId: string, from: ExecutionStage, to: ExecutionStage): Promise<void>;
  onExecutionCompleted(executionId: string): Promise<void>;
  onExecutionFailed(executionId: string): Promise<void>;
  onExecutionRolledBack(executionId: string): Promise<void>;
}

export interface ExecutionQuery {
  findById(id: string): Promise<unknown>;
  findActive(): Promise<unknown[]>;
  findByPlanId(planId: string): Promise<unknown[]>;
}

export interface ExecutionEngineMetrics {
  readonly totalExecutions: number;
  readonly completedExecutions: number;
  readonly failedExecutions: number;
  readonly activeExecutions: number;
  readonly rolledBackExecutions: number;
  readonly averageConfidence: number;
}
