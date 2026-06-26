# RESTAURANT OS — Canonical Cognitive Architecture

**Version:** 1.0
**Status:** Adopted
**Module:** project-docs/13-cognition
**Supersedes:** All prior cognitive models. This is the single source of truth for how Restaurant OS thinks.

---

## ENFORCEMENT STATEMENT

This document defines the permanent cognitive architecture of Restaurant OS.

**This document is above every engine.** Every future engine — Intelligence Engine, Narrative Engine, Recommendation Engine, Learning Engine, Communication Engine — MUST derive its design from this architecture.

**Nothing may violate this architecture without a ratified ADR.** If an engine's design contradicts any part of this document, the engine is wrong and must be redesigned.

**This document is technology-agnostic.** It defines cognition only. It does not mention programming languages, frameworks, AI models, LLMs, machine learning libraries, APIs, databases, or any implementation detail. Any engine specification that references technology before referencing this architecture is invalid.

**Source alignment:** This architecture derives from and is fully consistent with:
- The Constitution of Restaurant OS (35 Articles)
- Product Principles (25 Principles)
- The Cognitive & Behavioral Operating System (30 Sections)
- The Business Intelligence Fabric (10 Parts)
- The Business Ontology (31 Core Concepts)
- Blueprint 001 — The Intelligence Loop (7 Stages)
- The Canonical Domain Model (15 Parts)
- The Execution Protocol (14 Steps, 43 Laws)

---

## Part 1 — Cognitive Philosophy

### 1.1 Why Cognition Exists

Restaurant OS exists to increase the Owner's confidence in their business decisions. This is its sole purpose. Cognition is the mechanism by which it fulfills this purpose.

Without cognition, Restaurant OS would be a passive display of data — a dashboard. The Owner would be responsible for every act of reasoning: noticing patterns, remembering context, weighing evidence, judging uncertainty, connecting causes to effects. This is precisely the cognitive burden that restaurant Owners cannot afford. They are already managing fryer alarms, staff questions, delivery drivers, and customer complaints simultaneously.

Cognition exists in Restaurant OS to perform the reasoning that the Owner does not have time to perform, presenting only the output: understanding, not data; recommendations, not reports; confidence, not complexity.

### 1.2 What Cognition Means Inside Restaurant OS

Cognition in Restaurant OS is the continuous transformation:

```
Events → Understanding → Knowledge → Decisions → Learning → Wisdom
```

Where:
- **Events** are what happens in the business (a visit, a cost change, a customer review)
- **Understanding** is the assignment of meaning through context and relationships
- **Knowledge** is understanding that has been validated and committed to memory
- **Decisions** are choices the Owner makes, informed by knowledge
- **Learning** is the extraction of new knowledge from the outcomes of decisions
- **Wisdom** is the accumulated judgment that enables better future decisions

This transformation is never complete. Cognition is a loop, not a pipeline. The output of each cycle feeds the input of the next.

### 1.3 Data vs. Understanding

| Concept | Definition | Example |
|---------|-----------|---------|
| **Data** | Raw, unprocessed symbols with no inherent meaning | `Revenue: $12,847` |
| **Understanding** | Data placed in context with relationships and significance attached | "Revenue of $12,847 is 8% below the same Tuesday last month, which is consistent with the construction disruption on Main Street. This is a moderate concern." |

Data is the raw material. Understanding is the product. Restaurant OS never presents data without transforming it into understanding first. This is mandated by Constitution Article 9 (Meaning Before Metrics) and Product Principle 1.

### 1.4 Information vs. Knowledge

| Concept | Definition | Example |
|---------|-----------|---------|
| **Information** | Organized data with structure but no validation | "Average check: $28.50. Change from last month: +3%." |
| **Knowledge** | Validated understanding that has been tested against outcomes and committed to memory | "When we increased dessert prices by $2, average check rose 3% and dessert orders dropped 12%. Net impact on margin: -1.5%. This teaches us that dessert demand is elastic above the $14 threshold." |

Information is transitory. Knowledge is permanent. Restaurant OS transforms information into knowledge through the Learning stage of the Intelligence Loop. Knowledge must be earned (Constitution Article 5). It can never be assumed.

### 1.5 Reaction vs. Reasoning

| Concept | Definition | Example |
|---------|-----------|---------|
| **Reaction** | Immediate response to a stimulus without contextual evaluation | Food cost rises → send alert: "Food cost is up!" |
| **Reasoning** | Multi-stage cognitive process that evaluates context, considers alternatives, weighs evidence, and produces measured output | Food cost rises → check ingredient prices → check portion usage → check recipe consistency → check supplier changes → synthesize: "Food cost rose because chicken prices increased 12% from the supplier. Recommendation: evaluate alternative suppliers or adjust menu prices." |

Reaction is fast but shallow. Reasoning is slower but produces understanding. Restaurant OS is a reasoning system, not a reactive system. It may appear reactive in high-confidence, well-understood situations (because it reasons so fast), but it always reasons. Constitution Article 6 (Confidence Before Speed) establishes that accuracy is the foundation; speed is secondary.

### 1.6 Automation vs. Intelligence

| Concept | Definition | Example |
|---------|-----------|---------|
| **Automation** | Execution of predetermined rules without understanding or adaptation | "If food cost > 32%, send alert." |
| **Intelligence** | Contextual understanding that generates novel responses to novel situations | "Food cost is 32.4%. Normally this would trigger an alert. However, the increase is entirely due to a one-time holiday surcharge from the poultry supplier that will reverse next week. No action needed. I will monitor to confirm reversal." |

Automation follows rules. Intelligence understands when rules do not apply. Restaurant OS is an intelligent system. It can automate routine cognition (well-understood patterns with high confidence) but always retains the ability to recognize when automation would produce the wrong answer.

---

## Part 2 — Cognitive Loop

### 2.1 The Permanent Loop

Cognition in Restaurant OS executes through an eleven-stage continuous loop. Every stage is mandatory. No stage may be skipped. If a stage cannot be completed, the loop stops and communicates why.

```
        ┌─────────────────────────────────────────────────────┐
        │                                                     │
        │   PERCEPTION                                         │
        │        │                                             │
        │        ▼                                             │
        │   ATTENTION                                           │
        │        │                                             │
        │        ▼                                             │
        │   OBSERVATION                                         │
        │        │                                             │
        │        ▼                                             │
        │   UNDERSTANDING                                       │
        │        │                                             │
        │        ▼                                             │
        │   MEMORY                                             │
        │        │                                             │
        │        ▼                                             │
        │   REASONING                                           │
        │        │                                             │
        │        ▼                                             │
        │   DECISION                                           │
        │        │                                             │
        │        ▼                                             │
        │   COMMUNICATION                                       │
        │        │                                             │
        │        ▼                                             │
        │   LEARNING                                           │
        │        │                                             │
        │        ▼                                             │
        │   ADAPTATION ─────────────────────────────────────────┘
        │
        └──► (returns to PERCEPTION)
```

### 2.2 Stage Definitions

#### Stage 1 — PERCEPTION

| Property | Definition |
|----------|-----------|
| **Responsibility** | Detect stimuli from the business environment |
| **Input** | Raw signals from the external world: POS transactions, supplier invoices, employee clock-ins, customer reviews, environmental data |
| **Output** | Recognized stimuli ready for attention evaluation |
| **Failure Modes** | Stimulus blindness (signal present but not detected); stimulus flooding (too many signals, system overwhelmed); degraded signal (partial or corrupted input) |
| **Principles** | Perception is continuous, not polled. The system is always sensing. Perception is unbiased — every stimulus is equal before attention. |

Perception is the gateway. It is the admission that the system knows nothing until it has sensed something. Perception has no filtering — that is the job of Attention. Perception simply detects.

#### Stage 2 — ATTENTION

| Property | Definition |
|----------|-----------|
| **Responsibility** | Determine which perceived stimuli merit further cognitive processing |
| **Input** | Recognized stimuli from Perception |
| **Output** | Prioritized stimuli selected for Observation. Everything else is held in peripheral awareness or dismissed as noise. |
| **Failure Modes** | Attention collapse (too many high-priority signals, system unable to prioritize); attention fixation (locked onto one signal, missing others); attention blindness (genuinely important signal evaluated as noise) |
| **Principles** | Attention is the scarcest cognitive resource. It must be earned. Silence is a valid attention state — no stimulus deserves processing. Novelty, urgency, impact, risk, and opportunity determine priority. |

Attention is the system's first act of cognition. Before anything can be understood, it must be deemed worthy of understanding. This is the implementation of Calm Technology (Cognitive Behavioral System Section 10) — the system does not react to every stimulus.

#### Stage 3 — OBSERVATION

| Property | Definition |
|----------|-----------|
| **Responsibility** | Capture a verified fact about the business from a selected stimulus |
| **Input** | A prioritized stimulus from Attention |
| **Output** | An Observation: a timestamped, source-attributed, verifiable fact. The atomic unit of knowledge. |
| **Failure Modes** | False observation (captured fact is incorrect); incomplete observation (missing critical context); unverifiable observation (cannot be traced to source) |
| **Principles** | Observations are immutable. Once recorded, they cannot be changed. Observations are earned, never assumed. Every observation must trace to its source. Constitution Article 5 (Knowledge Is Earned) applies at the observation level. |

Observation is the bridge between sensing and knowing. An Observation is the first cognitive artifact — something the system can reference, analyze, and build upon. The six dimensions of observation from Blueprint 001 (Objective, Subjective, Behavioral, Environmental, Operational, Knowledge) define what can be observed.

#### Stage 4 — UNDERSTANDING

| Property | Definition |
|----------|-----------|
| **Responsibility** | Assign meaning to Observations by placing them in context, identifying relationships, and assessing confidence |
| **Input** | One or more Observations |
| **Output** | Contextualized understanding with confidence assessment. May include: relationships to existing knowledge, contradictions with prior understanding, gaps in information. |
| **Failure Modes** | Misattribution (wrong context assigned); overconfidence (high confidence with insufficient evidence); contradiction blindness (ignoring conflicting observations); false pattern (seeing relationships that do not exist) |
| **Principles** | Understanding always carries a confidence assessment. Context determines meaning. Contradictions are not errors — they signal incomplete understanding. Understanding is provisional until validated. |

Understanding is where cognition adds value. Raw observations are processed into meaningful patterns. This stage implements the second stage of the Intelligence Loop. Every understanding must answer: "What does this mean for the business?"

#### Stage 5 — MEMORY

| Property | Definition |
|----------|-----------|
| **Responsibility** | Integrate understanding into the system's persistent cognitive structures |
| **Input** | Contextualized understanding from the Understanding stage |
| **Output** | Updated memory: new facts stored, relationships established, patterns indexed, knowledge updated |
| **Failure Modes** | Memory pollution (incorrect facts stored); memory fragmentation (facts stored without relationships); memory decay (important facts prematurely discarded); memory conflicts (new facts contradict stored knowledge without resolution) |
| **Principles** | Memory is not storage — it is structured retention with relationships. Nothing is stored without connections to existing knowledge. Memory is selective: not everything needs to be remembered. Memory is permanent for observations, evolving for knowledge. |

Memory makes cognition cumulative. Without memory, every cognitive cycle starts from nothing. Memory is organized according to the Memory Architecture (Part 6).

#### Stage 6 — REASONING

| Property | Definition |
|----------|-----------|
| **Responsibility** | Apply reasoning strategies to understood and remembered information to generate conclusions, predictions, and options |
| **Input** | Understanding + Memory |
| **Output** | Reasoned conclusions: predictions, explanations, options, trade-offs, confidence assessments |
| **Failure Modes** | Reasoning deadlock (unable to reach conclusion from available information); false conclusion (reasoning appears valid but is incorrect); confirmation bias (selecting evidence that confirms existing beliefs); overfitting (conclusions too specific to general context) |
| **Principles** | Reasoning is multi-modal (see Part 7 — Reasoning Architecture). The system selects the appropriate reasoning strategy for the situation. Reasoning is always explainable — the path from premises to conclusion must be traceable. Reasoning without sufficient information stops at "insufficient data." |

Reasoning is the core cognitive act. Understanding tells the system what is true. Reasoning tells the system what follows, what might happen, and what can be done.

#### Stage 7 — DECISION

