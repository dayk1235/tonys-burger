/**
 * @file ObservationEngine.ts
 * @description The main Cognitive Engine orchestrator class for the Observation System.
 * Strictly adheres to the Cognitive Engine Contract.
 */

import { CognitiveEngine, EngineState, RuntimeEventBus, ContextBus, AuditPipeline, RecoveryPipeline } from "./ObservationContracts";
import { ObservationMetrics, MetricsSnapshot } from "./ObservationMetrics";
import { ObservationPipeline } from "./ObservationPipeline";
import { Observation } from "./ObservationTypes";

/**
 * Observation Engine reference implementation.
 */
export class ObservationEngine implements CognitiveEngine {
  public readonly name = "ObservationEngine";
  public readonly classification = "Perception";
  public readonly contractVersion = "1.0.0";
  
  private state: EngineState = "INITIALIZED";
  private readonly metrics = new ObservationMetrics();
  private readonly pipeline: ObservationPipeline;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
    contextBus?: ContextBus
  ) {
    this.pipeline = new ObservationPipeline(
      this.metrics,
      this.eventBus,
      this.auditPipeline,
      this.recoveryPipeline,
      contextBus
    );
  }

  public async start(): Promise<void> {
    if (this.state === "RUNNING") return;
    
    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(this.name, this.state, "RUNNING");
    }
    
    this.state = "RUNNING";
  }

  public async stop(): Promise<void> {
    if (this.state === "STOPPED") return;
    
    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(this.name, this.state, "STOPPED");
    }
    
    this.state = "STOPPED";
  }

  public getState(): EngineState {
    return this.state;
  }

  /**
   * Receives input stimulus. Part of the Cognitive Engine Contract.
   */
  public async receiveInput(input: Record<string, unknown>, options?: Record<string, unknown>): Promise<Observation> {
    if (this.state !== "RUNNING") {
      throw new Error(`Engine ${this.name} is not running. Current state: ${this.state}`);
    }
    
    return this.pipeline.processStimulus(input);
  }

  public getMetrics(): MetricsSnapshot {
    return this.metrics.getSnapshot();
  }

  public getPipeline(): ObservationPipeline {
    return this.pipeline;
  }
}
