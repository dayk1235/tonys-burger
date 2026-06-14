# ANALYTICS PERSISTENCE — Storage Layer

**Status:** Implemented
**Last Updated:** 2026-06-13
**Phase:** PRODUCT_VISION Phase 3 / 4

---

## Purpose

Persist analytics events to durable storage so that business insights survive application restarts. Events generated today must exist tomorrow.

---

## Storage Strategy

```
Browser (AnalyticsTracker) 
  → LocalAnalyticsProvider (localStorage + API POST)
    → POST /api/analytics/track
      → JsonAnalyticsProvider
        → data/analytics/events.json
```

### Dual-Write Architecture

The `LocalAnalyticsProvider` writes every event to two locations:

| Location | Purpose | Latency |
| :--- | :--- | :--- |
| `localStorage` | Immediate client-side access, offline resilience | Sync |
| `data/analytics/events.json` | Durable persistence, survives restarts | Batched (2s intervals) |

### Why Dual-Write?

- **No interface changes** — `getStoredEvents()` and `clearEvents()` remain synchronous for the client
- **No breaking changes** — all existing hooks and components continue working
- **Resilience** — if the API endpoint is unavailable, events still accumulate in `localStorage`
- **Batched** — events are sent to the API in batches every 2 seconds, never blocking the UI

---

## Provider Architecture

| Provider | Runs On | Storage | Interface |
| :--- | :--- | :--- | :--- |
| `LocalAnalyticsProvider` | Browser | `localStorage` + API POST | `AnalyticsProvider` (sync) |
| `JsonAnalyticsProvider` | Server | `data/analytics/events.json` | `AnalyticsProvider` (sync) |
| `MockAnalyticsProvider` | Test | In-memory array | `AnalyticsProvider` (sync) |

### JsonAnalyticsProvider

Location: `src/lib/analytics/json-provider.ts`

- Reads/writes `data/analytics/events.json` using `node:fs`
- Creates the file and directory automatically if missing
- Returns an empty array on invalid JSON or missing file
- Synchronous API — compatible with the existing `AnalyticsProvider` interface

### API Routes

| Method | Route | Action | By |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/analytics/track` | Persist a batch of events | `LocalAnalyticsProvider` |
| `GET` | `/api/analytics/events` | Retrieve all stored events | Insights Engine / Admin |
| `DELETE` | `/api/analytics/events` | Clear all events | Debug / Reset |

---

## Storage Path

```
data/analytics/events.json
```

### File Format

```json
[
  {
    "event_name": "page_view",
    "timestamp": 1000,
    "session_id": "session-a",
    "device_type": "mobile",
    "metadata": {
      "url": "/",
      "referrer": "direct"
    }
  }
]
```

### Resilience

| Condition | Behavior |
| :--- | :--- |
| File does not exist | Created automatically with `[]` |
| File is empty | Treated as `[]` |
| File contains invalid JSON | Returns `[]`, no crash |
| Directory does not exist | Created automatically |
| Disk full / permission denied | Event silently dropped (try/catch) |

---

## Migration Path

### Current Phase 3/4 — File-Based

- All events are written to `data/analytics/events.json`
- Insights Engine reads from file via `JsonAnalyticsProvider`
- Good for single-business, single-server deployments
- No database dependency

### Future — Supabase

- Replace `JsonAnalyticsProvider` with `SupabaseAnalyticsProvider`
- Implements same `AnalyticsProvider` interface
- Events stored in `analytics_events` table
- `getStoredEvents()` queries Supabase with filters

### Future — Postgres

- Replace with `PostgresAnalyticsProvider`
- Same interface, different storage engine
- Enables SQL-based queries on events

### Future — SaaS Multi-Tenant

- `MultiTenantAnalyticsProvider` adds `tenant_id` to all queries
- Events are logically separated per business
- `getStoredEvents(tenantId)` filters by tenant

---

## Validation

Run the E2E validation script:

```bash
node scripts/validate-persistence.mjs
```

The script:
1. Writes 11 sample events (all 6 event types) to `data/analytics/events.json`
2. Reads them back and verifies structure
3. Shows event type distribution
4. Verifies events survive re-read (simulating restart)
5. Counts unique sessions
6. Clears the file and verifies emptiness
7. Exits with code 0 on success, code 1 on failure

### Type-Safe Validation

A TypeScript version exists at `src/features/analytics/__tests__/persistence-validate.ts` which is type-checked during `npm run build` and imports the actual `JsonAnalyticsProvider` and `InsightsEngine`.

---

## Future SaaS Relevance

| Feature | SaaS Role |
| :--- | :--- |
| `JsonAnalyticsProvider` | Replaced by tenant-aware database provider |
| `data/analytics/events.json` | Replaced by `analytics_events` table (Supabase/Postgres) |
| `/api/analytics/track` | Becomes authenticated, rate-limited, tenant-scoped |
| `/api/analytics/events` | Becomes filtered, paginated, tenant-scoped |
| `LocalAnalyticsProvider` dual-write | Replaced by direct database write from server |
| Batch flush (2s) | Replaced by streaming ingestion |

---

## Ready for TonyBot MVP?

**Yes.** The persistence layer gives TonyBot access to accumulated business data:

- "What's the most popular burger?" → Insights Engine > JsonAnalyticsProvider → report
- "Which section do people spend most time on?" → section performance generator
- "How do people typically reach the order page?" → conversion path generator
- All data survives restarts and accumulates over time

---

## File Inventory

| File | Purpose |
| :--- | :--- |
| `data/analytics/events.json` | Durable event storage |
| `src/lib/analytics/json-provider.ts` | Server-side file-based provider |
| `src/app/api/analytics/track/route.ts` | POST endpoint for batch tracking |
| `src/app/api/analytics/events/route.ts` | GET/DELETE endpoint for events |
| `src/features/analytics/provider.tsx` | Updated with dual-write to API |
| `scripts/validate-persistence.mjs` | Runnable E2E validation |
| `src/features/analytics/__tests__/persistence-validate.ts` | Type-checked TS validation |
