/**
 * VS1-002 — Knowledge → Attention Integration.
 *
 * Demonstrates that AttentionEngine automatically consumes
 * validated knowledge events from the EventBus and generates
 * attention entities via the cognitive pipeline.
 *
 * Pipeline:
 *   KnowledgePipeline → EventBus → AttentionEngine
 *   [knowledge.lifecycle.validated] → receiveInput → createAttention
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { AttentionEngine } from "../AttentionEngine";

describe("VS1-002 Knowledge → Attention Integration", () => {
  it("creates attention entity when knowledge.lifecycle.validated is emitted", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new AttentionEngine(eventBus);

    await engine.start(10_000);

    const knowledgeId = "know_vs1_001";
    const knowledgeName = "Customer prefers medium-rare burger";

    await eventBus.emit("knowledge.lifecycle.validated", {
      knowledgeId,
      name: knowledgeName,
      category: "CUSTOMER_BEHAVIOR",
      stage: "VALIDATED",
      confidence: 0.85,
      integrity: 0.92,
      operation: "VALIDATE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));

    const metrics = engine.getMetrics();
    assert.equal(metrics.totalAttentionCreated, 1, "should have created exactly one attention");

    const pipeline = engine.getPipeline();
    const memory = (pipeline as unknown as { memory: { findBySourceId: (id: string) => unknown[] } }).memory;
    const items = memory.findBySourceId(knowledgeId);
    assert.equal(items.length, 1, "should have stored one attention for the knowledge source");

    const attention = items[0] as {
      identity: { sourceId: string; name: string; sourceType: string; sourceIds: string[] };
      stage: string;
      priority: number;
    };
    assert.equal(attention.identity.sourceId, knowledgeId);
    assert.equal(attention.identity.name, knowledgeName);
    assert.equal(attention.identity.sourceType, "KNOWLEDGE");
    assert.ok(attention.identity.sourceIds.includes(knowledgeId));
    assert.ok(attention.stage !== "CANDIDATE", "attention should have been processed past CANDIDATE");
    assert.ok(attention.priority > 0, "attention should have a computed priority");

    await engine.stop();
  });

  it("creates attention with mapped category for different knowledge types", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new AttentionEngine(eventBus);

    await engine.start(10_000);

    await eventBus.emit("knowledge.lifecycle.validated", {
      knowledgeId: "know_vs1_002",
      name: "Inventory low on beef patties",
      category: "INVENTORY_KNOWLEDGE",
      stage: "VALIDATED",
      confidence: 0.9,
      integrity: 0.8,
      operation: "VALIDATE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));

    const metrics = engine.getMetrics();
    assert.equal(metrics.totalAttentionCreated, 1);
    assert.ok(metrics.attentionByCategory["INVENTORY_SHORTAGE"] !== undefined);

    await engine.stop();
  });

  it("handles engine not running state gracefully", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new AttentionEngine(eventBus);

    let errorCount = 0;
    const originalOnError = process.listeners("uncaughtException").pop();
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit("knowledge.lifecycle.validated", {
      knowledgeId: "know_vs1_003",
      name: "Test",
      category: "GENERAL",
      stage: "VALIDATED",
      confidence: 0.5,
      integrity: 0.5,
      operation: "VALIDATE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorCount, 0, "should not throw when engine is not running");
  });

  it("preserves traceability: sourceId → knowledgeId", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new AttentionEngine(eventBus);

    await engine.start(10_000);

    await eventBus.emit("knowledge.lifecycle.validated", {
      knowledgeId: "know_trace_001",
      name: "Traceable knowledge",
      category: "GENERAL",
      stage: "VALIDATED",
      confidence: 0.75,
      integrity: 0.85,
      operation: "VALIDATE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));

    const pipeline = engine.getPipeline();
    const memory = (pipeline as unknown as { memory: { findBySourceId: (id: string) => unknown[] } }).memory;
    const items = memory.findBySourceId("know_trace_001");
    assert.equal(items.length, 1);
    const att = items[0] as { identity: { sourceId: string; sourceIds: string[] } };
    assert.equal(att.identity.sourceId, "know_trace_001");
    assert.ok(att.identity.sourceIds.includes("know_trace_001"));

    await engine.stop();
  });
});
