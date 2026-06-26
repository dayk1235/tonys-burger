# Dashboard — Business Intelligence Platform

## Purpose

This module prepares the architecture for a Business Intelligence Platform that serves restaurant owners. It is NOT a user-facing dashboard. It is the scalable foundation that will receive real business data after the owner discovery session.

## Architecture

The dashboard follows the same feature-first pattern as the existing analytics and insights modules.

```
dashboard/
├── components/       # UI components (future)
├── modules/          # Feature modules by domain (future)
├── services/         # Service contracts (interfaces only)
├── providers/        # React context providers (future)
├── hooks/            # Custom React hooks (future)
├── types/            # Reusable TypeScript interfaces
├── config/           # Module configuration and route definitions
└── README.md         # This file
```

## Responsibilities

- Provide extension points for future dashboard views
- Define contracts (service interfaces) without implementation
- Reuse existing analytics, insights, and reports modules rather than duplicating them
- Remain empty of business logic until real data is collected from the owner

## Extension Points

- `modules/` — One subdirectory per domain. Each is empty and ready for feature implementation after discovery.
- `services/` — Interfaces define the contract. Implementations will be created when data sources are known.
- `types/` — Generic interfaces that can be extended with real business properties.
- `config/dashboard-config.ts` — Module registry. Add new modules here as they are defined.

## Future Modules

| Directory | Purpose |
| :--- | :--- |
| `modules/overview` | High-level KPIs and summary |
| `modules/orders` | Order management and tracking |
| `modules/products` | Menu and product performance |
| `modules/customers` | Customer insights and segmentation |
| `modules/branches` | Multi-branch management |
| `modules/delivery` | Delivery channel analytics |
| `modules/marketing` | Campaign tracking |
| `modules/analytics` | Raw analytics exploration |
| `modules/insights` | Generated business insights |
| `modules/reports` | Scheduled and on-demand reports |
| `modules/promotions` | Promotion management |
| `modules/artificial-intelligence` | AI-powered features |
| `modules/settings` | Dashboard configuration |

## Relationship with Existing Modules

This module does NOT replace or duplicate:

- **`@/features/analytics`** — Event tracking, analytics provider, tracking hooks. The dashboard consumes analytics data through `AnalyticsRepository`.
- **`@/features/insights`** — Insights engine that generates reports from analytics data. The dashboard consumes insights through `InsightsRepository`.
- **`@/features/reports`** — Report generators and formatters. The dashboard consumes reports through `ReportsRepository`.

The dashboard is a consumer of these existing modules. It provides the presentation layer and domain-specific orchestration that is out of scope for the analytics pipeline.

## No Implementation

There is no implementation in this module. No UI. No business logic. No fake data. Only architecture.

Implementation depends on:

1. Owner discovery session (questions defined in `project-docs/09-discovery/DATA_REQUIREMENTS.md`)
2. Real data sources identified (POS, delivery apps, etc.)
3. Real business rules understood (KPIs, metrics, workflows)
