import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  PREDICTION_ENGINE_NAME,
  PREDICTION_ENGINE_CLASSIFICATION,
  PREDICTION_ENGINE_CONTRACT_VERSION,
  PredictionInput,
  PredictionOperationResult,
} from "./PredictionTypes";

import { PredictionPipeline } from "./PredictionPipeline";
import { PredictionValidator } from "./PredictionValidator";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class PredictionEngine implements CognitiveEngine {
  readonly name = PREDICTION_ENGINE_NAME;
  readonly classification = PREDICTION_ENGINE_CLASSIFICATION;
  readonly contractVersion = PREDICTION_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: PredictionPipeline;
  private validator: PredictionValidator;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.pipeline = new PredictionPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new PredictionValidator();
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

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<PredictionOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`PredictionEngine is not running. Current state: ${this.state}`);
    }

    const predictionInput = this.validator.validateInput(input);
    const result = await this.pipeline.initiatePrediction(predictionInput);

    return result;
  }

  getPipeline(): PredictionPipeline {
    return this.pipeline;
  }

  getMetrics() {
    return {};
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe("learning.lifecycle.completed", async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });
  }
}
