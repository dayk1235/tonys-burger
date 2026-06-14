# 15 - CONVENCIONES DE NOMENCLATURA ESTRICTA (NAMING CONVENTIONS)

Este documento define la nomenclatura homogénea para todos los componentes del proyecto **Tony Burgers**. El cumplimiento de estas convenciones es estrictamente obligatorio para mantener la consistencia semántica y visual en todo el código fuente.

---

## 1. Reglas de Nomenclatura del Código

### 1.1. Archivos y Directorios
*   **Directorios:** Usar siempre `kebab-case` (letras minúsculas separadas por guiones).
    *   *Ejemplos:* `src/components/ui/`, `src/components/features/menu/`
*   **Componentes de React (.tsx):** Usar siempre `PascalCase`. El nombre del archivo debe coincidir exactamente con el del componente exportado.
    *   *Ejemplos:* `Button.tsx`, `CartItemCard.tsx`
*   **Componentes de Página (.tsx):** Usar siempre `PascalCase` con el sufijo `Page`.
    *   *Ejemplos:* `MenuPage.tsx`, `BookingPage.tsx`
*   **Hooks, Servicios, Utilidades (.ts):** Usar siempre `camelCase`.
    *   *Ejemplos:* `useLocalStorage.ts`, `localStorageService.ts`, `formatCurrency.ts`

### 1.2. Variables, Constantes y Funciones
*   **Variables locales:** Usar siempre `camelCase` con nombres semánticos e ingleses.
    *   *Ejemplos:* `isCartOpen`, `selectedBurgerPrice`
*   **Constantes globales:** Usar siempre `SCREAMING_SNAKE_CASE` (letras mayúsculas separadas por guiones bajos).
    *   *Ejemplos:* `DEFAULT_TAX_RATE`, `MAX_BOOKING_SEATS`
*   **Funciones:** Usar siempre `camelCase` empezando obligatoriamente por un verbo que denote acción.
    *   *Ejemplos:* `calculateTotal()`, `getMenuItemById()`, `handleQuantityChange()`

### 1.3. Tipos e Interfaces de TypeScript
*   **Interfaces y Types:** Usar siempre `PascalCase`. Queda estrictamente prohibido usar el prefijo `I` (ej. `IBurger`).
    *   *Ejemplos:* `Burger`, `CartItem`, `BookingDetails`
*   **Tipos Genéricos:** Usar una sola letra mayúscula (`T`, `U`) o PascalCase precedido de `T`.
    *   *Ejemplos:* `TData`, `TResponse`

### 1.4. Clases CSS y Tailwind
*   **Selectores CSS Vanilla:** Usar siempre `kebab-case`.
    *   *Ejemplos:* `.btn-primary`, `.cart-drawer-open`

---

## 2. Nomenclatura en Control de Versiones (Git)

### 2.1. Ramas de Git (Branching)
Las ramas deben seguir una nomenclatura estándar basada en el propósito del cambio:
*   `feature/` + nombre corto descriptivo (para nuevas características).
    *   *Ejemplo:* `feature/menu-filters`
*   `bugfix/` + nombre corto descriptivo (para corregir fallos).
    *   *Ejemplo:* `bugfix/cart-calculation`
*   `docs/` + nombre corto descriptivo (para documentación).
    *   *Ejemplo:* `docs/repository-governance`
*   `refactor/` + nombre corto descriptivo (refactorizaciones aprobadas).
    *   *Ejemplo:* `refactor/api-mocks`

### 2.2. Mensajes de Commit (Conventional Commits)
Los mensajes de commit deben seguir estrictamente el estándar de Conventional Commits en minúsculas y estilo imperativo:
*   `feat:` + descripción (añadir nueva funcionalidad).
    *   *Ejemplo:* `feat: add custom ingredient selector to burger item`
*   `fix:` + descripción (corregir error).
    *   *Ejemplo:* `fix: resolve tax calculation rounding issue`
*   `docs:` + descripción (cambios solo en documentación).
    *   *Ejemplo:* `docs: add folder integrity laws document`
*   `style:` + descripción (cambios estéticos o de formateo sin impacto lógico).
    *   *Ejemplo:* `style: align tailwind classes on button component`
