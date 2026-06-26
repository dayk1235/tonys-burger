# Restaurant OS — Design Language

---

## 1. Design Philosophy

Restaurant OS is not a dashboard. It is a Business Copilot.

A dashboard presents information and expects the user to interpret it. It is a tool for analysts — people whose job is to read charts and draw conclusions. A restaurant owner is not an analyst. They are a business operator. They do not have time to interpret. They need to understand.

The interface should reduce anxiety. Never increase it.

Every screen, every notification, every interaction must leave the owner feeling more in control than before they opened the platform. If the owner closes Restaurant OS feeling confused, overwhelmed, or uncertain, the design has failed.

The product should communicate: *"I understand your business."*

Instead of: *"Here are your reports."*

This is the fundamental difference between a dashboard and a copilot. One hands the owner raw materials and expects them to build. The other hands them a finished assessment and says: "Here is what I found. Here is what I recommend. You decide."

---

## 2. Emotional Goals

Restaurant OS is designed to generate specific emotions in the owner. Every design decision is evaluated against these goals.

### Confidence

The owner should trust that the platform has their back. They are not missing anything important. If something needs attention, the platform will tell them. If everything is fine, the platform will stay quiet. Confidence comes from reliability — the platform is always correct, always honest, always on their side.

### Calm

The platform never rushes the owner. It never overwhelms them with information. It presents one message at a time, in the right dose, at the right moment. Calm comes from pacing — the platform knows when to speak and when to stay silent.

### Focus

When something needs attention, the platform makes it obvious. The owner never wonders where to look or what matters most. Focus comes from prioritization — the platform has already done the work of sorting signal from noise.

### Clarity

Every screen communicates one clear message. The owner never asks "what am I looking at?" Clarity comes from restraint — the platform shows less so the owner understands more.

### Trust

The platform is transparent about its reasoning. It explains why it is recommending something. It admits uncertainty. It never pretends to know more than it does. Trust comes from honesty — the platform earns confidence by being truthful.

### Curiosity

The platform makes the owner curious about their own business. "I wonder what would happen if I tried that." "I did not realize my afternoon traffic was that strong." Curiosity comes from insight — the platform shows the owner something they did not see on their own.

### Celebration

When things go well, the platform acknowledges it. Quietly. Never with exaggeration. Never with gamification. A simple confirmation that the business is performing well. Celebration comes from appreciation — the platform notices when the owner is doing something right.

---

## 3. Product Personality

If Restaurant OS were a person, it would be:

Calm. The person who never raises their voice. Who always has the situation under control. Who speaks slowly and clearly, even in a crisis.

Professional. The person who has done this before. Who knows the restaurant industry. Who has seen every problem and knows what works.

Helpful. The person who offers solutions before being asked. Who anticipates needs. Who says "I noticed this — here is what I think we could do."

Never dramatic. Even when something is critical, there is no panic. The seriousness is communicated through clarity and urgency, not through alarm.

Never robotic. The platform speaks like a person. Natural sentences. Restaurant language. No corporate jargon, no technical terms, no analytics speak.

Never overwhelming. The platform gives the owner exactly what they need, when they need it. Nothing more.

Always explains. Every recommendation includes reasoning. Every assessment includes context. The owner always knows why.

Never blames. The platform never implies the owner made a mistake. It frames problems as opportunities. "We could improve this" instead of "this went wrong."

Always proposes solutions. Every observation includes a next step. The platform never identifies a problem without suggesting a path forward.

---

## 4. Tone of Voice

Restaurant OS speaks in natural, restaurant-friendly language. It avoids technical jargon, corporate speak, and analytics terminology.

### What to Avoid

Technical language: "API rate limit exceeded," "Data sync failed," "Cache miss detected."

Corporate language: "Leverage core competencies," "Optimize synergies," "Drive paradigm shifts."

Analytics jargon: "Conversion rate decreased 240 basis points," "MAU declined 8.4%," "CAC increased."

### What to Prefer

Natural language: "We could not reach the delivery platform," "Your menu might need updating."

Simple explanations: "Afternoon orders dropped this week. This happened last month too. A lunch special might help."

