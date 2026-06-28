import {
  CognitiveEngine,
  EngineState,
  RuntimeEventBus,
  AuditPipeline,
  RecoveryPipeline,
} from "../observation/ObservationContracts";

import {
  PATTERN_ENGINE_NAME,
  PATTERN_ENGINE_CLASSIFICATION,
  PATTERN_ENGINE_CONTRACT_VERSION,
  ObservationRef,
  Pattern,
} from "./PatternTypes";

import { PatternPipeline } from "./PatternPipeline";
import { PatternEventNames } from "./PatternEvents";
import { ObservationEventNames } from "../observation/ObservationEvents";
import { DEFAULT_PATTERN_DEFINITIONS } from "./PatternDefinitions";

type InternalEngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

export class PatternEngine implements CognitiveEngine {
  readonly name = PATTERN_ENGINE_NAME;
  readonly classification = PATTERN_ENGINE_CLASSIFICATION;
  readonly contractVersion = PATTERN_ENGINE_CONTRACT_VERSION;

  private state: InternalEngineState = "INITIALIZED";
  private pipeline: PatternPipeline;
  private processingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.pipeline = new PatternPipeline(this.eventBus, this.auditPipeline, this.recoveryPipeline);
  }

  async start(): Promise<void> {
    if (this.state === "RUNNING") return;

    this.registerDefaultDefinitions();
    this.subscribeToObservations();

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

    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(this.name, "RUNNING", "STOPPED");
    }
  }

  getState(): EngineState {
    return this.state;
  }

  async receiveInput(input: Record<string, unknown>, _options?: Record<string, unknown>): Promise<Pattern[]> {
    if (this.state !== "RUNNING") {
      throw new Error(`PatternEngine is not running. Current state: ${this.state}`);
    }

    const observation = this.toObservationRef(input);
    return this.pipeline.processObservation(observation);
  }

  getPipeline(): PatternPipeline {
    return this.pipeline;
  }

  getMetrics(): PatternEngineMetricsSnapshot {
    const snapshot = this.pipeline.metrics.getSnapshot();
    return {
      totalPatternsDetected: snapshot.totalPatternsDetected,
      activePatternCount: snapshot.activePatternCount,
      patternDiscoveryRate: snapshot.patternDiscoveryRate,
      falsePositiveRate: snapshot.falsePositiveRate,
      averageConfidence: snapshot.averageConfidence,
      patternsByCategory: snapshot.patternsByCategory,
      patternsByStage: snapshot.patternsByStage,
      trendsDetected: snapshot.trendsDetected,
      anomaliesDetected: snapshot.anomaliesDetected,
      correlationsFound: snapshot.correlationsFound,
      sequencesDiscovered: snapshot.sequencesDiscovered,
      contradictionsResolved: snapshot.contradictionsResolved,
    };
  }

  private registerDefaultDefinitions(): void {
    for (const def of DEFAULT_PATTERN_DEFINITIONS) {
      this.pipeline.registerDefinition(def);
    }
  }

  private subscribeToObservations(): void {
    if (!this.eventBus) return;

    this.eventBus.subscribe(ObservationEventNames.HISTORICAL_COMMITTED, async (payload) => {
      try {
        const p = payload as Record<string, unknown>;
        const observation = (p.entity ?? p.observation) as Record<string, unknown> | undefined;
        let data: Record<string, unknown>;

        if (observation) {
          data = {
            id: observation.id,
            category: observation.category,
            timestamp: observation.timestamp,
            businessId: observation.businessId,
            source: observation.source,
            payload: observation.payload,
            stage: observation.stage,
          };
        } else {
          const flatData = p.data as Record<string, unknown> | undefined;
          if (!flatData) return;
          data = {
            id: p.observationId,
            category: flatData.category,
            timestamp: flatData.timestamp,
            source: { id: flatData.sourceId },
            payload: flatData.payload,
            stage: p.stage,
          };
        }

        const ref = this.toObservationRef(data);
        await this.pipeline.processObservation(ref);
      } catch {
        // silently handle subscription errors
      }
    });
  }

  private toObservationRef(input: Record<string, unknown>): ObservationRef {
    const source = (input.source as Record<string, unknown>) || {};
    const payload = (input.payload as Record<string, unknown>) || {};
    return {
      id: (input.id as string) || `obs_${Date.now()}`,
      category: (input.category as string) || "OPERATIONAL",
      timestamp: (input.timestamp as string) || new Date().toISOString(),
      businessId: (input.businessId as string) || "default",
      sourceType: (source.type as string) || "SYSTEM_LOG",
      trustScore: (source.trustScore as number) || 0.5,
      payload,
      stage: (input.stage as string) || "HISTORICAL",
    };
  }
}

export interface PatternEngineMetricsSnapshot {
  readonly totalPatternsDetected: number;
  readonly activePatternCount: number;
  readonly patternDiscoveryRate: number;
  readonly falsePositiveRate: number;
  readonly averageConfidence: number;
  readonly patternsByCategory: Record<string, number>;
  readonly patternsByStage: Record<string, number>;
  readonly trendsDetected: number;
  readonly anomaliesDetected: number;
  readonly correlationsFound: number;
  readonly sequencesDiscovered: number;
  readonly contradictionsResolved: number;
}
