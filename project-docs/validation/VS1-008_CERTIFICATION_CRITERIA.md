# VS1-008 — CERTIFICATION CRITERIA

**Memory Subsystem**
**Date:** 2026-06-28

---

## Convention

Certifying ONLY the current Memory subsystem as it exists today (in-memory, non-deterministic).

Criteria requiring persistence, determinism, or complete event emission are removed and deferred to their respective BFs.

### CRITICAL (All Must Pass)

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| C01 | **Memory creation from valid MemoryInput produces correct structure** — all required fields populated, stage = WORKING, version = 1 | Unit test: feed valid input → assert Memory structure |
| C02 | **Memory creation requires all 7 input fields** — evidenceId, patternId, name, businessId, strength [0,1], confidence [0,1], observationIds non-empty | Unit test: each missing/empty field throws MemoryValidationError |
| C03 | **Lifecycle transitions are correctly enforced** — 9 stages, valid transitions succeed, invalid transitions throw InvalidMemoryLifecycleTransitionError | Unit test: each valid transition succeeds, each invalid transition fails |
| C04 | **Stage classification is correct** — isActive, isTerminal, isForgotten, isConsolidated, isEphemeral all return correct values per stage | Unit test: assert each classification method for each stage |
| C05 | **MemoryFactory.cloneWithTransition preserves identity** — all fields carry through, version increments, creationTimeline extends | Unit test: advance through full lifecycle → assert each version |

### REQUIRED (All Must Pass)

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| C06 | **MemoryIndex indexes and retrieves** — by ID, category, stage, patternId, evidenceId | Unit test: create memory → index → retrieve by all 5 dimensions |
| C07 | **MemorySearch filters correctly** — text search, category, stage, strength range, tags, evidence, pattern, sorting | Unit test: create 3 memories → search with each filter → assert correct results |
| C08 | **Quality scoring produces valid 12-dimension profile** — all dimensions in [0,1], qualityScore in [0.01, 0.99] | Unit test: evaluate memory → assert each dimension and composite score |
| C09 | **Confidence computation produces valid scores** — result in [0.01, 0.99], varies with quality | Unit test: compute confidence → assert range and sensitivity to quality changes |
| C10 | **Scoring produces 4 valid scores** — retentionScore, activationScore, consolidationReadiness, forgettingRisk all in [0,1] | Unit test: evaluate memory → assert all 4 scores in range |
| C11 | **Evidence→Memory bridge creates memories from LIFECYCLE_VALIDATED_CONFIRMED and EVALUATION_COMPLETED events** | Integration test: emit evidence events → assert Memory created |
| C12 | **Observation→Memory bridge creates memories from HISTORICAL_COMMITTED events** with dual-path payload parsing | Integration test: emit observation event → assert Memory created |
| C13 | **Pattern→Memory bridge creates memories from all 8 subscribed pattern events** | Integration test: emit each pattern event → assert Memory created (will FAIL currently due to businessId — same as VS0-009) |
| C14 | **Strength operations work** — strengthen increases strength, weaken decreases, values bounded [0,1] | Unit test: strengthen/weaken → assert value changes and bounds |
| C15 | **Activation computation works** — activationScore varies with recency/strength/access, decay reduces it | Unit test: activate, decay → assert correct scores |
| C16 | **Forgetting evaluation works** — shouldForget returns true for stale/weak memories, false for strong/recent ones | Unit test: fresh vs stale → assert shouldForget results |
| C17 | **Forget operation moves to HISTORICAL** — stage changes, strength/confidence reduced | Unit test: forget → assert HISTORICAL stage, reduced scores |
| C18 | **Reactivation moves from HISTORICAL/ARCHIVED to SHORT_TERM** — scores increased | Unit test: archive → reactivate → assert SHORT_TERM stage |
| C19 | **Consolidation promotes along the chain** — SHORT_TERM→STABILIZING→CONSOLIDATED→LONG_TERM→SEMANTIC with correct thresholds | Unit test: meet each threshold → assert promotion to each stage |
| C20 | **Memory merge works** — merges 2+ memories, preserves unique evidence IDs, mergedFromIds populated | Unit test: merge → assert combined provenance, mergedFromIds |

### ENHANCED (Complete Certification)

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| C21 | **Associations work** — create, reinforce, weaken, detach, self-association rejected | Unit test: full association lifecycle |
| C22 | **Spread activation propagates through associations** — activation of one memory boosts associated memories | Unit test: associate + spreadActivation → assert target activation increased |
| C23 | **Compression produces valid stats** — originalSize, compressedSize, compressionRatio, entries removed | Unit test: compress → assert stats structure and values |
| C24 | **Memory versioning tracks history** — version increments, diff computes correctly, stability measured | Unit test: cloneWithTransition 3 times → assert version count, diff, stability |
| C25 | **Memory metrics track all dimensions** — creation, consolidation, forgetting, archival, merges, compression, reactivation, strengths, confidence, categories | Unit test: execute each operation → assert each metric counter |
| C26 | **Memory policies evaluate correctly** — standard, strict, long_term policies with correct thresholds | Unit test: evaluate memory under each policy → assert pass/fail |
| C27 | **Memory engine lifecycle works** — start, stop, state transitions correct | Unit test: start → stop → assert states |
| C28 | **Memory engine receiveInput rejects invalid state** — error thrown if not RUNNING | Unit test: call receiveInput before start → assert error |
| C29 | **Memory engine metrics match pipeline metrics** — getMetrics() returns MemoryPipeline.getMetrics() | Unit test: create memory → assert both metrics sources match |
| C30 | **Test suite stability** — all tests pass 3 consecutive runs with 0 flakiness | CI: 3 consecutive runs |
| C31 | **No regression on existing unit tests** — memory.test.ts all pass | Run unmodified memory.test.ts |
| C32 | **Periodic cycle processes all non-terminal memories** — decay + consolidation applied to each | Unit test: populate index → processCycle → assert decay applied |

### Removed from VS1-008 (Deferred to BFs)

| Original Criterion | Deferred To | Reason |
|--------------------|-------------|--------|
| Determinism — identical input → identical output | BF-023 | Requires removing Date.now()/Math.random() from IDs and clock from scoring |
| Persistence — memories survive restart | BF-022 | Requires persistent storage |
| Lifecycle events — all 9 events emitted correctly | BF-021 | 6 lifecycle events never emitted |
| Memory→Knowledge — all 3 subscribed events fire | BF-021 + BF-026 | Depends on lifecycle event fix |
| MemoryRelationships.buildRelationships wired | BF-025 | Currently disconnected |
| businessId propagation from Pattern | BF-024 / BF-017 | PatternIdentity frozen, requires separate BF |
| Category derivation from evidence | P2-01 | Technical debt |
| Recovery pipeline usage | P2-02 | Technical debt |
| Error Observability (silent catches) | **P0-01** | **Certification blocker** |

---

## Pass Condition

**VS1-008 is CERTIFIED when:**

- All 5 CRITICAL criteria pass (C01–C05)
- All 15 REQUIRED criteria pass (C06–C20)
- At least 6 of 12 ENHANCED criteria pass (C21–C32)
- P0-01 (Silent Catch Blocks) completed and verified
- No tests flaky across 3 consecutive runs
- No regression on existing memory.test.ts

**VS1-008 is COMPLETE when all criteria pass.**

---

*End of VS1-008 Certification Criteria*
