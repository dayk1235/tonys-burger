# Product Roadmap — Restaurant OS

---

## Mission

Restaurant OS is a Business Copilot for Restaurant Owners.

It does not sell dashboards. It does not sell analytics. It does not sell reports.

Restaurant OS sells better decisions.

Every restaurant owner wakes up to the same question: *"What should I do today?"*

They have data — sales figures, customer counts, order histories, channel performance — but data alone does not tell them what to do. Data tells them what happened. It does not tell them what to change, what to test, or where to focus their attention.

Restaurant OS reduces uncertainty for restaurant owners.

It transforms raw operational data into clear, actionable recommendations. It replaces guesswork with structured experiments. It turns intuition into a system. It is a copilot — always watching, always learning, always ready with a suggestion.

The mission is not to show more information. The mission is to help the owner make the right decision — every time.

---

## Vision

A digital operating system that connects every restaurant channel into one intelligent platform.

One day, a restaurant owner should be able to open Restaurant OS and see:

- **What is happening.** Real-time operational status across every channel.
- **What needs attention.** Problems identified, prioritized, and explained.
- **What to do about it.** Recommended actions with expected impact.
- **What is being tested.** Active experiments with progress and timelines.
- **What was learned.** A growing body of knowledge specific to their business.
- **What comes next.** Predictive insights that anticipate problems before they occur.

Not a collection of tools. A single operating system for running a restaurant.

Restaurant OS is the platform. Tony's Burger is the first implementation. Every restaurant that follows will inherit the same foundation.

---

## Product Philosophy

Information alone has no value.

Information becomes valuable only when it produces better business decisions.

A restaurant owner does not need to know that afternoon traffic dropped 60%. They need to know that a Happy Hour experiment could recover $18,000 in monthly revenue. They need to know exactly what to try, how long to run it, and how to measure success.

Restaurant OS is not a dashboard. A dashboard shows data and expects the owner to interpret it. Restaurant OS is a copilot. It interprets the data, draws conclusions, and presents recommendations. The owner makes the final decision — but they never face the data alone.

This is the fundamental philosophy of Restaurant OS:

**Data is raw material. Decisions are the product.**

Every metric, every chart, every report is evaluated by one test: *Does this help the owner make a better decision?* If the answer is no, the feature should not exist.

---

## Core Question

Every feature, every screen, every piece of data in Restaurant OS must pass one question:

> "Will this help the owner make a better decision?"

This question is the filter for all product decisions.

- A dashboard with 40 metrics? *No. The owner cannot decide from 40 metrics.*
- A single metric with a recommended action? *Yes. The owner knows exactly what to do.*
- A chart showing last month's sales trend? *Maybe. Only if it leads to a decision.*
- An insight that says "afternoon traffic is low — here is what to try"? *Yes. Every time.*

Features that fail this question are removed. Features that pass it are prioritized. There is no exception.

---

## Restaurant OS Experience

Restaurant OS is not a tool the owner opens when something is wrong. It is a presence — always running, always observing, always ready.

The experience is a continuous journey:

```
Restaurant opens
    ↓
Restaurant OS observes
    ↓
Restaurant OS understands
    ↓
Restaurant OS explains
    ↓
Restaurant OS recommends
    ↓
Restaurant owner decides
    ↓
Restaurant OS measures
    ↓
Restaurant OS learns
```

**Observes.** From the moment the restaurant opens, the platform watches every channel. Orders, deliveries, customer behavior, operational signals — nothing is missed.

**Understands.** Raw signals are analyzed against historical patterns, business baselines, and known relationships. The platform does not just collect data. It understands what the data means.

**Explains.** Before any number is shown, the platform explains the situation in plain language. "Your afternoon sales are lower than usual." Context comes before data.

**Recommends.** Every observation leads to a recommended action. The platform tells the owner what to try, why it might work, and what outcome to expect.

**Decides.** The owner makes the call. Restaurant OS does not automate decisions. It empowers them.

**Measures.** Every decision is tracked. The platform watches what happens after the owner acts.

**Learns.** Outcomes feed back into the system. Over time, recommendations become more accurate because the platform learns what works for this specific restaurant.

The owner should feel accompanied instead of monitored. The platform is on their side. It exists to reduce their anxiety, not to judge their performance.

---

## Product Principles

### Simplicity Over Complexity

