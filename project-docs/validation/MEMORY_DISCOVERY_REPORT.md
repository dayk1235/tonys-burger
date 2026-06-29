# MEMORY DISCOVERY REPORT

**VS1-008 — Memory Architecture Discovery**
**Date:** 2026-06-28
**Status:** DISCOVERY COMPLETE

---

## 1. Subsystem Inventory

**Total files:** 27 (26 implementation + 1 test)

| # | File | Purpose | Active? |
|---|------|---------|---------|
| 1 | `MemoryEngine.ts` | Engine lifecycle, event subscriptions, receiveInput orchestrator | ✅ ACTIVE |
| 2 | `MemoryPipeline.ts` | Pipeline orchestrator — 13 public operations | ✅ ACTIVE |
| 3 | `MemoryTypes.ts` | All types: Memory, MemoryInput, MemoryStage, 10 categories, 8 association types | ✅ ACTIVE |
| 4 | `MemoryEvents.ts` | 18 event constants (9 lifecycle + 9 operation), envelope helpers | ✅ ACTIVE |
| 5 | `MemoryValidator.ts` | Input validation (7 fields), memory object validation, validateMemoryInput parsing | ✅ ACTIVE |
| 6 | `MemoryFactory.ts` | createFromInput, cloneWithTransition — ID generation with Math.random() | ✅ ACTIVE |
| 7 | `MemoryLifecycle.ts` | 9-stage state machine, transition validation | ✅ ACTIVE |
| 8 | `MemoryQuality.ts` | 12-dimension quality evaluation | ✅ ACTIVE |
| 9 | `MemoryConfidence.ts` | Confidence computation from quality profile | ✅ ACTIVE |
| 10 | `MemoryScoring.ts` | Retention/activation/consolidation-readiness/forgetting-risk scoring | ✅ ACTIVE |
| 11 | `MemoryConsolidation.ts` | Automatic promotion logic (SHORT_TERM→STABILIZING→CONSOLIDATED→LONG_TERM→SEMANTIC) | ✅ ACTIVE |
| 12 | `MemoryRetention.ts` | Per-stage retention policies, decay computation, access/strengthen/weaken mutations | ✅ ACTIVE |
| 13 | `MemoryForgetting.ts` | Forgetting criteria, forget/archive/reactivate operations | ✅ ACTIVE |
| 14 | `MemoryStrength.ts` | Strength computation, strengthen/weaken/normalize | ✅ ACTIVE |
| 15 | `MemoryActivation.ts` | Activation computation, spread activation, decay, isActive threshold | ✅ ACTIVE |
| 16 | `MemoryAssociations.ts` | Association creation/reinforce/weaken/detach, findPath (DFS) | ✅ ACTIVE |
| 17 | `MemoryRelationships.ts` | Duplicate/corroboration/contradiction/temporal/generalization detection | ⛔ DISCONNECTED |
| 18 | `MemoryVersioning.ts` | Version queries, diff, stability computation | ✅ ACTIVE |
| 19 | `MemoryIndex.ts` | In-memory index by ID/category/stage/patternId/evidenceId | ✅ ACTIVE |
| 20 | `MemorySearch.ts` | Multi-filter search, tag search, similarity search | ✅ ACTIVE |
| 21 | `MemoryCompression.ts` | Memory compression, redundancy detection | ✅ ACTIVE |
| 22 | `MemoryMetrics.ts` | All metric counters and snapshot | ✅ ACTIVE |
| 23 | `MemoryPolicies.ts` | 3 policy definitions, policy evaluation engine | ✅ ACTIVE |
| 24 | `MemoryErrors.ts` | 9 error classes | ✅ ACTIVE |
| 25 | `MemoryContracts.ts` | MemorySubscriber, MemoryQuery, MemoryEngineMetrics interfaces | ✅ ACTIVE |
| 26 | `index.ts` | Public exports | ✅ ACTIVE |
| 27 | `tests/memory.test.ts` | 734 lines, ~35 test cases | ✅ ACTIVE |

### Summary
- **Active modules:** 24/27
- **Disconnected modules:** 1 (MemoryRelationships.buildRelationships never called from pipeline)
- **Dead code instances:** 1 (MemoryRelationships.buildRelationships)
- **Storage:** Zero persistence — entire memory is in-memory MemoryIndex

---

## 2. Architecture Diagram

