# Restaurant OS Design System

The permanent design foundation for every current and future Restaurant OS interface.

## Philosophy

Restaurant OS Design System transforms the philosophical vision documents into reusable product infrastructure. Every token, component, and pattern in this system traces its origin to a defined principle in one of the vision documents.

### Core Documents

| Document | Design System Module |
| :--- | :--- |
| Material System | `materials/` — Material hierarchy and validation |
| Visual System | `tokens/`, `typography/`, `surfaces/` — Visual foundation |
| Ambient Motion System | `motion/`, `hooks/useReducedMotion` — Motion hierarchy |
| Cognitive Behavioral System | `feedback/`, `layouts/` — Cognitive patterns |
| Design Language | `primitives/`, `providers/` — Interface building blocks |
| Product Principles | All modules — Every decision is a product decision |

## Modules

```
src/design-system/
├── tokens/          # Design token constants (colors, spacing, typography, shadows, motion)
├── materials/       # Material abstraction layer (Material System hierarchy)
├── typography/      # Typography roles system (semantic text roles)
├── motion/          # Motion roles system (Ambient Motion hierarchy)
├── surfaces/        # Surface abstractions (card, panel, container types)
├── layouts/         # Layout primitive utilities (Stack, Grid, Cluster, Center)
├── primitives/      # Low-level React components (Box, Flex, Center, Divider, VisuallyHidden)
├── feedback/        # Feedback state abstractions (loading, empty, error, success)
├── navigation/      # Navigation abstraction types (nav items, breadcrumbs, tabs)
├── hooks/           # Design system hooks (media queries, reduced motion, responsive)
├── providers/       # Design system providers (DesignSystemProvider, MotionContext)
├── README.md        # This file
└── Architecture.md  # Architecture documentation
```

## Usage

### Tokens

```ts
import { brand, spacing, duration } from "@/design-system/tokens";

// Access brand colors
const primaryRed = brand.primary; // "#8B1A1A"

// Access spacing scale
const cardPadding = spacing[6]; // "1.5rem"

// Access motion tokens
const fastAnim = duration.fast; // "100ms"
```

### Typography Roles

```ts
import { TYPOGRAPHY_ROLES, getRoleClasses } from "@/design-system/typography";

// Get Tailwind classes for a role
const classes = getRoleClasses("display"); // "font-heading font-bold text-5xl"

// Access role definition
const role = TYPOGRAPHY_ROLES.body;
// { role: "body", family: "sans", weight: "400", size: "1rem", ... }
```

### Motion Roles

```ts
import { getMotionConfig, getTransitionCss } from "@/design-system/motion";

// Get animation configuration
const config = getMotionConfig("enter");
// { duration: "500ms", easing: "cubic-bezier(...)", respectsReducedMotion: true }

// Get CSS transition value
const transition = getTransitionCss("stateChange", ["opacity", "transform"]);
```

### Primitives

```tsx
import { Box, Flex, Center, Divider } from "@/design-system/primitives";

<Flex direction="row" gap="4" align="center">
  <Box as="section">
    <Center maxWidth="narrow">
      <p>Content</p>
      <Divider />
    </Center>
  </Box>
</Flex>
```

### Hooks

```ts
import { useMediaQuery, useReducedMotion, useResponsive } from "@/design-system/hooks";

const isDesktop = useResponsive("lg");
const prefersReduced = useReducedMotion();
```

### Provider

```tsx
import { DesignSystemProvider } from "@/design-system/providers";

// Wrap your app
<DesignSystemProvider>
  <App />
</DesignSystemProvider>
```

## Rules

1. **Every primitive must be reusable.** No page-specific logic. No business logic.
2. **Every primitive must follow the vision documents.** Materials, Visual System, Ambient Motion, Cognitive Behavioral System, Product Principles.
3. **No duplicated styling.** All token values are defined once in `tokens/`.
4. **No restaurant-specific assumptions.** The design system works for any business vertical.
5. **No hardcoded color values.** All colors are imported from `@/design-system/tokens/colors`.
6. **No hardcoded timing values.** All durations and easings come from `@/design-system/tokens/motion`.
7. **Accessibility is not optional.** All components must work with keyboard navigation and screen readers.
8. **Reduced motion is required.** Every animation must respect `prefers-reduced-motion`.

## Future Modules

Planned expansions (not yet implemented):

- `components/` — Complete component library (buttons, inputs, cards, modals)
- `patterns/` — Common interaction patterns (forms, searches, filters)
- `templates/` — Page-level templates (dashboard, settings, detail view)
- `icons/` — Restaurant OS icon library
- `colors/` — Color utility functions (contrast, accessibility, palette generation)
