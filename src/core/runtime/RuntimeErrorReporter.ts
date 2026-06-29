import { AuditPipeline, RecoveryPipeline } from "../engines/observation/ObservationContracts";

export type ErrorSeverity = "CRITICAL" | "MAJOR" | "MINOR" | "WARNING";

export class RuntimeErrorReporter {
  constructor(
    private readonly engineName: string,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
  ) {}

  async reportEngineError(eventName: string, error: unknown): Promise<void> {
    const err = error instanceof Error ? error : new Error(String(error));

    await this.auditLog("engine_error", err, { eventName });
    await this.fail("EngineError", `[${eventName}] ${err.message}`, err.stack);
  }

  async reportPipelineError(operation: string, error: unknown): Promise<void> {
    const err = error instanceof Error ? error : new Error(String(error));

    await this.auditLog("pipeline_error", err, { operation });
    await this.fail("PipelineError", `[${operation}] ${err.message}`, err.stack);
  }

  async reportRuntimeError(context: string, error: unknown): Promise<void> {
    const err = error instanceof Error ? error : new Error(String(error));

    await this.auditLog("runtime_error", err, { context });
    await this.fail("RuntimeError", `[${context}] ${err.message}`, err.stack);
  }

  async reportWithDetails(type: string, error: unknown, details: Record<string, unknown>): Promise<void> {
    const err = error instanceof Error ? error : new Error(String(error));

    await this.auditLog(type, err, details);
    await this.fail("Error", err.message, err.stack);
  }

  private async auditLog(type: string, err: Error, extra: Record<string, unknown>): Promise<void> {
    if (!this.auditPipeline) return;
    try {
      await this.auditPipeline.recordLog(this.engineName, type, {
        ...extra,
        error: err.message,
        stack: err.stack ?? "",
        timestamp: new Date().toISOString(),
      });
    } catch {
      // reporter never throws
    }
  }

  private async fail(errorName: string, errorMessage: string, stack?: string): Promise<void> {
    if (!this.recoveryPipeline) return;
    try {
      await this.recoveryPipeline.registerFailure(this.engineName, errorName, errorMessage, stack);
    } catch {
      // reporter never throws
    }
  }
}
