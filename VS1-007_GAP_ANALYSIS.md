# VS1-007 GAP ANALYSIS

**Current Intelligence vs Target Intelligence**

---

## Summary

| Capability | Current Status | Target Status | Gap |
|------------|---------------|---------------|-----|
| Pattern Families | 7 detectors (3 definitions + 4 cross-cutting) | 10+ families | 14 categories defined, only 5 produced |
| Determinism | ✅ Deterministic per detector | ✅ Deterministic end-to-end | State pollution from sliding window |
| Provenance | ⚠️ Partial | ✅ Full explainability | No confidence algorithm reference, no version reason |
| Reconstruction | ⚠️ Partial | ✅ Full from observation history | businessIndex empty, no embedded observation data |
| Conflict Resolution | ❌ Non-existent | ✅ Coexisting conflicts resolved | Infrastructure exists but disconnected |
| Confidence Evolution | ⚠️ Increasing only | ✅ Full lifecycle (up/down/archive) | No weakening, no archival, no decay |
| Threshold Management | ❌ Scattered | ✅ Consolidated, documented | Thresholds in 6 files, no single reference |
| Pattern→Memory Bridge | ⚠️ Partial (8 events) | ✅ Full lifecycle bridge | Missing weakening, deprecated, archived events |
| Test Coverage | ⚠️ 36 tests, 2 certification | ✅ Full certification suite | Missing weakening, conflict, determinism, edge cases |
| Dead Code | ⚠️ 7 instances | ✅ Zero dead code | buildRelationships(), businessIndex, unused error types |

---

## Detailed Gap Table

| # | Dimension | Current State | Target State | Criticality |
|---|-----------|--------------|--------------|-------------|
| 1 | Confidence explainability | Pattern has no algorithm reference | Pattern stores algorithm + weight breakdown | CRITICAL |
| 2 | Version reasoning | `PatternVersion` has no reason field | Every version records why created | CRITICAL |
| 3 | Conflict resolution | Infrastructure exists but disconnected | CONTRADICTS relationships resolved automatically | HIGH |
| 4 | Automatic weakening | WEAKENING unreachable via automation | Patterns auto-decay when evidence stops | HIGH |
| 5 | Confidence history persistence | In-memory only, lost on restart | Embedded in Pattern with max 100 entries | HIGH |
| 6 | businessIndex | Declared but never populated | Fully indexed | MEDIUM |
| 7 | Pattern→Memory full bridge | 8 of 11 lifecycle events subscribed | All lifecycle events subscribed | MEDIUM |
| 8 | IQR anomaly pipeline path | Implementation exists but disconnected | Pipeline calls IQR when appropriate | MEDIUM |
| 9 | Seasonality detection | Code exists as boolean flag | Standalone detector definition | MEDIUM |
| 10 | Error observability | 5 `catch {}` blocks silently swallow errors | Errors logged through audit pipeline | MEDIUM |
| 11 | Threshold consolidation | Thresholds in 6 files, no single reference | Single `PatternConstants.ts` | LOW |
| 12 | Stale pattern GC | No automated archival | HISTORICAL → ARCHIVED after TTL | LOW |
| 13 | Determinism certification test | Not tested | Verified in CI | MEDIUM |
| 14 | Dead code removal | 7 instances of dead code | All removed or wired | LOW |

---

## Capability Matrix

```
Legend:  ✅ = Complete   ⚠️ = Partial   ❌ = Missing

Category                  Current     Target
─────────────────────────────────────────────
FREQUENCY detection       ✅          ✅
TREND detection           ✅          ✅
CORRELATION detection     ✅          ✅
ANOMALY detection         ✅          ✅
SEQUENCE detection        ⚠️          ✅
  (only pairs, missing
   multi-step sequences)
SEASONALITY detection     ❌          ✅
BURST detection           ❌          ✅
CYCLIC detection          ❌          ✅
COMPOSITE detection       ❌          ✅

Pattern lifecycle:        ⚠️          ✅
  POTENTIAL → CANDIDATE   ✅          ✅
  CANDIDATE → EMERGING    ✅          ✅
  EMERGING → SUPPORTED    ✅          ✅
  SUPPORTED → VALIDATED   ✅          ✅
  VALIDATED → STRENGTH    ✅          ✅
  WEAKENING (auto)        ❌          ✅
  DEPRECATED (auto)       ⚠️          ✅
  HISTORICAL → ARCHIVED   ❌          ✅

Provenance:               ⚠️          ✅
  "why created"           ⚠️          ✅
  "which observations"    ✅          ✅
  "which evidence"        ✅          ✅
  "confidence algorithm"  ❌          ✅
  "confidence weights"    ❌          ✅
  "version reason"        ❌          ✅

Bridge integrity:         ⚠️          ✅
  Obs → Pattern           ✅          ✅
  Pattern → Memory        ⚠️          ✅
  Pattern → Memory (decay)❌          ✅

Test certification:       ⚠️          ✅
  Lifecycle               ✅          ✅
  Detectors               ⚠️          ✅
  Confidence              ⚠️          ✅
  Conflict                ❌          ✅
  Determinism             ❌          ✅
  Edge cases              ❌          ✅
```

---

## Gap Closure Strategy

1. **P0 (Blockers):** Close gaps 1, 2, 3, 4 — confidence provenance, version reason, conflict wiring, auto-weakening
2. **P1 (Core):** Close gaps 5, 6, 7, 13 — confidence persistence, businessIndex, full bridge, determinism test
3. **P2 (Coverage):** Close gaps 8, 9 — IQR pipeline path, seasonality detector
4. **P3 (Hardening):** Close gaps 10, 11, 12, 14 — error boundaries, thresholds, stale GC, dead code

---

*End of Gap Analysis — VS1-007*
