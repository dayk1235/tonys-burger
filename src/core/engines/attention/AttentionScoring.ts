import { Attention } from "./AttentionTypes";

export class AttentionScoring {
  computeUrgencyScore(attention: Attention): number {
    return attention.priorityFactors.urgency;
  }

  computeImportanceScore(attention: Attention): number {
    return attention.priorityFactors.importance;
  }

  computeRiskScore(attention: Attention): number {
    return attention.priorityFactors.risk * 0.8 + attention.timesInterrupted * 0.02;
  }

  computeOpportunityScore(attention: Attention): number {
    return attention.priorityFactors.opportunity;
  }

  computeNoveltyScore(attention: Attention): number {
    return attention.priorityFactors.novelty;
  }

  computeContextScore(attention: Attention): number {
    return attention.priorityFactors.contextRelevance;
  }

  computeGoalsScore(attention: Attention): number {
    return attention.priorityFactors.goalAlignment;
  }

  computeTemporalScore(attention: Attention): number {
    return attention.priorityFactors.temporalPressure;
  }

  computeDecayFactor(attention: Attention): number {
    if (attention.metadata.decayCycles === 0) return 1;
    return Math.max(0.3, 1 - attention.metadata.decayCycles * 0.05);
  }

  computeStarvationBoost(attention: Attention): number {
    if (attention.metadata.starveBoostCount === 0) return 0;
    return Math.min(0.3, attention.metadata.starveBoostCount * 0.1);
  }

  evaluate(attention: Attention): {
    baseScore: number;
    urgencyScore: number;
    importanceScore: number;
    riskScore: number;
    opportunityScore: number;
    noveltyScore: number;
    contextScore: number;
    goalsScore: number;
    temporalScore: number;
    decayFactor: number;
    boostFactor: number;
    finalScore: number;
  } {
    const urgencyScore = this.computeUrgencyScore(attention);
    const importanceScore = this.computeImportanceScore(attention);
    const riskScore = this.computeRiskScore(attention);
    const opportunityScore = this.computeOpportunityScore(attention);
    const noveltyScore = this.computeNoveltyScore(attention);
    const contextScore = this.computeContextScore(attention);
    const goalsScore = this.computeGoalsScore(attention);
    const temporalScore = this.computeTemporalScore(attention);
    const decayFactor = this.computeDecayFactor(attention);
    const boostFactor = this.computeStarvationBoost(attention);

    const baseScore =
      urgencyScore * 0.20 +
      importanceScore * 0.20 +
      riskScore * 0.15 +
      opportunityScore * 0.10 +
      noveltyScore * 0.05 +
      contextScore * 0.10 +
      goalsScore * 0.10 +
      temporalScore * 0.10;

    const finalScore = Math.min(1, Math.max(0, baseScore * decayFactor + boostFactor));

    return {
      baseScore,
      urgencyScore,
      importanceScore,
      riskScore,
      opportunityScore,
      noveltyScore,
      contextScore,
      goalsScore,
      temporalScore,
      decayFactor,
      boostFactor,
      finalScore,
    };
  }

  computeAllocation(attention: Attention, availableBudget: number, maxPerItem: number): number {
    const ideal = attention.priority * 0.5 + attention.scoringFactors.finalScore * 0.5;
    const clamped = Math.min(ideal, maxPerItem, availableBudget);
    return Math.max(0.01, Math.min(1, clamped));
  }
}
