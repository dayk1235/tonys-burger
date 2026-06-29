export const DECISION_ENGINE_NAME = "DecisionEngine";
export const DECISION_ENGINE_CLASSIFICATION = "Decision";
export const DECISION_ENGINE_CONTRACT_VERSION = "1.0.0";

export type DecisionStage =
  | "CANDIDATE"
  | "CONTEXT_READY"
  | "ALTERNATIVES_BUILT"
  | "RISK_EVALUATED"
  | "OPPORTUNITY_EVALUATED"
  | "COST_EVALUATED"
  | "HUMAN_IMPACT_EVALUATED"
  | "REVERSIBILITY_EVALUATED"
  | "CONFIDENCE_VERIFIED"
  | "PROPOSAL_BUILT"
  | "WAITING_HUMAN_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "MODIFIED"
  | "ARCHIVED"
  | "RETIRED";

export type DecisionOperation =
  | "INITIATE"
  | "BUILD_CONTEXT"
  | "EVALUATE_RISK"
  | "EVALUATE_OPPORTUNITY"
  | "EVALUATE_COST"
  | "EVALUATE_HUMAN_IMPACT"
  | "EVALUATE_REVERSIBILITY"
  | "VERIFY_CONFIDENCE"
  | "BUILD_PROPOSAL"
  | "PRESENT"
  | "ACCEPT"
  | "REJECT"
  | "MODIFY"
  | "ARCHIVE"
  | "RETIRE";

export interface DecisionInput {
  readonly reasoningId: string;
  readonly reasoningConclusion: string;
  readonly confidence: number;
  readonly alternatives: readonly DecisionAlternative[];
  readonly businessId: string;
  readonly questionText: string;
  readonly urgency: number;
}

export interface DecisionAlternative {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly expectedOutcome: string;
  readonly riskLevel: number;
  readonly opportunityScore: number;
  readonly costEstimate: number;
  readonly humanImpactScore: number;
  readonly reversibility: "REVERSIBLE" | "CONDITIONALLY_REVERSIBLE" | "IRREVERSIBLE";
}

export interface DecisionOperationResult {
  readonly success: boolean;
  readonly proposalId: string;
  readonly operation: DecisionOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
  readonly selectedAlternativeId?: string | null;
  readonly confidence?: number;
  readonly rationale?: string;
}

export interface AlternativeEvaluation {
  readonly alternativeId: string;
  readonly label: string;
  readonly riskScore: number;
  readonly opportunityScore: number;
  readonly costScore: number;
  readonly humanImpactScore: number;
  readonly reversibilityScore: number;
  readonly weightedScore: number;
  readonly isSelected: boolean;
}

export interface DecisionResult {
  readonly id: string;
  readonly reasoningId: string;
  readonly stage: DecisionStage;
  readonly questionText: string;
  readonly businessId: string;
  readonly alternatives: readonly DecisionAlternative[];
  readonly evaluations: readonly AlternativeEvaluation[];
  readonly selectedAlternativeId: string | null;
  readonly selectedLabel: string;
  readonly confidence: number;
  readonly rationale: string;
  readonly reasoningConfidence: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
