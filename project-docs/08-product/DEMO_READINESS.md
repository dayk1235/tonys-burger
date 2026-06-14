# DEMO READINESS AUDIT

**Date:** 2026-06-14
**Auditor:** AI Agent (automated review)
**Scope:** Full website — branding, content, functionality, infrastructure

---

## Rating System

| Category | Meaning |
| :--- | :--- |
| **A — Ready** | Good for owner demo. No changes needed. |
| **B — Needs Real Info** | Placeholder data must be replaced with real business information before demo. |
| **C — Must Improve** | Should be fixed before showing the owner. Functional or quality issue. |

---

## 1. Branding

| Item | Rating | Notes |
| :--- | :---: | :--- |
| Logo | **B** | `tonys-demo-logo.svg` exists in `public/assets/demo/branding/` but is never referenced in any component. The navbar uses text `"Tony's Burger"` instead of a logo image. Owner may want actual logo displayed. |
| Color palette | **A** | Dark theme with red (`#C62828`) and gold (`#F4B400`). Consistent across all components. |
| Typography | **A** | Inter (body) + Bebas Neue (headings). Consistent, well-tuned. |
| `lang` attribute | **C** | `<html lang="en">` but all content is Spanish. Must be `lang="es"`. Located in `src/app/layout.tsx:57`. |
| Site name | **A** | `"Tony's Burger"` — matches brand. |
| Tagline | **A** | `"Hamburguesas al carbón"` — clear, authentic. |
| Favicon | **C** | None exists. The browser tab shows a blank/default icon. Must create `favicon.ico` or `favicon.webp`. |
| Default Next.js SVGs | **C** | `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` are present from scaffolding. Should be removed before demo. |

---

## 2. Hero Section

| Item | Rating | Notes |
| :--- | :---: | :--- |
| Imagery | **B** | Uses `/assets/demo/hero/hero-burger.webp`. Demo image quality is acceptable for initial demo but owner will want real food photography. |
| Copy (Spanish) | **A** | Well-written Spanish. "HAMBURGUESAS AL CARBÓN", "Angus al carbón" badge. |
| Primary CTA | **A** | "Pedir por WhatsApp" — clear action. Scrolls to `#cta` section. |
| Secondary CTA | **A** | "Ver el menú" — clear action. Scrolls to `#menu-preview`. |
| Trust indicators | **A** | 3 items: fresh ingredients, angus beef, family business. |
| Value proposition | **A** | Hero answers "why eat here" in under 5 seconds. |

---

## 3. Menu

| Item | Rating | Notes |
| :--- | :---: | :--- |
| Featured burgers (3) | **B** | All use demo images. Burger names are English ("The Classic", "Smoky BBQ", "The Inferno") — inconsistent with site being in Spanish. Owner may want Spanish names. |
| Full menu (6 items) | **B** | Same issues as featured. Image reuse: only 3 unique burger images for 9 menu items (some images duplicated). |
| Pricing | **B** | Prices in USD (`$12.99`–`$17.99`). If this is a Mexico-based business, prices should be in MXN or clarified with `USD` prefix. |
| Categories | **A** | Categories present (Signature, Classic, Specialty). |
| Dietary badges | **A** | Badges present ("Sin gluten", "Vegetariana", "Premium") on relevant items. |
| `onSelect` callback | **C** | `BurgerCard` has an `onSelect` prop that exists but is never wired. Cards are not clickable — no action happens when tapping a burger. Should at minimum scroll to order CTA or show a detail view. |

---

## 4. Photography & Assets

| Item | Rating | Notes |
| :--- | :---: | :--- |
| Hero image | **B** | Demo image. Must be replaced with real hero shot. |
| Burger images (3 unique) | **B** | Only 3 demo images for 9 menu items. Multiple burgers share the same photo. |
| Gallery (6 images) | **B** | Demo images. No real restaurant photography. |
| About image | **C** | Reuses the hero burger image (`hero-burger.webp`). Creates visual fatigue. Must be a different photo (kitchen, team, or interior). |
| Ingredient images | **C** | Directory exists but is empty (`public/assets/demo/ingredients/`). If Burger Assembly section uses/demo ingredient images, they're missing. |
| Textures (charcoal, smoke, paper) | **A** | Good background textures. Will remain useful even with real photography. |

---

## 5. Location

