export const DECISION_EVENTS = {
  LIFECYCLE_INITIATED: "decision.lifecycle.initiated",
  LIFECYCLE_EVALUATING: "decision.lifecycle.evaluating",
  LIFECYCLE_COMMITTED: "decision.lifecycle.committed",
  LIFECYCLE_ARCHIVED: "decision.lifecycle.archived",
  OPERATION_INITIATED: "decision.operation.initiated",
  OPERATION_APPROVED: "decision.operation.approved",
  OPERATION_REJECTED: "decision.operation.rejected",
  OPERATION_EXECUTED: "decision.operation.executed",
} as const;

export type DecisionEventName = (typeof DECISION_EVENTS)[keyof typeof DECISION_EVENTS];
