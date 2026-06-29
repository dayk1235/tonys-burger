# PATTERN ARCHITECTURE DISCOVERY REPORT

**VS1-007 — Pattern Intelligence Certification**
**Date:** 2026-06-28
**Status:** Discovery Complete — No Code Modified

---

## 1. SUBSYSTEM INVENTORY

### 1.1 File Map

```
src/core/engines/pattern/
├── index.ts                  # Barrel exports (61 lines)
├── PatternTypes.ts           # All types, interfaces, constants (197 lines)
├── PatternEngine.ts          # CognitiveEngine implementation (187 lines)
├── PatternPipeline.ts        # Orchestration pipeline (400 lines)
├── PatternRegistry.ts        # Definition + pattern storage (66 lines)
├── PatternFactory.ts         # Pattern creation + versioned transitions (180 lines)
├── PatternValidator.ts       # Definition + input validation (71 lines)
├── PatternDefinitions.ts     # Default definitions (3 detectors) (148 lines)
├── PatternLifecycle.ts       # Stage transition rules (51 lines)
├── PatternCorrelation.ts     # Pearson correlation detector (219 lines)
├── PatternTrend.ts           # Linear regression trend detector (183 lines)
├── PatternAnomaly.ts         # Z-Score + IQR anomaly detector (193 lines)
├── PatternSequence.ts        # Sequence mining detector (177 lines)
├── PatternQuality.ts         # 11-dimension quality evaluation (150 lines)
├── PatternConfidence.ts      # Confidence computation + history (92 lines)
├── PatternScoring.ts         # Strength, novelty, persistence, etc. (121 lines)
├── PatternRelationships.ts   # Inter-pattern relationship detection (96 lines)
├── PatternMemory.ts          # In-memory indexed store (139 lines)
├── PatternMetrics.ts         # Detection metrics tracking (119 lines)
├── PatternEvents.ts          # 16 event names + creator (50 lines)
├── PatternErrors.ts          # 9 error classes (87 lines)
├── PatternContracts.ts       # Interfaces: subscriber, query, metrics (32 lines)
└── tests/
    ├── pattern.test.ts       # 34 unit/integration tests (511 lines)
    └── run-tests.ts          # Test runner entry (1 line)

src/core/runtime/tests/
├── pattern-full-cycle.test.ts       # VS0-008 (241 lines)
└── pattern-memory-integration.test.ts  # VS0-009 (139 lines)
```

### 1.2 Architecture Diagram

```
ObservationEngine
    │ HISTORICAL_COMMITTED (EventBus)
    ▼
PatternEngine (CognitiveEngine)
    │
    ├── PatternPipeline
    │   ├── 1. Evaluate registered PatternDefinitions (3 detectors)
    │   ├── 2. Cross-cutting: detectCorrelations()
    │   ├── 3. Cross-cutting: detectTrends()
    │   ├── 4. Cross-cutting: detectAnomalies()
    │   ├── 5. Cross-cutting: detectSequences()
    │   ├── 6. Store in PatternRegistry → PatternMemory
    │   └── 7. Emit PatternEvent on EventBus
    │
    └── Sub-modules:
        ├── PatternFactory — create + transition
        ├── PatternLifecycle — stage rules
        ├── PatternValidator — input gates
        ├── PatternQuality — 11-dimension eval
        ├── PatternConfidence — scoring + history
        ├── PatternScoring — strength/novelty
        ├── PatternRelationships — inter-pattern links
        ├── PatternRegistry — definition store
        ├── PatternMemory — data store
        └── PatternMetrics — counters
            │ EMERGING_CONFIRMED, TREND_DETECTED, etc. (EventBus)
            ▼
MemoryEngine
    └── subscribeToPatternEvents (8 events)
```

---

## 2. ANSWERED DISCOVERY QUESTIONS

### Q1: Which pattern families already exist?

**Implemented detectors (7):**

| Detector | Category | Method | Location |
|----------|----------|--------|----------|
| repeated_event | REPEATED_EVENT | FREQUENCY | PatternDefinitions.ts:9-50 |
| positive_trend | POSITIVE_TREND | TREND_REGRESSION | PatternDefinitions.ts:52-96 |
| negative_trend | NEGATIVE_TREND | TREND_REGRESSION | PatternDefinitions.ts:98-142 |
| cross-category correlation | CORRELATION | CORRELATION_PEARSON | PatternPipeline.ts:173-198 |
| category trend | POSITIVE/NEGATIVE/STABLE_TREND | TREND_REGRESSION | PatternPipeline.ts:200-230 |
| statistical anomaly | ANOMALY | ANOMALY_ZSCORE | PatternPipeline.ts:232-260 |
| sequence pair | SEQUENCE | SEQUENCE_MINING | PatternPipeline.ts:262-290 |

