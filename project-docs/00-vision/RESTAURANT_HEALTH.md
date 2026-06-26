# Restaurant Health — Product Definition

---

## What Is Restaurant Health?

Restaurant Health is the primary indicator of the Restaurant OS platform.

It is not a KPI. It is not a sales metric. It is not a performance score.

Restaurant Health is a business health indicator.

Its single responsibility is to answer one question:

> "How healthy is my restaurant today?"

The answer must be understandable in less than three seconds.

Restaurant Health exists to reduce anxiety. The owner should not have to dig through metrics, open multiple screens, or interpret charts to know whether their business is in good shape. They should see one number — or one state — and immediately understand whether intervention is required.

When the owner opens Restaurant OS, the first thing they should see is their Restaurant Health. If everything is fine, they can move on with their day. If something needs attention, they should know exactly where to look.

Restaurant Health is not a replacement for data. It is a permission structure. It tells the owner when to dig deeper and when to trust that things are under control.

---

## Product Goal

Restaurant Health should allow the owner to know, in seconds:

- **Is everything okay?** A quick pulse check on the entire business.
- **Does something require attention?** A clear signal when something is off.
- **Where should I focus first?** A prioritized entry point into the platform.

Everything else is secondary.

The owner should never have to ask "what does this number mean?" The answer should be self-evident.

The goal is confidence. Not data.

---

## Principles

### Health Is Understandable

The owner must grasp their health state immediately. No interpretation required. No training needed.

### Health Is Actionable

If health is not excellent, the owner should know what to do next. Health always leads to the next action.

### Health Is Transparent

The owner can always see what factors contributed to their health score. No black boxes. No hidden logic.

### Health Is Explainable

Restaurant Health can express in plain language why it reached its conclusion. "Your sales are strong, but delivery delays are increasing."

### Health Is Never Misleading

The system will not report a healthy state when there are active issues. False confidence is worse than bad news.

### Health Should Always Lead to Deeper Insights

Restaurant Health is the entry point. From one number, the owner should be able to navigate to the specific area that needs attention. Health is the surface. Insights are beneath it.

### Health Respects the Owner's Time

The health check takes three seconds. Everything after that is optional.

---

## Health Dimensions

Restaurant Health is composed of multiple dimensions. Each dimension represents one area of the business. No dimension alone determines the overall health — the complete picture emerges from their combination.

### Sales Health

Sales Health measures whether revenue is meeting expectations. It considers current sales velocity, trends, and comparison against historical baselines. Strong performance here signals that the core business engine is running well.

### Customer Health

Customer Health measures the relationship between the restaurant and its customers. It tracks returning customer rates, new customer acquisition, and overall satisfaction signals. Healthy customer relationships indicate sustainable growth.

### Delivery Health

Delivery Health measures the performance of delivery operations — speed, reliability, channel mix, and platform ratings. Restaurants increasingly depend on delivery, and problems in this area directly affect revenue and reputation.

### Marketing Health

Marketing Health measures whether marketing investments are producing results. It tracks campaign performance, channel efficiency, and customer acquisition costs. Healthy marketing means the restaurant is reaching new audiences effectively.

### Operations Health

Operations Health measures internal efficiency — order accuracy, preparation times, staffing coverage, and kitchen throughput. Operational problems eventually affect every other dimension.

### Experiment Health

Experiment Health measures whether the business is actively learning. It tracks the number of active experiments, their progress, and whether the learning cycle is moving. An unhealthy experiment pipeline means the business is not improving.

### Future Dimensions

The following dimensions are planned but not yet defined:

- **Inventory Health.** Stock levels, waste rates, supplier performance.
- **Financial Health.** Margins, costs, profitability trends.
- **Reputation Health.** Online reviews, ratings, social sentiment.
- **Team Health.** Staff satisfaction, turnover, training coverage.

Each dimension is defined by its responsibility, not by its formula. The responsibility is the product contract. The formula is implementation detail.

---

## Health States

Restaurant Health expresses its assessment through qualitative states. These states communicate not just data, but emotion.

