import { Reasoning, ReasoningTreeStep } from "./ReasoningTypes";

export interface ExplanationChain {
  readonly steps: readonly ExplanationStep[];
  readonly narrative: string;
  readonly confidence: number;
  readonly assumptions: readonly string[];
  readonly unknowns: readonly string[];
}

export interface ExplanationStep {
  readonly index: number;
  readonly label: string;
  readonly detail: string;
  readonly evidence: string;
  readonly confidence: number;
}

export class ReasoningExplanation {
  buildChain(reasoning: Reasoning): ExplanationChain {
    const steps: ExplanationStep[] = [];
    const assumptions: string[] = [];
    const unknowns: string[] = [];
    let stepIndex = 0;

    if (reasoning.question) {
      steps.push({
        index: stepIndex++,
        label: "Question",
        detail: reasoning.question.text,
        evidence: `Type: ${reasoning.question.type}, Intent: ${reasoning.question.intent}`,
        confidence: 1,
      });
    }

    if (reasoning.context.businessPhase !== "idle") {
      steps.push({
        index: stepIndex++,
        label: "Context",
        detail: `Operating in ${reasoning.context.environment} during ${reasoning.context.businessPhase} phase`,
        evidence: `Business pulse: load ${reasoning.context.loadLevel.toFixed(2)}`,
        confidence: 0.8,
      });
    }

    for (const hypothesis of reasoning.hypotheses) {
      steps.push({
        index: stepIndex++,
        label: `Hypothesis: ${hypothesis.title}`,
        detail: hypothesis.description,
        evidence: `Evidence strength: ${hypothesis.evidenceStrength.toFixed(2)}, Status: ${hypothesis.status}`,
        confidence: hypothesis.evidenceStrength,
      });

      if (hypothesis.supportedBy.length > 0) {
        unknowns.push(`Additional evidence could strengthen "${hypothesis.title}"`);
      }
      if (hypothesis.weakenedBy.length > 0) {
        assumptions.push(`"${hypothesis.title}" weakened by counter-evidence`);
      }
    }

    for (const alt of reasoning.alternatives) {
      steps.push({
        index: stepIndex++,
        label: `Alternative: ${alt.title}`,
        detail: alt.description,
        evidence: `Impact: ${alt.businessImpact.toFixed(2)}, Risk: ${alt.riskLevel.toFixed(2)}, Cost: ${alt.costEstimate.toFixed(2)}`,
        confidence: 1 - alt.riskLevel,
      });
    }

    if (reasoning.constraints.length > 0) {
      for (const constraint of reasoning.constraints) {
        const eliminatedCount = constraint.eliminatesAlternativeIds.length;
        if (eliminatedCount > 0) {
          steps.push({
            index: stepIndex++,
            label: `Constraint: ${constraint.description}`,
            detail: `Severity: ${constraint.severity}, Eliminates ${eliminatedCount} alternative(s)`,
            evidence: constraint.rationale,
            confidence: constraint.severity === "CRITICAL" ? 0.95 : 0.7,
          });
        }
      }
    }

    if (reasoning.tradeoffs.length > 0) {
      for (const tradeoff of reasoning.tradeoffs.slice(0, 3)) {
        steps.push({
          index: stepIndex++,
          label: `Tradeoff: ${tradeoff.dimension}`,
          detail: tradeoff.recommendation,
          evidence: `Score A: ${tradeoff.scoreA.toFixed(2)}, Score B: ${tradeoff.scoreB.toFixed(2)}`,
          confidence: Math.abs(tradeoff.scoreA - tradeoff.scoreB),
        });
      }
    }

    if (reasoning.conclusion) {
      steps.push({
        index: stepIndex++,
        label: "Conclusion",
        detail: reasoning.conclusion.summary,
        evidence: reasoning.conclusion.narrative.slice(0, 200),
        confidence: reasoning.conclusion.confidence,
      });
    }

    const narrative = this.buildNarrative(steps, reasoning);
    const avgConfidence = steps.reduce((s, st) => s + st.confidence, 0) / Math.max(1, steps.length);

    return { steps, narrative, confidence: avgConfidence, assumptions, unknowns };
  }

  private buildNarrative(steps: readonly ExplanationStep[], reasoning: Reasoning): string {
    const parts: string[] = [];

    parts.push(`Reasoning analysis for: "${reasoning.question.text}"`);
    parts.push(`Type: ${reasoning.type} | Confidence: ${(reasoning.confidence * 100).toFixed(0)}%`);

    for (const step of steps) {
      parts.push(`[${step.label}] ${step.detail}`);
    }

    if (reasoning.conclusion) {
      parts.push(`→ Conclusion: ${reasoning.conclusion.summary}`);
      if (reasoning.conclusion.tradeoffHighlights.length > 0) {
        parts.push(`Key tradeoffs: ${reasoning.conclusion.tradeoffHighlights.join("; ")}`);
      }
    }

    return parts.join("\n");
  }

  summarize(reasoning: Reasoning): string {
    const hypoCount = reasoning.hypotheses.length;
    const altCount = reasoning.alternatives.length;
    const constraintCount = reasoning.constraints.length;
    const tradeoffCount = reasoning.tradeoffs.length;

    let summary = `Reasoning "${reasoning.identity.name}" (${reasoning.type}): `;
    summary += `${hypoCount} hypotheses, ${altCount} alternatives, `;
    summary += `${constraintCount} constraints, ${tradeoffCount} tradeoffs. `;
    summary += `Confidence: ${(reasoning.confidence * 100).toFixed(0)}%.`;

    if (reasoning.conclusion) {
      summary += ` Conclusion: ${reasoning.conclusion.summary}`;
    }

    return summary;
  }
}
