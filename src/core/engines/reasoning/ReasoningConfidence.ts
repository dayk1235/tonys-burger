import { Reasoning, ReasoningConfidenceProfile, ConfidenceExplanation, ConfidenceFactor } from "./ReasoningTypes";

export interface ConfidenceHistoryEntry {
  readonly timestamp: string;
  readonly previousValue: number;
  readonly newValue: number;
  readonly reason: string;
}

export class ReasoningConfidence {
  private history: Map<string, ConfidenceHistoryEntry[]> = new Map();
  private overconfidenceThreshold = 0.2;
  private underconfidenceThreshold = 0.15;

  compute(
    reasoning: Reasoning,
    evidenceStrength: number,
    knowledgeCoverage: number,
    hypothesisQuality: number,
    consistencyScore: number
  ): ReasoningConfidenceProfile {
    const rawConfidence = evidenceStrength * 0.3 + knowledgeCoverage * 0.2 +
      hypothesisQuality * 0.25 + consistencyScore * 0.25;

    const flags: string[] = [];
    const isOverconfident = this.detectOverconfidence(rawConfidence, evidenceStrength, knowledgeCoverage);
    const isUnderconfident = this.detectUnderconfidence(rawConfidence, hypothesisQuality, consistencyScore);

    if (isOverconfident) flags.push("overconfidence detected");
    if (isUnderconfident) flags.push("underconfidence detected");
    if (evidenceStrength < 0.3) flags.push("weak evidence");
    if (knowledgeCoverage < 0.3) flags.push("insufficient knowledge coverage");
    if (hypothesisQuality < 0.3) flags.push("poor hypothesis quality");
    if (consistencyScore < 0.4) flags.push("consistency concerns");

    let calibratedConfidence = rawConfidence;
    if (isOverconfident) calibratedConfidence -= this.overconfidenceThreshold;
    if (isUnderconfident) calibratedConfidence += this.underconfidenceThreshold;
    calibratedConfidence = Math.max(0.01, Math.min(0.99, calibratedConfidence));

    return {
      evidenceStrength, knowledgeCoverage, hypothesisQuality,
      consistencyScore, overallConfidence: rawConfidence,
      calibratedConfidence, isOverconfident, isUnderconfident, flags,
    };
  }

  getConfidenceLevel(confidence: number): string {
    if (confidence >= 0.9) return "VERY_HIGH";
    if (confidence >= 0.7) return "HIGH";
    if (confidence >= 0.4) return "MODERATE";
    if (confidence >= 0.2) return "LOW";
    return "VERY_LOW";
  }

  generateExplanation(profile: ReasoningConfidenceProfile): ConfidenceExplanation {
    const factors: ConfidenceFactor[] = [
      {
        name: "Evidence Strength",
        contribution: profile.evidenceStrength,
        weight: 0.3,
        description: `Strength of gathered evidence (${(profile.evidenceStrength * 100).toFixed(0)}%)`,
      },
      {
        name: "Knowledge Coverage",
        contribution: profile.knowledgeCoverage,
        weight: 0.2,
        description: `Completeness of relevant knowledge (${(profile.knowledgeCoverage * 100).toFixed(0)}%)`,
      },
      {
        name: "Hypothesis Quality",
        contribution: profile.hypothesisQuality,
        weight: 0.25,
        description: `Quality of generated hypotheses (${(profile.hypothesisQuality * 100).toFixed(0)}%)`,
      },
      {
        name: "Consistency Score",
        contribution: profile.consistencyScore,
        weight: 0.25,
        description: `Internal consistency of the reasoning (${(profile.consistencyScore * 100).toFixed(0)}%)`,
      },
    ];

    const evidenceContribution = profile.evidenceStrength * 0.3;
    const knowledgeContribution = profile.knowledgeCoverage * 0.2;
    const consistencyBonus = profile.consistencyScore > 0.7 ? 0.05 : 0;
    const contradictionPenalty = profile.consistencyScore < 0.3 ? 0.1 : 0;
    const missingInformationPenalty = profile.knowledgeCoverage < 0.3 ? 0.08 : 0;
    const hypothesisCompetitionPenalty = profile.hypothesisQuality < 0.3 ? 0.05 : 0;
    const contextCompleteness = (profile.evidenceStrength + profile.knowledgeCoverage) / 2;
    const sourceTrustContribution = profile.evidenceStrength > 0.5 ? 0.03 : 0;

    const calibratedConfidence = profile.calibratedConfidence;
    const calibrationAdjustment = calibratedConfidence - profile.overallConfidence;

    let adjustmentReason = "No overconfidence or underconfidence detected";
    if (profile.isOverconfident && profile.isUnderconfident) {
      adjustmentReason = "Both overconfidence and underconfidence detected — net adjustment applied";
    } else if (profile.isOverconfident) {
      adjustmentReason = `Overconfidence detected — confidence reduced by ${this.overconfidenceThreshold}`;
    } else if (profile.isUnderconfident) {
      adjustmentReason = `Underconfidence detected — confidence increased by ${this.underconfidenceThreshold}`;
    }

    const overallExplanation = `Confidence ${(calibratedConfidence * 100).toFixed(0)}%: ` +
      `evidence contributes ${(evidenceContribution * 100).toFixed(0)}%, ` +
      `knowledge contributes ${(knowledgeContribution * 100).toFixed(0)}%, ` +
      `calibrated from raw ${(profile.overallConfidence * 100).toFixed(0)}%. ` +
      adjustmentReason;

    return {
      baseConfidence: profile.overallConfidence,
      factors,
      evidenceContribution,
      knowledgeContribution,
      consistencyBonus,
      contradictionPenalty,
      missingInformationPenalty,
      hypothesisCompetitionPenalty,
      contextCompleteness,
      sourceTrustContribution,
      calibratedConfidence,
      calibrationAdjustment,
      adjustmentReason,
      overallExplanation,
    };
  }

  recordHistory(reasoningId: string, previousValue: number, newValue: number, reason: string): void {
    const entry: ConfidenceHistoryEntry = {
      timestamp: new Date().toISOString(), previousValue, newValue, reason,
    };
    const existing = this.history.get(reasoningId) || [];
    existing.push(entry);
    this.history.set(reasoningId, existing);
  }

  getHistory(reasoningId: string): readonly ConfidenceHistoryEntry[] {
    return this.history.get(reasoningId) || [];
  }

  private detectOverconfidence(confidence: number, evidence: number, knowledge: number): boolean {
    return confidence - Math.max(evidence, knowledge) > this.overconfidenceThreshold;
  }

  private detectUnderconfidence(confidence: number, hypothesis: number, consistency: number): boolean {
    return Math.max(hypothesis, consistency) - confidence > this.underconfidenceThreshold;
  }

  setThresholds(over: number, under: number): void {
    this.overconfidenceThreshold = over;
    this.underconfidenceThreshold = under;
  }
}
