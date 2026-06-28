import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  EXECUTION_ENGINE_NAME,
  EXECUTION_ENGINE_CLASSIFICATION,
  EXECUTION_ENGINE_CONTRACT_VERSION,
  ExecutionInput,
  ExecutionOperationResult,
} from "./ExecutionTypes";

import { ExecutionPipeline } from "./ExecutionPipeline";
import { ExecutionValidator } from "./ExecutionValidator";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class ExecutionEngine implements CognitiveEngine {
  readonly name = EXECUTION_ENGINE_NAME;
  readonly classification = EXECUTION_ENGINE_CLASSIFICATION;
  readonly contractVersion = EXECUTION_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: ExecutionPipeline;
  private validator: ExecutionValidator;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.pipeline = new ExecutionPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new ExecutionValidator();
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

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<ExecutionOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`ExecutionEngine is not running. Current state: ${this.state}`);
    }

    const executionInput = this.validator.validateInput(input);
    const result = await this.pipeline.initiateExecution(executionInput);

    return result;
  }

  getPipeline(): ExecutionPipeline {
    return this.pipeline;
  }

  getMetrics() {
    return {};
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe("planning.lifecycle.completed", async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });
  }
}
