import test from "node:test";
import assert from "node:assert/strict";
import {
  PatternStage,
  PatternCategory,
  DetectionMethod,
  ObservationRef,
  PatternDefinition,
} from "../PatternTypes";
import { PatternLifecycle } from "../PatternLifecycle";
import { PatternFactory } from "../PatternFactory";
import { PatternValidator } from "../PatternValidator";
import { PatternQuality } from "../PatternQuality";
import { PatternConfidence } from "../PatternConfidence";
import { PatternScoring } from "../PatternScoring";
import { PatternCorrelation } from "../PatternCorrelation";
import { PatternTrend } from "../PatternTrend";
import { PatternAnomaly } from "../PatternAnomaly";
import { PatternSequence } from "../PatternSequence";
import { PatternRelationships } from "../PatternRelationships";
import { PatternMemory } from "../PatternMemory";
import { PatternRegistry } from "../PatternRegistry";
import { PatternMetrics } from "../PatternMetrics";
import { PatternPipeline } from "../PatternPipeline";
import { PatternEngine } from "../PatternEngine";
import { InvalidLifecycleTransitionError } from "../PatternErrors";

// ─── Helpers ─────────────────────────────────────────────

function createObsRef(
  id: string,
  category: string,
  ts: string,
  trustScore = 0.9,
  payload: Record<string, unknown> = {},
  sourceType = "SYSTEM_LOG"
): ObservationRef {
  return { id, category, timestamp: ts, businessId: "test_biz", trustScore, payload, sourceType, stage: "HISTORICAL" };
}

function makeNumericObs(id: string, category: string, ts: string, value: number, trustScore = 0.9): ObservationRef {
  return createObsRef(id, category, ts, trustScore, { amount: value, count: value });
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3600000).toISOString();
}

// ─── PatternLifecycle ────────────────────────────────────

test("PatternLifecycle — allowed transitions", () => {
  const lc = new PatternLifecycle();
  assert.doesNotThrow(() => lc.validateTransition("POTENTIAL", "CANDIDATE"));
  assert.doesNotThrow(() => lc.validateTransition("CANDIDATE", "EMERGING"));
  assert.doesNotThrow(() => lc.validateTransition("EMERGING", "SUPPORTED"));
  assert.doesNotThrow(() => lc.validateTransition("SUPPORTED", "VALIDATED"));
  assert.doesNotThrow(() => lc.validateTransition("VALIDATED", "STRENGTHENING"));
  assert.doesNotThrow(() => lc.validateTransition("STRENGTHENING", "WEAKENING"));
  assert.doesNotThrow(() => lc.validateTransition("WEAKENING", "DEPRECATED"));
  assert.doesNotThrow(() => lc.validateTransition("DEPRECATED", "HISTORICAL"));
  assert.doesNotThrow(() => lc.validateTransition("HISTORICAL", "ARCHIVED"));
});

test("PatternLifecycle — rejects invalid transitions", () => {
  const lc = new PatternLifecycle();
  assert.throws(() => lc.validateTransition("POTENTIAL", "VALIDATED"));
  assert.throws(() => lc.validateTransition("CANDIDATE", "ARCHIVED"));
  assert.throws(() => lc.validateTransition("ARCHIVED", "POTENTIAL"));
  assert.throws(() => lc.validateTransition("VALIDATED", "POTENTIAL"));
});

test("PatternLifecycle — canTransition guard", () => {
  const lc = new PatternLifecycle();
  assert.ok(lc.canTransition("POTENTIAL", "CANDIDATE"));
  assert.ok(!lc.canTransition("POTENTIAL", "ARCHIVED"));
});

test("PatternLifecycle — self transition is no-op", () => {
  const lc = new PatternLifecycle();
  assert.doesNotThrow(() => lc.validateTransition("POTENTIAL", "POTENTIAL"));
});

test("PatternLifecycle — isActive and isTerminal", () => {
  const lc = new PatternLifecycle();
  assert.ok(lc.isActive("EMERGING"));
  assert.ok(lc.isActive("SUPPORTED"));
  assert.ok(lc.isActive("VALIDATED"));
  assert.ok(!lc.isActive("POTENTIAL"));
  assert.ok(lc.isTerminal("ARCHIVED"));
});

