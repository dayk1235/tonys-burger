# Restaurant OS — Capability Map

## The Permanent Structure of Product Intelligence

---

## Preamble

Restaurant OS is not a collection of features. It is a system of capabilities.

A feature is temporary. A capability is permanent.

Features change with technology, with trends, with customer expectations, with every new device that reaches the market. Capabilities endure. A capability defines what the product can do at the conceptual level — not how it does it, not where it does it, not which technology enables it. The capability outlives every implementation.

This document defines the permanent capability structure of Restaurant OS.

Every future feature — every screen, every notification, every recommendation, every automation — must belong to exactly one capability. If a proposed feature cannot be assigned to a capability, it should not exist. If a feature belongs to multiple capabilities, the boundaries between capabilities are not yet clear enough.

This document has one purpose: **ensure that Restaurant OS remains coherent as it grows from zero to thousands of businesses.**

It is not for engineers. It is for anyone who needs to understand what Restaurant OS is — an owner, an investor, an employee, a partner, a future product manager. A new employee must understand Restaurant OS from this document in under one hour.

---

## SECTION 1 — What Is a Capability

### 1.1 Definition

A **capability** is a permanent conceptual ability of the product to understand, decide, communicate, or act on a specific domain of business intelligence.

Capabilities are:
- **Permanent.** They will not be removed. They may evolve, mature, or be absorbed, but a capability that existed at v1 will still exist at v100.
- **Conceptual.** They are defined by what they do, not by how they are implemented.
- **Independent.** Each capability has a clear boundary. No two capabilities overlap.
- **Composable.** Capabilities combine to produce outcomes greater than any single capability.
- **Measurable.** Every capability has a maturity level, and that level can be assessed.

### 1.2 Capability vs. Feature vs. Module vs. Knowledge vs. Decision vs. Outcome

| Concept | Definition | Duration | Example |
| :--- | :--- | :--- | :--- |
| **Capability** | A permanent conceptual ability | Permanent | Decision Intelligence |
| **Feature** | A specific implementation of a capability | Temporary | "Suggest menu price changes" |
| **Module** | A code-level grouping of implementation | Semi-permanent | `src/features/dashboard/` |
| **Knowledge** | A structured understanding about a domain | Growing | "Tuesday afternoons are slow" |
| **Decision** | A choice the owner makes using the product | Momentary | "Should I run a lunch special?" |
| **Outcome** | A business result from acting on a decision | Measurable | 15% increase in afternoon sales |

A capability is NOT a feature. A capability is the conceptual reason why a feature exists.

A capability is NOT a module. A module is a code organization. Capabilities may span multiple modules, or one module may serve multiple capabilities — but the capability map is independent of the codebase.

A capability is NOT knowledge. Knowledge is what the platform has learned. A capability is the ability to learn, store, or use that knowledge.

A capability is NOT a decision. Decisions are moments. Capabilities are the system that enables those moments.

A capability is NOT an outcome. Outcomes are business results. Capabilities enable outcomes but do not guarantee them.

### 1.3 Capability Anatomy

Every capability is defined by the following structure:

**Purpose.** One sentence. Why this capability exists.

**Mission.** One sentence. What this capability aims to achieve at full maturity.

**Problem.** What business problem would exist if this capability did not exist.

**Primary User.** Who benefits most directly from this capability.

**Secondary Users.** Who else benefits.

**Supported Decisions.** The specific business decisions this capability enables.

**Sources of Truth.** The information this capability depends on.

**Knowledge Graph Relationships.** The entities and relationships this capability understands.

**Pulse Influence.** How this capability affects the Business Pulse.

**Narrative Influence.** How this capability affects the Business Narrative.

**World Influence.** How this capability affects the platform's understanding of the external world.

**Future Surface Opportunities.** Where this capability could manifest (App, Watch, Widget, Voice, etc.).

**Success Indicators.** How to know this capability is working.

**Failure Indicators.** How to know this capability is broken.

**Must Never Become.** The anti-pattern that would destroy the capability's value.

---

## SECTION 2 — The Capabilities

---

### 2.1 Business Understanding

**Purpose.** Restaurant OS must know what a business is before it can help that business.

**Mission.** Build and maintain a structured, evolving model of every business — its entities, relationships, rhythms, and identity — that serves as the foundation for all other intelligence.

**Problem.** Without Business Understanding, the platform cannot distinguish a burger from a schedule, a customer from an employee, a trend from a coincidence. Every insight, every recommendation, every decision is built on this foundation. If understanding is incomplete, everything downstream is unreliable.

**Primary User.** The platform itself. This capability serves all other capabilities.

**Secondary Users.** Product managers, data scientists, and the Business Knowledge Graph.

**Supported Decisions.**
- What kind of business is this (restaurant, cafe, bar, bakery)?
- What does this business sell?
- Who works here?
- Who are its customers?
- How does it operate?
- What are its rhythms and patterns?
- What is its identity?

**Sources of Truth.**
- Business registration data
- Menu or product catalog
- POS data
- Staff records
- Operating hours and schedules
- Location and physical configuration
- Owner-provided context and preferences

**Knowledge Graph Relationships.**
- Entity definitions and types
- Entity-to-entity relationships (customer buys product, employee works shift)
- Entity attributes and properties
- Relationship strength and confidence
- Temporal annotations (when did this relationship hold true)

