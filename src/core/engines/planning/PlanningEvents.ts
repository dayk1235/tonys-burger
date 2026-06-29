export const PLANNING_EVENTS = {
  LIFECYCLE_INITIATED: "planning.lifecycle.initiated",
  LIFECYCLE_COMPLETED: "planning.lifecycle.completed",
  LIFECYCLE_FAILED: "planning.lifecycle.failed",
} as const;

export type PlanningEventName = (typeof PLANNING_EVENTS)[keyof typeof PLANNING_EVENTS];
