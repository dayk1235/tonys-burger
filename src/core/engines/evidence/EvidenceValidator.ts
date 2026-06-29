import { EvidenceEvaluationRequest, Evidence, ObservationDetail, PatternDetail } from "./EvidenceTypes";
import { EvidenceValidationError } from "./EvidenceErrors";

export class EvidenceValidator {
  validateRequest(request: EvidenceEvaluationRequest): void {
    if (!request.patternId || request.patternId.trim().length === 0) {
      throw new EvidenceValidationError("patternId is required");
    }
    if (!request.patternName || request.patternName.trim().length === 0) {
      throw new EvidenceValidationError("patternName is required");
    }
    if (!request.businessId || request.businessId.trim().length === 0) {
      throw new EvidenceValidationError("businessId is required");
    }
    if (!request.observations || request.observations.length === 0) {
      throw new EvidenceValidationError("at least one observation is required");
    }
    if (request.patternStrength < 0 || request.patternStrength > 1) {
      throw new EvidenceValidationError("patternStrength must be in [0, 1]");
    }
    if (request.patternConfidence < 0 || request.patternConfidence > 1) {
      throw new EvidenceValidationError("patternConfidence must be in [0, 1]");
    }
  }

  validateEvidence(evidence: Evidence): void {
    if (!evidence.id) {
      throw new EvidenceValidationError("evidence id is required");
    }
    if (evidence.score < 0 || evidence.score > 1) {
      throw new EvidenceValidationError("evidence score must be in [0, 1]");
    }
    if (evidence.confidence < 0 || evidence.confidence > 1) {
      throw new EvidenceValidationError("evidence confidence must be in [0, 1]");
    }
  }

  validateObservations(observations: readonly ObservationDetail[]): void {
    for (const obs of observations) {
      if (!obs.id) throw new EvidenceValidationError("observation missing id");
      if (obs.trustScore < 0 || obs.trustScore > 1) {
        throw new EvidenceValidationError(`observation ${obs.id} trustScore must be in [0, 1]`);
      }
    }
  }

  validatePattern(pattern: PatternDetail): void {
    if (!pattern.id) throw new EvidenceValidationError("pattern id is required");
    if (pattern.confidence < 0 || pattern.confidence > 1) {
      throw new EvidenceValidationError("pattern confidence must be in [0, 1]");
    }
    if (pattern.strength < 0 || pattern.strength > 1) {
      throw new EvidenceValidationError("pattern strength must be in [0, 1]");
    }
  }

  validateEvidenceInput(input: Record<string, unknown>): EvidenceEvaluationRequest {
    const pattern = input.pattern as Record<string, unknown> | undefined;
    if (!pattern) throw new EvidenceValidationError("input must contain a pattern object");

    const temporal = pattern.temporalScope as Record<string, unknown> | undefined;
    const spatial = pattern.spatialScope as Record<string, unknown> | undefined;
    const operational = pattern.operationalScope as Record<string, unknown> | undefined;

    const identity = pattern.identity as Record<string, unknown> | undefined;

    return {
      patternId: (pattern.id as string) || "",
      patternName: (identity?.name as string) || "",
      patternCategory: (identity?.category as string) || "",
      businessId: (pattern as Record<string, unknown>).businessId as string || (pattern.originObservations as string[])?.[0] || "",
      reasoningId: ((pattern as Record<string, unknown>).reasoningId as string) || (input.reasoningId as string) || undefined,
      observations: [...(pattern.originObservations as string[] || []), ...(pattern.supportingObservations as string[] || [])],
      supportingObservationIds: pattern.supportingObservations as string[] || [],
      contradictingObservationIds: pattern.contradictingObservations as string[] || [],
      patternStrength: (pattern.strength as number) || 0,
      patternConfidence: (pattern.confidence as number) || 0,
      temporalScope: {
        firstObservedAt: (temporal?.firstObservedAt as string) || new Date().toISOString(),
        lastObservedAt: (temporal?.lastObservedAt as string) || new Date().toISOString(),
      },
      spatialZones: (spatial?.zones as string[]) || [],
      sourceTypes: [],
    };
  }
}
