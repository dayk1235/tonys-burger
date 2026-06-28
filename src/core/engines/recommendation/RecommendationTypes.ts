export const RECOMMENDATION_ENGINE_NAME = "RecommendationEngine";
export const RECOMMENDATION_ENGINE_CLASSIFICATION = "Recommendation";
export const RECOMMENDATION_ENGINE_CONTRACT_VERSION = "1.0.0";

export type RecommendationStage =
  | "INITIATED"
  | "CONTEXT_ANALYZED"
  | "OPTIONS_EVALUATED"
  | "PRIORITIZED"
  | "RECOMMENDATION_READY"
  | "COMPLETED"
  | "FAILED";

export type RecommendationOperation =
  | "INITIATE"
  | "ANALYZE_CONTEXT"
  | "EVALUATE_OPTIONS"
  | "PRIORITIZE"
  | "BUILD_RECOMMENDATION"
  | "COMPLETE"
  | "FAIL";

export interface RecommendationInput {
  readonly predictionId: string;
  readonly predictionForecast: string;
  readonly confidence: number;
  readonly businessId: string;
  readonly priority: string;
  readonly timestamp: string;
}

export interface RecommendationOperationResult {
  readonly success: boolean;
  readonly recommendationId: string;
  readonly operation: RecommendationOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
