# Validation Sprint One

---

## 1. Objective

Conectar los cuatro motores cognitivos restantes del Pipeline Cognitivo canónico (Knowledge → Attention → Reasoning → Decision) en el Runtime, profundizar la integración del Dashboard con datos reales, e implementar deduplicación de pedidos.

Al finalizar VS1, el Pipeline Cognitivo debe tener **7 motores vivos** y el Dashboard debe reflejar **más datos reales que demo**.

---

## 2. Starting Point

### Estado heredado de Validation Sprint Zero

| Métrica | Valor |
|---|---|
| VS0 Certification | ✅ Certified |
| Bug Fixes | 3 — ✅ |
| Controlled Validation | ✅ Full Coverage (CV-001 to CV-006) |
| Pipeline Conectado | 9/13 layers |
| Motores Vivos | 3 (ObservationEngine, PatternEngine, MemoryEngine) |
| Dashboard Real | 3/9 secciones |
| Runtime State | `OPERATING` — HEALTHY |
| Bugs Conocidos | 0 |

### Pipeline Status al inicio de VS1

```
PIPELINE STATUS

Customer                  ✅ Connected
Landing                   ✅ Connected
Orders API                ✅ Connected
Runtime                   ✅ Connected
Observation               ✅ Connected
Event Bus                 ✅ Connected
Pattern                   ✅ Connected
Memory                    ✅ Connected
Knowledge                 ⬜ Not activated
Attention                 ⬜ Not activated
Reasoning                 ⬜ Not activated
Decision                  ⬜ Not activated
Dashboard                 ✅ Connected

Pipeline Completion
Connected: 9 / 13
Alive: 0 / 13
Pending: 4 / 13
```

---

## 3. Sprint Scope

### VS1-001 — KnowledgeEngine

Registrar KnowledgeEngine en el Runtime como cuarto motor cognitivo. Conectar al EventBus compartido. Sincronizar estado con `engineRegistry.updateState()`.

**Dead End:** KnowledgeEngine existe pero no está registrado en Runtime.

### VS1-002 — AttentionEngine

Registrar AttentionEngine en el Runtime como quinto motor cognitivo. Conectar al EventBus compartido.

**Dead End:** AttentionEngine existe pero no está registrado en Runtime.

### VS1-003 — ReasoningEngine

Registrar ReasoningEngine en el Runtime como sexto motor cognitivo. Conectar al EventBus compartido.

**Dead End:** ReasoningEngine existe pero no está registrado en Runtime.

### VS1-004 — DecisionEngine

Registrar DecisionEngine en el Runtime como séptimo motor cognitivo. Conectar al EventBus compartido.

**Dead End:** DecisionEngine existe pero no está registrado en Runtime.

### VS1-005 — Dashboard Reality

Reemplazar secciones demo del Dashboard con datos reales provenientes del Pipeline. Objetivo: más de la mitad del Dashboard debe consumir datos reales.

**Dead End:** Dashboard muestra 67% datos demo.

### VS1-006 — Orders Deduplication

Implementar detección de pedidos duplicados en POST /api/orders utilizando `requestId`. Rechazar duplicados con HTTP 409.

**Dead End:** CV-004 procesa duplicados sin rechazo.

---

## 4. Execution Rules

Mantener exactamente la metodología utilizada en VS0:

```
VS Task (registrar engine / modificar sección / implementar feature)
    ↓
Audit (verificar que funciona mediante endpoints y tests)
    ↓
Controlled Validation (crear fixture + ejecutar contra servidor real)
    ↓
Bug Fix (si aparece un bug durante validación, corregir antes de continuar)
    ↓
Pipeline Status Report (actualizar con LAW_060)
    ↓
Siguiente VS Task
```

### Metodología específica

- Cada VS Task sigue el formato de especificación de LAW_56.
- Cada VS Task finaliza con Pipeline Status Report (LAW_60).
- Controlled Validations aplican LAW_61 (EXPECTED PIPELINE BEHAVIOR).
- Bug Fixes encontrados durante validación se resuelven antes del siguiente VS Task.
- Ninguna tarea horizontal se inicia mientras exista un Dead End vertical activo (LAW_57).

---

## 5. Success Criteria

Validation Sprint One se considera COMPLETO cuando:

1. **KnowledgeEngine** registrado, RUNNING, recibiendo eventos del EventBus.
2. **AttentionEngine** registrado, RUNNING, recibiendo eventos del EventBus.
3. **ReasoningEngine** registrado, RUNNING, recibiendo eventos del EventBus.
4. **DecisionEngine** registrado, RUNNING, recibiendo eventos del EventBus.
5. **Dashboard Reality Score** supera 50% (más secciones reales que demo).
6. **Orders Deduplication** implementada y verificada mediante CV.
7. **Pipeline Status** muestra 7 motores cognitivos vivos.
8. **Integration Score** mínimo 65%.
9. **Zero bugs** conocidos en Runtime o Engines.
10. **Controlled Validation Suite** ampliada para cubrir nuevas capacidades.

---

## 6. Pipeline Status Target (final de VS1)

```
PIPELINE STATUS  ← Target al completar VS1

Customer                  ✅ Connected
Landing                   ✅ Connected
Orders API                ✅ Connected
Runtime                   ✅ Connected
Observation               ✅ Connected
Event Bus                 ✅ Connected
Pattern                   ✅ Connected
Memory                    ✅ Connected
Knowledge                 ✅ Connected
Attention                 ✅ Connected
Reasoning                 ✅ Connected
Decision                  ✅ Connected
Dashboard                 ✅ Connected

Pipeline Completion
Connected: 13 / 13
Alive: 0 / 13
Pending: 0 / 13
```

---

*Validation Sprint One — Plan*  
*Se ejecuta después de la finalización oficial de Validation Sprint Zero.*
