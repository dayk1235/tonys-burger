# VS1-011 — Event Flow Matrix

---

## Complete Event Inventory

### Runtime Events

| Event | Producer | Subscribers | When |
|-------|----------|-------------|------|
| `runtime:started` | Runtime.boot() | None (informational) | Runtime enters OPERATING |
| `runtime:shutting-down` | Runtime.shutdown() | None | Pre-halt |
| `runtime:order-received` | Runtime.receive() | None (informational) | Each order ingested |
| `engine:state-change` | Every engine.start() | None (informational) | Engine state transition |
| `runtime.emergency` | External | AttentionEngine | External trigger |
| `runtime.context.change` | External | AttentionEngine | Context update |

### Observation Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `observation.lifecycle.potential_detected` | ObservationPipeline | None (informational) | Observation (raw) |
| `observation.lifecycle.candidate_verified` | ObservationPipeline | None | Observation (candidate) |
| `observation.lifecycle.context_assigned` | ObservationPipeline | None | Observation (contextualized) |
| `observation.lifecycle.historical_committed` | ObservationPipeline | **PatternEngine**, **MemoryEngine** | Observation (committed) |
| `observation.lifecycle.pattern_evidence_linked` | ObservationPipeline | None | Observation (pattern-linked) |
| `observation.lifecycle.knowledge_evidence_linked` | ObservationPipeline | None | Observation (knowledge-linked) |
| `observation.quality.deprecated` | ObservationPipeline | None | Observation (deprecated) |
| `observation.quality.corrected` | ObservationPipeline | None | Observation (corrected) |

### Pattern Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `pattern.lifecycle.potential_detected` | PatternPipeline | None | Pattern |
| `pattern.lifecycle.candidate_evaluated` | PatternPipeline | None | Pattern |
| `pattern.lifecycle.emerging_confirmed` | PatternPipeline | **MemoryEngine** | Pattern |
| `pattern.lifecycle.supported_established` | PatternPipeline | **EvidenceEngine**, **MemoryEngine** | Pattern |
| `pattern.lifecycle.validated_confirmed` | PatternPipeline | **EvidenceEngine**, **MemoryEngine** | Pattern |
| `pattern.lifecycle.strengthening_observed` | PatternPipeline | **MemoryEngine** | Pattern |
| `pattern.lifecycle.weakening_observed` | PatternPipeline | None | Pattern |
| `pattern.lifecycle.pattern_updated` | PatternPipeline | None | Pattern |
| `pattern.discovery.trend_detected` | PatternPipeline | **MemoryEngine** | Pattern (trend) |
| `pattern.discovery.anomaly_detected` | PatternPipeline | **MemoryEngine** | Pattern (anomaly) |
| `pattern.discovery.correlation_found` | PatternPipeline | **MemoryEngine** | Pattern (correlation) |
| `pattern.discovery.sequence_discovered` | PatternPipeline | **MemoryEngine** | Pattern (sequence) |

### Evidence Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `evidence.evaluation.started` | EvidencePipeline | None | Evidence metadata |
| `evidence.evaluation.completed` | EvidencePipeline | **MemoryEngine** | Evidence (evaluated) |
| `evidence.evaluation.failed` | EvidencePipeline | RecoveryPipeline | Error metadata |
| `evidence.lifecycle.candidate_created` | EvidencePipeline | None | Evidence |
| `evidence.lifecycle.supporting_established` | EvidencePipeline | None | Evidence |
| `evidence.lifecycle.conflicting_detected` | EvidencePipeline | None | Evidence |
| `evidence.lifecycle.validated_confirmed` | EvidencePipeline | **MemoryEngine** | Evidence (validated) |
| `evidence.lifecycle.rejected` | EvidencePipeline | None | Evidence |
| `evidence.lifecycle.historical_archived` | EvidencePipeline | None | Evidence |
| `evidence.lifecycle.archived` | EvidencePipeline | None | Evidence |
| `evidence.contradiction.detected` | EvidencePipeline | None | Contradiction info |
| `evidence.contradiction.resolved` | EvidencePipeline | None | Resolution info |

### Memory Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `memory.operation.created` | MemoryPipeline | None | Memory |
| `memory.lifecycle.working_created` | MemoryPipeline | None | Memory |
| `memory.lifecycle.candidate_promoted` | MemoryPipeline | None | Memory |
| `memory.lifecycle.short_term_established` | MemoryPipeline | None | Memory |
| `memory.lifecycle.stabilizing_started` | MemoryPipeline | None | Memory |
| `memory.lifecycle.consolidated` | MemoryPipeline | **KnowledgeEngine** | Memory |
| `memory.lifecycle.long_term_promoted` | MemoryPipeline | **KnowledgeEngine** | Memory |
| `memory.lifecycle.semantic_established` | MemoryPipeline | **KnowledgeEngine** | Memory |
| `memory.lifecycle.historical_archived` | MemoryPipeline | None | Memory |

