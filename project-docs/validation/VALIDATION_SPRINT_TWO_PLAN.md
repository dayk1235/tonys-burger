# Validation Sprint Two — Plan

---

## 1. Objective

Validation Sprint Two inicia la fase de **inteligencia adaptativa** de Restaurant OS.

El Runtime ya está estabilizado. El Pipeline Cognitivo núcleo (Observation → Decision) ya está completo con 7 motores vivos. El Dashboard ya consume datos reales.

Ahora el objetivo es **aumentar la capacidad cognitiva del sistema** extendiendo el pipeline más allá del núcleo hacia la evidencia, el aprendizaje, la predicción, la recomendación, la planificación y la ejecución.

VS2 deja de enfocarse en infraestructura y comienza a construir **capacidades cognitivas**.

---

## 2. Current State

### Runtime

| Métrica | Valor |
|---|---|
| Runtime State | `OPERATING` |
| Health | `HEALTHY` — 0 failures, 0 warnings |
| Cognitive Engines | 7 — todos `RUNNING` |
| Pipeline Connected | 7/18 stages |
| Integration Score | 72% |
| Dashboard Reality | 100% (Home) |

### Pipeline Actual (final de VS1)

```
Observation
    ↓
Pattern
    ↓
Memory
    ↓
Knowledge
    ↓
Attention
    ↓
Reasoning
    ↓
Decision
    ↓
[Evidence]      ⬜ Not connected
    ↓
[Learning]      ⬜ Not connected
    ↓
[Prediction]    ⬜ Not connected
    ↓
[Recommendation] ⬜ Not connected
    ↓
[Planning]       ⬜ Not connected
    ↓
[Execution]      ⬜ Not connected
```

### Process Standards Adopted

- LAW_060 — Pipeline Status Report (canonical template)
- LAW_061 — Controlled Validation Evidence (EXPECTED PIPELINE BEHAVIOR)
- LAW_062 — Validation Sprint Methodology (mandatory lifecycle)
- LAW_063 — Engine Implementation Standard (mandatory structure)

---

## 3. Validation Sprint Two Tasks

### VS2-001 — EvidenceEngine Integration

**Objetivo:** Conectar formalmente la capa Evidence al Pipeline Cognitivo.

**Dead End:** EvidenceEngine existe en `src/core/engines/evidence/` pero no está registrado en Runtime. MemoryEngine ya se suscribe a eventos `evidence.*` que nadie emite.

**Pipeline Position:** EVIDENCE (entre DECISION y LEARNING)

**Dependencia:** DecisionEngine debe estar RUNNING (✅ completado en VS1).

---

### VS2-002 — LearningEngine Integration

**Objetivo:** Permitir que el sistema aprenda de decisiones y resultados.

**Dead End:** No existe un engine que capture resultados de decisiones ejecutadas y retroalimente el pipeline.

**Pipeline Position:** LEARNING (entre EVIDENCE y PREDICTION)

**Dependencia:** EvidenceEngine debe estar RUNNING (VS2-001).

---

### VS2-003 — PredictionEngine Integration

**Objetivo:** Generar predicciones utilizando Knowledge y Learning.

**Dead End:** El sistema puede entender el pasado (Memory, Knowledge) pero no puede proyectar escenarios futuros.

**Pipeline Position:** PREDICTION (entre LEARNING y RECOMMENDATION)

**Dependencia:** LearningEngine debe estar RUNNING (VS2-002).

---

### VS2-004 — RecommendationEngine Integration

**Objetivo:** Transformar predicciones en recomendaciones accionables para el owner.

**Dead End:** El sistema puede evaluar (Decision) y proyectar (Prediction) pero no puede traducir eso en recomendaciones concretas.

**Pipeline Position:** RECOMMENDATION (entre PREDICTION y PLANNING)

**Dependencia:** PredictionEngine debe estar RUNNING (VS2-003).

---

### VS2-005 — PlanningEngine Integration

**Objetivo:** Convertir recomendaciones en planes ejecutables con pasos, plazos y responsables.

**Dead End:** El sistema puede recomendar pero no puede descomponer una recomendación en un plan de acción.

