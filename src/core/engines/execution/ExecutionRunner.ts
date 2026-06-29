import {
  ExecutionEntity,
  ExecutionStep,
  ExecutionStepResult,
  ExecutionStepStatus,
} from "./ExecutionTypes";

export class ExecutionRunner {
  run(entity: ExecutionEntity): {
    stepResults: ExecutionStepResult[];
    completedSteps: number;
    failedSteps: number;
    skippedSteps: number;
    startedAt: string;
    completedAt: string;
    duration: string;
    executionReport: string;
  } {
    const baseTime = new Date(entity.createdAt).getTime();
    const stepResults: ExecutionStepResult[] = [];
    let totalDurationMs = 0;
    let completed = 0;
    let failed = 0;
    let skipped = 0;
    let firstStartedAt = "";
    let lastCompletedAt = "";

    for (let i = 0; i < entity.executionSteps.length; i++) {
      const step = entity.executionSteps[i];
      const stepDurationMs = this.calculateStepDuration(step);
      const priorEndMs = i > 0
        ? new Date(stepResults[i - 1].completedAt).getTime()
        : baseTime;
      const stepStartMs = priorEndMs;
      const stepEndMs = stepStartMs + stepDurationMs;
      totalDurationMs += stepDurationMs;

      const startedAt = new Date(stepStartMs).toISOString();
      const completedAt = new Date(stepEndMs).toISOString();

      if (i === 0) firstStartedAt = startedAt;
      lastCompletedAt = completedAt;

      stepResults.push({
        stepId: step.id,
        action: step.action,
        status: "COMPLETED" as ExecutionStepStatus,
        startedAt,
        completedAt,
        duration: this.formatDuration(stepDurationMs),
        message: `Step ${step.order} (${step.action}): ${step.description} — completed successfully`,
      });

      completed++;
    }

    const duration = this.formatDuration(totalDurationMs);
    const executionReport = this.generateReport(entity, stepResults, duration);

    return {
      stepResults,
      completedSteps: completed,
      failedSteps: failed,
      skippedSteps: skipped,
      startedAt: firstStartedAt,
      completedAt: lastCompletedAt,
      duration,
      executionReport,
    };
  }

  private calculateStepDuration(step: ExecutionStep): number {
    const dur = step.estimatedDuration;
    const num = parseInt(dur, 10);
    if (dur.includes("hour")) return num * 3_600_000;
    if (dur.includes("minute")) return num * 60_000;
    return 60_000;
  }

  private formatDuration(ms: number): string {
    const totalMinutes = Math.round(ms / 60_000);
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${totalMinutes}m`;
  }

  private generateReport(
    entity: ExecutionEntity,
    stepResults: ExecutionStepResult[],
    duration: string,
  ): string {
    const lines: string[] = [
      `Execution Report for Plan: ${entity.planId}`,
      `Total Steps: ${stepResults.length}`,
      `Completed: ${stepResults.filter((s) => s.status === "COMPLETED").length}`,
      `Failed: ${stepResults.filter((s) => s.status === "FAILED").length}`,
      `Skipped: ${stepResults.filter((s) => s.status === "SKIPPED").length}`,
      `Total Duration: ${duration}`,
      `---`,
    ];
    for (const sr of stepResults) {
      lines.push(`  ${sr.status}: ${sr.action} (${sr.duration}) — ${sr.message}`);
    }
    return lines.join("\n");
  }
}
