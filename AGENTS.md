# AGENT ENTRYPOINT

STOP.

Before making any modification to this repository, you MUST complete the following boot sequence.

Failure to complete this sequence invalidates any implementation work.

⸻

## MISSION

Your responsibility is to preserve:

* Architecture
* Consistency
* Maintainability
* Traceability
* Repository cleanliness

You are NOT allowed to optimize, improve, refactor, redesign, or extend functionality unless explicitly requested.

You must prioritize architectural integrity over convenience.

⸻

## REQUIRED BOOT SEQUENCE

The complete boot sequence is defined in the centralized source of truth:

**Read:** `project-docs/BOOT_SEQUENCE.md`

Execute Steps 1–9 in order as defined in that document. No skipping.

⸻

## PRE-IMPLEMENTATION ANALYSIS

Before touching code, determine:

* Task objective
* Expected outcome
* Architectural impact
* Files involved
* Risks
* Validation requirements

⸻

## MANDATORY TASK DECLARATION

Before implementation provide:

**Objective**

What is being changed?

**Scope**

What files are allowed to be modified?

**Boundaries**

What files are forbidden to be modified?

**Risks**

Potential side effects.

**Validation Plan**

How success will be verified.

⸻

## REPOSITORY LAWS

### LAW_001 — Documentation First
Read documentation before code.

### LAW_002 — One Source Of Truth
Do not duplicate project knowledge.

### LAW_003 — No Autonomous Features
Never create functionality that was not requested.

### LAW_004 — No Unauthorized Refactoring
Refactoring requires explicit approval.

### LAW_005 — Minimal Change Principle
Make the smallest change necessary.

### LAW_006 — Folder Integrity Law
Do not create folders without justification.

### LAW_007 — No Junk Files
Do not create temporary files.

### LAW_008 — No Orphan Files
Every file must have a clear responsibility.

### LAW_009 — Single Responsibility Location
One responsibility. One location.

### LAW_010 — No Root Pollution
Do not place random files in repository root.

### LAW_011 — Dependency Control
No dependency installation without approval.

### LAW_012 — Decision Traceability
Document architectural decisions.

### LAW_013 — Build Safety
Changes must compile successfully.

### LAW_014 — Reporting Obligation
Every task requires a report.

### LAW_015 — Architecture Over Convenience
Architecture wins over shortcuts.

### LAW_016 — No Silent Changes
Important changes must be documented.

### LAW_017 — Scope Boundary Enforcement
Never exceed the assigned task scope.

### LAW_018 — Project Memory Protection
Do not erase approved decisions.

### LAW_019 — Repository Cleanliness
Maintain repository organization.

### LAW_020 — Stop When Uncertain
If architecture is unclear: DO NOT GUESS. Ask for clarification.

### LAW_025 — Follow The Roadmap
Agents must follow roadmap progression.

### LAW_026 — No Phase Bleeding
Work must remain within the active phase.

### LAW_027 — Phase Gate Enforcement
A phase cannot begin until the previous phase is completed.

### LAW_028 — Roadmap Is Authoritative
The roadmap takes precedence over conflicting tasks.

### LAW_029 — Current Phase Declaration
State the current phase before implementation.

### LAW_030 — Phase Completion Report
Generate a report when a phase finishes.

### LAW_031 — Documentation Structure Is Architecture
Documentation organization is part of repository architecture.

### LAW_032 — Centralized Discovery
All governance documents must be discoverable through README.md and DOCUMENT_MAP.md.

⸻

## IMPLEMENTATION RULE

You may only begin implementation AFTER:

* Boot sequence completed
* Scope analyzed
* Risks identified
* Validation plan created

⸻

## COMPLETION REQUIREMENTS

Before finishing:

* Build passes
* Lint passes
* Types pass
* No broken imports
* No orphan files
* No architectural violations

⸻

## FINAL REPORT FORMAT

**Objective**

**Files Modified**

**Changes Made**

**Validation Performed**

**Risks**

**Architectural Impact**

**Next Steps**

This report is mandatory.

⸻

## DOCUMENTATION REFERENCE

| Document | Location |
| :--- | :--- |
| Boot Sequence | `project-docs/BOOT_SEQUENCE.md` |
| Navigation Hub | `project-docs/README.md` |
| Document Index | `project-docs/DOCUMENT_MAP.md` |

⸻

END OF AGENT ENTRYPOINT
