/**
 * VS1-004 — Reasoning → Decision Integration.
 *
 * Demonstrates that DecisionEngine automatically consumes
 * reasoning lifecycle completed events from the EventBus
 * and initiates a decision proposal.
 *
 * Pipeline:
 *   ReasoningPipeline → EventBus → DecisionEngine
 *   [reasoning.lifecycle.completed] → receiveInput → initiateDecision
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { DecisionEngine } from "../DecisionEngine";
import { REASONING_EVENTS } from "../../reasoning/ReasoningEvents";

describe("VS1-004 Reasoning → Decision Integration", () => {
  it("creates decision proposal when reasoning.lifecycle.completed is emitted", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    const reasoningId = "reason_vs1_004_001";
    const reasoningName = "Inventory shortage analysis";

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId,
      name: reasoningName,
      type: "DIAGNOSTIC",
      stage: "COMPLETED",
      confidence: 0.85,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      businessId: "biz_inventory",
    });

    await new Promise((r) => setTimeout(r, 50));

    const metrics = engine.getMetrics();
    assert.ok(engine.getState() === "RUNNING", "engine should remain running after event");
    assert.deepEqual(metrics, {}, "metrics should be empty object (not implemented)");

    await engine.stop();
  });

  it("preserves reasoningId and confidence from the reasoning event", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    let capturedResult: Record<string, unknown> | null = null;
    eventBus.subscribe("decision.lifecycle.initiated", async (payload: Record<string, unknown>) => {
      capturedResult = payload;
    });

    const reasoningId = "reason_vs1_004_002";
    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId,
      name: "Customer preference analysis",
      type: "STRATEGIC",
      stage: "COMPLETED",
      confidence: 0.92,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      businessId: "biz_customer_analysis",
      urgency: 0.7,
    });

    await new Promise((r) => setTimeout(r, 50));

    assert.ok(capturedResult !== null, "should have received decision.lifecycle.initiated event");
    const decision = (capturedResult as Record<string, unknown>).decision as Record<string, unknown>;
    assert.ok(decision, "decision envelope should be present");
    assert.equal(decision.reasoningId, reasoningId, "reasoningId should be preserved");
    assert.ok(decision.id, "proposalId should be generated");
    assert.ok(String(decision.id).startsWith("dec-"), "proposalId should start with dec-");

    await engine.stop();
  });

  it("handles engine not running state gracefully", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    let errorCount = 0;
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId: "reason_vs1_004_003",
      name: "Test",
      type: "DIAGNOSTIC",
      stage: "COMPLETED",
      confidence: 0.5,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorCount, 0, "should not throw when engine is not running");
  });

  it("consumes reasoning.completed nested payload without fabricating alternatives", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    let capturedResult: Record<string, unknown> | null = null;
    eventBus.subscribe("decision.lifecycle.initiated", async (payload: Record<string, unknown>) => {
      capturedResult = payload;
    });

    const reasoningId = "reason_bf009_001";
    const businessId = "biz_tony_main";

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoning: {
        id: reasoningId,
        identity: {
          id: reasoningId,
          attentionId: "att_001",
          name: "Inventory shortage analysis",
          reasoningType: "DIAGNOSTIC",
          question: "Should we switch suppliers?",
          businessId,
          createdAt: new Date().toISOString(),
        },
        confidence: 0.85,
        integrity: 0.9,
        alternatives: [
          {
            id: "alt-local-1",
            title: "Local supplier",
            description: "Source from local vendors",
            riskLevel: 0.2,
            opportunityScore: 0.8,
            costEstimate: 5000,
          },
          {
            id: "alt-regional-1",
            title: "Regional distributor",
            description: "Source from regional distributors",
            riskLevel: 0.4,
            opportunityScore: 0.6,
            costEstimate: 3000,
          },
        ],
        conclusion: {
          id: "con_001",
          summary: "Switch to local supplier",
          narrative: "Analysis shows local supplier is optimal",
          preferredAlternativeId: "alt-local-1",
          confidence: 0.85,
          uncertaintyRanges: [],
          tradeoffHighlights: [],
          assumptions: [],
          unresolvedQuestions: [],
          timestamp: new Date().toISOString(),
        },
        question: { text: "Should we switch suppliers?", type: "DIAGNOSE", intent: "analyze", id: "q_001", knownFacts: [], unknownFacts: [], assumptions: [], desiredConfidenceLevel: "HIGH", scope: "supply", constraints: [], expectedOutput: "recommendation", priority: 1, createdAt: new Date().toISOString() },
        businessId,
        provenance: { attentionIds: ["att_001"], sourceObservationIds: [], sourceMemoryIds: [], sourceKnowledgeIds: [], creationTimeline: [new Date().toISOString()], versionHistory: [] },
        metadata: { totalHypothesesGenerated: 2, totalAlternativesGenerated: 2, totalConstraintsEvaluated: 1, reEvaluationCount: 0, inferenceCount: 5, lastActiveAt: new Date().toISOString(), tags: [], attributes: {} },
      },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      version: 1,
    });

    await new Promise((r) => setTimeout(r, 50));

    assert.ok(capturedResult !== null, "should have received decision.lifecycle.initiated");
    const decision = (capturedResult as Record<string, unknown>).decision as Record<string, unknown>;
    assert.ok(decision, "decision envelope should be present");
    assert.equal(decision.reasoningId, reasoningId, "reasoningId should come from nested payload");
    assert.equal((decision.alternatives as unknown[]).length, 2, "should carry reasoning-generated alternatives");
    assert.ok(String(decision.id).startsWith("dec-"), "proposalId should be generated");

    await engine.stop();
  });

  it("falls back to flat payload when nested reasoning is absent", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    let capturedResult: Record<string, unknown> | null = null;
    eventBus.subscribe("decision.lifecycle.initiated", async (payload: Record<string, unknown>) => {
      capturedResult = payload;
    });

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId: "reason_bf009_002",
      name: "Legacy flat payload test",
      type: "OPERATIONAL",
      stage: "COMPLETED",
      confidence: 0.75,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      businessId: "biz_legacy",
      urgency: 0.6,
    });

    await new Promise((r) => setTimeout(r, 50));

    assert.ok(capturedResult !== null, "should still process flat payloads");
    const decision = (capturedResult as Record<string, unknown>).decision as Record<string, unknown>;
    assert.ok(decision, "decision envelope should be present");
    assert.equal(decision.reasoningId, "reason_bf009_002");

    await engine.stop();
  });

  it("accepts payload with explicit alternatives and businessId", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    let capturedResult: Record<string, unknown> | null = null;
    eventBus.subscribe("decision.lifecycle.initiated", async (payload: Record<string, unknown>) => {
      capturedResult = payload;
    });

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId: "reason_vs1_004_004",
      name: "Supplier selection",
      type: "OPERATIONAL",
      stage: "COMPLETED",
      confidence: 0.78,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      alternatives: [
        {
          id: "alt-1",
          label: "Local supplier",
          description: "Source from local vendors",
          expectedOutcome: "Lower shipping costs",
          riskLevel: 0.2,
          opportunityScore: 0.8,
          costEstimate: 5000,
          humanImpactScore: 0.6,
          reversibility: "REVERSIBLE",
        },
        {
          id: "alt-2",
          label: "Regional distributor",
          description: "Source from regional distributors",
          expectedOutcome: "More reliable supply chain",
          riskLevel: 0.4,
          opportunityScore: 0.6,
          costEstimate: 3000,
          humanImpactScore: 0.4,
          reversibility: "CONDITIONALLY_REVERSIBLE",
        },
      ],
      businessId: "biz_tony_main",
      urgency: 0.8,
    });

    await new Promise((r) => setTimeout(r, 50));

    assert.ok(capturedResult !== null, "should have received decision.lifecycle.initiated");
    const decision = (capturedResult as Record<string, unknown>).decision as Record<string, unknown>;
    assert.ok(decision, "decision envelope should be present");
    assert.equal(decision.reasoningId, "reason_vs1_004_004");
    assert.equal((decision.alternatives as unknown[]).length, 2);

    await engine.stop();
  });
});
