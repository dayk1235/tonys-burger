# PRODUCT CRAFTSMANSHIP SYSTEM — Restaurant OS Quality Operating Manual

## PREAMBLE

Restaurant OS has defined:

- What it believes (Constitution)
- How it decides (Product Principles)
- How it thinks about the human mind (Cognitive Behavioral System)
- How the agent reasons (Product Reasoning Layer)

This document defines the missing layer:

**How quality is produced.**

Not through talent. Not through heroics. Not through luck.

Through repeatable systems that any engineer, any designer, any agent can follow to produce excellent work.

This document is the operational handbook for building quality.

It is designed to scale from one engineer working alone to a hundred engineers working across teams. The same principles apply. The same process works.

Every feature, every screen, every interaction, every line of code passes through this system before it reaches the owner.

---

## SECTION 1 — What Craftsmanship Means

**Purpose:** Define what craftsmanship means in the context of Restaurant OS — not as an abstract ideal, but as a measurable standard.

**Why it exists:** Craftsmanship is often treated as a personal quality — something you either have or do not. In Restaurant OS, craftsmanship is a system. It is the set of repeatable practices that anyone can follow to produce excellent work. Defining it explicitly removes ambiguity about what "good" means.

**Review questions:**
- Does this work demonstrate care for every detail, from the pixel to the business outcome?
- Would you be proud to show this work to a restaurant owner whose opinion you respect?
- Does this work meet the standard set by the best examples in the platform?

**Approval criteria:**
- The work passes all 25 sections in this document
- The work earns a Product Quality Score ≥ 75
- The work is demonstrably better than the previous version in the same area

**Failure criteria:**
- The work contains known issues that were deferred rather than fixed
- The work was completed faster than the craftsmanship process allows for
- The work cannot be explained clearly to someone outside the team

---

## SECTION 2 — Definition of Done

**Purpose:** Establish the universal completion criteria for every piece of work in the platform. Nothing is done until all criteria are met.

**Why it exists:** Without a universal Definition of Done, every engineer and designer operates with a different standard. Some consider work done when it compiles. Others consider it done when it passes a manual test. The Definition of Done removes this ambiguity by establishing a single, measurable standard that everyone must meet.

**Review questions:**
- Does the work compile, lint, and typecheck without errors?
- Does the work pass all automated tests?
- Has the work been reviewed by at least one other person?
- Does the work include appropriate documentation?
- Has the work been tested on the target surfaces (mobile, tablet, desktop)?
- Does the work handle error states, loading states, and empty states?
- Is the work accessible (keyboard navigable, screen reader compatible)?
- Does the work meet the product quality score threshold?
- Has the work been validated against the Constitution?
- Has the work been validated against the Product Principles?

**Approval criteria:**
- All Definition of Done criteria are satisfied
- No known open issues that affect the owner's experience
- The work has been signed off by the designated reviewer

**Failure criteria:**
- Any Definition of Done criterion is unsatisfied
- Known issues exist that affect functionality or confidence
- The work introduces regressions in existing functionality

---

## SECTION 3 — Product Review Process

**Purpose:** Define the process for evaluating whether a proposed feature or screen delivers genuine product value before any implementation begins.

**Why it exists:** The most expensive bug to fix is a feature that should never have been built. The Product Review Process catches these before resources are committed. It ensures that every feature passes the Golden Rule — "Does this help the owner make one better business decision?" — before a single line of code is written.

**Review questions:**
- What problem does this feature solve for the owner?
- What decision does it improve?
- How does it save time or increase profit?
- How does it reduce anxiety?
- Which Product Principle justifies it?
- Which Constitution article supports it?
- Has this been validated against the Product Kill Criteria?

**Approval criteria:**
- The feature passes all review questions
- The feature earns a Product Review Score ≥ 7.0 (per Product Principles Section 5)
- The feature is documented in plain language before implementation begins

**Failure criteria:**
- The feature cannot articulate its value in plain language
- The feature fails any Product Kill Criterion
- The feature scores below 7.0 on the Product Review Score

---

