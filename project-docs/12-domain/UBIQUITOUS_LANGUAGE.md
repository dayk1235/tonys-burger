# RESTAURANT OS — Ubiquitous Language

**Version:** 1.0
**Canonical Source:** Domain Model (this document)
**Purpose:** Official vocabulary of Restaurant OS. Every term has exactly one definition. Every implementation, screen, API, engine, and AI reasoning process uses these terms with their canonical meaning.

---

## Usage Rules

1. Every concept has **exactly one definition**. No synonyms.
2. Every concept has exactly **one owner** (a bounded context).
3. **Forbidden synonyms** must never appear in code, UI, or documentation.
4. When a term appears in UI copy, it must match the canonical definition's communication guidelines.
5. New terms require ADR approval and must be added to this document.

---

## Core Concepts

### Business

| Property | Value |
|----------|-------|
| **Definition** | A single restaurant operation that generates revenue, incurs costs, and employs people. The atomic unit of the Restaurant OS platform. |
| **Purpose** | The primary entity that Restaurant OS serves. Everything exists to help the Business succeed. |
| **Owner** | Business Context |
| **Related** | Restaurant, Branch, Owner, Team, Customer |
| **Forbidden** | Account, Tenant, Organization, Company |

### Restaurant

| Property | Value |
|----------|-------|
| **Definition** | The physical or operational location where the Business serves customers. A Business may have multiple Restaurants. |
| **Purpose** | Represents a specific location with its own menu, staff, suppliers, and financial performance. |
| **Owner** | Business Context |
| **Related** | Business, Branch, Location |
| **Forbidden** | Store, Outlet, Venue |

### Owner

| Property | Value |
|----------|-------|
| **Definition** | The human decision-maker responsible for the Business. Not an analyst. Not a data scientist. A business operator. |
| **Purpose** | The primary user of Restaurant OS. The platform exists to serve the Owner. |
| **Owner** | Business Context |
| **Related** | Business, Manager, Team |
| **Forbidden** | User, Customer (of the platform), Admin |

### Team

| Property | Value |
|----------|-------|
| **Definition** | The group of people employed by the Business who execute operations. Includes managers, cooks, servers, bartenders, hosts, bussers, dishwashers. |
| **Purpose** | The human capital of the Business. A major cost center and the primary determinant of operational quality. |
| **Owner** | Operations Context |
| **Related** | Employee, Manager, Role, Schedule |
| **Forbidden** | Staff (acceptable in UI, not in domain model), Headcount |

### Customer

| Property | Value |
|----------|-------|
| **Definition** | A person who purchases food or beverage from the Restaurant. Not a user of Restaurant OS. |
| **Purpose** | The revenue source. Customer behavior, satisfaction, and retention drive business outcomes. |
| **Owner** | Customer Context |
| **Related** | Visit, Segment, Review, Loyalty |
| **Forbidden** | Guest (acceptable in UI), Patron, Client |

---

## Health Concepts

### Health

| Property | Value |
|----------|-------|
| **Definition** | A single score (0–100) representing the overall condition of the Business. Aggregated from multiple dimensions. |
| **Purpose** | The primary signal the Owner sees. Answers "Is my business okay?" in one glance. |
| **Owner** | Health Context |
| **Related** | Health State, Health Dimension, Vital |
| **Forbidden** | Dashboard, KPI, Metric (as a replacement for Health) |

### Health State

| Property | Value |
|----------|-------|
| **Definition** | A categorical label derived from the Health score. One of: Excellent, Healthy, Stable, Needs Attention, Critical. |
| **Purpose** | Communicates urgency and emotional tone without requiring interpretation. |
| **Owner** | Health Context |
| **Related** | Health, Health Dimension |
| **Forbidden** | Status, Grade, Rating |

### Health Dimension

| Property | Value |
|----------|-------|
| **Definition** | A sub-score that contributes to overall Health. Examples: Sales, Labor, Food Cost, Customer. |
| **Purpose** | Provides decomposition. The Owner taps Health to see what is driving the score. |
| **Owner** | Health Context |
| **Related** | Health, Vital |
| **Forbidden** | Category, Pillar, Metric Group |

### Vital

