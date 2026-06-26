# BOOT SEQUENCE — Secuencia de Arranque Obligatoria

Este documento es la fuente única de verdad para el procedimiento de arranque que todo agente debe ejecutar antes de modificar cualquier archivo en el repositorio **Tony Burgers**.

**IMPORTANT:** The canonical execution protocol (14-step workflow, all laws, Product Reasoning Layer, report format) is defined in `project-docs/11-protocol/EXECUTION_PROTOCOL.md`. This document covers only the boot sequence itself.

**Ley Aplicable:** LAW_001 — DOCUMENTATION FIRST

---

## Secuencia de Arranque

Ejecutar en orden. No saltar ningún paso.

### STEP 1 — Foundation: Vision
**Leer:** `project-docs/01-foundation/VISION.md`
**Propósito:** Comprender el propósito del proyecto.

### STEP 2 — Foundation: Architecture
**Leer:** `project-docs/01-foundation/ARCHITECTURE.md`
**Propósito:** Entender la estructura del repositorio y los límites arquitectónicos.

### STEP 3 — Foundation: Roadmap
**Leer:** `project-docs/01-foundation/ROADMAP.md`
**Propósito:** Conocer la progresión oficial del proyecto, la fase activa y las dependencias entre fases.

### STEP 4 — Governance: AI Rules
**Leer:** `project-docs/00-governance/AI_RULES.md`
**Propósito:** Conocer las restricciones de comportamiento del agente.

### STEP 5 — Governance: Repository Governance
**Leer:** `project-docs/00-governance/REPOSITORY_GOVERNANCE.md`
**Propósito:** Comprender las políticas de gobernanza del repositorio.

### STEP 6 — Governance: Folder Laws
**Leer:** `project-docs/00-governance/FOLDER_LAWS.md`
**Propósito:** Conocer los requisitos de organización del repositorio.

### STEP 7 — Memory: Project Memory
**Leer:** `project-docs/03-memory/PROJECT_MEMORY.md`
**Propósito:** Comprender las decisiones históricas y las convenciones aprobadas.

### STEP 8 — Active Work: Phase Definitions
**Leer:** `project-docs/01-foundation/PHASE_DEFINITIONS.md`
**Propósito:** Conocer qué trabajo está permitido y prohibido en la fase activa.

### STEP 9 — Active Work: Scope Boundaries
**Leer:** `project-docs/04-boundaries/SCOPE_BOUNDARIES.md`
**Propósito:** Entender los límites de alcance y las fronteras del proyecto.

---

### STEP 10 — Product Reasoning Layer
**Ejecutar:** El agente debe producir el análisis completo del PRODUCT REASONING LAYER.
**Definición:** `project-docs/11-protocol/EXECUTION_PROTOCOL.md` (Part IV — 12 sections)
**Propósito:** Antes de cualquier acción, el agente debe razonar como Chief Product Architect — evaluando impacto de producto, experiencia, cognición, diseño, compatibilidad futura, conocimiento, riesgo, alternativas, confianza, deuda técnica y evolución del producto.

**Documentos de referencia obligatorios para este paso:**
- `project-docs/00-vision/THE_CONSTITUTION_OF_RESTAURANT_OS.md`
- `project-docs/00-vision/PRODUCT_PRINCIPLES.md`
- `project-docs/00-vision/RESTAURANT_OS_DESIGN_LANGUAGE.md`
- `project-docs/00-vision/RESTAURANT_OS_VISUAL_SYSTEM.md`
- `project-docs/00-vision/AMBIENT_MOTION_SYSTEM.md`
- `project-docs/00-vision/RESTAURANT_OS_MATERIAL_SYSTEM.md`
- `project-docs/00-vision/RESTAURANT_OS_COGNITIVE_BEHAVIORAL_SYSTEM.md`

---

## Declaración Obligatoria (LAW_024)

Antes de comenzar la implementación, el agente debe emitir la siguiente declaración:

```text
Boot Sequence Completed

Documents Read:
✓ FOUNDATION: VISION
✓ FOUNDATION: ARCHITECTURE
✓ FOUNDATION: ROADMAP
✓ GOVERNANCE: AI_RULES
✓ GOVERNANCE: REPOSITORY_GOVERNANCE
✓ GOVERNANCE: FOLDER_LAWS
✓ MEMORY: PROJECT_MEMORY
✓ ACTIVE WORK: PHASE_DEFINITIONS
✓ ACTIVE WORK: SCOPE_BOUNDARIES
✓ STEP 10: PRODUCT REASONING LAYER

Relevant Constraints:
- [Detallar restricciones y reglas críticas que impacten la tarea]
```

Solo después de esta declaración puede comenzar la implementación.

---

## Declaración de Fase Activa (LAW_029)

Adicionalmente, el agente debe declarar la fase activa antes de implementar:

```text
Current Phase:
[nombre de la fase]

Reason Task Is Allowed:
[explicación de por qué el trabajo pertenece a la fase activa]

Affected Deliverables:
[lista de entregables afectados]
```

---

## Checklist de Verificación

Antes de dar por concluida la secuencia de arranque, validar que:

- [ ] He leído VISION, ARCHITECTURE, ROADMAP, AI_RULES, REPOSITORY_GOVERNANCE, FOLDER_LAWS, PROJECT_MEMORY, PHASE_DEFINITIONS y SCOPE_BOUNDARIES.
- [ ] He producido el Product Reasoning Layer (12 secciones).
- [ ] He emitido la declaración formal (LAW_024).
- [ ] He declarado la fase activa (LAW_029).
- [ ] Conozco las restricciones operativas y las dependencias del proyecto.
- [ ] He estructurado el plan de trabajo antes de editar archivos.

---

## Referencias

| Documento | Propósito |
| :--- | :--- |
| `AGENTS.md` | Punto de entrada del agente con enlace a este documento |
| `README.md` | Hub de navegación de documentación |
| `DOCUMENT_MAP.md` | Índice completo de documentos |
