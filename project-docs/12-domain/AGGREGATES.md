# AGGREGATES AND ENTITIES

**Version:** 1.0
**Domain Module:** Restaurant OS — 12-domain

---

Every Aggregate is a transactional consistency boundary. Every Aggregate Root is the single entry point for all modifications to entities within its boundary.

---

## 1. Business Aggregate

### Aggregate Root: Business

| Property | Type | Description |
|----------|------|-------------|
| businessId | UUID | Unique identity |
| name | String | Business legal name |
| concept | String | Restaurant concept (e.g., Via Trattoria) |
| ownerId | Owner (reference) | The Owner responsible for this Business |
| establishedDate | LocalDate | When operations began |
| taxId | String (encrypted) | Tax identifier |
| status | BusinessStatus | Active, Suspended, Closed |

**Bounded Context:** Business Context
**Invariants:**
- A Business must have exactly one Owner at any time
- A Business must have at least one Restaurant to be Active
- A Business cannot be deleted; can only transition to Closed

**Lifecycle:**
```
Registered → Active → Suspended → Active
           → Closed (terminal)
```

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| Restaurant | has | 1..* |
| Owner | has | 1 |
| Team | has | 1..* |
| CustomerList | has | 0..1 |

---

## 2. Restaurant Aggregate

### Aggregate Root: Restaurant

| Property | Type | Description |
|----------|------|-------------|
| restaurantId | UUID | Unique identity |
| businessId | Business (reference) | Parent Business |
| name | String | Location name |
| address | Address | Physical location |
| phone | String | Contact number |
| concept | String | Format: FSR, QSR, Bar |
| opened | LocalDate | Opening date |
| hours | OperatingHours | Weekly schedule |
| status | RestaurantStatus | Active, Renovation, Closed |

**Bounded Context:** Operations Context
**Invariants:**
- Restaurant must belong to exactly one Business
- A Restaurant cannot be deleted; can be Closed
- Hours must cover at least one service period per day

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| Menu | has | 1 |
| Schedule | has | 1..* |
| Equipment | has | 0..* |
| Department | has | 1..* |

---

## 3. Menu Aggregate

### Aggregate Root: Menu

| Property | Type | Description |
|----------|------|-------------|
| menuId | UUID | Unique identity |
| restaurantId | Restaurant (reference) | Parent Restaurant |
| name | String | e.g., "Regular", "Seasonal" |
| effectiveDate | LocalDate | When menu takes effect |
| expirationDate | LocalDate (optional) | When menu expires |
| status | MenuStatus | Draft, Active, Archived |

**Bounded Context:** Operations Context
**Invariants:**
- A Restaurant may have multiple Menus but only one Active at a time
- Active Menu must have at least one Menu Item
- Menu Items must follow portion constraint (max 30)

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| MenuItem | has | 1..30 |
| Category | has | 1..* |

### Entity: MenuItem

| Property | Type | Description |
|----------|------|-------------|
| menuItemId | UUID | Unique identity |
| menuId | Menu (reference) | Parent Menu |
| name | String | Display name |
| description | String | Menu description |
| category | MenuCategory | Appetizer, Entree, Dessert, etc. |
| price | Price | Current selling price |
| foodCost | Percentage | Theoretical food cost |
| recipe | Recipe (reference) | Production specification |
| status | MenuItemStatus | Available, TemporarilyUnavailable, Discontinued |
| sortOrder | Integer | Display ordering |

---

## 4. Recipe Aggregate

### Aggregate Root: Recipe

| Property | Type | Description |
|----------|------|-------------|
| recipeId | UUID | Unique identity |
| name | String | Recipe name |
| menuItemId | MenuItem (reference) | Associated Menu Item |
| cuisine | CuisineType | Italian, Mexican, etc. |
| allergens | Allergen[] | Known allergens |
| prepTime | Duration | Preparation time |
| cookTime | Duration | Cooking time |
| yield | Integer | Portions produced |
| instructions | String | Preparation method |
| version | Integer | Version number |

**Bounded Context:** Operations Context
**Invariants:**
- A Recipe must have at least one Ingredient
- Total ingredient quantities must match Recipe yield
- Recipe changes must be versioned

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| RecipeIngredient | has | 1..* |

### Entity: RecipeIngredient

| Property | Type | Description |
|----------|------|-------------|
| ingredientId | Ingredient (reference) | Which ingredient |
| quantity | Decimal | Amount |
| unit | UnitOfMeasure | oz, lb, cup, each, etc. |
| wastePercentage | Percentage | Expected waste |

---

## 5. Ingredient Aggregate

### Aggregate Root: Ingredient

