export const PREDICTION_ENGINE_NAME = "PredictionEngine";
export const PREDICTION_ENGINE_CLASSIFICATION = "Prediction";
export const PREDICTION_ENGINE_CONTRACT_VERSION = "1.1.0";

export type PredictionStage =
  | "INITIATED"
  | "DATA_COLLECTED"
  | "MODEL_APPLIED"
  | "CONFIDENCE_EVALUATED"
  | "PREDICTION_READY"
  | "COMPLETED"
  | "FAILED";

export type PredictionOperation =
  | "INITIATE"
  | "COLLECT_DATA"
  | "APPLY_MODEL"
  | "EVALUATE_CONFIDENCE"
  | "BUILD_PREDICTION"
  | "COMPLETE"
  | "FAIL";

export interface PredictionInput {
  readonly learningId: string;
  readonly learnedPattern: string;
  readonly decisionLabel: string;
  readonly expectedResult: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly context: string;
  readonly timestamp: string;
}

export interface PredictionForecast {
  readonly outcome: string;
  readonly probability: number;
  readonly factors: readonly string[];
}

export interface SupportingEvidence {
  readonly learningId: string;
  readonly learnedPattern: string;
  readonly rationale: string;
  readonly expectedResult: string;
  readonly confidence: number;
}

export interface PredictionEntity {
  readonly id: string;
  readonly learningId: string;
  readonly stage: PredictionStage;
  readonly learnedPattern: string;
  readonly decisionLabel: string;
  readonly expectedResult: string;
  readonly forecast: PredictionForecast;
  readonly confidence: number;
  readonly supportingEvidence: SupportingEvidence;
  readonly businessId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PredictionOperationResult {
  readonly success: boolean;
  readonly predictionId: string;
  readonly operation: PredictionOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