| Property | Value |
|----------|-------|
| **Definition** | A single measured value within a Health Dimension. Example: Food Cost Percentage = 31%. |
| **Purpose** | The atomic unit of health data. Vitals are measured, not calculated. |
| **Owner** | Health Context |
| **Related** | Health Dimension, Metric |
| **Forbidden** | KPI, Metric (vague), Datapoint |

---

## Intelligence Concepts

### Observation

| Property | Value |
|----------|-------|
| **Definition** | A verified fact about the business captured by the system. "Lunch covers declined 22% in February." |
| **Purpose** | The atomic unit of knowledge. Observations are earned, never assumed. |
| **Owner** | Intelligence Context |
| **Related** | Signal, Pattern, Evidence |
| **Forbidden** | Factoid, Data Point (in UI), Stat |

### Signal

| Property | Value |
|----------|-------|
| **Definition** | An Observation that indicates a potential pattern. A signal is not yet confirmed — it requires validation. |
| **Purpose** | The raw material for pattern detection. Signals become patterns when they repeat with consistency. |
| **Owner** | Intelligence Context |
| **Related** | Observation, Pattern, Noise |
| **Forbidden** | Alert, Warning, Notification |

### Pattern

| Property | Value |
|----------|-------|
| **Definition** | A recurring relationship between Observations. "Lunch traffic declines when construction is active within 2 blocks." |
| **Purpose** | Patterns are the basis for predictions and recommendations. They represent understanding. |
| **Owner** | Intelligence Context |
| **Related** | Signal, Observation, Learning |
| **Forbidden** | Trend (trend is a value object, not a concept), Insight |

### Knowledge

| Property | Value |
|----------|-------|
| **Definition** | Verified understanding that the system has earned through observation, pattern detection, and confirmation. |
| **Purpose** | The permanent store of what the system knows. Knowledge is never assumed — it is always earned. |
| **Owner** | Intelligence Context |
| **Related** | Learning, Memory, Observation |
| **Forbidden** | Data (raw data is not knowledge), Information (vague), AI Training Data |

### Learning

| Property | Value |
|----------|-------|
| **Definition** | The process of acquiring new Knowledge through observation, experimentation, and validation. |
| **Purpose** | How Restaurant OS improves over time. Learning is continuous and never stops. |
| **Owner** | Intelligence Context |
| **Related** | Knowledge, Memory, Experiment |
| **Forbidden** | Training, ML Model (implementation detail), AI |

### Memory

| Property | Value |
|----------|-------|
| **Definition** | The system's stored history of Observations, Patterns, and Learning. Memory is persistent and queryable. |
| **Purpose** | Enables the system to reference past events when evaluating current situations. |
| **Owner** | Intelligence Context |
| **Related** | Knowledge, Timeline, Event |
| **Forbidden** | Database, Cache, History Log |

### Narrative

| Property | Value |
|----------|-------|
| **Definition** | A structured story that communicates business understanding to the Owner. Combines Observation + Pattern + Context + Recommendation. |
| **Purpose** | Narratives are the output of the Intelligence Loop. They transform data into understanding. |
| **Owner** | Intelligence Context |
| **Related** | Recommendation, Explanation, Daily Brief |
| **Forbidden** | Report, Dashboard, Summary |

### Business Pulse

| Property | Value |
|----------|-------|
| **Definition** | The system's continuous assessment of the Business's vital state. Pulse is always active, always watching. |
| **Purpose** | Represents the system's awareness. Pulse detects changes, evaluates significance, and triggers responses. |
| **Owner** | Intelligence Context |
| **Related** | Health, Observation, Event |
| **Forbidden** | Status Monitor, System Health |

---

## Decision Concepts

### Recommendation

| Property | Value |
|----------|-------|
| **Definition** | A suggested action presented to the Owner with reasoning, expected impact, and confidence level. |
| **Purpose** | The primary output of the platform. Recommendations help the Owner make better decisions. |
| **Owner** | Decision Context |
| **Related** | Prediction, Experiment, Narrative |
| **Forbidden** | Suggestion (too weak), Alert (different), Insight |

### Prediction

| Property | Value |
|----------|-------|
| **Definition** | A forecast of a future business outcome. Always includes confidence level and expiration. |
| **Purpose** | Reduces uncertainty. Allows the Owner to plan with more confidence. |
| **Owner** | Decision Context |
| **Related** | Recommendation, Confidence, Forecast |
| **Forbidden** | Guess, Estimate (without confidence), Projection |

