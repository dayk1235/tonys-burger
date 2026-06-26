import { Pattern, PatternQualityProfile, ObservationRef } from "./PatternTypes";

export interface ConfidenceHistoryEntry {
  readonly timestamp: string;
  readonly previousScore: number;
  readonly newScore: number;
  readonly reason: string;
}

export class PatternConfidence {
  private history: Map<string, ConfidenceHistoryEntry[]> = new Map();

  compute(
    pattern: Pattern,
    qualityProfile: PatternQualityProfile,
    observations: readonly ObservationRef[]
  ): number {
    const baseConfidence = this.computeBaseConfidence(qualityProfile);
    const evidenceBoost = this.computeEvidenceBoost(pattern);
    const persistenceFactor = this.computePersistenceFactor(pattern);
    const contradictionPenalty = this.computeContradictionPenalty(pattern);
    const observationTrust = this.computeObservationTrust(pattern, observations);

    const raw = (baseConfidence + evidenceBoost) * persistenceFactor * observationTrust - contradictionPenalty;
    return Math.max(0.01, Math.min(0.99, raw));
  }

  recordHistory(patternId: string, previousScore: number, newScore: number, reason: string): void {
    const entry: ConfidenceHistoryEntry = {
      timestamp: new Date().toISOString(),
      previousScore,
      newScore,
      reason,
    };
    const existing = this.history.get(patternId) || [];
    existing.push(entry);
    this.history.set(patternId, existing);
  }

  getHistory(patternId: string): readonly ConfidenceHistoryEntry[] {
    return this.history.get(patternId) || [];
  }

  private computeBaseConfidence(profile: PatternQualityProfile): number {
    const weights = {
      precision: 0.15,
      consistency: 0.20,
      generalization: 0.15,
      robustness: 0.15,
      predictiveValue: 0.15,
      explainability: 0.10,
      coverage: 0.10,
    };

    return (
      profile.precision * weights.precision +
      profile.consistency * weights.consistency +
      profile.generalization * weights.generalization +
      profile.robustness * weights.robustness +
      profile.predictiveValue * weights.predictiveValue +
      profile.explainability * weights.explainability +
      profile.coverage * weights.coverage
    );
  }

  private computeEvidenceBoost(pattern: Pattern): number {
    if (pattern.evidence.length === 0) return -0.2;
    const boost = Math.min(0.3, pattern.evidence.length * 0.03);
    return boost;
  }

  private computePersistenceFactor(pattern: Pattern): number {
    const versionCount = pattern.versions.length;
    if (versionCount < 2) return 0.8;
    return Math.min(1.2, 0.8 + versionCount * 0.05);
  }

  private computeContradictionPenalty(pattern: Pattern): number {
    const contradictionCount = pattern.contradictingObservations.length;
    if (contradictionCount === 0) return 0;
    return Math.min(0.5, contradictionCount * 0.1);
  }

  private computeObservationTrust(pattern: Pattern, observations: readonly ObservationRef[]): number {
    if (observations.length === 0) return 0.8;
    const originIds = new Set(pattern.originObservations);
    const relevant = observations.filter((o) => originIds.has(o.id));
    if (relevant.length === 0) return 0.8;
    const avgTrust = relevant.reduce((sum, o) => sum + o.trustScore, 0) / relevant.length;
    return 0.5 + avgTrust * 0.5;
  }
}
