import { Memory, MemoryStage } from "./MemoryTypes";
import { MemoryFactory } from "./MemoryFactory";
import { MemoryLifecycle } from "./MemoryLifecycle";
import { MemoryForgettingError } from "./MemoryErrors";

export interface ForgettingCriteria {
  readonly retentionThreshold: number;
  readonly daysSinceAccess: number;
  readonly strengthThreshold: number;
  readonly requireOr: boolean;
}

const STAGE_FORGETTING_CRITERIA: Record<MemoryStage, ForgettingCriteria> = {
  WORKING: { retentionThreshold: 0.1, daysSinceAccess: 7, strengthThreshold: 0.1, requireOr: true },
  CANDIDATE: { retentionThreshold: 0.15, daysSinceAccess: 14, strengthThreshold: 0.15, requireOr: true },
  SHORT_TERM: { retentionThreshold: 0.2, daysSinceAccess: 30, strengthThreshold: 0.2, requireOr: true },
  STABILIZING: { retentionThreshold: 0.25, daysSinceAccess: 60, strengthThreshold: 0.25, requireOr: false },
  CONSOLIDATED: { retentionThreshold: 0.3, daysSinceAccess: 90, strengthThreshold: 0.3, requireOr: false },
  LONG_TERM: { retentionThreshold: 0.2, daysSinceAccess: 180, strengthThreshold: 0.2, requireOr: false },
  SEMANTIC: { retentionThreshold: 0.15, daysSinceAccess: 365, strengthThreshold: 0.15, requireOr: false },
  HISTORICAL: { retentionThreshold: 0.1, daysSinceAccess: 730, strengthThreshold: 0.1, requireOr: false },
  ARCHIVED: { retentionThreshold: 0, daysSinceAccess: 99999, strengthThreshold: 0, requireOr: false },
};

export class MemoryForgetting {
  constructor(
    private readonly factory: MemoryFactory,
    private readonly lifecycle: MemoryLifecycle
  ) {}

  shouldForget(memory: Memory): boolean {
    if (this.lifecycle.isTerminal(memory.stage)) return false;

    const criteria = this.getForgettingCriteria(memory.stage);
    const now = Date.now();
    const lastAccess = new Date(memory.metadata.lastAccessedAt).getTime();
    const daysSinceAccess = (now - lastAccess) / (1000 * 60 * 60 * 24);

    const belowRetention = memory.retentionScore < criteria.retentionThreshold;
    const belowStrength = memory.strength < criteria.strengthThreshold;
    const staleAccess = daysSinceAccess > criteria.daysSinceAccess;

    if (criteria.requireOr) {
      return (belowRetention || belowStrength) && staleAccess;
    }
    return belowRetention && belowStrength && staleAccess;
  }

  forget(memory: Memory): Memory {
    if (this.lifecycle.isTerminal(memory.stage)) {
      throw new MemoryForgettingError(memory.id, "Cannot forget a terminal memory");
    }

    this.lifecycle.validateTransition(memory.stage, "HISTORICAL");

    return this.factory.cloneWithTransition(memory, "HISTORICAL", {
      strength: Math.max(0.1, memory.strength * 0.5),
      confidence: Math.max(0.1, memory.confidence * 0.5),
      recallScore: Math.max(0.1, memory.recallScore * 0.3),
      retentionScore: 0.1,
      summary: `Memory forgotten due to inactivity and decay`,
    });
  }

  archive(memory: Memory): Memory {
    if (this.lifecycle.isTerminal(memory.stage)) {
      throw new MemoryForgettingError(memory.id, "Already archived");
    }

    const target: MemoryStage = this.lifecycle.isForgotten(memory.stage) ? "ARCHIVED" : "HISTORICAL";
    this.lifecycle.validateTransition(memory.stage, target);

    return this.factory.cloneWithTransition(memory, target, {
      summary: `Memory moved to ${target.toLowerCase()} storage`,
    });
  }

  reactivate(memory: Memory): Memory {
    if (!this.lifecycle.isForgotten(memory.stage)) {
      return memory;
    }

    const now = new Date().toISOString();
    const targetStage: MemoryStage = "SHORT_TERM";

    this.lifecycle.validateTransition(memory.stage, targetStage);

    return this.factory.cloneWithTransition(memory, targetStage, {
      strength: Math.min(1, memory.strength + 0.2),
      confidence: Math.min(1, memory.confidence + 0.1),
      recallScore: Math.min(1, memory.recallScore + 0.3),
      activationScore: 0.8,
      retentionScore: 0.6,
      summary: `Memory reactivated from ${memory.stage.toLowerCase()}`,
      metadata: {
        ...memory.metadata,
        lastAccessedAt: now,
        totalAccessCount: memory.metadata.totalAccessCount + 1,
      },
    });
  }

  getForgettingCriteria(stage: MemoryStage): ForgettingCriteria {
    return STAGE_FORGETTING_CRITERIA[stage] || STAGE_FORGETTING_CRITERIA.WORKING;
  }
}
