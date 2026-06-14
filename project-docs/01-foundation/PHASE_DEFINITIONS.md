# 21 - DEFINICIONES DE FASE (PHASE DEFINITIONS)

Este documento define con precisión qué trabajo está permitido y qué trabajo está prohibido durante cada fase del desarrollo de **Tony Burgers**. Cada fase tiene un propósito claro, metas medibles, entregables obligatorios y criterios de salida.

**Ley Aplicable:** LAW_026 — NO PHASE BLEEDING

---

## ÍNDICE DE FASES

- [PHASE 0 — Discovery](#phase-0--discovery)
- [PHASE 1 — Project Setup](#phase-1--project-setup)
- [PHASE 2 — Architecture](#phase-2--architecture)
- [PHASE 3 — Design System](#phase-3--design-system)
- [PHASE 4 — Core Components](#phase-4--core-components)
- [PHASE 5 — Page Assembly](#phase-5--page-assembly)
- [PHASE 6 — Responsive Design](#phase-6--responsive-design)
- [PHASE 7 — SEO](#phase-7--seo)
- [PHASE 8 — Performance](#phase-8--performance)
- [PHASE 9 — Testing](#phase-9--testing)
- [PHASE 10 — Deployment](#phase-10--deployment)

---

## PHASE 0 — Discovery

### Purpose
Definir la visión estratégica, el alcance del producto y los límites del proyecto.

### Goals
- Establecer el propósito del producto.
- Identificar el problema a resolver.
- Definir los usuarios objetivo.
- Determinar el alcance inicial y las exclusiones.

### Allowed Work
- Redacción de documentos de visión (`01_VISION.md`).
- Definición de mercado objetivo y perfiles de usuario.
- Investigación de competencia y referencias de diseño.
- Identificación de funcionalidades core y futuras.

### Forbidden Work
- Configuración técnica del proyecto.
- Instalación de dependencias.
- Escritura de código fuente.
- Creación de componentes o páginas.

### Required Deliverables
- `01_VISION.md`

### Exit Criteria
- Documento de visión aprobado.
- Stakeholders alineados en el alcance.

### Validation Requirements
- Revisión humana del documento de visión.

### Risk Controls
- Mantener el alcance acotado. No expandir funcionalidades no aprobadas.

---

## PHASE 1 — Project Setup

### Purpose
Inicializar el entorno de desarrollo, las herramientas y la configuración base del proyecto.

### Goals
- Crear el proyecto con Vite + React + TypeScript.
- Configurar Tailwind CSS.
- Establecer la configuración de TypeScript (strict mode).
- Verificar que el build inicial funciona.

### Allowed Work
- Inicialización del proyecto con Vite.
- Configuración de `tsconfig.json`, `vite.config.ts`, `postcss.config.js`.
- Instalación de dependencias base aprobadas (React, Tailwind, TypeScript).
- Creación de `index.html` y `main.tsx` básicos.

### Forbidden Work
- Definición de arquitectura de carpetas.
- Diseño de componentes o páginas.
- Implementación de lógica de negocio.
- Instalación de dependencias no aprobadas.

### Required Deliverables
- `package.json` configurado.
- Build exitoso (`npm run build`).
- Servidor de desarrollo funcional (`npm run dev`).

### Exit Criteria
- Proyecto compila sin errores.
- Servidor de desarrollo inicia correctamente.
- Configuración base de TypeScript y Tailwind verificada.

### Validation Requirements
- `npm run build` exitoso.
- `npx tsc --noEmit` sin errores.

### Risk Controls
- No instalar dependencias no listadas en `../00-governance/DEPENDENCY_POLICY.md`.
- Mantener versiones de Node.js, Vite y React dentro de los rangos aprobados.

---

## PHASE 2 — Architecture

### Purpose
Diseñar y documentar la arquitectura del proyecto, incluyendo estructura de carpetas, convenciones y flujo de datos.

### Goals
- Definir la estructura de directorios.
- Establecer convenciones de nomenclatura.
- Documentar el flujo de datos y las capas del sistema.
- Crear las leyes de gobernanza del repositorio.

### Allowed Work
- Creación de documentos de arquitectura (`02_ARCHITECTURE.md`).
- Definición de convenciones (`15_NAMING_CONVENTIONS.md`).
- Establecimiento de leyes de carpeta (`11_FOLDER_LAWS.md`).
- Creación de documentos de gobernanza (`12_REPOSITORY_GOVERNANCE.md`).
- Configuración de estructura de carpetas vacías.

### Forbidden Work
- Implementación de componentes.
- Diseño UI/UX.
- Lógica de negocio.
- Instalación de dependencias adicionales.

### Required Deliverables
- `02_ARCHITECTURE.md`
- `11_FOLDER_LAWS.md`
- `12_REPOSITORY_GOVERNANCE.md`
- `15_NAMING_CONVENTIONS.md`

### Exit Criteria
- Arquitectura documentada y aprobada.
- Navegabilidad de carpetas validada.
- Convenciones de nomenclatura establecidas.

### Validation Requirements
- Revisión humana de documentos de arquitectura.
- Verificación de consistencia entre documentos.

### Risk Controls
- No desviarse de la arquitectura modular Feature-Driven.
- Toda desviación requiere ADR.

---

## PHASE 3 — Design System 🔵 `[ACTIVE]`

### Purpose
Crear el sistema de diseño visual que garantice consistencia estética en toda la aplicación. Incluye tokens de diseño, componentes UI atómicos y temas.

### Goals
- Definir paleta de colores, tipografía, espaciado y sombras.
- Implementar componentes UI primitivos (Button, Input, Card, Badge, Modal).
- Soportar tema oscuro y claro.
- Establecer animaciones y transiciones base.

### Allowed Work
- Definición de tokens CSS en `src/index.css`.
- Creación de componentes en `src/components/ui/` (atómicos, sin lógica de negocio).
- Implementación de tema oscuro/claro (`ThemeContext`).
- Configuración de animaciones globales.

### Forbidden Work
- Componentes de negocio (menú, carrito, reservas).
- Lógica de negocio en componentes UI.
- Páginas completas.
- Integración con servicios o mocks.
- SEO, Performance, Testing.

### Required Deliverables
- Tokens de diseño documentados.
- Componentes UI: `Button`, `Input`, `Card`, `Badge`, `Modal`, `Select`.
- `ThemeContext` o sistema equivalente de temas.
- Animaciones base definidas.

### Exit Criteria
- Todos los componentes UI primitivos creados y funcionales.
- Tema oscuro y claro funcionales.
- Build exitoso sin errores.
- Documentación de componentes creada.

### Validation Requirements
- `npm run build` exitoso.
- `npx tsc --noEmit` sin errores.
- Verificación visual de componentes en ambos temas.

### Risk Controls
- No introducir lógica de negocio en componentes UI.
- No instalar librerías de UI externas (LAW_011).
- Mantener componentes puramente presentacionales.

### Examples

**Allowed:**
```tsx
// Componente UI puramente presentacional
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
}
export const Button = ({ variant, size, children }: ButtonProps) => {
  // Solo lógica de estilos, sin negocio
};
```

**Forbidden:**
```tsx
// ❌ Lógica de negocio en componente UI
export const Button = ({ productId }: { productId: string }) => {
  const { addToCart } = useCart(); // Violación: negocio en UI
  return <button onClick={() => addToCart(productId)}>Add</button>;
};
```

---

## PHASE 4 — Core Components

### Purpose
Implementar los componentes de negocio (features) que encapsulan la lógica de dominio del producto.

### Goals
- Crear componentes del menú (MenuGrid, MenuItemCard, IngredientSelector).
- Crear componentes del carrito (CartDrawer, CartSummary, CheckoutForm).
- Crear componentes de reservas (BookingCalendar, TableSelector).
- Crear componentes del panel admin (OrderManager, InventorySwitch).
- Implementar contextos de estado global y hooks.

### Allowed Work
- Creación de componentes en `src/components/features/`.
- Creación de hooks personalizados (`src/hooks/`).
- Creación de contextos de estado (`src/context/`).
- Implementación de servicios mock (`src/services/`).
- Definición de tipos (`src/types/`).
- Creación de utilidades (`src/utils/`).

### Forbidden Work
- Creación de páginas completas (Page Assembly es Phase 5).
- Optimización de rendimiento (Phase 8).
- Pruebas automatizadas (Phase 9).
- SEO (Phase 7).
- Diseño responsivo completo (Phase 6).
- Componentes UI nuevos (deben venir de Phase 3).

### Required Deliverables
- `src/components/features/menu/` — Componentes de menú.
- `src/components/features/cart/` — Componentes de carrito.
- `src/components/features/booking/` — Componentes de reservas.
- `src/components/features/admin/` — Componentes de administración.
- Hooks y contextos correspondientes.

### Exit Criteria
- Todos los componentes de feature creados y funcionales.
- Flujo de datos completo (hooks → context → services → localStorage).
- Build exitoso.

### Validation Requirements
- `npm run build` exitoso.
- Prueba manual de flujos de feature.
- Verificación de que los componentes UI de Phase 3 se reutilizan correctamente.

### Risk Controls
- No saltar a Page Assembly (Phase 5).
- No crear componentes UI nuevos si ya existen en Phase 3.
- No instalar dependencias sin aprobación.

---

## PHASE 5 — Page Assembly

### Purpose
Ensamblar las páginas completas de la aplicación combinando componentes de feature y layout.

### Goals
- Crear HomePage con hero, menú destacado y promociones.
- Crear MenuPage completa con filtros y búsqueda.
- Crear BookingPage con calendario y formulario de reserva.
- Crear AdminPage con panel de control.
- Configurar enrutamiento en `App.tsx`.

### Allowed Work
- Creación de páginas en `src/pages/`.
- Configuración de rutas en `App.tsx`.
- Integración de Layout, Navbar y Footer.
- Composición de componentes de feature en layouts de página.

### Forbidden Work
- Creación de nuevos componentes de feature (deben venir de Phase 4).
- Modificación del Design System (Phase 3).
- SEO (Phase 7).
- Performance tuning (Phase 8).

### Required Deliverables
- `HomePage.tsx`
- `MenuPage.tsx`
- `BookingPage.tsx`
- `AdminPage.tsx`
- Enrutamiento funcional en `App.tsx`

### Exit Criteria
- Todas las páginas son navegables.
- El flujo de usuario completo funciona (menú → carrito → checkout → reserva).
- Build exitoso.

### Validation Requirements
- Recorrido completo de flujos de usuario.
- `npm run build` exitoso.

### Risk Controls
- No modificar componentes de feature ya creados.
- No introducir nueva lógica de negocio en páginas (las páginas son contenedores).

---

## PHASE 6 — Responsive Design

### Purpose
Garantizar que la aplicación se vea y funcione correctamente en todos los tamaños de pantalla: móvil, tablet y desktop.

### Goals
- Validar todos los breakpoints (375px, 768px, 1024px, 1440px).
- Ajustar layouts para mobile-first.
- Optimizar interacciones táctiles para móvil.
- Verificar navegación en todos los dispositivos.

### Allowed Work
- Ajustes de clases Tailwind responsivas.
- Modificación de layouts para adaptación a pantallas.
- Mejoras de interacción táctil (touch targets, gestos).
- Pruebas en viewports variados.

### Forbidden Work
- Nuevos componentes.
- Nueva lógica de negocio.
- SEO (Phase 7).
- Performance optimization (Phase 8).

### Required Deliverables
- Aplicación funcional en todos los breakpoints.
- Menú de navegación responsive (hamburger menu en móvil).
- Tablas y grids adaptables.

### Exit Criteria
- Todas las páginas verificadas en mobile, tablet y desktop.
- Sin desbordamiento horizontal ni elementos superpuestos.
- Build exitoso.

### Validation Requirements
- Prueba visual en Chrome DevTools (375px, 768px, 1024px, 1440px).

### Risk Controls
- No rediseñar componentes completos.
- Los cambios deben ser incrementales sobre el diseño existente.

---

## PHASE 7 — SEO

### Purpose
Optimizar la aplicación para motores de búsqueda y mejorar la visibilidad en redes sociales.

### Goals
- Implementar meta tags descriptivos por página.
- Configurar Open Graph y Twitter Cards.
- Crear sitemap.xml.
- Configurar robots.txt.
- Mejorar accesibilidad semántica HTML.

### Allowed Work
- Adición de meta tags en `index.html` y por página.
- Configuración de Open Graph protocol.
- Creación de `sitemap.xml`.
- Creación de `robots.txt`.
- Mejoras de etiquetado semántico (header, main, section, article, etc.).

### Forbidden Work
- Performance tuning (Phase 8).
- Testing (Phase 9).
- Deployment (Phase 10).
- Nuevos componentes o funcionalidades.

### Required Deliverables
- Meta tags implementados.
- Open Graph tags funcionando.
- `sitemap.xml` generado.
- `robots.txt` configurado.

### Exit Criteria
- Auditoría SEO básica superada.
- Open Graph preview verificado.

### Validation Requirements
- Inspección de meta tags en navegador.
- Validación de sitemap.

### Risk Controls
- No modificar el contenido visual de la aplicación.
- Los cambios SEO no deben afectar la experiencia de usuario.

---

## PHASE 8 — Performance

### Purpose
Optimizar el rendimiento de la aplicación para garantizar tiempos de carga rápidos y una experiencia fluida.

### Goals
- Implementar lazy loading en rutas y componentes pesados.
- Optimizar imágenes (WebP, lazy loading, dimensiones correctas).
- Configurar code splitting.
- Minimizar bundle size.
- Alcanzar Lighthouse score ≥ 90.

### Allowed Work
- Code splitting con `React.lazy()` y `Suspense`.
- Optimización de assets (imágenes, fuentes).
- Memoización estratégica (`React.memo`, `useMemo`, `useCallback`).
- Análisis de bundle con herramientas de Vite.

### Forbidden Work
- Testing (Phase 9).
- Deployment (Phase 10).
- Nuevas funcionalidades.
- Refactorización no autorizada.

### Required Deliverables
- Lazy loading implementado en rutas.
- Imágenes optimizadas.
- Lighthouse score ≥ 90 en Performance, Accessibility, Best Practices y SEO.

### Exit Criteria
- Lighthouse score ≥ 90 en todas las categorías.
- Bundle size auditado y documentado.

### Validation Requirements
- `npx lighthouse` o Chrome DevTools Lighthouse.
- `npm run build` con reporte de bundle.

### Risk Controls
- No eliminar funcionalidad existente.
- Las optimizaciones no deben romper la UI.

---

## PHASE 9 — Testing

### Purpose
Establecer una suite de pruebas automatizadas que garantice la estabilidad y calidad del código.

### Goals
- Configurar Vitest como framework de testing.
- Escribir pruebas unitarias para utilidades y hooks.
- Escribir pruebas de integración para componentes críticos.
- Configurar pruebas E2E con Playwright o Cypress.
- Alcanzar cobertura ≥ 80% en componentes críticos.

### Allowed Work
- Instalación de dependencias de testing aprobadas.
- Creación de archivos de test (`*.test.ts`, `*.test.tsx`).
- Configuración de Vitest y testing library.
- Creación de pruebas E2E.

### Forbidden Work
- Deployment (Phase 10).
- Nuevas funcionalidades.
- Refactorización no autorizada.

### Required Deliverables
- Suite de tests configurada.
- Tests unitarios para utilidades.
- Tests de integración para componentes core.
- Tests E2E para flujos críticos.

### Exit Criteria
- Cobertura ≥ 80% en componentes críticos.
- Todos los tests pasan.
- `npm run test` exitoso.

### Validation Requirements
- `npm run test` — todos los tests pasan.
- `npm run test:coverage` — cobertura verificada.

### Risk Controls
- No modificar código de producción durante la fase de testing.
- Los tests deben ser deterministas.

---

## PHASE 10 — Deployment

### Purpose
Desplegar la aplicación a un entorno de producción accesible públicamente.

### Goals
- Configurar plataforma de hosting (Vercel, Netlify, etc.).
- Configurar CI/CD.
- Configurar dominio personalizado (opcional).
- Verificar despliegue en producción.

### Allowed Work
- Configuración de plataforma de hosting.
- Configuración de pipelines CI/CD.
- Configuración de DNS/dominio.
- Verificación post-despliegue.

### Forbidden Work
- Nuevas funcionalidades después del despliegue.
- Refactorización no autorizada.

### Required Deliverables
- Aplicación desplegada y accesible públicamente.
- Pipeline CI/CD funcional.
- Documentación de despliegue.

### Exit Criteria
- Aplicación accesible en URL pública.
- Build de producción exitoso.
- Verificación post-despliegue completada.

### Validation Requirements
- Verificación de URL pública.
- `npm run build` exitoso en entorno CI.

### Risk Controls
- No exponer información sensible en configuración.
- Tener estrategia de rollback preparada.

---

## 3. MATRIZ DE CONTROL POR FASE

| Fase | Estado | Creadr UI | Crear Features | Crear Páginas | SEO | Performance | Testing | Deploy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P0 Discovery | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| P1 Setup | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| P2 Architecture | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| P3 Design System | 🔵 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| P4 Core Components | ⚪ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| P5 Page Assembly | ⚪ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| P6 Responsive | ⚪ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| P7 SEO | ⚪ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| P8 Performance | ⚪ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| P9 Testing | ⚪ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| P10 Deploy | ⚪ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

**Legend:** ✅ = Permitido | ❌ = Prohibido | 🔵 = Activo | ⚪ = Futuro

---

## 4. REFERENCIAS

| Documento | Propósito |
| :--- | :--- |
| `./ROADMAP.md` | Mapa de ruta y estado de fases |
| `./DELIVERY_STRATEGY.md` | Estrategia de entrega |
| `12_REPOSITORY_GOVERNANCE.md` | Leyes de gobernanza |
