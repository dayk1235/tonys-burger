# KNOWLEDGE DISCOVERY REPORT

**VS1-009 — Knowledge Architecture Discovery**
**Date:** 2026-06-28
**Status:** DISCOVERY COMPLETE

---

## 1. Subsystem Inventory

**Total files:** 27 (26 implementation + 0 dedicated tests + 3 integration tests)

| # | File | Purpose | Active? |
|---|------|---------|---------|
| 1 | `KnowledgeEngine.ts` | Engine lifecycle, event subscriptions, receiveInput orchestrator | ✅ ACTIVE |
| 2 | `KnowledgePipeline.ts` | Pipeline orchestrator — 14 public operations, 22 sub-modules | ✅ ACTIVE |
| 3 | `KnowledgeTypes.ts` | All types: Knowledge, KnowledgeInput, 10 stages, 10 categories, 12 graph node/edge types | ✅ ACTIVE |
| 4 | `KnowledgeEvents.ts` | 24 event constants (10 lifecycle + 9 operation + 5 metadata), envelope helpers | ✅ ACTIVE |
| 5 | `KnowledgeValidator.ts` | Input validation (7 fields), validateKnowledgeInput parsing from Memory payload | ✅ ACTIVE |
| 6 | `KnowledgeFactory.ts` | createFromInput, cloneWithTransition — ID generation with Date.now() + counter + Math.random() | ✅ ACTIVE |
| 7 | `KnowledgeLifecycle.ts` | 10-stage state machine, transition validation, stage classification helpers | ✅ ACTIVE |
| 8 | `KnowledgeQuality.ts` | 12-dimension quality evaluation with weighted scoring | ✅ ACTIVE |
| 9 | `KnowledgeConfidence.ts` | Confidence computation from quality profile + version stability + graph coherence | ✅ ACTIVE |
| 10 | `KnowledgeScoring.ts` | Semantic score, integrity, generalization/specialization potential | ✅ ACTIVE |
| 11 | `KnowledgeExtraction.ts` | Extract knowledge from MemoryInput, concept generation, graph node/edge building | ✅ ACTIVE |
| 12 | `KnowledgeAbstraction.ts` | Abstraction level evaluation, level increase based on concept/graph/version maturity | ✅ ACTIVE |
| 13 | `KnowledgeGeneralization.ts` | Generalize knowledge from multiple sources, concept/node/edge synthesis, prefix-based naming | ✅ ACTIVE |
| 14 | `KnowledgeSpecialization.ts` | Specialize knowledge by attribute name/value, concept/node/edge synthesis | ✅ ACTIVE |
| 15 | `KnowledgeOntology.ts` | Concept registry, hierarchy builder, path finding (DFS), relationship management | ✅ ACTIVE |
| 16 | `KnowledgeConcepts.ts` | Concept querying: by category/name/id, root/leaf/depth/ancestors/descendants | ✅ ACTIVE |
| 17 | `KnowledgeRelationships.ts` | Duplicate/corroboration/contradiction detection across knowledge items | ✅ ACTIVE |
| 18 | `KnowledgeGraph.ts` | Graph querying: neighbors, path finding (DFS), reachable nodes, component counting, stats | ✅ ACTIVE |
| 19 | `KnowledgeInferenceBoundaries.ts` | Inference safety guards: no prediction, no decision, no invention, supported-only | ✅ ACTIVE |
| 20 | `KnowledgeVersioning.ts` | Version queries, diff, stability computation, stage transition history | ✅ ACTIVE |
| 21 | `KnowledgeIndex.ts` | In-memory index by ID/category/stage/memoryId/patternId | ✅ ACTIVE |
| 22 | `KnowledgeSearch.ts` | Multi-filter search, sorting, pagination, similarity search | ✅ ACTIVE |
| 23 | `KnowledgeMetrics.ts` | All metric counters and snapshot (22 fields) | ✅ ACTIVE |
| 24 | `KnowledgePolicies.ts` | 3 policy definitions, policy evaluation engine, policy suggestion | ✅ ACTIVE |
| 25 | `KnowledgeErrors.ts` | 9 error classes | ✅ ACTIVE |
| 26 | `KnowledgeContracts.ts` | KnowledgeSubscriber, KnowledgeQuery, KnowledgeEngineMetrics interfaces | ✅ ACTIVE |
| 27 | `index.ts` | Public exports | ✅ ACTIVE |

### Integration Tests

| # | File | Purpose | Active? |
|---|------|---------|---------|
| 1 | `runtime/tests/memory-knowledge-integration.test.ts` | VS1-001 — Manual Memory→Knowledge via receiveInput | ✅ ACTIVE |
| 2 | `runtime/tests/automatic-memory-knowledge.test.ts` | BF-007 — Automatic Memory→Knowledge via EventBus | ✅ ACTIVE |
| 3 | `attention/tests/knowledge-attention-integration.test.ts` | VS1-002 — Knowledge→Attention via EventBus | ✅ ACTIVE |

### Summary
- **Active modules:** 26/26
- **Disconnected modules:** 1 (KnowledgePipeline does NOT wire `KnowledgeRelationships` — buildRelationships never called from pipeline)
- **Dead code instances:** 0 (all exports used)
- **Storage:** Zero persistence — entire knowledge is in-memory KnowledgeIndex
- **Dedicated unit tests:** NONE — all testing is integration-level

