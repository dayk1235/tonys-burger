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

const OBSERVATION_MANIFEST: EngineManifestDefinition = {
  name: "ObservationEngine",
  version: "1.0.0",
  classification: "Perception",
  pipelinePosition: "OBSERVATION",
  purpose: "VS1-001 memory-knowledge integration",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const PATTERN_MANIFEST: EngineManifestDefinition = {
  name: "PatternEngine",
  version: "1.0.0",
  classification: "Understanding",
  pipelinePosition: "PATTERN",
  purpose: "VS1-001 memory-knowledge integration",
  dependencies: [{ engineName: "ObservationEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

const MEMORY_MANIFEST: EngineManifestDefinition = {
  name: "MemoryEngine",
  version: "1.0.0",
  classification: "Storage",
  pipelinePosition: "MEMORY",
  purpose: "VS1-001 memory-knowledge integration",
  dependencies: [{ engineName: "PatternEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 50 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

const KNOWLEDGE_MANIFEST: EngineManifestDefinition = {
  name: "KnowledgeEngine",
  version: "1.0.0",
  classification: "Knowledge",
  pipelinePosition: "KNOWLEDGE",
  purpose: "VS1-001 memory-knowledge integration",
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

test("VS1-001 — Memory → Knowledge: KnowledgeEngine creates Knowledge entity from MemoryEngine memory", async () => {
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

  const now = Date.now();

  for (let i = 0; i < 5; i++) {
    const ts = new Date(now - 7200000 + i * 600000).toISOString();
    await patternEngine.receiveInput(makeObs(`trend-${i}`, ts, 100 + i * 30));
  }

  await new Promise((r) => setTimeout(r, 100));

  // ── VERIFICATION ──────────────────────────────────────────────────

  // 1. PatternEngine detected POSITIVE_TREND
  const patPipeline = patternEngine.getPipeline();
  const allPatterns = await patPipeline.getAllPatterns();
  const trendPatterns = allPatterns.filter((p) => p.identity.category === "POSITIVE_TREND");
  assert.ok(trendPatterns.length > 0, "PatternEngine must detect POSITIVE_TREND");

  // 2. MemoryEngine has at least one memory referencing the pattern
  const memPipeline = memoryEngine.getPipeline();
  const allMemories = memPipeline.index.getAll();
  assert.ok(allMemories.length > 0, "MemoryEngine must have at least one memory");

  const trendPatternIds = new Set(trendPatterns.map((p) => p.id));
  const patternMemories = allMemories.filter((m) => trendPatternIds.has(m.identity.patternId));
  assert.ok(patternMemories.length >= 1,
    `At least one memory must reference a POSITIVE_TREND pattern, got ${patternMemories.length}`);

  // 3. Pick the first memory referencing a pattern
  const sourceMemory = patternMemories[0];
  assert.ok(sourceMemory.confidence > 0, `Source memory ${sourceMemory.id} must have confidence > 0`);
  assert.ok(sourceMemory.strength > 0, `Source memory ${sourceMemory.id} must have strength > 0`);

  // 4. Build KnowledgeInput payload from the Memory data
  const knowledgePayload = {
    memory: {
      id: sourceMemory.id,
      identity: {
        patternId: sourceMemory.identity.patternId,
        name: sourceMemory.identity.name,
        category: "GENERAL",
      },
      provenance: {
        sourceEvidenceIds: [...sourceMemory.provenance.sourceEvidenceIds],
        sourceObservationIds: [...sourceMemory.provenance.sourceObservationIds],
      },
      description: sourceMemory.description,
      confidence: sourceMemory.confidence,
    },
    businessId: "tonys-burger",
  };

  // 5. Create Knowledge from memory data
  const result = await knowledgeEngine.receiveInput(
    knowledgePayload as unknown as Record<string, unknown>
  );

  assert.ok(result.success, "KnowledgeEngine receiveInput must succeed");
  assert.ok(result.knowledgeId, "KnowledgeEngine must return a knowledgeId");
  assert.equal(result.operation, "EXTRACT", "Operation must be EXTRACT");

  // 6. Verify Knowledge entity in pipeline
  const knwPipeline = knowledgeEngine.getPipeline();
  const allKnowledge = knwPipeline.index.getAll();
  assert.equal(allKnowledge.length, 1,
    `KnowledgeEngine must contain exactly 1 knowledge entity, got ${allKnowledge.length}`);

  const knowledge = allKnowledge[0];

  // 7. Traceability: memoryId preserved
  assert.equal(knowledge.identity.memoryId, sourceMemory.id,
    `Knowledge memoryId must match source memory id`);

  // 8. Traceability: patternId preserved
  assert.equal(knowledge.identity.patternId, sourceMemory.identity.patternId,
    `Knowledge patternId must match source memory patternId`);

  // 9. Traceability: evidenceIds preserved
  assert.ok(knowledge.identity.evidenceIds.length > 0,
    "Knowledge must have at least one evidenceId");
  for (const eid of sourceMemory.provenance.sourceEvidenceIds) {
    assert.ok(knowledge.identity.evidenceIds.includes(eid),
      `Knowledge evidenceIds must include ${eid} from source memory`);
  }

  // 10. Confidence and integrity are positive
  assert.ok(knowledge.confidence > 0,
    `Knowledge confidence must be > 0, got ${knowledge.confidence}`);
  assert.ok(knowledge.integrity > 0,
    `Knowledge integrity must be > 0, got ${knowledge.integrity}`);

  // 11. Knowledge stage is VALIDATED (auto-validated in receiveInput)
  assert.equal(knowledge.stage, "VALIDATED",
    `Knowledge stage must be VALIDATED, got ${knowledge.stage}`);

  // 12. Knowledge has concepts, graphNodes, graphEdges (extraction result)
  assert.ok(knowledge.concepts.length >= 1,
    `Knowledge must have at least 1 concept, got ${knowledge.concepts.length}`);
  assert.ok(knowledge.graphNodes.length >= 1,
    `Knowledge must have at least 1 graphNode, got ${knowledge.graphNodes.length}`);

  // 13. Provenance is fully preserved
  assert.ok(knowledge.provenance.sourceMemoryIds.includes(sourceMemory.id),
    `Knowledge provenance must include source memoryId ${sourceMemory.id}`);
  assert.ok(knowledge.provenance.sourcePatternIds.includes(sourceMemory.identity.patternId),
    `Knowledge provenance must include source patternId ${sourceMemory.identity.patternId}`);

  // 14. Versioning: at least 1 version recorded
  assert.ok(knowledge.versions.length >= 1,
    `Knowledge must have at least 1 version, got ${knowledge.versions.length}`);

  // 15. Quality profile is computed
  assert.equal(typeof knowledge.qualityProfile.semanticConsistency, "number",
    "Knowledge quality profile must have semanticConsistency");
  assert.equal(typeof knowledge.qualityProfile.traceability, "number",
    "Knowledge quality profile must have traceability");

  // 16. Idempotency: second call creates a distinct entity
  const result2 = await knowledgeEngine.receiveInput(
    knowledgePayload as unknown as Record<string, unknown>
  );
  assert.ok(result2.success, "Second KnowledgeEngine call must succeed");
  const allKnowledgeAfter = knwPipeline.index.getAll();
  assert.equal(allKnowledgeAfter.length, 2,
    `KnowledgeEngine must contain 2 entities after second call, got ${allKnowledgeAfter.length}`);
  assert.notEqual(allKnowledgeAfter[0].id, allKnowledgeAfter[1].id,
    "Each knowledge entity must have a unique ID");
  for (const k of allKnowledgeAfter) {
    assert.equal(k.identity.memoryId, sourceMemory.id,
      `All knowledge entities must reference the same memoryId`);
  }

  console.log("\n===== VS1-001 MEMORY → KNOWLEDGE REPORT =====");
  console.log(`Source memory ID: ${sourceMemory.id}`);
  console.log(`Source patternId: ${sourceMemory.identity.patternId}`);
  console.log(`Source evidenceIds: [${sourceMemory.provenance.sourceEvidenceIds.join(", ")}]`);
  console.log(`Knowledge entities created: ${allKnowledgeAfter.length}`);
  for (const k of allKnowledgeAfter) {
    console.log(`  Knowledge ${k.id}: memoryId=${k.identity.memoryId}, patternId=${k.identity.patternId}, stage=${k.stage}, conf=${k.confidence.toFixed(4)}, integrity=${k.integrity.toFixed(4)}`);
  }
  console.log("===============================================\n");

  await runtime.shutdown();
});
