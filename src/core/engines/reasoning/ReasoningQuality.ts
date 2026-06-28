import { Reasoning, ReasoningQualityProfile } from "./ReasoningTypes";

const WEIGHTS = {
  correctness: 0.12, consistency: 0.10, completeness: 0.10,
  depth: 0.08, breadth: 0.08, creativity: 0.06,
  novelty: 0.06, explainability: 0.08, businessAlignment: 0.08,
  robustness: 0.06, efficiency: 0.04, ownerSatisfaction: 0.04,
  confidenceCalibration: 0.06, timeliness: 0.04,
};

export class ReasoningQuality {
  evaluate(reasoning: Reasoning): { profile: ReasoningQualityProfile; qualityScore: number } {
    const correctness = this.gradeCorrectness(reasoning);
    const consistency = this.gradeConsistency(reasoning);
    const completeness = this.gradeCompleteness(reasoning);
    const depth = this.gradeDepth(reasoning);
    const breadth = this.gradeBreadth(reasoning);
    const creativity = this.gradeCreativity(reasoning);
    const novelty = this.gradeNovelty(reasoning);
    const explainability = this.gradeExplainability(reasoning);
    const businessAlignment = this.gradeBusinessAlignment(reasoning);
    const robustness = this.gradeRobustness(reasoning);
    const efficiency = this.gradeEfficiency(reasoning);
    const ownerSatisfaction = this.gradeOwnerSatisfaction(reasoning);
    const confidenceCalibration = this.gradeConfidenceCalibration(reasoning);
    const timeliness = this.gradeTimeliness(reasoning);

    const profile: ReasoningQualityProfile = {
      correctness, consistency, completeness, depth, breadth,
      creativity, novelty, explainability, businessAlignment,
      robustness, efficiency, ownerSatisfaction,
      confidenceCalibration, timeliness,
    };

    const qualityScore =
      correctness * WEIGHTS.correctness +
      consistency * WEIGHTS.consistency +
      completeness * WEIGHTS.completeness +
      depth * WEIGHTS.depth +
      breadth * WEIGHTS.breadth +
      creativity * WEIGHTS.creativity +
      novelty * WEIGHTS.novelty +
      explainability * WEIGHTS.explainability +
      businessAlignment * WEIGHTS.businessAlignment +
      robustness * WEIGHTS.robustness +
      efficiency * WEIGHTS.efficiency +
      ownerSatisfaction * WEIGHTS.ownerSatisfaction +
      confidenceCalibration * WEIGHTS.confidenceCalibration +
      timeliness * WEIGHTS.timeliness;

    return { profile, qualityScore: Math.max(0.01, Math.min(0.99, qualityScore)) };
  }

  private gradeCorrectness(r: Reasoning): number {
    if (r.hypotheses.length === 0) return 0.5;
    const supported = r.hypotheses.filter((h) => h.status === "SUPPORTED");
    return supported.length > 0 ? Math.min(1, supported.length / r.hypotheses.length + 0.3) : 0.3;
  }

  private gradeConsistency(r: Reasoning): number {
    return r.coherenceScore;
  }

  private gradeCompleteness(r: Reasoning): number {
    let score = 0;
    if (r.hypotheses.length > 0) score += 0.2;
    if (r.alternatives.length > 0) score += 0.2;
    if (r.constraints.length > 0) score += 0.15;
    if (r.tradeoffs.length > 0) score += 0.15;
    if (r.conclusion) score += 0.2;
    if (r.tree.length > 3) score += 0.1;
    return score;
  }

  private gradeDepth(r: Reasoning): number {
    if (r.tree.length === 0) return 0;
    const depthLevels = new Set(r.tree.map((s) => s.stepType)).size;
    return Math.min(1, depthLevels / 8);
  }

  private gradeBreadth(r: Reasoning): number {
    const hypoCount = r.hypotheses.length;
    const altCount = r.alternatives.length;
    return Math.min(1, (hypoCount + altCount) / 8);
  }

  private gradeCreativity(r: Reasoning): number {
    return Math.min(1, r.metadata.inferenceCount * 0.1);
  }

  private gradeNovelty(r: Reasoning): number {
    if (r.metadata.reEvaluationCount === 0) return 0.5;
    return Math.max(0.1, 1 - r.metadata.reEvaluationCount * 0.05);
  }

  private gradeExplainability(r: Reasoning): number {
    let score = 0;
    if (r.question.text.length > 10) score += 0.2;
    if (r.hypotheses.length > 0) score += 0.2;
    if (r.tree.length > 2) score += 0.2;
    if (r.conclusion && r.conclusion.narrative.length > 20) score += 0.2;
    if (r.conclusion && r.conclusion.tradeoffHighlights.length > 0) score += 0.2;
    return score;
  }

  private gradeBusinessAlignment(r: Reasoning): number {
    return r.context.businessValue;
  }

  private gradeRobustness(r: Reasoning): number {
    if (r.hypotheses.length === 0) return 0.3;
    const rejected = r.hypotheses.filter((h) => h.status === "REJECTED");
    return Math.min(1, 1 - rejected.length / r.hypotheses.length * 0.5);
  }

  private gradeEfficiency(r: Reasoning): number {
    const steps = r.tree.length;
    const hypotheses = r.hypotheses.length;
    if (steps === 0) return 0.5;
    return Math.min(1, Math.max(0.1, hypotheses / steps * 2));
  }

  private gradeOwnerSatisfaction(r: Reasoning): number {
    return r.relationships.parentCaseIds.length > 0 ? 0.7 : 0.5;
  }

  private gradeConfidenceCalibration(r: Reasoning): number {
    if (r.confidenceProfile.isOverconfident || r.confidenceProfile.isUnderconfident) return 0.3;
    return 0.8;
  }

  private gradeTimeliness(r: Reasoning): number {
    return r.context.urgency > 0 ? Math.min(1, r.provenance.creationTimeline.length * 0.1 + 0.5) : 0.5;
  }
}
