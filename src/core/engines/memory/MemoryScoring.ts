import { Memory } from "./MemoryTypes";

export class MemoryScoring {
  computeRetentionScore(memory: Memory): number {
    const accessFrequency = this.computeAccessFrequency(memory);
    const recency = this.computeRecency(memory);
    const strength = memory.strength;
    const associationCount = Math.min(1, memory.associations.length / 10);

    return Math.max(0, Math.min(1,
      accessFrequency * 0.3 + recency * 0.3 + strength * 0.25 + associationCount * 0.15
    ));
  }

  computeActivationScore(memory: Memory): number {
    const now = Date.now();
    const lastAccess = new Date(memory.metadata.lastAccessedAt).getTime();
    const hoursSinceAccess = (now - lastAccess) / (1000 * 60 * 60);

    const recencyFactor = hoursSinceAccess <= 1 ? 1 : hoursSinceAccess <= 24 ? 0.8 : hoursSinceAccess <= 168 ? 0.5 : 0.2;
    const strengthFactor = memory.strength;
    const accessCountFactor = Math.min(1, memory.metadata.totalAccessCount / 50);

    return Math.max(0, Math.min(1,
      recencyFactor * 0.5 + strengthFactor * 0.3 + accessCountFactor * 0.2
    ));
  }

  computeConsolidationReadiness(memory: Memory): number {
    const accessCount = memory.metadata.totalAccessCount;
    const versionCount = memory.versions.length;
    const strength = memory.strength;

    const accessScore = Math.min(1, accessCount / 10);
    const versionScore = Math.min(1, versionCount / 5);
    const strengthScore = strength;

    return Math.max(0, Math.min(1,
      accessScore * 0.4 + strengthScore * 0.35 + versionScore * 0.25
    ));
  }

  computeForgettingRisk(memory: Memory): number {
    const now = Date.now();
    const lastAccess = new Date(memory.metadata.lastAccessedAt).getTime();
    const daysSinceAccess = (now - lastAccess) / (1000 * 60 * 60 * 24);
    const decayRate = memory.metadata.decayRate;
    const strength = memory.strength;

    const timeDecay = Math.min(1, daysSinceAccess * decayRate);
    const strengthResistance = 1 - strength;

    return Math.max(0, Math.min(1, timeDecay * 0.6 + strengthResistance * 0.4));
  }

  evaluate(memory: Memory): {
    retentionScore: number;
    activationScore: number;
    consolidationReadiness: number;
    forgettingRisk: number;
  } {
    return {
      retentionScore: this.computeRetentionScore(memory),
      activationScore: this.computeActivationScore(memory),
      consolidationReadiness: this.computeConsolidationReadiness(memory),
      forgettingRisk: this.computeForgettingRisk(memory),
    };
  }

  private computeAccessFrequency(memory: Memory): number {
    if (memory.metadata.totalAccessCount === 0) return 0;
    const now = Date.now();
    const createdAt = new Date(memory.identity.createdAt).getTime();
    const ageDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    if (ageDays < 1) return Math.min(1, memory.metadata.totalAccessCount / 5);
    const accessesPerDay = memory.metadata.totalAccessCount / ageDays;
    return Math.min(1, accessesPerDay / 3);
  }

  private computeRecency(memory: Memory): number {
    const now = Date.now();
    const lastAccess = new Date(memory.metadata.lastAccessedAt).getTime();
    const hoursSinceAccess = (now - lastAccess) / (1000 * 60 * 60);
    if (hoursSinceAccess <= 1) return 1;
    if (hoursSinceAccess <= 24) return 0.8;
    if (hoursSinceAccess <= 168) return 0.5;
    if (hoursSinceAccess <= 720) return 0.2;
    return 0.05;
  }
}
