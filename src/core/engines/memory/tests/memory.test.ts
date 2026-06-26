import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { MemoryFactory } from "../MemoryFactory";
import { MemoryValidator } from "../MemoryValidator";
import { MemoryLifecycle } from "../MemoryLifecycle";
import { MemoryQuality } from "../MemoryQuality";
import { MemoryConfidence } from "../MemoryConfidence";
import { MemoryScoring } from "../MemoryScoring";
import { MemoryConsolidation } from "../MemoryConsolidation";
import { MemoryRetention } from "../MemoryRetention";
import { MemoryForgetting } from "../MemoryForgetting";
import { MemoryStrength } from "../MemoryStrength";
import { MemoryActivation } from "../MemoryActivation";
import { MemoryAssociations } from "../MemoryAssociations";
import { MemoryRelationships } from "../MemoryRelationships";
import { MemoryVersioning } from "../MemoryVersioning";
import { MemoryIndex } from "../MemoryIndex";
import { MemorySearch } from "../MemorySearch";
import { MemoryCompression } from "../MemoryCompression";
import { MemoryMetrics } from "../MemoryMetrics";
import { MemoryPolicyEngine } from "../MemoryPolicies";
import { MemoryValidationError, InvalidMemoryLifecycleTransitionError, DuplicateMemoryError, MemoryForgettingError, MemoryAssociationError } from "../MemoryErrors";
import { MemoryInput, Memory, MemoryCategory, AssociationType, MemoryStage } from "../MemoryTypes";

function makeInput(overrides?: Partial<MemoryInput>): MemoryInput {
  return {
    evidenceId: "evd_001",
    patternId: "pat_001",
    observationIds: ["obs_001", "obs_002"],
    name: "Test Pattern",
    description: "A test memory",
    category: "SALES_PATTERN",
    strength: 0.7,
    confidence: 0.8,
    businessId: "biz_001",
    ...overrides,
  };
}

function makeMemory(factory: MemoryFactory, overrides?: Partial<MemoryInput>): Memory {
  return factory.createFromInput(makeInput(overrides), "Test description");
}

// --- Memory creation ---
describe("Memory creation", () => {
  it("creates a memory from valid input", () => {
    const factory = new MemoryFactory();
    const input = makeInput();
    const memory = factory.createFromInput(input, "A test memory");

    assert.equal(memory.identity.name, "Test Pattern");
    assert.equal(memory.identity.evidenceId, "evd_001");
    assert.equal(memory.identity.patternId, "pat_001");
    assert.equal(memory.stage, "WORKING");
    assert.equal(memory.strength, 0.7);
    assert.equal(memory.confidence, 0.8);
    assert.equal(memory.activationScore, 0.5);
    assert.equal(memory.retentionScore, 0.5);
    assert.equal(memory.associations.length, 0);
    assert.equal(memory.versions.length, 1);
    assert.ok(memory.id.startsWith("mem_"));
  });

  it("creates memories with unique IDs", () => {
    const factory = new MemoryFactory();
    const a = factory.createFromInput(makeInput(), "");
    const b = factory.createFromInput(makeInput(), "");
    assert.notEqual(a.id, b.id);
  });
});

// --- Memory validation ---
describe("Memory validation", () => {
  it("validates required fields", () => {
    const validator = new MemoryValidator();
    assert.throws(() => validator.validateInput(makeInput({ evidenceId: "" })), MemoryValidationError);
    assert.throws(() => validator.validateInput(makeInput({ patternId: "" })), MemoryValidationError);
    assert.throws(() => validator.validateInput(makeInput({ name: "" })), MemoryValidationError);
    assert.throws(() => validator.validateInput(makeInput({ businessId: "" })), MemoryValidationError);
  });

  it("validates numeric ranges", () => {
    const validator = new MemoryValidator();
    assert.throws(() => validator.validateInput(makeInput({ strength: -0.1 })), MemoryValidationError);
    assert.throws(() => validator.validateInput(makeInput({ strength: 1.1 })), MemoryValidationError);
    assert.throws(() => validator.validateInput(makeInput({ confidence: -0.1 })), MemoryValidationError);
    assert.throws(() => validator.validateInput(makeInput({ confidence: 1.1 })), MemoryValidationError);
  });

  it("validates memory object", () => {
    const validator = new MemoryValidator();
    const factory = new MemoryFactory();
    const memory = factory.createFromInput(makeInput(), "");
    assert.doesNotThrow(() => validator.validateMemory(memory));
  });

  it("validates memory input from record", () => {
    const validator = new MemoryValidator();
    const input = validator.validateMemoryInput({
      evidence: {
        id: "evd_001",
        identity: { patternId: "pat_001", patternName: "Test" },
        provenance: { sourceObservations: ["obs_001"] },
        score: 0.7,
        confidence: 0.8,
        description: "Test",
      },
    });
    assert.equal(input.evidenceId, "evd_001");
    assert.equal(input.patternId, "pat_001");
    assert.ok(input.observationIds.length > 0);
  });
});

