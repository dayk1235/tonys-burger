/**
 * VS0-005 — Observation Contract Compliance Certification.
 *
 * Certifies that the Observation produced by ObservationEngine via Runtime.receive()
 * faithfully preserves the CanonicalOrderEvent v1.0.0 without loss, mutation, or
 * alteration of information.
 *
 * FROZEN CONTRACT: src/core/runtime/CanonicalOrderEvent.ts
 * MAPPING FUNCTION: Runtime.toObservationInput()
 */

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
  purpose: "VS0-005 certification",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

/**
 * Build a CanonicalOrderEvent with every field populated (including all optional
 * sub-fields) to detect any data loss or mutation downstream.
 */
function buildFullEvent(overrides?: Partial<CanonicalOrderEvent>): CanonicalOrderEvent {
  const orderedAt = new Date().toISOString();
  const ingestedAt = new Date().toISOString();

  return {
    orderId: `ord-cert-${randomUUID()}`,
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
      {
        id: "papas-grande",
        name: "Papas Grandes",
        quantity: 1,
        unitPrice: 45.00,
        totalPrice: 45.00,
        category: "acompañamientos",
      },
    ],
    pricing: {
      subtotal: 223.00,
      discountTotal: 20.00,
      taxTotal: 40.14,
      deliveryFee: 25.00,
      serviceFee: 5.00,
      tip: 30.00,
      grandTotal: 283.14,
      currency: "MXN",
    },
    payment: {
      method: "CREDIT_CARD",
      status: "AUTHORIZED",
      transactionId: "txn-abc-123",
      amount: 283.14,
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
      confirmedAt: new Date(Date.now() + 1000).toISOString(),
      preparedAt: new Date(Date.now() + 300000).toISOString(),
      readyAt: new Date(Date.now() + 600000).toISOString(),
      completedAt: new Date(Date.now() + 1200000).toISOString(),
      cancelledAt: undefined,
    } as CanonicalOrderEvent["timestamps"],
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
    ...overrides,
  };
}

async function setupRuntime(): Promise<{ runtime: Runtime; engine: ObservationEngine }> {
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

  return { runtime, engine };
}

