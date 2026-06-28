# Restaurant OS v2 — Intelligence Roadmap

---

## ~~Stop Building the Brain. Start Feeding the Brain.~~

Restaurant OS v1 built the cognitive architecture — 13 engines, a shared Runtime, an event-driven pipeline from Observation to Execution. The brain is complete.

Restaurant OS v2 feeds the brain with real data.

---

## V1 vs V2

| Dimension | V1 (Architecture Phase) | V2 (Intelligence Phase) |
|---|---|---|
| **Focus** | Building cognitive infrastructure | Feeding real data into the infrastructure |
| **Pipeline** | 13 engines connected, 5 pending | Complete 18/18 + connect real data sources |
| **Data** | Demo/mock data for smoke tests | Real restaurant data (orders, inventory, kitchen) |
| **Engines** | Structural integration | Cognitive activation — engines process real data |
| **Validation** | Architecture correctness | Intelligence quality (accuracy, relevance) |
| **Output** | Proposals and recommendations | Actionable business intelligence |

---

## Objective

Restaurant OS v2 exists to transform the certified cognitive architecture of V1 into a functioning intelligence system by connecting real data sources and activating the cognitive pipeline with real business data.

---

## Philosophy

The architecture is not the product. The intelligence is the product.

V1 proved the brain can work. V2 will prove the brain can think.

Every engine in V1 was designed to consume, process, and produce data. V2 feeds that data. No new engines will be built in V2 unless required by the roadmap.

---

## General Objectives

1. Connect real data sources to the Observation Engine
2. Activate the full cognitive pipeline with real data
3. Complete the remaining 5 engines (Conversation, Reflection, Coordination, Business Pulse, Human Experience)
4. Produce measurable business intelligence from real data
5. Validate intelligence quality through business outcomes

---

## Scope

- Integrate real data sources (Orders, Inventory, Kitchen, Delivery, Customers, Sales, Weather, Suppliers, Promotions, Reviews)
- Complete the remaining pipeline engines (VS3)
- Activate cognitive processing on real data
- Produce dashboard intelligence from real pipeline output
- Validate intelligence accuracy and business relevance

---

## Non-Objectives

- No new engine architecture (unless VS3 requires it)
- No changes to the Runtime core
- No changes to the EventBus
- No changes to the Validation Sprint Methodology
- No changes to the Engine Implementation Standard
- No modifying existing dashboard components beyond data source integration

---

## Intelligence Sprints

| Sprint | Focus | Objective |
|---|---|---|
| IS1 | Real Order Integration | Connect real order data to the full Observation→Execution pipeline |
| IS2 | Inventory Intelligence | Add inventory data source, activate inventory intelligence |
| IS3 | Kitchen Intelligence | Add kitchen operations data, activate kitchen intelligence |
| IS4 | Customer Intelligence | Add customer data, activate customer behavior intelligence |
| IS5 | Business Intelligence | Aggregate all sources into unified business intelligence |

---

## Intelligence Sprint Lifecycle

Every Intelligence Sprint (IS1 through IS5) shall follow this mandatory lifecycle:

```
Planning
    ↓
Specification
    ↓
Architecture Design Review (ADR) — cuando aplique
    ↓
Freeze — cuando aplique
    ↓
Implementation
    ↓
Controlled Validation (CV)
    ↓
Audit
    ↓
Closing Report
    ↓
Next Sprint
```

### Rules

| # | Rule |
|---|---|
| **R01** | A Sprint is only COMPLETED when all 10 completion criteria are met (LAW_065) |
| **R02** | No new Sprint may begin until the previous Sprint is officially closed |
| **R03** | The Closing Report freezes the Sprint — no functional changes may be added afterward |
| **R04** | ADR and Freeze stages are optional but mandatory when Core Architecture contracts are involved |
| **R05** | Every Sprint must produce a CV, an Audit, and a Closing Report as minimum evidence |
| **R06** | Evidence always takes priority over assertions |

This lifecycle is governed by LAW_065 (Sprint Completion Rule) and is binding for all Intelligence Phase work.

## Baseline Commitment

Restaurant OS v1 (AUD-MASTER-001) is the certified baseline. No V2 change may break the certified architecture. All V2 work must pass the same Validation Sprint Methodology (LAW_062, LAW_063) that governed V1.
