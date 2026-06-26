import test from "node:test";
import assert from "node:assert/strict";

import { Runtime } from "../Runtime";
import { RuntimeClock } from "../RuntimeClock";
import { EventBus } from "../EventBus";
import { ContextBusImpl } from "../ContextBus";
import { WorkingMemory } from "../WorkingMemory";
import { EngineRegistry } from "../EngineRegistry";
import { EngineStateMachine } from "../EngineState";
import { EngineManifest, EngineManifestDefinition } from "../EngineManifest";
import { AuditPipelineImpl } from "../AuditPipeline";
import { RecoveryPipelineImpl } from "../RecoveryPipeline";
import { RuntimeRegistryImpl } from "../RuntimeRegistry";
import { RuntimeSchedulerImpl } from "../RuntimeScheduler";
import { LifecycleTransitionError } from "../RuntimeErrors";

const TEST_MANIFEST: EngineManifestDefinition = {
  name: "test_engine",
  version: "1.0.0",
  classification: "Perception",
  pipelinePosition: "OBSERVATION",
  purpose: "Test engine for runtime integration tests",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

// ─── Helpers ──────────────────────────────────────────────

function makeMinimalEngine() {
  return {
    name: "test_engine",
    classification: "Perception",
    contractVersion: "1.0.0",
    start: async () => {},
    stop: async () => {},
    getState: () => "INITIALIZED" as const,
    receiveInput: async (input: Record<string, unknown>) => input,
  };
}

// ─── RuntimeClock ─────────────────────────────────────────

test("RuntimeClock — now() returns ISO string", () => {
  const clock = new RuntimeClock();
  const now = clock.now();
  assert.ok(typeof now === "string");
  assert.ok(now.includes("T"));
});

test("RuntimeClock — uptime increases", async () => {
  const clock = new RuntimeClock();
  const u1 = clock.uptimeMs();
  await new Promise((r) => setTimeout(r, 10));
  const u2 = clock.uptimeMs();
  assert.ok(u2 > u1);
});

test("RuntimeClock — pause/resume stops uptime", async () => {
  const clock = new RuntimeClock();
  clock.pause();
  await new Promise((r) => setTimeout(r, 20));
  assert.ok(clock.isPaused());
  clock.resume();
  assert.ok(!clock.isPaused());
});

// ─── EventBus ─────────────────────────────────────────────

test("EventBus — emit and subscribe", async () => {
  const clock = new RuntimeClock();
  const bus = new EventBus(clock);
  const results: string[] = [];

  await bus.subscribe("test:event", async (payload) => {
    results.push(payload.value as string);
  });

  await bus.emit("test:event", { value: "hello" });
  assert.equal(results.length, 1);
  assert.equal(results[0], "hello");
});

test("EventBus — priority ordering", async () => {
  const clock = new RuntimeClock();
  const bus = new EventBus(clock);
  const order: number[] = [];

  await bus.subscribe("test:pri", async () => { order.push(3); }, "LOW");
  await bus.subscribe("test:pri", async () => { order.push(1); }, "HIGH");
  await bus.subscribe("test:pri", async () => { order.push(2); }, "NORMAL");

  await bus.emit("test:pri", {});
  assert.deepEqual(order, [1, 2, 3]);
});

test("EventBus — dead letters on handler error", async () => {
  const clock = new RuntimeClock();
  const bus = new EventBus(clock);

  await bus.subscribe("test:fail", async () => {
    throw new Error("handler failure");
  });

  await bus.emit("test:fail", { data: 1 });
  assert.equal(bus.getDeadLetters().length, 1);
});

test("EventBus — history tracking", async () => {
  const clock = new RuntimeClock();
  const bus = new EventBus(clock, 5);

  for (let i = 0; i < 10; i++) {
    await bus.emit("test:h", { n: i });
  }

  assert.equal(bus.getHistory().length, 5);
});

test("EventBus — subscribe/unsubscribe", async () => {
  const clock = new RuntimeClock();
  const bus = new EventBus(clock);
  let count = 0;

  const handler = async () => { count++; };
  await bus.subscribe("test:u", handler);
  await bus.emit("test:u", {});
  assert.equal(count, 1);

  await bus.unsubscribe("test:u", handler);
  await bus.emit("test:u", {});
  assert.equal(count, 1);
});

test("EventBus — subscriber count", async () => {
  const clock = new RuntimeClock();
  const bus = new EventBus(clock);

  await bus.subscribe("a", async () => {});
  await bus.subscribe("a", async () => {});
  await bus.subscribe("b", async () => {});

  assert.equal(bus.subscriberCount("a"), 2);
  assert.equal(bus.subscriberCount(), 3);
});

// ─── ContextBus ───────────────────────────────────────────

test("ContextBus — set and get", async () => {
  const bus = new ContextBusImpl();
  await bus.set("key1", "value1");
  const val = await bus.get<string>("key1");
  assert.equal(val, "value1");
});

test("ContextBus — TTL expiration", async () => {
  const bus = new ContextBusImpl();
  await bus.set("ephemeral", "data", "test", 1);
  const before = await bus.get<string>("ephemeral");
  assert.equal(before, "data");
  await new Promise((r) => setTimeout(r, 5));
  const after = await bus.get<string>("ephemeral");
  assert.equal(after, undefined);
});

test("ContextBus — queryContext returns namespaced entries", async () => {
  const bus = new ContextBusImpl();
  await bus.set("biz_1:spatialZone", "kitchen");
  await bus.set("biz_1:servicePeriod", "lunch");
  await bus.set("biz_2:spatialZone", "bar");
  const ctx = await bus.queryContext("biz_1");
  assert.equal(ctx.spatialZone, "kitchen");
  assert.equal(ctx.servicePeriod, "lunch");
  assert.equal(ctx.isHoliday, false);
  assert.equal(ctx.season, "spring");
});

test("ContextBus — has and delete", async () => {
  const bus = new ContextBusImpl();
  await bus.set("k", "v");
  assert.ok(await bus.has("k"));
  await bus.delete("k");
  assert.ok(!(await bus.has("k")));
});

// ─── WorkingMemory ────────────────────────────────────────

test("WorkingMemory — store and retrieve", async () => {
  const wm = new WorkingMemory();
  const entry = await wm.store("src", "test", { foo: "bar" });
  const found = await wm.retrieve(entry.id);
  assert.ok(found);
  assert.equal(found!.payload.foo, "bar");
});

test("WorkingMemory — findByType", async () => {
  const wm = new WorkingMemory();
  await wm.store("s1", "type_a", { v: 1 });
  await wm.store("s1", "type_b", { v: 2 });
  await wm.store("s2", "type_a", { v: 3 });
  const results = await wm.findByType("type_a");
  assert.equal(results.length, 2);
});

test("WorkingMemory — findBySource", async () => {
  const wm = new WorkingMemory();
  await wm.store("source_1", "t", {});
  await wm.store("source_2", "t", {});
  await wm.store("source_1", "t2", {});
  const results = await wm.findBySource("source_1");
  assert.equal(results.length, 2);
});

test("WorkingMemory — delete", async () => {
  const wm = new WorkingMemory();
  const entry = await wm.store("s", "t", {});
  assert.ok(await wm.delete(entry.id));
  assert.ok(!(await wm.delete("nonexistent")));
});

test("WorkingMemory — eviction by count", async () => {
  const wm = new WorkingMemory(3);
  await wm.store("s", "t", { n: 1 });
  await wm.store("s", "t", { n: 2 });
  await wm.store("s", "t", { n: 3 });
  await wm.store("s", "t", { n: 4 });
  assert.equal(wm.count(), 3);
});

test("WorkingMemory — subscription", async () => {
  const wm = new WorkingMemory();
  const received: string[] = [];
  await wm.subscribe("event_type", async (entry) => {
    received.push(entry.type);
  });
  await wm.store("s", "event_type", {});
  await wm.store("s", "other", {});
  assert.equal(received.length, 1);
});

// ─── EngineManifest ───────────────────────────────────────

test("EngineManifest — validates manifest", () => {
  const manifest = new EngineManifest(TEST_MANIFEST);
  assert.equal(manifest.definition.name, "test_engine");
});

test("EngineManifest — rejects invalid semver", () => {
  assert.throws(() => {
    new EngineManifest({ ...TEST_MANIFEST, version: "bad" });
  });
});

test("EngineManifest — rejects missing name", () => {
  assert.throws(() => {
    new EngineManifest({ ...TEST_MANIFEST, name: "" });
  });
});

// ─── EngineStateMachine ───────────────────────────────────

test("EngineStateMachine — follows allowed transitions", () => {
  const sm = new EngineStateMachine("INITIALIZED");
  sm.transition("REGISTERED");
  assert.equal(sm.current, "REGISTERED");
  sm.transition("CONFIGURED");
  assert.equal(sm.current, "CONFIGURED");
});

test("EngineStateMachine — rejects invalid transition", () => {
  const sm = new EngineStateMachine("INITIALIZED");
  assert.throws(() => sm.transition("RUNNING"));
});

test("EngineStateMachine — canTransition guard", () => {
  const sm = new EngineStateMachine("INITIALIZED");
  assert.ok(sm.canTransition("REGISTERED"));
  assert.ok(!sm.canTransition("RUNNING"));
});

test("EngineStateMachine — terminal state", () => {
  const sm = new EngineStateMachine();
  sm.transition("REGISTERED");
  sm.transition("CONFIGURED");
  sm.transition("SHUTDOWN");
  assert.ok(sm.isTerminal());
});

// ─── EngineRegistry ───────────────────────────────────────

test("EngineRegistry — register and get", async () => {
  const reg = new EngineRegistry();
  const engine = makeMinimalEngine();
  await reg.register("engine_a", engine, TEST_MANIFEST);
  const found = reg.get("engine_a");
  assert.equal(found.metadata.identity.name, "engine_a");
  assert.equal(found.instance.name, "test_engine");
});

test("EngineRegistry — rejects duplicate", async () => {
  const reg = new EngineRegistry();
  const engine = makeMinimalEngine();
  await reg.register("dup", engine, TEST_MANIFEST);
  await assert.rejects(() => reg.register("dup", engine, TEST_MANIFEST));
});

test("EngineRegistry — throws on missing engine", () => {
  const reg = new EngineRegistry();
  assert.throws(() => reg.get("missing"));
});

test("EngineRegistry — count and unregister", async () => {
  const reg = new EngineRegistry();
  const engine = makeMinimalEngine();
  await reg.register("e1", engine, TEST_MANIFEST);
  assert.equal(reg.count(), 1);
  reg.unregister("e1");
  assert.equal(reg.count(), 0);
});

test("EngineRegistry — filter by state", async () => {
  const reg = new EngineRegistry();
  await reg.register("e1", makeMinimalEngine(), TEST_MANIFEST);
  await reg.register("e2", { ...makeMinimalEngine(), name: "e2" }, { ...TEST_MANIFEST, name: "e2" });
  const initialized = reg.getByState("INITIALIZED");
  assert.equal(initialized.length, 2);
});

// ─── AuditPipeline ────────────────────────────────────────

test("AuditPipeline — recordLog and getRecords", async () => {
  const clock = new RuntimeClock();
  const audit = new AuditPipelineImpl(clock);
  await audit.recordLog("engine_a", "test", { detail: "hello" });
  const records = audit.getRecords("engine_a");
  assert.equal(records.length, 1);
  assert.equal(records[0].action, "test");
});

test("AuditPipeline — recordStateChange", async () => {
  const clock = new RuntimeClock();
  const audit = new AuditPipelineImpl(clock);
  await audit.recordStateChange("e1", "INITIALIZED", "RUNNING");
  const changes = audit.getByType("STATE_CHANGE");
  assert.equal(changes.length, 1);
  assert.equal(changes[0].details.from, "INITIALIZED");
});

// ─── RecoveryPipeline ─────────────────────────────────────

test("RecoveryPipeline — register and recover failure", async () => {
  const clock = new RuntimeClock();
  const recovery = new RecoveryPipelineImpl(clock);
  const id = await recovery.registerFailure("e1", "TimeoutError", "timed out");
  assert.ok(id.startsWith("fail_"));

  const result = await recovery.initiateRecovery(id, async () => {});
  assert.ok(result);

  const outstanding = await recovery.getOutstandingFailures();
  assert.equal(outstanding.length, 0);
});

test("RecoveryPipeline — cascading audit", async () => {
  const clock = new RuntimeClock();
  const recovery = new RecoveryPipelineImpl(clock);
  await recovery.triggerCascadingAudit("obs_old", "obs_new");
  const history = await recovery.getRecoveryHistory("cascading_audit");
  assert.equal(history.length, 1);
});

// ─── RuntimeRegistry (contract) ──────────────────────────

test("RuntimeRegistryImpl — register and get engine", async () => {
  const reg = new RuntimeRegistryImpl(new EngineRegistry());
  const engine = makeMinimalEngine();
  await reg.registerEngine(engine);
  const retrieved = reg.getEngine("test_engine");
  assert.ok(retrieved);
  assert.equal(retrieved!.name, "test_engine");
});

test("RuntimeRegistryImpl — deregister engine", async () => {
  const reg = new RuntimeRegistryImpl(new EngineRegistry());
  await reg.registerEngine(makeMinimalEngine());
  assert.ok(reg.getEngine("test_engine"));
  await reg.deregisterEngine("test_engine");
  assert.equal(reg.getEngine("test_engine"), undefined);
});

// ─── RuntimeScheduler (contract) ──────────────────────────

test("RuntimeSchedulerImpl — schedule and cancel", async () => {
  const clock = new RuntimeClock();
  const scheduler = new RuntimeSchedulerImpl(clock);
  let count = 0;
  await scheduler.scheduleRecurring("job1", "* * * * *", async () => { count++; });
  await scheduler.cancelScheduled("job1");
  assert.equal(scheduler.jobCount(), 0);
});

// ─── Runtime ──────────────────────────────────────────────

test("Runtime — boot transitions through states", async () => {
  const runtime = new Runtime();
  await runtime.boot();
  assert.equal(runtime.getState(), "READY");
});

test("Runtime — boot then start", async () => {
  const runtime = new Runtime();
  await runtime.start();
  assert.equal(runtime.getState(), "OPERATING");
});

test("Runtime — full lifecycle: boot → start → shutdown", async () => {
  const runtime = new Runtime();
  await runtime.boot();
  assert.equal(runtime.getState(), "READY");
  await runtime.start();
  assert.equal(runtime.getState(), "OPERATING");
  await runtime.shutdown();
  assert.equal(runtime.getState(), "HALTED");
});

test("Runtime — start automatically boots if not booted", async () => {
  const runtime = new Runtime();
  await runtime.start();
  assert.equal(runtime.getState(), "OPERATING");
});

test("Runtime — snapshot returns metrics", async () => {
  const runtime = new Runtime();
  await runtime.start();
  const snap = runtime.snapshot();
  assert.equal(snap.state, "OPERATING");
  assert.equal(typeof snap.uptimeMs, "number");
});

test("Runtime — healthCheck returns status", async () => {
  const runtime = new Runtime();
  await runtime.start();
  const status = await runtime.healthCheck();
  assert.equal(status.status, "HEALTHY");
});

test("Runtime — register engine and query via runtimeRegistry", async () => {
  const runtime = new Runtime();
  await runtime.registerEngine("integration_test", makeMinimalEngine(), TEST_MANIFEST);
  await runtime.boot();
  await runtime.start();

  const engines = await runtime.runtimeRegistry.listEngines();
  assert.ok(engines.includes("integration_test"));

  const running = await runtime.runtimeRegistry.isEngineRunning("integration_test");
  assert.ok(!running);

  const state = await runtime.runtimeRegistry.getEngineState("integration_test");
  assert.equal(state, "INITIALIZED");
});
