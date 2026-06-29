import { ExecutionEntity, ExecutionStage } from "./ExecutionTypes";
import { ExecutionQuery } from "./ExecutionContracts";

const ACTIVE_STAGES: ExecutionStage[] = [
  "INITIATED",
  "QUEUED",
  "PREPARING",
  "RUNNING",
  "VERIFYING",
];

const ARCHIVED_STAGES: ExecutionStage[] = ["ARCHIVED"];

export class ExecutionMemory implements ExecutionQuery {
  private items: Map<string, ExecutionEntity> = new Map();

  async store(entity: ExecutionEntity): Promise<void> {
    this.items.set(entity.id, entity);
  }

  async findById(id: string): Promise<ExecutionEntity | undefined> {
    return this.items.get(id);
  }

  async findByPlanId(planId: string): Promise<ExecutionEntity[]> {
    return this.find((e) => e.planId === planId);
  }

  async findByStage(stage: ExecutionStage): Promise<ExecutionEntity[]> {
    return this.find((e) => e.stage === stage);
  }

  async findActive(): Promise<ExecutionEntity[]> {
    return this.find((e) => ACTIVE_STAGES.includes(e.stage));
  }

  async findArchived(): Promise<ExecutionEntity[]> {
    return this.find((e) => ARCHIVED_STAGES.includes(e.stage));
  }

  async findAll(): Promise<ExecutionEntity[]> {
    return Array.from(this.items.values());
  }

  async find(predicate: (e: ExecutionEntity) => boolean): Promise<ExecutionEntity[]> {
    const results: ExecutionEntity[] = [];
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
