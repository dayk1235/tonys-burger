import { Pattern, PatternStage, PatternCategory } from "./PatternTypes";

export class PatternMemory {
  private data: Map<string, Pattern> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();
  private stageIndex: Map<string, Set<string>> = new Map();
  private businessIndex: Map<string, Set<string>> = new Map();
  private observationIndex: Map<string, Set<string>> = new Map();

  async persist(pattern: Pattern): Promise<void> {
    const existing = this.data.get(pattern.id);
    this.data.set(pattern.id, pattern);

    this.indexPattern(pattern);

    if (existing) {
      this.removeFromObservationIndex(existing.id, existing.originObservations);
    }
    this.addToObservationIndex(pattern.id, pattern.originObservations);
  }

  async retrieve(id: string): Promise<Pattern | undefined> {
    return this.data.get(id);
  }

  async findByCategory(category: PatternCategory | string): Promise<Pattern[]> {
    const ids = this.categoryIndex.get(category);
    if (!ids) return [];
    return Array.from(ids)
      .map((id: string) => this.data.get(id))
      .filter((p): p is Pattern => p !== undefined);
  }

  async findByStage(stage: PatternStage): Promise<Pattern[]> {
    const ids = this.stageIndex.get(stage);
    if (!ids) return [];
    return Array.from(ids)
      .map((id: string) => this.data.get(id))
      .filter((p): p is Pattern => p !== undefined);
  }

  async findActive(): Promise<Pattern[]> {
    const activeStages: PatternStage[] = ["EMERGING", "SUPPORTED", "VALIDATED", "STRENGTHENING"];
    const results: Pattern[] = [];
    for (const stage of activeStages) {
      const patterns = await this.findByStage(stage);
      results.push(...patterns);
    }
    return results;
  }

  async findByObservationId(observationId: string): Promise<Pattern[]> {
    const ids = this.observationIndex.get(observationId);
    if (!ids) return [];
    return Array.from(ids)
      .map((id: string) => this.data.get(id))
      .filter((p): p is Pattern => p !== undefined);
  }

  async findByBusinessId(businessId: string): Promise<Pattern[]> {
    const ids = this.businessIndex.get(businessId);
    if (!ids) return [];
    return Array.from(ids)
      .map((id: string) => this.data.get(id))
      .filter((p): p is Pattern => p !== undefined);
  }

  async getAll(): Promise<Pattern[]> {
    return Array.from(this.data.values());
  }

  async search(query: string): Promise<Pattern[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.data.values()).filter(
      (p: Pattern) =>
        p.identity.name.toLowerCase().includes(lowerQuery) ||
        p.summary.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.businessRelevance.toLowerCase().includes(lowerQuery)
    );
  }

  async remove(id: string): Promise<boolean> {
    const pattern = this.data.get(id);
    if (!pattern) return false;

    this.data.delete(id);
    this.removeFromIndex(id, pattern);
    return true;
  }

  count(): number {
    return this.data.size;
  }

  countByStage(stage: PatternStage): number {
    return this.stageIndex.get(stage)?.size ?? 0;
  }

  countByCategory(category: PatternCategory | string): number {
    return this.categoryIndex.get(category)?.size ?? 0;
  }

  private indexPattern(pattern: Pattern): void {
    const id = pattern.id;

    const catSet = this.categoryIndex.get(pattern.identity.category) || new Set();
    catSet.add(id);
    this.categoryIndex.set(pattern.identity.category, catSet);

    const stageSet = this.stageIndex.get(pattern.stage) || new Set();
    stageSet.add(id);
    this.stageIndex.set(pattern.stage, stageSet);
  }

  private addToObservationIndex(patternId: string, observationIds: readonly string[]): void {
    for (const obsId of observationIds) {
      const set = this.observationIndex.get(obsId) || new Set();
      set.add(patternId);
      this.observationIndex.set(obsId, set);
    }
  }

  private removeFromObservationIndex(patternId: string, observationIds: readonly string[]): void {
    for (const obsId of observationIds) {
      const set = this.observationIndex.get(obsId);
      if (set) {
        set.delete(patternId);
        if (set.size === 0) this.observationIndex.delete(obsId);
      }
    }
  }

  private removeFromIndex(id: string, pattern: Pattern): void {
    this.categoryIndex.get(pattern.identity.category)?.delete(id);
    this.stageIndex.get(pattern.stage)?.delete(id);
    this.removeFromObservationIndex(id, pattern.originObservations);
  }
}
