import { Attention } from "./AttentionTypes";
import { AttentionPriority } from "./AttentionPriority";

export interface CompetitionResult {
  readonly winner: Attention | null;
  readonly candidates: readonly Attention[];
  readonly rankings: readonly RankedAttention[];
  readonly starvationCandidates: readonly string[];
  readonly deferredIds: readonly string[];
}

export interface RankedAttention {
  readonly attention: Attention;
  readonly rank: number;
  readonly score: number;
  readonly starveBoost: number;
  readonly isStarvationCandidate: boolean;
  readonly reason: string;
}

export class AttentionCompetition {
  private starvationThreshold = 0.15;
  private starvationBoostFactor = 0.1;
  private maxCandidatesPerRound = 10;

  private lastActivationTime: Map<string, number> = new Map();

  compete(candidates: Attention[]): CompetitionResult {
    const ranked = this.rank(candidates);
    const starvationCandidates = this.detectStarvation(ranked);
    const deferredIds: string[] = [];

    let winner: Attention | null = null;

    for (const entry of ranked) {
      if (!winner) {
        winner = entry.attention;
      } else {
        deferredIds.push(entry.attention.id);
      }
    }

    return {
      winner,
      candidates: ranked.map((r) => r.attention),
      rankings: ranked,
      starvationCandidates: starvationCandidates.map((r) => r.attention.id),
      deferredIds,
    };
  }

  rank(candidates: Attention[]): RankedAttention[] {
    const priority = new AttentionPriority();
    const now = Date.now();

    const scored = candidates.map((attention) => {
      const waitingTime = this.lastActivationTime.get(attention.id)
        ? now - this.lastActivationTime.get(attention.id)!
        : 0;
      const starveBoost = this.computeStarvationBoost(attention, waitingTime);
      const isStarvationCandidate = waitingTime > 0 && starveBoost > 0;

      const score = Math.min(1, attention.priority + starveBoost);

      const reasons: string[] = [];
      if (attention.priorityFactors.urgency > 0.7) reasons.push("high urgency");
      if (attention.priorityFactors.importance > 0.7) reasons.push("high importance");
      if (attention.priorityFactors.risk > 0.7) reasons.push("high risk");
      if (isStarvationCandidate) reasons.push("starvation boost");
      if (attention.timesInterrupted > 2) reasons.push("frequently interrupted");

      return {
        attention,
        rank: 0,
        score: Math.round(score * 1000) / 1000,
        starveBoost: Math.round(starveBoost * 1000) / 1000,
        isStarvationCandidate,
        reason: reasons.join(", ") || "standard priority",
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  selectTop(candidates: Attention[], count: number): RankedAttention[] {
    const ranked = this.rank(candidates);
    return ranked.slice(0, Math.min(count, this.maxCandidatesPerRound));
  }

  recordActivation(attentionId: string): void {
    this.lastActivationTime.set(attentionId, Date.now());
  }

  private computeStarvationBoost(attention: Attention, waitingTimeMs: number): number {
    if (waitingTimeMs === 0) return 0;
    const waitingMinutes = waitingTimeMs / 60000;
    const boost = Math.min(this.starvationBoostFactor * waitingMinutes, 0.3);
    return boost;
  }

  private detectStarvation(ranked: RankedAttention[]): RankedAttention[] {
    const lowestThreshold = Math.floor(ranked.length * this.starvationThreshold);
    const bottomRanked = ranked.slice(-Math.max(1, lowestThreshold));

    return bottomRanked.filter(
      (r) => r.attention.metadata.starveBoostCount > 2 || r.attention.age > 5
    );
  }

  setStarvationThreshold(threshold: number): void {
    this.starvationThreshold = Math.max(0.05, Math.min(0.5, threshold));
  }

  setStarvationBoostFactor(factor: number): void {
    this.starvationBoostFactor = Math.max(0.01, Math.min(0.5, factor));
  }

  setMaxCandidatesPerRound(max: number): void {
    this.maxCandidatesPerRound = Math.max(1, max);
  }
}
