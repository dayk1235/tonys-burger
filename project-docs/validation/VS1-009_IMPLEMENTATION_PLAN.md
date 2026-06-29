# VS1-009 IMPLEMENTATION PLAN — Knowledge Architecture Discovery

**VS1-009 — Knowledge Architecture Discovery**
**Date:** 2026-06-28
**Status:** DISCOVERY COMPLETE — No implementation in this Sprint

---

## 1. Scope

This is a DISCOVERY ONLY sprint per LAW-069. No code is modified. No runtime behavior is changed. This plan lists the BFs (Bug Fixes/Features) discovered during the Knowledge Architecture Discovery that must be implemented in subsequent sprints.

---

## 2. Discovered Bug Fixes (BFs)

### BF-018 — KnowledgeEvent Contract: Unreachable Events

| Property | Value |
|----------|-------|
| **Priority** | HIGH |
| **Discovered in** | VS1-009 |
| **Affected files** | `KnowledgeEvents.ts`, `KnowledgePipeline.ts`, `KnowledgeEngine.ts` |
| **Issue** | 10 of 24 defined events are never emitted. `linkConcepts()` omits `emitEvent()` entirely. `getKnowledgeOperationEventName()` maps operations that are never called. |
| **Required fix** | (1) Add `emitEvent()` to `linkConcepts()`. (2) Add `emitEvent()` for `knowledge.operation.validated` in `validateKnowledge()`. (3) Emit `knowledge.lifecycle.extracted` in `createKnowledge()`. (4) Emit `knowledge.lifecycle.generalized` and `knowledge.lifecycle.specialized` through `emitLifecycleEvent()` instead of (or in addition to) `emitEvent()`. (5) Remove or implement the remaining unreachable event constants. |
| **Impact** | Bridge subscribers may miss events; event contract cannot be certified. |
| **Dependencies** | None |

### BF-019 — Silent Catch Blocks in KnowledgeEngine

| Property | Value |
|----------|-------|
| **Priority** | HIGH |
| **Discovered in** | VS1-009 |
| **Affected files** | `KnowledgeEngine.ts:116,118,125,127,133,135`, `KnowledgePipeline.ts:385-388` |
| **Issue** | 5 silent catch blocks swallow errors in event subscribers. No audit log, no recovery pipeline integration. |
| **Required fix** | Replace silent catches with audit pipeline logging + recovery pipeline registration for critical failures. |
| **Impact** | Undiagnosed failures; operations proceed silently with incorrect state. |
| **Dependencies** | None |

### BF-020 — KnowledgeEngine ID Determinism

| Property | Value |
|----------|-------|
| **Priority** | MEDIUM |
| **Discovered in** | VS1-009 |
| **Affected files** | `KnowledgeFactory.ts:18-20` |
| **Issue** | ID generation uses `Date.now() + counter + Math.random()`. Same input → different knowledge IDs and timestamps. |
| **Required fix** | Replace with content-addressed or deterministic ID scheme (e.g., hash of input fields + sequence counter). |
| **Impact** | Cannot certify determinism; no replayability. |
| **Dependencies** | BF-016 (Pattern determinism — same approach) |

### BF-021 — KnowledgeRelationships.buildRelationships() Not Wired

| Property | Value |
|----------|-------|
| **Priority** | LOW |
| **Discovered in** | VS1-009 |
| **Affected files** | `KnowledgePipeline.ts`, `KnowledgeRelationships.ts` |
| **Issue** | `KnowledgeRelationships` is instantiated in pipeline but `buildRelationships()` is never called from any pipeline method. |
| **Required fix** | Add call to `relationships.buildRelationships()` at appropriate pipeline point (e.g., during validation or promotion). |
| **Impact** | Inter-knowledge relationships (duplicate, corroboration, contradiction) are never detected. |
| **Dependencies** | None |

### BF-022 — KnowledgeEngine Missing Periodic Cycle

