import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  PLANNING_ENGINE_NAME,
  PLANNING_ENGINE_CLASSIFICATION,
  PLANNING_ENGINE_CONTRACT_VERSION,
  PlanningInput,
  PlanningOperationResult,
} from "./PlanningTypes";

import { PlanningPipeline } from "./PlanningPipeline";
import { PlanningValidator } from "./PlanningValidator";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class PlanningEngine implements CognitiveEngine {
  readonly name = PLANNING_ENGINE_NAME;
  readonly classification = PLANNING_ENGINE_CLASSIFICATION;
  readonly contractVersion = PLANNING_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: PlanningPipeline;
  private validator: PlanningValidator;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.pipeline = new PlanningPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new PlanningValidator();
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

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<PlanningOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`PlanningEngine is not running. Current state: ${this.state}`);
    }

    const planningInput = this.validator.validateInput(input);
    const result = await this.pipeline.initiatePlan(planningInput);

    return result;
  }

  getPipeline(): PlanningPipeline {
    return this.pipeline;
  }

  getMetrics() {
    return {};
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe("recommendation.lifecycle.completed", async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });
  }
}
