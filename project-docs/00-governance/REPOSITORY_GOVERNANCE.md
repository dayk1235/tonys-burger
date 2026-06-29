# 12 - CONSTITUCIÓN DE GOBERNANZA DEL REPOSITORIO

Este documento es la constitución suprema del proyecto **Tony Burgers**. Define las leyes fundamentales del repositorio que garantizan el orden, la trazabilidad absoluta de las decisiones y la predictibilidad del código. Ningún agente, proceso de compilación o secuencia automatizada puede ignorar estas directrices.

---

## 1. Leyes Constitucionales del Repositorio (Obligatorio)

### LAW_001 - DOCUMENTATION FIRST
Ningún agente puede modificar código sin haber leído:
- VISION
- ARCHITECTURE
- AI_RULES
- PROJECT_MEMORY

### LAW_002 - ONE SOURCE OF TRUTH
Cada categoría de información debe tener una única ubicación oficial.
Ejemplos:
*   Arquitectura → [02_ARCHITECTURE.md](../01-foundation/ARCHITECTURE.md)
*   Reglas IA → [04_AI_RULES.md](../00-governance/AI_RULES.md)
*   Memoria del proyecto → [07_PROJECT_MEMORY.md](../03-memory/PROJECT_MEMORY.md)
*   Dependencias → [DEPENDENCY_POLICY.md](../00-governance/DEPENDENCY_POLICY.md)
No se permite duplicación de información.

### LAW_010 - NO ROOT POLLUTION
Prohibido agregar archivos en la raíz.
La raíz debe mantenerse limpia.
Sólo se permiten archivos oficialmente aprobados.

### LAW_015 - ARCHITECTURE OVER CONVENIENCE
La conveniencia temporal nunca justifica romper la arquitectura.

### LAW_016 - NO SILENT CHANGES
Ningún cambio importante puede ocurrir sin documentación.

### LAW_020 - REPOSITORY CLEANLINESS
El repositorio debe permanecer:
- limpio
- navegable
- consistente
- predecible
La limpieza del repositorio es una responsabilidad continua.

### LAW_021 - ARCHITECTURAL DECISIONS REQUIRE ADR
Any significant architectural decision must be documented using an ADR.
Examples:
* Folder structure changes
* Framework changes
* Routing strategy changes
* State management changes
* Build system changes

### LAW_022 - STOP WHEN UNCERTAIN
Agents must never guess.
Uncertainty requires escalation.

### LAW_023 - PLAN BEFORE CODE
Before implementation the agent must provide:
* Analysis
* Plan
* Affected files
* Risks
* Validation strategy
Implementation cannot begin before planning is completed.

### LAW_024 - DOCUMENT ACKNOWLEDGEMENT
Before implementation the agent must explicitly confirm:
Documents read
Relevant restrictions
Architectural constraints
Required output format:
```text
Boot Sequence Completed

Documents Read:
✓ VISION
✓ ARCHITECTURE
✓ AI_RULES
✓ PROJECT_MEMORY

Relevant Constraints:
…
```
Only after acknowledgement may implementation begin.

---

## 2. Aplicación Práctica e Impacto en el Desarrollo

### A) Planificación y Reconocimiento Obligatorio (LAW_023 / LAW_024)
*   **Permitido:** Escribir el plan de implementación, declarar por consola la secuencia de arranque completada con el checklist y las restricciones detectadas, y luego esperar aprobación.
*   **Prohibido:** Modificar cualquier archivo de código o de configuración sin haber completado el plan de implementación y la declaración formal por consola.

### B) Decisiones de Arquitectura Estructuradas (LAW_021)
*   **Permitido:** Proponer cambios de enrutamiento o en la estructura de base de datos mock escribiendo un ADR bajo `project-docs/adr/` utilizando la plantilla.
*   **Prohibido:** Crear carpetas nuevas o cambiar de librerías mediante una refactorización silenciosa o una simple mención en un commit.

### C) Manejo de Incertidumbre y Escalamiento (LAW_022)
*   **Permitido:** Si una instrucción está redactada de forma ambigua ("mejorar el componente"), detener el trabajo y preguntar al usuario humano, detallando hipótesis.
*   **Prohibido:** Suponer el comportamiento deseado por el usuario e intentar implementarlo asumiendo que "es lo que el usuario quería".

---

## 3. Leyes de Gobernanza del Roadmap (Obligatorio)

