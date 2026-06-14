# PRODUCT VISION — Tony's Burger to SaaS Platform

**Status:** Approved
**Last Updated:** 2026-06-13
**Supersedes:** VISION.md (original website scope absorbed as Phase 1)

---

## Purpose

This document defines the permanent product vision for Tony's Burger across all future phases. It prevents roadmap drift by establishing what we build, in what order, and why. Every future task must align with this vision.

---

## Guiding Principles

1. **Data before automation.** Do not automate what you cannot measure.
2. **Insights before AI.** Do not build bots before you understand user behavior.
3. **Value before scale.** Do not build a platform until one business proves the model.
4. **Knowledge, not scripts.** Store structured knowledge. Generate responses dynamically.
5. **Progressive commitment.** Each phase unlocks the next. Do not skip.

---

## PHASE 1 — Premium Restaurant Website

**Current status.** Already built.

### Goals
- Premium brand presence that communicates quality before the first bite
- Flawless mobile experience (80%+ of traffic)
- WhatsApp-based conversion with zero friction
- Product storytelling through scroll-driven narrative

### What Exists
| Asset | Detail |
| :--- | :--- |
| Dark premium theme | Red/gold identity, charcoal textures, smoke overlays |
| Hero section | "HAMBURGUESAS AL CARBÓN" with moody atmosphere |
| Featured Burgers | 3 signature cards with pricing |
| Burger Assembly Story | 7-stage scroll reveal of ingredients |
| Menu Preview | 6-item menu grid with categories |
| Gallery | 6 premium food/atmosphere photographs |
| Testimonials | 3 customer reviews |
| Location + CTA | WhatsApp ordering, address, hours |
| Navbar + Footer | Persistent navigation, social links |

### Success Metrics
- Lighthouse performance score ≥ 85
- Zero console errors on all viewports
- All sections render without layout shift
- Scroll-triggered animations fire correctly

### Exit Criteria
- Production deployment
- Verified responsive on desktop, tablet, mobile
- All lint/type/build checks passing

---

## PHASE 2 — Conversion Optimization

### Goals
- Reduce friction between desire and action
- Increase CTA click-through rate
- Decrease time-to-order

### Planned Changes
| Change | Expected Impact |
| :--- | :--- |
| Persistent floating CTA button | Visible on every section — user can order at moment of peak desire |
| Reduced Assembly scroll length | 350vh → 200vh — less scroll fatigue before CTA |
| Move testimonials earlier | Slot 3 instead of slot 7 — social proof before long narrative |
| Dietary badges on menu cards | Faster decision for dietary-restricted users |
| Hero image differentiation in Assembly | Fresh visuals prevent fatigue from repeated imagery |

### Success Metrics
- CTA click rate ≥ 3% of all visitors
- WhatsApp button tap rate measurable
- Page scroll depth ≥ 60% reaching CTA section
- Bounce rate ≤ 45%

### Exit Criteria
- All conversion changes implemented
- A/B test framework ready
- Baseline metrics captured

---

## PHASE 3 — Analytics Foundation

### Goals
- Measure real user behavior
- Establish data-driven decision making
- Prepare for insights generation

### Events to Track
| Event | Trigger | Purpose |
| :--- | :--- | :--- |
| `page_view` | Every page load | Traffic volume, referrers, device mix |
| `menu_click` | Any burger card click | Product popularity, category preference |
| `whatsapp_click` | WhatsApp CTA click | Conversion rate, peak order times |
| `cta_click` | Any CTA button click | Conversion funnel measurement |
| `assembly_stage_reached` | Each Burger Assembly stage | Engagement depth with scroll narrative |
| `gallery_view` | Gallery image click | Visual content engagement |

### Implementation Principles
- Privacy-first: no PII, no cookies required, anonymized
- Use privacy-compliant analytics (no Google Analytics default)
- Events are atomic and semantic (not UI-coupled)
- All events documented in a single event registry

### Success Metrics
- All 6+ events firing correctly
- No data leakage (PII, unnecessary data)
- Event pipeline verified across desktop and mobile
- Data accessible via dashboard or export

### Exit Criteria
- Event tracking verified in production
- One week of clean data collected
- Dashboard or export showing data

---

## PHASE 4 — Business Insights

