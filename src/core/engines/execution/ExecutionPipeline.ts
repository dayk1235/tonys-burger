import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  ExecutionInput,
  ExecutionOperationResult,
  ExecutionEntity,
  EXECUTION_ENGINE_NAME,
} from "./ExecutionTypes";
import { EXECUTION_EVENTS } from "./ExecutionEvents";
import { ExecutionMemory } from "./ExecutionMemory";
import { ExecutionLifecycle } from "./ExecutionLifecycle";
import { ExecutionBuilder } from "./ExecutionBuilder";
import { ExecutionRunner } from "./ExecutionRunner";
import { ExecutionMetrics } from "./ExecutionMetrics";

export class ExecutionPipeline {
  readonly memory: ExecutionMemory;
  readonly lifecycle: ExecutionLifecycle;
  readonly builder: ExecutionBuilder;
  readonly runner: ExecutionRunner;
  readonly metrics: ExecutionMetrics;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.memory = new ExecutionMemory();
    this.lifecycle = new ExecutionLifecycle();
    this.builder = new ExecutionBuilder();
    this.runner = new ExecutionRunner();
    this.metrics = new ExecutionMetrics();
  }

  async initiateExecution(input: ExecutionInput): Promise<ExecutionOperationResult> {
    let entity = this.builder.buildFromPlan(input);

    // Advance through lifecycle: INITIATED → QUEUED → PREPARING → RUNNING → VERIFYING → COMPLETED
    entity = this.advanceWithValidation(entity, "QUEUED");
    entity = this.advanceWithValidation(entity, "PREPARING");
    entity = this.advanceWithValidation(entity, "RUNNING");

    // Simulate execution
    const result = this.runner.run(entity);
    entity = this.builder.applyResults(
      entity,
      result.stepResults,
      result.startedAt,
      result.completedAt,
      result.duration,
      result.executionReport,
    );

    entity = this.advanceWithValidation(entity, "VERIFYING");
    entity = this.advanceWithValidation(entity, "COMPLETED");

    await this.memory.store(entity);
    this.metrics.recordInitiated();
    this.metrics.recordConfidence(entity.confidence);
    this.metrics.recordDuration(entity.duration);
    this.metrics.recordStageChange("INITIATED", "QUEUED");
    this.metrics.recordStageChange("QUEUED", "PREPARING");
    this.metrics.recordStageChange("PREPARING", "RUNNING");
    this.metrics.recordStageChange("RUNNING", "VERIFYING");
    this.metrics.recordStageChange("VERIFYING", "COMPLETED");
    this.metrics.recordCompleted();

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(EXECUTION_ENGINE_NAME, "execution_completed", {
        executionId: entity.id,
        planId: entity.planId,
        steps: entity.executionSteps.length,
        completed: entity.completedSteps,
        failed: entity.failedSteps,
        duration: entity.duration,
        confidence: entity.confidence,
      });
    }

    if (this.eventBus) {
      const makePayload = (stage: string) => ({
        entity: {
          execution: {
            id: entity.id,
            planId: entity.planId,
            executionSteps: entity.executionSteps,
            stepResults: entity.stepResults,
            completedSteps: entity.completedSteps,
            failedSteps: entity.failedSteps,
            skippedSteps: entity.skippedSteps,
            startedAt: entity.startedAt,
            completedAt: entity.completedAt,
            duration: entity.duration,
            executionReport: entity.executionReport,
            confidence: entity.confidence,
            stage,
          },
        },
        execution: {
          id: entity.id,
          planId: entity.planId,
          executionSteps: entity.executionSteps,
          stepResults: entity.stepResults,
          completedSteps: entity.completedSteps,
          failedSteps: entity.failedSteps,
          skippedSteps: entity.skippedSteps,
          startedAt: entity.startedAt,
          completedAt: entity.completedAt,
          duration: entity.duration,
          executionReport: entity.executionReport,
          confidence: entity.confidence,
          stage,
        },
        operation: stage === "COMPLETED" ? "COMPLETE" : stage,
        timestamp: new Date().toISOString(),
        version: 1,
      });

      await this.eventBus.emit(EXECUTION_EVENTS.LIFECYCLE_INITIATED, makePayload("INITIATED"));
      await this.eventBus.emit(EXECUTION_EVENTS.LIFECYCLE_RUNNING, makePayload("RUNNING"));
      await this.eventBus.emit(EXECUTION_EVENTS.LIFECYCLE_COMPLETED, makePayload("COMPLETED"));
    }

    return {
      success: true,
      executionId: entity.id,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      details: `Execution completed for plan "${entity.planId}" — ${entity.completedSteps}/${entity.executionSteps.length} steps, duration ${entity.duration} (confidence: ${entity.confidence.toFixed(3)})`,
      metadata: {
        planId: entity.planId,
        steps: entity.executionSteps.length,
        completed: entity.completedSteps,
        failed: entity.failedSteps,
        duration: entity.duration,
        confidence: entity.confidence,
      },
    };
  }

  private advanceWithValidation(entity: ExecutionEntity, target: ExecutionEntity["stage"]): ExecutionEntity {
    this.lifecycle.validateTransition(entity.stage, target);
    return this.builder.advanceStage(entity, target);
  }
}