### LAW_025 — FOLLOW THE ROADMAP
Los agentes deben seguir la progresión del roadmap.
No puede realizarse trabajo fuera de la fase activa.
Las fases futuras son solo informativas.
Solo la fase activa es ejecutable.

### LAW_026 — NO PHASE BLEEDING
Las responsabilidades deben mantenerse dentro de la fase activa.

**Ejemplo:**
Si la fase activa es Core Components:

✅ Permitido:
- Creación de componentes
- Refinamiento de componentes

❌ Prohibido:
- SEO
- Analytics
- Deployment
- Performance tuning

No debe realizarse trabajo de fases futuras.

### LAW_027 — PHASE GATE ENFORCEMENT
Una fase no puede comenzar hasta que:
- La fase anterior esté completada.
- Los criterios de salida estén satisfechos.
- Los requisitos de validación pasen.
- La documentación requerida exista.

### LAW_028 — ROADMAP IS AUTHORITATIVE
El roadmap es la fuente oficial de progresión del proyecto.

Si una tarea entra en conflicto con el roadmap:
El roadmap tiene prioridad.

### LAW_029 — CURRENT PHASE DECLARATION
Antes de la implementación, el agente debe declarar:

```text
Current Phase:
[nombre de la fase]

Reason Task Is Allowed:
[explicación]

Affected Deliverables:
[lista]
```

La implementación no puede comenzar hasta que esta declaración se realice.

### LAW_030 — PHASE COMPLETION REPORT
Cuando una fase finaliza:

Generar:
- Phase Summary
- Completed Deliverables
- Outstanding Risks
- Lessons Learned
- Approval Status
- Recommended Next Phase

Almacenar el reporte en la documentación del proyecto.


### LAW_031 — DOCUMENTATION STRUCTURE IS ARCHITECTURE
La organización de la documentación es parte de la arquitectura del repositorio.

Los agentes no pueden reorganizar la documentación sin aprobación.

### LAW_032 — CENTRALIZED DISCOVERY
Todos los documentos de gobernanza deben ser descubribles a través de:
- `README.md`
- `DOCUMENT_MAP.md`

Ningún documento puede existir fuera de la estructura documentada.

### LAW_067 — CANONICAL RUNTIME LANGUAGE

Todo intercambio entre motores cognitivos deberá realizarse mediante el Canonical Runtime Event (`entity`, `operation`, `timestamp`, `version`). Los nombres específicos de dominio (`observation`, `pattern`, `memory`, `knowledge`, `attention`, `reasoning`, `decision`, etc.) pertenecen a la entidad, nunca al protocolo. Ver `LAW-067_CANONICAL_RUNTIME_LANGUAGE.md`.

### LAW_068 — ARCHITECTURE DISCOVERY BEFORE CODE EXPLORATION

No implementation may begin until architectural context is discovered. Every Validation Sprint, Bug Fix, Integration Sprint, or Architectural Refactor must begin with a Discovery Phase. Graph-first discovery is preferred. The Discovery Phase never modifies source code — its sole purpose is understanding. Ver `LAW-068_ARCHITECTURE_DISCOVERY.md`.

---

### LAW_043 — ALWAYS GREEN REPOSITORY

The main branch must always compile successfully.

TypeScript must pass (`npx tsc --noEmit` — zero errors).

Build must pass (`npm run build` — zero errors).

Lint should pass unless explicitly documented as legacy debt.

No feature may be merged if it leaves the repository in a broken state.

If a task introduces build failures, that task is considered incomplete.

**Scope:** This law applies to all branches that target `main`. CI/CD pipelines must enforce this law at the gate level.

**Exceptions:** Legacy debt may be documented in a `TODO.md` or `LEGACY_DEBT.md` file at the project root, explicitly describing the nature, scope, and remediation plan for each lint violation. No exception exists for TypeScript or build errors.

---

## 4. Protocolo de Limpieza del Repositorio (LAW_020)

Al finalizar cada jornada de desarrollo o antes de realizar un commit, el agente de IA ejecutará la siguiente validación estructural:

1.  **Revisión de la Raíz:** Validar que no existan archivos nuevos no autorizados en la raíz (ej. reportes XML flotantes, archivos de caché).
2.  **Limpieza de temporales:** Eliminar archivos residuales de testeo, copias de seguridad de editores de texto y carpetas no aprobadas.
3.  **Verificación de Git status:** Comprobar que todos los archivos listados por Git estén en las ubicaciones obvias correspondientes bajo la arquitectura definida.
