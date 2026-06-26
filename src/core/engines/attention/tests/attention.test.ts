import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { AttentionFactory } from "../AttentionFactory";
import { AttentionValidator } from "../AttentionValidator";
import { AttentionLifecycle } from "../AttentionLifecycle";
import { AttentionPriority } from "../AttentionPriority";
import { AttentionFocus } from "../AttentionFocus";
import { AttentionCompetition } from "../AttentionCompetition";
import { AttentionAllocation } from "../AttentionAllocation";
import { AttentionContext } from "../AttentionContext";
import { AttentionGoals } from "../AttentionGoals";
import { AttentionUrgency } from "../AttentionUrgency";
import { AttentionRisk } from "../AttentionRisk";
import { AttentionOpportunity } from "../AttentionOpportunity";
import { AttentionInterruptions } from "../AttentionInterruptions";
import { AttentionScoring } from "../AttentionScoring";
import { AttentionQuality } from "../AttentionQuality";
import { AttentionConfidence } from "../AttentionConfidence";
import { AttentionPolicyEngine } from "../AttentionPolicies";
import { AttentionScheduler } from "../AttentionScheduler";
import { AttentionQueue } from "../AttentionQueue";
import { AttentionMetrics } from "../AttentionMetrics";
import { AttentionMemory } from "../AttentionMemory";
import {
  AttentionValidationError,
  InvalidAttentionLifecycleTransitionError,
  AttentionBudgetExhaustedError,
  AttentionBudgetExceededError,
} from "../AttentionErrors";
import { AttentionInput, Attention, SourceType, AttentionStage } from "../AttentionTypes";

function makeInput(overrides?: Partial<AttentionInput>): AttentionInput {
  return {
    sourceId: "src_001",
    sourceType: "OBSERVATION",
    sourceIds: ["src_001", "src_002"],
    name: "Kitchen Timer Alert",
    category: "KITCHEN_EMERGENCY",
    urgency: 0.8,
    importance: 0.7,
    risk: 0.6,
    opportunity: 0.3,
    businessValue: 0.7,
    humanValue: 0.5,
    businessId: "biz_001",
    ...overrides,
  };
}

function makeAttention(factory: AttentionFactory, overrides?: Partial<AttentionInput>): Attention {
  return factory.createFromInput(makeInput(overrides));
}

// --- Creation ---
describe("Attention creation", () => {
  it("creates attention from valid input", () => {
    const factory = new AttentionFactory();
    const input = makeInput();
    const attention = factory.createFromInput(input);

    assert.equal(attention.identity.name, "Kitchen Timer Alert");
    assert.equal(attention.identity.sourceId, "src_001");
    assert.equal(attention.stage, "CANDIDATE");
    assert.equal(attention.priority, 0);
    assert.equal(attention.allocation, 0);
    assert.equal(attention.age, 0);
    assert.equal(attention.escalationLevel, "NONE");
    assert.equal(attention.versions.length, 1);
    assert.ok(attention.id.startsWith("att_"));
  });

  it("creates attention with unique IDs", () => {
    const factory = new AttentionFactory();
    const a = factory.createFromInput(makeInput());
    const b = factory.createFromInput(makeInput());
    assert.notEqual(a.id, b.id);
  });
});

