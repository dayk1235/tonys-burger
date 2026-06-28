import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  DECISION_ENGINE_NAME,
  DECISION_ENGINE_CLASSIFICATION,
  DECISION_ENGINE_CONTRACT_VERSION,
  DecisionInput,
  DecisionOperationResult,
  DecisionAlternative,
} from "./DecisionTypes";

import { DecisionPipeline } from "./DecisionPipeline";
import { DecisionValidator } from "./DecisionValidator";
import { REASONING_EVENTS } from "../reasoning/ReasoningEvents";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class DecisionEngine implements CognitiveEngine {
  readonly name = DECISION_ENGINE_NAME;
  readonly classification = DECISION_ENGINE_CLASSIFICATION;
  readonly contractVersion = DECISION_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: DecisionPipeline;
  private validator: DecisionValidator;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {
    this.pipeline = new DecisionPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new DecisionValidator();
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

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<DecisionOperationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`DecisionEngine is not running. Current state: ${this.state}`);
    }

    const decisionInput = this.validator.validateInput(input);
    const result = await this.pipeline.initiateDecision(decisionInput);

    return result;
  }

  getPipeline(): DecisionPipeline {
    return this.pipeline;
  }

  getMetrics() {
    return {};
  }

  private subscribeToRuntimeEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe(REASONING_EVENTS.LIFECYCLE_COMPLETED, async (payload: Record<string, unknown>) => {
      try {
        const reasoningPayload = payload.reasoning as Record<string, unknown> | undefined;
        const reasoningAvailable = reasoningPayload && typeof reasoningPayload === "object";

        const reasoningId = reasoningAvailable
          ? String(reasoningPayload.id || "")
          : String(payload.reasoningId || "");

        const confidence = reasoningAvailable
          ? Number(reasoningPayload.confidence) || 0
          : Number(payload.confidence) || 0;

        const businessId = reasoningAvailable
          ? String((reasoningPayload.identity as Record<string, unknown> | undefined)?.businessId || reasoningPayload.businessId || "")
          : String(payload.businessId || "");

        const questionText = reasoningAvailable
          ? String((reasoningPayload.question as Record<string, unknown> | undefined)?.text || (reasoningPayload.identity as Record<string, unknown> | undefined)?.name || "")
          : String(payload.name || "Decision required");

        const reasoningConclusion = reasoningAvailable
          ? String((reasoningPayload.identity as Record<string, unknown> | undefined)?.name || "Reasoning completed")
          : String(payload.name || "Reasoning completed");

        const urgency = reasoningAvailable
          ? Number((reasoningPayload.context as Record<string, unknown> | undefined)?.urgency) || 0.5
          : Number(payload.urgency) || 0.5;

        const rawAlternatives = reasoningAvailable
          ? reasoningPayload.alternatives
          : payload.alternatives;

        const alternatives = this.resolveAlternatives(rawAlternatives, payload);

        const decisionInput: DecisionInput = {
          reasoningId,
          reasoningConclusion,
          confidence,
          alternatives,
          businessId,
          questionText,
          urgency,
        };

        await this.receiveInput(decisionInput as unknown as Record<string, unknown>);
      } catch {
        // silently handle
      }
    });
  }

  private resolveAlternatives(
    rawAlternatives: unknown,
    flatPayload: Record<string, unknown>,
  ): DecisionAlternative[] {
    if (Array.isArray(rawAlternatives) && rawAlternatives.length >= 2) {
      return rawAlternatives.map((alt: Record<string, unknown>) => ({
        id: String(alt.id || ""),
        label: String(alt.title || alt.label || ""),
        description: String(alt.description || ""),
        expectedOutcome: String(alt.expectedOutcome || alt.description || ""),
        riskLevel: Number(alt.riskLevel) || 0.3,
        opportunityScore: Number(alt.opportunityScore) || 0.5,
        costEstimate: Number(alt.costEstimate) || 0,
        humanImpactScore: Number(alt.humanImpactScore) || 0.5,
        reversibility: (alt.reversibility as DecisionAlternative["reversibility"]) || "REVERSIBLE",
      }));
    }
    return this.buildDefaultAlternatives(flatPayload);
  }

  private buildDefaultAlternatives(payload: Record<string, unknown>): DecisionAlternative[] {
    return [
      {
        id: `alt-proceed-${Date.now()}`,
        label: "Proceed",
        description: `Proceed based on reasoning: ${(payload.name as string) || "analysis complete"}`,
        expectedOutcome: "Implementation of the recommended approach",
        riskLevel: 0.3,
        opportunityScore: 0.7,
        costEstimate: 0,
        humanImpactScore: 0.5,
        reversibility: "REVERSIBLE",
      },
      {
        id: `alt-defer-${Date.now()}`,
        label: "Defer",
        description: "Defer decision for further analysis or information gathering",
        expectedOutcome: "More comprehensive data before committing",
        riskLevel: 0.1,
        opportunityScore: 0.3,
        costEstimate: 0,
        humanImpactScore: 0.2,
        reversibility: "REVERSIBLE",
      },
    ];
  }
}
