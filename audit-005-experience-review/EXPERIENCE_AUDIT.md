# TASK-004C — Experience Audit & Conversion Review

**Date:** 2026-06-13
**Reviewer:** Opencode Agent
**Type:** Holistic experience evaluation (not code review)

---

## Executive Summary

Tony's Burger website is a visually cohesive, dark-themed premium burger brand with strong photography and consistent red/gold identity. The Burger Assembly Story section adds a scroll-driven narrative that reinforces craftsmanship. However, the core issue is **scroll fatigue** — the page is excessively long (~7500+ px on desktop) with 9 stacked sections, each with full-height content. Users must scroll through a significant amount of content before reaching conversion points.

**Primary risk:** Users leave before reaching the final CTA because the storytelling length exceeds typical browsing patience.

**Secondary risk:** The same hero burger image is used 3+ times (Hero, About, Assembly) — reducing the feeling of fresh discovery as users scroll.

---

## 1. Hero Section

| Criteria | Score (1-10) | Notes |
| :--- | :--- | :--- |
| Visual Impact | 8 | Moody dark theme with charcoal texture, smoke overlay, warm glows. Strong first impression. |
| Appetite Appeal | 7 | The burger photo is premium but the dark/moody atmosphere reduces the "bright, fresh" appeal. |
| Brand Presence | 9 | Red/gold scheme, "AL CARBÓN" headline, gold badge — unmistakable brand identity. |
| CTA Visibility | 6 | "Order Now" is gold-on-dark (visible), but both CTAs are below the fold on most viewports. User must scroll to see them. |

**Assessment:** Strong hero. The atmosphere layers (charcoal, smoke, vignette) create depth. The `whitespace-pre-line` headline break ("HAMBURGUESAS\nAL CARBÓN") is effective. The `flex-[1.3]` image dominance works on desktop. On mobile, the image drops below the text, changing the flow — user sees headline first, then scrolls to see the burger.

**Issues:**
- CTA is below fold on mobile (390px viewport needs ~2 scrolls)
- Trust indicators ("Fresh Ingredients", "100% Angus Beef", "Family Owned") are at the very bottom — below the fold on all viewports. Most users won't see them.

---

## 2. Featured Burgers

| Criteria | Score (1-10) | Notes |
| :--- | :--- | :--- |
| Product Presentation | 7 | 3 cards with burger photos, names, descriptions, prices. Clean layout. |
| Information Hierarchy | 8 | Category → Name (heading font) → Description → Price (gold). Logical flow. |
| Scanability | 8 | Grid of 3 at desktop, 2 at tablet, 1 at mobile. Good at-a-glance reading. |

**Assessment:** Solid product showcase. The cards have hover effects (translate up, border glow) that make them feel interactive. 

**Issues:**
- Same 3 burger images are reused in the Menu Preview section below — reduces uniqueness
- No dietary indicators (vegan, gluten-free, spicy) — these would help decision-making
- No "customize" or "add to order" directly from card — requires reaching final CTA

---

## 3. Burger Assembly Story ⭐ (Primary Review Target)

| Criteria | Score (1-10) | Notes |
| :--- | :--- | :--- |
| Memorable | 6 | The progressive reveal concept is good. But using the *same hero image* the user already saw reduces the "new discovery" feeling. |
| Premium Feel | 5 | Clean execution but the clip-path reveal of a single image is technically minimal. No ingredient-specific visuals. |
| Scroll Length | 4 | 350vh for 7 stages (~43vh/stage). Combined with the full page length, this section significantly contributes to scroll fatigue. |
| Stage Meaningfulness | 6 | Copy describes each ingredient well. But visually, all stages just show more of the same burger — no individual ingredient moments. |
| Final Reveal Impact | 3 | The "reveal" shows the exact same hero burger image the user saw 2 sections ago. No surprise, no wow. |
| CTA Earned | 5 | After scrolling through 7 stages, the user gets "Order Now" + "Full Menu". The CTA is earned by patience, not desire. |

**Assessment:** The section works technically but has a fundamental storytelling gap: the visual reveals the *same photo* the hero already showed. A user who scrolled through the hero and featured burgers has already seen this burger. The assembly story would be more impactful if:

- Different burger photography was used (showing the burger being prepared, ingredients spread on the counter, etc.)
- Individual ingredient callouts/pointers appeared on the image
- The final reveal was a *new* visual (cross-section, plated with sides, etc.)

**The sticky layout works correctly.** CSS `sticky top-0 h-screen` keeps content visible while scrolling through the section's 350vh height. The two-column grid collapses properly on mobile.

**Issue:** On first visit, the initial state shows "Scroll to explore" with dim text. The user enters the section and sees:
1. Section header "How It's Made"
2. A sticky area with an empty state (dim text, no burger visible)
3. They must scroll further to trigger stage 0

This means the section header + empty state + stage 0 all need to be scrolled through before any meaningful content appears. This wastes valuable scroll distance.

