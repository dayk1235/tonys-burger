import { DecisionAlternative, AlternativeEvaluation } from "./DecisionTypes";
import { DecisionEvaluatorContract } from "./DecisionContracts";

interface Weights {
  readonly risk: number;
  readonly opportunity: number;
  readonly cost: number;
  readonly humanImpact: number;
  readonly reversibility: number;
}

const DEFAULT_WEIGHTS: Weights = {
  risk: 0.25,
  opportunity: 0.25,
  cost: 0.15,
  humanImpact: 0.20,
  reversibility: 0.15,
};

const REVERSIBILITY_SCORES: Record<string, number> = {
  REVERSIBLE: 0.9,
  CONDITIONALLY_REVERSIBLE: 0.5,
  IRREVERSIBLE: 0.2,
};

const MAX_COST_REFERENCE = 10000;

export class DecisionEvaluator implements DecisionEvaluatorContract {
  private readonly weights: Weights;

  constructor(weights?: Partial<Weights>) {
    this.weights = { ...DEFAULT_WEIGHTS, ...weights };
  }

  evaluateAlternatives(
    alternatives: readonly DecisionAlternative[],
  ): {
    evaluations: AlternativeEvaluation[];
    selectedAlternativeId: string | null;
    selectedLabel: string;
    bestScore: number;
  } {
    if (alternatives.length === 0) {
      return {
        evaluations: [],
        selectedAlternativeId: null,
        selectedLabel: "",
        bestScore: 0,
      };
    }

    const evaluations: AlternativeEvaluation[] = alternatives.map((alt) => {
      const riskScore = 1 - alt.riskLevel;
      const opportunityScore = alt.opportunityScore;
      const costScore = 1 - Math.min(alt.costEstimate / MAX_COST_REFERENCE, 1);
      const humanImpactScore = alt.humanImpactScore;
      const reversibilityScore = REVERSIBILITY_SCORES[alt.reversibility] ?? 0.5;

      const weightedScore =
        this.weights.risk * riskScore +
        this.weights.opportunity * opportunityScore +
        this.weights.cost * costScore +
        this.weights.humanImpact * humanImpactScore +
        this.weights.reversibility * reversibilityScore;

      return {
        alternativeId: alt.id,
        label: alt.label,
        riskScore,
        opportunityScore,
        costScore,
        humanImpactScore,
        reversibilityScore,
        weightedScore: roundScore(weightedScore),
        isSelected: false,
      };
    });

    let bestIndex = 0;
    for (let i = 1; i < evaluations.length; i++) {
      const current = evaluations[i];
      const best = evaluations[bestIndex];
      if (
        current.weightedScore > best.weightedScore ||
        (current.weightedScore === best.weightedScore &&
          (1 - alternatives[i].riskLevel) > (1 - alternatives[bestIndex].riskLevel))
      ) {
        bestIndex = i;
      }
    }

    evaluations[bestIndex] = { ...evaluations[bestIndex], isSelected: true };

    return {
      evaluations,
      selectedAlternativeId: alternatives[bestIndex]?.id ?? null,
      selectedLabel: alternatives[bestIndex]?.label ?? "",
      bestScore: evaluations[bestIndex]?.weightedScore ?? 0,
    };
  }

  computeConfidence(reasoningConfidence: number, bestAlternativeScore: number): number {
    return roundScore(reasoningConfidence * 0.7 + bestAlternativeScore * 0.3);
  }

  generateRationale(
    evaluations: AlternativeEvaluation[],
    selectedAlternativeId: string | null,
    selectedLabel: string,
  ): string {
    if (!selectedAlternativeId) {
      return "No alternative was selected — no viable options available.";
    }

    const selected = evaluations.find((e) => e.alternativeId === selectedAlternativeId);
    if (!selected) {
      return `Selected "${selectedLabel}" as the best available option.`;
    }

    const parts: string[] = [
      `Selected "${selectedLabel}" (composite score: ${selected.weightedScore.toFixed(3)})`,
    ];

    const dimensionLabels: [keyof AlternativeEvaluation, string][] = [
      ["riskScore", "risk"],
      ["opportunityScore", "opportunity"],
      ["costScore", "cost"],
      ["humanImpactScore", "human impact"],
      ["reversibilityScore", "reversibility"],
    ];

    const details = dimensionLabels
      .map(([key, label]) => `${label}=${(selected[key] as number).toFixed(2)}`)
      .join(", ");

    parts.push(`— evaluated across ${details}.`);
    parts.push(`Weights: risk=${this.weights.risk}, opportunity=${this.weights.opportunity}, cost=${this.weights.cost}, humanImpact=${this.weights.humanImpact}, reversibility=${this.weights.reversibility}.`);

    const totalAlternatives = evaluations.length;
    const bestScore = selected.weightedScore;
    const runnerUp = evaluations
      .filter((e) => !e.isSelected)
      .reduce((best, e) => (e.weightedScore > best ? e.weightedScore : best), 0);

    parts.push(
      `Chosen from ${totalAlternatives} alternative(s) (score gap vs. runner-up: ${(bestScore - runnerUp).toFixed(3)}).`,
    );

    return parts.join(" ");
  }
}

function roundScore(value: number): number {
  return Math.round(value * 10000) / 10000;
}
