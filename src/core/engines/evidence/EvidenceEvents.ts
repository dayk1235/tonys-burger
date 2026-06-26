import { EvidenceEventPayload } from "./EvidenceTypes";

export const EVIDENCE_EVENT_NAMESPACE = "evidence";

export const EVIDENCE_EVENTS = {
  LIFECYCLE_CANDIDATE_CREATED: "evidence.lifecycle.candidate_created",
  LIFECYCLE_COLLECTING_STARTED: "evidence.lifecycle.collecting_started",
  LIFECYCLE_SUPPORTING_ESTABLISHED: "evidence.lifecycle.supporting_established",
  LIFECYCLE_CONFLICTING_DETECTED: "evidence.lifecycle.conflicting_detected",
  LIFECYCLE_WEIGHTED_CALCULATED: "evidence.lifecycle.weighted_calculated",
  LIFECYCLE_VALIDATED_CONFIRMED: "evidence.lifecycle.validated_confirmed",
  LIFECYCLE_REJECTED: "evidence.lifecycle.rejected",
  LIFECYCLE_HISTORICAL_ARCHIVED: "evidence.lifecycle.historical_archived",
  LIFECYCLE_ARCHIVED: "evidence.lifecycle.archived",
  EVALUATION_STARTED: "evidence.evaluation.started",
  EVALUATION_COMPLETED: "evidence.evaluation.completed",
  EVALUATION_FAILED: "evidence.evaluation.failed",
  CONTRADICTION_DETECTED: "evidence.contradiction.detected",
  CONTRADICTION_RESOLVED: "evidence.contradiction.resolved",
  RELATIONSHIP_DISCOVERED: "evidence.relationship.discovered",
  METRICS_UPDATED: "evidence.metrics.updated",
} as const;

export type EvidenceEventName = (typeof EVIDENCE_EVENTS)[keyof typeof EVIDENCE_EVENTS];

export interface EvidenceEventEnvelope {
  readonly eventName: EvidenceEventName;
  readonly timestamp: string;
  readonly source: string;
  readonly payload: EvidenceEventPayload;
  readonly metadata?: Record<string, unknown>;
}

export function createEvidenceEventEnvelope(
  eventName: EvidenceEventName,
  source: string,
  payload: EvidenceEventPayload,
  metadata?: Record<string, unknown>
): EvidenceEventEnvelope {
  return {
    eventName,
    timestamp: new Date().toISOString(),
    source,
    payload,
    metadata,
  };
}

export function getLifecycleEventName(stage: string): EvidenceEventName | undefined {
  const map: Record<string, EvidenceEventName> = {
    CANDIDATE: EVIDENCE_EVENTS.LIFECYCLE_CANDIDATE_CREATED,
    COLLECTING: EVIDENCE_EVENTS.LIFECYCLE_COLLECTING_STARTED,
    SUPPORTING: EVIDENCE_EVENTS.LIFECYCLE_SUPPORTING_ESTABLISHED,
    CONFLICTING: EVIDENCE_EVENTS.LIFECYCLE_CONFLICTING_DETECTED,
    WEIGHTED: EVIDENCE_EVENTS.LIFECYCLE_WEIGHTED_CALCULATED,
    VALIDATED: EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED,
    REJECTED: EVIDENCE_EVENTS.LIFECYCLE_REJECTED,
    HISTORICAL: EVIDENCE_EVENTS.LIFECYCLE_HISTORICAL_ARCHIVED,
    ARCHIVED: EVIDENCE_EVENTS.LIFECYCLE_ARCHIVED,
  };
  return map[stage];
}
