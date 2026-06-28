import { Reasoning, ReasoningType, ReasoningStage } from "./ReasoningTypes";

export interface ReasoningSubscriber {
  onReasoningCreated(reasoning: Reasoning): Promise<void>;
  onReasoningUpdated(reasoning: Reasoning): Promise<void>;
  onReasoningStageChanged(reasoningId: string, from: ReasoningStage, to: ReasoningStage): Promise<void>;
  onReasoningCompleted(reasoningId: string): Promise<void>;
  onReasoningArchived(reasoningId: string): Promise<void>;
}

export interface ReasoningQuery {
  findById(id: string): Promise<Reasoning | undefined>;
  findByType(type: ReasoningType): Promise<Reasoning[]>;
  findByStage(stage: ReasoningStage): Promise<Reasoning[]>;
  findByAttentionId(attentionId: string): Promise<Reasoning[]>;
  findActive(): Promise<Reasoning[]>;
  findCompleted(): Promise<Reasoning[]>;
  findByQuestion(query: string): Promise<Reasoning[]>;
}

export interface ReasoningEngineMetrics {
  readonly totalCasesProcessed: number;
  readonly completedCases: number;
  readonly archivedCases: number;
  readonly activeCases: number;
  readonly averageDurationMs: number;
  readonly averageConfidence: number;
  readonly averageQualityScore: number;
  readonly averageHypothesesPerCase: number;
  readonly averageAlternativesPerCase: number;
  readonly casesByType: Record<string, number>;
  readonly casesByStage: Record<string, number>;
  readonly confidenceDistribution: Record<string, number>;
  readonly totalHypothesesGenerated: number;
  readonly totalAlternativesGenerated: number;
  readonly totalConstraintsEvaluated: number;
  readonly totalInferencesPerformed: number;
}
