import { PlanningEntity, PlanningStage } from "./PlanningTypes";
import { PlanningQuery } from "./PlanningContracts";

const ACTIVE_STAGES: PlanningStage[] = [
  "INITIATED",
  "ANALYZED",
  "PLAN_GENERATED",
  "OPTIMIZED",
  "VALIDATED",
  "READY",
];

const ARCHIVED_STAGES: PlanningStage[] = ["ARCHIVED"];

export class PlanningMemory implements PlanningQuery {
  private items: Map<string, PlanningEntity> = new Map();

  async store(entity: PlanningEntity): Promise<void> {
    this.items.set(entity.id, entity);
  }

  async findById(id: string): Promise<PlanningEntity | undefined> {
    return this.items.get(id);
  }

  async findActive(): Promise<PlanningEntity[]> {
    return this.find((e) => ACTIVE_STAGES.includes(e.stage));
  }

  async findByRecommendationId(recommendationId: string): Promise<PlanningEntity[]> {
    return this.find((e) => e.recommendationId === recommendationId);
  }

  async findByStage(stage: PlanningStage): Promise<PlanningEntity[]> {
    return this.find((e) => e.stage === stage);
  }

  async findAll(): Promise<PlanningEntity[]> {
    return Array.from(this.items.values());
  }

  async find(predicate: (e: PlanningEntity) => boolean): Promise<PlanningEntity[]> {
    const results: PlanningEntity[] = [];
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
