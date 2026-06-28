import { Reasoning, ReasoningConfidenceProfile } from "./ReasoningTypes";

export interface ConfidenceFactor {
  readonly name: string;
  readonly contribution: number;
  readonly weight: number;
  readonly description: string;
}

export interface ConfidenceExplanation {
  readonly baseConfidence: number;
  readonly factors: readonly ConfidenceFactor[];
  readonly evidenceContribution: number;
  readonly knowledgeContribution: number;
  readonly consistencyBonus: number;
  readonly contradictionPenalty: number;
  readonly missingInformationPenalty: number;
  readonly hypothesisCompetitionPenalty: number;
  readonly contextCompleteness: number;
  readonly sourceTrustContribution: number;
  readonly calibratedConfidence: number;
  readonly calibrationAdjustment: number;
  readonly adjustmentReason: string;
  readonly overallExplanation: string;
}

export class ReasoningConfidenceExplanation {
  explain(reasoning: Reasoning, profile: ReasoningConfidenceProfile): ConfidenceExplanation {
    const baseConfidence = profile.evidenceStrength * 0.25 + profile.knowledgeCoverage * 0.15;

    const evidenceContribution = profile.evidenceStrength * 0.25;
    const knowledgeContribution = profile.knowledgeCoverage * 0.20;

    const hypotheses = reasoning.hypotheses;
    const supportedCount = hypotheses.filter((h) => h.status === "SUPPORTED").length;
    const rejectedCount = hypotheses.filter((h) => h.status === "REJECTED").length;
    const weakCount = hypotheses.filter((h) => h.status === "WEAKENED").length;

    const consistencyBonus = profile.consistencyScore * 0.10;
    const contradictionPenalty = rejectedCount > 0 ? Math.min(0.15, rejectedCount * 0.05) : 0;
    const hypothesisCompetitionPenalty = weakCount > 0 ? Math.min(0.10, weakCount * 0.03) : 0;

    const infoGaps = reasoning.informationGaps;
    const missingInformationPenalty = infoGaps.length > 0
      ? Math.min(0.20, infoGaps.reduce((s, g) => s + g.estimatedImpact, 0) / infoGaps.length * 0.15)
      : 0;

    const sourceObservationRatio = Math.min(1, reasoning.provenance.sourceObservationIds.length / 5);
    const sourceMemoryRatio = Math.min(1, reasoning.provenance.sourceMemoryIds.length / 3);
    const sourceKnowledgeRatio = Math.min(1, reasoning.provenance.sourceKnowledgeIds.length / 3);
    const sourceTrustContribution = (sourceObservationRatio * 0.12 + sourceMemoryRatio * 0.08 + sourceKnowledgeRatio * 0.10);

    const contextCompleteness = reasoning.context.environment !== "unknown" ? 0.05 : 0;

    const factors: ConfidenceFactor[] = [
      { name: "Evidence Strength", contribution: evidenceContribution, weight: 0.25, description: `Based on ${reasoning.provenance.sourceObservationIds.length} observation sources` },
      { name: "Knowledge Coverage", contribution: knowledgeContribution, weight: 0.20, description: `Based on ${reasoning.provenance.sourceKnowledgeIds.length} knowledge sources` },
      { name: "Consistency Bonus", contribution: consistencyBonus, weight: 0.10, description: `Hypothesis consistency score: ${profile.consistencyScore.toFixed(2)}` },
      { name: "Source Trust", contribution: sourceTrustContribution, weight: 0.30, description: "Combined trust from observation/memory/knowledge provenance" },
      { name: "Context Completeness", contribution: contextCompleteness, weight: 0.05, description: `Environment: ${reasoning.context.environment}` },
    ];

    const totalFromFactors = factors.reduce((s, f) => s + f.contribution, 0);
    const rawConfidence = Math.min(1, totalFromFactors - contradictionPenalty - hypothesisCompetitionPenalty - missingInformationPenalty + consistencyBonus);

    let calibrationAdjustment = 0;
    let adjustmentReason = "No adjustment needed";

    if (profile.isOverconfident) {
      calibrationAdjustment = -0.2;
      adjustmentReason = `Overconfidence detected: confidence ${rawConfidence.toFixed(2)} exceeds evidence (${profile.evidenceStrength.toFixed(2)}) by more than threshold`;
    } else if (profile.isUnderconfident) {
      calibrationAdjustment = 0.15;
      adjustmentReason = `Underconfidence detected: hypothesis quality (${profile.hypothesisQuality.toFixed(2)}) exceeds confidence by more than threshold`;
    }

    const calibratedConfidence = Math.max(0.01, Math.min(0.99, rawConfidence + calibrationAdjustment));

    const explanationParts: string[] = [];
    explanationParts.push(`Confidence assessed at ${(calibratedConfidence * 100).toFixed(0)}%`);
    explanationParts.push(`Evidence contributes ${(evidenceContribution * 100).toFixed(0)}%, knowledge contributes ${(knowledgeContribution * 100).toFixed(0)}%`);
    if (contradictionPenalty > 0) explanationParts.push(`Contradiction penalty: -${(contradictionPenalty * 100).toFixed(0)}%`);
    if (missingInformationPenalty > 0) explanationParts.push(`Missing information penalty: -${(missingInformationPenalty * 100).toFixed(0)}%`);
    if (hypothesisCompetitionPenalty > 0) explanationParts.push(`Hypothesis competition penalty: -${(hypothesisCompetitionPenalty * 100).toFixed(0)}%`);
    explanationParts.push(adjustmentReason);

    return {
      baseConfidence: profile.evidenceStrength,
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
      overallExplanation: explanationParts.join(". "),
    };
  }
}
