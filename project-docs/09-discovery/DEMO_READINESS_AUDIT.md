# DEMO READINESS AUDIT — Tony's Burger

**Date:** 2026-06-14
**Phase:** PHASE 5 — Page Assembly (Active)
**Audit Type:** Pre-owner-presentation readiness scan
**Scope:** Full project surface — content, code, assets, navigation, metadata, legal

---

## Executive Summary

The project compiles successfully and the single-page landing experience is visually impressive. However, the site contains significant placeholder content, fake contact data, missing legal pages, zero SEO asset files, and no custom 404 page. The demo is **not ready** for an owner presentation without at least addressing the critical blockers.

---

## Issue Inventory

### 1. Placeholder Content

| # | Location | Value | Severity | Impact | Must Fix Before Owner? |
|---|----------|-------|----------|--------|----------------------|
| 1.1 | `src/content/placeholders.ts:15` | `SITE_URL: "https://tonys-burger.com"` — domain not registered | Medium | Owner sees fake domain in browser bar / OG tags | YES |
| 1.2 | `src/content/placeholders.ts:177` | `LOCATION_ADDRESS: "123 Burger Street, Foodville, CA 90210"` — fake address | High | Owner sees made-up address; contradicts real business location | YES |
| 1.3 | `src/content/placeholders.ts:178` | `LOCATION_PHONE: "(555) 123-4567"` — fake phone | High | Owner sees fake number | YES |
| 1.4 | `src/content/placeholders.ts:192` | `CONTACT_ADDRESS: "123 Burger Street, Foodville, CA 90210"` — duplicate fake address | High | Same as 1.2 | YES |
| 1.5 | `src/content/placeholders.ts:193` | `CONTACT_PHONE: "(555) 123-4567"` — duplicate fake phone | High | Same as 1.3 | YES |
| 1.6 | `src/content/placeholders.ts:194` | `CONTACT_EMAIL: "hello@tonys-burger.com"` — fake email | High | Owner sees unprofessional placeholder email | YES |
| 1.7 | `src/content/placeholders.ts:206` | `WHATSAPP_NUMBER: "+1234567890"` — fake number | Critical | WhatsApp CTA links to nonexistent number; owner cannot demo core flow | YES |
| 1.8 | `src/content/placeholders.ts:207` | `WHATSAPP_MESSAGE` — hardcoded demo message | Low | Minor; works as placeholder | NO |
| 1.9 | `src/content/placeholders.ts:181` | `LOCATION_MAP_PLACEHOLDER: "Cargando mapa..."` — no map embed | Medium | Location section shows text, not a map; looks incomplete | YES |
| 1.10 | `src/content/placeholders.ts:153` | Testimonial data — demo names ("Juan D.", "Sara M.", "Alex R.") with generic praise | Low | Clearly demo content; fine for presentation if acknowledged | NO |
| 1.11 | `src/content/placeholders.ts:154-173` | Testimonial dates in 2026 — references future | Low | Minor; fine for demo | NO |
| 1.12 | `src/app/layout.tsx:54` | `lang="en"` but all content is Spanish | Medium | Wrong language attribute; affects accessibility and SEO | YES |
| 1.13 | `src/providers/index.tsx:20` | Providers scaffold — empty shell with comment | Medium | Not visible; fine for demo | NO |

### 2. Fake Contact Information

| # | Location | Fake Value | Severity | Impact | Must Fix Before Owner? |
|---|----------|-----------|----------|--------|----------------------|
| 2.1 | `placeholders.ts:178,192` | `(555) 123-4567` | High | Displayed in footer and location section | YES |
| 2.2 | `placeholders.ts:192` | `123 Burger Street, Foodville, CA 90210` | High | Displayed as physical address | YES |
| 2.3 | `placeholders.ts:194` | `hello@tonys-burger.com` | High | Displayed as contact email in footer | YES |
| 2.4 | `placeholders.ts:206` | `+1234567890` | Critical | WhatsApp button opens chat to nonexistent number | YES |
| 2.5 | `src/constants/site.ts:11` | `SITE_CONFIG.currency: "USD"` | Low | May not match owner's actual currency | NO |

### 3. Broken Links

| # | Link | Location | Type | Severity | Impact | Must Fix Before Owner? |
|---|------|----------|------|----------|--------|----------------------|
| 3.1 | `https://instagram.com/tonysburger` | Footer social icon | External | High | Clicked during owner demo — likely 404 or wrong account | YES |
| 3.2 | `https://facebook.com/tonysburger` | Footer social icon | External | High | Same as above | YES |
| 3.3 | `https://tiktok.com/@tonysburger` | `placeholders.ts:199` | External | Medium | Referenced in data but not rendered in current footer | NO |
| 3.4 | `https://wa.me/+1234567890?...` | Floating CTA, Hero CTA, CTA Section | WhatsApp | Critical | All WhatsApp flows lead to fake number | YES |
| 3.5 | `/privacy-policy` | Footer legal link | Internal | Critical | Links to non-existent page → 404 | YES |
| 3.6 | `/terms-of-service` | Footer legal link | Internal | Critical | Links to non-existent page → 404 | YES |