```
MemoryEngine
  │
  ├── subscribeToEvidenceEvents()
  │     ├── EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED → receiveInput
  │     └── EVIDENCE_EVENTS.EVALUATION_COMPLETED → receiveInput
  │
  ├── subscribeToObservationEvents()
  │     └── ObservationEventNames.HISTORICAL_COMMITTED → receiveInput
  │
  ├── subscribeToPatternEvents()
  │     └── 8 PatternEventNames → receiveInput
  │
  └── MemoryPipeline
        ├── createMemory()
        ├── consolidateMemory()
        ├── strengthenMemory()
        ├── weakenMemory()
        ├── forgetMemory()
        ├── archiveMemory()
        ├── reactivateMemory()
        ├── compressMemory()
        ├── mergeMemories()
        ├── associateMemories()
        ├── detachMemory()
        ├── tickDecay()
        └── processCycle()  ← 60s interval

MemoryPipeline sub-modules:
  ├── factory: MemoryFactory
  ├── validator: MemoryValidator
  ├── lifecycle: MemoryLifecycle
  ├── quality: MemoryQuality
  ├── confidence: MemoryConfidence
  ├── scoring: MemoryScoring
  ├── consolidation: MemoryConsolidation
  ├── retention: MemoryRetention
  ├── forgetting: MemoryForgetting
  ├── strength: MemoryStrength
  ├── activation: MemoryActivation
  ├── associations: MemoryAssociations
  ├── relationships: MemoryRelationships  ← DISCONNECTED
  ├── versioning: MemoryVersioning
  ├── index: MemoryIndex
  ├── search: MemorySearch
  ├── compression: MemoryCompression
  ├── metrics: MemoryMetrics
  └── policyEngine: MemoryPolicyEngine
```

---

## 3. Runtime Flow

### Engine Lifecycle
```
MemoryEngine.start()
  → subscribeToEvidenceEvents()
  → subscribeToObservationEvents()
  → subscribeToPatternEvents()
  → setInterval(processCycle, 60000)
  → emit ENGINE_STATE_CHANGE
  → state = RUNNING

MemoryEngine.stop()
  → clearInterval
  → state = STOPPED
  → record state change
```

### Memory Creation Flow
```
External event arrives via EventBus
  → MemoryEngine subscriber callback
  → receiveInput(input)
    → MemoryValidator.validateMemoryInput(input) → MemoryInput
    → MemoryPipeline.createMemory(input, description)
      → MemoryValidator.validateInput(input)
      → MemoryFactory.createFromInput(input, description)
        → generateId() = `mem_${Date.now()}_${counter}_${random}`
        → creates Memory with identity, provenance, version, metadata
      → MemoryIndex.index(memory)
      → Metrics: recordCreated, recordCategory, recordStage, recordStrength, recordConfidence
      → emitEvent(MEMORY_EVENTS.OPERATION_CREATED)
      → AuditPipeline.recordLog
    → Quality.evaluate(memory) → profile
    → Confidence.compute(memory, profile) → score
    → Scoring.evaluate(memory) → retentionScore, activationScore, etc.
    → Factory.cloneWithTransition(memory, stage, {confidence, scores, qualityProfile})
    → Index.index(updated)
    → Consolidation.evaluateConsolidation(updated)
      → if consolidated: pipeline.consolidateMemory(updated)
    → return MemoryOperationResult
```

### Periodic Cycle Flow (every 60s)
```
MemoryPipeline.processCycle()
  → index.getAll()
  → for each non-terminal memory:
    → tickDecay(memory)
      → Activation.decayActivation(memory, 0.1)
      → Retention.applyDecay(decayed)
      → Forgetting.shouldForget(retentionApplied)?
        → YES: forgetMemory()
    → Consolidation.evaluateConsolidation(decayed)
      → YES: consolidateMemory()
```

---

## 4. Event Flow

### Memory Event Emissions (Producer)

