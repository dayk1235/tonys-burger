# Product Principles — Restaurant OS Operating Manual

---

## 1. Purpose

Restaurant OS must remain coherent.

Coherence is not automatic. It is the result of discipline — a commitment to a set of principles that every decision is measured against. Without these principles, the product will drift. Features will accumulate. Screens will compete for attention. The owner will open the platform and feel uncertain instead of confident.

These principles exist to prevent that drift.

They are not suggestions. They are the operating manual for building Restaurant OS. Every feature, every screen, every interaction, every line of copy must comply with them.

They apply regardless of:

- **Team size.** Whether one person or fifty people are building the product, the principles ensure consistency.
- **Number of developers.** New contributors learn the principles, not tribal knowledge.
- **Number of designers.** Every designer works from the same foundation. No style drift. No philosophical inconsistency.
- **AI assistants.** Every agent reads these principles before writing code. The principles are the constitution.
- **Future features.** New capabilities do not require new philosophies. They fit inside the existing framework or they do not belong.

This document is mandatory reading before implementing any feature.

If a principle contradicts a feature request, the principle wins.

---

## 2. The Golden Rule

**Every screen must help the owner make one better business decision.**

This is not a design goal. It is the filter for all product decisions.

If a screen does not help the owner make a better decision, the screen should not exist. If a feature cannot explain which decision it improves, the feature should not be built. If a metric does not lead to a decision, the metric should not be shown.

The owner does not open Restaurant OS to see data. They open it to know what to do. Every element on every screen must serve that purpose.

**Why this rule exists:**

A restaurant owner is not an analyst. They do not have time to interpret charts, compare metrics, or draw conclusions from raw data. They need the platform to do that work for them. The platform's value is not in the information it shows — it is in the decisions it enables.

When a screen passes the Golden Rule, the owner feels confident. When it fails, the owner feels uncertain. Confidence is the product. Decisions are the output. Everything else is infrastructure.

---

## 3. The 20 Product Principles

---

### Principle 1 — Meaning Before Metrics

**Rule:** Every screen must first communicate its meaning in plain language. Supporting numbers come second.

**Why it exists:** A number without context is noise. The owner should understand the situation before they see a single data point. The words frame the numbers, not the other way around.

**Good example:**
```
Afternoon sales were slower than usual.
You had 6 orders between 2 and 5 PM — 18% fewer than last week.
A Happy Hour promotion could recover this lost revenue.
```
The owner understands the situation before they see a number.

**Bad example:**
```
Afternoon Orders
Current: 6
Target: 12
Change: -18%
```
The owner has to interpret what "6" means and whether "-18%" is good or bad.

**Validation question:** Does the owner understand what this screen is communicating before they read any numbers?

---

### Principle 2 — Trust Before Complexity

**Rule:** Earn trust with simplicity before adding depth. New features must prove their value at their simplest form before being extended.

**Why it exists:** Complexity is the enemy of trust. Every additional option, toggle, or configuration point reduces the owner's confidence that the platform is correct. Trust is built through simplicity and maintained through restraint.

**Good example:** Health is a single number with a state label and one-line explanation. The owner trusts it immediately because there is nothing to question.

**Bad example:** Health is a composite score with sub-scores, weightings, trend arrows, and confidence intervals. The owner questions every element.

**Validation question:** What is the simplest version of this feature that still delivers value?

---

### Principle 3 — One Primary Decision

**Rule:** Every screen surfaces one primary decision. Supporting decisions are secondary and visually subordinate.

**Why it exists:** If everything is important, nothing is. The platform must prioritize the owner's attention by choosing what matters most right now.

**Good example:** The home screen elevates health as the primary decision. Everything else — brief, metrics, activity — is visually subordinate. The owner registers health first, then chooses whether to go deeper.

**Bad example:** The home screen shows health, metrics, charts, activity, recommendations, and status all with equal visual weight. The owner does not know where to look.

