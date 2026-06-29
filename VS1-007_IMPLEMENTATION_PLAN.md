# VS1-007 IMPLEMENTATION PLAN

**Certify Pattern Intelligence — Deterministic, Explainable, Correct**

---

## Priority Order

Each item includes: effort estimate (S/M/L/XL), risk, and justification.

---

### P0 — Non-Negotiable (Blockers)

#### 1. Add Pattern Confidence Algorithm Reference to Pattern
- **Effort:** S
- **Risk:** None
- **Files:** `PatternTypes.ts`, `PatternFactory.ts`
- **What:** Add `confidenceAlgorithm` field to `PatternMetadata` (or top-level `Pattern`) storing the algorithm version/name that produced the score. Add `qualityWeights` record showing the dimension breakdown.
- **Why:** Q5 — Pattern cannot currently explain its own confidence.
- **How:** `PatternFactory.createPotential()` records `"PatternConfidence:v1"` and the weights used. Each `cloneWithTransition()` updates this if confidence recomputed.

#### 2. Add Version Reason Field
- **Effort:** XS
- **Risk:** None
- **Files:** `PatternTypes.ts`, `PatternFactory.ts`
- **What:** Add `reason?: string` to `PatternVersion`. Populate it on every transition with the trigger (e.g., "initial detection", "evidence update", "manual advance", "confidence recomputed").
- **Why:** Q5/Q6 — Version history cannot explain why each version was created.
- **How:** `cloneWithTransition()` accepts optional `reason` parameter; pipeline passes context.

#### 3. Wire PatternRelationships.buildRelationships() Into Pipeline
- **Effort:** S
- **Risk:** Low
- **Files:** `PatternPipeline.ts`, `PatternRelationships.ts`
- **What:** Call `buildRelationships()` after all detectors run. Emit `PATTERN_CONFLICT` event when CONTRADICTS relationships found.
- **Why:** Q7 — conflict infrastructure exists but is disconnected.
- **How:** In `processObservation()`, after the 4 cross-cutting detectors, call `this.relationships.buildRelationships(allPatterns)` and handle CONTRADICTS results.

#### 4. Implement Automatic WEAKENING Detection
- **Effort:** M
- **Risk:** Medium
- **Files:** `PatternPipeline.ts`, `PatternScoring.ts`, `PatternLifecycle.ts`
- **What:** After processing N observations without new evidence for a pattern, automatically transition to WEAKENING. Add configurable `maxSilentPeriodMs` per pattern.
- **Why:** Q8 — no automatic decay path exists. WEAKENING stage is unreachable via automation.
- **How:** In `processObservation()`, check all active patterns against `lastDetectedAt` + `maxSilentPeriod`. If stale, call `advancePattern()` to WEAKENING.

---

### P1 — Core Intelligence (Certification Requirements)

#### 5. Persist Confidence History in Pattern
- **Effort:** M
- **Risk:** Medium
- **Files:** `PatternTypes.ts`, `PatternConfidence.ts`, `PatternFactory.ts`
- **What:** Move confidence history from in-memory `Map` into the Pattern itself (add `confidenceHistory: ConfidenceEntry[]` to `PatternMetadata` or top-level). Set a max length (e.g., 100 entries).
- **Why:** Q5, Q6, Q8 — confidence history is lost on restart, unrecoverable.
- **How:** Add `confidenceHistory` array to Pattern. `PatternConfidence.recordHistory()` appends to pattern instead of internal Map. Prune at max length.

#### 6. Add Pattern → Memory Bridge for WEAKENING/DEPRECATED/HISTORICAL
- **Effort:** S
- **Risk:** Low
- **Files:** `MemoryEngine.ts`
- **What:** Subscribe to `WEAKENING_OBSERVED`, `DEPRECATED`, `HISTORICAL_ARCHIVED` in MemoryEngine.
- **Why:** Q8 — pattern lifecycle decay is invisible to MemoryEngine.
- **How:** Add 3 event names to the subscription list in `subscribeToPatternEvents()`.

