import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  EVIDENCE_ENGINE_NAME,
  EVIDENCE_ENGINE_CLASSIFICATION,
  EVIDENCE_ENGINE_CONTRACT_VERSION,
  EvidenceEvaluationResult,
  ObservationDetail,
  PatternDetail,
} from "./EvidenceTypes";

import { EVIDENCE_EVENTS } from "./EvidenceEvents";
import { PatternEventNames } from "../pattern/PatternEvents";
import { EvidencePipeline } from "./EvidencePipeline";
import { EvidenceValidator } from "./EvidenceValidator";
import { RUNTIME_EVENTS } from "../../runtime/RuntimeEvents";
import { RuntimeErrorReporter } from "../../runtime/RuntimeErrorReporter";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class EvidenceEngine implements CognitiveEngine {
  readonly name = EVIDENCE_ENGINE_NAME;
  readonly classification = EVIDENCE_ENGINE_CLASSIFICATION;
  readonly contractVersion = EVIDENCE_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: EvidencePipeline;
  private validator: EvidenceValidator;
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.pipeline = new EvidencePipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new EvidenceValidator();
    this.errorReporter = new RuntimeErrorReporter(this.name, this.auditPipeline, this.recoveryPipeline);
  }

  async start(): Promise<void> {
    if (this.state === "RUNNING") return;

    this.subscribeToPatternEvents();

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

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<EvidenceEvaluationResult> {
    if (this.state !== "RUNNING") {
      throw new Error(`EvidenceEngine is not running. Current state: ${this.state}`);
    }

    const request = this.validator.validateEvidenceInput(input);
    const observations = this.extractObservations(input);
    const pattern = this.extractPattern(input);

    const evidence = await this.pipeline.evaluate(request, observations, pattern);
    return {
      evaluated: true,
      score: evidence.score,
      confidence: evidence.confidence,
      supportingWeight: this.pipeline.scoring.computeSupportWeight(evidence),
      contradictingWeight: this.pipeline.scoring.computeContradictionWeight(evidence),
      qualityProfile: evidence.qualityProfile,
      recommendations: this.pipeline.scoring.evaluate(evidence, observations).recommendations,
    };
  }

  getPipeline(): EvidencePipeline {
    return this.pipeline;
  }

  getMetrics(): ReturnType<EvidencePipeline["getMetrics"]> {
    return this.pipeline.getMetrics();
  }

  private subscribeToPatternEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe(PatternEventNames.SUPPORTED_ESTABLISHED, async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch (err) {
        await this.errorReporter.reportEngineError(PatternEventNames.SUPPORTED_ESTABLISHED, err);
      }
    });

    this.eventBus.subscribe(PatternEventNames.VALIDATED_CONFIRMED, async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch (err) {
        await this.errorReporter.reportEngineError(PatternEventNames.VALIDATED_CONFIRMED, err);
      }
    });
  }

  private extractObservations(input: Record<string, unknown>): ObservationDetail[] {
    const raw = ((input.entity as Record<string, unknown> | undefined)?.observations) ?? input.observations;
    if (!Array.isArray(raw)) return [];
    return raw.map((o: unknown) => {
      const obs = o as Record<string, unknown>;
      return {
        id: (obs.id as string) || "",
        category: (obs.category as string) || "OPERATIONAL",
        timestamp: (obs.timestamp as string) || new Date().toISOString(),
        sourceType: ((obs.source as Record<string, unknown>)?.type as string) || "SYSTEM_LOG",
        trustScore: ((obs.source as Record<string, unknown>)?.trustScore as number) || 0.5,
        confidence: (obs.confidence as number) || 0.5,
        payload: (obs.payload as Record<string, unknown>) || {},
      };
    });
  }

  private extractPattern(input: Record<string, unknown>): PatternDetail | undefined {
    const pattern = ((input.entity as Record<string, unknown> | undefined)?.pattern as Record<string, unknown> | undefined) ??
      (input.pattern as Record<string, unknown> | undefined);
    if (!pattern) return undefined;

    const identity = pattern.identity as Record<string, unknown> | undefined;
    return {
      id: (pattern.id as string) || "",
      name: (identity?.name as string) || "",
      category: (identity?.category as string) || "",
      stage: (pattern.stage as string) || "",
      confidence: (pattern.confidence as number) || 0,
      strength: (pattern.strength as number) || 0,
      supportCount: ((pattern.supportingObservations as string[])?.length) || 0,
      contradictCount: ((pattern.contradictingObservations as string[])?.length) || 0,
      observations: [...(pattern.originObservations as string[] || []), ...(pattern.supportingObservations as string[] || [])],
      sourceTypes: [],
    };
  }
}