## SECTION 4 — Experience Review Process

**Purpose:** Define how to evaluate whether a feature delivers the right emotional experience for the owner before implementation.

**Why it exists:** A feature that functions correctly but feels wrong — confusing, alarming, overwhelming — is a failed feature. The Experience Review evaluates the emotional impact of every screen: does it increase confidence? Does it feel calm? Does it respect the owner's time?

**Review questions:**
- What emotion does this screen generate? Is that the right emotion?
- Does the owner feel more confident after using this screen?
- Does the screen feel calm, or does it create urgency and anxiety?
- Does the screen respect the owner's time (understandable in three seconds)?
- Does the screen use natural, restaurant-friendly language?
- Would a first-time owner understand this screen without training?

**Approval criteria:**
- The experience is documented in plain language describing what the owner sees, feels, and decides
- The experience passes all review questions
- The experience is consistent with the Design Language and Cognitive Behavioral System

**Failure criteria:**
- The experience is documented only through wireframes or mockups without emotional context
- The experience creates anxiety or confusion
- The experience requires explanation to understand

---

## SECTION 5 — Design Review Process

**Purpose:** Define how to evaluate whether a screen or component meets the Restaurant OS Visual System, Material System, and Design Language standards.

**Why it exists:** Visual inconsistency erodes trust. If every screen looks like it was designed by a different person, the owner cannot build a reliable mental model of the platform. The Design Review enforces visual consistency across every surface — not through conformity, but through shared principles.

**Review questions:**
- Does this screen follow the Visual System's hierarchy (Hero → Primary → Secondary → Supporting)?
- Does the screen use the Material System appropriately (Atmosphere → Business Glass → Interactive Material)?
- Is whitespace generous? Does content breathe?
- Is typography set for comfortable reading (line height, measure, contrast)?
- Are colors used semantically (green for confidence, amber for attention, red for urgency)?
- Are icons simple, minimal, and supportive rather than dominant?
- Does the screen reject dashboard anti-patterns (excessive cards, KPI lists, pie charts, gauge widgets)?

**Approval criteria:**
- The design is visually consistent with the existing Restaurant OS language
- All visual elements serve a purpose (no decoration)
- The design passes the Three Second Rule — understandable in three seconds

**Failure criteria:**
- The design introduces visual patterns inconsistent with the Visual System
- The design uses color decoratively rather than semantically
- The design relies on visual density rather than whitespace and hierarchy

---

## SECTION 6 — Cognitive Review

**Purpose:** Evaluate whether a screen or interaction respects the limits and patterns of human cognition as defined in the Cognitive Behavioral System.

**Why it exists:** The best visual design in the world cannot compensate for a screen that overwhelms the owner's working memory, fragments their attention, or creates decision fatigue. The Cognitive Review ensures that every screen works with the human brain, not against it.

**Review questions:**
- What is the one question this screen answers?
- Can the owner understand it in three seconds?
- How many pieces of information must the owner hold in working memory?
- Does meaning come before metrics?
- Does the screen preserve One Primary Decision?
- Does the screen reduce anxiety or increase it?
- Does the owner need to remember information from another screen?
- Are empty states explained?
- Is confidence expressed for every prediction and recommendation?

**Approval criteria:**
- The screen passes the full Cognitive-Behavioral Design Review Checklist (Section 27 of the Cognitive Behavioral System)
- All 20 questions receive a "Pass"

**Failure criteria:**
- Any single question receives a "Fail"
- The screen requires the owner to hold more than 3–5 chunks in working memory
- The screen presents multiple primary messages competing for attention

---

## SECTION 7 — Constitution Validation

**Purpose:** Validate that every feature, screen, and interaction is consistent with the 35 articles of the Restaurant OS Constitution.

**Why it exists:** The Constitution is the permanent foundation of the product. A feature that violates even one article is a feature that erodes the platform's integrity. Constitution Validation is the firewall that protects the foundation.

