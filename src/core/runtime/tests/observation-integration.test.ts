import test from "node:test";
import assert from "node:assert/strict";
import { Runtime } from "../Runtime";
import { ObservationEngine } from "../../engines/observation/ObservationEngine";
import { ObservationCategory } from "../../engines/observation/ObservationTypes";
import { EngineManifestDefinition } from "../EngineManifest";

const OBSERVATION_MANIFEST: EngineManifestDefinition = {
  name: "observation_engine",
  version: "1.0.0",
  classification: "Perception",
  pipelinePosition: "OBSERVATION",
  purpose: "Captures, validates, and stores observations from restaurant operations",
  dependencies: [],
  resourceProfile: { memoryMB: 128, maxLatencyMs: 200, requiredStorageMB: 50 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

test("Runtime — integrates with ObservationEngine full lifecycle", async () => {
  const runtime = new Runtime();

  await runtime.boot();
  assert.equal(runtime.getState(), "READY");

  const engine = new ObservationEngine(runtime.eventBus, runtime.auditPipeline, runtime.recoveryPipeline, runtime.contextBus);
  await runtime.registerEngine("observation_engine", engine, OBSERVATION_MANIFEST);

  await runtime.start();
  assert.equal(runtime.getState(), "OPERATING");

  assert.equal(runtime.engineRegistry.count(), 1);

  const engineEntry = runtime.engineRegistry.get("observation_engine");
  assert.equal(engineEntry.state.current, "INITIALIZED");

  // Start the engine
  await engine.start();
  runtime.engineRegistry.updateState("observation_engine", "RUNNING");
  assert.equal(engine.getState(), "RUNNING");

  // ── Feed a variety of restaurant observations ──

  const saleObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.FINANCIAL,
    source: { id: "pos_1", name: "POS Main Terminal", type: "POS", trustScore: 0.98 },
    payload: { amount: 48.50, item: "Double Truffle Burger Combo", orderId: "ord_101" },
  });
  assert.ok(saleObs.id);
  assert.equal(saleObs.category, ObservationCategory.FINANCIAL);

  const invObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.INVENTORY,
    source: { id: "smart_fridge_1", name: "Kitchen Smart Fridge", type: "IOT_SENSOR", trustScore: 0.90 },
    payload: { itemSku: "sku-patty-beef", level: 120, quantityChange: -10 },
  });
  assert.equal(invObs.category, ObservationCategory.INVENTORY);

  const empObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.EMPLOYEE,
    source: { id: "clock_in_terminal", name: "Staff Biometric Clock", type: "IOT_SENSOR", trustScore: 0.99 },
    payload: { employeeId: "emp_tony_01", action: "clock_in", scheduleTime: "11:00:00" },
  });
  assert.equal(empObs.category, ObservationCategory.EMPLOYEE);

  const metrics = engine.getMetrics();
  assert.equal(metrics.ingestedCount, 3);
  assert.equal(metrics.verifiedCount, 3);
  assert.equal(metrics.qualityFailedCount, 0);

  // ── Verify runtime infrastructure is operational ──

  const snap = runtime.snapshot();
  assert.equal(snap.activeEngineCount, 1);
  assert.equal(snap.totalEngineCount, 1);

  const health = await runtime.healthCheck();
  assert.equal(health.status, "HEALTHY");

  const auditRecords = runtime.auditPipeline.getRecords("ObservationEngine");
  assert.ok(auditRecords.length >= 1);

  // ── Stop the engine ──

  await engine.stop();
  assert.equal(engine.getState(), "STOPPED");

  await runtime.shutdown();
  assert.equal(runtime.getState(), "HALTED");
});

test("Runtime — ObservationEngine emits lifecycle events", async () => {
  const runtime = new Runtime();
  const events: string[] = [];

  await runtime.eventBus.subscribe("engine:state-change", async (payload) => {
    events.push(`${payload.engine}:${payload.to}`);
  });

  const engine = new ObservationEngine(runtime.eventBus, runtime.auditPipeline, runtime.recoveryPipeline, runtime.contextBus);
  await runtime.registerEngine("obs", engine, OBSERVATION_MANIFEST);
  await runtime.start();

  runtime.engineRegistry.updateState("obs", "RUNNING");
  runtime.engineRegistry.updateState("obs", "RUNNING");

  await engine.stop();
  runtime.engineRegistry.updateState("obs", "SHUTDOWN");

  await runtime.shutdown();
});
