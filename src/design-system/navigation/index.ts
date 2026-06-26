/**
 * Design System — Navigation Abstractions
 *
 * Defines navigation patterns and route abstractions.
 * These are not components — they are typed contracts that any
 * navigation component must follow.
 *
 * Reference: project-docs/00-vision/RESTAURANT_OS_DESIGN_LANGUAGE.md
 * Reference: project-docs/00-vision/RESTAURANT_OS_VISUAL_SYSTEM.md
 */

/* ─── Navigation Item ────────────────────────── */
export interface NavigationItem {
  /** Display label */
  label: string;
  /** Route href */
  href: string;
  /** Optional icon identifier */
  icon?: string;
  /** Optional badge count */
  badge?: number;
  /** Whether the item is currently active */
  active?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item is external link */
  external?: boolean;
  /** Nested items (for dropdown/subnav) */
  children?: NavigationItem[];
}

/* ─── Navigation Section ─────────────────────── */
export interface NavigationSection {
  /** Section title (e.g., "Main", "Settings") */
  title?: string;
  /** Items in this section */
  items: NavigationItem[];
}

/* ─── Navigation Variants ────────────────────── */
export type NavigationVariant =
  | "primary"   // Main navigation — sidebar, topbar
  | "secondary" // Sub-navigation — tabs within a section
  | "tertiary"  // Contextual — breadcrumbs, pagination
  | "utility";  // Utility — settings, account, help

/* ─── Breadcrumb ─────────────────────────────── */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Route href (last item is current, no href) */
  href?: string;
}

/* ─── Tab ────────────────────────────────────── */
export interface TabItem {
  /** Tab display label */
  label: string;
  /** Tab value (used for state management) */
  value: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Optional badge count */
  badge?: number;
  /** Optional icon identifier */
  icon?: string;
}

/* ─── Pagination ─────────────────────────────── */
export interface PaginationState {
  /** Current page number (0-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items (optional, for display) */
  totalItems?: number;
  /** Items per page */
  pageSize: number;
}

/* ─── Step ───────────────────────────────────── */
export interface StepItem {
  /** Step label */
  label: string;
  /** Step description (optional) */
  description?: string;
  /** Step status */
  status: "pending" | "active" | "completed" | "error";
  /** Whether the step is disabled */
  disabled?: boolean;
}
