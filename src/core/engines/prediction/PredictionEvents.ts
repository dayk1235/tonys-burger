export const PREDICTION_EVENTS = {
  LIFECYCLE_INITIATED: "prediction.lifecycle.initiated",
  LIFECYCLE_COMPLETED: "prediction.lifecycle.completed",
  LIFECYCLE_FAILED: "prediction.lifecycle.failed",
} as const;

export type PredictionEventName = (typeof PREDICTION_EVENTS)[keyof typeof PREDICTION_EVENTS];
