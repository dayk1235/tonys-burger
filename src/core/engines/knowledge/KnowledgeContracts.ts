import { Knowledge, KnowledgeStage, KnowledgeCategory } from "./KnowledgeTypes";

export interface KnowledgeSubscriber {
  onKnowledgeCreated(knowledge: Knowledge): Promise<void>;
  onKnowledgeUpdated(knowledge: Knowledge): Promise<void>;
  onKnowledgeStageChanged(knowledgeId: string, from: KnowledgeStage, to: KnowledgeStage): Promise<void>;
  onKnowledgeDeprecated(knowledgeId: string): Promise<void>;
}

export interface KnowledgeQuery {
  findById(id: string): Promise<Knowledge | undefined>;
  findByCategory(category: KnowledgeCategory): Promise<Knowledge[]>;
  findByStage(stage: KnowledgeStage): Promise<Knowledge[]>;
  findByMemoryId(memoryId: string): Promise<Knowledge[]>;
  findByPatternId(patternId: string): Promise<Knowledge[]>;
  findCanonical(): Promise<Knowledge[]>;
  search(query: string): Promise<Knowledge[]>;
}

export interface KnowledgeEngineMetrics {
  readonly totalKnowledgeCreated: number;
  readonly validatedKnowledgeCount: number;
  readonly canonicalKnowledgeCount: number;
  readonly deprecatedKnowledgeCount: number;
  readonly archivedKnowledgeCount: number;
  readonly activeKnowledgeCount: number;
  readonly averageConfidence: number;
  readonly averageIntegrity: number;
  readonly averageAbstractionLevel: number;
  readonly knowledgeByCategory: Record<string, number>;
  readonly knowledgeByStage: Record<string, number>;
  readonly totalGraphNodes: number;
  readonly totalGraphEdges: number;
  readonly totalConcepts: number;
  readonly generalizationsPerformed: number;
  readonly specializationsPerformed: number;
  readonly extractionsPerformed: number;
}
