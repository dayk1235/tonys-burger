import { KnowledgeEventPayload } from "./KnowledgeTypes";

export const KNOWLEDGE_EVENT_NAMESPACE = "knowledge";

export const KNOWLEDGE_EVENTS = {
  LIFECYCLE_CANDIDATE_CREATED: "knowledge.lifecycle.candidate_created",
  LIFECYCLE_EXTRACTED: "knowledge.lifecycle.extracted",
  LIFECYCLE_STRUCTURED: "knowledge.lifecycle.structured",
  LIFECYCLE_VALIDATED: "knowledge.lifecycle.validated",
  LIFECYCLE_GENERALIZED: "knowledge.lifecycle.generalized",
  LIFECYCLE_SPECIALIZED: "knowledge.lifecycle.specialized",
  LIFECYCLE_SEMANTIC: "knowledge.lifecycle.semantic",
  LIFECYCLE_CANONICAL: "knowledge.lifecycle.canonical",
  LIFECYCLE_HISTORICAL: "knowledge.lifecycle.historical",
  LIFECYCLE_ARCHIVED: "knowledge.lifecycle.archived",
  OPERATION_EXTRACTED: "knowledge.operation.extracted",
  OPERATION_GENERALIZED: "knowledge.operation.generalized",
  OPERATION_SPECIALIZED: "knowledge.operation.specialized",
  OPERATION_LINKED: "knowledge.operation.linked",
  OPERATION_MERGED: "knowledge.operation.merged",
  OPERATION_VALIDATED: "knowledge.operation.validated",
  OPERATION_DEPRECATED: "knowledge.operation.deprecated",
  OPERATION_EXPANDED: "knowledge.operation.expanded",
  METRICS_UPDATED: "knowledge.metrics.updated",
} as const;

export type KnowledgeEventName = (typeof KNOWLEDGE_EVENTS)[keyof typeof KNOWLEDGE_EVENTS];

export interface KnowledgeEventEnvelope {
  readonly eventName: KnowledgeEventName;
  readonly timestamp: string;
  readonly source: string;
  readonly payload: KnowledgeEventPayload;
  readonly metadata?: Record<string, unknown>;
}

export function createKnowledgeEventEnvelope(
  eventName: KnowledgeEventName,
  source: string,
  payload: KnowledgeEventPayload,
  metadata?: Record<string, unknown>
): KnowledgeEventEnvelope {
  return {
    eventName,
    timestamp: new Date().toISOString(),
    source,
    payload,
    metadata,
  };
}

export function getKnowledgeLifecycleEventName(stage: string): KnowledgeEventName | undefined {
  const map: Record<string, KnowledgeEventName> = {
    CANDIDATE: KNOWLEDGE_EVENTS.LIFECYCLE_CANDIDATE_CREATED,
    EXTRACTED: KNOWLEDGE_EVENTS.LIFECYCLE_EXTRACTED,
    STRUCTURED: KNOWLEDGE_EVENTS.LIFECYCLE_STRUCTURED,
    VALIDATED: KNOWLEDGE_EVENTS.LIFECYCLE_VALIDATED,
    GENERALIZED: KNOWLEDGE_EVENTS.LIFECYCLE_GENERALIZED,
    SPECIALIZED: KNOWLEDGE_EVENTS.LIFECYCLE_SPECIALIZED,
    SEMANTIC: KNOWLEDGE_EVENTS.LIFECYCLE_SEMANTIC,
    CANONICAL: KNOWLEDGE_EVENTS.LIFECYCLE_CANONICAL,
    HISTORICAL: KNOWLEDGE_EVENTS.LIFECYCLE_HISTORICAL,
    ARCHIVED: KNOWLEDGE_EVENTS.LIFECYCLE_ARCHIVED,
  };
  return map[stage];
}

export function getKnowledgeOperationEventName(operation: string): KnowledgeEventName | undefined {
  const map: Record<string, KnowledgeEventName> = {
    EXTRACT: KNOWLEDGE_EVENTS.OPERATION_EXTRACTED,
    GENERALIZE: KNOWLEDGE_EVENTS.OPERATION_GENERALIZED,
    SPECIALIZE: KNOWLEDGE_EVENTS.OPERATION_SPECIALIZED,
    LINK: KNOWLEDGE_EVENTS.OPERATION_LINKED,
    MERGE: KNOWLEDGE_EVENTS.OPERATION_MERGED,
    VALIDATE: KNOWLEDGE_EVENTS.OPERATION_VALIDATED,
    DEPRECATE: KNOWLEDGE_EVENTS.OPERATION_DEPRECATED,
    EXPAND: KNOWLEDGE_EVENTS.OPERATION_EXPANDED,
  };
  return map[operation];
}
