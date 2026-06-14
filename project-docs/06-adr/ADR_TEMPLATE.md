# ADR-[NNN] — [Título Descriptivo de la Decisión]

> **Instrucciones:** Copia este archivo, renómbralo como `ADR_NNN_titulo-en-kebab-case.md` y completa todos los campos. No dejes ninguna sección vacía. Si un campo no aplica, escribe "N/A" con una justificación breve.

---

## Metadatos

*   **Número ADR:** `ADR-[NNN]` *(e.g. ADR-004)*
*   **Estado:** `[Propuesto / En Revisión / Aprobado / Rechazado / Implementado / Supersedido por ADR-XXX]`
*   **Fecha de Creación:** `YYYY-MM-DD`
*   **Fecha de Aprobación:** `YYYY-MM-DD` *(dejar en blanco hasta su aprobación)*
*   **Responsable / Agente:** `[Nombre del agente o arquitecto que propone el ADR]`
*   **Supersede a:** `ADR-[NNN]` *(si este ADR reemplaza a uno anterior, indicarlo aquí; de lo contrario, N/A)*

---

## 1. Contexto

*Describir la situación actual del sistema o del proyecto que genera la necesidad de tomar esta decisión. ¿Qué está pasando técnicamente o en el negocio que obliga a reflexionar sobre la arquitectura?*

[Reemplazar con el contexto específico]

---

## 2. Declaración del Problema

*Formular de manera precisa y objetiva el problema que esta decisión debe resolver. Debe ser una oración o párrafo corto que cualquier agente pueda entender sin contexto adicional.*

[Reemplazar con el planteamiento del problema]

---

## 3. Decisión

*Describir detalladamente la solución arquitectónica adoptada. Incluir las reglas de implementación específicas que deben seguirse como resultado de esta decisión.*

**Decisión tomada:**
[Reemplazar con la decisión final]

**Reglas de implementación derivadas:**
*   [Regla 1: e.g. "Todo nuevo hook de autenticación debe ubicarse en `src/hooks/auth/`"]
*   [Regla 2]
*   [Regla N]

---

## 4. Alternativas Consideradas

*Listar todas las alternativas que fueron evaluadas antes de llegar a esta decisión. Para cada una, indicar por qué fue descartada.*

| Alternativa | Descripción Breve | Motivo de Descarte |
| :--- | :--- | :--- |
| [Alternativa A] | [Descripción] | [Por qué no se eligió] |
| [Alternativa B] | [Descripción] | [Por qué no se eligió] |
| [Alternativa N] | [Descripción] | [Por qué no se eligió] |

---

## 5. Consecuencias

*Describir el impacto a corto, medio y largo plazo de implementar esta decisión. Tanto las consecuencias positivas como las negativas deben listarse con honestidad.*

**Positivas:**
*   [Consecuencia positiva 1]
*   [Consecuencia positiva 2]

**Negativas / Compromisos (Trade-offs):**
*   [Consecuencia negativa 1 o limitación aceptada]
*   [Consecuencia negativa 2]

---

## 6. Riesgos Identificados

*Enumerar los riesgos técnicos, operacionales o de regresión que esta decisión podría introducir.*

| Riesgo | Probabilidad | Impacto | Mitigación |
| :--- | :--- | :--- | :--- |
| [Descripción del riesgo] | Alta / Media / Baja | Alto / Medio / Bajo | [Estrategia de mitigación] |
| [Descripción del riesgo] | Alta / Media / Baja | Alto / Medio / Bajo | [Estrategia de mitigación] |

---

## 7. Estrategia de Migración

*Si esta decisión requiere migrar código o configuración existente, describir los pasos de migración. Si es una decisión para código nuevo (greenfield), indicar "N/A".*

**Pasos de migración:**
1.  [Paso 1]
2.  [Paso 2]
3.  [Validación final: confirmar que el build y lint pasan tras la migración]

---

## 8. Aprobación

*Esta sección debe completarse únicamente por el supervisor humano o el Arquitecto Principal tras su revisión formal.*

*   **Aprobado por:** `[Nombre del supervisor / usuario humano]`
*   **Fecha de Aprobación:** `YYYY-MM-DD`
*   **Comentarios del Supervisor:** `[Observaciones o condiciones especiales de la aprobación]`