### Experiment

| Property | Value |
|----------|-------|
| **Definition** | A structured test of a hypothesis with defined duration, success metric, and expected outcome. |
| **Purpose** | Enables the Owner to try changes with measured results. Reduces risk of untested decisions. |
| **Owner** | Decision Context |
| **Related** | Recommendation, Hypothesis, Prediction |
| **Forbidden** | Test, Pilot, A/B Test (too narrow) |

### Confidence

| Property | Value |
|----------|-------|
| **Definition** | The system's expressed certainty in its own output. Always communicated alongside predictions and recommendations. |
| **Purpose** | Enables the Owner to calibrate their response. High confidence = act. Low confidence = verify. |
| **Owner** | Decision Context |
| **Related** | Prediction, Recommendation, Evidence |
| **Forbidden** | Accuracy (different), Certainty (absolute), Score |

### Evidence

| Property | Value |
|----------|-------|
| **Definition** | The specific Observations and Patterns that support a Recommendation or Prediction. |
| **Purpose** | Makes every recommendation explainable. The Owner can trace any recommendation to its underlying data. |
| **Owner** | Decision Context |
| **Related** | Observation, Pattern, Recommendation |
| **Forbidden** | Reason (acceptable), Justification, Proof |

---

## Operational Concepts

### Visit

| Property | Value |
|----------|-------|
| **Definition** | A single Customer interaction with the Restaurant. Includes dine-in, takeout, and delivery. |
| **Purpose** | The atomic revenue event. Everything starts with a Visit. |
| **Owner** | Operations Context |
| **Related** | Customer, Revenue, Cover, Ticket |
| **Forbidden** | Transaction, Order, Sale |

### Cover

| Property | Value |
|----------|-------|
| **Definition** | One guest served. A single Visit can have multiple Covers. |
| **Purpose** | Used for capacity planning, labor forecasting, and performance comparison. |
| **Owner** | Operations Context |
| **Related** | Visit, Table Turn, Seat |
| **Forbidden** | Head, Person, Guest (in data contexts) |

### Menu

| Property | Value |
|----------|-------|
| **Definition** | The collection of products (food and beverage) offered by the Restaurant, organized by categories and seasons. |
| **Purpose** | Defines what the Restaurant sells. Menu design directly impacts food cost, labor, and customer satisfaction. |
| **Owner** | Operations Context |
| **Related** | Menu Item, Category, Recipe, Price |
| **Forbidden** | Product Catalog, Offerings |

### Menu Item

| Property | Value |
|----------|-------|
| **Definition** | A single product sold on the Menu. Has a price, food cost, ingredients, and preparation requirements. |
| **Purpose** | The unit of revenue generation. Menu Item performance drives menu decisions. |
| **Owner** | Operations Context |
| **Related** | Menu, Recipe, Ingredient, Price |
| **Forbidden** | Dish, Plate, SKU (implementation concern) |

### Recipe

| Property | Value |
|----------|-------|
| **Definition** | The specification for producing a Menu Item. Includes ingredients, quantities, method, and cooking time. |
| **Purpose** | Controls food cost, consistency, and quality. The source of truth for what goes into a dish. |
| **Owner** | Operations Context |
| **Related** | Menu Item, Ingredient, Food Cost |
| **Forbidden** | Formula, Specification |

### Ingredient

| Property | Value |
|----------|-------|
| **Definition** | A raw material used in Recipes. Sourced from Suppliers. Has a unit cost and usage rate. |
| **Purpose** | The atomic unit of food cost. Ingredient price changes directly affect margin. |
| **Owner** | Operations Context |
| **Related** | Recipe, Supplier, Food Cost |
| **Forbidden** | Raw material, Component |

### Supplier

| Property | Value |
|----------|-------|
| **Definition** | An external business that provides Ingredients or other goods to the Restaurant. |
| **Purpose** | A critical dependency. Supplier reliability, pricing, and quality directly affect operations. |
| **Owner** | Operations Context |
| **Related** | Ingredient, Price, Delivery |
| **Forbidden** | Vendor (acceptable), Distributor (specific type) |

---

## Financial Concepts

### Revenue

