import type { RecommendationStage } from "./RecommendationTypes";

export interface RecommendationSubscriber {
  onRecommendationInitiated(recommendationId: string): Promise<void>;
  onRecommendationStageChanged(recommendationId: string, from: RecommendationStage, to: RecommendationStage): Promise<void>;
  onRecommendationCompleted(recommendationId: string): Promise<void>;
  onRecommendationFailed(recommendationId: string): Promise<void>;
}

export interface RecommendationQuery {
  findById(id: string): Promise<unknown>;
  findActive(): Promise<unknown[]>;
  findByPredictionId(predictionId: string): Promise<unknown[]>;
}

export interface RecommendationEngineMetrics {
  readonly totalRecommendations: number;
  readonly completedRecommendations: number;
  readonly failedRecommendations: number;
  readonly activeRecommendations: number;
  readonly averagePriority: number;
}
