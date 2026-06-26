import { AttentionEventPayload } from "./AttentionTypes";

export const ATTENTION_EVENT_NAMESPACE = "attention";

export const ATTENTION_EVENTS = {
  LIFECYCLE_CANDIDATE: "attention.lifecycle.candidate",
  LIFECYCLE_OBSERVED: "attention.lifecycle.observed",
  LIFECYCLE_SCORED: "attention.lifecycle.scored",
  LIFECYCLE_QUEUED: "attention.lifecycle.queued",
  LIFECYCLE_FOCUSED: "attention.lifecycle.focused",
  LIFECYCLE_MAINTAINED: "attention.lifecycle.maintained",
  LIFECYCLE_INTERRUPTED: "attention.lifecycle.interrupted",
  LIFECYCLE_DEFERRED: "attention.lifecycle.deferred",
  LIFECYCLE_RELEASED: "attention.lifecycle.released",
  LIFECYCLE_ARCHIVED: "attention.lifecycle.archived",
  OPERATION_PRIORITIZED: "attention.operation.prioritized",
  OPERATION_FOCUSED: "attention.operation.focused",
  OPERATION_DEFOCUSED: "attention.operation.defocused",
  OPERATION_INTERRUPTED: "attention.operation.interrupted",
  OPERATION_ESCALATED: "attention.operation.escalated",
  OPERATION_SUSPENDED: "attention.operation.suspended",
  OPERATION_RESUMED: "attention.operation.resumed",
  OPERATION_ALLOCATED: "attention.operation.allocated",
  OPERATION_RELEASED: "attention.operation.released",
  OPERATION_EXPIRED: "attention.operation.expired",
  OPERATION_STARVED: "attention.operation.starved",
  BUDGET_UPDATED: "attention.budget.updated",
  CONTEXT_CHANGED: "attention.context.changed",
  METRICS_UPDATED: "attention.metrics.updated",
} as const;

export type AttentionEventName = (typeof ATTENTION_EVENTS)[keyof typeof ATTENTION_EVENTS];

export interface AttentionEventEnvelope {
  readonly eventName: AttentionEventName;
  readonly timestamp: string;
  readonly source: string;
  readonly payload: AttentionEventPayload;
  readonly metadata?: Record<string, unknown>;
}

export function createAttentionEventEnvelope(
  eventName: AttentionEventName,
  source: string,
  payload: AttentionEventPayload,
  metadata?: Record<string, unknown>
): AttentionEventEnvelope {
  return {
    eventName,
    timestamp: new Date().toISOString(),
    source,
    payload,
    metadata,
  };
}

export function getAttentionLifecycleEventName(stage: string): AttentionEventName | undefined {
  const map: Record<string, AttentionEventName> = {
    CANDIDATE: ATTENTION_EVENTS.LIFECYCLE_CANDIDATE,
    OBSERVED: ATTENTION_EVENTS.LIFECYCLE_OBSERVED,
    SCORED: ATTENTION_EVENTS.LIFECYCLE_SCORED,
    QUEUED: ATTENTION_EVENTS.LIFECYCLE_QUEUED,
    FOCUSED: ATTENTION_EVENTS.LIFECYCLE_FOCUSED,
    MAINTAINED: ATTENTION_EVENTS.LIFECYCLE_MAINTAINED,
    INTERRUPTED: ATTENTION_EVENTS.LIFECYCLE_INTERRUPTED,
    DEFERRED: ATTENTION_EVENTS.LIFECYCLE_DEFERRED,
    RELEASED: ATTENTION_EVENTS.LIFECYCLE_RELEASED,
    ARCHIVED: ATTENTION_EVENTS.LIFECYCLE_ARCHIVED,
  };
  return map[stage];
}