// ─── PatternFactory ──────────────────────────────────────

test("PatternFactory — creates potential pattern", () => {
  const f = new PatternFactory();
  const p = f.createPotential(
    "test_pattern",
    "REPEATED_EVENT",
    "FREQUENCY",
    "Test summary",
    "Test description",
    "Test business relevance",
    ["obs_1", "obs_2"]
  );
  assert.ok(p.id.startsWith("pat_"));
  assert.equal(p.identity.name, "test_pattern");
  assert.equal(p.stage, "POTENTIAL");
  assert.equal(p.originObservations.length, 2);
  assert.equal(p.versions.length, 1);
  assert.equal(p.versions[0].version, 1);
});

test("PatternFactory — cloneWithTransition creates immutable copy", () => {
  const f = new PatternFactory();
  const original = f.createPotential("p1", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", []);
  const cloned = f.cloneWithTransition(original, "CANDIDATE", { confidence: 0.7, strength: 0.6 });
  assert.equal(cloned.stage, "CANDIDATE");
  assert.equal(cloned.confidence, 0.7);
  assert.equal(original.stage, "POTENTIAL");
  assert.equal(cloned.versions.length, 2);
});

// ─── PatternValidator ───────────────────────────────────

test("PatternValidator — validates definition", () => {
  const v = new PatternValidator();
  const def: PatternDefinition = {
    name: "test",
    category: "REPEATED_EVENT",
    description: "desc",
    detectionMethod: "FREQUENCY",
    minSupport: 3,
    confidenceThreshold: 0.5,
    timeWindowMs: 3600000,
    evaluate: () => ({ detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} }),
  };
  assert.doesNotThrow(() => v.validateDefinition(def));
});

test("PatternValidator — rejects invalid definition", () => {
  const v = new PatternValidator();
  assert.throws(() =>
    v.validateDefinition({
      name: "",
      category: "REPEATED_EVENT",
      description: "desc",
      detectionMethod: "FREQUENCY",
      minSupport: 0,
      confidenceThreshold: 2,
      timeWindowMs: 100,
      evaluate: () => ({ detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} }),
    })
  );
});

// ─── PatternQuality ──────────────────────────────────────

test("PatternQuality — scores quality dimensions", () => {
  const q = new PatternQuality();
  const f = new PatternFactory();
  const p = f.createPotential("qtest", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", ["obs_1", "obs_2"]);
  const result = q.evaluate(p, []);
  assert.ok(result.confidenceScore >= 0);
  assert.ok(result.confidenceScore <= 1);
  assert.ok(result.profile.precision >= 0);
  assert.ok(result.profile.coverage >= 0);
});

// ─── PatternConfidence ───────────────────────────────────

test("PatternConfidence — computes and tracks history", () => {
  const c = new PatternConfidence();
  const f = new PatternFactory();
  const p = f.createPotential("ctest", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", ["obs_1"]);
  const quality = new PatternQuality();
  const qResult = quality.evaluate(p, []);
  const score = c.compute(p, qResult.profile, []);
  assert.ok(score >= 0.01);
  assert.ok(score <= 0.99);
  c.recordHistory("pat_1", 0.5, score, "initial");
  const history = c.getHistory("pat_1");
  assert.equal(history.length, 1);
});

// ─── PatternScoring ──────────────────────────────────────

test("PatternScoring — computes strength, novelty, persistence", () => {
  const s = new PatternScoring();
  const f = new PatternFactory();
  const p = f.createPotential("stest", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", ["obs_1", "obs_2"]);
  const strength = s.computeStrength(p, []);
  assert.ok(strength >= 0);
  const novelty = s.computeNovelty(p, []);
  assert.equal(novelty, 1);
});

// ─── PatternCorrelation ──────────────────────────────────

test("PatternCorrelation — detects positive correlation", () => {
  const corr = new PatternCorrelation();
  const now = Date.now();
  const obsA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) =>
    makeNumericObs(`a_${i}`, "FINANCIAL", new Date(now + i * 3600000).toISOString(), v * 10)
  );
  const obsB = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) =>
    makeNumericObs(`b_${i}`, "INVENTORY", new Date(now + i * 3600000).toISOString(), v * 8 + 5)
  );
  const result = corr.pearson(obsA, obsB);
  assert.ok(result.coefficient > 0.5);
  assert.equal(result.direction, "POSITIVE");
});

