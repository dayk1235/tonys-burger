import { EvidenceStage } from "./EvidenceTypes";
import { InvalidLifecycleTransitionError } from "./EvidenceErrors";

const ALLOWED_TRANSITIONS: Record<EvidenceStage, readonly EvidenceStage[]> = {
  CANDIDATE: ["COLLECTING", "SUPPORTING", "CONFLICTING", "REJECTED"],
  COLLECTING: ["SUPPORTING", "CONFLICTING", "REJECTED"],
  SUPPORTING: ["CONFLICTING", "WEIGHTED", "REJECTED"],
  CONFLICTING: ["SUPPORTING", "WEIGHTED", "REJECTED"],
  WEIGHTED: ["VALIDATED", "REJECTED", "COLLECTING"],
  VALIDATED: ["HISTORICAL", "ARCHIVED", "WEIGHTED"],
  REJECTED: ["HISTORICAL", "ARCHIVED"],
  HISTORICAL: ["ARCHIVED"],
  ARCHIVED: [],
};

export class EvidenceLifecycle {
  validateTransition(current: EvidenceStage, target: EvidenceStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new InvalidLifecycleTransitionError(current, target);
    }
    if (!allowed.includes(target)) {
      throw new InvalidLifecycleTransitionError(current, target);
    }
  }

  canTransition(current: EvidenceStage, target: EvidenceStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: EvidenceStage): boolean {
    const active: EvidenceStage[] = ["SUPPORTING", "CONFLICTING", "WEIGHTED", "VALIDATED"];
    return active.includes(stage);
  }

  isTerminal(stage: EvidenceStage): boolean {
    return stage === "ARCHIVED";
  }

  isRejected(stage: EvidenceStage): boolean {
    return stage === "REJECTED";
  }

  isHistorical(stage: EvidenceStage): boolean {
    return stage === "HISTORICAL" || stage === "ARCHIVED";
  }

  isResolved(stage: EvidenceStage): boolean {
    return stage === "VALIDATED" || stage === "REJECTED" || stage === "HISTORICAL" || stage === "ARCHIVED";
  }
}