// --- Memory lifecycle ---
describe("Memory lifecycle", () => {
  it("validates allowed transitions", () => {
    const lifecycle = new MemoryLifecycle();
    assert.doesNotThrow(() => lifecycle.validateTransition("WORKING", "CANDIDATE"));
    assert.doesNotThrow(() => lifecycle.validateTransition("CANDIDATE", "SHORT_TERM"));
    assert.doesNotThrow(() => lifecycle.validateTransition("SHORT_TERM", "STABILIZING"));
    assert.doesNotThrow(() => lifecycle.validateTransition("STABILIZING", "CONSOLIDATED"));
    assert.doesNotThrow(() => lifecycle.validateTransition("CONSOLIDATED", "LONG_TERM"));
    assert.doesNotThrow(() => lifecycle.validateTransition("LONG_TERM", "SEMANTIC"));
    assert.doesNotThrow(() => lifecycle.validateTransition("SEMANTIC", "HISTORICAL"));
    assert.doesNotThrow(() => lifecycle.validateTransition("HISTORICAL", "ARCHIVED"));
  });

  it("rejects invalid transitions", () => {
    const lifecycle = new MemoryLifecycle();
    assert.throws(() => lifecycle.validateTransition("WORKING", "LONG_TERM"), InvalidMemoryLifecycleTransitionError);
    assert.throws(() => lifecycle.validateTransition("ARCHIVED", "WORKING"), InvalidMemoryLifecycleTransitionError);
  });

  it("classifies stages correctly", () => {
    const lifecycle = new MemoryLifecycle();
    assert.ok(lifecycle.isActive("SHORT_TERM"));
    assert.ok(lifecycle.isActive("LONG_TERM"));
    assert.ok(!lifecycle.isActive("WORKING"));
    assert.ok(lifecycle.isTerminal("ARCHIVED"));
    assert.ok(lifecycle.isConsolidated("CONSOLIDATED"));
    assert.ok(lifecycle.isConsolidated("LONG_TERM"));
    assert.ok(lifecycle.isConsolidated("SEMANTIC"));
    assert.ok(lifecycle.isEphemeral("WORKING"));
    assert.ok(lifecycle.isEphemeral("CANDIDATE"));
    assert.ok(lifecycle.isForgotten("HISTORICAL"));
    assert.ok(lifecycle.isForgotten("ARCHIVED"));
  });
});

// --- Memory factory clone ---
describe("Memory factory clone", () => {
  it("clones with stage transition", () => {
    const factory = new MemoryFactory();
    const memory = factory.createFromInput(makeInput(), "");
    const updated = factory.cloneWithTransition(memory, "CANDIDATE", { strength: 0.8 });

    assert.equal(updated.stage, "CANDIDATE");
    assert.equal(updated.strength, 0.8);
    assert.equal(updated.versions.length, 2);
    // provenance
    assert.equal(updated.provenance.creationTimeline.length, 2);
  });
});

// --- Memory quality ---
describe("Memory quality", () => {
  it("evaluates quality dimensions", () => {
    const factory = new MemoryFactory();
    const quality = new MemoryQuality();
    const memory = factory.createFromInput(makeInput({ strength: 0.8, confidence: 0.9 }), "A detailed test memory description for quality evaluation");

    const result = quality.evaluate(memory);
    assert.ok(result.qualityScore > 0);
    assert.ok(result.profile.retention >= 0);
    assert.ok(result.profile.recall >= 0);
    assert.ok(result.profile.traceability >= 0);
  });
});

