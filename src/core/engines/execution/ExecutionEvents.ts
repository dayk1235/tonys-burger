export const EXECUTION_EVENTS = {
  LIFECYCLE_INITIATED: "execution.lifecycle.initiated",
  LIFECYCLE_RUNNING: "execution.lifecycle.running",
  LIFECYCLE_COMPLETED: "execution.lifecycle.completed",
  LIFECYCLE_FAILED: "execution.lifecycle.failed",
} as const;

export type ExecutionEventName = (typeof EXECUTION_EVENTS)[keyof typeof EXECUTION_EVENTS];