---

## 2. Architecture Diagram

```
KnowledgeEngine
  │
  ├── subscribeToMemoryEvents()
  │     ├── MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED → receiveInput
  │     ├── MEMORY_EVENTS.LIFECYCLE_LONG_TERM_PROMOTED → receiveInput
  │     └── MEMORY_EVENTS.LIFECYCLE_SEMANTIC_ESTABLISHED → receiveInput
  │
  └── KnowledgePipeline
        ├── createKnowledge()
        ├── validateKnowledge()
        ├── generalizeKnowledge()
        ├── specializeKnowledge()
        ├── promoteToSemantic()
        ├── promoteToCanonical()
        ├── deprecateKnowledge()
        ├── archiveKnowledge()
        ├── linkConcepts()
        └── getMetrics()

KnowledgePipeline sub-modules:
  ├── factory: KnowledgeFactory
  ├── validator: KnowledgeValidator
  ├── lifecycle: KnowledgeLifecycle
  ├── quality: KnowledgeQuality
  ├── confidence: KnowledgeConfidence
  ├── scoring: KnowledgeScoring
  ├── extraction: KnowledgeExtraction
  ├── abstraction: KnowledgeAbstraction
  ├── generalization: KnowledgeGeneralization
  ├── specialization: KnowledgeSpecialization
  ├── ontology: KnowledgeOntology
  ├── concepts: KnowledgeConcepts
  ├── relationships: KnowledgeRelationships  ← ⛔ DISCONNECTED
  ├── graph: KnowledgeGraph
  ├── boundaries: KnowledgeInferenceBoundaries
  ├── versioning: KnowledgeVersioning
  ├── index: KnowledgeIndex
  ├── search: KnowledgeSearch
  ├── metrics: KnowledgeMetrics
  └── policyEngine: KnowledgePolicyEngine
```

---

## 3. Runtime Flow

### Engine Lifecycle

```
KnowledgeEngine.start()
  → subscribeToMemoryEvents()
  → state = RUNNING
  → auditPipeline.recordStateChange
  → eventBus.emit ENGINE_STATE_CHANGE

KnowledgeEngine.stop()
  → state = STOPPED
  → auditPipeline.recordStateChange
```

**Note:** Unlike PatternEngine (which has a processingInterval) and MemoryEngine (which has setInterval for processCycle), KnowledgeEngine does NOT have a periodic tick or cycle. There is no automatic consolidation, generalization, or deprecation cycle. Knowledge only advances via explicit calls to pipeline methods.

### Knowledge Creation Flow (via receiveInput)

```
receiveInput(input)
  → KnowledgeValidator.validateKnowledgeInput(input) → KnowledgeInput
  → KnowledgePipeline.createKnowledge(input, description)
    → Metrics.recordCreated()
    → KnowledgeValidator.validateInput(input)
    → KnowledgeExtraction.extract(input, description)
      → KnowledgeFactory.createFromInput(input, description)
        → generateId() = `knw_${Date.now()}_${counter}_${random}`
        → creates Knowledge with identity, provenance, version, metadata
      → extractConcepts(knowledge) → [1 concept]
      → buildGraphNodes(knowledge, concepts) → [1 graph node]
      → buildGraphEdges(graphNodes) → [] (no edges: only 1 node)
    → factory.cloneWithTransition(EXTRACTED)
    → Quality.evaluate(knowledge) → profile
    → Confidence.compute(knowledge, profile) → score
    → Scoring.evaluate(knowledge) → semanticScore, integrity, etc.
    → factory.cloneWithTransition(EXTRACTED, {confidence, scores, qualityProfile})
    → KnowledgeIndex.index(updated)
    → Metrics: recordCategory, recordStage, recordConfidence, recordIntegrity, recordConcepts, recordGraphNodes, recordGraphEdges
    → emitEvent(OPERATION_EXTRACTED)
    → AuditPipeline.recordLog
    → return updated Knowledge

  → KnowledgePipeline.validateKnowledge(knowledge)
    → KnowledgeInferenceBoundaries.validateSupported(knowledge)
    → KnowledgeLifecycle.validateTransition(EXTRACTED, VALIDATED)
    → Quality.evaluate(knowledge)
    → Confidence.compute(knowledge)
    → Scoring.evaluate(knowledge)
    → factory.cloneWithTransition(VALIDATED, {confidence, scores, qualityProfile, timesValidated+1})
    → Metrics.recordValidated()
    → Index.index(updated)
    → emitLifecycleEvent(updated) → "knowledge.lifecycle.validated"
    → AuditPipeline.recordStateChange

  → return OperationResult with stage=VALIDATED
```

**Critical finding:** `receiveInput()` in KnowledgeEngine.ts calls `createKnowledge()` (which transitions to EXTRACTED) and immediately calls `validateKnowledge()` (which transitions to VALIDATED). The stages STRUCTURED, EXTRACTED as a terminal state for the user are never visible via the public API — Knowledge always jumps from CREATED→VALIDATED in a single `receiveInput()` call.

