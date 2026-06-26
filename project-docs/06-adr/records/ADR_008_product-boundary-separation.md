# ADR-008 — Product Boundary Separation

* **Fecha:** 2026-06-25
* **Responsable:** Buffy (Chief Product Architect)
* **Estado:** Aprobado

## A) Contexto y Motivo

The repository now contains two different products with different business responsibilities:

- Restaurant Experience: public website, branding, menu, reservations, and customer-facing interactions.
- Restaurant OS: dashboard, owner experience, decision engine, intelligence, and platform services.

Keeping both products in a single undifferentiated surface makes ownership unclear and increases the risk of cross-product drift. A top-level boundary is required so future work can be placed in the correct product module without ambiguity.

## B) Decisión

Introduce a top-level `apps/` boundary with separate homes for each product:

- `apps/restaurant-experience/`
- `apps/restaurant-os/`

The shared layer remains centralized in the existing reusable modules:

- `src/design-system/`
- `src/components/ui/`
- `src/constants/`
- `src/lib/`
- `src/localization/`

The running project keeps the current routes in `src/app/` as a compatibility layer so no public URL changes are required.

## C) Impacto

- **Arquitectura:** Product boundaries are explicit and auditable.
- **Mantenibilidad:** Future work has a single obvious home.
- **Routing:** Existing routes remain stable.
- **Shared Layer:** No duplicated shared primitives or utilities.
- **Future Scalability:** New restaurant verticals can be added without modifying Restaurant OS behavior.
