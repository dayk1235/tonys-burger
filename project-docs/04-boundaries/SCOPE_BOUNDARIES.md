# 08 - LÍMITES DE ALCANCE Y FRONTERAS DEL PROYECTO

Este documento define la política de confinamiento y delimitación de tareas para el proyecto **Tony Burgers**. Su propósito es evitar que los agentes de IA realicen modificaciones imprevistas en partes sensibles del sistema y obligar a mantener los cambios acotados y controlados.

---

## 1. Ley de Confinamiento de Cambios (Obligatorio)

### LAW_018 - CHANGE BOUNDARY ENFORCEMENT
Todo trabajo debe declarar:
- archivos permitidos
- archivos prohibidos
- alcance
- criterio de éxito

Ningún agente de IA iniciará modificaciones de archivos si la definición de su tarea omitió establecer explícitamente alguna de estas fronteras.

---

## 2. Definición Estructurada del Scope (Ejemplo de Tarea)

Al asignar una tarea a un agente de IA, se debe estructurar utilizando el siguiente formato estándar que satisface **LAW_018**:

```markdown
### [EJEMPLO DE ALCANCE DE TAREA]

#### 1. Archivos Permitidos (Write-Access)
*   `src/components/features/menu/IngredientSelector.tsx`
*   `src/types/menu.ts`

#### 2. Archivos Prohibidos (Read-Only)
*   `src/App.tsx`
*   `src/main.tsx`
*   `src/context/CartContext.tsx`
*   Cualquier archivo fuera del directorio `src/components/features/menu/`

#### 3. Alcance (Objetivo Exacto)
Añadir un componente de selección de ingredientes que permita al cliente excluir ingredientes estándar de la hamburguesa (ej. "Sin cebolla") y guardarlo en el objeto de tipo de datos de la hamburguesa seleccionada.

#### 4. Criterios de Éxito
*   [ ] El selector muestra correctamente la lista de ingredientes opcionales del plato.
*   [ ] Al hacer clic en un ingrediente, se añade a la lista de excluidos del item.
*   [ ] El estado local refleja correctamente los cambios sin disparar re-renders en el menú principal.
*   [ ] La compilación final del proyecto no produce errores.
```

---

## 3. Protocolo de Transgresión de Límites (Escalabilidad)

Si durante la ejecución de una tarea en su Fase 1 (Análisis) o Fase 3 (Implementación), un agente de IA descubre que es técnicamente imposible cumplir con el objetivo sin modificar un archivo de la lista de **Archivos Prohibidos**, debe seguir este protocolo estrictamente:

1.  **Detener la Ejecución:** No realizar ningún cambio en los archivos prohibidos.
2.  **Reportar el Bloqueo:** Notificar inmediatamente al usuario humano explicando:
    *   Qué archivo prohibido requiere edición.
    *   Por qué es necesario modificarlo (razón técnica justificada).
    *   El impacto potencial en el resto del sistema.
3.  **Solicitar Ampliación de Alcance:** Esperar a que el usuario humano apruebe un nuevo plan de implementación que reclasifique el archivo en la lista de permitidos.

> [!CAUTION]
> **Modificar archivos no autorizados de forma autónoma anula la validez del trabajo entregado** y el agente será revertido al último estado limpio en el repositorio.