**Pulse Influence.** Foundation. Business Understanding defines what Pulse measures. Without entity definitions, Pulse has nothing to measure.

**Narrative Influence.** Foundation. Narrative requires understanding of entities and relationships to construct stories.

**World Influence.** Foundation. World understanding requires entity definitions for external conditions (weather, holidays, events) that relate to internal entities.

**Future Surface Opportunities.**
- **App.** Business profile and structure visualization
- **Watch.** Quick business summary
- **Widget.** Business snapshot
- **Voice.** "Tell me about my business"
- **Onboarding Wizard.** Guided business definition
- **API.** Structured business data export

**Success Indicators.**
- Every business entity has a complete and current representation in the Knowledge Graph
- New entity types can be added without restructuring existing understanding
- The platform can answer structural questions about any business
- Confidence scores are tracked for every relationship

**Failure Indicators.**
- Entities are missing, duplicated, or inconsistent
- The Knowledge Graph cannot evolve to accommodate new business types
- Confidence scores are never calculated or never used
- Understanding drifts from reality without detection

**Must Never Become.**
- A static database schema that resists evolution
- A configuration burden for the owner (the business should not have to tell the platform what it is — the platform should discover it)
- A tangled model where entity boundaries blur (customer becomes order becomes product)

---

### 2.2 Business Memory

**Purpose.** Restaurant OS must remember what it has learned, when it learned it, and how confident it was.

**Mission.** Maintain a complete, accurate, and queryable history of every business fact, every pattern discovered, and every lesson learned — organized chronologically and relationally.

**Problem.** Without Business Memory, the platform lives in an eternal present. It cannot compare today to yesterday, detect trends over time, or learn from past mistakes. The owner asks "Is this normal?" and the platform cannot answer because it does not remember what normal looks like.

**Primary User.** All capabilities that need historical context.

**Secondary Users.** The owner, for historical review and comparison.

**Supported Decisions.**
- Is this week normal compared to last month?
- Has this pattern happened before?
- What happened the last time we ran this promotion?
- How does this season compare to last year?

**Sources of Truth.**
- Historical POS data
- Historical inventory data
- Historical staffing data
- Historical promotion records
- Historical external data (weather, events)
- Previous platform learnings and their confidence levels

**Knowledge Graph Relationships.**
- Entity state over time (temporal entity versions)
- Event sequences and causality chains
- Pattern definitions and their historical occurrences
- Learning history (what was learned, when, from which data)
- Confidence decay (how confidence changes as data ages)

**Pulse Influence.** Memory provides the historical baseline that Pulse compares against. Without memory, Pulse has no reference point for "normal."

**Narrative Influence.** Narrative requires memory to construct cause-and-effect stories over time.

**World Influence.** Memory stores historical external conditions, enabling the platform to correlate internal and external patterns.

**Future Surface Opportunities.**
- **App.** Historical timelines, comparison views
- **Watch.** "Compared to last week" summaries
- **Widget.** Historical trend sparklines
- **Voice.** "How were we doing this time last year?"
- **Analytics Export.** Complete historical data export

**Success Indicators.**
- The platform can answer any historical question within its data scope
- Temporal queries resolve in predictable time regardless of history depth
- Confidence decay is transparent and queryable
- No data is ever lost (compressed, archived, but never deleted)

**Failure Indicators.**
- Historical data is incomplete or has gaps
- The platform cannot compare current state to historical baselines
- Old data is deleted or overwritten
- Confidence decay is opaque or non-existent

**Must Never Become.**
- A data dump that the platform cannot query effectively
- A deletion-prone storage where old data is sacrificed for performance
- A system that treats all historical data as equally important (context matters)
- A black box — the owner must be able to audit what the platform remembers

---

### 2.3 Decision Intelligence

**Purpose.** Restaurant OS exists to help the owner make better decisions. This is the output capability — the reason every other capability exists.

**Mission.** Surface the right decision at the right time with the right confidence, reducing the owner's uncertainty and increasing their ability to act decisively.

**Problem.** Without Decision Intelligence, the platform is a dashboard — it shows information and expects the owner to interpret it. The owner does not need information. They need decisions. The difference between a dashboard and a copilot is decision intelligence.

**Primary User.** The business owner.

**Secondary Users.** Managers, shift leaders, team members who make operational decisions.

**Supported Decisions.**
- What should I do today to improve my business?
- Should I change my menu prices?
- Should I run a promotion?
- Should I adjust my staff schedule?
- Should I reorder inventory?
- Should I respond to this review?
- What is the single most important thing I should focus on?

**Sources of Truth.**
- All other capabilities — Decision Intelligence consumes their outputs
- Owner feedback and decision outcomes
- Decision history and results

**Knowledge Graph Relationships.**
- Decision entities (every decision surfaced has a record)
- Decision-outcome relationships (did the decision produce the expected result?)
- Decision-decision relationships (how decisions interact)
- Decision confidence (how certain was the platform when it made the recommendation)

**Pulse Influence.** Decisions are the primary output of Pulse analysis. Pulse identifies what needs attention; Decision Intelligence determines what to do about it.

