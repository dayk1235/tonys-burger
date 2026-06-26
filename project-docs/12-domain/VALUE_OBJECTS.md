# VALUE OBJECTS

**Version:** 1.0
**Domain Module:** Restaurant OS — 12-domain

---

Immutable concepts. Identity is defined by value, not by reference. Two value objects with the same properties are equal.

---

## Financial Value Objects

### Money

| Property | Value |
|----------|-------|
| **Components** | amount: Decimal, currency: CurrencyCode |
| **Validation** | amount ≥ 0; currency must be ISO 4217 |
| **Equality** | amount AND currency must match |
| **Used By** | Revenue, Food Cost, Labor Cost, Price, Margin |

| Operation | Result |
|-----------|--------|
| add(Money) | Money (same currency) |
| subtract(Money) | Money (same currency) |
| multiply(Decimal) | Money |
| percentageOf(Money) | Percentage |

### Percentage

| Property | Value |
|----------|-------|
| **Components** | value: Decimal (0–100) |
| **Validation** | 0 ≤ value ≤ 100 |
| **Used By** | Food Cost %, Labor Cost %, Margin %, Growth Rate |

### CurrencyCode

| Property | Value |
|----------|-------|
| **Components** | code: String (ISO 4217) |
| **Validation** | Must match ISO 4217; must be valid at time of use |
| **Used By** | Money |

### Price

| Property | Value |
|----------|-------|
| **Components** | amount: Money, effectiveDate: LocalDate, priceType: PriceType |
| **Used By** | Menu Item, Supplier |

### PriceType

| Property | Value |
|----------|-------|
| **Enum Values** | Standard, Promotional, HappyHour, Bulk, Wholesale |
| **Used By** | Price |

---

## Time Value Objects

### LocalDate

| Property | Value |
|----------|-------|
| **Components** | year: Integer, month: Integer, day: Integer |
| **Validation** | Must be a valid calendar date |
| **Used By** | Visit, Schedule, Event, Period |

### Period

| Property | Value |
|----------|-------|
| **Components** | start: LocalDate, end: LocalDate |
| **Validation** | end ≥ start; may represent past, present, or future |
| **Equality** | start AND end must match |
| **Used By** | Revenue period, reporting period, schedule period |

### TimeRange

| Property | Value |
|----------|-------|
| **Components** | start: LocalTime, end: LocalTime |
| **Validation** | end > start |
| **Used By** | Shift, HappyHour, ServicePeriod |

### DateRange

| Property | Value |
|----------|-------|
| **Components** | start: LocalDate, end: LocalDate |
| **Used By** | Promotions, Menu period, Seasonal menu |

---

## Health Value Objects

### HealthScore

| Property | Value |
|----------|-------|
| **Components** | value: Decimal (0–100) |
| **Validation** | 0 ≤ value ≤ 100; precision: one decimal place |
| **Immutability** | A HealthScore at a point in time is frozen. A new score produces a new object. |
| **Used By** | Health, Health Dimension |

### HealthStateLabel

| Property | Value |
|----------|-------|
| **Enum Values** | Excellent, Healthy, Stable, NeedsAttention, Critical |
| **Derivation** | HealthScore → HealthStateLabel mapping defined in Health Context |
| **Used By** | Health |

### Threshold

| Property | Value |
|----------|-------|
| **Components** | warning: Decimal, critical: Decimal, dimension: HealthDimensionType |
| **Used By** | Health Context |

### HealthDimensionType

| Property | Value |
|----------|-------|
| **Enum Values** | Sales, Labor, FoodCost, Customer, Operations, Growth |
| **Used By** | Health Dimension |

---

## Intelligence Value Objects

### Confidence

| Property | Value |
|----------|-------|
| **Components** | level: Decimal (0.0–1.0), evidenceCount: Integer |
| **Validation** | 0.0 ≤ level ≤ 1.0; precision: two decimal places |
| **Interpretation** | < 0.3 Low, 0.3–0.6 Medium, 0.7–0.9 High, > 0.9 Very High |
| **Used By** | Prediction, Recommendation, Observation |

### ConfidenceLevel

| Property | Value |
|----------|-------|
| **Enum Values** | VeryHigh, High, Medium, Low, Insufficient |
| **Derivation** | Computed from Confidence.level |
| **Used By** | Prediction, Recommendation |

