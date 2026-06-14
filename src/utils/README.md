# Utilities — Pure Functions

This directory contains **pure utility functions** with no side effects.

- `@/lib/utils.ts` — Contains `cn()` for conditional Tailwind class merging (shadcn/ui convention)
- `@/utils/` — Reserved for domain-specific utility functions (formatters, validators, etc.)

**Conventions:**
- Functions must be pure (no side effects, no DOM access)
- Each file exports a single focused utility or related group
- Files use `camelCase` naming: `formatCurrency.ts`, `validateEmail.ts`

**PLACEHOLDER:** No utility functions have been created yet.