**Review questions:**
- Does this feature respect Article 1 (The Customer Owns Their Data)?
- Does this feature honor Article 2 (Trust Is More Valuable Than Intelligence)?
- Does this feature violate Article 3 (Never Pretends To Know)?
- Is every recommendation explainable per Article 4?
- Does this feature respect Article 7 (Silence Is Also Communication)?
- Does this feature make technology invisible per Article 8?
- Does this feature respect Article 9 (Meaning Before Metrics)?
- Does this feature reduce anxiety per Article 17?
- Does this feature respect Article 19 (One Decision At A Time)?
- Is there any article this feature might conflict with?

**Approval criteria:**
- All relevant articles are respected
- Any potential conflicts are documented with mitigation plans
- No article is violated

**Failure criteria:**
- Any single article is violated
- A conflict exists with no documented mitigation
- The feature fundamentally contradicts a constitutional principle

---

## SECTION 8 — Product Principle Validation

**Purpose:** Validate that every feature is consistent with the 25 Product Principles.

**Why it exists:** The Product Principles are the operating manual for building Restaurant OS. A feature that violates a principle is a feature that should not exist. Principle validation catches these violations before implementation.

**Review questions:**
- Does this feature pass the Golden Rule (helps the owner make one better business decision)?
- Does this feature respect Principle 1 (Meaning Before Metrics)?
- Does this feature respect Principle 3 (One Primary Decision)?
- Does this feature respect Principle 5 (Calm Over Noise)?
- Does this feature respect Principle 6 (Technology Is Invisible)?
- Does this feature respect Principle 11 (Reduce Anxiety)?
- Does this feature respect Principle 12 (Save Time)?
- Does this feature respect Principle 14 (No Empty Features)?
- Does this feature respect Principle 20 (Progressive Disclosure)?
- Does this feature respect Principle 25 (Silence Is a Signal)?

**Approval criteria:**
- All relevant principles are respected
- The feature passes the Product Review Checklist (Section 4 of Product Principles)
- The feature earns a Product Review Score ≥ 7.0

**Failure criteria:**
- Any single principle is violated
- The feature scores below 7.0 on the Product Review Score
- The feature fails any single question on the Product Review Checklist

---

## SECTION 9 — Material System Validation

**Purpose:** Validate that every surface, card, panel, and interactive element uses the correct material from the Material System hierarchy.

**Why it exists:** The Material System defines seven materials (Atmosphere, Business Glass, Focus Surface, Highlight Layer, Navigation Material, Widget Material, Floating Material, Modal Material, Interactive Material, Data Material). Using the wrong material confuses the visual hierarchy and erodes the owner's spatial understanding of the interface.

**Review questions:**
- Is the correct material being used for this element's purpose and hierarchy level?
- Is the material's transparency appropriate? (Never stack Business Glass on Business Glass)
- Does the material respect its purpose in the hierarchy? (Atmosphere in background, Interactive for buttons)
- Is the material's depth consistent with its importance? (Higher elevation for more important elements)
- Does the material support legibility? (Contrast ratios maintained regardless of transparency)

**Approval criteria:**
- Every material usage follows the Material System's hierarchy and philosophy
- No material is used decoratively (light always has a semantic role)
- No anti-pattern materials (overly glossy, excessive blur, rainbow gradients)

**Failure criteria:**
- A material is used outside its defined purpose
- Transparency or blur reduces legibility
- Multiple Business Glass layers are stacked without a Focus Surface between them

---

## SECTION 10 — Accessibility Review

**Purpose:** Ensure that every screen and interaction is accessible to all owners, regardless of ability or context.

**Why it exists:** Restaurant OS is a business tool. Every owner must be able to use it effectively, including owners with visual, motor, cognitive, or auditory limitations. Accessibility is not a feature — it is a requirement that protects the platform's universal usability.

**Review questions:**
- Is every interactive element keyboard navigable?
- Do all images and icons have appropriate alt text?
- Do color choices maintain sufficient contrast ratios (WCAG AA minimum)?
- Is the platform usable with screen readers?
- Are touch targets at least 44x44px for mobile?
- Does reduced motion mode disable non-essential animations?
- Are error messages clear and actionable?
- Is the reading order logical when styles are removed?
- Are focus indicators visible and logical?