### Excellent

| The restaurant is performing at its best. |

Sales are strong across all channels. Customer relationships are healthy. No active issues. The owner can feel confident and focus on growth rather than firefighting.

*Emotional signal: Confidence.*

### Healthy

| The restaurant is performing well. |

All major dimensions are stable. Minor issues may exist but do not require immediate attention. The owner should be aware but not concerned.

*Emotional signal: Reassurance.*

### Stable

| The restaurant is operating normally. |

Some dimensions are below target, but nothing is critical. The owner should review recommendations but does not need to take urgent action.

*Emotional signal: Awareness.*

### Needs Attention

| Something requires the owner's focus. |

One or more dimensions are declining or underperforming. The system should clearly indicate which dimension needs attention and what the recommended action is.

*Emotional signal: Focus.*

### Critical

| Immediate action is required. |

A significant problem is affecting the business. Revenue, reputation, or operations are at risk. The owner must act. The system should provide a clear, prioritized action plan.

*Emotional signal: Urgency.*

These states are designed to replace numerical noise with emotional clarity. The owner does not need to know the exact percentage. They need to know how to feel.

---

## User Experience

Restaurant Health must be accessible everywhere the owner needs it.

### Dashboard

The primary home screen. Restaurant Health is the first thing the owner sees — displayed prominently, with supporting dimensions visible at a glance. From here, the owner can tap any dimension to see the underlying insights.

### Mobile

On a phone, Restaurant Health should be even simpler. One number. One state. One tap to the most important action. The mobile experience is about speed, not depth.

### Widget

A home screen widget on the owner's phone shows Restaurant Health without opening the app. The owner glances at their phone and knows everything is fine. No interaction required.

### Watch

On a smartwatch, Restaurant Health becomes a complication. The owner looks at their wrist and sees a single color or number. Green means go. Red means stop and check.

### Notifications

The system should notify the owner only when health changes state. "Your restaurant health has moved from Healthy to Needs Attention." The notification includes the reason: "Delivery delays have increased 40% in the last three days."

The owner should never receive a notification that says everything is fine. Notifications exist for changes that require attention. Silence is the signal that everything is okay.

---

## Product Philosophy

Restaurant Health is not about showing numbers.

Restaurant Health is about communicating confidence.

The traditional approach to business software is to show the owner more data — more charts, more metrics, more reports. The assumption is that more information leads to better decisions. This assumption is false. More information leads to more anxiety, more analysis paralysis, and more time spent interpreting instead of acting.

Restaurant Health inverts this assumption.

Instead of asking "what data does the owner need?", it asks "what does the owner need to feel?"

The answer is confidence.

Confidence that the business is okay. Confidence that problems will be caught early. Confidence that action is clear when it is needed.

Restaurant Health is the confidence layer on top of the data layer. The data still exists. The charts and reports are still available. But the owner does not have to look at them unless they need to.

The single health number is a promise: "I have checked everything. Here is the summary. You can trust it."

---

## Future Engine

Restaurant Health will eventually be powered by a dedicated Health Engine. This section describes its future responsibilities without implementation.

### Inputs

The Health Engine consumes signals from every other engine in the platform: Decision Engine recommendations, Prediction Engine forecasts, Learning Engine outcomes, and raw operational data. It does not generate its own data. It synthesizes what others produce.

### Signals

The engine monitors each health dimension for changes — trends, anomalies, threshold crossings, and prediction shifts. It does not calculate scores from formulas. It assesses health from patterns.

### Decision Layer

When signals indicate a change, the engine determines whether the overall health state should shift. It considers interactions between dimensions: a small sales dip combined with healthy delivery may be irrelevant, but the same dip combined with declining customer health may be critical.

### Output

The engine produces three outputs:

1. **Health state.** One of five qualitative states.
2. **Health dimensions.** The current state of each dimension.
3. **Primary action.** The single most important thing the owner should do.

The engine does not produce a precise numerical score. It produces a clear, actionable assessment.

---

## Future Evolution

