/**
 * VS1-016 — 6-Engine Pipeline End-to-End.
 *
 * Reasoning → Decision → Learning → Prediction → Recommendation → Planning
 *
 * The Planning engine must consume a real Recommendation entity,
 * generate ordered execution steps with estimated duration, resources,
 * dependencies, and rollback strategy, then persist and emit
 * planning.lifecycle.completed.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { DecisionEngine } from "../../decision/DecisionEngine";
import { LearningEngine } from "../../learning/LearningEngine";
import { PredictionEngine } from "../../prediction/PredictionEngine";
import { RecommendationEngine } from "../../recommendation/RecommendationEngine";
import { PlanningEngine } from "../PlanningEngine";
import { REASONING_EVENTS } from "../../reasoning/ReasoningEvents";

describe("VS1-016 6-Engine Pipeline End-to-End", () => {
  it("completes full pipeline when a reasoning event is emitted", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const decisionEngine = new DecisionEngine(eventBus);
    const learningEngine = new LearningEngine(eventBus);
    const predictionEngine = new PredictionEngine(eventBus);
    const recommendationEngine = new RecommendationEngine(eventBus);
    const planningEngine = new PlanningEngine(eventBus);

    await decisionEngine.start();
    await learningEngine.start();
    await predictionEngine.start();
    await recommendationEngine.start();
    await planningEngine.start();

    let planningCompleted = false;
    let capturedEvent: Record<string, unknown> | null = null;
    eventBus.subscribe("planning.lifecycle.completed", async (payload) => {
      planningCompleted = true;
      capturedEvent = payload;
    });

    const reasoningId = "reason_vs1_016_001";
    const businessId = "biz_vs1_016";

    await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
      reasoningId,
      name: "Kitchen workflow optimization",
      type: "OPERATIONAL",
      stage: "COMPLETED",
      confidence: 0.87,
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      businessId,
      urgency: 0.75,
      alternatives: [
        {
          id: "alt-reorg",
          label: "Reorganize kitchen stations",
          description: "Redesign kitchen layout for improved workflow",
          expectedOutcome: "Order fulfillment time reduced by 20-25%",
          riskLevel: 0.35,
          opportunityScore: 0.85,
          costEstimate: 8000,
          humanImpactScore: 0.5,
          reversibility: "CONDITIONALLY_REVERSIBLE",
        },
        {
          id: "alt-express",
          label: "Add express preparation line",
          description: "Dedicated line for high-volume items",
          expectedOutcome: "Peak throughput increased by 15-20%",
          riskLevel: 0.25,
          opportunityScore: 0.7,
          costEstimate: 12000,
          humanImpactScore: 0.6,
          reversibility: "REVERSIBLE",
        },
      ],
    });

    await new Promise((r) => setTimeout(r, 300));

    // ---- Decision ----
    const decisions = await decisionEngine.getPipeline().memory.findByReasoningId(reasoningId);
    assert.equal(decisions.length, 1, "decision should be stored");
    const decision = decisions[0];

    // ---- Learning ----
    const learningEntities = await learningEngine.getPipeline().memory.findByDecisionId(decision.id);
    assert.equal(learningEntities.length, 1, "learning entity should be stored");
    const learning = learningEntities[0];

    // ---- Prediction ----
    const predictions = await predictionEngine.getPipeline().memory.findByLearningId(learning.id);
    assert.equal(predictions.length, 1, "prediction should be stored");
    const prediction = predictions[0];

    // ---- Recommendation ----
    const recommendations = await recommendationEngine.getPipeline().memory.findByPredictionId(prediction.id);
    assert.equal(recommendations.length, 1, "recommendation should be stored");
    const recommendation = recommendations[0];

    // ---- Planning ----
    const planPipeline = planningEngine.getPipeline();
    const plans = await planPipeline.memory.findByRecommendationId(recommendation.id);
    assert.equal(plans.length, 1, "plan should be stored in PlanningMemory");

    const plan = plans[0];

    // --- Deterministic ID ---
    assert.equal(plan.id, `plan-${recommendation.id}`, "should use deterministic plan ID");

    // --- Linkage ---
    assert.equal(plan.recommendationId, recommendation.id, "should link to recommendation");

    // --- Stage ---
    assert.equal(plan.stage, "COMPLETED", "plan should reach COMPLETED stage");

    // --- Execution steps ---
    assert.ok(plan.executionSteps.length >= 4, `should have at least 4 execution steps, got ${plan.executionSteps.length}`);
    assert.ok(plan.executionSteps.length <= 8, `should have at most 8 execution steps, got ${plan.executionSteps.length}`);

    // --- Step structure ---
    const firstStep = plan.executionSteps[0];
    assert.ok(firstStep.id, "each step should have an id");
    assert.equal(firstStep.order, 1, "first step should have order 1");
    assert.ok(firstStep.action, "each step should have an action");
    assert.ok(firstStep.description, "each step should have a description");
    assert.ok(firstStep.estimatedDuration, "each step should have estimated duration");
    assert.ok(firstStep.requiredResources.length >= 0, "each step may have required resources");
    assert.equal(firstStep.status, "PENDING", "all steps should start as PENDING");

    // --- Ordering ---
    const orders = plan.executionSteps.map((s) => s.order);
    for (let i = 0; i < orders.length - 1; i++) {
      assert.ok(orders[i + 1] > orders[i], "steps should be in ascending order");
    }

    // --- Step IDs ---
    for (const step of plan.executionSteps) {
      assert.ok(step.id.startsWith("step-"), `step id should start with 'step-', got: ${step.id}`);
    }

    // --- Estimated duration ---
    assert.ok(plan.estimatedDuration.length > 0, "estimated duration should be non-empty");
    assert.ok(
      plan.estimatedDuration.includes("minutes") || plan.estimatedDuration.includes("hours"),
      `estimated duration should mention minutes or hours, got: ${plan.estimatedDuration}`,
    );

    // --- Required resources ---
    assert.ok(plan.requiredResources.length >= 1, "should have at least one required resource");
    assert.ok(plan.requiredResources.includes("Runtime access"), "should include Runtime access");

    // --- Dependencies ---
    assert.ok(plan.dependencies.length >= 1, "should have at least one dependency");

    // --- Rollback strategy ---
    assert.ok(plan.rollbackStrategy.length > 0, "rollback strategy should be non-empty");
    assert.ok(
      plan.rollbackStrategy.includes("rollback") || plan.rollbackStrategy.includes("Restore"),
      "rollback strategy should describe recovery steps",
    );

    // --- Expected outcome ---
    assert.equal(plan.expectedOutcome, recommendation.expectedBenefit, "expected outcome should come from recommendation");

    // --- Execution priority ---
    assert.equal(plan.executionPriority, recommendation.priority, "execution priority should come from recommendation");

    // --- Confidence ---
    assert.equal(plan.confidence, recommendation.confidence, "confidence should propagate from recommendation");

    // --- Business ID ---
    assert.equal(plan.businessId, businessId, "businessId should propagate");

    // --- Metrics ---
    const metrics = planningEngine.getMetrics();
    assert.equal(metrics.totalPlans, 1, "should count one plan");
    assert.equal(metrics.completedPlans, 1, "should be completed");
    assert.ok(metrics.averageConfidence > 0, "confidence should be tracked");
    assert.ok(metrics.averageSteps >= plan.executionSteps.length, "steps should be tracked");

    // --- Event emission ---
    assert.ok(planningCompleted, "planning.lifecycle.completed should be emitted");
    assert.ok(capturedEvent !== null, "captured event should exist");
    const ev = capturedEvent as Record<string, unknown>;
    const eventPlan = (ev.plan as Record<string, unknown>) ?? {};
    assert.equal(eventPlan.id, plan.id);
    assert.equal(eventPlan.stage, "COMPLETED");

    await decisionEngine.stop();
    await learningEngine.stop();
    await predictionEngine.stop();
    await recommendationEngine.stop();
    await planningEngine.stop();
  });

  it("handles engine-not-running gracefully", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const planningEngine = new PlanningEngine(eventBus);

    let errorCount = 0;
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit("recommendation.lifecycle.completed", {
      recommendation: {
        id: "rec-test",
        recommendedAction: "Test action",
        priority: "HIGH",
        confidence: 0.8,
      },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorCount, 0, "should not throw when engine is not running");
  });

  it("extracts from flat recommendation envelope (backward compat)", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const planningEngine = new PlanningEngine(eventBus);
    await planningEngine.start();

    let completedId: string | null = null;
    eventBus.subscribe("planning.lifecycle.completed", async (payload) => {
      const p = (payload.plan as Record<string, unknown>) ?? {};
      completedId = p.id as string;
    });

    await eventBus.emit("recommendation.lifecycle.completed", {
      recommendation: {
        id: "rec-backward-plan",
        predictionId: "pred-backward-plan",
        recommendedAction: "Implement backward compatible test",
        priority: "MEDIUM",
        expectedBenefit: "Improved test coverage",
        expectedRisk: "Low risk — well understood change",
        confidence: 0.75,
        explanation: "Backward compat test for planning engine",
        supportingEvidence: {
          learningId: "learn-backward-plan",
          learnedPattern: "Test pattern",
          rationale: "Test rationale for backward compat",
          expectedResult: "Expected test result",
          confidence: 0.75,
        },
        forecast: {
          outcome: "Forecast for backward compat",
          probability: 0.8,
          factors: ["Factor A", "Factor B"],
        },
        businessId: "biz-backward-plan",
        stage: "COMPLETED",
      },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      version: 1,
    });

    await new Promise((r) => setTimeout(r, 100));

    assert.equal(completedId, "plan-rec-backward-plan", "should process flat envelope events");

    const stored = await planningEngine.getPipeline().memory.findByRecommendationId("rec-backward-plan");
    assert.equal(stored.length, 1, "plan should be stored");
    assert.ok(stored[0].executionSteps.length >= 4, "should generate execution steps");
    assert.ok(stored[0].rollbackStrategy.length > 0, "should generate rollback strategy");
    assert.equal(stored[0].executionPriority, "MEDIUM", "should preserve priority");

    await planningEngine.stop();
  });
});