---

## 4. Gallery

| Criteria | Score (1-10) | Notes |
| :--- | :--- | :--- |
| Supports Trust | 8 | 6 real photos of food, kitchen, drinks, atmosphere. Authentic restaurant photography builds trust. |
| Supports Appetite | 7 | Food photos (burger prep, fries, platter) trigger appetite. Drinks/atmosphere are supportive but don't drive hunger. |
| Supports Authenticity | 8 | "Crafted over flame", "Perfectly golden", "Come as you are" — captions feel genuine. |

**Assessment:** The gallery is one of the strongest sections. 6 high-quality photos with cinematographic captions. The parallax hover effect adds subtle depth. The "eye" icon overlay on hover invites exploration.

**Issues:**
- No lightbox/modal on click — clicking the `onView` handler does nothing (no implementation)
- Captions are hidden until hover — mobile users won't see them (no hover on touch devices)
- Gallery is positioned late in the page (position 5 of 9) — users may not reach it

---

## 5. Testimonials

| Criteria | Score (1-10) | Notes |
| :--- | :--- | :--- |
| Believability | 7 | Named reviews with specific details ("The Smoky BBQ is life-changing") feel realistic. All 5-star ratings reduce credibility. |
| Placement | 5 | Positioned after Gallery (slot 6/9). Social proof works best when placed *before* the user makes a decision — earlier in the page would be more effective. |
| Visual Weight | 4 | Plain text cards with no photos, no star visualization (just text "5"). These are visually lightweight compared to the image-heavy sections around them. |

**Assessment:** The testimonials are well-written but visually underwhelming. In a dark, image-rich design, plain text cards get lost. The lack of star icons or reviewer photos reduces visual impact.

**Issues:**
- All 5-star reviews feel unrealistic — a 4-star review would increase credibility
- No visual star rating (uses text "5" instead of star icons)
- No reviewer photos or avatars
- Placed too late in the page to influence early decisions

---

## 6. Location + CTA

| Criteria | Score (1-10) | Notes |
| :--- | :--- | :--- |
| Conversion Readiness | 7 | WhatsApp-based ordering is low friction. Address, hours, phone all present. |
| Ease of Action | 6 | CTA is at the *very end* of a very long page. User must scroll through 8 sections to reach it. No sticky/fixed CTA keeps it accessible. |

**Assessment:** The WhatsApp CTA is the right conversion channel for a burger brand. The message icon + brand gradient card create an inviting CTA. The Location section above provides all necessary info.

**Issues:**
- Competing CTAs: Hero has "Order Now", Assembly has "Order Now" + "Full Menu", final CTA has "Order on WhatsApp". Three separate CTAs may confuse the conversion path.
- No persistent/sticky CTA — user must remember to scroll to the bottom
- Map placeholder shows "Map loading..." text with a dot pattern — no actual map integration

---

## Conversion Audit

> **If a new customer lands on the website, would they leave, browse, contact, or order?**

**Most likely: Browse** — the strong visual design and photography will keep most users scrolling for at least 3-4 sections.

**Second most likely: Leave** — after the initial visual interest wears off, the page length becomes apparent. Users who don't feel an urgent craving will close the tab.

**Least likely: Order** — the ordering CTA requires scrolling through 9 sections to reach the bottom. No persistent ordering button exists.

**Breakdown by user type:**

| User Type | Likely Behavior | Path |
| :--- | :--- | :--- |
| Craving burger NOW | Scroll past hero → scan featured → scroll to bottom → ORDER | ~8+ seconds of scrolling |
| Curious browser | Browse 4-5 sections → lose interest → leave | Medium retention |
| Menu researcher | Hero CTA "View Menu" → Menu section → Location → might leave | Good for info seekers |
| Mobile user | Higher bounce rate — page is even longer, more scrolling | Lower conversion |

---

## Mobile Audit

| Criteria | Score (1-10) | Notes |
| :--- | :--- | :--- |
| Hero Image Scaling | 6 | Image drops below text. Good headline-first approach but burger photo feels smaller. |
| Assembly Story | 5 | Stacked layout works. But 350vh scroll in mobile context is very long. Burger visual is small. |
| Scroll Fatigue | 3 | ~7500+ px page on a 844px viewport = ~9 full scrolls. Very high fatigue. |
| CTA Visibility | 4 | CTA is at the very end. No sticky CTA. Mobile users must scroll through everything. |
| Gallery | 7 | Single column, photos fill width. Eye icon overlay doesn't work on touch (no hover). |

**Mobile Assembly specifics:**
- The `grid md:grid-cols-2` collapses to single column — visual above, text below
- The burger visual is constrained to viewport width, making the clip-path reveal less dramatic
- Stage text is directly below the visual — readable but not inspiring
- The initial "Scroll to explore" state wastes valuable mobile screen real estate