### Knowledge→Attention Bridge Flow

```
KnowledgePipeline.validateKnowledge()
  → emitLifecycleEvent(knowledge)
    → getKnowledgeLifecycleEventName("VALIDATED") = "knowledge.lifecycle.validated"
    → eventBus.emit("knowledge.lifecycle.validated", {...payload...})

AttentionEngine.subscribeToKnowledgeEvents()
  → eventBus.subscribe(KNOWLEDGE_EVENTS.LIFECYCLE_VALIDATED, handler)
  → handler extracts knowledge from payload
  → AttentionEngine.receiveInput({source, sourceType: "KNOWLEDGE", ...})
  → AttentionPipeline.createAttention(attentionInput)
  → Attention entity created
```

### Memory→Knowledge Bridge Flow (Automatic)

```
MemoryPipeline.consolidateMemory(memory)
  → emits "memory.lifecycle.consolidated" (or "memory.lifecycle.archived")

KnowledgeEngine.subscribeToMemoryEvents()
  → eventBus.subscribe(MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED, handler)
  → receiveInput(payload)  ← NO validation of memory stage
  → Knowledge created from memory payload
```

---

## 4. Event Producers

### Knowledge Event Emissions

| Event | When | Trigger |
|-------|------|---------|
| `knowledge.lifecycle.candidate_created` | When? | Not explicitly emitted — happens inside factory |
| `knowledge.lifecycle.extracted` | When? | Not explicitly emitted — EXTRACTED is intermediate |
| `knowledge.lifecycle.structured` | Knowledge structured | Not explicitly emitted — STRUCTURED stage skipped |
| `knowledge.lifecycle.validated` | Knowledge validated | `emitLifecycleEvent()` in `validateKnowledge()` |
| `knowledge.lifecycle.generalized` | Knowledge generalized | Not in `emitLifecycleEvent()` — uses `emitEvent(OPERATION_GENERALIZED)` |
| `knowledge.lifecycle.specialized` | Knowledge specialized | Not in `emitLifecycleEvent()` — uses `emitEvent(OPERATION_SPECIALIZED)` |
| `knowledge.lifecycle.semantic` | Knowledge promoted to semantic | `emitLifecycleEvent()` in `promoteToSemantic()` |
| `knowledge.lifecycle.canonical` | Knowledge promoted to canonical | `emitLifecycleEvent()` in `promoteToCanonical()` |
| `knowledge.lifecycle.historical` | Knowledge deprecated → historical | Not in `emitLifecycleEvent()` — uses `emitEvent(OPERATION_DEPRECATED)` |
| `knowledge.lifecycle.archived` | Knowledge archived | `emitLifecycleEvent()` in `archiveKnowledge()` |
| `knowledge.operation.extracted` | Knowledge extracted | `emitEvent()` in `createKnowledge()` |
| `knowledge.operation.generalized` | Knowledge generalized | `emitEvent()` in `generalizeKnowledge()` |
| `knowledge.operation.specialized` | Knowledge specialized | `emitEvent()` in `specializeKnowledge()` |
| `knowledge.operation.linked` | Concepts linked | NOT emitted — `linkConcepts()` skips emitEvent |
| `knowledge.operation.merged` | Knowledge merged | NOT IMPLEMENTED — no merge pipeline method |
| `knowledge.operation.validated` | Knowledge validated | NOT emitted — uses lifecycle event instead |
| `knowledge.operation.deprecated` | Knowledge deprecated | `emitEvent()` in `deprecateKnowledge()` |
| `knowledge.operation.expanded` | Knowledge expanded | NOT IMPLEMENTED — no expand method |
| `knowledge.metrics.updated` | Metrics updated | NOT IMPLEMENTED — constant exists but never emitted |

**Critical finding:** 10 of 24 (42%) defined events are never emitted. The events `knowledge.lifecycle.candidate_created`, `knowledge.lifecycle.extracted`, `knowledge.lifecycle.structured`, `knowledge.operation.linked`, `knowledge.operation.merged`, `knowledge.operation.validated`, `knowledge.operation.expanded`, `knowledge.metrics.updated` are defined but unreachable. Additionally, `linkConcepts()` does not call `emitEvent` at all.

---

## 5. Event Consumers

### Knowledge Event Subscriptions

| Event | Consumer | Purpose |
|-------|----------|---------|
| `knowledge.lifecycle.validated` | AttentionEngine | Creates Attention from validated knowledge |

**Current consumers: ONLY 1 subscriber in the entire codebase.** The AttentionEngine subscribes to `KNOWLEDGE_EVENTS.LIFECYCLE_VALIDATED`. No other engine subscribes to any other Knowledge event.

### Missing Consumers:

| Event | Potential Consumer | Reason Needed |
|-------|-------------------|---------------|
| `knowledge.lifecycle.canonical` | DecisionEngine | Canonical knowledge should inform decisions |
| `knowledge.lifecycle.deprecated` | ReasoningEngine | Deprecation cascades to dependent reasoning |
| `knowledge.lifecycle.generalized` | AttentionEngine | New general knowledge may need attention |
| `knowledge.lifecycle.specialized` | Dashboard | Specialized knowledge may be dashboard-relevant |
| `knowledge.operation.extracted` | Audit | Every extraction should be verifiable |

