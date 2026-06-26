export const PATTERN_ENGINE_NAME = "PatternEngine";
export const PATTERN_ENGINE_CLASSIFICATION = "Understanding";
export const PATTERN_ENGINE_CONTRACT_VERSION = "1.0.0";

export type PatternStage =
  | "POTENTIAL"
  | "CANDIDATE"
  | "EMERGING"
  | "SUPPORTED"
  | "VALIDATED"
  | "STRENGTHENING"
  | "WEAKENING"
  | "DEPRECATED"
  | "HISTORICAL"
  | "ARCHIVED";

export type PatternCategory =
  | "REPEATED_EVENT"
  | "RECURRING_BEHAVIOR"
  | "SEQUENCE"
  | "TEMPORAL"
  | "SPATIAL"
  | "OPERATIONAL"
  | "BEHAVIORAL"
  | "BUSINESS"
  | "POSITIVE_TREND"
  | "NEGATIVE_TREND"
  | "STABLE_TREND"
  | "EMERGING_TREND"
  | "ANOMALY"
  | "CORRELATION"
  | "CAUSAL_CANDIDATE"
  | "DEGRADING"
  | "STRENGTHENING_PATTERN"
  | "DISAPPEARING"
  | "EVOLVING"
  | "CONFLICT"
  | "COMPOSITE";

export type DetectionMethod =
  | "FREQUENCY"
  | "INTERVAL"
  | "SEQUENCE"
  | "TEMPORAL_CLUSTER"
  | "SPATIAL_CLUSTER"
  | "TREND_REGRESSION"
  | "ANOMALY_ZSCORE"
  | "ANOMALY_IQR"
  | "CORRELATION_PEARSON"
  | "CORRELATION_SPEARMAN"
  | "SEQUENCE_MINING"
  | "PATTERN_MATCH"
  | "COMPOSITE_DERIVED"
  | "MANUAL";

export interface PatternIdentity {
  readonly id: string;
  readonly name: string;
  readonly category: PatternCategory;
  readonly detectedBy: DetectionMethod;
  readonly detectedAt: string;
}

export interface PatternVersion {
  readonly version: number;
  readonly timestamp: string;
  readonly stage: PatternStage;
  readonly confidence: number;
  readonly strength: number;
  readonly summary: string;
}

export interface PatternTemporalScope {
  readonly firstObservedAt: string;
  readonly lastObservedAt: string;
  readonly frequencyPerHour: number;
  readonly intervals: readonly number[];
  readonly typicalDurationMs?: number;
  readonly seasonalRelevance?: string[];
}

export interface PatternSpatialScope {
  readonly zones: readonly string[];
  readonly locations: readonly string[];
  readonly typicalCluster?: { centerLat?: number; centerLng?: number; radiusMeters?: number };
}

export interface PatternOperationalScope {
  readonly servicePeriods: readonly string[];
  readonly staffingLevels: readonly string[];
  readonly activeDuringPromotions: readonly string[];
  readonly businessContexts: readonly string[];
}

export interface PatternEvidenceRef {
  readonly observationId: string;
  readonly role: "ORIGIN" | "SUPPORTING" | "CONTRADICTING";
  readonly weight: number;
  readonly capturedAt: string;
}

export interface PatternQualityProfile {
  readonly precision: number;
  readonly coverage: number;
  readonly novelty: number;
  readonly consistency: number;
  readonly persistence: number;
  readonly generalization: number;
  readonly predictiveValue: number;
  readonly explainability: number;
  readonly robustness: number;
  readonly falsePositiveProbability: number;
  readonly falseNegativeProbability: number;
}

export interface PatternRelationship {
  readonly relatedPatternId: string;
  readonly type: "SUPPORTS" | "CONTRADICTS" | "COMPOSES" | "COMPOSITE_OF" | "EVOLVED_FROM" | "EVOLVED_INTO" | "CORRELATED_WITH" | "ANTI_CORRELATED_WITH";
  readonly strength: number;
  readonly discoveredAt: string;
}

export interface Pattern {
  readonly id: string;
  readonly identity: PatternIdentity;
  readonly stage: PatternStage;
  readonly summary: string;
  readonly description: string;
  readonly businessRelevance: string;
  readonly confidence: number;
  readonly strength: number;
  readonly novelty: number;
  readonly persistence: number;
  readonly recurrence: number;
  readonly evidence: readonly PatternEvidenceRef[];
  readonly originObservations: readonly string[];
  readonly supportingObservations: readonly string[];
  readonly contradictingObservations: readonly string[];
  readonly temporalScope: PatternTemporalScope;
  readonly spatialScope: PatternSpatialScope;
  readonly operationalScope: PatternOperationalScope;
  readonly qualityProfile: PatternQualityProfile;
  readonly relationships: readonly PatternRelationship[];
  readonly versions: readonly PatternVersion[];
  readonly metadata: PatternMetadata;
}

export interface PatternMetadata {
  readonly detectionCount: number;
  readonly lastDetectedAt: string;
  readonly lastEvaluationAt: string;
  readonly sourceEngines: readonly string[];
  readonly tags: readonly string[];
  readonly attributes: Readonly<Record<string, unknown>>;
}

export interface PatternDefinition {
  readonly name: string;
  readonly category: PatternCategory;
  readonly description: string;
  readonly detectionMethod: DetectionMethod;
  readonly evaluate: (observations: ReadonlyArray<import("./PatternTypes").ObservationRef>) => PatternDetectionResult;
  readonly minSupport: number;
  readonly confidenceThreshold: number;
  readonly timeWindowMs: number;
}

export interface PatternDetectionResult {
  readonly detected: boolean;
  readonly strength: number;
  readonly confidence: number;
  readonly novelty: number;
  readonly evidence: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface ObservationRef {
  readonly id: string;
  readonly category: string;
  readonly timestamp: string;
  readonly businessId: string;
  readonly sourceType: string;
  readonly trustScore: number;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly stage: string;
}

export interface PatternEventPayload {
  readonly patternId: string;
  readonly patternName: string;
  readonly stage: PatternStage;
  readonly category: PatternCategory;
  readonly confidence: number;
  readonly strength: number;
  readonly evidenceCount: number;
  readonly timestamp: string;
}
