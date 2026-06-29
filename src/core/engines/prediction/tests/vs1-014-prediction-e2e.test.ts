/**
 * VS1-014 — Reasoning → Decision → Learning → Prediction End-to-End.
 *
 * Proves the full pipeline:
 *   ReasoningPipeline → EventBus → DecisionEngine → EventBus
 *     → LearningEngine → EventBus → PredictionEngine
 *
 * The Prediction engine must consume a real Learning entity, generate a
 * forecast with confidence, probability, and supporting evidence, then
 * persist and emit prediction.lifecycle.completed.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { DecisionEngine } from "../../decision/DecisionEngine";
import { LearningEngine } from "../../learning/LearningEngine";
import { PredictionEngine } from "../PredictionEngine";
import { REASONING_EVENTS } from "../../reasoning/ReasoningEvents";

describe("VS1-014 Reasoning → Decision → Learning → Prediction End-to-End", () => {
  it("completes full pipeline when a reasoning event is emitted", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const decisionEngine = new DecisionEngine(eventBus);
    const learningEngine = new LearningEngine(eventBus);
    const predictionEngine = new PredictionEngine(eventBus);

    await decisionEngine.start();
    await learningEngine.start();
    await predictionEngine.start();

    let predictionCompleted = false;
    let capturedPrediction: Record<string, unknown> | null = null;
    eventBus.subscribe("prediction.lifecycle.completed", async (payload) => {
      predictionCompleted = true;
      capturedPrediction = payload;
    });

    const reasoningId = "reason_vs1_014_001";
    const businessId = "biz_vs1_014";

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId,
      name: "Menu pricing analysis",
      type: "FINANCIAL",
      stage: "COMPLETED",
      confidence: 0.85,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      businessId,
      urgency: 0.7,
      alternatives: [
        {
          id: "alt-price-inc",
          label: "Increase prices 5%",
          description: "Raise menu prices by 5% across all items",
          expectedOutcome: "Revenue increase of 8-12% with minimal customer churn",
          riskLevel: 0.4,
          opportunityScore: 0.8,
          costEstimate: 1000,
          humanImpactScore: 0.3,
          reversibility: "REVERSIBLE",
        },
        {
          id: "alt-value-menu",
          label: "Introduce value menu",
          description: "Add value-priced items to attract budget customers",
          expectedOutcome: "Traffic increase of 15-20% with lower average check",
          riskLevel: 0.2,
          opportunityScore: 0.7,
          costEstimate: 5000,
          humanImpactScore: 0.7,
          reversibility: "REVERSIBLE",
        },
      ],
    });

    await new Promise((r) => setTimeout(r, 200));

    // ---- Decision assertions ----
    const decPipeline = decisionEngine.getPipeline();
    const decisions = await decPipeline.memory.findByReasoningId(reasoningId);
    assert.equal(decisions.length, 1, "decision should be stored");
    const decision = decisions[0];
    assert.equal(decision.selectedAlternativeId, "alt-value-menu", "value menu should be selected (lower risk, higher human impact)");

    // ---- Learning assertions ----
    const learnPipeline = learningEngine.getPipeline();
    const learningEntities = await learnPipeline.memory.findByDecisionId(decision.id);
    assert.equal(learningEntities.length, 1, "learning entity should be stored");
    const learning = learningEntities[0];
    assert.equal(learning.decisionLabel, "Introduce value menu");
    assert.equal(learning.stage, "COMPLETED");

    // ---- Prediction assertions ----
    const predPipeline = predictionEngine.getPipeline();
    const predictions = await predPipeline.memory.findByLearningId(learning.id);
    assert.equal(predictions.length, 1, "prediction should be stored in PredictionMemory");

    const prediction = predictions[0];
    assert.equal(prediction.id, `pred-${learning.id}`, "should use deterministic prediction ID");
    assert.equal(prediction.learningId, learning.id, "should link to learning entity");
    assert.equal(prediction.learnedPattern, "Introduce value menu");
    assert.equal(prediction.stage, "COMPLETED", "prediction should reach COMPLETED stage");

    // ---- Forecast assertions ----
    assert.ok(prediction.forecast, "should have forecast");
    assert.ok(prediction.forecast.outcome.length > 0, "forecast outcome should be non-empty");
    assert.ok(prediction.forecast.outcome.includes("Introduce value menu"), "outcome should reference decision");
    assert.ok(prediction.forecast.outcome.includes("Traffic increase"), "outcome should reference expected result");
    assert.ok(prediction.forecast.probability > 0, "probability should be > 0");
    assert.ok(prediction.forecast.probability <= 1, "probability should be <= 1");
    assert.ok(prediction.forecast.factors.length >= 1, "should have at least one factor");

    // ---- Confidence assertions ----
    assert.ok(prediction.confidence > 0, "overall confidence should be > 0");

    // ---- Supporting evidence assertions ----
    assert.ok(prediction.supportingEvidence, "should have supporting evidence");
    assert.equal(prediction.supportingEvidence.learningId, learning.id);
    assert.equal(prediction.supportingEvidence.learnedPattern, "Introduce value menu");
    assert.equal(prediction.supportingEvidence.expectedResult, learning.expectedResult);
    assert.equal(prediction.supportingEvidence.confidence, learning.confidence);

    // ---- Metrics assertions ----
    const metrics = predictionEngine.getMetrics();
    assert.equal(metrics.totalPredictions, 1, "should count one prediction");
    assert.equal(metrics.completedPredictions, 1, "should be completed");
    assert.ok(metrics.averageConfidence > 0, "confidence should be tracked");
    assert.ok(metrics.averageProbability > 0, "probability should be tracked");

    // ---- Event assertions ----
    assert.ok(predictionCompleted, "prediction.lifecycle.completed should be emitted");
    assert.ok(capturedPrediction !== null, "captured event should exist");
    const cp = capturedPrediction as Record<string, unknown>;
    const eventPrediction = (cp.prediction as Record<string, unknown>) ?? {};
    assert.equal(eventPrediction.id, prediction.id);
    assert.equal(eventPrediction.stage, "COMPLETED");

    await decisionEngine.stop();
    await learningEngine.stop();
    await predictionEngine.stop();
  });

  it("handles engine-not-running gracefully", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const predictionEngine = new PredictionEngine(eventBus);

    let errorCount = 0;
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit("learning.lifecycle.completed", {
      learning: { id: "learn-test", decisionLabel: "Test", expectedResult: "Test outcome" },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorCount, 0, "should not throw when engine is not running");
  });
});