| Property | Value |
|----------|-------|
| **Definition** | Total income from all channels (dine-in, takeout, delivery, events, bar) before any deductions. |
| **Purpose** | The top-line measure of business activity. |
| **Owner** | Financial Context |
| **Related** | Visit, Average Check, Channel |
| **Forbidden** | Sales, Income, Turnover |

### Food Cost

| Property | Value |
|----------|-------|
| **Definition** | The cost of ingredients sold, expressed as a percentage of Revenue. |
| **Purpose** | A primary Health dimension and the most controllable major cost. |
| **Owner** | Financial Context |
| **Related** | Recipe, Ingredient, Supplier, Margin |
| **Forbidden** | COGS, Cost of Goods, Product Cost |

### Labor Cost

| Property | Value |
|----------|-------|
| **Definition** | Total cost of Team compensation (wages, salaries, taxes, benefits), expressed as a percentage of Revenue. |
| **Purpose** | The largest expense for most restaurants. A critical Health dimension. |
| **Owner** | Financial Context |
| **Related** | Team, Employee, Schedule, Margin |
| **Forbidden** | Payroll (one component), Staff Cost |

### Margin

| Property | Value |
|----------|-------|
| **Definition** | The difference between Revenue and a specific cost category, expressed as a percentage or absolute value. |
| **Purpose** | Measures profitability at various levels: gross margin, contribution margin, net margin. |
| **Owner** | Financial Context |
| **Related** | Revenue, Food Cost, Labor Cost, Profit |
| **Forbidden** | Spread, Profit (profit is the final margin) |

---

## Time Concepts

### Event

| Property | Value |
|----------|-------|
| **Definition** | Something that happened at a specific point in time that is relevant to the Business. |
| **Purpose** | Events drive the Timeline. They explain why the business looks the way it does. |
| **Owner** | Timeline Context |
| **Related** | Timeline, Observation, Activity |
| **Forbidden** | Occurrence, Incident |

### Timeline

| Property | Value |
|----------|-------|
| **Definition** | The chronological sequence of Events and Observations that tell the story of the Business. |
| **Purpose** | Provides context. The Owner can understand how the business arrived at its current state. |
| **Owner** | Timeline Context |
| **Related** | Event, Activity, Narrative |
| **Forbidden** | History, Feed, Log |

### Activity

| Property | Value |
|----------|-------|
| **Definition** | Recent operational actions visible on the Timeline. "While you were away, 23 orders were fulfilled." |
| **Purpose** | Communicates that the system is alive and watching. A living system signal. |
| **Owner** | Timeline Context |
| **Related** | Timeline, Event, Freshness |
| **Forbidden** | Notification (different concept), Update |

---

## Experience Concepts

### Daily Brief

| Property | Value |
|----------|-------|
| **Definition** | The primary daily communication from the system to the Owner. Contains one primary narrative and supporting context. |
| **Purpose** | The Owner's first touchpoint. Sets the tone for the day's decisions. |
| **Owner** | Experience Context |
| **Related** | Narrative, Recommendation, Health |
| **Forbidden** | Dashboard, Summary, Report, Newsletter |

### Freshness

| Property | Value |
|----------|-------|
| **Definition** | An indicator of how recently data was updated. Communicated through natural language ("Updated moments ago"). |
| **Purpose** | Proves the system is alive and watching. Builds trust through presence. |
| **Owner** | Experience Context |
| **Related** | Activity, Timeline, Living System |
| **Forbidden** | Timestamp (in UI), Last Updated, Sync Status |

### Silence

| Property | Value |
|----------|-------|
| **Definition** | The deliberate absence of communication from the system. Silence means "everything is fine." |
| **Purpose** | Reduces noise. Trains the Owner that no news is good news. |
| **Owner** | Experience Context |
| **Related** | Notification, Calm Technology |
| **Forbidden** | No data, Nothing to report, Empty state |

---

## Source Documents

This vocabulary was extracted from:
1. The Constitution of Restaurant OS
2. Product Principles
3. Business Intelligence Fabric
4. Business Knowledge Graph
5. Cognitive Behavioral System
6. Restaurant Health
7. Design Language
8. Business Bible (Via Trattoria)

No term was invented. Every term is justified by at least one source document.

---

*End of Ubiquitous Language — Version 1.0*