**Approval criteria:**
- WCAG AA compliance is verified for all new screens
- Keyboard navigation works for all interactive elements
- Screen reader testing passes for all primary flows

**Failure criteria:**
- Any WCAG AA criterion is violated
- Keyboard navigation reaches a dead end
- A screen reader cannot complete a primary flow

---

## SECTION 11 — Performance Review

**Purpose:** Validate that every screen and feature meets performance standards before reaching production.

**Why it exists:** Performance is a visual design requirement. A beautiful screen that loads slowly or stutters during interaction destroys the illusion of quality. The owner does not care why the platform is slow — they only know that it feels unprofessional. Performance reviews catch degradation before the owner experiences it.

**Review questions:**
- Does this screen load within acceptable time thresholds?
- Does this component render at 60fps during all interactions?
- Are images optimized (WebP, lazy loading, appropriate dimensions)?
- Are animations GPU-accelerated?
- Is code splitting configured for routes and heavy components?
- Does this feature add measurable bundle weight?
- Has Lighthouse performance been verified (score ≥ 90)?

**Approval criteria:**
- Lighthouse score ≥ 90 for Performance
- All animations render at 60fps on reference devices
- Bundle size impact is documented and approved

**Failure criteria:**
- Lighthouse performance score < 80
- Any animation drops below 30fps on reference devices
- Bundle size increases by more than 10% without documented approval

---

## SECTION 12 — Security Review

**Purpose:** Validate that every feature handles data, authentication, and user input securely.

**Why it exists:** Restaurant OS holds business-critical data — sales, customer information, operational metrics. A security breach erodes trust instantly and permanently. The Security Review is the minimum bar for protecting the owner's data.

**Review questions:**
- Are all API endpoints authenticated?
- Is user input sanitized to prevent injection attacks?
- Are API keys and secrets stored in environment variables, not in code?
- Is data encrypted in transit (HTTPS) and at rest?
- Are authentication tokens stored securely (httpOnly cookies)?
- Is there rate limiting on sensitive endpoints?
- Are error messages sanitized to prevent information leakage?
- Is third-party code (libraries, scripts) vetted for security?

**Approval criteria:**
- Standard security review passes for all new endpoints and data flows
- No hardcoded secrets or credentials in code
- Third-party dependencies are vetted and approved

**Failure criteria:**
- Any hardcoded secret is found in the codebase
- Sanitization is missing on user input
- Authentication is missing on any endpoint that requires it

---

## SECTION 13 — Localization Review

**Purpose:** Validate that every screen and feature is designed to support localization without architectural changes.

**Why it exists:** Restaurant OS will expand into multiple languages and regions. Retrofitting localization into an English-only codebase is expensive and error-prone. Building localization-ready from the start is the only approach that respects the platform's long-term trajectory.

**Review questions:**
- Are all user-facing strings externalized (not hardcoded in components)?
- Does the layout accommodate text expansion (German, Russian) and contraction (Japanese, Korean)?
- Are dates, times, currencies, and numbers formatted using locale-aware functions?
- Are images and icons culturally appropriate for target markets?
- Are color choices culturally appropriate?
- Are there any hardcoded assumptions about language, region, or culture?

**Approval criteria:**
- All user-facing strings are externalized
- Layouts are verified with expanded text (150% of English length)
- Locale-aware formatting is used for all dynamic values

**Failure criteria:**
- Any hardcoded user-facing string is found
- Layout breaks with expanded text (150% of English)
- Locale formatting is inconsistent with platform standards

---

## SECTION 14 — Future Compatibility Review

**Purpose:** Validate that every decision made during implementation can survive future platform evolution without requiring redesign.

**Why it exists:** Restaurant OS is not static. It will grow into new surfaces (watch, widgets, kitchen display), new verticals (coffee shops, bars, bakeries), and new capabilities (multi-tenant, SaaS, internationalization). Every implementation decision must be evaluated against this future.

