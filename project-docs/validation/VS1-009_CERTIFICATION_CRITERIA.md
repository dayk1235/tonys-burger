# VS1-009 CERTIFICATION CRITERIA — Knowledge Architecture Discovery

**VS1-009 — Knowledge Architecture Discovery**
**Date:** 2026-06-28
**Status:** DISCOVERY COMPLETE — Certification criteria identified

---

## 1. Certification Scope

This document defines the criteria that the Knowledge subsystem must satisfy to be considered certified. Certification is not performed in this Sprint (DISCOVERY ONLY, per LAW-069). These criteria serve as the specification for future BFs and certification tests.

---

## 2. Certification Levels

| Level | Definition |
|-------|------------|
| **L0 — Uncertified** | Current state |
| **L1 — Deterministic** | Same input → same output; IDs are reproducible |
| **L2 — Persistent** | State survives engine restart |
| **L3 — Observable** | All errors are captured, logged, and auditable |
| **L4 — Contract Complete** | All events are emitted; all subscribers fire |
| **L5 — Bridge Complete** | All bridges are bidirectional and contract-verified |
| **L6 — Lifecycle Complete** | Automatic progression through all 10 stages |
| **L7 — Certified** | All L1-L6 criteria satisfied |

---

## 3. Certification Criteria

### Criterion K1: Deterministic Knowledge Creation

| Property | Value |
|----------|-------|
| **ID** | K1 |
| **Level** | L1 |
| **Description** | Given the same input, `KnowledgeEngine.receiveInput()` must produce identical Knowledge objects (excluding timestamps). |
| **Verification** | Call `receiveInput()` twice with the same input. Both calls must return Knowledge with the same `businessId`, `memoryId`, `patternId`, `evidenceIds`, `name`, `category`, `confidence`, `integrity`. ID values may differ (if using UUID), but must be reproducible if using deterministic scheme. |
| **Current status** | ❌ FAILS — `Date.now() + Math.random()` produces different IDs every time. |
| **BF dependency** | BF-020 |

### Criterion K2: Deterministic Scoring

| Property | Value |
|----------|-------|
| **ID** | K2 |
| **Level** | L1 |
| **Description** | Quality evaluation, confidence computation, and scoring must produce the same output for the same Knowledge object. |
| **Verification** | Compute `KnowledgeQuality.evaluate()`, `KnowledgeConfidence.compute()`, `KnowledgeScoring.evaluate()` twice on the same Knowledge object. Must return identical values. |
| **Current status** | ❌ FAILS — Confidence computation depends on version timestamps which include wall clock. |
| **BF dependency** | BF-020 |

### Criterion K3: Error Observability

| Property | Value |
|----------|-------|
| **ID** | K3 |
| **Level** | L3 |
| **Description** | Every error path in KnowledgeEngine must produce an audit log entry. No silent catch blocks allowed. |
| **Verification** | (1) Inject invalid Memory event payloads. Verify audit pipeline records each failure. (2) Remove all `catch { /* silently */ }` blocks — replace with audit pipeline calls. Ensure all subscribers have error handling visible to audit. |
| **Current status** | ❌ FAILS — 5 silent catch blocks in KnowledgeEngine.ts and KnowledgePipeline.ts. |
| **BF dependency** | BF-019 |

### Criterion K4: Event Contract Completeness

| Property | Value |
|----------|-------|
| **ID** | K4 |
| **Level** | L4 |
| **Description** | Every defined Knowledge lifecycle event must be emitted at the corresponding stage transition. |
| **Verification** | (1) Create Knowledge → verify `knowledge.lifecycle.extracted` is emitted. (2) Validate Knowledge → verify `knowledge.lifecycle.validated` is emitted. (3) Generalize Knowledge → verify `knowledge.lifecycle.generalized` is emitted. (4) Specialize → verify `knowledge.lifecycle.specialized`. (5) Promote to Semantic → verify `knowledge.lifecycle.semantic`. (6) Promote to Canonical → verify `knowledge.lifecycle.canonical`. (7) Deprecate → verify `knowledge.lifecycle.historical` AND `knowledge.operation.deprecated`. (8) Archive → verify `knowledge.lifecycle.archived`. (9) Link concepts → verify `knowledge.operation.linked`. (10) Validate operation → verify `knowledge.operation.validated` is emitted. |
| **Current status** | ❌ FAILS — 10 of 24 (42%) defined events are never emitted. |
| **BF dependency** | BF-018 |

