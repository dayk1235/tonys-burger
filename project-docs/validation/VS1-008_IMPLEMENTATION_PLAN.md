# VS1-008 — IMPLEMENTATION PLAN

**Date:** 2026-06-28
**Status:** PLAN ONLY — NOT IMPLEMENTED

---

## Classification

Per LAW-069: Every item is classified into exactly one category.

| Category | Meaning |
|----------|---------|
| **P0 — Certification Blocker** | Must be fixed before Memory can be certified |
| **P1 — Independent BF** | New capability — deferred to independent BF |
| **P2 — Technical Debt** | Should be fixed later. Does NOT block certification |
| **P3 — Documentation / Test** | Test-only or documentation changes within VS |

---

## P0 — Certification Blockers

### P0-01: Silent Catch Blocks (5 instances)

**Description:** MemoryEngine.ts has 4 silent `catch {}` blocks (lines 56, 157, 165, 223). MemoryPipeline.ts has 1 (line 371). Errors are silently swallowed with no observability.

**Rationale:** Without error observability, certification tests may silently pass/fail with no trace. Results would be unreliable. Cannot certify an engine whose failure modes are invisible. **Same pattern as BF-012 for Pattern.**

**Files:** `MemoryEngine.ts:56,157,165,223`, `MemoryPipeline.ts:371`

**Effort:** Low (replace with audit pipeline logging)
**Risk:** Low
**Dependencies:** None

---

## P1 — New Capabilities (Independent BFs)

### P1-01 (BF-021): Memory Event Lifecycle Completeness

**Description:** Fix `emitLifecycleEvent()` to fire the correct lifecycle event on every stage transition, not just on consolidate/archive. Currently 6 of 9 lifecycle events are never emitted.

**Rationale:** KnowledgeEngine subscribes to `long_term_promoted` and `semantic_established` but these never fire. The Memory→Knowledge bridge is structurally incomplete.

**Files:** `MemoryPipeline.ts`, `MemoryEvents.ts`

**Effort:** Medium
**Risk:** Medium (changes event emission behavior)
**Dependencies:** None

### P1-02 (BF-022): Memory Persistence

**Description:** Replace in-memory MemoryIndex with persistent storage. Memory currently has zero persistence — all data lost on restart.

**Rationale:** Memory without persistence cannot survive engine restart. Required for production readiness.

**Files:** `MemoryIndex.ts`, new `MemoryStorage.ts`

**Effort:** High
**Risk:** High (architectural change to storage model)
**Dependencies:** None

### P1-03 (BF-023): Memory Determinism

**Description:** Remove Date.now() and Math.random() from ID generation. Remove wall-clock dependency from scoring (MemoryScoring, MemoryConfidence, MemoryActivation, MemoryQuality). Accept timestamps as parameters.

**Rationale:** Memory is non-deterministic. Cannot certify determinism without this fix.

**Files:** `MemoryFactory.ts`, `MemoryScoring.ts`, `MemoryConfidence.ts`, `MemoryActivation.ts`, `MemoryQuality.ts`

**Effort:** Medium
**Risk:** Medium (changes scoring semantics)
**Dependencies:** None

### P1-04 (BF-024): Memory Pattern Bridge — businessId Propagation

**Description:** Add `businessId` field to PatternIdentity. Wire it through PatternEvents and ensure Pattern→Memory bridge carries a valid businessId.

**Rationale:** Without this, no Pattern event ever creates a Memory. The bridge is structurally correct but data-contract blocked.

**Files:** `pattern/PatternTypes.ts`, `memory/MemoryEngine.ts`

**Effort:** Low (data field addition)
**Risk:** Low
**Dependencies:** Pattern engine modification (cannot modify — Pattern is FROZEN. Requires BF-017 scope or separate BF).

### P1-05 (BF-025): Memory Relationships Wiring

**Description:** Call `MemoryRelationships.buildRelationships()` from MemoryPipeline after creation or consolidation cycles.

**Rationale:** Currently disconnected. MemoryRelationships has full duplicate/corroboration/contradiction detection but never produces a single relationship.

**Files:** `MemoryPipeline.ts`, `MemoryRelationships.ts`

