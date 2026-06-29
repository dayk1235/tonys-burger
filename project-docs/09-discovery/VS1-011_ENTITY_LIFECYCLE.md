# VS1-011 — Entity Lifecycle Matrix

---

## Observation

| Stage | Transition | Triggers | Persistence | Event |
|-------|-----------|----------|-------------|-------|
| POTENTIAL | Create | Input ingestion | In-memory (Map) | `observation.lifecycle.potential_detected` |
| CANDIDATE | Validate transition | After raw validation | In-memory (Map) | — |
| VERIFIED | Verification success | After invariant checks | In-memory (Map) | `observation.lifecycle.candidate_verified` |
| CONTEXTUALIZED | Context enrichment | After context bus query | In-memory (Map) | `observation.lifecycle.context_assigned` |
| HISTORICAL | Quality grading | After confidence calculation | In-memory (historicalStore + recentObservations[] bounded to 100) | `observation.lifecycle.historical_committed` |
| PATTERN_EVIDENCE | Link to pattern | External call (`linkToPattern`) | In-memory (same store) | `observation.lifecycle.pattern_evidence_linked` |
| KNOWLEDGE_EVIDENCE | Link to knowledge | External call (`linkToKnowledge`) | In-memory (same store) | `observation.lifecycle.knowledge_evidence_linked` |
| ARCHIVED | Archive | External call (`archiveObservation`) | In-memory (same store) | `observation.lifecycle.archived` |

**Final State:** ARCHIVED or remains in HISTORICAL  
**Deprecation:** Marked as `isDeprecated`, confidence set to 0.05, replacement linked via `correctedByObservationId`  
**Repository:** `ObservationPipeline.historicalStore` (Map<string, Observation>)  
**NOTE:** All persistence is in-memory. No database, no file storage.

---

## Pattern

| Stage | Transition | Triggers | Persistence | Event |
|-------|-----------|----------|-------------|-------|
| POTENTIAL | Create | Definition evaluation match | `PatternRegistry.store` (Map) | `pattern.lifecycle.potential_detected` |
| CANDIDATE | Inner stage (factory) | After factory createPotential | In-memory | — |
| EMERGING | Quality + Confidence | After quality evaluation | `PatternRegistry.store` | `pattern.lifecycle.emerging_confirmed` |
| SUPPORTED | `advancePattern()` | External transition | `PatternRegistry.store` | `pattern.lifecycle.supported_established` |
| VALIDATED | `advancePattern()` + strengthen | Recurring detection with new evidence | `PatternRegistry.store` | `pattern.lifecycle.validated_confirmed` |
| STRENGTHENING | Auto-transition on update | When new evidence found | `PatternRegistry.store` | `pattern.lifecycle.strengthening_observed` |
| WEAKENING | `advancePattern()` | External transition | `PatternRegistry.store` | `pattern.lifecycle.weakening_observed` |
| DEPRECATED | `deprecatePattern()` | External request | `PatternRegistry.store` | `pattern.lifecycle.deprecated` |
| HISTORICAL | `advancePattern()` | External transition | `PatternRegistry.store` | `pattern.lifecycle.historical_archived` |
| ARCHIVED | `advancePattern()` | External transition | `PatternRegistry.store` | — |

**Final State:** ARCHIVED or DEPRECATED  
**Repository:** `PatternRegistry.patterns` (Map<string, Pattern>) + `PatternRegistry.activePatterns` (Map)  
**Sub-entities generated during pipeline:** Correlations, Trends, Anomalies, Sequences

---

## Evidence

| Stage | Transition | Triggers | Persistence | Event |
|-------|-----------|----------|-------------|-------|
| CANDIDATE | Register | `evaluate()` called | `EvidenceMemory.store` (Map) | `evidence.lifecycle.candidate_created` |
| COLLECTING | Auto-progression | After registration | In-memory | `evidence.lifecycle.collecting_started` |
| SUPPORTING | No contradiction | After contradiction analysis | `EvidenceRegistry.update` | `evidence.lifecycle.supporting_established` |
| CONFLICTING | Has contradiction | After contradiction analysis | `EvidenceRegistry.update` | `evidence.lifecycle.conflicting_detected` |
| WEIGHTED | Auto after analysis | After scoring | In-memory | `evidence.lifecycle.weighted_calculated` |
| VALIDATED | `transition()` | External call | `EvidenceRegistry.update` | `evidence.lifecycle.validated_confirmed` |
| REJECTED | `transition()` | External call | `EvidenceRegistry.update` | `evidence.lifecycle.rejected` |
| HISTORICAL | `transition()` | External call | `EvidenceRegistry.update` | `evidence.lifecycle.historical_archived` |
| ARCHIVED | `transition()` | External call | `EvidenceRegistry.update` | `evidence.lifecycle.archived` |

