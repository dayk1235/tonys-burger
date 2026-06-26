import { Memory } from "./MemoryTypes";

export class MemoryStrength {
  computeStrength(memory: Memory): number {
    const baseStrength = memory.strength;
    const accessBonus = this.computeAccessBonus(memory);
    const versionBonus = this.computeVersionBonus(memory);
    const associationBonus = this.computeAssociationBonus(memory);
    const recencyBoost = this.computeRecencyBoost(memory);

    const raw = baseStrength + accessBonus + versionBonus + associationBonus + recencyBoost;
    return Math.max(0, Math.min(1, raw));
  }

  strengthen(memory: Memory, amount: number): Memory {
    const now = new Date().toISOString();
    return {
      ...memory,
      strength: Math.min(1, memory.strength + amount),
      recallScore: Math.min(1, memory.recallScore + amount * 0.3),
      metadata: {
        ...memory.metadata,
        lastStrengthenedAt: now,
      },
    };
  }

  weaken(memory: Memory, amount: number): Memory {
    return {
      ...memory,
      strength: Math.max(0, memory.strength - amount),
      recallScore: Math.max(0, memory.recallScore - amount * 0.3),
    };
  }

  normalizeStrength(memory: Memory, targetMean: number): Memory {
    const diff = targetMean - memory.strength;
    return {
      ...memory,
      strength: Math.max(0, Math.min(1, memory.strength + diff * 0.1)),
    };
  }

  private computeAccessBonus(memory: Memory): number {
    if (memory.metadata.totalAccessCount === 0) return 0;
    const bonus = Math.min(0.1, memory.metadata.totalAccessCount * 0.01);
    return bonus;
  }

  private computeVersionBonus(memory: Memory): number {
    if (memory.versions.length < 2) return 0;
    return Math.min(0.05, memory.versions.length * 0.01);
  }

  private computeAssociationBonus(memory: Memory): number {
    if (memory.associations.length === 0) return 0;
    return Math.min(0.08, memory.associations.length * 0.01);
  }

  private computeRecencyBoost(memory: Memory): number {
    const now = Date.now();
    const lastStrengthened = new Date(memory.metadata.lastStrengthenedAt).getTime();
    const daysSince = (now - lastStrengthened) / (1000 * 60 * 60 * 24);
    if (daysSince <= 1) return 0.05;
    if (daysSince <= 7) return 0.02;
    return 0;
  }
}
