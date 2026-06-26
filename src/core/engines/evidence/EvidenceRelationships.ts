import { Evidence, EvidenceRelationship } from "./EvidenceTypes";

export class EvidenceRelationships {
  computeOverlap(a: Evidence, b: Evidence): number {
    const setA = new Set(a.supportingRefs.map((r) => r.observationId));
    const setB = new Set(b.supportingRefs.map((r) => r.observationId));
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  detectCorroboration(a: Evidence, b: Evidence): number {
    const overlap = this.computeOverlap(a, b);
    if (overlap < 0.3) return 0;
    const confidenceMatch = 1 - Math.abs(a.confidence - b.confidence);
    return overlap * 0.5 + confidenceMatch * 0.5;
  }

  detectDuplicate(a: Evidence, b: Evidence): boolean {
    if (a.identity.patternId !== b.identity.patternId) return false;
    return this.computeOverlap(a, b) > 0.8;
  }

  detectContradiction(a: Evidence, b: Evidence): number {
    if (a.identity.patternId !== b.identity.patternId) return 0;
    const scoreDiff = Math.abs(a.score - b.score);
    if (scoreDiff < 0.3) return 0;
    const overlap = this.computeOverlap(a, b);
    if (overlap < 0.2) return 0;
    return scoreDiff * overlap;
  }

  buildRelationships(evidenceList: readonly Evidence[]): EvidenceRelationship[] {
    const relationships: EvidenceRelationship[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < evidenceList.length; i++) {
      for (let j = i + 1; j < evidenceList.length; j++) {
        const a = evidenceList[i];
        const b = evidenceList[j];

        if (this.detectDuplicate(a, b)) {
          relationships.push({
            relatedEvidenceId: b.id,
            type: "DUPLICATE",
            strength: 1,
            discoveredAt: now,
          });
          continue;
        }

        const corrStrength = this.detectCorroboration(a, b);
        if (corrStrength > 0.5) {
          relationships.push({
            relatedEvidenceId: b.id,
            type: "CORROBORATES",
            strength: corrStrength,
            discoveredAt: now,
          });
        }

        const contraStrength = this.detectContradiction(a, b);
        if (contraStrength > 0.3) {
          relationships.push({
            relatedEvidenceId: b.id,
            type: "CONTRADICTS",
            strength: contraStrength,
            discoveredAt: now,
          });
        }
      }
    }

    return relationships;
  }

  buildParentChild(evidence: Evidence, relatedEvidence: readonly Evidence[]): EvidenceRelationship[] {
    const relationships: EvidenceRelationship[] = [];
    const now = new Date().toISOString();

    for (const related of relatedEvidence) {
      if (related.id === evidence.id) continue;

      if (related.identity.patternId === evidence.identity.patternId && related.versions.length > evidence.versions.length) {
        relationships.push({
          relatedEvidenceId: related.id,
          type: "PARENT",
          strength: 0.9,
          discoveredAt: now,
        });
      } else if (related.identity.patternId === evidence.identity.patternId) {
        relationships.push({
          relatedEvidenceId: related.id,
          type: "CHILD",
          strength: 0.9,
          discoveredAt: now,
        });
      }
    }

    return relationships;
  }
}