**Validation question:** What is the one decision the owner should make after seeing this screen?

---

### Principle 4 — One Primary Recommendation

**Rule:** When recommendations exist, one is elevated above the others. The platform prioritizes. The owner does not have to.

**Why it exists:** A list of equal options is not a recommendation. It is a menu. The platform earns its value by doing the hard work of prioritization before the owner sees the screen.

**Good example:** The Daily Brief shows three recommendations, but one has a dedicated section with its own space and a primary action button.

**Bad example:** The Daily Brief shows four recommendations in a grid. Each has the same visual weight. The owner must read all four and decide which matters most.

**Validation question:** If the owner takes only one action today, should it be this recommendation?

---

### Principle 5 — Calm Over Noise

**Rule:** The interface must feel calm. No flashing elements, no competing animations, no urgent colors for non-urgent information.

**Why it exists:** A restaurant owner lives in a high-stress environment. The platform should reduce that stress, not amplify it. Calm is a design requirement, not a preference.

**Good example:** A health state change transitions smoothly over 300ms. The color shifts gently. The owner registers the change without being startled.

**Bad example:** A health state change triggers a pulsing indicator, a notification sound, and a color flash. The owner feels alarmed before they understand why.

**Validation question:** Does this screen feel calmer than the owner's current workflow?

---

### Principle 6 — Technology Is Invisible

**Rule:** The owner should never think about the technology. No loading spinners, no technical error messages, no system language.

**Why it exists:** The platform exists to make the restaurant visible. When the owner sees technology, they stop thinking about their business and start thinking about the tool. Technology should disappear behind the experience.

**Good example:** "We could not reach the delivery platform. Your data may be delayed. We will retry automatically."

**Bad example:** "API rate limit exceeded. HTTP 429. Cache invalidated."

**Validation question:** Does any element on this screen remind the owner that they are using software?

---

### Principle 7 — Explain Before Recommend

**Rule:** Before presenting a recommendation, explain the observation that led to it. The owner must understand why before considering what to do.

**Why it exists:** Trust is built through reasoning. A recommendation without context feels like a guess. A recommendation preceded by a clear explanation feels like advice from a trusted partner.

**Good example:** "Afternoon orders have been declining for three days. We think a Happy Hour experiment could recover this trend. Here is what we recommend..."

**Bad example:** "Recommendation: Launch Afternoon Happy Hour."

**Validation question:** Does the owner understand why this recommendation exists before they decide whether to act on it?

---

### Principle 8 — Living System

**Rule:** The platform must feel alive. Every screen communicates freshness and presence. The owner should feel that the platform is continuously watching.

**Why it exists:** A static platform communicates neglect. A living platform communicates care. The owner trusts that the system is always there, always watching, always ready.

**Good example:** "Health refreshed 30 seconds ago." "Last order placed 2 minutes ago." "While you were away, 23 orders were fulfilled."

**Bad example:** No freshness indicators. Static data with no timestamps. The owner wonders if the data is from today or yesterday.

**Validation question:** Does this screen communicate that the platform is actively watching the restaurant right now?

---

### Principle 9 — Every Metric Has a Source

**Rule:** Every number displayed must trace to a clear data source. The owner can always understand where a metric comes from.

**Why it exists:** Trust requires transparency. When the owner sees a number, they should never wonder whether it is real, estimated, or simulated. The source is always accessible.

**Good example:** "147 orders today — from POS data synced 2 minutes ago."

**Bad example:** "147" displayed with no context about where the number comes from or when it was last updated.

**Validation question:** Can the owner trace this number to its source in two taps or less?

---

### Principle 10 — Every Recommendation Has a Reason

**Rule:** No recommendation exists without an explanation of why it was made and what outcome it expects.

**Why it exists:** An unexplained recommendation is not advice. It is a command. Restaurant OS does not command. It advises. Advice includes reasoning.