// --- Memory confidence ---
describe("Memory confidence", () => {
  it("computes confidence from quality", () => {
    const factory = new MemoryFactory();
    const quality = new MemoryQuality();
    const confidence = new MemoryConfidence();

    const memory = factory.createFromInput(makeInput({ strength: 0.8, confidence: 0.9 }), "Test");
    const profile = quality.evaluate(memory).profile;
    const score = confidence.compute(memory, profile);

    assert.ok(score >= 0.01);
    assert.ok(score <= 0.99);
  });

  it("records confidence history", () => {
    const confidence = new MemoryConfidence();
    confidence.recordHistory("mem_001", 0.5, 0.7, "strengthened");
    const history = confidence.getHistory("mem_001");
    assert.equal(history.length, 1);
    assert.equal(history[0].previousValue, 0.5);
    assert.equal(history[0].newValue, 0.7);
  });
});

// --- Memory scoring ---
describe("Memory scoring", () => {
  it("computes retention, activation, consolidation readiness, forgetting risk", () => {
    const factory = new MemoryFactory();
    const scoring = new MemoryScoring();

    const memory = factory.createFromInput(makeInput({ strength: 0.7, confidence: 0.8 }), "Test");
    const result = scoring.evaluate(memory);

    assert.ok(result.retentionScore >= 0);
    assert.ok(result.activationScore >= 0);
    assert.ok(result.consolidationReadiness >= 0);
    assert.ok(result.forgettingRisk >= 0);
  });
});

// --- Memory consolidation ---
describe("Memory consolidation", () => {
  it("promotes short-term to stabilizing with sufficient access", () => {
    const factory = new MemoryFactory();
    const lifecycle = new MemoryLifecycle();
    const consolidation = new MemoryConsolidation(factory, lifecycle);

    let memory = factory.createFromInput(makeInput({ strength: 0.5 }), "Test");
    memory = { ...memory, stage: "SHORT_TERM" as MemoryStage };
    const withAccess = { ...memory, metadata: { ...memory.metadata, totalAccessCount: 5 } };

    const result = consolidation.evaluateConsolidation(withAccess);
    assert.ok(result.consolidated);
    assert.equal(result.targetStage, "STABILIZING");
  });

  it("promotes stabilizing to consolidated with versions", () => {
    const factory = new MemoryFactory();
    const lifecycle = new MemoryLifecycle();
    const consolidation = new MemoryConsolidation(factory, lifecycle);

    let memory = factory.createFromInput(makeInput({ strength: 0.6 }), "Test");
    memory = { ...memory, stage: "STABILIZING" };
    memory = factory.cloneWithTransition(memory, "STABILIZING", { strength: 0.6 });

    const result = consolidation.evaluateConsolidation(memory);
    assert.ok(result.consolidated);
    assert.equal(result.targetStage, "CONSOLIDATED");
  });

  it("merges multiple memories", () => {
    const factory = new MemoryFactory();
    const lifecycle = new MemoryLifecycle();
    const consolidation = new MemoryConsolidation(factory, lifecycle);

    const a = factory.createFromInput(makeInput({ name: "A" }), "A");
    const b = factory.createFromInput(makeInput({ name: "B" }), "B");

    const merged = consolidation.merge([a, b]);
    assert.ok(merged.strength > 0);
    assert.equal(merged.provenance.mergedFromIds.length, 2);
  });
});

// --- Memory retention ---
describe("Memory retention", () => {
  it("computes retention score", () => {
    const factory = new MemoryFactory();
    const retention = new MemoryRetention();
    const memory = factory.createFromInput(makeInput(), "Test");
    const score = retention.computeRetentionScore(memory);
    assert.ok(score >= 0);
    assert.ok(score <= 1);
  });

  it("applies decay", () => {
    const factory = new MemoryFactory();
    const retention = new MemoryRetention();
    const memory = factory.createFromInput(makeInput(), "Test");
    const decayed = retention.applyDecay(memory);
    assert.ok(decayed.retentionScore >= 0);
  });

  it("applies access boost", () => {
    const factory = new MemoryFactory();
    const retention = new MemoryRetention();
    const memory = factory.createFromInput(makeInput(), "Test");
    const accessed = retention.applyAccess(memory);
    assert.equal(accessed.metadata.totalAccessCount, 1);
  });
});

