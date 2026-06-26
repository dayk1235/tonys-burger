import { Evidence, EvidenceQualityProfile, SupportingRef, ContradictingRef, ObservationDetail } from "./EvidenceTypes";

const WEIGHTS = {
  strength: 0.14,
  coverage: 0.10,
  completeness: 0.10,
  consistency: 0.12,
  freshness: 0.10,
  reliability: 0.12,
  sourceDiversity: 0.08,
  traceability: 0.08,
  explainability: 0.06,
  contradictionResistance: 0.05,
  independence: 0.05,
};

export class EvidenceQuality {
  evaluate(
    evidence: Evidence,
    observations: readonly ObservationDetail[]
  ): { profile: EvidenceQualityProfile; confidenceScore: number } {
    const strength = this.gradeStrength(evidence);
    const coverage = this.gradeCoverage(evidence);
    const completeness = this.gradeCompleteness(evidence);
    const consistency = this.gradeConsistency(evidence);
    const freshness = this.gradeFreshness(evidence);
    const reliability = this.gradeReliability(evidence, observations);
    const sourceDiversity = this.gradeSourceDiversity(evidence, observations);
    const traceability = this.gradeTraceability(evidence);
    const explainability = this.gradeExplainability(evidence);
    const contradictionResistance = this.gradeContradictionResistance(evidence);
    const independence = this.gradeIndependence(evidence, observations);

    const profile: EvidenceQualityProfile = {
      strength, coverage, completeness, consistency, freshness,
      reliability, sourceDiversity, traceability, explainability,
      contradictionResistance, independence,
    };

    const confidenceScore =
      strength * WEIGHTS.strength +
      coverage * WEIGHTS.coverage +
      completeness * WEIGHTS.completeness +
      consistency * WEIGHTS.consistency +
      freshness * WEIGHTS.freshness +
      reliability * WEIGHTS.reliability +
      sourceDiversity * WEIGHTS.sourceDiversity +
      traceability * WEIGHTS.traceability +
      explainability * WEIGHTS.explainability +
      contradictionResistance * WEIGHTS.contradictionResistance +
      independence * WEIGHTS.independence;

    return { profile, confidenceScore: Math.max(0.01, Math.min(0.99, confidenceScore)) };
  }

  private gradeStrength(evidence: Evidence): number {
    if (evidence.supportingRefs.length === 0) return 0;
    const totalWeight = evidence.supportingRefs.reduce((s, r) => s + r.weight, 0);
    return Math.min(1, totalWeight / evidence.supportingRefs.length);
  }

  private gradeCoverage(evidence: Evidence): number {
    const totalRefs = evidence.supportingRefs.length + evidence.contradictingRefs.length;
    if (totalRefs === 0) return 0;
    const supportRatio = evidence.supportingRefs.length / totalRefs;
    return supportRatio * Math.min(1, totalRefs / 10);
  }

  private gradeCompleteness(evidence: Evidence): number {
    let score = 0;
    if (evidence.provenance.sourceObservations.length > 0) score += 0.25;
    if (evidence.provenance.sourcePatterns.length > 0) score += 0.25;
    if (evidence.provenance.evaluationHistory.length > 0) score += 0.25;
    if (evidence.provenance.detectionTimeline.length > 0) score += 0.25;
    return score;
  }

  private gradeConsistency(evidence: Evidence): number {
    const totalRefs = evidence.supportingRefs.length + evidence.contradictingRefs.length;
    if (totalRefs === 0) return 0.5;
    const contradictionRatio = evidence.contradictingRefs.length / totalRefs;
    return Math.max(0, 1 - contradictionRatio * 2);
  }

  private gradeFreshness(evidence: Evidence): number {
    if (evidence.supportingRefs.length === 0) return 0;
    const now = Date.now();
    const newest = evidence.supportingRefs.reduce((latest, ref) => {
      const refTime = new Date(ref.capturedAt).getTime();
      return refTime > latest ? refTime : latest;
    }, 0);
    const ageHours = (now - newest) / (1000 * 60 * 60);
    if (ageHours <= 1) return 1;
    if (ageHours <= 24) return 0.9;
    if (ageHours <= 168) return 0.7;
    if (ageHours <= 720) return 0.4;
    return 0.1;
  }

  private gradeReliability(evidence: Evidence, observations: readonly ObservationDetail[]): number {
    if (observations.length === 0) return 0.5;
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const supportingObs = evidence.supportingRefs
      .map((r) => obsMap.get(r.observationId))
      .filter((o): o is ObservationDetail => o !== undefined);
    if (supportingObs.length === 0) return 0.5;
    const avgTrust = supportingObs.reduce((s, o) => s + o.trustScore, 0) / supportingObs.length;
    return avgTrust;
  }

  private gradeSourceDiversity(evidence: Evidence, observations: readonly ObservationDetail[]): number {
    if (observations.length === 0) return 0;
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const sourceTypes = new Set<string>();
    for (const ref of evidence.supportingRefs) {
      const obs = obsMap.get(ref.observationId);
      if (obs) sourceTypes.add(obs.sourceType);
    }
    return Math.min(1, sourceTypes.size / 4);
  }

  private gradeTraceability(evidence: Evidence): number {
    const hasProvenance = evidence.provenance.sourceObservations.length > 0 ? 0.3 : 0;
    const hasTimeline = evidence.provenance.detectionTimeline.length > 1 ? 0.3 : 0;
    const hasHistory = evidence.versions.length > 1 ? 0.2 : 0;
    const hasRelationships = evidence.relationships.length > 0 ? 0.2 : 0;
    return Math.min(1, hasProvenance + hasTimeline + hasHistory + hasRelationships);
  }

  private gradeExplainability(evidence: Evidence): number {
    let score = 0;
    if (evidence.summary.length > 20) score += 0.3;
    if (evidence.description.length > 30) score += 0.3;
    if (evidence.supportingRefs.length > 0) score += 0.2;
    if (evidence.metadata.tags.length > 0) score += 0.2;
    return Math.min(1, score);
  }

  private gradeContradictionResistance(evidence: Evidence): number {
    const totalContraWeight = evidence.contradictingRefs.reduce((s, r) => s + r.weight, 0);
    const totalSupportWeight = evidence.supportingRefs.reduce((s, r) => s + r.weight, 0);
    const totalWeight = totalSupportWeight + totalContraWeight;
    if (totalWeight === 0) return 0.5;
    return totalSupportWeight / totalWeight;
  }

  private gradeIndependence(evidence: Evidence, observations: readonly ObservationDetail[]): number {
    if (evidence.supportingRefs.length < 2) return 0.5;
    const avgIndependence = evidence.supportingRefs.reduce((s, r) => s + r.independence, 0) / evidence.supportingRefs.length;
    return avgIndependence;
  }
}