### Knowledge Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `knowledge.operation.extracted` | KnowledgePipeline | None | Knowledge |
| `knowledge.lifecycle.extracted` | KnowledgePipeline | None | Knowledge |
| `knowledge.lifecycle.validated` | KnowledgePipeline | **AttentionEngine** | Knowledge |
| `knowledge.lifecycle.generalized` | KnowledgePipeline | None | Knowledge |
| `knowledge.lifecycle.specialized` | KnowledgePipeline | None | Knowledge |
| `knowledge.lifecycle.semantic` | KnowledgePipeline | None | Knowledge |
| `knowledge.lifecycle.canonical` | KnowledgePipeline | None | Knowledge |

### Attention Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `attention.operation.prioritized` | AttentionPipeline | **ReasoningEngine** | Attention |
| `attention.operation.focused` | AttentionPipeline | None | Attention |
| `attention.lifecycle.focused` | AttentionPipeline | None | Attention |
| `attention.lifecycle.interrupted` | AttentionPipeline | None | Attention |
| `attention.lifecycle.deferred` | AttentionPipeline | None | Attention |
| `attention.lifecycle.released` | AttentionPipeline | None | Attention |
| `attention.lifecycle.archived` | AttentionPipeline | None | Attention |

### Reasoning Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `reasoning.lifecycle.activated` | ReasoningPipeline | None | Reasoning case |
| `reasoning.lifecycle.hypothesis_generation` | ReasoningPipeline | None | Reasoning case |
| `reasoning.lifecycle.alternative_generation` | ReasoningPipeline | None | Reasoning case |
| `reasoning.lifecycle.constraint_evaluation` | ReasoningPipeline | None | Reasoning case |
| `reasoning.lifecycle.tradeoff_evaluation` | ReasoningPipeline | None | Reasoning case |
| `reasoning.lifecycle.confidence_assessment` | ReasoningPipeline | None | Reasoning case |
| `reasoning.lifecycle.conclusion_building` | ReasoningPipeline | None | Reasoning case |
| `reasoning.lifecycle.completed` | ReasoningPipeline | **DecisionEngine** | Reasoning case |

### Decision Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `decision.lifecycle.initiated` | DecisionPipeline | **LearningEngine** | Decision proposal |

### Learning Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `learning.lifecycle.initiated` | LearningPipeline | None | Learning cycle |
| `learning.lifecycle.completed` | LearningPipeline | **PredictionEngine** | Learning result |
| `learning.lifecycle.accepted` | LearningPipeline | **LearningEngine (SELF)** | Learning result |
| `learning.lifecycle.failed` | LearningPipeline | None | Error info |

### Prediction Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `prediction.lifecycle.initiated` | PredictionPipeline | None | Prediction |
| `prediction.lifecycle.completed` | PredictionPipeline | **RecommendationEngine** | Prediction result |
| `prediction.lifecycle.failed` | PredictionPipeline | None | Error info |

### Recommendation Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `recommendation.lifecycle.initiated` | RecommendationPipeline | None | Recommendation |
| `recommendation.lifecycle.completed` | RecommendationPipeline | **PlanningEngine** | Recommendation result |
| `recommendation.lifecycle.failed` | RecommendationPipeline | None | Error info |

### Planning Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `planning.lifecycle.initiated` | PlanningPipeline | None | Plan |
| `planning.lifecycle.completed` | PlanningPipeline | **ExecutionEngine** | Plan |
| `planning.lifecycle.failed` | PlanningPipeline | None | Error info |

### Execution Engine Events

| Event | Producer | Subscribers | Payload Entity |
|-------|----------|-------------|----------------|
| `execution.lifecycle.initiated` | ExecutionPipeline | ❌ NONE | Execution |
| `execution.lifecycle.completed` | ExecutionPipeline | ❌ NONE | Execution (never emitted) |
| `execution.lifecycle.failed` | ExecutionPipeline | None | Error info |

---

## Event Producer/Consumer Summary

```
observation.lifecycle.historical_committed (2 subscribers)
  → PatternEngine (receiveInput → pipeline)
  → MemoryEngine (receiveInput → pipeline)

pattern.lifecycle.* (8 events subscribed by MemoryEngine)
  → MemoryEngine

pattern.lifecycle.supported_established (2 subscribers)
  → EvidenceEngine (receiveInput)
  → MemoryEngine (receiveInput)

evidence.evaluation.completed (1 subscriber)
  → MemoryEngine

memory.lifecycle.consolidated (1 subscriber)
  → KnowledgeEngine

knowledge.lifecycle.validated (1 subscriber)
  → AttentionEngine

attention.operation.prioritized (1 subscriber)
  → ReasoningEngine

reasoning.lifecycle.completed (1 subscriber)
  → DecisionEngine

decision.lifecycle.initiated (1 subscriber)
  → LearningEngine

learning.lifecycle.completed (1 subscriber)
  → PredictionEngine

prediction.lifecycle.completed (1 subscriber)
  → RecommendationEngine

recommendation.lifecycle.completed (1 subscriber)
  → PlanningEngine

planning.lifecycle.completed (1 subscriber)
  → ExecutionEngine

execution.lifecycle.initiated (0 subscribers) ← DEAD END
```

### Key Missing Subscribers
- **ExecutionEngine output**: No consumer. `execution.lifecycle.initiated` has zero subscribers.
- **Dashboard**: Does not subscribe to any cognitive events. It has its own separate services in `src/features/dashboard/`.
