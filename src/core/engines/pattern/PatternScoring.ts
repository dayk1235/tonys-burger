import { Pattern, ObservationRef, PatternStage } from "./PatternTypes";

export class PatternScoring {
  computeStrength(pattern: Pattern, observations: readonly ObservationRef[]): number {
    const supportRatio = this.supportRatio(pattern);
    const evidenceDensity = this.evidenceDensity(pattern);
    const temporalCoverage = this.temporalCoverage(pattern);
    const spatialCoverage = this.spatialCoverage(pattern);
    const versionStability = this.versionStability(pattern);

    return Math.max(0, Math.min(1,
      supportRatio * 0.30 +
      evidenceDensity * 0.25 +
      temporalCoverage * 0.20 +
      spatialCoverage * 0.10 +
      versionStability * 0.15
    ));
  }

  computeNovelty(pattern: Pattern, allPatterns: readonly Pattern[]): number {
    if (allPatterns.length === 0) return 1;
    const similarPatterns = allPatterns.filter((p) =>
      p.id !== pattern.id &&
      p.identity.category === pattern.identity.category &&
      this.patternOverlap(p, pattern) > 0.5
    );
    return Math.max(0.01, 1 - similarPatterns.length / Math.max(1, allPatterns.length));
  }

  computePersistence(pattern: Pattern): number {
    if (pattern.versions.length < 2) return 0;
    const firstVersion = pattern.versions[0];
    const lastVersion = pattern.versions[pattern.versions.length - 1];
    const firstTime = new Date(firstVersion.timestamp).getTime();
    const lastTime = new Date(lastVersion.timestamp).getTime();
    const durationHours = (lastTime - firstTime) / (1000 * 60 * 60);
    return Math.min(1, durationHours / 168);
  }

  computeRecurrence(pattern: Pattern): number {
    if (pattern.temporalScope.intervals.length < 2) return 0;
    const intervals = pattern.temporalScope.intervals;
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    if (mean === 0) return 0;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) / intervals.length;
    const cv = Math.sqrt(variance) / mean;
    const regularity = Math.max(0, 1 - cv);
    const frequency = Math.min(1, pattern.temporalScope.frequencyPerHour / 10);
    return regularity * 0.6 + frequency * 0.4;
  }

  computeBusinessRelevance(pattern: Pattern): number {
    let score = 0;
    if (pattern.businessRelevance.length > 30) score += 0.3;
    if (pattern.operationalScope.servicePeriods.length > 0) score += 0.2;
    if (pattern.operationalScope.businessContexts.length > 0) score += 0.2;
    if (pattern.operationalScope.activeDuringPromotions.length > 0) score += 0.15;
    if (pattern.spatialScope.zones.length > 0) score += 0.15;
    return Math.min(1, score);
  }

  computeDetectionConfidence(
    detectionStrength: number,
    observationCount: number,
    timeSpanMs: number,
    consistencyRatio: number
  ): number {
    const strengthWeight = detectionStrength * 0.35;
    const countWeight = Math.min(1, observationCount / 20) * 0.25;
    const timeWeight = Math.min(1, timeSpanMs / (7 * 24 * 60 * 60 * 1000)) * 0.20;
    const consistencyWeight = consistencyRatio * 0.20;
    const raw = strengthWeight + countWeight + timeWeight + consistencyWeight;
    return Math.max(0.01, Math.min(0.99, raw));
  }

  private supportRatio(pattern: Pattern): number {
    if (pattern.evidence.length === 0) return 0;
    return pattern.supportingObservations.length / pattern.evidence.length;
  }

  private evidenceDensity(pattern: Pattern): number {
    const count = pattern.evidence.length;
    return Math.min(1, count / 20);
  }

  private temporalCoverage(pattern: Pattern): number {
    if (pattern.temporalScope.intervals.length < 2) return 0.3;
    const first = pattern.temporalScope.intervals[0];
    const last = pattern.temporalScope.intervals[pattern.temporalScope.intervals.length - 1];
    const spanHours = (last - first) / (1000 * 60 * 60);
    const zonesCovered = pattern.spatialScope.zones.length;
    const periodCoverage = pattern.operationalScope.servicePeriods.length;
    return Math.min(1,
      Math.min(1, spanHours / 168) * 0.5 +
      Math.min(1, zonesCovered / 5) * 0.25 +
      Math.min(1, periodCoverage / 4) * 0.25
    );
  }

  private spatialCoverage(pattern: Pattern): number {
    return Math.min(1,
      Math.min(1, pattern.spatialScope.zones.length / 5) * 0.6 +
      Math.min(1, pattern.spatialScope.locations.length / 3) * 0.4
    );
  }

  private versionStability(pattern: Pattern): number {
    if (pattern.versions.length < 2) return 0.5;
    const recent = pattern.versions.slice(-5);
    const changes = recent.filter((v) => Math.abs(v.confidence - v.confidence) > 0.1);
    return Math.max(0, 1 - changes.length * 0.2);
  }

  private patternOverlap(a: Pattern, b: Pattern): number {
    const setA = new Set(a.originObservations);
    const setB = new Set(b.originObservations);
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
