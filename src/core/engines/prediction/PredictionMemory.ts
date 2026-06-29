import { PredictionEntity, PredictionStage } from "./PredictionTypes";
import { PredictionQuery } from "./PredictionContracts";

const ACTIVE_STAGES: PredictionStage[] = [
  "INITIATED",
  "DATA_COLLECTED",
  "MODEL_APPLIED",
  "CONFIDENCE_EVALUATED",
  "PREDICTION_READY",
];

export class PredictionMemory implements PredictionQuery {
  private items: Map<string, PredictionEntity> = new Map();

  async store(entity: PredictionEntity): Promise<void> {
    this.items.set(entity.id, entity);
  }

  async findById(id: string): Promise<PredictionEntity | undefined> {
    return this.items.get(id);
  }

  async findActive(): Promise<PredictionEntity[]> {
    return this.find((e) => ACTIVE_STAGES.includes(e.stage));
  }

  async findByLearningId(learningId: string): Promise<PredictionEntity[]> {
    return this.find((e) => e.learningId === learningId);
  }

  async findByStage(stage: PredictionStage): Promise<PredictionEntity[]> {
    return this.find((e) => e.stage === stage);
  }

  async findAll(): Promise<PredictionEntity[]> {
    return Array.from(this.items.values());
  }

  async find(predicate: (e: PredictionEntity) => boolean): Promise<PredictionEntity[]> {
    const results: PredictionEntity[] = [];
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