| Property | Type | Description |
|----------|------|-------------|
| ingredientId | UUID | Unique identity |
| name | String | Ingredient name |
| category | IngredientCategory | Produce, Meat, Dairy, etc. |
| preferredSupplier | Supplier (reference) | Primary supplier |
| currentUnitCost | Money | Current cost per unit |
| unit | UnitOfMeasure | Base unit |
| packSize | Decimal | Units per pack |
| storage | StorageType | Dry, Refrigerated, Frozen |
| parLevel | Integer | Minimum stock level |

**Bounded Context:** Operations Context / Supply Context
**Invariants:**
- An Ingredient must have at least one Supplier
- Unit cost cannot be negative

---

## 6. Supplier Aggregate

### Aggregate Root: Supplier

| Property | Type | Description |
|----------|------|-------------|
| supplierId | UUID | Unique identity |
| name | String | Company name |
| contact | ContactInfo | Phone, email, account rep |
| address | Address | Business address |
| rating | SupplierRating | Overall rating |
| status | SupplierStatus | Active, OnHold, Inactive |
| paymentTerms | String | e.g., Net 30 |

**Bounded Context:** Operations Context / Supply Context
**Invariants:**
- A Supplier can supply multiple Ingredients
- Supplier status transitions: Active → OnHold → Active/Inactive

---

## 7. Customer Aggregate

### Aggregate Root: Customer

| Property | Type | Description |
|----------|------|-------------|
| customerId | UUID | Unique identity |
| name | String | Customer name |
| phone | String (optional) | Contact |
| segment | CustomerSegment | Current segment |
| firstVisit | LocalDate | First visit date |
| lastVisit | LocalDate | Most recent visit |
| totalVisits | Integer | Lifetime visits |
| totalSpent | Money | Lifetime revenue |
| preferences | CustomerPreferences | Dietary, seating, etc. |

**Bounded Context:** Customer Context
**Invariants:**
- A Customer can be anonymous (no PII required)
- Segment transitions: New → Regular → VIP; Regular → AtRisk → Lapsed

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| Visit | has | 0..* |
| LoyaltyAccount | has | 0..1 |
| Review | has | 0..* |

---

## 8. Visit Aggregate

### Aggregate Root: Visit

| Property | Type | Description |
|----------|------|-------------|
| visitId | UUID | Unique identity |
| customerId | Customer (reference, optional) | Who visited |
| restaurantId | Restaurant (reference) | Where |
| date | LocalDate | Visit date |
| time | LocalTime | Visit time |
| channel | VisitChannel | DineIn, Takeout, etc. |
| visitType | VisitType | Lunch, Dinner, etc. |
| covers | Integer | Number of guests |
| total | Money | Total bill |
| serviceMinutes | Duration (optional) | Length of visit |
| serverId | Employee (reference, optional) | Assigned server |

**Bounded Context:** Operations Context
**Invariants:**
- covers > 0
- total ≥ 0
- A Visit may have zero Items (no-show, canceled)

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| OrderItem | has | 0..* |
| Payment | has | 0..* |

---

## 9. Employee Aggregate

### Aggregate Root: Employee

| Property | Type | Description |
|----------|------|-------------|
| employeeId | UUID | Unique identity |
| restaurantId | Restaurant (reference) | Where they work |
| name | String | Full name |
| role | EmployeeRole | Position |
| wage | Money | Hourly or salary rate |
| wageType | WageType | Hourly, Salary, TipPool |
| status | EmploymentStatus | Active, OnLeave, Terminated |
| startDate | LocalDate | Hire date |
| endDate | LocalDate (optional) | Termination date |
| certifications | Certification[] | Food safety, etc. |

**Bounded Context:** Operations Context / HR Context
**Invariants:**
- An Employee belongs to exactly one Restaurant
- wage ≥ minimum wage for jurisdiction

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| Shift | has | 0..* |
| TimeEntry | has | 0..* |

---

## 10. Schedule Aggregate

### Aggregate Root: Schedule

| Property | Type | Description |
|----------|------|-------------|
| scheduleId | UUID | Unique identity |
| restaurantId | Restaurant (reference) | Where |
| weekStart | LocalDate | Beginning of schedule week |
| weekEnd | LocalDate | End of schedule week |
| status | ScheduleStatus | Draft, Published, Final |
| totalLaborHours | Decimal | Sum of all shift hours |
| totalLaborCost | Money | Sum of wages |
| laborBudget | Money | Expected labor spend |

**Bounded Context:** Operations Context
**Invariants:**
- A Schedule covers exactly 7 days (weekStart → weekEnd)
- A Restaurant can have only one Schedule per week
- Total labor hours must not exceed legal limits

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| Shift | has | 0..* |

### Entity: Shift

| Property | Type | Description |
|----------|------|-------------|
| shiftId | UUID | Unique identity |
| employeeId | Employee (reference) | Who works |
| date | LocalDate | Shift date |
| startTime | TimeRange.start | Shift start |
| endTime | TimeRange.end | Shift end |
| role | EmployeeRole | Role for this shift |
| status | ScheduleStatus | Scheduled, ClockedIn, etc. |

