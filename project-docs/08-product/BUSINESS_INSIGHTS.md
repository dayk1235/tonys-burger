# BUSINESS INSIGHTS — Phase 4

**Status:** Implemented
**Last Updated:** 2026-06-13
**Phase:** PRODUCT_VISION Phase 4

---

## Purpose

Transform raw analytics events into actionable business knowledge. The Insights Engine sits between the Analytics Foundation (Phase 3) and future consumers (TonyBot, Knowledge Engine, SaaS reporting).

---

## Architecture

```
AnalyticsProvider (abstraction)
  ↓ getStoredEvents()
Insights Engine
  ├─ Top Products       ← burger_view
  ├─ Top CTAs           ← whatsapp_click + cta_click
  ├─ Section Performance ← section_view
  ├─ Conversion Paths   ← all events (session-grouped)
  └─ Engagement Summary ← aggregated from all generators
  ↓ InsightsReport (structured)
Consumer (TonyBot, Dashboard, etc.)
```

The engine depends only on the `AnalyticsProvider` interface (`getStoredEvents`). It does not import any UI, database, or framework code. The provider can be swapped between `LocalAnalyticsProvider`, a future database-backed provider, or a SaaS API — without changing insight logic.

---

## Insight Types

### 1. Top Products

- **Input:** `burger_view` events
- **Output:** Ranked list of burger names with view count and percentage
- **Business question:** What should be featured? What's underperforming?

### 2. Top CTAs

- **Input:** `whatsapp_click` + `cta_click` events
- **Output:** Ranked list of CTA labels/sources with click count and percentage
- **Business question:** Which CTA drives most conversions?

### 3. Section Performance

- **Input:** `section_view` events
- **Output:** Ranked list of sections with view count and percentage
- **Business question:** Which sections are most/least engaging?

### 4. Conversion Paths

- **Input:** All events, grouped by session
- **Output:** Common event sequences leading to a WhatsApp click
- **Business question:** How do users reach the order action?

### 5. Engagement Summary

- **Input:** Aggregated from all generators
- **Output:** Total events, unique sessions, top product, top CTA, top section
- **Business question:** At-a-glance health check

---

## Events Consumed

| Event | Used By |
| :--- | :--- |
| `page_view` | Conversion Paths, Engagement Summary |
| `burger_view` | Top Products, Engagement Summary |
| `section_view` | Section Performance, Engagement Summary |
| `whatsapp_click` | Top CTAs, Conversion Paths, Engagement Summary |
| `cta_click` | Top CTAs, Conversion Paths, Engagement Summary |
| `menu_click` | Conversion Paths |

---

## Output Format

All insights produce structured data (not strings) via the `InsightsReport` interface:

```typescript
interface InsightsReport {
  topProducts: TopProduct[];       // id, name, views, percentage
  topCtas: TopCta[];               // label, clicks, percentage
  sectionPerformance: SectionPerformance[]; // section, views, percentage
  conversionPaths: ConversionPath[]; // path[], count
  engagementSummary: EngagementSummary;   // totals + top entries
}
```

---

## File Structure

```
src/features/insights/
├── index.ts                         — Public API
├── insights-engine.ts               — Orchestrator (generateReport)
├── types.ts                         — Shared types
├── generators/
│   ├── top-products.ts              — getTopProducts
│   ├── top-cta.ts                   — getTopCtas
│   ├── section-performance.ts       — getSectionPerformance
│   ├── conversion-path.ts           — getConversionPaths
│   └── engagement-summary.ts        — getEngagementSummary
└── __tests__/
    ├── fixtures.ts                  — MockAnalyticsProvider + SAMPLE_EVENTS
    └── validate.ts                  — Validation script with assertions
```

---

## Example Output

```json
{
  "topProducts": [
    { "id": "doble-tony", "name": "Doble Tony", "views": 4, "percentage": 36 },
    { "id": "tony-classic", "name": "Tony Classic", "views": 2, "percentage": 18 }
  ],
  "topCtas": [
    { "label": "Pedir por WhatsApp", "clicks": 2, "percentage": 29 }
  ],
  "sectionPerformance": [
    { "section": "hero", "views": 3, "percentage": 43 }
  ],
  "conversionPaths": [
    { "path": ["WhatsApp Click"], "count": 1 },
    { "path": ["Section: hero", "WhatsApp Click"], "count": 1 }
  ],
  "engagementSummary": {
    "totalEvents": 23,
    "uniqueSessions": 4,
    "topProduct": { "id": "doble-tony", "name": "Doble Tony", "views": 4, "percentage": 36 },
    "topCta": { "label": "Pedir por WhatsApp", "clicks": 2, "percentage": 29 },
    "topSection": { "section": "hero", "views": 3, "percentage": 43 }
  }
}
```

---

## Future SaaS Role

In a SaaS context, the Insights Engine becomes a per-business report generator:

- Each business has its own `AnalyticsProvider` pointing to its event store
- `generateReport()` is called for a tenant ID, returning that business's insights
- Reports can be cached, scheduled, or streamed to dashboards
- The `DataSource` abstraction (currently `getStoredEvents()`) is replaced with a paginated, filtered query API

---

## Expansion Strategy

### Short-term (Current Phase 4)
- Five generators cover the essentials
- Validation fixtures exist for all generators
- Engine is type-safe and provider-agnostic

### Medium-term (Phase 5 — TonyBot)
- Insights become TonyBot's knowledge source for "what's popular?" questions
- The engine provides structured answers: "Our Doble Tony is the most viewed burger"
- No additional query logic needed in the chatbot for product insights

### Long-term (Phase 6 — Knowledge Engine)
- Insights Engine becomes a consumer/producer of the Knowledge Engine
- Products with low view counts can auto-flag for menu optimization
- Engagement trends feed into promotional recommendation rules

### Multi-Business (Phase 7)
- `generateReport` accepts a business/tenant ID
- Reports are generated independently per business
- Cross-business aggregate reports become possible

### SaaS (Phase 8)
- The engine is the backend for all analytics features
- Scheduled reports, email digests, and dashboard widgets all use the same `generateReport` function
- Third-party API consumers can request structured insights via REST endpoints

---

## Validation

Run validation with a TypeScript runner (e.g., `npx tsx`):

```bash
npx tsx src/features/insights/__tests__/validate.ts
```

The script:
1. Creates a `MockAnalyticsProvider` with 23 sample events across 4 sessions
2. Calls `generateReport()` to produce the full report
3. Prints all insight values to stdout
4. Asserts key metrics (product counts, percentages, session counts)
5. Exits with code 0 on success, code 1 on failure