| Property | Definition |
|----------|-----------|
| **Responsibility** | Form a recommendation by evaluating alternatives, weighing evidence, assessing risk, and estimating impact |
| **Input** | Reasoned conclusions from Reasoning stage |
| **Output** | A Decision package: recommendation(s), alternatives, evidence, trade-offs, expected outcomes, confidence, risk assessment |
| **Failure Modes** | False certainty (recommendation presented with unwarranted confidence); option blindness (alternatives not considered); risk blindness (consequences not evaluated); recommendation as order (system overrides Owner's judgment) |
| **Principles** | The system recommends; the Owner decides. Every recommendation must trace to evidence. Every recommendation must include alternatives when confidence is not high. Uncertainty must be communicated. Constitution Article 16 (Every Recommendation Has Responsibility) applies. |

Decision is where cognition meets action. But the system does not act — the Owner acts. The Decision stage prepares the cognitive output for the Owner's judgment. This is the implementation of Constitution Article 10 (People Before Algorithms).

#### Stage 8 — COMMUNICATION

| Property | Definition |
|----------|-----------|
| **Responsibility** | Transform the Decision package into a form the Owner can understand, trust, and act upon |
| **Input** | Decision package (recommendations, evidence, trade-offs, confidence, risk) |
| **Output** | Communication: Narrative, Daily Brief entry, recommendation card, or silence |
| **Failure Modes** | Overcommunication (noise overwhelms signal); undercommunication (Owner misses critical information); miscommunication (message misinterpreted); inappropriate tone (urgency or calm misaligned with situation) |
| **Principles** | Communication before metrics (Product Principle 1). One primary message per communication (Product Principle 3). Silence is valid communication (Constitution Article 7). Confidence shapes language (Business Intelligence Fabric Section 8). Explain before recommend (Product Principle 7). |

Communication is the system's interface with the Owner. Everything the Owner experiences is the output of this stage. The Cognitive Behavioral System defines the rules for this stage (30 sections).

#### Stage 9 — LEARNING

| Property | Definition |
|----------|-----------|
| **Responsibility** | Extract knowledge from the outcome of the Owner's decision |
| **Input** | Outcome data (what happened after the decision was made), Owner feedback (explicit or implicit) |
| **Output** | New knowledge, updated confidence, corrected predictions, refined understanding |
| **Failure Modes** | Superficial learning (pattern extracted without depth); false learning (wrong conclusion from outcome); no learning (outcome ignored); overlearning (too much weight on single outcome) |
| **Principles** | Every outcome is a learning opportunity. Failure is the richest learning signal (Constitution Article 14). Learning requires validation before becoming knowledge. Unvalidated patterns remain hypotheses. Learning is continuous — the system never stops learning (Constitution Article 11). |

Learning closes the loop. It is the stage that makes the system intelligent over time. Without learning, the system would repeat the same reasoning forever, accumulating no wisdom. This implements the sixth stage of the Intelligence Loop.

#### Stage 10 — ADAPTATION

| Property | Definition |
|----------|-----------|
| **Responsibility** | Modify the system's cognitive structures and behaviors based on learning |
| **Input** | New knowledge from the Learning stage |
| **Output** | Updated cognitive parameters: adjusted confidence thresholds, refined pattern recognition, evolved attention priorities, improved reasoning strategies |
| **Failure Modes** | Rigidity (system refuses to adapt despite evidence); volatility (system adapts too quickly to noise); directionless adaptation (changes without improving outcomes); adaptation without memory (prior learning lost during adaptation) |
| **Principles** | Every cognitive cycle must improve at least one capability (Intelligence Loop Principle 7). Adaptation is conservative — change only when evidence supports it. Adaptation never rewrites history (learning adds to knowledge, it does not erase prior states). Adaptation is explainable — the system must be able to report what changed and why. |

Adaptation is what makes the system alive. A system that perceives, understands, and decides but never changes is an automaton. An adapting system is an organism.

#### Stage 11 — RETURN TO PERCEPTION

The loop never ends. After Adaptation, the system returns to Perception, now equipped with updated memory, refined understanding, and evolved priorities. The next cycle is more intelligent than the last. This is cumulative intelligence (Blueprint 001).

### 2.3 Loop Rules

1. **Stages are sequential.** No stage may be skipped. Every stage produces the input for the next.
2. **If a stage fails, the loop stops** at that stage. The system communicates why it stopped and what is needed to proceed.
3. **The loop is continuous.** Between cycles, the system is in a cognitive state (see Part 4).
4. **Multiple loops can run concurrently** for different stimuli. Each loop is independent but shares the same Memory and Learning systems.
5. **Loop duration varies.** A simple, well-understood observation may complete the loop in milliseconds. A novel, complex situation may take hours or days (waiting for more data at the Understanding stage).
6. **The loop always returns to Perception.** There is no terminal state. Even a "closed" business continues to be perceived (the system learns from closure).

---

## Part 3 — Cognitive Layers

### 3.1 Layer Architecture

Cognition is organized into eight layers. Each layer has distinct responsibilities, boundaries, and dependencies. Layers communicate through defined interfaces (cognitive contracts, not APIs).

```
┌─────────────────────────────────────────────────────────────┐
│                    EVOLUTION LAYER                           │
│  Long-term adaptation, capability growth, wisdom            │
├─────────────────────────────────────────────────────────────┤
│                    LEARNING LAYER                            │
│  Outcome evaluation, knowledge extraction, belief update    │
├─────────────────────────────────────────────────────────────┤
│                    COMMUNICATION LAYER                       │
│  Narrative composition, tone selection, silence decisions   │
├─────────────────────────────────────────────────────────────┤
│                    DECISION LAYER                            │
│  Recommendation generation, alternative evaluation, risk    │
├─────────────────────────────────────────────────────────────┤
│                    REASONING LAYER                           │
│  Deduction, induction, abduction, causal, temporal, etc.   │
├─────────────────────────────────────────────────────────────┤
│                    KNOWLEDGE LAYER                           │
│  Memory management, knowledge graph, pattern storage        │
├─────────────────────────────────────────────────────────────┤
│                    BUSINESS LAYER                            │
│  Business context, domain models, entity relationships      │
├─────────────────────────────────────────────────────────────┤
│                    ENVIRONMENTAL LAYER                       │
│  Raw perception, stimulus detection, source integration     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Layer Definitions

#### Environmental Layer (Bottom)

| Property | Definition |
|----------|-----------|
| **Responsibility** | Interface with the external world. Detect, classify, and normalize incoming stimuli from all sources. |
| **Boundaries** | Does not interpret. Does not filter. Does not prioritize. Only detects and presents. |
| **Input** | Raw signals from the business environment (POS, suppliers, employee systems, customer feedback, external data) |
| **Output** | Normalized stimuli ready for attention evaluation |
| **Dependencies** | None. This is the foundation layer. |
| **Owned Concepts** | Source of Truth, Stimulus, Signal (raw, before cognitive processing) |
| **Failure Modes** | Source failure, stimulus corruption, stimulus flooding |

#### Business Layer

| Property | Definition |
|----------|-----------|
| **Responsibility** | Represent the business as a living entity with identity, structure, relationships, and dynamics. |
| **Boundaries** | Contains business-context knowledge but does not perform reasoning about it. Knows what a Restaurant is but does not reason about what a Restaurant's declining sales mean. |
| **Input** | Normalized stimuli from Environmental Layer |
| **Output** | Business-contextualized stimuli (e.g., "This is a Visit for Restaurant Via Trattoria") |
| **Dependencies** | Environmental Layer |
| **Owned Concepts** | Business, Restaurant, Menu, Customer, Employee, Visit, Recipe, Ingredient, Supplier |
| **Failure Modes** | Entity misidentification, relationship corruption, stale business model |

#### Knowledge Layer

| Property | Definition |
|----------|-----------|
| **Responsibility** | Maintain the system's permanent cognitive structures: memory, knowledge, patterns, relationships, confidence. |
| **Boundaries** | Stores and retrieves. Does not reason about what it stores (that is the Reasoning Layer). Does not decide what to store (that is the Learning Layer). |
| **Input** | Contextualized understanding from Understanding stage |
| **Output** | Retrieved knowledge, identified patterns, remembered context |
| **Dependencies** | Business Layer, Environmental Layer |
| **Owned Concepts** | Memory, Knowledge, Pattern, Observation (stored), Evidence |
| **Failure Modes** | Memory fragmentation, knowledge decay, pattern pollution, retrieval failure |

#### Reasoning Layer

| Property | Definition |
|----------|-----------|
| **Responsibility** | Perform all forms of reasoning: deduction, induction, abduction, causal, temporal, counterfactual, constraint, probabilistic. |
| **Boundaries** | Reasons about what is known. Does not decide what to communicate (that is the Communication Layer). Does not decide what to recommend (that is the Decision Layer). |
| **Input** | Knowledge + Understanding from Knowledge Layer |
| **Output** | Reasoned conclusions, predictions, explanations, options |
| **Dependencies** | Knowledge Layer, Business Layer |
| **Owned Concepts** | Reasoning strategy, inference, conclusion, prediction, explanation |
| **Failure Modes** | Reasoning deadlock, false conclusion, confirmation bias, overfitting, underfitting |

#### Decision Layer

| Property | Definition |
|----------|-----------|
| **Responsibility** | Synthesize reasoned conclusions into actionable recommendations with evidence, trade-offs, risk, and confidence. |
| **Boundaries** | Recommends. Does not decide (the Owner decides). Does not communicate (passes to Communication Layer). |
| **Input** | Reasoned conclusions from Reasoning Layer |
| **Output** | Decision packages: recommendations, alternatives, evidence, trade-offs, expected outcomes, risk, confidence |
| **Dependencies** | Reasoning Layer, Knowledge Layer |
| **Owned Concepts** | Recommendation, Alternative, Risk, Opportunity, Confidence, Evidence (weighted) |
| **Failure Modes** | Option blindness, risk blindness, false certainty, recommendation as order |

#### Communication Layer

| Property | Definition |
|----------|-----------|
| **Responsibility** | Transform Decision packages into owner-facing communications: narratives, briefs, updates, silence. |
| **Boundaries** | Communicates. Does not reason about what to communicate (receives from Decision Layer). Does not decide the content (formats and delivers). |
| **Input** | Decision packages from Decision Layer |
| **Output** | Communications: narratives, recommendations, briefs, silence |
| **Dependencies** | Decision Layer, Knowledge Layer |
| **Owned Concepts** | Narrative, Daily Brief, Silence, Tone, Urgency, Freshness |
| **Failure Modes** | Overcommunication, undercommunication, miscommunication, inappropriate tone |

#### Learning Layer

| Property | Definition |
|----------|-----------|
| **Responsibility** | Extract knowledge from outcomes. Update beliefs. Evolve understanding. Validate patterns. |
| **Boundaries** | Learns. Does not adapt (passes new knowledge to Adaptation). Does not reason during learning (evaluates outcomes against predictions). |
| **Input** | Outcome data, Owner feedback, prediction-outcome comparisons |
| **Output** | New knowledge, updated confidence, corrected predictions, validated patterns |
| **Dependencies** | Knowledge Layer, Decision Layer, Communication Layer (for feedback) |
| **Owned Concepts** | Learning, Validation, Belief Update, Knowledge Extraction, Outcome Analysis |
| **Failure Modes** | Superficial learning, false learning, no learning, overlearning, underlearning |

#### Evolution Layer (Top)

| Property | Definition |
|----------|-----------|
| **Responsibility** | Long-term adaptation of the cognitive system itself. Adjust attention priorities, reasoning strategies, confidence thresholds, learning parameters. |
| **Boundaries** | Changes the system. Does not learn (receives from Learning Layer). Does not reason about itself (performs meta-cognition, not cognition). |
| **Input** | Learning outcomes, performance metrics, pattern of successes and failures |
| **Output** | Updated cognitive parameters, evolved strategies, new capability emergence |
| **Dependencies** | All lower layers |
| **Owned Concepts** | Adaptation, Evolution, Meta-Cognition, Cognitive Growth, Capability Maturation |
| **Failure Modes** | Rigidity (refuses to evolve), volatility (evolves too quickly), directionless evolution (changes without improvement), evolution without memory (prior learning lost) |

### 3.3 Layer Interaction Rules

1. **Data flows upward.** Perception starts at the Environmental Layer and flows up through each layer, being enriched at every step.
2. **Control flows downward.** Adaptation decisions from the Evolution Layer affect how lower layers operate.
3. **No layer skipping.** Information must pass through every layer. The Business Layer cannot send output directly to the Decision Layer.
4. **Layers are not stages.** The Cognitive Loop (Part 2) traverses these layers. Multiple loop cycles may operate across layers simultaneously.
5. **Each layer has authority within its boundaries.** The Knowledge Layer decides what to store. The Reasoning Layer decides how to reason. No layer overrides another's authority.
6. **Dependency direction is inviolable.** Upper layers depend on lower layers. Lower layers do not depend on upper layers. The Knowledge Layer does not depend on the Learning Layer.

---

## Part 4 — Cognitive States

### 4.1 State Model

The cognitive system exists in exactly one state at any time. State transitions are governed by the Cognitive Loop (Part 2) and internal conditions. Each state has defined entry conditions, exit conditions, allowed transitions, and forbidden transitions.

```
                  ┌──────────┐
                  │  IDLE    │
                  └────┬─────┘
                       │ stimulus detected
                       ▼
               ┌───────────────┐
          ┌───│  MONITORING    │◄──────────────┐
          │   └───────┬───────┘                │
          │           │ stimulus demands        │
          │           │ attention               │
          │           ▼                         │
          │   ┌───────────────┐                 │
          │   │  OBSERVING    │                 │
          │   └───────┬───────┘                 │
          │           │ observation             │
          │           │ captured                │
          │           ▼                         │
          │   ┌───────────────┐                 │
          │   │  UNDERSTANDING│                 │
          │   └───────┬───────┘                 │
          │           │ understanding           │
          │           │ complete                │
          │           ▼                         │
          │   ┌───────────────┐                 │
          │   │  REASONING    │                 │
          │   └───────┬───────┘                 │
          │           │ conclusion              │
          │           │ reached                 │
          │           ▼                         │
          │   ┌───────────────┐    ┌──────────┐ │
          │   │  EXPLAINING   │───►│  WAITING  │ │
          │   └───────┬───────┘    └────▲──────┘ │
          │           │ decision         │       │
          │           │ formed           │ wait  │
          │           ▼                  │ for    │
          │   ┌───────────────┐          │ data   │
          │   │  WAITING      ├──────────┘        │
          │   │  (DECISION)   │                   │
          │   └───────┬───────┘                   │
          │           │ Owner                     │
          │           │ decides                   │
          │           ▼                           │
          │   ┌───────────────┐                   │
          │   │  LEARNING     │                   │
          │   └───────┬───────┘                   │
          │           │ knowledge                 │
          │           │ extracted                 │
          │           ▼                           │
          │   ┌───────────────┐                   │
          │   │  REFLECTING   │                   │
          │   └───────┬───────┘                   │
          │           │ learning                  │
          │           │ integrated                │
          │           ▼                           │
          │   ┌───────────────┐                   │
          │   │  ADAPTING     │                   │
          │   └───────┬───────┘                   │
          │           │ adaptation                │
          │           │ complete                  │
          │           ▼                           │
          │   ┌───────────────┐                   │
          └───│  RECOVERY     │                   │
              └───────────────┘                   │
                      │                           │
                      └───────────────────────────┘
                        (after recovery) → MONITORING
```

### 4.2 State Definitions

#### IDLE

| Property | Definition |
|----------|-----------|
| **Purpose** | System is inactive. No perception occurs. Typically corresponds to the business being closed or the system not yet activated. |
| **Entry Conditions** | Business closed; system initialization not complete; Owner explicitly paused the system |
| **Exit Conditions** | Business opens; system initialized; Owner resumes |
| **Allowed Transitions** | → MONITORING |
| **Forbidden Transitions** | All others (cannot skip from IDLE to OBSERVING or higher) |

#### MONITORING

| Property | Definition |
|----------|-----------|
| **Purpose** | System is perceiving but no stimulus demands attention. The default operating state. |
| **Entry Conditions** | Business is operating; all stimuli within expected parameters |
| **Exit Conditions** | A stimulus demands attention |
| **Allowed Transitions** | → OBSERVING (when stimulus demands attention); → IDLE (business closes) |
| **Forbidden Transitions** | → REASONING (cannot reason without observing); → DECISION; → COMMUNICATION; → WAITING |

#### OBSERVING

| Property | Definition |
|----------|-----------|
| **Purpose** | System is capturing a specific stimulus as an Observation. |
| **Entry Conditions** | Attention determined that stimulus merits observation |
| **Exit Conditions** | Observation captured and recorded |
| **Allowed Transitions** | → UNDERSTANDING (observation complete); → MONITORING (observation abandoned — noise dismissed after inspection); → WAITING (need more data to complete observation) |
| **Forbidden Transitions** | → DECISION (cannot decide without understanding) |

#### UNDERSTANDING

| Property | Definition |
|----------|-----------|
| **Purpose** | System is placing the Observation in context, identifying relationships, and assessing confidence. |
| **Entry Conditions** | Observation captured |
| **Exit Conditions** | Understanding formed (may be "I do not understand this") |
| **Allowed Transitions** | → REASONING (understanding complete); → WAITING (need more information to understand); → MONITORING (observation deemed insignificant after understanding) |
| **Forbidden Transitions** | → DECISION (cannot decide without reasoning); → COMMUNICATION |

#### REASONING

| Property | Definition |
|----------|-----------|
| **Purpose** | System is applying reasoning strategies to draw conclusions from understanding. |
| **Entry Conditions** | Understanding formed |
| **Exit Conditions** | Conclusion reached, or all reasoning strategies exhausted |
| **Allowed Transitions** | → EXPLAINING (conclusion ready for decision); → WAITING (insufficient information for conclusion, need more data); → MONITORING (conclusion: nothing to do, everything fine) |
| **Forbidden Transitions** | → OBSERVING (cannot go back); → LEARNING (cannot learn without outcome) |

#### EXPLAINING

| Property | Definition |
|----------|-----------|
| **Purpose** | System is synthesizing reasoning into a communicable form: a Decision package with recommendations, evidence, alternatives, risk, and confidence. |
| **Entry Conditions** | Reasoning complete, conclusion indicates action should be considered |
| **Exit Conditions** | Decision package formed |
| **Allowed Transitions** | → WAITING(DECISION) (package complete, awaiting Owner); → MONITORING (conclusion: recommendation is not urgent, system files for next Daily Brief); → WAITING (need more information before forming recommendation) |
| **Forbidden Transitions** | → REASONING (cannot return to reasoning without new information) |

#### WAITING (multiple sub-states)

| Property | Definition |
|----------|-----------|
| **Purpose** | System needs something before it can proceed: more data (WAITING-DATA), Owner decision (WAITING-DECISION), time passage (WAITING-TIME), external event (WAITING-EVENT). |
| **Entry Conditions** | Cognitive loop cannot proceed without something external |
| **Exit Conditions** | Required condition satisfied |
| **Allowed Transitions** | → The stage that was waiting (data arrives → OBSERVING/UNDERSTANDING); → MONITORING (waiting period expired); → REFLECTING (Owner decision received, outcome available) |
| **Forbidden Transitions** | → REASONING (cannot reason with insufficient data); → DECISION (cannot decide without complete reasoning) |

#### LEARNING

| Property | Definition |
|----------|-----------|
| **Purpose** | System is extracting knowledge from the outcome of a decision. |
| **Entry Conditions** | Outcome data available (either Owner's decision outcome, or time-expired observation) |
| **Exit Conditions** | Knowledge extracted (or determined that no knowledge can be extracted) |
| **Allowed Transitions** | → REFLECTING (knowledge to integrate); → MONITORING (no knowledge gained) |
| **Forbidden Transitions** | → REASONING (cannot reason during learning); → DECISION (cannot decide during learning) |

#### REFLECTING

| Property | Definition |
|----------|-----------|
| **Purpose** | System is integrating new knowledge into existing cognitive structures. Resolving contradictions, updating confidence, refining patterns. |
| **Entry Conditions** | New knowledge extracted from Learning |
| **Exit Conditions** | Knowledge integrated, contradictions resolved or recorded |
| **Allowed Transitions** | → ADAPTING (knowledge changes cognitive parameters); → MONITORING (knowledge confirms existing understanding, no adaptation needed) |
| **Forbidden Transitions** | → REASONING; → DECISION; → OBSERVING |

#### ADAPTING

| Property | Definition |
|----------|-----------|
| **Purpose** | System is modifying its cognitive parameters based on integrated learning. |
| **Entry Conditions** | Learning indicates existing cognitive structures should change |
| **Exit Conditions** | Adaptation complete |
| **Allowed Transitions** | → MONITORING (adaptation complete, return to baseline) |
| **Forbidden Transitions** | → Any state that processes new stimuli (cannot observe while adapting). Exception: catastrophic stimulus may interrupt. |

#### RECOVERY

| Property | Definition |
|----------|-----------|
| **Purpose** | System is recovering from a cognitive failure. Restoring consistency, integrity, and trust. |
| **Entry Conditions** | Cognitive failure detected (hallucination, false certainty, memory corruption, reasoning deadlock) |
| **Exit Conditions** | Recovery complete; failure documented; mitigation in place |
| **Allowed Transitions** | → MONITORING (recovery complete); → IDLE (recovery requires full reset) |
| **Forbidden Transitions** | → Any processing state (cannot process while recovering) |

### 4.3 State Transition Rules

1. **All transitions are directional.** The graph in 4.1 defines the complete transition map. No other transitions are allowed.
2. **WAITING blocks the loop.** While in WAITING, the cognitive loop for that stimulus is paused. Other stimuli continue to be processed through their own loops.
3. **Priority interruption.** A stimulus with higher priority (Part 5 — Attention Model) can interrupt a lower-priority cognitive loop. The interrupted state is preserved and resumed when the higher-priority loop completes.
4. **RECOVERY supersedes all states.** If a cognitive failure is detected, the system transitions to RECOVERY regardless of current state.
5. **IDLE is the only persistent inactive state.** All other states transition back to MONITORING when their cognitive loop completes.

---

## Part 5 — Attention Model

### 5.1 Why Attention Exists

The business environment produces an infinite stream of stimuli. The system has finite cognitive resources. Attention is the mechanism that allocates cognitive resources to the stimuli that most deserve them.

Attention is the scarcest cognitive resource. It must be earned. This implements the Cognitive Behavioral System's Section 2 (Attention Economy) and Section 10 (Calm Technology).

### 5.2 Attention Factors

Every stimulus is evaluated across six factors. The weighted combination determines the stimulus's attention priority.

| Factor | Definition | Scale | Question |
|--------|-----------|-------|----------|
| **Priority** | Alignment with business goals and Owner's stated concerns | 0 (irrelevant) – 10 (critical to survival) | "Does this affect the Owner's primary business objectives?" |
| **Novelty** | Deviation from expected patterns | 0 (routine) – 10 (never seen before) | "Is this different from what we expected?" |
| **Urgency** | Time sensitivity of response required | 0 (no time pressure) – 10 (immediate action required) | "How quickly must the Owner know about this?" |
| **Impact** | Magnitude of potential effect on business outcomes | 0 (negligible) – 10 (existential) | "How much does this matter to the business?" |
| **Risk** | Likelihood of negative consequences if unaddressed | 0 (no risk) – 10 (certain harm) | "What happens if we ignore this?" |
| **Opportunity** | Potential for positive outcome if addressed | 0 (no opportunity) – 10 (transformative) | "What could we gain by acting on this?" |

### 5.3 Attention Priority Function

```
Attention Priority = f(Priority, Novelty, Urgency, Impact, Risk, Opportunity)
```

Where:
- All factors are evaluated on a 0–10 scale
- The function produces a single Attention Priority Score (0–10)
- The function is weighted, not averaged — Priority and Urgency have higher default weights than Novelty
- Weights are learned over time (Evolution Layer adjusts based on Owner feedback)

### 5.4 Attention Thresholds

| Score Range | Classification | Behavior |
|-------------|---------------|----------|
| 0.0 – 2.0 | Noise | Dismissed. Not stored as Observation. May contribute to aggregate statistics. |
| 2.1 – 4.0 | Peripheral Awareness | Noted but not processed. Stored as potential context. May be elevated if related stimuli cluster. |
| 4.1 – 6.0 | Background Monitoring | Observation captured. Placed in low-priority cognitive loop. |
| 6.1 – 8.0 | Active Attention | Full cognitive loop initiated. Priority processing. |
| 8.1 – 10.0 | Critical Attention | Immediate cognitive loop. May interrupt lower-priority loops. Owner may be notified urgently. |

### 5.5 Silence as an Attention State

Silence is not the absence of attention. Silence is the deliberate decision that no stimulus currently deserves attention. This is a positive cognitive state.

Silence is the default. The system does not need to justify silence. Stimuli must earn the right to break silence. This implements the Calm Technology principle (Cognitive Behavioral System Section 10) and Constitution Article 7 (Silence Is Also Communication).

### 5.6 Attention Over Time

Attention is not static. It evolves through:

| Dynamic | Description |
|---------|-------------|
| **Habituation** | Repeated identical stimuli lose novelty. Priority decays unless impact or urgency increases. |
| **Sensitization** | Related stimuli can amplify each other. Three minor supply disruptions in a week may accumulate to active attention. |
| **Context Shift** | A change in business context (new menu, new season, new location) recalibrates attention baselines. |
| **Learning** | The system learns what the Owner considers important. A stimulus the Owner always acts on gains priority weight over time. |
| **Fatigue** | If every stimulus is critical, nothing is critical. The system monitors its own attention load to prevent attention inflation. |

### 5.7 Noise Detection

Noise is a stimulus that does not contain signal. The system must identify noise to prevent cognitive resource waste.

| Noise Type | Description | Detection |
|------------|-------------|-----------|
| **Random Fluctuation** | Normal business variance | Statistical outlier analysis |
| **Measurement Error** | Incorrect data | Source trust evaluation, cross-source validation |
| **Temporal Artifact** | One-time event that looks like a pattern | Temporal context, historical comparison |
| **Reporting Lag** | Stale data appearing as current | Freshness evaluation (Business Intelligence Fabric Section 9) |
| **Double Counting** | Same event reported through multiple channels | Correlation analysis, deduplication |

Noise is not ignored — it is evaluated and dismissed with a record. This ensures the system can distinguish between "I did not see this" (Perception failure) and "I saw this and determined it was noise" (Attention decision).

### 5.8 Attention and Business Pulse

Business Pulse modulates attention baselines (Business Intelligence Fabric Part V):

| Pulse State | Noise Threshold | Active Attention Threshold | Critical Attention Threshold |
|-------------|-----------------|---------------------------|----------------------------|
| **High** | Higher (more tolerant of variance) | Normal | Normal |
| **Medium** | Normal | Normal | Normal |
| **Low** | Lower (less tolerant of variance) | Lower (more sensitive) | Normal |
| **Degraded** | Much Lower (hyper-sensitive) | Significantly Lower | Lower |

When Pulse is degraded, the system attends more carefully to every stimulus because it has less confidence in its understanding. When Pulse is high, it can afford to be more selective.

---

## Part 6 — Memory Architecture

### 6.1 What Memory Is

Memory is the system's persistent cognitive structure. It is not storage. Storage implies passive retention of undifferentiated data. Memory is an active, organized, relational structure where every fact is connected to other facts, every memory has a purpose, and every retention has a cost.

### 6.2 Memory Systems

#### Working Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Seconds to minutes |
| **Capacity** | Current cognitive cycle context only |
| **Contents** | Current Observation being processed, active Understanding, intermediate Reasoning results, pending Decision |
| **Retention** | Volatile. Cleared when the cognitive cycle completes. |
| **Relationships** | None (single-cycle context) |
| **Promotion Rules** | Contents are promoted to Short-Term Memory if the Understanding stage identifies a potential pattern worth tracking. |
| **Discard Rules** | Cleared automatically at cycle completion. Nothing in Working Memory persists. |

*Working Memory is the system's immediate consciousness — what it is thinking about right now.*

#### Short-Term Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Minutes to hours |
| **Capacity** | Recent Observations and Understandings from the current session |
| **Contents** | Observations from the last N cognitive cycles, temporary hypotheses, pending questions |
| **Retention** | Time-decay. Contents fade unless reinforced. |
| **Relationships** | Linked by temporal proximity (what happened near what). |
| **Promotion Rules** | An Observation or Understanding that appears in multiple cognitive cycles is promoted to Long-Term Memory. A hypothesis that receives confirming evidence is promoted. |
| **Discard Rules** | Contents that are not reinforced within the retention window are discarded. Contents that have been successfully promoted to Long-Term Memory are cleared from Short-Term. |

*Short-Term Memory is the system's recent experience — what it has been noticing lately.*

#### Long-Term Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Days to years |
| **Capacity** | Validated knowledge, confirmed patterns, business understanding |
| **Contents** | Business Knowledge Graph entities and relationships; confirmed patterns with confidence scores; validated cause-effect relationships; business rhythm baselines; Owner preferences and decision patterns |
| **Retention** | Persistent. Contents persist until actively updated or deprecated by the Learning Layer. |
| **Relationships** | Fully relational. Every entity links to related entities, supporting observations, confidence scores, timestamps. |
| **Promotion Rules** | Understanding that passes the Learning Layer's validation gates. Knowledge that survives contradiction resolution. |
| **Discard Rules** | Knowledge that is deprecated (Constitution Article 28 — Knowledge Ages). Discarded knowledge is not deleted — it is archived to Historical Memory with a deprecation record. |

*Long-Term Memory is the system's understanding of the business — what it knows to be true.*

#### Historical Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Permanent |
| **Capacity** | Complete, immutable record of all cognitive activity |
| **Contents** | Every Observation ever recorded (immutable). Every Decision package ever generated. Every Learning outcome. Every cognitive state transition. Every Adaptation event. |
| **Retention** | Permanent. Nothing in Historical Memory is ever deleted. |
| **Relationships** | Chronologically indexed with correlation IDs linking related events. |
| **Promotion Rules** | Nothing is promoted from Historical Memory. It is the archive. |
| **Discard Rules** | None. Nothing is discarded. Compression of low-resolution historical data is permitted only when full resolution is no longer needed for cognitive function. |

*Historical Memory is the system's complete autobiography — everything it has ever experienced.*

#### Semantic Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Permanent (within the system's operating life) |
| **Capacity** | Conceptual knowledge about the domain |
| **Contents** | Domain model concepts and their relationships (what a Restaurant is, what a Menu is, how they relate). Ubiquitous Language definitions. Business invariants. |
| **Retention** | Permanent. Updated only when the domain model evolves (requires ADR). |
| **Relationships** | Ontological hierarchy. Concept-inheritance, part-whole, dependency. |
| **Promotion Rules** | N/A. Semantic Memory is loaded at system initialization from the domain model. |
| **Discard Rules** | None. Semantic Memory is the cognitive constitution. |

*Semantic Memory is the system's understanding of what the world is — the permanent conceptual foundation.*

#### Business Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Lifetime of the business relationship |
| **Capacity** | Specific knowledge about the particular business the system serves |
| **Contents** | Business identity and structure. Owner identity and preferences. Staff roster and roles. Menu history and changes. Seasonal patterns. Business-specific rhythms. |
| **Retention** | Lifetime of the business. Contents evolve as the business evolves. |
| **Relationships** | Linked to Long-Term Memory (patterns observed in this business) and Historical Memory (decisions made for this business). |
| **Promotion Rules** | Business-specific facts are always retained when active. Archived when the business closes. |
| **Discard Rules** | Deprecated business data is archived to Historical Memory. |

*Business Memory is the system's understanding of who this business is — its identity, personality, and history.*

#### Pattern Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Variable. Patterns persist as long as they remain valid. |
| **Capacity** | All identified patterns, from tentative (low confidence) to confirmed (high confidence). |
| **Contents** | Pattern definitions (what was observed, in what context, over what period). Pattern strength (correlation, sample size, significance). Pattern status (tentative, confirmed, deprecated). |
| **Retention** | Patterns are retained as long as they remain relevant and valid. A confirmed pattern that no longer manifests may be deprecated but is archived with a deprecation record. |
| **Relationships** | Patterns link to their supporting Observations (in Historical Memory) and to the Knowledge they have generated (in Long-Term Memory). |
| **Promotion Rules** | A tentative pattern with sufficient supporting evidence is promoted to confirmed. A confirmed pattern that generates accurate predictions accumulates confidence. |
| **Discard Rules** | A pattern that fails validation (contradicting evidence) is deprecated but not deleted. A pattern that no longer predicts accurately is downgraded and investigated. |

*Pattern Memory is the system's understanding of how the business behaves — the regularities it has detected.*

#### Decision Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Lifetime of business relationship (active decisions retained until resolved or expired) |
| **Capacity** | All active and historical decisions |
| **Contents** | Every recommendation generated, every decision presented to the Owner, every Owner response (accepted, rejected, deferred), every outcome, every lesson learned. |
| **Retention** | Active decisions (pending Owner response) are retained in active Decision Memory. Resolved decisions are archived to Historical Memory. |
| **Relationships** | Decisions link to the Observations that triggered them, the Knowledge that informed them, and the Outcomes that resulted from them. |
| **Promotion Rules** | A deferred decision that becomes urgent again is promoted back to active. A decision whose outcome produced significant learning is promoted to Long-Term Memory as a case study. |
| **Discard Rules** | An expired recommendation (time passed without Owner action) is moved from active to archived. A resolved decision with no learning value is archived. |

*Decision Memory is the system's understanding of what it has recommended and what happened as a result.*

#### Learning Memory

| Property | Definition |
|----------|-----------|
| **Duration** | Permanent (learning events are never forgotten) |
| **Capacity** | All learning events and their outcomes |
| **Contents** | Every Learning cycle result. What was learned, from which outcome, with what confidence. How understanding changed. What adaptations were made. |
| **Retention** | Permanent. Learning is the system's most valuable output. |
| **Relationships** | Learning events link to the Decision that produced the outcome and the Memory that was updated as a result. |
| **Promotion Rules** | Learning that produces a significant shift in understanding is promoted to the Evolution Layer for meta-cognitive adaptation. |
| **Discard Rules** | None. Learning is never discarded. Redundant learning events may be compressed. |

*Learning Memory is the system's understanding of how it has grown — its developmental history.*

### 6.3 Memory Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    HISTORICAL MEMORY                             │
│  (Permanent, immutable archive of everything)                   │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Business  │  │ Decision │  │ Learning │  │ Pattern  │       │
│  │Memory    │  │ Memory   │  │ Memory   │  │ Memory   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              LONG-TERM MEMORY                              │   │
│  │  (Validated knowledge, confirmed patterns)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SHORT-TERM MEMORY                             │   │
│  │  (Recent observations, temporary hypotheses)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              WORKING MEMORY                               │   │
│  │  (Current cognitive cycle context)                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SEMANTIC MEMORY                               │   │
│  │  (Domain concepts, permanent knowledge)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.4 Memory Principles

1. **Everything is connected.** No memory exists in isolation. Every stored fact has relationships to other facts.
2. **Memory is not storage.** Storage implies passive retention. Memory implies active organization, indexing, and retrieval.
3. **Confidence decays.** Unreinforced memories lose confidence over time. This prevents stale knowledge from persisting indefinitely.
4. **Contradictions are preserved.** When new knowledge contradicts stored knowledge, both versions are preserved with their supporting evidence. The system does not silently overwrite.
5. **Deletion is not forgetting.** Nothing is truly deleted. Deprecated knowledge is archived to Historical Memory with a deprecation record. Only Working Memory is cleared.
6. **Retrieval updates memory.** The act of retrieving a memory strengthens it. Frequently accessed memories are more resistant to decay.
7. **Memory is distributed across systems.** A single observation exists in Working Memory (during processing), Short-Term Memory (recently), Historical Memory (permanently), and potentially Pattern Memory (if it contributed to a pattern).

### 6.5 Promotion Rules Summary

| From | To | Condition |
|------|----|-----------|
| Working | Short-Term | Understanding stage identifies potential pattern worth tracking |
| Short-Term | Long-Term | Pattern appears in multiple cycles; hypothesis receives confirming evidence |
| Long-Term | Archived (Historical) | Knowledge deprecated (Article 28); pattern no longer valid |
| Any | Historical | Immutable record of all cognitive activity |
| Short-Term | Discarded | Not reinforced within retention window |

### 6.6 Discard Rules Summary

| System | Discard Condition | Action |
|--------|-------------------|--------|
| Working | Cognitive cycle completes | Cleared automatically |
| Short-Term | Retention window expires without reinforcement | Discarded (not archived — never reached significance) |
| Long-Term | Knowledge deprecated by Learning Layer | Archived to Historical Memory |
| Historical | Never | No discard. Compression permitted. |
| Semantic | Never | Requires ADR to update |
| Pattern | Deprecated by Learning Layer | Archived with deprecation record |

---

## Part 7 — Reasoning Architecture

### 7.1 What Reasoning Is

Reasoning is the cognitive act of deriving new conclusions from existing understanding and memory. It is the transformation of "what is known" into "what follows," "what might be," "what caused this," and "what can be done."

The system employs multiple reasoning strategies. No single strategy is sufficient for all situations. The system selects the appropriate strategy (or combination of strategies) based on the nature of the problem, the available information, and the required conclusion.

### 7.2 Reasoning Strategies

#### Deduction

| Property | Definition |
|----------|-----------|
| **What It Is** | Reasoning from general principles to specific conclusions. If the premises are true, the conclusion must be true. |
| **When Appropriate** | When the system has established rules and known facts. When certainty is required. When the domain is well-understood. |
| **Example** | "All Menu Items have a Food Cost percentage. Item X is a Menu Item. Therefore, Item X has a Food Cost percentage." |
| **Output** | Certain conclusion (assuming premises are correct) |
| **Limitations** | Cannot produce new knowledge — only makes explicit what is implicit in existing knowledge. Requires established rules. |
| **Failure Mode** | False premise → false conclusion (garbage in, garbage out). Over-application: treating probabilistic domains as deductive. |

#### Induction

| Property | Definition |
|----------|-----------|
| **What It Is** | Reasoning from specific observations to general patterns. Observing many instances and inferring a general rule. |
| **When Appropriate** | When the system has many observations of a phenomenon and needs to identify the underlying pattern. When building new knowledge from experience. |
| **Example** | "For the past 12 Tuesdays, lunch covers declined between 2-5%. Therefore, Tuesdays are generally slower for lunch." |
| **Output** | Probabilistic conclusion. Strength depends on number and consistency of observations. |
| **Limitations** | Never certain. A single counterexample can invalidate the induction. Requires sufficient sample size. |
| **Failure Mode** | Overgeneralization (insufficient sample). Confirmation bias (selecting observations that support the pattern). |

#### Abduction

| Property | Definition |
|----------|-----------|
| **What It Is** | Reasoning from observed effect to most likely cause. Inference to the best explanation. |
| **When Appropriate** | When the system observes an effect and needs to determine what caused it. When multiple possible explanations exist. |
| **Example** | "Lunch covers declined 15% this week. The most likely explanation is the construction on Main Street, because construction started the same week and historically correlates with 10-20% declines." |
| **Output** | Best explanation (with confidence assessment). May include alternative explanations ranked by likelihood. |
| **Limitations** | Cannot prove causation — only identifies the most plausible explanation. Multiple explanations may have similar likelihood. |
| **Failure Mode** | False attribution (selecting wrong cause). Over-attribution (assigning single cause to multi-causal effect). Premature closure (stopping at first plausible explanation). |

#### Causal Reasoning

| Property | Definition |
|----------|-----------|
| **What It Is** | Reasoning about cause-effect relationships. Understanding what causes what, and what would happen if causes changed. |
| **When Appropriate** | When the system needs to understand why something happened, predict what will happen, or determine how to intervene. |
| **Example** | "Increasing menu prices by 5% caused a 2% drop in covers but a 3% increase in average check. Net revenue effect: +1%." |
| **Output** | Causal model with direction, magnitude, and confidence of causal relationships. |
| **Limitations** | Correlation is not causation. Requires sufficient evidence to establish causal direction. Time lags between cause and effect complicate inference. |
| **Failure Mode** | Causal oversimplification (ignoring confounding variables). Reverse causation (mistaking effect for cause). Spurious correlation. |

#### Temporal Reasoning

| Property | Definition |
|----------|-----------|
| **What It Is** | Reasoning about time: order, duration, rhythm, cycles, sequences, trends. |
| **When Appropriate** | When time is a critical dimension of the problem. When understanding sequences, cycles, or trends. |
| **Example** | "Food cost typically rises in December due to holiday supplier surcharges. It has risen the past 3 Decembers by 2-4%. We are in December. The observed 3% rise is consistent with this seasonal pattern." |
| **Output** | Temporal understanding: sequences, durations, cycles, trends, seasonal patterns. |
| **Limitations** | Requires sufficient temporal data. Past patterns do not guarantee future behavior. Regime changes break temporal models. |
| **Failure Mode** | False periodicity (seeing cycles that do not exist). Temporal extrapolation (assuming past trend continues). Seasonality blindness (ignoring known cycles). |

#### Counterfactual Reasoning

| Property | Definition |
|----------|-----------|
| **What It Is** | Reasoning about what would have happened if circumstances were different. "What if we had not raised prices?" |
| **When Appropriate** | When evaluating past decisions. When comparing alternative scenarios. When learning from outcomes. |
| **Example** | "If we had not raised dessert prices, revenue would have been $1,200 lower, but we would have served 40 more desserts. Net hypothetical profit impact: +$200." |
| **Output** | Alternative scenario with estimated outcome and confidence. |
| **Limitations** | Cannot be verified (counterfactuals never happened). Relies on causal model accuracy. Confidence decreases with distance from actual scenario. |
| **Failure Mode** | Counterfactual overconfidence (certainty about what never happened). Hindsight bias ("we knew it all along"). |

#### Constraint Reasoning

| Property | Definition |
|----------|-----------|
| **What It Is** | Reasoning within defined boundaries. Finding solutions that satisfy all constraints. |
| **When Appropriate** | When the problem has clear constraints (budget, capacity, legal, quality). When optimizing within limits. |
| **Example** | "Labor cost must be below 30%. Current schedule has labor at 32%. We need to reduce 20 hours from the schedule. Closing on Monday lunch would save 8 hours. Reducing Tuesday dinner coverage by 2 servers would save 12 hours. Combined: 20 hours → labor at 29.5%. This satisfies the constraint." |
| **Output** | Satisfying or optimal solution within constraints. May include trade-off analysis when constraints conflict. |
| **Limitations** | Requires clearly defined constraints. Constraint conflicts may require prioritization. Does not account for externalities beyond constraints. |
| **Failure Mode** | Constraint blindness (ignoring relevant constraints). False optimization (satisfying local constraints while violating global). Constraint creep (gradually relaxing constraints without recording). |

#### Probabilistic Reasoning

| Property | Definition |
|----------|-----------|
| **What It Is** | Reasoning under uncertainty. Quantifying likelihood, updating beliefs with new evidence, making decisions with incomplete information. |
| **When Appropriate** | When the system faces uncertainty. When information is incomplete. When outcomes are probabilistic rather than deterministic. |
| **Example** | "There is a 70% probability that the supplier price increase is temporary (based on historical patterns of similar increases). If we wait 2 weeks before adjusting menu prices, we have a 70% chance of avoiding unnecessary repricing." |
| **Output** | Probability distributions, confidence intervals, likelihood ratios. |
| **Limitations** | Requires prior probabilities and evidence. Small sample sizes produce unreliable probabilities. Humans (including Owners) struggle with probabilistic information. |
| **Failure Mode** | False precision (presenting probabilities as more precise than they are). Base rate neglect (ignoring prior probabilities). Overconfidence in small samples. |

### 7.3 Reasoning Strategy Selection

The system selects reasoning strategies based on:

| Condition | Primary Strategy | Secondary Strategy |
|-----------|-----------------|-------------------|
| Rules known, facts known | Deduction | Constraint |
| Rules unknown, facts known | Induction | Temporal |
| Effect observed, cause unknown | Abduction | Causal |
| Intervention considered | Causal | Counterfactual |
| Time is critical dimension | Temporal | Induction |
| Scenario evaluation | Counterfactual | Probabilistic |
| Optimization within constraints | Constraint | Deduction |
| High uncertainty | Probabilistic | Multiple strategies combined |

The system may combine multiple strategies for complex problems. For example, a recommendation about menu pricing might use: deduction (cost-plus pricing constraints) + induction (historical price elasticity patterns) + causal (projected impact of price change on demand) + probabilistic (uncertainty range for demand response).

### 7.4 Reasoning Principles

1. **Reasoning is always explainable.** The path from premises to conclusion must be traceable and communicable.
2. **The system names its reasoning strategy.** The Owner is told whether a conclusion is deductive (certain), inductive (probabilistic), or abductive (best guess).
3. **Insufficient information stops reasoning.** If the system lacks the information needed to reason, it does not guess. It reports what is needed.
4. **Confidence is attached to every conclusion.** A deductive conclusion with uncertain premises has lower confidence than one with certain premises.
5. **Multiple strategies reduce risk.** When confidence is low, the system runs multiple reasoning strategies and compares outputs. Convergence increases confidence.
6. **Contradictory conclusions are not errors.** Different reasoning strategies may produce different conclusions. This signals incomplete understanding, not system failure.

---

## Part 8 — Decision Architecture

### 8.1 How Decisions Are Generated

A decision begins when the system has reasoned to a conclusion that implies action. The Decision Layer transforms reasoned conclusions into decision packages — structured proposals for the Owner to evaluate.

The decision generation process:

1. **Identify the decision question.** What specific choice does the Owner need to make? "Should we adjust menu prices?"
2. **Generate candidate options.** What alternatives exist? "Do nothing, raise prices 3%, raise selectively, find new supplier."
3. **Evaluate each option.** What would happen under each alternative? (Causal reasoning, counterfactual reasoning.)
4. **Assess trade-offs.** What does each option gain and sacrifice? "Raising prices improves margin but may reduce covers."
5. **Weight evidence.** What Observations and Knowledge support each option? How strong is the evidence?
6. **Calculate confidence.** How certain is the system about each option's projected outcome?
7. **Assess risk.** What could go wrong under each option? How likely and how severe?
8. **Estimate expected impact.** What is the net expected effect on business outcomes?
9. **Rank options.** Present in order of expected value, with confidence.

### 8.2 Alternative Evaluation

When evaluating alternatives, the system considers:

| Dimension | Question | Output |
|-----------|----------|--------|
| **Expected Outcome** | What is the most likely result? | Projected outcome with confidence |
| **Best Case** | What is the best plausible result? | Upper bound |
| **Worst Case** | What is the worst plausible result? | Lower bound |
| **Outcome Range** | What is the full range of probable outcomes? | Confidence interval |
| **Time to Effect** | When would results materialize? | Time horizon |
| **Duration of Effect** | How long would results last? | Persistence estimate |
| **Side Effects** | What else might change? | Secondary effects |
| **Reversibility** | Can this decision be undone? | Reversibility assessment |
| **Synergies** | Does this option enable other opportunities? | Option value |

### 8.3 Evidence Weighting

Not all evidence is equal. Evidence is weighted by:

| Factor | Description | Weight Impact |
|--------|-------------|---------------|
| **Source Trust** | Trust level of the source providing the evidence | Higher trust → higher weight |
| **Observation Count** | How many observations support the evidence | More observations → higher weight |
| **Consistency** | How consistent the evidence is across sources and time | More consistent → higher weight |
| **Directness** | How directly the evidence relates to the decision | More direct → higher weight |
| **Freshness** | How recent the evidence is | More recent → higher weight (varies by domain) |
| **Independence** | Whether the evidence sources are independent | Independent → higher weight |

### 8.4 Confidence Dynamics

Confidence in a decision is not static. It changes through:

| Dynamic | Description |
|---------|-------------|
| **Accumulation** | More supporting evidence increases confidence |
| **Decay** | Confidence decays over time without reinforcement |
| **Contradiction** | Contradictory evidence reduces confidence |
| **Validation** | Actual outcomes matching predictions increases confidence |
| **Correction** | Actual outcomes differing from predictions decreases confidence |
| **Calibration** | The system learns when it tends to be overconfident or underconfident and adjusts |

Confidence is never absolute. The maximum confidence the system can express is "very high" — never "certain." This implements Constitution Article 3 (Restaurant OS Never Pretends To Know).

### 8.5 Uncertainty Representation

Uncertainty is not the absence of confidence. Uncertainty is a positive property of the decision situation that must be communicated.

| Type of Uncertainty | Description | Communication |
|--------------------|-------------|---------------|
| **Epistemic** | Lack of knowledge (could be resolved with more data) | "We need more information about..." |
| **Aleatory** | Inherent randomness (cannot be resolved with more data) | "This outcome has natural variability: range X–Y" |
| **Model** | Uncertainty in the system's understanding | "Our understanding is based on N observations" |
| **Temporal** | Uncertainty about future conditions | "Conditions may change — review recommended by date" |
| **Structural** | Uncertainty about relationships between factors | "We have identified X factors but there may be others" |

### 8.6 Risk Assessment

Risk is the combination of likelihood and impact of negative outcomes.

```
Risk = f(Likelihood, Impact)
```

| Likelihood | Impact | Risk Level | Action |
|------------|--------|------------|--------|
| High | High | Critical | Must be addressed. Decision may not proceed without mitigation. |
| High | Medium | High | Significant concern. Mitigation required. |
| High | Low | Medium | Monitor. Low cost to accept risk. |
| Medium | High | High | Significant concern. Mitigation required. |
| Medium | Medium | Medium | Monitor. Mitigation recommended. |
| Medium | Low | Low | Accept. |
| Low | High | Medium | Low probability but monitor. |
| Low | Medium | Low | Accept. |
| Low | Low | Minimal | Ignore. |

Risk is communicated alongside every recommendation. The Owner must understand what could go wrong before deciding.

### 8.7 Expected Impact Estimation

Expected impact is estimated through:

```
Expected Impact = Σ (Outcome_i × Probability_i) for all possible outcomes i
```

Where:
- Outcomes include positive, negative, and neutral scenarios
- Probabilities are derived from the system's confidence model
- Impact is measured in business terms (revenue, margin, covers, customer satisfaction)
- Impact is always expressed as a range, not a point estimate

Constitution Article 16 (Every Recommendation Has Responsibility) requires that the system anticipate consequences across interconnected domains. Expected impact estimation must consider side effects, not just primary effects.

### 8.8 Decision Principles

1. **The system recommends; the Owner decides.** This is inviolable (Constitution Article 10).
2. **Every recommendation includes at least one alternative.** The Owner must have a choice (Intelligence Loop Stage 5).
3. **Every recommendation includes confidence.** The Owner must calibrate their trust (Constitution Article 3).
4. **Every recommendation includes risk.** The Owner must understand what could go wrong.
5. **Every recommendation includes evidence trace.** The Owner must be able to verify reasoning (Constitution Article 4).
6. **Every recommendation includes an expiration.** Recommendations not acted upon expire (Domain Model Invariant).
7. **No recommendation in degraded Pulse.** When Business Pulse is degraded, the system pauses recommendations and focuses on learning (Business Intelligence Fabric Section 16).
8. **The system never executes without Owner approval.** No autonomous action.

---

## Part 9 — Learning Architecture

### 9.1 How Experience Changes the System

Every cognitive cycle produces learning. Learning is the process by which experience changes the system's understanding, memory, and behavior.

The learning process:

1. **Outcome observation.** What actually happened after a decision was made or after an observation was recorded?
2. **Comparison.** How does the actual outcome compare to the expected outcome (if a prediction was made)?
3. **Surprise calculation.** How unexpected is this outcome? (High surprise → high learning potential.)
4. **Attribution.** What caused the outcome? Was it the decision, external factors, or random variance?
5. **Knowledge extraction.** What can be learned from this outcome?
6. **Belief update.** How should existing knowledge change based on this learning?
7. **Confidence update.** Should confidence in related knowledge increase, decrease, or remain unchanged?
8. **Memory integration.** Store the learning in the appropriate memory system.

### 9.2 What Can Be Learned

| Learning Type | Description | Source |
|---------------|-------------|--------|
| **Pattern Validation** | Confirming or refuting a suspected pattern | Outcome of pattern-based prediction |
| **Causal Discovery** | Identifying cause-effect relationships | Repeated observation of co-occurrence |
| **Confidence Calibration** | Improving the accuracy of confidence assessments | Comparison of predicted vs actual confidence |
| **Attention Tuning** | Learning what deserves attention | Owner response to recommendations |
| **Preference Learning** | Learning the Owner's preferences and priorities | Owner decisions and feedback |
| **Rhythm Learning** | Learning the business's temporal patterns | Long-term observation of business cycles |
| **Relationship Learning** | Discovering relationships between entities | Correlation and co-occurrence analysis |
| **Anomaly Learning** | Understanding what is normal vs. anomalous | Baseline establishment and deviation tracking |

### 9.3 What Cannot Be Learned

| Cannot Learn | Why | Mitigation |
|-------------|-----|------------|
| **Future with certainty** | The future is inherently uncertain | Express as probability, not certainty |
| **Owner's private knowledge** | The Owner knows things the system cannot observe (Constitution Article 29) | Ask specific questions; do not assume |
| **Causes without evidence** | Correlation without causation cannot be distinguished without evidence | Require sufficient observation; label as correlation |
| **Knowledge across business boundaries** | Private data never leaves the business (Constitution Article 13) | Share patterns, not data |
| **What the system has not observed** | The system cannot know what it has not perceived | Report gaps explicitly |

### 9.4 How Knowledge Evolves

Knowledge evolves through a continuous cycle of validation, integration, and deprecation:

```
Tentative Knowledge
    │
    ▼
Under Validation ← Contradiction → Deprecated (archived)
    │                                    │
    ▼                                    ▼
Validated Knowledge                  Historical Archive
    │
    ▼
Confidence grows with reinforcement
    │
    ▼ (if evidence weakens)
Confidence decays → Re-Validated or Deprecated
```

**Knowledge lifecycle stages:**

| Stage | Description | Duration |
|-------|-------------|----------|
| **Hypothesis** | A proposed pattern or relationship not yet validated | Temporary (until validated or refuted) |
| **Tentative** | Some evidence exists but not sufficient for confidence | Medium (requires more evidence) |
| **Under Validation** | Active validation in progress (considering evidence, running checks) | Variable (depends on evidence availability) |
| **Validated** | Sufficient evidence supports the knowledge | Long-term |
| **Deprecated** | Knowledge no longer valid or applicable | Archived (permanent record of why) |

### 9.5 Belief Update Rules

When new evidence conflicts with existing knowledge, the system follows:

1. **Preserve both.** Do not overwrite existing knowledge. Record new evidence and its relationship to old knowledge.
2. **Evaluate evidence quality.** Assess the trust, consistency, freshness, and independence of new evidence vs. old evidence.
3. **Time-weight appropriately.** Recent evidence may be more relevant (for dynamic domains) or less relevant (for structural knowledge).
4. **Consider alternative explanations.** New evidence may not contradict old knowledge — they may explain different aspects.
5. **Update confidence, not truth.** Rather than declaring old knowledge "false," reduce its confidence. The new knowledge starts at low confidence and grows with reinforcement.
6. **Escalate if uncertain.** If the system cannot resolve a contradiction with available evidence, it creates a contradiction record and may surface to the Owner.

### 9.6 Contradiction Handling

Contradictions are not errors. They are signals that understanding is incomplete (Intelligence Loop Stage 2).

| Contradiction Type | Resolution Strategy |
|--------------------|---------------------|
| **Source contradictions** (two sources disagree) | Evaluate source trust; check temporal context; identify provenance differences |
| **Temporal contradictions** (pattern changes over time) | Investigate regime change; check for external factors; may indicate genuine evolution |
| **Contextual contradictions** (pattern valid in one context, not another) | Identify context boundary; refine pattern scope |
| **Measurement contradictions** (different measurements of same phenomenon disagree) | Check measurement methodology; evaluate precision |
| **Owner contradictions** (Owner says system is wrong) | Highest priority. Owner is always right about their business (Product Principle 24). Update beliefs accordingly. |

### 9.7 Knowledge Retirement

Knowledge becomes obsolete (Constitution Article 28 — Knowledge Ages). The retirement process:

1. **Detection.** Observed outcomes consistently diverge from knowledge-based predictions.
2. **Investigation.** Is the knowledge wrong, or are conditions exceptional?
3. **Decision.** If knowledge is genuinely obsolete, mark as deprecated.
4. **Archive.** Move to Historical Memory with deprecation record (why, when, replaced by what).
5. **Notification.** If the deprecated knowledge was active in recommendations, inform the Owner of the change.

### 9.8 Learning Principles

1. **Every outcome is a learning opportunity.** Success, failure, and non-outcomes all produce learning.
2. **Failure is the richest learning signal.** Mistakes reveal more than successes (Constitution Article 14).
3. **Learning requires validation.** Unvalidated patterns remain hypotheses (Intelligence Loop Stage 6).
4. **Learning never rewrites history.** New knowledge adds to memory; it does not erase prior states.
5. **The Owner is the highest-quality learning signal.** Owner feedback overrides other learning signals.
6. **Learning is bounded by privacy.** The system learns from the business's data only. Anonymous patterns may be shared cross-business (Constitution Article 13).
7. **The system learns continuously.** There is no "training phase" (Constitution Article 11).

---

## Part 10 — Communication Architecture

### 10.1 How the System Speaks

Communication is the system's voice. Everything the Owner experiences is shaped by this architecture. The system does not speak — it communicates. Communication implies purpose, structure, and audience awareness.

The communication process:

1. **Determine if communication is necessary.** Should we speak or remain silent?
2. **Determine priority.** Is this urgent, important, routine, or informational?
3. **Select narrative structure.** What story needs to be told?
4. **Compose the message.** Situation → Evidence → Cause → Implication → Recommendation.
5. **Set the tone.** Alert, Concerned, Neutral, Positive, or Celebratory (NarrativeTone).
6. **Express confidence.** How certain are we? (Shapes language.)
7. **Deliver.** Present to the Owner at the right time, through the right surface.

### 10.2 Silence

Silence is the default communication state. The system is silent unless it has something to say that is more important than the Owner's current attention.

| When to Be Silent | Rationale |
|-------------------|-----------|
| Everything is within expected parameters | No news is good news (Constitution Article 7) |
| The system is learning, not concluding | Low Business Pulse → focus on data collection (Business Intelligence Fabric Section 16) |
| The message would not change Owner behavior | Communication without action value is noise |
| The timing is wrong | Respect behavioral rhythm (Cognitive Behavioral System Section 23) |
| The system is uncertain | Do not communicate false certainty (Constitution Article 3) |

| When to Speak | Rationale |
|---------------|-----------|
| Critical threshold reached | Immediate action required |
| Significant change detected | Owner needs context |
| High-confidence recommendation available | Owner may benefit from acting |
| Daily Brief time | Regular communication rhythm |
| The system identified a gap in its understanding | Owner may have the missing information (Constitution Article 29) |
| The system made a mistake | Transparency builds trust (Constitution Article 14) |

### 10.3 Interruption

Interruption is the most intrusive form of communication. It must be justified.

| Interruption Type | Justification | Behavior |
|-------------------|---------------|----------|
| **Critical** | Immediate action required to prevent significant harm or capture significant opportunity | Full attention demanded. Clear, concise message with recommended action. |
| **Important** | Action required soon (within hours/days) | Marked as urgent. Owner notified at next interaction. |
| **Routine** | Information the Owner should have but not time-sensitive | Included in next Daily Brief. No interruption. |
| **Background** | Good to know but no action required | Archived. Surface only if context becomes relevant. |

### 10.4 Urgency and Communication

Urgency shapes every aspect of communication. The higher the urgency, the shorter and more directive the message.

| Urgency Level | Message Length | Tone | Detail | Confidence Expression |
|---------------|----------------|------|--------|----------------------|
| **Immediate** | 1-2 sentences | Direct, calm | Action only | "We are confident" or "We have detected" |
| **Today** | 3-5 sentences | Clear, structured | Recommendation + key evidence | "We recommend" or "We believe" |
| **This Week** | Paragraph | Explanatory | Full narrative with alternatives | "Our assessment" or "Current signals suggest" |
| **This Month** | Multi-paragraph | Contextual | Complete analysis | "We are monitoring" or "Early patterns indicate" |
| **No Urgency** | N/A (silence or Daily Brief inclusion) | N/A | N/A | N/A |

### 10.5 Confidence and Language

Confidence shapes language directly. The system's certainty is expressed through the words it chooses, not through numerical confidence scores (Business Intelligence Fabric Section 8).

| Confidence Level | Linguistic Expression | Example |
|-----------------|-----------------------|---------|
| **Very High** | Definitive statements | "Lunch covers declined 18% last week." |
| **High** | Qualified statements | "We are confident that the decline is linked to the new competitor opening on Main Street." |
| **Medium** | Belief statements | "We believe prices may need adjustment within the next month." |
| **Low** | Tentative statements | "Early signs suggest a potential shift in customer preference." |
| **Insufficient** | Gap statements | "We do not have enough data to assess this trend. We need 2 more weeks of observations." |

Confidence is never expressed as a number to the Owner. The system does not say "Confidence: 87%." It says "We are confident." This implements the Cognitive Behavioral System's principle that humans calibrate trust in information sources through natural language, not numbers.

### 10.6 Explanation Generation

Every recommendation includes an explanation. The explanation structure (from the Intelligence Loop Stage 4):

```
Situation: What happened or what changed?
    ↓
Evidence: How do we know this? (traceable to observations)
    ↓
Cause: Why did this happen? (reasoning strategy named)
    ↓
Implication: What does this mean for the business?
    ↓
Recommendation: What do we suggest? (with alternatives)
    ↓
Trade-offs: What are the costs and benefits of each option?
    ↓
Risk: What could go wrong?
    ↓
Confidence: How certain are we?
```

Each component is in plain language. The Owner should never have to interpret numbers to understand the reasoning.

### 10.7 Narrative Composition

A Narrative is a structured story that connects observations to understanding (Ubiquitous Language). Narratives are composed according to:

| Narrative Element | Purpose | Content |
|--------------------|---------|---------|
| **Headline** | One-sentence summary | The most important thing the Owner needs to know |
| **Context** | Background framing | What the Owner needs to understand to interpret the headline |
| **Observation** | What the system saw | The specific fact(s) that triggered this narrative |
| **Pattern** | What it means | How this observation fits (or breaks from) established patterns |
| **Implication** | Why it matters | Business impact — revenue, margin, covers, customer satisfaction |
| **Recommendation** | What to do | Suggested action with alternatives |
| **Next Step** | Immediate action | What the Owner should do right now (may be "nothing — just aware") |
| **Expiration** | When this narrative expires | The narrative is ephemeral (Domain Model) |

### 10.8 Communication Principles

1. **Meaning before metrics.** Words before numbers (Product Principle 1).
2. **One message per communication.** Every communication answers exactly one question (Cognitive Behavioral System Section 7).
3. **Silence is valid.** The system does not need to justify silence.
4. **Confidence is in language, not numbers.** The Owner never sees "Confidence: 87%" (Business Intelligence Fabric Section 8).
5. **Explain before recommend.** The Owner trusts reasoning they can follow (Product Principle 7).
6. **Tone matches situation.** The system does not communicate urgency when the situation is calm.
7. **Every communication has an expiration.** Stale information is not communicated (Domain Model Invariant 24).
8. **Freshness is communicated.** The Owner knows how recently information was updated.

---

## Part 11 — Cognitive Invariants

These are permanent truths that govern cognition. Violation of any invariant constitutes a cognitive failure and triggers the Recovery state.

### 11.1 Perception Invariants (1–5)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 1 | The system never invents observations. Every observation traces to a perceived stimulus. | Hallucination. The system reports something that did not happen. |
| 2 | The system never ignores a stimulus without evaluation. Every stimulus passes through Attention. | Stimulus blindness. Something important may be missed. |
| 3 | Perception is continuous. The system is always sensing while in MONITORING state or higher. | Cognitive gap. The system may miss events during perceived downtime. |
| 4 | Stimuli are not filtered at Perception. Filtering occurs at Attention. All stimuli are equal before Perception. | Presumptive filtering. The system may dismiss a stimulus before evaluating its importance. |
| 5 | Sources of Truth are equal citizens at the Perception layer. No source is inherently more valuable. | Source bias. The system may privilege one source over another without justification. |

### 11.2 Attention Invariants (6–10)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 6 | Attention is the scarcest cognitive resource. Every claim on attention must be justified. | Attention inflation. The system treats everything as important, making nothing important. |
| 7 | Silence is a valid attention state. The system does not need to attend to something at all times. | Forced attention. The system manufactures attention targets, producing noise. |
| 8 | The system does not attend to noise. Evaluated noise is dismissed with a record. | Cognitive waste. The system processes non-information. |
| 9 | Attention priority is learned, not configured. The system evolves what it attends to based on outcomes. | Static attention. The system cannot adapt to changing business conditions. |
| 10 | Attention can be interrupted only by higher-priority stimuli. Lower-priority processing is preserved. | Cognitive thrashing. The system abandons valuable processing for less valuable stimuli. |

### 11.3 Understanding Invariants (11–16)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 11 | Every understanding carries a confidence assessment. The system never presents understanding without indicating certainty. | False certainty. The Owner may trust an uncertain conclusion. |
| 12 | Context determines meaning. No observation is understood without context. | Misattribution. The system assigns wrong meaning to correct observation. |
| 13 | Contradictions are not errors. They signal incomplete understanding. | Contradiction blindness. The system ignores evidence that does not fit. |
| 14 | Understanding is provisional until validated. The system does not treat unvalidated understanding as knowledge. | Premature knowledge. The system acts on unconfirmed patterns. |
| 15 | The system is aware of its own gaps. Missing information is explicitly identified, not ignored. | Gap blindness. The system proceeds without knowing what it does not know. |
| 16 | The system never pretends to understand. If understanding is impossible, the system reports this explicitly. | False understanding. The system fabricates meaning from noise. |

### 11.4 Memory Invariants (17–23)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 17 | Memory is never silently overwritten. Contradictory information creates a contradiction record. | Memory pollution. Old knowledge is replaced without trace. |
| 18 | Historical Memory is immutable. Nothing in Historical Memory is ever deleted or modified. | History rewriting. The system loses its audit trail. |
| 19 | Observations are immutable. Once recorded, an observation cannot be changed. | Observation revision. The system corrupts its evidence base. |
| 20 | Memory is relational. Nothing is stored without connections to existing knowledge. | Memory fragmentation. Facts exist in isolation, cannot be retrieved contextually. |
| 21 | Memory without reinforcement decays. Unreinforced memories lose confidence over time. | Stale knowledge. The system acts on outdated understanding. |
| 22 | Knowledge must be earned. Unvalidated information is not promoted to Long-Term Memory. | False knowledge. The system acts on unverified beliefs. |
| 23 | Semantic Memory is constitutional. It changes only through ADR approval. | Conceptual drift. The system's understanding of the domain degrades. |

### 11.5 Reasoning Invariants (24–30)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 24 | Reasoning is always explainable. The path from premises to conclusion must be traceable. | Black box. The Owner cannot verify the system's reasoning. |
| 25 | The system names its reasoning strategy. The Owner knows whether a conclusion is deductive, inductive, or abductive. | Reasoning opacity. The Owner cannot calibrate trust based on reasoning type. |
| 26 | The system does not reason without sufficient information. It reports what is needed instead. | False reasoning. The system reaches conclusions from insufficient evidence. |
| 27 | Correlation is not causation. The system does not present correlational findings as causal. | Causal overreach. The system recommends actions based on non-causal relationships. |
| 28 | Reasoning deadlock is acceptable. If no conclusion can be reached, the system reports this. | False resolution. The system forces a conclusion when none is warranted. |
| 29 | Multiple reasoning strategies reduce risk. When confidence is low, the system uses multiple strategies. | Strategy fixation. The system applies one reasoning approach to all problems. |
| 30 | The system does not confirm its own beliefs. It actively seeks disconfirming evidence. | Confirmation bias. The system reinforces existing beliefs, ignores contradictory evidence. |

### 11.6 Decision Invariants (31–36)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 31 | The system recommends; the Owner decides. The system never overrides or pre-empts the Owner. | Autonomy violation. The system acts without Owner approval. |
| 32 | Every recommendation must trace to evidence. No evidence → no recommendation. | Baseless recommendation. The system erodes trust. |
| 33 | Every recommendation includes at least one alternative. The Owner must have a choice. | False binary. The Owner is offered only one option. |
| 34 | Every recommendation includes confidence. The Owner must calibrate trust. | Blind trust. The Owner cannot judge recommendation reliability. |
| 35 | Every recommendation includes risk. The Owner must understand what could go wrong. | Risk blindness. The Owner makes decisions without understanding downside. |
| 36 | Every recommendation expires. Recommendations not acted upon are withdrawn. | Ghost recommendations. The Owner acts on stale information. |

### 11.7 Communication Invariants (37–42)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 37 | Silence is meaningful. The absence of communication communicates "everything is fine." | Noise inflation. The system manufactures communications to prove activity. |
| 38 | Confidence shapes language, not numbers. The Owner never sees numerical confidence scores. | False precision. The Owner misinterprets numerical confidence as exact. |
| 39 | Meaning before metrics. Words frame numbers, not the reverse. | Data dumping. The Owner must interpret raw information. |
| 40 | One message per communication. Every communication answers exactly one question. | Information overload. The Owner cannot identify the primary message. |
| 41 | Explain before recommend. Reasoning is presented before the recommendation. | Trust deficit. The Owner cannot verify the recommendation's foundation. |
| 42 | Freshness is communicated. The Owner knows how recently information was updated. | Temporal ambiguity. The Owner does not know if information is current. |

### 11.8 Learning Invariants (43–46)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 43 | Every outcome is a learning opportunity. The system does not waste outcomes. | Learning waste. Experience does not improve the system. |
| 44 | Learning requires validation. Unvalidated patterns remain hypotheses. | False knowledge. The system acts on unverified patterns. |
| 45 | Learning never rewrites history. Knowledge evolves; history is preserved. | History denial. The system loses its learning path. |
| 46 | Failure is the richest learning signal. The system does not hide or ignore failures. | Learning blindness. The system fails to extract value from mistakes. |

### 11.9 System Invariants (47–52)

| # | Invariant | Violation Consequence |
|---|-----------|----------------------|
| 47 | The system never stops learning. There is no "training complete" state. | Stagnation. The system becomes obsolete as the business evolves. |
| 48 | The system does not guess. It reports "I do not know" rather than fabricate. | Hallucination. The system presents fabricated information. |
| 49 | The system admits mistakes. When wrong, it explains what happened and what changed. | Trust erosion. The Owner cannot rely on the system's honesty. |
| 50 | The system is honest about uncertainty. It communicates what it knows, does not know, and is doing about it. | False certainty. The Owner proceeds with unfounded confidence. |
| 51 | Every cognitive cycle must improve at least one capability. If no improvement, the cycle was incomplete. | Cognitive stagnation. The system cycles without growing. |
| 52 | The cognitive architecture is constitutional. No engine may violate it without ADR ratification. | Architecture erosion. The system's cognitive integrity degrades over time. |

---

## Part 12 — Cognitive Failure Modes

### 12.1 Hallucination

| Property | Definition |
|----------|-----------|
| **Cause** | The system reports an Observation that did not occur. Failed Perception (missing stimulus) + failed Understanding (false pattern recognition) + failed Reasoning (confirmation without evidence). |
| **Detection** | Inconsistent with other Observations. Contradicts Historical Memory. Cannot be traced to a Source of Truth. Differs from what the Owner knows to be true. |
| **Mitigation** | Every Observation must trace to a verified Source of Truth. Confidence is never assigned without evidence. Cross-source validation. Semantic Memory constraints (observations cannot violate domain invariants). |
| **Recovery** | (1) Identify the hallucinated Observation. (2) Flag it in Historical Memory (never delete). (3) Trace the reasoning path that produced the hallucination. (4) Update the cognitive parameters that allowed it. (5) Communicate transparently to the Owner. |

### 12.2 False Certainty

| Property | Definition |
|----------|-----------|
| **Cause** | Confidence exceeds what evidence supports. Overconfidence in Understanding or Reasoning. Insufficient weight on uncertainty. |
| **Detection** | Prediction accuracy falls below confidence level. Repeated mismatches between expected confidence and actual accuracy. |
| **Mitigation** | Confidence calibration tracking. Comparison of expressed confidence vs. actual accuracy. Requirement for disconfirming evidence search. |
| **Recovery** | (1) Audit recent predictions. (2) Compare expressed confidence levels to actual accuracy. (3) Adjust confidence parameters at the Evolution Layer. (4) Communicate recalibration to the Owner if trust may be affected. |

### 12.3 Attention Collapse

| Property | Definition |
|----------|-----------|
| **Cause** | Too many stimuli simultaneously demand high attention. System overwhelmed. Priority evaluation degrades under load. |
| **Detection** | Attention queue exceeds capacity. Processing time per stimulus increases. Lower-priority stimuli starved or dropped. |
| **Mitigation** | Capacity limits on concurrent cognitive loops. Strict priority ordering. Noise threshold elevation under load. |
| **Recovery** | (1) Halt lowest-priority loops. (2) Preserve their state in Short-Term Memory. (3) Process highest-priority stimuli first. (4) Resume halted loops in priority order. (5) Communicate any missed events to the Owner. |

### 12.4 Memory Pollution

| Property | Definition |
|----------|-----------|
| **Cause** | Incorrect or misleading data stored in memory. False Observations, invalid patterns, or contaminated knowledge. |
| **Detection** | Memory contents contradict newer, higher-confidence Observations. Pattern predictions consistently fail. Multiple contradictions cluster around a memory artifact. |
| **Mitigation** | Immutable Observations (cannot be polluted once recorded). Contradiction records for conflicting information. Confidence decay for unreinforced knowledge. |
| **Recovery** | (1) Identify the polluted memory. (2) Create a contradiction record. (3) Reduce its confidence. (4) Remove any decisions dependent on it. (5) If the pollution affected Owner communications, inform the Owner. |

### 12.5 Feedback Loops

| Property | Definition |
|----------|-----------|
| **Cause** | System's output influences future input in a self-reinforcing cycle. A recommendation changes Owner behavior, which generates new observations that reinforce the original recommendation. |
| **Detection** | Sustained deviation from expected patterns. Self-reinforcing cycles where the system's own outputs appear as confirming evidence. |
| **Mitigation** | Awareness of system-induced changes. Tracking whether observations are independent of system recommendations. Causal reasoning distinguishes system influence from external factors. |
| **Recovery** | (1) Identify the feedback loop. (2) Disentangle system influence from external factors. (3) Adjust reasoning to account for self-influence. (4) If the loop produced incorrect knowledge, deprecate and inform the Owner. |

### 12.6 Confirmation Bias

| Property | Definition |
|----------|-----------|
| **Cause** | System preferentially accepts evidence that confirms existing beliefs and discounts contradictory evidence. |
| **Detection** | Contradictory evidence is systematically down-weighted. Confidence in existing knowledge does not decrease when predictions fail. |
| **Mitigation** | Active disconfirming evidence search required. Invariant 30 (The system does not confirm its own beliefs). Contradiction record requirement for all evidence evaluation. |
| **Recovery** | (1) Audit recent evidence evaluations. (2) Identify patterns of preferential treatment. (3) Re-evaluate contradictory evidence without existing belief influence. (4) Update affected knowledge. |

### 12.7 Noise Amplification

| Property | Definition |
|----------|-----------|
| **Cause** | Random fluctuations are treated as signals. Noise is processed through the cognitive loop and treated as meaningful. |
| **Detection** | Attention assigned to statistically insignificant stimuli. Patterns detected in random variation. Recommendations based on noise. |
| **Mitigation** | Statistical significance thresholds. Temporal consistency requirements. Multiple observation requirements before pattern detection. |
| **Recovery** | (1) Identify noise that was processed. (2) Remove from active memory (retain in Historical). (3) Adjust Attention noise thresholds. (4) If noise reached the Owner, communicate the correction. |

### 12.8 Overreaction

| Property | Definition |
|----------|-----------|
| **Cause** | System assigns disproportionate weight to a stimulus. Attention priority, confidence impact, or behavioral change exceeds what the situation justifies. |
| **Detection** | Behavioral change magnitude exceeds outcome significance. Multiple overreactions in similar situations suggest pattern. |
| **Mitigation** | Proportional response principle. Impact assessment before action. Temporal delay before significant adaptations. |
| **Recovery** | (1) Assess the overreaction's effects. (2) Reverse if possible. (3) Adjust impact weighting parameters. (4) Communicate to the Owner if business effects occurred. |

### 12.9 Underreaction

| Property | Definition |
|----------|-----------|
| **Cause** | System assigns insufficient weight to a significant stimulus. Attention dismissal, low confidence assignment, or slow response to a genuinely important event. |
| **Detection** | Owner notices something the system did not surface. Outcome significance was higher than system estimated. |
| **Mitigation** | Sensitivity analysis for borderline attention decisions. Temporal monitoring — if a borderline stimulus persists, re-evaluate. |
| **Recovery** | (1) Evaluate why the stimulus was under-weighted. (2) Update attention parameters if systemic. (3) Communicate awareness to the Owner. |

### 12.10 Knowledge Drift

| Property | Definition |
|----------|-----------|
| **Cause** | Knowledge gradually becomes obsolete as the business evolves. Contradictions accumulate until knowledge no longer reflects reality. |
| **Detection** | Gradual decline in prediction accuracy. Increasing contradiction count. Owner behavior changes that contradict stored patterns. |
| **Mitigation** | Confidence decay for unreinforced knowledge. Periodic knowledge audit. Active contradiction monitoring. |
| **Recovery** | (1) Identify drifted knowledge. (2) Compare against recent observations. (3) Deprecate or update. (4) Document the drift pattern to improve detection. |

### 12.11 Reasoning Deadlock

| Property | Definition |
|----------|-----------|
| **Cause** | System cannot reach a conclusion. Available information is insufficient, contradictory, or incompatible with applicable reasoning strategies. |
| **Detection** | Reasoning stage cannot produce output. Multiple reasoning strategies exhausted without convergence. Wait state triggered. |
| **Mitigation** | Explicit deadlock recognition (not forced resolution). Gap analysis to identify what is missing. Strategy diversity (if one strategy deadlocks, try another). |
| **Recovery** | (1) Document the deadlock: what was being reasoned, what was available, what was missing. (2) If data is missing, request it. (3) If reasoning strategy is inappropriate, select an alternative. (4) If deadlock persists, communicate to the Owner: what is needed, why, and when it might be available. |

### 12.12 Catastrophic Cascade

| Property | Definition |
|----------|-----------|
| **Cause** | Multiple failures compound. A Perception failure leads to a flawed Observation, which produces incorrect Understanding, which contaminates Memory, which distorts Reasoning, which generates a bad Recommendation, which produces poor outcomes. |
| **Detection** | System-wide prediction accuracy decline. Multiple cognitive failure modes detected simultaneously. Contradictions cluster. |
| **Mitigation** | Each stage validates its input from previous stage. Cross-stage consistency checks. Confidence cascades (if input confidence is low, output confidence is even lower). |
| **Recovery** | (1) Halt all cognitive processing. (2) Enter RECOVERY state. (3) Audit the cascade path: identify the originating failure. (4) Contain contaminated memory. (5) Re-process affected stimuli from the point of failure. (6) Communicate the event to the Owner transparently. |

---

## Part 13 — Future Cognitive Evolution

### 13.1 Evolution Philosophy

The cognitive architecture is designed to evolve. It is not finished. The following extension points are reserved for future capabilities. They do not require architecture changes — they are anticipated extensions within the current framework.

Each extension point identifies:
- **What** it would enable
- **Where** it fits in the current architecture
- **What constraints** it must respect
- **What must remain unchanged**

### 13.2 Collective Intelligence

| Property | Definition |
|----------|-----------|
| **What** | Multiple Restaurant OS instances sharing anonymous learning patterns across businesses without exposing private data. |
| **Architecture Fit** | Learning Layer (cross-instance pattern validation). Evolution Layer (meta-learning from collective). |
| **Constraints** | Constitution Article 13 (private data never leaves the business). Patterns only, never data. |
| **Unchanged** | Each instance's cognition is independent. Collective intelligence is advisory, not authoritative. Individual businesses may opt out. |

### 13.3 Multiple Businesses (Single Instance)

| Property | Definition |
|----------|-----------|
| **What** | An Owner with multiple restaurants gains consolidated cognition — cross-location patterns, comparative health, resource optimization. |
| **Architecture Fit** | Business Layer (multi-entity awareness). Business Memory (per-entity knowledge with cross-entity patterns). |
| **Constraints** | Each business retains its own Memory and Learning. Cross-business patterns are at the Owner level, not the entity level. |
| **Unchanged** | Single-business cognition is unchanged. Multi-business is an extension, not a replacement. |

### 13.4 Multi-Agent Reasoning

| Property | Definition |
|----------|-----------|
| **What** | Multiple cognitive agents within a single instance collaborate on complex problems — one agent observes, another reasons about causal structure, a third evaluates alternatives. |
| **Architecture Fit** | Reasoning Layer (agent specialization). Communication Layer (inter-agent communication). |
| **Constraints** | Agents share Memory and Learning. No agent has privileged access. All agent outputs merge through the standard Decision Layer. |
| **Unchanged** | The Cognitive Loop remains the same. The Owner sees one unified output. Multi-agent is an internal optimization. |

### 13.5 Simulation

| Property | Definition |
|----------|-----------|
| **What** | The system runs counterfactual simulations in a "cognitive sandbox" — testing multiple decision options against the business model before recommending. |
| **Architecture Fit** | Reasoning Layer (counterfactual reasoning at scale). Decision Layer (simulation-based alternative evaluation). |
| **Constraints** | Simulations are hypothetical. Their outputs carry lower confidence than observation-based conclusions. Simulations are clearly labeled as such. |
| **Unchanged** | Observations remain the foundation. Simulations supplement, not replace, empirical cognition. |

### 13.6 Strategic Planning

| Property | Definition |
|----------|-----------|
| **What** | Multi-step reasoning about long-term business strategy. Not just "what to do today" but "what sequence of decisions over 6-12 months leads to optimal outcomes." |
| **Architecture Fit** | Reasoning Layer (temporal reasoning extended to long horizons). Decision Layer (multi-step decision sequences). |
| **Constraints** | Strategic confidence decays with horizon. Long-term predictions are qualified, not definitive. Strategy is always revisable. |
| **Unchanged** | Daily operations cognition remains independent. Strategic cognition is a parallel loop with longer cycle time. |

### 13.7 Long-Term Forecasting

| Property | Definition |
|----------|-----------|
| **What** | Probabilistic forecasting over quarters and years, not just weeks and months. |
| **Architecture Fit** | Reasoning Layer (temporal + probabilistic reasoning at extended horizons). |
| **Constraints** | Uncertainty increases with horizon. Forecasts are ranges, not points. Confidence is always expressed as a function of horizon. |
| **Unchanged** | Short-term prediction (days/weeks) maintains higher confidence and priority. |

### 13.8 Autonomous Experimentation

| Property | Definition |
|----------|-----------|
| **What** | The system proposes experiments, monitors their execution, and extracts learning — all autonomously, without requiring the Owner to design experiments manually. |
| **Architecture Fit** | Decision Layer (experiment design). Learning Layer (experiment outcome extraction). |
| **Constraints** | Experiments are proposed, never executed without Owner approval (Constitution Article 10). Experiment scope is bounded by risk tolerance. |
| **Unchanged** | The Owner always decides. The system never acts autonomously on the business. |

### 13.9 Natural Conversation

| Property | Definition |
|----------|-----------|
| **What** | The Owner can ask questions in natural language and receive natural language responses. The system can ask clarifying questions, offer unsolicited observations, and engage in dialogue. |
| **Architecture Fit** | Communication Layer (natural language composition). Understanding Layer (natural language understanding). |
| **Constraints** | Conversation is an interface, not a new cognitive capability. The same Cognitive Loop operates behind every conversational response. |
| **Unchanged** | Cognition is not changed by the addition of a natural language interface. The system thinks the same way; it speaks differently. |

### 13.10 Self-Improvement

| Property | Definition |
|----------|-----------|
| **What** | The system evolves its own cognitive parameters — adjusting attention weights, reasoning strategy selection, confidence thresholds — based on meta-learning. |
| **Architecture Fit** | Evolution Layer (self-modification within constitutional bounds). |
| **Constraints** | Self-improvement operates within constitutional invariants. The cognitive architecture itself is not self-modifiable without ADR. |
| **Unchanged** | The cognitive architecture (this document) is constitutional. Self-improvement changes parameters, not structure. |

### 13.11 Continuous Optimization

| Property | Definition |
|----------|-----------|
| **What** | The system continuously optimizes its own cognitive efficiency — reducing redundant processing, improving memory retrieval speed, refining attention precision — without changing what cognition produces. |
| **Architecture Fit** | All layers (optimization is cross-cutting). Evolution Layer (meta-optimization). |
| **Constraints** | Optimization never reduces quality. Optimization is always explainable. Optimizations that change output require validation. |
| **Unchanged** | The cognitive output (what the system understands, recommends, and communicates) is invariant under optimization. |

### 13.12 Consciousness-Level Extensions (Far Future)

| Property | Definition |
|----------|-----------|
| **What** | Potential future capabilities that are not currently modeled: self-awareness, theory of mind, creativity, meta-cognitive reflection, intuitive reasoning. |
| **Architecture Fit** | These would require architectural evolution, not extension. |
| **Constraints** | Any extension must maintain consistency with all constitutional documents. |
| **Unchanged** | The current architecture is complete for the current scope. Extensions are future research. |

---

## APPENDIX A — Consistency Verification

### A.1 Source Document Alignment

| Document | Key Concepts | Architecture Alignment |
|----------|-------------|----------------------|
| **Constitution** (35 Articles) | Trust, Knowledge Earned, Confidence Before Speed, Silence, Meaning Before Metrics, Learning, Privacy, Mistakes, Uncertainty, Calm, Cognitive Load, One Decision, Health, Knowledge Ages, Curiosity, Context, Confidence Is Product | ✓ Fully aligned. Invariants 1–52 enforce constitutional principles directly. Part 1 (Cognitive Philosophy) derives from Preamble and Articles 2–7, 9–11, 14–15, 17–19, 24, 28–30, 34. |
| **Product Principles** (25 Principles) | Meaning Before Metrics, Trust Before Complexity, One Primary Decision, Calm Over Noise, Explain Before Recommend, Living System, Silence Is Signal | ✓ All principles are embedded: Meaning Before Metrics (Part 10.8), Explain Before Recommend (Part 10.8), One Primary Decision (Part 10.8), Calm (Part 5.5), Silence (Part 10.2). |
| **Cognitive Behavioral System** (30 Sections) | Cognitive Load, Attention Economy, Confidence, Trust, Decision Fatigue, Recognition vs Recall, One Question, Three Second Rule, Zero Learning, Calm Technology, Explainability, Memory Formation, Curiosity, Silence, Decision Debt, Behavioral Rhythm, Confidence Index | ✓ All 30 sections inform the architecture. Cognitive Load → Working Memory (Part 6). Attention Economy → Part 5. Confidence → Part 8.4. Decision Fatigue → Part 5.7. Silence → Part 10.2. Behavioral Rhythm → Part 10.4. |
| **Business Intelligence Fabric** (10 Parts) | Sources of Truth, Trust, Confidence, Completeness/Freshness/Consistency, Uncertainty, Observation, Correlation/Context, Memory/Experience, Owner Feedback, Business Pulse | ✓ Business Pulse modulates attention (Part 5.8) and communication (Part 10.4). Sources of Truth inform Perception (Part 3). Confidence shapes language (Part 10.5). |
| **Business Ontology** (31 Concepts) | All 31 concepts with definitions and relationships | ✓ Every concept appears in the architecture. Observation (Part 2.2 Stage 3), Knowledge (Part 9.4), Learning (Part 9), Memory (Part 6), Business Pulse (Parts 5.8, 10.4), etc. |
| **Blueprint 001** (7 Stages) | Observe, Understand, Remember, Explain, Recommend, Learn, Improve | ✓ The 11-stage Cognitive Loop (Part 2) is an extension of the 7-stage Intelligence Loop. Every Blueprint stage maps to one or more Cognitive Loop stages. |
| **Domain Model** (15 Parts) | Aggregates, Invariants, Services, Events | ✓ Domain services map to cognitive functions (Pulse Monitor → Part 2.2 Stage 1, Pattern Detection → Part 7.2, Narrative Composition → Part 10.7). Domain invariants are enforced in Part 11. |
| **Execution Protocol** (14 Steps, 43 Laws) | All laws including architecture respect | ✓ LAW_001 (Documentation First), LAW_031 (Structure Is Architecture), LAW_032 (Centralized Discovery) are respected. |

### A.2 Intelligence Loop Mapping

| Blueprint Stage | Cognitive Loop Stage(s) | Notes |
|----------------|------------------------|-------|
| OBSERVE | PERCEPTION + ATTENTION + OBSERVATION | Blueprint's OBSERVE is expanded into three stages for finer cognitive granularity |
| UNDERSTAND | UNDERSTANDING | Direct mapping |
| REMEMBER | MEMORY | Direct mapping |
| EXPLAIN | REASONING + EXPLAINING | Blueprint's EXPLAIN is split: REASONING forms conclusions, EXPLAINING prepares communication |
| RECOMMEND | DECISION | Blueprint's RECOMMEND maps to DECISION stage |
| LEARN | LEARNING + REFLECTING + ADAPTING | Blueprint's LEARN is expanded into three stages |
| IMPROVE | ADAPTATION | Blueprint's IMPROVE maps to ADAPTATION |

The 11-stage loop does not replace the 7-stage loop. It decomposes it for finer cognitive control while maintaining full backward compatibility.

### A.3 Ubiquitous Language Compliance

| Architecture Term | Ubiquitous Language Definition | Status |
|-------------------|-------------------------------|--------|
| Observation | Verified fact about the business | ✓ Consistent |
| Signal | Observation indicating potential pattern | ✓ Consistent |
| Pattern | Recurring relationship between observations | ✓ Consistent |
| Knowledge | Verified understanding earned through observation | ✓ Consistent |
| Learning | Process of acquiring new Knowledge | ✓ Consistent |
| Memory | Stored history of Observations, Patterns, Learning | ✓ Consistent |
| Narrative | Structured story communicating understanding | ✓ Consistent |
| Recommendation | Suggested action with reasoning and confidence | ✓ Consistent |
| Confidence | System's expressed certainty in its own output | ✓ Consistent |
| Evidence | Specific Observations supporting a claim | ✓ Consistent |
| Business Pulse | Continuous assessment of vital state | ✓ Consistent |
| Silence | Deliberate absence of communication | ✓ Consistent |
| Freshness | Indicator of recency of data | ✓ Consistent |

### A.4 Invariant Reconciliation

All 29 Business Invariants from the Domain Model (Part 11) are enforced in the Cognitive Architecture's invariants (Part 11):

| Domain Invariant | Cognitive Invariant(s) |
|-----------------|----------------------|
| #13 Recommendation must cite evidence | #32 (Part 11.6) |
| #14 Observation is immutable | #19 (Part 11.4) |
| #18 Confidence communicated with predictions | #33 (Part 11.6) |
| #24 Narratives are ephemeral | #36 (Part 11.6) |
| #25 Recommendations expire | #36 (Part 11.6) |
| #26 Observation → Pattern → Knowledge directed acyclic | #22 (Part 11.4) |
| #28 Evidence references Observation | #32 (Part 11.6) |
| #29 Confidence is function of evidence | Implicit in Part 8.4 |

### A.5 Cognitive Architecture Completeness

| Requirement | Status |
|-------------|--------|
| Part 1 — Cognitive Philosophy | ✓ Complete |
| Part 2 — Cognitive Loop (11 stages) | ✓ Complete |
| Part 3 — Cognitive Layers (8) | ✓ Complete |
| Part 4 — Cognitive States (11) | ✓ Complete |
| Part 5 — Attention Model | ✓ Complete |
| Part 6 — Memory Architecture (9 systems) | ✓ Complete |
| Part 7 — Reasoning Architecture (8 strategies) | ✓ Complete |
| Part 8 — Decision Architecture | ✓ Complete |
| Part 9 — Learning Architecture | ✓ Complete |
| Part 10 — Communication Architecture | ✓ Complete |
| Part 11 — Cognitive Invariants (52) | ✓ Complete (exceeds 40 minimum) |
| Part 12 — Cognitive Failure Modes (12) | ✓ Complete |
| Part 13 — Future Cognitive Evolution (12 extensions) | ✓ Complete |
| Technology-agnostic (no implementation terms) | ✓ Clean |
| Consistent with all source documents | ✓ Verified (Appendix A) |

---

*End of Cognitive Architecture — Version 1.0*
