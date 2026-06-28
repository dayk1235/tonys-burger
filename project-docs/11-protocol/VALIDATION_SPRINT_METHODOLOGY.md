# RESTAURANT OS — Validation Sprint Methodology

**Status:** Official Engineering Standard
**Adopted:** 2026-06-27
**Supersedes:** Ad-hoc development practices
**Derived from:** Validation Sprint Zero and Validation Sprint One

---

## Purpose

The Validation Sprint Methodology exists to ensure every integration in Restaurant OS is:

- **Verifiable** — each change produces observable evidence
- **Safe** — no regressions are introduced without detection
- **Incremental** — each task connects exactly one layer, one capability
- **Traceable** — every decision, every test, every audit is documented

### Problems It Prevents

- Unverified integrations that break silently
- Scope creep that turns small tasks into large rewrites
- Multiple dead ends accumulated in a single change
- Untested assumptions that become production bugs
- Opaque progress — "it works" without evidence

### Benefits It Produces

- Zero critical regressions across two sprints
- Every integration validated by automated evidence
- Clear progress metrics (pipeline connectivity, reality score)
- Fast rollback — each task is small enough to revert safely
- Sustainable velocity — quality never sacrificed for speed

---

## Core Principle

**One responsibility per Validation Task. One Dead End at a time.**

No task may:

- Mix multiple objectives
- Solve more than one Dead End
- Introduce work outside its defined scope
- Skip any stage of the lifecycle

---

## Validation Sprint Lifecycle

Every Validation Sprint follows this mandatory cycle:

```
Planning
    ↓
Validation Sprint Task (VS)
    ↓
Controlled Validation (CV)
    ↓
Audit (AUD)
    ↓
Closing Report
    ↓
Next Validation Task
```

No stage may be skipped. No stage may be reordered.

---

## Stage Definitions

### Planning

**Purpose:** Define the scope, objectives, and success criteria for the Sprint.

**Activities:**
- Identify Dead Ends to resolve
- Define VS Task specifications
- Establish success criteria
- Define scope boundaries

**Output:** Sprint plan document with task list and execution rules.

---

### VS — Validation Sprint Task

**Purpose:** Implement one capability. Resolve exactly one Dead End.

**Rules:**
- Scope is STRICT — only the defined files may be modified
- No work outside the defined boundaries
- One objective per task
- Follows LAW 56 (Validation Task Specification)
- Must produce verifiable evidence upon completion

**Output:** Modified code, registered engines, connected pipeline stages.

---

### CV — Controlled Validation

**Purpose:** Demonstrate through verifiable evidence that the change works correctly.

**Rules:**
- No code modification during validation
- Use existing fixtures and endpoints
- Executed against the running system
- Evidence must be observable and repeatable
- Expected behavior must be defined before execution (LAW 61)

**Output:** Execution results, HTTP status codes, pipeline state verification, evidence status.

---

### AUD — Audit

**Purpose:** Inspect the running system for regressions. Measure progress.

**Rules:**
- No code modification during audit
- Verify all engines, endpoints, and pipeline state
- Compare against previous audit baseline
- Report reality score and integration score
- Identify remaining Dead Ends

**Output:** Runtime status, pipeline status, reality score, integration score, regression check.

---

### Closing Report

**Purpose:** Formally document the state reached by the Sprint.

**Rules:**
- Freezes the Sprint — no further changes
- Documents work completed
- Records official metrics
- Lists remaining work for next Sprint
- Does not add new functionality

**Output:** Sprint completion document with executive summary, work completed, pipeline status, controlled validation status, final metrics.

---

## Engineering Rules

1. **Minimum Scope.** Every task touches the fewest files necessary.
2. **Small Changes.** Prefer small, targeted modifications over large rewrites.
3. **Evidence Before Opinion.** Every claim must be backed by observable evidence.
4. **Mandatory Audits.** Every Sprint requires a closing audit before completion.
5. **Controlled Validation Required.** No task is complete without CV evidence.
6. **Closing Report Required.** No Sprint is complete without a closing report.
7. **Sequential Progression.** Validation progresses one layer at a time (LAW 57).
8. **No Horizontal Expansion.** While a vertical Dead End exists, horizontal work is forbidden.
9. **Backward Compatibility.** Changes must preserve existing functionality.
10. **Evidence Traceability.** Every CV must reference its expected behavior (LAW 61).

---

## Expected Benefits

- **Fewer regressions** — each integration is validated independently
- **Smaller integrations** — one capability per task prevents scope creep
- **Greater traceability** — every change has documented evidence
- **Verifiable progress** — pipeline connectivity and reality score are measurable
- **Incremental architecture** — the system grows one layer at a time
- **Easy rollback** — each task is small enough to revert without side effects
- **Sustainable velocity** — quality gates prevent technical debt accumulation

---

## Historical Validation

This methodology was followed during:

### Validation Sprint Zero

| Dimension | Result |
|---|---|
| VS0 Certification | ✅ Certified |
| Bug Fixes | 3 (BF-001, BF-002, BF-003) |
| Controlled Validation | ✅ Full Coverage (CV-001 to CV-006) |
| Cognitive Engines | 3 (Observation, Pattern, Memory) |
| Pipeline Connectivity | 3/18 stages |

### Validation Sprint One

| Dimension | Result |
|---|---|
| VS1 Tasks | 6/6 completed (VS1-001 to VS1-006) |
| Controlled Validations | 10/10 PASS (CV-001 to CV-010) |
| Cognitive Engines | 7 (Observation → Decision) |
| Pipeline Connectivity | 7/18 stages — core cognitive pipeline complete |
| Dashboard Reality | 8/8 sections Runtime-connected |
| Integration Score | 72% |
| Runtime Bugs | 0 |

### Combined Results

- **7 cognitive engines** integrated and running
- **Runtime stable** — OPERATING, HEALTHY, zero failures
- **Dashboard connected** — 100% real data on Home
- **Integration Score** growing across sprints
- **Zero critical regressions** across both sprints

---

## Final Statement

This methodology is the official engineering process of Restaurant OS.

From this moment forward, every integration, every capability, and every bug fix must follow the Validation Sprint Methodology. The lifecycle (Planning → VS → CV → AUD → Closing Report) is mandatory. No stage may be skipped. No evidence may be omitted.

The methodology was proven during Validation Sprint Zero and Validation Sprint One. It produced a stable, verifiable, incrementally-connected system with zero critical regressions. It is now the permanent standard.

**Validation Sprint Methodology** — adopted and effective immediately.
