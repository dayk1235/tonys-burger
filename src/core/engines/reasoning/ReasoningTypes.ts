export const REASONING_ENGINE_NAME = "ReasoningEngine";
export const REASONING_ENGINE_CLASSIFICATION = "Processing";
export const REASONING_ENGINE_CONTRACT_VERSION = "1.1.0";

export type ReasoningStage =
  | "CANDIDATE"
  | "ACTIVATED"
  | "CONTEXT_BUILDING"
  | "INFORMATION_GAP_DETECTION"
  | "EVIDENCE_GATHERING"
  | "KNOWLEDGE_RETRIEVAL"
  | "HYPOTHESIS_GENERATION"
  | "ALTERNATIVE_GENERATION"
  | "CONSTRAINT_EVALUATION"
  | "TRADEOFF_EVALUATION"
  | "CONSISTENCY_CHECKING"
  | "CONFIDENCE_ASSESSMENT"
  | "CONFIDENCE_EXPLANATION"
  | "CONCLUSION_BUILDING"
  | "COMPLETED"
  | "ARCHIVED"
  | "RETIRED";

export type ReasoningType =
  | "DIAGNOSTIC"
  | "STRATEGIC"
  | "OPERATIONAL"
  | "FINANCIAL"
  | "RISK"
  | "CUSTOMER"
  | "INVENTORY"
  | "LEARNING"
  | "PREDICTIVE"
  | "PLANNING"
  | "META"
  | "REFLECTIVE"
  | "ETHICAL"
  | "COMPOSITE";

export type ReasoningOperation =
  | "ACTIVATE"
  | "BUILD_CONTEXT"
  | "DETECT_GAPS"
  | "GATHER_EVIDENCE"
  | "RETRIEVE_KNOWLEDGE"
  | "GENERATE_HYPOTHESES"
  | "GENERATE_ALTERNATIVES"
  | "EVALUATE_CONSTRAINTS"
  | "EVALUATE_TRADEOFFS"
  | "CHECK_CONSISTENCY"
  | "ASSESS_CONFIDENCE"
  | "EXPLAIN_CONFIDENCE"
  | "BUILD_CONCLUSION"
  | "COMPLETE"
  | "ARCHIVE"
  | "RETIRE";

export type HypothesisStatus = "ACTIVE" | "SUPPORTED" | "WEAKENED" | "REJECTED" | "PENDING";
export type AlternativeStatus = "ACTIVE" | "FEASIBLE" | "INFEASIBLE" | "SELECTED" | "DISCARDED";
export type ConstraintType = "BUSINESS" | "OPERATIONAL" | "REGULATORY" | "RESOURCE" | "TEMPORAL";
export type ConstraintSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type ConfidenceLevel = "VERY_LOW" | "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";

export type QuestionType =
  | "WHY"
  | "HOW"
  | "WHAT_IF"
  | "SHOULD_INVESTIGATE"
  | "EXPLAIN"
  | "COMPARE"
  | "DIAGNOSE"
  | "EVALUATE"
  | "EXPLORE"
  | "VALIDATE";

export type GapType =
  | "OBSERVATION"
  | "EVIDENCE"
  | "KNOWLEDGE"
  | "BUSINESS_CONTEXT"
  | "TEMPORAL_CONTEXT"
  | "HUMAN_INPUT"
  | "ENVIRONMENTAL";

export type GapStatus = "KNOWN" | "UNKNOWN" | "NEEDED" | "UNAVAILABLE";

export interface ReasoningIdentity {
  readonly id: string;
  readonly attentionId: string;
  readonly name: string;
  readonly reasoningType: ReasoningType;
  readonly question: string;
  readonly businessId: string;
  readonly createdAt: string;
}

export interface ReasoningVersion {
  readonly version: number;
  readonly timestamp: string;
  readonly stage: ReasoningStage;
  readonly confidence: number;
  readonly coherenceScore: number;
  readonly summary: string;
}

