export const ATTENTION_ENGINE_NAME = "AttentionEngine";
export const ATTENTION_ENGINE_CLASSIFICATION = "Attention";
export const ATTENTION_ENGINE_CONTRACT_VERSION = "1.0.0";

export type AttentionStage =
  | "CANDIDATE"
  | "OBSERVED"
  | "SCORED"
  | "QUEUED"
  | "FOCUSED"
  | "MAINTAINED"
  | "INTERRUPTED"
  | "DEFERRED"
  | "RELEASED"
  | "ARCHIVED";

export type AttentionOperation =
  | "PRIORITIZE"
  | "FOCUS"
  | "DEFOCUS"
  | "INTERRUPT"
  | "ESCALATE"
  | "SUSPEND"
  | "RESUME"
  | "ALLOCATE"
  | "RELEASE"
  | "MERGE"
  | "SPLIT"
  | "EXPIRE"
  | "DEFER"
  | "OBSERVE"
  | "SCORE"
  | "QUEUE"
  | "MAINTAIN"
  | "ARCHIVE";

export type AttentionCategory =
  | "KITCHEN_EMERGENCY"
  | "VIP_CUSTOMER"
  | "INVENTORY_SHORTAGE"
  | "EMPLOYEE_INCIDENT"
  | "SUPPLIER_DELAY"
  | "EQUIPMENT_FAILURE"
  | "RUSH_HOUR"
  | "RESERVATION_OVERLOAD"
  | "REVENUE_OPPORTUNITY"
  | "CUSTOMER_COMPLAINT"
  | "QUALITY_ISSUE"
  | "COMPLIANCE"
  | "MAINTENANCE"
  | "STRATEGIC"
  | "OPERATIONAL"
  | "GENERAL";

export type EscalationLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SourceType =
  | "OBSERVATION"
  | "PATTERN"
  | "EVIDENCE"
  | "MEMORY"
  | "KNOWLEDGE"
  | "RUNTIME_EVENT"
  | "BUSINESS_PULSE"
  | "HUMAN_GOAL"
  | "CONTEXT";

export interface AttentionIdentity {
  readonly id: string;
  readonly name: string;
  readonly category: AttentionCategory;
  readonly sourceId: string;
  readonly sourceType: SourceType;
  readonly sourceIds: readonly string[];
  readonly createdAt: string;
}

export interface AttentionVersion {
  readonly version: number;
  readonly timestamp: string;
  readonly stage: AttentionStage;
  readonly priority: number;
  readonly allocation: number;
  readonly summary: string;
}

export interface AttentionQualityProfile {
  readonly priorityAccuracy: number;
  readonly focusStability: number;
  readonly allocationEfficiency: number;
  readonly contextAwareness: number;
  readonly goalAlignment: number;
  readonly riskSensitivity: number;
  readonly opportunityRecognition: number;
  readonly noveltyDetection: number;
  readonly explainability: number;
  readonly fairness: number;
  readonly confidence: number;
  readonly traceability: number;
}

export interface AttentionPriorityFactors {
  readonly urgency: number;
  readonly importance: number;
  readonly risk: number;
  readonly opportunity: number;
  readonly businessValue: number;
  readonly humanValue: number;
  readonly temporalPressure: number;
  readonly contextRelevance: number;
  readonly goalAlignment: number;
  readonly resourceAvailability: number;
  readonly uncertainty: number;
  readonly novelty: number;
  readonly confidence: number;
}

export interface AttentionProvenance {
  readonly sourceIds: readonly string[];
  readonly sourceTypes: readonly SourceType[];
  readonly creationTimeline: readonly string[];
  readonly versionHistory: readonly AttentionVersion[];
  readonly escalationHistory: readonly EscalationLevel[];
  readonly interruptionHistory: readonly string[];
}

export interface AttentionBudget {
  readonly total: number;
  allocated: number;
  available: number;
  readonly reserved: number;
  readonly maxPerItem: number;
  readonly starvationThreshold: number;
}

export interface FocusState {
  currentId: string | null;
  startedAt: string | null;
  duration: number;
  readonly persistenceScore: number;
  readonly contextSession: string;
  readonly reFocusCount: number;
}

export interface AttentionInterruption {
  readonly id: string;
  readonly sourceId: string;
  readonly sourceType: SourceType;
  readonly level: EscalationLevel;
  readonly priority: number;
  readonly reason: string;
  readonly timestamp: string;
  readonly requiresImmediateAction: boolean;
}

export interface ContextSnapshot {
  readonly environment: string;
  readonly businessPhase: string;
  readonly currentGoals: readonly string[];
  readonly activeResources: readonly string[];
  readonly constraints: readonly string[];
  readonly temporalContext: string;
  readonly loadLevel: number;
  readonly capturedAt: string;
}

export interface AttentionScoringFactors {
  baseScore: number;
  readonly urgencyScore: number;
  readonly importanceScore: number;
  readonly riskScore: number;
  readonly opportunityScore: number;
  readonly noveltyScore: number;
  readonly contextScore: number;
  readonly goalsScore: number;
  readonly temporalScore: number;
  readonly decayFactor: number;
  readonly boostFactor: number;
  readonly finalScore: number;
}

export interface Attention {
  readonly id: string;
  readonly identity: AttentionIdentity;
  readonly stage: AttentionStage;
  readonly priority: number;
  readonly priorityFactors: AttentionPriorityFactors;
  readonly scoringFactors: AttentionScoringFactors;
  readonly allocation: number;
  readonly budgetConsumption: number;
  readonly age: number;
  readonly timesInterrupted: number;
  readonly timesRefocused: number;
  readonly escalationLevel: EscalationLevel;
  readonly qualityProfile: AttentionQualityProfile;
  readonly provenance: AttentionProvenance;
  readonly versions: readonly AttentionVersion[];
  readonly metadata: AttentionMetadata;
}

export interface AttentionMetadata {
  totalAllocations: number;
  readonly totalFocusDuration: number;
  readonly lastFocusAt: string;
  readonly lastScoredAt: string;
  readonly starveBoostCount: number;
  readonly decayCycles: number;
  readonly tags: readonly string[];
  readonly attributes: Readonly<Record<string, unknown>>;
}

export interface AttentionInput {
  readonly sourceId: string;
  readonly sourceType: SourceType;
  readonly sourceIds: readonly string[];
  readonly name: string;
  readonly category: AttentionCategory;
  readonly urgency: number;
  readonly importance: number;
  readonly risk: number;
  readonly opportunity: number;
  readonly businessValue: number;
  readonly humanValue: number;
  readonly businessId: string;
}

export interface AttentionOperationResult {
  readonly success: boolean;
  readonly attentionId: string;
  readonly operation: AttentionOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}

export interface AttentionEventPayload {
  readonly attentionId: string;
  readonly name: string;
  readonly category: string;
  readonly stage: AttentionStage;
  readonly priority: number;
  readonly allocation: number;
  readonly operation: AttentionOperation;
  readonly timestamp: string;
}
