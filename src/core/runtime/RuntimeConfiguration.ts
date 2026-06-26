import { RuntimeConfigurationOptions, RecoveryStrategy } from "./RuntimeTypes";
import { InvalidConfigurationError } from "./RuntimeErrors";

const DEFAULTS: RuntimeConfigurationOptions = {
  engineScanPaths: ["src/core/runtime/engines", "src/core/engines"],
  maxWorkingMemoryItems: 10000,
  workingMemoryTTLMs: 300_000,
  eventHistoryLimit: 1000,
  schedulerCycleIntervalMs: 100,
  healthCheckIntervalMs: 30_000,
  auditRetentionMs: 86_400_000,
  defaultRecoveryStrategy: "RESTART",
};

export class RuntimeConfiguration {
  private options: RuntimeConfigurationOptions;

  constructor(overrides?: Partial<RuntimeConfigurationOptions>) {
    this.options = { ...DEFAULTS };
    if (overrides) {
      this.applyOverrides(overrides);
    }
  }

  private applyOverrides(overrides: Partial<RuntimeConfigurationOptions>): void {
    for (const [key, value] of Object.entries(overrides)) {
      this.validate(key as keyof RuntimeConfigurationOptions, value);
      (this.options as unknown as Record<string, unknown>)[key] = value;
    }
  }

  private validate(key: keyof RuntimeConfigurationOptions, value: unknown): void {
    switch (key) {
      case "maxWorkingMemoryItems":
      case "eventHistoryLimit":
      case "schedulerCycleIntervalMs":
      case "healthCheckIntervalMs":
      case "auditRetentionMs":
        if (typeof value !== "number" || value < 1) {
          throw new InvalidConfigurationError(key, "must be a positive number");
        }
        break;
      case "workingMemoryTTLMs":
        if (typeof value !== "number" || value < 1000) {
          throw new InvalidConfigurationError(key, "must be at least 1000ms");
        }
        break;
      case "engineScanPaths":
        if (!Array.isArray(value) || value.length === 0) {
          throw new InvalidConfigurationError(key, "must be a non-empty array");
        }
        break;
      case "defaultRecoveryStrategy":
        const valid: RecoveryStrategy[] = ["RESTART", "ROLLBACK", "REINITIALIZE", "DEGRADE", "ESCALATE", "HUMAN_INTERVENTION"];
        if (!valid.includes(value as RecoveryStrategy)) {
          throw new InvalidConfigurationError(key, `must be one of: ${valid.join(", ")}`);
        }
        break;
    }
  }

  get<K extends keyof RuntimeConfigurationOptions>(key: K): RuntimeConfigurationOptions[K] {
    return this.options[key];
  }

  getAll(): RuntimeConfigurationOptions {
    return { ...this.options };
  }
}
