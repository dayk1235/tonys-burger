import { Attention, AttentionStage } from "./AttentionTypes";

export interface AttentionPolicy {
  readonly name: string;
  readonly description: string;
  readonly maxActiveItems: number;
  readonly maxBudgetPerItem: number;
  readonly starvationPreventionEnabled: boolean;
  readonly interruptionEnabled: boolean;
  readonly minPriorityForFocus: number;
  readonly maxDeferralCount: number;
  readonly decayEnabled: boolean;
  readonly reevaluationIntervalMs: number;
}

export const DEFAULT_ATTENTION_POLICIES: AttentionPolicy[] = [
  {
    name: "standard_attention",
    description: "Standard policy for normal operations",
    maxActiveItems: 5,
    maxBudgetPerItem: 0.3,
    starvationPreventionEnabled: true,
    interruptionEnabled: true,
    minPriorityForFocus: 0.3,
    maxDeferralCount: 3,
    decayEnabled: true,
    reevaluationIntervalMs: 5000,
  },
  {
    name: "high_load",
    description: "Policy for high-load / rush hour scenarios",
    maxActiveItems: 3,
    maxBudgetPerItem: 0.25,
    starvationPreventionEnabled: true,
    interruptionEnabled: false,
    minPriorityForFocus: 0.4,
    maxDeferralCount: 5,
    decayEnabled: true,
    reevaluationIntervalMs: 3000,
  },
  {
    name: "emergency_mode",
    description: "Policy for emergencies (kitchen fire, etc.)",
    maxActiveItems: 2,
    maxBudgetPerItem: 0.4,
    starvationPreventionEnabled: false,
    interruptionEnabled: true,
    minPriorityForFocus: 0.6,
    maxDeferralCount: 1,
    decayEnabled: false,
    reevaluationIntervalMs: 1000,
  },
  {
    name: "maintenance_window",
    description: "Policy for planned maintenance periods",
    maxActiveItems: 8,
    maxBudgetPerItem: 0.2,
    starvationPreventionEnabled: true,
    interruptionEnabled: true,
    minPriorityForFocus: 0.2,
    maxDeferralCount: 10,
    decayEnabled: true,
    reevaluationIntervalMs: 10000,
  },
];

export class AttentionPolicyEngine {
  evaluate(attention: Attention, policy: AttentionPolicy): {
    passed: boolean;
    failures: string[];
  } {
    const failures: string[] = [];

    if (attention.priority < policy.minPriorityForFocus && attention.stage !== "QUEUED") {
      failures.push(`Priority below focus threshold: ${attention.priority.toFixed(2)} < ${policy.minPriorityForFocus}`);
    }

    if (attention.allocation > policy.maxBudgetPerItem) {
      failures.push(`Allocation exceeds max per item: ${attention.allocation.toFixed(2)} > ${policy.maxBudgetPerItem}`);
    }

    if (attention.timesInterrupted > policy.maxDeferralCount) {
      failures.push(`Exceeded max deferral count: ${attention.timesInterrupted} > ${policy.maxDeferralCount}`);
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  suggestPolicy(loadLevel: number, hasEmergency: boolean, category?: string): string {
    if (hasEmergency) return "emergency_mode";
    if (loadLevel > 0.8) return "high_load";
    if (category === "MAINTENANCE") return "maintenance_window";
    return "standard_attention";
  }

  getReevaluationInterval(policy: AttentionPolicy): number {
    return policy.reevaluationIntervalMs;
  }

  getMaxActiveItems(policy: AttentionPolicy): number {
    return policy.maxActiveItems;
  }

  shouldAllowInterruption(policy: AttentionPolicy): boolean {
    return policy.interruptionEnabled;
  }

  shouldPreventStarvation(policy: AttentionPolicy): boolean {
    return policy.starvationPreventionEnabled;
  }
}
