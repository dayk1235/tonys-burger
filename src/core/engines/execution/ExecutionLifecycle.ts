import { ExecutionStage } from "./ExecutionTypes";
import { ExecutionError } from "./ExecutionErrors";

const ACTIVE_STAGES: ExecutionStage[] = [
  "INITIATED",
  "QUEUED",
  "PREPARING",
  "RUNNING",
  "VERIFYING",
];

const ALLOWED_TRANSITIONS: Record<ExecutionStage, readonly ExecutionStage[]> = {
  INITIATED: ["QUEUED", "FAILED", "CANCELLED"],
  QUEUED: ["PREPARING", "FAILED", "CANCELLED"],
  PREPARING: ["RUNNING", "FAILED", "CANCELLED"],
  RUNNING: ["VERIFYING", "FAILED", "CANCELLED"],
  VERIFYING: ["COMPLETED", "FAILED", "CANCELLED"],
  COMPLETED: ["ARCHIVED", "FAILED"],
  ARCHIVED: [],
  FAILED: ["ARCHIVED"],
  CANCELLED: [],
};

export class ExecutionLifecycle {
  validateTransition(current: ExecutionStage, target: ExecutionStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new ExecutionError(`No transitions allowed from stage: ${current}`);
    }
    if (!allowed.includes(target)) {
      throw new ExecutionError(`Invalid transition from ${current} to ${target}`);
    }
  }

  canTransition(current: ExecutionStage, target: ExecutionStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: ExecutionStage): boolean {
    return ACTIVE_STAGES.includes(stage);
  }

  isTerminal(stage: ExecutionStage): boolean {
    return stage === "COMPLETED" || stage === "FAILED" || stage === "ARCHIVED" || stage === "CANCELLED";
  }

  isCompleted(stage: ExecutionStage): boolean {
    return stage === "COMPLETED";
  }

  isFailed(stage: ExecutionStage): boolean {
    return stage === "FAILED";
  }

  isArchived(stage: ExecutionStage): boolean {
    return stage === "ARCHIVED";
  }

  isCancelled(stage: ExecutionStage): boolean {
    return stage === "CANCELLED";
  }
}
