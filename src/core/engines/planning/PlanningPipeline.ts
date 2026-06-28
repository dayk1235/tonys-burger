import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  PlanningInput,
  PlanningOperationResult,
  PLANNING_ENGINE_NAME,
} from "./PlanningTypes";

export class PlanningPipeline {
  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {}

  async initiatePlan(input: PlanningInput): Promise<PlanningOperationResult> {
    const planId = `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(PLANNING_ENGINE_NAME, "plan_initiated", {
        planId,
        recommendationId: input.recommendationId,
        scope: input.scope,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit("planning.lifecycle.initiated", {
        planId,
        recommendationId: input.recommendationId,
        recommendationAction: input.recommendationAction,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      planId,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Plan initiated from recommendation "${input.recommendationId}" (scope: ${input.scope})`,
      metadata: {
        recommendationId: input.recommendationId,
        recommendationAction: input.recommendationAction,
        confidence: input.confidence,
        scope: input.scope,
      },
    };
  }
}
