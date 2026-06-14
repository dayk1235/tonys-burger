# BUSINESS REPORTS — Phase 4

**Status:** Implemented
**Last Updated:** 2026-06-13
**Phase:** PRODUCT_VISION Phase 4

---

## Purpose

Convert structured insights into business-readable reports. A restaurant owner should be able to read a report in under 2 minutes and understand:

- What happened?
- What attracted attention?
- What generated clicks?
- What should I pay attention to?

---

## Architecture

```
Events → Insights Engine → InsightsReport
                              ↓
                         Report Generator
                         ├─ daily.ts
                         ├─ weekly.ts
                         └─ summary.ts
                              ↓
                         BusinessReport
                              ↓
                         Formatter
                         ├─ JSON (structured data)
                         └─ Markdown (human-readable)
```

Reports consume **insights only** — they never read raw events. The report layer is a pure transformation from `InsightsReport` to `BusinessReport` + formatted output.

---

## Report Types

| Report | Period | Purpose |
| :--- | :--- | :--- |
| `generateDailyReport()` | Last 24 hours | Day-to-day pulse check |
| `generateWeeklyReport()` | Last 7 days | Weekly trends and performance |
| `generateSummaryReport()` | All time | High-level business health |

---

## Output Formats

### JSON
Machine-readable structured data. Suitable for APIs, dashboards, and programmatic consumption.

```json
{
  "meta": {
    "title": "Daily Report",
    "period": "daily",
    "generatedAt": "2026-06-14T12:00:00.000Z",
    "businessName": "Tony's Burger",
    "dateRange": "2026-06-13"
  },
  "insights": {
    "topProducts": [ ... ],
    "topCtas": [ ... ],
    "sectionPerformance": [ ... ],
    "conversionPaths": [ ... ],
    "engagementSummary": { ... }
  }
}
```

### Markdown
Human-readable formatted text. Suitable for email, Slack, or printing.

```markdown
# Daily Report — Tony's Burger

**Period:** 2026-06-13
**Generated:** 2026-06-14T12:00:00.000Z

## Summary
- **Total Sessions:** 145
- **Total Events:** 821
- **Most Viewed Product:** Doble Tony (36%)
- **Most Effective CTA:** WhatsApp (floating) (32 clicks)
- **Most Viewed Section:** Burger Assembly (31%)

## Top Products
| # | Product | Views | % |
|---|---|---|---|
| 1 | Doble Tony | 48 | 36% |
| 2 | Tony Classic | 24 | 18% |

## Top CTAs
| # | CTA | Clicks | % |
|---|---|---|---|
| 1 | WhatsApp (floating) | 32 | 41% |

## Section Performance
| # | Section | Views | % |
|---|---|---|---|
| 1 | Burger Assembly | 89 | 31% |

## Conversion Paths
| Path | Count |
|---|---|
| Hero → WhatsApp Click | 12 |
| Floating CTA → WhatsApp Click | 8 |
```

---

## File Structure

```
src/features/reports/
├── index.ts                     — Public API
├── types.ts                     — BusinessReport, ReportMeta, etc.
├── generators/
│   ├── daily.ts                 — generateDailyReport
│   ├── weekly.ts                — generateWeeklyReport
│   └── summary.ts               — generateSummaryReport
├── formatters/
│   └── markdown.ts              — toMarkdown
└── __tests__/
    └── validate.ts              — Validation with all 3 report types + formats
```

---

## Future Dashboard Integration

| Layer | Dashboard Role |
| :--- | :--- |
| `BusinessReport` | API payload returned by the dashboard backend |
| `toMarkdown()` | Drafting automated email reports |
| JSON output | Feeding dashboard widgets (products table, CTA bar chart, section ranking) |
| Report period (daily/weekly/summary) | Defining time-range selectors |

The reports layer produces structured data ready for any dashboard framework. No changes to report generators are needed — only the consumer changes.

---

## Future SaaS Integration

| Feature | SaaS Role |
| :--- | :--- |
| Report generators | Reused per tenant with injected tenant name |
| Markdown formatter | Email digests, Slack notifications |
| JSON output | REST API responses for third-party integrations |
| `ReportMeta.businessName` | Populated from tenant profile |
| `ReportMeta.dateRange` | Configurable per request |

---

## Ready for Real Traffic Trial?

**Yes.** The full pipeline is complete:

```
Events → LocalAnalyticsProvider → JsonAnalyticsProvider (file)
  → Insights Engine → InsightsReport
  → BusinessReport (JSON + Markdown)
  → Readable by business owner in under 2 minutes
```

To deploy for real traffic:
1. Replace `PLACEHOLDER.WHATSAPP_NUMBER` with real number
2. Point a domain to the deployment
3. Accumulate events for 24+ hours
4. Call the report generator to view results

---

## Validation

The validation script demonstrates all three report types in both JSON and Markdown formats. It reuses the existing `MockAnalyticsProvider` and `SAMPLE_EVENTS` fixtures from the Insights Engine.

```bash
# Requires a TypeScript runner
npx tsx src/features/reports/__tests__/validate.ts
```
