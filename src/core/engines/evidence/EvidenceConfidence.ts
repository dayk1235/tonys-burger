import { Evidence, EvidenceQualityProfile, SupportingRef, ContradictingRef, ObservationDetail } from "./EvidenceTypes";

export interface ConfidenceHistoryEntry {
  readonly timestamp: string;
  readonly previousScore: number;
  readonly newScore: number;
  readonly reason: string;
}

export class EvidenceConfidence {
  private history: Map<string, ConfidenceHistoryEntry[]> = new Map();

  compute(
    evidence: Evidence,
    qualityProfile: EvidenceQualityProfile,
    observations: readonly ObservationDetail[]
  ): number {
    const baseConfidence = this.computeBaseConfidence(qualityProfile);
    const supportBoost = this.computeSupportBoost(evidence);
    const contradictionPenalty = this.computeContradictionPenalty(evidence);
    const consistencyFactor = this.computeConsistencyFactor(evidence, observations);
    const versionStability = this.computeVersionStability(evidence);

    const raw = (baseConfidence + supportBoost) * consistencyFactor * versionStability - contradictionPenalty;
    return Math.max(0.01, Math.min(0.99, raw));
  }

  recordHistory(evidenceId: string, previousScore: number, newScore: number, reason: string): void {
    const entry: ConfidenceHistoryEntry = {
      timestamp: new Date().toISOString(),
      previousScore,
      newScore,
      reason,
    };
    const existing = this.history.get(evidenceId) || [];
    existing.push(entry);
    this.history.set(evidenceId, existing);
  }

  getHistory(evidenceId: string): readonly ConfidenceHistoryEntry[] {
    return this.history.get(evidenceId) || [];
  }

  private computeBaseConfidence(profile: EvidenceQualityProfile): number {
    const weights = {
      reliability: 0.18,
      consistency: 0.16,
      strength: 0.15,
      independence: 0.13,
      coverage: 0.12,
      freshness: 0.10,
      traceability: 0.08,
      completeness: 0.08,
    };

    return (
      profile.reliability * weights.reliability +
      profile.consistency * weights.consistency +
      profile.strength * weights.strength +
      profile.independence * weights.independence +
      profile.coverage * weights.coverage +
      profile.freshness * weights.freshness +
      profile.traceability * weights.traceability +
      profile.completeness * weights.completeness
    );
  }

  private computeSupportBoost(evidence: Evidence): number {
    if (evidence.supportingRefs.length === 0) return -0.1;
    const avgWeight = evidence.supportingRefs.reduce((s, r) => s + r.weight, 0) / evidence.supportingRefs.length;
    return Math.min(0.2, avgWeight * Math.min(1, evidence.supportingRefs.length / 10) * 0.15);
  }

  private computeContradictionPenalty(evidence: Evidence): number {
    if (evidence.contradictingRefs.length === 0) return 0;
    const highSeverity = evidence.contradictingRefs.filter((r) => r.severity === "HIGH" || r.severity === "CRITICAL").length;
    return Math.min(0.5, evidence.contradictingRefs.length * 0.08 + highSeverity * 0.12);
  }

  private computeConsistencyFactor(evidence: Evidence, observations: readonly ObservationDetail[]): number {
    if (observations.length === 0) return 0.8;
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const relatedObs = evidence.supportingRefs
      .map((r) => obsMap.get(r.observationId))
      .filter((o): o is ObservationDetail => o !== undefined);
    if (relatedObs.length === 0) return 0.8;
    const avgConfidence = relatedObs.reduce((s, o) => s + o.confidence, 0) / relatedObs.length;
    return 0.5 + avgConfidence * 0.5;
  }

  private computeVersionStability(evidence: Evidence): number {
    if (evidence.versions.length < 3) return 0.9;
    const recentScores = evidence.versions.slice(-5).map((v) => v.score);
    const mean = recentScores.reduce((s, v) => s + v, 0) / recentScores.length;
    const variance = recentScores.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / recentScores.length;
    const stability = Math.max(0, 1 - Math.sqrt(variance) * 3);
    return Math.min(1, 0.7 + stability * 0.3);
  }
}
