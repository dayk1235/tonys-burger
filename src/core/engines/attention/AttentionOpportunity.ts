export interface OpportunityAssessment {
  readonly score: number;
  readonly category: string;
  readonly potentialValue: number;
  readonly timeWindow: string;
  readonly requiresQuickAction: boolean;
  readonly factors: Record<string, number>;
}

export class AttentionOpportunity {
  evaluate(
    opportunity: number,
    businessValue: number,
    humanValue: number,
    novelty: number,
    temporalPressure: number
  ): OpportunityAssessment {
    const potentialValue = opportunity * 0.4 + businessValue * 0.3 + humanValue * 0.2 + novelty * 0.1;
    const requiresQuickAction = temporalPressure > 0.6 && potentialValue > 0.5;

    const factors: Record<string, number> = {
      baseOpportunity: opportunity * 0.25,
      businessValue: businessValue * 0.20,
      humanValue: humanValue * 0.15,
      noveltyBonus: novelty * 0.15,
      temporalComponent: temporalPressure * 0.15,
      combinedPotential: potentialValue * 0.10,
    };

    const score = Object.values(factors).reduce((sum, v) => sum + v, 0);

    const timeWindow = temporalPressure >= 0.8 ? "immediate" :
      temporalPressure >= 0.5 ? "short" :
      temporalPressure >= 0.2 ? "medium" : "long";

    return {
      score: Math.min(1, score),
      category: score >= 0.7 ? "high" : score >= 0.4 ? "medium" : "low",
      potentialValue,
      timeWindow,
      requiresQuickAction,
      factors,
    };
  }

  isHighOpportunity(opportunity: number, businessValue: number): boolean {
    return opportunity > 0.6 || (opportunity > 0.4 && businessValue > 0.7);
  }
}
