# ADR-007 — Product Direction Lockdown

---

## Metadatos

- **Número ADR:** ADR-007
- **Estado:** Aprobado
- **Fecha de Creación:** 2026-06-13
- **Fecha de Aprobación:** 2026-06-13
- **Responsable / Agente:** Product Architect (AI workflow)
- **Supersede a:** N/A

---

## 1. Contexto

The project has completed the initial website build (Phases 0-5 of the technical roadmap). The original VISION.md described a restaurant website with menu exploration, ordering, and reservations. However, no long-term product vision exists beyond the initial website deployment.

Multiple forward-looking decisions have been made ad-hoc:
- ADR-006 established Knowledge First Chatbots architecture
- The Experience Audit (TASK-004C) identified conversion, analytics, and insights as natural next steps
- TonyBot has been discussed as a future feature
- Multi-business expansion has been implied but never formalized

Without a documented product vision, future agents and stakeholders have no guard against roadmap drift — building features that don't align with the long-term direction, or building in the wrong order.

---

## 2. Declaración del Problema

The project lacks a permanent product vision document that defines:
1. What Tony's Burger is today (Phase 1)
2. What it becomes next (Phases 2-4)
3. What eventually becomes the SaaS platform (Phases 5-8)

Without this, the project risks:
- Building AI (TonyBot) before analytics (no data to power it)
- Building multi-business features before proving the single-business model
- Scope creep into POS, ERP, or inventory territory
- Inconsistent decision-making across agents and stakeholders

---

## 3. Decisión

**Decisión tomada:**
Adopt the 8-phase product vision defined in `project-docs/08-product/PRODUCT_VISION.md` as the permanent forward-looking direction for the project. The official product progression is:

```
Website → Conversion → Analytics → Insights → TonyBot → Knowledge Engine → Multi-Business → SaaS
```

**Reglas de implementación derivadas:**

1. **Phase order is inviolable.** No phase may begin until the previous phase's exit criteria are met. This prevents building AI without data, or scaling without validation.
2. **Data before automation.** Analytics (Phase 3) and Insights (Phase 4) must be complete before TonyBot (Phase 5) begins development. TonyBot requires real user behavior data to be effective.
3. **Knowledge Engine is extracted, not built from scratch.** The knowledge structures developed for TonyBot's data must be extracted into a standalone module (Phase 6) before multi-business expansion.
4. **Single-business validation required.** At least one business (Tony's Burger) must prove the model across Phases 1-6 before multi-business expansion begins.
5. **No POS/ERP/Inventory.** The SaaS platform (Phase 8) explicitly excludes payment processing, inventory management, supply chain, and accounting. These are NOT the product.
6. **All future ADRs must reference PRODUCT_VISION.md.** Every architectural decision must state which phase it belongs to and how it aligns with the product vision.

---

## 4. Alternativas Consideradas

| Alternativa | Descripción Breve | Motivo de Descarte |
| :--- | :--- | :--- |
| Build everything at once | Develop website, analytics, chatbot, and multi-business simultaneously | High risk of unfinished systems, wasted effort, and no validated learning |
| Chatbot first | Build TonyBot immediately after website | No data to inform recommendations; would need hardcoded scripts (violates ADR-006) |
| SaaS from day one | Build multi-business platform architecture from the start | Premature abstraction; single-business validation needed before generalization |
| No product vision | Continue ad-hoc task assignment without long-term direction | Guaranteed roadmap drift; inconsistent decisions across agents |
| Extend VISION.md only | Add future phases to the existing VISION.md instead of creating PRODUCT_VISION.md | VISION.md describes the restaurant website only; mixing product evolution into it creates confusion |

---

## 5. Consecuencias

**Positivas:**
- Permanent guard against roadmap drift — every future task can be validated against the vision
- Clear progression: data → insights → AI → scale
- Explicitly defines what we are NOT (POS, ERP, inventory) — prevents scope creep
- Knowledge-first architecture (ADR-006) has a natural home in Phase 5-6
- New agents can onboard to product direction immediately

**Negativas / Compromisos (Trade-offs):**
- Adds process overhead: every task must reference its phase in the product vision
- Phases 2-8 are aspirational — some may change as real data emerges from earlier phases
- The rigid phase ordering may frustrate if a later phase becomes urgent (e.g., a second business wants to join before Phase 5 is complete)

---

## 6. Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
| :--- | :--- | :--- | :--- |
| Phase gate rigidity blocks valuable work | Baja | Medio | ADR-007 allows phase exceptions via new ADR with explicit justification |
| Product vision becomes stale | Media | Bajo | Annual review of PRODUCT_VISION.md; update as market conditions change |
| Second business opportunity arrives before Phase 6 | Media | Medio | Onboard as "pilot" with manual processes until Knowledge Engine is ready |
| Analytics reveals unexpected user behavior that contradicts vision | Baja | Alto | Vision is directional, not prescriptive; adjust phases based on data |
| Developer/agent ignores vision and builds out-of-phase feature | Baja | Alto | Governance enforcement via LAW_025 (FOLLOW THE ROADMAP) and AGENTS.md boot sequence |

---

## 7. Estrategia de Migración

**Pasos de migración:**

1. Create `project-docs/08-product/PRODUCT_VISION.md` with complete 8-phase definition
2. Create ADR-007 (this document) recording the decision
3. Update `project-docs/DOCUMENT_MAP.md` to register the 08-product directory
4. Update `project-docs/03-memory/DECISION_LOG.md` with ADR-007 entry
5. Update `project-docs/03-memory/PROJECT_MEMORY.md` with product vision summary
6. Update `project-docs/01-foundation/VISION.md` to reference PRODUCT_VISION.md as the long-term vision (VISION.md retains website-specific scope)
7. All future task briefs must reference PRODUCT_VISION.md phase

---

## 8. Aprobación

- **Aprobado por:** User (Project Owner)
- **Fecha de Aprobación:** 2026-06-13
- **Comentarios del Supervisor:** Product vision approved. Phase ordering is critical — no skipping.