### ObservationValue

| Property | Value |
|----------|-------|
| **Components** | value: String, unit: String (optional), dataType: DataType |
| **Validation** | Must conform to dataType constraints |
| **Used By** | Observation |

### DataType

| Property | Value |
|----------|-------|
| **Enum Values** | Currency, Percentage, Count, Ratio, Text, Date, Duration |
| **Used By** | ObservationValue |

### PatternStrength

| Property | Value |
|----------|-------|
| **Components** | correlation: Decimal (–1.0 to 1.0), sampleSize: Integer, significance: Decimal |
| **Validation** | -1.0 ≤ correlation ≤ 1.0 |
| **Used By** | Pattern |

### Trend

| Property | Value |
|----------|-------|
| **Components** | direction: TrendDirection, magnitude: Decimal, period: Period |
| **Used By** | Observation, Pattern, Narrative |

### TrendDirection

| Property | Value |
|----------|-------|
| **Enum Values** | Up, Down, Flat, Cyclical, Volatile |

---

## Customer Value Objects

### CustomerSegment

| Property | Value |
|----------|-------|
| **Enum Values** | New, Regular, VIP, AtRisk, Lapsed, HighValue |
| **Used By** | Customer |

### VisitChannel

| Property | Value |
|----------|-------|
| **Enum Values** | DineIn, Takeout, Delivery, Curbside, Catering, Events |
| **Used By** | Visit |

### VisitType

| Property | Value |
|----------|-------|
| **Enum Values** | Lunch, Dinner, Breakfast, LateNight, HappyHour |
| **Used By** | Visit |

---

## Operational Value Objects

### EmployeeRole

| Property | Value |
|----------|-------|
| **Enum Values** | Owner, GeneralManager, Manager, Server, Cook, Bartender, Host, Busser, Dishwasher |
| **Used By** | Employee |

### ScheduleStatus

| Property | Value |
|----------|-------|
| **Enum Values** | Scheduled, ClockedIn, OnBreak, ClockedOut, NoShow, Sick |
| **Used By** | Employee Shift |

### OrderStatus

| Property | Value |
|----------|-------|
| **Enum Values** | Placed, InProgress, Ready, Served, Paid, Closed |
| **Transitions** | Placed → InProgress → Ready → Served → Paid → Closed |
| **Used By** | Order |

### SupplierRating

| Property | Value |
|----------|-------|
| **Components** | reliability: Percentage, quality: Percentage, priceCompetitiveness: Percentage, overall: Decimal (1–5) |
| **Used By** | Supplier |

---

## Decision Value Objects

### RecommendationPriority

| Property | Value |
|----------|-------|
| **Enum Values** | Critical, High, Medium, Low, Informational |
| **Used By** | Recommendation |

### RecommendationCategory

| Property | Value |
|----------|-------|
| **Enum Values** | CostReduction, RevenueGrowth, Efficiency, Quality, Compliance, Strategic |
| **Used By** | Recommendation |

### ExperimentStatus

| Property | Value |
|----------|-------|
| **Enum Values** | Proposed, Active, Completed, Cancelled, Failed |
| **Transitions** | Proposed → Active → Completed; Proposed → Cancelled; Active → Failed |

---

## Communication Value Objects

### NarrativeTone

| Property | Value |
|----------|-------|
| **Enum Values** | Alert, Concerned, Neutral, Positive, Celebratory |
| **Used By** | Narrative, Daily Brief |

### CommunicationUrgency

| Property | Value |
|----------|-------|
| **Enum Values** | Immediate, Today, ThisWeek, ThisMonth, NoUrgency |
| **Used By** | Recommendation, Narrative |

---

## Relationship Value Objects

### RelationshipType

| Property | Value |
|----------|-------|
| **Enum Values** | Has, BelongsTo, Produces, Uses, Employs, Serves, SourcesFrom, References, Triggers, EvaluatedBy |
| **Used By** | Relationship Map |

---

## Validation Rules

All value objects enforce:
1. **Construction validation** — Reject invalid values at creation time
2. **Immutability** — No setters. Produce new instances for changes.
3. **Equality by value** — Same properties = same object for comparison purposes
4. **No identity** — Value objects do not have IDs

---

*End of Value Objects — Version 1.0*
