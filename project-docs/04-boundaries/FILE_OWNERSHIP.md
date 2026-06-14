# 18 - PROPIEDAD DE ARCHIVOS Y DOMINIOS (FILE OWNERSHIP)

Este documento asigna responsabilidad lógica y propietario técnico a cada área del repositorio **Tony Burgers**. Su función es garantizar que cada agente sepa exactamente a qué dominio pertenece cada archivo y quién es el responsable de aprobar cambios dentro de ese dominio.

---

## 1. Principio de Propiedad

La propiedad de un archivo no implica acceso exclusivo. Implica **responsabilidad de integridad y coherencia**. Cualquier agente puede proponer cambios en un dominio ajeno, pero debe declarar la intención en su Plan de Implementación y recibir aprobación explícita del propietario del dominio o del usuario humano.

---

## 2. Categorías de Dominio y Propietarios

### DOMINIO 1 — UI (Interfaz de Usuario)
**Ruta raíz:** `src/components/ui/`
**Responsabilidad:** Componentes atómicos sin estado de negocio (botones, inputs, badges, modals, cards). No contienen lógica, llamadas a servicios ni accesos a contextos globales.
**Propietario Lógico:** Agente de UI / Diseñador de Sistemas
**Archivos típicos:** `Button.tsx`, `Input.tsx`, `Badge.tsx`, `Modal.tsx`, `Skeleton.tsx`
**Impacto de un cambio:** Bajo — solo afecta apariencia o variantes del componente.

---

### DOMINIO 2 — Componentes de Negocio (Features)
**Ruta raíz:** `src/components/features/`
**Responsabilidad:** Implementación específica de las funcionalidades de negocio por dominio (`menu/`, `cart/`, `booking/`, `admin/`). Coordinan UI con estado, servicios y hooks.
**Propietario Lógico:** Agente de Feature / Desarrollador de Dominio
**Archivos típicos:** `MenuGrid.tsx`, `CartDrawer.tsx`, `BookingCalendar.tsx`, `OrderManager.tsx`
**Impacto de un cambio:** Medio — puede afectar flujos de usuario completos.

---

### DOMINIO 3 — Enrutamiento (Routing)
**Ruta raíz:** `src/App.tsx`, `src/pages/`
**Responsabilidad:** Definición de rutas de navegación y composición de páginas. Conecta el sistema de rutas con los componentes de feature.
**Propietario Lógico:** Agente de Arquitectura / Arquitecto Principal
**Archivos típicos:** `App.tsx`, `HomePage.tsx`, `MenuPage.tsx`, `BookingPage.tsx`, `AdminPage.tsx`
**Impacto de un cambio:** Alto — un error puede dejar rutas inaccesibles o romper la navegación global.

---

### DOMINIO 4 — Utilidades y Servicios (Utilities)
**Ruta raíz:** `src/utils/`, `src/services/`, `src/hooks/`
**Responsabilidad:** Lógica de negocio encapsulada, helpers de cálculo, persistencia en `localStorage` y custom hooks reutilizables. Sin dependencias de UI.
**Propietario Lógico:** Agente de Backend-for-Frontend / Ingeniero de Servicios
**Archivos típicos:** `formatCurrency.ts`, `localStorageService.ts`, `useCart.ts`, `useMenu.ts`, `calculateTax.ts`
**Impacto de un cambio:** Medio-Alto — una utilidad compartida puede afectar a múltiples features.

---

### DOMINIO 5 — Configuración del Proyecto (Configuration)
**Ruta raíz:** `/` (raíz), `src/index.css`
**Responsabilidad:** Archivos de configuración técnica del compilador, bundler, linter y sistema de estilos.
**Propietario Lógico:** Agente de Infraestructura / Arquitecto Principal
**Archivos típicos:** `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `eslint.config.js`, `index.css`
**Impacto de un cambio:** Crítico — cualquier error puede romper la compilación completa o el entorno de desarrollo.
> [!CAUTION]
> Toda modificación en este dominio requiere un ADR aprobado. Ver [ADR_GUIDELINES.md](../06-adr/ADR_GUIDELINES.md).

---

### DOMINIO 6 — Documentación del Proyecto (Documentation)
**Ruta raíz:** `project-docs/` (archivos `01_` al `20_`)
**Responsabilidad:** Toda la documentación organizacional, de visión, de arquitectura y de procesos del proyecto.
**Propietario Lógico:** Agente de Gobernanza / Principal Software Architect
**Archivos típicos:** `01_VISION.md`, `02_ARCHITECTURE.md`, `07_PROJECT_MEMORY.md`, `13_DECISION_LOG.md`
**Impacto de un cambio:** Medio — un error puede desorientar a futuros agentes y degradar la consistencia del equipo.

---

### DOMINIO 7 — Gobernanza y Control (Governance)
**Ruta raíz:** `AGENTS.md` (raíz), `project-docs/` (archivos de leyes y reglas)
**Responsabilidad:** Las reglas, leyes y restricciones que controlan el comportamiento de todos los agentes del repositorio.
**Propietario Lógico:** Arquitecto Principal / Supervisor Humano
**Archivos típicos:** `AGENTS.md`, `04_AI_RULES.md`, `12_REPOSITORY_GOVERNANCE.md`, `17_ESCALATION_PROTOCOL.md`
**Impacto de un cambio:** Crítico — modificar las reglas de gobernanza sin consenso puede deshabilitar las salvaguardas del sistema.
> [!CAUTION]
> Ningún agente de IA puede auto-modificar los archivos de gobernanza sin aprobación explícita del supervisor humano.

---

## 3. Matriz de Propiedad Consolidada

| Dominio | Ruta(s) | Propietario Lógico | Nivel de Riesgo | Requiere ADR |
| :--- | :--- | :--- | :--- | :--- |
| UI | `src/components/ui/` | Agente de UI | Bajo | No |
| Features | `src/components/features/` | Agente de Feature | Medio | Solo si nueva feature |
| Routing | `src/App.tsx`, `src/pages/` | Arquitecto Principal | Alto | Sí |
| Utilities | `src/utils/`, `src/services/`, `src/hooks/` | Ing. de Servicios | Medio-Alto | Solo si nueva abstracción |
| Configuration | `/`, `src/index.css` | Agente de Infra | Crítico | **Siempre** |
| Documentation | `project-docs/*.md` | Agente de Gobernanza | Medio | No (solo reporte) |
| Governance | `AGENTS.md`, reglas | Supervisor Humano | Crítico | **Siempre** |

---

## 4. Registro de Nuevos Propietarios (Extensibilidad)

Cuando se incorpore un nuevo agente o módulo al proyecto, debe seguir el siguiente proceso de alta en este documento:

1.  Identificar el dominio más cercano a su responsabilidad en la tabla de la sección 3.
2.  Si el dominio no existe, proponer la creación de un nuevo dominio en un **ADR** antes de editar este archivo.
3.  Actualizar la sección correspondiente de este archivo documentando: ruta raíz, responsabilidad, archivos típicos e impacto de cambio.
4.  Registrar el cambio en el Registro de Decisiones ([DECISION_LOG.md](../03-memory/DECISION_LOG.md)).
