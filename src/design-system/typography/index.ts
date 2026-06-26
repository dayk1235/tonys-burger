/**
 * Design System — Typography Roles
 *
 * Defines semantic typography roles used throughout Restaurant OS.
 * Each role specifies font family, size, weight, line height, and letter spacing.
 *
 * Roles are semantic, not visual. Use the role that matches the content's purpose,
 * not the visual appearance you want.
 *
 * Reference: project-docs/00-vision/RESTAURANT_OS_VISUAL_SYSTEM.md
 */

import { fontFamily, fontWeight, fontSize, lineHeight, letterSpacing } from "../tokens";

/* ─── Role Identifiers ───────────────────────── */
export type TypographyRole =
  | "hero"
  | "display"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "subheading"
  | "body"
  | "bodySmall"
  | "caption"
  | "label"
  | "eyebrow"
  | "code"
  | "codeSmall"
  | "metric"
  | "metricSmall";

/* ─── Role Definition ────────────────────────── */
export interface TypographyRoleDefinition {
  /** Semantic role name */
  role: TypographyRole;
  /** Font family key */
  family: keyof typeof fontFamily;
  /** Font weight */
  weight: string;
  /** Font size */
  size: string;
  /** Line height */
  lineHeight: string;
  /** Letter spacing */
  letterSpacing: string;
  /** When to use this role */
  usage: string;
  /** When NOT to use this role */
  restrictions: string;
}

/* ─── Role Definitions ───────────────────────── */
export const TYPOGRAPHY_ROLES: Record<TypographyRole, TypographyRoleDefinition> = {
  hero: {
    role: "hero",
    family: "heading",
    weight: "700",
    size: fontSize["7xl"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.wide,
    usage: "Primary marketing hero text on landing pages. Use once per page maximum.",
    restrictions: "Never use for dashboard or owner app. Marketing only.",
  },
  display: {
    role: "display",
    family: "heading",
    weight: "700",
    size: fontSize["5xl"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
    usage: "Major section headings. Health numbers. Large emphasis text.",
    restrictions: "Never use for body text. Use sparingly for maximum impact.",
  },
  heading1: {
    role: "heading1",
    family: "heading",
    weight: "600",
    size: fontSize["4xl"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
    usage: "Primary page headings. Section titles. Top-level hierarchy.",
    restrictions: "Only one heading1 per screen.",
  },
  heading2: {
    role: "heading2",
    family: "heading",
    weight: "600",
    size: fontSize["3xl"],
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
    usage: "Card titles. Subsection headings. Second-level hierarchy.",
    restrictions: "Never nest heading2 deeper than second level.",
  },
  heading3: {
    role: "heading3",
    family: "sans",
    weight: "600",
    size: fontSize["2xl"],
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
    usage: "Card subtitles. Metric labels. Third-level hierarchy.",
    restrictions: "Avoid bold variants — weight is already 600.",
  },
  heading4: {
    role: "heading4",
    family: "sans",
    weight: "600",
    size: fontSize["xl"],
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
    usage: "Group titles within cards. Feature labels. Fourth-level hierarchy.",
    restrictions: "At this level, consider if a subheading or body would be more appropriate.",
  },
  subheading: {
    role: "subheading",
    family: "sans",
    weight: "500",
    size: fontSize["lg"],
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
    usage: "Supporting headings. 'Meaning before metrics' summary line beneath health.",
    restrictions: "Never use as primary heading. Always subordinate to a heading role.",
  },
  body: {
    role: "body",
    family: "sans",
    weight: "400",
    size: fontSize["base"],
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    usage: "Default body text. Paragraphs. Descriptions. Explanations.",
    restrictions: "For the reading experience, prefer relaxed line height. This is minimum.",
  },
  bodySmall: {
    role: "bodySmall",
    family: "sans",
    weight: "400",
    size: fontSize["sm"],
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    usage: "Secondary body content. Metadata. Supporting information.",
    restrictions: "Never use for primary content. Reserve for supporting detail.",
  },
  caption: {
    role: "caption",
    family: "sans",
    weight: "400",
    size: fontSize["xs"],
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
    usage: "Timestamp labels. Helper text. Legal text. Footnotes.",
    restrictions: "Minimum accessible text size. Never use for actionable content.",
  },
  label: {
    role: "label",
    family: "sans",
    weight: "500",
    size: fontSize["xs"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.widest,
    usage: "Interactive element labels. Input labels. Toggle labels. Button text (small).",
    restrictions: "Never use for body text. Uppercase when used as input label.",
  },
  eyebrow: {
    role: "eyebrow",
    family: "sans",
    weight: "600",
    size: fontSize["xs"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.widest,
    usage: "Section eyebrow labels above headings. Category indicators. Status labels.",
    restrictions: "Always uppercase. Always above a heading. Never standalone.",
  },
  code: {
    role: "code",
    family: "mono",
    weight: "400",
    size: fontSize["sm"],
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    usage: "Code snippets. Data values. System output. Debug information.",
    restrictions: "Never use in public-facing UI. Owner-facing code blocks only for debugging.",
  },
  codeSmall: {
    role: "codeSmall",
    family: "mono",
    weight: "400",
    size: fontSize["xs"],
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    usage: "Inline code. Small data values. System identifiers.",
    restrictions: "Minimum size for monospace. Never use for primary content.",
  },
  metric: {
    role: "metric",
    family: "heading",
    weight: "700",
    size: fontSize["5xl"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
    usage: "Primary health metric number. Large numerical displays.",
    restrictions: "Never use for text content. Numbers only.",
  },
  metricSmall: {
    role: "metricSmall",
    family: "heading",
    weight: "600",
    size: fontSize["2xl"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
    usage: "Secondary metrics. Dimension scores. Dashboard metric cards.",
    restrictions: "Never use for text content. Numbers only.",
  },
};

/* ─── Utility: Get Tailwind classes for a role ─ */
export function getRoleClasses(role: TypographyRole): string {
  const def = TYPOGRAPHY_ROLES[role];

  const fontClass: Record<string, string> = {
    sans: "font-sans",
    mono: "font-mono",
    heading: "font-heading",
  };

  const weightClass = `font-${def.weight}`;
  const sizeMap: Record<string, string> = {
    "0.75rem": "text-xs",
    "0.875rem": "text-sm",
    "1rem": "text-base",
    "1.125rem": "text-lg",
    "1.25rem": "text-xl",
    "1.5rem": "text-2xl",
    "1.875rem": "text-3xl",
    "2.25rem": "text-4xl",
    "3rem": "text-5xl",
    "3.75rem": "text-6xl",
    "4.5rem": "text-7xl",
  };

  const sizeClass = sizeMap[def.size] || "";
  return `${fontClass[def.family]} ${weightClass} ${sizeClass}`.trim();
}
