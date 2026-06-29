import { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  DecisionInput,
  DecisionOperationResult,
  DecisionResult,
  DECISION_ENGINE_NAME,
} from "./DecisionTypes";
import { DECISION_EVENTS } from "./DecisionEvents";
import { DecisionMemory } from "./DecisionMemory";
import { DecisionEvaluator } from "./DecisionEvaluator";
import { DecisionLifecycle } from "./DecisionLifecycle";
import { DecisionMetrics } from "./DecisionMetrics";

export class DecisionPipeline {
  readonly memory: DecisionMemory;
  readonly evaluator: DecisionEvaluator;
  readonly lifecycle: DecisionLifecycle;
  readonly metrics: DecisionMetrics;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.memory = new DecisionMemory();
    this.evaluator = new DecisionEvaluator();
    this.lifecycle = new DecisionLifecycle();
    this.metrics = new DecisionMetrics();
  }

  async initiateDecision(input: DecisionInput): Promise<DecisionOperationResult> {
    const proposalId = `dec-${input.reasoningId}`;

    const { evaluations, selectedAlternativeId, selectedLabel, bestScore } =
      this.evaluator.evaluateAlternatives(input.alternatives);

    const overallConfidence = this.evaluator.computeConfidence(input.confidence, bestScore);

    const rationale = this.evaluator.generateRationale(evaluations, selectedAlternativeId, selectedLabel);

    const now = new Date().toISOString();
    const decision: DecisionResult = {
      id: proposalId,
      reasoningId: input.reasoningId,
      stage: "PROPOSAL_BUILT",
      questionText: input.questionText,
      businessId: input.businessId,
      alternatives: [...input.alternatives],
      evaluations,
      selectedAlternativeId,
      selectedLabel,
      confidence: overallConfidence,
      rationale,
      reasoningConfidence: input.confidence,
      createdAt: now,
      updatedAt: now,
    };

    await this.memory.store(decision);

    this.metrics.recordCreated(input.alternatives.length, "PROPOSAL_BUILT");
    this.metrics.recordConfidence(overallConfidence);

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(DECISION_ENGINE_NAME, "decision_initiated", {
        proposalId,
        reasoningId: input.reasoningId,
        alternativesCount: input.alternatives.length,
        selectedAlternativeId,
        confidence: overallConfidence,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit(DECISION_EVENTS.LIFECYCLE_INITIATED, {
        entity: {
          decision: {
            id: proposalId,
            reasoningId: input.reasoningId,
            reasoningConclusion: input.reasoningConclusion,
            confidence: overallConfidence,
            alternatives: [...input.alternatives],
            businessId: input.businessId,
            questionText: input.questionText,
            urgency: input.urgency,
            evaluations: [...evaluations],
            selectedAlternativeId,
            rationale,
          },
        },
        decision: {
          id: proposalId,
          reasoningId: input.reasoningId,
          reasoningConclusion: input.reasoningConclusion,
          confidence: overallConfidence,
          alternatives: [...input.alternatives],
          businessId: input.businessId,
          questionText: input.questionText,
          urgency: input.urgency,
          evaluations: [...evaluations],
          selectedAlternativeId,
          rationale,
        },
        operation: "INITIATE",
        timestamp: now,
        version: 1,
      });
    }

    return {
      success: true,
      proposalId,
      operation: "INITIATE",
      timestamp: now,
      details: `Decision created from reasoning "${input.reasoningId}" — selected "${selectedLabel}" (confidence: ${overallConfidence.toFixed(3)})`,
      metadata: {
        reasoningId: input.reasoningId,
        alternativesCount: input.alternatives.length,
        selectedAlternativeId,
        confidence: overallConfidence,
        urgency: input.urgency,
      },
      selectedAlternativeId,
      confidence: overallConfidence,
      rationale,
    };
  }
}