**Final State:** VALIDATED, REJECTED, or ARCHIVED  
**Repository:** `EvidenceMemory.store` (Map) + `EvidenceRegistry` wrapper

---

## Memory

| Stage | Transition | Triggers | Persistence | Event |
|-------|-----------|----------|-------------|-------|
| WORKING | Create | `receiveInput()` from event | `MemoryIndex.index()` (internal Map) | `memory.lifecycle.working_created` |
| CANDIDATE | Auto-promote? | Via factory transition in receiveInput | `MemoryIndex` | `memory.lifecycle.candidate_promoted` |
| SHORT_TERM | Consolidation cycle | 60s cycle evaluates consolidation | `MemoryIndex` | `memory.lifecycle.short_term_established` |
| STABILIZING | Consolidation cycle | Further consolidation cycles | `MemoryIndex` | `memory.lifecycle.stabilizing_started` |
| CONSOLIDATED | Consolidation success | 60s cycle | `MemoryIndex` | `memory.lifecycle.consolidated` |
| LONG_TERM | Further consolidation | Extended cycle | `MemoryIndex` | `memory.lifecycle.long_term_promoted` |
| SEMANTIC | Abstraction | Extended cycle | `MemoryIndex` | `memory.lifecycle.semantic_established` |
| HISTORICAL | Forgetting/Archiving | Decay cycle or explicit archive | `MemoryIndex` | `memory.lifecycle.historical_archived` |
| ARCHIVED | Explicit archive | External call | `MemoryIndex` | `memory.lifecycle.archived` |

**Final State:** ARCHIVED or FORGOTTEN  
**Repository:** `MemoryIndex` (internal Map)  
**Side effects:** Decay tick runs every 60s on ALL memories. Consolidation evaluated every 60s.

---

## Knowledge

| Stage | Transition | Triggers | Persistence | Event |
|-------|-----------|----------|-------------|-------|
| CANDIDATE | Created internally | `extract()` in factory | `KnowledgeIndex.index()` | — |
| EXTRACTED | Pipeline create | `createKnowledge()` called | `KnowledgeIndex` | `knowledge.lifecycle.extracted` |
| STRUCTURED | (not implemented) | — | — | — |
| VALIDATED | `validateKnowledge()` | Auto-called in `receiveInput()` | `KnowledgeIndex` | `knowledge.lifecycle.validated` |
| GENERALIZED | `generalizeKnowledge()` | External call | `KnowledgeIndex` | `knowledge.lifecycle.generalized` |
| SPECIALIZED | `specializeKnowledge()` | External call | `KnowledgeIndex` | `knowledge.lifecycle.specialized` |
| SEMANTIC | `promoteToSemantic()` | External call | `KnowledgeIndex` | `knowledge.lifecycle.semantic` |
| CANONICAL | `promoteToCanonical()` | External call | `KnowledgeIndex` | `knowledge.lifecycle.canonical` |
| HISTORICAL | `deprecateKnowledge()` | External call | `KnowledgeIndex` | `knowledge.lifecycle.historical` |
| ARCHIVED | `archiveKnowledge()` | External call | `KnowledgeIndex` | `knowledge.lifecycle.archived` |

**Final State:** ARCHIVED  
**Repository:** `KnowledgeIndex` (internal Map)  
**Auto-validation:** `receiveInput()` calls `createKnowledge()` then immediately `validateKnowledge()`

---

## Attention

