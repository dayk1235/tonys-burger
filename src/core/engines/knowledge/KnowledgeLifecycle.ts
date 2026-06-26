import { KnowledgeStage } from "./KnowledgeTypes";
import { InvalidKnowledgeLifecycleTransitionError } from "./KnowledgeErrors";

const ALLOWED_TRANSITIONS: Record<KnowledgeStage, readonly KnowledgeStage[]> = {
  CANDIDATE: ["EXTRACTED", "STRUCTURED", "ARCHIVED"],
  EXTRACTED: ["STRUCTURED", "VALIDATED", "ARCHIVED"],
  STRUCTURED: ["VALIDATED", "GENERALIZED", "SPECIALIZED", "ARCHIVED"],
  VALIDATED: ["GENERALIZED", "SPECIALIZED", "SEMANTIC", "HISTORICAL", "ARCHIVED"],
  GENERALIZED: ["SPECIALIZED", "SEMANTIC", "CANONICAL", "HISTORICAL", "ARCHIVED"],
  SPECIALIZED: ["GENERALIZED", "SEMANTIC", "CANONICAL", "HISTORICAL", "ARCHIVED"],
  SEMANTIC: ["CANONICAL", "HISTORICAL", "ARCHIVED"],
  CANONICAL: ["HISTORICAL", "ARCHIVED"],
  HISTORICAL: ["ARCHIVED"],
  ARCHIVED: [],
};

export class KnowledgeLifecycle {
  validateTransition(current: KnowledgeStage, target: KnowledgeStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new InvalidKnowledgeLifecycleTransitionError(current, target);
    }
    if (!allowed.includes(target)) {
      throw new InvalidKnowledgeLifecycleTransitionError(current, target);
    }
  }

  canTransition(current: KnowledgeStage, target: KnowledgeStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: KnowledgeStage): boolean {
    const active: KnowledgeStage[] = ["EXTRACTED", "STRUCTURED", "VALIDATED", "GENERALIZED", "SPECIALIZED", "SEMANTIC", "CANONICAL"];
    return active.includes(stage);
  }

  isTerminal(stage: KnowledgeStage): boolean {
    return stage === "ARCHIVED";
  }

  isHistorical(stage: KnowledgeStage): boolean {
    return stage === "HISTORICAL" || stage === "ARCHIVED";
  }

  isCanonical(stage: KnowledgeStage): boolean {
    return stage === "CANONICAL" || stage === "SEMANTIC";
  }

  isAbstract(stage: KnowledgeStage): boolean {
    return stage === "GENERALIZED" || stage === "SEMANTIC" || stage === "CANONICAL";
  }

  getStageIndex(stage: KnowledgeStage): number {
    const order: KnowledgeStage[] = [
      "CANDIDATE", "EXTRACTED", "STRUCTURED", "VALIDATED",
      "GENERALIZED", "SPECIALIZED", "SEMANTIC", "CANONICAL",
      "HISTORICAL", "ARCHIVED",
    ];
    return order.indexOf(stage);
  }
}
