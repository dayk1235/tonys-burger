# LAW-068 — ARCHITECTURE DISCOVERY BEFORE CODE EXPLORATION

**Status:** Permanent Architectural Law
**Adopted:** 2026-06-28
**Classification:** Core Repository Law — Engineering Workflow
**Supersedes:** Ad-hoc code exploration patterns

---

## 1. Purpose

Establish a mandatory Architecture Discovery phase before any implementation, bug fix, validation sprint, or refactor.

The objective is to eliminate blind code exploration, reduce unnecessary file reads, minimize architectural mistakes, and ensure every implementation begins with a complete understanding of the affected subsystem.

This law applies to every engineering activity inside Restaurant OS.

---

## 2. Principles

### 2.1 Architecture before implementation

No implementation may begin until the architectural context has been discovered.

Developers and AI agents must understand:

- affected engines
- event flow
- dependencies
- callers
- callees
- runtime propagation
- architectural boundaries

before modifying code.

### 2.2 Graph-first discovery

Whenever an architecture graph or code graph is available, it is the primary source of discovery.

Direct file reading is a secondary mechanism.

The preferred workflow is:

```
Architecture Graph
    ↓
Dependency Graph
    ↓
Runtime Trace
    ↓
Minimal File Reading
    ↓
Implementation
```

### 2.3 Minimize blind exploration

Reading entire directories or large portions of the repository without architectural justification is prohibited.

Only the minimum set of files required to understand and implement the change should be opened.

### 2.4 Mandatory discovery phase

Every Validation Sprint (VS), Bug Fix (BF), Integration Sprint (IS), or Architectural Refactor must begin with a Discovery Phase.

The Discovery Phase should answer:

- What subsystem is affected?
- Which engines participate?
- Which events propagate?
- Which entities are modified?
- Which files are impacted?
- What is the blast radius?
- What tests are affected?

Implementation begins only after these questions have evidence-based answers.

### 2.5 Runtime awareness

Whenever runtime traces exist, they must be preferred over assumptions.

Observed execution is considered stronger evidence than static inspection.

### 2.6 Architectural decisions

Any modification affecting architecture, event propagation, canonical contracts, or engine interaction must be documented as an architectural decision before implementation.

### 2.7 Discovery is not implementation

The Discovery Phase must never modify source code.

Its sole purpose is understanding.

Implementation begins only after discovery is complete.

---

## 3. Canonical Engineering Workflow

```
Phase 0    Architecture Discovery
              ↓
Phase 1    Design
              ↓
Phase 2    Implementation
              ↓
Phase 3    Validation
              ↓
Phase 4    Architecture Audit
              ↓
Phase 5    Documentation
```

---

## 4. Expected Benefits

- Fewer architectural regressions.
- Smaller implementation scope.
- Reduced token consumption during AI-assisted development.
- Faster engineering iterations.
- Higher confidence before modifying production code.
- Better long-term maintainability.

---

## 5. Cross-References

| Document | Location |
|----------|----------|
| Execution Protocol (all laws) | `project-docs/11-protocol/EXECUTION_PROTOCOL.md` |
| Engine Implementation Standard | `project-docs/11-protocol/ENGINE_IMPLEMENTATION_STANDARD.md` |
| Validation Sprint Methodology | `project-docs/11-protocol/VALIDATION_SPRINT_METHODOLOGY.md` |
| Runtime Architecture | `project-docs/23-runtime-architecture/RUNTIME_ARCHITECTURE.md` |
| Execution Protocol (14-step workflow) | `project-docs/11-protocol/EXECUTION_PROTOCOL.md` |

---

## 6. Compliance

All future Validation Sprints, Bug Fixes, Integration Sprints, and Architectural Refactors must begin with an Architecture Discovery Phase.

Skipping this phase constitutes a violation of LAW-068.

---

*End of LAW-068 — Architecture Discovery Before Code Exploration*
