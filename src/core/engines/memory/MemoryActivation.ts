import { Memory, MemoryStage, AssociationType } from "./MemoryTypes";

export class MemoryActivation {
  activate(memory: Memory): Memory {
    const now = new Date().toISOString();
    const newActivationScore = this.computeActivation(memory);

    return {
      ...memory,
      activationScore: newActivationScore,
      recallScore: Math.min(1, memory.recallScore + 0.05),
      metadata: {
        ...memory.metadata,
        totalAccessCount: memory.metadata.totalAccessCount + 1,
        lastAccessedAt: now,
      },
    };
  }

  spreadActivation(memory: Memory, memories: Memory[], decayFactor = 0.5): Memory[] {
    const activated: Memory[] = [];
    const sourceStrength = memory.activationScore;

    for (const target of memories) {
      if (target.id === memory.id) continue;

      const association = memory.associations.find((a) => a.targetMemoryId === target.id);
      if (!association) continue;

      const spread = sourceStrength * association.strength * decayFactor;
      const newActivation = Math.min(1, target.activationScore + spread);

      activated.push({
        ...target,
        activationScore: newActivation,
        recallScore: Math.min(1, target.recallScore + spread * 0.5),
        metadata: {
          ...target.metadata,
          lastAccessedAt: new Date().toISOString(),
        },
      });
    }

    return activated;
  }

  decayActivation(memory: Memory, factor = 0.1): Memory {
    return {
      ...memory,
      activationScore: Math.max(0, memory.activationScore - factor),
    };
  }

  computeActivation(memory: Memory): number {
    const now = Date.now();
    const lastAccess = new Date(memory.metadata.lastAccessedAt).getTime();
    const hoursSinceAccess = (now - lastAccess) / (1000 * 60 * 60);

    const recencyFactor = hoursSinceAccess <= 1 ? 1 : hoursSinceAccess <= 24 ? 0.8 : hoursSinceAccess <= 168 ? 0.5 : 0.2;
    const strengthFactor = memory.strength;
    const accessFactor = Math.min(1, memory.metadata.totalAccessCount / 30);

    return Math.max(0, Math.min(1,
      recencyFactor * 0.4 + strengthFactor * 0.3 + accessFactor * 0.2 + 0.1
    ));
  }

  isActive(memory: Memory, threshold = 0.3): boolean {
    return memory.activationScore >= threshold;
  }

  getMostActive(memories: Memory[], count: number): Memory[] {
    return [...memories]
      .sort((a, b) => b.activationScore - a.activationScore)
      .slice(0, count);
  }
}
