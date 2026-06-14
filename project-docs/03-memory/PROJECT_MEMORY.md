# 07 - MEMORIA PERSISTENTE DEL PROYECTO

Este documento actúa como la memoria histórica y técnica del proyecto **Tony Burgers**. Registra el estado actual de las tecnologías aprobadas, convenciones operativas y Decisiones de Arquitectura (ADR). Todo agente debe consultar este documento para evitar la duplicación de código y garantizar la consistencia técnica.

---

## 1. Ley de Protección de Memoria (Obligatorio)

### LAW_019 - PROJECT_MEMORY PROTECTION
PROJECT_MEMORY.md es persistente.
Las decisiones aprobadas no pueden eliminarse.
Sólo pueden ampliarse o reemplazarse mediante registro formal.

Cualquier cambio o reemplazo de una decisión previamente documentada debe registrarse cronológicamente agregando una enmienda en el historial y referenciando el registro correspondiente en `./DECISION_LOG.md`.

---

## 2. Tecnologías y Herramientas Base Aprobadas

*Nota: La lista de dependencias oficiales y su política de actualización se gestiona y valida centralizadamente bajo [DEPENDENCY_POLICY.md](../00-governance/DEPENDENCY_POLICY.md). Queda prohibido añadir dependencias ad-hoc aquí.*

*   **Node.js:** Versión `>= 20.x`.
*   **Vite:** Versión `^5.x` (servidor de desarrollo y compilador).
*   **React:** Versión `^18.x` / `^19.x`.
*   **TypeScript:** Versión `^5.x`.
*   **Tailwind CSS:** Versión `^3.x` / `^4.x`.

---

## 3. Estado de Decisiones Arquitectónicas (ADRs)

*Nota: Para ver el historial de cambios, motivos detallados, impactos y firmas de aprobación, consulte el [./DECISION_LOG.md](file:///Users/theboy/Documents/tony-burgers/project-docs/./DECISION_LOG.md).*

### Resumen de Estado Actual:
*   **ADR-001 (Feature-Driven):** Organizar la interfaz modularmente bajo `src/components/features/[feature-name]`.
*   **ADR-002 (Mock Persistencia Local):** Persistencia simulada en frontend mediante un servicio estructurado (`src/services/localStorageService.ts`) que interactúa con `localStorage`.
*   **ADR-003 (Tailwind y Custom CSS):** Prohibido el uso de librerías visuales pesadas de terceros (Material UI, Chakra UI, bootstrap). Construcción desde cero basada en Tailwind y CSS nativo optimizado.
*   **ADR-005 (Phase 5 Landing Assembly):** Fase activa avanzada a PHASE 5. Phase 4 (Core Components) diferida. Landing Page assembly usando solo UI Kit existente.
*   **ADR-006 (Knowledge First Chatbots):** All chatbots built from structured business knowledge. Store facts, not responses. Generate responses at runtime.
*   **ADR-007 (Product Direction Lockdown):** 8-phase product vision adopted: Website → Conversion → Analytics → Insights → TonyBot → Knowledge Engine → Multi-Business → SaaS.

### Product Vision (PRODUCT_VISION.md):
The project's long-term direction is defined in `project-docs/08-product/PRODUCT_VISION.md`. This supersedes the original VISION.md for forward-looking decisions. The 8 phases are:

| Phase | Focus | Status |
| :--- | :--- | :--- |
| PHASE 1 | Premium Restaurant Website | 🟢 Built (current site) |
| PHASE 2 | Conversion Optimization | 🟢 Complete |
| PHASE 3 | Analytics Foundation | 🟢 Complete |
| PHASE 4 | Business Insights | 🟢 Complete |
| PHASE 5 | TonyBot MVP | ⚪ Future |
| PHASE 6 | Knowledge Engine | ⚪ Future |
| PHASE 7 | Multi-Business Platform | ⚪ Future |
| PHASE 8 | SaaS Platform | ⚪ Future |

**Rule:** Phase order is inviolable. Data before automation. Insights before AI. Value before scale.

### Estado Actual de Fases (Actualizado 2026-06-13):

| Fase | Estado |
| :--- | :--- |
| PHASE 0 — Discovery | 🟢 Completado |
| PHASE 1 — Project Setup | 🟢 Completado |
| PHASE 2 — Architecture | 🟢 Completado |
| PHASE 3 — Design System | 🟢 Completado |
| PHASE 4 — Core Components | ⏸️ Diferido |
| PHASE 5 — Page Assembly | 🔵 Activo |
| PHASE 6-10 | ⚪ Futuro |

---

## 4. Historial de Enmiendas y Modificaciones

De acuerdo con **LAW_019**, si una decisión de diseño es modificada, se añade aquí una referencia a su reemplazo o extensión sin borrar la decisión histórica:

| Fecha | Identificador | Tipo de Enmienda | Decisión Reemplazada / Extendida | Enlace a Registro Log |
| :--- | :--- | :--- | :--- | :--- |
| 2026-06-13 | ADR-001-EXT | Extensión de estructura | ADR-001 (Feature-Driven layout) | Ver [./DECISION_LOG.md](file:///Users/theboy/Documents/tony-burgers/project-docs/./DECISION_LOG.md) |
| 2026-06-13 | ADR-005 | Fase activa actualizada | Phase 5 Landing Assembly Activation | Ver [ADR-005](../06-adr/records/ADR_005_phase-5-landing-assembly.md) |
| 2026-06-14 | TASK-012 | Nueva carpeta + refactor | Centralización de datos del negocio en `config/business.ts` | Ver `src/config/business.ts`, `ARCHITECTURE.md` |
