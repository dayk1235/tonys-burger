# Restaurant OS v2 — Data Sources

---

## Data Source Classification

| Classification | Description |
|---|---|
| **Internal** | Generated within the restaurant system (POS, inventory) |
| **External** | Fetched from third-party services (weather, reviews) |
| **Real Time** | Streamed continuously as events occur |
| **Historical** | Batched data from past records |
| **Manual** | Entered by human operators |
| **Automated** | Collected automatically by sensors or APIs |

---

## Data Sources

### 1. Orders

| Attribute | Value |
|---|---|
| **Source** | POST /api/orders → ObservationEngine |
| **Origin** | Internal — customer orders placed through website, phone, in-person |
| **Frequency** | Real Time — each order is an event |
| **Format** | JSON: `{ items: { id, quantity }[], customer: { name, phone } }` |
| **Primary Consumer** | ObservationEngine |
| **Classification** | Internal, Real Time, Automated |

### 2. Inventory

| Attribute | Value |
|---|---|
| **Source** | External API or manual entry |
| **Origin** | Internal — stock levels, ingredient counts, par levels |
| **Frequency** | Daily or Real Time (if connected to supplier system) |
| **Format** | JSON: `{ ingredientId, name, quantity, unit, threshold }` |
| **Primary Consumer** | ObservationEngine |
| **Classification** | Internal, Historical/Automated |

### 3. Kitchen

| Attribute | Value |
|---|---|
| **Source** | POS system or KDS (Kitchen Display System) |
| **Origin** | Internal — ticket times, prep times, cook times, waste |
| **Frequency** | Real Time — each ticket event |
| **Format** | JSON: `{ ticketId, items[], times: { received, started, completed }, station }` |
| **Primary Consumer** | ObservationEngine |
| **Classification** | Internal, Real Time, Automated |

### 4. Delivery

| Attribute | Value |
|---|---|
| **Source** | Delivery platform API (UberEats, Rappi, Didi) |
| **Origin** | External — delivery orders, driver tracking, estimated arrival |
| **Frequency** | Real Time — per order lifecycle event |
| **Format** | JSON: `{ deliveryId, platform, status, driverETA, items[] }` |
| **Primary Consumer** | ObservationEngine |
| **Classification** | External, Real Time, Automated |

### 5. Customers

| Attribute | Value |
|---|---|
| **Source** | CRM system, loyalty program, order history |
| **Origin** | Internal — customer profiles, visit frequency, preferences |
| **Frequency** | Historical + Real Time updates |
| **Format** | JSON: `{ customerId, name, phone, visits, preferences, totalSpent }` |
| **Primary Consumer** | ObservationEngine / KnowledgeEngine |
| **Classification** | Internal, Historical, Automated/Manual |

### 6. Sales

| Attribute | Value |
|---|---|
| **Source** | POS system |
| **Origin** | Internal — transaction records, revenue, average ticket |
| **Frequency** | Real Time — per transaction + daily/weekly aggregates |
| **Format** | JSON: `{ transactionId, items[], total, timestamp, paymentMethod }` |
| **Primary Consumer** | ObservationEngine / PatternEngine |
| **Classification** | Internal, Real Time, Automated |

### 7. Weather

| Attribute | Value |
|---|---|
| **Source** | External weather API (OpenWeather, WeatherAPI) |
| **Origin** | External — temperature, conditions, forecasts |
| **Frequency** | Hourly or on-demand |
| **Format** | JSON: `{ temp, condition, humidity, windSpeed, forecast[] }` |
| **Primary Consumer** | ObservationEngine / PatternEngine |
| **Classification** | External, Historical, Automated |

### 8. Suppliers

| Attribute | Value |
|---|---|
| **Source** | Supplier portal or manual entry |
| **Origin** | External/Internal — delivery schedules, pricing, reliability |
| **Frequency** | Per-delivery or weekly |
| **Format** | JSON: `{ supplierId, name, orderFrequency, leadTime, reliability }` |
| **Primary Consumer** | ObservationEngine / KnowledgeEngine |
| **Classification** | External, Historical, Automated/Manual |

### 9. Promotions

| Attribute | Value |
|---|---|
| **Source** | Owner dashboard or campaign tool |
| **Origin** | Internal — active promotions, discounts, campaigns |
| **Frequency** | As-created by owner |
| **Format** | JSON: `{ promotionId, name, type, discount, startDate, endDate, items[] }` |
| **Primary Consumer** | ObservationEngine / DecisionEngine |
| **Classification** | Internal, Historical, Manual |

### 10. Reviews

| Attribute | Value |
|---|---|
| **Source** | Review platform API (Google, Yelp, TripAdvisor) |
| **Origin** | External — ratings, text reviews, sentiment |
| **Frequency** | Daily or on-demand |
| **Format** | JSON: `{ reviewId, platform, rating, text, date, sentiment }` |
| **Primary Consumer** | ObservationEngine / PatternEngine |
| **Classification** | External, Historical, Automated |