| Event | When | Trigger |
|-------|------|---------|
| `memory.operation.created` | Memory created | `createMemory()` |
| `memory.operation.strengthened` | Memory strengthened | `strengthenMemory()` |
| `memory.operation.weakened` | Memory weakened | `weakenMemory()` |
| `memory.operation.forgotten` | Memory forgotten | `forgetMemory()` |
| `memory.operation.reactivated` | Memory reactivated | `reactivateMemory()` |
| `memory.operation.compressed` | Memory compressed | `compressMemory()` |
| `memory.operation.merged` | Memories merged | `mergeMemories()` |
| `memory.operation.associated` | Association created | `associateMemories()` |
| `memory.operation.detached` | Association removed | `detachMemory()` |
| `memory.lifecycle.working_created` | Memory in WORKING stage (not currently emitted) | N/A |
| `memory.lifecycle.candidate_promoted` | Memory in CANDIDATE stage (not currently emitted) | N/A |
| `memory.lifecycle.short_term_established` | Memory in SHORT_TERM stage (not currently emitted) | N/A |
| `memory.lifecycle.stabilizing_started` | Memory in STABILIZING stage (not currently emitted) | N/A |
| `memory.lifecycle.consolidated` | Consolidation → CONSOLIDATED/LONG_TERM/SEMANTIC | `emitLifecycleEvent()` |
| `memory.lifecycle.long_term_promoted` | Memory in LONG_TERM (not currently emitted) | N/A |
| `memory.lifecycle.semantic_established` | Memory in SEMANTIC stage (not currently emitted) | N/A |
| `memory.lifecycle.historical_archived` | Memory in HISTORICAL stage (not currently emitted) | N/A |
| `memory.lifecycle.archived` | Memory in ARCHIVED stage | `emitLifecycleEvent()` |

**Critical finding:** `emitLifecycleEvent()` in MemoryPipeline.ts:376-388 sends the SAME event name for MULTIPLE stages:
- CONSOLIDATED, LONG_TERM, SEMANTIC → ALL emit `memory.lifecycle.consolidated`
- HISTORICAL, ARCHIVED → ALL emit `memory.lifecycle.archived`

The lifecycle events `memory.lifecycle.candidate_promoted`, `memory.lifecycle.short_term_established`, `memory.lifecycle.stabilizing_started`, `memory.lifecycle.long_term_promoted`, `memory.lifecycle.semantic_established`, `memory.lifecycle.historical_archived` are **defined but never emitted** — they are unreachable because `emitLifecycleEvent()` uses `getMemoryLifecycleEventName(stage)` which maps all stages, but `emitLifecycleEvent()` is only called from `consolidateMemory()` and `archiveMemory()`. The other lifecycle transitions (WORKING→CANDIDATE→SHORT_TERM→STABILIZING) happen via Factory.cloneWithTransition without calling emitLifecycleEvent.

### Memory Event Subscriptions (Consumer)

| Event | Subscriber | Purpose |
|-------|-----------|---------|
| `memory.lifecycle.consolidated` | KnowledgeEngine | Creates Knowledge from consolidated memories |
| `memory.lifecycle.long_term_promoted` | KnowledgeEngine | Creates Knowledge from long-term memories |
| `memory.lifecycle.semantic_established` | KnowledgeEngine | Creates Knowledge from semantic memories |

**Memory→Knowledge bridge:** Only 3 of 9 lifecycle events are consumed. KnowledgeEngine subscribes only to CONSOLIDATED, LONG_TERM_PROMOTED, SEMANTIC_ESTABLISHED. However, due to the emit bug above, LONG_TERM_PROMOTED and SEMANTIC_ESTABLISHED are never emitted — KnowledgeEngine subscribes to events that never fire.

### External Event Subscriptions (Memory as Consumer)

| Event | Source | Purpose |
|-------|--------|---------|
| `evidence.lifecycle.validated_confirmed` | EvidenceEngine | Memory from validated evidence |
| `evidence.evaluation.completed` | EvidencePipeline | Memory from evaluated evidence |
| `observation.lifecycle.historical_committed` | ObservationPipeline | Memory from committed observations |
| `pattern.lifecycle.emerging_confirmed` | PatternPipeline | Memory from emerging patterns |
| `pattern.lifecycle.supported_established` | PatternPipeline | Memory from supported patterns |
| `pattern.lifecycle.validated_confirmed` | PatternPipeline | Memory from validated patterns |
| `pattern.lifecycle.strengthening_observed` | PatternPipeline | Memory from strengthening patterns |
| `pattern.lifecycle.trend_detected` | PatternPipeline | Memory from trend detection |
| `pattern.lifecycle.correlation_found` | PatternPipeline | Memory from correlation detection |
| `pattern.lifecycle.anomaly_detected` | PatternPipeline | Memory from anomaly detection |
| `pattern.lifecycle.sequence_discovered` | PatternPipeline | Memory from sequence discovery |

---

## 5. Bridge Analysis

### Pattern→Memory Bridge

