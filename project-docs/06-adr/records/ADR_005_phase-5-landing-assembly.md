# ADR-005 — Phase 5 Landing Page Assembly Activation

---

## Metadatos

*   **Número ADR:** ADR-005
*   **Estado:** Aprobado
*   **Fecha de Creación:** 2026-06-13
*   **Fecha de Aprobación:** 2026-06-13
*   **Responsable / Agente:** Senior Frontend Architect (AI workflow)
*   **Supersede a:** N/A

---

## 1. Contexto

The project has completed foundational setup (Phase 0-2), the Design System and UI Kit (Phase 3), and the initial feature component scaffolding (Phase 4 prep). The current repository contains:

- Complete design tokens (CSS + TypeScript) in `globals.css` and `constants/tokens.ts`
- 40+ UI Kit atomic components in `components/ui/` (Button, BurgerCard, GalleryCard, ReviewCard, LocationCard, InfoCard, CTACard, SectionContainer, SectionHeader, etc.)
- Layout shell components (Navbar, Footer)
- HeroSection placeholder
- Content placeholder system with `PLACEHOLDER_` prefix
- Next.js 16 App Router with proper routing structure

The UI Kit is sufficiently mature to assemble the landing page. Core business feature components (menu filtering, cart, booking, admin) are not required for the landing page skeleton.

---

## 2. Declaración del Problema

ROADMAP.md currently marks Phase 3 (Design System) as the active phase. However, the Design System deliverables are complete, and the next body of work is the Landing Page Assembly (Phase 5). Core business logic components (Phase 4) are not a dependency for this page-level composition task, as the landing page uses only UI Kit presentational components with placeholder content.

The governance documents must be updated to reflect:

- Phase 3 (Design System) → Completed
- Phase 4 (Core Components) → Deferred (not a dependency for landing page skeleton)
- Phase 5 (Page Assembly) → Active

---

## 3. Decisión

**Decisión tomada:**
Advance the project to Phase 5 (Page Assembly) for the Landing Page Skeleton task (TASK-003A). Core business feature components (Phase 4) remain deferred and will be implemented as a separate future task after the landing page is structurally complete.

**Reglas de implementación derivadas:**
- Phase 3 Design System is considered complete — no new UI Kit components to be created
- Phase 4 Core Components are deferred — no business logic features to be built
- Phase 5 Page Assembly is active — only page composition, section assembly, and layout integration
- All content remains `PLACEHOLDER_` prefixed — no final copy
- All images remain placeholder — no production assets
- No business integrations (WhatsApp, maps, forms, APIs) are to be implemented
- No animations (GSAP, ScrollTrigger) are to be implemented

---

## 4. Alternativas Consideradas

| Alternativa | Descripción Breve | Motivo de Descarte |
| :--- | :--- | :--- |
| Complete Phase 4 first | Build all core feature components before landing page | Landing page does not require business features; adds unnecessary delay |
| Skip governance update | Proceed without updating ROADMAP | Violates LAW_025 (FOLLOW THE ROADMAP) and LAW_024 (DOCUMENT ACKNOWLEDGEMENT) |
| Treat as Phase 3 extension | Argue landing sections are "Design System examples" | Sections are page-level compositions, not atomic UI components; would misrepresent architecture |

---

## 5. Consecuencias

**Positivas:**
- Landing page structure can be delivered immediately
- UI Kit investment is immediately utilized
- Visual foundation exists for future feature integration
- Business stakeholders can review page architecture early

**Negativas / Compromisos (Trade-offs):**
- Phase 4 core components remain unimplemented — future integration work will be needed
- Some sections (Menu Preview, Featured Burgers) will show placeholder data only
- Phase 6 (Responsive Design) will require a follow-up pass

---

## 6. Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
| :--- | :--- | :--- | :--- |
| Phase 4 features needed earlier than expected | Baja | Medio | Landing page is structural; feature integration is independent |
| Placeholder content creates visual gaps | Media | Bajo | Placeholders are clearly marked; final content pass is a separate task |
| ROADMAP inconsistency confuses future agents | Baja | Medio | ADR-005 explicitly documents the decision; DECISION_LOG updated |

---

## 7. Estrategia de Migración

**Pasos de migración:**
1. Create ADR-005 (this document) documenting the phase transition decision
2. Update ROADMAP.md: mark Phase 3 complete, add Phase 4 as deferred, mark Phase 5 active
3. Update PROJECT_MEMORY.md with the phase transition record
4. Update DECISION_LOG.md with ADR-005 entry
5. Run phase validation to confirm governance consistency
6. Proceed with TASK-003A implementation

---

## 8. Aprobación

*   **Aprobado por:** User (Project Owner)
*   **Fecha de Aprobación:** 2026-06-13
*   **Comentarios del Supervisor:** Proceed with Option 2 — update ROADMAP and related documents first, then implement.
