/**
 * Design System — Easing Utilities
 *
 * Bridges design system CSS easing strings with animation libraries.
 * Design system motion roles define easing as CSS cubic-bezier strings.
 * Animation libraries (Framer Motion, GSAP) need them as arrays or type-specific formats.
 *
 * This file provides the conversion layer so every component uses the same parser.
 * Import from here instead of defining parseEasing in each component.
 */

/**
 * Parse a CSS cubic-bezier string into a Framer Motion-compatible easing array.
 * Falls back to "easeOut" if the string is not a cubic-bezier.
 *
 * @example
 * parseEasing("cubic-bezier(0.4, 0, 0.2, 1)") // → [0.4, 0, 0.2, 1]
 * parseEasing("easeOut") // → "easeOut"
 */
export function parseEasing(easing: string): [number, number, number, number] | "easeOut" {
  const match = easing.match(/cubic-bezier\(([^)]+)\)/);
  if (match) {
    const parts = match[1].split(",").map((v) => parseFloat(v.trim()));
    if (parts.length === 4) {
      return parts as [number, number, number, number];
    }
  }
  return "easeOut";
}

/**
 * Convert a design system easing key to a GSAP-compatible easing string.
 * GSAP accepts "power2.out", "power3.inOut", or custom cubic-bezier strings.
 */
export function toGsapEasing(easing: string): string {
  if (easing.startsWith("cubic-bezier")) {
    return easing;
  }
  // Map common easing names to GSAP equivalents
  const easingMap: Record<string, string> = {
    "cubic-bezier(0.4, 0, 0.2, 1)": "power2.out",
    "cubic-bezier(0, 0, 0.2, 1)": "power2.out",
    "cubic-bezier(0.4, 0, 1, 1)": "power2.in",
    "linear": "linear",
  };
  return easingMap[easing] || "power2.out";
}
