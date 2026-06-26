export interface RiskAssessment {
  readonly score: number;
  readonly category: string;
  readonly impact: number;
  readonly likelihood: number;
  readonly severity: string;
  readonly requiresMitigation: boolean;
  readonly factors: Record<string, number>;
}

export class AttentionRisk {
  evaluate(risk: number, urgency: number, importance: number, uncertainty: number): RiskAssessment {
    const impact = risk * 0.5 + importance * 0.3 + urgency * 0.2;
    const likelihood = risk * 0.6 + uncertainty * 0.4;
    const score = impact * 0.6 + likelihood * 0.4;

    const factors: Record<string, number> = {
      baseRisk: risk * 0.30,
      importanceAmplifier: importance > 0.5 ? importance * 0.20 : 0,
      urgencyAmplifier: urgency > 0.5 ? urgency * 0.20 : 0,
      uncertaintyMultiplier: uncertainty > 0.5 ? uncertainty * 0.15 : 0,
      impactScore: impact * 0.15,
    };

    const severity = score >= 0.8 ? "critical" : score >= 0.6 ? "high" : score >= 0.4 ? "medium" : score >= 0.2 ? "low" : "minimal";

    return {
      score: Math.min(1, score),
      category: severity,
      impact,
      likelihood,
      severity,
      requiresMitigation: score > 0.5,
      factors,
    };
  }

  isHighRisk(risk: number, importance: number): boolean {
    return risk > 0.7 || (risk > 0.5 && importance > 0.7);
  }
}
