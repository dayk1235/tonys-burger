import {
  PredictionInput,
  PredictionForecast,
  SupportingEvidence,
} from "./PredictionTypes";

export class PredictionForecaster {
  generate(input: PredictionInput): {
    forecast: PredictionForecast;
    evidence: SupportingEvidence;
    confidence: number;
  } {
    const forecast = this.buildForecast(input);
    const evidence = this.buildEvidence(input);
    const confidence = this.computeOverallConfidence(input.confidence, forecast.probability);

    return { forecast, evidence, confidence };
  }

  private buildForecast(input: PredictionInput): PredictionForecast {
    const outcome = this.determineOutcome(input.decisionLabel, input.expectedResult, input.context);
    const probability = this.computeProbability(input.confidence);
    const factors = this.extractFactors(input.context, input.expectedResult);

    return { outcome, probability, factors };
  }

  private determineOutcome(decisionLabel: string, expectedResult: string, context: string): string {
    if (!decisionLabel && !expectedResult) {
      return "Insufficient data to form a prediction — no decision pattern identified.";
    }
    const label = decisionLabel || "Unknown decision";
    if (expectedResult) {
      return `Decision "${label}" is expected to yield: ${expectedResult}. Monitor actual outcome to validate.`;
    }
    return `Based on decision "${label}", the anticipated outcome is positive under current operating conditions.`;
  }

  private computeProbability(confidence: number): number {
    return Math.round(Math.max(0, Math.min(1, confidence)) * 10000) / 10000;
  }

  private extractFactors(context: string, expectedResult: string): string[] {
    const factors: string[] = [];
    if (context) factors.push(`Rationale: ${context}`);
    if (expectedResult) factors.push(`Expected outcome: ${expectedResult}`);
    if (factors.length === 0) factors.push("No specific factors identified");
    return factors;
  }

  private buildEvidence(input: PredictionInput): SupportingEvidence {
    return {
      learningId: input.learningId,
      learnedPattern: input.learnedPattern,
      rationale: input.context,
      expectedResult: input.expectedResult,
      confidence: input.confidence,
    };
  }

  private computeOverallConfidence(learningConfidence: number, probability: number): number {
    return Math.round((learningConfidence * 0.6 + probability * 0.4) * 10000) / 10000;
  }
}