---

## 11. Health Aggregate

### Aggregate Root: Health

| Property | Type | Description |
|----------|------|-------------|
| healthId | UUID | Unique identity |
| businessId | Business (reference) | Which Business |
| restaurantId | Restaurant (reference) | Which Restaurant |
| score | HealthScore | Current overall score |
| state | HealthStateLabel | Derived from score |
| timestamp | Instant | When measured |
| period | Period | The period this health covers |

**Bounded Context:** Health Context
**Invariants:**
- Health must be recalculated when any Dimension changes
- Health cannot be manually overridden; adjustments change the underlying dimensions
- A Health record is immutable once created. New measurements create new records.

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| HealthDimension | has | 2..* |

### Entity: HealthDimension

| Property | Type | Description |
|----------|------|-------------|
| dimensionId | UUID | Unique identity |
| type | HealthDimensionType | Sales, Labor, FoodCost, etc. |
| score | HealthScore | Dimension score |
| weight | Percentage | Contribution to overall Health |
| vitals | Vital[] | Measured values |

### Entity: Vital

| Property | Type | Description |
|----------|------|-------------|
| vitalId | UUID | Unique identity |
| name | String | e.g., "Food Cost %" |
| value | Decimal | Current value |
| unit | String | "%", "$", "hours" |
| threshold | Threshold | Warning/critical levels |
| trend | Trend | Direction of change |

---

## 12. Knowledge Aggregate

### Aggregate Root: Observation

| Property | Type | Description |
|----------|------|-------------|
| observationId | UUID | Unique identity |
| businessId | Business (reference) | Which Business |
| timestamp | Instant | When observed |
| value | ObservationValue | The observed fact |
| context | String | Business context |
| source | ObservationSource | Auto, Manual, System |
| confidence | Confidence | How certain the system is |

**Bounded Context:** Intelligence Context
**Invariants:**
- An Observation must reference exactly one Business
- An Observation is immutable once created

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| Evidence | may have | 0..* |

---

## 13. Decision Aggregate

### Aggregate Root: Recommendation

| Property | Type | Description |
|----------|------|-------------|
| recommendationId | UUID | Unique identity |
| businessId | Business (reference) | For which Business |
| title | String | Short title |
| body | String | Full recommendation text |
| priority | RecommendationPriority | Urgency |
| category | RecommendationCategory | Type |
| confidence | Confidence | System certainty |
| expectedImpact | String | Predicted outcome |
| created | Instant | When created |
| expires | Instant | When no longer relevant |
| status | RecommendationStatus | Pending, Viewed, Accepted, Rejected, Expired |

**Bounded Context:** Decision Context
**Invariants:**
- A Recommendation must cite at least one piece of Evidence
- A Recommendation expires and must be marked Expired if not addressed

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| Evidence | cites | 1..* |

### Entity: Evidence

| Property | Type | Description |
|----------|------|-------------|
| evidenceId | UUID | Unique identity |
| observationId | Observation (reference) | Source observation |
| patternId | Pattern (reference, optional) | Source pattern |
| description | String | Why this supports the recommendation |

---

## 14. Narrative Aggregate

### Aggregate Root: Narrative

| Property | Type | Description |
|----------|------|-------------|
| narrativeId | UUID | Unique identity |
| businessId | Business (reference) | Which Business |
| title | String | Narrative title |
| body | String | Full narrative text |
| tone | NarrativeTone | Communication tone |
| urgency | CommunicationUrgency | When to communicate |
| created | Instant | When created |
| validUntil | Instant | Expiration |

**Bounded Context:** Experience Context
**Invariants:**
- A Narrative must reference at least one Observation or Recommendation
- Narratives are ephemeral by design; they expire

### Owned Entities

| Entity | Relationship | Cardinality |
|--------|-------------|-------------|
| Observation | references | 0..* |
| Recommendation | references | 0..* |

---

## Aggregate Reference Summary

| # | Aggregate Root | Context | Key Invariant |
|---|----------------|---------|---------------|
| 1 | Business | Business | One Owner at a time |
| 2 | Restaurant | Operations | Belongs to one Business |
| 3 | Menu | Operations | Only one Active at a time |
| 4 | Recipe | Operations | Must have at least one ingredient |
| 5 | Ingredient | Supply | Must have at least one supplier |
| 6 | Supplier | Supply | Status transitions are limited |
| 7 | Customer | Customer | Can be anonymous |
| 8 | Visit | Operations | covers > 0 |
| 9 | Employee | Operations | Belongs to one Restaurant |
| 10 | Schedule | Operations | One per week per Restaurant |
| 11 | Health | Health | Immutable once created |
| 12 | Observation | Intelligence | Immutable once created |
| 13 | Recommendation | Decision | Must cite evidence |
| 14 | Narrative | Experience | References observations or recommendations |

---

*End of Aggregates and Entities — Version 1.0*
