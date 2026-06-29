import { RuntimeConfiguration } from "./RuntimeConfiguration";
import { RuntimeClock } from "./RuntimeClock";
import { RuntimeLifecycle } from "./RuntimeLifecycle";
import { EventBus } from "./EventBus";
import { ContextBusImpl } from "./ContextBus";
import { WorkingMemory } from "./WorkingMemory";
import { EngineRegistry } from "./EngineRegistry";
import { EngineLoader } from "./EngineLoader";
import { RuntimeRegistryImpl } from "./RuntimeRegistry";
import { AuditPipelineImpl } from "./AuditPipeline";
import { RecoveryPipelineImpl } from "./RecoveryPipeline";
import { RuntimeSchedulerImpl } from "./RuntimeScheduler";
import { RuntimeMetrics } from "./RuntimeMetrics";
import { RuntimeHealth } from "./RuntimeHealth";
import { RuntimeState } from "./RuntimeTypes";
import { CognitiveEngine } from "../engines/observation/ObservationContracts";
import { EngineManifestDefinition } from "./EngineManifest";
import type { CanonicalOrderEvent, RuntimeReceiveResult } from "./CanonicalOrderEvent";
import { ObservationCategory, type Observation } from "../engines/observation/ObservationTypes";
import { EngineNotFoundError, EngineNotRunningError } from "./RuntimeErrors";
import { RUNTIME_EVENTS } from "./RuntimeEvents";

export class Runtime {
  readonly config: RuntimeConfiguration;
  readonly clock: RuntimeClock;
  readonly lifecycle: RuntimeLifecycle;
  readonly eventBus: EventBus;
  readonly contextBus: ContextBusImpl;
  readonly workingMemory: WorkingMemory;
  readonly engineRegistry: EngineRegistry;
  readonly engineLoader: EngineLoader;
  readonly runtimeRegistry: RuntimeRegistryImpl;
  readonly auditPipeline: AuditPipelineImpl;
  readonly recoveryPipeline: RecoveryPipelineImpl;
  readonly scheduler: RuntimeSchedulerImpl;
  readonly metrics: RuntimeMetrics;
  readonly health: RuntimeHealth;

  constructor(configOverrides?: Partial<RuntimeConfiguration["getAll"]>) {
    this.config = new RuntimeConfiguration(configOverrides);
    this.clock = new RuntimeClock();
    this.lifecycle = new RuntimeLifecycle();
    this.eventBus = new EventBus(
      this.clock,
      this.config.get("eventHistoryLimit"),
      () => this.metrics.incrementDelivered()
    );
    this.engineRegistry = new EngineRegistry();
    this.engineLoader = new EngineLoader(this.engineRegistry);
    this.runtimeRegistry = new RuntimeRegistryImpl(this.engineRegistry);
    this.auditPipeline = new AuditPipelineImpl(this.clock, this.config.get("auditRetentionMs"));
    this.recoveryPipeline = new RecoveryPipelineImpl(this.clock);
    this.contextBus = new ContextBusImpl(this.auditPipeline);
    this.workingMemory = new WorkingMemory(
      this.config.get("maxWorkingMemoryItems"),
      this.config.get("workingMemoryTTLMs"),
      this.auditPipeline
    );
    this.scheduler = new RuntimeSchedulerImpl(this.clock, this.auditPipeline);
    this.metrics = new RuntimeMetrics(this.clock);
    this.health = new RuntimeHealth(this.clock);
  }

  async boot(): Promise<void> {
    this.requireState("BOOTING");
    this.lifecycle.transition("INITIALIZING");

    this.requireState("INITIALIZING");
    this.lifecycle.transition("DISCOVERING");

    this.requireState("DISCOVERING");
    this.lifecycle.transition("RESOLVING");

    this.requireState("RESOLVING");
    this.lifecycle.transition("READY");
  }

  async start(): Promise<void> {
    if (this.lifecycle.isBooting()) {
      await this.boot();
    }

    this.requireState("READY");

    await this.scheduler.start();
    this.metrics.incrementPublished();
    this.lifecycle.transition("OPERATING");

    await this.eventBus.emit(RUNTIME_EVENTS.RUNTIME_STARTED, {
      entity: { runtime: { state: this.lifecycle.current, engines: this.engineRegistry.count() } },
      operation: "START",
      state: this.lifecycle.current,
      engines: this.engineRegistry.count(),
      timestamp: new Date().toISOString(),
      version: 1,
    });
  }