**Categories with NO detector:** RECURRING_BEHAVIOR, TEMPORAL, SPATIAL, OPERATIONAL, BEHAVIORAL, BUSINESS, EMERGING_TREND, CAUSAL_CANDIDATE, DEGRADING, STRENGTHENING_PATTERN, DISAPPEARING, EVOLVING, CONFLICT, COMPOSITE (14 of 20 categories unused).

**DetectionMethods with NO implementer:** INTERVAL, TEMPORAL_CLUSTER, SPATIAL_CLUSTER, ANOMALY_IQR (standalone), CORRELATION_SPEARMAN, PATTERN_MATCH, COMPOSITE_DERIVED, MANUAL (9 of 14 methods unused).

---

### Q2: Which detectors are only placeholders?

- **Seasonality**: Detectable via `PatternTrend.detectSeasonality()` (line 157-169) but only a boolean flag, no standalone detector or definition.
- **IQR Anomaly**: `PatternAnomaly.detectIQR()` implemented (line 117-148) but `findAnomalies()` (pipeline entry point) only uses ZSCORE path.
- **Spearman Correlation**: `CorrelationResult` supports method "SPEARMAN" but `PatternCorrelation.detect()` only calls `pearson()`.
- **Sequence Mining**: `PatternSequence.detectSequences()` implemented (line 13-54) but pipeline only calls `findRepeatedPairs()`.
- **Burst, Cyclic, Composite**: No implementation exists at any level.

---

### Q3: Which detectors are deterministic? Which depend on thresholds?

All 7 detectors are **deterministic** — given identical observations and pipeline state, output is identical.

**Threshold registry:**

| Detector | Parameter | Default | Location |
|----------|-----------|---------|----------|
| FREQUENCY | minSupport | 3 | PatternDefinitions.ts:14 |
| FREQUENCY | confidenceThreshold | 0.5 | PatternDefinitions.ts:15 |
| FREQUENCY | timeWindowMs | 3600000 (1h) | PatternDefinitions.ts:16 |
| TREND (def) | minSupport | 5 | PatternDefinitions.ts:57, 103 |
| TREND (def) | confidenceThreshold | 0.6 | PatternDefinitions.ts:58, 104 |
| TREND (def) | timeWindowMs | 86400000 (24h) | PatternDefinitions.ts:59, 105 |
| TREND (def) | rSquared gate | 0.3 | PatternDefinitions.ts:86, 132 |
| CORRELATION | minCorrelation | 0.5 | PatternCorrelation.ts:63 |
| CORRELATION | alignment window | 3600000 | PatternCorrelation.ts:108 |
| TREND (cross) | minSlopeSignificance | 0.3 | PatternTrend.ts:68 |
| TREND (cross) | rSquared gate | 0.3 | PatternTrend.ts:46 |
| ANOMALY | z-score threshold | 2.0 | PatternAnomaly.ts:36 |
| ANOMALY | min observations | 10 | PatternAnomaly.ts:38 |
| SEQUENCE | timeWindowMs | 3600000 | PatternSequence.ts:58 |
| SEQUENCE | minOccurrences | 2 | PatternSequence.ts:59 |

---

### Q4: Can two identical observation streams produce different patterns?

**YES** — but only from state pollution, not from non-deterministic detectors.

**Root Cause:** `PatternPipeline.recentObservations` (line 44) is a mutable sliding window (max 500, line 45). If the pipeline has prior state, identical input streams yield different baselines for cross-cutting detections (correlation, trend, anomaly, sequence). Identical streams with identical prior state produce identical patterns.

**HYPOTHESIS:** Pattern IDs use `Math.random()` (PatternFactory.ts:20) so IDs will differ, but correctness is unaffected.

---

### Q5: Does every Pattern contain enough provenance to explain itself?

**PARTIALLY.**

**✅ Present:**
- `originObservations` → "which observations generated me"
- `evidence` (role, weight, capturedAt) → "which evidence supports/contradicts me"
- `identity.detectedBy` → "which detection method found me"
- `versions[]` → stage/confidence version history
- `temporalScope` → first/last observed time

**❌ Missing:**
- No confidence algorithm reference — cannot answer "which algorithm produced my score"
- No quality dimension breakdown — cannot explain WHY confidence is a specific value
- Confidence history is in-memory only (`PatternConfidence.history` Map), not embedded in Pattern
- `PatternVersion` has no `reason` field — cannot answer "why was this version created"
- `sourceEngines` always empty (PatternFactory.ts:124 sets it to `[]`)

