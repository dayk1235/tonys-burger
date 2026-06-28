import { Reasoning, ReasoningHypothesis, HypothesisStatus } from "./ReasoningTypes";
import { ReasoningFactory } from "./ReasoningFactory";
import { HypothesisGenerationError } from "./ReasoningErrors";

export interface HypothesisGenerationResult {
  readonly hypotheses: readonly ReasoningHypothesis[];
  readonly inferenceCount: number;
}

export class ReasoningHypotheses {
  private factory: ReasoningFactory;

  constructor(factory: ReasoningFactory) {
    this.factory = factory;
  }

  generate(reasoning: Reasoning): HypothesisGenerationResult {
    const hypotheses: ReasoningHypothesis[] = [];
    let inferenceCount = 0;

    const question = reasoning.question.text.toLowerCase();
    const intent = reasoning.question.intent.toLowerCase();

    if (question.includes("why") || intent.includes("cause") || intent.includes("root")) {
      hypotheses.push(this.factory.createHypothesis(
        "Causal explanation",
        "The observed situation is caused by a root factor that can be identified through evidence analysis."
      ));
      inferenceCount++;
    }

    if (question.includes("what") || intent.includes("identify") || intent.includes("determine")) {
      hypotheses.push(this.factory.createHypothesis(
        "Diagnostic hypothesis",
        "The situation can be diagnosed by evaluating available evidence against known patterns."
      ));
      inferenceCount++;
    }

    if (question.includes("how") || intent.includes("improve") || intent.includes("optimize")) {
      hypotheses.push(this.factory.createHypothesis(
        "Improvement hypothesis",
        "The current approach can be improved by addressing identified gaps and constraints."
      ));
      inferenceCount++;
    }

    if (question.includes("should") || intent.includes("evaluate") || intent.includes("assess")) {
      hypotheses.push(this.factory.createHypothesis(
        "Evaluation hypothesis",
        "The options can be evaluated against business criteria to determine optimal approach."
      ));
      inferenceCount++;
    }

    if (question.includes("risk") || intent.includes("danger") || intent.includes("threat")) {
      hypotheses.push(this.factory.createHypothesis(
        "Risk assessment hypothesis",
        "Risks can be identified, categorized, and mitigated through systematic analysis."
      ));
      inferenceCount++;
    }

    if (hypotheses.length === 0) {
      hypotheses.push(this.factory.createHypothesis(
        "General analysis hypothesis",
        "Systematic analysis of available evidence and knowledge will yield actionable insights."
      ));
      inferenceCount++;
    }

    const withStatus = hypotheses.map((h) => ({
      ...h,
      status: "ACTIVE" as HypothesisStatus,
      evidenceStrength: reasoning.confidence > 0 ? reasoning.confidence * 0.6 : 0.4,
    }));

    return { hypotheses: withStatus, inferenceCount };
  }

  support(hypothesis: ReasoningHypothesis, evidenceId: string): ReasoningHypothesis {
    return {
      ...hypothesis,
      evidenceStrength: Math.min(1, hypothesis.evidenceStrength + 0.15),
      supportedBy: [...hypothesis.supportedBy, evidenceId],
      status: hypothesis.evidenceStrength >= 0.6 ? "SUPPORTED" : "ACTIVE",
    };
  }

  weaken(hypothesis: ReasoningHypothesis, evidenceId: string): ReasoningHypothesis {
    return {
      ...hypothesis,
      evidenceStrength: Math.max(0, hypothesis.evidenceStrength - 0.15),
      weakenedBy: [...hypothesis.weakenedBy, evidenceId],
      status: hypothesis.evidenceStrength <= 0.2 ? "WEAKENED" : "ACTIVE",
    };
  }

  reject(hypothesis: ReasoningHypothesis, reason: string): ReasoningHypothesis {
    return {
      ...hypothesis,
      evidenceStrength: 0,
      status: "REJECTED",
      weakenedBy: [...hypothesis.weakenedBy, `rejected: ${reason}`],
    };
  }

  pruneByPlausibility(hypotheses: ReasoningHypothesis[], _threshold: number): ReasoningHypothesis[] {
    return hypotheses.filter((h) => h.plausible);
  }

  generateAlternatives(reasoning: Reasoning): { alternatives: import("./ReasoningTypes").ReasoningAlternative[] } {
    const alternatives: import("./ReasoningTypes").ReasoningAlternative[] = [];

    alternatives.push(this.factory.createAlternative(
      "Systematic investigation", "Follow structured reasoning process across all stages."
    ));

    alternatives.push(this.factory.createAlternative(
      "Focused analysis", "Concentrate on highest-probability hypotheses first."
    ));

    if (reasoning.hypotheses.length > 1) {
      alternatives.push(this.factory.createAlternative(
        "Parallel exploration", "Evaluate multiple hypotheses simultaneously for efficiency."
      ));
    }

    return { alternatives };
  }
}
