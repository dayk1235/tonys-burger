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
├── 10-reference/         # Referencia de negocio y datos demo
├── 11-protocol/          # Protocolos de ejecución canónicos
├── 12-domain/            # Modelo de dominio canónico (7 documentos)
├── 13-cognition/         # Arquitectura cognitiva permanente (1 documento)
├── 14-observation/       # Sistema de observación canónico (1 documento)
├── 15-pattern/           # Sistema de patrones canónico (1 documento)
├── 16-evidence/          # Sistema de evidencia canónico (1 documento)
├── 17-memory-system/     # Sistema de memoria canónico (1 documento)
├── 18-knowledge-system/  # Sistema de conocimiento canónico (1 documento)
├── 19-attention-system/  # Sistema de atención canónico (1 documento)
├── 20-reasoning-engine/  # Motor de razonamiento canónico (1 documento)
├── 21-human-experience-constitution/  # Constitución de experiencia humana (1 documento)
├── 22-cognitive-engine-contract/  # Contrato constitucional entre motores cognitivos (1 documento)
├── 22-cognitive-atlas/            # Capa maestra de navegación (1 documento)
├── 23-runtime-architecture/       # Arquitectura de ejecución del Runtime (1 documento)
├── backlog/              # Futuras oportunidades (LAW 27)
├── technical-debt/       # Registro de deuda técnica (LAW 29)
├── BOOT_SEQUENCE.md      # Secuencia de arranque obligatoria para agentes
├── DOCUMENT_MAP.md       # Índice completo de todos los documentos
└── README.md             # Este archivo — hub de navegación
```

---

## 📑 Propósito de Cada Carpeta

| Carpeta | Propósito | Documentos Clave |
| :--- | :--- | :--- |
| `00-governance/` | Leyes constitucionales, reglas de IA, control de dependencias | AI_RULES, REPOSITORY_GOVERNANCE, FOLDER_LAWS, DEPENDENCY_POLICY, ESCALATION_PROTOCOL, FOUNDATION_FREEZE_POLICY |
| `01-foundation/` | Base del proyecto: visión, arquitectura, roadmap | VISION, ARCHITECTURE, ROADMAP, PHASE_DEFINITIONS, DELIVERY_STRATEGY |
| `02-development/` | Estándares de código, flujos de trabajo, calidad | CODING_STANDARDS, NAMING_CONVENTIONS, TASK_WORKFLOW, DEVELOPMENT_CHECKLIST, DEFINITION_OF_DONE |
| `03-memory/` | Memoria persistente y trazabilidad de decisiones | PROJECT_MEMORY, DECISION_LOG |
| `04-boundaries/` | Límites del proyecto y propiedad de archivos | SCOPE_BOUNDARIES, FILE_OWNERSHIP |
| `05-reporting/` | Plantillas para reportes de cambios | CHANGE_REPORT_TEMPLATE |
| `06-adr/` | Sistema de Architectural Decision Records | ADR_GUIDELINES, ADR_TEMPLATE, records/ |
| `07-audits/` | Auditorías del sistema de gobernanza | GOVERNANCE_AUDITS, ROADMAP_AUDITS |
| `10-reference/` | Datos de referencia y escenarios demo | BUSINESS_BIBLE |
| `11-protocol/` | Protocolos de ejecución canónicos | EXECUTION_PROTOCOL |
| `12-domain/` | Modelo de dominio canónico — vocabulario, bounded contexts, aggregates, events, relationships | DOMAIN_MODEL, UBIQUITOUS_LANGUAGE, DOMAIN_MAP, AGGREGATES, VALUE_OBJECTS, DOMAIN_EVENTS, RELATIONSHIP_MAP |
| `13-cognition/` | Arquitectura cognitiva permanente — filosofía, loop, capas, estados, atención, memoria, razonamiento, decisión, aprendizaje, comunicación, invariantes, fallos, evolución | COGNITIVE_ARCHITECTURE |
| `14-observation/` | Sistema de observación canónico — filosofía, ciclo de vida, anatomía, clasificación, calidad, relaciones, invariantes, modos de fallo, evolución | OBSERVATION_SYSTEM |
| `15-pattern/` | Sistema de patrones canónico — filosofía, ciclo de vida, anatomía, clasificación, calidad, relaciones, invariantes, modos de fallo, evolución | PATTERN_SYSTEM |
| `16-evidence/` | Sistema de evidencia canónico — filosofía, ciclo de vida, anatomía, clasificación, calidad, relaciones, invariantes, modos de fallo, evolución | EVIDENCE_SYSTEM |
| `17-memory-system/` | Sistema de memoria canónico — filosofía, ciclo de vida, anatomía, clasificación, calidad, relaciones, invariantes, modos de fallo, evolución | MEMORY_SYSTEM |
| `18-knowledge-system/` | Sistema de conocimiento canónico — filosofía, ciclo de vida, anatomía, clasificación, calidad, relaciones, invariantes, modos de fallo, evolución | KNOWLEDGE_SYSTEM |
| `19-attention-system/` | Sistema de atención canónico — filosofía, ciclo de vida, anatomía, clasificación, calidad, relaciones, asignación, políticas, invariantes, modos de fallo, recuperación, ejemplos, principios constitucionales | ATTENTION_SYSTEM |
| `20-reasoning-engine/` | Motor de razonamiento canónico — filosofía (18 distinciones), ciclo de vida (12 etapas), anatomía, tipos (14), calidad (14 dimensiones), relaciones, pipeline (14), políticas (10), invariantes (210 en 25 categorías), modos de fallo (25 en 10 categorías), recuperación (5 estrategias con ciclo de vida/escalación/rollback/retry/intervención humana/aprendizaje), ejemplos (13), principios constitucionales (28), 8 apéndices (glosario, esquema de objeto, máquina de estados, diagramas de secuencia, diagramas de relaciones, lista de verificación de calidad, lista de verificación de auditoría) | REASONING_ENGINE |
| `21-human-experience-constitution/` | Constitución de experiencia humana — filosofía (13 principios), Restaurant Glass (10 principios), inteligencia invisible, tecnología calmada, silencio y comunicación, principios emocionales (12), principios conductuales (12), confianza, crecimiento de empleados, filosofía del dueño/cliente, 12 roles, 50 principios constitucionales, 285 invariantes (25 categorías), 25 modos de fallo, 8 mecanismos de recuperación, 24 ejemplos de negocio, 4 apéndices (glosario, máquina de estados emocionales, patrones de lenguaje, verificación de consistencia) | HUMAN_EXPERIENCE_CONSTITUTION |
| `22-cognitive-engine-contract/` | Contrato constitucional entre motores cognitivos — 28 partes, 55 principios constitucionales, 380 invariantes (25 categorías), 40 relaciones, 18 políticas, 15 dimensiones de calidad, 29 modos de fallo, 15 mecanismos de recuperación, 18 contratos de motor (Observation a Human Experience), 11 ejemplos de negocio, tubería cognitiva canónica con 8 ramas, reglas de comunicación permitida y prohibida, filosofía de evolución, degradación elegante, verificación de consistencia | COGNITIVE_ENGINE_CONTRACT |
| `22-cognitive-atlas/` | Capa maestra de navegación — 30 partes + 1 apéndice, 4,000+ líneas. Mapa global, gráficos de dependencia, atlas de eventos de negocio (15 tipos), atlas de experiencia humana (12 roles), navegación semántica (10 dimensiones), 48 entradas de concepto, 28 entradas de problema, 7 matrices de navegación, 9 escenarios operativos, 25 leyes del atlas, verificación de consistencia contra 22 documentos fuente. Tecnológicamente agnóstico. | COGNITIVE_ATLAS |
| `23-runtime-architecture/` | Arquitectura de ejecución del Runtime — 34 partes + apéndice. Puente entre la arquitectura constitucional y la implementación. Define cómo los 18 motores cognitivos viven, se comunican, fallan, se recuperan y evolucionan dentro del Runtime. Tecnológicamente agnóstico. Sin framework, lenguaje o implementación. | RUNTIME_ARCHITECTURE |
| `backlog/` | Oportunidades futuras descubiertas durante implementación (LAW 27) | — |
| `technical-debt/` | Registro de deuda técnica y shortcuts (LAW 29) | — |

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
