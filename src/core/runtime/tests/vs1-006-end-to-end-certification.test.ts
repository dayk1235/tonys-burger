import test from "node:test";
import assert from "node:assert/strict";
import { Runtime } from "../Runtime";
import { ObservationEngine } from "../../engines/observation/ObservationEngine";
import { PatternEngine } from "../../engines/pattern/PatternEngine";
import { MemoryEngine } from "../../engines/memory/MemoryEngine";
import { KnowledgeEngine } from "../../engines/knowledge/KnowledgeEngine";
import { AttentionEngine } from "../../engines/attention/AttentionEngine";
import { ReasoningEngine } from "../../engines/reasoning/ReasoningEngine";
import { DecisionEngine } from "../../engines/decision/DecisionEngine";
import { ObservationCategory } from "../../engines/observation/ObservationTypes";
import { MEMORY_EVENTS } from "../../engines/memory/MemoryEvents";
import { KNOWLEDGE_EVENTS } from "../../engines/knowledge/KnowledgeEvents";
import { ATTENTION_EVENTS } from "../../engines/attention/AttentionEvents";
import { REASONING_EVENTS } from "../../engines/reasoning/ReasoningEvents";
import { DECISION_EVENTS } from "../../engines/decision/DecisionEvents";
import type { EngineManifestDefinition } from "../EngineManifest";

const OBSERVATION_MANIFEST: EngineManifestDefinition = {
  name: "ObservationEngine", version: "1.0.0", classification: "Perception",
  pipelinePosition: "OBSERVATION", purpose: "VS1-006 certification",
  dependencies: [], resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};
