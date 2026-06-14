# 16 - DEFINICIÓN DE TERMINADO (DEFINITION OF DONE)

Este documento establece los criterios objetivos, medibles e innegociables que deben cumplirse en su totalidad para que cualquier tarea de desarrollo o mantenimiento sea clasificada oficialmente como "Terminada". Ninguna tarea puede considerarse completada de manera parcial.

---

## 1. Criterios de la Definición de Terminado (DoD)

Para que una entrega sea aceptada, debe cumplir satisfactoriamente con los siguientes cuatro bloques de requerimientos:

### A) Requerimientos de Compilación (Build Requirements)
*   [ ] **Build Exitoso:** El proyecto compila por completo sin errores utilizando el compilador oficial del proyecto (e.g. `npm run build` o script de compilación).
*   [ ] **Linter sin Alertas:** El análisis estático de código (`npm run lint`) no reporta ninguna infracción, advertencia o error de estilo.
*   [ ] **Typecheck Exitoso:** El compilador TypeScript (`npx tsc --noEmit`) no produce fallos de tipos en el workspace.

### B) Requerimientos del Repositorio (Repository Requirements)
*   [ ] **Sin Archivos Huérfanos (LAW_008):** Todo archivo nuevo introducido debe estar importado y en uso activo por la aplicación.
*   [ ] **Sin Archivos Basura (LAW_007):** El workspace está libre de archivos temporales (`test.tsx`, `copy.tsx`, `draft.tsx`, `backup.md`).
*   [ ] **Sin Funcionalidad Duplicada:** No se han introducido utilidades o componentes que realicen la misma función que otros módulos existentes.
*   [ ] **Sin Violaciones Arquitectónicas (LAW_015):** La estructura se mantiene fiel a [ARCHITECTURE.md](../01-foundation/ARCHITECTURE.md) (ej. componentes UI en `src/components/ui/` sin lógica de negocio).

### C) Requerimientos de Documentación (Documentation Requirements)
*   [ ] **Registro de Decisiones (ADR):** Si la tarea incluyó un cambio estructural o tecnológico clave, se redactó y aprobó su ADR correspondiente bajo `project-docs/adr/` (Ver [ADR_GUIDELINES.md](../06-adr/ADR_GUIDELINES.md)).
*   [ ] **Memoria de Proyecto Actualizada:** Se ha ampliado el historial en [PROJECT_MEMORY.md](../03-memory/PROJECT_MEMORY.md) con la referencia al nuevo ADR.
*   [ ] **Reporte de Cambios Generado:** Se creó y completó el archivo de reporte siguiendo la plantilla de [CHANGE_REPORT_TEMPLATE.md](../05-reporting/CHANGE_REPORT_TEMPLATE.md) bajo `project-docs/reports/`.

### D) Requerimientos de Validación (Validation Requirements)
*   [ ] **Funcionalidad Verificada:** Se ha probado de forma interactiva y visual el cambio, garantizando que el flujo de usuario funciona de extremo a extremo sin caídas.
*   [ ] **Gestión de Errores Correcta:** Los flujos de error (e.g. caída de red, datos de entrada incorrectos en formularios) muestran estados visuales adecuados (`error states`) y no rompen la UI.
*   [ ] **Revisión de Riesgo de Regresión:** Se ha comprobado que los cambios realizados no rompen ni degradan el comportamiento de pantallas o componentes comunes preexistentes.

---

## 2. Matriz de Control de DoD (Ejemplo de Firma de Calidad)

El agente responsable de la tarea adjuntará la siguiente sección firmada al final de su reporte de entrega:

| Requerimiento | Método de Validación | Estado | Responsable |
| :--- | :--- | :--- | :--- |
| Build & Lint | `npm run build && npm run lint` | Completado (Verificado) | Agente IA |
| Limpieza de Raíz | Inspección física del workspace | Completado (Verificado) | Agente IA |
| Documentación | Archivos generados bajo `project-docs/` | Completado (Verificado) | Agente IA |
| Regresiones | Recorrido interactivo de flujos | Completado (Verificado) | Agente IA |

---

## 3. Actualización y Evolución del DoD (Extensibilidad)

Este documento puede ampliarse a medida que se incorporen herramientas automáticas de pruebas (e.g. Jest, Cypress). Toda nueva regla de validación requerirá la creación de una propuesta ADR y la posterior modificación de este checklist para reflejar los nuevos estándares del equipo de desarrollo.
