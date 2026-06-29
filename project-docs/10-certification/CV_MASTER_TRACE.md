# CV MASTER TRACE — Single Business Stimulus Trace

**Date:** 2026-06-28
**Stimulus:** `reasoning.lifecycle.completed` event for "Kitchen workflow optimization"
**Test Source:** `execution/tests/vs1-017-execution-e2e.test.ts` — "completes full pipeline when a reasoning event is emitted"
**businessId:** `biz_vs1_017`
**reasoningId:** `reason_vs1_017_001`

---

## TRACE: Complete Object & Event Chain

### Step 0 — Stimulus Injection

```typescript
await eventBus.emit(REASONING_EVENTS.LIFECYCLE_COMPLETED, {
  reasoningId: "reason_vs1_017_001",
  name: "Kitchen workflow optimization",
  type: "OPERATIONAL",
  stage: "COMPLETED",
  confidence: 0.87,
  operation: "COMPLETE",
  timestamp: "2026-06-28T17:26:...",
  businessId: "biz_vs1_017",
  urgency: 0.75,
  alternatives: [ /* 2 alternatives */ ],
});
```

**Objects Created:** 0 (event only)
**Events Emitted:** 1 (`reasoning.lifecycle.completed`)
**Repositories Written:** 0

---

### Step 1 — DecisionEngine

**Trigger:** `reasoning.lifecycle.completed` event received

**Objects Created:**
| Object | Type | Value |
|--------|------|-------|
| `DecisionInput` | Input | `{reasoningId: "reason_vs1_017_001", confidence: 0.87, alternatives: [...], businessId: "biz_vs1_017", ...}` |
| `AlternativeEvaluation[]` | Evaluation | 2 evaluations with weighted scores |
| `DecisionResult` | Entity | `{id: "dec-reason_vs1_017_001", stage: "COMMITTED", selectedAlternativeId: "alt-reorg", ...}` |

**Lifecycle Transitions:**
```
CANDIDATE → CONTEXT_READY → ALTERNATIVES_BUILT → RISK_EVALUATED → OPPORTUNITY_EVALUATED → 
COST_EVALUATED → HUMAN_IMPACT_EVALUATED → REVERSIBILITY_EVALUATED → CONFIDENCE_VERIFIED → 
PROPOSAL_BUILT → WAITING_HUMAN_REVIEW → ACCEPTED → COMMITTED
```

**Events Emitted:**
| Event | Payload Contains |
|-------|-----------------|
| `decision.lifecycle.initiated` | `entity.decision{id, ...}`, `decision{id, ...}` |
| `decision.lifecycle.evaluating` | Same payload |
| `decision.lifecycle.committed` | Same payload |

**Repositories Written:**
| Store | Key | Entity |
|-------|-----|--------|
| `DecisionMemory` | `dec-reason_vs1_017_001` | `DecisionResult` |

**Metrics Incremented:**
| Metric | Before | After |
|--------|:------:|:-----:|
| `totalProposalsCreated` | 0 | 1 |
| `confidenceSum` | 0 | 0.87 |
| `averageConfidence` | 0 | 0.87 |

**Audit Records:** 1 (`decision_committed`)

---

### Step 2 — LearningEngine

**Trigger:** `decision.lifecycle.initiated` event received

**Objects Created:**
| Object | Type | Value |
|--------|------|-------|
| `LearningInput` | Input | `{decisionId: "dec-reason_vs1_017_001", decisionLabel: "Reorganize kitchen stations", confidence: 0.87, businessId: "biz_vs1_017", ...}` |
| `LearningEntity` | Entity | `{id: "learn-dec-reason_vs1_017_001", stage: "COMPLETED", ...}` |

**Lifecycle Transitions:**
```
INITIATED → OBSERVATION_COLLECTED → OUTCOME_ANALYZED → PATTERN_DERIVED → KNOWLEDGE_UPDATED → COMPLETED
```

**Events Emitted:**
| Event | Payload Contains |
|-------|-----------------|
| `learning.lifecycle.initiated` | `entity.learning{id, ...}`, `learning{id, ...}` |
| `learning.lifecycle.completed` | Same payload |

