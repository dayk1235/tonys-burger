# Restaurant OS — Canonical Order Event Specification

**Version:** 1.0.0
**Status:** CANONICAL
**Sprint:** IS1-001
**Domain:** Orders

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Principles](#2-design-principles)
3. [Canonical Structure](#3-canonical-structure)
4. [Field Classification](#4-field-classification)
5. [Validation Rules](#5-validation-rules)
6. [Versioning Strategy](#6-versioning-strategy)
7. [Source Conversion](#7-source-conversion)
8. [Engine Consumption Matrix](#8-engine-consumption-matrix)
9. [Complete Examples](#9-complete-examples)
10. [Glossary](#10-glossary)
11. [Change Log](#11-change-log)

---

## 1. Executive Summary

### Objective

Define the **single, canonical representation** for every order entering Restaurant OS. All external sources — Uber Eats, Rappi, WhatsApp, POS, API, CSV — must be converted to this format before entering the Cognitive Pipeline.

### Why It Exists

Without a canonical format, every data source would require custom integration logic at every pipeline stage. The canonical order event decouples **source acquisition** from **cognitive processing**, enabling:

- One ObservationEngine integration
- One validation rule set
- One downstream consumption contract
- Unlimited source adapters, all producing the same output

### Problem Solved

| Before | After |
|---|---|
| Each source has its own format | All sources produce Canonical Order Event |
| Engines must understand each source | Engines only understand the Canonical Order Event |
| New source = new engine changes | New source = new adapter only |
| Validation per source | Validation once |
| Fragmented analytics | Unified analytics |

---

## 2. Design Principles

| # | Principle | Description |
|---|---|---|
| **P01** | **Single Representation** | One and only one format for all orders regardless of origin |
| **P02** | **Provider Independent** | No fields tied to a specific provider (no `uberOrderId`, `rappiStoreId`) |
| **P03** | **Channel Independent** | No fields tied to a specific channel (no `whatsappMessageId`, `posTicketNumber`) |
| **P04** | **Language Independent** | All string fields in the locale of the restaurant, not the source |
| **P05** | **Versionable** | The spec has a version, and each event carries its version for forward compatibility |
| **P06** | **Extensible** | `metadata` object allows future fields without breaking existing consumers |
| **P07** | **Deterministic** | Same order from any source produces the same canonical event (modulo timestamps) |
| **P08** | **Backward Compatible** | New versions must preserve existing required fields; new fields must be optional |
| **P09** | **Validated Before Ingest** | All validation happens at conversion time; the canonical event is guaranteed valid |
| **P10** | **Immutable** | Once ingested, the canonical event is never modified — corrections create new events |

---

## 3. Canonical Structure

### 3.1 Top-Level Structure

```typescript
interface CanonicalOrderEvent {
  // ── Order Metadata ──────────────────────────────────────────
  orderId: string;                    // Unique order identifier (restaurant-scoped)
  requestId?: string;                 // Idempotency key (client-generated)
  version: string;                    // Canonical spec version (e.g. "1.0.0")
  status: OrderStatus;                // Current lifecycle status

  // ── Customer ────────────────────────────────────────────────
  customer: Customer;

  // ── Items ───────────────────────────────────────────────────
  items: OrderItem[];

  // ── Modifiers ───────────────────────────────────────────────
  modifiers?: OrderModifier[];

  // ── Pricing ─────────────────────────────────────────────────
  pricing: Pricing;

  // ── Discounts ───────────────────────────────────────────────
  discounts?: Discount[];

  // ── Taxes ───────────────────────────────────────────────────
  taxes?: Tax[];

  // ── Payment ─────────────────────────────────────────────────
  payment: Payment;

  // ── Delivery ────────────────────────────────────────────────
  delivery: Delivery;

  // ── Address ─────────────────────────────────────────────────
  address: Address;

  // ── Restaurant ──────────────────────────────────────────────
  restaurant: RestaurantRef;

  // ── Channel ─────────────────────────────────────────────────
  channel: Channel;

  // ── Source ──────────────────────────────────────────────────
  source: Source;

  // ── Timestamps ──────────────────────────────────────────────
  timestamps: Timestamps;

  // ── Request Metadata ────────────────────────────────────────
  metadata?: Record<string, unknown>;

  // ── Analytics Metadata ──────────────────────────────────────
  analytics: Analytics;
}
```

### 3.2 Order Metadata

```typescript
type OrderStatus =
  | "PENDING"           // Order received, not yet confirmed
  | "CONFIRMED"         // Order confirmed by restaurant
  | "PREPARING"         // Order is being prepared
  | "READY"             // Order is ready for pickup/delivery
  | "IN_TRANSIT"        // Order is on its way (delivery only)
  | "DELIVERED"         // Order delivered to customer
  | "COMPLETED"         // Order fulfilled, paid, closed
  | "CANCELLED"         // Order cancelled before completion
  | "REFUNDED";         // Order refunded after completion

interface OrderMetadata {
  orderId: string;                    // Required. Restaurant-scoped unique ID
  requestId?: string;                 // Optional. Client-generated idempotency key
  version: string;                    // Required. Canonical spec version
  status: OrderStatus;                // Required. Current lifecycle status
  type: "DINE_IN" | "TAKEOUT" | "DELIVERY" | "CATERING";
  note?: string;                      // Optional. Customer note
}
```

### 3.3 Customer

```typescript
interface Customer {
  id?: string;                        // Optional. Customer ID in restaurant CRM
  name: string;                       // Required. Customer full name
  phone: string;                      // Required. Customer phone number
  email?: string;                     // Optional. Customer email
  isVip?: boolean;                    // Optional. Flag for VIP customers
  visitCount?: number;                // Optional. Number of previous visits
  notes?: string;                     // Optional. Internal notes about customer
}
```

### 3.4 Items

```typescript
interface OrderItem {
  id: string;                         // Required. Menu item ID
  name: string;                       // Required. Display name
  quantity: number;                   // Required. Quantity (integer >= 1)
  unitPrice: number;                  // Required. Price per unit in smallest currency unit (cents)
  totalPrice: number;                 // Derived. quantity * unitPrice
  category?: string;                  // Optional. Menu category (e.g. "Burgers", "Sides")
  modifiers?: OrderModifier[];        // Optional. Item-level modifiers
  specialInstructions?: string;       // Optional. Per-item instructions
}
```

### 3.5 Modifiers

```typescript
interface OrderModifier {
  id: string;                         // Required. Modifier option ID
  name: string;                       // Required. Modifier display name
  group?: string;                     // Optional. Modifier group (e.g. "Size", "Extras")
  quantity: number;                   // Required. Quantity
  unitPrice: number;                  // Required. Price per unit
  totalPrice: number;                 // Derived. quantity * unitPrice
}
```

### 3.6 Pricing

```typescript
interface Pricing {
  subtotal: number;                   // Required. Sum of all items totalPrice
  discountTotal: number;              // Required. Total discount amount
  taxTotal: number;                   // Required. Total tax amount
  deliveryFee: number;                // Required. Delivery fee (0 for pickup/dine-in)
  serviceFee?: number;                // Optional. Service charge
  tip?: number;                       // Optional. Tip amount
  grandTotal: number;                 // Derived. subtotal - discountTotal + taxTotal + deliveryFee + serviceFee + tip
  currency: string;                   // Required. ISO 4217 (e.g. "MXN", "USD")
}
```

### 3.7 Discounts

```typescript
interface Discount {
  id: string;                         // Required. Discount/promotion ID
  name: string;                       // Required. Discount display name
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_ITEM" | "BUNDLE";
  value: number;                      // Required. Percentage (0-100) or amount in cents
  amount: number;                     // Derived. Calculated discount amount in cents
  appliedToItemIds?: string[];        // Optional. Items this discount applies to
  promotionId?: string;               // Optional. Reference to promotion system
}
```

### 3.8 Taxes

```typescript
interface Tax {
  id: string;                         // Required. Tax rule ID
  name: string;                       // Required. Tax display name (e.g. "IVA", "Sales Tax")
  rate: number;                       // Required. Tax rate as decimal (e.g. 0.16 for 16%)
  amount: number;                     // Required. Computed tax amount in cents
  includedInPrice: boolean;           // Required. Whether tax is included in item prices
}
```

### 3.9 Payment

```typescript
interface Payment {
  method: PaymentMethod;              // Required. Payment method
  status: PaymentStatus;              // Required. Payment status
  transactionId?: string;             // Optional. External payment processor ID
  amount: number;                     // Required. Amount charged in cents
  change?: number;                    // Optional. Change returned (cash only)
  installmentPlan?: string;           // Optional. "MONTHS_3", "MONTHS_6", etc.
}

type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "ONLINE_PAYMENT"
  | "MOBILE_PAYMENT"
  | "GIFT_CARD"
  | "LOYALTY_POINTS"
  | "OTHER";

type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "FAILED"
  | "CANCELLED";
```

### 3.10 Delivery

```typescript
interface Delivery {
  type: "DINE_IN" | "TAKEOUT" | "DELIVERY" | "CATERING";  // Required
  provider?: string;                  // Optional. Delivery provider name (e.g. "UberEats", "InHouse")
  driverName?: string;                // Optional. Driver name (for delivery)
  driverPhone?: string;               // Optional. Driver phone
  estimatedMinutes?: number;          // Optional. Estimated delivery time in minutes
  actualMinutes?: number;             // Optional. Actual delivery time in minutes
  scheduledAt?: string;               // Optional. Scheduled delivery time (ISO 8601)
}
```

### 3.11 Address

```typescript
interface Address {
  street: string;                     // Required for delivery
  number?: string;                    // Optional. Street number
  neighborhood?: string;              // Optional. Neighborhood/colony
  city: string;                       // Required
  state?: string;                     // Optional. State/province
  zipCode?: string;                   // Optional. Postal code
  country: string;                    // Required. ISO 3166-1 alpha-2
  lat?: number;                       // Optional. Latitude
  lng?: number;                       // Optional. Longitude
  instructions?: string;              // Optional. Delivery instructions
  reference?: string;                 // Optional. Landmark reference
}
```

### 3.12 Restaurant

```typescript
interface RestaurantRef {
  id: string;                         // Required. Restaurant ID in Restaurant OS
  name: string;                       // Required. Restaurant display name
  branchId?: string;                  // Optional. Branch ID for multi-branch
}
```

### 3.13 Channel

```typescript
interface Channel {
  type: ChannelType;                  // Required.
  name: string;                       // Required. Display name (e.g. "Uber Eats", "Web")
  version?: string;                   // Optional. Channel version (e.g. "API v2.1")
}

type ChannelType =
  | "WEBSITE"          // Restaurant's own website
  | "MOBILE_APP"       // Restaurant's own mobile app
  | "DELIVERY_APP"     // Third-party delivery (UberEats, Rappi, etc.)
  | "WHATSAPP"         // WhatsApp ordering
  | "PHONE"            // Phone call order
  | "POS"              // In-store POS
  | "KIOSK"            // Self-service kiosk
  | "API"              // Direct API integration
  | "CSV_IMPORT"       // Batch import
  | "MANUAL";          // Manually entered by staff
```

### 3.14 Source

```typescript
interface Source {
  provider: string;                   // Required. Source system name (e.g. "uber-eats", "rappi", "pos-clover")
  applicationId: string;              // Required. Identifier in the source system
  applicationVersion?: string;        // Optional. Version of the source application
  environment: "PRODUCTION" | "STAGING" | "TEST";
}
```

### 3.15 Timestamps

```typescript
interface Timestamps {
  orderedAt: string;                  // Required. When the customer placed the order (ISO 8601)
  confirmedAt?: string;               // Optional. When the restaurant confirmed
  preparedAt?: string;                // Optional. When preparation started
  readyAt?: string;                   // Optional. When preparation completed
  pickedUpAt?: string;                // Optional. When picked up by driver/customer
  deliveredAt?: string;               // Optional. When delivered
  completedAt?: string;               // Optional. When order was closed
  cancelledAt?: string;               // Optional. When cancelled
  ingestedAt: string;                 // Required. When the canonical event was created
}
```

### 3.16 Analytics

```typescript
interface Analytics {
  sourceLocale: string;               // Required. Source locale (e.g. "es-MX", "en-US")
  convertedAt: string;                // Required. When conversion from source format happened
  adapterVersion: string;             // Required. Version of the adapter that produced this event
  processingTimeMs: number;           // Derived. Time from orderedAt to ingestedAt
  dayOfWeek: string;                  // Derived. "Monday", "Tuesday", etc.
  hourOfDay: number;                  // Derived. 0-23
  servicePeriod: ServicePeriod;       // Derived.
  season: string;                     // Derived. "spring", "summer", etc.
  isHoliday: boolean;                 // Derived. Whether the order date is a holiday
  tags?: string[];                    // Optional. Analytics tags
}

type ServicePeriod = "breakfast" | "lunch" | "dinner" | "late_night" | "between_services";
```

---

## 4. Field Classification

| Category | Definition | Examples |
|---|---|---|
| **Required** | Must be present in every event. Validation failure = reject | `orderId`, `customer.name`, `items`, `pricing.currency` |
| **Optional** | May be absent. Null-safe consumers | `customer.email`, `delivery.scheduledAt`, `metadata` |
| **Derived** | Computed from other fields in the same event | `items[].totalPrice`, `pricing.grandTotal`, `analytics.dayOfWeek` |
| **Calculated** | Computed from system state, not from order fields alone | `analytics.processingTimeMs`, `analytics.isHoliday` |
| **Internal** | Used by Restaurant OS only, never exposed externally | `analytics.adapterVersion`, `analytics.convertedAt` |

### Required Fields

```
orderId
version
status
type
customer.name
customer.phone
items[].id
items[].name
items[].quantity
items[].unitPrice
items[].totalPrice
pricing.subtotal
pricing.discountTotal
pricing.taxTotal
pricing.deliveryFee
pricing.grandTotal
pricing.currency
payment.method
payment.status
payment.amount
delivery.type
restaurant.id
restaurant.name
channel.type
channel.name
source.provider
source.applicationId
source.environment
timestamps.orderedAt
timestamps.ingestedAt
analytics.sourceLocale
analytics.convertedAt
analytics.adapterVersion
address.street (if delivery type)
address.city (if delivery type)
address.country (if delivery type)
```

### Optional Fields

```
requestId
order.note
customer.id
customer.email
customer.isVip
customer.visitCount
customer.notes
items[].category
items[].modifiers
items[].specialInstructions
modifiers[].group
discounts
taxes
pricing.serviceFee
pricing.tip
payment.transactionId
payment.change
payment.installmentPlan
delivery.provider
delivery.driverName
delivery.driverPhone
delivery.estimatedMinutes
delivery.actualMinutes
delivery.scheduledAt
address.neighborhood
address.number
address.state
address.zipCode
address.lat
address.lng
address.instructions
address.reference
restaurant.branchId
channel.version
metadata
analytics.tags
timestamps.confirmedAt
timestamps.preparedAt
timestamps.readyAt
timestamps.pickedUpAt
timestamps.deliveredAt
timestamps.completedAt
timestamps.cancelledAt
```

### Derived Fields

| Field | Derivation |
|---|---|
| `items[].totalPrice` | `unitPrice * quantity` |
| `pricing.grandTotal` | `subtotal - discountTotal + taxTotal + deliveryFee + serviceFee + tip` |
| `discounts[].amount` | If PERCENTAGE: `subtotal * (value / 100)`. If FIXED_AMOUNT: `value` |
| `analytics.dayOfWeek` | From `timestamps.orderedAt` |
| `analytics.hourOfDay` | From `timestamps.orderedAt` |
| `analytics.servicePeriod` | From `timestamps.orderedAt` hour |
| `analytics.season` | From `timestamps.orderedAt` month |

### Calculated Fields

| Field | Calculation |
|---|---|
| `analytics.processingTimeMs` | `ingestedAt - orderedAt` |
| `analytics.isHoliday` | Check orderedAt against holiday calendar |

### Internal Fields

| Field | Visibility |
|---|---|
| `analytics.sourceLocale` | Internal — used for analytics only |
| `analytics.convertedAt` | Internal — audit trail |
| `analytics.adapterVersion` | Internal — adapter tracking |
| `source.applicationVersion` | Internal — debugging |

---

## 5. Validation Rules

### 5.1 Structural Validation

| Rule | Field | Condition | Error |
|---|---|---|---|
| V001 | `orderId` | Must be non-empty string | `INVALID_ORDER_ID` |
| V002 | `version` | Must match semver pattern | `INVALID_VERSION` |
| V003 | `status` | Must be valid `OrderStatus` | `INVALID_STATUS` |
| V004 | `type` | Must be valid order type | `INVALID_ORDER_TYPE` |
| V005 | `items` | Must be non-empty array | `EMPTY_ITEMS` |
| V006 | `items[].quantity` | Must be integer >= 1 | `INVALID_QUANTITY` |
| V007 | `items[].unitPrice` | Must be >= 0 | `INVALID_PRICE` |
| V008 | `pricing.currency` | Must be valid ISO 4217 | `INVALID_CURRENCY` |
| V009 | `pricing.grandTotal` | Must equal derived value (±1 rounding) | `PRICE_MISMATCH` |
| V010 | `payment.amount` | Must be > 0 | `INVALID_PAYMENT_AMOUNT` |
| V011 | `customer.name` | Must be non-empty string | `MISSING_CUSTOMER_NAME` |
| V012 | `customer.phone` | Must be non-empty string | `MISSING_CUSTOMER_PHONE` |
| V013 | `timestamps.orderedAt` | Valid ISO 8601 | `INVALID_TIMESTAMP` |
| V014 | `timestamps.ingestedAt` | Must be >= orderedAt | `TIMESTAMP_ORDER` |
| V015 | `channel.type` | Must be valid `ChannelType` | `INVALID_CHANNEL` |
| V016 | `delivery.type` | Must match order type | `DELIVERY_TYPE_MISMATCH` |

### 5.2 Conditional Validation

| Rule | Condition | Check | Error |
|---|---|---|---|
| V101 | `delivery.type === "DELIVERY"` | `address.street` required | `MISSING_DELIVERY_ADDRESS` |
| V102 | `delivery.type === "DELIVERY"` | `address.city` required | `MISSING_DELIVERY_CITY` |
| V103 | `delivery.type === "DELIVERY"` | `address.country` required | `MISSING_DELIVERY_COUNTRY` |
| V104 | `discounts[].type === "PERCENTAGE"` | `value` between 0 and 100 | `INVALID_DISCOUNT_PERCENTAGE` |
| V105 | `payment.method === "CASH"` | `payment.change` may be present | — |
| V106 | `status === "CANCELLED"` | `timestamps.cancelledAt` required | `MISSING_CANCELLATION_TIME` |
| V107 | `status === "REFUNDED"` | `payment.status === "REFUNDED"` | `PAYMENT_STATUS_MISMATCH` |

### 5.3 Cross-Field Validation

| Rule | Fields | Condition | Error |
|---|---|---|---|
| V201 | `items[].totalPrice` | Must equal `unitPrice * quantity` | `ITEM_TOTAL_MISMATCH` |
| V202 | `pricing.grandTotal` | Must equal derived calculation | `GRAND_TOTAL_MISMATCH` |
| V203 | `pricing.currency` | Must be same across all monetary fields | `CURRENCY_MISMATCH` |
| V204 | `timestamps` | Must be chronological | `TIMESTAMP_CHRONOLOGY` |

---

## 6. Versioning Strategy

### 6.1 Version Format

```
MAJOR.MINOR.PATCH
```

| Component | Change Trigger |
|---|---|
| **MAJOR** | Breaking change to required fields, structural changes, deletion of fields |
| **MINOR** | Addition of optional fields, new endpoints, non-breaking extensions |
| **PATCH** | Clarification, documentation fixes, validation rule refinements |

### 6.2 Compatibility Rules

| Version Change | Backward Compatible? | Consumer Action |
|---|---|---|
| MAJOR | ❌ No | Consumers must update or pin to previous version |
| MINOR | ✅ Yes | Consumers that ignore unknown fields continue working |
| PATCH | ✅ Yes | No consumer action required |

### 6.3 Version Lifecycle

```
v1.0.0 ──► v1.1.0 ──► v1.2.0 ──► v2.0.0 (breaking)
               │                      │
               └── v1.2.x (LTS)       └── v2.0.x (current)
```

| Stage | Description |
|---|---|
| **Current** | Actively used for new integrations |
| **LTS** | Long-term support — existing integrations continue |
| **Deprecated** | No new integrations, existing continue |
| **Sunset** | Scheduled for removal — consumers notified |
| **Retired** | No longer accepted by the system |

### 6.4 Field Deprecation

When a field is deprecated:

1. Mark as `@deprecated` in the spec with migration path
2. Keep the field working for at least one MAJOR version cycle
3. Remove in the next MAJOR version

---

## 7. Source Conversion

Every external source must be converted to the Canonical Order Event format before entering the cognitive pipeline.

### 7.1 Uber Eats → Canonical

| Uber Eats | Canonical | Notes |
|---|---|---|
| `order.id` | `orderId` | — |
| `order.display_id` | — | Not used (Uber-specific) |
| `restaurant.id` | `restaurant.id` | — |
| `customer.name` | `customer.name` | — |
| `customer.phone` | `customer.phone` | — |
| `customer.email` | `customer.email` | — |
| `items[].id` | `items[].id` | — |
| `items[].name` | `items[].name` | Translate to restaurant locale |
| `items[].quantity` | `items[].quantity` | — |
| `items[].base_price` | `items[].unitPrice` | Convert to cents |
| `items[].total_price` | `items[].totalPrice` | Convert to cents |
| `fee.delivery` | `pricing.deliveryFee` | Convert to cents |
| `fee.tax` | `pricing.taxTotal` | Convert to cents |
| `fee.discount` | `pricing.discountTotal` | Convert to cents (absolute) |
| `payment.type` | `payment.method` | Map to PaymentMethod |
| `delivery.address.street1` | `address.street` | — |
| `delivery.address.city` | `address.city` | — |
| — | `channel.type` | Set to `"DELIVERY_APP"` |
| — | `channel.name` | Set to `"Uber Eats"` |
| — | `source.provider` | Set to `"uber-eats"` |
| — | `version` | Set to `"1.0.0"` |

### 7.2 Rappi → Canonical

| Rappi | Canonical | Notes |
|---|---|---|
| `order.id` | `orderId` | — |
| `store.id` | `restaurant.id` | — |
| `user.name` | `customer.name` | — |
| `user.phone` | `customer.phone` | — |
| `user.email` | `customer.email` | — |
| `products[].id` | `items[].id` | — |
| `products[].name` | `items[].name` | Translate to restaurant locale |
| `products[].quantity` | `items[].quantity` | — |
| `products[].price` | `items[].unitPrice` | Convert to cents |
| `products[].total` | `items[].totalPrice` | Convert to cents |
| `totals.delivery` | `pricing.deliveryFee` | Convert to cents |
| `totals.tax` | `pricing.taxTotal` | Convert to cents |
| `totals.discount` | `pricing.discountTotal` | Convert to cents |
| `totals.grand_total` | `pricing.grandTotal` | Convert to cents |
| `payment.method` | `payment.method` | Map to PaymentMethod |
| `address.street` | `address.street` | — |
| `address.city` | `address.city` | — |
| — | `channel.type` | Set to `"DELIVERY_APP"` |
| — | `channel.name` | Set to `"Rappi"` |
| — | `source.provider` | Set to `"rappi"` |
| — | `version` | Set to `"1.0.0"` |

### 7.3 WhatsApp → Canonical

WhatsApp orders are parsed from natural language. A parser extracts structured fields:

| WhatsApp Text | Canonical | Method |
|---|---|---|
| Phone number | `customer.phone` | Extract from sender |
| Contact name | `customer.name` | Extract from contact |
| Item mentions | `items[].name` | NLP extract |
| Quantities | `items[].quantity` | NLP extract |
| Address in message | `address.street` | NLP extract |
| — | `channel.type` | Set to `"WHATSAPP"` |
| — | `channel.name` | Set to `"WhatsApp"` |
| — | `source.provider` | Set to `"whatsapp"` |
| — | `pricing` | Set from menu pricing |
| — | `payment.method` | Set to `"OTHER"` (to be confirmed) |

### 7.4 POS → Canonical

| POS | Canonical | Notes |
|---|---|---|
| `ticket.id` | `orderId` | — |
| `employee.name` | — | Not used (internal) |
| `items[].sku` | `items[].id` | — |
| `items[].description` | `items[].name` | — |
| `items[].qty` | `items[].quantity` | — |
| `items[].price` | `items[].unitPrice` | Convert to cents |
| `items[].extended` | `items[].totalPrice` | Convert to cents |
| `totals.subtotal` | `pricing.subtotal` | Convert to cents |
| `totals.tax` | `pricing.taxTotal` | Convert to cents |
| `totals.total` | `pricing.grandTotal` | Convert to cents |
| `tender.type` | `payment.method` | Map to PaymentMethod |
| `tender.amount` | `payment.amount` | Convert to cents |
| — | `channel.type` | Set to `"POS"` |
| — | `channel.name` | Set to `"In-Store POS"` |
| — | `source.provider` | Set to `"pos-clover"` |
| — | `delivery.type` | Set to `"DINE_IN"` or `"TAKEOUT"` |

### 7.5 CSV Import → Canonical

| CSV Column | Canonical | Notes |
|---|---|---|
| `order_id` | `orderId` | — |
| `customer_name` | `customer.name` | — |
| `customer_phone` | `customer.phone` | — |
| `item_id` | `items[].id` | One row per item |
| `item_name` | `items[].name` | — |
| `quantity` | `items[].quantity` | — |
| `unit_price` | `items[].unitPrice` | Convert to cents |
| `total` | `items[].totalPrice` | Convert to cents |
| `order_date` | `timestamps.orderedAt` | Parse to ISO 8601 |
| — | `channel.type` | Set to `"CSV_IMPORT"` |
| — | `source.provider` | Set to `"csv-import"` |
| — | `pricing` | Computed from items |

### 7.6 Direct API → Canonical

API integrations send orders in Canonical format directly.

| API Field | Canonical | Notes |
|---|---|---|
| All fields | Direct mapping | API expects Canonical Order Event format |
| — | `channel.type` | Set to `"API"` |
| — | `source.provider` | Set from API key/tenant |

---

## 8. Engine Consumption Matrix

### What Each Engine Consumes

| Engine | Consumes from Canonical Order Event |
|---|---|
| **Observation** | Everything — the full event becomes an Observation |
| **Pattern** | `items`, `timestamps.orderedAt` (hour/service period), `channel`, `customer`, `pricing.grandTotal`, `delivery.type` |
| **Evidence** | Validation results — confidence in order data quality |
| **Memory** | Historical patterns — `customer.id`, `items`, `pricing`, `timestamps` for recurrence detection |
| **Knowledge** | Aggregated patterns — customer preferences, peak hours, popular items |
| **Attention** | Urgency signals — `delivery.estimatedMinutes`, `status`, priority flags |
| **Reasoning** | Attention-scoped order context — what needs reasoning |
| **Decision** | Reasoning conclusions — whether to accept/modify/reject an order |
| **Learning** | Decision outcomes — actual vs expected, prep times, customer satisfaction proxies |
| **Prediction** | Learned patterns + current order — expected prep time, demand forecast |
| **Recommendation** | Predictions — suggested actions for the owner |
| **Planning** | Recommendations — step-by-step actions |
| **Execution** | Approved plans — controlled actions (notify, update, etc.) |

---

## 9. Complete Examples

### 9.1 Uber Eats Order (Converted to Canonical)

```json
{
  "orderId": "ord-ue-20260627-001",
  "requestId": "req-abc-123-uber",
  "version": "1.0.0",
  "status": "PENDING",
  "type": "DELIVERY",
  "note": "Extra napkins please",

  "customer": {
    "id": "crm-cust-4455",
    "name": "María García",
    "phone": "+52 55 1234 5678",
    "email": "maria@example.com",
    "isVip": true,
    "visitCount": 23
  },

  "items": [
    {
      "id": "smash-double",
      "name": "Smash Double",
      "quantity": 2,
      "unitPrice": 12900,
      "totalPrice": 25800,
      "category": "Burgers"
    },
    {
      "id": "truffle-fries",
      "name": "Truffle Fries",
      "quantity": 1,
      "unitPrice": 4500,
      "totalPrice": 4500,
      "category": "Sides"
    }
  ],

  "modifiers": [
    {
      "id": "add-cheddar",
      "name": "Extra Cheddar",
      "group": "Extras",
      "quantity": 2,
      "unitPrice": 1500,
      "totalPrice": 3000
    }
  ],

  "pricing": {
    "subtotal": 30300,
    "discountTotal": 0,
    "taxTotal": 4848,
    "deliveryFee": 2900,
    "serviceFee": 1500,
    "tip": 5000,
    "grandTotal": 44548,
    "currency": "MXN"
  },

  "discounts": [],

  "taxes": [
    {
      "id": "iva-16",
      "name": "IVA",
      "rate": 0.16,
      "amount": 4848,
      "includedInPrice": false
    }
  ],

  "payment": {
    "method": "ONLINE_PAYMENT",
    "status": "AUTHORIZED",
    "transactionId": "txn-uber-99887766",
    "amount": 44548
  },

  "delivery": {
    "type": "DELIVERY",
    "provider": "UberEats",
    "driverName": "Carlos",
    "driverPhone": "+52 55 9876 5432",
    "estimatedMinutes": 35,
    "scheduledAt": "2026-06-27T13:00:00.000Z"
  },

  "address": {
    "street": "Av. Reforma",
    "number": "222",
    "neighborhood": "Juárez",
    "city": "Ciudad de México",
    "state": "CDMX",
    "zipCode": "06600",
    "country": "MX",
    "lat": 19.4285,
    "lng": -99.1672,
    "instructions": "Edificio verde, piso 4",
    "reference": "Frente al Ángel"
  },

  "restaurant": {
    "id": "tonys-burger",
    "name": "Tony's Burgers",
    "branchId": "main-roma"
  },

  "channel": {
    "type": "DELIVERY_APP",
    "name": "Uber Eats",
    "version": "API v2.1"
  },

  "source": {
    "provider": "uber-eats",
    "applicationId": "ue-merchant-98765",
    "applicationVersion": "2026.06.01",
    "environment": "PRODUCTION"
  },

  "timestamps": {
    "orderedAt": "2026-06-27T12:30:00.000Z",
    "ingestedAt": "2026-06-27T12:30:02.150Z"
  },

  "analytics": {
    "sourceLocale": "es-MX",
    "convertedAt": "2026-06-27T12:30:02.100Z",
    "adapterVersion": "uber-eats-v1.0.0",
    "processingTimeMs": 2150,
    "dayOfWeek": "Saturday",
    "hourOfDay": 12,
    "servicePeriod": "lunch",
    "season": "summer",
    "isHoliday": false,
    "tags": ["vip-customer", "high-value"]
  }
}
```

### 9.2 WhatsApp Order (Converted to Canonical)

```json
{
  "orderId": "ord-wa-20260627-002",
  "version": "1.0.0",
  "status": "PENDING",
  "type": "TAKEOUT",

  "customer": {
    "name": "Juan Pérez",
    "phone": "+52 55 5555 1111"
  },

  "items": [
    {
      "id": "classic-burger",
      "name": "Classic Burger",
      "quantity": 1,
      "unitPrice": 8900,
      "totalPrice": 8900,
      "category": "Burgers"
    },
    {
      "id": "onion-rings",
      "name": "Onion Rings",
      "quantity": 2,
      "unitPrice": 3900,
      "totalPrice": 7800,
      "category": "Sides"
    }
  ],

  "pricing": {
    "subtotal": 16700,
    "discountTotal": 0,
    "taxTotal": 2672,
    "deliveryFee": 0,
    "grandTotal": 19372,
    "currency": "MXN"
  },

  "taxes": [
    {
      "id": "iva-16",
      "name": "IVA",
      "rate": 0.16,
      "amount": 2672,
      "includedInPrice": false
    }
  ],

  "payment": {
    "method": "CASH",
    "status": "PENDING",
    "amount": 19372
  },

  "delivery": {
    "type": "TAKEOUT"
  },

  "restaurant": {
    "id": "tonys-burger",
    "name": "Tony's Burgers"
  },

  "channel": {
    "type": "WHATSAPP",
    "name": "WhatsApp"
  },

  "source": {
    "provider": "whatsapp",
    "applicationId": "wa-business-5566",
    "environment": "PRODUCTION"
  },

  "timestamps": {
    "orderedAt": "2026-06-27T14:15:00.000Z",
    "ingestedAt": "2026-06-27T14:15:03.500Z"
  },

  "analytics": {
    "sourceLocale": "es-MX",
    "convertedAt": "2026-06-27T14:15:03.450Z",
    "adapterVersion": "whatsapp-v1.0.0",
    "processingTimeMs": 3500,
    "dayOfWeek": "Saturday",
    "hourOfDay": 14,
    "servicePeriod": "lunch",
    "season": "summer",
    "isHoliday": false
  }
}
```

### 9.3 POS Order (Converted to Canonical)

```json
{
  "orderId": "ord-pos-20260627-003",
  "version": "1.0.0",
  "status": "COMPLETED",
  "type": "DINE_IN",

  "customer": {
    "name": "Walk-in Customer",
    "phone": "+52 55 0000 0000"
  },

  "items": [
    {
      "id": "smash-double",
      "name": "Smash Double",
      "quantity": 1,
      "unitPrice": 12900,
      "totalPrice": 12900,
      "category": "Burgers"
    },
    {
      "id": "milkshake-vainilla",
      "name": "Milkshake Vainilla",
      "quantity": 1,
      "unitPrice": 6500,
      "totalPrice": 6500,
      "category": "Drinks"
    }
  ],

  "pricing": {
    "subtotal": 19400,
    "discountTotal": 0,
    "taxTotal": 3104,
    "deliveryFee": 0,
    "grandTotal": 22504,
    "currency": "MXN"
  },

  "taxes": [
    {
      "id": "iva-16",
      "name": "IVA",
      "rate": 0.16,
      "amount": 3104,
      "includedInPrice": false
    }
  ],

  "payment": {
    "method": "DEBIT_CARD",
    "status": "CAPTURED",
    "transactionId": "txn-pos-11223344",
    "amount": 22504
  },

  "delivery": {
    "type": "DINE_IN"
  },

  "restaurant": {
    "id": "tonys-burger",
    "name": "Tony's Burgers"
  },

  "channel": {
    "type": "POS",
    "name": "In-Store POS"
  },

  "source": {
    "provider": "pos-clover",
    "applicationId": "clover-merchant-3344",
    "environment": "PRODUCTION"
  },

  "timestamps": {
    "orderedAt": "2026-06-27T19:45:00.000Z",
    "confirmedAt": "2026-06-27T19:45:10.000Z",
    "preparedAt": "2026-06-27T19:47:00.000Z",
    "readyAt": "2026-06-27T19:52:00.000Z",
    "completedAt": "2026-06-27T20:15:00.000Z",
    "ingestedAt": "2026-06-27T19:45:01.000Z"
  },

  "analytics": {
    "sourceLocale": "es-MX",
    "convertedAt": "2026-06-27T19:45:01.000Z",
    "adapterVersion": "pos-clover-v1.0.0",
    "processingTimeMs": 1000,
    "dayOfWeek": "Saturday",
    "hourOfDay": 19,
    "servicePeriod": "dinner",
    "season": "summer",
    "isHoliday": false
  }
}
```

---

## 10. Glossary

| Term | Definition |
|---|---|
| **Canonical Order Event** | The single, standardized format for all orders entering Restaurant OS |
| **Adapter** | Component that converts a source-specific format to the Canonical Order Event |
| **Source** | The external system that originated the order (UberEats, POS, etc.) |
| **Channel** | The medium through which the order was placed (website, app, phone, etc.) |
| **Ingestion** | The process of receiving and validating a Canonical Order Event |
| **Request ID** | Idempotency key — ensures the same order is not processed multiple times |
| **Processing Time** | Time from order placement to ingestion (latency metric) |
| **Derived Field** | Computed from other fields in the same event |
| **Calculated Field** | Computed using system state (holidays, weather, etc.) |

---

## 11. Change Log

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | 2026-06-27 | Initial canonical spec. Defines full structure, validation, versioning, and 6 source conversions |
