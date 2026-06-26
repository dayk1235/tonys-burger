import { Attention, AttentionPriorityFactors } from "./AttentionTypes";

function clamp(v: number): 0 | 1 {
  return v >= 0.5 ? 1 : 0;
}

export interface PriorityResult {
  readonly priority: number;
  readonly factors: AttentionPriorityFactors;
  readonly breakdown: Record<string, number>;
}

export class AttentionPriority {
  compute(attention: Attention, contextOverrides?: Partial<AttentionPriorityFactors>): PriorityResult {
    const factors: AttentionPriorityFactors = {
      ...attention.priorityFactors,
      ...contextOverrides,
    };

    const urgencyScore = factors.urgency;
    const importanceScore = factors.importance;
    const riskScore = factors.risk * 0.9 + (factors.urgency > 0.7 ? 0.1 : 0);
    const opportunityScore = factors.opportunity;
    const businessValueScore = factors.businessValue;
    const humanValueScore = factors.humanValue;
    const temporalScore = factors.temporalPressure;
    const contextScore = factors.contextRelevance;
    const goalScore = factors.goalAlignment;
    const resourceScore = factors.resourceAvailability;
    const uncertaintyScore = factors.uncertainty > 0.5 ? factors.uncertainty * 0.5 : 0;
    const noveltyScore = factors.novelty;
    const confidenceScore = factors.confidence;

    const breakdown: Record<string, number> = {
      urgency: urgencyScore * 0.18,
      importance: importanceScore * 0.16,
      risk: riskScore * 0.12,
      opportunity: opportunityScore * 0.10,
      businessValue: businessValueScore * 0.10,
      humanValue: humanValueScore * 0.08,
      temporal: temporalScore * 0.08,
      context: contextScore * 0.06,
      goalAlignment: goalScore * 0.04,
      resourceAvailability: resourceScore * 0.02,
      uncertainty: uncertaintyScore * 0.02,
      novelty: noveltyScore * 0.02,
      confidence: confidenceScore * 0.02,
    };

    const priority = Object.values(breakdown).reduce((sum, v) => sum + v, 0);

    return {
      priority: Math.max(0, Math.min(1, priority)),
      factors,
      breakdown,
    };
  }

  recomputeForQueued(attention: Attention, waitingTimeMs: number, contextOverrides?: Partial<AttentionPriorityFactors>): PriorityResult {
    const ageBoost = Math.min(0.15, waitingTimeMs / 60000 * 0.01);
    const boost = {
      businessValue: clamp(attention.priorityFactors.businessValue + ageBoost),
    };

    return this.compute(attention, { ...contextOverrides, ...boost });
  }

  compare(a: Attention, b: Attention): number {
    return b.priority - a.priority;
  }

  shouldEscalate(attention: Attention): boolean {
    const { urgency, importance, risk } = attention.priorityFactors;
    return urgency > 0.8 || (importance > 0.7 && risk > 0.6) || (urgency > 0.6 && importance > 0.6 && risk > 0.5);
  }

  getEscalationLevel(attention: Attention): string {
    const { urgency, importance, risk } = attention.priorityFactors;
    const composite = urgency * 0.4 + importance * 0.3 + risk * 0.3;
    if (composite >= 0.9) return "CRITICAL";
    if (composite >= 0.7) return "HIGH";
    if (composite >= 0.5) return "MEDIUM";
    if (composite >= 0.3) return "LOW";
    return "NONE";
  }
}
