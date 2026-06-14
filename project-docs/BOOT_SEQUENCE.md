# BOOT SEQUENCE — Secuencia de Arranque Obligatoria

Este documento es la fuente única de verdad para el procedimiento de arranque que todo agente debe ejecutar antes de modificar cualquier archivo en el repositorio **Tony Burgers**.

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
