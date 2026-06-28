import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  RECOMMENDATION_ENGINE_NAME,
  RECOMMENDATION_ENGINE_CLASSIFICATION,
  RECOMMENDATION_ENGINE_CONTRACT_VERSION,
  RecommendationInput,
  RecommendationOperationResult,
} from "./RecommendationTypes";

import { RecommendationPipeline } from "./RecommendationPipeline";
import { RecommendationValidator } from "./RecommendationValidator";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class RecommendationEngine implements CognitiveEngine {
  readonly name = RECOMMENDATION_ENGINE_NAME;
  readonly classification = RECOMMENDATION_ENGINE_CLASSIFICATION;
  readonly contractVersion = RECOMMENDATION_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: RecommendationPipeline;
  private validator: RecommendationValidator;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.pipeline = new RecommendationPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new RecommendationValidator();
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

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<RecommendationOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`RecommendationEngine is not running. Current state: ${this.state}`);
    }

    const recommendationInput = this.validator.validateInput(input);
    const result = await this.pipeline.initiateRecommendation(recommendationInput);

    return result;
  }

  getPipeline(): RecommendationPipeline {
    return this.pipeline;
  }

  getMetrics() {
    return {};
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe("prediction.lifecycle.completed", async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });
  }
}
