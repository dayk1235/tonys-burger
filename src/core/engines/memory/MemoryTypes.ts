export const MEMORY_ENGINE_NAME = "MemoryEngine";
export const MEMORY_ENGINE_CLASSIFICATION = "Storage";
export const MEMORY_ENGINE_CONTRACT_VERSION = "1.0.0";

export type MemoryStage =
  | "WORKING"
  | "CANDIDATE"
  | "SHORT_TERM"
  | "STABILIZING"
  | "CONSOLIDATED"
  | "LONG_TERM"
  | "SEMANTIC"
  | "HISTORICAL"
  | "ARCHIVED";

export type MemoryOperation =
  | "CREATE"
  | "CONSOLIDATE"
  | "STRENGTHEN"
  | "WEAKEN"
  | "FORGET"
  | "ARCHIVE"
  | "COMPRESS"
  | "MERGE"
  | "SPLIT"
  | "REACTIVATE"
  | "ASSOCIATE"
  | "DETACH";

export type AssociationType =
  | "CAUSAL"
  | "CORRELATIONAL"
  | "TEMPORAL"
  | "SPATIAL"
  | "SEMANTIC"
  | "HIERARCHICAL"
  | "SEQUENTIAL"
  | "CONTEXTUAL";

export type MemoryCategory =
  | "SALES_PATTERN"
  | "CUSTOMER_BEHAVIOR"
  | "EMPLOYEE_PERFORMANCE"
  | "SUPPLIER_RELIABILITY"
  | "INVENTORY_EVOLUTION"
  | "PROMOTION_EFFECTIVENESS"
  | "OPERATIONAL_INCIDENT"
  | "EQUIPMENT_MAINTENANCE"
  | "SEASONALITY"
  | "BUSINESS_GROWTH";

export interface MemoryIdentity {
  readonly id: string;
  readonly name: string;
  readonly category: MemoryCategory;
  readonly evidenceId: string;
  readonly patternId: string;
  readonly observationIds: readonly string[];
  readonly createdAt: string;
}

export interface MemoryVersion {
  readonly version: number;
  readonly timestamp: string;
  readonly stage: MemoryStage;
  readonly strength: number;
  readonly confidence: number;
  readonly recallScore: number;
  readonly summary: string;
}

export interface MemoryQualityProfile {
  readonly retention: number;
  readonly recall: number;
  readonly precision: number;
  readonly consistency: number;
  readonly coverage: number;
  readonly traceability: number;
  readonly compressionEfficiency: number;
  readonly associationStrength: number;
  readonly semanticStability: number;
  readonly freshness: number;
  readonly explainability: number;
  readonly confidence: number;
}

export interface MemoryProvenance {
  readonly sourceEvidenceIds: readonly string[];
  readonly sourcePatternIds: readonly string[];
  readonly sourceObservationIds: readonly string[];
  readonly creationTimeline: readonly string[];
  readonly versionHistory: readonly MemoryVersion[];
  readonly consolidatedFromIds: readonly string[];
  readonly mergedFromIds: readonly string[];
}

export interface MemoryAssociation {
  readonly targetMemoryId: string;
  readonly type: AssociationType;
  readonly strength: number;
  readonly weight: number;
  readonly discoveredAt: string;
  readonly lastReinforcedAt: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface MemoryCompressionStats {
  readonly originalSize: number;
  readonly compressedSize: number;
  readonly compressionRatio: number;
  readonly entriesMerged: number;
  readonly redundantEntriesRemoved: number;
  readonly compressedAt: string;
}

export interface Memory {
  readonly id: string;
  readonly identity: MemoryIdentity;
  readonly stage: MemoryStage;
  readonly summary: string;
  readonly description: string;
  readonly strength: number;
  readonly confidence: number;
  readonly recallScore: number;
  readonly activationScore: number;
  readonly retentionScore: number;
  readonly associations: readonly MemoryAssociation[];
  readonly qualityProfile: MemoryQualityProfile;
  readonly provenance: MemoryProvenance;
  readonly versions: readonly MemoryVersion[];
  readonly compressionStats?: MemoryCompressionStats;
  readonly metadata: MemoryMetadata;
}

export interface MemoryMetadata {
  readonly totalAccessCount: number;
  readonly lastAccessedAt: string;
  readonly lastStrengthenedAt: string;
  readonly decayRate: number;
  readonly semanticCluster?: string;
  readonly tags: readonly string[];
  readonly attributes: Readonly<Record<string, unknown>>;
}

export interface MemoryInput {
  readonly evidenceId: string;
  readonly patternId: string;
  readonly observationIds: readonly string[];
  readonly name: string;
  readonly description: string;
  readonly category: MemoryCategory;
  readonly strength: number;
  readonly confidence: number;
  readonly businessId: string;
}

export interface MemoryOperationResult {
  readonly success: boolean;
  readonly memoryId: string;
  readonly operation: MemoryOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}

export interface MemoryEventPayload {
  readonly memoryId: string;
  readonly name: string;
  readonly category: string;
  readonly stage: MemoryStage;
  readonly strength: number;
  readonly confidence: number;
  readonly recallScore: number;
  readonly operation: MemoryOperation;
  readonly timestamp: string;
}
