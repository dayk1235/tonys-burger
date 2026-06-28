import {
  Reasoning,
  ReasoningConclusion,
  ReasoningAlternative,
  ReasoningTradeoff,
  ReasoningConstraint,
  ReasoningHypothesis,
} from "./ReasoningTypes";

export interface ConclusionBuildResult {
  readonly conclusion: ReasoningConclusion;
  readonly preferredAlternativeId: string | null;
  readonly uncertaintyRanges: readonly string[];
  readonly tradeoffHighlights: readonly string[];
}

export class ReasoningConclusionBuilder {
  build(
    reasoning: Reasoning,
    alternatives: ReasoningAlternative[],
    tradeoffs: ReasoningTradeoff[],
    constraints: ReasoningConstraint[],
    hypotheses: ReasoningHypothesis[]
  ): ConclusionBuildResult {
    const feasibleAlts = alternatives.filter(
      (a) => a.status !== "INFEASIBLE" && a.status !== "DISCARDED"
    );

    const scoredAlts = feasibleAlts.map((alt) => {
      const score =
        alt.businessImpact * 0.3 +
        alt.opportunityScore * 0.25 +
        alt.ownerAlignment * 0.2 +
        (1 - alt.riskLevel) * 0.15 +
        (1 - Math.min(1, alt.costEstimate / 100)) * 0.1;
      return { alternative: alt, score };
    });

    scoredAlts.sort((a, b) => b.score - a.score);

    const preferredAlternativeId = scoredAlts.length > 0 ? scoredAlts[0].alternative.id : null;

    const uncertaintyRanges: string[] = [];
    if (reasoning.confidenceProfile.evidenceStrength < 0.5) {
      uncertaintyRanges.push("Evidence strength is low — confidence range may shift with additional data");
    }
    if (reasoning.confidenceProfile.knowledgeCoverage < 0.5) {
      uncertaintyRanges.push("Knowledge coverage is limited — broader context may alter analysis");
    }
    if (reasoning.confidenceProfile.isOverconfident) {
      uncertaintyRanges.push("Overconfidence detected — calibrated confidence is lower than raw confidence");
    }

    const tradeoffHighlights = tradeoffs.slice(0, 3).map((t) => t.recommendation);

    const topHypotheses = hypotheses.filter((h) => h.status === "SUPPORTED" || h.status === "ACTIVE");
    const topConstraint = constraints.filter((c) => c.severity === "CRITICAL");
    const rejectedHypotheses = hypotheses.filter((h) => h.status === "REJECTED");

    const narrativeParts: string[] = [];
    narrativeParts.push(`Reasoning analysis for: "${reasoning.question.text}"`);
    narrativeParts.push(`Evaluated ${hypotheses.length} hypotheses, ${alternatives.length} alternatives, ${constraints.length} constraints.`);

    if (topHypotheses.length > 0) {
      narrativeParts.push(`Supported hypotheses: ${topHypotheses.map((h) => h.title).join(", ")}`);
    }
    if (rejectedHypotheses.length > 0) {
      narrativeParts.push(`Rejected hypotheses: ${rejectedHypotheses.map((h) => h.title).join(", ")}`);
    }
    if (topConstraint.length > 0) {
      narrativeParts.push(`Critical constraints: ${topConstraint.map((c) => c.description).join(", ")}`);
    }

    if (preferredAlternativeId) {
      const preferred = scoredAlts[0].alternative;
      narrativeParts.push(`Preferred alternative: ${preferred.title}`);
      narrativeParts.push(`Business impact: ${(preferred.businessImpact * 100).toFixed(0)}%, Risk: ${(preferred.riskLevel * 100).toFixed(0)}%`);
    } else {
      narrativeParts.push("No feasible alternatives identified — further evidence or re-scoping required.");
    }

    const summary = scoredAlts.length > 0
      ? `Analysis concludes: ${scoredAlts[0].alternative.title} emerges as preferred approach (score: ${scoredAlts[0].score.toFixed(2)})`
      : "Analysis complete — all alternatives eliminated by constraints";

    const assumptions = reasoning.question.assumptions.length > 0
      ? [...reasoning.question.assumptions]
      : [];

    const unresolvedQuestions: string[] = [];
    if (uncertaintyRanges.length > 0) {
      unresolvedQuestions.push("How would additional evidence change the preference ordering?");
    }
    if (rejectedHypotheses.length > 0) {
      unresolvedQuestions.push("What conditions would restore rejected hypotheses to viability?");
    }
    if (reasoning.informationGaps.length > 0) {
      unresolvedQuestions.push(`Could resolving ${reasoning.informationGaps.filter((g) => g.canBeResolved).length} resolvable information gaps shift the conclusion?`);
    }

    const conclusion: ReasoningConclusion = {
      id: `con_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      summary,
      narrative: narrativeParts.join("\n"),
      preferredAlternativeId,
      confidence: reasoning.confidence,
      uncertaintyRanges: [...uncertaintyRanges],
      tradeoffHighlights: [...tradeoffHighlights],
      assumptions: [...assumptions],
      unresolvedQuestions: [...unresolvedQuestions],
      timestamp: new Date().toISOString(),
    };

    return {
      conclusion,
      preferredAlternativeId,
      uncertaintyRanges,
      tradeoffHighlights,
    };
  }
}
