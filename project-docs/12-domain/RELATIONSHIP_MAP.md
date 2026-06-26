# RELATIONSHIP MAP

**Version:** 1.0
**Domain Module:** Restaurant OS — 12-domain

---

Canonical relationship diagram for every domain entity. All relationships follow Ubiquitous Language conventions.

---

## Entity Relationship Diagram

```
┌──────────────┐          ┌──────────────┐
│    Owner     │          │   Business   │
│              │          │              │
│ owns ────────┼──────────┼──┐           │
└──────────────┘          │  │           │
                          │  │ has       │
                          │  ▼           │
                          │  ┌─────────┐ │
                          │  │ Concept  │ │
                          │  └─────────┘ │
                          └──────┬───────┘
                                 │ has
                                 ▼
                    ┌──────────────────────┐
                    │     Restaurant        │
                    │                       │
                    │ location, hours,      │
                    │ concept, status       │
                    └─────┬────┬────┬──────┘
                          │    │    │
                    has   │    │    │  employs
                          │    │    │
               ┌──────────┘    │    └──────────┐
               ▼               ▼               ▼
     ┌─────────────────┐ ┌──────────┐ ┌──────────────┐
     │      Menu       │ │ Customer │ │   Employee    │
     │                 │ │ List     │ │              │
     │ categories,     │ │          │ │ role, wage,  │
     │ items, pricing  │ │          │ │ status       │
     └────────┬────────┘ └──────────┘ └──────┬───────┘
              │                              │
         has  │                    scheduled  │
              │                    on         │
              ▼                              ▼
     ┌─────────────────┐             ┌──────────┐
     │   Menu Item      │             │ Schedule │
     │                  │             │          │
     │ price, foodCost, │             │ week,    │
     │ category, status │             │ labor    │
     └────────┬─────────┘             └────┬─────┘
              │                            │
        has   │                    contains │
              ▼                            ▼
     ┌─────────────────┐             ┌──────────┐
     │     Recipe      │             │  Shift   │
     │                  │             │          │
     │ version, yield,  │             │ time,    │
     │ instructions     │             │ role     │
     └────────┬─────────┘             └──────────┘
              │
        uses  │
              ▼
     ┌───────────────────┐
     │  RecipeIngredient │
     │                   │
     │ quantity, unit,   │
     │ waste %           │
     └────────┬──────────┘
              │
        is    │
              ▼
     ┌────────────────┐     ┌──────────────────┐
     │   Ingredient    │<────│    Supplier       │
     │                 │     │                  │
     │ cost, par,      │     │ rating, terms,   │
     │ storage         │     │ contact, status  │
     └────────┬────────┘     └──────────────────┘
              │
        used  │
        in    │
              ▼
     ┌─────────────────────────┐
     │  Health Dimension       │
     │                         │
     │  dimension type,        │
     │  score, weight, vitals  │
     └──────────┬──────────────┘
                │
          has   │
                ▼
     ┌─────────────────────────┐
     │         Vital           │
     │                         │
     │  name, value, unit,     │
     │  threshold, trend       │
     └─────────────────────────┘
```

## Intelligence & Decision Relationship Diagram

```
┌──────────────────┐     ┌───────────────────┐
│    Business       │     │    Observation     │
│                   │     │                   │
│ observed ─────────┼─────┼── by              │
└──────────────────┘     └────────┬──────────┘
                                  │
                            feeds │
                                  ▼
                    ┌───────────────────────┐
                    │       Pattern          │
                    │                        │
                    │ correlation, strength, │
                    │ significance           │
                    └───────────┬────────────┘
                                │
                          leads │ to
                                ▼
                    ┌───────────────────────┐     ┌─────────────────────┐
                    │      Knowledge         │     │  Confidence          │
                    │                        │     │                     │
                    │ earned understanding   │     │ level, evidence     │
                    │ of business behavior   │     │ count               │
                    └───────────┬────────────┘     └─────────────────────┘
                                │
                          used  │ to generate
                                ▼
                    ┌──────────────────────────────────┐
                    │           Narrative               │
                    │                                   │
                    │ story combining observations,     │
                    │ patterns, and context             │
                    └───────────┬──────────────────────┘
                                │
                          feeds │
                                ▼
                    ┌──────────────────────┐
                    │   Recommendation      │
                    │                       │
                    │ title, body, priority,│
                    │ confidence, evidence  │
                    └───────────┬───────────┘
                                │
                          leads │ to
                                ▼
                    ┌──────────────────────┐
                    │   Experiment          │
                    │                       │
                    │ hypothesis, duration, │
                    │ metric, result        │
                    └───────────────────────┘
```

## Health & Customer Relationship Diagram

