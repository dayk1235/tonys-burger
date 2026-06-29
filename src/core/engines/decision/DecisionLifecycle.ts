import { DecisionStage } from "./DecisionTypes";
import { DecisionError } from "./DecisionErrors";

const ACTIVE_STAGES: DecisionStage[] = [
  "CANDIDATE", "CONTEXT_READY", "ALTERNATIVES_BUILT",
  "RISK_EVALUATED", "OPPORTUNITY_EVALUATED", "COST_EVALUATED",
  "HUMAN_IMPACT_EVALUATED", "REVERSIBILITY_EVALUATED",
  "CONFIDENCE_VERIFIED", "PROPOSAL_BUILT", "WAITING_HUMAN_REVIEW",
  "ACCEPTED", "MODIFIED",
];

const ALLOWED_TRANSITIONS: Record<DecisionStage, readonly DecisionStage[]> = {
  CANDIDATE: ["CONTEXT_READY", "ARCHIVED", "RETIRED"],
  CONTEXT_READY: ["ALTERNATIVES_BUILT", "ARCHIVED", "RETIRED"],
  ALTERNATIVES_BUILT: ["RISK_EVALUATED", "ARCHIVED", "RETIRED"],
  RISK_EVALUATED: ["OPPORTUNITY_EVALUATED", "ARCHIVED", "RETIRED"],
  OPPORTUNITY_EVALUATED: ["COST_EVALUATED", "ARCHIVED", "RETIRED"],
  COST_EVALUATED: ["HUMAN_IMPACT_EVALUATED", "ARCHIVED", "RETIRED"],
  HUMAN_IMPACT_EVALUATED: ["REVERSIBILITY_EVALUATED", "ARCHIVED", "RETIRED"],
  REVERSIBILITY_EVALUATED: ["CONFIDENCE_VERIFIED", "ARCHIVED", "RETIRED"],
  CONFIDENCE_VERIFIED: ["PROPOSAL_BUILT", "ARCHIVED", "RETIRED"],
  PROPOSAL_BUILT: ["WAITING_HUMAN_REVIEW", "ACCEPTED", "ARCHIVED", "RETIRED"],
  WAITING_HUMAN_REVIEW: ["ACCEPTED", "REJECTED", "MODIFIED", "ARCHIVED", "RETIRED"],
  ACCEPTED: ["ARCHIVED", "RETIRED"],
  REJECTED: ["ARCHIVED", "RETIRED"],
  MODIFIED: ["CONTEXT_READY", "ARCHIVED", "RETIRED"],
  ARCHIVED: [],
  RETIRED: [],
};

export class DecisionLifecycle {
  validateTransition(current: DecisionStage, target: DecisionStage): void {
    if (current === target) return;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed) {
      throw new DecisionError(`No transitions allowed from stage: ${current}`);
    }
    if (!allowed.includes(target)) {
      throw new DecisionError(`Invalid transition from ${current} to ${target}`);
    }
  }

  canTransition(current: DecisionStage, target: DecisionStage): boolean {
    if (current === target) return true;
    return ALLOWED_TRANSITIONS[current]?.includes(target) ?? false;
  }

  isActive(stage: DecisionStage): boolean {
    return ACTIVE_STAGES.includes(stage);
  }

  isTerminal(stage: DecisionStage): boolean {
    return stage === "ARCHIVED" || stage === "RETIRED";
  }

  isResolved(stage: DecisionStage): boolean {
    return stage === "ACCEPTED" || stage === "REJECTED" || stage === "ARCHIVED" || stage === "RETIRED";
  }

  isRejected(stage: DecisionStage): boolean {
    return stage === "REJECTED";
  }

  isAccepted(stage: DecisionStage): boolean {
    return stage === "ACCEPTED";
  }
}