Business language: "Sales were slow this afternoon," "You may need to reorder beef."

Restaurant language: "The kitchen was quieter than usual between 2 and 5 PM."

### Examples

BAD: "Sales decreased 8.4% compared to the previous period."

GOOD: "This afternoon was quieter than usual."

BAD: "Customer acquisition cost increased 12%."

GOOD: "It cost more to attract new customers this month."

BAD: "Inventory threshold reached for protein category."

GOOD: "You may need to reorder beef tomorrow."

BAD: "Channel mix optimization recommended."

GOOD: "More customers are ordering delivery. You could feature delivery-only specials."

BAD: "Anomaly detected in afternoon conversion rate."

GOOD: "Something changed in afternoon orders. They dropped more than usual."

BAD: "Experiment completion alert."

GOOD: "Your Smash Double experiment is ready for review."

BAD: "System health: nominal."

GOOD: "Everything is running smoothly."

BAD: "KPI variance outside acceptable range."

GOOD: "Monday sales were lower than expected. A weekend promotion might help."

---

## 5. Meaning Before Metrics

This principle — LAW-009 in the Product Laws — governs every screen in Restaurant OS.

The rule is simple: every screen must first communicate its meaning in plain language. Only then should it expose supporting numbers.

### How It Works

The owner looks at a screen and immediately knows:

1. What is being communicated.
2. Whether it is good or bad.
3. What to do next.

Only after establishing context does the platform show the raw numbers.

### Bad Examples

```
Afternoon Orders

Current: 6
Target: 12
Change: -18%
```

This is data without meaning. The owner has to interpret what "6" means, whether "-18%" is good or bad, and what they should do about it.

### Good Examples

```
Afternoon sales were slower than usual.

You had 6 orders between 2 and 5 PM — 18% fewer than last week.

A Happy Hour promotion could recover this lost revenue.

[Try Afternoon Happy Hour →]
```

The owner understands the situation before they see a single number. The number exists only to confirm what the words have already communicated.

### Another Example

```
Delivery delays are increasing.

Orders are taking 12 minutes longer than two weeks ago.

Customers may notice the difference soon.

[Review Delivery Performance →]
```

The meaning comes first. The supporting data is optional. The owner can act without ever seeing a chart.

### Another Example

```
Your Smash Double experiment is ready.

It ran for 7 days and showed a 12% improvement in conversion.

You can review the results or start a new experiment.

[Review Results →] [New Experiment →]
```

The outcome is stated before the metric. The number is context for the story, not the story itself.

---

## 6. Living System

Restaurant OS should never feel static. It is not a report that was generated last night. It is a living presence that is aware of the restaurant right now.

### How It Feels

When the owner opens the platform, they should feel that the system has been watching the restaurant continuously. Data updates feel fresh. Activity feels current. The platform breathes.

### Presence Signals

Every screen communicates aliveness through subtle signals:

"Recently updated moments ago."

"Last order placed 45 seconds ago."

"Health refreshed 30 seconds ago."

"Delivery platforms synchronized."

"New activity detected since your last visit."

"While you were away, 23 orders were fulfilled."

"Still watching. Everything looks good."

These signals are not notifications. They are ambient presence — the platform quietly reassuring the owner that it is paying attention.

### The Opposite

A static platform communicates neglect. When the owner opens an app and sees data from yesterday, they feel like the system is not working. They lose trust. They stop checking.

A living platform communicates care. The owner trusts that the system is always there, always watching, always ready.

### What Freshness Communicates

- The platform is reliable.
- The platform is working in real time.
- The owner does not need to check — the platform will tell them if something changes.
- Silence is a signal that everything is okay.

### No Implementation

This section describes experience. The actual implementation — polling, WebSockets, periodic refreshes, simulated updates for demo — is an engineering decision. The product requirement is simply that the platform feels alive whenever the owner interacts with it.

---

## 7. Restaurant Health Language

Restaurant Health communicates the overall condition of the restaurant through five states. Each state has a distinct voice.

### Excellent

Tone: Warm. Confident. Minimal.

"Your restaurant is performing at its best. Everything is on track."

The owner feels: *"I do not need to worry about anything today."*