**Narrative Influence.** Decisions create the narrative. "We identified a problem, recommended an action, and here is what happened."

**World Influence.** Decisions may incorporate external conditions ("Don't run an outdoor promotion — it will rain").

**Future Surface Opportunities.**
- **App.** Primary decision surface — the main reason the owner opens the platform
- **Watch.** Quick decisions (approve, dismiss, snooze)
- **Widget.** Single-decision display
- **Voice.** "What should I do today?"
- **Automation.** For decisions with sufficient confidence, automated execution
- **Notification.** Decision push with one-tap action

**Success Indicators.**
- The owner makes better decisions with the platform than without
- Decision confidence correlates with decision outcomes (high-confidence decisions produce better results)
- The owner acts on recommendations more often than not
- The owner reports feeling more confident in their decisions

**Failure Indicators.**
- The owner ignores recommendations
- Recommendations are too frequent (noise)
- Recommendations lack sufficient confidence
- The owner cannot distinguish between high-confidence and low-confidence recommendations
- Decision outcomes are never measured

**Must Never Become.**
- A system that tells the owner what to do without explaining why
- A system that makes decisions the owner should make (the owner is always the decision-maker)
- A notification spammer that overwhelms with recommendations
- A system that does not learn from decision outcomes

---

### 2.4 Team Intelligence

**Purpose.** Restaurant OS must understand the people who run the business — not as costs on a spreadsheet, but as the living system that delivers the product.

**Mission.** Understand every team member's role, rhythm, skills, and contribution to the business, and help the owner build a healthier, more effective team.

**Problem.** Without Team Intelligence, the platform sees employees as line items. It cannot help with the most common restaurant problems — staffing, retention, morale, training, scheduling. The owner's biggest challenges are people challenges, not data challenges.

**Primary User.** The business owner and managers.

**Secondary Users.** Team members (through self-service surfaces).

**Supported Decisions.**
- Is my team adequately staffed for today?
- Who is my best-performing employee?
- Which employees need more training?
- Is my team healthy (low turnover, high morale)?
- Should I adjust my schedule?
- How does my team compare to industry benchmarks?

**Sources of Truth.**
- Schedule and time clock data
- Role definitions and responsibilities
- Performance metrics (sales per employee, customer feedback)
- Training records
- Turnover data
- Owner-provided team feedback

**Knowledge Graph Relationships.**
- Employee entities with role, skills, schedule, performance
- Employee-employee relationships (team structure, reporting lines)
- Employee-shift relationships (who works when, with whom)
- Employee-customer relationships (who serves whom)
- Employee-product relationships (who produces what)
- Team composition over time

**Pulse Influence.** Team Pulse is a component of Business Pulse. High turnover, understaffing, or skill gaps affect overall business health.

**Narrative Influence.** Team stories — "Your afternoon team is your strongest" or "Friday night staffing has been thin for three weeks."

**World Influence.** Labor market conditions and local hiring dynamics may affect team intelligence.

**Future Surface Opportunities.**
- **App.** Team dashboard, individual profiles, schedule optimization
- **Watch.** Shift start reminders, team health alerts
- **Widget.** Today's staffing overview
- **Voice.** "Who is working tonight?"
- **Scheduling Automation.** Predictive scheduling based on traffic forecasts
- **Training Recommendations.** Skill gap identification

**Success Indicators.**
- The owner understands their team's strengths and gaps
- Turnover decreases through better staffing decisions
- Scheduling improves (right people, right shifts)
- The platform identifies team health issues before they become crises

**Failure Indicators.**
- Employee data is incomplete or inaccurate
- The platform reduces employees to performance scores
- Recommendations ignore team dynamics (who works well together)
- Scheduling recommendations create friction rather than clarity

**Must Never Become.**
- A surveillance system that monitors employees without their knowledge
- A performance-score system that reduces humans to numbers
- A replacement for management — the platform supports, not substitutes
- An automated scheduler that ignores human preferences and constraints

---

### 2.5 Learning Intelligence

**Purpose.** Restaurant OS must get smarter over time — not through code updates, but through the natural process of learning from every business it serves.

**Mission.** Continuously discover patterns, relationships, and insights from business data, refining the platform's understanding and improving its recommendations with every interaction.

**Problem.** Without Learning Intelligence, the platform stays the same forever. It cannot improve its recommendations, refine its models, or discover new patterns. It knows what it was programmed to know and nothing more. Every insight requires human analysis.

**Primary User.** The platform's own intelligence systems.

**Secondary Users.** Data scientists, product managers, and — indirectly — every business owner.

**Supported Decisions.**
- What patterns exist in this business that we have not yet captured?
- Which relationships are stronger than we expected?
- Which predictions need recalibration?
- Are there new entity types or relationship types we should model?

**Sources of Truth.**
- All data flowing through the platform
- Historical patterns and their outcomes
- Owner feedback and corrections
- Cross-business anonymized patterns (for collective learning)

**Knowledge Graph Relationships.**
- Pattern entities (discovered patterns with confidence scores)
- Pattern-evidence relationships (which data supports which pattern)
- Pattern-outcome relationships (did the pattern predict the outcome?)
- Learning progress (what has been learned, what is pending)
- Confidence adjustments over time

