# VS1-011 — Execution Graph

---

## Complete Directed Acyclic Graph (DAG)

### Nodes

| ID | Type | Label | Source File |
|----|------|-------|-------------|
| API | Entry | POST /api/orders | `src/app/api/orders/route.ts` |
| OBS | Engine | ObservationEngine | `src/core/engines/observation/ObservationEngine.ts` |
| OBS_PIPELINE | Pipeline | ObservationPipeline | `src/core/engines/observation/ObservationPipeline.ts` |
| PAT | Engine | PatternEngine | `src/core/engines/pattern/PatternEngine.ts` |
| PAT_PIPELINE | Pipeline | PatternPipeline | `src/core/engines/pattern/PatternPipeline.ts` |
| EVI | Engine | EvidenceEngine | `src/core/engines/evidence/EvidenceEngine.ts` |
| EVI_PIPELINE | Pipeline | EvidencePipeline | `src/core/engines/evidence/EvidencePipeline.ts` |
| MEM | Engine | MemoryEngine | `src/core/engines/memory/MemoryEngine.ts` |
| MEM_PIPELINE | Pipeline | MemoryPipeline | `src/core/engines/memory/MemoryPipeline.ts` |
| KNW | Engine | KnowledgeEngine | `src/core/engines/knowledge/KnowledgeEngine.ts` |
| KNW_PIPELINE | Pipeline | KnowledgePipeline | `src/core/engines/knowledge/KnowledgePipeline.ts` |
| ATT | Engine | AttentionEngine | `src/core/engines/attention/AttentionEngine.ts` |
| ATT_PIPELINE | Pipeline | AttentionPipeline | `src/core/engines/attention/AttentionPipeline.ts` |
| REA | Engine | ReasoningEngine | `src/core/engines/reasoning/ReasoningEngine.ts` |
| REA_PIPELINE | Pipeline | ReasoningPipeline | `src/core/engines/reasoning/ReasoningPipeline.ts` |
| DEC | Engine | DecisionEngine | `src/core/engines/decision/DecisionEngine.ts` |
| DEC_PIPELINE | Pipeline | DecisionPipeline | `src/core/engines/decision/DecisionPipeline.ts` |
| LRN | Engine | LearningEngine | `src/core/engines/learning/LearningEngine.ts` |
| LRN_PIPELINE | Pipeline | LearningPipeline | `src/core/engines/learning/LearningPipeline.ts` |
| PRD | Engine | PredictionEngine | `src/core/engines/prediction/PredictionEngine.ts` |
| PRD_PIPELINE | Pipeline | PredictionPipeline | `src/core/engines/prediction/PredictionPipeline.ts` |
| REC | Engine | RecommendationEngine | `src/core/engines/recommendation/RecommendationEngine.ts` |
| REC_PIPELINE | Pipeline | RecommendationPipeline | `src/core/engines/recommendation/RecommendationPipeline.ts` |
| PLN | Engine | PlanningEngine | `src/core/engines/planning/PlanningEngine.ts` |
| PLN_PIPELINE | Pipeline | PlanningPipeline | `src/core/engines/planning/PlanningPipeline.ts` |
| EXE | Engine | ExecutionEngine | `src/core/engines/execution/ExecutionEngine.ts` |
| EXE_PIPELINE | Pipeline | ExecutionPipeline | `src/core/engines/execution/ExecutionPipeline.ts` |
| EB | System | EventBus | `src/core/runtime/EventBus.ts` |
| SCHED | System | RuntimeScheduler | `src/core/runtime/RuntimeScheduler.ts` |
| CB | System | ContextBus | `src/core/runtime/ContextBus.ts` |
| WM | System | WorkingMemory | `src/core/runtime/WorkingMemory.ts` |
| RUNTIME | System | Runtime | `src/core/runtime/Runtime.ts` |

### Edges

