import { ObservationRef, PatternDetectionResult } from "./PatternTypes";
import { SequenceDetectionError } from "./PatternErrors";

export interface SequencePattern {
  readonly items: readonly string[];
  readonly support: number;
  readonly confidence: number;
  readonly averageGapMs: number;
  readonly regularity: number;
}

export class PatternSequence {
  detectSequences(
    observations: readonly ObservationRef[],
    maxGapMs = 3600000,
    minSupport = 2
  ): PatternDetectionResult[] {
    if (observations.length < 3) {
      throw new SequenceDetectionError(
        `Need at least 3 observations, got ${observations.length}`
      );
    }

    const byBusiness = this.groupByBusiness(observations);
    const results: PatternDetectionResult[] = [];

    for (const [, group] of byBusiness) {
      if (group.length < 3) continue;
      const sorted = [...group].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const sequences = this.mineSequences(sorted, maxGapMs, minSupport);

      for (const seq of sequences) {
        if (seq.items.length < 2) continue;
        results.push({
          detected: true,
          strength: seq.confidence,
          confidence: seq.confidence * seq.regularity,
          novelty: 1 - seq.support / (observations.length * 0.5),
          evidence: [...seq.items],
          metadata: {
            sequence: seq.items,
            support: seq.support,
            averageGapMs: seq.averageGapMs,
            regularity: seq.regularity,
            sequenceLength: seq.items.length,
          },
        });
      }
    }

    return results;
  }

  findRepeatedPairs(
    observations: readonly ObservationRef[],
    timeWindowMs = 3600000,
    minOccurrences = 2
  ): PatternDetectionResult[] {
    if (observations.length < 2) return [];
    const results: PatternDetectionResult[] = [];
    const sorted = [...observations].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const pairs = new Map<string, { count: number; gapMs: number[]; ids: string[] }>();

    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const gapMs = new Date(sorted[j].timestamp).getTime() - new Date(sorted[i].timestamp).getTime();
        if (gapMs > timeWindowMs) break;
        const key = `${sorted[i].category}→${sorted[j].category}`;
        const existing = pairs.get(key) || { count: 0, gapMs: [], ids: [] };
        existing.count++;
        existing.gapMs.push(gapMs);
        existing.ids.push(sorted[i].id, sorted[j].id);
        pairs.set(key, existing);
      }
    }

    for (const [key, data] of pairs.entries()) {
      if (data.count >= minOccurrences) {
        const meanGap = data.gapMs.reduce((s, g) => s + g, 0) / data.gapMs.length;
        const gapVariance = data.gapMs.reduce((s, g) => s + Math.pow(g - meanGap, 2), 0) / data.gapMs.length;
        const regularity = meanGap > 0 ? Math.max(0, 1 - Math.sqrt(gapVariance) / meanGap) : 0;
        const [catA, catB] = key.split("→");

        results.push({
          detected: true,
          strength: Math.min(1, data.count / 10),
          confidence: Math.min(0.99, regularity * 0.7 + Math.min(1, data.count / 5) * 0.3),
          novelty: 1 - data.count / observations.length,
          evidence: data.ids,
          metadata: {
            fromCategory: catA,
            toCategory: catB,
            occurrences: data.count,
            meanGapMs: meanGap,
            regularity,
          },
        });
      }
    }

    return results;
  }

  private mineSequences(
    sorted: ObservationRef[],
    maxGapMs: number,
    minSupport: number
  ): SequencePattern[] {
    const sequences: Map<string, { count: number; gaps: number[]; items: string[] }> = new Map();
    const windowSize = Math.min(10, sorted.length);

    for (let start = 0; start < sorted.length; start++) {
      const baseTime = new Date(sorted[start].timestamp).getTime();
      const tempSeq: string[] = [sorted[start].id];
      const tempCategories: string[] = [sorted[start].category];

      for (let offset = 1; offset < windowSize && start + offset < sorted.length; offset++) {
        const nextTime = new Date(sorted[start + offset].timestamp).getTime();
        if (nextTime - baseTime > maxGapMs) break;

        tempSeq.push(sorted[start + offset].id);
        tempCategories.push(sorted[start + offset].category);

        if (tempSeq.length >= 2) {
          const key = tempCategories.join("→");
          const existing = sequences.get(key) || { count: 0, gaps: [], items: [] };
          existing.count++;
          existing.gaps.push(nextTime - baseTime);
          existing.items = [...tempSeq];
          sequences.set(key, existing);
        }
      }
    }

    const results: SequencePattern[] = [];
    for (const [key, data] of sequences.entries()) {
      if (data.count >= minSupport) {
        const meanGap = data.gaps.length > 0
          ? data.gaps.reduce((s, g) => s + g, 0) / data.gaps.length
          : 0;
        const variance = data.gaps.length > 0
          ? data.gaps.reduce((s, g) => s + Math.pow(g - meanGap, 2), 0) / data.gaps.length
          : 0;
        const regularity = meanGap > 0 ? Math.max(0, 1 - Math.sqrt(variance) / meanGap) : 0;
        const totalPossible = sorted.length - data.items.length + 1;
        const confidence = totalPossible > 0 ? data.count / totalPossible : 0;

        results.push({
          items: key.split("→"),
          support: data.count,
          confidence: Math.min(0.99, confidence),
          averageGapMs: meanGap,
          regularity,
        });
      }
    }

    return results.sort((a, b) => b.support - a.support);
  }

  private groupByBusiness(
    observations: readonly ObservationRef[]
  ): Map<string, ObservationRef[]> {
    const groups = new Map<string, ObservationRef[]>();
    for (const obs of observations) {
      const existing = groups.get(obs.businessId) || [];
      existing.push(obs);
      groups.set(obs.businessId, existing);
    }
    return groups;
  }
}