**Pulse Influence.** Learning refines how Pulse is calculated. As patterns are discovered, Pulse becomes more accurate.

**Narrative Influence.** Learning discovers new narratives that the platform can tell ("I noticed something interesting about your Tuesday afternoon traffic...").

**World Influence.** Learning correlates internal patterns with external conditions.

**Future Surface Opportunities.**
- **App.** "What I learned" summaries for the owner
- **Internal.** Continuous model refinement and pattern discovery
- **Research.** Aggregated learnings (anonymized) for business intelligence research

**Success Indicators.**
- The platform's recommendations improve over time without code changes
- New patterns are discovered automatically
- False patterns are identified and discarded
- Learning is transparent — the platform can explain what it learned and from which data

**Failure Indicators.**
- The platform learns patterns that are not real (false correlations)
- Learning degrades performance or accuracy
- The platform cannot distinguish between temporary patterns and permanent ones
- Learning creates brittleness (overfitting to specific business)

**Must Never Become.**
- A system that learns from bad data and cannot unlearn
- A black box — learning must be explainable
- A system that learns at the expense of privacy (cross-business learning must be anonymized)
- A system that learns so aggressively it loses its constitutional grounding

---

### 2.6 Operational Intelligence

**Purpose.** Restaurant OS must understand the day-to-day mechanics of running a business — the flow of ingredients, orders, money, and time.

**Mission.** Model, monitor, and optimize the operational rhythms of every business — from inventory levels to ticket times, from order flow to cash management — so the owner knows how their business is running at any moment.

**Problem.** Without Operational Intelligence, the platform understands the business structure but not its dynamics. It knows what the business sells but not how efficiently it operates. The owner cannot answer "Is my business running well today?"

**Primary User.** The business owner and operational managers.

**Secondary Users.** Shift leaders, kitchen managers, front-of-house managers.

**Supported Decisions.**
- Is my inventory sufficient for today's expected demand?
- Are my ticket times within acceptable range?
- Is my cash flow healthy?
- Which menu items are most profitable?
- Are there operational bottlenecks?
- Should I change my operating hours?

**Sources of Truth.**
- POS transaction data
- Inventory management system
- Time clock and scheduling data
- Supplier delivery and invoice data
- Bank statements and financial data
- Kitchen display system data

**Knowledge Graph Relationships.**
- Order flow (order placed → prepared → served → paid)
- Inventory flow (supplier → storage → production → waste)
- Cash flow (sale → fee → settlement)
- Time measurements (ticket times, prep times, service times)
- Efficiency metrics (orders per hour, revenue per labor hour)

**Pulse Influence.** Operations are the largest component of Business Pulse. Inefficient operations directly degrade health.

**Narrative Influence.** Operational narratives — "Your Thursday lunch rush has been getting slower over three weeks" or "Inventory waste is above your historical baseline."

**World Influence.** External conditions affect operations (weather affects traffic, holidays affect staffing needs).

**Future Surface Opportunities.**
- **App.** Operations dashboard, inventory alerts, efficiency metrics
- **Watch.** Operational health at a glance
- **Widget.** Today's operational status
- **Voice.** "How is the kitchen doing?"
- **Automation.** Auto-reorder when inventory reaches threshold
- **Alert.** Anomaly detection for operational metrics

**Success Indicators.**
- The owner knows their operational status at all times
- Operational issues are detected before they become visible to customers
- Inventory waste decreases
- Ticket times improve or stabilize
- Cash flow anomalies are detected immediately

**Failure Indicators.**
- Operational metrics are stale or unreliable
- The platform cannot detect operational anomalies
- Recommendations ignore operational constraints
- The platform overwhelms with operational alerts

**Must Never Become.**
- A system that only reports problems without suggesting solutions
- A micromanagement tool that replaces operational autonomy
- A system that optimizes efficiency at the expense of quality
- A dashboard of every possible metric without prioritization

---

### 2.7 Predictive Intelligence

**Purpose.** Restaurant OS must help the owner see around corners — anticipating what will happen before it happens.

**Mission.** Forecast future business states with measured confidence, enabling the owner to prepare for what is coming rather than react to what has already happened.

**Problem.** Without Predictive Intelligence, the owner can only react. They see what happened yesterday and adjust today. But by the time they see a problem, it has already cost them money. The platform cannot help them prepare, only respond.

**Primary User.** The business owner.

**Secondary Users.** Managers doing scheduling, ordering, and planning.

**Supported Decisions.**
- How busy will we be tomorrow?
- How much inventory should I order?
- How many staff do I need next week?
- What will my revenue be this month?
- Which menu items should I prepare for?
- Should I adjust my hours for next week's weather?

**Sources of Truth.**
- Historical sales, traffic, and operational data
- Calendar data (holidays, local events, seasons)
- Weather forecasts
- Historical pattern models
- Current trend data

**Knowledge Graph Relationships.**
- Prediction entities (every prediction with confidence interval)
- Prediction-outcome relationships (was the prediction accurate?)
- Factor-prediction relationships (which factors influenced which predictions)
- Confidence calibration (how actual outcomes compare to predicted confidence)

**Pulse Influence.** Predictions inform Pulse by setting expectations. Pulse compares actual state to predicted state, not just to historical baseline.

