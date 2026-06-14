# 02 - ARQUITECTURA Y ESTRUCTURA DEL PROYECTO

Este documento define la estructura de directorios, convenciones de nomenclatura y el flujo de datos del proyecto **Tony Burgers**. Su cumplimiento es obligatorio para asegurar la mantenibilidad y consistencia del código.

---

## 1. Tech Stack Oficial

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| Framework | Next.js (App Router) | 16.x |
| Lenguaje | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui (Radix primitives) | latest |
| Animaciones | GSAP + ScrollTrigger | 3.x |
| Iconos | Lucide React | latest |
| Package Manager | pnpm | 10.x |
| Deployment | Vercel | — |

---

## 2. Estructura de Directorios

El proyecto sigue una arquitectura modular dentro de Next.js App Router.

```text
/ (Raíz del proyecto)
├── project-docs/              # Documentación de gobernanza y arquitectura
├── public/                    # Recursos estáticos (imágenes, fuentes, PDFs)
│   ├── fonts/                 # Fuentes self-hosted (futuro)
│   └── images/                # Imágenes del sitio (futuro)
├── src/                       # Código fuente
│   ├── app/                   # Next.js App Router
│   │   ├── globals.css        # Tokens de diseño y estilos globales
│   │   ├── layout.tsx         # Root layout (fonts, navbar, footer, providers)
│   │   └── page.tsx           # Home page shell
│   ├── components/
│   │   ├── ui/                # shadcn/ui + componentes atómicos (sin lógica de negocio)
│   │   ├── layout/            # Componentes de layout (Navbar, Footer)
│   │   ├── sections/          # Componentes de sección de página (Hero, Menu, Gallery)
│   │   └── features/          # Componentes de feature por dominio
│   │       └── chatbot/       # Preparación de chatbot (implementación futura)
│   ├── animations/            # Arquitectura de animaciones GSAP
│   │   ├── hero/              # Animaciones de hero section (futuro)
│   │   ├── scroll/            # Scroll-triggered animations (futuro)
│   │   ├── hover/             # Hover interaction animations (futuro)
│   │   ├── transitions/       # Page/component transitions (futuro)
│   │   ├── timelines/         # Complex timeline compositions (futuro)
│   │   ├── useGsapAnimation.ts # Core GSAP hook
│   │   └── index.ts           # Barrel export
│   ├── content/               # Sistema de contenido con placeholders
│   │   └── placeholders.ts    # Constantes PLACEHOLDER_ para todo el contenido
│   ├── config/                # Configuración centralizada del negocio
│   │   ├── business.ts        # BUSINESS_CONFIG — fuente única de datos del negocio
│   │   └── index.ts           # Barrel export
│   ├── constants/             # Constantes y configuración
│   │   ├── tokens.ts          # Design tokens en TypeScript
│   │   ├── site.ts            # Configuración del sitio (consume BUSINESS_CONFIG)
│   │   └── index.ts           # Barrel export
│   ├── hooks/                 # Custom hooks (barrel export)
│   │   └── index.ts           # Barrel export
│   ├── lib/                   # Utilidades de librerías
│   │   └── utils.ts           # cn() utility de shadcn/ui
│   ├── providers/             # React context providers
│   │   └── index.tsx          # Providers wrapper shell
│   └── types/                 # TypeScript type definitions
│       ├── design-system.ts   # Tipos de design tokens
│       └── index.ts           # Barrel export
├── .env.example               # Variables de entorno (template)
├── next.config.ts             # Configuración de Next.js
├── tsconfig.json              # Configuración de TypeScript
├── eslint.config.mjs          # Configuración de ESLint
├── postcss.config.mjs         # Configuración de PostCSS
├── components.json            # Configuración de shadcn/ui
└── package.json               # Dependencias y scripts
```

---

## 3. Convenciones de Nombres

