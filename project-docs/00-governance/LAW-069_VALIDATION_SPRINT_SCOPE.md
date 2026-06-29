# LAW-069 — VALIDATION SPRINT SCOPE

**Status:** Permanent Architectural Law
**Adopted:** 2026-06-28
**Classification:** Core Repository Law — Validation Sprint Methodology
**Relates To:** LAW 62 (Validation Sprint Methodology), LAW 66 (Single Dead End Resolution), LAW 56 (Validation Task Specification)

---

## 1. Statement

Un Validation Sprint (VS) nunca implementa nuevas capacidades.

Un VS únicamente:

- **Descubre** — identifica el estado real del sistema mediante exploración controlada
- **Audita** — verifica consistencia entre lo esperado y lo observado
- **Certifica** — declara que un contrato, integración o comportamiento funciona según lo especificado
- **Identifica gaps** — señala diferencias entre la arquitectura deseada y la implementada

Toda nueva capacidad descubierta durante un VS deberá convertirse en un **BF (Bug Fix / Feature)** independiente.

---

## 2. Distinción Fundamental

| Concepto | Rol | Actividad |
|----------|-----|-----------|
| VS | Evidencia | Descubrir, auditar, certificar, identificar gaps |
| BF | Implementación | Construir, modificar, corregir, implementar |

**VS = evidencia.**

**BF = implementación.**

Ningún VS puede contener implementación de nuevas capacidades. Si durante la ejecución de un VS se descubre que falta una capacidad, esa capacidad no se implementa dentro del VS — se registra como un BF futuro.

---

## 3. Rationale

### 3.1 Separación de responsabilidades

Mezclar descubrimiento con implementación corrompe ambas actividades:

- La implementación sesga el descubrimiento (el agente implementa lo que cree correcto en lugar de reportar lo que realmente existe)
- El descubrimiento interrumpe la implementación (cada hallazgo abre una desviación que alarga el VS sin control)

### 3.2 Evidencia verificable independientemente

Un VS produce evidencia. Esa evidencia debe poder ser auditada sin depender del código que se escribió durante el VS. Si el VS también implementó, la evidencia y la implementación son indistinguibles — no hay auditoría posible.

### 3.3 Trazabilidad del cambio

Cada nueva capacidad debe tener su propio BF con:

- Especificación completa
- Diseño propio
- Validación independiente
- Audit individual

Un VS que implementa oculta estas decisiones dentro de un solo entregable, violando LAW 64 (Design Before Implementation).

---

## 4. Prohibiciones

Queda prohibido:

1. **Implementar código nuevo** dentro de un Validation Sprint — toda implementación pertenece a un BF.
2. **Modificar archivos de implementación** (src/, engines/, adapters/, contracts/) durante un VS — excepto archivos de test, validación, o evidencia explícitamente declarados en la especificación del VS.
3. **Mezclar evidencia con implementación** en el mismo entregable — VS y BF son unidades separadas.
4. **Declarar un VS completado si contiene implementación no especificada** — el VS debe reportar el gap, no cerrarlo.
5. **Renombrar un BF como "parte del VS"** — si hay código nuevo, hay BF.

---

## 5. Excepciones

Únicamente se permiten las siguientes modificaciones dentro de un VS:

- Archivos de test (*.test.ts, *.spec.ts, *.test-d.ts)
- Archivos de validación (*.validation.ts)
- Archivos de fixture o mock (*.fixture.ts, *.mock.ts)
- Archivos de evidencia documentada (reportes, logs, screenshots)
- Archivos de configuración de herramientas de validación

Cualquier modificación fuera de esta lista constituye una violación de LAW-069.

---

## 6. Flujo Canónico

```
VS descubre un gap
       ↓
VS registra el gap como BF pendiente
       ↓
VS cierra con evidencia del gap
       ↓
BF independiente:
    → Diseño
    → ADR (si aplica)
    → Implementación
    → Controlled Validation
    → Audit
    → Closing Report
```

---

## 7. Cross-References

| Documento | Ubicación |
|-----------|-----------|
| Validation Sprint Methodology (LAW 62) | `project-docs/11-protocol/VALIDATION_SPRINT_METHODOLOGY.md` |
| Single Dead End Resolution (LAW 66) | `project-docs/11-protocol/EXECUTION_PROTOCOL.md` |
| Validation Task Specification (LAW 56) | `project-docs/11-protocol/EXECUTION_PROTOCOL.md` |
| Design Before Implementation (LAW 64) | `project-docs/11-protocol/EXECUTION_PROTOCOL.md` |
| Engine Implementation Standard (LAW 63) | `project-docs/11-protocol/ENGINE_IMPLEMENTATION_STANDARD.md` |
| Architecture Discovery Before Code (LAW 68) | `project-docs/00-governance/LAW-068_ARCHITECTURE_DISCOVERY.md` |
| Execution Protocol (all laws) | `project-docs/11-protocol/EXECUTION_PROTOCOL.md` |

---

## 8. Compliance

Esta ley será aplicada por:

- **Validation Sprint Planning** — toda VS debe declarar explícitamente que no implementa capacidades nuevas
- **Code Review** — rechazar cualquier PR de VS que contenga implementación no autorizada
- **Audit** — las auditorías verificarán que los VS producen evidencia, no código
- **Pipeline Status Report** — el estado del pipeline refleja evidencia, no implementación

La violación de esta ley invalida automáticamente el Validation Sprint correspondiente.

---

*End of LAW-069 — Validation Sprint Scope*