**Good example:** "We recommend a Happy Hour because afternoon orders drop 60% between 2 and 5 PM. Based on similar restaurants, this could add 15–20 orders per day."

**Bad example:** "Recommended action: Launch Happy Hour experiment."

**Validation question:** Can the owner explain why this recommendation was made after reading it once?

---

### Principle 11 — Reduce Anxiety

**Rule:** Every interaction should leave the owner feeling less anxious than before they started.

**Why it exists:** Running a restaurant is inherently uncertain. The platform exists to reduce that uncertainty. If a feature increases anxiety — through information overload, alarming visuals, or unclear messaging — it is failing its primary purpose.

**Good example:** Health communicates "everything is fine" through a calm green indicator and minimal text. The owner closes the app feeling reassured.

**Bad example:** Health flashes warnings for minor fluctuations, shows multiple declining trends, and uses urgent language for non-urgent changes.

**Validation question:** Does this screen make the owner more or less anxious? How do you know?

---

### Principle 12 — Save Time

**Rule:** The platform must save the owner time compared to their current workflow. Every screen should be understandable in seconds, not minutes.

**Why it exists:** A restaurant owner's most scarce resource is attention. If the platform requires more time to use than the owner's current approach, it will be abandoned. Speed is a feature.

**Good example:** The home screen communicates health in 3 seconds and the Daily Brief in 20 seconds. The owner completes their entire check-in under 60 seconds.

**Bad example:** The home screen requires scrolling, filtering, and interpretation. The owner spends 5 minutes and still does not know if their restaurant is okay.

**Validation question:** Does this feature save the owner time compared to not having it? How much?

---

### Principle 13 — Increase Profit

**Rule:** Every feature must contribute to the owner's profitability, either directly (revenue) or indirectly (cost savings, efficiency gains).

**Why it exists:** Restaurant OS exists to make restaurants more successful. If a feature cannot demonstrate how it helps the owner make more money or lose less money, it is decoration.

**Good example:** An experiment that recommends a Happy Hour includes its expected revenue impact: "+12% to +18% afternoon orders — approximately $3,200 over 14 days."

**Bad example:** An experiment recommendation with no expected impact. The owner launches it without knowing what success looks like.

**Validation question:** How does this feature increase the owner's profit? What is the expected impact?

---

### Principle 14 — No Empty Features

**Rule:** Do not build features that look impressive but deliver no measurable value. Every feature must have a clear job to do.

**Why it exists:** Empty features accumulate. They add complexity, increase maintenance, and dilute the platform's signal. Every feature must earn its place by delivering value, not by looking good in a demo.

**Good example:** A metric card that shows one number with context and a clear action if the number is off-target.

**Bad example:** A chart widget that shows an interactive visualization with filters, zoom, and export — but the owner never uses it to make a decision.

**Validation question:** If this feature did not exist, would the owner notice? Would their decisions be worse?

---

### Principle 15 — Every Click Has a Purpose

**Rule:** No interaction should exist without a clear purpose. Every tap, click, and gesture should advance the owner toward a decision or understanding.

**Why it exists:** Unnecessary interactions waste the owner's attention. Every element that requires action should justify itself by answering: *What decision does this enable?*

**Good example:** Tapping a recommendation opens its detail page with analysis, causes, and expected impact. Every tap advances understanding.

**Bad example:** Tapping a metric opens a filter panel. The owner must configure the view before they can see useful information.

**Validation question:** What happens when the owner taps this? Does that action help them make a better decision?

---

### Principle 16 — No Dead Ends

**Rule:** Every screen and interaction must lead to the next logical step. The owner should never reach a point where they do not know what to do next.

**Why it exists:** Dead ends create friction. The owner should flow through the platform naturally — from health to brief to recommendation to action. Every screen is a stepping stone, not a wall.

**Good example:** After viewing a recommendation, the owner can create an experiment. After an experiment completes, the owner can review results. Every state leads forward.

