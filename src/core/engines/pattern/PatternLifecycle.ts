import { PatternStage } from "./PatternTypes";
import { InvalidLifecycleTransitionError } from "./PatternErrors";

const ALLOWED_TRANSITIONS: Record<PatternStage, readonly PatternStage[]> = {
  POTENTIAL: ["CANDIDATE"],
  CANDIDATE: ["EMERGING", "DEPRECATED"],
  EMERGING: ["SUPPORTED", "WEAKENING", "DEPRECATED"],
  SUPPORTED: ["VALIDATED", "STRENGTHENING", "WEAKENING", "DEPRECATED"],
  VALIDATED: ["STRENGTHENING", "WEAKENING", "HISTORICAL", "DEPRECATED"],
  STRENGTHENING: ["VALIDATED", "WEAKENING", "DEPRECATED"],
  WEAKENING: ["VALIDATED", "STRENGTHENING", "DEPRECATED", "HISTORICAL"],
  DEPRECATED: ["HISTORICAL", "ARCHIVED"],
  HISTORICAL: ["ARCHIVED", "VALIDATED"],
  ARCHIVED: [],
};

export class PatternLifecycle {
  validateTransition(current: PatternStage, target: PatternStage): void {
    if (current === target) return;

    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new InvalidLifecycleTransitionError(current, target);
    }
    if (!allowed.includes(target)) {
      throw new InvalidLifecycleTransitionError(current, target);
    }
  }

  canTransition(current: PatternStage, target: PatternStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: PatternStage): boolean {
    const active: PatternStage[] = ["EMERGING", "SUPPORTED", "VALIDATED", "STRENGTHENING"];
    return active.includes(stage);
  }

  isTerminal(stage: PatternStage): boolean {
    return stage === "ARCHIVED";
  }

  isDeprecated(stage: PatternStage): boolean {
    return stage === "DEPRECATED";
  }

  isHistorical(stage: PatternStage): boolean {
    return stage === "HISTORICAL" || stage === "ARCHIVED";
  }
}
