import { RecommendationStage } from "./RecommendationTypes";
import { RecommendationError } from "./RecommendationErrors";

const ACTIVE_STAGES: RecommendationStage[] = [
  "INITIATED",
  "ANALYZED",
  "PRIORITIZED",
  "OPTIMIZED",
  "READY",
];

const ALLOWED_TRANSITIONS: Record<RecommendationStage, readonly RecommendationStage[]> = {
  INITIATED: ["ANALYZED", "FAILED", "ARCHIVED"],
  ANALYZED: ["PRIORITIZED", "FAILED", "ARCHIVED"],
  PRIORITIZED: ["OPTIMIZED", "FAILED", "ARCHIVED"],
  OPTIMIZED: ["READY", "FAILED", "ARCHIVED"],
  READY: ["COMPLETED", "FAILED", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  FAILED: ["ARCHIVED"],
  ARCHIVED: [],
};

export class RecommendationLifecycle {
  validateTransition(current: RecommendationStage, target: RecommendationStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new RecommendationError(`No transitions allowed from stage: ${current}`);
    }
    if (!allowed.includes(target)) {
      throw new RecommendationError(`Invalid transition from ${current} to ${target}`);
    }
  }

  canTransition(current: RecommendationStage, target: RecommendationStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: RecommendationStage): boolean {
    return ACTIVE_STAGES.includes(stage);
  }

  isTerminal(stage: RecommendationStage): boolean {
    return stage === "COMPLETED" || stage === "FAILED" || stage === "ARCHIVED";
  }

  isCompleted(stage: RecommendationStage): boolean {
    return stage === "COMPLETED";
  }

  isFailed(stage: RecommendationStage): boolean {
    return stage === "FAILED";
  }

  isArchived(stage: RecommendationStage): boolean {
    return stage === "ARCHIVED";
  }
}
