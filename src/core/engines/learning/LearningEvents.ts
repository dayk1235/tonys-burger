export const LEARNING_EVENTS = {
  LIFECYCLE_INITIATED: "learning.lifecycle.initiated",
  LIFECYCLE_COMPLETED: "learning.lifecycle.completed",
  LIFECYCLE_ACCEPTED: "learning.lifecycle.accepted",
  LIFECYCLE_FAILED: "learning.lifecycle.failed",
} as const;

export type LearningEventName = (typeof LEARNING_EVENTS)[keyof typeof LEARNING_EVENTS];
