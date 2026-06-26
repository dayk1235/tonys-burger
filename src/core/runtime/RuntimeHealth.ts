import { EngineLifecycleState, HealthStatus, FailureRecord } from "./RuntimeTypes";
import { RuntimeClock } from "./RuntimeClock";
import { EngineRegistry } from "./EngineRegistry";
import { AuditPipelineImpl } from "./AuditPipeline";
import { RecoveryPipelineImpl } from "./RecoveryPipeline";

export class RuntimeHealth {
  private clock: RuntimeClock;

  constructor(clock: RuntimeClock) {
    this.clock = clock;
  }

  async check(
    registry: EngineRegistry,
    audit: AuditPipelineImpl,
    recovery: RecoveryPipelineImpl
  ): Promise<HealthStatus> {
    const engines = registry.getAll();
    const engineStates: Record<string, EngineLifecycleState> = {};
    const warnings: string[] = [];

    for (const engine of engines) {
      engineStates[engine.metadata.identity.name] = engine.state.current;

      if (engine.state.current === "FAILING") {
        warnings.push(
          `Engine "${engine.metadata.identity.name}" is in FAILING state`
        );
      }
      if (engine.metadata.healthScore < 0.5) {
        warnings.push(
          `Engine "${engine.metadata.identity.name}" health score is ${engine.metadata.healthScore}`
        );
      }
    }

    const outstandingFailures = await recovery.getOutstandingFailures();
    const failures: FailureRecord[] = outstandingFailures;

    const criticalCount = failures.filter((f) => f.severity === "CRITICAL").length;
    const warningCount = warnings.length;

    let status: HealthStatus["status"] = "HEALTHY";
    if (criticalCount > 0) {
      status = "CRITICAL";
    } else if (warningCount > 0 || failures.length > 0) {
      status = "DEGRADED";
    }

    return {
      status,
      engineStates,
      lastHealthCheck: this.clock.now(),
      failures,
      warnings,
    };
  }
}
