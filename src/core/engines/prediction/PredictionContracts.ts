import type { PredictionStage, PredictionEntity } from "./PredictionTypes";

export interface PredictionSubscriber {
  onPredictionInitiated(predictionId: string): Promise<void>;
  onPredictionStageChanged(predictionId: string, from: PredictionStage, to: PredictionStage): Promise<void>;
  onPredictionCompleted(predictionId: string): Promise<void>;
  onPredictionFailed(predictionId: string): Promise<void>;
}

export interface PredictionQuery {
  findById(id: string): Promise<PredictionEntity | undefined>;
  findActive(): Promise<PredictionEntity[]>;
  findByLearningId(learningId: string): Promise<PredictionEntity[]>;
  findByStage(stage: PredictionStage): Promise<PredictionEntity[]>;
  findAll(): Promise<PredictionEntity[]>;
}

export interface PredictionEngineMetrics {
  readonly totalPredictions: number;
  readonly completedPredictions: number;
  readonly failedPredictions: number;
  readonly activePredictions: number;
  readonly averageConfidence: number;
  readonly averageProbability: number;
  readonly predictionsByStage: Record<string, number>;
}