**Status:** ✅ FUNCTIONAL (with known gap)

**Evidence:** MemoryEngine.ts:229-303 subscribes to 8 Pattern events. Dual-path payload parsing (entity-first + legacy). Error handling via audit pipeline.

**Known gap:** `businessId` — MemoryValidator requires `businessId` (MemoryValidator.ts:15-16), but `PatternIdentity` lacks `businessId` field. Line 252: `const businessId = ((identity as Record<string, unknown>).businessId as string) ?? "";` — always resolves to `""`. This was identified in VS0-009 and CV-031.

**Missing events:** WEAKENING_OBSERVED, DEPRECATED, HISTORICAL_ARCHIVED (3 of 11 lifecycle events not subscribed). Deferred to BF-017.

### Memory→Knowledge Bridge

**Status:** ✅ FUNCTIONAL (with structural issue)

**Evidence:** KnowledgeEngine.ts:110-136 subscribes to MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED, LIFECYCLE_LONG_TERM_PROMOTED, LIFECYCLE_SEMANTIC_ESTABLISHED. KnowledgeValidator accepts payload with `{ memory: { id, identity, provenance, description, confidence } }`.

**Structural issue:** `emitLifecycleEvent()` (MemoryPipeline.ts:376-388) maps CONSOLIDATED, LONG_TERM, and SEMANTIC ALL to `memory.lifecycle.consolidated`. The events `memory.lifecycle.long_term_promoted` and `memory.lifecycle.semantic_established` are **never emitted**. KnowledgeEngine subscribes to events that never fire.

**Evidence:** `getMemoryLifecycleEventName()` (MemoryEvents.ts:55-66) correctly maps LONG_TERM → `memory.lifecycle.long_term_promoted` and SEMANTIC → `memory.lifecycle.semantic_established`, but `emitLifecycleEvent()` is only called on consolidate/archive paths, not on every lifecycle transition. The WORKING→CANDIDATE→SHORT_TERM→STABILIZING transitions happen directly via `factory.cloneWithTransition` without calling `emitLifecycleEvent`.

**businessId gap:** Same as Pattern — KnowledgeValidator requires `businessId` (KnowledgeValidator.ts:15-16). `validateKnowledgeInput()` reads `input.businessId` (KnowledgeValidator.ts:57) — falls back to `""` if not in payload. Memory events carry `businessId` from Pattern → which is `""`.

### Evidence→Memory Bridge

**Status:** ✅ FUNCTIONAL

**Evidence:** MemoryEngine.ts:151-168 subscribes to LIFECYCLE_VALIDATED_CONFIRMED and EVALUATION_COMPLETED. Both pass entire payload to `receiveInput()`.

**Caveat:** Silent catch blocks (lines 157, 165) swallow all errors.

### Observation→Memory Bridge

**Status:** ✅ FUNCTIONAL

**Evidence:** MemoryEngine.ts:175-226 subscribes to HISTORICAL_COMMITTED. Dual-path payload parsing (entity-first + legacy fallback). Constructs synthetic MemoryInput from observation data.

**Caveat:** Silent catch block (line 223). Falls back to default values for score (0.5), confidence (0.5).

---

## 6. Dead Code & Disconnected Infrastructure

| # | Instance | File | Line | Status |
|---|----------|------|------|--------|
| 1 | `MemoryRelationships.buildRelationships()` | MemoryRelationships.ts | 51 | ⛔ DISCONNECTED — Never called from MemoryPipeline |
| 2 | `MemoryLifecycle: candidate_promoted` event | MemoryEvents.ts | 7 | ⛔ NEVER EMITTED — Unreachable lifecycle event |
| 3 | `MemoryLifecycle: short_term_established` event | MemoryEvents.ts | 8 | ⛔ NEVER EMITTED — Unreachable lifecycle event |
| 4 | `MemoryLifecycle: stabilizing_started` event | MemoryEvents.ts | 9 | ⛔ NEVER EMITTED — Unreachable lifecycle event |
| 5 | `MemoryLifecycle: long_term_promoted` event | MemoryEvents.ts | 11 | ⛔ NEVER EMITTED — KnowledgEngine subscribes to this but it never fires |
| 6 | `MemoryLifecycle: semantic_established` event | MemoryEvents.ts | 12 | ⛔ NEVER EMITTED — KnowledgeEngine subscribes to this but it never fires |
| 7 | `MemoryLifecycle: historical_archived` event | MemoryEvents.ts | 13 | ⛔ NEVER EMITTED — Unreachable lifecycle event |

