# LAW-067 — CANONICAL RUNTIME LANGUAGE

**Status:** Permanent Architectural Law
**Adopted:** 2026-06-28
**Classification:** Core Repository Law — Communication Protocol
**Historical Motivation:** BF-010 (Canonical Contract Tightening), Runtime Protocol Migration

---

## 1. Statement

Todo intercambio entre motores cognitivos deberá realizarse mediante el **Canonical Runtime Event**. Ningún motor podrá depender del nombre específico de otra entidad (`observation`, `pattern`, `memory`, `knowledge`, `attention`, `reasoning`, `decision`, etc.) en el nivel del protocolo de comunicación.

Toda comunicación entre motores deberá realizarse utilizando exclusivamente los siguientes campos:

| Campo       | Tipo                     | Descripción                                                    |
|-------------|--------------------------|----------------------------------------------------------------|
| `entity`    | `Record<string, unknown>` | Contenedor de la información específica del dominio cognitivo |
| `operation` | `string`                  | Operación que el emisor solicita o notifica                    |
| `timestamp` | `string` (ISO 8601)       | Momento en que el evento fue creado                            |
| `version`   | `number`                  | Versión del contrato del evento (semver numérico)              |

---

## 2. Rationale

### 2.1 Independencia entre Motores

Cada motor cognitivo posee su propio modelo de dominio: Observation opera con `Observation`; Pattern con `Pattern`; Memory con `Memory`; Knowledge con `Knowledge`; Attention con `Attention`; Reasoning con `Reasoning`; Decision con `Decision`. Si el protocolo de comunicación expusiera estos nombres como raíces del payload, cada motor quedaría acoplado al nombre específico de los demás.

### 2.2 El Protocolo es Universal

El Runtime no puede depender del significado semántico de lo que transporta. Su responsabilidad es rutear, entregar y auditar — no interpretar. Por lo tanto, el formato del evento debe ser universal e independiente del contenido.

### 2.3 Separación entre Protocolo y Dominio

- **Protocolo**: `entity`, `operation`, `timestamp`, `version` — el lenguaje universal del Runtime.
- **Dominio**: El contenido de `entity` pertenece al motor que lo produce y al motor que lo consume. El Runtime nunca inspecciona el interior de `entity`.

---

## 3. Prohibiciones

Queda prohibido:

1. **Crear nuevos campos raíz en el protocolo de comunicación** que correspondan a nombres específicos de motores o entidades de dominio.
2. **Inspeccionar el contenido de `entity`** por parte del Runtime o de cualquier componente de infraestructura.
3. **Depender del nombre de una entidad** (`observation`, `pattern`, `memory`, `knowledge`, `attention`, `reasoning`, `decision`, etc.) como clave de ruteo, filtro o clasificación en el Event Bus o Context Bus.
4. **Introducir nuevos formatos de eventos** que no utilicen la estructura `{ entity, operation, timestamp, version }`.

---

## 4. Historical Motivation

### BF-010 — Canonical Contract Tightening

Durante la auditoría AUD-021 (End-to-End Runtime Architecture Audit), se identificó que los contratos canónicos necesitaban ser ajustados para eliminar dependencias entre motores a nivel de protocolo. BF-010 implementó este ajuste sin romper ningún puente existente, demostrando que la separación entre protocolo y dominio es viable y no introduce regresiones.

### Runtime Protocol Migration

La migración hacia un protocolo unificado fue motivada por la necesidad de:
- Eliminar el acoplamiento entre motores a nivel de comunicación.
- Permitir que cualquier motor pueda ser reemplazado sin afectar el protocolo.
- Garantizar que el Event Bus pueda rutear eventos sin conocer el dominio.

---

## 5. Implementación de Referencia

La implementación canónica del Canonical Runtime Event se encuentra en:

```ts
// src/core/runtime/CanonicalEvent.ts
export interface CanonicalEvent {
  readonly entity: Record<string, unknown>;
  readonly operation: string;
  readonly timestamp: string;
  readonly version: number;
}
```

Todo nuevo evento que circule por el Event Bus debe adherirse a esta interfaz.

---

## 6. Cross-References

| Documento | Ubicación |
|-----------|-----------|
| Runtime Architecture (Event Bus, Section 6.3) | `project-docs/23-runtime-architecture/RUNTIME_ARCHITECTURE.md` |
| Engine Implementation Standard | `project-docs/11-protocol/ENGINE_IMPLEMENTATION_STANDARD.md` |
| Validation Sprint Methodology | `project-docs/11-protocol/VALIDATION_SPRINT_METHODOLOGY.md` |
| CanonicalEvent.ts (implementación) | `src/core/runtime/CanonicalEvent.ts` |
| CanonicalEvent (export) | `src/core/runtime/index.ts` |
| AUD-021 (BF-010 context) | `project-docs/architecture/AUD-021_END_TO_END_CERTIFICATION.md` |
| EXECUTION_PROTOCOL.md (all laws) | `project-docs/11-protocol/EXECUTION_PROTOCOL.md` |

---

## 7. Enforcement

Esta ley será aplicada por:

- **Runtime** — El Event Bus debe validar que todo evento entrante contenga los cuatro campos canónicos (`entity`, `operation`, `timestamp`, `version`).
- **Code Review** — Ninguna implementación futura podrá introducir nuevos campos raíz en el protocolo de comunicación.
- **Audit** — Las auditorías de arquitectura (AUD) verificarán el cumplimiento de esta ley.

---

*End of LAW-067 — Canonical Runtime Language*
