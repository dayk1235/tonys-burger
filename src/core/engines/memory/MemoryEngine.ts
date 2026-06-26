import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  MEMORY_ENGINE_NAME,
  MEMORY_ENGINE_CLASSIFICATION,
  MEMORY_ENGINE_CONTRACT_VERSION,
  MemoryInput,
  MemoryOperationResult,
} from "./MemoryTypes";

import { MemoryPipeline } from "./MemoryPipeline";
import { MemoryValidator } from "./MemoryValidator";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class MemoryEngine implements CognitiveEngine {
  readonly name = MEMORY_ENGINE_NAME;
  readonly classification = MEMORY_ENGINE_CLASSIFICATION;
  readonly contractVersion = MEMORY_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: MemoryPipeline;
  private validator: MemoryValidator;
  private cycleInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.pipeline = new MemoryPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new MemoryValidator();
  }

  async start(): Promise<void> {
    if (this.state === "RUNNING") return;

    this.subscribeToEvidenceEvents();

    this.cycleInterval = setInterval(async () => {
      try {
        await this.pipeline.processCycle();
      } catch {
        // silently handle cycle errors
      }
    }, 60000);

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

    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
      this.cycleInterval = null;
    }

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(this.name, "RUNNING", "STOPPED");
    }
  }

  getState(): EngineState {
    return this.state;
  }

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<MemoryOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`MemoryEngine is not running. Current state: ${this.state}`);
    }

    const memoryInput = this.validator.validateMemoryInput(input);
    const description = (input.description as string) || `Memory from evidence ${memoryInput.evidenceId}`;

    const memory = await this.pipeline.createMemory(memoryInput, description);

    const qualityResult = this.pipeline.quality.evaluate(memory);
    const confidenceValue = this.pipeline.confidence.compute(memory, qualityResult.profile);
    const scoreResult = this.pipeline.scoring.evaluate(memory);

    const recallScore = scoreResult.retentionScore;
    const activationScore = scoreResult.activationScore;
    const retentionScore = scoreResult.retentionScore;

    const updated = this.pipeline.factory.cloneWithTransition(memory, memory.stage, {
      confidence: confidenceValue,
      recallScore,
      activationScore,
      retentionScore,
      qualityProfile: qualityResult.profile,
    });

    this.pipeline.index.index(updated);

    const consolidationResult = this.pipeline.consolidation.evaluateConsolidation(updated);
    if (consolidationResult.consolidated) {
      await this.pipeline.consolidateMemory(updated);
    }

    return {
      success: true,
      memoryId: memory.id,
      operation: "CREATE",
      timestamp: new Date().toISOString(),
      details: `Memory created for evidence "${memoryInput.evidenceId}"`,
      metadata: {
        name: memory.identity.name,
        category: memory.identity.category,
        stage: memory.stage,
        strength: memory.strength,
        confidence: confidenceValue,
        recallScore,
      },
    };
  }

  getPipeline(): MemoryPipeline {
    return this.pipeline;
  }

  getMetrics(): ReturnType<MemoryPipeline["getMetrics"]> {
    return this.pipeline.getMetrics();
  }

  private subscribeToEvidenceEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe("evidence.lifecycle.validated_confirmed", async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });

    this.eventBus.subscribe("evidence.evaluation.completed", async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });
  }
}
