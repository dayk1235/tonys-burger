/**
 * Design System — Material Types & Definitions
 *
 * Implements the Restaurant OS Material System hierarchy.
 * Each material has a defined purpose, depth, and usage rule.
 *
 * Reference: project-docs/00-vision/RESTAURANT_OS_MATERIAL_SYSTEM.md
 */

import type { ElevationLevel, GlowType } from "../tokens";

/* ─── Material Identifiers ───────────────────── */
export type MaterialId =
  | "atmosphere"
  | "businessGlass"
  | "focusSurface"
  | "highlightLayer"
  | "navigation"
  | "widget"
  | "floating"
  | "modal"
  | "interactive"
  | "data";

/* ─── Material Properties ────────────────────── */
export interface MaterialDefinition {
  /** Unique material identifier */
  id: MaterialId;
  /** Elevation level in the Z-axis (controls shadow depth) */
  elevation: ElevationLevel;
  /** Whether the material supports transparency */
  transparent: boolean;
  /** Whether the material can support blur */
  blurrable: boolean;
  /** Whether the material responds to light (ambient shifts) */
  responsive: boolean;
  /** Human-readable description of the material's purpose */
  description: string;
  /** When NOT to use this material */
  restrictions: string[];
  /** Allowed parent materials (can this be layered on top of?) */
  allowedParents: MaterialId[];
}

/* ─── Material Definitions ───────────────────── */
export const MATERIALS: Record<MaterialId, MaterialDefinition> = {
  atmosphere: {
    id: "atmosphere",
    elevation: 0,
    transparent: false,
    blurrable: false,
    responsive: true,
    description: "The absolute foundation of every screen. Sets the emotional state of the business. Reacts to time of day and urgency.",
    restrictions: [
      "Never place content directly on atmosphere without a surface layer",
      "Never animate atmosphere aggressively — should breathe imperceptibly",
    ],
    allowedParents: [],
  },
  businessGlass: {
    id: "businessGlass",
    elevation: 1,
    transparent: true,
    blurrable: true,
    responsive: true,
    description: "Frames insights while maintaining environmental context. Premium, clear, structural.",
    restrictions: [
      "Never stack Business Glass on Business Glass — clarity is lost",
      "Never use for interactive elements — Business Glass is for display only",
      "Never apply to full-screen surfaces — only cards and panels",
    ],
    allowedParents: ["atmosphere"],
  },
  focusSurface: {
    id: "focusSurface",
    elevation: 1,
    transparent: false,
    blurrable: false,
    responsive: false,
    description: "Opaque surface for deep analytical reading. Absorbs light. Blocks distraction completely.",
    restrictions: [
      "Use sparingly — only for deep work contexts",
      "Never use as default card surface",
      "Never combine with blur or transparency effects",
    ],
    allowedParents: ["atmosphere", "businessGlass"],
  },
  highlightLayer: {
    id: "highlightLayer",
    elevation: 2,
    transparent: true,
    blurrable: false,
    responsive: true,
    description: "Transient material that appears to elevate an element under inspection. Emits light from within.",
    restrictions: [
      "Never permanent — must fade after interaction",
      "Never use for static emphasis",
      "Never stack multiple highlight layers",
    ],
    allowedParents: ["businessGlass", "focusSurface", "widget", "data"],
  },
  navigation: {
    id: "navigation",
    elevation: 3,
    transparent: false,
    blurrable: false,
    responsive: false,
    description: "Solid, predictable, indestructible. Anchors the spatial structure. No blur, no transparency.",
    restrictions: [
      "Never place navigation on top of modal — modal must fully command Z-axis",
      "Never animate navigation material — must feel permanent",
    ],
    allowedParents: ["atmosphere"],
  },
  widget: {
    id: "widget",
    elevation: 2,
    transparent: false,
    blurrable: false,
    responsive: false,
    description: "Tactile instruments — precision-milled blocks of logic. Dense, heavy, interactive.",
    restrictions: [
      "Never make widget material too large — widgets are compact by nature",
      "Never use Business Glass on widget surfaces",
    ],
    allowedParents: ["businessGlass", "navigation"],
  },
  floating: {
    id: "floating",
    elevation: 6,
    transparent: true,
    blurrable: true,
    responsive: false,
    description: "Transient — tooltips, notifications, temporary context. Deepest shadow, lightest visual weight.",
    restrictions: [
      "Never permanent — must dismiss automatically or by user action",
      "Never use for critical information that requires confirmation",
    ],
    allowedParents: ["businessGlass", "widget", "navigation", "focusSurface"],
  },
  modal: {
    id: "modal",
    elevation: 8,
    transparent: false,
    blurrable: false,
    responsive: false,
    description: "Commands a full halt in time. Dims the atmosphere. Forces resolution before continuation.",
    restrictions: [
      "Never stack two modals — one at a time only",
      "Never use for informational content — only for decisions",
      "Never blur the modal itself — atmosphere behind it should blur",
    ],
    allowedParents: ["atmosphere"],
  },
  interactive: {
    id: "interactive",
    elevation: 2,
    transparent: false,
    blurrable: false,
    responsive: true,
    description: "Physical components — buttons, toggles, controls. Must respond to touch with physical depression.",
    restrictions: [
      "Never use for display-only content",
      "Never disable the physical feedback (depression) — even loading states must respond",
    ],
    allowedParents: ["businessGlass", "widget", "navigation", "focusSurface", "modal"],
  },
  data: {
    id: "data",
    elevation: 0,
    transparent: false,
    blurrable: false,
    responsive: false,
    description: "Subtractive — etched into its parent material. Relies on contrast and typography. Never competes visually.",
    restrictions: [
      "Never add elevation to data visualizations",
      "Never use decorative gradients or effects on data",
      "Never place data directly on atmosphere — must have a surface substrate",
    ],
    allowedParents: ["businessGlass", "focusSurface", "widget"],
  },
};

/* ─── Material Validation ────────────────────── */
export function validateMaterialUsage(
  material: MaterialId,
  parentMaterial: MaterialId,
): { valid: boolean; reason?: string } {
  const def = MATERIALS[material];
  const parentDef = MATERIALS[parentMaterial];

  if (!def) {
    return { valid: false, reason: `Unknown material: ${material}` };
  }

  if (!parentDef) {
    return { valid: false, reason: `Unknown parent material: ${parentMaterial}` };
  }

  if (def.allowedParents.length > 0 && !def.allowedParents.includes(parentMaterial)) {
    return {
      valid: false,
      reason: `Material "${material}" cannot be placed on "${parentMaterial}". Allowed parents: ${def.allowedParents.join(", ")}`,
    };
  }

  return { valid: true };
}
