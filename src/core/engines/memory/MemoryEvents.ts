import { MemoryEventPayload } from "./MemoryTypes";

export const MEMORY_EVENT_NAMESPACE = "memory";

export const MEMORY_EVENTS = {
  LIFECYCLE_WORKING_CREATED: "memory.lifecycle.working_created",
  LIFECYCLE_CANDIDATE_PROMOTED: "memory.lifecycle.candidate_promoted",
  LIFECYCLE_SHORT_TERM_ESTABLISHED: "memory.lifecycle.short_term_established",
  LIFECYCLE_STABILIZING_STARTED: "memory.lifecycle.stabilizing_started",
  LIFECYCLE_CONSOLIDATED: "memory.lifecycle.consolidated",
  LIFECYCLE_LONG_TERM_PROMOTED: "memory.lifecycle.long_term_promoted",
  LIFECYCLE_SEMANTIC_ESTABLISHED: "memory.lifecycle.semantic_established",
  LIFECYCLE_HISTORICAL_ARCHIVED: "memory.lifecycle.historical_archived",
  LIFECYCLE_ARCHIVED: "memory.lifecycle.archived",
  OPERATION_CREATED: "memory.operation.created",
  OPERATION_CONSOLIDATED: "memory.operation.consolidated",
  OPERATION_STRENGTHENED: "memory.operation.strengthened",
  OPERATION_WEAKENED: "memory.operation.weakened",
  OPERATION_FORGOTTEN: "memory.operation.forgotten",
  OPERATION_ARCHIVED: "memory.operation.archived",
  OPERATION_COMPRESSED: "memory.operation.compressed",
  OPERATION_MERGED: "memory.operation.merged",
  OPERATION_REACTIVATED: "memory.operation.reactivated",
  OPERATION_ASSOCIATED: "memory.operation.associated",
  OPERATION_DETACHED: "memory.operation.detached",
  METRICS_UPDATED: "memory.metrics.updated",
} as const;

export type MemoryEventName = (typeof MEMORY_EVENTS)[keyof typeof MEMORY_EVENTS];

export interface MemoryEventEnvelope {
  readonly eventName: MemoryEventName;
  readonly timestamp: string;
  readonly source: string;
  readonly payload: MemoryEventPayload;
  readonly metadata?: Record<string, unknown>;
}

export function createMemoryEventEnvelope(
  eventName: MemoryEventName,
  source: string,
  payload: MemoryEventPayload,
  metadata?: Record<string, unknown>
): MemoryEventEnvelope {
  return {
    eventName,
    timestamp: new Date().toISOString(),
    source,
    payload,
    metadata,
  };
}

export function getMemoryLifecycleEventName(stage: string): MemoryEventName | undefined {
  const map: Record<string, MemoryEventName> = {
    WORKING: MEMORY_EVENTS.LIFECYCLE_WORKING_CREATED,
    CANDIDATE: MEMORY_EVENTS.LIFECYCLE_CANDIDATE_PROMOTED,
    SHORT_TERM: MEMORY_EVENTS.LIFECYCLE_SHORT_TERM_ESTABLISHED,
    STABILIZING: MEMORY_EVENTS.LIFECYCLE_STABILIZING_STARTED,
    CONSOLIDATED: MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED,
    LONG_TERM: MEMORY_EVENTS.LIFECYCLE_LONG_TERM_PROMOTED,
    SEMANTIC: MEMORY_EVENTS.LIFECYCLE_SEMANTIC_ESTABLISHED,
    HISTORICAL: MEMORY_EVENTS.LIFECYCLE_HISTORICAL_ARCHIVED,
    ARCHIVED: MEMORY_EVENTS.LIFECYCLE_ARCHIVED,
  };
  return map[stage];
}

export function getMemoryOperationEventName(operation: string): MemoryEventName | undefined {
  const map: Record<string, MemoryEventName> = {
    CREATE: MEMORY_EVENTS.LIFECYCLE_WORKING_CREATED,
    CONSOLIDATE: MEMORY_EVENTS.OPERATION_CONSOLIDATED,
    STRENGTHEN: MEMORY_EVENTS.OPERATION_STRENGTHENED,
    WEAKEN: MEMORY_EVENTS.OPERATION_WEAKENED,
    FORGET: MEMORY_EVENTS.OPERATION_FORGOTTEN,
    ARCHIVE: MEMORY_EVENTS.OPERATION_ARCHIVED,
    COMPRESS: MEMORY_EVENTS.OPERATION_COMPRESSED,
    MERGE: MEMORY_EVENTS.OPERATION_MERGED,
    REACTIVATE: MEMORY_EVENTS.OPERATION_REACTIVATED,
    ASSOCIATE: MEMORY_EVENTS.OPERATION_ASSOCIATED,
    DETACH: MEMORY_EVENTS.OPERATION_DETACHED,
  };
  return map[operation];
}