const PATTERN_MANIFEST: EngineManifestDefinition = {
  name: "PatternEngine", version: "1.0.0", classification: "Understanding",
  pipelinePosition: "PATTERN", purpose: "VS1-006 certification",
  dependencies: [{ engineName: "ObservationEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};
const MEMORY_MANIFEST: EngineManifestDefinition = {
  name: "MemoryEngine", version: "1.0.0",   classification: "Storage",
  pipelinePosition: "PATTERN", purpose: "VS1-006 certification",
  dependencies: [{ engineName: "PatternEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 200, requiredStorageMB: 50 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};
const KNOWLEDGE_MANIFEST: EngineManifestDefinition = {
  name: "KnowledgeEngine", version: "1.0.0", classification: "Knowledge",
  pipelinePosition: "KNOWLEDGE", purpose: "VS1-006 certification",
  dependencies: [{ engineName: "MemoryEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 300, requiredStorageMB: 30 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};
const ATTENTION_MANIFEST: EngineManifestDefinition = {
  name: "AttentionEngine", version: "1.0.0", classification: "Attention",
  pipelinePosition: "ATTENTION", purpose: "VS1-006 certification",
  dependencies: [{ engineName: "KnowledgeEngine", required: true }],
  resourceProfile: { memoryMB: 32, maxLatencyMs: 200, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};
const REASONING_MANIFEST: EngineManifestDefinition = {
  name: "ReasoningEngine", version: "1.0.0",   classification: "Processing",
  pipelinePosition: "REASONING", purpose: "VS1-006 certification",
  dependencies: [{ engineName: "AttentionEngine", required: true }],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 500, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.5, critical: 0.25 },
};
const DECISION_MANIFEST: EngineManifestDefinition = {
  name: "DecisionEngine", version: "1.0.0", classification: "Decision",
  pipelinePosition: "DECISION", purpose: "VS1-006 certification",
  dependencies: [{ engineName: "ReasoningEngine", required: true }],
  resourceProfile: { memoryMB: 32, maxLatencyMs: 300, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.6, critical: 0.3 },
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function makeObservation(value: number, timestamp: string) {
  return {
    id: `obs-e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: "ORDER_RECEIVED",
    category: "CUSTOMER" as ObservationCategory,
    timestamp,
    businessId: "tonys-burger",
    source: { type: "SYSTEM_LOG" as const, trustScore: 0.9 },
    payload: { grandTotal: value, paymentAmount: value, itemCount: 2 },
    stage: "HISTORICAL",
  };
}

test("VS1-006 — End-to-End Cognitive Runtime Certification", { timeout: 30000 }, async () => {
  const runtime = new Runtime();
  const eventBus = runtime.eventBus;

  const obsEngine = new ObservationEngine(eventBus, runtime.auditPipeline, runtime.recoveryPipeline, runtime.contextBus);
  const patEngine = new PatternEngine(eventBus, runtime.auditPipeline, runtime.recoveryPipeline);
  const memEngine = new MemoryEngine(eventBus, runtime.auditPipeline, runtime.recoveryPipeline);
  const knwEngine = new KnowledgeEngine(eventBus, runtime.auditPipeline, runtime.recoveryPipeline);
  const attEngine = new AttentionEngine(eventBus, runtime.auditPipeline, runtime.recoveryPipeline);
  const reaEngine = new ReasoningEngine(eventBus, runtime.auditPipeline, runtime.recoveryPipeline);
  const decEngine = new DecisionEngine(eventBus, runtime.auditPipeline, runtime.recoveryPipeline);

  await runtime.registerEngine("ObservationEngine", obsEngine, OBSERVATION_MANIFEST);
  await runtime.registerEngine("PatternEngine", patEngine, PATTERN_MANIFEST);
  await runtime.registerEngine("MemoryEngine", memEngine, MEMORY_MANIFEST);
  await runtime.registerEngine("KnowledgeEngine", knwEngine, KNOWLEDGE_MANIFEST);
  await runtime.registerEngine("AttentionEngine", attEngine, ATTENTION_MANIFEST);
  await runtime.registerEngine("ReasoningEngine", reaEngine, REASONING_MANIFEST);
  await runtime.registerEngine("DecisionEngine", decEngine, DECISION_MANIFEST);

  // Trap canonical bridge events
  const bridgeEvents: { event: string; payload: unknown }[] = [];
  const eventSubs = [
    MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED,
    MEMORY_EVENTS.LIFECYCLE_WORKING_CREATED,
    KNOWLEDGE_EVENTS.LIFECYCLE_VALIDATED,
    ATTENTION_EVENTS.OPERATION_PRIORITIZED,
    REASONING_EVENTS.LIFECYCLE_COMPLETED,
    DECISION_EVENTS.LIFECYCLE_INITIATED,
  ];
  for (const evt of eventSubs) {
    eventBus.subscribe(evt, async (payload: Record<string, unknown>) => {
      bridgeEvents.push({ event: evt, payload });
    });
  }

  await obsEngine.start();
  runtime.engineRegistry.updateState("ObservationEngine", "RUNNING");
  await patEngine.start();
  runtime.engineRegistry.updateState("PatternEngine", "RUNNING");
  await memEngine.start();
  runtime.engineRegistry.updateState("MemoryEngine", "RUNNING");
  await knwEngine.start();
  runtime.engineRegistry.updateState("KnowledgeEngine", "RUNNING");
  await attEngine.start();
  runtime.engineRegistry.updateState("AttentionEngine", "RUNNING");
  await reaEngine.start();
  runtime.engineRegistry.updateState("ReasoningEngine", "RUNNING");
  await decEngine.start();
  runtime.engineRegistry.updateState("DecisionEngine", "RUNNING");
  await runtime.start();

  const now = Date.now();

  // ── Bridge 1: Observation → Pattern ──
  for (let i = 0; i < 3; i++) {
    const ts = new Date(now - 3600000 + i * 600000).toISOString();
    await patEngine.receiveInput(makeObservation(100 + i * 30, ts));
  }
  await delay(200);

  const patPipeline = patEngine.getPipeline();
  const allPatterns = await patPipeline.getAllPatterns();
  assert.ok(allPatterns.length > 0, "Bridge 1: PatternEngine must detect patterns");
  const pattern = allPatterns.find((p) => p.identity.category === "POSITIVE_TREND") || allPatterns[0];
  console.log(`  Bridge 1: Pattern ${pattern.id} (${pattern.identity.category})`);

  // ── Bridge 2: Pattern → Memory (automatic) ──
  await delay(100);
  const memPipeline = memEngine.getPipeline();
  const allMemories = memPipeline.index.getAll();
  const patternMemories = allMemories.filter((m) => m.identity.patternId === pattern.id);
  assert.ok(patternMemories.length >= 1, "Bridge 2: Memory must be created from pattern");
  let memory = patternMemories[0];
  console.log(`  Bridge 2: Memory ${memory.id} (stage: ${memory.stage})`);

  // ── Bridge 3: Memory → CONSOLIDATED → Knowledge (automatic on CONSOLIDATED) ──
  const memPipe = memPipeline;
  memory = memPipe.factory.cloneWithTransition(memory, "CANDIDATE", { strength: 0.3 });
  memPipe.index.index(memory);
  memory = memPipe.factory.cloneWithTransition(memory, "SHORT_TERM", {
    strength: 0.4,
    metadata: { ...memory.metadata, totalAccessCount: 5 },
  });
  memPipe.index.index(memory);

  for (let i = 0; i < 5; i++) {
    const s = await memPipe.strengthenMemory(memory, 0.15);
    memPipe.index.index(s);
    memory = memPipe.index.getById(memory.id)!;
  }
  await memPipe.processCycle();
  memory = memPipe.index.getById(memory.id)!;
  assert.ok(memory.stage === "STABILIZING", `Memory should be STABILIZING, got ${memory.stage}`);

  await memPipe.processCycle();
  memory = memPipe.index.getById(memory.id)!;
  assert.ok(memory.stage === "CONSOLIDATED" || memory.stage === "LONG_TERM",
    `Memory must reach CONSOLIDATED, got ${memory.stage}`);
  console.log(`  Bridge 3a: Memory CONSOLIDATED ✓`);

  // Wait for automatic Knowledge creation from CONSOLIDATED event
  await delay(300);
  const knwPipeline = knwEngine.getPipeline();
  const allKnowledge = knwPipeline.index.getAll();
  assert.ok(allKnowledge.length >= 1, "Bridge 3b: Knowledge must be created from memory");
  console.log(`  Bridge 3b: Knowledge ✓ (${allKnowledge[0].id})`);

  // ── Bridge 4: Knowledge → Attention (automatic on VALIDATED) ──
  await delay(300);
  const attPipeline = attEngine.getPipeline();
  const allAttention = attPipeline.memory.getAll();
  assert.ok(allAttention.length >= 1,
    `Bridge 4: Attention must exist, got ${allAttention.length}`);
  const attention = allAttention[0];
  console.log(`  Bridge 4: Attention ✓ (${attention.id}, priority: ${attention.priority.toFixed(3)})`);

  // ── Bridge 5: Attention → Reasoning (manual — questionText required) ──
  // The Attention→Reasoning bridge is fully wired via EventBus subscriber.
  // However, auto-created attention items don't carry questionText, which
  // the ReasoningValidator requires. In production, a human/system sets the
  // question when an attention item is selected for reasoning.
  const reasoningResult = await reaEngine.receiveInput({
    attention: {
      id: attention.id,
      identity: attention.identity,
      provenance: attention.provenance,
      priorityFactors: attention.priorityFactors,
      metadata: attention.metadata,
    },
    questionText: "Should we increase prices on high-demand items?",
    businessId: "tonys-burger",
  } as unknown as Record<string, unknown>);

  assert.ok(reasoningResult.success, "Bridge 5a: Reasoning must be created from attention");
  assert.ok(reasoningResult.reasoningId, "Bridge 5a: Reasoning must return reasoningId");
  console.log(`  Bridge 5a: Reasoning ✓ (${reasoningResult.reasoningId})`);

  // Reasoning.createCase runs through all stages to COMPLETED, which
  // should automatically trigger the Decision subscriber
  await delay(200);

  // ── Bridge 6: Reasoning → Decision (automatic on LIFECYCLE_COMPLETED) ──
  await delay(200);

  // ── Verify canonical envelopes ──
  const consolidatedEvents = bridgeEvents.filter((e) => e.event === MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED);
  const knowledgeEvents = bridgeEvents.filter((e) => e.event === KNOWLEDGE_EVENTS.LIFECYCLE_VALIDATED);
  const attentionEvents = bridgeEvents.filter((e) => e.event === ATTENTION_EVENTS.OPERATION_PRIORITIZED);
  const reasoningEvents = bridgeEvents.filter((e) => e.event === REASONING_EVENTS.LIFECYCLE_COMPLETED);
  const decisionEvents = bridgeEvents.filter((e) => e.event === DECISION_EVENTS.LIFECYCLE_INITIATED);

  console.log(`\n  EventBus signals:`);
  console.log(`    MEMORY.LIFECYCLE_CONSOLIDATED: ${consolidatedEvents.length}`);
  console.log(`    KNOWLEDGE.LIFECYCLE_VALIDATED: ${knowledgeEvents.length}`);
  console.log(`    ATTENTION.OPERATION_PRIORITIZED: ${attentionEvents.length}`);
  console.log(`    REASONING.LIFECYCLE_COMPLETED: ${reasoningEvents.length}`);
    console.log(`    DECISION.LIFECYCLE_INITIATED: ${decisionEvents.length}`);

  assert.ok(reasoningEvents.length >= 1,
    `Bridge 5b: Reasoning.LIFECYCLE_COMPLETED must fire, got ${reasoningEvents.length}`);
  assert.ok(decisionEvents.length >= 1,
    `Bridge 6: Decision.LIFECYCLE_INITIATED must fire, got ${decisionEvents.length}`);
  console.log(`  Bridge 6: Decision ✓ (${decisionEvents.length} event(s))`);

  for (const ev of consolidatedEvents) {
    const p = ev.payload as Record<string, unknown>;
    assert.ok(p.memory, `Consolidated event must carry 'memory'`);
    assert.ok(typeof p.operation === "string", `Consolidated event must carry 'operation'`);
    assert.ok(typeof p.timestamp === "string", `Consolidated event must carry 'timestamp'`);
  }
  for (const ev of reasoningEvents) {
    const p = ev.payload as Record<string, unknown>;
    assert.ok(p.reasoning, `Reasoning completed event must carry 'reasoning'`);
  }
  for (const ev of decisionEvents) {
    const p = ev.payload as Record<string, unknown>;
    assert.ok(p.decision, `Decision initiated event must carry 'decision'`);
  }

  console.log(`\n  ===== VS1-006 CERTIFICATION PASSED =====`);
  console.log(`  Bridge 1: Pattern creation             ✓`);
  console.log(`  Bridge 2: Pattern→Memory (automatic)    ✓`);
  console.log(`  Bridge 3: Memory→Knowledge (auto)       ✓`);
  console.log(`  Bridge 4: Knowledge→Attention (auto)    ✓`);
  console.log(`  Bridge 5: Attention→Reasoning (manual)  ✓`);
  console.log(`  Bridge 6: Reasoning→Decision (auto)     ✓`);
  console.log(`  =========================================`);

  await memEngine.stop();
  await attEngine.stop();
  await obsEngine.stop();
  await patEngine.stop();
  await knwEngine.stop();
  await reaEngine.stop();
  await decEngine.stop();
});