The owner should understand every screen in five seconds. If a feature needs explanation, it is too complex.

### Meaning Before Metrics

Numbers are evidence. Meaning comes first. Every screen should first answer: *"What does this mean?"* Only then show supporting metrics. A raw number without context is noise. A number introduced by a clear explanation is insight.

### Explain Before Measuring

Before showing a metric, explain why it matters. Context comes before numbers.

### Recommend Before Reporting

Reports catalog the past. Recommendations shape the future. Prioritize the latter.

### Every Insight Leads to an Action

An insight without an action path is noise. Every insight in Restaurant OS must have a "what to do next" attached.

### Every Action Should Eventually Be Measurable

If an action cannot be measured, it cannot be improved. The system should close the loop from recommendation to result.

### Technology Exists to Reduce Owner Anxiety

Running a restaurant is uncertain. Technology should reduce that uncertainty, not add to it. Every notification, every alert, every data point should make the owner feel more in control, not less.

### Trust Through Transparency

The system must explain *why* it is recommending something, not just *what* it recommends. An owner who understands the reasoning trusts the system.

---

## Emotional Design

Restaurant OS is designed to generate specific emotions in the owner.

**Confidence.** The owner trusts that the platform has their back. They know they are not missing anything important.

**Clarity.** Every screen communicates one clear message. The owner never wonders what they are looking at.

**Calm.** The platform does not overwhelm. It presents information in doses the owner can absorb. Silence is a signal that everything is fine.

**Focus.** When something needs attention, the platform makes it obvious. The owner knows exactly where to direct their energy.

**Control.** The owner decides. The platform recommends. The hierarchy is never reversed.

**Curiosity.** The platform should make the owner curious about their business. "I wonder what would happen if I tried that experiment."

Reducing owner anxiety is more important than showing more charts.

An anxious owner does not make better decisions. A calm, confident owner does. Every design decision starts from this premise.

---

## Demo Philosophy

The demo exists for one reason: to communicate product value.

It is not a technology demonstration. It is not a showcase of engineering capability. It is not a portfolio piece.

The demo should make the owner think one thing:

> "I need this."

Every screen in the demo is designed to create this reaction. The simulated data is not fake — it is *potential*. It shows what the system will do when connected to real data.

The demo answers the question: *"What would this look like if it worked?"*

---

## Living Data Layer

Restaurant OS should never feel static.

Even demo data should feel connected, fresh, and continuously evolving. The platform is not a report that was generated last night. It is a living system that is aware of the restaurant right now.

Signals that reinforce aliveness:

- "Recently updated moments ago"
- "New activity detected"
- "While you were away..."
- "Last order placed 2 minutes ago"
- "Delivery platforms synchronized"

The goal is trust. Not realism.

The owner should trust that when they open Restaurant OS, they are seeing the current state of their business — not a snapshot from hours ago. The data may be simulated, but the experience of freshness is real.

A living platform communicates that the system is always watching. The owner does not need to check. The platform will tell them when something changes.

---

## Capability Roadmap

### Phase 1 — Foundation

**Decision Engine.** The foundation of the platform. It exposes a single, stable API for all business data. The UI never reads data directly — it always goes through this engine. When real data replaces demo data, the UI does not change.

**Recommendation Engine.** Generates proactive suggestions from raw data. It identifies patterns, surfaces opportunities, and tells the owner what to pay attention to. It is the brain behind the Daily Brief.

**Restaurant Health.** The primary indicator of the platform. It answers one question: "How healthy is my restaurant today?" The answer is understandable in less than three seconds. Restaurant Health is not a KPI. It is a business health indicator.

**Living Data Layer.** The infrastructure that ensures every screen feels current. Demo data animates. Real data updates. The platform always feels alive.

**Experiment Lifecycle.** The capability to design, launch, track, and learn from structured business experiments. Every recommendation can become an experiment. Every experiment produces knowledge.

### Phase 2 — Intelligence

**Prediction Engine.** Looks forward. It anticipates problems before they occur — slowing sales, inventory shortages, channel shifts. It answers not just "what happened" but "what is about to happen."

**Learning Engine.** Captures the outcome of every experiment. It builds a knowledge base specific to the restaurant: what worked, what did not, and under what conditions. Over time, recommendations become more accurate because the system learns from its own results.