---

## 6. External Subscriptions

### KnowledgeEngine as Consumer

| Event | Source | Subscribed? | Effect |
|-------|--------|-------------|--------|
| `memory.lifecycle.consolidated` | MemoryPipeline | ✅ YES | Calls receiveInput → creates Knowledge |
| `memory.lifecycle.long_term_promoted` | MemoryPipeline | ✅ YES | Calls receiveInput → creates Knowledge |
| `memory.lifecycle.semantic_established` | MemoryPipeline | ✅ YES | Calls receiveInput → creates Knowledge |

**Structural issue:** As discovered in VS1-008 (MEMORY_DISCOVERY_REPORT), `MemoryPipeline.emitLifecycleEvent()` maps CONSOLIDATED, LONG_TERM, and SEMANTIC ALL to `memory.lifecycle.consolidated`. The events `memory.lifecycle.long_term_promoted` and `memory.lifecycle.semantic_established` are **never emitted** by MemoryEngine. KnowledgeEngine subscribes to events that never fire. Only the `memory.lifecycle.consolidated` subscription actually works.

---

## 7. Internal Module Graph

```
KnowledgeEngine
  │
  └── KnowledgePipeline
        │
        ├── KnowledgeFactory         ← creates Knowledge objects
        ├── KnowledgeValidator        ← validates inputs and states
        ├── KnowledgeLifecycle        ← validates transitions (10 stages)
        ├── KnowledgeQuality          ← 12-dimension quality evaluation
        ├── KnowledgeConfidence       ← confidence computation
        ├── KnowledgeScoring          ← semantic/integrity scoring
        │
        ├── KnowledgeExtraction       ← extracts from MemoryInput
        ├── KnowledgeAbstraction      ← evaluates abstraction level
        ├── KnowledgeGeneralization   ← generalizes from multiple knowledges
        ├── KnowledgeSpecialization   ← specializes by attribute
        │
        ├── KnowledgeOntology         ← concept registration + hierarchy
        ├── KnowledgeConcepts         ← concept querying
        ├── KnowledgeGraph            ← graph algorithms (DFS, components)
        ├── KnowledgeRelationships    ← inter-knowledge relationship detection
        │
        ├── KnowledgeInferenceBoundaries ← safety guards
        ├── KnowledgeVersioning       ← version queries + stability
        │
        ├── KnowledgeIndex            ← in-memory index (5 maps)
        ├── KnowledgeSearch           ← multi-filter search + similarity
        │
        ├── KnowledgeMetrics          ← 22 metric counters
        └── KnowledgePolicyEngine     ← 3 policy definitions + evaluation
```

**Disconnected sub-module:** `KnowledgeRelationships` is instantiated at KnowledgePipeline.ts:62 (`this.relationships = new KnowledgeRelationships()`) but its `buildRelationships()` method is **never called** from any pipeline method. It exists as dead code within the pipeline.

---

## 8. Storage Model

**Verdict:** ❌ NO PERSISTENCE — IN-MEMORY ONLY

**Evidence:**
- `KnowledgeIndex.ts:15-19` — All indexes are `Map<string, ...>` in memory.
- Nothing is written to disk, database, or file.
- `KnowledgeIndex.clear()` (line 88) — wipes everything.
- Engine restart → all knowledge lost.
- `KnowledgeConfidence.history` (KnowledgeConfidence.ts:11) — in-memory Map, lost on restart.
- `KnowledgeMetrics` (KnowledgeMetrics.ts) — all counters reset on restart.
- `KnowledgeOntology.entries` and `KnowledgeOntology.relationships` (KnowledgeOntology.ts:13-14) — in-memory, lost on restart.

**Pipeline recovery:** The `recoveryPipeline` parameter exists in KnowledgePipeline constructor (line 51) and KnowledgeEngine constructor (line 36) but is **never used** anywhere — not for failure recovery, error propagation, or cascading corrections.

---

## 9. Determinism Analysis

**Verdict:** ❌ NOT DETERMINISTIC

**Evidence:**
1. **KnowledgeFactory.ts:18-20** — ID generation uses `Date.now() + counter + Math.random()`. Same input → different IDs every time.
2. **KnowledgeFactory.ts:42** — `const now = new Date().toISOString()` — timestamps differ on each call.
3. **KnowledgeFactory.ts:109** — `cloneWithTransition` also creates new timestamps.
4. **KnowledgeExtraction.ts:56,77,96** — All build methods use `new Date().toISOString()`.
5. **KnowledgeConfidence.ts:11,32** — `ConfidenceHistoryEntry` timestamps + in-memory Map.
6. **KnowledgeGeneralization.ts:27,79,98,111** — All timestamps on generalization nodes.
7. **KnowledgeSpecialization.ts:19,66,83,96** — All timestamps on specialization.
8. **KnowledgeAbstraction.ts:30** — Timestamp on abstraction evaluation.
9. **KnowledgeScoring.ts** — Scores depend on confidence which depends on wall clock (version stability uses version timestamps indirectly).

**Cannot replay same sequence of events → same Knowledge state.**

---

## 10. Persistence Analysis

**Verdict:** ❌ ZERO PERSISTENCE