Restaurant Health is designed to absorb new data sources without changing the owner's experience.

### Weather

Weather data could contextualize sales patterns — a rainy day with lower sales is not a health issue. The engine learns to separate weather-driven variation from genuine health changes.

### Seasonality

Seasonal patterns are normalized so that a typical summer slowdown is not mistaken for declining health. The owner sees health relative to expectations, not absolute numbers.

### Events

Local events, holidays, and community activities affect restaurant traffic. The engine accounts for these when assessing health.

### Inventory

Inventory levels and waste rates feed into Operations Health, flagging potential issues before they affect service.

### Customer Satisfaction

Review scores, survey responses, and social media sentiment contribute to Customer Health and Reputation Health.

### Google Reviews

Review volume, average rating, and recent sentiment trends feed into Reputation Health. A sudden drop in reviews is a health signal regardless of sales performance.

### Delivery Platforms

Platform-specific data — ratings, completion rates, and average preparation times — feed into Delivery Health.

### Marketing Campaigns

Active campaign performance feeds into Marketing Health. Underperforming campaigns are surfaced as recommendations, not health penalties.

Each new data source connects through an adapter. The Health Engine's interface remains stable. The owner's experience remains unchanged. Only the accuracy improves.

---

## Relationship with Other Engines

Restaurant Health does not replace the other engines. It consumes them.

### Decision Engine

The Decision Engine provides the data foundation. Health reads recommendations, insights, and experiment data through the Decision Engine's API.

### Recommendation Engine

The Recommendation Engine generates proactive suggestions. Health uses these to determine whether the business is actively improving. A healthy business has a healthy recommendation pipeline.

### Prediction Engine

The Prediction Engine anticipates future problems. Health incorporates these predictions to flag risks before they materialize. A dimension may be healthy today but flagged as "needs attention" because the prediction engine sees a decline coming.

### Learning Engine

The Learning Engine captures experiment outcomes. Health measures whether the business is learning over time. An unhealthy experiment pipeline eventually affects overall health.

### Notification Engine

The Notification Engine delivers health state changes to the owner. Notifications are the bridge between the Health Engine's assessment and the owner's awareness.

---

## Product Examples

### Example 1: Excellent Health

```
Restaurant Health

96
Excellent

Sales strong across all channels
Delivery performance healthy
Customer retention improving
One recommendation available (low priority)
```

What the owner feels: *"Everything is fine. I can focus on growth today."*

### Example 2: Needs Attention

```
Restaurant Health

68
Needs Attention

Afternoon sales declining 18% week-over-week
Delivery delays increasing (avg +12 min)
Marketing campaign underperforming (-40% ROAS)
One experiment ready for review
```

What the owner feels: *"I need to look at afternoon sales and delivery. Let me start there."*

### Example 3: Critical

```
Restaurant Health

42
Critical

Delivery ratings dropped to 3.2 stars
Order completion rate at 72%
Customer health declining for 5 consecutive days
No active experiments
```

What the owner feels: *"I need to fix delivery immediately. Drop everything else."*

### Why These Examples Matter

Each example demonstrates the core product principle: the owner knows exactly what to do and how to feel.

In the first example, they do nothing — which is the correct action.

In the second, they know where to focus and trust that the system has prioritized correctly.

In the third, they know the urgency and the domain. They do not need to investigate to understand the severity.

This is the difference between data and decisions. Data says "delivery ratings are 3.2." Restaurant Health says "your restaurant needs you right now."

---

## Closing Statement

Restaurant Health should become the first thing every restaurant owner checks every morning.

Not because they have to. Because they want to.

Because it gives them confidence. Because it tells them, in less than three seconds, whether their business is okay. Because it reduces the anxiety of running a restaurant to a single, clear signal.

The owner does not need more data. They need less uncertainty.

Restaurant Health is not the end of the journey. It is the beginning. From one number, the owner navigates to insights, actions, experiments, and learning. It is the front door to the entire platform.

One day, the owner will open Restaurant OS, see their health state, and know exactly what kind of day they are going to have.

That is the product.