```
API --[HTTP POST]--> RUNTIME.receive()
RUNTIME --[direct call]--> OBS.receiveInput()
OBS --[processStimulus]--> OBS_PIPELINE
OBS_PIPELINE --[emit: observation.lifecycle.historical_committed]--> EB

EB --[subscriber: PatternEngine]--> PAT
PAT --[processObservation]--> PAT_PIPELINE
PAT_PIPELINE --[emit: pattern.lifecycle.*]--> EB

EB --[subscriber: EvidenceEngine]--> EVI
EVI --[evaluate]--> EVI_PIPELINE
EVI_PIPELINE --[emit: evidence.*]--> EB

EB --[subscriber: MemoryEngine (multiple events)]--> MEM
MEM --[createMemory]--> MEM_PIPELINE
MEM_PIPELINE --[emit: memory.lifecycle.*]--> EB
MEM_PIPELINE --[60s timer: processCycle]--> (internal decay/consolidation)

EB --[subscriber: KnowledgeEngine]--> KNW
KNW --[createKnowledge]--> KNW_PIPELINE
KNW_PIPELINE --[emit: knowledge.lifecycle.validated]--> EB

EB --[subscriber: AttentionEngine]--> ATT
ATT --[createAttention/tick]--> ATT_PIPELINE
ATT_PIPELINE --[1s timer: tick]--> (internal scheduling)
ATT_PIPELINE --[emit: attention.operation.prioritized]--> EB

EB --[subscriber: ReasoningEngine]--> REA
REA --[createCase]--> REA_PIPELINE
REA_PIPELINE --[emit: reasoning.lifecycle.completed]--> EB

EB --[subscriber: DecisionEngine]--> DEC
DEC --[initiateDecision]--> DEC_PIPELINE
DEC_PIPELINE --[emit: decision.lifecycle.initiated]--> EB

EB --[subscriber: LearningEngine]--> LRN
LRN --[initiateLearning]--> LRN_PIPELINE
LRN_PIPELINE --[emit: learning.lifecycle.initiated/completed]--> EB
LRN --[SELF: subscribes to learning.lifecycle.accepted]--> (cycle risk)

EB --[subscriber: PredictionEngine]--> PRD
PRD --[initiatePrediction]--> PRD_PIPELINE
PRD_PIPELINE --[emit: prediction.lifecycle.completed]--> EB

EB --[subscriber: RecommendationEngine]--> REC
REC --[initiateRecommendation]--> REC_PIPELINE
REC_PIPELINE --[emit: recommendation.lifecycle.completed]--> EB

EB --[subscriber: PlanningEngine]--> PLN
PLN --[initiatePlan]--> PLN_PIPELINE
PLN_PIPELINE --[emit: planning.lifecycle.completed]--> EB

EB --[subscriber: ExecutionEngine]--> EXE
EXE --[initiateExecution]--> EXE_PIPELINE
EXE_PIPELINE --[emit: execution.lifecycle.initiated]--> EB
```

### Cycles Detected

| Cycle | Risk | Source |
|-------|------|--------|
| LearningEngine subscribes to `learning.lifecycle.accepted` | Self-triggering loop | `src/core/engines/learning/LearningEngine.ts:105` |
| Memory 60s cycle continuously consolidates/decays | No-op cycle (no real harm) | `src/core/engines/memory/MemoryPipeline.ts:344` |

### Dead Ends

| Dead End | Location |
|----------|----------|
| `execution.lifecycle.initiated` — NO SUBSCRIBERS | `src/core/engines/execution/ExecutionPipeline.ts:28` |
| `execution.lifecycle.completed` — never emitted | `src/core/engines/execution/ExecutionPipeline.ts` |
| No business action output from ExecutionEngine | `src/core/engines/execution/ExecutionEngine.ts` |
| DecisionEngine never actually evaluates alternatives | `src/core/engines/decision/DecisionPipeline.ts` |
| Pipeline result returned to HTTP caller but never used downstream | `src/app/api/orders/route.ts:214` |

### Forks

- `observation.lifecycle.historical_committed` → PatternEngine + MemoryEngine (parallel)
- `pattern.lifecycle.*` events → EvidenceEngine + MemoryEngine (parallel)
- `evidence.*` events → MemoryEngine only (single consumer)

### Joins

- MemoryEngine consumes events from: Observation, Pattern, Evidence — data converges in memory store
- AttentionEngine is the join point before Reasoning (consumes Knowledge validated events)