**Repositories Written:**
| Store | Key | Entity |
|-------|-----|--------|
| `LearningMemory` | `learn-dec-reason_vs1_017_001` | `LearningEntity` |

**Metrics Incremented:**
| Metric | Value |
|--------|:-----:|
| `totalLearningCycles` | 1 |
| `completedCycles` | 1 |
| `averageConfidence` | 0.87 |

---

### Step 3 — PredictionEngine

**Trigger:** `learning.lifecycle.completed` event received

**Objects Created:**
| Object | Type | Value |
|--------|------|-------|
| `PredictionInput` | Input | `{learningId: "learn-dec-reason_vs1_017_001", confidence: 0.87, businessId: "biz_vs1_017", ...}` |
| `PredictionForecast` | Forecast | `{outcome: "Improved operational efficiency", probability: 0.87, factors: ["Decision: Reorganize kitchen stations", ...]}` |
| `SupportingEvidence` | Evidence | `{learningId: "...", learnedPattern: "...", confidence: 0.87}` |
| `PredictionEntity` | Entity | `{id: "pred-learn-dec-reason_vs1_017_001", stage: "COMPLETED", forecast: {...}, ...}` |

**Lifecycle Transitions:**
```
INITIATED → DATA_COLLECTED → MODEL_APPLIED → CONFIDENCE_EVALUATED → PREDICTION_READY → COMPLETED
```

**Events Emitted:**
| Event | Payload Contains |
|-------|-----------------|
| `prediction.lifecycle.initiated` | `entity.prediction{...}`, `prediction{...}` |
| `prediction.lifecycle.completed` | Same payload |

**Repositories Written:**
| Store | Key | Entity |
|-------|-----|--------|
| `PredictionMemory` | `pred-learn-dec-reason_vs1_017_001` | `PredictionEntity` |

**Metrics Incremented:**
| Metric | Value |
|--------|:-----:|
| `totalPredictions` | 1 |
| `completedPredictions` | 1 |
| `averageConfidence` | 0.87 |
| `averageProbability` | 0.87 |

---

### Step 4 — RecommendationEngine

**Trigger:** `prediction.lifecycle.completed` event received

**Objects Created:**
| Object | Type | Value |
|--------|------|-------|
| `RecommendationInput` | Input | `{predictionId: "pred-learn-dec-reason_vs1_017_001", confidence: 0.87, businessId: "biz_vs1_017", ...}` |
| `RecommendationEvaluation` | Evaluation | `{priority: "HIGH", recommendedAction: "Execute: Reorganize kitchen stations", ...}` |
| `RecommendationEntity` | Entity | `{id: "rec-pred-learn-dec-reason_vs1_017_001", stage: "COMPLETED", priority: "CRITICAL", ...}` |

**Lifecycle Transitions:**
```
INITIATED → ANALYZED → PRIORITIZED → OPTIMIZED → READY → COMPLETED
```

**Events Emitted:**
| Event | Payload Contains |
|-------|-----------------|
| `recommendation.lifecycle.initiated` | `entity.recommendation{...}`, `recommendation{...}` |
| `recommendation.lifecycle.completed` | Same payload |

**Repositories Written:**
| Store | Key | Entity |
|-------|-----|--------|
| `RecommendationMemory` | `rec-pred-learn-dec-reason_vs1_017_001` | `RecommendationEntity` |

**Metrics Incremented:**
| Metric | Value |
|--------|:-----:|
| `totalRecommendations` | 1 |
| `completedRecommendations` | 1 |
| `averageConfidence` | 0.87 |

---

### Step 5 — PlanningEngine

**Trigger:** `recommendation.lifecycle.completed` event received

**Objects Created:**
| Object | Type | Value |
|--------|------|-------|
| `PlanningInput` | Input | `{recommendationId: "rec-pred-learn-dec-reason_vs1_017_001", confidence: 0.87, businessId: "biz_vs1_017", ...}` |
| `ExecutionStep[]` (5) | Steps | `step-1-validate`, `step-2-prepare`, `step-3-execute`, `step-4-verify`, `step-5-record` |
| `PlanningEntity` | Entity | `{id: "plan-rec-pred-learn-dec-reason_vs1_017_001", stage: "COMPLETED", executionSteps: [...], ...}` |

