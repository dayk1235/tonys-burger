import { Memory, MemoryStage } from "./MemoryTypes";

export interface RetentionPolicy {
  readonly baseDecayRate: number;
  readonly accessBoost: number;
  readonly strengthThreshold: number;
  readonly minimumRetention: number;
}

const DEFAULT_RETENTION_POLICIES: Record<MemoryStage, RetentionPolicy> = {
  WORKING: { baseDecayRate: 0.3, accessBoost: 0.2, strengthThreshold: 0.2, minimumRetention: 0.1 },
  CANDIDATE: { baseDecayRate: 0.2, accessBoost: 0.15, strengthThreshold: 0.3, minimumRetention: 0.2 },
  SHORT_TERM: { baseDecayRate: 0.15, accessBoost: 0.12, strengthThreshold: 0.4, minimumRetention: 0.3 },
  STABILIZING: { baseDecayRate: 0.1, accessBoost: 0.1, strengthThreshold: 0.5, minimumRetention: 0.4 },
  CONSOLIDATED: { baseDecayRate: 0.08, accessBoost: 0.08, strengthThreshold: 0.5, minimumRetention: 0.5 },
  LONG_TERM: { baseDecayRate: 0.05, accessBoost: 0.05, strengthThreshold: 0.6, minimumRetention: 0.6 },
  SEMANTIC: { baseDecayRate: 0.03, accessBoost: 0.03, strengthThreshold: 0.7, minimumRetention: 0.7 },
  HISTORICAL: { baseDecayRate: 0.01, accessBoost: 0.01, strengthThreshold: 0.8, minimumRetention: 0.5 },
  ARCHIVED: { baseDecayRate: 0, accessBoost: 0, strengthThreshold: 1, minimumRetention: 1 },
};

export class MemoryRetention {
  computeRetentionScore(memory: Memory): number {
    const policy = this.getPolicy(memory.stage);
    const decayFactor = this.computeDecay(memory, policy);
    const accessBoost = this.computeAccessBoost(memory, policy);
    const strengthFactor = memory.strength;

    const raw = strengthFactor * decayFactor + accessBoost;
    return Math.max(policy.minimumRetention, Math.min(1, raw));
  }

  getDecayRate(memory: Memory): number {
    const policy = this.getPolicy(memory.stage);
    const ageFactor = this.computeAgeFactor(memory);
    return policy.baseDecayRate * ageFactor;
  }

  applyDecay(memory: Memory): Memory {
    const newRetention = this.computeRetentionScore(memory);
    return {
      ...memory,
      retentionScore: newRetention,
    };
  }

  applyAccess(memory: Memory): Memory {
    const now = new Date().toISOString();
    const newAccessCount = memory.metadata.totalAccessCount + 1;

    return {
      ...memory,
      activationScore: Math.min(1, memory.activationScore + 0.1),
      metadata: {
        ...memory.metadata,
        totalAccessCount: newAccessCount,
        lastAccessedAt: now,
      },
    };
  }

  applyStrengthen(memory: Memory, boost: number): Memory {
    const now = new Date().toISOString();
    return {
      ...memory,
      strength: Math.min(1, memory.strength + boost),
      retentionScore: Math.min(1, memory.retentionScore + boost * 0.5),
      metadata: {
        ...memory.metadata,
        lastStrengthenedAt: now,
      },
    };
  }

  applyWeaken(memory: Memory, penalty: number): Memory {
    return {
      ...memory,
      strength: Math.max(0, memory.strength - penalty),
      retentionScore: Math.max(0, memory.retentionScore - penalty * 0.5),
    };
  }

  getPolicy(stage: MemoryStage): RetentionPolicy {
    return DEFAULT_RETENTION_POLICIES[stage] || DEFAULT_RETENTION_POLICIES.WORKING;
  }

  private computeDecay(memory: Memory, policy: RetentionPolicy): number {
    const now = Date.now();
    const lastAccess = new Date(memory.metadata.lastAccessedAt).getTime();
    const daysSinceAccess = (now - lastAccess) / (1000 * 60 * 60 * 24);
    const decayAmount = policy.baseDecayRate * daysSinceAccess;
    return Math.max(0.1, 1 - decayAmount);
  }

  private computeAccessBoost(memory: Memory, policy: RetentionPolicy): number {
    if (memory.metadata.totalAccessCount === 0) return 0;
    const recentBoost = Math.min(policy.accessBoost, memory.metadata.totalAccessCount * 0.02);
    return recentBoost;
  }

  private computeAgeFactor(memory: Memory): number {
    const now = Date.now();
    const createdAt = new Date(memory.identity.createdAt).getTime();
    const ageDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    if (ageDays > 90) return 0.5;
    if (ageDays > 30) return 0.7;
    return 1;
  }
}
