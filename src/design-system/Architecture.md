# Design System Architecture

## Purpose

This document describes the architecture of the Restaurant OS Design System. It explains how the modules relate to each other, how they depend on the vision documents, and how they should be extended.

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│               APPLICATIONS                   │
│  Dashboard  │  Landing  │  Owner App  │ ... │
├─────────────────────────────────────────────┤
│           DESIGN SYSTEM MODULES              │
│  primitives/  │  layouts/  │  feedback/     │
│  surfaces/  │  navigation/  │  hooks/       │
├─────────────────────────────────────────────┤
│            DESIGN SYSTEM CORE                │
│  tokens/  │  materials/  │  typography/     │
│  motion/  │  providers/                      │
├─────────────────────────────────────────────┤
│            VISION FOUNDATION                 │
│  Product Principles  │  Design Language      │
│  Material System  │  Visual System           │
│  Ambient Motion  │  Cognitive Behavioral     │
└─────────────────────────────────────────────┘
```

### Layer 1 — Vision Foundation (project-docs/00-vision/)

The vision documents define the "what" and "why" of the design system. Every token, material, and component must trace its origin to one of these documents.

### Layer 2 — Design System Core (src/design-system/)

The core implements the vision as code:

- **tokens/** — Raw values (colors, spacing, typography, motion, shadows). No logic. No components.
- **materials/** — Material hierarchy from the Material System. Types and validation only.
- **typography/** — Semantic role system for all text. Types and utilities.
- **motion/** — Motion hierarchy from the Ambient Motion System. Types and configuration.
- **providers/** — React context for design system state (reduced motion, motion scale).

### Layer 3 — Design System Modules (src/design-system/)

The modules build on the core to provide reusable infrastructure:

- **primitives/** — Minimal React components (Box, Flex, Center, Divider, VisuallyHidden). No styling opinions — just structure.
- **layouts/** — Layout utilities (Stack, Grid, Cluster, Center, Cover, Sidebar, Switcher). Generates Tailwind class strings.
- **surfaces/** — Surface definitions (card, panel, section, container, sheet). Type-safe surface selection.
- **feedback/** — Feedback state types (loading, empty, error, success, warning, info). Type definitions for state management.
- **navigation/** — Navigation types (items, breadcrumbs, tabs, pagination, steps). Type contracts for navigation components.
- **hooks/** — React hooks (useMediaQuery, useReducedMotion, useResponsive, useViewport). Bridge between DS and React.

### Layer 4 — Applications

Applications consume design system modules to build screens. They should never access Layer 1 directly — all design decisions are mediated through the design system.

## Dependency Rules

```
tokens/ (no dependencies)
  ↑
materials/ → tokens/
typography/ → tokens/
motion/ → tokens/
  ↑
primitives/ → tokens/
layouts/ → tokens/
surfaces/ → tokens/ → materials/
feedback/ → tokens/
navigation/ (no dependencies)
hooks/ (no dependencies)
providers/ → hooks/
  ↑
applications
```

1. **Tokens depend on nothing.** They are the foundation.
2. **Core modules (materials, typography, motion) depend only on tokens.**
3. **Module primitives depend only on core and tokens.**
4. **Providers may depend on hooks.**
5. **Applications depend on design system modules.**
6. **No module may depend on an application-specific feature.**

## Extension Guidelines

### Adding a new token category

1. Create the file in `tokens/` (e.g., `tokens/breakpoints.ts`).
2. Export from `tokens/index.ts`.
3. Update `Architecture.md` if the token type impacts the architecture.

### Adding a new typography role

1. Add the role to the `TypographyRole` union type in `typography/index.ts`.
2. Add its definition to `TYPOGRAPHY_ROLES`.
3. Add its Tailwind class mapping to `getRoleClasses()`.

### Adding a new motion role

1. Add the role to the `MotionRole` union type in `motion/index.ts`.
2. Add its definition to `MOTION_ROLES`.

### Adding a new surface

1. Add the type to the `SurfaceType` union type in `surfaces/index.ts`.
2. Add its definition to `SURFACES`.
3. Add its class mapping to `getSurfaceClasses()`.

### Adding a new primitive

1. Create the component file in `primitives/` (e.g., `primitives/Grid.tsx`).
2. Export from `primitives/index.tsx`.
3. Follow the primitive contract: no business logic, no page-specific styling, no restaurant assumptions.
4. Ensure keyboard navigation and screen reader support.
5. Respect reduced motion preferences.

### Adding a new hook

1. Add the hook function to `hooks/index.ts`.
2. Use `useSyncExternalStore` for subscription-based hooks to prevent tearing.
3. Provide a server snapshot function for SSR compatibility.

## Migration Strategy

Existing components can migrate to the design system incrementally:

1. **Phase 1 (current):** Infrastructure created. Existing components continue to work.
2. **Phase 2:** Replace hardcoded color values with `@design-system/tokens` references.
3. **Phase 3:** Replace hardcoded motion values with `@design-system/motion` references.
4. **Phase 4:** Replace layout classes with `@design-system/layouts` utilities.
5. **Phase 5:** Replace raw surfaces with `@design-system/surfaces` abstractions.
6. **Phase 6:** Build complete component library in `components/`.
