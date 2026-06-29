import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { DecisionEngine } from "../../decision/DecisionEngine";
import { LearningEngine } from "../../learning/LearningEngine";
import { PredictionEngine } from "../../prediction/PredictionEngine";
import { RecommendationEngine } from "../../recommendation/RecommendationEngine";
import { PlanningEngine } from "../../planning/PlanningEngine";
import { ExecutionEngine } from "../ExecutionEngine";
import { REASONING_EVENTS } from "../../reasoning/ReasoningEvents";

describe("VS1-017 7-Engine Pipeline End-to-End", () => {
  it("completes full pipeline when a reasoning event is emitted", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const decisionEngine = new DecisionEngine(eventBus);
    const learningEngine = new LearningEngine(eventBus);
    const predictionEngine = new PredictionEngine(eventBus);
    const recommendationEngine = new RecommendationEngine(eventBus);
    const planningEngine = new PlanningEngine(eventBus);
    const executionEngine = new ExecutionEngine(eventBus);

    await decisionEngine.start();
    await learningEngine.start();
    await predictionEngine.start();
    await recommendationEngine.start();
    await planningEngine.start();
    await executionEngine.start();

    let executionCompleted = false;
    let capturedEvent: Record<string, unknown> | null = null;
    eventBus.subscribe("execution.lifecycle.completed", async (payload) => {
      executionCompleted = true;
      capturedEvent = payload;
    });

    const reasoningId = "reason_vs1_017_001";
    const businessId = "biz_vs1_017";

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

    await new Promise((r) => setTimeout(r, 500));

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
    assert.equal(plan.id, `plan-${recommendation.id}`, "should use deterministic plan ID");

    // ---- Execution ----
    const execPipeline = executionEngine.getPipeline();
    const executions = await execPipeline.memory.findByPlanId(plan.id);
    assert.equal(executions.length, 1, "execution should be stored in ExecutionMemory");
    const execution = executions[0];

    // --- Deterministic ID ---
    assert.equal(execution.id, `exec-${plan.id}`, "should use deterministic execution ID");

    // --- Linkage ---
    assert.equal(execution.planId, plan.id, "should link to plan");

    // --- Stage ---
    assert.equal(execution.stage, "COMPLETED", "execution should reach COMPLETED stage");

    // --- Step results ---
    assert.ok(execution.stepResults.length >= 4, `should have at least 4 step results, got ${execution.stepResults.length}`);
    assert.ok(
      execution.stepResults.length <= 8,
      `should have at most 8 step results, got ${execution.stepResults.length}`,
    );
    assert.equal(
      execution.completedSteps,
      execution.executionSteps.length,
      "all steps should be completed",
    );

    // --- Step result structure ---
    const firstResult = execution.stepResults[0];
    assert.ok(firstResult.stepId, "each step result should have a stepId");
    assert.ok(firstResult.action, "each step result should have an action");
    assert.equal(firstResult.status, "COMPLETED", "all step results should be COMPLETED");
    assert.ok(firstResult.startedAt, "each step result should have startedAt");
    assert.ok(firstResult.completedAt, "each step result should have completedAt");
    assert.ok(firstResult.duration, "each step result should have duration");
    assert.ok(firstResult.message, "each step result should have a message");

    // --- Timestamps ---
    assert.ok(execution.startedAt.length > 0, "should have startedAt");
    assert.ok(execution.completedAt.length > 0, "should have completedAt");
    assert.ok(
      new Date(execution.completedAt).getTime() >= new Date(execution.startedAt).getTime(),
      "completedAt should be >= startedAt",
    );

    // --- Duration ---
    assert.ok(execution.duration.length > 0, "duration should be non-empty");
    assert.ok(
      execution.duration.includes("m") || execution.duration.includes("h"),
      `duration should mention minutes or hours, got: ${execution.duration}`,
    );

    // --- Step result ordering ---
    for (let i = 0; i < execution.stepResults.length; i++) {
      const sr = execution.stepResults[i];
      const step = execution.executionSteps[i];
      assert.equal(sr.stepId, step.id, `step result ${i} should correspond to step ${i}`);
      assert.equal(sr.action, step.action, `step result ${i} should have matching action`);
    }

    // --- Execution report ---
    assert.ok(execution.executionReport.length > 0, "execution report should be non-empty");
    assert.ok(
      execution.executionReport.includes("Execution Report"),
      "execution report should start with header",
    );
    assert.ok(
      execution.executionReport.includes(plan.id),
      "execution report should reference the plan ID",
    );

    // --- Failed / Skipped ---
    assert.equal(execution.failedSteps, 0, "no steps should fail in simulation");
    assert.equal(execution.skippedSteps, 0, "no steps should be skipped in simulation");

    // --- Confidence ---
    assert.equal(execution.confidence, plan.confidence, "confidence should propagate from plan");

    // --- Business ID ---
    assert.equal(execution.businessId, businessId, "businessId should propagate");

    // --- Metrics ---
    const metrics = executionEngine.getMetrics();
    assert.equal(metrics.totalExecutions, 1, "should count one execution");
    assert.equal(metrics.completedExecutions, 1, "should be completed");
    assert.ok(metrics.averageConfidence > 0, "confidence should be tracked");
    assert.ok(metrics.averageDuration.length > 0, "duration should be tracked");

    // --- Event emission ---
    assert.ok(executionCompleted, "execution.lifecycle.completed should be emitted");
    assert.ok(capturedEvent !== null, "captured event should exist");
    const ev = capturedEvent as Record<string, unknown>;
    const eventExec = (ev.execution as Record<string, unknown>) ?? {};
    assert.equal(eventExec.id, execution.id);
    assert.equal(eventExec.stage, "COMPLETED");

    await decisionEngine.stop();
    await learningEngine.stop();
    await predictionEngine.stop();
    await recommendationEngine.stop();
    await planningEngine.stop();
    await executionEngine.stop();
  });

  it("handles engine-not-running gracefully", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const executionEngine = new ExecutionEngine(eventBus);

    let errorCount = 0;
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit("planning.lifecycle.completed", {
      plan: {
        id: "plan-test",
        expectedOutcome: "Test execution",
        executionSteps: [
          {
            id: "step-1-test",
            order: 1,
            action: "test",
            description: "Test step",
            estimatedDuration: "10 minutes",
            requiredResources: ["Runtime access"],
            status: "PENDING",
          },
        ],
        confidence: 0.8,
        businessId: "biz-test",
        stage: "COMPLETED",
      },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorCount, 0, "should not throw when engine is not running");
  });

  it("extracts from flat plan envelope (backward compat)", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const executionEngine = new ExecutionEngine(eventBus);
    await executionEngine.start();

    let completedId: string | null = null;
    eventBus.subscribe("execution.lifecycle.completed", async (payload) => {
      const p = (payload.execution as Record<string, unknown>) ?? {};
      completedId = p.id as string;
    });

    await eventBus.emit("planning.lifecycle.completed", {
      plan: {
        id: "plan-backward-exec",
        expectedOutcome: "Backward compat test",
        executionSteps: [
          {
            id: "step-1-backward",
            order: 1,
            action: "validate",
            description: "Validate backward compat",
            estimatedDuration: "10 minutes",
            requiredResources: ["Runtime access"],
            status: "PENDING",
          },
          {
            id: "step-2-backward",
            order: 2,
            action: "execute",
            description: "Execute backward compat",
            estimatedDuration: "30 minutes",
            requiredResources: ["Runtime access", "Execution environment"],
            status: "PENDING",
          },
        ],
        confidence: 0.75,
        businessId: "biz-backward-exec",
        stage: "COMPLETED",
      },
      operation: "COMPLETE",
      timestamp: new Date().toISOString(),
      version: 1,
    });

    await new Promise((r) => setTimeout(r, 100));

    assert.equal(completedId, "exec-plan-backward-exec", "should process flat envelope events");

    const stored = await executionEngine.getPipeline().memory.findByPlanId("plan-backward-exec");
    assert.equal(stored.length, 1, "execution should be stored");
    assert.equal(stored[0].completedSteps, 2, "all steps should complete");
    assert.ok(stored[0].executionReport.length > 0, "should generate execution report");
    assert.ok(stored[0].duration.length > 0, "should calculate duration");

    await executionEngine.stop();
  });
});
