import { ObservationDetail, SupportingRef } from "./EvidenceTypes";

export interface SourceReliabilityProfile {
  readonly sourceType: string;
  readonly totalObservations: number;
  readonly averageTrustScore: number;
  readonly averageConfidence: number;
  readonly reliabilityScore: number;
  readonly consistencyRate: number;
  readonly lastSeen: string;
}

export class EvidenceSources {
  private sourceHistory: Map<string, { trustScores: number[]; confidences: number[]; timestamps: string[] }> = new Map();

  analyze(observations: readonly ObservationDetail[]): Map<string, SourceReliabilityProfile> {
    const profiles = new Map<string, SourceReliabilityProfile>();
    const groups = this.groupBySourceType(observations);

    for (const [sourceType, obsList] of groups) {
      const avgTrust = obsList.reduce((s, o) => s + o.trustScore, 0) / obsList.length;
      const avgConfidence = obsList.reduce((s, o) => s + o.confidence, 0) / obsList.length;
      const consistencyRate = this.computeConsistencyRate(obsList);
      const lastSeen = obsList.reduce((latest, o) => {
        return o.timestamp > latest ? o.timestamp : latest;
      }, obsList[0]?.timestamp || "");

      const reliabilityScore = avgTrust * 0.4 + avgConfidence * 0.3 + consistencyRate * 0.3;

      profiles.set(sourceType, {
        sourceType,
        totalObservations: obsList.length,
        averageTrustScore: avgTrust,
        averageConfidence: avgConfidence,
        reliabilityScore,
        consistencyRate,
        lastSeen,
      });
    }

    return profiles;
  }

  recordSourceObservation(observation: ObservationDetail): void {
    const existing = this.sourceHistory.get(observation.sourceType) || {
      trustScores: [],
      confidences: [],
      timestamps: [],
    };
    existing.trustScores.push(observation.trustScore);
    existing.confidences.push(observation.confidence);
    existing.timestamps.push(observation.timestamp);
    this.sourceHistory.set(observation.sourceType, existing);
  }

  getSourceReliability(sourceType: string): number {
    const history = this.sourceHistory.get(sourceType);
    if (!history || history.trustScores.length === 0) return 0.5;

    const avgTrust = history.trustScores.reduce((s, v) => s + v, 0) / history.trustScores.length;
    const avgConfidence = history.confidences.reduce((s, v) => s + v, 0) / history.confidences.length;
    const trend = this.computeReliabilityTrend(history.trustScores);

    return Math.min(1, Math.max(0, avgTrust * 0.4 + avgConfidence * 0.3 + trend * 0.3));
  }

  computeSourceDiversity(supportingRefs: readonly SupportingRef[], observations: readonly ObservationDetail[]): number {
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const sourceTypes = new Set<string>();
    for (const ref of supportingRefs) {
      const obs = obsMap.get(ref.observationId);
      if (obs) sourceTypes.add(obs.sourceType);
    }
    return Math.min(1, sourceTypes.size / 5);
  }

  computeIndependence(supportingRefs: readonly SupportingRef[], observations: readonly ObservationDetail[]): number {
    if (supportingRefs.length < 2) return 0.5;
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const sourceTypes = new Set<string>();
    for (const ref of supportingRefs) {
      const obs = obsMap.get(ref.observationId);
      if (obs) sourceTypes.add(obs.sourceType);
    }

    const diversity = sourceTypes.size / supportingRefs.length;
    const timeSpread = this.computeTimeSpread(supportingRefs);
    return diversity * 0.5 + timeSpread * 0.5;
  }

  private groupBySourceType(observations: readonly ObservationDetail[]): Map<string, ObservationDetail[]> {
    const groups = new Map<string, ObservationDetail[]>();
    for (const obs of observations) {
      const existing = groups.get(obs.sourceType) || [];
      existing.push(obs);
      groups.set(obs.sourceType, existing);
    }
    return groups;
  }

  private computeConsistencyRate(observations: readonly ObservationDetail[]): number {
    if (observations.length < 2) return 0.5;
    const categories = new Set(observations.map((o) => o.category));
    return Math.min(1, categories.size / observations.length);
  }

  private computeReliabilityTrend(trustScores: number[]): number {
    if (trustScores.length < 3) return 0.5;
    const recent = trustScores.slice(-3);
    const older = trustScores.slice(0, -3);
    const recentAvg = recent.reduce((s, v) => s + v, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((s, v) => s + v, 0) / older.length : recentAvg;
    return 0.5 + (recentAvg - olderAvg);
  }

  private computeTimeSpread(supportingRefs: readonly SupportingRef[]): number {
    if (supportingRefs.length < 2) return 0;
    const times = supportingRefs.map((r) => new Date(r.capturedAt).getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const spanDays = (maxTime - minTime) / (1000 * 60 * 60 * 24);
    return Math.min(1, spanDays / 30);
  }
}
