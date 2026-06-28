import { Reasoning, ReasoningHypothesis, ReasoningAlternative } from "./ReasoningTypes";

export class ReasoningScoring {
  scoreHypothesis(hypothesis: ReasoningHypothesis): number {
    const evidenceScore = hypothesis.evidenceStrength;
    const supportRatio = hypothesis.supportedBy.length / Math.max(1, hypothesis.supportedBy.length + hypothesis.weakenedBy.length);
    const statusMultiplier = hypothesis.status === "SUPPORTED" ? 1 : hypothesis.status === "ACTIVE" ? 0.7 : 0.3;

    return Math.min(1, evidenceScore * 0.4 + supportRatio * 0.3 + statusMultiplier * 0.3);
  }

  scoreAlternative(alternative: ReasoningAlternative): number {
    const businessScore = alternative.businessImpact * 0.3;
    const riskScore = (1 - alternative.riskLevel) * 0.2;
    const costScore = (1 - Math.min(1, alternative.costEstimate / 100)) * 0.15;
    const opportunityScore = alternative.opportunityScore * 0.2;
    const alignmentScore = alternative.ownerAlignment * 0.15;

    const constraintPenalty = alternative.constraintViolations.length * 0.1;
    const statusMultiplier = alternative.status === "FEASIBLE" ? 1 : alternative.status === "SELECTED" ? 1.1 : 0.3;

    const raw = (businessScore + riskScore + costScore + opportunityScore + alignmentScore) * statusMultiplier - constraintPenalty;
    return Math.max(0, Math.min(1, raw));
  }

  scoreEvidenceWeight(evidenceCount: number, conflictCount: number): number {
    if (evidenceCount === 0) return 0;
    const conflictRatio = conflictCount / evidenceCount;
    return Math.min(1, (evidenceCount / 10) * (1 - conflictRatio * 0.5));
  }

  scoreConsistency(hypotheses: ReasoningHypothesis[]): number {
    if (hypotheses.length === 0) return 0.5;
    const supportedCount = hypotheses.filter((h) => h.status === "SUPPORTED").length;
    const rejectedCount = hypotheses.filter((h) => h.status === "REJECTED").length;

    if (supportedCount === 0 && rejectedCount === 0) return 0.5;
    return Math.min(1, supportedCount / Math.max(1, supportedCount + rejectedCount));
  }

  scoreBusinessAlignment(
    alternatives: ReasoningAlternative[],
    contextBusinessValue: number
  ): number {
    if (alternatives.length === 0) return contextBusinessValue;
    const avgAlignment = alternatives.reduce((s, a) => s + a.ownerAlignment, 0) / alternatives.length;
    return (avgAlignment * 0.5 + contextBusinessValue * 0.5);
  }

  computeCoherence(evidenceStrength: number, consistencyScore: number, hypothesisQuality: number): number {
    return Math.min(1, evidenceStrength * 0.4 + consistencyScore * 0.3 + hypothesisQuality * 0.3);
  }
}
