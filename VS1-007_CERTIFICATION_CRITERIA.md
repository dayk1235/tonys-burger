# VS1-007 CERTIFICATION CRITERIA

**Definition of Completion for Pattern Intelligence Certification**

---

## Certification Rules

1. Every criterion must be verifiable by automated test (not manual inspection).
2. A criterion is FAIL unless proven by test evidence.
3. No equivocation — each criterion is binary: PASS or FAIL.
4. Criteria are grouped: **Critical** (blocks certification), **Required** (core certification), **Enhanced** (completes certification).

---

## CRITICAL (All Must Pass)

### C01 — Algorithm Provenance
- [ ] Every Pattern stores the name/version of the confidence algorithm used
- [ ] Every Pattern stores the quality dimension weights that produced its score
- **Test:** Create pattern → verify `pattern.metadata.confidenceAlgorithm` is non-empty → verify `pattern.metadata.qualityWeights` matches PatternConfidence weights

### C02 — Version Reasoning
- [ ] Every PatternVersion has a `reason` field explaining why it was created
- [ ] Initial version reason is "initial detection"
- [ ] Update version reason includes trigger context
- **Test:** Advance pattern through lifecycle → every version has non-empty reason → version[0].reason === "initial detection"

### C03 — Conflict Detection
- [ ] PatternRelationships.buildRelationships() is called on every pipeline cycle
- [ ] Contradictory patterns produce CONTRADICTS relationship
- [ ] PATTERN_CONFLICT event is emitted when contradiction detected
- **Test:** Create conflicting patterns → verify relationship exists → verify event emitted

### C04 — Automatic Weakening
- [ ] Patterns without new evidence for `maxSilentPeriodMs` auto-transition to WEAKENING
- [ ] `maxSilentPeriodMs` is configurable per pipeline or globally
- **Test:** Create pattern → stop sending evidence → after `maxSilentPeriodMs` → pattern.stage === "WEAKENING"

---

## REQUIRED (All Must Pass)

### C05 — Confidence History Persistence
- [ ] Confidence history is stored within the Pattern (not in-memory Map)
- [ ] Max 100 entries with oldest pruned automatically
- **Test:** Create pattern → record 101 confidence entries → verify Pattern has max 100 → verify entries are ordered
- **Test:** Restart engine → pattern confidence history survives

### C06 — Full Pattern→Memory Bridge
- [ ] MemoryEngine subscribes to: WEAKENING_OBSERVED, DEPRECATED, HISTORICAL_ARCHIVED
- [ ] Each event creates a memory entry in MemoryEngine
- **Test:** Deprecate pattern → verify memory created with stage DEPRECATED
- **Test:** Archive pattern → verify memory created with stage ARCHIVED

### C07 — businessIndex Population
- [ ] PatternMemory.businessIndex is populated during `indexPattern()`
- [ ] `findByBusinessId()` returns correct results
- **Test:** Create patterns with known businessId → query by businessId → correct patterns returned

### C08 — Determinism
- [ ] Two identical observation batches produce identical patterns
- [ ] Categories match, confidence within 1e-10, stages match, evidence IDs match
- **Test:** Feed same 20 observations to two fresh pipelines → assert pattern count, categories, stages, and confidence values are identical

### C09 — Confidence Decay Detection
- [ ] PatternConfidence correctly decreases when contradictory evidence appears
- [ ] PatternConfidence correctly decreases when quality degrades
- **Test:** Add contradicting observation → confidence decreases
- **Test:** Reduce evidence quality → confidence decreases

### C10 — Error Observability
- [ ] No `catch {}` blocks silently swallow errors in PatternPipeline
- [ ] Every error path records through audit pipeline
- **Test:** Inject invalid observation → verify auditPipeline.recordLog called
- **Test:** Inject failing definition → verify auditPipeline.recordLog called

---

## ENHANCED (Completes Certification)

### C11 — Seasonal Pattern Detection
- [ ] SEASONALITY pattern is detected from observations with 24+ hourly data points
- [ ] Seasonality strength and period are recorded
- **Test:** Feed 48 hourly observations with clear diurnal pattern → SEASONALITY detected

### C12 — IQR Anomaly Detection Via Pipeline
- [ ] Pipeline detects anomalies using IQR when sample size is small (< 10)
- [ ] Pipeline detects anomalies using ZSCORE when sample size is adequate
- **Test:** Feed 6 observations + 1 outlier → anomaly detected via IQR
- **Test:** Feed 20 observations + 1 outlier → anomaly detected via ZSCORE

### C13 — Full Lifecycle Automation
- [ ] HISTORICAL patterns auto-archive after `maxArchivalDelayMs`
- [ ] DEPRECATED patterns auto-archive after `maxDeprecatedDelayMs`
- **Test:** Set short delays → advance pattern to HISTORICAL → after delay, pattern is ARCHIVED

### C14 — Threshold Consolidation
- [ ] All thresholds are exported from a single file
- [ ] No hardcoded threshold values remain in detection logic
- **Test:** Import `PatternConstants` → all 10+ thresholds accessible as named exports

### C15 — Complete Test Certification
- [ ] No less than 50 passing tests in Pattern test suite
- [ ] Test categories: lifecycle (6+), detector (12+), quality (2+), confidence (3+), scoring (2+), relationships (2+), storage (4+), registry (2+), metrics (1+), pipeline (2+), engine (3+), business (3+), certification (5+)
- [ ] All tests survive 3 consecutive runs without flakiness
- **Test:** `npm run test:patterns` (or equivalent) passes 3 times in a row

### C16 — Dead Code Elimination
- [ ] All error classes are reachable (not defined but never thrown)
- [ ] `buildRelationships()` is called
- [ ] `PATTERN_CONFLICT` and `PATTERN_MERGED` events are emitted
- [ ] Test coverage confirms each code path is exercised

---

## Certification Matrix

```
Criterion  Priority    Category        Verification Method
─────────────────────────────────────────────────────────
C01        CRITICAL    Provenance      Unit test
C02        CRITICAL    Provenance      Unit test
C03        CRITICAL    Conflict        Integration test
C04        CRITICAL    Lifecycle       Integration test
C05        REQUIRED    Persistence     Integration test + restart
C06        REQUIRED    Bridge          Integration test (Runtime)
C07        REQUIRED    Storage         Unit test
C08        REQUIRED    Determinism     Unit test (2 pipelines)
C09        REQUIRED    Confidence      Unit test + Scenario test
C10        REQUIRED    Observability   Unit test
C11        ENHANCED    Detection       Scenario test
C12        ENHANCED    Detection       Scenario test
C13        ENHANCED    Lifecycle       Integration test
C14        ENHANCED    Structure       Code review + test
C15        ENHANCED    Test Suite      Automated CI
C16        ENHANCED    Dead Code       Coverage report
```

---

## Pass Condition

**VS1-007 is CERTIFIED when:**
- All 4 CRITICAL criteria pass
- All 6 REQUIRED criteria pass
- At least 4 of 6 ENHANCED criteria pass

**VS1-007 is COMPLETE when:**
- All 16 criteria pass
- Pipeline Status Report shows Pattern as ✅ Connected

---

*End of Certification Criteria — VS1-007*