// --- Memory forgetting ---
describe("Memory forgetting", () => {
  it("detects candidates for forgetting", () => {
    const factory = new MemoryFactory();
    const lifecycle = new MemoryLifecycle();
    const forgetting = new MemoryForgetting(factory, lifecycle);

    const memory = factory.createFromInput(makeInput({ strength: 0.1 }), "Test");
    const stale = {
      ...memory,
      retentionScore: 0.05,
      metadata: {
        ...memory.metadata,
        lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      },
    };

    assert.ok(forgetting.shouldForget(stale));
  });

  it("forgets a memory", () => {
    const factory = new MemoryFactory();
    const lifecycle = new MemoryLifecycle();
    const forgetting = new MemoryForgetting(factory, lifecycle);

    const memory = factory.createFromInput(makeInput(), "Test");
    const shortTerm = { ...memory, stage: "SHORT_TERM" as MemoryStage };
    const forgotten = forgetting.forget(shortTerm);
    assert.equal(forgotten.stage, "HISTORICAL");
    assert.ok(forgotten.strength < memory.strength);
  });

  it("reactivates a forgotten memory", () => {
    const factory = new MemoryFactory();
    const lifecycle = new MemoryLifecycle();
    const forgetting = new MemoryForgetting(factory, lifecycle);

    const memory = factory.createFromInput(makeInput(), "Test");
    const shortTerm = { ...memory, stage: "SHORT_TERM" as MemoryStage };
    const forgotten = forgetting.forget(shortTerm);
    const reactivated = forgetting.reactivate(forgotten);
    assert.equal(reactivated.stage, "SHORT_TERM");
    assert.ok(reactivated.activationScore >= 0.8);
    assert.ok(reactivated.strength > forgotten.strength);
  });
});

// --- Memory strength ---
describe("Memory strength", () => {
  it("strengthens a memory", () => {
    const factory = new MemoryFactory();
    const strength = new MemoryStrength();
    const memory = factory.createFromInput(makeInput(), "Test");
    const strengthened = strength.strengthen(memory, 0.1);
    assert.ok(Math.abs(strengthened.strength - 0.8) < 0.001);
    assert.ok(strengthened.recallScore > memory.recallScore);
  });

  it("weakens a memory", () => {
    const factory = new MemoryFactory();
    const strength = new MemoryStrength();
    const memory = factory.createFromInput(makeInput(), "Test");
    const weakened = strength.weaken(memory, 0.2);
    assert.ok(Math.abs(weakened.strength - 0.5) < 0.001);
  });
});

// --- Memory activation ---
describe("Memory activation", () => {
  it("activates a memory", () => {
    const factory = new MemoryFactory();
    const activation = new MemoryActivation();
    const memory = factory.createFromInput(makeInput(), "Test");
    const activated = activation.activate(memory);
    assert.ok(activated.activationScore > 0);
    assert.equal(activated.metadata.totalAccessCount, 1);
  });

  it("decays activation", () => {
    const factory = new MemoryFactory();
    const activation = new MemoryActivation();
    const memory = factory.createFromInput(makeInput(), "Test");
    const decayed = activation.decayActivation(memory, 0.2);
    assert.equal(decayed.activationScore, 0.3);
  });
});

