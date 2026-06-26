import { AttentionStage } from "./AttentionTypes";
import { InvalidAttentionLifecycleTransitionError } from "./AttentionErrors";

const ALLOWED_TRANSITIONS: Record<AttentionStage, readonly AttentionStage[]> = {
  CANDIDATE: ["OBSERVED", "ARCHIVED"],
  OBSERVED: ["SCORED", "DEFERRED", "RELEASED", "ARCHIVED"],
  SCORED: ["QUEUED", "RELEASED", "ARCHIVED"],
  QUEUED: ["FOCUSED", "DEFERRED", "RELEASED", "ARCHIVED"],
  FOCUSED: ["MAINTAINED", "INTERRUPTED", "DEFERRED", "RELEASED", "ARCHIVED"],
  MAINTAINED: ["FOCUSED", "INTERRUPTED", "DEFERRED", "RELEASED", "ARCHIVED"],
  INTERRUPTED: ["FOCUSED", "DEFERRED", "RELEASED", "ARCHIVED"],
  DEFERRED: ["QUEUED", "OBSERVED", "RELEASED", "ARCHIVED"],
  RELEASED: ["ARCHIVED"],
  ARCHIVED: [],
};

export class AttentionLifecycle {
  validateTransition(current: AttentionStage, target: AttentionStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new InvalidAttentionLifecycleTransitionError(current, target);
    }
    if (!allowed.includes(target)) {
      throw new InvalidAttentionLifecycleTransitionError(current, target);
    }
  }

  canTransition(current: AttentionStage, target: AttentionStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: AttentionStage): boolean {
    const active: AttentionStage[] = [
      "CANDIDATE", "OBSERVED", "SCORED", "QUEUED",
      "FOCUSED", "MAINTAINED", "INTERRUPTED", "DEFERRED",
    ];
    return active.includes(stage);
  }

  isTerminal(stage: AttentionStage): boolean {
    return stage === "ARCHIVED";
  }

  isConsumingBudget(stage: AttentionStage): boolean {
    return stage === "FOCUSED" || stage === "MAINTAINED";
  }

  isQueued(stage: AttentionStage): boolean {
    return stage === "QUEUED" || stage === "DEFERRED";
  }

  getStageIndex(stage: AttentionStage): number {
    const order: AttentionStage[] = [
      "CANDIDATE", "OBSERVED", "SCORED", "QUEUED",
      "FOCUSED", "MAINTAINED", "INTERRUPTED", "DEFERRED",
      "RELEASED", "ARCHIVED",
    ];
    return order.indexOf(stage);
  }
}
