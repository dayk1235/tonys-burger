export const LEARNING_ENGINE_NAME = "LearningEngine";
export const LEARNING_ENGINE_CLASSIFICATION = "Learning";
export const LEARNING_ENGINE_CONTRACT_VERSION = "1.1.0";

export type LearningStage =
  | "INITIATED"
  | "OBSERVATION_COLLECTED"
  | "OUTCOME_ANALYZED"
  | "PATTERN_DERIVED"
  | "KNOWLEDGE_UPDATED"
  | "COMPLETED"
  | "FAILED";

export type LearningOperation =
  | "INITIATE"
  | "COLLECT_OBSERVATIONS"
  | "ANALYZE_OUTCOME"
  | "DERIVE_PATTERN"
  | "UPDATE_KNOWLEDGE"
  | "COMPLETE"
  | "FAIL";

export type ResultStatus =
  | "PENDING"
  | "ACHIEVED"
  | "PARTIALLY_ACHIEVED"
  | "NOT_ACHIEVED"
  | "CANCELLED";

export interface LearningInput {
  readonly decisionId: string;
  readonly decisionLabel: string;
  readonly decisionOutcome: string;
  readonly expectedResult: string;
  readonly actualResult: string;
  readonly confidence: number;
  readonly rationale: string;
  readonly businessId: string;
  readonly timestamp: string;
}

export interface LearningEntity {
  readonly id: string;
  readonly decisionId: string;
  readonly stage: LearningStage;
  readonly decisionLabel: string;
  readonly decisionOutcome: string;
  readonly expectedResult: string;
  readonly actualResult: string;
  readonly resultStatus: ResultStatus;
  readonly confidence: number;
  readonly rationale: string;
  readonly businessId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LearningOperationResult {
  readonly success: boolean;
  readonly learningId: string;
  readonly operation: LearningOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