export interface ReasoningQualityProfile {
  readonly correctness: number;
  readonly consistency: number;
  readonly completeness: number;
  readonly depth: number;
  readonly breadth: number;
  readonly creativity: number;
  readonly novelty: number;
  readonly explainability: number;
  readonly businessAlignment: number;
  readonly robustness: number;
  readonly efficiency: number;
  readonly ownerSatisfaction: number;
  readonly confidenceCalibration: number;
  readonly timeliness: number;
}

export interface ReasoningConfidenceProfile {
  readonly evidenceStrength: number;
  readonly knowledgeCoverage: number;
  readonly hypothesisQuality: number;
  readonly consistencyScore: number;
  readonly overallConfidence: number;
  readonly calibratedConfidence: number;
  readonly isOverconfident: boolean;
  readonly isUnderconfident: boolean;
  readonly flags: readonly string[];
}

export interface ReasoningQuestion {
  readonly id: string;
  readonly type: QuestionType;
  readonly text: string;
  readonly intent: string;
  readonly knownFacts: readonly string[];
  readonly unknownFacts: readonly string[];
  readonly assumptions: readonly string[];
  readonly desiredConfidenceLevel: ConfidenceLevel;
  readonly scope: string;
  readonly constraints: readonly string[];
  readonly expectedOutput: string;
  readonly priority: number;
  readonly createdAt: string;
}

export interface ConfidenceFactor {
  readonly name: string;
  readonly contribution: number;
  readonly weight: number;
  readonly description: string;
}

export interface ConfidenceExplanation {
  readonly baseConfidence: number;
  readonly factors: readonly ConfidenceFactor[];
  readonly evidenceContribution: number;
  readonly knowledgeContribution: number;
  readonly consistencyBonus: number;
  readonly contradictionPenalty: number;
  readonly missingInformationPenalty: number;
  readonly hypothesisCompetitionPenalty: number;
  readonly contextCompleteness: number;
  readonly sourceTrustContribution: number;
  readonly calibratedConfidence: number;
  readonly calibrationAdjustment: number;
  readonly adjustmentReason: string;
  readonly overallExplanation: string;
}

export interface InformationGapEntry {
  readonly type: GapType;
  readonly description: string;
  readonly status: GapStatus;
  readonly estimatedImpact: number;
  readonly canBeResolved: boolean;
}

export interface ReasoningProvenance {
  readonly attentionIds: readonly string[];
  readonly sourceObservationIds: readonly string[];
  readonly sourceMemoryIds: readonly string[];
  readonly sourceKnowledgeIds: readonly string[];
  readonly creationTimeline: readonly string[];
  readonly versionHistory: readonly ReasoningVersion[];
}

export interface ReasoningContextSnapshot {
  readonly environment: string;
  readonly businessPhase: string;
  readonly temporalContext: string;
  readonly operationalState: string;
  readonly loadLevel: number;
  readonly businessValue: number;
  readonly urgency: number;
  readonly ownerConcerns: readonly string[];
  readonly capturedAt: string;
}

export interface ReasoningHypothesis {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly evidenceStrength: number;
  readonly plausible: boolean;
  readonly supportedBy: readonly string[];
  readonly weakenedBy: readonly string[];
  readonly status: HypothesisStatus;
  readonly createdAt: string;
}

export interface ReasoningAlternative {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly businessImpact: number;
  readonly riskLevel: number;
  readonly costEstimate: number;
  readonly opportunityScore: number;
  readonly ownerAlignment: number;
  readonly constraintViolations: readonly string[];
  readonly status: AlternativeStatus;
  readonly createdAt: string;
}

export interface ReasoningConstraint {
  readonly id: string;
  readonly type: ConstraintType;
  readonly description: string;
  readonly severity: ConstraintSeverity;
  readonly eliminatesAlternativeIds: readonly string[];
  readonly rationale: string;
}

export interface ReasoningTradeoff {
  readonly id: string;
  readonly alternativeIdA: string;
  readonly alternativeIdB: string;
  readonly dimension: string;
  readonly scoreA: number;
  readonly scoreB: number;
  readonly recommendation: string;
}

