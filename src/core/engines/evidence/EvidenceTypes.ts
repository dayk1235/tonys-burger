export const EVIDENCE_ENGINE_NAME = "EvidenceEngine";
export const EVIDENCE_ENGINE_CLASSIFICATION = "Validation";
export const EVIDENCE_ENGINE_CONTRACT_VERSION = "1.0.0";

export type EvidenceStage =
  | "CANDIDATE"
  | "COLLECTING"
  | "SUPPORTING"
  | "CONFLICTING"
  | "WEIGHTED"
  | "VALIDATED"
  | "REJECTED"
  | "HISTORICAL"
  | "ARCHIVED";

export type EvidenceCategory =
  | "STRENGTH"
  | "COVERAGE"
  | "CONSISTENCY"
  | "FRESHNESS"
  | "RELIABILITY"
  | "SOURCE_DIVERSITY"
  | "TRACEABILITY"
  | "ACCURACY"
  | "REPLICABILITY"
  | "INDEPENDENCE";

export interface EvidenceIdentity {
  readonly id: string;
  readonly name: string;
  readonly patternId: string;
  readonly patternName: string;
  readonly category: string;
  readonly classification: EvidenceCategory;
  readonly evaluatedAt: string;
}

export interface EvidenceVersion {
  readonly version: number;
  readonly timestamp: string;
  readonly stage: EvidenceStage;
  readonly score: number;
  readonly confidence: number;
  readonly summary: string;
}

export interface SupportingRef {
  readonly observationId: string;
  readonly patternId: string;
  readonly weight: number;
  readonly independence: number;
  readonly sourceType: string;
  readonly capturedAt: string;
}

export interface ContradictingRef {
  readonly observationId: string;
  readonly patternId: string;
  readonly weight: number;
  readonly severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  readonly reason: string;
  readonly capturedAt: string;
}

export interface EvidenceQualityProfile {
  readonly strength: number;
  readonly coverage: number;
  readonly completeness: number;
  readonly consistency: number;
  readonly freshness: number;
  readonly reliability: number;
  readonly sourceDiversity: number;
  readonly traceability: number;
  readonly explainability: number;
  readonly contradictionResistance: number;
  readonly independence: number;
}

export interface EvidenceProvenance {
  readonly sourceObservations: readonly string[];
  readonly sourcePatterns: readonly string[];
  readonly detectionTimeline: readonly string[];
  readonly evaluationHistory: readonly EvidenceVersion[];
}

export interface EvidenceRelationship {
  readonly relatedEvidenceId: string;
  readonly type: "SUPPORTS" | "CONTRADICTS" | "CORROBORATES" | "DUPLICATE" | "PARENT" | "CHILD";
  readonly strength: number;
  readonly discoveredAt: string;
}

export interface Evidence {
  readonly id: string;
  readonly identity: EvidenceIdentity;
  readonly stage: EvidenceStage;
  readonly summary: string;
  readonly description: string;
  readonly score: number;
  readonly confidence: number;
  readonly supportingRefs: readonly SupportingRef[];
  readonly contradictingRefs: readonly ContradictingRef[];
  readonly qualityProfile: EvidenceQualityProfile;
  readonly provenance: EvidenceProvenance;
  readonly relationships: readonly EvidenceRelationship[];
  readonly versions: readonly EvidenceVersion[];
  readonly metadata: EvidenceMetadata;
}

export interface EvidenceMetadata {
  readonly totalObservationsEvaluated: number;
  readonly totalPatternsEvaluated: number;
  readonly uniqueSourceTypes: readonly string[];
  readonly evaluationDurationMs: number;
  readonly tags: readonly string[];
  readonly attributes: Readonly<Record<string, unknown>>;
}

export interface EvidenceEvaluationRequest {
  readonly patternId: string;
  readonly patternName: string;
  readonly patternCategory: string;
  readonly businessId: string;
  readonly observations: readonly string[];
  readonly supportingObservationIds: readonly string[];
  readonly contradictingObservationIds: readonly string[];
  readonly patternStrength: number;
  readonly patternConfidence: number;
  readonly temporalScope: {
    readonly firstObservedAt: string;
    readonly lastObservedAt: string;
  };
  readonly spatialZones: readonly string[];
  readonly sourceTypes: readonly string[];
}

export interface EvidenceEvaluationResult {
  readonly evaluated: boolean;
  readonly score: number;
  readonly confidence: number;
  readonly supportingWeight: number;
  readonly contradictingWeight: number;
  readonly qualityProfile: EvidenceQualityProfile;
  readonly recommendations: readonly string[];
}

export interface ObservationDetail {
  readonly id: string;
  readonly category: string;
  readonly timestamp: string;
  readonly sourceType: string;
  readonly trustScore: number;
  readonly confidence: number;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface PatternDetail {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly stage: string;
  readonly confidence: number;
  readonly strength: number;
  readonly supportCount: number;
  readonly contradictCount: number;
  readonly observations: readonly string[];
  readonly sourceTypes: readonly string[];
}

export interface EvidenceEventPayload {
  readonly evidenceId: string;
  readonly patternId: string;
  readonly patternName: string;
  readonly stage: EvidenceStage;
  readonly score: number;
  readonly confidence: number;
  readonly supportingCount: number;
  readonly contradictingCount: number;
  readonly timestamp: string;
}
