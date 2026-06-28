import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  ExecutionInput,
  ExecutionOperationResult,
  EXECUTION_ENGINE_NAME,
} from "./ExecutionTypes";

export class ExecutionPipeline {
  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {}

  async initiateExecution(input: ExecutionInput): Promise<ExecutionOperationResult> {
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(EXECUTION_ENGINE_NAME, "execution_initiated", {
        executionId,
        planId: input.planId,
        stepCount: input.stepCount,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit("execution.lifecycle.initiated", {
        executionId,
        planId: input.planId,
        planSummary: input.planSummary,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      executionId,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Execution initiated for plan "${input.planId}" (${input.stepCount} steps)`,
      metadata: {
        planId: input.planId,
        planSummary: input.planSummary,
        confidence: input.confidence,
        stepCount: input.stepCount,
      },
    };
  }
}
