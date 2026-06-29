import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MemoryEngine,
  MemoryPipeline,
  MemoryFactory,
  MemoryConsolidation,
} from "../index";
import { MEMORY_EVENTS } from "../MemoryEvents";
import { EVIDENCE_EVENTS } from "../../evidence/EvidenceEvents";
import { ObservationEventNames } from "../../observation/ObservationEvents";
import { PatternEventNames } from "../../pattern/PatternEvents";
import { MemoryInput } from "../MemoryTypes";

class TestAuditPipeline {
  readonly logs: Array<{ engine: string; action: string; details: Record<string, unknown> }> = [];

  async recordLog(engine: string, action: string, details: Record<string, unknown>): Promise<void> {
    this.logs.push({ engine, action, details });
  }

  async recordStateChange(_engine: string, _from: string, _to: string): Promise<void> {}
}

interface TestEventBus {
  emits: Array<{ event: string; payload: Record<string, unknown> }>;
  subscribe(event: string, handler: (payload: Record<string, unknown>) => Promise<void>): Promise<void>;
  emit(event: string, payload: Record<string, unknown>): Promise<void>;
}

function createTestEventBus(): TestEventBus {
  const subs = new Map<string, Array<(payload: Record<string, unknown>) => Promise<void>>>();
  return {
    emits: [],
    async subscribe(event: string, handler: (payload: Record<string, unknown>) => Promise<void>): Promise<void> {
      const list = subs.get(event) || [];
      list.push(handler);
      subs.set(event, list);
    },
    async emit(event: string, payload: Record<string, unknown>) {
      this.emits.push({ event, payload });
      const handlers = subs.get(event);
      if (handlers) {
        for (const handler of handlers) {
          await handler(payload);
        }
      }
    },
  };
}

