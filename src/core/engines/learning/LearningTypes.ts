export const LEARNING_ENGINE_NAME = "LearningEngine";
export const LEARNING_ENGINE_CLASSIFICATION = "Learning";
export const LEARNING_ENGINE_CONTRACT_VERSION = "1.0.0";

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

export interface LearningInput {
  readonly decisionId: string;
  readonly decisionOutcome: string;
  readonly expectedResult: string;
  readonly actualResult: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly timestamp: string;
}

export interface LearningOperationResult {
  readonly success: boolean;
  readonly learningId: string;
  readonly operation: LearningOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
