import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Runtime } from "../Runtime";
import { ObservationEngine } from "../../engines/observation/ObservationEngine";
import { PatternEngine } from "../../engines/pattern/PatternEngine";
import { MemoryEngine } from "../../engines/memory/MemoryEngine";
import { KnowledgeEngine } from "../../engines/knowledge/KnowledgeEngine";
import { ObservationCategory } from "../../engines/observation/ObservationTypes";
import { EngineManifestDefinition } from "../EngineManifest";
import type { Memory } from "../../engines/memory/MemoryTypes";

const OBSERVATION_MANIFEST: EngineManifestDefinition = {
  name: "ObservationEngine",
  version: "1.0.0",
  classification: "Perception",
  pipelinePosition: "OBSERVATION",
  purpose: "BF-007 automatic memory-knowledge flow",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const PATTERN_MANIFEST: EngineManifestDefinition = {
  name: "PatternEngine",
  version: "1.0.0",
  classification: "Understanding",
  pipelinePosition: "PATTERN",
  purpose: "BF-007 automatic memory-knowledge flow",
  dependencies: [{ engineName: "ObservationEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

const MEMORY_MANIFEST: EngineManifestDefinition = {
  name: "MemoryEngine",
  version: "1.0.0",
  classification: "Storage",
  pipelinePosition: "MEMORY",
  purpose: "BF-007 automatic memory-knowledge flow",
  dependencies: [{ engineName: "PatternEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 50 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

const KNOWLEDGE_MANIFEST: EngineManifestDefinition = {
  name: "KnowledgeEngine",
  version: "1.0.0",
  classification: "Knowledge",
  pipelinePosition: "KNOWLEDGE",
  purpose: "BF-007 automatic memory-knowledge flow",
  dependencies: [{ engineName: "MemoryEngine", required: true }],
  resourceProfile: { memoryMB: 128, maxLatencyMs: 300, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
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

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("BF-007 — Automatic Memory → Knowledge: EventBus creates Knowledge without manual receiveInput", async () => {
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

  const knowledgeEngine = new KnowledgeEngine(
    runtime.eventBus, runtime.auditPipeline, runtime.recoveryPipeline,
  );

  await runtime.registerEngine("ObservationEngine", observationEngine, OBSERVATION_MANIFEST);
  await runtime.registerEngine("PatternEngine", patternEngine, PATTERN_MANIFEST);
  await runtime.registerEngine("MemoryEngine", memoryEngine, MEMORY_MANIFEST);
  await runtime.registerEngine("KnowledgeEngine", knowledgeEngine, KNOWLEDGE_MANIFEST);

  await observationEngine.start();
  runtime.engineRegistry.updateState("ObservationEngine", "RUNNING");
  await patternEngine.start();
  runtime.engineRegistry.updateState("PatternEngine", "RUNNING");
  await memoryEngine.start();
  runtime.engineRegistry.updateState("MemoryEngine", "RUNNING");
  await knowledgeEngine.start();
  runtime.engineRegistry.updateState("KnowledgeEngine", "RUNNING");
  await runtime.start();

  // ── Phase 1: Send observations → automatic Patterns → automatic Memories ──

  const now = Date.now();
  for (let i = 0; i < 5; i++) {
    const ts = new Date(now - 7200000 + i * 600000).toISOString();
    await patternEngine.receiveInput(makeObs(`trend-${i}`, ts, 100 + i * 30));
  }
  await delay(100);

  // ── Phase 2: Verify pattern exists (gate check) ──

  const patPipeline = patternEngine.getPipeline();
  const allPatterns = await patPipeline.getAllPatterns();
  const trendPatterns = allPatterns.filter((p) => p.identity.category === "POSITIVE_TREND");
  assert.ok(trendPatterns.length > 0, "PatternEngine must detect POSITIVE_TREND");
  const trendPatternIds = new Set(trendPatterns.map((p) => p.id));

  // ── Phase 3: Verify memory was created automatically by MemoryEngine subscriber ──

  const memPipeline = memoryEngine.getPipeline();
  const allMemories = memPipeline.index.getAll();
  assert.ok(allMemories.length > 0, "MemoryEngine must have at least one memory");

  const patternMemories = allMemories.filter((m) => trendPatternIds.has(m.identity.patternId));
  assert.ok(patternMemories.length >= 1, "At least one memory must reference a POSITIVE_TREND pattern");

  // ── Phase 4: Prepare memory for consolidation ──
  // Advance stage through WORKING → CANDIDATE → SHORT_TERM, then activate to meet
  // SHORT_TERM consolidation criteria (accessCount >= 3, strength >= 0.4).

  const sourceMemory = patternMemories[0];

  // WORKING → CANDIDATE (allowed transition)
  let mem = memPipeline.factory.cloneWithTransition(sourceMemory, "CANDIDATE");
  memPipeline.index.index(mem);

  // CANDIDATE → SHORT_TERM (allowed transition)
  mem = memPipeline.factory.cloneWithTransition(mem, "SHORT_TERM", {
    strength: 0.5,
  });
  memPipeline.index.index(mem);

  // Activate 3 times to reach accessCount >= 3
  for (let i = 0; i < 3; i++) {
    mem = memPipeline.activation.activate(mem);
  }
  memPipeline.index.index(mem);

  assert.equal(mem.stage, "SHORT_TERM", "Memory must be at SHORT_TERM stage");
  assert.ok(mem.metadata.totalAccessCount >= 3, "Memory must have accessCount >= 3");
  assert.ok(mem.strength >= 0.4, "Memory must have strength >= 0.4");

  // ── Phase 5: Consolidate SHORT_TERM → STABILIZING ──
  // This does NOT fire an event KnowledgeEngine subscribes to.
  const stabilized = await memPipeline.consolidateMemory(mem);
  assert.equal(stabilized.stage, "STABILIZING",
    "First consolidation must promote SHORT_TERM → STABILIZING");

  // ── Phase 6: Consolidate STABILIZING → CONSOLIDATED ──
  // This fires emitLifecycleEvent → "memory.lifecycle.consolidated" → EventBus →
  // KnowledgeEngine subscriber → receiveInput → createKnowledge.
  // ALL automatic — no manual receiveInput call in this test.
  const consolidated = await memPipeline.consolidateMemory(stabilized);
  assert.equal(consolidated.stage, "CONSOLIDATED",
    "Second consolidation must promote STABILIZING → CONSOLIDATED");

  // ── Phase 7: Verify Knowledge was created automatically via EventBus ──

  const knwPipeline = knowledgeEngine.getPipeline();
  const allKnowledge = knwPipeline.index.getAll();

  assert.ok(allKnowledge.length >= 1,
    `KnowledgeEngine must contain at least 1 knowledge entity after automatic EventBus flow, got ${allKnowledge.length}`);

  // Only the first entity is the one automatically created from
  // "memory.lifecycle.consolidated". Future runs may accumulate more.
  // We verify the first one for traceability.
  const knowledge = allKnowledge[0];

  // 7a. Traceability: memoryId preserved
  assert.equal(knowledge.identity.memoryId, consolidated.id,
    `Knowledge memoryId (${knowledge.identity.memoryId}) must match consolidated memory id (${consolidated.id})`);

  // 7b. Traceability: patternId preserved
  assert.equal(knowledge.identity.patternId, consolidated.identity.patternId,
    `Knowledge patternId must match source memory patternId`);

  // 7c. Traceability: evidenceIds preserved
  assert.ok(knowledge.identity.evidenceIds.length > 0,
    "Knowledge must have at least one evidenceId");
  for (const eid of consolidated.provenance.sourceEvidenceIds) {
    assert.ok(knowledge.identity.evidenceIds.includes(eid),
      `Knowledge evidenceIds must include ${eid} from source memory`);
  }

  // 7d. Provenance preserved
  assert.ok(knowledge.provenance.sourceMemoryIds.includes(consolidated.id),
    `Knowledge provenance must include source memoryId`);
  assert.ok(knowledge.provenance.sourcePatternIds.includes(consolidated.identity.patternId),
    `Knowledge provenance must include source patternId`);

  // 7e. Confidence and integrity
  assert.ok(knowledge.confidence > 0,
    `Knowledge confidence must be > 0, got ${knowledge.confidence}`);
  assert.ok(knowledge.integrity > 0,
    `Knowledge integrity must be > 0, got ${knowledge.integrity}`);

  // 7f. Stage is VALIDATED (auto-validated in receiveInput)
  assert.equal(knowledge.stage, "VALIDATED",
    `Knowledge stage must be VALIDATED, got ${knowledge.stage}`);

  // 7g. Extraction results present
  assert.ok(knowledge.concepts.length >= 1,
    `Knowledge must have at least 1 concept, got ${knowledge.concepts.length}`);
  assert.ok(knowledge.graphNodes.length >= 1,
    `Knowledge must have at least 1 graphNode, got ${knowledge.graphNodes.length}`);

  // 7h. Versioning
  assert.ok(knowledge.versions.length >= 1,
    `Knowledge must have at least 1 version, got ${knowledge.versions.length}`);

  // 7i. Quality profile computed
  assert.equal(typeof knowledge.qualityProfile.semanticConsistency, "number",
    "Knowledge quality profile must have semanticConsistency");

  // ── Phase 8: Verify EventBus actually delivered the event ──

  const consolidatedEvents = runtime.eventBus.getHistory("memory.lifecycle.consolidated");
  assert.ok(consolidatedEvents.length >= 1,
    "EventBus must have at least one memory.lifecycle.consolidated event");

  // ── Phase 9: Verify NO manual receiveInput calls were made ──
  // This test never calls knowledgeEngine.receiveInput() directly.
  // The assertion above that knowledge exists proves the EventBus path works.

  console.log("\n===== BF-007 AUTOMATIC MEMORY → KNOWLEDGE REPORT =====");
  console.log(`Patterns detected: ${allPatterns.length} (${trendPatterns.length} POSITIVE_TREND)`);
  console.log(`Memories created: ${allMemories.length} (${patternMemories.length} pattern-referencing)`);
  console.log(`Memory lifecycle: WORKING → CANDIDATE → SHORT_TERM → STABILIZING → CONSOLIDATED`);
  console.log(`Consolidation events on EventBus: ${consolidatedEvents.length}`);
  console.log(`Knowledge entities created (automatic): ${allKnowledge.length}`);
  console.log(`  First Knowledge: ${knowledge.id}`);
  console.log(`    memoryId: ${knowledge.identity.memoryId}`);
  console.log(`    patternId: ${knowledge.identity.patternId}`);
  console.log(`    evidenceIds: [${knowledge.identity.evidenceIds.join(", ")}]`);
  console.log(`    stage: ${knowledge.stage}`);
  console.log(`    confidence: ${knowledge.confidence.toFixed(4)}`);
  console.log(`    integrity: ${knowledge.integrity.toFixed(4)}`);
  console.log(`    concepts: ${knowledge.concepts.length}`);
  console.log(`    graphNodes: ${knowledge.graphNodes.length}`);
  console.log("==================================================\n");

  await runtime.shutdown();
});
