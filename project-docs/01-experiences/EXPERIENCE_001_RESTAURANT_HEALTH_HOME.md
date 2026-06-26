# Experience 001 — Restaurant Health Home

---

## 1. Experience Goal

Restaurant Health Home is not another dashboard.

It is the first conversation of the day between Restaurant OS and the restaurant owner.

A dashboard presents information. A conversation builds understanding. The difference is fundamental. The owner does not open Restaurant OS to read reports. They open it to answer a single question: *"How is my restaurant doing?"*

The answer must arrive in less than three seconds. Not because the interface is fast — because the answer is obvious.

Everything after that is depth, not discovery. The owner already knows the answer. They spend the rest of their time exploring why and what to do next.

The experience goal is not to show everything. The experience goal is to tell the owner one thing: whether their restaurant needs them today.

---

## 2. First Impression

The first three seconds define everything.

### What the Owner Sees First

A single dominant number or state. Restaurant Health. Nothing else competes for this moment.

The number is large. The state label is immediately below it. A brief sentence explains why: "Sales are strong. Customer traffic is normal. No issues detected."

The owner's eye lands on health. They register it. They know.

### What Should Disappear

Navigation. Tabs. Filters. Search. Secondary metrics. Charts. Labels. Headers. Everything that is not the answer to "how is my restaurant doing?" must be invisible or visually silent during the first moment.

The interface reveals itself progressively. Health first. Then summary. Then recommendations. Then detail.

### What Should Never Compete for Attention

Non-essential information must never appear in the same visual weight as health. Badges, version numbers, timestamps, secondary actions, help icons, settings — these are not allowed in the primary visual zone.

### What Should Be Impossible to Miss

A change in health state. If the restaurant was Healthy yesterday and is Needs Attention today, the owner should register this before they read a single word. Color shift. Number change. These are designed to be unmissable.

---

## 3. Emotional Journey

### Second 1 — Arrival

*Emotion: Curiosity.*

The owner opens the app. They are not yet sure what they will find. The screen loads. The first element to resolve is Health.

### Second 5 — Assessment

*Emotion: Clarity.*

The owner has registered the health state. They already know whether their restaurant is okay. Anxiety drops. If the state is Excellent or Healthy, they relax. If it is Needs Attention or Critical, they focus.

### Second 20 — Exploration

*Emotion: Curiosity, renewed.*

The owner now reads the Daily Brief. They see what the platform recommends. They learn something about their business they may not have noticed. Curiosity replaces the initial assessment energy.

### One Minute — Decision

*Emotion: Confidence.*

The owner has either taken an action (started an experiment, reviewed an insight) or decided that no action is needed. They close the app feeling informed and in control.

The emotional arc is intentional: uncertainty → clarity → curiosity → confidence. Every second of the experience is designed to move the owner along this arc. If the owner ever feels confused, overwhelmed, or uncertain, the design has failed.

---

## 4. Screen Hierarchy

The Home screen reveals information in order of owner priority — not system priority.

### Layer 1 — Restaurant Health

The single most important signal. The owner decides whether their restaurant needs attention. Everything else depends on this.

### Layer 2 — Health Summary

A brief expansion of the health state. Two to three sentences explaining what is driving the current assessment. "Sales are on track. Delivery is healthy. One recommendation available."

### Layer 3 — Daily Brief

The bridge from assessment to action. The Daily Brief presents recommendations. Health answered "how am I doing?" The Daily Brief answers "what should I do?"

### Layer 4 — Recommended Focus

A single recommendation, elevated. If there are multiple recommendations, one is chosen as the primary focus. The owner should not have to prioritize — the platform has already done this.

### Layer 5 — Today's Performance

Key operational metrics. Orders placed today. Revenue. Customer count. Presented as numbers, not charts. Each number has context — "147 orders today, 8% above yesterday."

### Layer 6 — Recent Activity

A lightweight feed of recent events. Orders, new customers, experiment updates, platform syncs. Activity scrolls vertically. Nothing demands immediate attention — the feed is ambient.

### Layer 7 — Active Experiments

A compact list of experiments in progress. Name, duration remaining, current status. No detail — detail belongs on the experiment page. The Home just confirms that experiments are running.

### Layer 8 — Operational Status

System-level indicators. Delivery platforms connected. Data sync status. Integration health. This is the least important layer — the owner should almost never need it. It exists so that when something goes wrong technically, it is visible without being distracting.

### Why This Order

Each layer answers a question the owner asks implicitly. The hierarchy mirrors the owner's internal dialogue:

- Is my restaurant okay? → Health
- Why? → Summary
- What should I do? → Daily Brief
- What is the most important thing? → Recommended Focus
- How are we performing today? → Metrics
- Anything I missed? → Activity
- Are my experiments running? → Experiments
- Is the system working? → Status