### Healthy

Tone: Reassuring. Calm. Informational.

"Your restaurant is in good shape. A few minor things to keep an eye on, but nothing urgent."

The owner feels: *"Good. I can focus on other things."*

### Stable

Tone: Neutral. Observant. Balanced.

"Your restaurant is operating normally. Some metrics are below target, but nothing critical."

The owner feels: *"I should check the recommendations when I have time."*

### Needs Attention

Tone: Direct. Specific. Actionable.

"Something needs your attention. Afternoon sales have been declining for three days. Here is what we recommend."

The owner feels: *"I need to focus on this area. The platform has a plan."*

### Critical

Tone: Serious. Clear. Prioritized.

"Your restaurant needs you. Delivery ratings have dropped significantly. Orders are being affected. Here is what to do first, second, and third."

The owner feels: *"I need to act now. I know exactly what to do."*

### What the States Share

Every state, from Excellent to Critical, shares the same qualities:

- Clear. The owner never wonders what the state means.
- Actionable. Even Excellent implies the correct action: do nothing.
- Honest. The state reflects reality. It never sugarcoats.
- Calm. Even Critical is communicated without panic. Urgency comes from clarity, not alarm.

---

## 8. Recommendation Language

Restaurant OS always guides. Never commands.

The owner is the decision maker. The platform is the advisor. Recommendations must respect this relationship.

### How to Write Recommendations

Start with the opportunity or observation.

State the expected outcome.

Offer the action as a suggestion.

### Examples

Instead of: "Launch promotion."

Use: "You could increase afternoon traffic by trying an after-lunch Happy Hour. Based on similar restaurants, this could add 15–20 orders per day."

Instead of: "Fix delivery delays."

Use: "Delivery times have increased. Reviewing your menu for prep-time bottlenecks could help. We can track the results."

Instead of: "Run experiment."

Use: "A 7-day test with a Smash Double combo could show us whether upselling works for your customers. We will measure conversion and average ticket."

### What Makes a Good Recommendation

- It names the opportunity.
- It explains the reasoning.
- It states the expected outcome.
- It respects the owner's choice.

### What Makes a Bad Recommendation

- It sounds like an order.
- It lacks reasoning.
- It expects the owner to fill in the gaps.
- It uses technical language.

---

## 9. Alerts

Restaurant OS has a clear alert hierarchy. Every alert answers three questions: Why now? Why me? What should I do?

### Informational

Purpose: Share an update that requires no action.

Tone: Neutral. Brief.

"You have one new recommendation from your Daily Brief."

Frequency: Low. Only when genuinely new information is available.

### Recommendation

Purpose: Suggest an action the owner may want to consider.

Tone: Helpful. Suggestive.

"We noticed afternoon sales declining. A quick experiment could help recover the trend."

Frequency: As recommendations are generated. No more than one per category per day.

### Attention

Purpose: Flag something that needs the owner's input.

Tone: Direct. Specific.

"Your Smash Double experiment is ready for review. Results are available."

Frequency: As experiments complete or milestones are reached.

### Critical

Purpose: Demand immediate attention.

Tone: Serious. Clear. Prioritized.

"Delivery ratings have dropped to 3.2 stars. Customers are reporting longer wait times. We recommend reviewing your delivery process today."

Frequency: Only when a significant problem is detected. Critical alerts are rare by design — if everything is critical, nothing is.

### General Rules

- Every alert answers: *Why now? Why me? What should I do?*
- Alerts are written in natural language, not system language.
- Frequency is limited. The platform respects the owner's attention.
- Silence is a signal. If the owner is not receiving alerts, everything is fine.

---

## 10. Success Moments

Restaurant OS celebrates success quietly. No fireworks. No badges. No gamification.

The owner is a professional running a business. Success is measured in outcomes, not points. The platform's role is to acknowledge progress, not to manufacture excitement.

### Examples

When an experiment shows positive results:

"Your Happy Hour experiment increased afternoon orders by 14%. That is $3,200 in additional revenue over 14 days."

When health reaches Excellent:

"Your restaurant health is at its highest this month. Sales are strong across all channels. No action needed."

When a recommendation leads to improvement:

"After you updated the delivery menu, your platform rating improved from 3.8 to 4.2 stars."

### What Success Sounds Like

Factual. Specific. Grounded in business outcomes.

Never: "Congratulations! You unlocked the Growth Achiever badge!"

Always: "Your afternoon traffic is up 18%. The experiment worked."

### Why Quiet Celebration Matters

The owner's goal is a healthy, profitable restaurant — not a dopamine loop from an app. Restaurant OS celebrates what matters: real business outcomes. The celebration is the result itself. The platform simply confirms what the owner already sees in their numbers.

---

## 11. Visual Philosophy

Restaurant OS communicates through space, not density.

### Whitespace

Content breathes. Cards have generous padding. Sections are separated by space, not lines. The owner's eye rests between elements. Whitespace communicates confidence — the platform does not need to fill every pixel to prove its value.

### Editorial Layouts

Information is laid out like a well-designed publication. Headings are clear. Content flows from most important to least. The reading experience is linear — the owner scans from top to bottom and understands the hierarchy.

### Readable Typography

Type is large enough to read at a glance. Line height is generous. Contrast is comfortable. The owner should never squint or strain.

### Comfortable Spacing

Everything has room. Buttons have padding. Cards have margin. Lists have spacing between items. The interface feels generous, not cramped.

### Minimal Distractions

No decorative elements. No gradients for the sake of beauty. No icons that do not communicate meaning. Every visual element earns its place.

### One Primary Action

Every screen has one primary action the owner should take. That action is visually distinct. All other actions are secondary.

### One Message at a Time

Screens do not compete for attention. One message, one section, one action. The owner processes information sequentially, not simultaneously.

### Why This Matters

A restaurant owner is not sitting at a desk with unlimited time. They are checking the platform between tasks, during a busy day. The visual design must communicate instantly. Clarity is speed. Speed is respect.

---

## 12. Motion Philosophy

Motion in Restaurant OS serves a purpose. It is never decorative.

### Soft

Animations are gentle. Easing curves are relaxed. Nothing snaps, pops, or jerks. The interface moves like a calm conversation — smooth, unhurried, natural.

### Meaningful

Motion communicates change. Content entering the screen means new information has arrived. Content leaving means it is no longer relevant. Elements shifting position means the hierarchy has changed.

### Purposeful

Every animation answers a question: What changed? Where did it go? What should I look at now? The owner should never be surprised by motion — they should be guided by it.

### No Decorative Animations

No loading spinners that spin for show. No confetti. No particles. No parallax. If the motion does not help the owner understand the interface, it does not belong.

### What Motion Communicates

- Element entering the screen: "New information is available."
- Element highlighting: "Look here."
- Element expanding: "More detail is available."
- Smooth transitions: "The context is continuous."
- No motion at all: "Nothing has changed. Everything is fine."

---

## 13. Mobile Philosophy

The owner uses Restaurant OS on mobile in specific contexts. The mobile experience is designed for these moments.

### Contexts

Walking through the restaurant. The owner glances at their phone to check health. They need one number. One color. One second.

Travelling between locations. The owner reviews active experiments and upcoming reviews. They need scannable information, not deep analysis.

Inside the restaurant during service. The owner receives an alert. They need to understand the urgency and the required action in one glance.

Talking with suppliers. The owner checks delivery performance while on a call. They need the answer to a specific question without navigating multiple screens.

Busy. Any context where the owner has limited attention and limited time.

### What Mobile Prioritizes

Health. The single most important signal. The owner opens the app and immediately knows whether their restaurant is okay.

Alerts. If something needs attention, it is the first thing the owner sees. Alerts are written for mobile — short, clear, actionable.

Recommendations. When the owner has time, they can explore recommendations designed for mobile — smaller cards, shorter text, fewer options.

### What Mobile Does Not Do

Mobile does not show dashboards. It does not show charts that require zooming. It does not show tables that require horizontal scrolling. It does not present information that requires interpretation.

If a screen cannot be understood in one glance on a phone, it does not belong on mobile.

---

## 14. Notification Philosophy

Restaurant OS respects the owner's attention. Notifications are a privilege, not a right.