// --- Validation ---
describe("Attention validation", () => {
  it("validates required fields", () => {
    const validator = new AttentionValidator();
    assert.throws(() => validator.validateInput(makeInput({ sourceId: "" })), AttentionValidationError);
    assert.throws(() => validator.validateInput(makeInput({ name: "" })), AttentionValidationError);
    assert.throws(() => validator.validateInput(makeInput({ businessId: "" })), AttentionValidationError);
  });

  it("validates numeric range", () => {
    const validator = new AttentionValidator();
    assert.throws(() => validator.validateInput(makeInput({ urgency: 1.5 })), AttentionValidationError);
    assert.throws(() => validator.validateInput(makeInput({ importance: -0.1 })), AttentionValidationError);
    assert.throws(() => validator.validateInput(makeInput({ risk: 2 })), AttentionValidationError);
  });

  it("validates budget constraints", () => {
    const validator = new AttentionValidator();
    assert.throws(() => validator.validateBudget(0.6, 0.5, 0.5), AttentionValidationError);
    assert.throws(() => validator.validateBudget(0.6, 0.8, 0.4), AttentionValidationError);
  });

  it("passes valid budget", () => {
    const validator = new AttentionValidator();
    assert.doesNotThrow(() => validator.validateBudget(0.3, 0.8, 0.5));
  });
});

// --- Lifecycle ---
describe("Attention lifecycle", () => {
  it("allows valid transitions", () => {
    const lifecycle = new AttentionLifecycle();
    assert.ok(lifecycle.canTransition("CANDIDATE", "OBSERVED"));
    assert.ok(lifecycle.canTransition("OBSERVED", "SCORED"));
    assert.ok(lifecycle.canTransition("SCORED", "QUEUED"));
    assert.ok(lifecycle.canTransition("QUEUED", "FOCUSED"));
    assert.ok(lifecycle.canTransition("FOCUSED", "MAINTAINED"));
    assert.ok(lifecycle.canTransition("FOCUSED", "INTERRUPTED"));
    assert.ok(lifecycle.canTransition("INTERRUPTED", "DEFERRED"));
    assert.ok(lifecycle.canTransition("DEFERRED", "QUEUED"));
    assert.ok(lifecycle.canTransition("RELEASED", "ARCHIVED"));
  });

  it("blocks invalid transitions", () => {
    const lifecycle = new AttentionLifecycle();
    assert.ok(!lifecycle.canTransition("CANDIDATE", "FOCUSED"));
    assert.ok(!lifecycle.canTransition("ARCHIVED", "QUEUED"));
    assert.ok(!lifecycle.canTransition("RELEASED", "FOCUSED"));
  });

  it("throws on invalid transition", () => {
    const lifecycle = new AttentionLifecycle();
    assert.throws(() => lifecycle.validateTransition("CANDIDATE", "FOCUSED"), InvalidAttentionLifecycleTransitionError);
  });

  it("identifies active and terminal stages", () => {
    const lifecycle = new AttentionLifecycle();
    assert.ok(lifecycle.isActive("FOCUSED"));
    assert.ok(lifecycle.isActive("QUEUED"));
    assert.ok(!lifecycle.isActive("ARCHIVED"));
    assert.ok(lifecycle.isTerminal("ARCHIVED"));
    assert.ok(!lifecycle.isTerminal("QUEUED"));
  });
});

// --- Priority ---
describe("Attention priority", () => {
  it("computes priority from factors", () => {
    const factory = new AttentionFactory();
    const priority = new AttentionPriority();
    const attention = makeAttention(factory);

    const result = priority.compute(attention);
    assert.ok(result.priority >= 0);
    assert.ok(result.priority <= 1);
    assert.ok(Object.keys(result.breakdown).length > 0);
  });

  it("escalates when urgency is high", () => {
    const factory = new AttentionFactory();
    const priority = new AttentionPriority();
    const attention = makeAttention(factory, { urgency: 0.9, importance: 0.8 });

    assert.ok(priority.shouldEscalate(attention));
    assert.equal(priority.getEscalationLevel(attention), "CRITICAL");
  });

  it("detects escalation levels", () => {
    const factory = new AttentionFactory();
    const priority = new AttentionPriority();
    const low = makeAttention(factory, { urgency: 0.1 });
    const high = makeAttention(factory, { urgency: 0.8, importance: 0.7, risk: 0.6 });

    assert.equal(priority.getEscalationLevel(low), "NONE");
    assert.equal(priority.getEscalationLevel(high), "HIGH");
  });
});