**Narrative Influence.** Predictive narratives — "Based on the weather forecast, expect 20% lower traffic this Friday" or "Your current trajectory puts you on track for a record month."

**World Influence.** Predictions are heavily influenced by external conditions — weather, holidays, local events, economic indicators.

**Future Surface Opportunities.**
- **App.** Forecast views, scenario planning, what-if analysis
- **Watch.** Daily prediction summary
- **Widget.** "Today vs. predicted" comparison
- **Voice.** "What does tomorrow look like?"
- **Automation.** Auto-schedule based on predicted traffic
- **Alert.** Prediction confidence drops below threshold

**Success Indicators.**
- Predictions are measurably accurate
- Confidence intervals are calibrated (80% confidence events happen ~80% of the time)
- The owner uses predictions to prepare (scheduling, ordering, promotion timing)
- The platform can explain what factors drove each prediction

**Failure Indicators.**
- Predictions are consistently wrong
- Confidence intervals are miscalibrated
- The owner ignores predictions
- Predictions do not improve with more data
- The platform over-predicts (sees patterns that do not exist)

**Must Never Become.**
- A system that claims certainty it does not have
- A system that predicts without explaining the factors
- A system that creates self-fulfilling prophecies (prediction drives behavior that confirms prediction)
- The primary decision surface — predictions inform decisions, they do not replace them

---

### 2.8 Narrative Intelligence

**Purpose.** Restaurant OS must tell the story of the business — not show the data, but explain what the data means.

**Mission.** Transform raw business data into coherent, causal narratives that the owner can understand and act on in seconds.

**Problem.** Without Narrative Intelligence, the platform shows numbers and expects the owner to connect them. "Sales are down 12%. Cost of goods is up 8%. Labor is flat." The owner must interpret what these numbers mean together. Narrative Intelligence does the interpretation — it connects the dots and tells the story.

**Primary User.** The business owner.

**Secondary Users.** Anyone who receives a platform communication (managers, investors, partners).

**Supported Decisions.**
- Why did this happen?
- What caused this change?
- What is the story behind these numbers?
- Is this a temporary blip or a meaningful trend?

**Sources of Truth.**
- All capability outputs — Narrative Intelligence is a synthesis capability
- Causal relationships identified by other capabilities
- Time-series data and change points
- Owner feedback (was the narrative accurate?)

**Knowledge Graph Relationships.**
- Narrative entities (stories the platform can tell)
- Narrative-evidence relationships (which facts support which narrative)
- Narrative-outcome relationships (was the narrative actionable?)
- Causal chains (A caused B, which caused C)

**Pulse Influence.** Narratives explain Pulse changes. "Your health declined because inventory waste increased, which was caused by the new supplier's inconsistent deliveries."

**Narrative Influence.** This capability IS Narrative Intelligence — it is self-referential by design.

**World Influence.** Narratives incorporate external conditions. "The sales drop correlates with the road construction that started last week."

**Future Surface Opportunities.**
- **App.** Daily Brief, narrative cards, causal explanations
- **Watch.** One-line narrative summaries
- **Widget.** Narrative-driven insights
- **Voice.** Full narrative delivery — "Here is what happened today..."
- **Notification.** Narrative push — "Your afternoon sales are down because..."

**Success Indicators.**
- The owner understands why things happened without additional analysis
- Narratives are accurate (causes are real, not implied)
- Narratives are concise (one paragraph or less)
- The owner can repeat the narrative to someone else

**Failure Indicators.**
- Narratives invent causal relationships that do not exist
- Narratives are too long or complex
- Narratives contradict what the owner knows to be true
- Narratives are generic (could apply to any business)

**Must Never Become.**
- A narrative generator that makes things up (hallucination)
- A system that creates false causality from correlation
- A storytelling system that prioritizes a good story over accuracy
- A verbose narrator that wastes the owner's attention

---

### 2.9 Collective Intelligence

**Purpose.** Restaurant OS must learn from every business it serves — without compromising the trust of any single business.

**Mission.** Discover patterns that emerge across businesses — industry trends, seasonal benchmarks, operational best practices — and make them available to every business in a form that preserves individual privacy and data ownership.

**Problem.** Without Collective Intelligence, every business is an island. Each business learns only from its own data. The owner cannot know whether their performance is good compared to similar businesses, whether their challenges are unique or industry-wide, or what best practices look like in practice.

**Primary User.** The business owner and the platform's learning systems.

**Secondary Users.** Industry analysts, the platform itself (for improving models).

**Supported Decisions.**
- How does my business compare to similar businesses?
- Is this problem unique to me or industry-wide?
- What are the best practices in my industry?
- Are there emerging trends I should know about?

**Sources of Truth.**
- Aggregated, anonymized data from all businesses
- Industry benchmarks and published data
- Pattern libraries (anonymized)
- Research and analysis

**Knowledge Graph Relationships.**
- Aggregate entities (industry averages, benchmarks, distributions)
- Business-to-aggregate relationships (how a business compares to the aggregate)
- Pattern prevalence (how common is this pattern across businesses?)
- Anonymization mappings (irreversible transformations)

**Pulse Influence.** Collective Intelligence provides context for Pulse. "Your health score is 72, which is above average for similar businesses."