**Bad example:** A recommendation with no action button. A completed experiment with no review option. A metric that shows a problem but offers no path to fix it.

**Validation question:** After the owner completes the primary action on this screen, what do they do next?

---

### Principle 17 — Human Language First

**Rule:** The platform must communicate in natural, restaurant-friendly language. No technical terms, no corporate jargon, no analytics speak.

**Why it exists:** The owner is a restaurant operator, not a data analyst. The platform should speak their language. Technical terminology creates distance. Natural language creates partnership.

**Good example:** "Your afternoon was quieter than usual." "You may need to reorder beef tomorrow." "Your Smash Double experiment is ready for review."

**Bad example:** "Afternoon conversion rate decreased 240 basis points." "Inventory threshold reached for protein category." "Experiment status: COMPLETED."

**Validation question:** Would you say this to a restaurant owner in person? If not, rewrite it.

---

### Principle 18 — Consistency Across Platforms

**Rule:** The owner's experience must feel identical regardless of whether they are on the dashboard, mobile app, widget, or watch.

**Why it exists:** Restaurant OS is not a collection of separate apps. It is one platform with multiple surfaces. The owner trusts the platform because health means the same thing everywhere. Inconsistency erodes trust.

**Good example:** Health is the first thing the owner sees on every surface. The same number. The same state. The same color. The owner glances at their watch and knows it matches the dashboard.

**Bad example:** The dashboard shows a detailed health breakdown. The mobile app shows a simplified version. The widget shows something different. The owner does not know which to trust.

**Validation question:** If the owner checks health on two different surfaces, will they see the same information?

---

### Principle 19 — Future Compatibility

**Rule:** Every feature must be designed to accommodate future capabilities without architectural changes. New data sources, new engines, and new surfaces should integrate without redesigning existing screens.

**Why it exists:** Restaurant OS will grow. Inventory, marketing, financial intelligence, and multi-location support will arrive. The platform should absorb these capabilities naturally — not require a redesign every time.

**Good example:** Health dimensions are defined by responsibility, not by formula. When Inventory Health arrives, it fits into the existing dimension structure without changing the health card.

**Bad example:** Health is calculated from a fixed formula. Adding a new dimension requires rewriting the health engine, updating all screens, and retesting every surface.

**Validation question:** If a new data source arrives tomorrow, does this feature need to change or does it absorb the new source naturally?

---

### Principle 20 — Progressive Disclosure

**Rule:** Information reveals progressively. The owner sees the minimum first, then chooses to go deeper. Depth is always one tap away and never required.

**Why it exists:** Information density is the enemy of understanding. By revealing information progressively, the platform lets the owner control how much detail they see. The owner who wants a quick check gets it. The owner who wants deep analysis gets that too.

**Good example:** Health shows a number, state, and one-line explanation. Tapping opens a summary. Tapping again opens the detail. The owner controls the depth.

**Bad example:** Health shows the number, all dimension scores, trend arrows, comparison data, and a chart — all at once. The owner cannot find the signal through the noise.

**Validation question:** What is the minimum information the owner needs to make a decision? Show that first. Everything else is one tap away.

---

### Principle 21 — Every Insight Leads to an Action

**Rule:** No insight exists without a recommended next step. Insights without actions are noise.

**Why it exists:** The purpose of insight is action. If the platform identifies a pattern but does not suggest what to do about it, the owner is left holding information they cannot use. That creates frustration, not value.

**Good example:** "Afternoon orders are declining. We recommend a Happy Hour experiment. [Create Experiment →]"

**Bad example:** "Afternoon orders are declining." Nothing else. The owner knows the problem but not the solution.

**Validation question:** What should the owner do after reading this insight? Is that action available from this screen?

---

### Principle 22 — The Platform Adapts, Not the Owner

**Rule:** The platform should configure itself to the owner's context. The owner should never have to configure the platform.