**Root cause:** `emitLifecycleEvent()` (MemoryPipeline.ts:376) is only called from `consolidateMemory()` and `archiveMemory()`. All lifecycle transitions that go through `factory.cloneWithTransition()` directly (WORKING→CANDIDATE→SHORT_TERM→STABILIZING) do NOT emit lifecycle events. The events are defined but unreachable.

---

## 7. Determinism Analysis

**Verdict:** ❌ NOT DETERMINISTIC

**Evidence:**
1. **MemoryFactory.ts:15-18** — ID generation uses `Date.now() + counter + Math.random()`. Same input → different IDs.
2. **MemoryFactory.ts:40** — `const now = new Date().toISOString()` — timestamps differ on each call.
3. **All scoring modules** use `Date.now()` — MemoryScoring.ts:72, MemoryConfidence.ts:82, MemoryActivation.ts:55, MemoryQuality.ts:117 — scores depend on wall clock time.
4. **Forgetting criteria** (MemoryForgetting.ts:36) uses `Date.now()` — `shouldForget()` result depends on when it's called.
5. **Confidence history** (MemoryConfidence.ts:11) is in-memory Map — non-deterministic across instances.

---

## 8. Storage Model

**Verdict:** ❌ NO PERSISTENCE — IN-MEMORY ONLY

**Evidence:**
- `MemoryIndex.ts:15-19` — All indexes are `Map<string, ...>` in memory.
- Nothing is written to disk, database, or file.
- `MemoryIndex.clear()` (line 88) — wipes everything.
- Engine restart → all memories lost.
- `MemoryConfidence.history` (MemoryConfidence.ts:11) — in-memory Map, lost on restart.
- `MemoryMetrics` (MemoryMetrics.ts) — all counters reset on restart.

**Pipeline recovery:** The `recoveryPipeline` parameter exists in MemoryPipeline constructor but is never used.

---

## 9. Lifecycle Analysis

**9 stages with complex transition matrix:**

```
WORKING ──────────→ CANDIDATE ──────→ SHORT_TERM ──────→ STABILIZING ──────→ CONSOLIDATED ──────→ LONG_TERM ──────→ SEMANTIC
    │                    │                │                    │                    │                   │              │
    └────ARCHIVED←───┴────ARCHIVED←───┴────ARCHIVED←───┴────ARCHIVED←───┴────ARCHIVED←───┴────ARCHIVED←───┴────ARCHIVED
                                                     │
                                                     └────HISTORICAL──────→ ARCHIVED
                                                                                │
                                                                                └────→ SHORT_TERM (reactivation)
HISTORICAL ─────────────────────────────────────────────────────────────────────────→ SHORT_TERM (reactivation)
```

**Key observations:**
- WORKING and CANDIDATE can jump directly to ARCHIVED (no HISTORICAL intermediate)
- HISTORICAL and ARCHIVED can be reactivated back to SHORT_TERM
- Longest path: 8 transitions (WORKING → ARCHIVED)
- Automatic promotions run on processCycle (60s interval)
- No automatic WEAKENING stage exists (unlike Pattern)
- ARCHIVED → WORKING is NOT allowed (transition table error check: line 133 in memory.test.ts verifies this)

---

## 10. Provenance Analysis

**Memory tracks:** sourceEvidenceIds, sourcePatternIds, sourceObservationIds, creationTimeline, versionHistory, consolidatedFromIds, mergedFromIds.

**Can Memory reconstruct its origin?** ✅ YES — provenance contains full chain of evidence/pattern/observation IDs.

**Can Memory explain why it exists?** ⚠️ PARTIALLY — `description` and `summary` fields exist but are populated with generic text like "Memory created from evidence X". No `evidence.identity.patternName` is stored as a structured reason.

**Can Memory forget?** ✅ YES — `MemoryForgetting.forget()` moves memory to HISTORICAL stage. `shouldForget()` checks retention threshold, strength threshold, and staleness.

**Can Memory decay?** ✅ YES — `MemoryActivation.decayActivation()` reduces activation score by a factor. `MemoryRetention.applyDecay()` reduces retention score. `tickDecay()` in pipeline couples decay with forgetting check.

---

## 11. Technical Debt Inventory

