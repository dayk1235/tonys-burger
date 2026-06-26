/**
 * Localization — Type Definitions
 *
 * Central types for the localization system.
 * Designed for unlimited language extensibility.
 */

export type LocaleCode = "en" | "es";

export type RegionCode = "US" | "MX" | "auto";

export interface LocaleDefinition {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  regions: RegionCode[];
  defaultRegion: RegionCode;
}

export interface LocaleConfig {
  locale: LocaleCode;
  region: RegionCode;
  timezone: string;
}

export type TranslationDict = Record<string, string | Record<string, unknown>>;

export interface NestedDict {
  [key: string]: string | NestedDict;
}
