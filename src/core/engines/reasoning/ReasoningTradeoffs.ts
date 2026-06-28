import { Reasoning, ReasoningAlternative, ReasoningTradeoff } from "./ReasoningTypes";

export interface TradeoffEvaluationResult {
  readonly tradeoffs: readonly ReasoningTradeoff[];
  readonly topAlternatives: readonly string[];
  readonly dimensionSummary: Record<string, { winner: string; margin: number }>;
}

export class ReasoningTradeoffs {
  evaluate(reasoning: Reasoning, alternatives: ReasoningAlternative[]): TradeoffEvaluationResult {
    const tradeoffs: ReasoningTradeoff[] = [];
    const dimensionSummary: Record<string, { winner: string; margin: number }> = {};

    if (alternatives.length < 2) {
      return { tradeoffs: [], topAlternatives: alternatives.map((a) => a.id), dimensionSummary: {} };
    }

    for (let i = 0; i < alternatives.length; i++) {
      for (let j = i + 1; j < alternatives.length; j++) {
        const a = alternatives[i];
        const b = alternatives[j];

        const businessTradeoff = this.createTradeoff(a, b, "Business Impact", a.businessImpact, b.businessImpact);
        tradeoffs.push(businessTradeoff);

        const riskTradeoff = this.createTradeoff(a, b, "Risk", 1 - a.riskLevel, 1 - b.riskLevel);
        tradeoffs.push(riskTradeoff);

        const costTradeoff = this.createTradeoff(a, b, "Cost Efficiency", 1 - Math.min(1, a.costEstimate / 100), 1 - Math.min(1, b.costEstimate / 100));
        tradeoffs.push(costTradeoff);

        const opportunityTradeoff = this.createTradeoff(a, b, "Opportunity", a.opportunityScore, b.opportunityScore);
        tradeoffs.push(opportunityTradeoff);

        const alignmentTradeoff = this.createTradeoff(a, b, "Owner Alignment", a.ownerAlignment, b.ownerAlignment);
        tradeoffs.push(alignmentTradeoff);
      }
    }

    const dimensions = ["Business Impact", "Risk", "Cost Efficiency", "Opportunity", "Owner Alignment"];
    for (const dim of dimensions) {
      const dimTradeoffs = tradeoffs.filter((t) => t.dimension === dim);
      if (dimTradeoffs.length > 0) {
        const last = dimTradeoffs[dimTradeoffs.length - 1];
        const margin = Math.abs(last.scoreA - last.scoreB);
        const winner = last.scoreA >= last.scoreB
          ? last.alternativeIdA
          : last.alternativeIdB;
        dimensionSummary[dim] = { winner, margin };
      }
    }

    const scored = alternatives.map((alt) => {
      const score =
        alt.businessImpact * 0.3 +
        (1 - alt.riskLevel) * 0.2 +
        (1 - Math.min(1, alt.costEstimate / 100)) * 0.15 +
        alt.opportunityScore * 0.2 +
        alt.ownerAlignment * 0.15;
      return { id: alt.id, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topAlternatives = scored.map((s) => s.id);

    return { tradeoffs, topAlternatives, dimensionSummary };
  }

  private createTradeoff(
    a: ReasoningAlternative, b: ReasoningAlternative,
    dimension: string, scoreA: number, scoreB: number
  ): ReasoningTradeoff {
    const recommendation = scoreA > scoreB
      ? `${a.title} is preferred for ${dimension.toLowerCase()}`
      : scoreB > scoreA
        ? `${b.title} is preferred for ${dimension.toLowerCase()}`
        : `Both alternatives are equivalent for ${dimension.toLowerCase()}`;

    return {
      id: `trd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      alternativeIdA: a.id,
      alternativeIdB: b.id,
      dimension,
      scoreA,
      scoreB,
      recommendation,
    };
  }
}
