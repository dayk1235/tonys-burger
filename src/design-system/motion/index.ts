/**
 * Design System — Motion Roles
 *
 * Implements the Restaurant OS Ambient Motion System hierarchy.
 * Every animation in the platform belongs to one of six levels.
 *
 * Reference: project-docs/00-vision/AMBIENT_MOTION_SYSTEM.md
 * Data: project-docs/00-vision/RESTAURANT_OS_COGNITIVE_BEHAVIORAL_SYSTEM.md
 */

import { duration, easing } from "../tokens";
import type { DurationCategory, EasingCurve } from "../tokens";

/* ─── Motion Hierarchy Levels ────────────────── */
export type MotionLevel =
  | "invisible"
  | "micro"
  | "stateChange"
  | "contextChange"
  | "sceneChange"
  | "signature";

/* ─── Animation Phase ────────────────────────── */
export type AnimationPhase = "enter" | "exit" | "update" | "hover" | "press" | "focus";

/* ─── Motion Definition ──────────────────────── */
export interface MotionDefinition {
  /** Hierarchy level */
  level: MotionLevel;
  /** Duration category */
  duration: DurationCategory;
  /** Easing curve key */
  easing: EasingCurve;
  /** Does the owner perceive this animation? */
  perceptible: boolean;
  /** Does this animation demand attention? */
  attention: boolean;
  /** Human description */
  description: string;
  /** Allowed animation types at this level */
  allowedTypes: Array<"fade" | "translate" | "scale" | "color" | "dimension" | "blur">;
}

/* ─── Level Definitions ──────────────────────── */
export const MOTION_LEVELS: Record<MotionLevel, MotionDefinition> = {
  invisible: {
    level: "invisible",
    duration: "fast",
    easing: "linear",
    perceptible: false,
    attention: false,
    description: "The platform is working. The owner should not know. Data refreshes silently.",
    allowedTypes: ["color", "dimension"],
  },
  micro: {
    level: "micro",
    duration: "fast",
    easing: "out",
    perceptible: true,
    attention: false,
    description: "The owner interacts. The platform acknowledges. Button press, hover, toggle, selection.",
    allowedTypes: ["color", "translate"],
  },
  stateChange: {
    level: "stateChange",
    duration: "normal",
    easing: "out",
    perceptible: true,
    attention: false,
    description: "Something changed. The owner should know. Metric update, state toggle, health change.",
    allowedTypes: ["fade", "translate", "color"],
  },
  contextChange: {
    level: "contextChange",
    duration: "reflective",
    easing: "out",
    perceptible: true,
    attention: true,
    description: "The owner moved through the interface. Section expansion, panel reveal, card detail.",
    allowedTypes: ["fade", "translate", "scale", "dimension"],
  },
  sceneChange: {
    level: "sceneChange",
    duration: "slow",
    easing: "default",
    perceptible: true,
    attention: true,
    description: "The owner moved to a different part of the platform. Page transition, route change.",
    allowedTypes: ["fade", "translate", "blur"],
  },
  signature: {
    level: "signature",
    duration: "cinematic",
    easing: "default",
    perceptible: true,
    attention: true,
    description: "Something exceptional happened. Health improves to Excellent. Experiment succeeds.",
    allowedTypes: ["fade", "translate", "scale", "color", "blur"],
  },
};

/* ─── Motion Role — Maps animation purpose to level ── */
export type MotionRole =
  /** Element entering the viewport */
  | "enter"
  /** Element leaving the viewport */
  | "exit"
  /** Element updating in place (value change) */
  | "update"
  /** Interactive element hover */
  | "hover"
  /** Interactive element press */
  | "press"
  /** Progress indicator */
  | "progress"
  /** Loading skeleton pulse */
  | "skeleton"
  /** Notification arrival */
  | "notification"
  /** Modal/dialog open */
  | "modalOpen"
  /** Modal/dialog close */
  | "modalClose";

/* ─── Motion Role to Level Mapping ───────────── */
export const MOTION_ROLES: Record<MotionRole, MotionDefinition> = {
  enter: {
    ...MOTION_LEVELS.contextChange,
    duration: "reflective",
    easing: "out",
    description: "Element entering the screen. Fade in from its natural position.",
    allowedTypes: ["fade", "translate"],
  },
  exit: {
    ...MOTION_LEVELS.stateChange,
    duration: "normal",
    easing: "in",
    description: "Element leaving the screen. Fade out quickly.",
    allowedTypes: ["fade"],
  },
  update: {
    ...MOTION_LEVELS.stateChange,
    description: "An element updates its value or state in place.",
    allowedTypes: ["fade", "color", "translate"],
  },
  hover: {
    ...MOTION_LEVELS.micro,
    description: "Interactive element hover state. Subtle color shift, never scale or bounce.",
    allowedTypes: ["color"],
  },
  press: {
    ...MOTION_LEVELS.micro,
    description: "Interactive element press state. Physical depression, color shift.",
    allowedTypes: ["translate", "color"],
  },
  progress: {
    ...MOTION_LEVELS.invisible,
    description: "Progress indication. Continuous motion while background work completes.",
    allowedTypes: ["translate"],
  },
  skeleton: {
    ...MOTION_LEVELS.invisible,
    description: "Skeleton loading pulse. Extremely subtle, like breathing.",
    allowedTypes: ["color"],
  },
  notification: {
    ...MOTION_LEVELS.contextChange,
    duration: "reflective",
    description: "Notification arriving. Appears in its natural position, gentle fade.",
    allowedTypes: ["fade", "translate"],
  },
  modalOpen: {
    ...MOTION_LEVELS.signature,
    description: "Modal opening. Atmosphere dims, modal rises into position.",
    allowedTypes: ["fade", "scale", "blur"],
  },
  modalClose: {
    ...MOTION_LEVELS.contextChange,
    duration: "normal",
    easing: "in",
    description: "Modal closing. Modal descends, atmosphere returns.",
    allowedTypes: ["fade", "scale", "blur"],
  },
};

/* ─── Motion Configuration (for animation libraries) ── */
export interface MotionConfig {
  duration: string;
  easing: string;
  delay?: string;
  /** Whether the animation should respect reduced motion preferences */
  respectsReducedMotion: boolean;
}

/** Get the animation config for a given motion role */
export function getMotionConfig(role: MotionRole): MotionConfig {
  const def = MOTION_ROLES[role];
  return {
    duration: duration[def.duration],
    easing: easing[def.easing],
    respectsReducedMotion: def.perceptible,
  };
}

/* ─── Easing Utilities ──────────────────────── */
export { parseEasing, toGsapEasing } from "./easing";

/** Get CSS transition value for a given motion role */
export function getTransitionCss(
  role: MotionRole,
  properties: string[] = ["all"],
  delay?: string,
): string {
  const config = getMotionConfig(role);
  const props = properties.join(", ");
  return props
    .split(", ")
    .map((prop) => `${prop} ${config.duration} ${config.easing}${delay ? ` ${delay}` : ""}`)
    .join(", ");
}
