/**
 * Design System — Tokens Barrel Export
 *
 * Central export point for all design token constants.
 * Import tokens from "@design-system/tokens" for infrastructure code.
 * Components should use CSS custom properties via Tailwind for most cases.
 */

export { brand, semantic, surface, text, border, overlay, focus } from "./colors";
export type { ColorTokens } from "./colors";
export { spacing, spacingAliases } from "./spacing";
export type { SpacingKey, SpacingAlias } from "./spacing";
export { fontFamily, fontWeight, fontSize, lineHeight, letterSpacing } from "./typography";
export type { FontFamily, FontWeight, FontSize, LineHeight, LetterSpacing } from "./typography";
export { elevation, glow, interactive } from "./shadows";
export type { ElevationLevel, GlowType, InteractiveShadow } from "./shadows";
export { duration, easing, motionVariables } from "./motion";
export type { DurationCategory, EasingCurve } from "./motion";