### Goals
- Transform raw analytics into actionable reports
- Help business owners make data-informed decisions
- Identify popular products, peak hours, and growth opportunities

### Reports to Generate
| Report | Data Source | Business Question Answered |
| :--- | :--- | :--- |
| Most Viewed Products | `menu_click` events | What should be featured? What's underperforming? |
| Most Clicked CTAs | `cta_click`, `whatsapp_click` | Which CTA drives most conversions? |
| Traffic Sources | `page_view` referrer data | Where do customers discover us? |
| Engagement Trends | All events over time | Are we improving week over week? |
| Scroll Depth Analysis | `assembly_stage_reached` | Where do users drop off? Which sections underperform? |
| Peak Order Times | `whatsapp_click` timestamp | When should we staff more? When to run promos? |

### Success Metrics
- 5+ reports generated weekly
- At least one business decision informed by data per month
- Report accuracy verified against raw data

### Exit Criteria
- Reports automated (no manual data pull)
- Dashboard or scheduled delivery active
- Business owner has viewed and acted on at least one report

---

## PHASE 5 — TonyBot MVP

### Goals
- Answer customer FAQs without human intervention
- Recommend products based on user preferences
- Assist with menu navigation and ingredient questions
- Must use Knowledge Engine architecture (structured knowledge, not scripts)

### Scope
| Feature | Description | Priority |
| :--- | :--- | :--- |
| FAQ answering | Hours, location, dietary info, policies | P1 |
| Product recommendations | "What's the spiciest burger?", "I want something like the Classic but with bacon" | P1 |
| Menu assistance | Ingredients, allergens, customizations | P1 |
| Order status | "Where's my order?" (post-analytics integration) | P2 |

### Architecture Constraints
- All knowledge stored as structured data (products, promotions, business facts, rules)
- No hardcoded conversational responses
- Response generation is dynamic at runtime
- Chatbot is a consumer of the Knowledge Engine, not a standalone system

### Success Metrics
- FAQ resolution rate ≥ 80% without human escalation
- Product recommendation acceptance rate ≥ 40%
- TonyBot handles ≥ 50% of all customer inquiries

### Exit Criteria
- TonyBot live on website
- Knowledge Engine populated with Tony's Burger data
- Fallback to human when bot cannot answer

---

## PHASE 6 — Knowledge Engine

### Principles
- **Store facts, not responses.** The engine stores business truths. Conversations are generated from these truths.
- **Store business rules, not scripts.** Rules define behavior (e.g., "If customer asks about spice level, recommend Inferno"). Scripts are never stored.
- **Store recommendations, not conversations.** Recommendation logic is rule-based or ML-based. The engine provides the data; the consumer formats the response.
- **Generate responses at runtime.** Every user interaction produces a unique response assembled from structured knowledge.

### Knowledge Schema (Initial)
| Entity | Fields | Example |
| :--- | :--- | :--- |
| Product | name, description, price, category, ingredients, allergens, spice_level, dietary_tags | The Classic, $14.99, Signature, [beef, cheddar, onion] |
| Business | hours, location, phone, social_links, delivery_zones, policies | Mon-Sat 11AM-10PM |
| Promotion | name, description, discount, valid_until, conditions | Happy Hour, 20% off, 3-6PM |
| Rule | trigger_condition, action, priority | "spice inquiry → recommend Inferno" |

### Success Metrics
- Knowledge Engine powers TonyBot (Phase 5)
- Adding a new business requires only populating the schema — no code changes
- Knowledge updates take effect immediately (no redeploy)

