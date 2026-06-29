import type { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import {
  LearningInput,
  LearningOperationResult,
  LearningEntity,
  LEARNING_ENGINE_NAME,
} from "./LearningTypes";
import { LEARNING_EVENTS } from "./LearningEvents";
import { LearningMemory } from "./LearningMemory";
import { LearningLifecycle } from "./LearningLifecycle";
import { LearningEntityBuilder } from "./LearningEntityBuilder";
import { LearningMetrics } from "./LearningMetrics";

export class LearningPipeline {
  readonly memory: LearningMemory;
  readonly lifecycle: LearningLifecycle;
  readonly builder: LearningEntityBuilder;
  readonly metrics: LearningMetrics;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.memory = new LearningMemory();
    this.lifecycle = new LearningLifecycle();
    this.builder = new LearningEntityBuilder();
    this.metrics = new LearningMetrics();
  }

  async initiateLearning(input: LearningInput): Promise<LearningOperationResult> {
    const entity = this.builder.buildFromDecision(input);

    await this.memory.store(entity);
    this.metrics.recordInitiated();
    this.metrics.recordConfidence(entity.confidence);

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(LEARNING_ENGINE_NAME, "learning_initiated", {
        learningId: entity.id,
        decisionId: input.decisionId,
        decisionLabel: input.decisionLabel,
        outcome: input.decisionOutcome,
        confidence: input.confidence,
      });
    }

    if (this.eventBus) {
      await this.eventBus.emit(LEARNING_EVENTS.LIFECYCLE_INITIATED, {
        entity: {
          learning: {
            id: entity.id,
            decisionId: entity.decisionId,
            decisionLabel: entity.decisionLabel,
            decisionOutcome: entity.decisionOutcome,
            expectedResult: entity.expectedResult,
            actualResult: entity.actualResult,
            resultStatus: entity.resultStatus,
            confidence: entity.confidence,
            rationale: entity.rationale,
            businessId: entity.businessId,
            stage: entity.stage,
          },
        },
        learning: {
          id: entity.id,
          decisionId: entity.decisionId,
          decisionLabel: entity.decisionLabel,
          decisionOutcome: entity.decisionOutcome,
          expectedResult: entity.expectedResult,
          actualResult: entity.actualResult,
          resultStatus: entity.resultStatus,
          confidence: entity.confidence,
          rationale: entity.rationale,
          businessId: entity.businessId,
          stage: entity.stage,
        },
        operation: "INITIATE",
        timestamp: new Date().toISOString(),
        version: 1,
      });
    }

    const completed = await this.completeLearning(entity);

    if (this.eventBus) {
      await this.eventBus.emit(LEARNING_EVENTS.LIFECYCLE_COMPLETED, {
        entity: {
          learning: {
            id: completed.id,
            decisionId: completed.decisionId,
            decisionLabel: completed.decisionLabel,
            decisionOutcome: completed.decisionOutcome,
            expectedResult: completed.expectedResult,
            actualResult: completed.actualResult,
            resultStatus: completed.resultStatus,
            confidence: completed.confidence,
            rationale: completed.rationale,
            businessId: completed.businessId,
            stage: completed.stage,
          },
        },
        learning: {
          id: completed.id,
          decisionId: completed.decisionId,
          decisionLabel: completed.decisionLabel,
          decisionOutcome: completed.decisionOutcome,
          expectedResult: completed.expectedResult,
          actualResult: completed.actualResult,
          resultStatus: completed.resultStatus,
          confidence: completed.confidence,
          rationale: completed.rationale,
          businessId: completed.businessId,
          stage: completed.stage,
        },
        operation: "COMPLETE",
        timestamp: new Date().toISOString(),
        version: 1,
      });
    }

    return {
      success: true,
      learningId: entity.id,
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
      details: `Learning cycle completed for decision "${input.decisionId}" — selected "${input.decisionLabel}" (confidence: ${input.confidence.toFixed(3)})`,
      metadata: {
        decisionId: input.decisionId,
        decisionLabel: input.decisionLabel,
        decisionOutcome: input.decisionOutcome,
        expectedResult: input.expectedResult,
        confidence: input.confidence,
      },
    };
  }

  private async completeLearning(entity: LearningEntity): Promise<LearningEntity> {
    const completed = this.builder.advanceStage(entity, "COMPLETED");
    await this.memory.store(completed);
    this.metrics.recordStageChange("INITIATED", "COMPLETED");
    this.metrics.recordCompleted();

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog(LEARNING_ENGINE_NAME, "learning_completed", {
        learningId: completed.id,
        decisionId: completed.decisionId,
        stage: completed.stage,
      });
    }

    return completed;
  }
}
