# Reporte de Cambios: ARCHITECTURE-001 - Separate Restaurant Experience from Restaurant OS

* **Fecha de Entrega:** 2026-06-25
* **ID de Tarea / Issue:** ARCHITECTURE-001
* **Agente Responsable:** Codex / Chief Product Architect
* **Cumplimiento de Leyes:** Se valida el cumplimiento de LAW_014.

---

## 1. Task

Separate the repository into two explicit product boundaries:

- Restaurant Experience: public website and customer-facing presentation layer
- Restaurant OS: operational platform, owner experience, and business intelligence

No functionality changes. No visual redesign. No feature work.

## 2. Product Reasoning Layer

The full reasoning layer was produced before implementation and guided the change.

### 2.1 Product Impact
- This task exists to stop Restaurant Experience and Restaurant OS from evolving as one mixed product.
- It solves ownership ambiguity and reduces future cross-product drift.
- It creates business value by making the platform easier to maintain, scale, and reason about.
- It is justified by Product Principles: One Primary Decision, Meaning Before Metrics, Business Before Software.
- It is supported by the Constitution: Articles 18, 20, and 8.

### 2.2 Experience Impact
- Architecture
- Business
- Knowledge

### 2.3 Cognitive Impact
- Yes, it reduces cognitive load.
- Yes, it increases clarity.
- Yes, it improves confidence.
- Yes, it respects Meaning Before Metrics.
- Yes, it preserves One Primary Decision.
- Yes, it reduces anxiety for future maintainers.

### 2.4 Design Validation
- Compatible with Restaurant OS Design Language.
- Compatible with the Material System.
- Compatible with the Visual System.
- Compatible with the Ambient Motion System.
- Compatible with the Cognitive Behavioral System.
- Compatible with the Product Principles and Constitution.
- No conflict identified because runtime behavior was not changed.

### 2.5 Future Compatibility
- Compatible with iPhone, Android, Apple Watch, widgets, future verticals, multi-tenant SaaS, and internationalization.
- The boundary supports restaurant, coffee shop, pizza, bar, and bakery implementations without changing Restaurant OS.

### 2.6 Knowledge Impact
- Creates knowledge.
- Modifies knowledge.
- Requires no new research.
- Needs future validation as product-specific code is migrated into the new boundary over time.

### 2.7 Risk Analysis
- Technical Risk: Low to medium. The main risk is boundary drift if future tasks ignore the new module homes.
- UX Risk: Low. Routes and user-facing behavior were preserved.
- Business Risk: Medium. If the boundary is not maintained, future work can still mix products.
- Performance Risk: Low. No runtime execution path changed.
- Maintenance Risk: Low to medium. Clearer ownership should reduce future maintenance cost.
- Long-term Risk: Low if the shared layer stays centralized.

### 2.8 Alternatives Considered
- Keep the existing mixed structure and only update docs. Rejected because it would not create an explicit boundary.
- Physically migrate all code into new folders immediately. Rejected because it is more invasive than required and adds unnecessary risk.
- Chosen: create boundary scaffolding, update governance docs, and preserve route compatibility. This is the smallest safe change.

### 2.9 Confidence Level
- Medium.
- Reasoning: the architectural direction is clear, but the repository is already large and partially mixed. Boundary scaffolding is safe, but a full migration would need future incremental work.

### 2.10 Technical Debt
- Maintains some runtime layout debt.
- Reduces architectural debt by making product ownership explicit.

### 2.11 Product Evolution
- This moves Restaurant OS closer to becoming a Business Copilot by protecting the platform layer from marketing-site concerns.
- It prepares the repository for multi-business and multi-vertical expansion.

### 2.12 Executive Summary
- The repository now has explicit product boundaries.
- Restaurant Experience and Restaurant OS are documented as separate modules.
- Shared assets remain centralized.
- Existing routes remain compatible.
- No user-facing behavior changed.
- Future migration can happen incrementally and safely.

---

## 3. Objective (Objetivo)

Introduce a top-level product boundary so the public website and the operational platform can evolve independently.

## 4. Files Modified (Archivos Modificados)

* `[MODIFY]` `project-docs/01-foundation/ARCHITECTURE.md`
* `[MODIFY]` `project-docs/03-memory/DECISION_LOG.md`
* `[MODIFY]` `project-docs/03-memory/PROJECT_MEMORY.md`
* `[MODIFY]` `project-docs/04-boundaries/FILE_OWNERSHIP.md`
* `[MODIFY]` `project-docs/DOCUMENT_MAP.md`
* `[NEW]` `project-docs/06-adr/records/ADR_008_product-boundary-separation.md`
* `[NEW]` `project-docs/reports/REP_20260625_ARCHITECTURE-001.md`
* `[NEW]` `apps/README.md`
* `[NEW]` `apps/restaurant-os/README.md`
* `[NEW]` `apps/restaurant-experience/README.md`
* `[NEW]` `apps/restaurant-experience/templates/tonys-burger/README.md`
* `[NEW]` `apps/restaurant-experience/future/README.md`

## 5. Changes Made

* Added a new Product Boundary Layer section to `project-docs/01-foundation/ARCHITECTURE.md`.
* Documented Restaurant Experience and Restaurant OS as separate product modules.
* Declared the shared layer as centralized infrastructure rather than product-specific code.
* Added `apps/` boundary scaffolding with module-level README files.
* Added a template slot for Tony's Burger and a future-slot README for additional verticals.
* Recorded the architecture change in the decision log, project memory, and ADR record.
* Updated file ownership to reflect the new boundary and compatibility routing model.

## 6. Validation Performed (Validaciones)

* **Build:** `npm run build`
  * Result: Failed.
  * Failure source: existing TypeScript error in `src/features/dashboard/components/HealthHero.tsx` (`number[]` to `Easing`) during Next.js build type-checking.
* **Lint:** `npm run lint`
  * Result: Failed.
  * Failure source: existing repository lint issues in untouched files, including `src/design-system/hooks/index.ts`, `src/experience/provider/ExperienceProvider.tsx`, `src/localization/provider/LocalizationProvider.tsx`, and several dashboard components.
* **TypeScript:** `npx tsc --noEmit`
  * Result: Failed.
  * Failure source: the same easing type mismatch in `HealthHero.tsx` and `HealthSummary.tsx`.

## 7. Risks (Riesgos)

* Boundary scaffolding can drift if future tasks ignore the new product directories.
* The current codebase still contains unrelated lint and type errors outside this task scope.
* Route compatibility is preserved, but a future migration task will be needed to physically move runtime code into the new boundary.

## 8. Next Steps (Próximos Pasos)

1. Keep new work inside the correct product boundary.
2. Migrate runtime modules incrementally only when a task explicitly requests it.
3. Address the unrelated TypeScript and lint issues in a separate scoped task if build hygiene is required.
