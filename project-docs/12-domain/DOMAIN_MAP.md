# DOMAIN MAP — Bounded Contexts

**Version:** 1.0
**Domain Module:** Restaurant OS — 12-domain

---

## Context Map

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Business       │     │   Operations      │     │   Financial      │
│   Context        │────>│   Context         │<────│   Context        │
│                  │     │                   │     │                  │
│ Owner, Business, │     │ Restaurant, Menu, │     │ Revenue, Costs,  │
│ Brand, Concept   │     │ Recipe, Employee  │     │ Margin, P&L      │
└────────┬─────────┘     └────────┬──────────┘     └──────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Health         │     │   Intelligence   │     │   Customer       │
│   Context        │     │   Context        │     │   Context        │
│                  │     │                  │     │                  │
│ HealthScore,     │     │ Observation,     │     │ Customer,        │
│ Dimension,       │     │ Pattern,         │     │ Segment,         │
│ Vital, State     │     │ Knowledge,       │     │ Loyalty, Visit   │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                   │
                                   │
                                   ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Decision       │<────│   Experience     │     │   Supply         │
│   Context        │     │   Context        │     │   Context        │
│                  │     │                  │     │                  │
│ Recommendation,  │     │ Daily Brief,     │     │ Supplier,        │
│ Prediction,      │     │ Narrative,       │     │ Ingredient,      │
│ Experiment       │     │ Timeline         │     │ Delivery, Order  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## Bounded Context Details

### 1. Business Context

| Property | Value |
|----------|-------|
| **Purpose** | Defines the business entity itself, its identity, ownership, and lifecycle. |
| **Responsibility** | Creating and managing Business entities; Owner identity and onboarding; multi-restaurant hierarchy. |
| **Aggregates** | Business |
| **Entities** | Business, Owner |
| **Value Objects** | BusinessStatus, ConceptType |
| **Events** | BusinessRegistered, BusinessActivated, BusinessSuspended, BusinessClosed, OwnerChanged |
| **Dependencies** | None (foundational context) |
| **Depended By** | All contexts |
| **UI Concepts** | Business setup, Owner profile, subscription management |

### 2. Operations Context

| Property | Value |
|----------|-------|
| **Purpose** | Core restaurant operations: what is sold, how it is produced, who produces it, and when it happens. |
| **Responsibility** | Menu management, recipe management, employee management, scheduling, and daily operations. |
| **Aggregates** | Restaurant, Menu, Recipe, Ingredient, Visit, Employee, Schedule |
| **Entities** | Restaurant, MenuItem, RecipeIngredient, Shift, Department |
| **Value Objects** | EmployeeRole, ScheduleStatus, OrderStatus, VisitChannel, VisitType, PriceType |
| **Events** | MenuPublished, MenuItemPriceChanged, RecipeVersioned, EmployeeHired, EmployeeTerminated, SchedulePublished, ShiftChanged |
| **Dependencies** | Business Context |
| **Depended By** | Financial Context, Health Context, Customer Context, Supply Context |
| **UI Concepts** | Menu builder, recipe editor, schedule manager, employee directory |

### 3. Customer Context

| Property | Value |
|----------|-------|
| **Purpose** | Understanding and managing customers, their behavior, segmentation, and loyalty. |
| **Responsibility** | Customer identity resolution, segmentation, loyalty programs, feedback management, visit history. |
| **Aggregates** | Customer |
| **Entities** | Customer, LoyaltyAccount |
| **Value Objects** | CustomerSegment |
| **Events** | CustomerIdentified, CustomerSegmentChanged, VIPStatusAchieved, AtRiskDetected, CustomerLapsed |
| **Dependencies** | Operations Context (Visits) |
| **Depended By** | Intelligence Context, Experience Context |
| **UI Concepts** | Customer profiles, segment breakdowns, loyalty dashboard |

### 4. Financial Context

| Property | Value |
|----------|-------|
| **Purpose** | Tracking, analyzing, and reporting financial performance and health. |
| **Responsibility** | Revenue tracking, cost analysis (food, labor), margin calculation, P&L reports, period comparisons. |
| **Aggregates** | (Reads from Operations — no primary aggregates in this context) |
| **Entities** | (Calculated reports — no primary entities) |
| **Value Objects** | Money, Percentage, Period, Price |
| **Events** | RevenueThresholdReached, FoodCostWarning, MarginDeclineDetected |
| **Dependencies** | Operations Context (sales, labor data) |
| **Depended By** | Health Context, Decision Context |
| **UI Concepts** | P&L view, cost breakdowns, revenue reports, period comparison |

### 5. Health Context

| Property | Value |
|----------|-------|
| **Purpose** | Measuring, communicating, and tracking the overall health of the business across all dimensions. |
| **Responsibility** | Health score calculation, dimension weighting, threshold management, health state derivation, trend analysis. |
| **Aggregates** | Health |
| **Entities** | HealthDimension, Vital |
| **Value Objects** | HealthScore, HealthStateLabel, Threshold |
| **Events** | HealthScoreChanged, HealthStateChanged, DimensionDeclined, CriticalThresholdReached, HealthImproved |
| **Dependencies** | Operations Context, Financial Context, Customer Context |
| **Depended By** | Intelligence Context, Experience Context |
| **UI Concepts** | Health gauge, dimension breakdown, health history, state transitions |