// --- Memory associations ---
describe("Memory associations", () => {
  it("creates associations between memories", () => {
    const factory = new MemoryFactory();
    const associations = new MemoryAssociations();

    const a = factory.createFromInput(makeInput({ name: "A" }), "A");
    const b = factory.createFromInput(makeInput({ name: "B" }), "B");

    const updated = associations.associate(a, b, "CAUSAL", 0.8);
    assert.equal(updated.associations.length, 1);
    assert.equal(updated.associations[0].targetMemoryId, b.id);
    assert.equal(updated.associations[0].type, "CAUSAL");
  });

  it("reinforces existing associations", () => {
    const factory = new MemoryFactory();
    const associations = new MemoryAssociations();

    const a = factory.createFromInput(makeInput({ name: "A" }), "A");
    const b = factory.createFromInput(makeInput({ name: "B" }), "B");

    let updated = associations.associate(a, b, "CAUSAL", 0.5);
    const strength1 = updated.associations[0].strength;
    updated = associations.associate(updated, b, "CAUSAL", 0.5);
    assert.ok(updated.associations[0].strength > strength1);
  });

  it("detaches associations", () => {
    const factory = new MemoryFactory();
    const associations = new MemoryAssociations();

    const a = factory.createFromInput(makeInput({ name: "A" }), "A");
    const b = factory.createFromInput(makeInput({ name: "B" }), "B");

    let updated = associations.associate(a, b, "CAUSAL", 0.5);
    updated = associations.detach(updated, b.id);
    assert.equal(updated.associations.length, 0);
  });

  it("rejects self-association", () => {
    const factory = new MemoryFactory();
    const associations = new MemoryAssociations();
    const a = factory.createFromInput(makeInput(), "A");
    assert.throws(() => associations.associate(a, a, "CAUSAL", 1), MemoryAssociationError);
  });
});

// --- Memory relationships ---
describe("Memory relationships", () => {
  it("detects duplicates", () => {
    const factory = new MemoryFactory();
    const relationships = new MemoryRelationships();

    const a = factory.createFromInput(makeInput({ name: "A", strength: 0.7 }), "A");
    const b = factory.createFromInput(makeInput({ name: "B", strength: 0.72, patternId: "pat_001" }), "B");

    assert.ok(relationships.detectDuplicate(a, b));
  });

  it("detects corroboration", () => {
    const factory = new MemoryFactory();
    const relationships = new MemoryRelationships();

    const a = factory.createFromInput(makeInput({ name: "A", strength: 0.7, confidence: 0.8 }), "A");
    const b = factory.createFromInput(makeInput({ name: "B", strength: 0.75, confidence: 0.85 }), "B");

    const strength = relationships.detectCorroboration(a, b);
    assert.ok(strength > 0.5);
  });

  it("builds full relationship graph", () => {
    const factory = new MemoryFactory();
    const relationships = new MemoryRelationships();

    const a = factory.createFromInput(makeInput({ name: "A" }), "A");
    const b = factory.createFromInput(makeInput({ name: "B", patternId: "pat_001" }), "B");

    const rels = relationships.buildRelationships([a, b]);
    assert.ok(rels.length > 0);
  });
});

// --- Memory versioning ---
describe("Memory versioning", () => {
  it("tracks versions through transitions", () => {
    const factory = new MemoryFactory();
    const versioning = new MemoryVersioning();

    const memory = factory.createFromInput(makeInput(), "Test");
    assert.equal(versioning.getVersionCount(memory), 1);

    const v2 = factory.cloneWithTransition(memory, "CANDIDATE", { strength: 0.8 });
    assert.equal(versioning.getVersionCount(v2), 2);

    const latest = versioning.getLatestVersion(v2);
    assert.equal(latest.version, 2);

    const diff = versioning.diff(v2, 1, 2);
    assert.ok(diff);
    assert.ok(Math.abs(diff.strengthChange - 0.1) < 0.001);
  });
});

// --- Memory index ---
describe("Memory index", () => {
  it("indexes and retrieves by ID", () => {
    const factory = new MemoryFactory();
    const index = new MemoryIndex();
    const memory = factory.createFromInput(makeInput(), "Test");
    index.index(memory);
    assert.equal(index.getById(memory.id)?.id, memory.id);
  });

  it("indexes by category and stage", () => {
    const factory = new MemoryFactory();
    const index = new MemoryIndex();
    const memory = factory.createFromInput(makeInput({ category: "CUSTOMER_BEHAVIOR" }), "Test");
    index.index(memory);

    const byCat = index.getByCategory("CUSTOMER_BEHAVIOR");
    assert.equal(byCat.length, 1);

    const byStage = index.getByStage("WORKING");
    assert.equal(byStage.length, 1);
  });

  it("indexes by pattern and evidence ID", () => {
    const factory = new MemoryFactory();
    const index = new MemoryIndex();
    const memory = factory.createFromInput(makeInput({ patternId: "pat_001", evidenceId: "evd_001" }), "Test");
    index.index(memory);

    assert.equal(index.getByPatternId("pat_001").length, 1);
    assert.equal(index.getByEvidenceId("evd_001").length, 1);
  });

  it("removes from index", () => {
    const factory = new MemoryFactory();
    const index = new MemoryIndex();
    const memory = factory.createFromInput(makeInput(), "Test");
    index.index(memory);
    index.remove(memory.id);
    assert.equal(index.getById(memory.id), undefined);
  });
});