**Why it exists:** Every configuration screen, every settings panel, every preference toggle is a failure of the platform to understand what the owner needs. Restaurant OS should learn from behavior, not ask for preferences.

**Good example:** Auto mode in the Experience System selects Morning or Focus based on local time. The owner can override, but the platform chooses by default.

**Bad example:** A settings page with 20 toggles for appearance, notification preferences, metric visibility, and dashboard layout. The owner must spend 30 minutes configuring before seeing value.

**Validation question:** Could the platform determine this preference automatically? If yes, remove the setting.

---

### Principle 23 — Quality Before Quantity

**Rule:** It is better to have five features that create confidence than fifty features that create noise. Every feature must be excellent or it should not exist.

**Why it exists:** Feature count is not a measure of product value. Decision quality is. A small set of excellent features that reliably help the owner make better decisions is more valuable than a large set of mediocre features that compete for attention.

**Good example:** Restaurant OS launches with health, Daily Brief, recommendations, experiments, and activity — five core capabilities. Each is refined, tested, and excellent.

**Bad example:** Restaurant OS launches with twenty features. Most are half-functional. None feel complete. The owner does not know which to trust.

**Validation question:** Is this feature excellent? Would the owner trust it immediately? If not, refine it or remove it.

---

### Principle 24 — The Owner Is Always Right About Their Business

**Rule:** The platform can recommend, suggest, and advise. It never overrides the owner's decision or implies the owner made a mistake.

**Why it exists:** The owner knows their business better than any algorithm. The platform's role is to inform, not to decide. When the owner disagrees with a recommendation, the platform accepts it gracefully and learns from the outcome.

**Good example:** The owner declines a recommendation. The platform does not ask again. It notes the decision and moves on. No guilt. No pressure. No follow-up notifications.

**Bad example:** The owner declines a recommendation. The platform sends reminders, flags the decision as "skipped," and includes it in the next Daily Brief. The owner feels judged.

**Validation question:** Does this interaction respect the owner's autonomy? Would the owner feel judged or supported?

---

### Principle 25 — Silence Is a Signal

**Rule:** When everything is fine, the platform should be quiet. The absence of notifications is a positive signal that no action is needed.

**Why it exists:** Constant notifications train the owner to ignore them. By being quiet when nothing needs attention, Restaurant OS makes its notifications meaningful. When the platform speaks, the owner listens.

**Good example:** The owner opens the platform and sees a calm, healthy state with no alerts. They close it feeling confident. No notification was necessary.

**Bad example:** The platform sends a daily notification even when nothing is wrong. "Your restaurant is healthy. Check your Daily Brief." The owner learns to swipe away every notification.

**Validation question:** Would a restaurant owner who is already confident benefit from this notification? If not, do not send it.

---

## 4. Product Review Checklist

Before accepting any implementation, the following checklist must be completed. Every question must receive a "Yes" answer. A single "No" stops the implementation until the issue is resolved.

| # | Question | Yes / No |
| :--- | :--- | :--- |
| 1 | Does this screen help the owner make a better business decision? | |
| 2 | What is the one decision this screen enables? Is it immediately clear? | |
| 3 | Is everything on this screen necessary? Can anything be removed? | |
| 4 | Would a restaurant owner understand this screen in under 10 seconds? | |
| 5 | Does the screen communicate meaning before showing metrics? | |
| 6 | Does the screen feel calm? Would it reduce or increase the owner's anxiety? | |
| 7 | Does this feature save the owner time compared to their current workflow? | |
| 8 | Does this feature contribute to the owner's profitability? | |
| 9 | Does the screen use human language? Are there any technical terms? | |
| 10 | Does every recommendation include its reasoning and expected impact? | |
| 11 | Does every insight lead to an actionable next step? | |
| 12 | Are there no dead ends — does every interaction lead to the next logical step? | |
| 13 | Is the simplest version of this feature being implemented first? | |
| 14 | Does this feature feel like part of the same product as every other screen? | |
| 15 | If this feature did not exist, would the owner notice? | |
| 16 | Does the platform adapt to the owner, or does the owner need to configure it? | |
| 17 | Is the feature excellent, or does it need more refinement? | |
| 18 | Does the feature respect the owner's autonomy and avoid judging their decisions? | |
| 19 | Is this feature future-compatible — can new data sources be added without redesign? | |
| 20 | Does the feature pass the Golden Rule? | |

