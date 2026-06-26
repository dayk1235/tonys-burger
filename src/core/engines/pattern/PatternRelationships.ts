import { Pattern, PatternRelationship } from "./PatternTypes";

export class PatternRelationships {
  computeOverlap(a: Pattern, b: Pattern): number {
    const setA = new Set(a.originObservations);
    const setB = new Set(b.originObservations);
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  detectSupports(a: Pattern, b: Pattern): number {
    const overlap = this.computeOverlap(a, b);
    if (overlap < 0.3) return 0;
    return overlap * Math.min(a.confidence, b.confidence);
  }

  detectContradiction(a: Pattern, b: Pattern): number {
    if (a.identity.category !== b.identity.category) return 0;
    if (a.identity.name === b.identity.name) return 0;
    const temporalOverlap = this.computeTemporalOverlap(a, b);
    if (temporalOverlap < 0.2) return 0;
    return temporalOverlap * (1 - Math.abs(a.strength - b.strength));
  }

  detectCorrelation(a: Pattern, b: Pattern): number {
    const strengthDiff = Math.abs(a.strength - b.strength);
    if (strengthDiff > 0.5) return 0;
    const temporalOverlap = this.computeTemporalOverlap(a, b);
    const persistenceMatch = 1 - Math.abs(a.persistence - b.persistence);
    return (temporalOverlap * 0.5 + persistenceMatch * 0.5) * (1 - strengthDiff);
  }

  detectEvolution(older: Pattern, newer: Pattern): boolean {
    if (older.identity.name !== newer.identity.name) return false;
    if (older.identity.category !== newer.identity.category) return false;
    return older.stage !== newer.stage && older.strength < newer.strength;
  }

  buildRelationships(patterns: readonly Pattern[]): PatternRelationship[] {
    const relationships: PatternRelationship[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const a = patterns[i];
        const b = patterns[j];

        const supportStrength = this.detectSupports(a, b);
        if (supportStrength > 0.5) {
          relationships.push({
            relatedPatternId: b.id,
            type: "SUPPORTS",
            strength: supportStrength,
            discoveredAt: now,
          });
        }

        const contradictionStrength = this.detectContradiction(a, b);
        if (contradictionStrength > 0.3) {
          relationships.push({
            relatedPatternId: b.id,
            type: "CONTRADICTS",
            strength: contradictionStrength,
            discoveredAt: now,
          });
        }

        const correlationStrength = this.detectCorrelation(a, b);
        if (correlationStrength > 0.5) {
          relationships.push({
            relatedPatternId: b.id,
            type: correlationStrength > 0.6 ? "CORRELATED_WITH" : "ANTI_CORRELATED_WITH",
            strength: correlationStrength,
            discoveredAt: now,
          });
        }
      }
    }

    return relationships;
  }

  private computeTemporalOverlap(a: Pattern, b: Pattern): number {
    const aStart = new Date(a.temporalScope.firstObservedAt).getTime();
    const aEnd = new Date(a.temporalScope.lastObservedAt).getTime();
    const bStart = new Date(b.temporalScope.firstObservedAt).getTime();
    const bEnd = new Date(b.temporalScope.lastObservedAt).getTime();
    const overlapStart = Math.max(aStart, bStart);
    const overlapEnd = Math.min(aEnd, bEnd);
    const overlapDuration = Math.max(0, overlapEnd - overlapStart);
    const aDuration = Math.max(1, aEnd - aStart);
    const bDuration = Math.max(1, bEnd - bStart);
    return overlapDuration / Math.max(aDuration, bDuration);
  }
}
