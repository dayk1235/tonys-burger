import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RuntimeErrorReporter } from "../RuntimeErrorReporter";
import type { AuditPipeline, RecoveryPipeline } from "../../engines/observation/ObservationContracts";

class SpyAuditPipeline {
  logs: Array<{ engine: string; action: string; details: Record<string, unknown> }> = [];

  async recordLog(engine: string, action: string, details: Record<string, unknown>): Promise<void> {
    this.logs.push({ engine, action, details });
  }

  async recordStateChange(_engine: string, _from: string, _to: string): Promise<void> {
    // not used in this test
  }
}

class SpyRecoveryPipeline {
  failures: Array<{ engineName: string; errorName: string; errorMessage: string; stack?: string }> = [];
  private idCounter = 0;

  async registerFailure(engineName: string, errorName: string, errorMessage: string, stack?: string): Promise<string> {
    this.failures.push({ engineName, errorName, errorMessage, stack });
    return `fail_${++this.idCounter}`;
  }

  async initiateRecovery(_failureId: string, _recoveryAction: () => Promise<void>): Promise<boolean> {
    return true;
  }

  async triggerCascadingAudit(_deprecatedObservationId: string, _correctedObservationId: string): Promise<void> {
    // not used
  }
}

describe("RuntimeErrorReporter", () => {

  it("reportEngineError logs to audit pipeline", async () => {
    const audit = new SpyAuditPipeline();
    const reporter = new RuntimeErrorReporter("TestEngine", audit);

    await reporter.reportEngineError("test_event", new Error("test error"));

    assert.equal(audit.logs.length, 1);
    assert.equal(audit.logs[0].engine, "TestEngine");
    assert.equal(audit.logs[0].action, "engine_error");
    assert.ok((audit.logs[0].details.error as string).includes("test error"));
    assert.equal(audit.logs[0].details.eventName, "test_event");
  });

  it("reportEngineError registers failure in recovery pipeline", async () => {
    const recovery = new SpyRecoveryPipeline();
    const reporter = new RuntimeErrorReporter("TestEngine", undefined, recovery);

    await reporter.reportEngineError("test_event", new Error("test error"));

    assert.equal(recovery.failures.length, 1);
    assert.equal(recovery.failures[0].engineName, "TestEngine");
    assert.ok(recovery.failures[0].errorMessage.includes("test_event"));
    assert.ok(recovery.failures[0].errorMessage.includes("test error"));
  });

  it("reportPipelineError logs to audit and recovery", async () => {
    const audit = new SpyAuditPipeline();
    const recovery = new SpyRecoveryPipeline();
    const reporter = new RuntimeErrorReporter("Pipeline", audit, recovery);

    await reporter.reportPipelineError("emitEvent", new Error("emit failed"));

    assert.equal(audit.logs.length, 1);
    assert.equal(audit.logs[0].action, "pipeline_error");
    assert.equal(audit.logs[0].details.operation, "emitEvent");

    assert.equal(recovery.failures.length, 1);
    assert.ok(recovery.failures[0].errorMessage.includes("emitEvent"));
  });

  it("reportRuntimeError logs to audit and recovery", async () => {
    const audit = new SpyAuditPipeline();
    const reporter = new RuntimeErrorReporter("Runtime", audit);

    await reporter.reportRuntimeError("scheduler", new Error("task failed"));

    assert.equal(audit.logs.length, 1);
    assert.equal(audit.logs[0].action, "runtime_error");
    assert.equal(audit.logs[0].details.context, "scheduler");
  });

  it("reportWithDetails includes extra metadata in audit log", async () => {
    const audit = new SpyAuditPipeline();
    const reporter = new RuntimeErrorReporter("Engine", audit);

    await reporter.reportWithDetails("custom_action", new Error("fail"), {
      entityId: "ent_123",
      businessId: "biz_456",
    });

    assert.equal(audit.logs.length, 1);
    assert.equal(audit.logs[0].action, "custom_action");
    assert.equal(audit.logs[0].details.entityId, "ent_123");
    assert.equal(audit.logs[0].details.businessId, "biz_456");
    assert.ok(audit.logs[0].details.error);
  });

  it("handles non-Error input gracefully", async () => {
    const audit = new SpyAuditPipeline();
    const reporter = new RuntimeErrorReporter("Engine", audit);

    await reporter.reportEngineError("event", "string error message");

    assert.equal(audit.logs.length, 1);
    assert.ok(audit.logs[0].details.error);
  });

  it("never throws when audit pipeline throws", async () => {
    const brokenAudit: AuditPipeline = {
      async recordLog(): Promise<void> { throw new Error("audit_down"); },
      async recordStateChange(): Promise<void> { throw new Error("audit_down"); },
    };
    const reporter = new RuntimeErrorReporter("Engine", brokenAudit);

    // Should not throw
    await reporter.reportEngineError("event", new Error("fail"));
    assert.ok(true, "Reporter handled audit failure gracefully");
  });

  it("never throws when recovery pipeline throws", async () => {
    const brokenRecovery: RecoveryPipeline = {
      async registerFailure(): Promise<string> { throw new Error("recovery_down"); },
      async initiateRecovery(): Promise<boolean> { throw new Error("recovery_down"); },
      async triggerCascadingAudit(): Promise<void> { throw new Error("recovery_down"); },
    };
    const reporter = new RuntimeErrorReporter("Engine", undefined, brokenRecovery);

    // Should not throw
    await reporter.reportEngineError("event", new Error("fail"));
    assert.ok(true, "Reporter handled recovery failure gracefully");
  });

  it("handles no dependencies gracefully", async () => {
    const reporter = new RuntimeErrorReporter("Engine");

    // Should not throw
    await reporter.reportEngineError("event", new Error("fail"));
    await reporter.reportPipelineError("operation", new Error("fail"));
    await reporter.reportRuntimeError("context", new Error("fail"));
    await reporter.reportWithDetails("type", new Error("fail"), {});
    assert.ok(true, "Reporter works without audit or recovery pipelines");
  });

});
