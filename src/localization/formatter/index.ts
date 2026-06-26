/**
 * Localization — Formatters
 *
 * Lightweight formatting utilities using Intl APIs.
 * Architecture-ready — real implementations live here.
 * Currently returns basic formatted strings via Intl.
 */

import type { LocaleCode } from "../types";

const LOCALE_MAP: Record<LocaleCode, string> = {
  en: "en-US",
  es: "es-MX",
};

function getLocaleString(locale: LocaleCode): string {
  return LOCALE_MAP[locale] ?? "en-US";
}

/**
 * Format a number with locale-aware grouping and decimals.
 */
export function formatNumber(value: number, locale: LocaleCode): string {
  try {
    return new Intl.NumberFormat(getLocaleString(locale)).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Format a currency value with locale-aware symbol and grouping.
 */
export function formatCurrency(
  value: number,
  locale: LocaleCode,
  currency = "USD",
): string {
  try {
    return new Intl.NumberFormat(getLocaleString(locale), {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value}`;
  }
}

/**
 * Format a date to a human-readable string.
 */
export function formatDate(
  date: Date | string,
  locale: LocaleCode,
  options?: Intl.DateTimeFormatOptions,
): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(getLocaleString(locale), {
      weekday: "short",
      month: "short",
      day: "numeric",
      ...options,
    }).format(d);
  } catch {
    return String(date);
  }
}

/**
 * Format a time to a human-readable string.
 */
export function formatTime(
  date: Date | string,
  locale: LocaleCode,
  options?: Intl.DateTimeFormatOptions,
): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(getLocaleString(locale), {
      hour: "numeric",
      minute: "2-digit",
      ...options,
    }).format(d);
  } catch {
    return String(date);
  }
}

type RelativeTimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

/**
 * Format a relative time string (e.g., "3 minutes ago", "hace 3 minutos").
 * Uses the Intl.RelativeTimeFormat API when available.
 */
export function formatRelativeTime(
  value: number,
  unit: RelativeTimeUnit,
  locale: LocaleCode,
): string {
  try {
    return new Intl.RelativeTimeFormat(getLocaleString(locale), {
      style: "long",
      numeric: "auto",
    }).format(value, unit);
  } catch {
    return `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
  }
}
