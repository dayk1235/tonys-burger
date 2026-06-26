import { Memory, MemoryAssociation, AssociationType } from "./MemoryTypes";
import { MemoryAssociationError } from "./MemoryErrors";

export class MemoryAssociations {
  createAssociation(
    source: Memory,
    target: Memory,
    type: AssociationType,
    strength: number,
    metadata?: Readonly<Record<string, unknown>>
  ): MemoryAssociation {
    const now = new Date().toISOString();
    return {
      targetMemoryId: target.id,
      type,
      strength: Math.max(0, Math.min(1, strength)),
      weight: strength,
      discoveredAt: now,
      lastReinforcedAt: now,
      metadata: metadata || {},
    };
  }

  associate(source: Memory, target: Memory, type: AssociationType, strength: number): Memory {
    if (source.id === target.id) {
      throw new MemoryAssociationError(source.id, target.id, "Cannot associate a memory with itself");
    }

    const existingIdx = source.associations.findIndex((a) => a.targetMemoryId === target.id);
    if (existingIdx !== -1) {
      const existing = source.associations[existingIdx];
      const now = new Date().toISOString();
      const updated: MemoryAssociation = {
        ...existing,
        strength: Math.min(1, existing.strength + strength * 0.3),
        weight: Math.min(1, existing.weight + strength * 0.3),
        lastReinforcedAt: now,
      };
      const newAssociations = [...source.associations];
      newAssociations[existingIdx] = updated;
      return { ...source, associations: newAssociations };
    }

    const association = this.createAssociation(source, target, type, strength);
    return {
      ...source,
      associations: [...source.associations, association],
    };
  }

  detach(source: Memory, targetId: string): Memory {
    return {
      ...source,
      associations: source.associations.filter((a) => a.targetMemoryId !== targetId),
    };
  }

  reinforce(source: Memory, targetId: string, amount: number): Memory {
    const idx = source.associations.findIndex((a) => a.targetMemoryId === targetId);
    if (idx === -1) return source;

    const existing = source.associations[idx];
    const now = new Date().toISOString();
    const updated: MemoryAssociation = {
      ...existing,
      strength: Math.min(1, existing.strength + amount),
      weight: Math.min(1, existing.weight + amount),
      lastReinforcedAt: now,
    };

    const newAssociations = [...source.associations];
    newAssociations[idx] = updated;
    return { ...source, associations: newAssociations };
  }

  weaken(source: Memory, targetId: string, amount: number): Memory {
    const idx = source.associations.findIndex((a) => a.targetMemoryId === targetId);
    if (idx === -1) return source;

    const existing = source.associations[idx];
    const updated: MemoryAssociation = {
      ...existing,
      strength: Math.max(0, existing.strength - amount),
      weight: Math.max(0, existing.weight - amount),
    };

    const newAssociations = [...source.associations];
    if (updated.strength <= 0) {
      newAssociations.splice(idx, 1);
    } else {
      newAssociations[idx] = updated;
    }
    return { ...source, associations: newAssociations };
  }

  getAssociationsByType(memory: Memory, type: AssociationType): MemoryAssociation[] {
    return memory.associations.filter((a) => a.type === type);
  }

  getStrongestAssociations(memory: Memory, count: number): MemoryAssociation[] {
    return [...memory.associations]
      .sort((a, b) => b.strength - a.strength)
      .slice(0, count);
  }

  computeAssociationStrength(memory: Memory): number {
    if (memory.associations.length === 0) return 0;
    const avgStrength = memory.associations.reduce((s, a) => s + a.strength, 0) / memory.associations.length;
    const density = Math.min(1, memory.associations.length / 15);
    return avgStrength * 0.6 + density * 0.4;
  }

  findPath(
    start: Memory,
    targetId: string,
    allMemories: Map<string, Memory>,
    maxDepth = 5
  ): MemoryAssociation[] | null {
    const visited = new Set<string>();
    const path: MemoryAssociation[] = [];

    const dfs = (current: Memory, depth: number): boolean => {
      if (depth > maxDepth) return false;
      if (visited.has(current.id)) return false;
      visited.add(current.id);

      for (const assoc of current.associations) {
        path.push(assoc);
        if (assoc.targetMemoryId === targetId) return true;

        const next = allMemories.get(assoc.targetMemoryId);
        if (next && dfs(next, depth + 1)) return true;

        path.pop();
      }

      return false;
    };

    return dfs(start, 0) ? path : null;
  }
}