test("PatternCorrelation — detects negative correlation", () => {
  const corr = new PatternCorrelation();
  const now = Date.now();
  const obsA = [10, 20, 30, 40, 50, 60].map((v, i) =>
    makeNumericObs(`a_${i}`, "FINANCIAL", new Date(now + i * 3600000).toISOString(), v)
  );
  const obsB = [60, 50, 40, 30, 20, 10].map((v, i) =>
    makeNumericObs(`b_${i}`, "INVENTORY", new Date(now + i * 3600000).toISOString(), v)
  );
  const result = corr.pearson(obsA, obsB);
  assert.ok(result.coefficient < 0);
  assert.equal(result.direction, "NEGATIVE");
});

// ─── PatternTrend ────────────────────────────────────────

test("PatternTrend — detects positive trend", () => {
  const trend = new PatternTrend();
  const now = Date.now();
  const obs = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((v, i) =>
    makeNumericObs(`t_${i}`, "FINANCIAL", new Date(now + i * 3600000).toISOString(), v)
  );
  const result = trend.detect(obs);
  assert.equal(result.direction, "POSITIVE");
  assert.ok(result.rSquared > 0.5);
});

test("PatternTrend — detects negative trend", () => {
  const trend = new PatternTrend();
  const now = Date.now();
  const obs = [100, 90, 80, 70, 60, 50, 40].map((v, i) =>
    makeNumericObs(`t_${i}`, "INVENTORY", new Date(now + i * 3600000).toISOString(), v)
  );
  const result = trend.detect(obs);
  assert.equal(result.direction, "NEGATIVE");
});

test("PatternTrend — requires minimum observations", () => {
  const trend = new PatternTrend();
  assert.throws(() => trend.detect([makeNumericObs("o1", "TEST", hoursAgo(1), 10)]));
});

// ─── PatternAnomaly ──────────────────────────────────────

test("PatternAnomaly — detects z-score anomaly", () => {
  const anomaly = new PatternAnomaly();
  const normalObs = [10, 11, 9, 10, 12, 10, 11, 9, 10, 11].map((v, i) =>
    makeNumericObs(`n_${i}`, "OPERATIONAL", hoursAgo(i), v)
  );
  const outlier = makeNumericObs("outlier", "OPERATIONAL", hoursAgo(0), 100);
  const result = anomaly.detect(outlier, normalObs, "ZSCORE");
  assert.ok(result.isAnomaly);
  assert.ok(result.zScore > 2);
});

test("PatternAnomaly — detects IQR anomaly", () => {
  const anomaly = new PatternAnomaly();
  const normalObs = [10, 11, 9, 10, 12, 10].map((v, i) =>
    makeNumericObs(`n_${i}`, "OPERATIONAL", hoursAgo(i), v)
  );
  const outlier = makeNumericObs("outlier", "OPERATIONAL", hoursAgo(0), 50);
  const result = anomaly.detect(outlier, normalObs, "IQR");
  assert.ok(result.isAnomaly);
});

// ─── PatternSequence ─────────────────────────────────────

test("PatternSequence — finds repeated pairs", () => {
  const seq = new PatternSequence();
  const now = Date.now();
  const obs = [
    makeNumericObs("o1", "FINANCIAL", new Date(now).toISOString(), 100),
    makeNumericObs("o2", "INVENTORY", new Date(now + 600000).toISOString(), 50),
    makeNumericObs("o3", "FINANCIAL", new Date(now + 3600000).toISOString(), 120),
    makeNumericObs("o4", "INVENTORY", new Date(now + 4200000).toISOString(), 45),
    makeNumericObs("o5", "FINANCIAL", new Date(now + 7200000).toISOString(), 110),
    makeNumericObs("o6", "INVENTORY", new Date(now + 7800000).toISOString(), 55),
  ];
  const results = seq.findRepeatedPairs(obs, 3600000, 2);
  assert.ok(results.length > 0);
});

// ─── PatternRelationships ────────────────────────────────

