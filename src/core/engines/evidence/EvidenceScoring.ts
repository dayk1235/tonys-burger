import { Evidence, SupportingRef, ContradictingRef, ObservationDetail, EvidenceEvaluationResult } from "./EvidenceTypes";

export class EvidenceScoring {
  computeScore(evidence: Evidence, observations: readonly ObservationDetail[]): number {
    const supportScore = this.computeSupportScore(evidence, observations);
    const contradictionPenalty = this.computeContradictionPenalty(evidence);
    const diversityBonus = this.computeDiversityBonus(evidence, observations);
    const temporalScore = this.computeTemporalScore(evidence);

    const raw = supportScore * (1 + diversityBonus) * temporalScore - contradictionPenalty;
    return Math.max(0, Math.min(1, raw));
  }

  computeSupportWeight(evidence: Evidence): number {
    if (evidence.supportingRefs.length === 0) return 0;
    const avgWeight = evidence.supportingRefs.reduce((s, r) => s + r.weight, 0) / evidence.supportingRefs.length;
    const countBonus = Math.min(0.2, evidence.supportingRefs.length * 0.02);
    return Math.min(1, avgWeight + countBonus);
  }

  computeContradictionWeight(evidence: Evidence): number {
    if (evidence.contradictingRefs.length === 0) return 0;
    const severityMultipliers = { LOW: 0.3, MEDIUM: 0.6, HIGH: 0.85, CRITICAL: 1.0 };
    const totalWeight = evidence.contradictingRefs.reduce((s, r) => {
      const multiplier = severityMultipliers[r.severity];
      return s + r.weight * multiplier;
    }, 0);
    return Math.min(1, totalWeight / evidence.contradictingRefs.length);
  }

  evaluate(evidence: Evidence, observations: readonly ObservationDetail[]): EvidenceEvaluationResult {
    const score = this.computeScore(evidence, observations);
    const supportingWeight = this.computeSupportWeight(evidence);
    const contradictingWeight = this.computeContradictionWeight(evidence);
    const recommendations: string[] = [];

    if (contradictingWeight > supportingWeight) {
      recommendations.push("review_contradictions");
    }
    if (evidence.supportingRefs.length < 3) {
      recommendations.push("collect_more_supporting_evidence");
    }
    if (evidence.supportingRefs.every((r) => r.independence < 0.5)) {
      recommendations.push("seek_independent_sources");
    }
    if (score > 0.7) {
      recommendations.push("candidate_for_validation");
    }

    return {
      evaluated: true,
      score,
      confidence: 0,
      supportingWeight,
      contradictingWeight,
      qualityProfile: evidence.qualityProfile,
      recommendations,
    };
  }

  private computeSupportScore(evidence: Evidence, observations: readonly ObservationDetail[]): number {
    if (evidence.supportingRefs.length === 0) return 0;
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const weightedSum = evidence.supportingRefs.reduce((sum, ref) => {
      const obs = obsMap.get(ref.observationId);
      const trustWeight = obs ? obs.trustScore : 0.5;
      return sum + ref.weight * trustWeight * ref.independence;
    }, 0);
    const maxPossible = evidence.supportingRefs.length;
    return maxPossible > 0 ? Math.min(1, weightedSum / maxPossible) : 0;
  }

  private computeContradictionPenalty(evidence: Evidence): number {
    if (evidence.contradictingRefs.length === 0) return 0;
    const severityValues = { LOW: 0.1, MEDIUM: 0.2, HIGH: 0.35, CRITICAL: 0.5 };
    const penalty = evidence.contradictingRefs.reduce((sum, ref) => {
      return sum + severityValues[ref.severity] * ref.weight;
    }, 0);
    return Math.min(0.8, penalty);
  }

  private computeDiversityBonus(evidence: Evidence, observations: readonly ObservationDetail[]): number {
    if (observations.length === 0) return 0;
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const sourceTypes = new Set<string>();
    for (const ref of evidence.supportingRefs) {
      const obs = obsMap.get(ref.observationId);
      if (obs) sourceTypes.add(obs.sourceType);
    }
    return Math.min(0.2, (sourceTypes.size - 1) * 0.05);
  }

  private computeTemporalScore(evidence: Evidence): number {
    if (evidence.supportingRefs.length < 2) return 0.5;
    const now = Date.now();
    const times = evidence.supportingRefs.map((r) => new Date(r.capturedAt).getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const spanHours = (maxTime - minTime) / (1000 * 60 * 60);
    const recencyHours = (now - maxTime) / (1000 * 60 * 60);
    const spanScore = Math.min(1, spanHours / 168);
    const recencyScore = recencyHours <= 24 ? 1 : recencyHours <= 168 ? 0.8 : recencyHours <= 720 ? 0.5 : 0.2;
    return spanScore * 0.4 + recencyScore * 0.6;
  }
}