// --- Memory search ---
describe("Memory search", () => {
  it("searches by text", () => {
    const factory = new MemoryFactory();
    const index = new MemoryIndex();
    const search = new MemorySearch(index);

    const memory = factory.createFromInput(makeInput({ name: "UniquePattern" }), "Unique description");
    index.index(memory);

    const results = search.search({ text: "UniquePattern" });
    assert.equal(results.totalCount, 1);
  });

  it("filters by category and stage", () => {
    const factory = new MemoryFactory();
    const index = new MemoryIndex();
    const search = new MemorySearch(index);

    const memory = factory.createFromInput(makeInput({ category: "SALES_PATTERN" }), "Test");
    index.index(memory);

    const results = search.search({ category: "SALES_PATTERN", stage: "WORKING" });
    assert.equal(results.totalCount, 1);

    const noResults = search.search({ stage: "LONG_TERM" });
    assert.equal(noResults.totalCount, 0);
  });

  it("filters by strength range", () => {
    const factory = new MemoryFactory();
    const index = new MemoryIndex();
    const search = new MemorySearch(index);

    index.index(factory.createFromInput(makeInput({ strength: 0.5 }), "A"));
    index.index(factory.createFromInput(makeInput({ strength: 0.9 }), "B"));

    const results = search.search({ minStrength: 0.6 });
    assert.equal(results.totalCount, 1);
  });

  it("sorts results", () => {
    const factory = new MemoryFactory();
    const index = new MemoryIndex();
    const search = new MemorySearch(index);

    index.index(factory.createFromInput(makeInput({ strength: 0.5 }), "A"));
    index.index(factory.createFromInput(makeInput({ strength: 0.9, name: "B" }), "B"));

    const results = search.search({ sortBy: "strength", sortDirection: "desc" });
    assert.equal(results.memories[0].strength, 0.9);
  });
});

// --- Memory compression ---
describe("Memory compression", () => {
  it("compresses a memory", () => {
    const factory = new MemoryFactory();
    const compression = new MemoryCompression(factory);
    const memory = factory.createFromInput(makeInput(), "Test");
    const result = compression.compress(memory);
    assert.ok(result.stats.compressionRatio >= 0);
    assert.ok(result.stats.originalSize > 0);
    assert.ok(result.memory.compressionStats);
  });

  it("finds redundant memories", () => {
    const factory = new MemoryFactory();
    const compression = new MemoryCompression(factory);

    const a = factory.createFromInput(makeInput({ patternId: "pat_001", strength: 0.7 }), "A");
    const b = factory.createFromInput(makeInput({ patternId: "pat_001", strength: 0.72 }), "B");

    const candidates = compression.findAndMarkRedundant([a, b]);
    const redundant = candidates.filter((c) => c.redundant);
    assert.ok(redundant.length > 0);
  });
});

// --- Memory metrics ---
describe("Memory metrics", () => {
  it("tracks all metric dimensions", () => {
    const metrics = new MemoryMetrics();
    metrics.recordCreated();
    metrics.recordConsolidated();
    metrics.recordLongTerm();
    metrics.recordForgotten();
    metrics.recordArchived();
    metrics.recordMerge();
    metrics.recordCompression();
    metrics.recordReactivation();
    metrics.recordStrength(0.7);
    metrics.recordConfidence(0.8);
    metrics.recordRecallScore(0.6);
    metrics.recordAssociations(5);
    metrics.recordCategory("SALES_PATTERN");
    metrics.recordStage("WORKING");

    const snapshot = metrics.getSnapshot();
    assert.equal(snapshot.totalMemoriesCreated, 1);
    assert.equal(snapshot.consolidatedMemoryCount, 1);
    assert.equal(snapshot.averageStrength, 0.7);
    assert.equal(snapshot.totalAssociations, 5);
  });
});