**Review questions:**
- Would this decision work on a 40mm Apple Watch screen?
- Would this decision work as a home screen widget?
- Would this decision survive internationalization?
- Would this decision work for a coffee shop that does not serve food?
- Would this decision work in a multi-tenant SaaS environment?
- Would this decision need to change if the data source changes?
- Is the interface to this feature generic enough to support future data sources?

**Approval criteria:**
- The decision is evaluated against all future surfaces
- The decision uses abstraction layers where data sources may change
- The decision documents what would need to change for each future scenario

**Failure criteria:**
- The decision has no path to work on a smaller surface (watch, widget)
- The decision hardcodes assumptions about business type (restaurant-specific logic in generic layers)
- The decision would require a full rewrite to support internationalization

---

## SECTION 15 — Mobile Readiness

**Purpose:** Validate that every feature designed for the dashboard also works effectively on mobile.

**Why it exists:** The owner uses Restaurant OS on mobile in specific contexts — walking through the restaurant, between tasks, during service. The mobile experience is not the desktop experience in a smaller container. It is a distinct experience that must be designed separately.

**Review questions:**
- Is the screen understandable in one glance on mobile?
- Are all interactive elements reachable with one thumb?
- Is the primary action available without scrolling?
- Is information density appropriate for mobile (halved compared to desktop)?
- Are touch targets at least 44x44px?
- Does the screen avoid horizontal scrolling?
- Does the screen follow the mobile philosophy (one glance, one thumb, one decision)?

**Approval criteria:**
- The feature works on a 375px viewport without horizontal scrolling
- All primary interactions work with one thumb
- The feature is tested on mobile and passes the One Glance Test

**Failure criteria:**
- The feature requires horizontal scrolling on a 375px viewport
- The feature requires two-handed operation
- The feature presents more information than can be processed in one glance

---

## SECTION 16 — Widget Readiness

**Purpose:** Validate that every feature designed for the dashboard has a widget-compatible representation.

**Why it exists:** The widget is the fastest interaction with Restaurant OS. It exists to answer one question at a glance: "Is my restaurant okay?" Not every dashboard feature belongs on a widget, but every feature must be evaluated for whether a widget representation adds value.

**Review questions:**
- Does this information need to be available at a glance?
- Can this information be communicated in one number or one state?
- Is there a single, clear message that the widget should communicate?
- Does the widget avoid interactive elements?
- Does the widget respect the owner's home screen real estate?
- Is the widget consistent with the dashboard representation of the same information?

**Approval criteria:**
- The widget candidate passes the One Glance Test
- The widget communicates one clear signal (health state, metric, or alert)
- The widget is consistent with the desktop and mobile representation

**Failure criteria:**
- The widget would need multiple pieces of information to be useful
- The widget would require interaction (buttons, scroll) to communicate
- The widget duplicates information available through other means

---

## SECTION 17 — Apple Watch Readiness

**Purpose:** Validate that every health-critical feature has a watch-compatible representation.

**Why it exists:** The watch is the most intimate screen in the Restaurant OS ecosystem. It lives on the owner's body. It must earn that privilege by providing the highest signal-to-noise ratio of any surface. Only the most critical business information — health state — belongs on the watch.

**Review questions:**
- Is this information critical enough for the owner's wrist?
- Can it be communicated in one word and one color?
- Does it pass the Pulse Test (understood in 1 second)?
- Would the owner benefit from having this information on their wrist instead of their phone?
- Is the watch representation consistent with the phone and dashboard?

**Approval criteria:**
- The watch candidate passes the Pulse Test
- The watch communicates exactly one thing (health state)
- The watch has no interactive elements beyond tapping to open the phone app

**Failure criteria:**
- The watch would need to show more than one piece of information
- The watch would require scrolling or interaction
- The information is not directly actionable

---

## SECTION 18 — Technical Debt Review

**Purpose:** Evaluate whether a change introduces, maintains, or reduces technical debt, and whether the debt is justified.

**Why it exists:** Not all technical debt is bad. Intentional, documented, and time-boxed debt can be a strategic decision. Unintentional, undocumented, and open-ended debt is poison. The Technical Debt Review ensures that every debt is intentional, documented, and scheduled for repayment.

