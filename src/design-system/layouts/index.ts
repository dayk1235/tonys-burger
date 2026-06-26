/**
 * Design System — Layout Primitives
 *
 * Low-level layout components for consistent spacing and arrangement.
 * These are the smallest layout building blocks in the design system.
 *
 * Every layout follows:
 * - Cognitive Behavioral System (One Decision at a Time, Reduced Cognitive Load)
 * - Visual System (Whitespace Philosophy, Screen Rhythm)
 * - Product Principles (Progressive Disclosure, Consistency)
 */

import { type ReactNode } from "react";

/* ─── Layout Types ───────────────────────────── */
export type StackDirection = "vertical" | "horizontal";
export type StackAlignment = "start" | "center" | "end" | "stretch";
export type StackDistribution = "start" | "center" | "end" | "between" | "around" | "evenly";
export type StackGap = "0" | "0.5" | "1" | "1.5" | "2" | "2.5" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16";
export type ResponsiveVariant = "stack" | "inline" | "inline@md";

/* ─── Stack (Flex column/row) ────────────────── */

export interface StackProps {
  children: ReactNode;
  /** Direction of the stack */
  direction?: StackDirection;
  /** How to align items along the cross-axis */
  align?: StackAlignment;
  /** How to distribute items along the main-axis */
  distribute?: StackDistribution;
  /** Gap between items */
  gap?: StackGap;
  /** Whether to wrap items (horizontal only) */
  wrap?: boolean;
  /** When true, uses inline-flex instead of flex */
  inline?: boolean;
  /** Optional class override */
  className?: string;
}

/**
 * Stack — Flexbox layout primitive.
 * Use Stack for 80% of layouts. Only use Grid when you need grid-specific behavior.
 */
