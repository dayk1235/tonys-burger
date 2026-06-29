import { ExecutionEngineMetrics } from "./ExecutionContracts";

export class ExecutionMetrics implements ExecutionEngineMetrics {
  totalExecutions = 0;
  completedExecutions = 0;
  failedExecutions = 0;
  cancelledExecutions = 0;
  averageDuration = "0m";
  averageConfidence = 0;
  executionsByStage: Record<string, number> = {};

  private confidenceSum = 0;
  private totalCount = 0;
  private durationSumMs = 0;

  recordInitiated(): void {
    this.totalExecutions++;
    this.executionsByStage["INITIATED"] = (this.executionsByStage["INITIATED"] || 0) + 1;
  }

  recordCompleted(): void {
    this.completedExecutions++;
  }

  recordFailed(): void {
    this.failedExecutions++;
  }

  recordCancelled(): void {
    this.cancelledExecutions++;
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordDuration(duration: string): void {
    const minutes = this.parseDurationToMinutes(duration);
    this.durationSumMs += minutes * 60_000;
    const avgMinutes = this.durationSumMs / this.totalCount / 60_000;
    if (avgMinutes >= 60) {
      const h = Math.floor(avgMinutes / 60);
      const m = Math.round(avgMinutes % 60);
      this.averageDuration = `${h}h ${m}m`;
    } else {
      this.averageDuration = `${Math.round(avgMinutes)}m`;
    }
  }

  recordStageChange(from: string, to: string): void {
    this.executionsByStage[from] = Math.max(0, (this.executionsByStage[from] || 0) - 1);
    this.executionsByStage[to] = (this.executionsByStage[to] || 0) + 1;
  }

  private parseDurationToMinutes(duration: string): number {
    const parts = duration.split(/[hm ]/).filter(Boolean);
    let minutes = 0;
    for (let i = 0; i < parts.length; i++) {
      const val = parseInt(parts[i], 10);
      if (duration.includes("h") && i === 0) {
        minutes += val * 60;
      } else {
        minutes += val;
      }
    }
    return minutes || 1;
  }

  getSnapshot(): ExecutionEngineMetrics {
    return {
      totalExecutions: this.totalExecutions,
      completedExecutions: this.completedExecutions,
      failedExecutions: this.failedExecutions,
      cancelledExecutions: this.cancelledExecutions,
      averageDuration: this.averageDuration,
      averageConfidence: this.averageConfidence,
      executionsByStage: { ...this.executionsByStage },
    };
  }

  reset(): void {
    this.totalExecutions = 0;
    this.completedExecutions = 0;
    this.failedExecutions = 0;
    this.cancelledExecutions = 0;
    this.averageDuration = "0m";
    this.averageConfidence = 0;
    this.executionsByStage = {};
    this.confidenceSum = 0;
    this.totalCount = 0;
    this.durationSumMs = 0;
  }
}
