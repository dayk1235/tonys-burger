import { EngineLifecycleState } from "./RuntimeTypes";
import { EngineStateTransitionError } from "./RuntimeErrors";

const ALLOWED_TRANSITIONS: Record<EngineLifecycleState, EngineLifecycleState[]> = {
  INITIALIZED: ["REGISTERED", "SHUTDOWN"],
  REGISTERED: ["CONFIGURED", "SHUTDOWN"],
  CONFIGURED: ["ACTIVATED", "SHUTDOWN"],
  ACTIVATED: ["RUNNING", "IDLE", "DEGRADED", "SHUTDOWN"],
  RUNNING: ["IDLE", "DEGRADED", "FAILING", "SUSPENDED", "SHUTDOWN"],
  IDLE: ["RUNNING", "SUSPENDED", "SHUTDOWN"],
  SUSPENDED: ["RUNNING", "SHUTDOWN"],
  DEGRADED: ["RUNNING", "FAILING", "RECOVERING", "SHUTDOWN"],
  FAILING: ["RECOVERING", "SHUTDOWN"],
  RECOVERING: ["RUNNING", "DEGRADED", "ACTIVATED", "SHUTDOWN"],
  SHUTDOWN: [],
};

export class EngineStateMachine {
  private state: EngineLifecycleState;
  private readonly transitions: string[] = [];

  constructor(initialState: EngineLifecycleState = "INITIALIZED") {
    this.state = initialState;
  }

  get current(): EngineLifecycleState {
    return this.state;
  }

  get history(): readonly string[] {
    return this.transitions;
  }

  transition(to: EngineLifecycleState): void {
    const allowed = ALLOWED_TRANSITIONS[this.state];
    if (!allowed.includes(to)) {
      throw new EngineStateTransitionError(
        "Engine",
        this.state,
        to,
        `transition not allowed. Allowed from "${this.state}": ${allowed.join(", ")}`
      );
    }
    this.transitions.push(`${this.state} → ${to}`);
    this.state = to;
  }

  canTransition(to: EngineLifecycleState): boolean {
    return ALLOWED_TRANSITIONS[this.state]?.includes(to) ?? false;
  }

  isActive(): boolean {
    return this.state === "RUNNING" || this.state === "ACTIVATED" || this.state === "IDLE";
  }

  isOperational(): boolean {
    const operational: EngineLifecycleState[] = ["RUNNING", "ACTIVATED", "IDLE", "DEGRADED"];
    return operational.includes(this.state);
  }

  isTerminal(): boolean {
    return this.state === "SHUTDOWN";
  }
}
