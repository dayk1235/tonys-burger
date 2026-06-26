import { Knowledge, GraphNode, GraphEdge, GraphEdgeType } from "./KnowledgeTypes";

export interface KnowledgeRelationship {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: "DUPLICATE" | "CORROBORATES" | "CONTRADICTS" | "GENERALIZES" | "SPECIALIZES" | "PRECEDES" | "FOLLOWS";
  readonly strength: number;
  readonly discoveredAt: string;
}

export class KnowledgeRelationships {
  detectDuplicate(a: Knowledge, b: Knowledge): boolean {
    if (a.identity.patternId !== b.identity.patternId) return false;
    const memoryOverlap = a.provenance.sourceMemoryIds.some((id) =>
      b.provenance.sourceMemoryIds.includes(id)
    );
    return memoryOverlap && Math.abs(a.confidence - b.confidence) < 0.1;
  }

  detectCorroboration(a: Knowledge, b: Knowledge): number {
    if (a.identity.category !== b.identity.category) return 0;
    const confidenceMatch = 1 - Math.abs(a.confidence - b.confidence);
    const conceptOverlap = this.computeConceptOverlap(a, b);
    return confidenceMatch * 0.5 + conceptOverlap * 0.5;
  }

  detectContradiction(a: Knowledge, b: Knowledge): number {
    if (a.identity.category !== b.identity.category) return 0;
    const confidenceDiff = Math.abs(a.confidence - b.confidence);
    if (confidenceDiff < 0.3) return 0;
    return confidenceDiff * 0.5 + (1 - this.computeConceptOverlap(a, b)) * 0.5;
  }

  buildRelationships(knowledges: Knowledge[]): KnowledgeRelationship[] {
    const relationships: KnowledgeRelationship[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < knowledges.length; i++) {
      for (let j = i + 1; j < knowledges.length; j++) {
        const a = knowledges[i];
        const b = knowledges[j];

        if (this.detectDuplicate(a, b)) {
          relationships.push({
            sourceId: a.id, targetId: b.id, type: "DUPLICATE", strength: 1, discoveredAt: now,
          });
          continue;
        }

        const corrStrength = this.detectCorroboration(a, b);
        if (corrStrength > 0.5) {
          relationships.push({
            sourceId: a.id, targetId: b.id, type: "CORROBORATES", strength: corrStrength, discoveredAt: now,
          });
        }

        const contraStrength = this.detectContradiction(a, b);
        if (contraStrength > 0.3) {
          relationships.push({
            sourceId: a.id, targetId: b.id, type: "CONTRADICTS", strength: contraStrength, discoveredAt: now,
          });
        }
      }
    }

    return relationships;
  }

  private computeConceptOverlap(a: Knowledge, b: Knowledge): number {
    if (a.concepts.length === 0 || b.concepts.length === 0) return 0;
    const aNames = new Set(a.concepts.map((c) => c.name));
    const bNames = new Set(b.concepts.map((c) => c.name));
    const intersection = new Set([...aNames].filter((x) => bNames.has(x)));
    const union = new Set([...aNames, ...bNames]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