#### 7. Populate PatternMemory.businessIndex
- **Effort:** XS
- **Risk:** None
- **Files:** `PatternMemory.ts`
- **What:** In `indexPattern()`, add pattern ID to `businessIndex` using the pattern's metadata or observation references.
- **Why:** Q6 — businessIndex declared but never populated.
- **How:** Extract `businessId` from pattern evidence observations and index.

#### 8. Add Determinism Verification Test
- **Effort:** S
- **Risk:** Low
- **Files:** `tests/pattern.test.ts`
- **What:** Process identical observation batches on two separate PatternPipeline instances and assert identical results.
- **Why:** Q4 — must certify determinism.
- **How:** Create two `PatternPipeline` instances, feed identical data, assert same pattern count/categories/stages/confidence values.

---

### P2 — Coverage Expansion

#### 9. Add IQR Anomaly Path to Pipeline
- **Effort:** S
- **Risk:** Low
- **Files:** `PatternAnomaly.ts`, `PatternPipeline.ts`
- **What:** Make `findAnomalies()` accept method parameter or auto-select ZSCORE vs IQR based on sample size.
- **Why:** Q2 — IQR detector exists but is disconnected.
- **How:** Add method parameter to `PatternAnomaly.findAnomalies()` (default "ZSCORE" for backward compat). Pipeline passes it through.

#### 10. Add Seasonality Detector Definition
- **Effort:** M
- **Risk:** Medium
- **Files:** `PatternDefinitions.ts`, `PatternSeasonality.ts` (new)
- **What:** Create standalone `SEASONALITY` detector definition using existing PatternTrend.detectSeasonality() logic. Register as 4th default definition.
- **Why:** Q1 — seasonality logic exists but is only a flag.
- **How:** Extract seasonality detection into `PatternSeasonality.ts` as a proper `PatternDefinition`-compatible detector.

---

### P3 — Hardening

#### 11. Add Error Boundaries to Pipeline
- **Effort:** S
- **Risk:** Low
- **Files:** `PatternPipeline.ts`, `PatternErrors.ts`
- **What:** Remove silent `catch {}` blocks. Log errors through audit pipeline instead.
- **Why:** Observable failures swallowed throughout pipeline.
- **How:** Replace `catch {}` with `catch (e) { if (this.auditPipeline) await this.auditPipeline.recordLog(...) }`.

#### 12. Undocumented Thresholds Consolidation
- **Effort:** S
- **Risk:** Low
- **Files:** `PatternConstants.ts` (new) or `PatternTypes.ts`
- **What:** Extract all thresholds into a single constants file with documentation.
- **Why:** Q3 — thresholds are scattered across 6 files.
- **How:** Create `PatternConstants.ts` with all default threshold values, export them, import where needed.

#### 13. Add Stale Pattern Garbage Collection
- **Effort:** M
- **Risk:** Medium
- **Files:** `PatternPipeline.ts`, `PatternLifecycle.ts`
- **What:** Automated archival of patterns in HISTORICAL stage after configurable TTL. Automated cleanup of DEPRECATED patterns.
- **Why:** Q8 — no lifecycle completion automation.
- **How:** Add periodic sweep in `PatternEngine` that checks pattern age and auto-archives.

---

## Summary

| Priority | Items | Total Effort | Certification Impact |
|----------|-------|--------------|---------------------|
| P0 | 4 | S+S+S+M | Q5, Q6, Q7, Q8 blockers |
| P1 | 4 | M+S+XS+S | Q4, Q5, Q6, Q8 core |
| P2 | 2 | S+M | Q1, Q2 coverage |
| P3 | 3 | S+S+M | Q3, Q8 hardening |
| **Total** | **13** | **~18 developer-days** | **All 10 questions addressed** |

---

## Blocking Dependencies

1. P0 items block P1 — confidence provenance must exist before persistence.
2. P1.5 (confidence history) blocks P3.3 (stale pattern detection uses confidence trends).
3. P1.1 (businessIndex) is independent.
4. P2 items are independent of P0/P1.

---

*End of VS1-007 Implementation Plan*
