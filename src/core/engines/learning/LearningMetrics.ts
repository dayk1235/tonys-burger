import { LearningEngineMetrics } from "./LearningContracts";

export class LearningMetrics implements LearningEngineMetrics {
  totalLearningCycles = 0;
  completedCycles = 0;
  failedCycles = 0;
  activeCycles = 0;
  averageConfidence = 0;
  patternsDerived = 0;
  cyclesByStage: Record<string, number> = {};

  private confidenceSum = 0;
  private totalCount = 0;

  recordInitiated(): void {
    this.totalLearningCycles++;
    this.activeCycles++;
    this.cyclesByStage["INITIATED"] = (this.cyclesByStage["INITIATED"] || 0) + 1;
  }

  recordCompleted(): void {
    this.completedCycles++;
    this.activeCycles = Math.max(0, this.activeCycles - 1);
  }

  recordFailed(): void {
    this.failedCycles++;
    this.activeCycles = Math.max(0, this.activeCycles - 1);
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordPatternDerived(): void {
    this.patternsDerived++;
  }

  recordStageChange(from: string, to: string): void {
    this.cyclesByStage[from] = Math.max(0, (this.cyclesByStage[from] || 0) - 1);
    this.cyclesByStage[to] = (this.cyclesByStage[to] || 0) + 1;
  }

  getSnapshot(): LearningEngineMetrics {
    return {
      totalLearningCycles: this.totalLearningCycles,
      completedCycles: this.completedCycles,
      failedCycles: this.failedCycles,
      activeCycles: this.activeCycles,
      averageConfidence: this.averageConfidence,
      patternsDerived: this.patternsDerived,
      cyclesByStage: { ...this.cyclesByStage },
    };
  }

  reset(): void {
    this.totalLearningCycles = 0;
    this.completedCycles = 0;
    this.failedCycles = 0;
    this.activeCycles = 0;
    this.averageConfidence = 0;
    this.patternsDerived = 0;
    this.cyclesByStage = {};
    this.confidenceSum = 0;
    this.totalCount = 0;
  }
}