| Stage | Transition | Triggers | Persistence | Event |
|-------|-----------|----------|-------------|-------|
| CANDIDATE | Create input | `createFromInput()` in factory | `AttentionMemory.store` (Map) | — |
| OBSERVED | Pipeline | Cloned from CANDIDATE | `AttentionMemory` | `attention.lifecycle.observed` |
| SCORED | Priority computation | After scoring factors | `AttentionMemory` | `attention.lifecycle.scored` |
| QUEUED | Budget allocation | After allocation | `AttentionMemory` + `AttentionQueue` | `attention.lifecycle.queued` |
| FOCUSED | `focusOn()` | Scheduler tick picks top candidate | `AttentionMemory` | `attention.lifecycle.focused` |
| MAINTAINED | Scheduler | Sustained focus | `AttentionMemory` | `attention.lifecycle.maintained` |
| INTERRUPTED | `interruptAttention()` | Higher priority interruption | `AttentionMemory` | `attention.lifecycle.interrupted` |
| DEFERRED | `deferAttention()` | Scheduler decision | `AttentionMemory` | `attention.lifecycle.deferred` |
| RELEASED | `releaseAttention()` | Scheduler tick | `AttentionMemory` | `attention.lifecycle.released` |
| ARCHIVED | `archiveAttention()` | External call | `AttentionMemory` | `attention.lifecycle.archived` |

**Final State:** ARCHIVED  
**Repository:** `AttentionMemory.store` (Map) + `AttentionQueue`

---

## Reasoning

| Stage | Transition | Triggers | Persistence | Event |
|-------|-----------|----------|-------------|-------|
| CANDIDATE | Created internally | Factory creation | `ReasoningWorkspace` | — |
| ACTIVATED | Pipeline start | `createCase()` | Workspace | `reasoning.lifecycle.activated` |
| CONTEXT_BUILDING | Pipeline | Auto | Workspace | `reasoning.lifecycle.context_building` |
| INFORMATION_GAP_DETECTION | Pipeline | Auto | Workspace | `reasoning.lifecycle.information_gap_detection` |
| EVIDENCE_GATHERING | Pipeline | Auto | Workspace | `reasoning.lifecycle.evidence_gathering` |
| KNOWLEDGE_RETRIEVAL | Pipeline | Auto (mock) | Workspace | `reasoning.lifecycle.knowledge_retrieval` |
| HYPOTHESIS_GENERATION | Pipeline | Auto | Workspace | `reasoning.lifecycle.hypothesis_generation` |
| ALTERNATIVE_GENERATION | Pipeline | Auto | Workspace | `reasoning.lifecycle.alternative_generation` |
| CONSTRAINT_EVALUATION | Pipeline | Auto | Workspace | `reasoning.lifecycle.constraint_evaluation` |
| TRADEOFF_EVALUATION | Pipeline | Auto | Workspace | `reasoning.lifecycle.tradeoff_evaluation` |
| CONSISTENCY_CHECKING | Pipeline | Auto | Workspace | `reasoning.lifecycle.consistency_checking` |
| CONFIDENCE_ASSESSMENT | Pipeline | Auto | Workspace | `reasoning.lifecycle.confidence_assessment` |
| CONFIDENCE_EXPLANATION | Pipeline | Auto | Workspace | `reasoning.lifecycle.confidence_explanation` |
| CONCLUSION_BUILDING | Pipeline | Auto | Workspace | `reasoning.lifecycle.conclusion_building` |
| COMPLETED | Pipeline | Auto | Workspace | `reasoning.lifecycle.completed` |
| ARCHIVED | External call | Manual | Clears workspace | `reasoning.lifecycle.archived` |
| RETIRED | External call | Manual | Clears workspace | `reasoning.lifecycle.retired` |

**Final State:** COMPLETED, ARCHIVED, or RETIRED  
**Repository:** `ReasoningWorkspace` (Map of active cases)

---

## Decision (Shell)

| Stage | Transition | Triggers | Persistence | Event |
|-------|-----------|----------|-------------|-------|
| INITIATED | Pipeline | `initiateDecision()` | None (ephemeral) | `decision.lifecycle.initiated` |

**Final State:** INITIATED (no further transitions implemented)  
**Repository:** None. Decision proposal ID generated; no actual storage.

---

## Learning, Prediction, Recommendation, Planning, Execution (Shells)

All follow the same pattern:
1. Receive input → validate → emit INITIATED event → return result
2. No internal state machine, no pipeline stages, no entity persistence
3. `decision.lifecycle.accepted` constant incorrectly namespaced under `decision` but exported from `LearningEvents`

**Final State:** All are ephemeral. No actual entities persisted.
