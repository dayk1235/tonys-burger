import { ContextSnapshot } from "./AttentionTypes";

export interface ContextAwarenessResult {
  readonly relevance: number;
  readonly loadLevel: number;
  readonly contextSession: string;
  readonly isOptimal: boolean;
  readonly suggestions: readonly string[];
}

export class AttentionContext {
  private currentContext: ContextSnapshot = {
    environment: "default",
    businessPhase: "idle",
    currentGoals: [],
    activeResources: [],
    constraints: [],
    temporalContext: "normal",
    loadLevel: 0.3,
    capturedAt: new Date().toISOString(),
  };

  getCurrentContext(): ContextSnapshot {
    return { ...this.currentContext };
  }

  updateContext(updates: Partial<ContextSnapshot>): void {
    this.currentContext = {
      ...this.currentContext,
      ...updates,
      capturedAt: new Date().toISOString(),
    };
  }

  computeRelevance(
    sourceType: string,
    category: string,
    urgency: number,
    importance: number
  ): ContextAwarenessResult {
    const typeRelevance = this.evaluateTypeRelevance(sourceType);
    const categoryRelevance = this.evaluateCategoryRelevance(category);
    const urgencyRelevance = urgency > 0.7 ? 0.9 : urgency > 0.4 ? 0.6 : 0.3;
    const importanceRelevance = importance > 0.7 ? 0.9 : importance > 0.4 ? 0.6 : 0.3;

    const relevance = Math.min(1,
      typeRelevance * 0.3 +
      categoryRelevance * 0.25 +
      urgencyRelevance * 0.25 +
      importanceRelevance * 0.2
    );

    const isOptimal = relevance > 0.6 && this.currentContext.loadLevel < 0.8;

    const suggestions: string[] = [];
    if (this.currentContext.loadLevel > 0.8) suggestions.push("reduce cognitive load");
    if (urgency > 0.7) suggestions.push("prioritize immediate action");
    if (this.currentContext.constraints.length > 2) suggestions.push("check constraint conflicts");

    return {
      relevance,
      loadLevel: this.currentContext.loadLevel,
      contextSession: `${this.currentContext.environment}_${this.currentContext.businessPhase}`,
      isOptimal,
      suggestions,
    };
  }

  isHighLoad(): boolean {
    return this.currentContext.loadLevel > 0.8;
  }

  isNormalLoad(): boolean {
    return this.currentContext.loadLevel <= 0.6;
  }

  getLoadDescription(): string {
    if (this.currentContext.loadLevel >= 0.9) return "critical";
    if (this.currentContext.loadLevel >= 0.7) return "high";
    if (this.currentContext.loadLevel >= 0.4) return "moderate";
    return "low";
  }

  private evaluateTypeRelevance(sourceType: string): number {
    const relevanceMap: Record<string, number> = {
      OBSERVATION: 0.5,
      PATTERN: 0.6,
      EVIDENCE: 0.7,
      MEMORY: 0.6,
      KNOWLEDGE: 0.7,
      RUNTIME_EVENT: 0.8,
      BUSINESS_PULSE: 0.9,
      HUMAN_GOAL: 1.0,
      CONTEXT: 1.0,
    };
    return relevanceMap[sourceType] ?? 0.3;
  }

  private evaluateCategoryRelevance(category: string): number {
    if (this.currentContext.currentGoals.length === 0) return 0.5;

    const goalRelevance = this.currentContext.currentGoals.some(
      (goal) => category.toLowerCase().includes(goal.toLowerCase()) ||
        goal.toLowerCase().includes(category.toLowerCase())
    ) ? 0.9 : 0.3;

    return goalRelevance;
  }
}
