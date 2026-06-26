import { Evidence, EvidenceQualityProfile, SupportingRef, ContradictingRef, ObservationDetail, PatternDetail } from "./EvidenceTypes";

export interface AggregatedResult {
  readonly totalSupporting: number;
  readonly totalContradicting: number;
  readonly aggregateWeight: number;
  readonly aggregateContradictionWeight: number;
  readonly sourceTypeDistribution: Record<string, number>;
  readonly temporalDistribution: Array<{ period: string; supporting: number; contradicting: number }>;
  readonly averageIndependence: number;
  readonly scoreDistribution: { low: number; medium: number; high: number };
}

export class EvidenceAggregation {
  aggregate(
    evidence: Evidence,
    observations: readonly ObservationDetail[]
  ): AggregatedResult {
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const sourceTypeDistribution: Record<string, number> = {};
    const temporalDistribution: Record<string, { supporting: number; contradicting: number }> = {};
    let independenceSum = 0;
    let independenceCount = 0;

    for (const ref of evidence.supportingRefs) {
      const obs = obsMap.get(ref.observationId);
      if (obs) {
        sourceTypeDistribution[obs.sourceType] = (sourceTypeDistribution[obs.sourceType] || 0) + 1;
        const day = new Date(ref.capturedAt).toISOString().slice(0, 10);
        temporalDistribution[day] = temporalDistribution[day] || { supporting: 0, contradicting: 0 };
        temporalDistribution[day].supporting++;
      }
      independenceSum += ref.independence;
      independenceCount++;
    }

    for (const ref of evidence.contradictingRefs) {
      const obs = obsMap.get(ref.observationId);
      if (obs) {
        const day = new Date(ref.capturedAt).toISOString().slice(0, 10);
        temporalDistribution[day] = temporalDistribution[day] || { supporting: 0, contradicting: 0 };
        temporalDistribution[day].contradicting++;
      }
    }

    const totalSupporting = evidence.supportingRefs.length;
    const totalContradicting = evidence.contradictingRefs.length;
    const aggregateWeight = evidence.supportingRefs.reduce((s, r) => s + r.weight, 0);
    const aggregateContradictionWeight = evidence.contradictingRefs.reduce((s, r) => s + r.weight, 0);

    const scoreDistribution = {
      low: evidence.supportingRefs.filter((r) => r.weight < 0.3).length,
      medium: evidence.supportingRefs.filter((r) => r.weight >= 0.3 && r.weight < 0.7).length,
      high: evidence.supportingRefs.filter((r) => r.weight >= 0.7).length,
    };

    const temporalArray = Object.entries(temporalDistribution)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, counts]) => ({ period, ...counts }));

    return {
      totalSupporting,
      totalContradicting,
      aggregateWeight,
      aggregateContradictionWeight,
      sourceTypeDistribution,
      temporalDistribution: temporalArray,
      averageIndependence: independenceCount > 0 ? independenceSum / independenceCount : 0,
      scoreDistribution,
    };
  }

  groupBySourceType(evidence: Evidence, observations: readonly ObservationDetail[]): Record<string, SupportingRef[]> {
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const groups: Record<string, SupportingRef[]> = {};

    for (const ref of evidence.supportingRefs) {
      const obs = obsMap.get(ref.observationId);
      const sourceType = obs?.sourceType || "UNKNOWN";
      if (!groups[sourceType]) groups[sourceType] = [];
      groups[sourceType].push(ref);
    }

    return groups;
  }

  computeOverlap(evidenceA: Evidence, evidenceB: Evidence): number {
    const setA = new Set(evidenceA.supportingRefs.map((r) => r.observationId));
    const setB = new Set(evidenceB.supportingRefs.map((r) => r.observationId));
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