| Component | Storage | Survives Restart? |
|-----------|---------|-------------------|
| KnowledgeIndex (byId, byCategory, byStage, byMemoryId, byPatternId) | In-memory Map | ❌ No |
| KnowledgeConfidence.history | In-memory Map | ❌ No |
| KnowledgeMetrics counters | In-memory numbers | ❌ No |
| KnowledgeOntology.entries | In-memory Map | ❌ No |
| KnowledgeOntology.relationships | In-memory array | ❌ No |
| Version history (on Knowledge objects) | In-memory (objects referenced by index) | ❌ No |
| search index | In-memory (same as KnowledgeIndex) | ❌ No |

---

## 11. Versioning Analysis

**Verdict:** ✅ IMPLEMENTED (within session)

**Evidence:**
- `KnowledgeFactory.ts:54-61` — Version tracking: version number, timestamp, stage, confidence, integrity, summary per version.
- `KnowledgeFactory.ts:110-119` — `cloneWithTransition()` creates new version on every transition.
- `KnowledgeVersioning.ts` — Query methods: `getVersion()`, `getLatestVersion()`, `getVersionCount()`, `diff()`, `getVersionsByStage()`, `getVersionTimeline()`, `getRecentVersions()`, `hasStageTransitioned()`, `computeStability()`.

**Limitations:**
- Versions are in-memory only — lost on restart.
- `diff()` feature returns hardcoded `conceptCountChange: 0` (KnowledgeVersioning.ts:36) — does not actually compare concept counts.
- Version history is stored on the Knowledge object itself (not in a separate store) — the KnowledgeIndex holds references to the same objects.

---

## 12. Provenance Analysis

**Verdict:** ✅ IMPLEMENTED (within session)

**Knowledge tracks:** `sourceMemoryIds`, `sourceEvidenceIds`, `sourcePatternIds`, `creationTimeline`, `versionHistory`, `generalizedFromIds`, `specializedFromIds`.

**Can Knowledge reconstruct its origin?** ✅ YES — provenance contains full chain of memory/evidence/pattern IDs.

**Can Knowledge explain why it exists?** ⚠️ PARTIALLY — `description` and `summary` fields exist but are populated with generic text like "Knowledge created from memory X". No structured reason for creation.

**Can Knowledge generalize?** ✅ YES — `KnowledgeGeneralization.generalize()` synthesizes new concepts, nodes, and edges from multiple source knowledges. Adds generalizedFromIds to provenance.

**Can Knowledge specialize?** ✅ YES — `KnowledgeSpecialization.specialize()` creates specialized concepts/nodes/edges. Adds specializedFromIds to provenance.

---

## 13. Knowledge Lifecycle Analysis

### 10-Stage Lifecycle

```
CANDIDATE ──→ EXTRACTED ──→ STRUCTURED ──→ VALIDATED ──→ GENERALIZED ──→ SEMANTIC ──→ CANONICAL
    │              │              │               │              │              │            │
    │              │              │               ├─── SPECIALIZED ┘              │            │
    │              │              │               │                              │            │
    └────ARCHIVED──┴────ARCHIVED──┴────ARCHIVED───┴────ARCHIVED──────────────────┴────ARCHIVED┘
                                                                                    │
                                                                                    └─── HISTORICAL ───→ ARCHIVED
```

### Transition Matrix (from KnowledgeLifecycle.ts:4-14)

| From | To |
|------|----|
| CANDIDATE | EXTRACTED, STRUCTURED, ARCHIVED |
| EXTRACTED | STRUCTURED, VALIDATED, ARCHIVED |
| STRUCTURED | VALIDATED, GENERALIZED, SPECIALIZED, ARCHIVED |
| VALIDATED | GENERALIZED, SPECIALIZED, SEMANTIC, HISTORICAL, ARCHIVED |
| GENERALIZED | SPECIALIZED, SEMANTIC, CANONICAL, HISTORICAL, ARCHIVED |
| SPECIALIZED | GENERALIZED, SEMANTIC, CANONICAL, HISTORICAL, ARCHIVED |
| SEMANTIC | CANONICAL, HISTORICAL, ARCHIVED |
| CANONICAL | HISTORICAL, ARCHIVED |
| HISTORICAL | ARCHIVED |
| ARCHIVED | (terminal) |

### Observed Runtime Path (via receiveInput/validateKnowledge)

```
CANDIDATE → EXTRACTED → VALIDATED  (automatically, skipping STRUCTURED)
```

**Critical finding:** The `receiveInput()` method in KnowledgeEngine.ts creates knowledge at CANDIDATE, immediately transitions to EXTRACTED (via createKnowledge), then immediately transitions to VALIDATED (via validateKnowledge). The STRUCTURED stage is **entirely skipped** in the auto-validation path. The EXTRACTED→STRUCTURED transition is defined in the lifecycle but never traversed by any pipeline method.

### Unreachable Transitions

