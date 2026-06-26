import { Memory, MemoryStage, MemoryCategory } from "./MemoryTypes";

export interface MemoryIndexEntry {
  readonly memoryId: string;
  readonly name: string;
  readonly category: MemoryCategory;
  readonly stage: MemoryStage;
  readonly strength: number;
  readonly confidence: number;
  readonly activationScore: number;
  readonly lastAccessedAt: string;
}

export class MemoryIndex {
  private byId: Map<string, Memory> = new Map();
  private byCategory: Map<MemoryCategory, Set<string>> = new Map();
  private byStage: Map<MemoryStage, Set<string>> = new Map();
  private byPatternId: Map<string, Set<string>> = new Map();
  private byEvidenceId: Map<string, Set<string>> = new Map();

  index(memory: Memory): void {
    this.byId.set(memory.id, memory);

    const categorySet = this.byCategory.get(memory.identity.category) || new Set();
    categorySet.add(memory.id);
    this.byCategory.set(memory.identity.category, categorySet);

    const stageSet = this.byStage.get(memory.stage) || new Set();
    stageSet.add(memory.id);
    this.byStage.set(memory.stage, stageSet);

    const patternSet = this.byPatternId.get(memory.identity.patternId) || new Set();
    patternSet.add(memory.id);
    this.byPatternId.set(memory.identity.patternId, patternSet);

    const evidenceSet = this.byEvidenceId.get(memory.identity.evidenceId) || new Set();
    evidenceSet.add(memory.id);
    this.byEvidenceId.set(memory.identity.evidenceId, evidenceSet);
  }

  remove(memoryId: string): void {
    const memory = this.byId.get(memoryId);
    if (!memory) return;

    this.byId.delete(memoryId);
    this.byCategory.get(memory.identity.category)?.delete(memoryId);
    this.byStage.get(memory.stage)?.delete(memoryId);
    this.byPatternId.get(memory.identity.patternId)?.delete(memoryId);
    this.byEvidenceId.get(memory.identity.evidenceId)?.delete(memoryId);
  }

  getById(id: string): Memory | undefined {
    return this.byId.get(id);
  }

  getByCategory(category: MemoryCategory): Memory[] {
    const ids = this.byCategory.get(category);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)).filter((m): m is Memory => m !== undefined);
  }

  getByStage(stage: MemoryStage): Memory[] {
    const ids = this.byStage.get(stage);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)).filter((m): m is Memory => m !== undefined);
  }

  getByPatternId(patternId: string): Memory[] {
    const ids = this.byPatternId.get(patternId);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)).filter((m): m is Memory => m !== undefined);
  }

  getByEvidenceId(evidenceId: string): Memory[] {
    const ids = this.byEvidenceId.get(evidenceId);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)).filter((m): m is Memory => m !== undefined);
  }

  getAll(): Memory[] {
    return [...this.byId.values()];
  }

  count(): number {
    return this.byId.size;
  }

  clear(): void {
    this.byId.clear();
    this.byCategory.clear();
    this.byStage.clear();
    this.byPatternId.clear();
    this.byEvidenceId.clear();
  }

  getSnapshot(): MemoryIndexEntry[] {
    return [...this.byId.values()].map((m) => ({
      memoryId: m.id,
      name: m.identity.name,
      category: m.identity.category,
      stage: m.stage,
      strength: m.strength,
      confidence: m.confidence,
      activationScore: m.activationScore,
      lastAccessedAt: m.metadata.lastAccessedAt,
    }));
  }
}
