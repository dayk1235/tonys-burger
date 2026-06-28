export const PREDICTION_ENGINE_NAME = "PredictionEngine";
export const PREDICTION_ENGINE_CLASSIFICATION = "Prediction";
export const PREDICTION_ENGINE_CONTRACT_VERSION = "1.0.0";

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
  readonly confidence: number;
  readonly businessId: string;
  readonly context: string;
  readonly timestamp: string;
}

export interface PredictionOperationResult {
  readonly success: boolean;
  readonly predictionId: string;
  readonly operation: PredictionOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
