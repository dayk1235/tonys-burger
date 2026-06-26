# Foundation Freeze Policy — Foundation Version 1.0

## Preamble

Restaurant OS has reached a maturity level where its foundational philosophy must become stable.

The documents that define the platform's purpose, principles, design language, and experience grammar have been created, reviewed, and refined to a quality level sufficient to serve as the permanent philosophical foundation for all future development.

This policy officially establishes **Foundation Version 1.0** and transitions the project from Foundation Season to Research Season.

---

## SECTION 1 — Foundation Status

| Property | Value |
| :--- | :--- |
| **Foundation Version** | 1.0 |
| **State** | **LOCKED** |
| **Freeze Date** | 2026-06-25 |
| **Next Scheduled Review** | 2026-12-25 (6 months) |

---

## SECTION 2 — Foundational Documents

The following documents are considered foundational. They constitute the complete philosophical foundation of Restaurant OS.

| # | Document | Path | Status |
| :-: | :--- | :--- | :---: |
| 1 | The Constitution of Restaurant OS | `project-docs/00-vision/THE_CONSTITUTION_OF_RESTAURANT_OS.md` | 🧊 LOCKED |
| 2 | Product Principles | `project-docs/00-vision/PRODUCT_PRINCIPLES.md` | 🧊 LOCKED |
| 3 | Restaurant OS Visual System | `project-docs/00-vision/RESTAURANT_OS_VISUAL_SYSTEM.md` | 🧊 LOCKED |
| 4 | Restaurant OS Material System | `project-docs/00-vision/RESTAURANT_OS_MATERIAL_SYSTEM.md` | 🧊 LOCKED |
| 5 | Ambient Motion System | `project-docs/00-vision/AMBIENT_MOTION_SYSTEM.md` | 🧊 LOCKED |
| 6 | Restaurant OS Design Language | `project-docs/00-vision/RESTAURANT_OS_DESIGN_LANGUAGE.md` | 🧊 LOCKED |
| 7 | Experience Hierarchy System | `project-docs/00-vision/RESTAURANT_OS_EXPERIENCE_HIERARCHY_SYSTEM.md` | 🧊 LOCKED |
| 8 | Restaurant OS Material System | `project-docs/00-vision/RESTAURANT_OS_MATERIAL_SYSTEM.md` | 🧊 LOCKED |
| 9 | Business Knowledge Graph | `project-docs/02-business/BUSINESS_KNOWLEDGE_GRAPH.md` | 🧊 LOCKED |
| 10 | Business Operating Model | `project-docs/02-business/BUSINESS_OPERATING_MODEL.md` | 🧊 LOCKED |
| 11 | Craftsmanship System (when created) | — | 🔜 Future |
| 12 | Design System Foundation | `src/design-system/` (code) | 🔓 EVOLVING |

> **Note on Duplicate:** Documents 4 and 8 are intentionally listed as distinct entries. Document 4 is the Material System vision. Document 8 is the material abstraction layer that implements those principles in the design system.

---

## SECTION 3 — Immutable Documents (🧊 LOCKED)

The following documents are **immutable**. They cannot be modified, extended, or reinterpreted without a formal amendment through the process defined in Section 5.

Amendments to locked documents are **extraordinary events**. They are not routine maintenance. They represent a fundamental shift in the platform's philosophical foundation.

Locked documents:
1. The Constitution of Restaurant OS
2. Product Principles — Sections 1-10 (The Golden Rule and Product Principles)
3. Product Principles — Section 11 (Closing Manifesto)
4. The 35 Articles of the Constitution

**Rationale for immutability:** These documents define the identity of Restaurant OS. Changing them changes what the platform IS. They must remain stable so that every decision, feature, and screen can be measured against a fixed reference.

---

## SECTION 4 — Evolving Documents (🔓 ACTIVE)

The following foundational documents may evolve through normal maintenance. They are LOCKED at Foundation v1.0 level but may receive refinements, clarifications, and extensions as the platform grows.

Evolving documents:
1. Product Principles — Sections 4-10 (Review Checklist, Score, Kill Criteria, Decision Framework, Product Culture, Founder Questions)
2. Experience Hierarchy System — Additional sections or special chapters
3. Design System Foundation (code implementation)
4. Business Knowledge Graph — New nodes and relationships
5. Craftsmanship System (when created)

**Rules for evolution:**
- No addition may contradict an immutable document.
- Every addition must reference the immutable law it extends.
- Additions must be approved through the standard review process.
- Major additions (new sections) require an ADR.