| Tipo de Archivo / Directorio | Convención | Ejemplo |
| :--- | :--- | :--- |
| **Directorios** | `kebab-case` | `components/ui`, `project-docs` |
| **Componentes React (.tsx)** | `PascalCase` | `Button.tsx`, `Navbar.tsx`, `HeroSection.tsx` |
| **Páginas de Ruta (.tsx)** | `PascalCase` o `page.tsx` | `page.tsx`, `layout.tsx` |
| **Hooks personalizados (.ts)** | `camelCase` con prefijo `use` | `useGsapAnimation.ts` |
| **Utilidades y Servicios (.ts)** | `camelCase` | `utils.ts`, `placeholders.ts` |
| **Constantes (.ts)** | `camelCase` o `SCREAMING_SNAKE` | `tokens.ts`, `SITE_CONFIG`, `PLACEHOLDER_` |
| **Tipos e Interfaces (.ts)** | `PascalCase` (sin prefijos como "I") | `BrandColor`, `SpacingToken` |
| **Estilos (.css)** | `globals.css` | `globals.css` |

---

## 4. Flujo de Datos

```mermaid
graph TD
    subgraph App_Router [Next.js App Router]
        Page[page.tsx - Home Page] --> Section[components/sections/HeroSection]
        Layout[layout.tsx - Root Layout] --> Nav[components/layout/Navbar]
        Layout --> Footer[components/layout/Footer]
    end

    subgraph Design_System [Design System]
        Styles[globals.css - Tokens CSS] --> UI[components/ui - shadcn/ui]
        Constants[constants/tokens.ts - Tokens TS] --> UI
        Fonts[layout.tsx - next/font] --> Styles
    end

    subgraph Config [Business Config Layer]
        Config[config/business.ts - BUSINESS_CONFIG] --> Layout
        Config --> Nav
        Config --> Footer
        Config --> Section
    end

    subgraph Content [Content Layer]
        Content[content/placeholders.ts - Placeholder Content] --> Section
    end

    subgraph Animation [Animation Layer]
        GSAP[animations/useGsapAnimation - GSAP Hook] --> Section
    end

    subgraph Providers [State Layer]
        Providers[providers/index.tsx - Provider Wrapper] --> Layout
    end
```

### Reglas de Flujo de Datos:
1. **Design Tokens:** Definidos en `globals.css` (CSS) y `constants/tokens.ts` (TypeScript). Ambas fuentes deben mantenerse sincronizadas.
2. **Business Config:** Toda la información operativa del negocio (nombre, teléfono, email, dirección, horario, redes sociales, WhatsApp) vive en `config/business.ts` como `BUSINESS_CONFIG`. Es la fuente única de verdad.
3. **Placeholder Content:** El contenido de marketing y copy (`PLACEHOLDER`) en `content/placeholders.ts` es independiente de `BUSINESS_CONFIG`. Contiene textos de secciones, descripciones de productos y elementos de UI copy.
4. **UI Components:** Sin lógica de negocio. Son puramente presentacionales.
5. **Layout Shell:** Navbar y Footer son componentes de layout que envuelven todas las páginas.
6. **Animations:** La arquitectura de GSAP está preparada pero no implementada. El hook `useGsapAnimation` proporciona los métodos reutilizables.
7. **Providers:** El wrapper de providers está listo para aceptar ThemeProvider, CartProvider, etc. cuando se implementen.

---

## 5. Leyes de Gobernanza Arquitectónica (Obligatorio)

Estas leyes guían la evolución física del repositorio y prevalecen sobre cualquier decisión temporal:

### LAW_006 - FOLDER INTEGRITY LAW
La arquitectura de carpetas es sagrada.
Prohibido:
- Crear carpetas arbitrarias.
- Crear carpetas duplicadas.
- Crear variantes.
Antes de crear una carpeta:
1. Justificar necesidad.
2. Actualizar ARCHITECTURE.md.
3. Actualizar PROJECT_MEMORY.md.

### LAW_009 - SINGLE RESPONSIBILITY LOCATION
Una responsabilidad.
Una ubicación.
Un lugar obvio.

### LAW_015 - ARCHITECTURE OVER CONVENIENCE
La conveniencia temporal nunca justifica romper la arquitectura.

### LAW_031 - DOCUMENTATION STRUCTURE IS ARCHITECTURE
La organización de la documentación es parte de la arquitectura del repositorio.
