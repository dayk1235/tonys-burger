# DOMAIN EVENTS

**Version:** 1.0
**Domain Module:** Restaurant OS — 12-domain

---

Every domain event is something that happened in the past that matters to the business. Events are immutable, ordered, and retained. They are the source of truth for system behavior.

---

## Event Catalog by Context

### Business Context

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **BusinessRegistered** | Owner completes onboarding | Business | All contexts | businessId, ownerId, name, establishedDate |
| **BusinessActivated** | Business ready for operations | Business | Operations, Health, Intelligence | businessId |
| **BusinessSuspended** | Owner pauses operations | Business | Operations, Health, Experience | businessId, reason |
| **BusinessClosed** | Operations permanently ceased | Business | All contexts | businessId, closureDate |
| **OwnerChanged** | Business ownership transfers | Business | All contexts | businessId, previousOwnerId, newOwnerId |

### Operations Context

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **RestaurantOpened** | New location opens | Operations | Financial, Health, Intelligence | restaurantId, businessId, openedDate |
| **RestaurantClosed** | Location ceases operations | Operations | Financial, Health, Customer | restaurantId, closureDate |
| **MenuPublished** | Menu goes live | Operations | Financial, Intelligence | menuId, restaurantId, effectiveDate |
| **MenuArchived** | Menu replaced or expired | Operations | Financial | menuId, restaurantId |
| **MenuItemAdded** | New item on menu | Operations | Financial, Intelligence | menuItemId, menuId, name, price |
| **MenuItemPriceChanged** | Price updated | Operations | Financial | menuItemId, oldPrice, newPrice |
| **MenuItemRemoved** | Item discontinued | Operations | Financial, Intelligence | menuItemId, menuId |
| **RecipeVersioned** | Recipe updated | Operations | Financial, Supply | recipeId, version, changes |
| **EmployeeHired** | Team member added | Operations | Financial, Health | employeeId, restaurantId, role, wage |
| **EmployeeTerminated** | Employment ended | Operations | Financial | employeeId, restaurantId, reason |
| **SchedulePublished** | Weekly schedule finalized | Operations | Financial | scheduleId, restaurantId, weekStart, totalLaborHours |
| **ShiftChanged** | Shift modified or swapped | Operations | Financial | shiftId, employeeId, oldTimeRange, newTimeRange |

### Visit & Customer

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **VisitCompleted** | Customer pays and leaves | Operations | Financial, Customer, Intelligence | visitId, restaurantId, total, covers, channel, dateTime |
| **CustomerIdentified** | Anonymous visit linked to known customer | Customer | Intelligence, Experience | customerId, visitId |
| **CustomerSegmentChanged** | Customer behavior triggers segment shift | Customer | Experience, Intelligence | customerId, oldSegment, newSegment |
| **VIPStatusAchieved** | Customer reaches VIP threshold | Customer | Experience | customerId, threshold |
| **AtRiskDetected** | Regular customer showing signs of leaving | Customer | Experience, Decision | customerId, riskIndicators |
| **CustomerLapsed** | No visits beyond expected interval | Customer | Experience, Decision | customerId, daysSinceLastVisit |
| **ReviewSubmitted** | Customer leaves feedback | Customer | Intelligence, Experience | customerId, rating, text (optional) |

### Financial Context

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **RevenueThresholdReached** | Revenue crosses significant milestone | Financial | Health, Experience | restaurantId, period, amount, threshold |
| **FoodCostWarning** | Food cost % exceeds threshold | Financial | Health, Decision | restaurantId, period, percentage, threshold |
| **FoodCostTargetMet** | Food cost back within target range | Financial | Health, Experience | restaurantId, period, percentage |
| **LaborCostWarning** | Labor cost % exceeds threshold | Financial | Health, Decision | restaurantId, period, percentage, threshold |
| **MarginDeclineDetected** | Margin decreased significantly | Financial | Health, Decision, Experience | restaurantId, period, oldMargin, newMargin |
| **PeriodClosed** | Financial period finalized | Financial | Health, Intelligence | restaurantId, period, summary |

### Health Context

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **HealthCalculated** | Health score computed for period | Health | Experience, Intelligence | healthId, restaurantId, score, state, period |
| **HealthStateChanged** | Health transitions to new state | Health | Experience, Decision, Intelligence | healthId, restaurantId, oldState, newState |
| **DimensionDeclined** | A health dimension dropped significantly | Health | Decision, Intelligence | dimensionId, type, oldScore, newScore |
| **CriticalThresholdReached** | A vital hit critical level | Health | Decision, Experience | dimensionId, vitalName, value, threshold |
| **HealthImproved** | Health state improved | Health | Experience | healthId, restaurantId, oldState, newState |