// --- Competition ---
describe("Attention competition", () => {
  it("ranks candidates by priority", () => {
    const factory = new AttentionFactory();
    const competition = new AttentionCompetition();
    const low = makeAttention(factory, { urgency: 0.2 });
    const medium = makeAttention(factory, { urgency: 0.5 });
    const high = makeAttention(factory, { urgency: 0.9 });

    const result = competition.rank([low, medium, high]);
    assert.equal(result[0].attention.id, high.id);
    assert.equal(result[2].attention.id, low.id);
  });

  it("selects a winner from candidates", () => {
    const factory = new AttentionFactory();
    const competition = new AttentionCompetition();
    const a = makeAttention(factory, { urgency: 0.3 });
    const b = makeAttention(factory, { urgency: 0.9 });

    const result = competition.compete([a, b]);
    assert.equal(result.winner?.id, b.id);
    assert.ok(result.rankings.length === 2);
  });
});

// --- Allocation ---
describe("Attention allocation", () => {
  it("allocates budget to items", () => {
    const factory = new AttentionFactory();
    const allocation = new AttentionAllocation();
    const attention = makeAttention(factory);

    const result = allocation.allocate(attention, 0.3);
    assert.equal(result.allocation, 0.3);
    assert.ok(result.remainingBudget < 1.0);
  });

  it("releases budget when done", () => {
    const factory = new AttentionFactory();
    const allocation = new AttentionAllocation();
    const attention = makeAttention(factory);

    const a = allocation.allocate(attention, 0.3);
    assert.equal(a.allocation, 0.3);

    const released = { ...attention, allocation: 0.3, budgetConsumption: a.budgetConsumption };
    const r = allocation.release(released);
    assert.equal(r.allocation, 0);
    assert.ok(r.remainingBudget > a.remainingBudget);
  });

  it("reallocates across items proportionally", () => {
    const allocation = new AttentionAllocation();
    const factory = new AttentionFactory();

    const items = [
      { ...makeAttention(factory, { urgency: 0.9 }), priority: 0.8 } as Attention,
      { ...makeAttention(factory, { urgency: 0.5 }), priority: 0.4 } as Attention,
      { ...makeAttention(factory, { urgency: 0.2 }), priority: 0.2 } as Attention,
    ];

    const results = allocation.reallocate(items);
    assert.equal(results.length, 3);
    assert.ok(results[0].allocation >= results[1].allocation);
  });

  it("tracks budget utilization", () => {
    const allocation = new Allocation();
    assert.equal(allocation.getUtilization(), 0);

    const factory = new AttentionFactory();
    const attention = makeAttention(factory);
    allocation.allocate(attention, 0.5);
    assert.ok(allocation.getUtilization() > 0);
  });
});

// This needs a valid import name:
class Allocation extends AttentionAllocation {}

// --- Focus ---
describe("Attention focus", () => {
  it("focuses on an item", () => {
    const factory = new AttentionFactory();
    const focus = new AttentionFocus();
    const attention = makeAttention(factory);

    const result = focus.focus(attention, "kitchen");
    assert.equal(result.attentionId, attention.id);
    assert.equal(focus.getState().currentId, attention.id);
  });

  it("defocuses correctly", () => {
    const focus = new AttentionFocus();
    focus.defocus();
    assert.equal(focus.getState().currentId, null);
  });

  it("determines persistence", () => {
    const factory = new AttentionFactory();
    const focus = new AttentionFocus();
    const highPriority = makeAttention(factory, { urgency: 0.9, importance: 0.9 });

    const score = focus.computePersistenceScore(highPriority);
    assert.ok(score > 0.5);
  });

  it("detects context switches", () => {
    const focus = new AttentionFocus();
    assert.ok(!focus.shouldContextSwitch("kitchen", "kitchen"));
  });
});

