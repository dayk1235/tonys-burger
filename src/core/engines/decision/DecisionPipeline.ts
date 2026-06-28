import { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  DecisionInput,
  DecisionOperationResult,
  DECISION_ENGINE_NAME,
} from "./DecisionTypes";
import { DECISION_EVENTS } from "./DecisionEvents";

export class DecisionPipeline {
  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {}

  async initiateDecision(input: DecisionInput): Promise<DecisionOperationResult> {
    const proposalId = `dec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(DECISION_ENGINE_NAME, "decision_initiated", {
        proposalId,
        reasoningId: input.reasoningId,
        alternativesCount: input.alternatives.length,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit(DECISION_EVENTS.LIFECYCLE_INITIATED, {
        decision: {
          id: proposalId,
          reasoningId: input.reasoningId,
          reasoningConclusion: input.reasoningConclusion,
          confidence: input.confidence,
          alternatives: [...input.alternatives],
          businessId: input.businessId,
          questionText: input.questionText,
          urgency: input.urgency,
        },
        operation: "INITIATE",
        timestamp: new Date().toISOString(),
        version: 1,
      });
    }

    return {
      success: true,
      proposalId,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Decision proposal created from reasoning "${input.reasoningId}" with ${input.alternatives.length} alternatives`,
      metadata: {
        reasoningId: input.reasoningId,
        alternativesCount: input.alternatives.length,
        confidence: input.confidence,
        urgency: input.urgency,
      },
    };
  }
}
