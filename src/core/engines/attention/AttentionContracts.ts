import { Attention, AttentionStage, AttentionCategory, AttentionBudget, FocusState } from "./AttentionTypes";

export interface AttentionSubscriber {
  onAttentionCreated(attention: Attention): Promise<void>;
  onAttentionUpdated(attention: Attention): Promise<void>;
  onAttentionStageChanged(attentionId: string, from: AttentionStage, to: AttentionStage): Promise<void>;
  onAttentionFocusChanged(attentionId: string | null): Promise<void>;
  onAttentionInterrupted(attentionId: string, level: string): Promise<void>;
  onAttentionReleased(attentionId: string): Promise<void>;
}

export interface AttentionQuery {
  findById(id: string): Promise<Attention | undefined>;
  findByCategory(category: AttentionCategory): Promise<Attention[]>;
  findByStage(stage: AttentionStage): Promise<Attention[]>;
  findBySourceId(sourceId: string): Promise<Attention[]>;
  findFocused(): Promise<Attention | undefined>;
  findQueued(): Promise<Attention[]>;
  findDeferred(): Promise<Attention[]>;
  findActive(): Promise<Attention[]>;
}

export interface AttentionEngineMetrics {
  readonly totalAttentionCreated: number;
  readonly focusedCount: number;
  readonly maintainedCount: number;
  readonly interruptedCount: number;
  readonly deferredCount: number;
  readonly releasedCount: number;
  readonly archivedCount: number;
  readonly activeAttentionCount: number;
  readonly averagePriority: number;
  readonly averageAllocation: number;
  readonly averageAge: number;
  readonly attentionByCategory: Record<string, number>;
  readonly attentionByStage: Record<string, number>;
  readonly totalInterruptions: number;
  readonly totalEscalations: number;
  readonly totalStarvationBoosts: number;
  readonly totalContextSwitches: number;
  readonly budgetUtilization: number;
  readonly budgetTotal: number;
  readonly budgetAvailable: number;
}