| Transition | Why Unreachable |
|------------|-----------------|
| CANDIDATE → STRUCTURED | No pipeline method promotes from CANDIDATE to STRUCTURED |
| Any → GENERALIZED | Only reachable via explicit `generalizeKnowledge()` call |
| Any → SPECIALIZED | Only reachable via explicit `specializeKnowledge()` call |
| Any → SEMANTIC | Only reachable via explicit `promoteToSemantic()` call |
| Any → CANONICAL | Only reachable via explicit `promoteToCanonical()` call |
| Any → HISTORICAL | Only reachable via explicit `deprecateKnowledge()` call |
| Any → ARCHIVED | Only reachable via explicit `archiveKnowledge()` call |
| GENERALIZED ↔ SPECIALIZED | Both directions defined, only reachable via explicit calls |

**Realistic runtime path (automatic flow only):**
```
CANDIDATE → EXTRACTED → VALIDATED
```
Knowledge never advances beyond VALIDATED without explicit external calls. There is no automatic consolidation, deprecation, or archival cycle.

---

## 14. Bridge Analysis

### Memory→Knowledge Bridge

**Status:** ⚠️ PARTIALLY FUNCTIONAL

**Wiring:**
- KnowledgeEngine.ts:110-136 subscribes to `MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED`, `MEMORY_EVENTS.LIFECYCLE_LONG_TERM_PROMOTED`, `MEMORY_EVENTS.LIFECYCLE_SEMANTIC_ESTABLISHED`.
- Subscribers call `receiveInput(payload)` with raw EventBus payloads.

**Known issues:**

1. **Only 1/3 subscriptions actually work.** As documented in MEMORY_DISCOVERY_REPORT, MemoryPipeline.emitLifecycleEvent() maps CONSOLIDATED, LONG_TERM, and SEMANTIC ALL to `memory.lifecycle.consolidated`. The events `memory.lifecycle.long_term_promoted` and `memory.lifecycle.semantic_established` are defined in MemoryEvents.ts but never emitted by any code path.

2. **Triple-trigger risk.** When MemoryEngine sets `CONSOLIDATED`, KnowledgeEngine fires 3 times — once from `consolidated`, but also from `long_term_promoted` and `semantic_established`. Since those two events never fire (they are aliased), this risk is currently moot. If a future BF fixes the event aliasing, this becomes a bug.

3. **Silent catch blocks.** KnowledgeEngine.ts:116,118,125,127,133,135 — every subscriber has `catch { /* silently handle */ }`. Errors are swallowed without logging, audit, or recovery.

4. **businessId propagation.** KnowledgeValidator:57 reads `input.businessId` — falls back to `""` if not in payload. Memory events carry businessId from Pattern → which was found to be `""` in VS0-009/CV-031.

5. **No stage guard.** KnowledgeEngine's subscribers accept any payload without checking the memory's stage. If a memory at WORKING stage somehow emits consolidated, KnowledgeEngine would attempt extraction.

### Knowledge→Attention Bridge

**Status:** ✅ FUNCTIONAL (with limitations)

**Wiring:**
- AttentionEngine.ts:155-217 subscribes to `KNOWLEDGE_EVENTS.LIFECYCLE_VALIDATED`.
- Dual-path payload parsing: entity-first (`entity.knowledge`) + legacy fallback (`p.knowledgeId`, `p.name`, etc.).
- Maps Knowledge categories to Attention categories via `mapKnowledgeCategory()`.

**Known issues:**

1. **Single event subscriber.** AttentionEngine only subscribes to `knowledge.lifecycle.validated`. Knowledge that reaches GENERALIZED, SPECIALIZED, SEMANTIC, or CANONICAL stages (via explicit pipeline calls) does NOT trigger attention. The events exist (`knowledge.lifecycle.generalized`, `knowledge.lifecycle.specialized`, `knowledge.lifecycle.semantic`, `knowledge.lifecycle.canonical`) but have no subscribers.

2. **Category mapping mismatch** (AttentionEngine.ts:220-233):

   | Knowledge Category | Attention Category |
   |---|---|
   | CUSTOMER_BEHAVIOR | VIP_CUSTOMER |
   | EMPLOYEE_EXPERTISE | OPERATIONAL |
   | SUPPLIER_RELIABILITY | SUPPLIER_DELAY |
   | INVENTORY_KNOWLEDGE | INVENTORY_SHORTAGE |
   | SEASONALITY | OPERATIONAL |
   | PROMOTION_KNOWLEDGE | REVENUE_OPPORTUNITY |
   | OPERATIONAL_PRACTICE | OPERATIONAL |
   | MAINTENANCE_HISTORY | MAINTENANCE |
   | BUSINESS_GROWTH | STRATEGIC |
   | GENERAL | GENERAL (default) |

   - `SEASONALITY` and `OPERATIONAL_PRACTICE` both map to `OPERATIONAL` — loss of category specificity.
   - `CUSTOMER_BEHAVIOR → VIP_CUSTOMER` is semantically incorrect — customer behavior knowledge is not always VIP-related.

3. **businessId gap.** AttentionEngine:194 falls back to `"default"` if `businessId` is not in metadata. Knowledge's `businessId` originates from `input.businessId` which may be empty.

4. **Silent catch.** AttentionEngine.ts:214 — `catch { /* silently handle */ }`. Errors in the Knowledge→Attention bridge are swallowed.

5. **Integrity used as businessValue.** AttentionEngine.ts:192 uses `integrity` as `businessValue`. While technically valid, this conflates data quality with business impact.

