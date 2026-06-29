import { RecommendationEngineMetrics } from "./RecommendationContracts";
import { PriorityLevel } from "./RecommendationTypes";

const PRIORITY_VALUES: Record<PriorityLevel, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export class RecommendationMetrics implements RecommendationEngineMetrics {
  totalRecommendations = 0;
  completedRecommendations = 0;
  archivedRecommendations = 0;
  failedRecommendations = 0;
  activeRecommendations = 0;
  averageConfidence = 0;
  averagePriority = 0;
  recommendationsByStage: Record<string, number> = {};

  private confidenceSum = 0;
  private prioritySum = 0;
  private totalCount = 0;

  recordInitiated(): void {
    this.totalRecommendations++;
    this.activeRecommendations++;
    this.recommendationsByStage["INITIATED"] = (this.recommendationsByStage["INITIATED"] || 0) + 1;
  }

  recordCompleted(): void {
    this.completedRecommendations++;
    this.activeRecommendations = Math.max(0, this.activeRecommendations - 1);
  }

  recordArchived(): void {
    this.archivedRecommendations++;
    this.activeRecommendations = Math.max(0, this.activeRecommendations - 1);
  }

  recordFailed(): void {
    this.failedRecommendations++;
    this.activeRecommendations = Math.max(0, this.activeRecommendations - 1);
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordPriority(priority: PriorityLevel): void {
    const value = PRIORITY_VALUES[priority] ?? 1;
    this.prioritySum += value;
    this.averagePriority = this.prioritySum / this.totalCount;
  }

  recordStageChange(from: string, to: string): void {
    this.recommendationsByStage[from] = Math.max(0, (this.recommendationsByStage[from] || 0) - 1);
    this.recommendationsByStage[to] = (this.recommendationsByStage[to] || 0) + 1;
  }

  getSnapshot(): RecommendationEngineMetrics {
    return {
      totalRecommendations: this.totalRecommendations,
      completedRecommendations: this.completedRecommendations,
      archivedRecommendations: this.archivedRecommendations,
      failedRecommendations: this.failedRecommendations,
      activeRecommendations: this.activeRecommendations,
      averageConfidence: this.averageConfidence,
      averagePriority: this.averagePriority,
      recommendationsByStage: { ...this.recommendationsByStage },
    };
  }

  reset(): void {
    this.totalRecommendations = 0;
    this.completedRecommendations = 0;
    this.archivedRecommendations = 0;
    this.failedRecommendations = 0;
    this.activeRecommendations = 0;
    this.averageConfidence = 0;
    this.averagePriority = 0;
    this.recommendationsByStage = {};
    this.confidenceSum = 0;
    this.prioritySum = 0;
    this.totalCount = 0;
  }
}
