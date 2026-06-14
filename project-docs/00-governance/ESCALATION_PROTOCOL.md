# 17 - PROTOCOLO DE ESCALADO DE INCERTIDUMBRE (ESCALATION PROTOCOL)

Este documento define el protocolo formal de gestión de incertidumbre para agentes de IA que operan en el repositorio **Tony Burgers**. Su propósito principal es prevenir la alucinación, suposiciones no fundamentadas y decisiones de código derivadas de instrucciones ambiguas.

---

## 1. Ley de Incertidumbre (Obligatorio)

### LAW_022 - STOP WHEN UNCERTAIN
Agents must never guess.
Uncertainty requires escalation.

Cualquier acción tomada bajo incertidumbre que no haya sido escalada formalmente y aprobada se considera una **violación de la ley de gobernanza** y sus resultados serán descartados y revertidos.

---

## 2. Umbral de Confianza Operativa

Un agente de IA debe evaluar su nivel de confianza antes de ejecutar cualquier cambio. Si la confianza estimada sobre la instrucción recibida o el contexto arquitectónico actual es inferior al **90%**, la ley **LAW_022** obliga al agente a detener toda ejecución y escalar formalmente.

**Condiciones que disparan el escalado:**
*   La instrucción de la tarea usa lenguaje vago o subjetivo (e.g. "mejorar", "optimizar", "arreglar").
*   La tarea requiere modificar archivos críticos de configuración sin detallar los cambios exactos.
*   Existen dos o más interpretaciones plausibles de un mismo requerimiento.
*   La tarea tiene un impacto potencial sobre más de un dominio de negocio.
*   Un cambio en una capa de la arquitectura (e.g. servicios) podría generar efectos colaterales no listados en los archivos permitidos.

---

## 3. Protocolo de Acción Requerida

Cuando se active el umbral de escalado, el agente **debe** ejecutar estos pasos en orden:

1.  **Detener el trabajo:** No modificar ningún archivo hasta que se reciba la clarificación.
2.  **Explicar la incertidumbre:** Articular de manera precisa cuál es la instrucción ambigua o el contexto arquitectónico que no puede resolverse.
3.  **Listar hipótesis y suposiciones:** Enumerar todas las interpretaciones válidas detectadas.
4.  **Solicitar clarificación:** Presentar al usuario humano una pregunta directa y contextualizada.

---

## 4. Niveles de Escalado

### NIVEL 1 — Ambigüedad Menor
**Descripción:** La instrucción es comprensible en términos generales, pero un detalle secundario no está definido.
**Impacto esperado:** Bajo. Afecta a 1 archivo o a un componente de UI aislado.
**Acción:** El agente puede mencionar la suposición que tomará y continuar, anotando la decisión en el reporte. Si la suposición es incorrecta, el fix tiene bajo coste.
**Ejemplo:**
> *"La tarea dice 'añadir botón de eliminar al carrito'. No se especifica el color del botón de eliminación. El agente asumirá el color `red-600` de Tailwind siguiendo la paleta del tema oscuro. Esta decisión se anotará en el reporte de cambios."*

---

### NIVEL 2 — Incertidumbre Arquitectónica
**Descripción:** La instrucción requiere crear un componente, hook o servicio nuevo cuya ubicación correcta en la arquitectura no está clara.
**Impacto esperado:** Medio. Podría crear un archivo en una carpeta incorrecta, causando una violación de **LAW_009** (Single Responsibility Location).
**Acción:** Detener ejecución. Presentar al usuario las opciones de ubicación posibles con su justificación y esperar validación.
**Ejemplo:**
> *"La tarea indica 'crear el servicio de autenticación de usuarios'. Existen dos ubicaciones posibles: `src/services/` (lógica de datos) o `src/context/` (estado global de sesión). Cada una responde a un patrón diferente. Solicito indicación sobre cuál elegir antes de crear archivos."*

---

### NIVEL 3 — Cambio de Alto Riesgo
**Descripción:** La tarea implica modificar un archivo de configuración global (`vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`), un hook transversal (`useCart`, `useMenu`) o el enrutamiento central (`App.tsx`).
**Impacto esperado:** Alto. Un error puede afectar múltiples flujos de usuario o romper el build completo.
**Acción:** Detener ejecución. Presentar un análisis formal completo de impacto arquitectónico con el detalle de todos los archivos afectados (incluso los no listados en el scope), los riesgos de regresión y la estrategia de reversión. Esperar aprobación explícita.
**Ejemplo:**
> *"La tarea solicita 'actualizar la configuración de rutas para soportar lazy loading'. Este cambio afecta directamente `App.tsx` y podría impactar el comportamiento de carga de todas las páginas. Requiero aprobación explícita del plan de implementación antes de proceder. Riesgo: regresión de carga en móviles."*

---

### NIVEL 4 — Riesgo Crítico para el Repositorio
**Descripción:** La tarea representa un riesgo existencial para la integridad del repositorio: eliminar archivos de configuración, reescribir la arquitectura de estado global, migrar frameworks o alterar el sistema de compilación completo.
**Impacto esperado:** Crítico. El repositorio podría quedar en estado inestable si el cambio falla.
**Acción:** Detener ejecución inmediatamente. Redactar un ADR (ver [../06-adr/ADR_GUIDELINES.md](file:///Users/theboy/Documents/tony-burgers/project-docs/../06-adr/ADR_GUIDELINES.md)) documentando el estado actual, el estado propuesto, las alternativas y los riesgos. No se puede proceder sin aprobación formal del ADR y la validación humana explícita.
**Ejemplo:**
> *"La tarea solicita 'migrar el bundler de Vite a Webpack'. Este es un cambio de infraestructura de nivel 4 que requiere la creación de un ADR formal, un plan de migración y validación de build antes de poder comenzar. He creado el ADR-004 para su revisión."*

---

## 5. Plantilla de Reporte de Escalado

Cuando se active un escalado de Nivel 2 o superior, el agente debe utilizar el siguiente formato de notificación al usuario:

```markdown
## 🚨 ESCALADO — [Nivel 1 / 2 / 3 / 4]

**Tarea:** [Nombre de la tarea asignada]
**Confianza Estimada:** [X%]
**Motivo del Escalado:** [Descripción precisa de la ambigüedad o riesgo detectado]

### Hipótesis Identificadas:
1. [Interpretación A] — Consecuencias: [...]
2. [Interpretación B] — Consecuencias: [...]

### Pregunta al Usuario:
[Pregunta directa, concreta y cerrada que el usuario humano puede responder con una de las opciones listadas]

### Acciones Bloqueadas Hasta Recibir Clarificación:
- [Acción 1]
- [Acción 2]
```
