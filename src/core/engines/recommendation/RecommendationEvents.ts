export const RECOMMENDATION_EVENTS = {
  LIFECYCLE_INITIATED: "recommendation.lifecycle.initiated",
  LIFECYCLE_COMPLETED: "recommendation.lifecycle.completed",
  LIFECYCLE_FAILED: "recommendation.lifecycle.failed",
} as const;

export type RecommendationEventName = (typeof RECOMMENDATION_EVENTS)[keyof typeof RECOMMENDATION_EVENTS];
