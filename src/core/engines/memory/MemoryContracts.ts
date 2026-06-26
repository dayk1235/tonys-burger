import { Memory, MemoryStage, MemoryCategory } from "./MemoryTypes";

export interface MemorySubscriber {
  onMemoryCreated(memory: Memory): Promise<void>;
  onMemoryUpdated(memory: Memory): Promise<void>;
  onMemoryStageChanged(memoryId: string, from: MemoryStage, to: MemoryStage): Promise<void>;
  onMemoryForgotten(memoryId: string): Promise<void>;
}

export interface MemoryQuery {
  findById(id: string): Promise<Memory | undefined>;
  findByCategory(category: MemoryCategory): Promise<Memory[]>;
  findByStage(stage: MemoryStage): Promise<Memory[]>;
  findByPatternId(patternId: string): Promise<Memory[]>;
  findByEvidenceId(evidenceId: string): Promise<Memory[]>;
  findConsolidated(): Promise<Memory[]>;
  findLongTerm(): Promise<Memory[]>;
  search(query: string): Promise<Memory[]>;
}

export interface MemoryEngineMetrics {
  readonly totalMemoriesCreated: number;
  readonly consolidatedMemoryCount: number;
  readonly longTermMemoryCount: number;
  readonly forgottenMemoryCount: number;
  readonly archivedMemoryCount: number;
  readonly activeMemoryCount: number;
  readonly averageStrength: number;
  readonly averageConfidence: number;
  readonly averageRecallScore: number;
  readonly memoryByCategory: Record<string, number>;
  readonly memoryByStage: Record<string, number>;
  readonly totalAssociations: number;
  readonly mergesPerformed: number;
  readonly compressionsPerformed: number;
  readonly reactivationsPerformed: number;
}