**Effort:** Low
**Risk:** Low
**Dependencies:** None

### P1-06 (BF-026): Memory→Knowledge Bridge Completion

**Description:** Ensure lifecycle events work correctly (depends on BF-021) so KnowledgeEngine receives CONSOLIDATED, LONG_TERM_PROMOTED, and SEMANTIC_ESTABLISHED events correctly.

**Rationale:** Currently only 1 of 3 subscribed events actually fires (due to emitLifecycleEvent bug). Knowledge creation from Memory is incomplete.

**Files:** `MemoryPipeline.ts` (if BF-021 fixes this), `KnowledgeEngine.ts`

**Effort:** Low (included in BF-021 scope)
**Risk:** Low
**Dependencies:** BF-021

---

## P2 — Technical Debt

### P2-01: Hardcoded SALES_PATTERN Category

**Description:** `MemoryValidator.ts:57` always sets `category: "SALES_PATTERN"` regardless of evidence content. Should derive from evidence.

**Files:** `MemoryValidator.ts`

**Effort:** Low
**Risk:** Low

### P2-02: RecoveryPipeline Unused

**Description:** MemoryPipeline constructor accepts `recoveryPipeline` parameter but never uses it. All errors in createMemory/consolidateMemory, etc. have no recovery path.

**Files:** `MemoryPipeline.ts`

**Effort:** Low
**Risk:** Low

### P2-03: Hardcoded Decay Rate 0.1

**Description:** `MemoryFactory.ts:77` hardcodes `decayRate: 0.1` for all memories. Should be configurable or derived.

**Files:** `MemoryFactory.ts`, `MemoryTypes.ts`

**Effort:** Low
**Risk:** Low

---

## P3 — Test & Documentation

### P3-01: Memory Certification Tests

**Description:** Create certification test suite (analogous to vs1-007-certification.test.ts). Cover all sub-modules with deterministic test harness.

**Files:** `src/core/engines/memory/tests/vs1-008-certification.test.ts`

**Effort:** Medium
**Risk:** Low

### P3-02: VS1-008 Controlled Validation

**Description:** Create CV-032 with controlled validation scenarios.

**Files:** `project-docs/validation/CV-032_MEMORY_CERTIFICATION.md`

**Effort:** Medium
**Risk:** Low

---

## Effort Estimate Summary

| Priority | Items | Total Effort | Risk |
|----------|-------|-------------|------|
| **P0** | 1 (silent catches) | Low | Low |
| **P1** | 6 BFs | Medium-High | Low-Medium |
| **P2** | 3 debt items | Low | Low |
| **P3** | 2 test/documentation | Low-Medium | Low |
| **Total** | **12 items** | **Medium** | **Low-Medium** |

---

## Implementation Order

```
Phase 0    P0-01 — Silent Catches       ⬅️ BLOCKS VS1-008
               ↓
Phase 1    VS1-008 Certification        ⬅️ Certify current Memory (in-memory, non-deterministic)
               ↓
Phase 2    BF-021 — Lifecycle Events    ⬅️ Independent
Phase 2    BF-024 — businessId          ⬅️ Independent (depends on Pattern unfreeze)
Phase 2    BF-025 — Relationships Wire  ⬅️ Independent
               ↓
Phase 3    BF-022 — Persistence         ⬅️ Independent (post-certification)
Phase 3    BF-023 — Determinism         ⬅️ Independent (post-certification)
Phase 3    BF-026 — Knowledge Bridge    ⬅️ Depends on BF-021
               ↓
Phase 4    P2-01, P2-02, P2-03 (debt)  ⬅️ Anytime
```

---

## Key Dependencies

1. **Pattern→Memory bridge (businessId):** Cannot be fixed within Memory alone. PatternIdentity must be modified. Pattern is FROZEN — requires explicit unfreeze or BF-017 scope.
2. **Memory→Knowledge bridge:** Structure depends on BF-021 (lifecycle event fixes).
3. **Memory certification:** Only blocked by P0-01 (silent catches). P1–P3 can be deferred.

---

*End of VS1-008 Implementation Plan*
