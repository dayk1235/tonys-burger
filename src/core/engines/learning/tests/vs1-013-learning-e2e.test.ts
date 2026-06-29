/**
 * VS1-013 — Reasoning → Decision → Learning End-to-End.
 *
 * Proves the full pipeline:
 *   ReasoningPipeline → EventBus → DecisionEngine → EventBus → LearningEngine
 *
 * The Learning engine must consume a real Decision object, analyze the
 * chosen decision (selectedAlternativeId), expected outcome, confidence,
 * and rationale, then generate a persisted Learning entity and emit
 * learning.lifecycle.completed.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { DecisionEngine } from "../../decision/DecisionEngine";
import { LearningEngine } from "../LearningEngine";
import { REASONING_EVENTS } from "../../reasoning/ReasoningEvents";
import { DECISION_EVENTS } from "../../decision/DecisionEvents";
import { LEARNING_EVENTS } from "../LearningEvents";

describe("VS1-013 Reasoning → Decision → Learning End-to-End", () => {
  it("completes full pipeline when a reasoning event is emitted", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const decisionEngine = new DecisionEngine(eventBus);
    const learningEngine = new LearningEngine(eventBus);

    await decisionEngine.start();
    await learningEngine.start();

    const capturedEvents: Record<string, unknown>[] = [];
    eventBus.subscribe("learning.lifecycle.completed", async (payload) => {
      capturedEvents.push(payload);
    });

    const reasoningId = "reason_vs1_013_001";
    const businessId = "biz_vs1_013";

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId,
      name: "Supplier evaluation",
      type: "OPERATIONAL",
      stage: "COMPLETED",
      confidence: 0.88,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      businessId,
      urgency: 0.7,
      alternatives: [
        {
          id: "alt-local-1",
          label: "Local supplier",
          description: "Source from local vendors",
          expectedOutcome: "Lower shipping costs and faster delivery",
          riskLevel: 0.2,
          opportunityScore: 0.8,
          costEstimate: 5000,
          humanImpactScore: 0.6,
          reversibility: "REVERSIBLE",
        },
        {
          id: "alt-regional-1",
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
    });

    await new Promise((r) => setTimeout(r, 100));

    // ---- Decision assertions ----
    const decPipeline = decisionEngine.getPipeline();
    const decisions = await decPipeline.memory.findByReasoningId(reasoningId);
    assert.equal(decisions.length, 1, "decision should be stored in DecisionMemory");

    const decision = decisions[0];
    assert.equal(decision.reasoningId, reasoningId);
    assert.equal(decision.selectedAlternativeId, "alt-local-1", "should select best alternative");
    assert.ok(decision.confidence > 0, "decision confidence should be computed");
    assert.ok(decision.rationale.includes("Local supplier"), "rationale should mention selected alternative");

    // ---- Learning assertions ----
    const learnPipeline = learningEngine.getPipeline();
    const learningEntities = await learnPipeline.memory.findByDecisionId(decision.id);
    assert.equal(learningEntities.length, 1, "learning entity should be stored in LearningMemory");

    const learning = learningEntities[0];
    assert.equal(learning.id, `learn-${decision.id}`, "should use deterministic learning ID");
    assert.equal(learning.decisionId, decision.id, "should link to decision");
    assert.equal(learning.decisionLabel, "Local supplier", "should capture selected label");
    assert.ok(learning.expectedResult.includes("Lower shipping costs"), "should capture expected outcome");
    assert.equal(learning.actualResult, "PENDING", "actual result should be PENDING initially");
    assert.equal(learning.resultStatus, "PENDING", "result status should be PENDING");
    assert.equal(learning.confidence, decision.confidence, "should preserve decision confidence");
    assert.equal(learning.stage, "COMPLETED", "should advance to COMPLETED stage");
    assert.equal(learning.businessId, businessId, "should preserve businessId");

    // ---- Metrics assertions ----
    const metrics = learningEngine.getMetrics();
    assert.equal(metrics.totalLearningCycles, 1, "should count one learning cycle");
    assert.equal(metrics.completedCycles, 1, "should have one completed cycle");
    assert.equal(metrics.activeCycles, 0, "no active cycles after completion");
    assert.ok(metrics.averageConfidence > 0, "confidence should be tracked");

    // ---- Event assertions ----
    assert.equal(capturedEvents.length, 1, "should emit learning.lifecycle.completed");
    const completedEvent = capturedEvents[0];
    const eventLearning = (completedEvent.learning as Record<string, unknown>) ?? {};
    assert.equal(eventLearning.id, learning.id);
    assert.equal(eventLearning.stage, "COMPLETED");

    await decisionEngine.stop();
    await learningEngine.stop();
  });

  it("consumes nested reasoning payload end-to-end", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const decisionEngine = new DecisionEngine(eventBus);
    const learningEngine = new LearningEngine(eventBus);

    await decisionEngine.start();
    await learningEngine.start();

    let learningCompleted = false;
    eventBus.subscribe("learning.lifecycle.completed", async () => {
      learningCompleted = true;
    });

    const reasoningId = "reason_vs1_013_nested";
    const businessId = "biz_vs1_013_nested";

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoning: {
        id: reasoningId,
        identity: {
          id: reasoningId,
          attentionId: "att_013",
          name: "Inventory optimization",
          reasoningType: "OPERATIONAL",
          question: "Should we optimize inventory?",
          businessId,
          createdAt: new Date().toISOString(),
        },
        confidence: 0.8,
        integrity: 0.85,
        alternatives: [
          {
            id: "alt-opt-1",
            title: "Just-in-time",
            description: "Switch to JIT inventory",
            riskLevel: 0.3,
            opportunityScore: 0.9,
            costEstimate: 10000,
          },
          {
            id: "alt-opt-2",
            title: "Safety stock",
            description: "Maintain safety stock levels",
            riskLevel: 0.1,
            opportunityScore: 0.5,
            costEstimate: 2000,
          },
        ],
        conclusion: {
          id: "con_013",
          summary: "Just-in-time recommended",
          narrative: "JIT reduces waste and improves cash flow",
          preferredAlternativeId: "alt-opt-1",
          confidence: 0.8,
          uncertaintyRanges: [],
          tradeoffHighlights: [],
          assumptions: [],
          unresolvedQuestions: [],
          timestamp: new Date().toISOString(),
        },
        question: { text: "Should we optimize inventory?", type: "EVALUATE", intent: "optimize", id: "q_013", knownFacts: [], unknownFacts: [], assumptions: [], desiredConfidenceLevel: "HIGH", scope: "inventory", constraints: [], expectedOutput: "recommendation", priority: 1, createdAt: new Date().toISOString() },
        businessId,
        provenance: { attentionIds: ["att_013"], sourceObservationIds: [], sourceMemoryIds: [], sourceKnowledgeIds: [], creationTimeline: [new Date().toISOString()], versionHistory: [] },
        metadata: { totalHypothesesGenerated: 3, totalAlternativesGenerated: 2, totalConstraintsEvaluated: 1, reEvaluationCount: 0, inferenceCount: 4, lastActiveAt: new Date().toISOString(), tags: [], attributes: {} },
      },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      version: 1,
    });

    await new Promise((r) => setTimeout(r, 100));

    // Verify everything flowed through the full pipeline
    const decPipeline = decisionEngine.getPipeline();
    const decisions = await decPipeline.memory.findByReasoningId(reasoningId);
    assert.equal(decisions.length, 1, "decision should exist");

    const decision = decisions[0];
    assert.equal(decision.selectedAlternativeId, "alt-opt-2", "Safety stock should be selected (lower risk, lower cost)");

    const learnPipeline = learningEngine.getPipeline();
    const learningEntities = await learnPipeline.memory.findByDecisionId(decision.id);
    assert.equal(learningEntities.length, 1, "learning entity should exist");
    assert.equal(learningEntities[0].decisionLabel, "Safety stock");
    assert.ok(learningCompleted, "learning.lifecycle.completed should have been emitted");

    await decisionEngine.stop();
    await learningEngine.stop();
  });

  it("handles engine-not-running gracefully without side effects", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const learningEngine = new LearningEngine(eventBus);

    let errorCount = 0;
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit(DECISION_EVENTS.LIFECYCLE_INITIATED, {
      decision: { id: "dec-test", selectedAlternativeId: "alt-1", selectedLabel: "Test", alternatives: [], confidence: 0.5 },
      operation: "INITIATE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorCount, 0, "should not throw when engine is not running");
  });
});
