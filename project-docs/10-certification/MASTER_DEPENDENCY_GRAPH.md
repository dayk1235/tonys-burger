# MASTER DEPENDENCY GRAPH — Flow OS Complete

**Date:** 2026-06-28

---

## MODULE DEPENDENCY GRAPH (Simplified)

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                   → components/sections, components/layout
│   ├── layout.tsx                 → providers, features/living-background, features/analytics
│   ├── demo/page.tsx              → features/demo
│   ├── dashboard/page.tsx         → features/dashboard, core/runtime, features/engines
│   └── api/                       → core/runtime, core/engines
│
├── components/
│   ├── layout/LayoutShell.tsx     → components/layout/Navbar, Footer, ui/FloatingCta
│   ├── ui/                        → @/lib/utils (cn), @/constants/tokens
│   └── sections/                  → components/ui/*, @/content, @/animations
│
├── features/
│   ├── analytics/                 → (isolated — no internal imports)
│   │   └── types.ts               → (standalone)
│   ├── insights/                  → features/analytics/types.ts
│   ├── reports/                   → features/insights/types.ts
│   ├── dashboard/
│   │   ├── services/              → features/analytics, insights, reports types
│   │   └── components/            → features/engines/decision, core/runtime, localization
│   ├── engines/decision/          → @/demo, @/localization
│   ├── demo/                      → (standalone — demo data only)
│   └── living-background/         → @/experience
│
├── design-system/                 # LAYERED ARCHITECTURE
│   ├── tokens/                    → (zero dependencies)
│   ├── materials/                 → tokens/
│   ├── typography/                → tokens/
│   ├── motion/                    → tokens/
│   ├── primitives/                → tokens/, @/lib/utils ⚠️
│   ├── layouts/                   → tokens/
│   ├── surfaces/                  → tokens/, materials/
│   ├── feedback/                  → tokens/
│   ├── hooks/                     → (standalone)
│   ├── providers/                 → hooks/
│   └── index.ts                   → ALL (barrel export)
│
├── core/
│   ├── adapters/                  → (standalone — contract + registry)
│   ├── engines/
│   │   ├── observation/           → core/runtime (contracts), core/engines (events)
│   │   ├── pattern/               → observation events
│   │   ├── {engine}/              → runtime contracts, engine Events
│   │   └── execution/             → planning events (last in chain)
│   └── runtime/                   → (standalone — used by all engines)
│
├── providers/                     → core/runtime/RuntimeSingleton
├── animations/                    → gsap (external)
├── lib/                           → (standalone utilities)
├── localization/                  → (standalone — dictionary files)
├── types/                         → (standalone — design system types)
├── config/                        → (standalone — business config)
├── constants/                     → config/, (standalone)
└── hooks/                         → (empty — placeholder)
```

---

## CIRCULAR DEPENDENCY ANALYSIS

### Result: ZERO circular dependencies

Every module's import graph is a Directed Acyclic Graph (DAG). Verified by:
- Architecture audit script (`scripts/architecture-audit.ts`)
- Manual inspection of all import chains

### Dependency Chain Depth

| Chain | Depth | Path |
|-------|:-----:|------|
| app → dashboard → features → runtime → engines | 4 | Deepest |
| app → components → design-system → tokens | 3 | Standard |
| features → features → features | 2 | Feature chains |
| engines → engines (via EventBus) | 0 | **No direct imports** — event bus only |

---

## EXTERNAL DEPENDENCY GRAPH

```
RUNTIME DEPENDENCIES:
┌────────────────────────────────────────────────┐
│ next            16.2.9    │ React framework    │
│ react           19.2.4    │ UI library         │
│ react-dom       19.2.4    │ DOM renderer       │
├────────────────────────────────────────────────┤
│ @base-ui/react  1.5.0     │ Accessible UI     │
│ framer-motion   12.41.0   │ Animation library │
│ gsap            3.15.0    │ Scroll animations │
│ lucide-react    1.18.0    │ Icons             │
├────────────────────────────────────────────────┤
│ tailwindcss     ^4        │ CSS framework     │
│ clsx            2.1.1     │ Class merging     │
│ tailwind-merge  3.6.0     │ Class dedup       │
│ cva             0.7.1     │ Variant props     │
├────────────────────────────────────────────────┤
│ typescript      ^5        │ Language          │
│ eslint          ^9        │ Linting           │
│ tsx             4.22.4    │ TypeScript exec   │
│ vitest          4.1.9     │ Testing (unused)  │
└────────────────────────────────────────────────┘
```

### Dependency Count: 17 total (12 runtime + 5 dev)

---

## ENGINE DEPENDENCY GRAPH (via EventBus)

```
EVENT BUS (decoupling layer)
  ↑                    ↓
Observation ──→ Pattern ──→ Memory ──→ Knowledge ──→ Attention ──→ Reasoning
                                                                          ↓
          ┌────────────────────────────────────────────────────────────┐
          │                     Decision                                │
          │  (receives reasoning.lifecycle.completed)                   │
          └────────────────────────┬────────────────────────────────────┘
                                   ↓
          ┌────────────────────────────────────────────────────────────┐
          │                     Learning                                │
          │  (receives decision.lifecycle.initiated)                    │
          └────────────────────────┬────────────────────────────────────┘
                                   ↓
          ┌────────────────────────────────────────────────────────────┐
          │                    Prediction                               │
          │  (receives learning.lifecycle.completed)                    │
          └────────────────────────┬────────────────────────────────────┘
                                   ↓
          ┌────────────────────────────────────────────────────────────┐
          │                 Recommendation                              │
          │  (receives prediction.lifecycle.completed)                  │
          └────────────────────────┬────────────────────────────────────┘
                                   ↓
          ┌────────────────────────────────────────────────────────────┐
          │                     Planning                                 │
          │  (receives recommendation.lifecycle.completed)              │
          └────────────────────────┬────────────────────────────────────┘
                                   ↓
          ┌────────────────────────────────────────────────────────────┐
          │                    Execution                                 │
          │  (receives planning.lifecycle.completed)                    │
          └────────────────────────────────────────────────────────────┘
```

**Property:** No engine directly imports another engine. All communication is through the EventBus.

---

## DESIGN SYSTEM DEPENDENCY GRAPH

```
tokens/ (zero dependencies)
   │
   ├──→ materials/
   ├──→ typography/
   ├──→ motion/
   ├──→ primitives/ ──→ @/lib/utils ⚠️ (should be eliminated)
   ├──→ layouts/
   ├──→ surfaces/ ──→ materials/
   ├──→ feedback/
   │
   └─→ index.ts (master barrel)
```

---

## FEATURE MODULE DEPENDENCY GRAPH

```
analytics ──→ (isolated)
   │
   └──→ insights (type-only)
           │
           └──→ reports (type-only)
                    │
                    └──→ dashboard/services

dashboard ──→ features/engines/decision/types
           ──→ core/runtime/*
           ──→ localization
```

---

## RUNTIME DEPENDENCY GRAPH

```
Runtime.ts
  ├── RuntimeClock
  ├── RuntimeConfiguration
  ├── RuntimeLifecycle
  ├── EventBus
  ├── ContextBus
  ├── WorkingMemory
  ├── EngineRegistry
  ├── RuntimeRegistry
  ├── AuditPipeline
  ├── RecoveryPipeline
  ├── RuntimeScheduler
  ├── RuntimeMetrics
  └── RuntimeHealth

RuntimeSingleton.ts
  └── Runtime
        └── All 13 engines (via EngineLoader)
```

---

## MISSING DEPENDENCIES

| Capability | Dependency Needed | Status |
|------------|------------------|:------:|
| Database | PostgreSQL/MySQL driver, ORM | ❌ Missing |
| Auth | NextAuth/Auth.js, JWT library | ❌ Missing |
| WebSocket | Socket.IO, ws | ❌ Missing |
| External APIs | HTTP client (fetch is built-in) | ⚠️ Partial |
| Message Queue | Redis/Bull/AMQP | ❌ Missing |
| Testing (browser) | Playwright/Cypress | ❌ Missing |
| Monitoring | OpenTelemetry/Sentry | ❌ Missing |
| Rate limiting | express-rate-limit/upstash | ❌ Missing |
| CI/CD | GitHub Actions config | ❌ Missing |
| Docker | Dockerfile, compose.yaml | ❌ Missing |
