import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Runtime } from "../Runtime";
import { ObservationEngine } from "../../engines/observation/ObservationEngine";
import { PatternEngine } from "../../engines/pattern/PatternEngine";
import { MemoryEngine } from "../../engines/memory/MemoryEngine";
import { ObservationCategory } from "../../engines/observation/ObservationTypes";
import { EngineManifestDefinition } from "../EngineManifest";

const OBSERVATION_MANIFEST: EngineManifestDefinition = {
  name: "ObservationEngine",
  version: "1.0.0",
  classification: "Perception",
  pipelinePosition: "OBSERVATION",
  purpose: "VS0-009 pattern-memory integration",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const PATTERN_MANIFEST: EngineManifestDefinition = {
  name: "PatternEngine",
  version: "1.0.0",
  classification: "Understanding",
  pipelinePosition: "PATTERN",
  purpose: "VS0-009 pattern-memory integration",
  dependencies: [{ engineName: "ObservationEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

const MEMORY_MANIFEST: EngineManifestDefinition = {
  name: "MemoryEngine",
  version: "1.0.0",
  classification: "Storage",
  pipelinePosition: "MEMORY",
  purpose: "VS0-009 pattern-memory integration",
  dependencies: [{ engineName: "PatternEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 50 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

function makeObs(id: string, timestamp: string, value: number): Record<string, unknown> {
  return {
    id: `obs-${id}-${randomUUID().slice(0, 8)}`,
    category: "CUSTOMER",
    timestamp,
    businessId: "tonys-burger",
    source: { type: "SYSTEM_LOG", trustScore: 0.9 },
    payload: { grandTotal: value, paymentAmount: value, itemCount: 2 },
    stage: "HISTORICAL",
  };
}

test("VS0-009 — Pattern → Memory: PatternEngine detected pattern creates Memory in MemoryEngine", async () => {
  const runtime = new Runtime();

  const observationEngine = new ObservationEngine(
    runtime.eventBus, runtime.auditPipeline, runtime.recoveryPipeline, runtime.contextBus,
  );

  const patternEngine = new PatternEngine(
    runtime.eventBus, runtime.auditPipeline, runtime.recoveryPipeline,
  );

  const memoryEngine = new MemoryEngine(
    runtime.eventBus, runtime.auditPipeline, runtime.recoveryPipeline,
  );

  await runtime.registerEngine("ObservationEngine", observationEngine, OBSERVATION_MANIFEST);
  await runtime.registerEngine("PatternEngine", patternEngine, PATTERN_MANIFEST);
  await runtime.registerEngine("MemoryEngine", memoryEngine, MEMORY_MANIFEST);

  await observationEngine.start();
  runtime.engineRegistry.updateState("ObservationEngine", "RUNNING");
  await patternEngine.start();
  runtime.engineRegistry.updateState("PatternEngine", "RUNNING");
  await memoryEngine.start();
  runtime.engineRegistry.updateState("MemoryEngine", "RUNNING");
  await runtime.start();

  const now = Date.now();

  // Send 5 observations with strictly increasing values → POSITIVE_TREND
  for (let i = 0; i < 5; i++) {
    const ts = new Date(now - 7200000 + i * 600000).toISOString();
    await patternEngine.receiveInput(makeObs(`trend-${i}`, ts, 100 + i * 30));
  }

  // Allow EventBus handlers to settle
  await new Promise((r) => setTimeout(r, 100));

  // ── VERIFICATION ──────────────────────────────────────────────────

  // 1. PatternEngine detected POSITIVE_TREND
  const patPipeline = patternEngine.getPipeline();
  const allPatterns = await patPipeline.getAllPatterns();
  const trendPatterns = allPatterns.filter((p) => p.identity.category === "POSITIVE_TREND");
  assert.ok(trendPatterns.length > 0, "PatternEngine must detect POSITIVE_TREND");

  // 2. MemoryEngine has at least one memory
  const memPipeline = memoryEngine.getPipeline();
  const allMemories = memPipeline.index.getAll();
  assert.ok(allMemories.length > 0, "MemoryEngine must have at least one memory");

  // 3. At least one memory references a detected POSITIVE_TREND pattern
  const trendPatternIds = new Set(trendPatterns.map((p) => p.id));
  const patternMemories = allMemories.filter((m) => trendPatternIds.has(m.identity.patternId));
  assert.ok(patternMemories.length >= 1,
    `At least one memory must reference a POSITIVE_TREND pattern, got ${patternMemories.length}`);

  // 4. Each memory has valid confidence and strength
  for (const mem of patternMemories) {
    assert.ok(mem.confidence > 0, `Memory ${mem.id} must have confidence > 0`);
    assert.ok(mem.strength > 0, `Memory ${mem.id} must have strength > 0`);
    assert.equal(mem.identity.patternId, mem.identity.evidenceId,
      `Memory ${mem.id} evidenceId must match patternId`);
  }

  // 5. Max 2 memories per pattern (emerging_confirmed + trend_detected max)
  for (const patternId of trendPatternIds) {
    const mems = allMemories.filter((m) => m.identity.patternId === patternId);
    assert.ok(mems.length <= 2,
      `Max 2 memories per pattern, got ${mems.length} for ${patternId}`);
  }

  console.log("\n===== VS0-009 PATTERN → MEMORY REPORT =====");
  console.log(`PatternEngine total patterns: ${allPatterns.length}`);
  console.log(`POSITIVE_TREND patterns: ${trendPatterns.length}`);
  console.log(`MemoryEngine total memories: ${allMemories.length}`);
  console.log(`Pattern-referencing memories: ${patternMemories.length}`);
  for (const mem of patternMemories) {
    console.log(`  Memory ${mem.id}: patternId=${mem.identity.patternId}, conf=${mem.confidence.toFixed(4)}, stage=${mem.stage}`);
  }
  console.log("============================================\n");

  await runtime.shutdown();
});
