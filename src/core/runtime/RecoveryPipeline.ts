import { RecoveryPipeline } from "../engines/observation/ObservationContracts";
import { FailureRecord, RecoveryStrategy } from "./RuntimeTypes";
import { RuntimeClock } from "./RuntimeClock";

export class RecoveryPipelineImpl implements RecoveryPipeline {
  private failures: FailureRecord[] = [];
  private recoveryStrategies: Map<string, RecoveryStrategy> = new Map();
  private failureIdCounter = 0;
  private clock: RuntimeClock;

  constructor(clock: RuntimeClock) {
    this.clock = clock;
  }

  async registerFailure(
    engineName: string,
    errorName: string,
    errorMessage: string,
    stack?: string
  ): Promise<string> {
    const id = `fail_${++this.failureIdCounter}`;
    const record: FailureRecord = {
      id,
      engineName,
      errorName,
      errorMessage,
      timestamp: this.clock.now(),
      severity: "MAJOR",
      recovered: false,
      recoveryStrategy: this.recoveryStrategies.get(engineName),
    };

    this.failures.push(record);
    return id;
  }

  async initiateRecovery(
    failureId: string,
    recoveryAction: () => Promise<void>
  ): Promise<boolean> {
    const failure = this.failures.find((f) => f.id === failureId);
    if (!failure) return false;

    try {
      await recoveryAction();
      failure.recovered = true;
      return true;
    } catch {
      return false;
    }
  }

  async triggerCascadingAudit(
    deprecatedObservationId: string,
    correctedObservationId: string
  ): Promise<void> {
    const id = `fail_${++this.failureIdCounter}`;
    this.failures.push({
      id,
      engineName: "cascading_audit",
      errorName: "ObservationCorrection",
      errorMessage: `Observation ${deprecatedObservationId} corrected by ${correctedObservationId}`,
      timestamp: this.clock.now(),
      severity: "WARNING",
      recovered: true,
      recoveryStrategy: "RESTART",
    });
  }

  async getRecoveryHistory(engine: string): Promise<FailureRecord[]> {
    return this.failures.filter((f) => f.engineName === engine);
  }

  async getOutstandingFailures(): Promise<FailureRecord[]> {
    return this.failures.filter((f) => !f.recovered);
  }

  setRecoveryStrategy(engine: string, strategy: RecoveryStrategy): void {
    this.recoveryStrategies.set(engine, strategy);
  }

  count(): number {
    return this.failures.length;
  }

  countUnrecovered(): number {
    return this.failures.filter((f) => !f.recovered).length;
  }

  clear(): void {
    this.failures = [];
  }
}
