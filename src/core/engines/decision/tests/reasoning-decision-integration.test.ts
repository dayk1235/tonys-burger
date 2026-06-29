/**
 * VS1-004 / VS1-012 — Reasoning → Decision Integration.
 *
 * VS1-012 transforms DecisionPipeline from a stub (random proposal ID, no
 * evaluation) into a real pipeline that evaluates alternatives, computes
 * confidence, generates rationale, and emits a deterministic decision ID.
 *
 * Pipeline:
 *   ReasoningPipeline → EventBus → DecisionEngine
 *   [reasoning.lifecycle.completed] → receiveInput → initiateDecision
 *   → evaluate alternatives → select best → return real payload
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { DecisionEngine } from "../DecisionEngine";
import { REASONING_EVENTS } from "../../reasoning/ReasoningEvents";

describe("VS1-004 / VS1-012 Reasoning → Decision Integration", () => {
  it("creates decision proposal with real metrics when reasoning completes", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    const reasoningId = "reason_vs1_012_001";
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
    assert.equal(metrics.totalProposalsCreated, 1, "should record one proposal");
    assert.equal(metrics.activeProposals, 1, "should have one active proposal");
    assert.ok(metrics.averageConfidence > 0, "confidence should be computed");
    assert.equal(metrics.averageAlternativesPerProposal, 2, "should track alternatives count");
    assert.deepEqual(metrics.proposalsByStage, { PROPOSAL_BUILT: 1 });

    await engine.stop();
  });

  it("preserves reasoningId and confidence, uses deterministic decision ID, selects best alternative", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    let capturedResult: Record<string, unknown> | null = null;
    eventBus.subscribe("decision.lifecycle.initiated", async (payload: Record<string, unknown>) => {
      capturedResult = payload;
    });

    const reasoningId = "reason_vs1_012_002";
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
    assert.equal(decision.id, `dec-${reasoningId}`, "should use deterministic ID from reasoningId");
    assert.ok(decision.evaluations, "should include alternative evaluations");
    assert.ok(decision.selectedAlternativeId, "should have selected an alternative");
    assert.ok(decision.rationale, "should include rationale text");

    await engine.stop();
  });

  it("handles engine not running state gracefully", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    let errorCount = 0;
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId: "reason_vs1_012_003",
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
    assert.equal(decision.id, `dec-${reasoningId}`, "should use deterministic ID");
    assert.equal(decision.selectedAlternativeId, "alt-local-1", "should select best-scoring alternative");
    assert.ok(decision.rationale, "should include rationale");

    const evaluations = decision.evaluations as Record<string, unknown>[];
    assert.equal(evaluations.length, 2, "should evaluate each alternative");
    const selected = evaluations.find((e: Record<string, unknown>) => e.isSelected === true);
    assert.ok(selected, "one alternative should be marked as selected");
    assert.equal(selected?.alternativeId, "alt-local-1");

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
    assert.equal(decision.id, "dec-reason_bf009_002", "should use deterministic ID");

    await engine.stop();
  });

  it("accepts payload with explicit alternatives and businessId, selects best alternative deterministically", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    let capturedResult: Record<string, unknown> | null = null;
    eventBus.subscribe("decision.lifecycle.initiated", async (payload: Record<string, unknown>) => {
      capturedResult = payload;
    });

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId: "reason_vs1_012_006",
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
    assert.equal(decision.reasoningId, "reason_vs1_012_006");
    assert.equal((decision.alternatives as unknown[]).length, 2);
    assert.equal(decision.id, "dec-reason_vs1_012_006", "should use deterministic ID");
    assert.equal(decision.selectedAlternativeId, "alt-1", "should select the higher-scoring alternative");

    const rationale = decision.rationale as string;
    assert.ok(rationale.includes("Local supplier"), "rationale should mention selected alternative");

    await engine.stop();
  });

  it("exposes pipeline with stored decision via memory", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new DecisionEngine(eventBus);

    await engine.start();

    const reasoningId = "reason_vs1_012_mem";
    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId,
      name: "Memory test",
      type: "OPERATIONAL",
      stage: "COMPLETED",
      confidence: 0.8,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      businessId: "biz_memory",
      alternatives: [
        { id: "opt-a", label: "Option A", description: "First option", expectedOutcome: "Good", riskLevel: 0.3, opportunityScore: 0.7, costEstimate: 100, humanImpactScore: 0.6, reversibility: "REVERSIBLE" },
        { id: "opt-b", label: "Option B", description: "Second option", expectedOutcome: "Better", riskLevel: 0.5, opportunityScore: 0.5, costEstimate: 50, humanImpactScore: 0.4, reversibility: "REVERSIBLE" },
      ],
    });

    await new Promise((r) => setTimeout(r, 50));

    const pipeline = engine.getPipeline();
    const stored = await pipeline.memory.findByReasoningId(reasoningId);
    assert.equal(stored.length, 1, "decision should be stored in memory");
    assert.equal(stored[0].id, `dec-${reasoningId}`);
    assert.equal(stored[0].selectedAlternativeId, "opt-a");
    assert.ok(stored[0].confidence > 0);
    assert.ok(stored[0].rationale.length > 0);

    await engine.stop();
  });
});
