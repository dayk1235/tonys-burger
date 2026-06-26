export interface GoalDefinition {
  readonly id: string;
  readonly name: string;
  readonly priority: number;
  readonly active: boolean;
  readonly category: string;
  readonly deadline?: string;
  readonly metadata: Record<string, unknown>;
}

export interface GoalAlignmentResult {
  readonly alignmentScore: number;
  readonly matchedGoals: readonly string[];
  readonly relevance: number;
  readonly urgencyFromGoals: number;
}

export class AttentionGoals {
  private goals: GoalDefinition[] = [];

  setGoals(goals: GoalDefinition[]): void {
    this.goals = goals.filter((g) => g.active);
  }

  addGoal(goal: GoalDefinition): void {
    const existing = this.goals.findIndex((g) => g.id === goal.id);
    if (existing >= 0) {
      this.goals[existing] = goal;
    } else {
      this.goals.push(goal);
    }
  }

  removeGoal(goalId: string): void {
    this.goals = this.goals.filter((g) => g.id !== goalId);
  }

  getActiveGoals(): readonly GoalDefinition[] {
    return this.goals.filter((g) => g.active);
  }

  computeAlignment(sourceType: string, category: string, urgency: number, importance: number): GoalAlignmentResult {
    if (this.goals.length === 0) {
      return { alignmentScore: 0.5, matchedGoals: [], relevance: 0.5, urgencyFromGoals: 0 };
    }

    const matchedGoals: string[] = [];
    let totalAlignment = 0;

    for (const goal of this.goals) {
      const nameMatch = category.toLowerCase().includes(goal.name.toLowerCase()) ||
        goal.name.toLowerCase().includes(category.toLowerCase());
      const typeMatch = goal.category === sourceType;

      if (nameMatch || typeMatch) {
        matchedGoals.push(goal.name);
        totalAlignment += goal.priority;
      }
    }

    const alignmentScore = matchedGoals.length > 0
      ? Math.min(1, totalAlignment / this.goals.reduce((s, g) => s + g.priority, 0))
      : 0.2;

    const urgencyFromGoals = matchedGoals.length > 0
      ? Math.min(1, matchedGoals.length * 0.2 + (urgency * 0.3) + (importance * 0.3))
      : urgency * 0.3;

    return {
      alignmentScore,
      matchedGoals,
      relevance: alignmentScore,
      urgencyFromGoals,
    };
  }

  getActiveGoalNames(): readonly string[] {
    return this.goals.filter((g) => g.active).map((g) => g.name);
  }
}
