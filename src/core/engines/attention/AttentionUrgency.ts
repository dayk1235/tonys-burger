export interface UrgencyAssessment {
  readonly score: number;
  readonly timeCritical: boolean;
  readonly impactImminent: boolean;
  readonly requiresImmediateAction: boolean;
  readonly factors: Record<string, number>;
}

export class AttentionUrgency {
  evaluate(
    urgency: number,
    importance: number,
    risk: number,
    temporalPressure: number,
    businessValue: number,
    humanValue: number
  ): UrgencyAssessment {
    const timeCritical = temporalPressure > 0.7 || urgency > 0.8;
    const impactImminent = risk > 0.6 && urgency > 0.5;
    const requiresImmediateAction = urgency > 0.8 || (temporalPressure > 0.7 && importance > 0.7);

    const factors: Record<string, number> = {
      baseUrgency: urgency * 0.25,
      importanceWeight: importance * 0.20,
      riskMultiplier: risk > 0.5 ? risk * 0.20 : 0,
      temporalPressure: temporalPressure * 0.20,
      businessImpact: businessValue * 0.10,
      humanImpact: humanValue * 0.05,
    };

    const score = Object.values(factors).reduce((sum, v) => sum + v, 0);

    return {
      score: Math.min(1, Math.max(0, score)),
      timeCritical,
      impactImminent,
      requiresImmediateAction,
      factors,
    };
  }

  isTimeCritical(urgency: number, temporalPressure: number): boolean {
    return urgency > 0.7 || temporalPressure > 0.8;
  }

  requiresEscalation(urgency: number, importance: number, risk: number): boolean {
    return (urgency > 0.8 && importance > 0.6) || (risk > 0.7 && urgency > 0.6);
  }
}