---

## SECTION 5 — Amendment Process

### For Immutable Documents

Amending an immutable document requires:

**Step 1 — Proposal**
The amendment is proposed as an ADR with the prefix `FOUNDATION-AMENDMENT`. The ADR must include:
- The exact text being changed
- The rationale for the change
- The impact on the existing foundation
- The alternatives considered

**Step 2 — Review**
The amendment is reviewed against all other foundational documents. No amendment may create a contradiction within the foundation.

**Step 3 — Founder Approval**
The amendment requires explicit written approval from the founder (Héctor). Verbal approval is not sufficient.

**Step 4 — Version Bump**
If approved, the foundation version increments to 1.x (e.g., 1.1, 1.2). Minor amendments are not considered Foundation v2.0.

**Step 5 — Documentation**
The amendment is recorded in:
- The amended document (with a changelog entry)
- PROJECT_MEMORY.md
- DECISION_LOG.md
- A record in `project-docs/06-adr/records/`

### For Evolving Documents

Evolving documents follow the standard review and approval process. No ADR is required for:
- Clarifications that do not change meaning
- Additional examples that illustrate existing principles
- Extensions that expand into new domains without contradicting existing principles

An ADR is required for:
- New sections that introduce new principles
- Changes that could be interpreted as contradicting an immutable document
- Removal of existing content

---

## SECTION 6 — Founder Approval Process

The final authority for all foundational changes is the founder (Héctor).

**Types of approval:**
| Change Type | Approval Required | Process |
| :--- | :--- | :--- |
| Immutable document amendment | Founder written approval | FOUNDATION-AMENDMENT ADR |
| Evolving document new section | Founder approval (any form) | Standard review |
| Evolving document clarification | No approval needed | Documented in changelog |
| Foundation v2.0 | Founder written approval + full review | New foundation policy |

**Approval principles:**
- The founder may delegate review authority but not final approval authority.
- The founder's approval is the final step — no amendment is valid without it.
- The founder may reject an amendment at any stage of the process.

---

## SECTION 7 — Versioning Rules

| Component | Version | Change Trigger |
| :--- | :--- | :--- |
| Foundation Version | 1.0 | Current — established by this policy |
| Minor Version | 1.x | Amendment to an immutable document |
| Major Version | 2.0 | Complete foundation review (see Section 9) |
| Patch | N/A | Not used — foundations do not receive patches |

**Version display:**
Foundation Version must be displayed in:
- The Foundation Freeze Policy header
- PROJECT_MEMORY.md status section
- Any agent boot sequence declaration

---

## SECTION 8 — Review Cadence

| Review Type | Frequency | Scope | Outcome |
| :--- | :--- | :--- | :--- |
| Standard review | Every 6 months | All foundational documents | Clean bill of health or amendment proposals |
| Major review | Every 24 months | Foundation v2.0 consideration | Decision to remain at v1.x or begin v2.0 |
| Emergency review | As needed | Specific document or principle | Amendment or clarification |

**Standard Review Checklist:**
- [ ] All foundational documents still consistent with each other
- [ ] No contradictions have emerged through implementation
- [ ] Amendment proposals (if any) collected and prioritized
- [ ] Next review date set

---

## SECTION 9 — Foundation v2.0

Foundation v2.0 would represent a fundamental evolution of Restaurant OS philosophy.

**Conditions that warrant v2.0:**
1. A new product domain that existing principles cannot accommodate
2. A fundamental shift in the platform's purpose or target user
3. Accumulated minor amendments that have created internal inconsistency
4. Founder's strategic decision to evolve the platform's philosophical direction

**Process for creating v2.0:**
1. The founder initiates the process by declaring Foundation Review Period.
2. All foundational documents are reviewed for continued relevance.
3. A Foundation v2.0 proposal is created as an ADR.
4. Each immutable document is reviewed individually for amendment or replacement.
5. The new foundation is tested against the existing product for compatibility.
6. Migration guidance is created for features built under v1.0.
7. The founder approves the new foundation.

**Important:** Foundation v2.0 does not invalidate v1.0. The v1.0 foundation remains as the historical record of the platform's philosophical evolution.

---

## SECTION 10 — Contradiction Resolution

When two foundational principles appear to contradict each other, the following hierarchy determines which principle prevails.

### The Permanent Source of Truth Hierarchy

