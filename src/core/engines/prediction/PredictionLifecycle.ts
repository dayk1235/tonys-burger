import { PredictionStage } from "./PredictionTypes";
import { PredictionError } from "./PredictionErrors";

const ACTIVE_STAGES: PredictionStage[] = [
  "INITIATED",
  "DATA_COLLECTED",
  "MODEL_APPLIED",
  "CONFIDENCE_EVALUATED",
  "PREDICTION_READY",
];

const ALLOWED_TRANSITIONS: Record<PredictionStage, readonly PredictionStage[]> = {
  INITIATED: ["DATA_COLLECTED", "FAILED"],
  DATA_COLLECTED: ["MODEL_APPLIED", "FAILED"],
  MODEL_APPLIED: ["CONFIDENCE_EVALUATED", "FAILED"],
  CONFIDENCE_EVALUATED: ["PREDICTION_READY", "FAILED"],
  PREDICTION_READY: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  FAILED: [],
};

export class PredictionLifecycle {
  validateTransition(current: PredictionStage, target: PredictionStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new PredictionError(`No transitions allowed from stage: ${current}`);
    }
    if (!allowed.includes(target)) {
      throw new PredictionError(`Invalid transition from ${current} to ${target}`);
    }
  }

  canTransition(current: PredictionStage, target: PredictionStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: PredictionStage): boolean {
    return ACTIVE_STAGES.includes(stage);
  }

  isTerminal(stage: PredictionStage): boolean {
    return stage === "COMPLETED" || stage === "FAILED";
  }

  isCompleted(stage: PredictionStage): boolean {
    return stage === "COMPLETED";
  }

  isFailed(stage: PredictionStage): boolean {
    return stage === "FAILED";
  }
}
