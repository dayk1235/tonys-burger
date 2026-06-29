import type { RecommendationStage, RecommendationEntity } from "./RecommendationTypes";

export interface RecommendationSubscriber {
  onRecommendationInitiated(recommendationId: string): Promise<void>;
  onRecommendationStageChanged(recommendationId: string, from: RecommendationStage, to: RecommendationStage): Promise<void>;
  onRecommendationCompleted(recommendationId: string): Promise<void>;
  onRecommendationFailed(recommendationId: string): Promise<void>;
}

export interface RecommendationQuery {
  findById(id: string): Promise<RecommendationEntity | undefined>;
  findActive(): Promise<RecommendationEntity[]>;
  findByPredictionId(predictionId: string): Promise<RecommendationEntity[]>;
  findByStage(stage: RecommendationStage): Promise<RecommendationEntity[]>;
  findAll(): Promise<RecommendationEntity[]>;
}

export interface RecommendationEngineMetrics {
  readonly totalRecommendations: number;
  readonly completedRecommendations: number;
  readonly archivedRecommendations: number;
  readonly failedRecommendations: number;
  readonly activeRecommendations: number;
  readonly averageConfidence: number;
  readonly averagePriority: number;
  readonly recommendationsByStage: Record<string, number>;
}