| # | Item | Location | Severity | Impact |
|---|------|----------|----------|--------|
| 1 | **No persistence** — Everything lost on restart | MemoryIndex.ts | 🔴 HIGH | Engine cannot survive restart |
| 2 | **Non-deterministic IDs** — Date.now() + Math.random() | MemoryFactory.ts:18 | 🟡 MEDIUM | Cannot replay same input → same state |
| 3 | **6 lifecycle events never emitted** | MemoryPipeline.ts:376-388 | 🟡 MEDIUM | KnowledgeEngine's long_term/semantic subscriptions never fire |
| 4 | **5 silent catch blocks** — Errors silently swallowed | MemoryEngine.ts:56,157,165,223; MemoryPipeline.ts:371 | 🟡 MEDIUM | Undiagnosed failures |
| 5 | **Confidence history in-memory** — Lost on restart | MemoryConfidence.ts:11 | 🟡 MEDIUM | Same problem as Pattern BF-016 |
| 6 | **MemoryRelationships.buildRelationships() never called** | MemoryRelationships.ts:51 | 🟢 LOW | Dead code — exists but disconnected |
| 7 | **businessId gap** — Inherited from PatternIdentity | MemoryValidator.ts:15-16 | 🔴 HIGH | Memory creation from Pattern events blocked |
| 8 | **Hardcoded "SALES_PATTERN" category** — Never varies | MemoryValidator.ts:57 | 🟢 LOW | All memories categorized as SALES_PATTERN |
| 9 | **Decay rate hardcoded to 0.1** in createFromInput | MemoryFactory.ts:77 | 🟢 LOW | Should be configurable |
| 10 | **RecoveryPipeline never used** in MemoryPipeline | MemoryPipeline.ts:49 | 🟢 LOW | Parameter accepted, never called |
| 11 | **Scoring uses wall clock** — non-deterministic scores | MemoryScoring.ts, MemoryConfidence.ts, etc. | 🟡 MEDIUM | Cannot certify determinism |

---

## 12. Strengths

1. **Comprehensive sub-module separation** — 19 distinct classes with single responsibilities
2. **Rich lifecycle** — 9 stages with complex but well-defined transition matrix
3. **Full forgetting/decay/recovery pipeline** — Automatic decay, forgetting criteria, reactivation
4. **Dual-path payload parsing** — entity-first + legacy fallback on all subscribers
5. **Association engine** — 8 association types, spread activation, path finding (DFS)
6. **Compression infrastructure** — Redundancy detection, deduplication, compression benefit estimation
7. **Quality evaluation** — 12 dimensions with weighted scoring
8. **Provenance tracking** — Full chain of evidence, pattern, observation IDs

---

## 13. Weaknesses

1. **No persistence** — Entire memory is in-memory; engine restart = total amnesia
2. **6 lifecycle events never emitted** — Half of the event catalog unreachable
3. **Non-deterministic** — Date.now() and Math.random() in ID generation; clock-dependent scoring
4. **Pattern→Memory bridge broken by businessId** — No Pattern events currently create memories
5. **Memory→Knowledge bridge partially broken** — Knowledge subscribes to events that never fire (long_term_promoted, semantic_established)
6. **5 silent catch blocks** — Errors silently swallowed, no observability
7. **Hardcoded category** — All memories tagged "SALES_PATTERN" regardless of content
8. **One disconnected sub-module** — MemoryRelationships.buildRelationships() never wired
9. **No replayability** — Same sequence of events produces different memories each time
10. **All scoring depends on wall clock** — Cannot certify determinism

---

## 14. Certification Readiness Assessment

| Aspect | Readiness | Reason |
|--------|-----------|--------|
| Unit tests | ✅ HIGH | 734 lines, 35+ tests, comprehensive coverage |
| Determinism | ❌ BLOCKED | Date.now() + Math.random() in IDs and scoring |
| Persistence | ❌ NOT REQUIRED | Certification certifies current behavior (in-memory only) |
| Pattern→Memory bridge | ⚠️ PASS* | Bridge handler works; businessId blocks end-to-end (pre-existing) |
| Memory→Knowledge bridge | ⚠️ PARTIAL | Only 1/3 subscriber events actually fire |
| Lifecycle events | ❌ GAP | 6/9 lifecycle events never emitted |
| Silent catches | ❌ BLOCKER | 5 silent catch blocks — same as Pattern BF-012 |
| businessId gap | ⚠️ GAP | Inherited from Pattern — not a Memory issue per se |

---

*End of MEMORY DISCOVERY REPORT*
