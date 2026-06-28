# Canonical Order Event — Freeze Declaration

---

## Contract Identity

| Property | Value |
|---|---|
| **Name** | Canonical Order Event |
| **Version** | **1.0.0** |
| **Status** | **🧊 FROZEN** |
| **Freeze Date** | 2026-06-27 |
| **Specification** | `project-docs/intelligence/CANONICAL_ORDER_EVENT_SPEC.md` |
| **Architecture Review** | ADR-001 — READY FOR V2 (Score: 91/100) |
| **Governed By** | LAW_064 — DESIGN BEFORE IMPLEMENTATION |
| **Domain** | Orders |

---

## Freeze Statement

The Canonical Order Event v1.0.0 has completed the mandatory cycle:

```
Design → Specification → ADR (Approved) → Freeze → Ready for Implementation
```

This contract is officially **FROZEN**. No changes may be made without following the versioning policy defined in LAW_064.

---

## Versioning Policy

| Change Type | Version Bump | Requires ADR? | Requires New Freeze? |
|---|---|---|---|
| Documentation clarification | PATCH (1.0.0 → 1.0.1) | ❌ No | ❌ No |
| New optional fields | MINOR (1.0.0 → 1.1.0) | ✅ Yes | ✅ Yes |
| Breaking structural changes | MAJOR (1.0.0 → 2.0.0) | ✅ Yes | ✅ Yes |

---

## Compatibility Commitment

All future Adapters, Engines, and components **must** produce and consume exactly this contract.

| Source | Produces | Consumes | Status |
|---|---|---|---|
| Uber Eats Adapter | Canonical Order Event v1.0.0 | — | ⬜ Pending (IS1-002) |
| Rappi Adapter | Canonical Order Event v1.0.0 | — | ⬜ Pending |
| WhatsApp Adapter | Canonical Order Event v1.0.0 | — | ⬜ Pending |
| POS Adapter | Canonical Order Event v1.0.0 | — | ⬜ Pending |
| CSV Import | Canonical Order Event v1.0.0 | — | ⬜ Pending |
| Direct API | Canonical Order Event v1.0.0 | — | ⬜ Pending |
| ObservationEngine | — | Canonical Order Event v1.0.0 | ⬜ Pending (IS1-002) |

---

## Baseline

The Canonical Order Event v1.0.0 is declared the **official Canonical Data Contract** of Restaurant OS.

Every integration sprint (IS1 through IS5) depends on this contract. Every adapter will be validated against it. Every cognitive engine will derive its order-related input contract from it.

---

## References

| Document | Link |
|---|---|
| Specification | `project-docs/intelligence/CANONICAL_ORDER_EVENT_SPEC.md` |
| Architecture Review (ADR-001) | See conversation history — AUD-MASTER-001 / ADR-001 |
| Intelligence Roadmap | `project-docs/intelligence/RESTAURANT_OS_INTELLIGENCE_ROADMAP.md` |
| Governance Law | LAW_064 — DESIGN BEFORE IMPLEMENTATION |
| Data Sources | `project-docs/intelligence/DATA_SOURCES.md` |
| Engine Data Matrix | `project-docs/intelligence/ENGINE_DATA_MATRIX.md` |
