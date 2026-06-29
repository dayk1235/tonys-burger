import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  PlanningInput,
  PlanningOperationResult,
  PlanningEntity,
  PLANNING_ENGINE_NAME,
} from "./PlanningTypes";
import { PLANNING_EVENTS } from "./PlanningEvents";
import { PlanningMemory } from "./PlanningMemory";
import { PlanningLifecycle } from "./PlanningLifecycle";
import { PlanningBuilder } from "./PlanningBuilder";
import { PlanningGenerator } from "./PlanningGenerator";
import { PlanningMetrics } from "./PlanningMetrics";

export class PlanningPipeline {
  readonly memory: PlanningMemory;
  readonly lifecycle: PlanningLifecycle;
  readonly builder: PlanningBuilder;
  readonly generator: PlanningGenerator;
  readonly metrics: PlanningMetrics;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.memory = new PlanningMemory();
    this.lifecycle = new PlanningLifecycle();
    this.builder = new PlanningBuilder();
    this.generator = new PlanningGenerator();
    this.metrics = new PlanningMetrics();
  }

  async initiatePlan(input: PlanningInput): Promise<PlanningOperationResult> {
    const { steps, estimatedDuration, requiredResources, dependencies, rollbackStrategy, overallConfidence } =
      this.generator.generate(input);

    const entity = this.builder.buildFromRecommendation(
      input, steps, estimatedDuration, requiredResources, dependencies, rollbackStrategy,
    );

    await this.memory.store(entity);
    this.metrics.recordInitiated(steps.length);
    this.metrics.recordConfidence(entity.confidence);
    this.metrics.recordStageChange("INITIATED", "COMPLETED");
    this.metrics.recordCompleted();

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(PLANNING_ENGINE_NAME, "plan_completed", {
        planId: entity.id,
        recommendationId: input.recommendationId,
        steps: steps.length,
        estimatedDuration,
        confidence: entity.confidence,
      });
    }

    if (this.eventBus) {
      const eventPayload: Record<string, unknown> = {
        entity: {
          plan: {
            id: entity.id,
            recommendationId: entity.recommendationId,
            executionSteps: entity.executionSteps,
            estimatedDuration: entity.estimatedDuration,
            requiredResources: entity.requiredResources,
            dependencies: entity.dependencies,
            rollbackStrategy: entity.rollbackStrategy,
            expectedOutcome: entity.expectedOutcome,
            executionPriority: entity.executionPriority,
            confidence: entity.confidence,
            businessId: entity.businessId,
            stage: entity.stage,
          },
        },
        plan: {
          id: entity.id,
          recommendationId: entity.recommendationId,
          executionSteps: entity.executionSteps,
          estimatedDuration: entity.estimatedDuration,
          requiredResources: entity.requiredResources,
          dependencies: entity.dependencies,
          rollbackStrategy: entity.rollbackStrategy,
          expectedOutcome: entity.expectedOutcome,
          executionPriority: entity.executionPriority,
          confidence: entity.confidence,
          businessId: entity.businessId,
          stage: entity.stage,
        },
        operation: "COMPLETE",
        timestamp: new Date().toISOString(),
        version: 1,
      };

      await this.eventBus.emit(PLANNING_EVENTS.LIFECYCLE_INITIATED, eventPayload);
      await this.eventBus.emit(PLANNING_EVENTS.LIFECYCLE_COMPLETED, eventPayload);
    }

    return {
      success: true,
      planId: entity.id,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Plan completed for recommendation "${input.recommendationId}" — ${steps.length} steps, estimated ${estimatedDuration} (confidence: ${entity.confidence.toFixed(3)})`,
      metadata: {
        recommendationId: input.recommendationId,
        steps: steps.length,
        estimatedDuration,
        confidence: entity.confidence,
      },
    };
  }
}
