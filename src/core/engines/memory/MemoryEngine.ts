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
import { MEMORY_EVENTS } from "./MemoryEvents";
import { ObservationEventNames } from "../observation/ObservationEvents";
import { PatternEventNames } from "../pattern/PatternEvents";
import { EVIDENCE_EVENTS } from "../evidence/EvidenceEvents";
import { RUNTIME_EVENTS } from "../../runtime/RuntimeEvents";
import { RuntimeErrorReporter } from "../../runtime/RuntimeErrorReporter";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class MemoryEngine implements CognitiveEngine {
  readonly name = MEMORY_ENGINE_NAME;
  readonly classification = MEMORY_ENGINE_CLASSIFICATION;
  readonly contractVersion = MEMORY_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: MemoryPipeline;
  private validator: MemoryValidator;
  private cycleInterval: ReturnType<typeof setInterval> | null = null;
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.pipeline = new MemoryPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
    this.validator = new MemoryValidator();
    this.errorReporter = new RuntimeErrorReporter(this.name, this.auditPipeline, this.recoveryPipeline);
  }

  async start(): Promise<void> {
    if (this.state === "RUNNING") return;

    this.subscribeToEvidenceEvents();
    this.subscribeToObservationEvents();
    this.subscribeToPatternEvents();

    this.cycleInterval = setInterval(async () => {
      try {
        await this.pipeline.processCycle();
      } catch (error) {
        await this.errorReporter.reportWithDetails("process_cycle", error, {});
      }
    }, 60000);

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

    this.eventBus.subscribe(EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED, async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch (error) {
        const p = payload as Record<string, unknown> | undefined;
        const ev = p?.evidence as Record<string, unknown> | undefined;
        await this.errorReporter.reportWithDetails("receive_evidence", error, {
          event: EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED,
          entityId: (ev?.id as string) || undefined,
          businessId: (p?.businessId as string) || undefined,
        });
      }
    });

    this.eventBus.subscribe(EVIDENCE_EVENTS.EVALUATION_COMPLETED, async (payload) => {
      try {
        await this.receiveInput(payload as unknown as Record<string, unknown>);
      } catch (error) {
        const p = payload as Record<string, unknown> | undefined;
        const ev = p?.evidence as Record<string, unknown> | undefined;
        await this.errorReporter.reportWithDetails("receive_evidence", error, {
          event: EVIDENCE_EVENTS.EVALUATION_COMPLETED,
          entityId: (ev?.id as string) || undefined,
          businessId: (p?.businessId as string) || undefined,
        });
      }
    });
  }

  /**
   * Subscribes to Observation lifecycle events (historically committed).
   * Each confirmed observation creates a memory entry.
   */
  private subscribeToObservationEvents(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe(ObservationEventNames.HISTORICAL_COMMITTED, async (payload) => {
      try {
        const p = payload as Record<string, unknown>;
        const observation = (p.entity ?? p.observation) as Record<string, unknown> | undefined;

        if (observation) {
          const identity = (observation.identity as Record<string, unknown>) || {};
          await this.receiveInput({
            evidence: {
              id: observation.id,
              identity: {
                patternId: identity.id || "observation-auto",
                patternName: identity.name || String(observation.category || "Unknown"),
              },
              provenance: {
                sourceObservations: [observation.id],
              },
              description: `Observation: ${identity.name || observation.category} (${observation.id})`,
              score: (observation.importance as number) || 0.5,
              confidence: ((observation.confidence as Record<string, unknown>)?.score as number) || 0.5,
            },
            businessId: observation.businessId,
          } as unknown as Record<string, unknown>);
        } else {
          const entity = (p.entity as Record<string, unknown> | undefined) ?? (p.data as Record<string, unknown>) ?? {};
          const eventPayload = (entity.payload as Record<string, unknown>) ?? (p.payload as Record<string, unknown>) ?? {};
          const observationId = p.observationId as string;
          const businessId = (eventPayload.businessId as string) ?? (entity.businessId as string) ?? "";
          await this.receiveInput({
            evidence: {
              id: observationId,
              identity: {
                patternId: "observation-auto",
                patternName: String(eventPayload.type || "Unknown"),
              },
              provenance: {
                sourceObservations: [observationId],
              },
              description: `Observation: ${eventPayload.type} (${observationId})`,
              score: 0.5,
              confidence: 0.5,
            },
            businessId,
          } as unknown as Record<string, unknown>);
        }
      } catch (error) {
        const p = payload as Record<string, unknown> | undefined;
        const obs = (p?.entity ?? p?.observation) as Record<string, unknown> | undefined;
        await this.errorReporter.reportWithDetails("receive_observation", error, {
          event: ObservationEventNames.HISTORICAL_COMMITTED,
          entityId: (obs?.id as string) || (p?.observationId as string) || undefined,
          businessId: (obs?.businessId as string) || undefined,
        });
      }
    });
  }

  private subscribeToPatternEvents(): void {
    if (!this.eventBus) return;

    const events = [
      PatternEventNames.EMERGING_CONFIRMED,
      PatternEventNames.SUPPORTED_ESTABLISHED,
      PatternEventNames.VALIDATED_CONFIRMED,
      PatternEventNames.STRENGTHENING_OBSERVED,
      PatternEventNames.TREND_DETECTED,
      PatternEventNames.CORRELATION_FOUND,
      PatternEventNames.ANOMALY_DETECTED,
      PatternEventNames.SEQUENCE_DISCOVERED,
    ];

    for (const eventName of events) {
      this.eventBus.subscribe(eventName, async (payload) => {
        try {
          const p = payload as Record<string, unknown>;
          const pattern = ((p.entity as Record<string, unknown> | undefined)?.pattern as Record<string, unknown> | undefined) ??
            (p.pattern as Record<string, unknown> | undefined);

          if (pattern) {
            const identity = (pattern.identity as Record<string, unknown>) || {};
            const businessId = ((identity as Record<string, unknown>).businessId as string) ?? "";
            await this.receiveInput({
              evidence: {
                id: pattern.id as string,
                identity: {
                  patternId: pattern.id as string,
                  patternName: identity.name as string || eventName,
                },
                provenance: { sourceObservations: [...((pattern.originObservations as string[]) || [])] },
                description: `Pattern: ${identity.name || pattern.id} at stage ${pattern.stage}`,
                score: (pattern.strength as number) || 0.5,
                confidence: (pattern.confidence as number) || 0.5,
              },
              businessId,
              description: `Memory from pattern ${pattern.id}`,
            } as unknown as Record<string, unknown>);
          } else {
            const entity = (p.entity as Record<string, unknown> | undefined) ?? (p.payload as Record<string, unknown>) ?? {};
            const patternId = (entity.patternId as string) || "";
            const stage = (entity.stage as string) || "";
            if (!patternId) return;
            const data = (entity.data as Record<string, unknown>) || {};
            const businessId = (data.businessId as string) ?? (entity.businessId as string) ?? "";
            await this.receiveInput({
              evidence: {
                id: patternId,
                identity: { patternId, patternName: eventName },
                provenance: { sourceObservations: [patternId] },
                description: `Pattern: ${eventName} at stage ${stage}`,
                score: (data.strength as number) || 0.5,
                confidence: (data.confidence as number) || 0.5,
              },
              businessId,
              description: `Memory from pattern ${patternId}`,
            } as unknown as Record<string, unknown>);
          }
        } catch (error) {
          const pl = payload as Record<string, unknown> | undefined;
          const pat = (pl?.entity as Record<string, unknown> | undefined)?.pattern as Record<string, unknown> | undefined ?? pl?.pattern as Record<string, unknown> | undefined;
          const ent = (pl?.entity as Record<string, unknown> | undefined) ?? (pl?.payload as Record<string, unknown> | undefined) ?? {};
          await this.errorReporter.reportWithDetails("process_pattern_event", error, {
            event: eventName,
            entityId: (pat?.id as string) || (ent?.patternId as string) || undefined,
            businessId: (pat?.identity as Record<string, unknown> | undefined)?.businessId as string | undefined ?? (ent?.data as Record<string, unknown> | undefined)?.businessId as string | undefined ?? undefined,
          });
        }
      });
    }
  }
}