  async shutdown(): Promise<void> {
    this.requireOperating();

    await this.scheduler.stop();
    this.lifecycle.transition("SHUTTING_DOWN");

    await this.eventBus.emit(RUNTIME_EVENTS.RUNTIME_SHUTTING_DOWN, {
      entity: { runtime: { finalState: this.lifecycle.current } },
      operation: "SHUTDOWN",
      finalState: this.lifecycle.current,
      timestamp: new Date().toISOString(),
      version: 1,
    });

    this.lifecycle.transition("HALTED");
  }

  getState(): RuntimeState {
    return this.lifecycle.current;
  }

  snapshot(): ReturnType<RuntimeMetrics["snapshot"]> {
    return this.metrics.snapshot(
      this.lifecycle.current,
      this.engineRegistry,
      this.eventBus,
      this.auditPipeline,
      this.recoveryPipeline
    );
  }

  async healthCheck(): Promise<ReturnType<RuntimeHealth["check"]>> {
    return this.health.check(this.engineRegistry, this.auditPipeline, this.recoveryPipeline);
  }

  registerEngine(
    name: string,
    instance: CognitiveEngine,
    manifestDef: EngineManifestDefinition
  ): Promise<void> {
    return this.engineLoader.loadFromInstance(name, instance, manifestDef);
  }

  /**
   * Public ingress for Canonical Order Events.
   * Routes a validated canonical event to ObservationEngine exactly once per call.
   */
  async receive(event: CanonicalOrderEvent): Promise<RuntimeReceiveResult> {
    this.requireOperating();

    const observationEngine = this.runtimeRegistry.getEngine("ObservationEngine");
    if (!observationEngine) {
      throw new EngineNotFoundError("ObservationEngine");
    }

    const engineEntry = this.engineRegistry.get("ObservationEngine");
    const engineState = engineEntry.instance.getState();
    if (engineState !== "RUNNING") {
      throw new EngineNotRunningError("ObservationEngine", engineState);
    }

    await this.auditPipeline.recordLog("Runtime", "canonical_order_received", {
      orderId: event.orderId,
      requestId: event.requestId,
      channel: event.channel.type,
      source: event.source.provider,
    });

    const observation = (await observationEngine.receiveInput(
      this.toObservationInput(event)
    )) as Observation;

    this.metrics.incrementPublished();

    await this.eventBus.emit(RUNTIME_EVENTS.RUNTIME_ORDER_RECEIVED, {
      entity: { order: { orderId: event.orderId, requestId: event.requestId, observationId: observation.id, channel: event.channel.type } },
      operation: "RECEIVE",
      orderId: event.orderId,
      requestId: event.requestId,
      observationId: observation.id,
      channel: event.channel.type,
      timestamp: new Date().toISOString(),
      version: 1,
    });

    return {
      orderId: event.orderId,
      observationId: observation.id,
      requestId: event.requestId,
    };
  }

  private toObservationInput(event: CanonicalOrderEvent): Record<string, unknown> {
    return {
      source: {
        id: event.source.provider,
        name: event.channel.name,
        type: "SYSTEM_LOG",
        trustScore: 0.9,
      },
      category: ObservationCategory.CUSTOMER,
      businessId: event.restaurant.id,
      restaurantId: event.restaurant.id,
      timestamp: event.timestamps.orderedAt,
      payload: {
        orderId: event.orderId,
        requestId: event.requestId,
        version: event.version,
        status: event.status,
        type: event.type,
        items: event.items,
        customer: event.customer,
        pricing: event.pricing,
        payment: event.payment,
        delivery: event.delivery,
        restaurant: event.restaurant,
        channel: event.channel,
        source: event.source,
        timestamps: event.timestamps,
        analytics: event.analytics,
        metadata: event.metadata,
      },
    };
  }

  private requireState(expected: RuntimeState): void {
    if (this.lifecycle.current !== expected) {
      throw new Error(
        `Runtime must be in "${expected}" state, currently "${this.lifecycle.current}"`
      );
    }
  }

  private requireOperating(): void {
    if (!this.lifecycle.isOperating() && !this.lifecycle.isDegraded()) {
      throw new Error(
        `Runtime must be operating or degraded, currently "${this.lifecycle.current}"`
      );
    }
  }
}
