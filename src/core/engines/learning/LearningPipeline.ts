import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  LearningInput,
  LearningOperationResult,
  LEARNING_ENGINE_NAME,
} from "./LearningTypes";

export class LearningPipeline {
  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {}

  async initiateLearning(input: LearningInput): Promise<LearningOperationResult> {
    const learningId = `learn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(LEARNING_ENGINE_NAME, "learning_initiated", {
        learningId,
        decisionId: input.decisionId,
        outcome: input.decisionOutcome,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit("learning.lifecycle.initiated", {
        learningId,
        decisionId: input.decisionId,
        decisionOutcome: input.decisionOutcome,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      learningId,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Learning cycle initiated for decision "${input.decisionId}" (outcome: ${input.decisionOutcome})`,
      metadata: {
        decisionId: input.decisionId,
        decisionOutcome: input.decisionOutcome,
        confidence: input.confidence,
      },
    };
  }
}