**Pipeline Position:** PLANNING (entre RECOMMENDATION y EXECUTION)

**Dependencia:** RecommendationEngine debe estar RUNNING (VS2-004).

---

### VS2-006 — ExecutionEngine Integration

**Objetivo:** Completar el ciclo cognitivo ejecutando acciones controladas dentro del sistema (no en el mundo real).

**Dead End:** El ciclo cognitivo termina en Decision. No hay capacidad de ejecutar acciones automáticas (notificaciones, actualizaciones de menú, ajustes de precio, etc.)

**Pipeline Position:** EXECUTION (final del pipeline cognitivo)

**Dependencia:** PlanningEngine debe estar RUNNING (VS2-005).

---

## 4. Expected Result

Pipeline esperado al finalizar VS2:

```
Observation           ✅ Connected
    ↓
Pattern               ✅ Connected
    ↓
Memory                ✅ Connected
    ↓
Knowledge             ✅ Connected
    ↓
Attention             ✅ Connected
    ↓
Reasoning             ✅ Connected
    ↓
Decision              ✅ Connected
    ↓
Evidence              ✅ Connected  ← NEW
    ↓
Learning              ✅ Connected  ← NEW
    ↓
Prediction            ✅ Connected  ← NEW
    ↓
Recommendation        ✅ Connected  ← NEW
    ↓
Planning              ✅ Connected  ← NEW
    ↓
Execution             ✅ Connected  ← NEW
```

**Pipeline Completion Target:** 13/18 stages connected. 13 cognitive engines alive.

---

## 5. Validation Rules

Cada VS Task deberá seguir obligatoriamente el ciclo definido por LAW_062:

```
Planning
    ↓
VS — Validation Sprint Task
    ↓
CV — Controlled Validation (Smoke Test)
    ↓
AUD — Audit
    ↓
Closing Report
```

No se permitirá avanzar al siguiente VS sin completar el ciclo del anterior.

Cada nuevo engine deberá seguir obligatoriamente el estándar definido por LAW_063 (Engine Implementation Standard).

---

## 6. Out of Scope

- No rediseñar Runtime
- No crear nuevas metodologías
- No crear nuevas leyes
- No modificar arquitectura existente
- No introducir funcionalidades fuera del Dead End correspondiente
- No modificar el Dashboard (pertenece a Production Readiness posterior)
- No modificar la API de órdenes

---

## 7. Success Criteria

Validation Sprint Two quedará completo cuando:

1. **EvidenceEngine** registrado, RUNNING, emitiendo eventos `evidence.*` visibles en EventBus.
2. **LearningEngine** registrado, RUNNING, consumiendo decisiones archivadas.
3. **PredictionEngine** registrado, RUNNING, generando proyecciones desde Knowledge.
4. **RecommendationEngine** registrado, RUNNING, produciendo recomendaciones desde predicciones.
5. **PlanningEngine** registrado, RUNNING, descomponiendo recomendaciones en planes.
6. **ExecutionEngine** registrado, RUNNING, ejecutando acciones controladas.
7. Cada integración tiene su **CV correspondiente** (Smoke Test).
8. Cada integración tiene su **AUD correspondiente** (sin regresiones).
9. Todos los **Closing Reports** están completos.
10. Pipeline Cognitivo conectado desde **Observation hasta Execution**.
11. **Typecheck limpio** en todo momento.
12. **Tests existentes** continúan pasando sin regresiones.

---

## 8. Pipeline Status Target (final de VS2)

```
PIPELINE STATUS  ← Target al completar VS2

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
Evidence                  ✅ Connected  ← NEW
Learning                  ✅ Connected  ← NEW
Prediction                ✅ Connected  ← NEW
Recommendation            ✅ Connected  ← NEW
Planning                  ✅ Connected  ← NEW
Execution                 ✅ Connected  ← NEW

Pipeline Completion
Connected: 18 / 18
Alive: 0 / 18
Pending: 0 / 18
```

---

*Validation Sprint Two — Plan*
*Se ejecuta después de la finalización oficial de Production Readiness (VS1-005 + VS1-006) y la adopción de la Validation Sprint Methodology.*
