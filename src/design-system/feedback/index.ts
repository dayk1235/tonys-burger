/**
 * Design System — Feedback Primitives
 *
 * Defines the feedback state types and abstractions for every interactive surface.
 * Every component in the platform uses these states consistently.
 *
 * References:
 * - Cognitive Behavioral System: Empty State Philosophy (Section 21)
 * - Visual System: Calm communication of state
 * - Product Principles: Reduce Anxiety (Principle 11), No Dead Ends (Principle 16)
 */

import { type ReactNode } from "react";

/* ─── State Identifiers ──────────────────────── */
export type FeedbackState =
  | "idle"
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "warning"
  | "info";

/* ─── State Configuration ────────────────────── */
export interface FeedbackStateConfig {
  /** State identifier */
  state: FeedbackState;
  /** Whether a visual indicator is shown */
  showIndicator: boolean;
  /** Whether a message is shown */
  showMessage: boolean;
  /** Whether an action is available */
  showAction: boolean;
  /** Default behavior when this state is entered */
  defaultBehavior: "passive" | "actionable" | "blocking";
}

/* ─── State Definitions ──────────────────────── */
export const FEEDBACK_STATES: Record<FeedbackState, FeedbackStateConfig> = {
  idle: {
    state: "idle",
    showIndicator: false,
    showMessage: false,
    showAction: false,
    defaultBehavior: "passive",
  },
  loading: {
    state: "loading",
    showIndicator: true,
    showMessage: true,
    showAction: false,
    defaultBehavior: "passive",
  },
  empty: {
    state: "empty",
    showIndicator: true,
    showMessage: true,
    showAction: true,
    defaultBehavior: "actionable",
  },
  error: {
    state: "error",
    showIndicator: true,
    showMessage: true,
    showAction: true,
    defaultBehavior: "actionable",
  },
  success: {
    state: "success",
    showIndicator: true,
    showMessage: true,
    showAction: false,
    defaultBehavior: "passive",
  },
  warning: {
    state: "warning",
    showIndicator: true,
    showMessage: true,
    showAction: true,
    defaultBehavior: "actionable",
  },
  info: {
    state: "info",
    showIndicator: true,
    showMessage: true,
    showAction: false,
    defaultBehavior: "passive",
  },
};

/* ─── Empty State ────────────────────────────── */

export interface EmptyStateDefinition {
  /** Icon or visual indicator (defined by consumer) */
  icon?: ReactNode;
  /** Primary message — explains what would be here */
  title: string;
  /** Secondary message — explains why it is empty */
  description: string;
  /** Optional action to resolve the empty state */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Whether to show a suggested next step */
  showSuggestion?: boolean;
  /** Optional suggestion text */
  suggestion?: string;
}

/**
 * Empty State Philosophy (Cognitive Behavioral System, Section 21):
 * Every empty state must explain what would populate it and why it is empty.
 * No unexplained blank spaces.
 *
 * @example
 * const empty: EmptyStateDefinition = {
 *   title: "No recommendations yet",
 *   description: "Recommendations appear once the platform has enough data. This typically takes 2–3 days.",
 *   action: { label: "Connect data sources", onClick: () => {} },
 * }
 */

/* ─── Loading State ──────────────────────────── */

export interface LoadingStateDefinition {
  /** Whether to show a skeleton placeholder */
  variant: "skeleton" | "spinner" | "pulse";
  /** Optional message (e.g., "Loading your dashboard...") */
  message?: string;
  /** Number of skeleton rows to show */
  rows?: number;
  /** Whether the loading is indeterminate or percentage-based */
  progress?: "indeterminate" | number;
}

/**
 * Loading State Philosophy:
 * The platform should never feel blocked. Loading is a transition, not a wall.
 * Use skeleton placeholders for content areas, spinners only for actions.
 *
 * @example
 * const loading: LoadingStateDefinition = {
 *   variant: "skeleton",
 *   rows: 3,
 *   message: "Loading your health data...",
 * }
 */

/* ─── Error State ────────────────────────────── */

export interface ErrorStateDefinition {
  /** Error title — what went wrong */
  title: string;
  /** Error description — what happened and what to do */
  description: string;
  /** Whether to show a retry action */
  retryable?: boolean;
  /** Retry callback */
  onRetry?: () => void;
  /** Error severity */
  severity: "warning" | "critical";
}

/**
 * Error State Philosophy (Product Principles, Section 11):
 * Errors appear as text, not as animation. No shaking inputs. No red flashes.
 * The error explains what happened and what to do next.
 *
 * @example
 * const error: ErrorStateDefinition = {
 *   title: "Could not reach the delivery platform",
 *   description: "Your data may be delayed. We will retry automatically.",
 *   retryable: true,
 *   onRetry: () => refetch(),
 *   severity: "warning",
 * }
 */

/* ─── Success State ──────────────────────────── */

export interface SuccessStateDefinition {
  /** Success message */
  title: string;
  /** Optional detail */
  description?: string;
  /** Optional action to continue */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Success State Philosophy (Design Language, Section 10):
 * Restaurant OS celebrates success quietly. Factual. Specific. Grounded in outcomes.
 * No confetti. No badges. No gamification.
 *
 * @example
 * const success: SuccessStateDefinition = {
 *   title: "Experiment created successfully",
 *   description: "Your Happy Hour experiment is now running. Results will be available in 7 days.",
 *   action: { label: "View experiment", onClick: () => {} },
 * }
 */

/* ─── Utility: Map feedback state to semantic color ──── */
export function feedbackStateToColor(state: FeedbackState): string {
  const colorMap: Record<FeedbackState, string> = {
    idle: "text-text-secondary",
    loading: "text-text-muted",
    empty: "text-text-secondary",
    error: "text-error",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
  };
  return colorMap[state] || "text-text-secondary";
}