**How to use this checklist:**

1. Every proposed feature or screen must be reviewed against this checklist before implementation begins.
2. Each question must receive a clear Yes or No. "Maybe" is not an acceptable answer.
3. If any question receives a No, the feature must be redesigned until all questions pass.
4. The checklist is not negotiable. Exceptions require Héctor's direct approval.

---

## 5. Product Review Score

Every screen and feature receives a Product Review Score. This score is used to evaluate whether the feature is ready for implementation and to track the product's overall quality over time.

### Scoring Categories

Each category is scored from 1 to 10.

| Category | Weight | Description |
| :--- | :--- | :--- |
| **Clarity** | 20% | Can the owner understand this screen in under 10 seconds? Is the purpose obvious? |
| **Decision Support** | 20% | Does the screen enable a clear, specific business decision? |
| **Trust** | 15% | Does the screen feel reliable? Would the owner trust the information? |
| **Visual Calm** | 15% | Does the screen feel calm? Is there visual noise or competition for attention? |
| **Storytelling** | 10% | Does the screen tell a story? Does meaning come before metrics? |
| **Consistency** | 10% | Does the screen feel like part of Restaurant OS? Would it feel out of place? |
| **Simplicity** | 10% | Is this the simplest version that delivers value? Can anything be removed? |

### Scoring Scale

| Score | Meaning |
| :--- | :--- |
| **10** | Perfect. No improvement possible. |
| **9** | Excellent. Minor refinements possible but not required. |
| **8** | Very good. Clear value. Some minor issues. |
| **7** | Good. Solid value. Some improvements recommended. |
| **6** | Adequate. Passes the Golden Rule but needs refinement. |
| **5** | Borderline. Passes the Golden Rule weakly. Needs improvement. |
| **1–4** | Fails. Does not pass the Golden Rule. Redesign required. |

### Calculating the Final Score

```
Final Score = (Clarity × 0.20) + (Decision Support × 0.20) + (Trust × 0.15)
            + (Visual Calm × 0.15) + (Storytelling × 0.10) + (Consistency × 0.10)
            + (Simplicity × 0.10)
```

### Interpreting the Score

| Final Score | Decision |
| :--- | :--- |
| **9.0 – 10.0** | Ready for implementation. |
| **7.0 – 8.9** | Ready for implementation with notes for future refinement. |
| **5.0 – 6.9** | Requires redesign. Address weaknesses before implementation. |
| **Below 5.0** | Rejected. Does not meet Restaurant OS standards. |

### Minimum Acceptable Score

**7.0** is the minimum acceptable score for any feature entering the product.

Features scoring between 5.0 and 6.9 may be approved for prototype or demo purposes only, with a clear path to reaching 7.0 before production release.

---

## 6. Product Kill Criteria

A feature should NOT be built if it meets any of the following criteria:

### Criterion 1 — Only Adds Visual Complexity

The feature looks impressive but adds no decision-making value. Charts, visualizations, and animations that do not help the owner decide belong in this category.

*Example: An animated 3D chart showing sales trends with no recommendation attached.*

### Criterion 2 — No Measurable Value

The feature cannot demonstrate how it improves the owner's business outcomes. If the team cannot articulate how success will be measured, the feature should not be built.

*Example: A customer satisfaction score with no action path and no clear relationship to revenue or retention.*

### Criterion 3 — No Decision Support

The feature does not help the owner make a better decision. It presents information without enabling action.

*Example: A page showing raw order data in a table with no summary, no insights, and no recommended actions.*