The owner never asks all these questions. They stop when they have enough information to feel confident. The hierarchy ensures they stop at the right layer.

---

## 5. Information Priority

### Always Visible

- Restaurant Health (score + state + one-line reason)
- Health Summary (2–3 sentences)
- Current date and time context
- Demo badge (when applicable)

These elements are always present. They define the screen.

### Frequently Visible

- Daily Brief recommendations (when available)
- Recommended Focus (when applicable)
- Key metrics (orders, revenue, customers)
- Active experiments count

These elements appear when relevant and disappear when not.

### On Demand

- Recent activity feed (expandable)
- Full metric details (tap to expand)
- Experiment details (tap to navigate)
- Operational status (expandable footer)

These elements require an intentional action to reveal. They are not hidden — they are accessible — but they do not compete for attention.

### Hidden

- Settings
- Account information
- Help and documentation
- Historical data
- Configuration

These elements have dedicated pages or menus. They do not belong on the Home screen.

---

## 6. Decision Time

Every interaction on the Home screen has a maximum decision time. If the owner cannot complete the intended action within the time limit, the design needs simplification.

### Restaurant Health — 3 seconds

The owner knows whether their restaurant is okay. This is the only non-negotiable time limit. Three seconds or the design is wrong.

### Daily Brief — 20 seconds

The owner reads the available recommendations. They decide whether to act on any of them. If none seem urgent, they move on. Twenty seconds is enough to scan four recommendations and register their priority.

### Health Summary — 10 seconds

The owner reads why their health is what it is. Two to three sentences. They understand the reasoning. Ten seconds is generous for this.

### Recent Activity — 15 seconds

The owner scans recent events. They are looking for anything that surprises them. Fifteen seconds is enough to scroll through two screens of activity.

### Entire Home — 60 seconds

The owner completes their entire Home experience in one minute. They arrived knowing nothing. They leave knowing the health of their restaurant, what needs attention, and what to do next. After sixty seconds, the owner should feel informed enough to close the app and act.

These time limits are product requirements. They shape every design decision. If a section takes longer than its limit, it is too complex.

---

## 7. Reading Flow

The owner's eye travels through the Home screen in a predictable path.

### Top — Health

The eye lands at the top center. Health occupies the primary visual position. This is the anchor. Everything else is secondary.

### Center — Summary + Brief

The eye moves downward to the health summary and Daily Brief. These sections are visually connected — they form the "understanding" zone. The owner reads why, then reads what to do.

### Below — Recommended Focus

The eye shifts to the single elevated recommendation. This is the action zone. If the owner is going to do something, this is where they decide.

### Lower — Operational Overview

The eye scans key metrics and recent activity. This is the confirmation zone. The owner checks that operational numbers match their expectations.

### Bottom — Details

The eye reaches experiments and status. This is the background zone. The owner confirms that nothing is broken and that experiments are progressing.

### Visual Rhythm

The reading flow is linear. Top to bottom. The owner never needs to look back up. Information is organized from most important to least important, from most urgent to least urgent, from most actionable to most informational.

The eye moves in one direction. It never zigzags. It never searches. It flows.

---

## 8. Living Data Layer

The Home screen must feel alive. Every element communicates that the platform is actively watching the restaurant.

### Where Freshness Appears

Health displays its refresh time: "Health refreshed 30 seconds ago."

The activity feed shows real timing: "Order placed 45 seconds ago."

The Daily Brief shows its generation time: "Brief generated 2 minutes ago."

Platform sync status: "Delivery platforms synchronized 1 minute ago."

New customer indicator: "3 new customers since you last checked."

Last order indicator: "Last order was 45 seconds ago — Smash Double, $29.12."

### What Freshness Communicates

Freshness communicates that the platform is working. The owner trusts that the information is current. They do not need to wonder whether they are looking at stale data.

Freshness also communicates that the platform cares. The information updated because the platform is paying attention. The owner is not alone.

### What Freshness Does Not Mean

Freshness does not mean auto-refresh that distracts the owner. Information updates silently. The owner is not interrupted. The freshness indicators are ambient — visible when looked for, invisible when not.

---

## 9. Health Card Experience

### What It Should Communicate

The health card communicates one thing: the overall condition of the restaurant. It does this through a combination of:

- A large numerical score (0–100)
- A qualitative state label (Excellent, Healthy, Stable, Needs Attention, Critical)
- A one-sentence explanation

The health card does not attempt to explain why. The summary below it does that. The card itself is pure signal.

### What It Should Avoid

The health card should never show:

- Multiple numbers
- Charts or sparklines
- Comparison arrows
- Sub-metrics
- Historical context
- Technical details

These belong in the layers below. The health card is the headline, not the article.

### How It Should Behave

The health card is static during normal viewing. It does not animate unless the health state changes.

When health changes, the card transitions smoothly. The number changes. The state label updates. The explanation rewrites. The owner registers the change without being startled.

### What Happens If Health Changes

If the owner is on the Home screen when health updates, the card transitions in place. Softly. If the owner is not on the Home screen, the notification engine handles the communication.

### How Transitions Should Feel

Health transitions are gentle. The number does not flash or pop. The color transition is smooth. The change is perceptible but not jarring. The owner registers the change the same way they would notice someone entering a room — without being surprised.

---

## 10. Daily Brief Relationship

Restaurant Health and Daily Brief are partners. They answer different questions.

### Health Answers: "How am I doing?"

Health is the assessment. It is backward-looking and present-focused. It tells the owner where their restaurant stands right now. It is the diagnosis.

### Daily Brief Answers: "What should I do?"

The Daily Brief is the prescription. It is forward-looking and action-focused. It tells the owner what to pay attention to and what to try. It is the treatment plan.

### How They Work Together

Health sets the context. The owner knows whether the restaurant is healthy. Then the Daily Brief offers recommendations calibrated to that context.

If health is Excellent, the Daily Brief focuses on growth and optimization. "Here is an opportunity to expand."

If health is Needs Attention, the Daily Brief focuses on the specific area requiring intervention. "Here is what to fix."

If health is Critical, the Daily Brief narrows to one recommendation: the single most important action the owner can take right now.

The relationship is sequential. Health first. Then Daily Brief. The owner always knows the diagnosis before receiving the prescription.

---

## 11. Recommended Focus

The Recommended Focus is a dedicated section that answers one question:

*"What deserves my attention today?"*

### Why Only One Recommendation Dominates

If everything is important, nothing is. The platform prioritizes. It chooses one recommendation — the single most impactful action the owner could take today.

This recommendation is visually elevated. It has its own section. It is not listed among other options. It is presented as the answer to the question the owner asked implicitly: "What should I focus on?"

### How It Works

The Recommended Focus section sits between the Daily Brief and the operational overview. It contains:

- One recommendation title
- One sentence explaining the opportunity
- One sentence stating the expected impact
- One primary action button

Nothing else. No alternatives. No "see all." No secondary options. The owner decides whether to act on this recommendation. If they decline, they can explore the full Daily Brief. But the platform makes the choice clear.

### When There Is No Recommendation

If no recommendation is available, the section does not appear. The platform does not manufacture urgency. Silence is a signal that everything is fine.

---

## 12. Operational Snapshot

The operational snapshot gives the owner a quick pulse on key business metrics. It is not a dashboard. It is a confirmation.

### What Belongs Here

Orders placed today. A single number. With context: "147 orders today, 8% above yesterday."

Revenue today. A single number. With context: "$4,280 today, 12% above yesterday."

Customers today. A single number. With context: "43 new customers, 89 returning."

Active experiments. A single number. With context: "2 experiments running. 1 ready for review."

Channel breakdown (future). A single percentage. With context: "Delivery: 28% of orders today."

### What Does Not Belong Here

Charts. Trends. Sparklines. Comparison tables. Historical data. Projections. The operational snapshot is a confirmation, not an analysis. The owner confirms that today's numbers feel right. If something feels off, they navigate deeper.

### Never Overload

The snapshot shows no more than five metrics. If the owner wants more, they navigate to the dedicated page. The Home screen is for confirmation. Detailed analysis happens elsewhere.

---

## 13. Mobile Translation

The Home experience is the same on mobile. Only the depth changes.

### What Survives

Health remains first and dominant. The health card scales down but does not lose visual weight. It is the first thing the owner sees.

The health summary survives as two lines below the score. The Daily Brief survives as a scrollable list, not a grid.

Recommended Focus survives as a compact card. One recommendation. One button.

### What Adapts

The operational snapshot reduces to the top three metrics. The activity feed reduces to the three most recent events. Experiments reduce to a count with a tap-to-view action.

### What Disappears

Deep detail. Extended activity feeds. Historical context. Secondary information. On mobile, every screen is one layer shallower. The owner taps to go deeper rather than seeing everything at once.

### The Rule

If a screen cannot be understood in one glance on a phone, it does not belong on mobile. Health passes this test. Everything else is progressively deeper.

---

## 14. Widget Translation

The widget is the fastest interaction with Restaurant OS. It is designed for maximum information with minimum interaction.

### What Survives

- Restaurant Health score and state
- One-line health reason
- One active recommendation title (if available)
- Last updated timestamp

