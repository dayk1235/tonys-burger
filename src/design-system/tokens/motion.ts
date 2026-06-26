/**
 * Design System — Motion Tokens
 *
 * Timing and easing definitions for the Ambient Motion System.
 * Every animation in Restaurant OS uses these tokens.
 * No magic numbers allowed.
 */

/* ─── Duration Categories ────────────────────── */
export const duration = {
  /** ~100ms — micro feedback, hover states, toggle switches */
  fast: "100ms",
  /** ~200ms — button press, selection, microinteractions */
  normal: "200ms",
  /** ~300ms — state changes, metric updates, panel reveals */
  reflective: "300ms",
  /** ~500ms — context changes, section expansions, insight reveals */
  slow: "500ms",
  /** ~800ms — scene transitions, signature moments */
  cinematic: "800ms",
} as const;

/* ─── Easing Curves ──────────────────────────── */
export const easing = {
  /** Standard — most UI animations */
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Decelerate — elements entering the screen */
  out: "cubic-bezier(0, 0, 0.2, 1)",
  /** Accelerate — elements leaving the screen */
  in: "cubic-bezier(0.4, 0, 1, 1)",
  /** Spring-like — for emphasis (use sparingly) */
  spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  /** Linear — for continuous motion (spinners, progress) */
  linear: "linear",
} as const;

/* ─── Motion as CSS Custom Property Strings ──── */
export const motionVariables = {
  "--ds-duration-fast": duration.fast,
  "--ds-duration-normal": duration.normal,
  "--ds-duration-reflective": duration.reflective,
  "--ds-duration-slow": duration.slow,
  "--ds-duration-cinematic": duration.cinematic,
  "--ds-easing-default": easing.default,
  "--ds-easing-out": easing.out,
  "--ds-easing-in": easing.in,
  "--ds-easing-spring": easing.spring,
  "--ds-easing-linear": easing.linear,
} as const;

export type DurationCategory = keyof typeof duration;
export type EasingCurve = keyof typeof easing;