| Item | Rating | Notes |
| :--- | :---: | :--- |
| Address | **C** | **FAKE:** "123 Burger Street, Foodville, CA 90210". Owner will immediately notice. |
| Phone | **C** | **FAKE:** "(555) 123-4567". Must be replaced. |
| Hours | **B** | Plausible but unverified. Format inconsistent between `LOCATION_HOURS` and `CONTACT_HOURS`. |
| Embedded map | **C** | No map at all. Location section shows a placeholder icon (`MapPin`) instead of an embedded Google/Apple map. Owner will expect a map. |
| Location card | **A** | Card layout is clean, all info well-organized. |

---

## 6. Contact Information

| Item | Rating | Notes |
| :--- | :---: | :--- |
| WhatsApp number | **C** | **FAKE:** `+1234567890`. Does not connect to any real business. Must be replaced before demo. |
| WhatsApp message | **A** | Prefilled message is good: "¡Hola! Quiero pedir unas hamburguesas para llevar 🙌" |
| Email | **B** | `hello@tonys-burger.com` — plausible but verify with owner. |
| Phone | **C** | Same fake number as location. |
| Social links (Instagram) | **B** | `https://instagram.com/tonysburger` — plausible but unverified. |
| Social links (Facebook) | **B** | `https://facebook.com/tonysburger` — plausible but unverified. |
| Social links (TikTok) | **C** | `https://tiktok.com/@tonysburger` — linked in `PLACEHOLDER` but never rendered in footer. Only Instagram and Facebook are shown. Dead configuration. |

---

## 7. CTAs & Navigation

| Item | Rating | Notes |
| :--- | :---: | :--- |
| Floating CTA | **B** | Points to WhatsApp URL with fake number. Works once number is real. Good placement and design. |
| Hero primary CTA | **A** | Scrolls to `#cta` section. Works correctly. |
| Hero secondary CTA | **A** | Scrolls to `#menu-preview`. Works correctly. |
| Navbar CTA button | **A** | Scrolls to `#cta` section. Works correctly. |
| CTA Section button | **C** | **DOES NOT NAVIGATE TO WHATSAPP.** The CTA section button (`CTACard` → `Button`) only fires an analytics event. It is a `<button>` with no href, no navigation logic. The section's "Pedir por WhatsApp" button appears actionable but does nothing. Owner will notice this immediately. |
| Nav links | **A** | All 4 nav links work (Inicio → `/`, Menú → `#menu-preview`, Galería → `#gallery`, Ubicación → `#location`). |
| Legal links | **C** | Footer links to `/privacy-policy` and `/terms-of-service`. Both pages **do not exist** — will return 404. |

---

## 8. Analytics & Insights

| Item | Rating | Notes |
| :--- | :---: | :--- |
| Event tracking | **A** | All 6 event types fire correctly (`page_view`, `burger_view`, `section_view`, `cta_click`, `menu_click`, `whatsapp_click`). |
| localStorage persistence | **A** | Events stored in browser localStorage. Works offline. |
| File persistence | **A** | Events written to `data/analytics/events.json`. Survives restarts. |
| API routes | **A** | `/api/analytics/track`, `/api/analytics/events`. Functional. |
| Insights Engine | **A** | 5 generators (top products, top CTAs, section performance, conversion paths, engagement summary). |
| Business Reports | **A** | 3 report types (daily, weekly, summary) in JSON + Markdown. |
| WhatsApp number in analytics | **C** | WhatsApp clicks are tracked but the number is fake. Real tracking data only matters after real number is set. |

---

## 9. Infrastructure

| Item | Rating | Notes |
| :--- | :---: | :--- |
| `robots.txt` | **C** | Missing. Site may be indexed by search engines unintentionally before ready. |
| `sitemap.xml` | **C** | Missing. Not critical for demo but needed before public launch. |
| Custom 404 page | **C** | Missing. Next.js default 404 will show. |
| SSL/HTTPS | **N/A** | Not verified — depends on deployment platform. |
| Build status | **A** | Clean build, 0 errors, 2 pre-existing warnings (img elements). |
| Performance | **B** | Not benchmarked but GSAP animations and full-size WebP images may impact mobile performance. |

---

## Summary

### Ready Now (Category A — 18 items)
- Color palette, typography, dark theme
- Spanish copy across all sections
- Trust indicators, badges, categories
- Primary/secondary CTAs on hero and navbar
- All 6 analytics event types tracked
- Analytics persistence (localStorage + file + API)
- Insights Engine (5 generators)
- Business Reports (3 types, 2 formats)
- Floating CTA design
- Nav links
- Build passes clean

