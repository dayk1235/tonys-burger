/**
 * @file ObservationEvents.ts
 * @description Defines the events emitted by the Observation Engine as observations
 * progress through their lifecycle and operational states.
 */

import { Observation, ObservationStage } from "./ObservationTypes";

/**
 * Standard envelope for all events emitted by the Observation Engine.
 */
export interface ObservationEvent {
  readonly id: string;
  readonly eventName: string;
  readonly timestamp: string; // ISO 8601 event time
  readonly emitter: string; // E.g., "ObservationEngine"
  readonly payload: {
    observationId: string;
    stage: ObservationStage;
    data: Record<string, unknown>;
  };
}

/**
 * Event names constants list.
 */
export const ObservationEventNames = {
  POTENTIAL_DETECTED: "observation.lifecycle.potential_detected",
  CANDIDATE_VERIFIED: "observation.lifecycle.candidate_verified",
  CONTEXT_ASSIGNED: "observation.lifecycle.context_assigned",
  HISTORICAL_COMMITTED: "observation.lifecycle.historical_committed",
  PATTERN_EVIDENCE_LINKED: "observation.lifecycle.pattern_evidence_linked",
  KNOWLEDGE_EVIDENCE_LINKED: "observation.lifecycle.knowledge_evidence_linked",
  ARCHIVED: "observation.lifecycle.archived",
  DEPRECATED: "observation.quality.deprecated",
  CORRECTED: "observation.quality.corrected",
  VERIFICATION_FAILED: "observation.pipeline.verification_failed",
  QUALITY_FAILED: "observation.pipeline.quality_failed"
} as const;