---

### Q6: Can every Pattern be reconstructed from Observation history?

**PARTIALLY.**

**Reconstructable:** origin observation IDs, temporal scope, version history.

**NOT reconstructable:**
- `sourceEngines` is always empty — no engine provenance chain
- `PatternMemory.businessIndex` is declared (line 7) but never populated in `indexPattern()` (line 104-113)
- Observation data is NOT embedded — pattern references `originObservations: string[]` only (IDs). If ObservationEngine is cleared, these become dangling pointers.
- Confidence history (`PatternConfidence.history`) is in-memory Map — lost on engine restart.

---

### Q7: Can conflicting patterns coexist?

**YES** — and the system has no resolution mechanism.

**Evidence of conflict infrastructure:**
- `PatternRelationships.detectContradiction()` — detects contradictions (line 18-23)
- `PatternRelationship.type` supports `"CONTRADICTS"` (PatternTypes.ts:117)
- `PatternEventNames.PATTERN_CONFLICT` defined (PatternEvents.ts:30)
- `PatternConflictError` exists (PatternErrors.ts:41-46)

**Evidence of disconnection:**
- `PatternRelationships.buildRelationships()` is **never called** by the pipeline
- `PATTERN_CONFLICT` event is **never emitted**
- `PATTERN_MERGED` event is **never emitted**
- `contradictingObservations` is **always `[]`** (PatternFactory.ts:113)
- `PatternQuality.gradePrecision()` uses `contradictingObservations.length` but it's always 0
- `PatternMetrics.contradictionsResolved` is only updated on DEPRECATED→ARCHIVED transition

**Conclusion:** High demand and Low demand for the same entity coexist silently with no resolution.

---

### Q8: Can Pattern confidence evolve correctly over time?

**PARTIALLY.**

**Lifecycle:** 10 stages defined, transitions validated (PatternLifecycle.ts:4-15):
```
POTENTIAL → CANDIDATE → EMERGING → SUPPORTED → VALIDATED → STRENGTHENING
                                  ↘ WEAKENING → DEPRECATED → HISTORICAL → ARCHIVED
```

**Confidence evolution:**
| Direction | Mechanism | Automatic? | Location |
|-----------|-----------|------------|----------|
| Increasing | updateExistingPattern(): `+0.05 * (1 - existing.confidence)` | ✅ Yes | PatternPipeline.ts:161 |
| Decreasing | No mechanism exists | ❌ No | — |
| Invalidated | No INVALIDATED stage | ❌ No | — |
| Archived | Only via manual `deprecatePattern()` or `advancePattern()` | ❌ No | PatternPipeline.ts:311 |

**Missing lifecycle automation:**
- No automatic WEAKENING detection (decay when evidence stops)
- No automatic archival policy (when HISTORICAL becomes ARCHIVED)
- No "stale pattern" garbage collection
- Confidence history is in-memory only, not persisted in Pattern
- `PatternConfidence.history` Map grows unboundedly (no limit or cleanup)

---

### Q9: Audit PatternDefinitions

**Duplicates:** None found.

**Unused definitions (12 categories with no definition):**
RECURRING_BEHAVIOR, TEMPORAL, SPATIAL, OPERATIONAL, BEHAVIORAL, BUSINESS, EMERGING_TREND, CAUSAL_CANDIDATE, DEGRADING, STRENGTHENING_PATTERN, DISAPPEARING, EVOLVING, CONFLICT, COMPOSITE

**Unreachable detectors:**
- `PatternCorrelation.spearman()` — never implemented, only Pearson called
- `PatternAnomaly.detectIQR()` — never called from pipeline (only from `detect()` which is never called)
- `PatternAnomaly.detect()` — never called from pipeline (only `findAnomalies()`)
- `PatternSequence.detectSequences()` — never called from pipeline (only `findRepeatedPairs()`)

**Dead code:**
- `PatternRelationships.buildRelationships()` — defined but never invoked
- `PatternEventNames.PATTERN_CONFLICT` / `PATTERN_MERGED` — never emitted
- `PatternMemory.businessIndex` — declared but never written to (always empty)
- `PatternEngineMetricsSnapshot.contradictionsResolved` — tracked but always 0
- `PatternConfidence.history` — unbounded growth, no cleanup
- `InsufficientEvidenceError` — thrown in some scenarios but `throw` is never used in pipeline flow
- `DetectionFailedError` — declared but never thrown

---

### Q10: Review all Pattern Tests

**Test classification (36 total):**

