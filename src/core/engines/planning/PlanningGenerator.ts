import {
  PlanningInput,
  ExecutionStep,
  ExecutionStepStatus,
} from "./PlanningTypes";

export class PlanningGenerator {
  generate(input: PlanningInput): {
    steps: ExecutionStep[];
    estimatedDuration: string;
    requiredResources: string[];
    dependencies: string[];
    rollbackStrategy: string;
    overallConfidence: number;
  } {
    const steps = this.buildSteps(input);
    const estimatedDuration = this.estimateDuration(steps);
    const requiredResources = this.collectResources(steps);
    const dependencies = this.identifyDependencies(input);
    const rollbackStrategy = this.buildRollbackStrategy(input);
    const overallConfidence = input.confidence;

    return {
      steps,
      estimatedDuration,
      requiredResources,
      dependencies,
      rollbackStrategy,
      overallConfidence,
    };
  }

  private buildSteps(input: PlanningInput): ExecutionStep[] {
    const steps: ExecutionStep[] = [];

    steps.push(this.createStep(1, "validate", "Validate recommendation readiness", [
      "Verify recommendation priority and confidence meet execution threshold",
      `Confirm recommendation: ${input.recommendationAction}`,
    ]));

    steps.push(this.createStep(2, "prepare", "Prepare execution resources", [
      "Allocate required personnel and materials",
      "Set up monitoring and logging for execution tracking",
    ]));

    steps.push(this.createStep(3, "execute", `Execute: ${input.recommendationAction}`, [
      `Implement recommended action: ${input.recommendationAction}`,
      `Expected benefit: ${input.expectedBenefit || "Improved business outcome"}`,
      `Risk considerations: ${input.expectedRisk || "Standard operational risk"}`,
    ]));

    steps.push(this.createStep(4, "verify", "Verify completion and validate outcome", [
      "Confirm all execution steps completed successfully",
      "Validate outcome matches expected benefit",
      "Document any deviations from plan",
    ]));

    steps.push(this.createStep(5, "record", "Record outcome metrics and close plan", [
      "Capture execution metrics and outcomes",
      "Update learning entities with actual results",
      "Archive completed plan",
    ]));

    return steps;
  }

  private createStep(
    order: number,
    action: string,
    description: string,
    details: string[],
  ): ExecutionStep {
    const stepId = `step-${order}-${action}`;
    const resources = this.inferResources(action, description);
    return {
      id: stepId,
      order,
      action,
      description,
      estimatedDuration: this.estimateStepDuration(order, action),
      requiredResources: resources,
      status: "PENDING" as ExecutionStepStatus,
    };
  }

  private estimateStepDuration(order: number, action: string): string {
    if (order === 1) return "10 minutes";
    if (order === 2) return "30 minutes";
    if (order === 3) return "2 hours";
    if (order === 4) return "30 minutes";
    if (order === 5) return "15 minutes";
    return "1 hour";
  }

  private inferResources(action: string, description: string): string[] {
    const resources: string[] = ["Runtime access"];
    if (action === "validate" || action === "verify") {
      resources.push("Monitoring tools");
    }
    if (action === "prepare") {
      resources.push("Resource allocation system");
    }
    if (action === "execute") {
      resources.push("Execution environment");
      resources.push("Change management approval");
    }
    if (action === "record") {
      resources.push("Audit logging system");
    }
    return resources;
  }

  private estimateDuration(steps: ExecutionStep[]): string {
    const totalMinutes = steps.reduce((sum, step) => {
      const mins = this.parseDurationToMinutes(step.estimatedDuration);
      return sum + mins;
    }, 0);
    if (totalMinutes < 60) return `${totalMinutes} minutes`;
    const hours = Math.ceil(totalMinutes / 60);
    return `Approximately ${hours} hours`;
  }

  private parseDurationToMinutes(duration: string): number {
    const num = parseInt(duration, 10);
    if (duration.includes("hour")) return num * 60;
    if (duration.includes("minute")) return num;
    return 60;
  }

  private collectResources(steps: ExecutionStep[]): string[] {
    const resourceSet = new Set<string>();
    for (const step of steps) {
      for (const resource of step.requiredResources) {
        resourceSet.add(resource);
      }
    }
    return Array.from(resourceSet).sort();
  }

  private identifyDependencies(input: PlanningInput): string[] {
    const deps: string[] = [];
    if (input.supportingEvidence.learningId) {
      deps.push(`Learning cycle completed: ${input.supportingEvidence.learningId}`);
    }
    if (input.recommendationId) {
      deps.push(`Recommendation validated: ${input.recommendationId}`);
    }
    if (input.forecast.outcome) {
      deps.push(`Forecast available: ${input.forecast.outcome}`);
    }
    return deps;
  }

  private buildRollbackStrategy(input: PlanningInput): string {
    const parts: string[] = [
      "If execution fails or produces unexpected results:",
    ];
    if (input.expectedRisk) {
      parts.push(`1. Assess deviation from expected risk profile: ${input.expectedRisk}`);
    }
    parts.push("2. Halt current execution step");
    parts.push("3. Restore to pre-execution state using system snapshots");
    parts.push("4. Log failure details for post-mortem analysis");
    parts.push("5. Notify stakeholders of rollback and plan revision");
    return parts.join("\n");
  }
}
