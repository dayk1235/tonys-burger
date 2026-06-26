import { RuntimeState } from "./RuntimeTypes";
import { LifecycleTransitionError } from "./RuntimeErrors";

const ALLOWED_TRANSITIONS: Record<RuntimeState, RuntimeState[]> = {
  BOOTING: ["INITIALIZING", "HALTED"],
  INITIALIZING: ["DISCOVERING", "HALTED"],
  DISCOVERING: ["RESOLVING", "HALTED"],
  RESOLVING: ["READY", "HALTED"],
  READY: ["OPERATING", "HALTED"],
  OPERATING: ["DEGRADED", "RECOVERING", "SHUTTING_DOWN", "STRESSED"],
  DEGRADED: ["OPERATING", "RECOVERING", "SHUTTING_DOWN", "HALTED"],
  STRESSED: ["OPERATING", "DEGRADED", "RECOVERING", "SHUTTING_DOWN", "HALTED"],
  RECOVERING: ["OPERATING", "DEGRADED", "SHUTTING_DOWN", "HALTED"],
  SHUTTING_DOWN: ["HALTED"],
  HALTED: [],
};

export class RuntimeLifecycle {
  private state: RuntimeState = "BOOTING";
  private transitions: Array<{ from: RuntimeState; to: RuntimeState; at: string }> = [];

  get current(): RuntimeState {
    return this.state;
  }

  get history(): Array<{ from: RuntimeState; to: RuntimeState; at: string }> {
    return [...this.transitions];
  }

  transition(to: RuntimeState): void {
    const allowed = ALLOWED_TRANSITIONS[this.state];
    if (!allowed.includes(to)) {
      throw new LifecycleTransitionError(
        this.state,
        to,
        `Not allowed. Allowed from "${this.state}": ${allowed.join(", ")}`
      );
    }

    this.transitions.push({
      from: this.state,
      to,
      at: new Date().toISOString(),
    });

    this.state = to;
  }

  canTransition(to: RuntimeState): boolean {
    return ALLOWED_TRANSITIONS[this.state]?.includes(to) ?? false;
  }

  isBooting(): boolean {
    return this.state === "BOOTING";
  }

  isReady(): boolean {
    return this.state === "READY";
  }

  isOperating(): boolean {
    return this.state === "OPERATING";
  }

  isDegraded(): boolean {
    return this.state === "DEGRADED";
  }

  isHalted(): boolean {
    return this.state === "HALTED";
  }

  isShuttingDown(): boolean {
    return this.state === "SHUTTING_DOWN";
  }
}
