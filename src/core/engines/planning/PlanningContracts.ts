import type { PlanningStage } from "./PlanningTypes";

export interface PlanningSubscriber {
  onPlanInitiated(planId: string): Promise<void>;
  onPlanStageChanged(planId: string, from: PlanningStage, to: PlanningStage): Promise<void>;
  onPlanCompleted(planId: string): Promise<void>;
  onPlanFailed(planId: string): Promise<void>;
}

export interface PlanningQuery {
  findById(id: string): Promise<unknown>;
  findActive(): Promise<unknown[]>;
  findByRecommendationId(recommendationId: string): Promise<unknown[]>;
}

export interface PlanningEngineMetrics {
  readonly totalPlans: number;
  readonly completedPlans: number;
  readonly failedPlans: number;
  readonly activePlans: number;
  readonly averageConfidence: number;
}
