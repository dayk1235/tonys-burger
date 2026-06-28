/**
 * VS0-007 — Pattern Frequency Detection.
 *
 * Demonstrates that PatternEngine detects a FREQUENCY pattern from multiple
 * observations generated through the full pipeline:
 *
 *   POST /api/orders
 *   → Runtime.receive()
 *   → ObservationEngine
 *   → ObservationPipeline
 *   → EventBus
 *   → PatternEngine
 *
 * PatternEngine must detect "repeated_event" (FREQUENCY) with >= 3 observations
 * within the 1-hour time window.
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
  purpose: "VS0-007 frequency detection test",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const PATTERN_MANIFEST: EngineManifestDefinition = {
  name: "PatternEngine",
  version: "1.0.0",
  classification: "Understanding",
  pipelinePosition: "PATTERN",
  purpose: "VS0-007 frequency detection test",
  dependencies: [{ engineName: "ObservationEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

function buildOrderEvent(timestamp: string, index: number): CanonicalOrderEvent {
  return {
    orderId: `ord-freq-${index}-${randomUUID().slice(0, 8)}`,
    requestId: `req-freq-${index}`,
    version: "1.0.0",
    status: "CONFIRMED",
    type: "TAKEOUT",
    customer: {
      name: `Cliente ${index}`,
      phone: "+52 55 1111 0000",
    },
    items: [
      {
        id: `item-${index}`,
        name: `Item ${index}`,
        quantity: 1,
        unitPrice: 50,
        totalPrice: 50,
      },
    ],
    pricing: {
      subtotal: 50,
      discountTotal: 0,
      taxTotal: 9,
      deliveryFee: 0,
      grandTotal: 59,
      currency: "MXN",
    },
    payment: {
      method: "CASH",
      status: "PENDING",
      amount: 59,
    },
    delivery: {
      type: "TAKEOUT",
    },
    restaurant: {
      id: "tonys-burger",
      name: "Tony's Burger",
    },
    channel: {
      type: "WEBSITE",
      name: "Orden en línea",
    },
    source: {
      provider: "orders-api",
      applicationId: "restaurant-os-orders-api",
      environment: "TEST",
    },
    timestamps: {
      orderedAt: timestamp,
      ingestedAt: new Date().toISOString(),
    },
    analytics: {
      sourceLocale: "es-MX",
      convertedAt: new Date().toISOString(),
      adapterVersion: "test-v1.0.0",
      processingTimeMs: 0,
      dayOfWeek: "Saturday",
      hourOfDay: 14,
      servicePeriod: "lunch",
      season: "summer",
      isHoliday: false,
    },
  };
}

test("VS0-007 — PatternEngine detects FREQUENCY pattern from full pipeline", async () => {
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

  await runtime.registerEngine("ObservationEngine", observationEngine, OBSERVATION_MANIFEST);
  await runtime.registerEngine("PatternEngine", patternEngine, PATTERN_MANIFEST);

  await observationEngine.start();
  runtime.engineRegistry.updateState("ObservationEngine", "RUNNING");

  // PatternEngine.start() registers default definitions (FREQUENCY, POSITIVE_TREND, NEGATIVE_TREND)
  // and subscribes to observation.lifecycle.historical_committed via EventBus
  await patternEngine.start();
  runtime.engineRegistry.updateState("PatternEngine", "RUNNING");

  await runtime.start();

  // Generate 3 observations 2 minutes apart, all in the past
  const baseTime = Date.now() - 600000; // 10 minutes ago (safely in the past)
  const numOrders = 3;
  const results: Array<{ orderId: string; observationId: string }> = [];

  for (let i = 0; i < numOrders; i++) {
    const timestamp = new Date(baseTime + i * 120000).toISOString(); // 2 min apart
    const event = buildOrderEvent(timestamp, i);
    const result = await runtime.receive(event);
    results.push(result);
  }

  // Allow EventBus handlers to settle
  await new Promise((r) => setTimeout(r, 50));

  // ── Verification ──────────────────────────────────────────────────

  // 1. All 3 observations were created
  const obsPipeline = observationEngine.getPipeline();
  for (const result of results) {
    const obs = obsPipeline.getObservationById(result.observationId);
    assert.ok(obs, `Observation ${result.observationId} must exist`);
    assert.equal(obs.stage, "HISTORICAL");
  }

  // 2. PatternEngine received all 3 observations
  const patPipeline = patternEngine.getPipeline();
  const patternObservations = patPipeline.getRecentObservations();
  assert.equal(patternObservations.length, numOrders,
    `PatternEngine must have received ${numOrders} observations`);

  // 3. PatternEngine detected a FREQUENCY pattern
  const allPatterns = await patPipeline.getAllPatterns();
  const freqPatterns = allPatterns.filter(
    (p) => p.identity.category === "REPEATED_EVENT"
  );

  assert.ok(freqPatterns.length > 0,
    "PatternEngine must detect at least one FREQUENCY (REPEATED_EVENT) pattern");

  const freqPattern = freqPatterns[0];
  assert.equal(freqPattern.identity.name, "repeated_event");
  assert.ok(freqPattern.confidence >= 0.5,
    `FREQUENCY pattern confidence (${freqPattern.confidence}) must be >= 0.5`);

  // 4. Evidence contains the observation IDs from the cluster
  const obsIds = results.map((r) => r.observationId);
  for (const obsId of obsIds) {
    assert.ok(
      freqPattern.originObservations.includes(obsId) ||
      freqPattern.evidence.some((e) => e.observationId === obsId),
      `Observation ${obsId} must appear in pattern evidence`
    );
  }

  // 5. No spurious patterns: sequence patterns may also fire (repeated category pairs
  // within the time window), but trend/correlation/anomaly require more observations
  const spuriousPatterns = allPatterns.filter(
    (p) => !["REPEATED_EVENT", "SEQUENCE"].includes(p.identity.category)
  );
  assert.equal(spuriousPatterns.length, 0,
    `No spurious patterns expected — found ${spuriousPatterns.length}: ${
      spuriousPatterns.map(p => p.identity.category).join(", ")
    }`);

  console.log("\n===== VS0-007 FREQUENCY DETECTION REPORT =====");
  console.log(`Orders sent: ${numOrders}`);
  console.log(`PatternEngine received: ${patternObservations.length} observations`);
  console.log(`Patterns found: ${allPatterns.length}`);
  console.log(`FREQUENCY patterns: ${freqPatterns.length}`);
  console.log(`Pattern name: ${freqPattern?.identity?.name || "N/A"}`);
  console.log(`Pattern confidence: ${freqPattern?.confidence?.toFixed(4) || "N/A"}`);
  console.log(`Pattern stage: ${freqPattern?.stage || "N/A"}`);
  console.log(`Evidence count: ${freqPattern?.evidence?.length || 0}`);
  console.log("=============================================\n");

  await runtime.shutdown();
});
