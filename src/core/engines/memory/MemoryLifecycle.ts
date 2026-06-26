import { MemoryStage } from "./MemoryTypes";
import { InvalidMemoryLifecycleTransitionError } from "./MemoryErrors";

const ALLOWED_TRANSITIONS: Record<MemoryStage, readonly MemoryStage[]> = {
  WORKING: ["CANDIDATE", "ARCHIVED"],
  CANDIDATE: ["SHORT_TERM", "STABILIZING", "ARCHIVED"],
  SHORT_TERM: ["STABILIZING", "CONSOLIDATED", "HISTORICAL", "ARCHIVED"],
  STABILIZING: ["CONSOLIDATED", "LONG_TERM", "HISTORICAL", "ARCHIVED"],
  CONSOLIDATED: ["LONG_TERM", "SEMANTIC", "HISTORICAL", "ARCHIVED"],
  LONG_TERM: ["SEMANTIC", "HISTORICAL", "ARCHIVED"],
  SEMANTIC: ["HISTORICAL", "ARCHIVED"],
  HISTORICAL: ["SHORT_TERM", "ARCHIVED"],
  ARCHIVED: ["SHORT_TERM"],
};

export class MemoryLifecycle {
  validateTransition(current: MemoryStage, target: MemoryStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new InvalidMemoryLifecycleTransitionError(current, target);
    }
    if (!allowed.includes(target)) {
      throw new InvalidMemoryLifecycleTransitionError(current, target);
    }
  }

  canTransition(current: MemoryStage, target: MemoryStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: MemoryStage): boolean {
    const active: MemoryStage[] = ["SHORT_TERM", "STABILIZING", "CONSOLIDATED", "LONG_TERM", "SEMANTIC"];
    return active.includes(stage);
  }

  isTerminal(stage: MemoryStage): boolean {
    return stage === "ARCHIVED";
  }

  isForgotten(stage: MemoryStage): boolean {
    return stage === "HISTORICAL" || stage === "ARCHIVED";
  }

  isConsolidated(stage: MemoryStage): boolean {
    return stage === "CONSOLIDATED" || stage === "LONG_TERM" || stage === "SEMANTIC";
  }

  isEphemeral(stage: MemoryStage): boolean {
    return stage === "WORKING" || stage === "CANDIDATE" || stage === "SHORT_TERM";
  }

  getStageIndex(stage: MemoryStage): number {
    const order: MemoryStage[] = [
      "WORKING", "CANDIDATE", "SHORT_TERM", "STABILIZING",
      "CONSOLIDATED", "LONG_TERM", "SEMANTIC", "HISTORICAL", "ARCHIVED",
    ];
    return order.indexOf(stage);
  }
}
