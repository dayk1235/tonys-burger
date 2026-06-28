import type { PredictionStage } from "./PredictionTypes";

export interface PredictionSubscriber {
  onPredictionInitiated(predictionId: string): Promise<void>;
  onPredictionStageChanged(predictionId: string, from: PredictionStage, to: PredictionStage): Promise<void>;
  onPredictionCompleted(predictionId: string): Promise<void>;
  onPredictionFailed(predictionId: string): Promise<void>;
}

export interface PredictionQuery {
  findById(id: string): Promise<unknown>;
  findActive(): Promise<unknown[]>;
  findByLearningId(learningId: string): Promise<unknown[]>;
}

export interface PredictionEngineMetrics {
  readonly totalPredictions: number;
  readonly completedPredictions: number;
  readonly failedPredictions: number;
  readonly activePredictions: number;
  readonly averageConfidence: number;
}