### Criterion 4 — Duplicates Another Feature

The feature overlaps with an existing capability. The same decision is already supported by another screen or interaction.

*Example: A separate "Reports" page that duplicates information already available in the Daily Brief.*

### Criterion 5 — Requires Explanation to Understand

The feature cannot be understood without onboarding, tooltips, documentation, or training. If a restaurant owner cannot understand it in 10 seconds, it is too complex.

*Example: A multi-step funnel visualization with filters, segments, and comparison periods.*

### Criterion 6 — Looks Impressive but Solves Nothing

The feature creates a "wow" reaction during demos but does not change the owner's daily experience. It is built to impress investors, not to help owners.

*Example: A real-time order map showing delivery driver locations with animated movement.*

### Kill Criteria Protocol

If a proposed feature meets any kill criterion:

1. The feature is automatically rejected.
2. The team documents which criterion was triggered and why.
3. The feature may be re-proposed only if the triggering criterion is addressed in the redesign.
4. If a feature triggers the same criterion twice, it is permanently removed from consideration.

---

## 7. Decision Framework

Every proposed feature must answer the following five questions before entering the roadmap.

### Question 1 — What Problem Does It Solve?

Describe the specific, measurable problem the owner faces. This is not a feature description. It is a problem statement.

*Good: "The owner cannot tell whether afternoon traffic is declining until it has been declining for a week."*

*Bad: "We need an afternoon traffic dashboard."*

### Question 2 — What Decision Does It Improve?

Name the specific decision the owner will make better because of this feature.

*Good: "The owner will decide whether to launch an afternoon promotion based on data, not gut feel."*

*Bad: "The owner will see more data about afternoon traffic."*

### Question 3 — How Does It Save Time?

Quantify the time savings. If the feature does not save time, it must save money or reduce risk.

*Good: "The owner currently spends 15 minutes per day reviewing afternoon performance. This feature reduces it to 30 seconds."*

*Bad: "It makes information easier to find."*

### Question 4 — How Does It Increase Profit?

Estimate the financial impact. This can be direct (revenue) or indirect (cost savings, reduced waste, higher retention).

*Good: "This feature is expected to recover 12–18% of lost afternoon revenue, approximately $3,200 per month."*

*Bad: "It helps the owner make better decisions."*

### Question 5 — How Will Success Be Measured?

Define the metric that will determine whether the feature is working. This metric must be observable within 30 days of launch.

*Good: "Success = afternoon order volume increases by ≥10% within 30 days of the first experiment being created through this feature."*

*Bad: "Success = the owner uses the feature."*

### Decision Framework Protocol

1. If any question cannot be answered with specificity, the feature requires more research before it can enter the roadmap.
2. If all five questions are answered, the feature is evaluated against the Product Review Checklist and scoring model.
3. Features that pass the checklist and score ≥7.0 enter the roadmap.
4. Features that score ≥7.0 but have lower confidence answers (estimates rather than data) enter the roadmap as experiments with clear evaluation periods.

---

## 8. Product Culture

Restaurant OS should be built with a specific culture. These are not HR values. They are engineering and design practices that protect the product's quality.

### Small Iterations

Build the smallest version of every feature that delivers value. Do not speculate about future requirements. Add complexity only when the need is proven by usage data, not by assumptions.

Every feature starts as a hypothesis. The first iteration tests the hypothesis. Subsequent iterations refine based on evidence.

### Frequent Reviews

Every feature is reviewed at three stages:

1. **Before implementation.** Against the Product Review Checklist and scoring model.
2. **During implementation.** Against the principles. Are we still building what we designed?
3. **After launch.** Against the success metrics. Did it work? What did we learn?

Reviews are not gatekeeping. They are quality assurance. The goal is not to say "no." The goal is to ensure that everything that ships meets Restaurant OS standards.

### Continuous Refinement

