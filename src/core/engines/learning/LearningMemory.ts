import { LearningEntity, LearningStage } from "./LearningTypes";
import { LearningQuery } from "./LearningContracts";

const ACTIVE_STAGES: LearningStage[] = [
  "INITIATED",
  "OBSERVATION_COLLECTED",
  "OUTCOME_ANALYZED",
  "PATTERN_DERIVED",
  "KNOWLEDGE_UPDATED",
];

export class LearningMemory implements LearningQuery {
  private items: Map<string, LearningEntity> = new Map();

  async store(entity: LearningEntity): Promise<void> {
    this.items.set(entity.id, entity);
  }

  async findById(id: string): Promise<LearningEntity | undefined> {
    return this.items.get(id);
  }

  async findActive(): Promise<LearningEntity[]> {
    return this.find((e) => ACTIVE_STAGES.includes(e.stage));
  }

  async findByDecisionId(decisionId: string): Promise<LearningEntity[]> {
    return this.find((e) => e.decisionId === decisionId);
  }

  async findByStage(stage: LearningStage): Promise<LearningEntity[]> {
    return this.find((e) => e.stage === stage);
  }

  async findAll(): Promise<LearningEntity[]> {
    return Array.from(this.items.values());
  }

  async find(predicate: (e: LearningEntity) => boolean): Promise<LearningEntity[]> {
    const results: LearningEntity[] = [];
    for (const item of this.items.values()) {
      if (predicate(item)) results.push(item);
    }
    return results;
  }

  count(): number {
    return this.items.size;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async clear(): Promise<void> {
    this.items.clear();
  }
}
