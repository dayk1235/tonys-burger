import { PredictionEngineMetrics } from "./PredictionContracts";

export class PredictionMetrics implements PredictionEngineMetrics {
  totalPredictions = 0;
  completedPredictions = 0;
  failedPredictions = 0;
  activePredictions = 0;
  averageConfidence = 0;
  averageProbability = 0;
  predictionsByStage: Record<string, number> = {};

  private confidenceSum = 0;
  private probabilitySum = 0;
  private totalCount = 0;

  recordInitiated(): void {
    this.totalPredictions++;
    this.activePredictions++;
    this.predictionsByStage["INITIATED"] = (this.predictionsByStage["INITIATED"] || 0) + 1;
  }

  recordCompleted(): void {
    this.completedPredictions++;
    this.activePredictions = Math.max(0, this.activePredictions - 1);
  }

  recordFailed(): void {
    this.failedPredictions++;
    this.activePredictions = Math.max(0, this.activePredictions - 1);
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordProbability(probability: number): void {
    this.probabilitySum += probability;
    this.averageProbability = this.probabilitySum / this.totalCount;
  }

  recordStageChange(from: string, to: string): void {
    this.predictionsByStage[from] = Math.max(0, (this.predictionsByStage[from] || 0) - 1);
    this.predictionsByStage[to] = (this.predictionsByStage[to] || 0) + 1;
  }

  getSnapshot(): PredictionEngineMetrics {
    return {
      totalPredictions: this.totalPredictions,
      completedPredictions: this.completedPredictions,
      failedPredictions: this.failedPredictions,
      activePredictions: this.activePredictions,
      averageConfidence: this.averageConfidence,
      averageProbability: this.averageProbability,
      predictionsByStage: { ...this.predictionsByStage },
    };
  }

  reset(): void {
    this.totalPredictions = 0;
    this.completedPredictions = 0;
    this.failedPredictions = 0;
    this.activePredictions = 0;
    this.averageConfidence = 0;
    this.averageProbability = 0;
    this.predictionsByStage = {};
    this.confidenceSum = 0;
    this.probabilitySum = 0;
    this.totalCount = 0;
  }
}
