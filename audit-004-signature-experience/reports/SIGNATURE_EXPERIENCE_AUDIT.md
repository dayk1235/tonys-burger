# AUDIT-004 — Signature Experience: Burger Assembly Story

**Date:** 2026-06-13
**Phase:** TASK-004B

---

## Objective

Build an interactive "Burger Assembly Story" section that walks users through each ingredient layer using scroll-triggered animation, reinforcing premium craftsmanship and driving CTA engagement.

## Implementation

| Component | File | Role |
| :--- | :--- | :--- |
| `useBurgerAssembly` | `src/animations/burger/useBurgerAssembly.ts` | ScrollTrigger-based hook that tracks progress through 7 stages via `onUpdate` callback |
| `BurgerLayersVisual` | `src/components/sections/BurgerAssembly/BurgerLayersVisual.tsx` | Hero burger image with progressive clip-path reveal (bottom→top) + warm glow overlay + stage counter |
| `BurgerAssemblySection` | `src/components/sections/BurgerAssemblySection.tsx` | Section orchestrator — sticky two-column layout with stage text and CTA at final stage |

## Architecture

- **Scroll-driven state**: `useBurgerAssembly` uses ScrollTrigger with `scrub: 1` to map scroll progress (0→1) to a stage index (0→6). State updates are batched (only when stage changes).
- **Sticky layout**: CSS `sticky top-0 h-screen` keeps the content visible while the section's 350vh scroll height passes through the viewport. No GSAP pinning.
- **Progressive reveal**: The hero burger image starts at 35% visible (bottom portion) and reveals to 100% via `clip-path: inset()`. Controlled by `activeStage` via CSS transition.
- **Reduce motion**: `prefers-reduced-motion` initializes `activeStage` to the final stage immediately, showing the full burger with no animation.
- **7 stages**: Bun → Patty → Cheese → Lettuce → Tomato → Onion → Complete (CTA)
- **CTA**: At stage 7, "Order Now" (cta variant, gold glow) and "Full Menu" (outline variant) buttons appear.

## Layout

- **Desktop (≥768px)**: Two-column grid — burger visual left, stage text right
- **Mobile (<768px)**: Single column stacked — visual above text (sticky behavior preserved)
- **Section height**: `STAGES.length * 50vh = 350vh` inner scroll space, SectionContainer handles padding

## Validation

| Check | Result |
| :--- | :--- |
| `npm run lint` | 0 errors, 2 pre-existing warnings (location-card, review-card) |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass (Next.js 16 Turbopack) |
| Static generation | All routes generated |
| Section renders at correct position between Featured and Gallery | ✅ |
| Sticky layout with scroll animation | ✅ |
| prefers-reduced-motion fallback | ✅ (state initializes to final stage) |
| Responsive: desktop/tablet/mobile | ✅ (grid collapse, stacked single column on mobile) |
| Existing tests unaffected | ✅ (no test changes) |

## Files Modified

| File | Change |
| :--- | :--- |
| `src/animations/burger/useBurgerAssembly.ts` | **Created** — ScrollTrigger animation hook |
| `src/components/sections/BurgerAssembly/BurgerLayersVisual.tsx` | **Created** — Progressive image reveal component |
| `src/components/sections/BurgerAssemblySection.tsx` | **Created** — Full section with sticky layout + stage text |
| `src/animations/index.ts` | **Updated** — Export new hook |
| `src/app/page.tsx` | **Updated** — Import and insert section between Featured and Gallery |

## Risks

- **ScrollTrigger conflicts**: Multiple ScrollTrigger instances on the page (section reveal, parallax, navbar). Verified no duplicate triggers per element.
- **Performance on mobile**: `clip-path` transitions use GPU compositing. `will-change` considered but omitted — CSS `transition` is efficient enough for this use case.
- **Long scroll section**: 350vh + padding = ~3.5–4.5 viewports of scroll. May feel long on first visit but supports the storytelling narrative.

## Screenshots

`audit-004-signature-experience/burger-assembly-view.png` — desktop viewport capture

## Conclusion

Burger Assembly Story section successfully implemented and integrated. 0 lint/build errors. The section sits between Featured Burgers and About on the homepage. CMS content integration would follow the same `PLACEHOLDER.*` pattern used by other sections.
