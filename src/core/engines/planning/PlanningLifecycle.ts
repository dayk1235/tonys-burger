import { PlanningStage } from "./PlanningTypes";
import { PlanningError } from "./PlanningErrors";

const ACTIVE_STAGES: PlanningStage[] = [
  "INITIATED",
  "ANALYZED",
  "PLAN_GENERATED",
  "OPTIMIZED",
  "VALIDATED",
  "READY",
];

const ALLOWED_TRANSITIONS: Record<PlanningStage, readonly PlanningStage[]> = {
  INITIATED: ["ANALYZED", "FAILED", "ARCHIVED"],
  ANALYZED: ["PLAN_GENERATED", "FAILED", "ARCHIVED"],
  PLAN_GENERATED: ["OPTIMIZED", "FAILED", "ARCHIVED"],
  OPTIMIZED: ["VALIDATED", "FAILED", "ARCHIVED"],
  VALIDATED: ["READY", "FAILED", "ARCHIVED"],
  READY: ["COMPLETED", "FAILED", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  FAILED: ["ARCHIVED"],
  ARCHIVED: [],
};

export class PlanningLifecycle {
  validateTransition(current: PlanningStage, target: PlanningStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new PlanningError(`No transitions allowed from stage: ${current}`);
    }
    if (!allowed.includes(target)) {
      throw new PlanningError(`Invalid transition from ${current} to ${target}`);
    }
  }

  canTransition(current: PlanningStage, target: PlanningStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: PlanningStage): boolean {
    return ACTIVE_STAGES.includes(stage);
  }

  isTerminal(stage: PlanningStage): boolean {
    return stage === "COMPLETED" || stage === "FAILED" || stage === "ARCHIVED";
  }

  isCompleted(stage: PlanningStage): boolean {
    return stage === "COMPLETED";
  }

  isFailed(stage: PlanningStage): boolean {
    return stage === "FAILED";
  }

  isArchived(stage: PlanningStage): boolean {
    return stage === "ARCHIVED";
  }
}
