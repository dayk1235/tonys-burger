import { PatternStage } from "./PatternTypes";

export interface PatternEvent {
  readonly id: string;
  readonly eventName: string;
  readonly timestamp: string;
  readonly emitter: string;
  readonly payload: {
    readonly patternId: string;
    readonly stage: PatternStage;
    readonly data: Readonly<Record<string, unknown>>;
  };
}

export const PatternEventNames = {
  POTENTIAL_DETECTED: "pattern.lifecycle.potential_detected",
  CANDIDATE_EVALUATED: "pattern.lifecycle.candidate_evaluated",
  EMERGING_CONFIRMED: "pattern.lifecycle.emerging_confirmed",
  SUPPORTED_ESTABLISHED: "pattern.lifecycle.supported_established",
  VALIDATED_CONFIRMED: "pattern.lifecycle.validated_confirmed",
  STRENGTHENING_OBSERVED: "pattern.lifecycle.strengthening_observed",
  WEAKENING_OBSERVED: "pattern.lifecycle.weakening_observed",
  DEPRECATED: "pattern.lifecycle.deprecated",
  HISTORICAL_ARCHIVED: "pattern.lifecycle.historical_archived",
  CORRELATION_FOUND: "pattern.discovery.correlation_found",
  TREND_DETECTED: "pattern.discovery.trend_detected",
  ANOMALY_DETECTED: "pattern.discovery.anomaly_detected",
  SEQUENCE_DISCOVERED: "pattern.discovery.sequence_discovered",
  PATTERN_UPDATED: "pattern.lifecycle.pattern_updated",
  PATTERN_CONFLICT: "pattern.lifecycle.pattern_conflict",
  PATTERN_MERGED: "pattern.lifecycle.pattern_merged",
} as const;

let eventIdCounter = 0;

export function createPatternEvent(
  eventName: string,
  emitter: string,
  patternId: string,
  stage: PatternStage,
  data: Record<string, unknown>
): PatternEvent {
  return {
    id: `pat_evt_${++eventIdCounter}`,
    eventName,
    timestamp: new Date().toISOString(),
    emitter,
    payload: { patternId, stage, data },
  };
}