export function getStackClasses({
  direction = "vertical",
  align = "stretch",
  distribute = "start",
  gap = "4",
  wrap = false,
  inline = false,
}: Partial<StackProps> = {}): string {
  const flexDirection = direction === "horizontal" ? "flex-row" : "flex-col";

  const alignMap: Record<StackAlignment, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const distributeMap: Record<StackDistribution, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const gapMap: Partial<Record<StackGap, string>> = {
    "0": "gap-0",
    "0.5": "gap-0.5",
    "1": "gap-1",
    "1.5": "gap-1.5",
    "2": "gap-2",
    "2.5": "gap-2.5",
    "3": "gap-3",
    "4": "gap-4",
    "5": "gap-5",
    "6": "gap-6",
    "8": "gap-8",
    "10": "gap-10",
    "12": "gap-12",
    "16": "gap-16",
  };

  return [
    inline ? "inline-flex" : "flex",
    flexDirection,
    alignMap[align],
    distributeMap[distribute],
    gapMap[gap] || "gap-4",
    wrap ? "flex-wrap" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/* ─── Grid ───────────────────────────────────── */

export interface GridProps {
  children: ReactNode;
  /** Number of columns (responsive) */
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Gap between grid items */
  gap?: StackGap;
  /** Optional responsive column override at md breakpoint */
  columnsMd?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Optional class override */
  className?: string;
}

/**
 * Grid — CSS Grid layout primitive.
 * Use when items need to align in both rows and columns.
 */
export function getGridClasses({
  columns = 1,
  gap = "6",
  columnsMd,
}: Partial<GridProps> = {}): string {
  const colMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };

  const gapMap: Partial<Record<StackGap, string>> = {
    "0": "gap-0",
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "5": "gap-5",
    "6": "gap-6",
    "8": "gap-8",
    "10": "gap-10",
    "12": "gap-12",
  };

  const base = colMap[columns] || "grid-cols-1";
  const responsive = columnsMd ? `${base} md:${colMap[columnsMd]}` : base;

  return ["grid", responsive, gapMap[gap] || "gap-6"].join(" ");
}

/* ─── Cluster (wrapping flex) ────────────────── */

export interface ClusterProps {
  children: ReactNode;
  /** Gap between clustered items */
  gap?: StackGap;
  /** Justification when items don't fill the line */
  justify?: "start" | "center" | "end";
  /** Optional class override */
  className?: string;
}

/**
 * Cluster — Wrapping flex layout for tags, badges, chips.
 * Items flow naturally and wrap when they exceed the container width.
 */
export function getClusterClasses({
  gap = "2",
  justify = "start",
}: Partial<ClusterProps> = {}): string {
  const gapMap: Partial<Record<StackGap, string>> = {
    "0": "gap-0",
    "1": "gap-1",
    "1.5": "gap-1.5",
    "2": "gap-2",
    "2.5": "gap-2.5",
    "3": "gap-3",
    "4": "gap-4",
  };

  const justifyMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  return ["flex flex-wrap items-center", gapMap[gap] || "gap-2", justifyMap[justify]]
    .filter(Boolean)
    .join(" ");
}

/* ─── Center ─────────────────────────────────── */

export interface CenterProps {
  children: ReactNode;
  /** Whether to constrain max width */
  maxWidth?: "narrow" | "medium" | "wide" | "none";
  /** Whether to center vertically as well */
  vertically?: boolean;
  /** Optional class override */
  className?: string;
}

/**
 * Center — Centers content horizontally and optionally vertically.
 */
export function getCenterClasses({
  maxWidth = "none",
  vertically = false,
}: Partial<CenterProps> = {}): string {
  const widthMap = {
    narrow: "max-w-container-narrow",
    medium: "max-w-container-max",
    wide: "max-w-container-wide",
    none: "",
  };

  return [
    "mx-auto",
    widthMap[maxWidth],
    vertically ? "flex flex-col justify-center" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/* ─── Cover (full-bleed section) ─────────────── */

export interface CoverProps {
  children: ReactNode;
  /** Minimum height (e.g., "100vh", "min-h-screen") */
  minHeight?: string;
  /** Optional background class */
  backgroundClass?: string;
  /** Optional class override */
  className?: string;
}

/**
 * Cover — Full-bleed container with minimum height.
 * Use for hero sections, splash screens, and full-viewport layouts.
 */
export function getCoverClasses({
  minHeight = "min-h-screen",
}: Partial<CoverProps> = {}): string {
  return [minHeight, "flex flex-col"].filter(Boolean).join(" ");
}

/* ─── Sidebar layout ─────────────────────────── */

export interface SidebarProps {
  children: ReactNode;
  /** Sidebar width (Tailwind width class) */
  sidebarWidth?: string;
  /** Which side the sidebar is on */
  side?: "left" | "right";
  /** Gap between sidebar and content */
  gap?: StackGap;
  /** Optional class override */
  className?: string;
}

/**
 * Sidebar — Sidebar + content layout.
 * Sidebar takes fixed width, content takes remaining space.
 */
export function getSidebarClasses({
  side = "left",
  gap = "6",
}: Partial<SidebarProps> = {}): string {
  const gapMap: Partial<Record<StackGap, string>> = {
    "0": "gap-0",
    "2": "gap-2",
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
  };

  const direction = side === "left" ? "flex-row" : "flex-row-reverse";
  return ["flex", direction, gapMap[gap] || "gap-6"].join(" ");
}

/* ─── Switcher (responsive stack-to-inline) ──── */

export interface SwitcherProps {
  children: ReactNode;
  /** Breakpoint at which to switch from stacked to inline */
  breakpoint?: "sm" | "md" | "lg";
  /** Gap between items */
  gap?: StackGap;
  /** Optional class override */
  className?: string;
}

/**
 * Switcher — Switches between stacked (mobile) and inline (desktop) layout.
 * Use for responsive form layouts and action rows.
 */
export function getSwitcherClasses({
  breakpoint = "md",
  gap = "4",
}: Partial<SwitcherProps> = {}): string {
  const bpMap = {
    sm: "sm:flex-row",
    md: "md:flex-row",
    lg: "lg:flex-row",
  };

  const gapMap: Partial<Record<StackGap, string>> = {
    "0": "gap-0",
    "2": "gap-2",
    "4": "gap-4",
    "6": "gap-6",
  };

  return ["flex flex-col", bpMap[breakpoint], gapMap[gap] || "gap-4"].join(" ");
}