// --- Memory policies ---
describe("Memory policies", () => {
  it("evaluates memory against standard policy", () => {
    const factory = new MemoryFactory();
    const policyEngine = new MemoryPolicyEngine();
    const memory = factory.createFromInput(makeInput({ strength: 0.7, confidence: 0.8 }), "Test");
    const withRecall = { ...memory, recallScore: 0.5 };

    const result = policyEngine.evaluate(withRecall, {
      name: "standard_retention",
      description: "",
      minimumStrength: 0.3,
      minimumConfidence: 0.3,
      minimumRecallScore: 0.2,
      requireConsolidation: false,
      associationThreshold: 0,
      maxDecayRate: 0.15,
    });

    assert.ok(result.passed);
  });

  it("suggests appropriate policy", () => {
    const factory = new MemoryFactory();
    const policyEngine = new MemoryPolicyEngine();
    const memory = factory.createFromInput(makeInput({ strength: 0.8, confidence: 0.9 }), "Test");
    const assoc = (id: string) => ({ targetMemoryId: id, type: "CAUSAL" as AssociationType, strength: 0.8, weight: 0.8, discoveredAt: "", lastReinforcedAt: "", metadata: {} });
    const withAssoc = { ...memory, associations: [assoc("a"), assoc("b"), assoc("c"), assoc("d"), assoc("e")] };

    const suggested = policyEngine.suggestPolicy(withAssoc);
    assert.equal(suggested, "long_term_promotion");
  });
});

// --- Memory lifecycle transitions ---
describe("Memory lifecycle transitions", () => {
  it("transitions through full lifecycle", () => {
    const factory = new MemoryFactory();
    const lifecycle = new MemoryLifecycle();

    let memory = factory.createFromInput(makeInput(), "Test");
    const transitions: MemoryStage[] = ["CANDIDATE", "SHORT_TERM", "STABILIZING", "CONSOLIDATED", "LONG_TERM", "SEMANTIC", "HISTORICAL", "ARCHIVED"];

    for (const target of transitions) {
      assert.ok(lifecycle.canTransition(memory.stage, target), `Cannot transition from ${memory.stage} to ${target}`);
      memory = factory.cloneWithTransition(memory, target);
      assert.equal(memory.stage, target);
    }
  });
});

// --- Memory retention policies per stage ---
describe("Memory retention policies", () => {
  it("returns appropriate decay rate per stage", () => {
    const retention = new MemoryRetention();
    const factory = new MemoryFactory();
    const memory = factory.createFromInput(makeInput(), "Test");

    const workingDecay = retention.getDecayRate(memory);
    assert.ok(workingDecay > 0);

    const longTermMemory = { ...memory, stage: "LONG_TERM" as MemoryStage };
    const longDecay = retention.getDecayRate(longTermMemory);
    assert.ok(longDecay < workingDecay);
  });
});

// --- Memory spread activation ---
describe("Memory activation spread", () => {
  it("spreads activation through associations", () => {
    const factory = new MemoryFactory();
    const activation = new MemoryActivation();
    const associations = new MemoryAssociations();

    const a = factory.createFromInput(makeInput({ name: "A" }), "A");
    const b = factory.createFromInput(makeInput({ name: "B" }), "B");

    const aWithAssoc = associations.associate({ ...a, activationScore: 0.9 }, b, "CORRELATIONAL", 0.8);

    const activated = activation.spreadActivation(aWithAssoc, [aWithAssoc, b], 0.5);
    const bActivated = activated.find((m) => m.id === b.id);
    assert.ok(bActivated);
    assert.ok(bActivated.activationScore > b.activationScore);
  });
});

// --- Memory compression estimate ---
describe("Memory compression estimation", () => {
  it("estimates compression benefit", () => {
    const factory = new MemoryFactory();
    const compression = new MemoryCompression(factory);

    const a = factory.createFromInput(makeInput({ patternId: "pat_001", strength: 0.7 }), "A");
    const b = factory.createFromInput(makeInput({ patternId: "pat_001", strength: 0.72 }), "B");

    const estimate = compression.estimateCompressionBenefit([a, b]);
    assert.ok(estimate.currentTotalSize > 0);
    assert.ok(estimate.estimatedCompressedSize > 0);
  });
});