export interface ReasoningConclusion {
  readonly id: string;
  readonly summary: string;
  readonly narrative: string;
  readonly preferredAlternativeId: string | null;
  readonly confidence: number;
  readonly uncertaintyRanges: readonly string[];
  readonly tradeoffHighlights: readonly string[];
  readonly assumptions: readonly string[];
  readonly unresolvedQuestions: readonly string[];
  readonly timestamp: string;
}

export interface ReasoningTreeStep {
  readonly id: string;
  readonly stepType: string;
  readonly description: string;
  readonly parentId: string | null;
  readonly children: readonly string[];
  readonly hypothesisId: string | null;
  readonly evidenceId: string | null;
  readonly confidence: number;
  readonly timestamp: string;
}

export interface ReasoningRelationships {
  readonly parentCaseIds: readonly string[];
  readonly childCaseIds: readonly string[];
  readonly relatedAttentionIds: readonly string[];
  readonly relatedObservationIds: readonly string[];
  readonly relatedMemoryIds: readonly string[];
  readonly relatedKnowledgeIds: readonly string[];
}

export interface ReasoningMetadata {
  totalHypothesesGenerated: number;
  totalAlternativesGenerated: number;
  totalConstraintsEvaluated: number;
  reEvaluationCount: number;
  inferenceCount: number;
  lastActiveAt: string;
  tags: readonly string[];
  attributes: Readonly<Record<string, unknown>>;
}

export interface Reasoning {
  readonly id: string;
  readonly identity: ReasoningIdentity;
  readonly stage: ReasoningStage;
  readonly type: ReasoningType;
  readonly question: ReasoningQuestion;
  readonly confidence: number;
  readonly coherenceScore: number;
  readonly qualityProfile: ReasoningQualityProfile;
  readonly confidenceProfile: ReasoningConfidenceProfile;
  readonly confidenceExplanation: ConfidenceExplanation | null;
  readonly provenance: ReasoningProvenance;
  readonly context: ReasoningContextSnapshot;
  readonly informationGaps: readonly InformationGapEntry[];
  readonly hypotheses: readonly ReasoningHypothesis[];
  readonly alternatives: readonly ReasoningAlternative[];
  readonly constraints: readonly ReasoningConstraint[];
  readonly tradeoffs: readonly ReasoningTradeoff[];
  readonly conclusion: ReasoningConclusion | null;
  readonly tree: readonly ReasoningTreeStep[];
  readonly relationships: ReasoningRelationships;
  readonly versions: readonly ReasoningVersion[];
  readonly metadata: ReasoningMetadata;
}

export interface ReasoningInput {
  readonly attentionId: string;
  readonly sourceObservationIds: readonly string[];
  readonly sourceMemoryIds: readonly string[];
  readonly sourceKnowledgeIds: readonly string[];
  readonly name: string;
  readonly questionText: string;
  readonly questionType: QuestionType;
  readonly intent: string;
  readonly reasoningType: ReasoningType;
  readonly urgency: number;
  readonly businessValue: number;
  readonly businessId: string;
}

export interface ReasoningOperationResult {
  readonly success: boolean;
  readonly reasoningId: string;
  readonly operation: ReasoningOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}

export interface ReasoningEventPayload {
  readonly reasoningId: string;
  readonly name: string;
  readonly type: ReasoningType;
  readonly stage: ReasoningStage;
  readonly confidence: number;
  readonly operation: ReasoningOperation;
  readonly timestamp: string;
}

export interface ReasoningCompletedPayload {
  readonly reasoning: {
    readonly id: string;
    readonly identity: ReasoningIdentity;
    readonly confidence: number;
    readonly integrity: number;
    readonly alternatives: readonly ReasoningAlternative[];
    readonly conclusion: ReasoningConclusion | null;
    readonly question: ReasoningQuestion;
    readonly businessId: string;
    readonly provenance: ReasoningProvenance;
    readonly metadata: ReasoningMetadata;
  };
  readonly operation: ReasoningOperation;
  readonly timestamp: string;
  readonly version: number;
}
