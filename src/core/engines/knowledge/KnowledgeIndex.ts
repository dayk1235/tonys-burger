import { Knowledge, KnowledgeStage, KnowledgeCategory } from "./KnowledgeTypes";

export interface KnowledgeIndexEntry {
  readonly knowledgeId: string;
  readonly name: string;
  readonly category: KnowledgeCategory;
  readonly stage: KnowledgeStage;
  readonly confidence: number;
  readonly integrity: number;
  readonly abstractionLevel: number;
  readonly lastValidatedAt: string;
}

export class KnowledgeIndex {
  private byId: Map<string, Knowledge> = new Map();
  private byCategory: Map<KnowledgeCategory, Set<string>> = new Map();
  private byStage: Map<KnowledgeStage, Set<string>> = new Map();
  private byMemoryId: Map<string, Set<string>> = new Map();
  private byPatternId: Map<string, Set<string>> = new Map();

  index(knowledge: Knowledge): void {
    this.byId.set(knowledge.id, knowledge);

    const categorySet = this.byCategory.get(knowledge.identity.category) || new Set();
    categorySet.add(knowledge.id);
    this.byCategory.set(knowledge.identity.category, categorySet);

    const stageSet = this.byStage.get(knowledge.stage) || new Set();
    stageSet.add(knowledge.id);
    this.byStage.set(knowledge.stage, stageSet);

    const memorySet = this.byMemoryId.get(knowledge.identity.memoryId) || new Set();
    memorySet.add(knowledge.id);
    this.byMemoryId.set(knowledge.identity.memoryId, memorySet);

    const patternSet = this.byPatternId.get(knowledge.identity.patternId) || new Set();
    patternSet.add(knowledge.id);
    this.byPatternId.set(knowledge.identity.patternId, patternSet);
  }

  remove(knowledgeId: string): void {
    const knowledge = this.byId.get(knowledgeId);
    if (!knowledge) return;

    this.byId.delete(knowledgeId);
    this.byCategory.get(knowledge.identity.category)?.delete(knowledgeId);
    this.byStage.get(knowledge.stage)?.delete(knowledgeId);
    this.byMemoryId.get(knowledge.identity.memoryId)?.delete(knowledgeId);
    this.byPatternId.get(knowledge.identity.patternId)?.delete(knowledgeId);
  }

  getById(id: string): Knowledge | undefined {
    return this.byId.get(id);
  }

  getByCategory(category: KnowledgeCategory): Knowledge[] {
    const ids = this.byCategory.get(category);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)).filter((k): k is Knowledge => k !== undefined);
  }

  getByStage(stage: KnowledgeStage): Knowledge[] {
    const ids = this.byStage.get(stage);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)).filter((k): k is Knowledge => k !== undefined);
  }

  getByMemoryId(memoryId: string): Knowledge[] {
    const ids = this.byMemoryId.get(memoryId);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)).filter((k): k is Knowledge => k !== undefined);
  }

  getByPatternId(patternId: string): Knowledge[] {
    const ids = this.byPatternId.get(patternId);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)).filter((k): k is Knowledge => k !== undefined);
  }

  getAll(): Knowledge[] {
    return [...this.byId.values()];
  }

  count(): number {
    return this.byId.size;
  }

  clear(): void {
    this.byId.clear();
    this.byCategory.clear();
    this.byStage.clear();
    this.byMemoryId.clear();
    this.byPatternId.clear();
  }

  getSnapshot(): KnowledgeIndexEntry[] {
    return [...this.byId.values()].map((k) => ({
      knowledgeId: k.id,
      name: k.identity.name,
      category: k.identity.category,
      stage: k.stage,
      confidence: k.confidence,
      integrity: k.integrity,
      abstractionLevel: k.abstractionLevel,
      lastValidatedAt: k.metadata.lastValidatedAt,
    }));
  }
}