### What Disappears

Everything else. The widget is not a mini-app. It is a glance. The owner checks the widget, registers health, and either opens the app or moves on.

### Interaction Model

Tap the widget to open the full Home screen. No in-widget interactions. No scrolling. No buttons. The widget is a portal, not a destination.

---

## 15. Apple Watch Translation

The watch is the fastest possible interaction. It is designed for one message and nothing else.

### What Survives

- Restaurant Health state (single word: Excellent, Healthy, Stable, Needs Attention, Critical)
- Health score (number)
- Color indicator (green → yellow → red)

### What Disappears

Everything. No explanation. No metrics. No recommendations. No buttons. The watch tells the owner whether their restaurant is okay. That is all.

### Interaction Model

Tap the watch to open a single-screen summary on the phone. The watch is a notification device, not an interaction device.

### The Rule

If the owner looks at their watch and feels the need to do something other than "continue with their day" or "open the phone," the watch experience needs simplification.

---

## 16. Memory Test

After closing Restaurant OS, what should the owner remember?

### What They Should Remember

*"My restaurant is healthy."*

This is the primary memory. The owner closes the app and knows the overall condition of their business.

*"I have three opportunities to explore."*

The owner remembers that recommendations exist. They know where to find them when they are ready.

*"I already know where to focus."*

The owner remembers the primary recommendation. Even if they did not act on it, they know what they should think about today.

### What They Should NOT Remember

Revenue. Orders. Charts. KPIs. Percentages. The owner does not need to remember specific numbers. The numbers change. The memory should be about direction, not precision.

If the owner remembers a single number, it should be the health score — and only because it is the single most important signal.

### Why This Matters

If the owner remembers numbers, the interface is competing with their memory. If the owner remembers decisions and direction, the interface is doing its job. The measure of success is not what the owner saw — it is what the owner keeps.

---

## 17. Success Criteria

### The Owner Understands the Product Immediately

A first-time owner understands Restaurant OS in under ten seconds. No onboarding. No tutorial. No explanation. The screen is self-evident.

### The Owner Feels Calm

After using the Home screen, the owner feels less anxious than before they opened it. The platform reduced uncertainty.

### The Owner Feels Informed

The owner believes they know everything they need to know about their restaurant's current state. They do not feel the need to check other sources.

### The Owner Knows What to Do Next

The owner has a clear next action — either something specific (review a recommendation, check an experiment) or the confident decision that no action is needed.

### The Owner Wants to Return Tomorrow

The experience is valuable enough that the owner willingly returns. Not because of notifications, habits, or pressure — because the platform makes their life easier.

---

## 18. Future Expansion

As Restaurant OS grows, new capabilities integrate into the Home screen without changing its philosophy.

### Recommendation Engine

When the Recommendation Engine becomes active, the Daily Brief and Recommended Focus become more accurate and more personalized. The Home screen does not change — the recommendations simply improve.

### Prediction Engine

When the Prediction Engine becomes active, the health assessment incorporates forward-looking signals. "Your health is Healthy, but delivery traffic is predicted to decline next week." The health card remains the same. The prediction appears in the summary.

### Inventory Intelligence

When Inventory Intelligence becomes active, a new row appears in the operational snapshot: "Beef: 3 days remaining." The owner sees it in context with orders and revenue. It does not compete with health.

### Marketing Intelligence

When Marketing Intelligence becomes active, the Daily Brief includes marketing-specific recommendations. "Your weekend campaign generated 22% more orders than average." The recommendation sits alongside operational recommendations.

### Financial Intelligence

When Financial Intelligence becomes active, the operational snapshot includes a margin metric. "Today's margin: 68%." A single number. Context in the summary.

### The Rule That Protects the Home

Every future capability must ask: "Does this belong on the Home screen?" If the answer is "the owner needs to see this to know if their restaurant is okay," it belongs. If the answer is "this is interesting data," it does not.

The Home screen is for signals, not noise. Future capabilities that produce signals are welcome. Future capabilities that produce noise are placed in dedicated sections.

---

## 19. Closing Manifesto

The Home screen is not where Restaurant OS shows information.

It is where Restaurant OS earns the owner's trust every morning.

Every time the owner opens the app, they are giving the platform a chance to prove itself. To prove that it understands their business. To prove that it is watching. To prove that it will tell them when something is wrong — and stay quiet when everything is fine.

Trust is not earned through features. It is earned through consistency. The owner opens the app and finds the answer they expect. Over days. Over weeks. Over months. The platform is always correct. Always honest. Always on their side.

The Home screen is the most important screen in Restaurant OS.

Not because it shows the most data.

Because it earns the most trust.
