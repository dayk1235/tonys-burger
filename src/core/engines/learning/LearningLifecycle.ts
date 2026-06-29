import { LearningStage, ResultStatus } from "./LearningTypes";
import { LearningError } from "./LearningErrors";

const ACTIVE_STAGES: LearningStage[] = [
  "INITIATED",
  "OBSERVATION_COLLECTED",
  "OUTCOME_ANALYZED",
  "PATTERN_DERIVED",
  "KNOWLEDGE_UPDATED",
];

const ALLOWED_TRANSITIONS: Record<LearningStage, readonly LearningStage[]> = {
  INITIATED: ["OBSERVATION_COLLECTED", "FAILED"],
  OBSERVATION_COLLECTED: ["OUTCOME_ANALYZED", "FAILED"],
  OUTCOME_ANALYZED: ["PATTERN_DERIVED", "FAILED"],
  PATTERN_DERIVED: ["KNOWLEDGE_UPDATED", "FAILED"],
  KNOWLEDGE_UPDATED: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  FAILED: [],
};

const RESULT_STATUS_TRANSITIONS: Record<ResultStatus, readonly ResultStatus[]> = {
  PENDING: ["ACHIEVED", "PARTIALLY_ACHIEVED", "NOT_ACHIEVED", "CANCELLED"],
  ACHIEVED: [],
  PARTIALLY_ACHIEVED: ["ACHIEVED", "NOT_ACHIEVED"],
  NOT_ACHIEVED: [],
  CANCELLED: [],
};

export class LearningLifecycle {
  validateTransition(current: LearningStage, target: LearningStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new LearningError(`No transitions allowed from stage: ${current}`);
    }
    if (!allowed.includes(target)) {
      throw new LearningError(`Invalid transition from ${current} to ${target}`);
    }
  }

  canTransition(current: LearningStage, target: LearningStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: LearningStage): boolean {
    return ACTIVE_STAGES.includes(stage);
  }

  isTerminal(stage: LearningStage): boolean {
    return stage === "COMPLETED" || stage === "FAILED";
  }

  isCompleted(stage: LearningStage): boolean {
    return stage === "COMPLETED";
  }

  isFailed(stage: LearningStage): boolean {
    return stage === "FAILED";
  }

  validateResultStatusTransition(current: ResultStatus, target: ResultStatus): void {
    if (current === target) return;
    const allowed = RESULT_STATUS_TRANSITIONS[current];
    if (!allowed) {
      throw new LearningError(`No result status transitions allowed from: ${current}`);
    }
    if (!allowed.includes(target)) {
      throw new LearningError(`Invalid result status transition from ${current} to ${target}`);
    }
  }
}
