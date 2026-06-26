/**
 * Design System — Spacing Tokens
 *
 * Defines the spacing scale used throughout the design system.
 * Based on a 4px base unit with logical naming.
 * Every margin, padding, and gap must use these tokens.
 */

export const spacing = {
  /** 4px — minimal separation */
  "0.5": "0.125rem",
  /** 8px — tight */
  "1": "0.25rem",
  /** 12px — comfortable */
  "1.5": "0.375rem",
  /** 16px — default */
  "2": "0.5rem",
  /** 20px — relaxed */
  "2.5": "0.625rem",
  /** 24px — section inner padding */
  "3": "0.75rem",
  /** 32px — card padding */
  "4": "1rem",
  /** 40px — generous card padding */
  "5": "1.25rem",
  /** 48px — section padding */
  "6": "1.5rem",
  /** 56px — wide section padding */
  "7": "1.75rem",
  /** 64px — large section padding */
  "8": "2rem",
  /** 72px — extra large */
  "9": "2.25rem",
  /** 80px — hero padding */
  "10": "2.5rem",
  /** 96px — page section padding */
  "12": "3rem",
  /** 128px — major section padding */
  "16": "4rem",
  /** 160px — hero major padding */
  "20": "5rem",
  /** 192px — page padding */
  "24": "6rem",
  /** 256px — max padding */
  "32": "8rem",
} as const;

/** Semantic spacing aliases for common use cases */
export const spacingAliases = {
  /** Minimum touch target padding */
  touch: "3",
  /** Standard card inner padding */
  card: "6",
  /** Standard section horizontal padding */
  sectionX: "4",
  /** Standard section vertical padding */
  sectionY: "16",
  /** Space between stacked cards */
  cardGap: "6",
  /** Space between sections */
  sectionGap: "16",
  /** Space between elements in a list */
  listGap: "4",
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingAlias = keyof typeof spacingAliases;
