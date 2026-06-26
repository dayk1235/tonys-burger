/**
 * Localization — Translation Utilities
 *
 * Resolves nested dictionary keys using dot notation (e.g., "health.states.excellent")
 * and supports simple template interpolation ({key}).
 */

import type { NestedDict } from "./types";

/**
 * Resolve a dot-separated key path within a nested dictionary.
 * Returns the raw value (string or nested object).
 */
export function resolveKey(
  dict: NestedDict,
  path: string,
): string | NestedDict | undefined {
  const keys = path.split(".");
  let current: NestedDict | string | undefined = dict;

  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as NestedDict)[key];
  }

  return current;
}

/**
 * Translate a dot-separated key. Supports template interpolation:
 * t("health.refreshed", { time: "30 seconds ago" })
 * → "Health refreshed 30 seconds ago"
 */
export function translate(
  dict: NestedDict,
  path: string,
  params?: Record<string, string | number>,
): string {
  const value = resolveKey(dict, path);

  if (typeof value === "string") {
    let result = value;
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        result = result.replace(`{${key}}`, String(val));
      }
    }
    return result;
  }

  // Return the path as a fallback so missing translations are obvious
  return `[${path}]`;
}

/**
 * Deep-merge a nested dictionary path result into a flat params-friendly value.
 * Used when the dictionary key returns a nested object rather than a string.
 */
export function translateNested(
  dict: NestedDict,
  path: string,
  subKey: string,
  params?: Record<string, string | number>,
): string {
  const fullPath = `${path}.${subKey}`;
  return translate(dict, fullPath, params);
}
