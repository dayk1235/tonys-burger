/**
 * Design System — Shadow Tokens
 *
 * Elevation and shadow definitions for the Material System.
 * Shadows communicate depth. Higher elevation = closer to the user.
 */

/* ─── Elevation Scale ────────────────────────── */
export const elevation = {
  /** Base level — no depth */
  0: "none",
  /** Subtle — card hover, pressed states */
  1: "0 1px 2px rgba(0, 0, 0, 0.3)",
  /** Low — standard cards */
  2: "0 2px 4px rgba(0, 0, 0, 0.35)",
  /** Medium — elevated cards, panels */
  3: "0 4px 6px rgba(0, 0, 0, 0.4)",
  /** High — modals, drawers */
  4: "0 8px 12px rgba(0, 0, 0, 0.45)",
  /** Float — floating elements, tooltips */
  5: "0 10px 15px rgba(0, 0, 0, 0.5)",
  /** Overlay — modals, toasts */
  6: "0 16px 24px rgba(0, 0, 0, 0.55)",
  /** Ceiling — highest elements (toasts, alerts) */
  7: "0 20px 25px rgba(0, 0, 0, 0.6)",
  /** Max — absolute highest elevation */
  8: "0 24px 32px rgba(0, 0, 0, 0.65)",
} as const;

/* ─── Glow Shadows ───────────────────────────── */
export const glow = {
  /** Primary brand glow — emphasis, success states */
  primary: "0 0 20px rgba(139, 26, 26, 0.3)",
  /** Secondary brand glow — highlights, warnings */
  secondary: "0 0 20px rgba(212, 134, 42, 0.3)",
  /** Subtle primary glow — reduced emphasis */
  primarySubtle: "0 0 12px rgba(139, 26, 26, 0.15)",
  /** Subtle secondary glow — reduced warning emphasis */
  secondarySubtle: "0 0 12px rgba(212, 134, 42, 0.15)",
} as const;

/* ─── Interactive State Shadows ──────────────── */
export const interactive = {
  /** Default rest state */
  rest: elevation[1],
  /** Hover — lift slightly */
  hover: elevation[3],
  /** Active/Pressed — push down */
  active: elevation[0],
  /** Focus — brand glow */
  focus: glow.primarySubtle,
} as const;

export type ElevationLevel = keyof typeof elevation;
export type GlowType = keyof typeof glow;
export type InteractiveShadow = keyof typeof interactive;
