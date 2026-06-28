import type { LearningStage } from "./LearningTypes";

export interface LearningSubscriber {
  onLearningInitiated(learningId: string): Promise<void>;
  onLearningStageChanged(learningId: string, from: LearningStage, to: LearningStage): Promise<void>;
  onLearningCompleted(learningId: string): Promise<void>;
  onLearningFailed(learningId: string): Promise<void>;
}

export interface LearningQuery {
  findById(id: string): Promise<unknown>;
  findActive(): Promise<unknown[]>;
  findByDecisionId(decisionId: string): Promise<unknown[]>;
}

export interface LearningEngineMetrics {
  readonly totalLearningCycles: number;
  readonly completedCycles: number;
  readonly failedCycles: number;
  readonly activeCycles: number;
  readonly averageConfidence: number;
  readonly patternsDerived: number;
}