### Memory→Knowledge Bridge — Payload Contract Analysis

Memory event payload shape (from MemoryPipeline.emitLifecycleEvent):
```typescript
{
  entity: { memory: { ...memory } },
  memory: { ...memory },
  operation: string,
  timestamp: string,
  version: number
}
```

KnowledgeValidator.validateKnowledgeInput(expected payload):
```typescript
{
  memory: {
    id: string,
    identity: {
      patternId: string,
      name: string,
      category: string,
    },
    provenance: {
      sourceEvidenceIds: string[],
      sourceObservationIds: string[],
    },
    description: string,
    confidence: number,
  },
  businessId: string
}
```

**Contract mismatch:** KnowledgeValidator:45-46 reads `provenance.sourceEvidenceIds` — Memory's provenance field is called `sourceEvidenceIds` (matches). But KnowledgeEngine subscriber passes the raw EventBus payload which contains `{ entity: { memory }, memory: {...} }`. KnowledgeValidator accesses `input.memory` which maps to the top-level `memory` field — this works because the payload has both `entity.memory` (full) and `memory` (shorthand). The integration test confirms this works.

**Missing field validation:** KnowledgeValidator does NOT validate that `businessId` is non-empty — it only checks `name`, `memoryId`, `patternId`, `businessId`, `confidence`, `integrity`, `evidenceIds`. But `businessId` validation (KnowledgeValidator.ts:15-16) throws if empty — meaning if `input.businessId` is `""` (which happens when Propagation chain is broken), knowledge creation fails silently.

---

## 15. Dead Code & Disconnected Infrastructure

| # | Instance | File | Line | Status |
|---|----------|------|------|--------|
| 1 | `KnowledgeRelationships` instantiated but `buildRelationships()` never called | KnowledgePipeline.ts:62, KnowledgeRelationships.ts:34 | ⛔ DISCONNECTED |
| 2 | `knowledge.lifecycle.candidate_created` event | KnowledgeEvents.ts:6 | ⛔ NEVER EMITTED |
| 3 | `knowledge.lifecycle.extracted` event | KnowledgeEvents.ts:7 | ⛔ NEVER EMITTED |
| 4 | `knowledge.lifecycle.structured` event | KnowledgeEvents.ts:8 | ⛔ NEVER EMITTED |
| 5 | `knowledge.operation.linked` event | KnowledgeEvents.ts:20 | ⛔ NEVER EMITTED — `linkConcepts()` does not emit |
| 6 | `knowledge.operation.merged` event | KnowledgeEvents.ts:22 | ⛔ NEVER EMITTED — no merge method in pipeline |
| 7 | `knowledge.operation.validated` event | KnowledgeEvents.ts:23 | ⛔ NEVER EMITTED — validate uses lifecycle event |
| 8 | `knowledge.operation.expanded` event | KnowledgeEvents.ts:25 | ⛔ NEVER EMITTED — no expand method |
| 9 | `knowledge.metrics.updated` event | KnowledgeEvents.ts:26 | ⛔ NEVER EMITTED — never called |
| 10 | `KnowledgeFactory.cloneWithTransition` STRUCTURED stage parameter | KnowledgeLifecycle.ts:7 | ⛔ NEVER TRAVERSED — skipped in auto-validation |

**Root cause analysis:**
- 42% (10/24) of defined events are never emitted.
- `linkConcepts()` (KnowledgePipeline.ts:339-373) performs the work but omits `emitEvent()` entirely.
- `getKnowledgeOperationEventName()` (KnowledgeEvents.ts:68-79) defines mapping for 8 operations but only 4 of them are ever called in the pipeline.
- The pipeline has no periodic cycle — knowledge only advances via explicit method calls, so stage transitions are user-driven, not automatic.

---

## 16. Technical Debt Inventory

