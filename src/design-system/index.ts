/**
 * Restaurant OS Design System — Barrel Export
 *
 * The permanent design foundation for every current and future Restaurant OS interface.
 *
 * Import from "@design-system" for all design system modules.
 *
 * @example
 * import { brand, TYPOGRAPHY_ROLES, useReducedMotion } from "@design-system";
 */

/* ─── Tokens ─────────────────────────────────── */
export {
  brand,
  semantic,
  surface,
  text,
  border,
  overlay,
  focus,
  spacing,
  spacingAliases,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  elevation,
  glow,
  interactive,
  duration,
  easing,
  motionVariables,
} from "./tokens";

export type {
  ColorTokens,
  SpacingKey,
  SpacingAlias,
  FontFamily,
  FontWeight,
  FontSize,
  LineHeight,
  LetterSpacing,
  ElevationLevel,
  GlowType,
  InteractiveShadow,
  DurationCategory,
  EasingCurve,
} from "./tokens";

/* ─── Materials ──────────────────────────────── */
export {
  MATERIALS,
  validateMaterialUsage,
} from "./materials";

export type {
  MaterialId,
  MaterialDefinition,
} from "./materials";

/* ─── Typography ─────────────────────────────── */
export {
  TYPOGRAPHY_ROLES,
  getRoleClasses,
} from "./typography";

export type {
  TypographyRole,
  TypographyRoleDefinition,
} from "./typography";

/* ─── Motion ─────────────────────────────────── */
export {
  MOTION_LEVELS,
  MOTION_ROLES,
  getMotionConfig,
  getTransitionCss,
  parseEasing,
  toGsapEasing,
} from "./motion";

export type {
  MotionLevel,
  MotionRole,
  MotionDefinition,
  MotionConfig,
  AnimationPhase,
} from "./motion";

/* ─── Surfaces ───────────────────────────────── */
export {
  SURFACES,
  getSurfaceClasses,
} from "./surfaces";

export type {
  SurfaceType,
  SurfaceDefinition,
} from "./surfaces";

/* ─── Layouts ────────────────────────────────── */
export {
  getStackClasses,
  getGridClasses,
  getClusterClasses,
  getCenterClasses,
  getCoverClasses,
  getSidebarClasses,
  getSwitcherClasses,
} from "./layouts";

export type {
  StackProps,
  StackDirection,
  StackAlignment,
  StackDistribution,
  StackGap,
  GridProps,
  ClusterProps,
  CenterProps,
  CoverProps,
  SidebarProps,
  SwitcherProps,
} from "./layouts";

/* ─── Primitives ─────────────────────────────── */
export {
  Box,
  Flex,
  Center,
  VisuallyHidden,
  Divider,
} from "./primitives";

export type {
  BoxProps,
  FlexProps,
  CenterProps as CenterPrimitiveProps,
  VisuallyHiddenProps,
  DividerProps,
} from "./primitives";

/* ─── Feedback ───────────────────────────────── */
export {
  FEEDBACK_STATES,
  feedbackStateToColor,
} from "./feedback";

export type {
  FeedbackState,
  FeedbackStateConfig,
  EmptyStateDefinition,
  LoadingStateDefinition,
  ErrorStateDefinition,
  SuccessStateDefinition,
} from "./feedback";

/* ─── Navigation ─────────────────────────────── */
export type {
  NavigationItem,
  NavigationSection,
  NavigationVariant,
  BreadcrumbItem,
  TabItem,
  PaginationState,
  StepItem,
} from "./navigation";

/* ─── Hooks ──────────────────────────────────── */
export {
  useMediaQuery,
  useReducedMotion,
  useResponsive,
  useViewport,
  usePrefersColorScheme,
  useReducedData,
  useStableCallback,
} from "./hooks";

export type {
  ResponsiveBreakpoint,
  ColorScheme,
} from "./hooks";

/* ─── Providers ──────────────────────────────── */
export {
  DesignSystemProvider,
  useMotionContext,
} from "./providers";

export type {
  MotionContextValue,
  DesignSystemProviderProps,
} from "./providers";