**Narrative Influence.** Collective narratives — "Businesses like yours typically see a 15% drop in January. You can prepare by..."

**World Influence.** Collective Intelligence identifies industry-wide external influences. "The entire sector is seeing labor cost increases."

**Future Surface Opportunities.**
- **App.** Benchmarking views, industry comparisons
- **Watch.** "How you compare" summary
- **Widget.** Relative performance indicator
- **Voice.** "How do we compare to similar restaurants?"
- **Research.** Industry trend reports (anonymized)

**Success Indicators.**
- Benchmarks are accurate and representative
- The owner finds comparisons useful and actionable
- Collective patterns improve individual business recommendations
- Privacy is never compromised
- The platform can detect industry-wide shifts

**Failure Indicators.**
- Benchmarks are not representative (sample bias)
- Anonymization is insufficient or overly aggressive
- Collective patterns do not improve individual recommendations
- The owner distrusts comparisons
- Privacy incidents occur

**Must Never Become.**
- A system that violates data ownership (Article 1 of the Constitution)
- A system where individual business data is identifiable in aggregates
- A system that pressures businesses to conform to averages
- A benchmarking tool that creates anxiety rather than insight

---

### 2.10 Experience Intelligence

**Purpose.** Restaurant OS must deliver the right experience at the right time — adapting to the owner's context, attention, and needs.

**Mission.** Orchestrate every interaction so that the owner receives the information they need, in the format they need, at the moment they need it — no more, no less.

**Problem.** Without Experience Intelligence, every owner receives the same experience regardless of their context. The owner who opens the platform at 7 AM before the lunch rush needs different information than the owner who opens it at 9 PM after closing. The platform treats them identically.

**Primary User.** The business owner.

**Secondary Users.** Any human interacting with the platform.

**Supported Decisions.**
- What does the owner need right now?
- What is the best format for this information?
- When should this information be delivered?
- Should the platform communicate now or wait?
- Which channel is appropriate for this message?

**Sources of Truth.**
- Owner interaction history
- Time of day, day of week, season
- Current business state (Pulse)
- Owner preferences and settings
- Device and context data

**Knowledge Graph Relationships.**
- Context entities (time, location, device, attention state)
- Context-experience relationships (which experience fits which context)
- Owner preference entities
- Interaction history entities

**Pulse Influence.** Pulse determines urgency. High-urgency states demand different experiences than calm states.

**Narrative Influence.** Experience determines how and when narratives are delivered — a morning brief is different from an evening summary.

**World Influence.** Context includes external factors. "It is raining" might change what the owner needs to know.

**Future Surface Opportunities.**
- **App.** Adaptable home screen based on context
- **Watch.** Glanceable summaries
- **Widget.** At-a-glance status
- **Voice.** Hands-free interaction
- **Notification.** Context-aware push
- **Automation.** Silent execution when appropriate
- **Proactive.** The platform surfaces itself when needed

**Success Indicators.**
- The owner receives the right information at the right time
- The platform communicates less as the business stabilizes
- Context transitions are smooth (morning → afternoon → evening)
- The owner never feels overwhelmed or underwhelmed
- The platform adapts to changing attention patterns

**Failure Indicators.**
- The owner receives the same experience regardless of context
- Notifications arrive at inappropriate times
- The platform requires the same effort at 7 AM and 9 PM
- The owner must configure their experience (it should be learned)
- Context detection is unreliable

**Must Never Become.**
- A system that requires the owner to configure their experience
- A system that guesses context incorrectly and delivers irrelevant information
- A system that is too adaptive (the owner cannot predict what they will see)
- A system that communicates the same volume regardless of urgency

---

### 2.11 Confidence Intelligence

**Purpose.** Restaurant OS must always know how sure it is — and must always communicate that certainty to the owner.

**Mission.** Measure, calibrate, and communicate the confidence of every fact, every prediction, every recommendation, and every narrative the platform produces — so the owner always knows how much to trust what they are seeing.

**Problem.** Without Confidence Intelligence, the platform presents information with false equivalence. A prediction based on three years of daily data looks the same as a prediction based on two weeks. The owner cannot distinguish between high-certainty information and educated guesses. Trust erodes when the owner discovers the platform was presenting guesses with the same weight as facts.

**Primary User.** The business owner (to calibrate trust).

**Secondary Users.** Every capability that reasons about uncertainty, and the platform's own learning systems (to know when to wait before making a recommendation).

**Supported Decisions.**
- Can I act on this recommendation without additional verification?
- How much weight should I give this prediction?
- Does the platform know this, or is it guessing?
- Should I seek additional information before deciding?

**Sources of Truth.**
- Data quantity and quality (how much data, how clean)
- Historical accuracy of similar predictions
- Model calibration metrics
- Data freshness and age
- Source trust levels (from Business Intelligence Fabric)

**Knowledge Graph Relationships.**
- Confidence entities (every fact, prediction, and recommendation has a confidence)
- Confidence-calibration relationships (was the confidence level accurate?)
- Confidence-decay relationships (how confidence changes over time)
- Confidence-source relationships (which data sources contributed to the confidence)

**Pulse Influence.** Confidence calibrates Pulse. A Pulse reading with low confidence is different from a Pulse reading with high confidence, and the experience must reflect this.

