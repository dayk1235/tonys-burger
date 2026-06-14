# 06 - PLANTILLA DE REPORTE DE CAMBIOS (TEMPLATE)

Este documento implementa formalmente la obligación de reporte de cambios en el proyecto:

### LAW_014 - REPORTING OBLIGATION
Toda tarea debe producir reporte.
El reporte debe incluir:
- objetivo
- archivos modificados
- riesgos
- validaciones
- próximos pasos

---

> [!IMPORTANT]
> **Instrucciones para el Agente:**
> Copia el contenido de esta plantilla, crea un archivo nuevo con el nombre `REP_YYYYMMDD_NombreTarea.md` dentro de la carpeta `/project-docs/reports/` (créala si no existe) y rellena todos los campos con la información real de tu tarea antes de solicitar la revisión humana. No omitas ningún campo.

---

```markdown
# Reporte de Cambios: [Nombre Corto de la Tarea]

* **Fecha de Entrega:** [Ej. 2026-06-14]
* **ID de Tarea / Issue:** [Ej. #124 o N/A]
* **Agente Responsable:** [Ej. Antigravity-v3.5]
* **Cumplimiento de Leyes:** Se valida el cumplimiento de LAW_014.

---

## 1. Task
[Enlace a la tarea solicitada o descripción breve de la tarea asignada].

## 2. Objective (Objetivo)
[Explicar detalladamente el objetivo del cambio. ¿Qué problema se resolvió o qué funcionalidad se añadió a la aplicación?].

## 3. Files Modified (Archivos Modificados)
*   `[NEW]` `[Ruta del archivo creado, ej. src/components/features/menu/MenuItem.tsx]`
*   `[MODIFY]` `[Ruta del archivo modificado, ej. src/context/CartContext.tsx]`
*   `[DELETE]` `[Ruta del archivo eliminado si aplica]`

## 4. Changes Made
[Describir de forma técnica y estructurada los cambios realizados. Puedes usar una lista de viñetas para mayor claridad].

*   **Componente X:**
    *   Se añadió la propiedad `Y` para permitir...
    *   Se implementó la función `Z` utilizando la lógica de...
*   **Servicio de Mock:**
    *   Se actualizó el archivo de mock para devolver datos de prueba consistentes con...

## 5. Validation Performed (Validaciones)
[Describir todas las pruebas realizadas para asegurar la calidad y estabilidad del cambio. Incluir comandos ejecutados y resultados].

*   **Compilación del Proyecto:** Se ejecutó `npm run build` con resultado exitoso (sin errores de TypeScript ni bundler).
*   **Análisis Estático (Linting):** Se ejecutó `npm run lint` y se resolvieron todas las advertencias/errores.
*   **Pruebas Manuales:**
    *   [ ] Comprobación del flujo de adición de productos al carrito en el simulador de navegador.
    *   [ ] Verificación visual de los componentes en resoluciones Desktop (1440px) y Mobile (375px).

## 6. Risks (Riesgos)
[Evaluar posibles riesgos colaterales, de rendimiento o de regresión asociados con el cambio realizado].

*   *Ejemplo de Riesgo:* Al haber modificado el context del carrito, existe un riesgo menor de afectación al rendimiento en pantallas con muchos re-renders. Se mitigó utilizando referencias estables en las funciones expuestas.

## 7. Next Steps (Próximos Pasos)
[Recomendaciones para el siguiente agente o pasos subsiguientes a realizar sobre esta funcionalidad].

1.  Integrar pruebas unitarias utilizando Jest o Vitest para el reducer del carrito.
2.  Conectar el backend ficticio con un cliente HTTP real una vez finalizada la especificación de la API REST.
```
