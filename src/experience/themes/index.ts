/**
 * Experience — Theme Definitions
 *
 * Defines the CSS variable overrides for each experience mode.
 * Themes are isolated — future experiences can be added without
 * modifying existing code.
 *
 * Morning (default):
 *   Fresh, bright, calm, optimistic, readable
 *   The current Restaurant OS design — warm dark with amber glow
 *
 * Focus:
 *   Elegant, professional, focused, minimal
 *   Even darker, reduced contrast, minimal glow, for deep work
 *
 * Architecture rule:
 *   Add a new export to this file for each new experience.
 *   No existing code needs to change.
 */

import type { ExperienceMode } from "../types";

export interface ThemeVariables {
  bg: string;
  bgSurface: string;
  bgSurfaceAlt: string;
  bgElevated: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadowGlowPrimary: string;
  shadowGlowSecondary: string;
}

/**
 * Morning theme — Fresh, bright, calm, readable.
 * This is the current Restaurant OS design identity.
 */
const MORNING: ThemeVariables = {
  bg: "#0E0E0E",
  bgSurface: "#181818",
  bgSurfaceAlt: "#222222",
  bgElevated: "#2A2A2A",
  textPrimary: "#F5F5F5",
  textSecondary: "#A0A0A0",
  textMuted: "#6B6B6B",
  border: "#333333",
  borderLight: "#444444",
  shadowSm: "0 1px 2px rgba(0, 0, 0, 0.3)",
  shadowMd: "0 4px 6px rgba(0, 0, 0, 0.4)",
  shadowLg: "0 10px 15px rgba(0, 0, 0, 0.5)",
  shadowXl: "0 20px 25px rgba(0, 0, 0, 0.6)",
  shadowGlowPrimary: "0 0 20px rgba(139, 26, 26, 0.3)",
  shadowGlowSecondary: "0 0 20px rgba(212, 134, 42, 0.3)",
};

/**
 * Focus theme — Elegant, professional, minimal.
 * Even darker backgrounds, reduced contrast, no decorative glow.
 */
const FOCUS: ThemeVariables = {
  bg: "#080808",
  bgSurface: "#101010",
  bgSurfaceAlt: "#181818",
  bgElevated: "#1E1E1E",
  textPrimary: "#E8E8E8",
  textSecondary: "#888888",
  textMuted: "#555555",
  border: "#222222",
  borderLight: "#2A2A2A",
  shadowSm: "0 1px 2px rgba(0, 0, 0, 0.4)",
  shadowMd: "0 4px 6px rgba(0, 0, 0, 0.5)",
  shadowLg: "0 10px 15px rgba(0, 0, 0, 0.6)",
  shadowXl: "0 20px 25px rgba(0, 0, 0, 0.7)",
  shadowGlowPrimary: "none",
  shadowGlowSecondary: "none",
};

export const THEMES: Record<ExperienceMode, ThemeVariables> = {
  morning: MORNING,
  focus: FOCUS,
};

/**
 * Get the CSS custom property declarations for a given experience mode.
 * These are applied to :root when the experience changes.
 */
export function getThemeCss(mode: ExperienceMode): string {
  const t = THEMES[mode];
  return `
  --exp-bg: ${t.bg};
  --exp-bg-surface: ${t.bgSurface};
  --exp-bg-surface-alt: ${t.bgSurfaceAlt};
  --exp-bg-elevated: ${t.bgElevated};
  --exp-text-primary: ${t.textPrimary};
  --exp-text-secondary: ${t.textSecondary};
  --exp-text-muted: ${t.textMuted};
  --exp-border: ${t.border};
  --exp-border-light: ${t.borderLight};
  --exp-shadow-sm: ${t.shadowSm};
  --exp-shadow-md: ${t.shadowMd};
  --exp-shadow-lg: ${t.shadowLg};
  --exp-shadow-xl: ${t.shadowXl};
  --exp-shadow-glow-primary: ${t.shadowGlowPrimary};
  --exp-shadow-glow-secondary: ${t.shadowGlowSecondary};
`;
}