A feature is never finished. It is ready for the current iteration. Every feature should improve over time as the team learns more about what the owner needs and how they use the platform.

Refinement does not mean adding features. It often means removing them — simplifying screens, reducing options, deleting elements that do not serve the owner's decisions.

### Experience Before Implementation

Define the experience before writing any code. The experience is the product. Code is just the implementation.

Every feature starts with documentation: what the owner sees, what they feel, what they decide, what they do next. Only after the experience is defined does implementation begin.

### Quality Before Quantity

A feature that is excellent is worth more than ten features that are adequate. Restaurant OS should be known for the quality of its few capabilities, not the quantity of its many.

This means saying no to good ideas. Not because they are bad, but because they would dilute the product's focus. Restaurant OS is built one excellent feature at a time.

### Long-Term Thinking

Every decision considers the platform's trajectory, not just the current task. Will this decision make Restaurant OS easier or harder to improve next year?

Short-term convenience never justifies long-term architectural debt. The platform is built to serve thousands of restaurants for years. Every line of code, every data model, every API contract is designed with this horizon in mind.

---

## 9. Founder Questions

Before approving any feature, Héctor should ask the following questions. These are the final filter — the last check before a feature enters the roadmap or a screen goes to implementation.

### The Essential Questions

**Would Antonio use this tomorrow?**

Antonio is a restaurant owner. He is busy, stressed, and has no time for tools that are not immediately useful. If Antonio would not open this feature tomorrow, it should not be built.

**Would he pay for this?**

Not hypothetically. Would he look at this feature and feel that it justifies the platform's cost? If the feature would not affect his willingness to pay, it is not delivering enough value.

**Would he notice if we removed it?**

If the feature disappeared and no one noticed, it should never have been built. Every feature must earn its existence by being missed when absent.

**Does this make Restaurant OS feel more intelligent?**

The platform should feel progressively smarter over time. Does this feature contribute to that feeling, or is it neutral? Features that make the platform feel dumber should be removed immediately.

**Does this reduce stress?**

The feature should leave the owner feeling less anxious than before they used it. If a feature creates stress — through complexity, urgency, or information overload — it is failing its purpose.

### The Deeper Questions

**Would I show this to a restaurant owner I respect?**

If the answer is no, the feature is not ready. Design it until you would be proud to demonstrate it to someone whose opinion matters.

**Does this make the product simpler or more complex?**

If the answer is "more complex," the feature needs stronger justification. The platform's trajectory should always be toward simplicity, even as capabilities expand.

**In five years, will this decision look right?**

Long-term thinking requires asking whether today's decision will hold up. If there is doubt, defer the decision until there is clarity.

**Is this the best use of our team's time right now?**

Resources are finite. This question forces prioritization. Even a good feature may not be the right feature to build right now.

### The Final Question

**Does this pass the Golden Rule?**

*Every screen must help the owner make one better business decision.*

If the answer is no, nothing else matters. The feature does not belong in Restaurant OS.

---

## 10. Closing Manifesto

Restaurant OS is not measured by the number of features.

It is measured by the number of better decisions it creates.

Every screen should reduce uncertainty. When the owner opens the platform, they should know more than they knew before. Not about the software — about their restaurant.

Every recommendation should create confidence. The owner should trust that the platform has done the work of analysis, prioritization, and reasoning before presenting a suggestion.

Every interaction should save time. The owner's attention is finite and valuable. The platform respects that by being fast, focused, and finished when the owner wants it to be.

Every metric should have meaning. A number without context is noise. A number with context is a decision waiting to be made.

Every feature should earn its existence. If a feature does not help the owner make a better decision, it does not belong.

Technology is invisible.

The owner's success is visible.

Restaurant OS exists to help one person — a restaurant owner — run their business with less anxiety and more confidence. Not through magic. Through discipline. Through principles that every decision is measured against.

These principles are the product.

Features are just the expression.

---

*End of Product Principles — Restaurant OS Operating Manual*