// --- Context ---
describe("Attention context", () => {
  it("computes relevance", () => {
    const context = new AttentionContext();
    const result = context.computeRelevance("OBSERVATION", "KITCHEN_EMERGENCY", 0.8, 0.7);
    assert.ok(result.relevance >= 0);
    assert.ok(result.relevance <= 1);
    assert.ok(typeof result.contextSession === "string");
  });

  it("detects load levels", () => {
    const context = new AttentionContext();
    assert.ok(!context.isHighLoad());
    context.updateContext({ loadLevel: 0.9 });
    assert.ok(context.isHighLoad());
    assert.equal(context.getLoadDescription(), "critical");
  });
});

// --- Urgency ---
describe("Attention urgency", () => {
  it("assesses urgency correctly", () => {
    const urgency = new AttentionUrgency();
    const result = urgency.evaluate(0.9, 0.8, 0.7, 0.8, 0.6, 0.5);

    assert.ok(result.score > 0.5);
    assert.ok(result.timeCritical);
    assert.ok(result.requiresImmediateAction);
    assert.ok(Object.keys(result.factors).length > 0);
  });

  it("determines escalation need", () => {
    const urgency = new AttentionUrgency();
    assert.ok(urgency.requiresEscalation(0.9, 0.7, 0.5));
    assert.ok(!urgency.requiresEscalation(0.3, 0.3, 0.3));
  });
});

// --- Risk ---
describe("Attention risk", () => {
  it("assesses risk severity", () => {
    const risk = new AttentionRisk();
    const result = risk.evaluate(0.9, 0.8, 0.7, 0.6);

    assert.ok(result.score > 0.5);
    assert.ok(result.requiresMitigation);
    assert.ok(["critical", "high", "medium"].includes(result.severity));
  });

  it("detects high risk", () => {
    const risk = new AttentionRisk();
    assert.ok(risk.isHighRisk(0.8, 0.7));
    assert.ok(!risk.isHighRisk(0.3, 0.3));
  });
});

// --- Opportunity ---
describe("Attention opportunity", () => {
  it("assesses opportunity value", () => {
    const opportunity = new AttentionOpportunity();
    const result = opportunity.evaluate(0.8, 0.7, 0.6, 0.5, 0.4);

    assert.ok(result.score > 0.3);
    assert.ok(result.category.length > 0);
    assert.ok(result.potentialValue > 0);
  });

  it("identifies high opportunity", () => {
    const opportunity = new AttentionOpportunity();
    assert.ok(opportunity.isHighOpportunity(0.7, 0.5));
    assert.ok(!opportunity.isHighOpportunity(0.2, 0.3));
  });
});

// --- Interruptions ---
describe("Attention interruptions", () => {
  it("creates interruptions with correct level", () => {
    const interruptions = new AttentionInterruptions();
    const critical = interruptions.createInterruption("src_001", "RUNTIME_EVENT", 0.95, "Kitchen fire", true);
    assert.equal(critical.level, "CRITICAL");
    assert.ok(critical.requiresImmediateAction);

    const low = interruptions.createInterruption("src_002", "OBSERVATION", 0.2, "Minor note", false);
    assert.equal(low.level, "NONE");
  });

  it("escalates attention items", () => {
    const f = new AttentionFactory();
    const interruptions = new AttentionInterruptions();
    const attention = makeAttention(f);

    const result = interruptions.escalate(attention);
    assert.ok(result.escalated);
    assert.equal(result.from, "NONE");
  });
});