**Narrative Influence.** Confidence affects how narratives are framed. "We are seeing a pattern (75% confidence)" vs. "We are confident this pattern is real (95% confidence)."

**World Influence.** External data quality affects confidence. Unreliable weather forecasts reduce confidence in weather-dependent predictions.

**Future Surface Opportunities.**
- **App.** Confidence indicators on every recommendation and insight
- **Watch.** Simplified confidence (high, medium, low)
- **Alert.** Confidence changes that affect decision urgency
- **Voice.** "I am 80% confident that Tuesday will be your busiest day"
- **Internal.** Confidence thresholds that gate feature activation

**Success Indicators.**
- Confidence calibration is accurate (80% confidence events happen ~80% of the time)
- The owner can distinguish between high-confidence and low-confidence information at a glance
- The platform withholds recommendations when confidence is below threshold
- The owner trusts the platform more over time, not less

**Failure Indicators.**
- Confidence is miscalibrated
- Confidence indicators are ignored or not understood by the owner
- The platform makes low-confidence recommendations without appropriate caveats
- Confidence is not communicated visually or verbally
- The platform pretends to know when it does not (Constitution Article 3 violation)

**Must Never Become.**
- A system that only communicates confidence when confidence is high (this is lying by omission)
- A system where confidence is calculated once and never recalibrated
- A system that uses confidence as a liability shield rather than a trust-building tool
- A system that hides low confidence behind technical jargon

---

## SECTION 3 — Capability Maturity Model

Every capability exists on a maturity spectrum. The same capability can be primitive in one business and advanced in another, depending on data availability, business complexity, and platform evolution.

### Level 0 — Not Present

The capability does not exist. The platform cannot perform this function at all.

**Example.** Team Intelligence at Level 0 means the platform has no concept of employees. It cannot answer staffing questions.

### Level 1 — Aware

The capability exists in its most primitive form. The platform recognizes that this domain exists but has minimal understanding.

**Example.** Team Intelligence at Level 1 means the platform knows employees exist (names, roles) but cannot evaluate performance or health.

### Level 2 — Describing

The capability can describe the current state of its domain. It answers "What is happening now?"

**Example.** Team Intelligence at Level 2 can show who is working, their roles, and their schedules.

### Level 3 — Diagnosing

The capability can diagnose problems in its domain. It answers "What is wrong?"

**Example.** Team Intelligence at Level 3 can identify understaffing, excessive overtime, or scheduling conflicts.

### Level 4 — Recommending

The capability can recommend actions to improve its domain. It answers "What should I do?"

**Example.** Team Intelligence at Level 4 can suggest schedule adjustments, training needs, or hiring recommendations.

### Level 5 — Predicting

The capability can predict future states in its domain. It answers "What will happen?"

**Example.** Team Intelligence at Level 5 can predict staffing needs based on traffic forecasts and historical patterns.

### Level 6 — Automating

The capability can execute routine decisions autonomously within defined boundaries. It answers "What can the platform handle?"

**Example.** Team Intelligence at Level 6 can auto-generate optimized schedules for approval.

### Level 7 — Anticipating

The capability anticipates needs before they arise. It answers "What should we prepare for?"

**Example.** Team Intelligence at Level 7 detects that a key employee is at risk of leaving and recommends retention actions before the employee indicates dissatisfaction.

### Maturity Progression Rules

- **No skipping levels.** Each level builds on the previous. A capability cannot predict (Level 5) if it cannot diagnose (Level 3).
- **Asynchronous maturation.** Capabilities mature independently. The platform may have Level 5 Operational Intelligence and Level 2 Team Intelligence simultaneously.
- **Data-dependent maturation.** A capability cannot mature beyond the data available. Low-data businesses will have lower maturity in data-dependent capabilities.
- **Cap maturity is not feature count.** A capability at Level 4 with one good recommendation is better than a capability at Level 2 with 50 dashboard metrics.
- **Regress is possible.** If data quality degrades or the business changes dramatically, a capability may temporarily regress.

---

## SECTION 4 — Capability Relationships

Capabilities are not isolated. They form a network of dependencies and influences.

### Dependency Graph

```
Business Understanding (L0)
    │
    ├── Business Memory (L1) — depends on Understanding to know what to remember
    │
    ├── Team Intelligence (L1) — depends on Understanding to know who employees are
    │
    ├── Operational Intelligence (L1) — depends on Understanding to know how the business operates
    │
    └── Learning Intelligence (L1) — depends on Memory to learn from history
            │
            ├── Predictive Intelligence (L1) — depends on Learning to forecast
            │
            ├── Narrative Intelligence (L1) — depends on Learning to tell stories
            │
            └── Collective Intelligence (L2) — depends on Learning across businesses
                    │
                    └── Decision Intelligence (L1) — depends on all upstream capabilities
                            │
                            └── Experience Intelligence (L1) — depends on Decision to deliver
```

### Dependency Rules

**No capability can mature beyond its dependencies.** If Operational Intelligence is at Level 2 (Describing), Decision Intelligence cannot recommend operational improvements at Level 4 — no capability can output what no capability can provide.

**Confidence Intelligence is pervasive.** It applies to every capability. Every fact, prediction, and recommendation from every capability must carry a confidence indicator. Confidence Intelligence does not have a maturity level separate from the capabilities it serves.