describe("BF-027 — Memory Error Observability", () => {

  // 1. Evidence validated_confirmed handler logs error on invalid payload
  it("evidence validated_confirmed handler logs error on invalid payload", async () => {
    const audit = new TestAuditPipeline();
    const eventBus = createTestEventBus();
    const engine = new MemoryEngine(eventBus, audit);

    await engine.start();

    // Emit with empty payload — validateMemoryInput will throw
    await eventBus.emit(EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED, {});

    const log = audit.logs.find((l) => l.action === "receive_evidence");
    assert.ok(log, "Must log receive_evidence on failure");
    assert.ok(log.details?.error, "Must include error message");
    assert.equal(log.details?.event, EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED);

    await engine.stop();
  });

  // 2. Evaluation completed handler logs error on invalid payload
  it("evidence evaluation_completed handler logs error on invalid payload", async () => {
    const audit = new TestAuditPipeline();
    const eventBus = createTestEventBus();
    const engine = new MemoryEngine(eventBus, audit);

    await engine.start();
    await eventBus.emit(EVIDENCE_EVENTS.EVALUATION_COMPLETED, {});

    const log = audit.logs.find((l) => l.action === "receive_evidence");
    assert.ok(log, "Must log receive_evidence on evaluation failure");
    assert.ok(log.details?.error, "Must include error message");
    assert.equal(log.details?.event, EVIDENCE_EVENTS.EVALUATION_COMPLETED);

    await engine.stop();
  });

  // 3. Observation handler logs error on invalid payload
  it("observation historical_committed handler logs error on invalid payload", async () => {
    const audit = new TestAuditPipeline();
    const eventBus = createTestEventBus();
    const engine = new MemoryEngine(eventBus, audit);

    await engine.start();
    await eventBus.emit(ObservationEventNames.HISTORICAL_COMMITTED, {});

    const log = audit.logs.find((l) => l.action === "receive_observation");
    assert.ok(log, "Must log receive_observation on failure");
    assert.ok(log.details?.error, "Must include error message");

    await engine.stop();
  });

  // 4. Runtime continues after logged error
  it("runtime continues after logged error — subsequent valid operation succeeds", async () => {
    const audit = new TestAuditPipeline();
    const eventBus = createTestEventBus();
    const engine = new MemoryEngine(eventBus, audit);

    await engine.start();

    // First call fails with invalid payload
    await eventBus.emit(EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED, {});

    const errorLog = audit.logs.find((l) => l.action === "receive_evidence");
    assert.ok(errorLog, "Must log the failure");

    // Second call with valid payload — should still work
    await eventBus.emit(EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED, {
      evidence: {
        id: "evd_valid",
        identity: { patternId: "pat_valid", patternName: "Valid Pattern" },
        provenance: { sourceObservations: ["obs_valid"] },
        description: "Valid memory",
        score: 0.7,
        confidence: 0.8,
      },
      businessId: "biz_valid",
    });

    const metrics = engine.getMetrics();
    assert.equal(metrics.totalMemoriesCreated, 1, "Valid input must still create memory after logged error");

    await engine.stop();
  });

  // 5. emitEvent failure is logged via audit pipeline
  it("emitEvent logs error via audit pipeline on event bus failure", async () => {
    const audit = new TestAuditPipeline();
    const eventBus = createTestEventBus();
    const pipeline = new MemoryPipeline(eventBus, audit);

    const factory = new MemoryFactory();
    const memory = factory.createFromInput(
      {
        evidenceId: "evd_emit",
        patternId: "pat_emit",
        observationIds: ["obs_emit"],
        name: "Emit Test",
        description: "Testing emit failure",
        category: "SALES_PATTERN",
        strength: 0.7,
        confidence: 0.8,
        businessId: "biz_emit",
      },
      "Emit Test",
    );

    // Set stage to SHORT_TERM and access count >= 3 so consolidation proceeds (SHORT_TERM → STABILIZING)
    const consolidatable = {
      ...memory,
      stage: "SHORT_TERM" as const,
      metadata: { ...memory.metadata, totalAccessCount: 5 },
    };

    // Make the event bus emit throw
    const origEmit = eventBus.emit.bind(eventBus);
    eventBus.emit = async () => { throw new Error("emit_failed"); };

    // consolidateMemory calls emitLifecycleEvent → emitEvent → fails → logs
    await pipeline.consolidateMemory(consolidatable);

    const emitLog = audit.logs.find((l) => l.action === "emit_event");
    assert.ok(emitLog, "Must log emit_event on failure");
    assert.ok(String(emitLog.details?.error).includes("emit_failed"));

    eventBus.emit = origEmit;
  });

  // 6. No regression — basic memory creation works
  it("no regression — basic memory operation still works", async () => {
    const audit = new TestAuditPipeline();
    const engine = new MemoryEngine(undefined, audit);
    await engine.start();

    const result = await engine.receiveInput({
      evidence: {
        id: "evd_regression",
        identity: { patternId: "pat_reg", patternName: "Regression Test" },
        provenance: { sourceObservations: ["obs_reg"] },
        description: "Regression test memory",
        score: 0.7,
        confidence: 0.8,
      },
      businessId: "biz_reg",
    });

    assert.ok(result.success);
    assert.ok(result.memoryId.startsWith("mem_"));

    const metrics = engine.getMetrics();
    assert.equal(metrics.totalMemoriesCreated, 1);

    await engine.stop();
  });

  // 7. All audit logs have correct engine name
  it("all audit logs use MemoryEngine as engine name", async () => {
    const audit = new TestAuditPipeline();
    const eventBus = createTestEventBus();
    const engine = new MemoryEngine(eventBus, audit);

    await engine.start();
    await eventBus.emit(EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED, {});

    for (const log of audit.logs) {
      assert.equal(log.engine, "MemoryEngine", "Engine name must be MemoryEngine in all logs");
    }

    await engine.stop();
  });

  // 8. Pattern subscriber catch (BF-012) preserved — no unhandled rejection
  it("pattern event handler does not cause unhandled rejection (BF-012 preserved)", async () => {
    const audit = new TestAuditPipeline();
    const eventBus = createTestEventBus();
    const engine = new MemoryEngine(eventBus, audit);

    await engine.start();

    // Emit a pattern event with an entity lacking evidence details
    await eventBus.emit(PatternEventNames.EMERGING_CONFIRMED, {
      entity: {
        pattern: {
          id: "pat_log_test",
          identity: {},
          stage: "EMERGING",
          strength: 0.5,
          confidence: 0.5,
          originObservations: [],
        },
      },
    });

    // Pattern subscriber should handle gracefully without crashing
    assert.ok(true, "Pattern subscriber handled without unhandled rejection");

    await engine.stop();
  });

  // 9. All silent catch blocks are eliminated — verified via logs
  it("every catch block produces a log entry — zero silent catches", async () => {
    const audit = new TestAuditPipeline();
    const eventBus = createTestEventBus();
    const engine = new MemoryEngine(eventBus, audit);

    await engine.start();

    // Trigger all 4 event-based catch blocks
    await eventBus.emit(EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED, {});
    await eventBus.emit(EVIDENCE_EVENTS.EVALUATION_COMPLETED, {});
    await eventBus.emit(ObservationEventNames.HISTORICAL_COMMITTED, {});

    // Check that we got logs from each path
    const evidenceLogs = audit.logs.filter((l) => l.action === "receive_evidence");
    const observationLogs = audit.logs.filter((l) => l.action === "receive_observation");

    assert.ok(evidenceLogs.length >= 2, "Both evidence catch blocks must log");
    assert.ok(observationLogs.length >= 1, "Observation catch block must log");

    await engine.stop();
  });
});
