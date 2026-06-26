/**
 * Design System — Color Tokens
 *
 * This is the single source of truth for all color values.
 * Every color used in the design system must be defined here.
 * No hardcoded color values should appear anywhere else.
 *
 * Architecture:
 * - Brand colors are static (never change with experience mode)
 * - Semantic colors communicate meaning (success, error, warning, info)
 * - Experience colors are dynamic values that adapt via CSS custom properties
 * - Surface colors define the material hierarchy
 */

/* ─── Brand Colors (static) ─────────────────── */
export const brand = {
  primary: "#8B1A1A",
  primaryHover: "#6E1414",
  primaryLight: "#C0392B",
  secondary: "#D4862A",
  secondaryHover: "#B8721F",
  secondaryLight: "#E8A04A",
} as const;

/* ─── Semantic Colors (static) ──────────────── */
export const semantic = {
  success: "#2E7D32",
  error: "#D32F2F",
  warning: "#D4862A",
  info: "#1976D2",
} as const;

/* ─── Experience Surface Colors (default values) ─ */
export const surface = {
  base: "#0E0E0E",
  surface: "#181818",
  surfaceAlt: "#222222",
  elevated: "#2A2A2A",
} as const;

/* ─── Experience Text Colors (default values) ──── */
export const text = {
  primary: "#F5F5F5",
  secondary: "#A0A0A0",
  muted: "#6B6B6B",
  inverse: "#0E0E0E",
} as const;

/* ─── Border Colors ──────────────────────────── */
export const border = {
  base: "#333333",
  light: "#444444",
} as const;

/* ─── Overlay ────────────────────────────────── */
export const overlay = {
  base: "rgba(0, 0, 0, 0.6)",
} as const;

/* ─── Focus ring ─────────────────────────────── */
export const focus = {
  ring: brand.primary,
  ringWidth: "2px",
  ringOffset: "2px",
} as const;

export type ColorTokens = {
  brand: typeof brand;
  semantic: typeof semantic;
  surface: typeof surface;
  text: typeof text;
  border: typeof border;
  overlay: typeof overlay;
  focus: typeof focus;
};
