import { RuntimeMetricsSnapshot, RuntimeState } from "./RuntimeTypes";
import { RuntimeClock } from "./RuntimeClock";
import { EngineRegistry } from "./EngineRegistry";
import { EventBus } from "./EventBus";
import { AuditPipelineImpl } from "./AuditPipeline";
import { RecoveryPipelineImpl } from "./RecoveryPipeline";

export class RuntimeMetrics {
  private eventPublishCount = 0;
  private eventDeliveredCount = 0;
  private clock: RuntimeClock;

  constructor(clock: RuntimeClock) {
    this.clock = clock;
  }

  incrementPublished(): void {
    this.eventPublishCount++;
  }

  incrementDelivered(): void {
    this.eventDeliveredCount++;
  }

  snapshot(
    state: RuntimeState,
    registry: EngineRegistry,
    eventBus: EventBus,
    audit: AuditPipelineImpl,
    recovery: RecoveryPipelineImpl
  ): RuntimeMetricsSnapshot {
    const allEngines = registry.getAll();

    return {
      activeEngineCount: allEngines.filter((e) => {
        const s = e.metadata.state;
        return s === "RUNNING" || s === "ACTIVATED" || s === "IDLE";
      }).length,
      totalEngineCount: allEngines.length,
      eventsPublished: this.eventPublishCount,
      eventsDelivered: this.eventDeliveredCount,
      deadLetterCount: eventBus.getDeadLetters().length,
      memoryUsageMB: process.memoryUsage ? Math.round(process.memoryUsage().heapUsed / 1024 / 1024) : 0,
      auditRecordCount: audit.count(),
      failureCount: recovery.count(),
      recoveryCount: recovery.count() - recovery.countUnrecovered(),
      uptimeMs: this.clock.uptimeMs(),
      state,
    };
  }
}