### 6. Intelligence Context

| Property | Value |
|----------|-------|
| **Purpose** | Observing the business, detecting patterns, building knowledge, and generating understanding. |
| **Responsibility** | Business Pulse, observation capture, signal detection, pattern recognition, knowledge accumulation, memory management, narrative generation. |
| **Aggregates** | Observation |
| **Entities** | (Observation, Pattern, Knowledge — event-sourced) |
| **Value Objects** | Confidence, ObservationValue, PatternStrength, Trend, TrendDirection |
| **Events** | ObservationRecorded, SignalDetected, PatternConfirmed, KnowledgeEarned, NarrativeGenerated |
| **Dependencies** | Business Context, Operations Context, Financial Context, Health Context, Customer Context |
| **Depended By** | Decision Context, Experience Context |
| **UI Concepts** | Business Pulse, timeline, pattern discovery, knowledge base |

### 7. Decision Context

| Property | Value |
|----------|-------|
| **Purpose** | Generating recommendations, predictions, and experiments that help the Owner make better decisions. |
| **Responsibility** | Recommendation generation, prediction modeling, experiment design, evidence tracking, confidence calibration. |
| **Aggregates** | Recommendation |
| **Entities** | Evidence |
| **Value Objects** | RecommendationPriority, RecommendationCategory, ExperimentStatus |
| **Events** | RecommendationCreated, RecommendationAccepted, RecommendationRejected, RecommendationExpired, ExperimentProposed, ExperimentCompleted |
| **Dependencies** | Intelligence Context |
| **Depended By** | Experience Context |
| **UI Concepts** | Recommendations list, prediction view, experiment tracker |

### 8. Experience Context

| Property | Value |
|----------|-------|
| **Purpose** | Shaping how the Owner experiences Restaurant OS: the Daily Brief, narratives, timeline, and communication design. |
| **Responsibility** | Daily Brief composition, narrative tone selection, timeline rendering, silence management, freshness signaling, communication strategy. |
| **Aggregates** | Narrative |
| **Entities** | (Narrative — no persistent entities beyond ephemeral narratives) |
| **Value Objects** | NarrativeTone, CommunicationUrgency |
| **Events** | DailyBriefGenerated, TimelineUpdated, NarrativeExpired |
| **Dependencies** | Intelligence Context, Decision Context, Health Context, Timeline Context |
| **Depended By** | Owner (human) |
| **UI Concepts** | Daily Brief, timeline, activity feed, notification preferences |

### 9. Supply Context

| Property | Value |
|----------|-------|
| **Purpose** | Managing suppliers, ingredient procurement, inventory, and deliveries. |
| **Responsibility** | Supplier management, ingredient catalog (shared), purchase orders, delivery tracking, inventory management. |
| **Aggregates** | Supplier, Ingredient |
| **Entities** | Supplier, Ingredient, PurchaseOrder, Delivery |
| **Value Objects** | SupplierRating, UnitOfMeasure, StorageType |
| **Events** | SupplierAdded, SupplierRatingChanged, IngredientPriceChanged, DeliveryExpected, DeliveryReceived, InventoryLow, StockOut |
| **Dependencies** | Operations Context (Recipe uses Ingredient) |
| **Depended By** | Financial Context (Food Cost) |
| **UI Concepts** | Supplier directory, ingredient catalog, inventory dashboard, ordering |

### 10. Timeline Context (Cross-Cutting)

| Property | Value |
|----------|-------|
| **Purpose** | Providing chronological context for every event, observation, and decision. |
| **Responsibility** | Event ordering, timeline queries, activity display, temporal context for narratives. |
| **Aggregates** | (No primary aggregates — reads events from all contexts) |
| **Entities** | (Event store — append-only) |
| **Value Objects** | (No unique value objects — uses Event from all contexts) |
| **Events** | (Consumes all events — no unique events) |
| **Dependencies** | All contexts (event producers) |
| **Depended By** | Experience Context |
| **UI Concepts** | Timeline view, event log, activity feed |

---

## Context Dependency Graph

```
Business ──────────┬──────────────────────────────────────┐
                   │                                      │
                   ▼                                      ▼
            Operations ──────────┬──────────┐      Experience
                   │             │          │           │
          ┌────────┼──────┐      │          │           │
          ▼        ▼      ▼      ▼          │           │
     Financial  Customer  Supply  Health ───┼───────────┘
          │        │               │        │
          └────────┴───────────────┴───▶ Intelligence
                                              │
                                              ▼
                                          Decision
                                              │
                                              ▼
                                        Experience
```

**Key Rule:** No circular dependencies between contexts. All dependency arrows point one direction.

---

*End of Domain Map — Version 1.0*
