import { ReasoningStage } from "./ReasoningTypes";
import { InvalidReasoningLifecycleTransitionError } from "./ReasoningErrors";

const ALLOWED_TRANSITIONS: Record<ReasoningStage, readonly ReasoningStage[]> = {
  CANDIDATE: ["ACTIVATED", "ARCHIVED", "RETIRED"],
  ACTIVATED: ["CONTEXT_BUILDING", "RETIRED"],
  CONTEXT_BUILDING: ["INFORMATION_GAP_DETECTION", "ACTIVATED", "RETIRED"],
  INFORMATION_GAP_DETECTION: ["EVIDENCE_GATHERING", "RETIRED"],
  EVIDENCE_GATHERING: ["KNOWLEDGE_RETRIEVAL", "RETIRED"],
  KNOWLEDGE_RETRIEVAL: ["HYPOTHESIS_GENERATION", "RETIRED"],
  HYPOTHESIS_GENERATION: ["ALTERNATIVE_GENERATION", "RETIRED"],
  ALTERNATIVE_GENERATION: ["CONSTRAINT_EVALUATION", "RETIRED"],
  CONSTRAINT_EVALUATION: ["TRADEOFF_EVALUATION", "RETIRED"],
  TRADEOFF_EVALUATION: ["CONSISTENCY_CHECKING", "RETIRED"],
  CONSISTENCY_CHECKING: ["CONFIDENCE_ASSESSMENT", "HYPOTHESIS_GENERATION", "RETIRED"],
  CONFIDENCE_ASSESSMENT: ["CONFIDENCE_EXPLANATION", "HYPOTHESIS_GENERATION", "RETIRED"],
  CONFIDENCE_EXPLANATION: ["CONCLUSION_BUILDING", "RETIRED"],
  CONCLUSION_BUILDING: ["COMPLETED", "RETIRED"],
  COMPLETED: ["ARCHIVED", "RETIRED"],
  ARCHIVED: ["RETIRED"],
  RETIRED: [],
};

export class ReasoningLifecycle {
  validateTransition(current: ReasoningStage, target: ReasoningStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new InvalidReasoningLifecycleTransitionError(current, target);
    }
    if (!allowed.includes(target)) {
      throw new InvalidReasoningLifecycleTransitionError(current, target);
    }
  }

  canTransition(current: ReasoningStage, target: ReasoningStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: ReasoningStage): boolean {
    const active: ReasoningStage[] = [
      "ACTIVATED", "CONTEXT_BUILDING", "INFORMATION_GAP_DETECTION", "EVIDENCE_GATHERING",
      "KNOWLEDGE_RETRIEVAL", "HYPOTHESIS_GENERATION", "ALTERNATIVE_GENERATION",
      "CONSTRAINT_EVALUATION", "TRADEOFF_EVALUATION", "CONSISTENCY_CHECKING",
      "CONFIDENCE_ASSESSMENT", "CONFIDENCE_EXPLANATION", "CONCLUSION_BUILDING",
    ];
    return active.includes(stage);
  }

  isTerminal(stage: ReasoningStage): boolean {
    return stage === "ARCHIVED" || stage === "RETIRED";
  }

  isCompleted(stage: ReasoningStage): boolean {
    return stage === "COMPLETED" || stage === "ARCHIVED" || stage === "RETIRED";
  }

  canReenterHypothesis(stage: ReasoningStage): boolean {
    return stage === "CONSISTENCY_CHECKING" || stage === "CONFIDENCE_ASSESSMENT";
  }

  getStageIndex(stage: ReasoningStage): number {
    const order: ReasoningStage[] = [
      "CANDIDATE", "ACTIVATED", "CONTEXT_BUILDING", "INFORMATION_GAP_DETECTION",
      "EVIDENCE_GATHERING", "KNOWLEDGE_RETRIEVAL", "HYPOTHESIS_GENERATION",
      "ALTERNATIVE_GENERATION", "CONSTRAINT_EVALUATION", "TRADEOFF_EVALUATION",
      "CONSISTENCY_CHECKING", "CONFIDENCE_ASSESSMENT", "CONFIDENCE_EXPLANATION",
      "CONCLUSION_BUILDING", "COMPLETED", "ARCHIVED", "RETIRED",
    ];
    return order.indexOf(stage);
  }
}