### Every Notification Must Answer

Why now? Why is this notification appearing at this moment? What changed?

Why me? Why does the owner need to know this? What makes this relevant to them?

What should I do? What is the expected next step? What action should the owner take?

### Examples

Bad notification: "Experiment status updated."

Why now? Unclear. Why me? Unclear. What should I do? Unclear.

Good notification: "Your Happy Hour experiment is ready to review. Afternoon orders increased 14%. [Review Results]"

Why now? The experiment finished. Why me? The owner needs to decide what to do next. What should I do? Review the results.

Bad notification: "Data sync complete."

Why now? Unclear. Why me? Unclear. What should I do? Nothing. This notification should not exist.

Good notification: "Delivery platforms synchronized. You can now view Uber Eats performance in your Daily Brief."

Why now? The sync just completed. Why me? The owner can now see delivery data. What should I do? Check the Daily Brief.

### Frequency

Restaurant OS sends fewer notifications than users expect. The goal is not engagement. The goal is reducing anxiety. Every notification that does not require action is noise. The platform filters aggressively.

### Silence Is a Signal

If the owner is not receiving notifications, the message is: everything is fine. No news is good news. The owner should not need to check the app constantly. The platform will notify them when something changes.

---

## 15. Restaurant OS Experience — A Narrative

The owner wakes up at 6:30 AM. They reach for their phone before getting out of bed.

There is one notification on the lock screen:

"Your restaurant opened 30 minutes ago. Everything looks good."

The owner swipes it away. The notification told them what they needed: the restaurant is running. No action required.

At 8:30 AM, driving to the restaurant, the owner glances at their watch. The complication shows a green indicator. Restaurant Health is Healthy. Everything is fine.

At 10:00 AM, the owner opens the dashboard on their laptop. The first thing they see:

"Restaurant Health: Healthy"

Below it, a brief explanation: "Sales are on track. Customer traffic is normal. No issues detected."

The owner scrolls. The Daily Brief shows two recommendations. One is about afternoon traffic — the same pattern the owner noticed last week. The other is about a new customer trend they had not seen.

"I did not realize returning customers were growing that fast."

The owner clicks the returning customer insight. A page opens with an explanation: what is happening, why it matters, possible causes, and a recommended action.

"Create a referral experiment."

The owner clicks "Create Experiment." A page opens with a suggested experiment — pre-filled with parameters, success criteria, and expected outcomes. The owner adjusts the duration from 14 to 21 days. Clicks "Create Experiment."

The experiment is now running.

The owner closes the laptop. They spent less than three minutes in the platform. They learned something about their business. They took one action. They closed the app feeling in control.

At 2:00 PM, a notification arrives:

"Your afternoon traffic is lower than yesterday. Nothing urgent. Worth checking your Daily Brief when you have a moment."

The owner is in the middle of service. They glance at the notification and return to work. They know it is not urgent. The platform told them.

At 8:00 PM, after service, the owner opens the app on their phone. The Daily Brief is waiting. The afternoon traffic recommendation is still there. They tap it.

"We could try an after-lunch Happy Hour. Estimated impact: +12% to +18% afternoon orders."

The owner thinks about it. Decides to review it tomorrow when they have more time. Closes the app.

The owner goes to sleep knowing:

- The restaurant is healthy.
- They have one active experiment running.
- They have one recommendation to evaluate tomorrow.
- If anything changes, the platform will tell them.

The owner feels calm. Not because everything is perfect — because they know what is happening and what to do about it. That is the Restaurant OS experience.

---

## 16. Closing Statement

Restaurant OS exists to help restaurant owners make better decisions with confidence.

It is not a dashboard. It is not an analytics tool. It is not a reporting system. It is a Business Copilot — calm, professional, and always watching.

The product should disappear behind the experience.

The owner should not think about the interface. They should think about their restaurant, their customers, their decisions. The platform is a lens, not a destination. It exists to show the owner something about their business they would not have seen otherwise, and to guide them toward the right action.

Technology is invisible.

Confidence is visible.

When Restaurant OS is working at its best, the owner does not say "this is a great app." They say "I know exactly what to do today."

That is the measure of success.
