import type { LearningStage, LearningEntity } from "./LearningTypes";

export interface LearningSubscriber {
  onLearningInitiated(learningId: string): Promise<void>;
  onLearningStageChanged(learningId: string, from: LearningStage, to: LearningStage): Promise<void>;
  onLearningCompleted(learningId: string): Promise<void>;
  onLearningFailed(learningId: string): Promise<void>;
}

export interface LearningQuery {
  findById(id: string): Promise<LearningEntity | undefined>;
  findActive(): Promise<LearningEntity[]>;
  findByDecisionId(decisionId: string): Promise<LearningEntity[]>;
  findByStage(stage: LearningStage): Promise<LearningEntity[]>;
  findAll(): Promise<LearningEntity[]>;
}

export interface LearningEngineMetrics {
  readonly totalLearningCycles: number;
  readonly completedCycles: number;
  readonly failedCycles: number;
  readonly activeCycles: number;
  readonly averageConfidence: number;
  readonly patternsDerived: number;
  readonly cyclesByStage: Record<string, number>;
}
