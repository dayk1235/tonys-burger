import { Memory, AssociationType } from "./MemoryTypes";

export interface MemoryRelationship {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: "DUPLICATE" | "CORROBORATES" | "CONTRADICTS" | "PRECEDES" | "FOLLOWS" | "GENERALIZES" | "SPECIALIZES";
  readonly strength: number;
  readonly discoveredAt: string;
}

export class MemoryRelationships {
  detectDuplicate(a: Memory, b: Memory): boolean {
    if (a.identity.patternId !== b.identity.patternId) return false;
    const evidenceOverlap = a.provenance.sourceEvidenceIds.some((id) =>
      b.provenance.sourceEvidenceIds.includes(id)
    );
    return evidenceOverlap && Math.abs(a.strength - b.strength) < 0.15;
  }

  detectCorroboration(a: Memory, b: Memory): number {
    if (a.identity.category !== b.identity.category) return 0;
    const strengthMatch = 1 - Math.abs(a.strength - b.strength);
    const confidenceMatch = 1 - Math.abs(a.confidence - b.confidence);
    return strengthMatch * 0.5 + confidenceMatch * 0.5;
  }

  detectContradiction(a: Memory, b: Memory): number {
    if (a.identity.category !== b.identity.category) return 0;
    if (a.identity.patternId === b.identity.patternId) return 0;
    const strengthDiff = Math.abs(a.strength - b.strength);
    if (strengthDiff < 0.3) return 0;
    return strengthDiff * 0.5 + (1 - Math.abs(a.confidence - b.confidence)) * 0.5;
  }

  detectTemporal(a: Memory, b: Memory): "PRECEDES" | "FOLLOWS" | "NONE" {
    const aTime = new Date(a.identity.createdAt).getTime();
    const bTime = new Date(b.identity.createdAt).getTime();
    const diffMs = Math.abs(aTime - bTime);
    if (diffMs > 1000 * 60 * 60 * 24 * 30) return "NONE";
    if (aTime < bTime) return "PRECEDES";
    if (aTime > bTime) return "FOLLOWS";
    return "NONE";
  }

  detectGeneralization(a: Memory, b: Memory): boolean {
    if (a.identity.category !== b.identity.category) return false;
    const aHasMoreSources = a.provenance.sourceEvidenceIds.length > b.provenance.sourceEvidenceIds.length;
    return aHasMoreSources && a.confidence > b.confidence;
  }

  buildRelationships(memories: Memory[]): MemoryRelationship[] {
    const relationships: MemoryRelationship[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < memories.length; i++) {
      for (let j = i + 1; j < memories.length; j++) {
        const a = memories[i];
        const b = memories[j];

        if (this.detectDuplicate(a, b)) {
          relationships.push({ sourceId: a.id, targetId: b.id, type: "DUPLICATE", strength: 1, discoveredAt: now });
          continue;
        }

        const corrStrength = this.detectCorroboration(a, b);
        if (corrStrength > 0.5) {
          relationships.push({ sourceId: a.id, targetId: b.id, type: "CORROBORATES", strength: corrStrength, discoveredAt: now });
        }

        const contraStrength = this.detectContradiction(a, b);
        if (contraStrength > 0.3) {
          relationships.push({ sourceId: a.id, targetId: b.id, type: "CONTRADICTS", strength: contraStrength, discoveredAt: now });
        }

        const temporal = this.detectTemporal(a, b);
        if (temporal !== "NONE") {
          relationships.push({
            sourceId: a.id,
            targetId: b.id,
            type: temporal,
            strength: 0.8,
            discoveredAt: now,
          });
        }

        if (this.detectGeneralization(a, b)) {
          relationships.push({ sourceId: a.id, targetId: b.id, type: "GENERALIZES", strength: 0.7, discoveredAt: now });
        } else if (this.detectGeneralization(b, a)) {
          relationships.push({ sourceId: b.id, targetId: a.id, type: "GENERALIZES", strength: 0.7, discoveredAt: now });
        }
      }
    }

    return relationships;
  }
}
