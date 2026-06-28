import {
  Reasoning,
  ReasoningAlternative,
  ReasoningConstraint,
  ConstraintType,
  ConstraintSeverity,
} from "./ReasoningTypes";

export interface ConstraintEvaluationResult {
  readonly constraints: readonly ReasoningConstraint[];
  readonly feasibleAlternatives: readonly string[];
  readonly eliminatedAlternatives: readonly string[];
  readonly constraintCounts: Record<string, number>;
}

export class ReasoningConstraints {
  private constraintIdCounter = 0;

  evaluate(reasoning: Reasoning, alternatives: ReasoningAlternative[]): ConstraintEvaluationResult {
    const constraints: ReasoningConstraint[] = [];
    const eliminatedIds: string[] = [];

    const bizConstraint = this.evaluateBusinessConstraints(reasoning, alternatives);
    constraints.push(...bizConstraint);
    eliminatedIds.push(...this.collectEliminatedIds(bizConstraint));

    const opConstraint = this.evaluateOperationalConstraints(reasoning, alternatives);
    constraints.push(...opConstraint);
    eliminatedIds.push(...this.collectEliminatedIds(opConstraint));

    const regConstraint = this.evaluateRegulatoryConstraints(reasoning, alternatives);
    constraints.push(...regConstraint);
    eliminatedIds.push(...this.collectEliminatedIds(regConstraint));

    const resConstraint = this.evaluateResourceConstraints(reasoning, alternatives);
    constraints.push(...resConstraint);
    eliminatedIds.push(...this.collectEliminatedIds(resConstraint));

    const tempConstraint = this.evaluateTemporalConstraints(reasoning, alternatives);
    constraints.push(...tempConstraint);
    eliminatedIds.push(...this.collectEliminatedIds(tempConstraint));

    const uniqueEliminated = [...new Set(eliminatedIds)];
    const feasibleIds = alternatives
      .filter((a) => !uniqueEliminated.includes(a.id))
      .map((a) => a.id);

    const constraintCounts: Record<string, number> = {
      BUSINESS: constraints.filter((c) => c.type === "BUSINESS").length,
      OPERATIONAL: constraints.filter((c) => c.type === "OPERATIONAL").length,
      REGULATORY: constraints.filter((c) => c.type === "REGULATORY").length,
      RESOURCE: constraints.filter((c) => c.type === "RESOURCE").length,
      TEMPORAL: constraints.filter((c) => c.type === "TEMPORAL").length,
    };

    return {
      constraints,
      feasibleAlternatives: feasibleIds,
      eliminatedAlternatives: uniqueEliminated,
      constraintCounts,
    };
  }

  private evaluateBusinessConstraints(reasoning: Reasoning, alternatives: ReasoningAlternative[]): ReasoningConstraint[] {
    const constraints: ReasoningConstraint[] = [];
    const eliminations: string[] = [];

    for (const alt of alternatives) {
      if (alt.businessImpact < 0) {
        eliminations.push(alt.id);
      }
    }

    if (eliminations.length > 0) {
      constraints.push(this.createConstraint(
        "BUSINESS", "Negative business impact is unacceptable", "CRITICAL", eliminations,
        "Alternatives with negative business impact are eliminated"
      ));
    }

    const highRiskAlts = alternatives.filter((a) => a.riskLevel > 0.8);
    if (highRiskAlts.length > 0) {
      constraints.push(this.createConstraint(
        "BUSINESS", "Risk tolerance exceeded", "HIGH",
        highRiskAlts.map((a) => a.id),
        "Risk level above 0.8 requires mitigation"
      ));
    }

    return constraints;
  }

  private evaluateOperationalConstraints(_reasoning: Reasoning, _alternatives: ReasoningAlternative[]): ReasoningConstraint[] {
    return [];
  }

  private evaluateRegulatoryConstraints(_reasoning: Reasoning, _alternatives: ReasoningAlternative[]): ReasoningConstraint[] {
    return [];
  }

  private evaluateResourceConstraints(reasoning: Reasoning, alternatives: ReasoningAlternative[]): ReasoningConstraint[] {
    const constraints: ReasoningConstraint[] = [];
    const eliminations: string[] = [];

    if (reasoning.context.loadLevel > 0.8) {
      for (const alt of alternatives) {
        if (alt.costEstimate > 50) {
          eliminations.push(alt.id);
        }
      }
      if (eliminations.length > 0) {
        constraints.push(this.createConstraint(
          "RESOURCE", "High load — resource-intensive alternatives limited", "MEDIUM", eliminations,
          `Load level ${reasoning.context.loadLevel} restricts resource-heavy options`
        ));
      }
    }

    return constraints;
  }

  private evaluateTemporalConstraints(reasoning: Reasoning, alternatives: ReasoningAlternative[]): ReasoningConstraint[] {
    const constraints: ReasoningConstraint[] = [];
    const eliminations: string[] = [];

    if (reasoning.context.urgency > 0.7) {
      for (const alt of alternatives) {
        if (alt.riskLevel > 0.5) {
          eliminations.push(alt.id);
        }
      }
      if (eliminations.length > 0) {
        constraints.push(this.createConstraint(
          "TEMPORAL", "High urgency — high-risk alternatives unsuitable", "HIGH", eliminations,
          `Urgency ${reasoning.context.urgency} restricts high-risk options`
        ));
      }
    }

    return constraints;
  }

  private createConstraint(
    type: ConstraintType, description: string, severity: ConstraintSeverity,
    eliminatesAlternativeIds: string[], rationale: string
  ): ReasoningConstraint {
    return {
      id: `con_${++this.constraintIdCounter}_${Date.now()}`,
      type, description, severity, eliminatesAlternativeIds, rationale,
    };
  }

  private collectEliminatedIds(constraints: ReasoningConstraint[]): string[] {
    return constraints.flatMap((c) => c.eliminatesAlternativeIds);
  }
}
