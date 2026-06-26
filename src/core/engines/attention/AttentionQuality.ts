import { Attention, AttentionQualityProfile } from "./AttentionTypes";

const WEIGHTS = {
  priorityAccuracy: 0.12,
  focusStability: 0.10,
  allocationEfficiency: 0.10,
  contextAwareness: 0.10,
  goalAlignment: 0.10,
  riskSensitivity: 0.08,
  opportunityRecognition: 0.08,
  noveltyDetection: 0.08,
  explainability: 0.08,
  fairness: 0.06,
  confidence: 0.06,
  traceability: 0.04,
};

export class AttentionQuality {
  evaluate(attention: Attention): { profile: AttentionQualityProfile; qualityScore: number } {
    const priorityAccuracy = this.gradePriorityAccuracy(attention);
    const focusStability = this.gradeFocusStability(attention);
    const allocationEfficiency = this.gradeAllocationEfficiency(attention);
    const contextAwareness = this.gradeContextAwareness(attention);
    const goalAlignment = this.gradeGoalAlignment(attention);
    const riskSensitivity = this.gradeRiskSensitivity(attention);
    const opportunityRecognition = this.gradeOpportunityRecognition(attention);
    const noveltyDetection = this.gradeNoveltyDetection(attention);
    const explainability = this.gradeExplainability(attention);
    const fairness = this.gradeFairness(attention);
    const confidence = attention.scoringFactors.finalScore > 0
      ? Math.min(1, attention.scoringFactors.baseScore / attention.scoringFactors.finalScore)
      : 0.5;
    const traceability = this.gradeTraceability(attention);

    const profile: AttentionQualityProfile = {
      priorityAccuracy, focusStability, allocationEfficiency,
      contextAwareness, goalAlignment, riskSensitivity,
      opportunityRecognition, noveltyDetection, explainability,
      fairness, confidence, traceability,
    };

    const qualityScore =
      priorityAccuracy * WEIGHTS.priorityAccuracy +
      focusStability * WEIGHTS.focusStability +
      allocationEfficiency * WEIGHTS.allocationEfficiency +
      contextAwareness * WEIGHTS.contextAwareness +
      goalAlignment * WEIGHTS.goalAlignment +
      riskSensitivity * WEIGHTS.riskSensitivity +
      opportunityRecognition * WEIGHTS.opportunityRecognition +
      noveltyDetection * WEIGHTS.noveltyDetection +
      explainability * WEIGHTS.explainability +
      fairness * WEIGHTS.fairness +
      confidence * WEIGHTS.confidence +
      traceability * WEIGHTS.traceability;

    return { profile, qualityScore: Math.max(0.01, Math.min(0.99, qualityScore)) };
  }

  private gradePriorityAccuracy(attention: Attention): number {
    const { urgency, importance, risk, opportunity, businessValue, humanValue } = attention.priorityFactors;
    const computed = urgency * 0.2 + importance * 0.2 + risk * 0.15 + opportunity * 0.15 + businessValue * 0.15 + humanValue * 0.15;
    return Math.min(1, computed + 0.3);
  }

  private gradeFocusStability(attention: Attention): number {
    if (attention.timesInterrupted === 0 && attention.timesRefocused === 0) return 0.8;
    const stability = 1 - (attention.timesInterrupted + attention.timesRefocused) * 0.1;
    return Math.max(0.1, stability);
  }

  private gradeAllocationEfficiency(attention: Attention): number {
    if (attention.allocation === 0) return 0.5;
    if (attention.budgetConsumption === 0) return 0.5;
    return Math.min(1, attention.allocation / attention.budgetConsumption);
  }

  private gradeContextAwareness(attention: Attention): number {
    return attention.priorityFactors.contextRelevance;
  }

  private gradeGoalAlignment(attention: Attention): number {
    return attention.priorityFactors.goalAlignment;
  }

  private gradeRiskSensitivity(attention: Attention): number {
    return attention.priorityFactors.risk;
  }

  private gradeOpportunityRecognition(attention: Attention): number {
    return attention.priorityFactors.opportunity;
  }

  private gradeNoveltyDetection(attention: Attention): number {
    return attention.priorityFactors.novelty;
  }

  private gradeExplainability(attention: Attention): number {
    let score = 0;
    if (attention.identity.name.length > 5) score += 0.25;
    if (attention.provenance.sourceIds.length > 0) score += 0.25;
    if (attention.provenance.creationTimeline.length > 0) score += 0.25;
    if (attention.metadata.tags.length > 0) score += 0.25;
    return score;
  }

  private gradeFairness(attention: Attention): number {
    if (attention.metadata.starveBoostCount === 0) return 0.9;
    return Math.max(0.3, 1 - attention.metadata.starveBoostCount * 0.1);
  }

  private gradeTraceability(attention: Attention): number {
    let score = 0;
    if (attention.provenance.sourceIds.length > 0) score += 0.25;
    if (attention.provenance.sourceTypes.length > 0) score += 0.25;
    if (attention.provenance.versionHistory.length > 1) score += 0.25;
    if (attention.provenance.creationTimeline.length > 1) score += 0.25;
    return score;
  }
}
