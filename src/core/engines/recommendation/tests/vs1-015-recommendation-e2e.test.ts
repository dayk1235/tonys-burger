/**
 * VS1-015 — Reasoning → Decision → Learning → Prediction → Recommendation End-to-End.
 *
 * Proves the full pipeline:
 *   ReasoningPipeline → EventBus → DecisionEngine → EventBus
 *     → LearningEngine → EventBus → PredictionEngine → EventBus
 *       → RecommendationEngine
 *
 * The Recommendation engine must consume a real Prediction entity,
 * evaluate it into an actionable recommendation with priority,
 * expected benefit, risk, explanation, then persist and emit
 * recommendation.lifecycle.completed.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { DecisionEngine } from "../../decision/DecisionEngine";
import { LearningEngine } from "../../learning/LearningEngine";
import { PredictionEngine } from "../../prediction/PredictionEngine";
import { RecommendationEngine } from "../RecommendationEngine";
import { REASONING_EVENTS } from "../../reasoning/ReasoningEvents";

describe("VS1-015 Reasoning → Decision → Learning → Prediction → Recommendation End-to-End", () => {
  it("completes full pipeline when a reasoning event is emitted", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const decisionEngine = new DecisionEngine(eventBus);
    const learningEngine = new LearningEngine(eventBus);
    const predictionEngine = new PredictionEngine(eventBus);
    const recommendationEngine = new RecommendationEngine(eventBus);

    await decisionEngine.start();
    await learningEngine.start();
    await predictionEngine.start();
    await recommendationEngine.start();

    let recommendationCompleted = false;
    let capturedEvent: Record<string, unknown> | null = null;
    eventBus.subscribe("recommendation.lifecycle.completed", async (payload) => {
      recommendationCompleted = true;
      capturedEvent = payload;
    });

    const reasoningId = "reason_vs1_015_001";
    const businessId = "biz_vs1_015";

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId,
      name: "Staff scheduling optimization",
      type: "OPERATIONAL",
      stage: "COMPLETED",
      confidence: 0.9,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      businessId,
      urgency: 0.8,
      alternatives: [
        {
          id: "alt-flex",
          label: "Flexible scheduling",
          description: "Implement flexible shifts based on demand patterns",
          expectedOutcome: "Labor cost reduction of 12-15% while maintaining coverage",
          riskLevel: 0.3,
          opportunityScore: 0.85,
          costEstimate: 3000,
          humanImpactScore: 0.6,
          reversibility: "REVERSIBLE",
        },
        {
          id: "alt-fixed",
          label: "Fixed block scheduling",
          description: "Maintain fixed shift blocks with limited flexibility",
          expectedOutcome: "Schedule predictability for staff",
          riskLevel: 0.2,
          opportunityScore: 0.45,
          costEstimate: 500,
          humanImpactScore: 0.4,
          reversibility: "REVERSIBLE",
        },
      ],
    });

    await new Promise((r) => setTimeout(r, 250));

    // ---- Decision assertions ----
    const decPipeline = decisionEngine.getPipeline();
    const decisions = await decPipeline.memory.findByReasoningId(reasoningId);
    assert.equal(decisions.length, 1, "decision should be stored");
    const decision = decisions[0];
    assert.equal(decision.selectedAlternativeId, "alt-flex", "flexible scheduling should win");

    // ---- Learning assertions ----
    const learnPipeline = learningEngine.getPipeline();
    const learningEntities = await learnPipeline.memory.findByDecisionId(decision.id);
    assert.equal(learningEntities.length, 1, "learning entity should be stored");
    const learning = learningEntities[0];
    assert.equal(learning.stage, "COMPLETED");

    // ---- Prediction assertions ----
    const predPipeline = predictionEngine.getPipeline();
    const predictions = await predPipeline.memory.findByLearningId(learning.id);
    assert.equal(predictions.length, 1, "prediction should be stored");
    const prediction = predictions[0];
    assert.equal(prediction.stage, "COMPLETED");
    assert.ok(prediction.forecast.probability > 0);

    // ---- Recommendation assertions ----
    const recPipeline = recommendationEngine.getPipeline();
    const recommendations = await recPipeline.memory.findByPredictionId(prediction.id);
    assert.equal(recommendations.length, 1, "recommendation should be stored");

    const recommendation = recommendations[0];
    assert.equal(recommendation.id, `rec-${prediction.id}`, "should use deterministic ID");
    assert.equal(recommendation.predictionId, prediction.id, "should link to prediction");
    assert.equal(recommendation.stage, "COMPLETED", "should reach COMPLETED stage");

    // ---- Priority assertion ----
    assert.ok(
      ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(recommendation.priority),
      `priority should be valid, got: ${recommendation.priority}`,
    );

    // ---- Action and benefit assertions ----
    assert.ok(recommendation.recommendedAction.length > 0, "recommended action should be non-empty");
    assert.ok(recommendation.expectedBenefit.length > 0, "expected benefit should be non-empty");

    // ---- Risk assertion ----
    assert.ok(recommendation.expectedRisk.length > 0, "expected risk should be non-empty");

    // ---- Confidence assertion ----
    assert.ok(recommendation.confidence > 0, "confidence should be > 0");
    assert.ok(recommendation.confidence <= 1, "confidence should be <= 1");

    // ---- Explanation assertion ----
    assert.ok(recommendation.explanation.length > 0, "explanation should be non-empty");
    assert.ok(
      recommendation.explanation.includes(recommendation.priority),
      "explanation should mention priority",
    );

    // ---- Supporting evidence linkage ----
    assert.equal(
      recommendation.supportingEvidence.learningId,
      prediction.supportingEvidence.learningId,
      "supporting evidence should link to same learning",
    );

    // ---- Forecast propagation ----
    assert.equal(recommendation.forecast.outcome, prediction.forecast.outcome);
    assert.equal(recommendation.forecast.probability, prediction.forecast.probability);

    // ---- Metrics assertions ----
    const metrics = recommendationEngine.getMetrics();
    assert.equal(metrics.totalRecommendations, 1, "should count one recommendation");
    assert.equal(metrics.completedRecommendations, 1, "should be completed");
    assert.ok(metrics.averageConfidence > 0, "confidence should be tracked");
    assert.ok(metrics.averagePriority > 0, "priority should be tracked");

    // ---- Event assertions ----
    assert.ok(recommendationCompleted, "recommendation.lifecycle.completed should be emitted");
    assert.ok(capturedEvent !== null, "captured event should exist");
    const ev = capturedEvent as Record<string, unknown>;
    const eventRec = (ev.recommendation as Record<string, unknown>) ?? {};
    assert.equal(eventRec.id, recommendation.id);
    assert.equal(eventRec.stage, "COMPLETED");

    await decisionEngine.stop();
    await learningEngine.stop();
    await predictionEngine.stop();
    await recommendationEngine.stop();
  });

  it("handles engine-not-running gracefully", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const recommendationEngine = new RecommendationEngine(eventBus);

    let errorCount = 0;
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit("prediction.lifecycle.completed", {
      prediction: {
        id: "pred-test",
        forecast: { outcome: "Test outcome", probability: 0.8, factors: ["factor1"] },
        confidence: 0.75,
      },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorCount, 0, "should not throw when engine is not running");
  });

  it("extracts from flat prediction envelope (backward compat)", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const recommendationEngine = new RecommendationEngine(eventBus);
    await recommendationEngine.start();

    let completedId: string | null = null;
    eventBus.subscribe("recommendation.lifecycle.completed", async (payload) => {
      const rec = (payload.recommendation as Record<string, unknown>) ?? {};
      completedId = rec.id as string;
    });

    await eventBus.emit("prediction.lifecycle.completed", {
      prediction: {
        id: "pred-backward-test",
        learningId: "learn-backward",
        learnedPattern: "Test pattern",
        decisionLabel: "Test decision",
        expectedResult: "Expected test result",
        forecast: {
          outcome: "Forecast outcome for backward compat test",
          probability: 0.85,
          factors: ["Factor A", "Factor B"],
        },
        confidence: 0.8,
        supportingEvidence: {
          learningId: "learn-backward",
          learnedPattern: "Test pattern",
          rationale: "Test rationale for backward compat",
          expectedResult: "Expected test result",
          confidence: 0.8,
        },
        businessId: "biz-backward",
        stage: "COMPLETED",
      },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      version: 1,
    });

    await new Promise((r) => setTimeout(r, 100));

    assert.equal(completedId, "rec-pred-backward-test", "should process flat envelope events");
    const stored = await recommendationEngine.getPipeline().memory.findByPredictionId("pred-backward-test");
    assert.equal(stored.length, 1, "recommendation should be stored");
    assert.ok(stored[0].explanation.length > 0, "explanation should be generated");

    await recommendationEngine.stop();
  });
});
