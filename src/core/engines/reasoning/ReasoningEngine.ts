import {
  REASONING_ENGINE_NAME,
  REASONING_ENGINE_CLASSIFICATION,
  REASONING_ENGINE_CONTRACT_VERSION,
  ReasoningInput,
  ReasoningOperationResult,
  ReasoningType,
  QuestionType,
} from "./ReasoningTypes";
import { RuntimeEventBus, AuditPipeline, RecoveryPipeline, CognitiveEngine, EngineState } from "../observation/ObservationContracts";
import { ATTENTION_EVENTS } from "../attention/AttentionEvents";
import { ReasoningPipeline } from "./ReasoningPipeline";
import { ReasoningValidator } from "./ReasoningValidator";
import { RUNTIME_EVENTS } from "../../runtime/RuntimeEvents";
import { RuntimeErrorReporter } from "../../runtime/RuntimeErrorReporter";

export class ReasoningEngine implements CognitiveEngine {
  readonly name = REASONING_ENGINE_NAME;
  readonly classification = REASONING_ENGINE_CLASSIFICATION;
  readonly contractVersion = REASONING_ENGINE_CONTRACT_VERSION;

  private state: EngineState = "INITIALIZED";
  private pipeline: ReasoningPipeline;
  private validator: ReasoningValidator;
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.pipeline = new ReasoningPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new ReasoningValidator();
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

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<ReasoningOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`ReasoningEngine is not running. Current state: ${this.state}`);
    }

    const attention = input.attention as Record<string, unknown> | undefined;
    const identity = attention?.identity as Record<string, unknown> | undefined;
    const provenance = attention?.provenance as Record<string, unknown> | undefined;
    const priorityFactors = attention?.priorityFactors as Record<string, unknown> | undefined;
    const attentionMetadata = attention?.metadata as Record<string, unknown> | undefined;
    const attrs = (attentionMetadata?.attributes as Record<string, unknown>) || {};

    const reasoningInput: ReasoningInput = {
      attentionId: (attention?.id as string) || (input.attentionId as string) || "",
      sourceObservationIds: [...((provenance?.sourceObservationIds as string[]) || [])],
      sourceMemoryIds: [...((provenance?.sourceMemoryIds as string[]) || [])],
      sourceKnowledgeIds: [...((provenance?.sourceKnowledgeIds as string[]) || [])],
      name: (identity?.name as string) || (input.name as string) || "Unknown",
      questionText: (input.questionText as string) || (input.question as string) || "",
      questionType: (input.questionType as QuestionType) || "DIAGNOSE",
      intent: (input.intent as string) || "analyze",
      reasoningType: (input.reasoningType as ReasoningType) || "DIAGNOSTIC",
      urgency: (priorityFactors?.urgency as number) || (input.urgency as number) || 0.3,
      businessValue: (priorityFactors?.businessValue as number) || (input.businessValue as number) || 0.5,
      businessId: (attrs.businessId as string) || (identity?.businessId as string) || (input.businessId as string) || "",
    };

    this.validator.validateInput(reasoningInput);
    const reasoning = await this.pipeline.createCase(reasoningInput);

    return {
      success: true,
      reasoningId: reasoning.id,
      operation: "ACTIVATE",
      timestamp: new Date().toISOString(),
      details: `Reasoning case created for "${reasoning.identity.name}" with confidence ${reasoning.confidence.toFixed(2)}`,
      metadata: {
        name: reasoning.identity.name,
        type: reasoning.type,
        stage: reasoning.stage,
        confidence: reasoning.confidence,
        hypothesesCount: reasoning.hypotheses.length,
        alternativesCount: reasoning.alternatives.length,
      },
    };
  }

  getPipeline(): ReasoningPipeline {
    return this.pipeline;
  }

  getMetrics() {
    return this.pipeline.getMetricsSnapshot();
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe(ATTENTION_EVENTS.OPERATION_PRIORITIZED, async (payload: Record<string, unknown>) => {
      try {
        await this.receiveInput(payload);
      } catch (err) {
        await this.errorReporter.reportEngineError(ATTENTION_EVENTS.OPERATION_PRIORITIZED, err);
      }
    });
  }
}