| Property | Value |
|----------|-------|
| **Priority** | MEDIUM |
| **Discovered in** | VS1-009 |
| **Affected files** | `KnowledgeEngine.ts` |
| **Issue** | Unlike PatternEngine (with `processingInterval`) and MemoryEngine (with `setInterval(processCycle, 60000)`), KnowledgeEngine has NO periodic cycle. Knowledge never advances beyond VALIDATED without explicit external calls. No automatic consolidation, deprecation, archival, or generalization. |
| **Required fix** | Add a periodic cycle to KnowledgeEngine that: (1) promotes high-quality VALIDATED knowledge to SEMANTIC → CANONICAL, (2) deprecates stale knowledge, (3) archives old knowledge. |
| **Impact** | Knowledge stagnates at VALIDATED stage; no automatic lifecycle progression. |
| **Dependencies** | BF-018 (events needed for lifecycle transitions) |

### BF-023 — Memory→Knowledge Bridge: Fix Dead Event Subscriptions

| Property | Value |
|----------|-------|
| **Priority** | HIGH |
| **Discovered in** | VS1-009 (cross-reference from VS1-008) |
| **Affected files** | `KnowledgeEngine.ts:121-135`, `MemoryPipeline.ts` |
| **Issue** | KnowledgeEngine subscribes to `MEMORY_EVENTS.LIFECYCLE_LONG_TERM_PROMOTED` and `MEMORY_EVENTS.LIFECYCLE_SEMANTIC_ESTABLISHED`, but these events are never emitted by MemoryPipeline (all three stages map to `memory.lifecycle.consolidated`). |
| **Required fix** | Fix MemoryPipeline's `emitLifecycleEvent()` to emit distinct event names per stage, OR consolidate KnowledgeEngine's subscriptions to only listen to `memory.lifecycle.consolidated` and extract the actual stage from the payload. |
| **Impact** | Only 1/3 bridge subscriptions actually work; knowledge is only created from CONSOLIDATED memories, never from LONG_TERM or SEMANTIC. |
| **Dependencies** | VS1-008 (Memory discovery — this is a Memory-side fix) |

### BF-024 — Knowledge→Attention Bridge: Subscribe to More Lifecycle Events

| Property | Value |
|----------|-------|
| **Priority** | MEDIUM |
| **Discovered in** | VS1-009 |
| **Affected files** | `AttentionEngine.ts:155-217` |
| **Issue** | AttentionEngine only subscribes to `knowledge.lifecycle.validated`. Knowledge promoted to GENERALIZED, SPECIALIZED, SEMANTIC, or CANONICAL does not trigger attention. |
| **Required fix** | Add subscriptions for `knowledge.lifecycle.generalized`, `knowledge.lifecycle.specialized`, `knowledge.lifecycle.semantic`, `knowledge.lifecycle.canonical`. |
| **Impact** | Higher-value knowledge stages are invisible to the Attention system. |
| **Dependencies** | BF-018 (events must be emitted first) |

### BF-025 — Knowledge→Attention Category Mapping Semantic Fix

| Property | Value |
|----------|-------|
| **Priority** | LOW |
| **Discovered in** | VS1-009 |
| **Affected files** | `AttentionEngine.ts:220-233` |
| **Issue** | `CUSTOMER_BEHAVIOR → VIP_CUSTOMER` is semantically incorrect. `SEASONALITY` and `OPERATIONAL_PRACTICE` both map to `OPERATIONAL`. `GENERAL` has no mapping (falls through to default). |
| **Required fix** | Review and update category mapping to use semantically correct Attention categories. Add explicit `GENERAL → GENERAL` mapping. |
| **Impact** | Incorrect attention categorization; loss of category specificity. |
| **Dependencies** | None |

### BF-026 — KnowledgeEngine Dedicated Unit Tests