// --- Scoring ---
describe("Attention scoring", () => {
  it("computes all scoring factors", () => {
    const factory = new AttentionFactory();
    const scoring = new AttentionScoring();
    const attention = makeAttention(factory);

    const result = scoring.evaluate(attention);
    assert.ok(result.baseScore > 0);
    assert.ok(result.finalScore > 0);
    assert.ok(result.decayFactor === 1);
  });

  it("decay reduces score over cycles", () => {
    const factory = new AttentionFactory();
    const scoring = new AttentionScoring();
    const fresh = makeAttention(factory);
    const aged = {
      ...fresh,
      metadata: { ...fresh.metadata, decayCycles: 10 },
    };

    const freshScore = scoring.evaluate(fresh);
    const agedScore = scoring.evaluate(aged);
    assert.ok(agedScore.decayFactor < freshScore.decayFactor);
  });

  it("computes allocation from priority", () => {
    const factory = new AttentionFactory();
    const scoring = new AttentionScoring();
    const attention = { ...makeAttention(factory), priority: 0.8, scoringFactors: { ...scoring.evaluate(makeAttention(factory)) } };

    const allocation = scoring.computeAllocation(attention, 0.8, 0.5);
    assert.ok(allocation > 0);
    assert.ok(allocation <= 0.5);
  });
});

// --- Quality ---
describe("Attention quality", () => {
  it("evaluates quality dimensions", () => {
    const factory = new AttentionFactory();
    const quality = new AttentionQuality();
    const attention = makeAttention(factory);

    const result = quality.evaluate(attention);
    assert.ok(result.qualityScore > 0);
    assert.ok(result.profile.priorityAccuracy >= 0);
    assert.ok(result.profile.focusStability >= 0);
  });
});

// --- Confidence ---
describe("Attention confidence", () => {
  it("computes confidence score", () => {
    const factory = new AttentionFactory();
    const confidence = new AttentionConfidence();
    const attention = makeAttention(factory, { urgency: 0.8, importance: 0.7 });

    const attentionWithScoring = {
      ...attention,
      scoringFactors: { ...attention.scoringFactors, baseScore: 0.7, finalScore: 0.75 },
    };
    const qualityProfile = new AttentionQuality().evaluate(attention).profile;

    const score = confidence.compute(attentionWithScoring, qualityProfile);
    assert.ok(score > 0);
    assert.ok(score <= 1);
  });
});

// --- Metrics ---
describe("Attention metrics", () => {
  it("tracks creation and lifecycle events", () => {
    const metrics = new AttentionMetrics();
    assert.equal(metrics.totalAttentionCreated, 0);

    metrics.recordCreated();
    assert.equal(metrics.totalAttentionCreated, 1);

    metrics.recordFocused();
    assert.equal(metrics.focusedCount, 1);

    metrics.recordInterrupted();
    assert.equal(metrics.interruptedCount, 1);

    metrics.recordReleased();
    assert.equal(metrics.releasedCount, 1);

    const snapshot = metrics.getSnapshot();
    assert.equal(snapshot.totalAttentionCreated, 1);
  });

  it("tracks budget", () => {
    const metrics = new AttentionMetrics();
    metrics.updateBudget(1.0, 0.6);
    assert.equal(metrics.budgetTotal, 1.0);
    assert.equal(metrics.budgetAvailable, 0.6);
  });
});

// --- Memory ---
describe("Attention memory", () => {
  it("stores and retrieves items", () => {
    const factory = new AttentionFactory();
    const memory = new AttentionMemory();
    const attention = makeAttention(factory);

    memory.store(attention);
    assert.equal(memory.retrieve(attention.id)?.id, attention.id);
    assert.equal(memory.count(), 1);
  });

  it("finds by stage", () => {
    const factory = new AttentionFactory();
    const memory = new AttentionMemory();
    const f = makeAttention(factory);
    const g = makeAttention(factory);

    memory.store({ ...f, stage: "QUEUED" as AttentionStage });
    memory.store({ ...g, stage: "FOCUSED" as AttentionStage });

    assert.equal(memory.findByStage("QUEUED").length, 1);
    assert.equal(memory.findByStage("FOCUSED").length, 1);
  });

  it("finds active items", () => {
    const factory = new AttentionFactory();
    const memory = new AttentionMemory();

    memory.store(makeAttention(factory));
    memory.store({ ...makeAttention(factory), stage: "FOCUSED" as AttentionStage });
    memory.store({ ...makeAttention(factory), stage: "ARCHIVED" as AttentionStage });

    assert.equal(memory.findActive().length, 2);
  });
});