**Notification Engine.** Delivers the right information at the right time. It does not spam. It does not alert for everything. It sends only what needs attention, when it needs attention, in the language the owner understands.

**Inventory Intelligence.** Connects purchase data to sales data. It predicts what to order, when to order it, and flags waste before it happens.

**Customer Intelligence.** Understands who the customers are, what they want, and how they behave. It segments, profiles, and surfaces patterns that inform marketing, menu, and service decisions.

### Phase 3 — Expansion

**Marketing Intelligence.** Measures channel performance, campaign effectiveness, and customer acquisition cost. It tells the owner where to spend marketing money and whether it is working.

**Financial Intelligence.** Connects revenue data to cost data. It tracks margins, profitability by channel, and unit economics. The owner knows not just how much they are making, but where they are making it.

**Multi-location Intelligence.** Extends every capability to support multiple locations. The owner sees health, recommendations, and experiments across all their restaurants from one view.

**Automation Engine.** Enables the platform to take certain actions automatically when conditions are met. The owner defines the rules. The platform executes them.

**AI Copilot.** The natural language interface to Restaurant OS. The owner asks questions, requests recommendations, and reviews experiments through conversation. The copilot knows the restaurant's data and history.

### Phase 4 — Ecosystem

**Owner Mobile App.** The full Restaurant OS experience on mobile. Health, recommendations, experiments, and notifications — optimized for the owner's on-the-go workflow.

**Kitchen Display System.** Operational screens for the kitchen staff. Orders, timing, and preparation instructions flow from the platform to the kitchen.

**Staff App.** Employee-facing tools for shift management, task assignment, and communication.

**Executive Reporting.** High-level views for multi-location owners, investors, and regional managers. Trends, benchmarks, and portfolio health.

**Marketplace.** A library of adapters, integrations, and extensions built by the community and partners on top of the Restaurant OS platform.

---

## Restaurant OS Ecosystem

Restaurant OS is not a single application. It is an ecosystem of connected experiences.

**Website.** The customer-facing site. Menus, ordering, reservations, and brand presence. It feeds order data into the platform.

**Dashboard.** The owner's primary workspace. Health, recommendations, experiments, and insights — all in one place.

**Owner App.** The mobile version of the dashboard. Quick checks, notifications, and urgent actions. The owner never needs to be at a desk to know how their restaurant is doing.

**Kitchen.** Operational screens for the back of house. Orders, timing, and preparation flow from the platform to the kitchen display.

**Staff.** Employee tools for day-to-day operations. Tasks, schedules, and communication.

**Widgets.** At-a-glance information on the owner's phone home screen. Restaurant Health. Active experiments. Recent orders.

**Apple Watch.** Restaurant Health as a watch complication. The owner glances at their wrist and knows everything is okay.

**Android.** Full platform parity on Android devices. The owner's experience is identical regardless of platform.

All experiences consume the same business engines. Whether the owner opens the dashboard on a laptop, checks health on their watch, or receives a notification on their phone — they are interacting with the same Restaurant OS.

---

## Product Lifecycle

Every decision in Restaurant OS follows the same cycle:

```
Observe
    ↓
Understand
    ↓
Recommend
    ↓
Plan
    ↓
Experiment
    ↓
Measure
    ↓
Learn
    ↓
Improve
```

**Observe.** What is happening right now? Metrics, trends, anomalies.

**Understand.** Why is it happening? Root causes, patterns, context.

**Recommend.** What should we do about it? Prioritized actions with expected impact.

**Plan.** How will we execute? Experiment design, parameters, success criteria.

**Experiment.** Run the test. Measure the outcome. Minimize risk.

**Measure.** What happened? Compare results against predictions and baselines.

**Learn.** What did we discover? Document findings for future decisions.

**Improve.** Apply the learning. Adjust the strategy. Repeat.

This cycle is the heart of Restaurant OS.

It is not a linear process that ends. It is a continuous loop. Every cycle makes the next one better. The system does not just run experiments — it gets smarter with every experiment.

---

## Future Integrations

Restaurant OS is designed to connect to every channel a restaurant uses. The following integrations are planned, in approximate priority order:

- **POS System.** The operational backbone. Orders, payments, inventory, and staff data flow into Restaurant OS in real time.
- **Uber Eats.** Menu, orders, ratings, and performance data from the most widely used delivery platform.
- **Didi Food.** Same integration pattern as Uber Eats, adapted for Didi Food's API.
- **WhatsApp.** Customer communication channel for orders, support, and marketing.
- **Google Business.** Location data, reviews, questions, and insights from Google's business profiles.
- **Facebook & Instagram.** Social presence, ad performance, customer engagement, and messaging.
- **Website.** Direct order data, traffic analytics, and conversion metrics from the restaurant's own site.
- **Payments.** Transaction data, refund rates, payment method preferences, and processing costs.
- **CRM.** Customer profiles, loyalty data, preferences, and communication history.
- **Inventory.** Supplier orders, stock levels, usage rates, and waste tracking.

Each integration follows the same adapter pattern: a dedicated adapter translates the external API into the platform's internal types. The core system never depends on any specific integration.

---

## Long-Term Vision

Tony's Burger is not the final product.

Tony's Burger is the first implementation of Restaurant OS. It is the proof of concept, the design partner, and the reference implementation. It validates the model, refines the experience, and proves that the platform delivers value.

Restaurant OS is the actual product.

Every architectural decision must support thousands of restaurants in the future. The engine types, adapter patterns, and data models are designed for multi-tenant SaaS architecture from day one — even while the current implementation serves a single restaurant.

The long-term vision:

1. **Tony's Burger** — Build, validate, refine. Prove the model works.
2. **Early Adopters** — Onboard a small number of restaurants. Learn what generalizes and what does not.
3. **Platform** — Open the platform to any restaurant. Each restaurant gets their own instance with their own data, integrations, and recommendations.
4. **Ecosystem** — Enable third-party capabilities through the same engine architecture. Partners build adapters, integrations, and extensions on top of the platform.

The path from one restaurant to thousands is not a redesign. It is a deployment. The architecture already supports it.

---

## Architectural Philosophy

- **Small iterations.** Every capability starts small. Complexity is added only when proven necessary.
- **Single-purpose capabilities.** Each engine does one thing well. Engines do not depend on each other's internals.
- **Feature-first architecture.** Code is organized by feature, not by technical layer. Everything related to a capability lives together.
- **Adapter pattern.** External data sources are isolated behind adapters. The core system never depends on external APIs, databases, or file formats.
- **UI independent from data sources.** The presentation layer never reads data directly. It always goes through an engine.
- **Business logic separated from presentation.** Engines contain business logic. Components contain presentation logic. Neither leaks into the other.

---

## Product Laws

**LAW-001 — Small Iterations.** Never build more than the current task requires. Extend only when the need is proven.

**LAW-002 — Every Insight Must Lead to an Action.** No insight exists without a recommended next step. Insights without actions are noise.

**LAW-003 — Demo First.** Before building for production, build for demonstration. Prove the value before investing in integration.

**LAW-004 — One Source of Truth.** Every piece of business data flows through exactly one engine. No duplicate data paths.

**LAW-005 — Adapters Shield the Core.** External systems are always behind an adapter. The core never imports directly from an external source.

**LAW-006 — Decisions Over Data.** When choosing between showing more data and enabling a better decision, choose the decision.

**LAW-007 — Explain the Why.** Every recommendation must include its reasoning. Trust comes from understanding.

**LAW-008 — The Owner Is the User.** Every feature is evaluated from the owner's perspective. If the owner would not use it, it does not belong.

**LAW-009 — Meaning Before Metrics.** Every metric shown in Restaurant OS must first communicate its business meaning before exposing the raw number. A number without context is noise. A number introduced by a clear explanation is a decision.

**LAW-010 — Living System.** Restaurant OS should always feel alive. The owner should feel that the platform continuously watches over the restaurant. Every screen communicates freshness and presence. Silence is the signal that everything is okay.

---

## Closing Statement

Restaurant OS exists for one reason:

To help restaurant owners make better decisions every day.

Not to show them more charts. Not to give them more data. Not to impress them with technology.

To reduce the uncertainty of running a restaurant. To replace guesswork with structure. To turn intuition into a system that gets better over time.

The first implementation serves one restaurant. The architecture serves thousands.

The demo shows what is possible. The product delivers what matters.

Every feature, every line of code, every document exists to answer one question:

*"Will this help the owner make a better decision?"*

If the answer is yes, build it.

If the answer is no, do not.

That is the roadmap.
