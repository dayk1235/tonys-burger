import { Pattern, PatternQualityProfile, ObservationRef } from "./PatternTypes";

const DEFAULT_WEIGHTS = {
  precision: 0.15,
  coverage: 0.10,
  novelty: 0.10,
  consistency: 0.15,
  persistence: 0.10,
  generalization: 0.10,
  predictiveValue: 0.10,
  explainability: 0.05,
  robustness: 0.10,
  falsePositiveProbability: 0.025,
  falseNegativeProbability: 0.025,
};

export class PatternQuality {
  evaluate(pattern: Pattern, observations: readonly ObservationRef[]): {
    profile: PatternQualityProfile;
    confidenceScore: number;
  } {
    const precision = this.gradePrecision(pattern);
    const coverage = this.gradeCoverage(pattern, observations);
    const novelty = this.gradeNovelty(pattern);
    const consistency = this.gradeConsistency(pattern);
    const persistence = this.gradePersistence(pattern);
    const generalization = this.gradeGeneralization(pattern);
    const predictiveValue = this.gradePredictiveValue(pattern);
    const explainability = this.gradeExplainability(pattern);
    const robustness = this.gradeRobustness(pattern);
    const falsePositiveProbability = this.gradeFalsePositiveProbability(pattern);
    const falseNegativeProbability = this.gradeFalseNegativeProbability(pattern);

    const profile: PatternQualityProfile = {
      precision,
      coverage,
      novelty,
      consistency,
      persistence,
      generalization,
      predictiveValue,
      explainability,
      robustness,
      falsePositiveProbability,
      falseNegativeProbability,
    };

    const confidenceScore = this.computeConfidence(profile);

    return { profile, confidenceScore };
  }

  private computeConfidence(profile: PatternQualityProfile): number {
    const raw =
      profile.precision * DEFAULT_WEIGHTS.precision +
      profile.coverage * DEFAULT_WEIGHTS.coverage +
      profile.novelty * DEFAULT_WEIGHTS.novelty +
      profile.consistency * DEFAULT_WEIGHTS.consistency +
      profile.persistence * DEFAULT_WEIGHTS.persistence +
      profile.generalization * DEFAULT_WEIGHTS.generalization +
      profile.predictiveValue * DEFAULT_WEIGHTS.predictiveValue +
      profile.explainability * DEFAULT_WEIGHTS.explainability +
      profile.robustness * DEFAULT_WEIGHTS.robustness +
      (1 - profile.falsePositiveProbability) * DEFAULT_WEIGHTS.falsePositiveProbability +
      (1 - profile.falseNegativeProbability) * DEFAULT_WEIGHTS.falseNegativeProbability;

    return Math.max(0.01, Math.min(0.99, raw));
  }

  private gradePrecision(pattern: Pattern): number {
    if (pattern.evidence.length === 0) return 0;
    const contradictionRatio = pattern.contradictingObservations.length / pattern.evidence.length;
    return Math.max(0, 1 - contradictionRatio * 2);
  }

  private gradeCoverage(pattern: Pattern, observations: readonly ObservationRef[]): number {
    if (observations.length === 0 || pattern.originObservations.length === 0) return 0;
    return Math.min(1, pattern.originObservations.length / Math.max(1, observations.length * 0.1));
  }

  private gradeNovelty(pattern: Pattern): number {
    return Math.min(1, pattern.novelty * 2);
  }

  private gradeConsistency(pattern: Pattern): number {
    if (pattern.evidence.length === 0) return 0;
    const nonContradicting = pattern.evidence.filter((e) => e.role !== "CONTRADICTING").length;
    return nonContradicting / pattern.evidence.length;
  }

  private gradePersistence(pattern: Pattern): number {
    return Math.min(1, pattern.persistence * 1.5);
  }

  private gradeGeneralization(pattern: Pattern): number {
    const zoneCount = pattern.spatialScope.zones.length;
    const periodCount = pattern.operationalScope.servicePeriods.length;
    return Math.min(1, (zoneCount + periodCount) / 10);
  }

  private gradePredictiveValue(pattern: Pattern): number {
    if (pattern.versions.length < 2) return 0;
    const confidenceGrowth = pattern.confidence - pattern.versions[0].confidence;
    return Math.max(0, Math.min(1, confidenceGrowth * 2));
  }

  private gradeExplainability(pattern: Pattern): number {
    const hasDescription = pattern.description.length > 20 ? 0.3 : 0;
    const hasRelevance = pattern.businessRelevance.length > 20 ? 0.3 : 0;
    const hasEvidence = pattern.evidence.length > 0 ? 0.2 : 0;
    const metadataScore = Object.keys(pattern.metadata.attributes).length > 0 ? 0.2 : 0;
    return Math.min(1, hasDescription + hasRelevance + hasEvidence + metadataScore);
  }

  private gradeRobustness(pattern: Pattern): number {
    if (pattern.evidence.length === 0) return 0;
    const supportCount = pattern.supportingObservations.length;
    const totalCount = pattern.evidence.length;
    return Math.min(1, (supportCount / Math.max(1, totalCount)) * Math.min(1, totalCount / 10));
  }

  private gradeFalsePositiveProbability(pattern: Pattern): number {
    if (pattern.evidence.length < 3) return 1;
    if (pattern.versions.length < 2) return 0.5;
    const contradictions = pattern.contradictingObservations.length;
    const ratio = contradictions / Math.max(1, pattern.evidence.length);
    return Math.min(1, ratio * 3);
  }

  private gradeFalseNegativeProbability(pattern: Pattern): number {
    if (pattern.evidence.length < 2) return 1;
    const gapMs = this.computeMaxGapMs(pattern.temporalScope.intervals);
    if (gapMs === 0) return 0.1;
    const expectedInterval = pattern.temporalScope.intervals.length > 0
      ? pattern.temporalScope.intervals.reduce((a, b) => a + b, 0) / pattern.temporalScope.intervals.length
      : 0;
    if (expectedInterval === 0) return 0.5;
    return Math.min(1, gapMs / (expectedInterval * 5));
  }

  private computeMaxGapMs(intervals: readonly number[]): number {
    if (intervals.length < 2) return 0;
    let maxGap = 0;
    for (let i = 1; i < intervals.length; i++) {
      const gap = intervals[i] - intervals[i - 1];
      if (gap > maxGap) maxGap = gap;
    }
    return maxGap;
  }
}