**Review questions:**
- Does this change introduce any new technical debt?
- If it introduces debt, why is it justified?
- Is the debt documented with a clear repayment plan and timeline?
- Does this change increase or decrease the cost of future changes?
- Does this change duplicate existing functionality?
- Does this change add complexity without commensurate value?
- Is the simplest possible solution being implemented?

**Approval criteria:**
- If debt is introduced, it is documented with a repayment plan
- The simplest solution that delivers value is chosen
- No duplicate functionality is introduced

**Failure criteria:**
- Debt is introduced without documentation
- The solution is significantly more complex than necessary
- Existing functionality is duplicated

---

## SECTION 19 — Experience Debt Review

**Purpose:** Evaluate whether a change introduces experience debt — decisions that degrade the owner's experience over time through inconsistency, complexity, or accumulation of edge cases.

**Why it exists:** Experience debt is harder to detect than technical debt. A single screen that deviates slightly from the platform's interaction patterns does not trigger alarms. But 20 such deviations over 6 months produce an interface that feels incoherent and unreliable. The Experience Debt Review catches these deviations before they accumulate.

**Review questions:**
- Does this change introduce any new interaction pattern that differs from existing patterns?
- Does this change add a new visual element that does not exist elsewhere?
- Does this change require the owner to learn something new?
- Does this change increase the total number of elements on any screen?
- Does this change add to the owner's decision burden?
- Does this change create an exception to an existing rule?

**Approval criteria:**
- Any new interaction pattern is justified by genuine need, not convenience
- The total element count on the affected screen does not increase unreasonably
- Exceptions to existing rules are documented and approved

**Failure criteria:**
- The change introduces an unjustified new interaction pattern
- The change adds elements without removing others (creeping complexity)
- The change creates an undocumented exception to platform conventions

---

## SECTION 20 — Product Quality Score

**Purpose:** Define a single, measurable score that evaluates the overall quality of every feature and screen before it is considered complete.

**Why it exists:** Quality is subjective without a measuring system. The Product Quality Score replaces gut feelings with a repeatable, weighted evaluation that every feature must pass. It ensures that quality is measured consistently, regardless of who builds the feature.

**The Scoring Model (0–100):**

| Category | Weight | Description |
| :--- | :--- | :--- |
| **Business Value** | 20% | Does this feature help the owner make better decisions? Does it increase profit or save time? |
| **Cognitive Simplicity** | 15% | Can the owner understand this in three seconds? Does it respect working memory limits? |
| **Trust** | 12% | Does the feature feel reliable? Is every recommendation explainable? Is confidence indicated? |
| **Consistency** | 12% | Is the feature consistent with the platform's visual, material, and interaction standards? |
| **Performance** | 10% | Does the feature load quickly and render at 60fps? |
| **Accessibility** | 8% | Is the feature WCAG AA compliant and universally usable? |
| **Maintainability** | 8% | Can the feature be modified, extended, or debugged by someone who did not build it? |
| **Visual Quality** | 8% | Does the feature meet the Visual System and Material System standards? |
| **Narrative Quality** | 7% | Does the feature tell a story? Does meaning come before metrics? |

**Scoring Scale:**

| Score | Meaning | Decision |
| :--- | :--- | :--- |
| **90–100** | Exceptional | Ready for production. No improvements required. |
| **75–89** | Excellent | Ready for production with minor refinements noted. |
| **60–74** | Good | Acceptable for release but improvements recommended. |
| **40–59** | Below Standard | Must be improved before production release. |
| **0–39** | Unacceptable | Must be rebuilt. Does not meet craftsmanship standards. |

**Minimum Acceptable Score: 60**

Features scoring between 60–74 may be released but must have a documented improvement plan. Features scoring below 60 cannot be released under any circumstances.

**Scoring Protocol:**

1. Each category is scored from 0–10 independently.
2. Each category score is multiplied by its weight to produce a weighted score.
3. Weighted scores are summed to produce the final Product Quality Score.
4. The reviewer must document the score for each category with specific examples.
5. If any single category scores below 4, the feature is automatically rejected regardless of the total score.

