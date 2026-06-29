import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "../../../runtime/EventBus";
import { RuntimeClock } from "../../../runtime/RuntimeClock";
import { EvidenceEngine } from "../EvidenceEngine";
import { EvidencePipeline } from "../EvidencePipeline";
import { EvidenceMemory } from "../EvidenceMemory";
import { EvidenceFactory } from "../EvidenceFactory";
import { EvidenceLifecycle } from "../EvidenceLifecycle";
import { EvidenceMetrics } from "../EvidenceMetrics";
import { PatternEventNames } from "../../pattern/PatternEvents";
import { EVIDENCE_EVENTS } from "../EvidenceEvents";
import type { Evidence, EvidenceStage } from "../EvidenceTypes";

function makeInput(overrides: Record<string, unknown> = {}) {
  const id = (overrides.id as string) || "pat_vs1_019_001";
  const reasoningId = (overrides.reasoningId as string) || "reason_vs1_019_001";
  return {
    pattern: {
      id,
      identity: { name: "Test Pattern", category: "STRENGTH" },
      businessId: "biz_vs1_019",
      reasoningId,
      originObservations: ["obs-1", "obs-2"],
      supportingObservations: ["obs-1", "obs-2"],
      contradictingObservationIds: [],
      strength: 0.7,
      confidence: 0.8,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialScope: { zones: ["kitchen"] },
      ...overrides,
    },
    entity: {
      observations: [
        { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", source: { type: "SYSTEM_LOG", trustScore: 0.8 }, confidence: 0.7, payload: { value: 42 } },
        { id: "obs-2", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", source: { type: "MANUAL_REPORT", trustScore: 0.6 }, confidence: 0.6, payload: { value: 38 } },
      ],
    },
  };
}

describe("VS1-019 Evidence Engine Full Certification", () => {
  it("pipeline end-to-end: evaluates evidence with real metrics", async () => {
    const pipeline = new EvidencePipeline();

    const request = {
      patternId: "pat_e2e_001",
      patternName: "E2E Test Pattern",
      patternCategory: "STRENGTH",
      businessId: "biz_e2e",
      reasoningId: "reason_e2e_001",
      observations: ["obs-1", "obs-2"] as readonly string[],
      supportingObservationIds: ["obs-1", "obs-2"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.7,
      patternConfidence: 0.8,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: ["kitchen"] as readonly string[],
      sourceTypes: ["SYSTEM_LOG", "MANUAL_REPORT"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: { value: 42 } },
      { id: "obs-2", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "MANUAL_REPORT", trustScore: 0.6, confidence: 0.6, payload: { value: 38 } },
    ];

    const evidence = await pipeline.evaluate(request, observations);

    assert.ok(evidence, "evidence should be created");
    assert.ok(evidence.score > 0, "score should be computed");
    assert.ok(evidence.confidence > 0, "confidence should be computed");
    assert.ok(evidence.supportingRefs.length > 0, "should have supporting refs");
    assert.equal(evidence.identity.reasoningId, "reason_e2e_001", "reasoningId should be preserved");
    assert.equal(evidence.identity.businessId, "biz_e2e", "businessId should be preserved");

    const metrics = pipeline.metrics.getSnapshot();
    assert.equal(metrics.totalEvidenceCreated, 1, "should record one creation");
    assert.ok(metrics.averageConfidence > 0, "confidence should be tracked");
    assert.ok(metrics.averageScore > 0, "score should be tracked");
    assert.equal(metrics.patternsEvaluated, 1, "patterns evaluated should be tracked");
    assert.equal(metrics.sourcesEvaluated, 2, "sources evaluated should be tracked");
  });

  it("uses deterministic ID from reasoningId", async () => {
    const pipeline = new EvidencePipeline();
    const reasoningId = "reason_det_001";
    const patternId = "pat_det_001";

    const request = {
      patternId,
      patternName: "Deterministic ID Test",
      patternCategory: "STRENGTH",
      businessId: "biz_det",
      reasoningId,
      observations: ["obs-1"] as readonly string[],
      supportingObservationIds: ["obs-1"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.5,
      patternConfidence: 0.6,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: [] as readonly string[],
      sourceTypes: ["SYSTEM_LOG"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: {} },
    ];

    const evidence = await pipeline.evaluate(request, observations);
    assert.equal(evidence.id, `evidence-${reasoningId}`, "ID should be evidence-{reasoningId}");

    const stored = await pipeline.memory.findByReasoningId(reasoningId);
    assert.equal(stored.length, 1, "should be found by reasoningId");
    assert.equal(stored[0].id, `evidence-${reasoningId}`);
  });

  it("falls back to patternId when reasoningId is absent", async () => {
    const pipeline = new EvidencePipeline();
    const patternId = "pat_no_reasoning";

    const request = {
      patternId,
      patternName: "No Reasoning ID Test",
      patternCategory: "STRENGTH",
      businessId: "biz_no_reason",
      reasoningId: undefined as unknown as string | undefined,
      observations: ["obs-1"] as readonly string[],
      supportingObservationIds: ["obs-1"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.5,
      patternConfidence: 0.6,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: [] as readonly string[],
      sourceTypes: ["SYSTEM_LOG"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: {} },
    ];

    const evidence = await pipeline.evaluate(request, observations);
    assert.equal(evidence.id, `evidence-${patternId}`, "should fall back to patternId-based ID");
  });

  it("persists evidence via memory: id, businessId, reasoningId, stage", async () => {
    const pipeline = new EvidencePipeline();
    const reasoningId = "reason_mem_001";
    const businessId = "biz_mem_001";

    const request = {
      patternId: "pat_mem_001",
      patternName: "Memory Test Pattern",
      patternCategory: "STRENGTH",
      businessId,
      reasoningId,
      observations: ["obs-1"] as readonly string[],
      supportingObservationIds: ["obs-1"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.5,
      patternConfidence: 0.6,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: [] as readonly string[],
      sourceTypes: ["SYSTEM_LOG"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: {} },
    ];

    await pipeline.evaluate(request, observations);

    const byId = await pipeline.memory.findById(`evidence-${reasoningId}`);
    assert.ok(byId, "should be found by id");

    const byBusinessId = await pipeline.memory.findByBusinessId(businessId);
    assert.equal(byBusinessId.length, 1, "should be found by businessId");

    const byReasoningId = await pipeline.memory.findByReasoningId(reasoningId);
    assert.equal(byReasoningId.length, 1, "should be found by reasoningId");

    const byStage = await pipeline.memory.findByStage("SUPPORTING");
    assert.equal(byStage.length, 1, "should be found by stage");
  });

  it("validates lifecycle stage transitions", async () => {
    const lifecycle = new EvidenceLifecycle();
    const stages: EvidenceStage[] = ["CANDIDATE", "COLLECTING", "SUPPORTING", "CONFLICTING", "WEIGHTED", "VALIDATED", "HISTORICAL", "ARCHIVED"];

    for (const stage of stages) {
      assert.ok(lifecycle.canTransition(stage, stage), `${stage} -> ${stage}`);
    }

    assert.ok(lifecycle.canTransition("CANDIDATE", "COLLECTING"));
    assert.ok(lifecycle.canTransition("COLLECTING", "SUPPORTING"));
    assert.ok(lifecycle.canTransition("COLLECTING", "CONFLICTING"));
    assert.ok(lifecycle.canTransition("SUPPORTING", "WEIGHTED"));
    assert.ok(lifecycle.canTransition("CONFLICTING", "WEIGHTED"));
    assert.ok(lifecycle.canTransition("WEIGHTED", "VALIDATED"));
    assert.ok(lifecycle.canTransition("VALIDATED", "HISTORICAL"));
    assert.ok(lifecycle.canTransition("HISTORICAL", "ARCHIVED"));

    assert.ok(!lifecycle.canTransition("CANDIDATE", "VALIDATED"), "skip not allowed");
    assert.ok(!lifecycle.canTransition("ARCHIVED", "CANDIDATE"), "terminal not allowed");
    assert.ok(lifecycle.isTerminal("ARCHIVED"));
    assert.ok(lifecycle.isRejected("REJECTED"));
  });

  it("pipeline stage transition works end-to-end", async () => {
    const pipeline = new EvidencePipeline();

    const request = {
      patternId: "pat_trans_001",
      patternName: "Transition Test",
      patternCategory: "STRENGTH",
      businessId: "biz_trans",
      reasoningId: "reason_trans_001",
      observations: ["obs-1"] as readonly string[],
      supportingObservationIds: ["obs-1"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.5,
      patternConfidence: 0.6,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: [] as readonly string[],
      sourceTypes: ["SYSTEM_LOG"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: {} },
    ];

    const evidence = await pipeline.evaluate(request, observations);
    assert.equal(evidence.stage, "SUPPORTING", "initial stage should be SUPPORTING (no contradictions)");

    const weighted = await pipeline.transition(evidence, "WEIGHTED");
    assert.equal(weighted.stage, "WEIGHTED");
    assert.equal(weighted.versions.length, evidence.versions.length + 1, "should add version");

    const validated = await pipeline.transition(weighted, "VALIDATED");
    assert.equal(validated.stage, "VALIDATED");

    const metrics = pipeline.metrics.getSnapshot();
    assert.equal(metrics.validatedEvidenceCount, 1, "validated count should increase");
  });

  it("handles engine-not-running gracefully via event bus", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new EvidenceEngine(eventBus);

    let errorCount = 0;
    process.on("uncaughtException", () => { errorCount++; });

    await eventBus.emit(PatternEventNames.SUPPORTED_ESTABLISHED, makeInput());

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(errorCount, 0, "should not throw when engine is not running");
  });

  it("responds to pattern events via event bus", async () => {
    const clock = new RuntimeClock();
    const eventBus = new EventBus(clock);
    const engine = new EvidenceEngine(eventBus);

    await engine.start();

    let capturedEvent: Record<string, unknown> | null = null;
    eventBus.subscribe(EVIDENCE_EVENTS.LIFECYCLE_SUPPORTING_ESTABLISHED, async (payload) => {
      capturedEvent = payload as Record<string, unknown>;
    });

    const reasoningId = "reason_evt_001";
    await eventBus.emit(PatternEventNames.SUPPORTED_ESTABLISHED, makeInput({ reasoningId, id: "pat_evt_001" }));

    await new Promise((r) => setTimeout(r, 50));

    assert.ok(capturedEvent !== null, "evidence lifecycle event should be emitted");
    const evPayload = capturedEvent as Record<string, unknown>;
    assert.equal(evPayload.evidenceId, `evidence-${reasoningId}`, "deterministic ID should match");

    const pipeline = engine.getPipeline();
    const stored = await pipeline.memory.findByReasoningId(reasoningId);
    assert.equal(stored.length, 1, "evidence should be stored from event");

    const metrics = await pipeline.getMetrics();
    assert.equal(metrics.totalEvidenceCreated, 1, "metrics should be updated from event");

    await engine.stop();
  });

  it("emits lifecycle events on evaluate and transition", async () => {
    const pipeline = new EvidencePipeline();

    const request = {
      patternId: "pat_event_001",
      patternName: "Event Test",
      patternCategory: "STRENGTH",
      businessId: "biz_event",
      reasoningId: "reason_event_001",
      observations: ["obs-1"] as readonly string[],
      supportingObservationIds: ["obs-1"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.5,
      patternConfidence: 0.6,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: [] as readonly string[],
      sourceTypes: ["SYSTEM_LOG"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: {} },
    ];

    const evidence = await pipeline.evaluate(request, observations);
    assert.equal(evidence.stage, "SUPPORTING");

    const weighted = await pipeline.transition(evidence, "WEIGHTED");
    assert.equal(weighted.stage, "WEIGHTED");

    const validated = await pipeline.transition(weighted, "VALIDATED");
    assert.equal(validated.stage, "VALIDATED");

    const metrics = pipeline.metrics.getSnapshot();
    assert.equal(metrics.validatedEvidenceCount, 1, "should track validation in metrics");
    assert.equal(metrics.totalEvidenceCreated, 1, "should track creation in metrics");
  });

  it("handles contradiction detection in pipeline", async () => {
    const pipeline = new EvidencePipeline();

    const request = {
      patternId: "pat_contra_001",
      patternName: "Contradiction Test",
      patternCategory: "STRENGTH",
      businessId: "biz_contra",
      reasoningId: "reason_contra_001",
      observations: ["obs-1", "obs-3"] as readonly string[],
      supportingObservationIds: ["obs-1"] as readonly string[],
      contradictingObservationIds: ["obs-3"] as readonly string[],
      patternStrength: 0.5,
      patternConfidence: 0.6,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: [] as readonly string[],
      sourceTypes: ["SYSTEM_LOG"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: { value: 42 } },
      { id: "obs-3", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.9, confidence: 0.8, payload: { value: 10 } },
    ];

    const evidence = await pipeline.evaluate(request, observations);
    assert.equal(evidence.stage, "CONFLICTING", "should enter CONFLICTING stage when contradictions detected");
    assert.ok(evidence.contradictingRefs.length > 0, "should have contradicting refs");
    assert.ok(evidence.supportingRefs.length > 0, "should also have supporting refs");
  });

  it("exposes factory with deterministic ID from engine pipeline", async () => {
    const pipeline = new EvidencePipeline();
    const reasoningId = "reason_fact_001";

    const request = {
      patternId: "pat_fact_001",
      patternName: "Factory Test",
      patternCategory: "STRENGTH",
      businessId: "biz_fact",
      reasoningId,
      observations: ["obs-1"] as readonly string[],
      supportingObservationIds: ["obs-1"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.5,
      patternConfidence: 0.6,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: [] as readonly string[],
      sourceTypes: ["SYSTEM_LOG"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2024-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: {} },
    ];

    const evidence = await pipeline.evaluate(request, observations);
    const cloned = pipeline.factory.cloneWithTransition(evidence, "VALIDATED", { score: 0.95, confidence: 0.9 });
    assert.equal(cloned.id, evidence.id, "cloned evidence should keep the same ID");
    assert.equal(cloned.stage, "VALIDATED", "clone should have new stage");
    assert.equal(cloned.score, 0.95, "clone should have updated score");
    assert.equal(cloned.confidence, 0.9, "clone should have updated confidence");
    assert.equal(cloned.versions.length, evidence.versions.length + 1, "should add version on clone");
  });

  it("engine.receiveInput processes through full pipeline", async () => {
    const engine = new EvidenceEngine();
    await engine.start();

    const reasoningId = "reason_engine_001";
    const result = await engine.receiveInput(makeInput({ reasoningId, id: "pat_engine_001" }));

    assert.ok(result.evaluated, "should be evaluated");
    assert.ok(result.score > 0, "score should be computed");
    assert.ok(result.confidence > 0, "confidence should be computed");
    assert.ok(result.supportingWeight > 0, "supporting weight should be computed");
    assert.equal(result.contradictingWeight, 0, "no contradictions should mean zero contradicting weight");
    assert.ok(result.qualityProfile.strength >= 0, "quality profile should be present");
    assert.ok(result.recommendations.length >= 0, "recommendations should be present");

    const pipeline = engine.getPipeline();
    const stored = await pipeline.memory.findByReasoningId(reasoningId);
    assert.equal(stored.length, 1, "evidence should be stored from receiveInput");

    await engine.stop();
  });

  it("quality sub-component computes multi-dimensional profile", async () => {
    const pipeline = new EvidencePipeline();
    const factory = new EvidenceFactory();

    const request = {
      patternId: "pat_qual_001",
      patternName: "Quality Test",
      patternCategory: "STRENGTH",
      businessId: "biz_qual",
      reasoningId: "reason_qual_001",
      observations: ["obs-1", "obs-2"] as readonly string[],
      supportingObservationIds: ["obs-1", "obs-2"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.7,
      patternConfidence: 0.8,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: ["kitchen"] as readonly string[],
      sourceTypes: ["SYSTEM_LOG", "MANUAL_REPORT"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2025-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.8, confidence: 0.7, payload: { value: 42 } },
      { id: "obs-2", category: "OBSERVATION", timestamp: "2025-06-01T00:00:00.000Z", sourceType: "MANUAL_REPORT", trustScore: 0.6, confidence: 0.6, payload: { value: 38 } },
    ];

    const evidence = await pipeline.evaluate(request, observations);
    const profile = evidence.qualityProfile;

    assert.ok(profile.strength >= 0, "strength should be computed");
    assert.ok(profile.coverage >= 0, "coverage should be computed");
    assert.ok(profile.completeness >= 0, "completeness should be computed");
    assert.ok(profile.consistency >= 0, "consistency should be computed");
    assert.ok(profile.freshness >= 0, "freshness should be computed");
    assert.ok(profile.reliability >= 0, "reliability should be computed");
    assert.ok(profile.sourceDiversity >= 0, "sourceDiversity should be computed");
    assert.ok(profile.traceability >= 0, "traceability should be computed");
    assert.ok(profile.explainability >= 0, "explainability should be computed");
    assert.ok(profile.contradictionResistance >= 0, "contradictionResistance should be computed");
    assert.ok(profile.independence >= 0, "independence should be computed");

    const allPresent = Object.values(profile).every((v) => typeof v === "number" && v >= 0 && v <= 1);
    assert.ok(allPresent, "all quality dimensions should be in [0, 1]");
  });

  it("policies engine evaluates evidence against thresholds", async () => {
    const pipeline = new EvidencePipeline();

    const request = {
      patternId: "pat_pol_001",
      patternName: "Policy Test",
      patternCategory: "STRENGTH",
      businessId: "biz_pol",
      reasoningId: "reason_pol_001",
      observations: ["obs-1", "obs-2", "obs-3", "obs-4", "obs-5"] as readonly string[],
      supportingObservationIds: ["obs-1", "obs-2", "obs-3", "obs-4", "obs-5"] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.9,
      patternConfidence: 0.9,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: ["kitchen", "storage"] as readonly string[],
      sourceTypes: ["SYSTEM_LOG", "MANUAL_REPORT", "SENSOR"] as readonly string[],
    };

    const observations = [
      { id: "obs-1", category: "OPERATIONAL", timestamp: "2025-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.9, confidence: 0.9, payload: {} },
      { id: "obs-2", category: "OPERATIONAL", timestamp: "2025-06-01T00:00:00.000Z", sourceType: "MANUAL_REPORT", trustScore: 0.8, confidence: 0.8, payload: {} },
      { id: "obs-3", category: "OPERATIONAL", timestamp: "2025-06-01T00:00:00.000Z", sourceType: "SENSOR", trustScore: 0.9, confidence: 0.85, payload: {} },
      { id: "obs-4", category: "OPERATIONAL", timestamp: "2025-06-01T00:00:00.000Z", sourceType: "SYSTEM_LOG", trustScore: 0.85, confidence: 0.8, payload: {} },
      { id: "obs-5", category: "OPERATIONAL", timestamp: "2025-06-01T00:00:00.000Z", sourceType: "MANUAL_REPORT", trustScore: 0.7, confidence: 0.75, payload: {} },
    ];

    await pipeline.evaluate(request, observations);

    const policyResult = pipeline.policyEngine.evaluate(
      await pipeline.memory.findByReasoningId("reason_pol_001").then((r) => r[0]),
      { name: "standard_validation", description: "", minimumSupportingRefs: 3, minimumConfidence: 0.5, maximumContradictionRatio: 0.3, requireSourceDiversity: true, reliabilityThreshold: 0.4 },
    );
    assert.ok(policyResult.passed, "evidence with 5 refs and high confidence should pass standard validation");
    assert.equal(policyResult.failures.length, 0, "should have no failures");
  });

  it("memory count, delete, clear operations work", async () => {
    const memory = new EvidenceMemory();
    const factory = new EvidenceFactory();

    const request = {
      patternId: "pat_mem_ops_001",
      patternName: "Memory Ops Test",
      patternCategory: "STRENGTH",
      businessId: "biz_memops",
      reasoningId: "reason_memops_001",
      observations: [] as readonly string[],
      supportingObservationIds: [] as readonly string[],
      contradictingObservationIds: [] as readonly string[],
      patternStrength: 0.5,
      patternConfidence: 0.5,
      temporalScope: { firstObservedAt: "2024-01-01T00:00:00.000Z", lastObservedAt: "2024-06-01T00:00:00.000Z" },
      spatialZones: [] as readonly string[],
      sourceTypes: [] as readonly string[],
    };

    const evidence = factory.createCandidate(request, "Memory ops test");
    await memory.store(evidence);

    assert.equal(memory.count(), 1, "should count stored evidence");

    const found = await memory.findById(evidence.id);
    assert.ok(found, "should find by id");

    const deleted = await memory.delete(evidence.id);
    assert.ok(deleted, "should delete");
    assert.equal(memory.count(), 0, "count should be 0 after delete");

    await memory.store(evidence);
    await memory.clear();
    assert.equal(memory.count(), 0, "count should be 0 after clear");
  });
});
