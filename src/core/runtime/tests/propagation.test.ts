/**
 * VS0-006 — First Cognitive Event Propagation.
 *
 * Demonstrates that an observation generated from a real order:
 *   POST /api/orders → Runtime.receive() → ObservationEngine
 *     → ObservationPipeline → EventBus → PatternEngine
 *
 * is propagated correctly to the first cognitive consumer (PatternEngine)
 * without loss of the CanonicalOrderEvent v1.0.0 contract.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Runtime } from "../Runtime";
import { ObservationEngine } from "../../engines/observation/ObservationEngine";
import { PatternEngine } from "../../engines/pattern/PatternEngine";
import { ObservationCategory } from "../../engines/observation/ObservationTypes";
import type { CanonicalOrderEvent } from "../CanonicalOrderEvent";
import { EngineManifestDefinition } from "../EngineManifest";

const OBSERVATION_MANIFEST: EngineManifestDefinition = {
  name: "ObservationEngine",
  version: "1.0.0",
  classification: "Perception",
  pipelinePosition: "OBSERVATION",
  purpose: "VS0-006 propagation test",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const PATTERN_MANIFEST: EngineManifestDefinition = {
  name: "PatternEngine",
  version: "1.0.0",
  classification: "Understanding",
  pipelinePosition: "PATTERN",
  purpose: "VS0-006 propagation test",
  dependencies: [{ engineName: "ObservationEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

function buildFullEvent(): CanonicalOrderEvent {
  const orderedAt = new Date().toISOString();
  const ingestedAt = new Date().toISOString();

  return {
    orderId: `ord-prop-${randomUUID()}`,
    requestId: `req-${randomUUID()}`,
    version: "1.0.0",
    status: "PENDING",
    type: "DELIVERY",
    customer: {
      id: "cust-001",
      name: "Ana López",
      phone: "+52 55 9876 5432",
      email: "ana@example.com",
      isVip: true,
      visitCount: 42,
      notes: "Prefiere sin cebolla",
    },
    items: [
      {
        id: "smash-double",
        name: "Smash Double",
        quantity: 2,
        unitPrice: 89.00,
        totalPrice: 178.00,
        category: "hamburguesas",
        specialInstructions: "Sin cebolla",
      },
    ],
    pricing: {
      subtotal: 178.00,
      discountTotal: 0,
      taxTotal: 32.04,
      deliveryFee: 25.00,
      serviceFee: 5.00,
      tip: 20.00,
      grandTotal: 260.04,
      currency: "MXN",
    },
    payment: {
      method: "CREDIT_CARD",
      status: "AUTHORIZED",
      transactionId: "txn-prop-123",
      amount: 260.04,
      change: 0,
    },
    delivery: {
      type: "DELIVERY",
      provider: "Rappi",
      estimatedMinutes: 35,
    },
    restaurant: {
      id: "tonys-burger",
      name: "Tony's Burger",
      branchId: "sucursal-condesa",
    },
    channel: {
      type: "DELIVERY_APP",
      name: "Rappi",
      version: "4.32.1",
    },
    source: {
      provider: "rappi",
      applicationId: "rappi-integration-v2",
      applicationVersion: "2.1.0",
      environment: "PRODUCTION",
    },
    timestamps: {
      orderedAt,
      ingestedAt,
    },
    analytics: {
      sourceLocale: "es-MX",
      convertedAt: ingestedAt,
      adapterVersion: "rappi-v1.0.0",
      processingTimeMs: 142,
      dayOfWeek: "Saturday",
      hourOfDay: 20,
      servicePeriod: "dinner",
      season: "summer",
      isHoliday: false,
      tags: ["promo-junio", "nuevo-cliente"],
    },
    metadata: {
      internalNotes: "Cliente frecuente de Rappi",
      campaignSource: "instagram_ads",
      priority: "high",
    },
  };
}

test("VS0-006 — observation propagates from Runtime through EventBus to PatternEngine", async () => {
  const runtime = new Runtime();

  const observationEngine = new ObservationEngine(
    runtime.eventBus,
    runtime.auditPipeline,
    runtime.recoveryPipeline,
    runtime.contextBus,
  );

  const patternEngine = new PatternEngine(
    runtime.eventBus,
    runtime.auditPipeline,
    runtime.recoveryPipeline,
  );

  // Register and start engines
  await runtime.registerEngine("ObservationEngine", observationEngine, OBSERVATION_MANIFEST);
  await runtime.registerEngine("PatternEngine", patternEngine, PATTERN_MANIFEST);

  await observationEngine.start();
  runtime.engineRegistry.updateState("ObservationEngine", "RUNNING");

  await patternEngine.start();
  runtime.engineRegistry.updateState("PatternEngine", "RUNNING");

  await runtime.start();

  // Subscribe to EventBus in test to capture the emitted event
  let capturedEventPayload: Record<string, unknown> | undefined;
  await runtime.eventBus.subscribe("observation.lifecycle.historical_committed", async (payload) => {
    capturedEventPayload = payload as Record<string, unknown>;
  });

  // Send a canonical order event (simulates POST /api/orders)
  const original = buildFullEvent();
  const result = await runtime.receive(original);

  // ── Step 1: Observation exists in pipeline ──────────────────────────
  const obsPipeline = observationEngine.getPipeline();
  const observation = obsPipeline.getObservationById(result.observationId);
  assert.ok(observation, "Observation must exist in ObservationEngine pipeline");
  assert.equal(observation.stage, "HISTORICAL");

  // ── Step 2: EventBus received the event ─────────────────────────────
  assert.ok(capturedEventPayload, "EventBus must have captured observation.lifecycle.historical_committed");
  const eventEntity = capturedEventPayload.entity as Record<string, unknown> | undefined;
  const eventObservation = capturedEventPayload.observation as Record<string, unknown> | undefined;
  assert.ok(eventEntity, "EventBus payload must contain entity (canonical key)");
  assert.ok(eventObservation, "EventBus payload must contain observation (legacy key)");

  // ── Step 3: PatternEngine received the observation ──────────────────
  const patPipeline = patternEngine.getPipeline();
  const patternObservations = patPipeline.getRecentObservations();
  assert.equal(patternObservations.length, 1, "PatternEngine must have received exactly 1 observation");

  const patternRef = patternObservations[0];
  assert.equal(patternRef.id, result.observationId, "PatternEngine observation ID must match");

  // ── Step 4: Full 16-field contract is intact at PatternEngine ───────
  const pePayload = patternRef.payload as Record<string, unknown>;
  const issues: string[] = [];
  const preserved: string[] = [];

  const check = (name: string, expected: unknown, actual: unknown) => {
    try {
      assert.deepEqual(actual, expected);
      preserved.push(name);
    } catch {
      issues.push(`${name}: mismatch`);
    }
  };

  check("orderId", original.orderId, pePayload.orderId);
  check("requestId", original.requestId, pePayload.requestId);
  check("version", original.version, pePayload.version);
  check("status", original.status, pePayload.status);
  check("type", original.type, pePayload.type);
  check("items", original.items, pePayload.items);
  check("customer", original.customer, pePayload.customer);
  check("pricing", original.pricing, pePayload.pricing);
  check("payment", original.payment, pePayload.payment);
  check("delivery", original.delivery, pePayload.delivery);
  check("restaurant", original.restaurant, pePayload.restaurant);
  check("channel", original.channel, pePayload.channel);
  check("source", original.source, pePayload.source);
  check("timestamps", original.timestamps, pePayload.timestamps);
  check("analytics", original.analytics, pePayload.analytics);
  check("metadata", original.metadata, pePayload.metadata);

  // Check for synthetic fields
  const payloadKeys = Object.keys(pePayload).sort();
  const contractFields = ["orderId","requestId","version","status","type","items","customer","pricing","payment","delivery","restaurant","channel","source","timestamps","analytics","metadata"];
  const extraKeys = payloadKeys.filter(k => !contractFields.includes(k));
  if (extraKeys.length > 0) {
    issues.push(`extra fields in PatternEngine payload: ${extraKeys.join(", ")}`);
  }

  console.log("\n===== VS0-006 PROPAGATION REPORT =====");
  console.log(`Flow: POST → Runtime → Observation → EventBus → PatternEngine`);
  console.log(`Observation ID: ${result.observationId}`);
  console.log(`PatternEngine received: ${patternObservations.length} observation(s)`);
  console.log(`Fields preserved at PatternEngine: ${preserved.length}/16`);
  if (issues.length > 0) {
    console.log(`Issues:`);
    issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
  }
  console.log("======================================\n");

  assert.equal(issues.length, 0, `Propagation FAILED — ${issues.length} issue(s)`);
  assert.equal(preserved.length, 16, `Must preserve all 16 fields, got ${preserved.length}`);

  await runtime.shutdown();
});