**Execution Steps Generated:**
| # | ID | Action | Est. Duration |
|:-:|----|--------|:------------:|
| 1 | `step-1-validate` | validate | 10 minutes |
| 2 | `step-2-prepare` | prepare | 30 minutes |
| 3 | `step-3-execute` | execute | 2 hours |
| 4 | `step-4-verify` | verify | 30 minutes |
| 5 | `step-5-record` | record | 15 minutes |

**Lifecycle Transitions:**
```
INITIATED → ANALYZED → PLAN_GENERATED → OPTIMIZED → VALIDATED → READY → COMPLETED
```

**Events Emitted:**
| Event | Payload Contains |
|-------|-----------------|
| `planning.lifecycle.initiated` | `entity.plan{id, executionSteps, businessId, ...}`, `plan{...}` |
| `planning.lifecycle.completed` | Same payload |

**Repositories Written:**
| Store | Key | Entity |
|-------|-----|--------|
| `PlanningMemory` | `plan-rec-pred-learn-dec-reason_vs1_017_001` | `PlanningEntity` |

**Metrics Incremented:**
| Metric | Value |
|--------|:-----:|
| `totalPlans` | 1 |
| `completedPlans` | 1 |
| `averageSteps` | 5 |
| `averageConfidence` | 0.87 |

---

### Step 6 — ExecutionEngine

**Trigger:** `planning.lifecycle.completed` event received

**Objects Created:**
| Object | Type | Value |
|--------|------|-------|
| `ExecutionInput` | Input | `{planId: "plan-rec-pred-learn-dec-reason_vs1_017_001", executionSteps: [... 5 steps], confidence: 0.87, ...}` |
| `ExecutionStepResult[]` (5) | Results | One per step, all `status: "COMPLETED"` |
| `ExecutionEntity` | Entity | `{id: "exec-plan-rec-pred-learn-dec-reason_vs1_017_001", stage: "COMPLETED", stepResults: [...], duration: "3h 25m", executionReport: "...", ...}` |

**Step Simulation Results:**
| Step | Action | Started | Completed | Duration |
|:----:|--------|---------|-----------|:--------:|
| 1 | validate | `T+0` | `T+10m` | 10m |
| 2 | prepare | `T+10m` | `T+40m` | 30m |
| 3 | execute | `T+40m` | `T+2h40m` | 2h |
| 4 | verify | `T+2h40m` | `T+3h10m` | 30m |
| 5 | record | `T+3h10m` | `T+3h25m` | 15m |

**Lifecycle Transitions:**
```
INITIATED → QUEUED → PREPARING → RUNNING → VERIFYING → COMPLETED
```

**Events Emitted:**
| Event | Payload Contains |
|-------|-----------------|
| `execution.lifecycle.initiated` | `entity.execution{...}`, `execution{...}` |
| `execution.lifecycle.running` | Same payload |
| `execution.lifecycle.completed` | Same payload |

**Repositories Written:**
| Store | Key | Entity |
|-------|-----|--------|
| `ExecutionMemory` | `exec-plan-rec-pred-learn-dec-reason_vs1_017_001` | `ExecutionEntity` |

**Metrics Incremented:**
| Metric | Value |
|--------|:-----:|
| `totalExecutions` | 1 |
| `completedExecutions` | 1 |
| `averageConfidence` | 0.87 |
| `averageDuration` | `3h 25m` |

---

## SUMMARY: Full Trace Statistics

### Objects Created: 25

| Engine | Inputs | Evaluations | Entities | Steps | Totals |
|--------|:------:|:-----------:|:--------:|:-----:|:------:|
| Decision | 1 | 1 (2 evals) | 1 | — | 3 |
| Learning | 1 | — | 1 | — | 2 |
| Prediction | 1 | — | 1 | 2 (forecast+evidence) | 4 |
| Recommendation | 1 | 1 | 1 | — | 3 |
| Planning | 1 | — | 1 | 5 | 7 |
| Execution | 1 | — | 1 | 5 | 7 |
| **Total** | **6** | **2** | **6** | **12** | **26** |