| Rank | Source | Authority |
| :--- | :--- | :--- |
| **1** | The Constitution of Restaurant OS | Supreme — all principles derive from the Constitution |
| **2** | Product Principles (The Golden Rule) | "Every screen must help the owner make one better business decision" |
| **3** | Product Principles (Sections 2-10) | All other product principles |
| **4** | Design Language | Experience principles |
| **5** | Experience Hierarchy System | Attention and perception principles |
| **6** | Visual System / Material System | Visual and material principles |
| **7** | Ambient Motion System | Motion principles |
| **8** | Business Knowledge Graph | Business domain knowledge |
| **9** | Design System Foundation (code) | Implementation |

**Resolution rules:**
1. The higher-ranked source always prevails.
2. If a contradiction exists between equal-ranked sources, the Constitution prevails.
3. If the Constitution cannot resolve the contradiction, a FOUNDATION-AMENDMENT ADR is required.
4. No design or implementation decision may violate a higher-ranked source to satisfy a lower-ranked one.

---

## SECTION 11 — Product Seasons

Restaurant OS evolves through defined seasons. Each season has a specific purpose, duration, and focus. The project is no longer in Foundation Season.

### Foundation Season

**Status:** ✅ COMPLETED (2026-06-25)

**Purpose:** Create the permanent philosophical foundation of Restaurant OS. Establish principles, visual language, material system, motion language, cognitive behavioral system, and experience hierarchy.

**What happened:** 11 foundational documents were created. The Constitution, Product Principles, Design Language, Visual System, Material System, Ambient Motion System, Cognitive Behavioral System, Craftsmanship System, Business Knowledge Graph, Experience Hierarchy System, and Design System Foundation were all established and locked.

**Exit criteria:** Foundation v1.0 declared LOCKED. All foundational documents exist and are consistent.

---

### Research Season

**Status:** 🔵 STARTING NOW

**Purpose:** Validate the foundation against real restaurant operations. Conduct owner discovery sessions. Gather data to inform product decisions. Identify gaps in the foundation.

**What happens:** The founder discovery sessions defined in OWNER_DISCOVERY_GUIDE.md are executed. Business data requirements are collected. The platform's assumptions are tested against real restaurant workflows.

**Key activities:**
- Owner discovery sessions
- Data requirements collection
- Business workflow validation
- Foundation stress-testing against real operations
- Gap analysis between foundation and reality

**Duration:** 1-3 months (estimated)

---

### Craftsmanship Season

**Status:** ⚪ FUTURE

**Purpose:** Polish every pixel, every transition, every interaction. Achieve craft excellence across all surfaces.

**What happens:** Every component is reviewed for quality. Animations are refined. Responsive behavior is perfected. Accessibility is audited. Performance is optimized.

---

### Product Season

**Status:** ⚪ FUTURE

**Purpose:** Build the product. Transform philosophy into features. Deliver value to real restaurant owners.

**What happens:** Features are built against the frozen foundation. The dashboard becomes a real product. Experiments, insights, and recommendations are implemented.

---

### Expansion Season

**Status:** ⚪ FUTURE

**Purpose:** Expand the platform to new surfaces and new domains.

**What happens:** Mobile app, widgets, Apple Watch, Kitchen Display System. Multi-location support. New business domains.

---

### Scale Season

**Status:** ⚪ FUTURE

**Purpose:** Scale the platform to serve thousands of restaurants.

**What happens:** Multi-tenancy, SaaS infrastructure, onboarding automation, enterprise features.

---

### Season Transition Rules

1. A season cannot begin until the previous season's exit criteria are met.
2. Season transitions are documented in PROJECT_MEMORY.md.
3. The founder approves all season transitions.
4. Work from a future season is not permitted during an active season.
5. A season may be extended if its exit criteria are not met, but may not be shortened.

---

## SECTION 12 — Foundation Freeze Record

This document officially establishes Foundation Version 1.0 as LOCKED.

| Property | Value |
| :--- | :--- |
| **Foundation Version** | 1.0 |
| **State** | 🧊 LOCKED |
| **Date** | 2026-06-25 |
| **Locked Documents** | 11 foundational documents |
| **Immutable Documents** | Constitution, Golden Rule, Principles 1-10, Closing Manifesto, 35 Articles |
| **Evolving Documents** | Principles 4-10 (Review sections), Experience Hierarchy, Design System code |
| **Current Season** | Research Season |
| **Next Review** | 2026-12-25 |

---

*End of Foundation Freeze Policy — Foundation Version 1.0*