test("PatternRelationships — overlap detection", () => {
  const rel = new PatternRelationships();
  const f = new PatternFactory();
  const a = f.createPotential("a", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", ["obs_1", "obs_2"]);
  const b = f.createPotential("b", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", ["obs_1", "obs_3"]);
  const overlap = rel.computeOverlap(a, b);
  assert.equal(overlap, 1 / 3);
});

// ─── PatternMemory ───────────────────────────────────────

test("PatternMemory — store and retrieve", async () => {
  const mem = new PatternMemory();
  const f = new PatternFactory();
  const p = f.createPotential("memtest", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", []);
  await mem.persist(p);
  const found = await mem.retrieve(p.id);
  assert.ok(found);
  assert.equal(found!.id, p.id);
});

test("PatternMemory — findByCategory", async () => {
  const mem = new PatternMemory();
  const f = new PatternFactory();
  await mem.persist(f.createPotential("p1", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", []));
  await mem.persist(f.createPotential("p2", "ANOMALY", "ANOMALY_ZSCORE", "s", "d", "r", []));
  const results = await mem.findByCategory("REPEATED_EVENT" as PatternCategory);
  assert.equal(results.length, 1);
});

test("PatternMemory — findByStage", async () => {
  const mem = new PatternMemory();
  const f = new PatternFactory();
  await mem.persist(f.createPotential("p1", "REPEATED_EVENT", "FREQUENCY", "s", "d", "r", []));
  const results = await mem.findByStage("POTENTIAL");
  assert.equal(results.length, 1);
});

// ─── PatternRegistry ─────────────────────────────────────

test("PatternRegistry — register and retrieve definitions", () => {
  const reg = new PatternRegistry();
  const def: PatternDefinition = {
    name: "test_def",
    category: "REPEATED_EVENT",
    description: "desc",
    detectionMethod: "FREQUENCY",
    minSupport: 3,
    confidenceThreshold: 0.5,
    timeWindowMs: 3600000,
    evaluate: () => ({ detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} }),
  };
  reg.registerDefinition(def);
  assert.ok(reg.hasDefinition("test_def"));
  assert.equal(reg.definitionCount(), 1);
});

// ─── PatternMetrics ──────────────────────────────────────

test("PatternMetrics — tracks detections and confidence", () => {
  const m = new PatternMetrics();
  m.recordDetection("REPEATED_EVENT");
  m.recordConfidence(0.7);
  m.recordTrendDetected();
  const snap = m.getSnapshot();
  assert.equal(snap.totalPatternsDetected, 1);
  assert.equal(snap.trendsDetected, 1);
  assert.equal(snap.averageConfidence, 0.7);
});

// ─── PatternPipeline (integration-style) ─────────────────

test("PatternPipeline — processes observations with default definitions", async () => {
  const pipeline = new PatternPipeline();
  for (const def of (await import("../PatternDefinitions")).DEFAULT_PATTERN_DEFINITIONS) {
    pipeline.registerDefinition(def);
  }

  const now = Date.now();
  const obs = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95].map((v, i) =>
    createObsRef(
      `obs_pipe_${i}`,
      "FINANCIAL",
      new Date(now + i * 3600000).toISOString(),
      0.9,
      { amount: v, count: v + 10 }
    )
  );

  for (const o of obs) {
    await pipeline.processObservation(o);
  }

  const patterns = await pipeline.getAllPatterns();
  assert.ok(patterns.length > 0);
});

// ─── PatternEngine ───────────────────────────────────────

test("PatternEngine — implements CognitiveEngine contract", () => {
  const engine = new PatternEngine();
  assert.equal(engine.name, "PatternEngine");
  assert.equal(engine.classification, "Understanding");
  assert.equal(engine.contractVersion, "1.0.0");
  assert.equal(engine.getState(), "INITIALIZED");
});

test("PatternEngine — start and stop lifecycle", async () => {
  const engine = new PatternEngine();
  await engine.start();
  assert.equal(engine.getState(), "RUNNING");
  await engine.stop();
  assert.equal(engine.getState(), "STOPPED");
});

test("PatternEngine — receives input and returns patterns", async () => {
  const engine = new PatternEngine();
  await engine.start();

  const now = Date.now();
  for (let i = 0; i < 5; i++) {
    const results = await engine.receiveInput({
      id: `input_${i}`,
      category: "FINANCIAL",
      timestamp: new Date(now + i * 3600000).toISOString(),
      businessId: "test_biz",
      source: { id: "test_src", name: "Test", type: "POS", trustScore: 0.9 },
      payload: { amount: 100 + i * 10 },
    });
    assert.ok(Array.isArray(results));
  }

  const metrics = engine.getMetrics();
  assert.ok(metrics.totalPatternsDetected >= 0);
  await engine.stop();
});

test("PatternEngine — rejects input when not running", async () => {
  const engine = new PatternEngine();
  await assert.rejects(() =>
    engine.receiveInput({ id: "test", category: "TEST", businessId: "biz", payload: {} })
  );
});

// ─── Business Scenario: Sales Trend ──────────────────────

test("Business Scenario — detects sales trends", async () => {
  const pipeline = new PatternPipeline();
  for (const def of (await import("../PatternDefinitions")).DEFAULT_PATTERN_DEFINITIONS) {
    pipeline.registerDefinition(def);
  }

  const now = Date.now();
  const salesObs = [100, 105, 98, 110, 115, 120, 118, 125, 130, 135].map((v, i) =>
    createObsRef(`sale_${i}`, "FINANCIAL", new Date(now + i * 3600000).toISOString(), 0.95, {
      amount: v,
      item: "Double Truffle Burger",
      orderId: `ord_${i}`,
    })
  );

  for (const obs of salesObs) {
    await pipeline.processObservation(obs);
  }

  const patterns = await pipeline.getAllPatterns();
  const trendPatterns = patterns.filter(
    (p) => p.identity.category === "POSITIVE_TREND" || p.identity.category === "NEGATIVE_TREND"
  );
  assert.ok(trendPatterns.length > 0);
  const posTrend = trendPatterns.find((p) => p.identity.category === "POSITIVE_TREND");
  assert.ok(posTrend);
  assert.ok(posTrend.confidence > 0.3);
});

// ─── Business Scenario: Anomaly in Operations ───────────

test("Business Scenario — detects operational anomaly", async () => {
  const anomaly = new PatternAnomaly();
  const normalReadings = [22, 23, 21, 22, 24, 23, 22, 21, 23, 22].map((v, i) =>
    createObsRef(`temp_${i}`, "OPERATIONAL", hoursAgo(i * 2), 0.9, {
      deviceId: "grill_01",
      event: "temp_reading",
      temperatureCelsius: v,
    }, "IOT_SENSOR")
  );

  const spikeReading = createObsRef("temp_spike", "OPERATIONAL", hoursAgo(0.1), 0.9, {
    deviceId: "grill_01",
    event: "temp_reading",
    temperatureCelsius: 85,
  }, "IOT_SENSOR");

  const result = anomaly.detect(spikeReading, normalReadings);
  assert.ok(result.isAnomaly);
  assert.ok(result.zScore > 3);
  assert.ok(result.severity === "HIGH" || result.severity === "CRITICAL");
});

// ─── Business Scenario: Sequence Detection ──────────────

test("Business Scenario — detects financial-inventory sequence", async () => {
  const seq = new PatternSequence();
  const now = Date.now();
  const obs = [
    createObsRef("s1", "FINANCIAL", new Date(now).toISOString(), 0.95, { amount: 500 }),
    createObsRef("s2", "INVENTORY", new Date(now + 300000).toISOString(), 0.9, { itemSku: "patty-beef", level: 80 }),
    createObsRef("s3", "FINANCIAL", new Date(now + 3600000).toISOString(), 0.95, { amount: 520 }),
    createObsRef("s4", "INVENTORY", new Date(now + 3900000).toISOString(), 0.9, { itemSku: "patty-beef", level: 75 }),
    createObsRef("s5", "FINANCIAL", new Date(now + 7200000).toISOString(), 0.95, { amount: 480 }),
    createObsRef("s6", "INVENTORY", new Date(now + 7500000).toISOString(), 0.9, { itemSku: "patty-beef", level: 70 }),
  ];
  const results = seq.findRepeatedPairs(obs, 3600000, 2);
  assert.ok(results.length > 0);
});
