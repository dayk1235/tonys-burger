import { RecommendationEntity, RecommendationStage } from "./RecommendationTypes";
import { RecommendationQuery } from "./RecommendationContracts";

const ACTIVE_STAGES: RecommendationStage[] = [
  "INITIATED",
  "ANALYZED",
  "PRIORITIZED",
  "OPTIMIZED",
  "READY",
];

const ARCHIVED_STAGES: RecommendationStage[] = ["ARCHIVED"];

export class RecommendationMemory implements RecommendationQuery {
  private items: Map<string, RecommendationEntity> = new Map();

  async store(entity: RecommendationEntity): Promise<void> {
    this.items.set(entity.id, entity);
  }

  async findById(id: string): Promise<RecommendationEntity | undefined> {
    return this.items.get(id);
  }

  async findActive(): Promise<RecommendationEntity[]> {
    return this.find((e) => ACTIVE_STAGES.includes(e.stage));
  }

  async findByPredictionId(predictionId: string): Promise<RecommendationEntity[]> {
    return this.find((e) => e.predictionId === predictionId);
  }

  async findByStage(stage: RecommendationStage): Promise<RecommendationEntity[]> {
    return this.find((e) => e.stage === stage);
  }

  async findAll(): Promise<RecommendationEntity[]> {
    return Array.from(this.items.values());
  }

  async find(predicate: (e: RecommendationEntity) => boolean): Promise<RecommendationEntity[]> {
    const results: RecommendationEntity[] = [];
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