| Property | Value |
|----------|-------|
| **Priority** | MEDIUM |
| **Discovered in** | VS1-009 |
| **Affected files** | (new) `src/core/engines/knowledge/tests/` |
| **Issue** | Knowledge engine has zero dedicated unit tests. All coverage comes from 3 integration tests that test the full pipeline through Runtime. This makes isolated testing, regression detection, and certification difficult. |
| **Required fix** | Create `tests/knowledge.test.ts` with unit tests for: KnowledgeEngine, KnowledgePipeline, KnowledgeValidator, KnowledgeLifecycle, KnowledgeFactory, KnowledgeQuality, KnowledgeConfidence, KnowledgeScoring, KnowledgeExtraction, KnowledgeGeneralization, KnowledgeSpecialization, KnowledgeAbstraction, KnowledgeGraph, KnowledgeSearch, KnowledgeIndex, KnowledgeOntology, KnowledgeConcepts, KnowledgeRelationships, KnowledgeVersioning, KnowledgeInferenceBoundaries, KnowledgeMetrics, KnowledgePolicyEngine. |
| **Impact** | Cannot certify behavior without dedicated tests; regression risk. |
| **Dependencies** | None |

### BF-027 — businessId Propagation Fix (Knowledge Level)

| Property | Value |
|----------|-------|
| **Priority** | HIGH |
| **Discovered in** | VS1-009 |
| **Affected files** | `KnowledgeEngine.ts`, `KnowledgeValidator.ts:57` |
| **Issue** | `businessId` is required by KnowledgeValidator (line 15-16) but `validateKnowledgeInput()` reads `input.businessId` which may be `""` when the propagation chain from Observation→Pattern→Memory is broken. |
| **Required fix** | (1) Ensure businessId propagates correctly from Memory event payloads. (2) Add fallback to extract businessId from Memory's internal fields if top-level businessId is missing. (3) Add audit log when businessId is missing. |
| **Impact** | Knowledge creation from Memory events fails silently (businessId validation throws in validateInput, caught by silent catch). |
| **Dependencies** | Same root cause as BF-017 (Pattern→Memory businessId gap) |

### BF-028 — KnowledgeVersioning.diff() conceptCountChange Fix

| Property | Value |
|----------|-------|
| **Priority** | LOW |
| **Discovered in** | VS1-009 |
| **Affected files** | `KnowledgeVersioning.ts:36` |
| **Issue** | `diff()` returns hardcoded `conceptCountChange: 0` instead of computing actual concept count difference between versions. |
| **Required fix** | Compute actual concept count difference between the two versioned states. |
| **Impact** | Diff is incomplete; incorrect concept change tracking. |
| **Dependencies** | None |

---

## 3. BF Dependency Graph

```
BF-023 (Memory→Knowledge bridge)
  └── BF-027 (businessId propagation)
        └── BF-017 (Pattern→Memory businessId — external)

BF-024 (Knowledge→Attention lifecycle)
  └── BF-018 (Knowledge event contract)

BF-022 (Periodic cycle)
  └── BF-018 (Knowledge event contract)

BF-021 (KnowledgeRelationships wiring)
  └── None

BF-025 (Category mapping)
  └── None

BF-026 (Unit tests)
  └── None

BF-019 (Silent catches)
  └── None

BF-020 (Determinism)
  └── BF-016 (Pattern determinism — shared approach)

BF-028 (Versioning diff)
  └── None
```

---

## 4. Implementation Ordering

| Order | BF | Reason |
|-------|----|--------|
| 1 | BF-019 | Silent catches — fundamental observability |
| 2 | BF-027 | businessId — unblocks the entire bridge |
| 3 | BF-023 | Memory→Knowledge bridge — core integration |
| 4 | BF-018 | Event contract — enables all downstream consumers |
| 5 | BF-026 | Unit tests — prerequisite for certification |
| 6 | BF-020 | Determinism — certification requirement |
| 7 | BF-024 | Knowledge→Attention lifecycle expansion |
| 8 | BF-022 | Periodic cycle — automatic lifecycle progression |
| 9 | BF-021 | KnowledgeRelationships wiring |
| 10 | BF-025 | Category mapping fix |
| 11 | BF-028 | Versioning diff fix |

---

## 5. Non-Goal Items (Future Opportunities)

| Item | Reason |
|------|--------|
| Knowledge persistence to disk/database | Phase requirement — out of certification scope |
| Knowledge export/import | Future phase |
| Knowledge conflict resolution UI | Future phase |
| Cross-business knowledge sharing | Future phase (anonymous aggregate) |

---

*End of VS1-009 IMPLEMENTATION PLAN*
