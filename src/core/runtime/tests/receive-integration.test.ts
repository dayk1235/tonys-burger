import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { Runtime } from "../Runtime";
import { ObservationEngine } from "../../engines/observation/ObservationEngine";
import { ObservationCategory } from "../../engines/observation/ObservationTypes";
import type { CanonicalOrderEvent } from "../CanonicalOrderEvent";
import { EngineManifestDefinition } from "../EngineManifest";

const OBSERVATION_MANIFEST: EngineManifestDefinition = {
  name: "ObservationEngine",
  version: "1.0.0",
  classification: "Perception",
  pipelinePosition: "OBSERVATION",
  purpose: "Perception engine that ingests raw environmental stimulus and produces verified observations.",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

function makeCanonicalOrderEvent(): CanonicalOrderEvent {
  const orderedAt = new Date().toISOString();
  const ingestedAt = new Date().toISOString();

  return {
    orderId: `ord-test-${randomUUID()}`,
    version: "1.0.0",
    status: "PENDING",
    type: "TAKEOUT",
    customer: {
      name: "Carlos Mendoza",
      phone: "+52 55 1234 5678",
    },
    items: [
      {
        id: "smash-double",
        name: "Smash Double",
        quantity: 2,
        unitPrice: 0,
        totalPrice: 0,
      },
    ],
    pricing: {
      subtotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      deliveryFee: 0,
      grandTotal: 0,
      currency: "MXN",
    },
    payment: {
      method: "CASH",
      status: "PENDING",
      amount: 0,
    },
    delivery: {
      type: "TAKEOUT",
    },
    restaurant: {
      id: "tonys-burger",
      name: "Tony's Burger",
    },
    channel: {
      type: "API",
      name: "Orders API",
    },
    source: {
      provider: "orders-api",
      applicationId: "restaurant-os-orders-api",
      environment: "PRODUCTION",
    },
    timestamps: {
      orderedAt,
      ingestedAt,
    },
    analytics: {
      sourceLocale: "es-MX",
      convertedAt: ingestedAt,
      adapterVersion: "orders-api-v1.0.0",
      processingTimeMs: 0,
      dayOfWeek: "Saturday",
      hourOfDay: 14,
      servicePeriod: "lunch",
      season: "summer",
      isHoliday: false,
    },
  };
}

test("Runtime.receive — forwards one canonical event to ObservationEngine", async () => {
  const runtime = new Runtime();
  const engine = new ObservationEngine(
    runtime.eventBus,
    runtime.auditPipeline,
    runtime.recoveryPipeline,
    runtime.contextBus,
  );

  await runtime.registerEngine("ObservationEngine", engine, OBSERVATION_MANIFEST);
  await engine.start();
  runtime.engineRegistry.updateState("ObservationEngine", "RUNNING");
  await runtime.start();

  const beforeMetrics = engine.getMetrics();
  const result = await runtime.receive(makeCanonicalOrderEvent());
  const afterMetrics = engine.getMetrics();

  assert.ok(result.orderId.startsWith("ord-test-"));
  assert.ok(result.observationId);
  assert.equal(afterMetrics.ingestedCount, beforeMetrics.ingestedCount + 1);
  assert.equal(afterMetrics.verifiedCount, beforeMetrics.verifiedCount + 1);

  const auditRecords = runtime.auditPipeline.getRecords("Runtime");
  const receiveLogs = auditRecords.filter((record) => record.action === "canonical_order_received");
  assert.equal(receiveLogs.length, 1);
  assert.equal(receiveLogs[0].details.orderId, result.orderId);

  await runtime.shutdown();
});

test("Runtime.receive — each call produces exactly one observation", async () => {
  const runtime = new Runtime();
  const engine = new ObservationEngine(
    runtime.eventBus,
    runtime.auditPipeline,
    runtime.recoveryPipeline,
    runtime.contextBus,
  );

  await runtime.registerEngine("ObservationEngine", engine, OBSERVATION_MANIFEST);
  await engine.start();
  runtime.engineRegistry.updateState("ObservationEngine", "RUNNING");
  await runtime.start();

  const first = await runtime.receive(makeCanonicalOrderEvent());
  const second = await runtime.receive(makeCanonicalOrderEvent());

  assert.notEqual(first.observationId, second.observationId);
  assert.equal(engine.getMetrics().ingestedCount, 2);
  assert.equal(engine.getMetrics().verifiedCount, 2);

  await runtime.shutdown();
});

test("Runtime.receive — observation contains order data and is retrievable from pipeline", async () => {
  const runtime = new Runtime();
  const engine = new ObservationEngine(
    runtime.eventBus,
    runtime.auditPipeline,
    runtime.recoveryPipeline,
    runtime.contextBus,
  );

  await runtime.registerEngine("ObservationEngine", engine, OBSERVATION_MANIFEST);
  await engine.start();
  runtime.engineRegistry.updateState("ObservationEngine", "RUNNING");
  await runtime.start();

  const result = await runtime.receive(makeCanonicalOrderEvent());

  const pipeline = engine.getPipeline();
  const observation = pipeline.getObservationById(result.observationId);

  assert.ok(observation, "Observation must exist in pipeline store");
  assert.equal(observation.id, result.observationId);
  assert.equal(observation.stage, "HISTORICAL");
  assert.equal(observation.category, ObservationCategory.CUSTOMER);
  assert.equal(observation.payload.orderId, result.orderId);
  assert.ok(observation.payload.items);
  assert.ok(observation.payload.customer);

  await runtime.shutdown();
});