---

## SECTION 21 — Approval Gates

**Purpose:** Define the mandatory approval stages that every feature must pass before reaching production.

**Why it exists:** Without formal approval gates, features can reach production that violate principles, erode quality, or create experience debt. Approval gates are the quality control system that protects the platform from the natural accumulation of compromises.

**The Gates:**

**Gate 1 — Product Approval (Before implementation)**
- Reviewer: Product manager or founder
- Criteria: The feature passes the Product Review Process (Section 3)
- Outcome: Pass → proceed to design. Fail → redesign or reject.

**Gate 2 — Design Approval (Before implementation)**
- Reviewer: Designer or design lead
- Criteria: The feature passes the Design Review (Section 5), Cognitive Review (Section 6), Material System Validation (Section 9), and Mobile Readiness (Section 15)
- Outcome: Pass → proceed to implementation. Fail → redesign.

**Gate 3 — Implementation Approval (Before merge)**
- Reviewer: Technical lead
- Criteria: The feature passes Definition of Done (Section 2), Performance Review (Section 11), Security Review (Section 12), Technical Debt Review (Section 18)
- Outcome: Pass → proceed to QA. Fail → fix and resubmit.

**Gate 4 — Quality Approval (Before release)**
- Reviewer: QA lead or product manager
- Criteria: The feature earns a Product Quality Score ≥ 60 (Section 20), passes Accessibility Review (Section 10), Localization Review (Section 13), Future Compatibility Review (Section 14)
- Outcome: Pass → proceed to release. Fail → fix and resubmit.

**Gate 5 — Founder Approval (Before production)**
- Reviewer: Founder
- Criteria: Founder reviews the feature holistically against the Constitution and Product Principles
- Outcome: Approved → release. Rejected → return to design. Returned for revision → fix specific issues.

**Gate Rules:**
- A feature cannot skip gates
- A feature cannot advance past a failed gate
- A feature rejected at any gate cannot be re-submitted without addressing the rejection reason
- A feature rejected twice at the same gate is permanently rejected

---

## SECTION 22 — Freeze Policy

**Purpose:** Define when and how the platform freezes to protect quality before major releases.

**Why it exists:** The period before a major release is high-risk. Last-minute changes introduce regressions, destabilize the platform, and reduce the owner's confidence. The Freeze Policy creates a protected window where quality is the only priority.

**Freeze Types:**

**Code Freeze:** No new features may be merged. Only bug fixes, performance improvements, and documentation changes are permitted. Duration: 48 hours before a major release.

**Design Freeze:** No new screens or components may be designed. Only refinements to existing designs are permitted. Duration: 72 hours before a major release.

**Content Freeze:** No copy, messaging, or notification content may change. Only factual corrections (numbers, dates, names) are permitted. Duration: 24 hours before a major release.

**Full Freeze:** No changes of any kind may be merged. Only critical security patches with founder approval. Duration: 12 hours before a major release.

**Freeze Exceptions:**
- Critical security vulnerabilities (founder approval required)
- Production outages (founder approval required)
- Regulatory compliance updates (founder approval required)

**Lifting the Freeze:**
The freeze is lifted when the release is complete and verified in production. Post-release, a 24-hour stabilization period begins where only bug fixes are permitted.

---

## SECTION 23 — Polish Sprint Philosophy

**Purpose:** Define the approach to dedicated quality improvement sprints.

**Why it exists:** Feature development naturally accumulates small quality issues — a pixel that is one unit off, a transition that is slightly jarring, a margin that is inconsistent. These issues are too small to justify their own tasks but collectively degrade the platform's feel. Polish Sprints provide dedicated time to address them.

**The Philosophy:**

**Polish is not optional.** Every major milestone is followed by a Polish Sprint. Quality is not something that happens at the end — it is something that must be actively restored.

**Polish is scoped.** A Polish Sprint has a fixed duration (typically 1–3 days) and a clear scope (a specific surface, feature, or area). It is not open-ended refinement.

