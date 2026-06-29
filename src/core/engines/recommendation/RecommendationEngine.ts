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
import { RUNTIME_EVENTS } from "../../runtime/RuntimeEvents";
import { PREDICTION_EVENTS } from "../prediction/PredictionEvents";
import { RuntimeErrorReporter } from "../../runtime/RuntimeErrorReporter";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class RecommendationEngine implements CognitiveEngine {
  readonly name = RECOMMENDATION_ENGINE_NAME;
  readonly classification = RECOMMENDATION_ENGINE_CLASSIFICATION;
  readonly contractVersion = RECOMMENDATION_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: RecommendationPipeline;
  private validator: RecommendationValidator;
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.pipeline = new RecommendationPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new RecommendationValidator();
    this.errorReporter = new RuntimeErrorReporter(this.name, this.auditPipeline, this.recoveryPipeline);
  }

  async start(): Promise<void> {
    if (this.state === "RUNNING") return;

    this.subscribeToRuntimeEvents();

    this.state = "RUNNING";

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(this.name, "INITIALIZED", "RUNNING");
    }
    if (this.eventBus) {
      await this.eventBus.emit(RUNTIME_EVENTS.ENGINE_STATE_CHANGE, {
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
    return this.pipeline.metrics.getSnapshot();
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe(PREDICTION_EVENTS.LIFECYCLE_COMPLETED, async (payload) => {
      try {
        const extracted = this.validator.extractFromPredictionEvent(payload as Record<string, unknown>);
        await this.receiveInput(extracted);
      } catch (err) {
        await this.errorReporter.reportEngineError(PREDICTION_EVENTS.LIFECYCLE_COMPLETED, err);
      }
    });
  }
}
