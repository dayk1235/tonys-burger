/**
 * Design System — Typography Tokens
 *
 * Font family definitions, font size scale, and line height system.
 * Typography tokens power the Typography Roles system.
 * No semantic naming here — just raw values.
 */

/* ─── Font Families ──────────────────────────── */
export const fontFamily = {
  /** Primary UI font */
  sans: "var(--font-sans, 'Inter', ui-sans-serif, system-ui, sans-serif)",
  /** Monospace for code and data */
  mono: "var(--font-mono, ui-monospace, SFMono-Regular, monospace)",
  /** Display/heading font */
  heading: "var(--font-heading, 'Playfair Display', ui-serif, Georgia, serif)",
} as const;

/* ─── Font Weights ───────────────────────────── */
export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/* ─── Font Size Scale ────────────────────────── */
export const fontSize = {
  /** 12px — captions, labels, metadata */
  xs: "0.75rem",
  /** 14px — body text, secondary content */
  sm: "0.875rem",
  /** 16px — default body text */
  base: "1rem",
  /** 18px — large body, small headings */
  lg: "1.125rem",
  /** 20px — section headings */
  xl: "1.25rem",
  /** 24px — card headings */
  "2xl": "1.5rem",
  /** 30px — major headings */
  "3xl": "1.875rem",
  /** 36px — display headings */
  "4xl": "2.25rem",
  /** 48px — hero headings */
  "5xl": "3rem",
  /** 60px — marketing hero */
  "6xl": "3.75rem",
  /** 72px — large marketing hero */
  "7xl": "4.5rem",
} as const;

/* ─── Line Heights ───────────────────────────── */
export const lineHeight = {
  /** Tight — headings */
  tight: "1.15",
  /** Snug — subheadings */
  snug: "1.3",
  /** Default — body text */
  normal: "1.5",
  /** Relaxed — long form reading */
  relaxed: "1.625",
  /** Loose — large display text */
  loose: "1.75",
} as const;

/* ─── Letter Spacing ─────────────────────────── */
export const letterSpacing = {
  /** Default */
  normal: "0",
  /** Small headings tracking */
  wide: "0.025em",
  /** Eyebrow tracking */
  wider: "0.05em",
  /** Uppercase tracking */
  widest: "0.1em",
} as const;

export type FontFamily = keyof typeof fontFamily;
export type FontWeight = keyof typeof fontWeight;
export type FontSize = keyof typeof fontSize;
export type LineHeight = keyof typeof lineHeight;
export type LetterSpacing = keyof typeof letterSpacing;