test("VS0-005 — CanonicalOrderEvent v1.0.0 contract compliance certification", async () => {
  const { runtime, engine } = await setupRuntime();

  const original = buildFullEvent();
  const result = await runtime.receive(original);

  const pipeline = engine.getPipeline();
  const observation = pipeline.getObservationById(result.observationId);

  assert.ok(observation, "Observation must exist in pipeline store");
  assert.equal(observation.stage, "HISTORICAL");
  assert.equal(observation.category, ObservationCategory.CUSTOMER);

  const payload = observation.payload;
  const issues: string[] = [];
  const preserved: string[] = [];

  // ── 1. orderId ──────────────────────────────────────────────────────────
  if (payload.orderId === original.orderId) {
    preserved.push("orderId");
  } else {
    issues.push(`orderId: expected "${original.orderId}", got "${payload.orderId}"`);
  }

  // ── 2. requestId ────────────────────────────────────────────────────────
  if (payload.requestId === original.requestId) {
    preserved.push("requestId");
  } else {
    issues.push(`requestId: expected "${original.requestId}", got "${payload.requestId}"`);
  }

  // ── 3. version ──────────────────────────────────────────────────────────
  if (payload.version === original.version) {
    preserved.push("version");
  } else {
    issues.push(`version: expected "${original.version}", got "${payload.version}"`);
  }

  // ── 4. status ───────────────────────────────────────────────────────────
  if (payload.status === original.status) {
    preserved.push("status");
  } else {
    issues.push(`status: expected "${original.status}", got "${payload.status}"`);
  }

  // ── 5. type ─────────────────────────────────────────────────────────────
  if (payload.type === original.type) {
    preserved.push("type");
  } else {
    issues.push(`type: expected "${original.type}", got "${payload.type}"`);
  }

  // ── 6. items ────────────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.items, original.items);
    preserved.push("items");
  } catch {
    issues.push(`items: deep mismatch — expected ${JSON.stringify(original.items)}, got ${JSON.stringify(payload.items)}`);
  }

  // ── 7. customer ─────────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.customer, original.customer);
    preserved.push("customer");
  } catch {
    issues.push(`customer: deep mismatch`);
  }

  // ── 8. pricing ──────────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.pricing, original.pricing);
    preserved.push("pricing");
  } catch {
    issues.push(`pricing: deep mismatch`);
  }

  // ── 9. payment ──────────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.payment, original.payment);
    preserved.push("payment");
  } catch {
    issues.push(`payment: deep mismatch`);
  }

  // ── 10. delivery ────────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.delivery, original.delivery);
    preserved.push("delivery");
  } catch {
    issues.push(`delivery: deep mismatch`);
  }

  // ── 11. restaurant ──────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.restaurant, original.restaurant);
    preserved.push("restaurant");
  } catch {
    issues.push(`restaurant: deep mismatch`);
  }

  // ── 12. channel ─────────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.channel, original.channel);
    preserved.push("channel");
  } catch {
    issues.push(`channel: deep mismatch`);
  }

  // ── 13. source ──────────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.source, original.source);
    preserved.push("source");
  } catch {
    issues.push(`source: deep mismatch`);
  }

  // ── 14. timestamps ──────────────────────────────────────────────────────
  try {
    assert.deepEqual(payload.timestamps, original.timestamps);
    preserved.push("timestamps");
  } catch {
    issues.push(`timestamps: deep mismatch`);
  }

  // ── 15. analytics ───────────────────────────────────────────────────────
  if (payload.analytics !== undefined) {
    try {
      assert.deepEqual(payload.analytics, original.analytics);
      preserved.push("analytics");
    } catch {
      issues.push(`analytics: deep mismatch`);
    }
  } else {
    issues.push("analytics: MISSING from payload — entire analytics object is lost");
  }

  // ── 16. metadata ────────────────────────────────────────────────────────
  if (payload.metadata !== undefined) {
    try {
      assert.deepEqual(payload.metadata, original.metadata);
      preserved.push("metadata");
    } catch {
      issues.push(`metadata: deep mismatch`);
    }
  } else {
    issues.push("metadata: MISSING from payload — entire metadata object is lost");
  }

  // ── 17. Source fidelity check ──────────────────────────────────────────
  // observation.source is mapped differently from event.source
  // Check that the payload.source (original) differs from observation.source (mapped)
  if (observation.source.id !== original.source.provider) {
    issues.push(`observation.source.id: expected "${original.source.provider}", got "${observation.source.id}" — source identity is transformed`);
  }

  // ── 18. Field count check ──────────────────────────────────────────────
  const originalTopLevelKeys = Object.keys(original).sort();
  const payloadKeys = Object.keys(payload).sort();
  const contractFieldNames = ["orderId","requestId","version","status","type","items","customer","pricing","payment","delivery","restaurant","channel","source","timestamps","analytics","metadata"];
  const extraPayloadKeys = payloadKeys.filter(k => !contractFieldNames.includes(k));

  if (extraPayloadKeys.length > 0) {
    issues.push(`EXTRA FIELDS in payload: ${extraPayloadKeys.join(", ")}`);
  }

  // ── Summary ────────────────────────────────────────────────────────────
  const totalFields = originalTopLevelKeys.length;
  const preservedCount = preserved.length;

  console.log("\n===== VS0-005 CONTRACT COMPLIANCE REPORT =====");
  console.log(`CanonicalOrderEvent v1.0.0 top-level fields: ${totalFields}`);
  console.log(`Preserved: ${preservedCount}`);
  console.log(`Issues found: ${issues.length}`);
  console.log(`\nPreserved fields: ${preserved.join(", ")}`);
  if (issues.length > 0) {
    console.log(`\nIssues:`);
    issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
  }
  console.log("==============================================\n");

  // The test FAILS if any issue is found (discrepancy = non-compliance)
  assert.equal(issues.length, 0, `Contract compliance FAILED — ${issues.length} issue(s) found:\n${issues.join("\n")}`);

  await runtime.shutdown();
});