```
┌──────────────────┐
│   Customer        │
│                   │
│ name, segment,    │
│ lifetime value    │
└────────┬─────────┘
         │
    has  │
         ▼
┌──────────────────┐     ┌───────────────────┐
│      Visit       │     │   LoyaltyAccount   │
│                  │     │                   │
│ date, channel,   │     │ points, tier,     │
│ covers, total    │     │ rewards           │
└──────────────────┘     └───────────────────┘

┌──────────────────┐
│     Health        │
│                   │
│ score 0-100,      │
│ state, timestamp  │
└────────┬─────────┘
         │
   has   │
         ▼
┌───────────────────────────────┐
│      HealthDimension          │
│                               │
│  ┌──────┬──────┬──────┬─────┐ │
│  │Sales │Labor │Food  │Cust │ │
│  │      │      │Cost  │omer │ │
│  └──────┴──────┴──────┴─────┘ │
└──────────────┬────────────────┘
               │
          has  │
               ▼
       ┌──────────────┐
       │    Vital      │
       │              │
       │ value, unit, │
       │ threshold    │
       └──────────────┘
```

---

## Cross-Context Relationships

| Source Entity | Source Context | Relationship | Target Entity | Target Context | Cardinality | Description |
|---------------|---------------|--------------|---------------|----------------|-------------|-------------|
| Business | Business | has | Restaurant | Operations | 1..* | A business can have one or more locations |
| Business | Business | has | Health | Health | 1 | Every business has a health state |
| Business | Business | observed by | Observation | Intelligence | 0..* | System observes business activity |
| Restaurant | Operations | serves | Customer | Customer | 0..* | Customers visit restaurants |
| Restaurant | Operations | creates | Visit | Operations | 0..* | Visits happen at restaurants |
| Restaurant | Operations | employs | Employee | Operations | 1..* | Each restaurant has staff |
| Restaurant | Operations | operates | Menu | Operations | 1..* | Each restaurant has menus |
| Menu | Operations | contains | MenuItem | Operations | 1..30 | Menus have items with constraints |
| MenuItem | Operations | has | Recipe | Operations | 1 | Each item maps to a recipe |
| Recipe | Operations | uses | Ingredient | Supply | 1..* | Recipes use ingredients |
| Ingredient | Supply | sourced from | Supplier | Supply | 1..* | Ingredients come from suppliers |
| Ingredient | Supply | used in | Recipe | Operations | 0..* | Ingredients used across recipes |
| Visit | Operations | belongs to | Customer | Customer | 0..1 | Visits may be linked to known customers |
| Customer | Customer | linked to | Visit | Operations | 0..* | Customers have visit history |
| Observation | Intelligence | supports | Pattern | Intelligence | 0..* | Observations form patterns |
| Pattern | Intelligence | leads to | Knowledge | Intelligence | 0..* | Patterns create understanding |
| Knowledge | Intelligence | informs | Narrative | Experience | 0..* | Knowledge generates narratives |
| Narrative | Experience | generates | Recommendation | Decision | 0..* | Narratives drive recommendations |
| Recommendation | Decision | supported by | Evidence | Decision | 1..* | Recommendations cite evidence |
| Evidence | Decision | references | Observation | Intelligence | 1 | Evidence traces to observations |
| Health | Health | consumed by | Narrative | Experience | 0..* | Health data feeds narratives |
| Health | Health | consumed by | Recommendation | Decision | 0..* | Health data drives recommendations |

---

## Relationship Type Definitions

| Relationship | Meaning | Example |
|--------------|---------|---------|
| **has** | Owner contains child | Business has Restaurant |
| **belongs to** | Child's parent | MenuItem belongs to Menu |
| **employs** | Employer-employee | Restaurant employs Employee |
| **serves** | Service provider to receiver | Restaurant serves Customer |
| **uses** | Consumer uses resource | Recipe uses Ingredient |
| **sources from** | Procurement relationship | Ingredient sourced from Supplier |
| **creates** | Producer creates entity | Restaurant creates Visit |
| **observed by** | Subject of observation | Business observed by (Intelligence) |
| **informs** | Knowledge flows to | Knowledge informs Narrative |
| **generates** | Producer creates output | Narrative generates Recommendation |
| **supported by** | Depends on evidence | Recommendation supported by Evidence |
| **references** | Cites source | Evidence references Observation |
| **consumed by** | Read by downstream | Health consumed by Recommendation |

---

## Key Relationship Invariants

1. **Business → Restaurant**: Cascade deactivation. Closing Business closes all Restaurants.
2. **Restaurant → Menu**: Only one Active Menu per Restaurant at any time.
3. **Menu → MenuItem**: Max 30 items per Menu. MenuItem is always within a Menu.
4. **MenuItem → Recipe**: Currently 1:1. Future may support 1 Recipe : N MenuItems (catering).
5. **Restaurant → Employee**: Employee belongs to exactly one Restaurant. No cross-Restaurant employment in current scope.
6. **Visit → Customer**: Optional (0..1). Anonymous visits are valid. Identity resolution is eventual.
7. **Observation → Pattern → Knowledge**: Directed acyclic chain. Knowledge is never circular.
8. **Narrative → Recommendation**: One Narrative may produce zero or many Recommendations, but one Recommendation is generated from typically one Narrative.

---

*End of Relationship Map — Version 1.0*
