export const KNOWLEDGE_ENGINE_NAME = "KnowledgeEngine";
export const KNOWLEDGE_ENGINE_CLASSIFICATION = "Knowledge";
export const KNOWLEDGE_ENGINE_CONTRACT_VERSION = "1.0.0";

export type KnowledgeStage =
  | "CANDIDATE"
  | "EXTRACTED"
  | "STRUCTURED"
  | "VALIDATED"
  | "GENERALIZED"
  | "SPECIALIZED"
  | "SEMANTIC"
  | "CANONICAL"
  | "HISTORICAL"
  | "ARCHIVED";

export type KnowledgeOperation =
  | "EXTRACT"
  | "GENERALIZE"
  | "SPECIALIZE"
  | "LINK"
  | "MERGE"
  | "SPLIT"
  | "VERSION"
  | "VALIDATE"
  | "DEPRECATE"
  | "ARCHIVE"
  | "SEARCH"
  | "EXPAND";

export type KnowledgeCategory =
  | "CUSTOMER_BEHAVIOR"
  | "EMPLOYEE_EXPERTISE"
  | "SUPPLIER_RELIABILITY"
  | "INVENTORY_KNOWLEDGE"
  | "SEASONALITY"
  | "PROMOTION_KNOWLEDGE"
  | "OPERATIONAL_PRACTICE"
  | "MAINTENANCE_HISTORY"
  | "BUSINESS_GROWTH"
  | "GENERAL";

export type GraphNodeType =
  | "CONCEPT"
  | "ENTITY"
  | "RELATIONSHIP"
  | "HIERARCHY"
  | "DEPENDENCY"
  | "CAUSE"
  | "CORRELATION"
  | "TEMPORAL"
  | "SPATIAL"
  | "BEHAVIORAL"
  | "OPERATIONAL"
  | "CATEGORY";

export type GraphEdgeType =
  | "IS_A"
  | "HAS_PROPERTY"
  | "DEPENDS_ON"
  | "CAUSES"
  | "CORRELATES_WITH"
  | "PRECEDES"
  | "FOLLOWS"
  | "LOCATED_IN"
  | "PART_OF"
  | "RELATED_TO"
  | "GENERALIZES"
  | "SPECIALIZES";

export interface KnowledgeIdentity {
  readonly id: string;
  readonly name: string;
  readonly category: KnowledgeCategory;
  readonly memoryId: string;
  readonly patternId: string;
  readonly evidenceIds: readonly string[];
  readonly createdAt: string;
}

export interface KnowledgeVersion {
  readonly version: number;
  readonly timestamp: string;
  readonly stage: KnowledgeStage;
  readonly confidence: number;
  readonly integrity: number;
  readonly summary: string;
}

export interface KnowledgeQualityProfile {
  readonly semanticConsistency: number;
  readonly coverage: number;
  readonly precision: number;
  readonly explainability: number;
  readonly abstractionQuality: number;
  readonly generalizationQuality: number;
  readonly traceability: number;
  readonly stability: number;
  readonly novelty: number;
  readonly confidence: number;
  readonly integrity: number;
  readonly reusability: number;
}

export interface KnowledgeProvenance {
  readonly sourceMemoryIds: readonly string[];
  readonly sourceEvidenceIds: readonly string[];
  readonly sourcePatternIds: readonly string[];
  readonly creationTimeline: readonly string[];
  readonly versionHistory: readonly KnowledgeVersion[];
  readonly generalizedFromIds: readonly string[];
  readonly specializedFromIds: readonly string[];
}

export interface GraphNode {
  readonly id: string;
  readonly type: GraphNodeType;
  readonly name: string;
  readonly description: string;
  readonly knowledgeId: string;
  readonly createdAt: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface GraphEdge {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: GraphEdgeType;
  readonly weight: number;
  readonly confidence: number;
  readonly provenance: readonly string[];
  readonly discoveredAt: string;
}

export interface Concept {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: KnowledgeCategory;
  readonly parentConceptId?: string;
  readonly childConceptIds: readonly string[];
  readonly attributeNames: readonly string[];
  readonly createdAt: string;
}

export interface OntologyRelationship {
  readonly sourceConceptId: string;
  readonly targetConceptId: string;
  readonly type: GraphEdgeType;
  readonly strength: number;
  readonly discoveredAt: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface Knowledge {
  readonly id: string;
  readonly identity: KnowledgeIdentity;
  readonly stage: KnowledgeStage;
  readonly summary: string;
  readonly description: string;
  readonly confidence: number;
  readonly integrity: number;
  readonly semanticScore: number;
  readonly abstractionLevel: number;
  readonly concepts: readonly Concept[];
  readonly graphNodes: readonly GraphNode[];
  readonly graphEdges: readonly GraphEdge[];
  readonly qualityProfile: KnowledgeQualityProfile;
  readonly provenance: KnowledgeProvenance;
  readonly versions: readonly KnowledgeVersion[];
  readonly metadata: KnowledgeMetadata;
}

export interface KnowledgeMetadata {
  readonly totalDerivations: number;
  readonly timesValidated: number;
  readonly lastValidatedAt: string;
  readonly generalizationCount: number;
  readonly specializationCount: number;
  readonly sourceCount: number;
  readonly tags: readonly string[];
  readonly attributes: Readonly<Record<string, unknown>>;
}

export interface KnowledgeInput {
  readonly memoryId: string;
  readonly patternId: string;
  readonly evidenceIds: readonly string[];
  readonly name: string;
  readonly description: string;
  readonly category: KnowledgeCategory;
  readonly confidence: number;
  readonly integrity: number;
  readonly businessId: string;
}

export interface KnowledgeOperationResult {
  readonly success: boolean;
  readonly knowledgeId: string;
  readonly operation: KnowledgeOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}

export interface KnowledgeEventPayload {
  readonly knowledgeId: string;
  readonly name: string;
  readonly category: string;
  readonly stage: KnowledgeStage;
  readonly confidence: number;
  readonly integrity: number;
  readonly operation: KnowledgeOperation;
  readonly timestamp: string;
}