**Critical mobile issue:** The navbar collapses at mobile but there's no mobile-specific CTA. The WhatsApp button is hidden at the very bottom.

---

## Scoring

| Category | Score (1-10) | Justification |
| :--- | :--- | :--- |
| Brand Identity | 9 | Cohesive dark premium theme. Red/gold color scheme. Fire/craftsmanship narrative. Distinctive. |
| Visual Quality | 7 | Strong photography, moody atmosphere, clean layout. Reused hero image in multiple sections reduces freshness. Gallery is the visual highlight. |
| Conversion Potential | 5 | CTA is at the end of a very long scroll. No persistent ordering. Competing CTAs. WhatsApp-only ordering may not suit all users. |
| Storytelling | 6 | Hero tells "what". Assembly tries to tell "how". But the visual storytelling is limited by having only one photo. Copywriting is strong. |
| Mobile Experience | 5 | Long page, high scroll fatigue, no persistent CTA, hover interactions don't work on touch, stage counter hard to read at small sizes. |
| **Overall Readiness** | **6.2** | Visually impressive but conversion-constrained by page length and CTA placement. Needs optimization but foundation is solid. |

---

## Top 5 Improvements for Sales, Engagement & Conversion

### 1. Persistent Floating CTA Button ⭐ Highest Impact
**What:** A small floating "Order Now" button fixed to the bottom-right corner, visible on every section.
**Why:** Currently users must scroll through ~9 sections to reach the CTA. A persistent button reduces friction to zero — users can order the moment they feel desire (usually in the first 2-3 sections).
**Impact on Conversion:** Very High
**Effort:** Low (one `fixed` element)

### 2. New Visuals for Assembly Section
**What:** Replace the reused hero-burger.webp in the Assembly section with 2-3 different burger photos or a cross-section shot. Add ingredient pointer lines/annotations on the image.
**Why:** The hero image is already burned into user memory by the time they reach the Assembly section. The reveal has no surprise. Fresh visuals + annotations would make the section feel like new discovery.
**Impact on Sales/Engagement:** High
**Effort:** Low (just source new images, update paths)

### 3. Move Testimonials to Slot 3 (After Featured Burgers)
**What:** Swap the order so Testimonials appear right after Featured Burgers, before the Assembly section.
**Why:** Social proof works best before a long-form narrative. If a user sees "Best burger I've ever had" before committing to the Assembly scroll, they're more likely to engage.
**Impact on Engagement:** Medium
**Effort:** Very Low (reorder imports in page.tsx)

### 4. Add Dietary Badges to Menu Cards
**What:** Small badges on BurgerCard showing dietary info (e.g., "Spicy 🌶️", "Vegetarian", "Gluten-Free Available").
**Why:** Dietary information is a top-3 decision factor for modern diners. Adding it directly on cards reduces friction of having to search for this info.
**Impact on Conversion:** Medium-High
**Effort:** Low (add badge prop to BurgerCard, pass from content)

### 5. Reduce Assembly Section Scroll Length
**What:** Change from 350vh (7 × 50vh) to ~200vh (7 × ~28vh) by reducing per-stage scroll distance.
**Why:** The current section requires ~3.5 viewports of dedicated scrolling. Combined with the rest of the page, this is a major contributor to scroll fatigue. Users should be able to experience the story without feeling trapped.
**Impact on Engagement:** Medium
**Effort:** Very Low (one number change)

### Honorable Mention: Link Assembly Stage CTAs to Specific Menu Items
When the user reaches stage 3 ("Aged Cheddar"), the CTA could say "Order the Classic" (which has cheddar) rather than generic "Order Now". This connects storytelling to direct action.

---

## Recommendation

> **Ready for Analytics Foundation? YES**

The website is ready for analytics. The foundation is solid — strong visual identity, clean architecture, working scroll animations, clear layout. Analytics will provide the data needed to validate the assumptions in this audit (scroll depth, bounce rate, CTA clicks) and guide future optimization.

**Recommended analytics first steps:**
1. Page scroll depth tracking (what % reach the Assembly section? The CTA?)
2. CTA click tracking (which CTA gets the most clicks?)
3. Mobile vs desktop bounce rates
4. Time-on-page for the Assembly section specifically

**Conditional Yes** — ready for analytics but should implement the **persistent floating CTA** (Improvement #1) and **reduce Assembly scroll length** (Improvement #5) before launching to real traffic. These are low-effort changes with disproportionately high conversion impact.

---

## Deliverables Summary

| Item | Location |
| :--- | :--- |
| Desktop screenshots (9 sections) | `audit-005-experience-review/desktop/` |
| Tablet screenshots (9 sections) | `audit-005-experience-review/tablet/` |
| Mobile screenshots (9 sections) | `audit-005-experience-review/mobile/` |
| Desktop scroll recording | `audit-005-experience-review/desktop-scroll-recording.mp4` |
| Mobile scroll recording | `audit-005-experience-review/mobile-scroll-recording.mp4` |

---
