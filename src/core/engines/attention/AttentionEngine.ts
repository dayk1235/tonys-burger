import {
  ATTENTION_ENGINE_NAME,
  ATTENTION_ENGINE_CLASSIFICATION,
  ATTENTION_ENGINE_CONTRACT_VERSION,
  AttentionInput,
  AttentionCategory,
  AttentionPriorityFactors,
  SourceType,
  AttentionOperationResult,
} from "./AttentionTypes";
import { RuntimeEventBus, AuditPipeline, RecoveryPipeline, CognitiveEngine, EngineState } from "../observation/ObservationContracts";
import { KNOWLEDGE_EVENTS } from "../knowledge/KnowledgeEvents";

import { AttentionPipeline } from "./AttentionPipeline";
import { AttentionValidator } from "./AttentionValidator";

export class AttentionEngine implements CognitiveEngine {
  readonly name = ATTENTION_ENGINE_NAME;
  readonly classification = ATTENTION_ENGINE_CLASSIFICATION;
  readonly contractVersion = ATTENTION_ENGINE_CONTRACT_VERSION;

  private state: EngineState = "INITIALIZED";
  private pipeline: AttentionPipeline;
  private validator: AttentionValidator;
  private tickInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.pipeline = new AttentionPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new AttentionValidator();
  }

  async start(tickMs: number = 1000): Promise<void> {
    if (this.state === "RUNNING") return;

    this.subscribeToRuntimeEvents();
    this.subscribeToKnowledgeEvents();
    this.state = "RUNNING";

    this.tickInterval = setInterval(() => {
      this.pipeline.tick().catch(() => {});
    }, tickMs);

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

    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(this.name, "RUNNING", "STOPPED");
    }
  }

  getState(): EngineState {
    return this.state;
  }

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<AttentionOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`AttentionEngine is not running. Current state: ${this.state}`);
    }

    const source = input.source as Record<string, unknown> | undefined;
    const identity = source?.identity as Record<string, unknown> | undefined;
    const priorityFactors = source?.priorityFactors as Record<string, unknown> | undefined;

    const attentionInput: AttentionInput = {
      sourceId: (source?.id as string) || (identity?.id as string) || "",
      sourceType: (input.sourceType as SourceType) || "OBSERVATION",
      sourceIds: [...((source?.sourceIds as string[]) || [])],
      name: (identity?.name as string) || (input.name as string) || "Unknown",
      category: (input.category as AttentionInput["category"]) || "GENERAL",
      urgency: (priorityFactors?.urgency as number) || (input.urgency as number) || 0,
      importance: (priorityFactors?.importance as number) || (input.importance as number) || 0,
      risk: (priorityFactors?.risk as number) || (input.risk as number) || 0,
      opportunity: (priorityFactors?.opportunity as number) || (input.opportunity as number) || 0,
      businessValue: (input.businessValue as number) || 0,
      humanValue: (input.humanValue as number) || 0,
      businessId: (input.businessId as string) || "default",
    };

    this.validator.validateInput(attentionInput);
    const attention = await this.pipeline.createAttention(attentionInput);

    return {
      success: true,
      attentionId: attention.id,
      operation: "PRIORITIZE",
      timestamp: new Date().toISOString(),
      details: `Attention created for "${attention.identity.name}" with priority ${attention.priority.toFixed(3)}`,
      metadata: {
        name: attention.identity.name,
        category: attention.identity.category,
        stage: attention.stage,
        priority: attention.priority,
        allocation: attention.allocation,
      },
    };
  }

  getPipeline(): AttentionPipeline {
    return this.pipeline;
  }

  getMetrics() {
    return this.pipeline.getMetricsSnapshot();
  }

  forceTick(): Promise<AttentionOperationResult> {
    return this.pipeline.tick();
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe("runtime.emergency", async (payload) => {
      this.pipeline.submitInterruption(
        (payload.sourceId as string) || "",
        "RUNTIME_EVENT" as SourceType,
        (payload.priority as number) || 0.9,
        (payload.reason as string) || "Runtime emergency",
        true,
      );
    });

    this.eventBus.subscribe("runtime.context.change", async (payload) => {
      if (payload.loadLevel !== undefined) {
        this.pipeline.updateContext({ loadLevel: payload.loadLevel as number });
      }
    });
  }

  private subscribeToKnowledgeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe(KNOWLEDGE_EVENTS.LIFECYCLE_VALIDATED, async (payload) => {
      try {
        const p = payload as Record<string, unknown>;
        const knowledge = p.knowledge as Record<string, unknown> | undefined;

        if (knowledge) {
          const identity = (knowledge.identity as Record<string, unknown>) || {};
          const priorityFactors = (knowledge.priorityFactors as Record<string, unknown>) || {};
          const knowledgeMetadata = (knowledge.metadata as Record<string, unknown>) || {};
          const confidence = (knowledge.confidence as number) || 0.5;
          const integrity = (knowledge.integrity as number) || 0.5;

          await this.receiveInput({
            source: {
              id: knowledge.id as string,
              sourceIds: [knowledge.id as string],
              identity: identity,
              priorityFactors: {
                urgency: priorityFactors.urgency || 0.5,
                importance: confidence,
                risk: priorityFactors.risk || 0,
                opportunity: priorityFactors.opportunity || 0,
                businessValue: integrity,
                humanValue: priorityFactors.humanValue || 0.5,
              } as AttentionPriorityFactors,
            },
            sourceType: "KNOWLEDGE",
            name: identity.name as string || "Unknown",
            category: this.mapKnowledgeCategory(identity.category as string),
            urgency: (priorityFactors.urgency as number) || 0.5,
            importance: confidence,
            risk: (priorityFactors.risk as number) || 0,
            opportunity: (priorityFactors.opportunity as number) || 0,
            businessValue: integrity,
            humanValue: (priorityFactors.humanValue as number) || 0.5,
            businessId: ((knowledgeMetadata.attributes as Record<string, unknown> | undefined)?.businessId as string) || (identity.businessId as string) || "default",
          } as unknown as Record<string, unknown>);
        } else {
          await this.receiveInput({
            source: {
              id: p.knowledgeId as string,
              sourceIds: [p.knowledgeId as string],
            },
            sourceType: "KNOWLEDGE",
            name: p.name as string,
            category: this.mapKnowledgeCategory(p.category as string),
            urgency: 0.5,
            importance: typeof p.confidence === "number" ? p.confidence : 0.5,
            risk: 0,
            opportunity: 0,
            businessValue: typeof p.integrity === "number" ? p.integrity : 0.5,
            humanValue: 0.5,
            businessId: "default",
          } as unknown as Record<string, unknown>);
        }
      } catch {
        // silently handle
      }
    });
  }

  private mapKnowledgeCategory(category: string): AttentionCategory {
    const map: Record<string, AttentionCategory> = {
      CUSTOMER_BEHAVIOR: "VIP_CUSTOMER",
      EMPLOYEE_EXPERTISE: "OPERATIONAL",
      SUPPLIER_RELIABILITY: "SUPPLIER_DELAY",
      INVENTORY_KNOWLEDGE: "INVENTORY_SHORTAGE",
      SEASONALITY: "OPERATIONAL",
      PROMOTION_KNOWLEDGE: "REVENUE_OPPORTUNITY",
      OPERATIONAL_PRACTICE: "OPERATIONAL",
      MAINTENANCE_HISTORY: "MAINTENANCE",
      BUSINESS_GROWTH: "STRATEGIC",
    };
    return map[category] || "GENERAL";
  }
}
