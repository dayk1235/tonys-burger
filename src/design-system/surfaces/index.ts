/**
 * Design System — Surface Abstractions
 *
 * Defines the surface types used to organize information.
 * Surfaces are the structural foundation of every card, panel, and container.
 *
 * Every surface follows the Material System hierarchy.
 *
 * Reference: project-docs/00-vision/RESTAURANT_OS_VISUAL_SYSTEM.md
 * Reference: project-docs/00-vision/RESTAURANT_OS_MATERIAL_SYSTEM.md
 */

import type { MaterialId } from "../materials";

/* ─── Surface Types ──────────────────────────── */
export type SurfaceType =
  | "card"
  | "cardInteractive"
  | "cardElevated"
  | "panel"
  | "section"
  | "container"
  | "sheet";

/* ─── Surface Properties ─────────────────────── */
export interface SurfaceDefinition {
  /** Surface type */
  type: SurfaceType;
  /** Underlying material */
  material: MaterialId;
  /** CSS background value */
  background: "bg" | "bgSurface" | "bgSurfaceAlt" | "bgElevated" | "transparent";
  /** Border treatment */
  border: "base" | "light" | "none";
  /** Corner radius */
  radius: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
  /** Shadow elevation index */
  shadowElevation: number;
  /** Horizontal padding */
  paddingX: string;
  /** Vertical padding */
  paddingY: string;
  /** Human-readable purpose */
  purpose: string;
  /** When NOT to use this surface */
  restrictions: string;
}

/* ─── Surface Definitions ────────────────────── */
export const SURFACES: Record<SurfaceType, SurfaceDefinition> = {
  card: {
    type: "card",
    material: "businessGlass",
    background: "bgSurface",
    border: "base",
    radius: "xl",
    shadowElevation: 1,
    paddingX: "4",
    paddingY: "4",
    purpose: "Default card for grouping related information. Subtle background, gentle corners, quiet shadow.",
    restrictions: "Never stack cards directly on top of each other without a panel or section separator.",
  },
  cardInteractive: {
    type: "cardInteractive",
    material: "interactive",
    background: "bgSurface",
    border: "base",
    radius: "xl",
    shadowElevation: 1,
    paddingX: "4",
    paddingY: "4",
    purpose: "Clickable card that responds to hover, focus, and press. Has cursor pointer and hover state.",
    restrictions: "Never use for display-only content. Must have an onClick or href.",
  },
  cardElevated: {
    type: "cardElevated",
    material: "businessGlass",
    background: "bgElevated",
    border: "light",
    radius: "xl",
    shadowElevation: 3,
    paddingX: "5",
    paddingY: "5",
    purpose: "Emphasized card for highlighting important content. Higher elevation and more generous padding.",
    restrictions: "Use sparingly — only one elevated card per section. Overuse dilutes emphasis.",
  },
  panel: {
    type: "panel",
    material: "businessGlass",
    background: "bgSurfaceAlt",
    border: "base",
    radius: "lg",
    shadowElevation: 0,
    paddingX: "6",
    paddingY: "6",
    purpose: "Large surface area containing multiple cards or sections. Defines visual zones without barriers.",
    restrictions: "Never use inside a card. Panels contain cards, not the other way around.",
  },
  section: {
    type: "section",
    material: "atmosphere",
    background: "bg",
    border: "none",
    radius: "none",
    shadowElevation: 0,
    paddingX: "4",
    paddingY: "16",
    purpose: "Largest organizational unit. Separated by whitespace, not lines or background changes.",
    restrictions: "Sections are separated by space, not by visual dividers. Never add borders between sections.",
  },
  container: {
    type: "container",
    material: "atmosphere",
    background: "transparent",
    border: "none",
    radius: "none",
    shadowElevation: 0,
    paddingX: "4",
    paddingY: "0",
    purpose: "Content width limiter. Centers content and constrains max-width. No visual presence.",
    restrictions: "Never add background, border, or shadow to a container. It is invisible by design.",
  },
  sheet: {
    type: "sheet",
    material: "focusSurface",
    background: "bgElevated",
    border: "light",
    radius: "2xl",
    shadowElevation: 5,
    paddingX: "6",
    paddingY: "6",
    purpose: "Deep analytical reading surface. Opaque, blocks distraction. For focus-intensive contexts.",
    restrictions: "Never use as default surface. Reserve for deep work and analytical screens.",
  },
};

/* ─── Tailwind class builders ────────────────── */
export function getSurfaceClasses(surface: SurfaceType): string {
  const def = SURFACES[surface];

  const bgMap: Record<string, string> = {
    bg: "bg-bg",
    bgSurface: "bg-bg-surface",
    bgSurfaceAlt: "bg-bg-surface-alt",
    bgElevated: "bg-bg-elevated",
    transparent: "bg-transparent",
  };

  const borderMap: Record<string, string> = {
    base: "border border-border",
    light: "border border-border-light",
    none: "border-0",
  };

  const radiusMap: Record<string, string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    none: "rounded-none",
  };

  /* Map elevation index to Tailwind shadow classes */
  const shadowMap: Record<number, string> = {
    0: "shadow-none",
    1: "shadow-sm",
    2: "shadow-sm",
    3: "shadow-md",
    4: "shadow-md",
    5: "shadow-lg",
    6: "shadow-xl",
    7: "shadow-2xl",
    8: "shadow-2xl",
  };

  return [
    bgMap[def.background],
    borderMap[def.border],
    radiusMap[def.radius],
    shadowMap[def.shadowElevation] || "shadow-sm",
  ].join(" ");
}
