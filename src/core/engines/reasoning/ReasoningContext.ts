import { Reasoning, ReasoningContextSnapshot } from "./ReasoningTypes";

export interface ContextBuildResult {
  readonly context: ReasoningContextSnapshot;
  readonly businessValue: number;
  readonly urgency: number;
}

export class ReasoningContext {
  private currentContext: Partial<ReasoningContextSnapshot> = {};

  build(reasoning: Reasoning): ContextBuildResult {
    const now = new Date().toISOString();

    const context: ReasoningContextSnapshot = {
      environment: this.currentContext.environment || "restaurant",
      businessPhase: this.currentContext.businessPhase || "active",
      temporalContext: this.currentContext.temporalContext || "normal",
      operationalState: this.currentContext.operationalState || "normal",
      loadLevel: this.currentContext.loadLevel ?? 0.3,
      businessValue: this.currentContext.businessValue ?? 0.5,
      urgency: this.currentContext.urgency ?? 0.3,
      ownerConcerns: this.currentContext.ownerConcerns ?? [],
      capturedAt: now,
    };

    return { context, businessValue: context.businessValue, urgency: context.urgency };
  }

  update(updates: Partial<ReasoningContextSnapshot>): void {
    this.currentContext = { ...this.currentContext, ...updates };
  }

  getContext(): Partial<ReasoningContextSnapshot> {
    return { ...this.currentContext };
  }

  assessLoadLevel(): string {
    const load = this.currentContext.loadLevel ?? 0.3;
    if (load >= 0.9) return "critical";
    if (load >= 0.7) return "high";
    if (load >= 0.4) return "moderate";
    return "low";
  }

  isRushHour(): boolean {
    return (this.currentContext.businessPhase === "rush_hour") || (this.currentContext.loadLevel ?? 0) > 0.8;
  }

  isNormalOperations(): boolean {
    return (this.currentContext.businessPhase === "active" || this.currentContext.businessPhase === "idle") &&
      (this.currentContext.loadLevel ?? 0) < 0.6;
  }
}