### Criterion K5: Memory→Knowledge Bridge

| Property | Value |
|----------|-------|
| **ID** | K5 |
| **Level** | L5 |
| **Description** | When MemoryEngine consolidates a memory, KnowledgeEngine must automatically create Knowledge with full provenance traceability. |
| **Verification** | Run the automatic Memory→Knowledge test (BF-007 / `automatic-memory-knowledge.test.ts`). Verify: (1) Knowledge is created in KnowledgeIndex. (2) `knowledge.identity.memoryId` equals the source memory ID. (3) `knowledge.identity.patternId` equals the source memory's patternId. (4) `knowledge.identity.evidenceIds` contains all source memory evidenceIds. (5) `knowledge.provenance.sourceMemoryIds` includes source memory ID. (6) `knowledge.provenance.sourcePatternIds` includes source pattern ID. (7) `knowledge.stage === "VALIDATED"`. (8) `knowledge.confidence > 0`. |
| **Current status** | ⚠️ PARTIAL — Works for CONSOLIDATED memories only. LONG_TERM and SEMANTIC events never fire. businessId may be empty. |
| **BF dependency** | BF-023, BF-027 |

### Criterion K6: Knowledge→Attention Bridge

| Property | Value |
|----------|-------|
| **ID** | K6 |
| **Level** | L5 |
| **Description** | When KnowledgeEngine validates a knowledge item, AttentionEngine must automatically create an Attention entity. |
| **Verification** | Run the Knowledge→Attention integration test (VS1-002 / `knowledge-attention-integration.test.ts`). Verify: (1) Attention is created. (2) `attention.identity.sourceId === knowledge.id`. (3) `attention.identity.sourceType === "KNOWLEDGE"`. (4) `attention.stage !== "CANDIDATE"`. (5) `attention.priority > 0`. (6) Category mapping is semantically correct. |
| **Current status** | ✅ PASSES — Single-event subscription works. But only for VALIDATED events. |
| **BF dependency** | BF-024 (for expanded lifecycle coverage) |

### Criterion K7: Lifecycle Completeness

| Property | Value |
|----------|-------|
| **ID** | K7 |
| **Level** | L6 |
| **Description** | Knowledge must automatically progress through the lifecycle stages without requiring explicit external calls. |
| **Verification** | (1) Create Knowledge from Memory → automatically reaches VALIDATED. (2) After sufficient quality/confidence threshold, automatically promotes to SEMANTIC. (3) After further maturity, automatically promotes to CANONICAL. (4) After staleness threshold, automatically deprecates to HISTORICAL. (5) After archival threshold, automatically archives. (6) The full path CANDIDATE→EXTRACTED→VALIDATED→SEMANTIC→CANONICAL→HISTORICAL→ARCHIVED must be traversable without external pipeline calls. |
| **Current status** | ❌ FAILS — No automatic progression exists. Knowledge stays at VALIDATED indefinitely. |
| **BF dependency** | BF-022, BF-018 |

### Criterion K8: Inference Boundaries

| Property | Value |
|----------|-------|
| **ID** | K8 |
| **Level** | L7 |
| **Description** | Knowledge must never be used for inference it is not qualified for. |
| **Verification** | (1) Knowledge with no source memories → must reject (`InferenceBoundaries.validateSupported`). (2) Knowledge with no source evidence → must reject. (3) Knowledge with high abstraction and low source count → boundary warning. (4) Canonical knowledge with <2 validations → boundary warning. |
| **Current status** | ⚠️ PARTIAL — `validateSupported` is called in `validateKnowledge()`. But `validateNoPrediction`, `validateNoDecision`, `validateNoPlanning`, `validateNoReasoning` are called nowhere. |
| **BF dependency** | None (wiring fix only) |

### Criterion K9: Provenance Integrity

| Property | Value |
|----------|-------|
| **ID** | K9 |
| **Level** | L7 |
| **Description** | Every Knowledge item must have complete provenance: source Memory, source Pattern, source Evidence. |
| **Verification** | For every Knowledge in the index: (1) `provenance.sourceMemoryIds.length >= 1`. (2) `identity.memoryId` exists. (3) `identity.patternId` exists. (4) `identity.evidenceIds.length >= 1`. (5) `versions.length >= 1`. (6) `versions[0].stage === "CANDIDATE"` or `"EXTRACTED"`. |
| **Current status** | ✅ PASSES (when creation succeeds) — Provenance is fully populated by KnowledgeFactory and KnowledgePipeline. |

