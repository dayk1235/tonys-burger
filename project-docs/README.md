# DOCUMENTACIÓN DEL PROYECTO — Tony Burgers

Este es el centro de navegación de toda la documentación de gobernanza y desarrollo del proyecto **Tony Burgers**.

---

## 📂 Estructura de Carpetas

```
project-docs/
├── 00-governance/        # Leyes, reglas y políticas de control
├── 01-foundation/        # Visión, arquitectura y roadmap
├── 02-development/       # Estándares, flujos de trabajo y calidad
├── 03-memory/            # Memoria del proyecto y registro de decisiones
├── 04-boundaries/        # Límites de alcance y propiedad de archivos
├── 05-reporting/         # Plantillas de reportes
├── 06-adr/               # Lineamientos ADR y registros
│   └── records/          # Archivos ADR individuales
├── 07-audits/            # Auditorías de gobernanza
├── BOOT_SEQUENCE.md      # Secuencia de arranque obligatoria para agentes
├── DOCUMENT_MAP.md       # Índice completo de todos los documentos
└── README.md             # Este archivo — hub de navegación
```

---

## 📑 Propósito de Cada Carpeta

| Carpeta | Propósito | Documentos Clave |
| :--- | :--- | :--- |
| `00-governance/` | Leyes constitucionales, reglas de IA, control de dependencias | AI_RULES, REPOSITORY_GOVERNANCE, FOLDER_LAWS, DEPENDENCY_POLICY, ESCALATION_PROTOCOL |
| `01-foundation/` | Base del proyecto: visión, arquitectura, roadmap | VISION, ARCHITECTURE, ROADMAP, PHASE_DEFINITIONS, DELIVERY_STRATEGY |
| `02-development/` | Estándares de código, flujos de trabajo, calidad | CODING_STANDARDS, NAMING_CONVENTIONS, TASK_WORKFLOW, DEVELOPMENT_CHECKLIST, DEFINITION_OF_DONE |
| `03-memory/` | Memoria persistente y trazabilidad de decisiones | PROJECT_MEMORY, DECISION_LOG |
| `04-boundaries/` | Límites del proyecto y propiedad de archivos | SCOPE_BOUNDARIES, FILE_OWNERSHIP |
| `05-reporting/` | Plantillas para reportes de cambios | CHANGE_REPORT_TEMPLATE |
| `06-adr/` | Sistema de Architectural Decision Records | ADR_GUIDELINES, ADR_TEMPLATE, records/ |
| `07-audits/` | Auditorías del sistema de gobernanza | GOVERNANCE_AUDITS, ROADMAP_AUDITS |

---

## 📖 Orden de Lectura Recomendado

Para agentes nuevos, se recomienda leer en este orden:

1. **Foundation** — `01-foundation/VISION.md` → `01-foundation/ARCHITECTURE.md` → `01-foundation/ROADMAP.md`
2. **Governance** — `00-governance/AI_RULES.md` → `00-governance/REPOSITORY_GOVERNANCE.md` → `00-governance/FOLDER_LAWS.md`
3. **Memory** — `03-memory/PROJECT_MEMORY.md`
4. **Active Work** — `01-foundation/PHASE_DEFINITIONS.md` → `04-boundaries/SCOPE_BOUNDARIES.md`

La secuencia de arranque completa está definida en `BOOT_SEQUENCE.md`.

---

## 🔧 Mantenimiento

### Agregar un Nuevo Documento
1. Identificar la carpeta temática correcta.
2. Crear el archivo con la convención de nomenclatura adecuada.
3. Actualizar `DOCUMENT_MAP.md` con la nueva entrada.
4. Si es un documento de arranque obligatorio, actualizar `BOOT_SEQUENCE.md`.

### Mover o Renombrar un Documento
Cualquier reorganización requiere:
1. Aprobación bajo LAW_031 (DOCUMENTATION STRUCTURE IS ARCHITECTURE).
2. Actualización de todas las referencias internas.
3. Actualización de `DOCUMENT_MAP.md` y `README.md`.
4. Verificación de enlaces rotos.

---

## 🏛️ Leyes Aplicables

| Ley | Descripción |
| :--- | :--- |
| LAW_031 | **DOCUMENTATION STRUCTURE IS ARCHITECTURE** — La organización de la documentación es parte de la arquitectura del repositorio. |
| LAW_032 | **CENTRALIZED DISCOVERY** — Todos los documentos de gobernanza deben ser descubribles a través de README.md y DOCUMENT_MAP.md. |
