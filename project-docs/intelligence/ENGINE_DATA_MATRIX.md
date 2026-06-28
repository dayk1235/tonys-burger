# Restaurant OS v2 — Engine Data Matrix

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Primary consumer — this engine processes this data type |
| ◐ | Secondary consumer — this engine receives derived events |
| ⬜ | No direct relationship |

---

## Matrix

| Data Source | Observation | Pattern | Evidence | Memory | Knowledge | Attention | Reasoning | Decision | Learning | Prediction | Recommendation | Planning | Execution |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Orders** | ✅ | ✅ | ◐ | ◐ | ⬜ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |
| **Inventory** | ✅ | ✅ | ◐ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |
| **Kitchen** | ✅ | ✅ | ◐ | ◐ | ⬜ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |
| **Delivery** | ✅ | ✅ | ◐ | ◐ | ⬜ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |
| **Customers** | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |
| **Sales** | ✅ | ✅ | ◐ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |
| **Weather** | ✅ | ✅ | ◐ | ◐ | ◐ | ◐ | ◐ | ⬜ | ⬜ | ✅ | ◐ | ⬜ | ⬜ |
| **Suppliers** | ✅ | ✅ | ◐ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |
| **Promotions** | ✅ | ✅ | ◐ | ◐ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |
| **Reviews** | ✅ | ✅ | ◐ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ⬜ |

---

## Flow Description

Each data source enters through **ObservationEngine**, which creates atomic observations. These observations flow through the cognitive pipeline:

1. **PatternEngine** detects patterns and trends in the observed data
2. **EvidenceEngine** validates and weights the evidence behind detected patterns
3. **MemoryEngine** consolidates validated observations into storable memories
4. **KnowledgeEngine** extracts structured knowledge from memories
5. **AttentionEngine** prioritizes what deserves focus based on business value
6. **ReasoningEngine** reasons about situations and generates alternatives
7. **DecisionEngine** evaluates alternatives and builds proposals
8. **LearningEngine** learns from decision outcomes
9. **PredictionEngine** generates forecasts from learned patterns
10. **RecommendationEngine** transforms predictions into recommendations
11. **PlanningEngine** creates execution plans from recommendations
12. **ExecutionEngine** dispatches controlled actions

---

## Key Observations

- **ObservationEngine** is the universal entry point — every data source enters here
- **PatternEngine** and **ReasoningEngine** have the broadest secondary reach
- **ExecutionEngine** is the terminal stage — no downstream engine consumes its output in V1
- **Weather** has the most limited pipeline reach (primarily influences prediction)
- **Customers** and **Sales** are the most richly connected data sources, feeding into nearly every engine