### Intelligence Context

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **ObservationRecorded** | A fact about the business is captured | Intelligence | Timeline, Decision | observationId, businessId, value, timestamp, confidence |
| **SignalDetected** | Potential pattern indicator identified | Intelligence | Timeline, Decision | signalId, businessId, description, strength |
| **PatternConfirmed** | Signal reaches confidence threshold | Intelligence | Knowledge, Decision, Experience | patternId, businessId, description, correlation, supportingObservations[] |
| **KnowledgeEarned** | Verified understanding established | Intelligence | Knowledge, Decision | knowledgeId, businessId, statement, supportingPatterns[] |
| **NarrativeGenerated** | Story constructed from patterns | Intelligence | Experience, Decision | narrativeId, businessId, title, observations[], predictions[] |
| **BusinessPulseUpdated** | Continuous assessment refreshed | Intelligence | Experience | businessId, timestamp, state, summary |

### Decision Context

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **RecommendationCreated** | New recommendation generated | Decision | Experience, Timeline | recommendationId, businessId, title, priority, confidence |
| **RecommendationViewed** | Owner saw the recommendation | Decision | Experience | recommendationId, viewedAt |
| **RecommendationAccepted** | Owner accepted and acted | Decision | Experience, Intelligence | recommendationId, decision, feedback |
| **RecommendationRejected** | Owner declined | Decision | Experience, Intelligence | recommendationId, decision, reason |
| **RecommendationExpired** | Time passed without action | Decision | Experience, Timeline | recommendationId |
| **PredictionIssued** | Forecast generated | Decision | Experience | predictionId, businessId, outcome, confidence, expiration |
| **PredictionValidated** | Outcome matched prediction | Decision | Experience, Intelligence | predictionId, actual, predicted, accuracy |
| **PredictionFailed** | Outcome differed significantly | Decision | Experience, Intelligence | predictionId, actual, predicted, variance |
| **ExperimentProposed** | Test designed | Decision | Experience | experimentId, businessId, hypothesis, duration |
| **ExperimentStarted** | Test becomes active | Decision | Experience | experimentId, startDate |
| **ExperimentCompleted** | Results measured | Decision | Experience, Intelligence | experimentId, result, confidence, action |

### Experience Context

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **DailyBriefGenerated** | Owner's daily summary created | Experience | Owner (human) | briefId, businessId, primaryNarrative, secondaryNarratives[], timestamp |
| **DailyBriefViewed** | Owner reads their brief | Experience | Intelligence | briefId, viewedAt |
| **TimelineUpdated** | New activity appended to timeline | Experience | Owner (human) | businessId, activity[] |
| **NarrativeExpired** | Story no longer relevant | Experience | Timeline | narrativeId |

### Supply Context

| Event | Trigger | Producer | Consumers | Payload |
|-------|---------|----------|-----------|---------|
| **SupplierAdded** | New supplier onboarded | Supply | Operations | supplierId, name, ingredients[] |
| **SupplierRatingChanged** | Supplier score updated | Supply | Operations | supplierId, oldRating, newRating, reason |
| **IngredientPriceChanged** | Cost changed | Supply | Financial, Operations | ingredientId, supplierId, oldPrice, newPrice |
| **DeliveryExpected** | Order placed with supplier | Supply | Operations | deliveryId, supplierId, expectedDate, items[] |
| **DeliveryReceived** | Goods arrived | Supply | Financial, Operations | deliveryId, receivedDate, items[], qualityCheck |
| **InventoryLow** | Stock below par level | Supply | Operations | ingredientId, restaurantId, currentLevel, parLevel |
| **StockOut** | Ingredient unavailable | Supply | Operations, Decision | ingredientId, restaurantId, impact |

---

## Event Relationship Diagram

```
BusinessRegistered ──▶ [All contexts initialize]
       │
       ▼
RestaurantOpened ──▶ MenuPublished ──▶ VisitCompleted ──▶ Revenue / FoodCost
       │                                 │                    │
       │                                 ▼                    ▼
       │                           CustomerIdentified    MarginDeclineDetected
       │                                 │                    │
       │                                 ▼                    ▼
       │                           CustomerSegment    CriticalThresholdReached
       │                                 │                    │
       ▼                                 ▼                    ▼
EmployeeHired ──▶ SchedulePublished    AtRiskDetected   HealthStateChanged
       │                                 │                    │
       ▼                                 ▼                    ▼
EmployeeTerminated              RecommendationCreated  NarrativeGenerated
                                                         │
                                                         ▼
                                                  DailyBriefGenerated
```

---

## Event Rules

1. **Immutable** — An event, once recorded, cannot be changed
2. **Ordered** — Events within a stream have a strict sequence
3. **Retained** — Events are never deleted; they are the permanent record
4. **Versioned** — Event schema evolves via version field
5. **Idempotent** — Processing the same event twice produces the same result
6. **Correlated** — Related events carry correlationId for tracing

---

*End of Domain Events — Version 1.0*
