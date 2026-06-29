import type { PlanningStage, PlanningEntity } from "./PlanningTypes";

export interface PlanningSubscriber {
  onPlanInitiated(planId: string): Promise<void>;
  onPlanStageChanged(planId: string, from: PlanningStage, to: PlanningStage): Promise<void>;
  onPlanCompleted(planId: string): Promise<void>;
  onPlanFailed(planId: string): Promise<void>;
}

export interface PlanningQuery {
  findById(id: string): Promise<PlanningEntity | undefined>;
  findActive(): Promise<PlanningEntity[]>;
  findByRecommendationId(recommendationId: string): Promise<PlanningEntity[]>;
  findByStage(stage: PlanningStage): Promise<PlanningEntity[]>;
  findAll(): Promise<PlanningEntity[]>;
}

export interface PlanningEngineMetrics {
  readonly totalPlans: number;
  readonly completedPlans: number;
  readonly archivedPlans: number;
  readonly failedPlans: number;
  readonly activePlans: number;
  readonly averageConfidence: number;
  readonly averageSteps: number;
  readonly plansByStage: Record<string, number>;
}