### 4. 404 Pages

| # | Issue | Severity | Impact | Must Fix Before Owner? |
|---|-------|----------|--------|----------------------|
| 4.1 | No custom `not-found.tsx` in `src/app/` | Medium | Owner clicking broken link sees generic Next.js 404 | YES |
| 4.2 | `/privacy-policy` route does not exist | Critical | Footer link leads to 404 | YES |
| 4.3 | `/terms-of-service` route does not exist | Critical | Footer link leads to 404 | YES |
| 4.4 | No other page routes exist (`/menu`, `/gallery`, etc.) | Low | Single-page design is intentional; not a bug | NO |

### 5. Demo Assets

| # | Issue | Severity | Impact | Must Fix Before Owner? |
|---|-------|----------|--------|----------------------|
| 5.1 | `public/assets/demo/ingredients/` — **empty directory** | Low | Not currently referenced in code; orphan folder | NO |
| 5.2 | All burger images are demo WebP placeholders, not real product photos | Low | Fine for demo; owner should provide real photos later | NO |
| 5.3 | `hero-burger.jpg` in `public/assets/hero/` — referenced nowhere in code | Low | Orphan file, not used by any component | NO |
| 5.4 | `public/assets/hero/hero-premium-wide.png` — 1.5MB file | Medium | Large image; fine for demo but needs optimization before production | NO |
| 5.5 | `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg` | Low | Next.js default boilerplate files; should clean up | NO |
| 5.6 | `public/placeholders/` — SVG placeholders (10 files) | Low | Not referenced in code; likely legacy from earlier phase | NO |

### 6. Missing Legal Pages

| # | Missing Page | Linked From | Severity | Must Fix Before Owner? |
|---|-------------|-------------|----------|----------------------|
| 6.1 | Privacy Policy (`/privacy-policy`) | Footer | Critical | Legal requirement for any public-facing site | YES |
| 6.2 | Terms of Service (`/terms-of-service`) | Footer | Critical | Legal requirement for any public-facing site | YES |

### 7. Missing Favicon

| # | Asset | Status | Severity | Must Fix Before Owner? |
|---|-------|--------|----------|----------------------|
| 7.1 | `favicon.ico` | ✅ Exists (Next.js default in `src/app/`) | — | — |
| 7.2 | `icon.png` (32x32) | ❌ Missing | Medium | No proper brand favicon | YES |
| 7.3 | `icon.svg` | ❌ Missing | Medium | No SVG favicon for modern browsers | NO |
| 7.4 | `apple-touch-icon.png` (180x180) | ❌ Missing | Medium | No iOS home screen icon | YES |
| 7.5 | `favicon-16x16.png`, `favicon-32x32.png` | ❌ Missing | Low | Standard favicon sizes | NO |

### 8. Missing Metadata

| # | Issue | Severity | Impact | Must Fix Before Owner? |
|---|-------|----------|--------|----------------------|
| 8.1 | No `opengraph-image.png` | Medium | No preview when sharing link on social media | YES |
| 8.2 | No `twitter-image.png` | Low | No Twitter card preview | NO |
| 8.3 | No `sitemap.xml` | Low | Search engines cannot discover pages | NO |
| 8.4 | No `robots.txt` | Low | Crawlers not explicitly allowed/blocked | NO |
| 8.5 | `metadata.description` uses `PLACEHOLDER.SITE_DESCRIPTION` | Medium | Description is demo text, not production-ready | YES |
| 8.6 | No Open Graph metadata in layout (`og:title`, `og:description`, `og:image`, `og:url`) | Medium | Social preview will be empty/broken | YES |
| 8.7 | No Twitter card metadata | Low | Twitter preview will be empty | NO |
| 8.8 | `SITE_URL` set to fake domain — OG URLs will be wrong | Medium | Open Graph url tag points to unregistered domain | YES |
| 8.9 | Root `layout.tsx` uses `lang="en"` but 100% of content is Spanish | Medium | Accessibility issue; semantic mismatch | YES |

### 9. Navigation Issues

| # | Issue | Severity | Impact | Must Fix Before Owner? |
|---|-------|----------|--------|----------------------|
| 9.1 | Nav links use anchor fragments (`#menu-preview`, `#gallery`, `#location`) | Low | Intentional single-page design; works fine | NO |
| 9.2 | No keyboard focus indicator on mobile menu toggle | Low | Accessibility concern | NO |
| 9.3 | No "skip to content" link for keyboard users | Low | Accessibility best practice missing | NO |
| 9.4 | Footer "Inicio" link uses `<a href="/">` instead of Next.js `<Link>` | Low | Hard navigation instead of SPA transition | NO |

### 10. Mobile Usability Issues

| # | Issue | Severity | Impact | Must Fix Before Owner? |
|---|-------|----------|--------|----------------------|
| 10.1 | Hero image uses `object-contain` on mobile, which may create letterboxing | Low | Visual quality concern | NO |
| 10.2 | Floating CTA (`FloatingCta.tsx`) overlaps mobile bottom navigation bar in some browsers | Low | May partially obscure content at bottom | NO |
| 10.3 | No touch-friendly improvements beyond basic responsive styling | Low | Phase 6 (Responsive) is still future | NO |
| 10.4 | WhatsApp number is fake — cannot demo the primary conversion flow on mobile | Critical | Core mobile flow broken | YES |