**Experience Intelligence is a consumer.** It does not generate knowledge. It orchestrates delivery. Its maturity depends on the maturity of the capabilities it is delivering and on its own context-awareness.

### Influence Relationships

| Capability | Influenced By | Influences |
| :--- | :--- | :--- |
| Business Understanding | — (foundation) | All capabilities |
| Business Memory | Understanding | Learning, Narrative, Predictive |
| Team Intelligence | Understanding | Decision, Experience |
| Operational Intelligence | Understanding | Decision, Predictive, Narrative |
| Learning Intelligence | Memory | Predictive, Narrative, Collective |
| Predictive Intelligence | Learning, Operational, World | Decision, Experience |
| Narrative Intelligence | Learning, Memory, Confidence | Decision, Experience |
| Collective Intelligence | Learning (multi-business) | Decision, Narrative |
| Decision Intelligence | All upstream capabilities | Experience |
| Experience Intelligence | Decision, Confidence, Context | — (delivery layer) |
| Confidence Intelligence | All capabilities | All capabilities |

---

## SECTION 5 — Product Evolution

### How Capabilities Are Born

A capability is born when the platform identifies a domain of business intelligence that is both:

1. **Fundamental.** It defines a category of understanding or action that will be relevant to every business, forever.
2. **Unserved.** No existing capability covers this domain.

A new capability cannot be created to solve a single business problem. It must generalize. If a single feature can solve the problem, use a feature. If the problem reveals a category of understanding that the platform has not yet modeled, a new capability may be needed.

**Birth sequence:**
1. Research identifies a gap in the capability map
2. A new capability is drafted with full anatomy
3. The capability is registered in this document
4. Existing capabilities are checked for boundary overlap
5. The capability begins at Level 0 and matures over time

### How Capabilities Evolve

Capabilities evolve through maturity levels. Evolution can be:

- **Data-driven.** More data allows a capability to mature naturally.
- **Model-driven.** A new analytical approach allows a capability to jump in maturity.
- **Business-driven.** A business need demands higher maturity in a specific capability.

Evolution is not automatic. A capability must earn its maturity by demonstrating accuracy and reliability at each level before progressing.

### How Capabilities Can Be Absorbed

Rarely, a capability may be absorbed by another. This happens when:
1. The boundary between two capabilities is discovered to be artificial.
2. One capability is a special case of another.

Absorption requires updating the absorbing capability's anatomy and removing the absorbed capability from this document. This must be documented as a breaking change.

### How Capabilities Can Retire

Capabilities do not retire in the traditional sense. Once a conceptual domain is defined as a capability, it represents a permanent need. However, a capability can:
- Be fully absorbed by another capability (see absorption above).
- Be split into multiple capabilities if its scope was too broad.

Actual removal of a capability from the map requires evidence that the domain no longer exists — which, for a business intelligence platform, is unlikely.

---

## SECTION 6 — The Golden Question

The Golden Question for every capability is the same. It is adapted from the Constitution and the Product Principles:

**"Does this capability increase the owner's confidence in their business decisions?"**

If a capability cannot answer this question with "yes," it should not exist.

Each capability interprets the Golden Question through its own domain:

| Capability | The Golden Question Through Its Lens |
| :--- | :--- |
| Business Understanding | Does the owner trust that the platform understands their business? |
| Business Memory | Does the owner trust that the platform remembers what matters? |
| Decision Intelligence | Does the owner act on recommendations with confidence? |
| Team Intelligence | Does the owner feel more confident about their team decisions? |
| Learning Intelligence | Does the platform's learning increase or decrease the owner's trust? |
| Operational Intelligence | Does the owner feel in control of their operations? |
| Predictive Intelligence | Does the owner trust the platform's forecasts enough to prepare? |
| Narrative Intelligence | Does the owner believe the story the platform tells? |
| Collective Intelligence | Does the owner trust industry comparisons to be accurate and relevant? |
| Experience Intelligence | Does the experience leave the owner more confident than before? |
| Confidence Intelligence | Does the owner trust the platform's certainty indications? |

If the answer to any of these becomes "no," the capability must be redesigned before any other work proceeds.

---

## SECTION 7 — How to Read This Map

**For product managers.** This map defines what the product can do conceptually. When evaluating a feature request, first identify which capability it belongs to, then assess whether it advances the capability's maturity.

**For engineers.** This map defines the conceptual contract. Your implementation serves these capabilities. If your implementation breaks a capability boundary (does work belonging to another capability), restructure.

**For designers.** This map defines what the product knows. Your interfaces express these capabilities. If an interface asks the owner to do work that a capability should be doing, redesign.

**For the founder.** This map defines what Restaurant OS is. If the product drifts, return to this map. Every feature must fit in a capability. If it does not fit, it does not belong.

**For investors.** This map defines defensibility. Capabilities are hard to build. Features are easy to copy. The capability map is the moat.

**For new employees.** Read this document before any code, any design, any decision. It will tell you what Restaurant OS is and — just as importantly — what it is not.

---

*End of Capability Map*

*This document is permanent. It survives every technology change, every AI model, every redesign, every engineer, every founder, every investor, every employee.*