### Criterion K10: Version History

| Property | Value |
|----------|-------|
| **ID** | K10 |
| **Level** | L7 |
| **Description** | Every Knowledge stage transition must create a new version entry. |
| **Verification** | (1) Create Knowledge → 1 version (CANDIDATE). (2) After receiveInput/validate → 2 versions (CANDIDATE, EXTRACTED/VALIDATED). (3) After generalize → 3+ versions. (4) `KnowledgeVersioning.computeStability()` returns consistent values. (5) `KnowledgeVersioning.diff()` returns correct conceptCountChange. |
| **Current status** | ⚠️ PARTIAL — Version creation works. Diff returns hardcoded conceptCountChange: 0 (BF-028). |
| **BF dependency** | BF-028 |

---

## 4. Certification Test Matrix

| Test | Criteria | Current Status | BF Required |
|------|----------|----------------|-------------|
| `KNOWLEDGE_CERT_001` — Deterministic creation | K1 | ❌ FAIL | BF-020 |
| `KNOWLEDGE_CERT_002` — Deterministic scoring | K2 | ❌ FAIL | BF-020 |
| `KNOWLEDGE_CERT_003` — Error observability | K3 | ❌ FAIL | BF-019 |
| `KNOWLEDGE_CERT_004` — Event contract | K4 | ❌ FAIL | BF-018 |
| `KNOWLEDGE_CERT_005` — Memory→Knowledge bridge | K5 | ⚠️ PARTIAL | BF-023, BF-027 |
| `KNOWLEDGE_CERT_006` — Knowledge→Attention bridge | K6 | ✅ PASS | BF-024 |
| `KNOWLEDGE_CERT_007` — Lifecycle completeness | K7 | ❌ FAIL | BF-022, BF-018 |
| `KNOWLEDGE_CERT_008` — Inference boundaries | K8 | ⚠️ PARTIAL | None (wiring) |
| `KNOWLEDGE_CERT_009` — Provenance integrity | K9 | ✅ PASS | None |
| `KNOWLEDGE_CERT_010` — Version history | K10 | ⚠️ PARTIAL | BF-028 |

**Certification Readiness Summary:**
- ✅ Pass: 2/10 (K6, K9)
- ⚠️ Partial: 3/10 (K5, K8, K10)
- ❌ Fail: 5/10 (K1, K2, K3, K4, K7)

---

## 5. Pipeline Status

```
PIPELINE STATUS

Customer                  🟨 Alive but not connected
Landing                   🟨 Alive but not connected
Orders API                🟨 Alive but not connected
Runtime                   ✅ Connected
Observation               ✅ Connected
Event Bus                 ✅ Connected
Pattern                   ✅ Connected
Memory                    ✅ Connected
Knowledge                 🟨 Alive but not connected
Attention                 🟨 Alive but not connected
Reasoning                 ⬜ Not activated
Decision                  ⬜ Not activated
Dashboard                 ⬜ Not activated

Pipeline Completion
Connected: 5 / 13
Alive: 9 / 13
Pending: 4 / 13

Validation Sprint Progress
VS0-001 ✅ Completed
VS0-002 ✅ Completed
VS0-003 ✅ Completed
VS0-004 ✅ Completed
VS0-005 ✅ Completed
VS0-006 ✅ Completed
VS0-007 ✅ Completed
VS0-008 ✅ Completed
VS0-009 🔄 In progress
VS0-010 ⬜ Not started
VS0-011 ⬜ Not started
VS0-012 ⬜ Not started
```

**Note:** Knowledge is marked 🟨 Alive but not connected because:
- The engine exists and creates Knowledge entities from Memory events
- Knowledge→Attention bridge is verified (VS1-002 test passes)
- Memory→Knowledge bridge is partial (only CONSOLIDATED events work, businessId broken)
- 42% of events never emitted — contract not operational
- No automatic lifecycle progression — engine is reactive only
- No dedicated unit tests

---

*End of VS1-009 CERTIFICATION CRITERIA*