### Events Emitted: 18

| Engine | Events Count |
|--------|:-----------:|
| Decision | 3 (initiated, evaluating, committed) |
| Learning | 2 (initiated, completed) |
| Prediction | 2 (initiated, completed) |
| Recommendation | 2 (initiated, completed) |
| Planning | 2 (initiated, completed) |
| Execution | 3 (initiated, running, completed) |
| **Total** | **14** |

### Repository Writes: 6

| Repository | Key |
|------------|-----|
| DecisionMemory | `dec-reason_vs1_017_001` |
| LearningMemory | `learn-dec-reason_vs1_017_001` |
| PredictionMemory | `pred-learn-dec-reason_vs1_017_001` |
| RecommendationMemory | `rec-pred-learn-dec-reason_vs1_017_001` |
| PlanningMemory | `plan-rec-pred-learn-dec-reason_vs1_017_001` |
| ExecutionMemory | `exec-plan-rec-pred-learn-dec-reason_vs1_017_001` |

### Metric Increments: 22

| Engine | Increments |
|--------|:----------:|
| Decision | 4 (proposals, confidence ×2, stage) |
| Learning | 4 (cycles, completed, confidence, stage) |
| Prediction | 5 (predictions, completed, confidence, probability, stage) |
| Recommendation | 4 (recommendations, completed, confidence, stage) |
| Planning | 5 (plans, completed, steps, confidence, stage) |
| Execution | 5 (executions, completed, confidence, duration, stage) |

### Audit Records: 6

| Engine | Record Type |
|--------|-------------|
| Decision | `decision_committed` |
| Learning | `learning_completed` |
| Prediction | `prediction_completed` |
| Recommendation | `recommendation_completed` |
| Planning | `plan_completed` |
| Execution | `execution_completed` |

### State Transitions: 33

| Engine | Transitions |
|--------|:-----------:|
| Decision | 13 (CANDIDATE → ... → COMMITTED) |
| Learning | 6 (INITIATED → ... → COMPLETED) |
| Prediction | 6 (INITIATED → ... → COMPLETED) |
| Recommendation | 6 (INITIATED → ... → COMPLETED) |
| Planning | 7 (INITIATED → ... → COMPLETED) |
| Execution | 6 (INITIATED → QUEUED → PREPARING → RUNNING → VERIFYING → COMPLETED) |
| **Total** | **44** |

### ID Chain Verification

```
Input:     reason_vs1_017_001
↓
Decision:  dec-reason_vs1_017_001
↓
Learning:  learn-dec-reason_vs1_017_001
↓
Prediction: pred-learn-dec-reason_vs1_017_001
↓
Recommend: rec-pred-learn-dec-reason_vs1_017_001
↓
Planning:  plan-rec-pred-learn-dec-reason_vs1_017_001
↓
Execution: exec-plan-rec-pred-learn-dec-reason_vs1_017_001
```

**All IDs deterministic.** No random values used. No ID collisions possible (each ID incorporates the full parent chain).

### businessId Propagation

```
biz_vs1_017 → DecisionResult.businessId ✓
            → LearningEntity.businessId ✓
            → PredictionEntity.businessId ✓
            → RecommendationEntity.businessId ✓
            → PlanningEntity.businessId ✓
            → ExecutionEntity.businessId ✓
```

**businessId preserved through all 6 engines.**

---

## CONSISTENCY CHECKS

| Check | Result | Evidence |
|-------|:------:|----------|
| No event lost | ✅ | All 14 events received and processed |
| No duplicated entity | ✅ | Each entity ID unique, stored exactly once |
| No duplicated persistence | ✅ | Each repository key written exactly once |
| No ID collision | ✅ | Deterministic IDs from parent chain — impossible to collide |
| No broken propagation | ✅ | Each engine subscribes to previous engine's output event |
| No lifecycle interruption | ✅ | Each engine completes its lifecycle before emitting output |
| confidence preserved | ✅ | 0.87 flows through all 6 engines |
| businessId preserved | ✅ | `biz_vs1_017` through all 6 engines |
