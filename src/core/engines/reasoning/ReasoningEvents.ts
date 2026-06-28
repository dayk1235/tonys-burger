import { ReasoningEventPayload } from "./ReasoningTypes";

export const REASONING_EVENT_NAMESPACE = "reasoning";

export const REASONING_EVENTS = {
  LIFECYCLE_CANDIDATE: "reasoning.lifecycle.candidate",
  LIFECYCLE_ACTIVATED: "reasoning.lifecycle.activated",
  LIFECYCLE_CONTEXT_BUILDING: "reasoning.lifecycle.context_building",
  LIFECYCLE_INFORMATION_GAP_DETECTION: "reasoning.lifecycle.information_gap_detection",
  LIFECYCLE_EVIDENCE_GATHERING: "reasoning.lifecycle.evidence_gathering",
  LIFECYCLE_KNOWLEDGE_RETRIEVAL: "reasoning.lifecycle.knowledge_retrieval",
  LIFECYCLE_HYPOTHESIS_GENERATION: "reasoning.lifecycle.hypothesis_generation",
  LIFECYCLE_ALTERNATIVE_GENERATION: "reasoning.lifecycle.alternative_generation",
  LIFECYCLE_CONSTRAINT_EVALUATION: "reasoning.lifecycle.constraint_evaluation",
  LIFECYCLE_TRADEOFF_EVALUATION: "reasoning.lifecycle.tradeoff_evaluation",
  LIFECYCLE_CONSISTENCY_CHECKING: "reasoning.lifecycle.consistency_checking",
  LIFECYCLE_CONFIDENCE_ASSESSMENT: "reasoning.lifecycle.confidence_assessment",
  LIFECYCLE_CONFIDENCE_EXPLANATION: "reasoning.lifecycle.confidence_explanation",
  LIFECYCLE_CONCLUSION_BUILDING: "reasoning.lifecycle.conclusion_building",
  LIFECYCLE_COMPLETED: "reasoning.lifecycle.completed",
  LIFECYCLE_ARCHIVED: "reasoning.lifecycle.archived",
  LIFECYCLE_RETIRED: "reasoning.lifecycle.retired",
  OPERATION_HYPOTHESIS_GENERATED: "reasoning.operation.hypothesis_generated",
  OPERATION_HYPOTHESIS_WEAKENED: "reasoning.operation.hypothesis_weakened",
  OPERATION_HYPOTHESIS_REJECTED: "reasoning.operation.hypothesis_rejected",
  OPERATION_ALTERNATIVE_GENERATED: "reasoning.operation.alternative_generated",
  OPERATION_ALTERNATIVE_DISCARDED: "reasoning.operation.alternative_discarded",
  OPERATION_CONSTRAINT_VIOLATED: "reasoning.operation.constraint_violated",
  OPERATION_INFERENCE_PERFORMED: "reasoning.operation.inference_performed",
  OPERATION_CONCLUSION_BUILT: "reasoning.operation.conclusion_built",
  METRICS_UPDATED: "reasoning.metrics.updated",
} as const;

export type ReasoningEventName = (typeof REASONING_EVENTS)[keyof typeof REASONING_EVENTS];

export interface ReasoningEventEnvelope {
  readonly eventName: ReasoningEventName;
  readonly timestamp: string;
  readonly source: string;
  readonly payload: ReasoningEventPayload;
  readonly metadata?: Record<string, unknown>;
}

export function createReasoningEventEnvelope(
  eventName: ReasoningEventName,
  source: string,
  payload: ReasoningEventPayload,
  metadata?: Record<string, unknown>
): ReasoningEventEnvelope {
  return {
    eventName,
    timestamp: new Date().toISOString(),
    source,
    payload,
    metadata,
  };
}

export function getReasoningLifecycleEventName(stage: string): ReasoningEventName | undefined {
  const map: Record<string, ReasoningEventName> = {
    CANDIDATE: REASONING_EVENTS.LIFECYCLE_CANDIDATE,
    ACTIVATED: REASONING_EVENTS.LIFECYCLE_ACTIVATED,
    CONTEXT_BUILDING: REASONING_EVENTS.LIFECYCLE_CONTEXT_BUILDING,
    INFORMATION_GAP_DETECTION: REASONING_EVENTS.LIFECYCLE_INFORMATION_GAP_DETECTION,
    EVIDENCE_GATHERING: REASONING_EVENTS.LIFECYCLE_EVIDENCE_GATHERING,
    KNOWLEDGE_RETRIEVAL: REASONING_EVENTS.LIFECYCLE_KNOWLEDGE_RETRIEVAL,
    HYPOTHESIS_GENERATION: REASONING_EVENTS.LIFECYCLE_HYPOTHESIS_GENERATION,
    ALTERNATIVE_GENERATION: REASONING_EVENTS.LIFECYCLE_ALTERNATIVE_GENERATION,
    CONSTRAINT_EVALUATION: REASONING_EVENTS.LIFECYCLE_CONSTRAINT_EVALUATION,
    TRADEOFF_EVALUATION: REASONING_EVENTS.LIFECYCLE_TRADEOFF_EVALUATION,
    CONSISTENCY_CHECKING: REASONING_EVENTS.LIFECYCLE_CONSISTENCY_CHECKING,
    CONFIDENCE_ASSESSMENT: REASONING_EVENTS.LIFECYCLE_CONFIDENCE_ASSESSMENT,
    CONFIDENCE_EXPLANATION: REASONING_EVENTS.LIFECYCLE_CONFIDENCE_EXPLANATION,
    CONCLUSION_BUILDING: REASONING_EVENTS.LIFECYCLE_CONCLUSION_BUILDING,
    COMPLETED: REASONING_EVENTS.LIFECYCLE_COMPLETED,
    ARCHIVED: REASONING_EVENTS.LIFECYCLE_ARCHIVED,
    RETIRED: REASONING_EVENTS.LIFECYCLE_RETIRED,
  };
  return map[stage];
}
