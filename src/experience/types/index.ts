/**
 * Experience — Type Definitions
 *
 * Defines the experience modes available in Restaurant OS.
 * Architecture allows adding future modes without refactoring.
 *
 * Current modes:
 * - morning: Fresh, bright, calm — prepares the owner for the day
 * - focus:  Elegant, professional, minimal — deep work / night usage
 * - auto:   Automatically resolves to morning or focus based on local time
 */

export type ExperienceMode = "morning" | "focus";
export type ResolvableExperienceMode = ExperienceMode | "auto";

/**
 * Time range configuration for auto mode.
 * Default: 06:00 → 18:00 = morning, 18:00 → 06:00 = focus
 */
export interface TimeRangeConfig {
  /** Hour when morning mode starts (0–23). Default 6 */
  morningStart: number;
  /** Hour when morning mode ends (0–23). Default 18 */
  morningEnd: number;
}

export type ExperienceSetter = (mode: ResolvableExperienceMode) => void;

export interface ExperienceContextValue {
  /** Current user preference (may be "auto") */
  experience: ResolvableExperienceMode;
  /** Resolved experience (always "morning" or "focus" — never "auto") */
  resolvedExperience: ExperienceMode;
  /** Set the experience preference */
  setExperience: ExperienceSetter;
  /** Whether the resolved experience is morning */
  isMorning: boolean;
  /** Whether the resolved experience is focus */
  isFocus: boolean;
  /** Time range configuration for auto mode */
  timeRange: TimeRangeConfig;
  /** Update the time range configuration */
  setTimeRange: (config: TimeRangeConfig) => void;
}
