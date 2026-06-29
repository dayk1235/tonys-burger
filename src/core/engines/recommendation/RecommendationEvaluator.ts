import {
  RecommendationInput,
  RecommendationEvaluation,
  PriorityLevel,
} from "./RecommendationTypes";

interface PriorityRule {
  minProbability: number;
  minConfidence: number;
  priority: PriorityLevel;
}

const PRIORITY_RULES: PriorityRule[] = [
  { minProbability: 0.8, minConfidence: 0.7, priority: "CRITICAL" },
  { minProbability: 0.6, minConfidence: 0.5, priority: "HIGH" },
  { minProbability: 0.4, minConfidence: 0.3, priority: "MEDIUM" },
  { minProbability: 0, minConfidence: 0, priority: "LOW" },
];

export class RecommendationEvaluator {
  evaluate(input: RecommendationInput): RecommendationEvaluation {
    const priority = this.determinePriority(input.forecastProbability, input.confidence);
    const recommendedAction = this.buildAction(input.forecastOutcome, input.expectedResult, priority);
    const expectedBenefit = this.buildBenefit(input.expectedResult, input.forecastOutcome);
    const estimatedRisk = this.buildRisk(input.forecastProbability, input.confidence);
    const explanation = this.buildExplanation(
      input.forecastOutcome,
      input.forecastProbability,
      input.supportingEvidence,
      priority,
    );
    const overallConfidence = this.computeConfidence(input.confidence, input.forecastProbability);

    return {
      priority,
      recommendedAction,
      expectedBenefit,
      estimatedRisk,
      explanation,
      overallConfidence,
    };
  }

  private determinePriority(probability: number, confidence: number): PriorityLevel {
    for (const rule of PRIORITY_RULES) {
      if (probability >= rule.minProbability && confidence >= rule.minConfidence) {
        return rule.priority;
      }
    }
    return "LOW";
  }

  private buildAction(forecastOutcome: string, expectedResult: string, priority: PriorityLevel): string {
    if (expectedResult) {
      return `Implement based on expected outcome: ${expectedResult}`;
    }
    return `Proceed with forecast direction: ${forecastOutcome}`;
  }

  private buildBenefit(expectedResult: string, forecastOutcome: string): string {
    if (expectedResult) return expectedResult;
    if (forecastOutcome) return forecastOutcome;
    return "Improved business outcome based on decision analysis";
  }

  private buildRisk(probability: number, confidence: number): string {
    const riskLevel = 1 - probability;
    const riskConfidence = confidence;
    if (riskLevel < 0.2 && riskConfidence > 0.7) {
      return "Low risk — high confidence and strong probability of success";
    }
    if (riskLevel < 0.4) {
      return `Moderate risk (${(riskLevel * 100).toFixed(0)}% residual uncertainty) — monitor outcomes closely`;
    }
    return `Elevated risk (${(riskLevel * 100).toFixed(0)}% uncertainty) — consider mitigation strategies before proceeding`;
  }

  private buildExplanation(
    forecastOutcome: string,
    probability: number,
    evidence: RecommendationInput["supportingEvidence"],
    priority: PriorityLevel,
  ): string {
    const parts: string[] = [
      `Forecast: "${forecastOutcome}" (probability: ${(probability * 100).toFixed(0)}%).`,
      `Priority: ${priority}.`,
    ];
    if (evidence.rationale) {
      parts.push(`Rationale: ${evidence.rationale}.`);
    }
    if (evidence.expectedResult) {
      parts.push(`Expected: ${evidence.expectedResult}.`);
    }
    return parts.join(" ");
  }

  private computeConfidence(predictionConfidence: number, probability: number): number {
    return Math.round((predictionConfidence * 0.5 + probability * 0.5) * 10000) / 10000;
  }
}