| # | Item | Location | Severity | Impact |
|---|------|----------|----------|--------|
| 1 | **No persistence** — Everything lost on restart | KnowledgeIndex.ts | 🔴 HIGH | Engine cannot survive restart |
| 2 | **Non-deterministic IDs** — Date.now() + Math.random() | KnowledgeFactory.ts:18-20 | 🟡 MEDIUM | Cannot replay same input → same state |
| 3 | **10 lifecycle/operation events never emitted** | KnowledgeEvents.ts | 🟡 MEDIUM | Bridge subscribers may miss events |
| 4 | **5 silent catch blocks** — Errors silently swallowed | KnowledgeEngine.ts:116,125,134; KnowledgePipeline.ts:385-388 | 🟡 MEDIUM | Undiagnosed failures |
| 5 | **Confidence history in-memory** — Lost on restart | KnowledgeConfidence.ts:11 | 🟡 MEDIUM | Same problem as Pattern BF-016 |
| 6 | **KnowledgeRelationships.buildRelationships() never called** | KnowledgeRelationships.ts:34 | 🟢 LOW | Dead code — exists but disconnected |
| 7 | **businessId gap** — Propagation chain broken | KnowledgeValidator.ts:15-16 | 🔴 HIGH | Knowledge creation from memory events may fail |
| 8 | **STRUCTURED stage entirely skipped** in auto path | KnowledgePipeline.ts:84-93 | 🟢 LOW | Stage exists in lifecycle but never traversed |
| 9 | **recoveryPipeline never used** in KnowledgePipeline | KnowledgePipeline.ts:51, KnowledgeEngine.ts:36 | 🟢 LOW | Parameter accepted, never called |
| 10 | **Scoring uses wall clock** — non-deterministic | KnowledgeScoring.ts, KnowledgeConfidence.ts | 🟡 MEDIUM | Cannot certify determinism |
| 11 | **No dedicated unit tests** for Knowledge engine | (no tests/ directory) | 🟡 MEDIUM | All testing is integration-level only |
| 12 | **KnowledgeVersioning.diff() hardcodes conceptCountChange: 0** | KnowledgeVersioning.ts:36 | 🟢 LOW | Diff is incomplete |
| 13 | **linkConcepts() does not emit event** | KnowledgePipeline.ts:339-373 | 🟢 LOW | Missing event emission |
| 14 | **No automatic lifecycle progression** | KnowledgeEngine.ts (no interval) | 🟡 MEDIUM | Knowledge never advances beyond VALIDATED without external calls |
| 15 | **getKnowledgeOperation() in Pipeline returns "CREATE"/"STRUCTURE"/"SEMANTIC"** which don't match KnowledgeOperation type | KnowledgePipeline.ts:405-419 | 🟢 LOW | String mismatch — type inconsistency |

---

## 17. Strengths

1. **Comprehensive sub-module separation** — 22 distinct classes with single responsibilities
2. **Rich lifecycle** — 10 stages with well-defined transition matrix
3. **Full provenance tracking** — sourceMemoryIds, sourceEvidenceIds, sourcePatternIds, versionHistory, generalizedFromIds, specializedFromIds
4. **Versioning** — Every transition creates a new version with confidence, integrity, and summary tracking
5. **Generalization/Specialization infrastructure** — Hierarchical concept synthesis with graph node/edge generation
6. **Inference boundaries** — Safety guards prevent knowledge invention, unsupported facts, and premature prediction
7. **Quality evaluation** — 12 dimensions with weighted scoring
8. **Ontology registry** — Concept hierarchy building, relationship path finding
9. **Policy engine** — 3 policies with evaluation and suggestion
10. **Dual-path payload parsing** in Knowledge→Attention bridge — entity-first + legacy fallback
11. **Automatic Memory→Knowledge bridge** — Knowledge is created automatically from consolidated memories via EventBus
12. **Knowledge→Attention bridge** — Attention is created automatically from validated knowledge via EventBus

---

## 18. Weaknesses

1. **No persistence** — Entire knowledge base is in-memory; engine restart = total knowledge loss
2. **10/24 events never emitted** — 42% of event catalog unreachable
3. **Non-deterministic** — Date.now() and Math.random() in ID generation; clock-dependent scoring
4. **Memory→Knowledge bridge has 2/3 dead subscriptions** — Knowledge subscribes to `long_term_promoted` and `semantic_established` which never fire
5. **5 silent catch blocks** — Errors silently swallowed, no observability
6. **No automatic lifecycle progression** — No periodic tick, consolidation, deprecation, or archival cycle
7. **One disconnected sub-module** — `KnowledgeRelationships.buildRelationships()` never wired from pipeline
8. **Only 1 Knowledge event consumer** — Only AttentionEngine subscribes to `knowledge.lifecycle.validated`
9. **businessId propagation gap** — Inherited from Pattern through Memory chain
10. **No dedicated unit tests** — All testing is integration-level; no standalone Knowledge engine tests
11. **Knowledge→Attention category mapping has semantic mismatches** — CUSTOMER_BEHAVIOR→VIP_CUSTOMER, conflation of integrity as businessValue
12. **STRUCTURED stage skipped in auto-validation path** — Stage exists but unreachable
13. **recoveryPipeline parameter accepted but never used** — No failure recovery integration
14. **No replayability** — Same sequence of events produces different knowledge each time

---

## 19. Certification Readiness Assessment

| Aspect | Readiness | Reason |
|--------|-----------|--------|
| Unit tests | ❌ BLOCKED | Zero dedicated tests; coverage only from integration tests |
| Determinism | ❌ BLOCKED | Date.now() + Math.random() in IDs and all scoring |
| Persistence | ⚠️ NOT REQUIRED | Certification certifies current behavior (in-memory only) |
| Memory→Knowledge bridge | ⚠️ PARTIAL | Only 1/3 subscriber events actually fire; businessId propagation broken |
| Knowledge→Attention bridge | ✅ FUNCTIONAL | Single event subscription works; category mapping has minor issues |
| Event emissions | ❌ 42% unreachable | 10/24 events never emitted; cannot certify event contract |
| Silent catches | ❌ BLOCKER | 5 silent catch blocks — errors swallowed, no observability |
| businessId gap | ⚠️ GAP | Inherited from Pattern/Memory chain |
| Automatic progression | ❌ NO CYCLE | No periodic processing — knowledge never auto-advances |
| KnowledgeRelationships disconnected | 🟢 LOW | Dead code but no functional impact |

---

*End of KNOWLEDGE DISCOVERY REPORT*