---

## Critical Blockers (Must Fix for Owner Demo)

| Priority | Issue | Component | Fix |
|----------|-------|-----------|-----|
| **P0** | WhatsApp number is fake (`+1234567890`) | `placeholders.ts:206` | Replace with owner's real WhatsApp number |
| **P0** | Address is fake (`123 Burger Street...`) | `placeholders.ts:177,192` | Replace with real business address |
| **P0** | Phone is fake (`(555) 123-4567`) | `placeholders.ts:178,193` | Replace with real business phone |
| **P0** | Email is fake (`hello@tonys-burger.com`) | `placeholders.ts:194` | Replace with real business email |
| **P0** | Legal pages linked in footer return 404 | `/privacy-policy`, `/terms-of-service` | Create placeholder legal pages or remove links |
| **P0** | Social media links likely point to nonexistent accounts | Footer | Replace with real accounts or hide |
| **P1** | Missing Open Graph image | `opengraph-image.png` | Add brand OG image |
| **P1** | Missing `apple-touch-icon.png` | Root `/` | Add iOS icon |
| **P1** | `lang="en"` but content is Spanish | `layout.tsx:54` | Change to `lang="es"` |
| **P1** | `SITE_URL` is fake domain | `placeholders.ts:15` | Use localhost for demo or real domain |
| **P2** | Map shows placeholder text, not embedded map | `LocationSection.tsx` | Add Google Maps embed or hide map area |
| **P2** | No custom 404 page | `src/app/not-found.tsx` | Create minimal branded 404 |

---

## Demo Readiness Score

| Category | Score (0-10) | Notes |
|----------|-------------|-------|
| Visual Polish | 9/10 | Hero atmosphere, animations, dark theme are impressive |
| Content Authenticity | 2/10 | Address, phone, email, WhatsApp, social links are all fake |
| Navigation | 8/10 | Single-page scroll works; no broken internal anchors |
| Mobile Usability | 6/10 | Responsive layout works; core flow (WhatsApp) is broken |
| Legal Compliance | 0/10 | No privacy policy, no terms of service; linked pages 404 |
| SEO / Metadata | 1/10 | No OG image, no sitemap, wrong language, fake domain |
| Brand Assets | 4/10 | Favicon exists in basic form; no icons, no OG image |
| Build Health | 10/10 | Compiles and builds without errors |

### Overall Score: **4/10**

---

## Recommendation

### Can the owner review happen today?

**NO** — not without fixing the 6 P0 critical blockers first.

The visual presentation (hero, animations, dark theme, layout) is ready and impressive. The code compiles cleanly. However, the owner presentation will likely involve clicking the WhatsApp button, seeing the address, checking social links, or navigating the footer — all of which point to fake/nonexistent destinations.

**Minimum requirements before owner demo:**

1. Replace WhatsApp number with real number
2. Replace address, phone, and email with real business info
3. Either create placeholder legal pages or remove footer links
4. Replace or hide social media links
5. Add OG image and apple-touch-icon (quick wins)
6. Fix `lang="en"` to `lang="es"`

These are quick configuration changes (estimate: 20-30 minutes). Once applied, the demo readiness score rises to approximately **7/10** — sufficient for a preliminary owner walkthrough.

---

## Files Examined

| File | Status |
|------|--------|
| `src/app/layout.tsx` | ✅ Read |
| `src/app/page.tsx` | ✅ Read |
| `src/app/globals.css` | ✅ Read |
| `src/content/placeholders.ts` | ✅ Read |
| `src/constants/site.ts` | ✅ Read |
| `src/constants/tokens.ts` | ✅ Read |
| `src/components/layout/Navbar.tsx` | ✅ Read |
| `src/components/layout/Footer.tsx` | ✅ Read |
| `src/components/sections/HeroSection.tsx` | ✅ Read |
| `src/components/sections/FeaturedBurgersSection.tsx` | ✅ Read |
| `src/components/sections/MenuPreviewSection.tsx` | ✅ Read |
| `src/components/sections/TestimonialsSection.tsx` | ✅ Read |
| `src/components/sections/AboutSection.tsx` | ✅ Read |
| `src/components/sections/LocationSection.tsx` | ✅ Read |
| `src/components/sections/CTASection.tsx` | ✅ Read |
| `src/components/sections/GalleryPreviewSection.tsx` | ✅ Read |
| `src/components/sections/BurgerAssemblySection.tsx` | ✅ Read |
| `src/components/ui/FloatingCta.tsx` | ✅ Read |
| `src/providers/index.tsx` | ✅ Read |
| `public/` (all asset directories) | ✅ Scanned |
| `project-docs/09-discovery/` | ✅ Scanned |

---

## Report Metadata

- **Auditor:** AI Governance Agent
- **Methodology:** Manual code inspection + build verification + asset scan
- **Build Verified:** ✅ `pnpm build` — 0 errors, 0 warnings
- **Date:** 2026-06-14
