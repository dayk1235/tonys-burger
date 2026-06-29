export const RECOMMENDATION_ENGINE_NAME = "RecommendationEngine";
export const RECOMMENDATION_ENGINE_CLASSIFICATION = "Recommendation";
export const RECOMMENDATION_ENGINE_CONTRACT_VERSION = "1.1.0";

export type RecommendationStage =
  | "INITIATED"
  | "ANALYZED"
  | "PRIORITIZED"
  | "OPTIMIZED"
  | "READY"
  | "COMPLETED"
  | "FAILED"
  | "ARCHIVED";

export type RecommendationOperation =
  | "INITIATE"
  | "ANALYZE"
  | "PRIORITIZE"
  | "OPTIMIZE"
  | "BUILD"
  | "COMPLETE"
  | "FAIL"
  | "ARCHIVE";

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RecommendationInput {
  readonly predictionId: string;
  readonly predictionForecast: string;
  readonly forecastOutcome: string;
  readonly forecastProbability: number;
  readonly forecastFactors: readonly string[];
  readonly supportingEvidence: {
    readonly learningId: string;
    readonly learnedPattern: string;
    readonly rationale: string;
    readonly expectedResult: string;
    readonly confidence: number;
  };
  readonly confidence: number;
  readonly businessId: string;
  readonly context: string;
  readonly expectedResult: string;
  readonly timestamp: string;
}

export interface RecommendationEvaluation {
  readonly priority: PriorityLevel;
  readonly recommendedAction: string;
  readonly expectedBenefit: string;
  readonly estimatedRisk: string;
  readonly explanation: string;
  readonly overallConfidence: number;
}

export interface RecommendationEntity {
  readonly id: string;
  readonly predictionId: string;
  readonly stage: RecommendationStage;
  readonly recommendedAction: string;
  readonly priority: PriorityLevel;
  readonly expectedBenefit: string;
  readonly expectedRisk: string;
  readonly confidence: number;
  readonly explanation: string;
  readonly supportingEvidence: {
    readonly learningId: string;
    readonly learnedPattern: string;
    readonly rationale: string;
    readonly expectedResult: string;
    readonly confidence: number;
  };
  readonly forecast: {
    readonly outcome: string;
    readonly probability: number;
    readonly factors: readonly string[];
  };
  readonly businessId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface RecommendationOperationResult {
  readonly success: boolean;
  readonly recommendationId: string;
  readonly operation: RecommendationOperation;
  readonly timestamp: string;
  readonly details: string;
  readonly metadata?: Record<string, unknown>;
}
