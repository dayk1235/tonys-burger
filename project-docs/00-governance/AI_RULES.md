# 04 - REGLAS ESTRICTAS PARA AGENTES DE IA

Este documento define el marco operativo, los límites de seguridad y las restricciones obligatorias para cualquier Agente de Inteligencia Artificial que ejecute tareas de desarrollo, depuración o documentación en el repositorio **Tony Burgers**.

---

## 1. LEYES CONSTITUCIONALES DE IA (OBLIGATORIO)

Estas leyes de gobernanza global regulan de forma permanente el comportamiento de los agentes:

### LAW_043 — ALWAYS GREEN REPOSITORY
El main branch debe compilar siempre exitosamente.
- TypeScript debe pasar (`npx tsc --noEmit` — cero errores).
- Build debe pasar (`npm run build` — cero errores).
- Lint debe pasar, salvo deuda legacy documentada explícitamente.
- Ninguna feature puede integrarse si deja el repositorio en estado quebrado.
- Si una tarea introduce fallos de compilación, se considera incompleta.

### LAW_001 - DOCUMENTATION FIRST
Ningún agente puede modificar código sin haber leído:
- VISION
- ARCHITECTURE
- AI_RULES
- PROJECT_MEMORY

### LAW_003 - NO AUTONOMOUS FEATURES
Prohibido:
- Crear funcionalidades no solicitadas.
- Agregar mejoras no autorizadas.
- Inventar sistemas.
- Añadir secciones nuevas.
- Alterar experiencia de usuario sin aprobación.

### LAW_004 - NO UNAUTHORIZED REFACTORING
Prohibido:
- Refactorizar por iniciativa propia.
- Reestructurar código existente.
- Renombrar módulos.
- Cambiar patrones arquitectónicos.
Sin autorización explícita.

---

## 2. COMPORTAMIENTOS PROHIBIDOS ADICIONALES

Cualquier infracción a las siguientes prohibiciones será considerada un fallo grave de control y estabilidad de la IA.

### 🚫 2.1. Modificar Archivos Fuera de Alcance (Out of Scope)
*   La IA solo puede editar archivos explícitamente autorizados en la tarea o directamente relacionados con el arreglo del bug asignado (Ver `../04-boundaries/SCOPE_BOUNDARIES.md`).
*   Está prohibido realizar modificaciones transversales en otros componentes o archivos de configuración para "prepararlos para la tarea".

### 🚫 2.2. Instalar o Actualizar Dependencias
*   Queda estrictamente prohibido ejecutar comandos como `npm install <package>` o `npm update` sin la aprobación previa del usuario humano.
*   Si una tarea requiere una librería externa, la IA debe seguir el flujo detallado en `../00-governance/DEPENDENCY_POLICY.md`.

### 🚫 2.3. Alterar Configuraciones del Proyecto
*   Prohibido cambiar de forma autónoma archivos como: `package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`, `eslint.config.js` o configuraciones de Tailwind.

---

## 3. COMPORTAMIENTOS OBLIGATORIOS ADICIONALES

Para garantizar la calidad de la entrega y la trazabilidad del trabajo, la IA debe seguir las siguientes directrices sin excepción.

### ✅ 3.1. Lectura Previa de Documentación (Boot Sequence)
*   Antes de editar código, la IA debe ejecutar la secuencia de arranque obligatoria descrita en `../BOOT_SEQUENCE.md`.

### ✅ 3.2. Respetar la Arquitectura y Estándares
*   Todo el código nuevo debe respetar la estructura modular y las convenciones de TypeScript y React detalladas en `../01-foundation/ARCHITECTURE.md` y `../02-development/CODING_STANDARDS.md`.

### ✅ 3.3. Reporte de Cambios Riguroso
*   Al completar una tarea, es mandatorio generar un reporte utilizando exactamente la plantilla definida en `../05-reporting/CHANGE_REPORT_TEMPLATE.md`.

### ✅ 3.4. Validación de Compilación y Calidad
*   Antes de dar por concluida la tarea, la IA debe validar que el proyecto compile de forma limpia y verificar que no existan advertencias de linting o errores de TypeScript.

### ✅ 3.5. Mantener la Compatibilidad hacia Atrás (Backward Compatibility)
*   Cualquier modificación a una función, componente común o hook existente no debe romper su integración actual en otras partes del código.
