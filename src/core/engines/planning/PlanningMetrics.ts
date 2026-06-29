import { PlanningEngineMetrics } from "./PlanningContracts";

export class PlanningMetrics implements PlanningEngineMetrics {
  totalPlans = 0;
  completedPlans = 0;
  archivedPlans = 0;
  failedPlans = 0;
  activePlans = 0;
  averageConfidence = 0;
  averageSteps = 0;
  plansByStage: Record<string, number> = {};

  private confidenceSum = 0;
  private stepsSum = 0;
  private totalCount = 0;

  recordInitiated(stepsCount: number): void {
    this.totalPlans++;
    this.activePlans++;
    this.stepsSum += stepsCount;
    this.averageSteps = this.stepsSum / this.totalPlans;
    this.plansByStage["INITIATED"] = (this.plansByStage["INITIATED"] || 0) + 1;
  }

  recordCompleted(): void {
    this.completedPlans++;
    this.activePlans = Math.max(0, this.activePlans - 1);
  }

  recordArchived(): void {
    this.archivedPlans++;
    this.activePlans = Math.max(0, this.activePlans - 1);
  }

  recordFailed(): void {
    this.failedPlans++;
    this.activePlans = Math.max(0, this.activePlans - 1);
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordStageChange(from: string, to: string): void {
    this.plansByStage[from] = Math.max(0, (this.plansByStage[from] || 0) - 1);
    this.plansByStage[to] = (this.plansByStage[to] || 0) + 1;
  }

  getSnapshot(): PlanningEngineMetrics {
    return {
      totalPlans: this.totalPlans,
      completedPlans: this.completedPlans,
      archivedPlans: this.archivedPlans,
      failedPlans: this.failedPlans,
      activePlans: this.activePlans,
      averageConfidence: this.averageConfidence,
      averageSteps: this.averageSteps,
      plansByStage: { ...this.plansByStage },
    };
  }

  reset(): void {
    this.totalPlans = 0;
    this.completedPlans = 0;
    this.archivedPlans = 0;
    this.failedPlans = 0;
    this.activePlans = 0;
    this.averageConfidence = 0;
    this.averageSteps = 0;
    this.plansByStage = {};
    this.confidenceSum = 0;
    this.stepsSum = 0;
    this.totalCount = 0;
  }
}
