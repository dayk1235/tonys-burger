import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  LEARNING_ENGINE_NAME,
  LEARNING_ENGINE_CLASSIFICATION,
  LEARNING_ENGINE_CONTRACT_VERSION,
  LearningInput,
  LearningOperationResult,
} from "./LearningTypes";

import { LearningPipeline } from "./LearningPipeline";
import { LearningValidator } from "./LearningValidator";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class LearningEngine implements CognitiveEngine {
  readonly name = LEARNING_ENGINE_NAME;
  readonly classification = LEARNING_ENGINE_CLASSIFICATION;
  readonly contractVersion = LEARNING_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: LearningPipeline;
  private validator: LearningValidator;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.pipeline = new LearningPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new LearningValidator();
  }

  async start(): Promise<void> {
    if (this.state === "RUNNING") return;

    this.subscribeToRuntimeEvents();

    this.state = "RUNNING";

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(this.name, "INITIALIZED", "RUNNING");
    }
    if (this.eventBus) {
      await this.eventBus.emit("engine:state-change", {
        engine: this.name,
        from: "INITIALIZED",
        to: "RUNNING",
      });
    }
  }

  async stop(): Promise<void> {
    if (this.state === "STOPPED") return;
    this.state = "STOPPED";

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(this.name, "RUNNING", "STOPPED");
    }
  }

  getState(): EngineState {
    return this.state;
  }

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<LearningOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`LearningEngine is not running. Current state: ${this.state}`);
    }

    const learningInput = this.validator.validateInput(input);
    const result = await this.pipeline.initiateLearning(learningInput);

    return result;
  }

  getPipeline(): LearningPipeline {
    return this.pipeline;
  }

  getMetrics() {
    return {};
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe("decision.lifecycle.initiated", async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });

    this.eventBus.subscribe("decision.lifecycle.accepted", async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });
  }
}
