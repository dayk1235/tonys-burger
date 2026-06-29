/**
 * Runtime-level event names used across the EventBus.
 * These are canonical constants — no literal event strings should be used.
 */
export const RUNTIME_EVENTS = {
  ENGINE_STATE_CHANGE: "engine:state-change",
  RUNTIME_EMERGENCY: "runtime.emergency",
  RUNTIME_CONTEXT_CHANGE: "runtime.context.change",
  RUNTIME_STARTED: "runtime:started",
  RUNTIME_SHUTTING_DOWN: "runtime:shutting-down",
  RUNTIME_ORDER_RECEIVED: "runtime:order-received",
} as const;

export type RuntimeEventName = (typeof RUNTIME_EVENTS)[keyof typeof RUNTIME_EVENTS];
