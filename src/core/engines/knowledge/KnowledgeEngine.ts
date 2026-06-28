import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  KNOWLEDGE_ENGINE_NAME,
  KNOWLEDGE_ENGINE_CLASSIFICATION,
  KNOWLEDGE_ENGINE_CONTRACT_VERSION,
  KnowledgeInput,
  KnowledgeOperationResult,
} from "./KnowledgeTypes";

import { KnowledgePipeline } from "./KnowledgePipeline";
import { KnowledgeValidator } from "./KnowledgeValidator";
import { MEMORY_EVENTS } from "../memory/MemoryEvents";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class KnowledgeEngine implements CognitiveEngine {
  readonly name = KNOWLEDGE_ENGINE_NAME;
  readonly classification = KNOWLEDGE_ENGINE_CLASSIFICATION;
  readonly contractVersion = KNOWLEDGE_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: KnowledgePipeline;
  private validator: KnowledgeValidator;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.pipeline = new KnowledgePipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new KnowledgeValidator();
  }

  async start(): Promise<void> {
    if (this.state === "RUNNING") return;

    this.subscribeToMemoryEvents();

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

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<KnowledgeOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`KnowledgeEngine is not running. Current state: ${this.state}`);
    }

    const knowledgeInput = this.validator.validateKnowledgeInput(input);
    const description = (input.description as string) || `Knowledge from memory ${knowledgeInput.memoryId}`;

    const knowledge = await this.pipeline.createKnowledge(knowledgeInput, description);

    const autoValidated = await this.pipeline.validateKnowledge(knowledge);

    return {
      success: true,
      knowledgeId: knowledge.id,
      operation: "EXTRACT",
      timestamp: new Date().toISOString(),
      details: `Knowledge created from memory "${knowledgeInput.memoryId}"`,
      metadata: {
        name: knowledge.identity.name,
        category: knowledge.identity.category,
        stage: autoValidated.stage,
        confidence: autoValidated.confidence,
        integrity: autoValidated.integrity,
      },
    };
  }

  getPipeline(): KnowledgePipeline {
    return this.pipeline;
  }

  getMetrics(): ReturnType<KnowledgePipeline["getMetrics"]> {
    return this.pipeline.getMetrics();
  }

  private subscribeToMemoryEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe(MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED, async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });

    this.eventBus.subscribe(MEMORY_EVENTS.LIFECYCLE_LONG_TERM_PROMOTED, async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });

    this.eventBus.subscribe(MEMORY_EVENTS.LIFECYCLE_SEMANTIC_ESTABLISHED, async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });
  }
}