| Category | Count | Tests |
|----------|-------|-------|
| lifecycle | 5 | allowed transitions, invalid transitions, canTransition, self-transition, isActive/isTerminal |
| detector | 9 | factory create, cloneWithTransition, validator validate, validator reject, correlation positive, correlation negative, trend positive, trend negative, anomaly zscore, anomaly IQR, sequence pairs |
| quality | 1 | quality dimensions |
| confidence | 1 | compute + history |
| scoring | 1 | strength/novelty |
| relationships | 1 | overlap detection |
| storage | 3 | PatternMemory store/retrieve, findByCategory, findByStage |
| registry | 1 | register definitions |
| metrics | 1 | detection tracking |
| pipeline | 1 | process observations |
| engine | 3 | CognitiveEngine contract, start/stop, receiveInput, reject when not running |
| business | 3 | sales trend, operational anomaly, financial-inventory sequence |
| certification | 2 | VS0-008 full cycle, VS0-009 pattern→memory |

**Missing certification tests:**
- Stage WEAKENING lifecycle
- Stage ARCHIVED lifecycle
- Pattern conflict detection
- Pattern merge
- Confidence history persistence
- PatternMemory.businessIndex / observationIndex queries
- All 3 definitions simultaneously producing output
- Quality all-zero edge case
- Observation→Pattern→Memory full bridge (end-to-end)
- Determinism verification (same input → same output)
- Contradicting evidence role
- IQR anomaly via pipeline
- Spearman correlation
- `findRepeatedPairs` category interaction
- Concurrent observation processing
- Empty/null observation edge cases
- Pattern decay (weakening detection)

---

## 3. OBSERVATION → PATTERN BRIDGE

**Location:** `PatternEngine.ts:118-156` (`subscribeToObservations()`)

**Flow:**
1. PatternEngine subscribes to `ObservationEventNames.HISTORICAL_COMMITTED`
2. On event, extracts observation data from payload (handles two payload formats)
3. Converts to `ObservationRef` via `toObservationRef()`
4. Calls `pipeline.processObservation(ref)`

**Issues:**
- `catch {}` silently swallows all errors (line 152-154)
- No backpressure mechanism if observations arrive faster than processing
- Subscribes only to `HISTORICAL_COMMITTED` — misses POTENTIAL, CANDIDATE, CONTEXT_ASSIGNED stages
- `trustScore` defaults to 0.5 if not provided (line 167)

---

## 4. PATTERN → MEMORY BRIDGE

**Location:** `MemoryEngine.ts:229-293` (`subscribeToPatternEvents()`)

**Flow:**
1. MemoryEngine subscribes to 8 pattern events:
   - EMERGING_CONFIRMED, SUPPORTED_ESTABLISHED, VALIDATED_CONFIRMED, STRENGTHENING_OBSERVED
   - TREND_DETECTED, CORRELATION_FOUND, ANOMALY_DETECTED, SEQUENCE_DISCOVERED
2. On event, extracts pattern data (handles two payload formats)
3. Calls `receiveInput()` to create a Memory entry

**Issues:**
- Does NOT subscribe to WEAKENING_OBSERVED, DEPRECATED, or HISTORICAL_ARCHIVED — memory never updated when pattern decays
- `catch {}` silently swallows all errors (line 289)
- Pattern events for POTENTIAL, CANDIDATE stages are ignored (correct behavior, but undocumented)
- `businessId` is likely always `""` (line 252) — pattern events don't carry businessId in entity format

---

## 5. KEY ARCHITECTURAL FINDINGS

### Strengths
1. Clean separation of concerns — 23 files with single responsibilities
2. Well-defined types in PatternTypes.ts
3. Lifecycle state machine is rigorously enforced with transitions
4. All detectors are deterministic
5. Evidence refs carry role (ORIGIN/SUPPORTING/CONTRADICTING)
6. Version history tracks every change
7. Pattern→Memory bridge subscribes to 8 events for full coverage

### Critical Gaps
1. No conflict resolution — contradictory patterns coexist silently
2. No automatic decay — WEAKENING stage is unreachable via automation
3. No confidence provenance — cannot explain WHY a confidence is what it is
4. Observability: confidence history is in-memory, lost on restart
5. 14 of 20 PatternCategory values have no detector
6. 9 of 14 DetectionMethod values have no implementation
7. PatternRelationships is wired to nothing — buildRelationships() never called
8. businessIndex in PatternMemory never populated
9. Only 3 default definitions — detection heavily relies on hardcoded cross-cutting
10. Pool of thresholds is undocumented in a single location

---

*End of Architecture Discovery Report — VS1-007*