**Polish is prioritized.** The team maintains a Polish Backlog of small quality improvements. During the sprint, the team works through this backlog in priority order — highest impact first.

**Polish is measured.** The team tracks the number of items resolved and the Product Quality Score improvement.

**Polish is celebrated.** Quality improvements are documented and shared. The team acknowledges that making good things better is a valuable skill.

**Polish Sprint Cadence:**
- After every major feature release: 2-day Polish Sprint
- After every milestone release: 3-day Polish Sprint
- Quarterly: 1-week Platform Polish Sprint (entire platform review)

**What belongs in a Polish Sprint:**
- Visual refinements (spacing, alignment, color)
- Animation refinements (timing, easing, smoothness)
- Copy refinements (clarity, tone, consistency)
- Performance improvements (load time, frame rate)
- Accessibility improvements
- Documentation updates
- Technical debt reduction

**What does not belong:**
- New features
- New screens
- Architecture changes
- Dependency updates

---

## SECTION 24 — Continuous Improvement

**Purpose:** Define how the craftsmanship system itself improves over time.

**Why it exists:** The Product Craftsmanship System is not static. It must evolve as the platform grows, as the team learns, and as new challenges emerge. Continuous Improvement ensures that the system never becomes obsolete — it adapts to keep quality high.

**The Improvement Cycle:**

**Review.** After every major release, the team reviews the craftsmanship process. What worked? What did not? What was missing? What was excessive?

**Adjust.** Based on the review, the team adjusts scoring thresholds, review criteria, or process steps. Changes are documented and communicated.

**Document.** Every adjustment to the craftsmanship system is recorded in this document with a changelog entry. Future team members can understand why the system is the way it is.

**Share.** The team shares their learnings with each other. A feature that passed a review but caused issues in production becomes a case study. A review that caught a critical issue becomes a case study. Both are documented.

**Principles of Improvement:**

- **The system must serve quality, not process.** If a review process is producing better quality, keep it. If it is producing bureaucracy without quality improvement, remove it.

- **The system must be efficient.** Every review should identify issues worth fixing. If a review consistently finds no issues, the review threshold may be too low or the review is unnecessary.

- **The system must be understandable.** Every engineer, designer, and agent must be able to follow the process without confusion. If a step requires interpretation, it needs to be clarified.

- **The system must be enforceable.** Review gates that can be bypassed are not gates. If the system is not being followed, the issue is not with the team but with the system.

---

## SECTION 25 — Closing Manifesto

Restaurant OS is not built by talent.

It is built by systems that any talented person can follow.

The Product Craftsmanship System exists to make quality repeatable. It removes the dependency on individual heroics, individual judgement, and individual standards. It replaces them with shared principles, measurable criteria, and enforceable gates.

A feature is not done when it compiles.

A feature is done when it passes every review in this document.

A feature is done when it earns a Product Quality Score above the threshold.

A feature is done when an owner would open it and feel confident, not confused.

---

The system is not easy.

Easy is skipping the Cognitive Review because the screen "feels right."

Easy is releasing without the Quality Score because "the designer approved it."

Easy is bypassing the approval gate because "the founder wants it shipped today."

The system exists to make it hard to ship bad work.

Every review, every gate, every score is a check on the natural tendency to accept "good enough."

Restaurant OS does not ship "good enough."

Restaurant OS ships excellent.

Or it does not ship at all.

---

The Product Craftsmanship System is not a constraint.

It is a commitment.

A commitment that the owner will never experience a feature that was rushed, untested, or inconsistent.

A commitment that the platform will be as good tomorrow as it is today.

A commitment that every person who works on Restaurant OS — engineer, designer, agent — will produce work they are proud of.

Technology disappears.
Craftsmanship remains.

The owner does not see the Quality Score.

They feel it.

When everything works, when nothing surprises them, when the platform feels reliable, calm, and confident — that is craftsmanship.

That is the only measure of success.

---

*End of Product Craftsmanship System — Restaurant OS Quality Operating Manual*