### Exit Criteria
- Knowledge Engine extracted as standalone module (not coupled to Tony's Burger UI)
- API surface defined and documented
- At least one external consumer (TonyBot) integrated

---

## PHASE 7 — Multi-Business Platform

### Support
| Business Type | Example | Profile Differences |
| :--- | :--- | :--- |
| Burger shops | Tony's Burger | Core profile — burgers, fries, shakes |
| Pizza shops | Pizza place | Different product schema (size, toppings, crust) |
| Taco shops | Taqueria | Different categories, combo meals, salsas |
| Cafés | Coffee shop | Beverages, pastries, breakfast menu |

### Architecture
- Shared platform codebase
- Per-business knowledge profiles
- Per-business theme/branding
- Per-business analytics and insights

### What Stays Shared
- Website framework (Next.js)
- UI Kit components
- Knowledge Engine
- Analytics pipeline
- Insights generation

### What Becomes Per-Business
- Knowledge profile (products, rules, business info)
- Brand theme (colors, typography, imagery)
- Domain/subdomain

### Success Metrics
- Second business onboarded and verified
- Onboarding a new business takes ≤ 1 week
- Shared code constitutes ≥ 70% of total platform

### Exit Criteria
- Minimum 2 businesses live on platform
- Onboarding documented and repeatable

---

## PHASE 8 — SaaS Platform

### Vision
AI-powered business growth platform for food businesses.

### What We Are NOT
- **Not a POS system** — we do not process payments
- **Not an ERP** — we do not manage inventory, supply chain, or accounting
- **Not an inventory system** — we do not track stock levels
- **Not accounting software** — we do not generate financial reports

### What We ARE
- **Website platform** — premium, customizable website for food businesses
- **Analytics engine** — understand customer behavior, popular products, peak times
- **AI assistant** — TonyBot-powered customer engagement for every business
- **Insights dashboard** — actionable business intelligence for owners
- **Growth tools** — promotional campaigns, menu optimization, customer engagement

### Business Model
| Tier | Features | Target |
| :--- | :--- | :--- |
| Starter | Website + WhatsApp ordering | Single-location restaurants |
| Growth | + Analytics + Insights | Growing restaurants |
| Pro | + TonyBot + Promotions | High-volume restaurants |
| Enterprise | + Multi-location + Custom branding | Chains and groups |

### Success Metrics
- 10+ paying businesses on platform
- Monthly recurring revenue established
- Customer acquisition cost ≤ 3 months of subscription
- Churn rate ≤ 5% monthly

### Exit Criteria
- Self-service onboarding
- Public pricing page
- Payment integration live

---

## Success Metrics Summary

| Phase | Primary Metric | Target |
| :--- | :--- | :--- |
| 1 — Website | Build passes, all sections render | ✓ Complete |
| 2 — Conversion | CTA click rate | ≥ 3% |
| 3 — Analytics | Events firing correctly | 6+ events |
| 4 — Insights | Business decisions informed | ≥ 1/month |
| 5 — TonyBot | FAQ resolution rate | ≥ 80% |
| 6 — Knowledge Engine | New business code changes | Zero |
| 7 — Multi-Business | Businesses on platform | ≥ 2 |
| 8 — SaaS | Paying businesses | ≥ 10 |

---

## Roadmap Alignment

This product vision extends beyond the original ROADMAP.md (Phases 0–10, which cover only the website build). The relationship is:

```
ROADMAP.md (Technical Build)
  Phase 0-10 → DELIVERS → PRODUCT VISION Phase 1 (Website)

PRODUCT_VISION.md (Product Evolution)
  Phase 1  ← ROADMAP 0-10
  Phase 2  ← Conversion (new)
  Phase 3  ← Analytics (new)
  Phase 4  ← Insights (new)
  Phase 5  ← TonyBot (new)
  Phase 6  ← Knowledge Engine (new)
  Phase 7  ← Multi-Business (new)
  Phase 8  ← SaaS (new)
```

Once ROADMAP Phase 10 (Deployment) is complete, the project transitions entirely to PRODUCT_VISION phasing.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| Phase skipping (building AI before analytics) | Medium | High | ADR-007 enforces order; governance review at each phase gate |
| Scope creep into POS/ERP territory | Medium | High | PRODUCT_VISION explicitly defines what we are NOT |
| Single-business design prevents multi-business | Low | High | Knowledge Engine extracted early (Phase 6) prevents coupling |
| Analytics privacy regulations | Medium | Medium | Privacy-first from Phase 3; no PII, no cookies |
| TonyBot reduces human touch | Low | Medium | Fallback to human; positioned as assistant, not replacement |

---

## References

| Document | Purpose |
| :--- | :--- |
| `../01-foundation/VISION.md` | Original website vision (subsumed by Phase 1) |
| `../01-foundation/ROADMAP.md` | Technical build roadmap (Phases 0-10) |
| `../06-adr/records/ADR_007_product_direction.md` | ADR documenting this vision as official direction |