// --- Queue ---
describe("Attention queue", () => {
  it("enqueues and dequeues by priority", () => {
    const factory = new AttentionFactory();
    const queue = new AttentionQueue();
    const low = makeAttention(factory, { urgency: 0.2 });
    const high = makeAttention(factory, { urgency: 0.9 });

    queue.enqueue(low);
    queue.enqueue(high);

    assert.equal(queue.size(), 2);
    assert.equal(queue.dequeue()?.id, high.id);
    assert.equal(queue.dequeue()?.id, low.id);
  });

  it("peek returns highest priority", () => {
    const factory = new AttentionFactory();
    const queue = new AttentionQueue();
    const high = makeAttention(factory, { urgency: 0.9 });

    queue.enqueue(makeAttention(factory, { urgency: 0.2 }));
    queue.enqueue(high);
    queue.enqueue(makeAttention(factory, { urgency: 0.5 }));

    assert.equal(queue.peek()?.id, high.id);
  });

  it("checks containment", () => {
    const factory = new AttentionFactory();
    const queue = new AttentionQueue();
    const attention = makeAttention(factory);

    queue.enqueue(attention);
    assert.ok(queue.contains(attention.id));
    queue.remove(attention.id);
    assert.ok(!queue.contains(attention.id));
  });
});

// --- Scheduler ---
describe("Attention scheduler", () => {
  it("applies decay", () => {
    const factory = new AttentionFactory();
    const scheduler = new AttentionScheduler();
    const attention = makeAttention(factory);

    const decayed = scheduler.applyDecay(attention);
    assert.ok(decayed.priority <= attention.priority);
    assert.equal(decayed.metadata.decayCycles, 1);
  });

  it("applies starvation boost", () => {
    const factory = new AttentionFactory();
    const scheduler = new AttentionScheduler();
    const attention = makeAttention(factory);

    const boosted = scheduler.applyStarvationBoost(attention, 0.1);
    assert.ok(boosted.priority >= attention.priority);
    assert.equal(boosted.metadata.starveBoostCount, 1);
  });

  it("resets decay", () => {
    const factory = new AttentionFactory();
    const scheduler = new AttentionScheduler();
    const attention = makeAttention(factory);
    const decayed = scheduler.applyDecay(attention);
    const reset = scheduler.resetDecay(decayed);
    assert.equal(reset.metadata.decayCycles, 0);
  });
});

// --- Goals ---
describe("Attention goals", () => {
  it("computes alignment with active goals", () => {
    const goals = new AttentionGoals();
    goals.addGoal({ id: "g1", name: "kitchen", priority: 0.9, active: true, category: "KITCHEN_EMERGENCY", metadata: {} });

    const result = goals.computeAlignment("KITCHEN_EMERGENCY", "KITCHEN_EMERGENCY", 0.8, 0.7);
    assert.ok(result.alignmentScore > 0);
    assert.equal(result.matchedGoals.length, 1);
  });

  it("removes goals", () => {
    const goals = new AttentionGoals();
    goals.addGoal({ id: "g1", name: "test", priority: 0.5, active: true, category: "GENERAL", metadata: {} });
    assert.equal(goals.getActiveGoals().length, 1);
    goals.removeGoal("g1");
    assert.equal(goals.getActiveGoals().length, 0);
  });
});

// --- Policy Engine ---
describe("Attention policy engine", () => {
  it("suggests policies based on load", () => {
    const policyEngine = new AttentionPolicyEngine();
    assert.equal(policyEngine.suggestPolicy(0.9, false), "high_load");
    assert.equal(policyEngine.suggestPolicy(0.3, true), "emergency_mode");
    assert.equal(policyEngine.suggestPolicy(0.3, false), "standard_attention");
  });
});
