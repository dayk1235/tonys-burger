import type { ExecutionStage, ExecutionEntity } from "./ExecutionTypes";

export interface ExecutionSubscriber {
  onExecutionInitiated(executionId: string): Promise<void>;
  onExecutionStageChanged(executionId: string, from: ExecutionStage, to: ExecutionStage): Promise<void>;
  onExecutionCompleted(executionId: string): Promise<void>;
  onExecutionFailed(executionId: string): Promise<void>;
}

export interface ExecutionQuery {
  findById(id: string): Promise<ExecutionEntity | undefined>;
  findByPlanId(planId: string): Promise<ExecutionEntity[]>;
  findByStage(stage: ExecutionStage): Promise<ExecutionEntity[]>;
  findActive(): Promise<ExecutionEntity[]>;
  findArchived(): Promise<ExecutionEntity[]>;
  findAll(): Promise<ExecutionEntity[]>;
}

export interface ExecutionEngineMetrics {
  readonly totalExecutions: number;
  readonly completedExecutions: number;
  readonly failedExecutions: number;
  readonly cancelledExecutions: number;
  readonly averageDuration: string;
  readonly averageConfidence: number;
  readonly executionsByStage: Record<string, number>;
}