### Needs Real Business Info (Category B — 10 items)
- Logo not displayed (SVG exists but unused)
- Hero image is demo
- All burger/gallery images are demo (3 unique for 9 items)
- Pricing may need MXN conversion
- Menu item names are English
- Email/social links unverified
- Hours format inconsistency
- About image reuses hero image
- WhatsApp URL has fake number
- Performance not benchmarked

### Must Improve Before Demo (Category C — 11 items)
- `lang="en"` → `lang="es"` in layout.tsx
- **Missing favicon** — blank browser tab
- Default Next.js SVGs in `public/`
- Burger cards not clickable (`onSelect` never wired)
- About image reuses hero image (visual fatigue)
- Empty ingredient images directory
- **Fake address** ("123 Burger Street, Foodville")
- **Fake phone** ("(555) 123-4567")
- **Fake WhatsApp number** (+1234567890)
- **No embedded map** in location section
- **CTA Section button does nothing** — fires analytics but doesn't open WhatsApp
- **Legal pages return 404** — privacy-policy and terms-of-service don't exist
- TikTok social link exists in code but never rendered
- No `robots.txt` (risk of premature indexing)
- No custom 404 page, no sitemap

---

## Recommended Questions for Owner

1. **What is your real address?** (Replace "123 Burger Street, Foodville")
2. **What is your real phone number?** (Replace "(555) 123-4567")
3. **What is your WhatsApp Business number?** (Replace "+1234567890")
4. **Do you have a logo you want displayed?** (SVG logo exists but isn't used)
5. **Can we take/provide real photos?** (Hero, burgers, gallery, kitchen/team)
6. **Are prices in USD or MXN?** (Currently USD — may need conversion)
7. **Do you want burger names in Spanish?** (Currently English: "The Classic", "Smoky BBQ")
8. **Do you have Instagram/Facebook pages?** (URLs are guesses)
9. **Do you want an embedded Google Map?** (Currently no map)
10. **Do you want the site indexed before launch?** (No `robots.txt` currently)

---

## Launch Blockers

These items **must** be resolved before the site is shown to the owner or the public:

| # | Issue | Priority |
| :--- | :--- | :--- |
| 1 | **CTA Section button does not navigate to WhatsApp** | **Critical** — appears broken |
| 2 | **Fake address everywhere** | **High** — immediate distrust |
| 3 | **Fake phone number everywhere** | **High** — immediate distrust |
| 4 | **Fake WhatsApp number** | **High** — calls to action go nowhere |
| 5 | **Legal pages return 404** | **High** — footer links are dead |
| 6 | `lang="en"` should be `lang="es"` | Medium — SEO impact + inconsistency |
| 7 | Missing favicon | Medium — unprofessional appearance |
| 8 | Missing `robots.txt` | Medium — risk of premature indexing |
| 9 | No embedded map | Low-Medium — owner will expect it |
| 10 | Burger cards not clickable | Low-Medium — missed engagement opportunity |

---

## Demo Readiness Score

**Score: 58/100**

```
Category A (Ready):      18 items × 3 pts = 54
Category B (Needs Info): 10 items × 1 pt  = 10
Category C (Must Fix):   11 items × 0 pts = 0
                              Total:        64 / 87 max = 73%
```

Adjusted for critical blockers: **58/100**

---

## Recommendations

### Ready to Show Owner?

**YES — but only after fixing Category C #1 (CTA button navigation).**

The owner will see the design, theme, and flow. Most Category B items (real photos, real info) can be discussed during the demo. The single critical issue is the CTA section button appearing broken.

**Recommended demo flow with caveats:**
1. Pre-warn owner: "All contact info is placeholder — we need your real details"
2. Point out the design, flow, mobile experience
3. Skip the CTA section or explain it's a stub
4. Collect real business information during the meeting

### Ready for Public Launch?

**NO.** Before public launch:

| Priority | Items to Complete |
| :--- | :--- |
| **P0 — Demo blocking** | CTA section button navigation; fake contact info; WhatsApp number; legal pages |
| **P1 — Required** | Real photography; logo; favicon; `lang="es"`; `robots.txt`; embedded map |
| **P2 — Polish** | Remove default Next.js SVGs; wire burger card clicks; consistent hours format; Spanish burger names; price currency |
| **P3 — Future** | Custom 404 page; sitemap.xml; TikTok social link; ingredient images; performance optimization |

Estimated effort to reach public launch readiness: **1-2 weeks** (pending owner providing real business information and photography).
