# 10 - CHECKLIST DE DESARROLLO (PRE-ENTREGA)

Este checklist es la última barrera de control antes de dar una tarea por finalizada y solicitar la integración de código al repositorio principal de **Tony Burgers**. Cualquier agente (humano o de IA) debe verificar y marcar cada punto como completado.

---

## 1. Ley de Seguridad de Compilación (Obligatorio)

### LAW_013 - BUILD SAFETY
Antes de finalizar una tarea:
- build exitoso
- lint exitoso
- typescript exitoso

No se admiten excepciones. El fallo en cualquiera de estos tres puntos invalida automáticamente la entrega de la tarea.

---

## 2. CHECKLIST DE CONTROL DE CALIDAD Y ENTREGA

### 📋 2.1. Integridad de la Compilación y Tipado (LAW_013)
*   [ ] **Build Exitoso:** El proyecto compila sin errores ejecutando el comando de empaquetado (`npm run build`).
*   [ ] **Cero Errores TypeScript:** Al ejecutar la comprobación de tipos (`npx tsc --noEmit`), el compilador no arroja ningún error ni advertencia.
*   [ ] **Linter Limpio:** El comando de análisis estático (`npm run lint`) no reporta infracciones a las reglas de estilo del código.

### 📋 2.2. Estructura e Importaciones (Leyes de Carpeta y Archivos)
*   [ ] **Sin Imports Rotos:** Todas las sentencias `import` de los archivos nuevos y modificados apuntan a rutas válidas existentes en el sistema de archivos (se prefiere el alias `@/*`).
*   [ ] **Sin Archivos Huérfanos (LAW_008):** Todos los archivos creados para resolver la tarea están correctamente importados y en uso por la aplicación.
*   [ ] **Sin Archivos Basura (LAW_007):** Se ha verificado que no existan archivos de prueba temporal como `test.tsx`, `copy.tsx`, `backup.tsx` en el workspace.
*   [ ] **Sin Código Muerto:** Se han eliminado del código final las declaraciones de variables, funciones u objetos comentados que no tengan utilidad real.

### 📋 2.3. Gestión de Dependencias
*   [ ] **Sin Dependencias Adicionales Innecesarias (LAW_011):** No se han añadido dependencias al `package.json` sin previa propuesta e integración formal en [DEPENDENCY_POLICY.md](../00-governance/DEPENDENCY_POLICY.md).

### 📋 2.4. Diseño y UX Premium (Wow Effect)
*   [ ] **Consistencia de Estilos:** Se han utilizado tokens y clases CSS de Tailwind siguiendo las directrices de `./CODING_STANDARDS.md`. No se han inyectado colores arbitrarios fuera del tema principal.
*   [ ] **Responsividad Comprobada:** Se verificó la adaptabilidad de la UI en resoluciones móviles (320px - 480px), tablets (768px) y desktops (1024px+).
*   [ ] **Animaciones y Hover:** Los botones, enlaces e interacciones básicas cuentan con efectos visuales de hover y transiciones fluidas de al menos 150-200ms.

### 📋 2.5. Documentación y Entrega
*   [ ] **Código Documentado:** Las funciones públicas complejas, hooks personalizados y lógica de negocio sensible tienen documentación clara basada en JSDoc.
*   [ ] **Reporte de Cambios Creado (LAW_014):** Se ha generado y rellenado en su totalidad la plantilla `../05-reporting/CHANGE_REPORT_TEMPLATE.md`, guardándose bajo `/project-docs/reports/` con la estructura de nombre correcta.
*   [ ] **Memoria de Proyecto Actualizada (LAW_019):** Si la tarea implicó una decisión de diseño estructural, esta se registró formalmente en `../03-memory/PROJECT_MEMORY.md` y `../03-memory/DECISION_LOG.md`.

---

> [!WARNING]
> **Fallo de Checklist:** Entregar una tarea con alguno de estos puntos sin cumplir (salvo excepciones explícitas firmadas por el usuario humano) provocará el rechazo automático de la entrega y obligará a la IA a rehacer el proceso de validación.
