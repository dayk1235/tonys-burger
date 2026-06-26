import { Memory, MemoryStage } from "./MemoryTypes";

export interface MemoryPolicy {
  readonly name: string;
  readonly description: string;
  readonly minimumStrength: number;
  readonly minimumConfidence: number;
  readonly minimumRecallScore: number;
  readonly requireConsolidation: boolean;
  readonly associationThreshold: number;
  readonly maxDecayRate: number;
}

export const DEFAULT_MEMORY_POLICIES: MemoryPolicy[] = [
  {
    name: "standard_retention",
    description: "Standard policy for memory retention",
    minimumStrength: 0.3,
    minimumConfidence: 0.3,
    minimumRecallScore: 0.2,
    requireConsolidation: false,
    associationThreshold: 0,
    maxDecayRate: 0.15,
  },
  {
    name: "strict_retention",
    description: "Strict policy requiring high-quality memories",
    minimumStrength: 0.6,
    minimumConfidence: 0.6,
    minimumRecallScore: 0.5,
    requireConsolidation: true,
    associationThreshold: 3,
    maxDecayRate: 0.08,
  },
  {
    name: "long_term_promotion",
    description: "Criteria for promoting to long-term memory",
    minimumStrength: 0.6,
    minimumConfidence: 0.5,
    minimumRecallScore: 0.4,
    requireConsolidation: true,
    associationThreshold: 5,
    maxDecayRate: 0.05,
  },
];

export class MemoryPolicyEngine {
  evaluate(memory: Memory, policy: MemoryPolicy): {
    passed: boolean;
    failures: string[];
  } {
    const failures: string[] = [];

    if (memory.strength < policy.minimumStrength) {
      failures.push(`Strength below threshold: ${memory.strength.toFixed(2)} < ${policy.minimumStrength}`);
    }

    if (memory.confidence < policy.minimumConfidence) {
      failures.push(`Confidence below threshold: ${memory.confidence.toFixed(2)} < ${policy.minimumConfidence}`);
    }

    if (memory.recallScore < policy.minimumRecallScore) {
      failures.push(`Recall score below threshold: ${memory.recallScore.toFixed(2)} < ${policy.minimumRecallScore}`);
    }

    if (policy.requireConsolidation && memory.stage !== "CONSOLIDATED" && memory.stage !== "LONG_TERM" && memory.stage !== "SEMANTIC") {
      failures.push(`Memory not consolidated: current stage is ${memory.stage}`);
    }

    if (memory.associations.length < policy.associationThreshold) {
      failures.push(`Insufficient associations: ${memory.associations.length} < ${policy.associationThreshold}`);
    }

    if (memory.metadata.decayRate > policy.maxDecayRate) {
      failures.push(`Decay rate too high: ${memory.metadata.decayRate.toFixed(2)} > ${policy.maxDecayRate}`);
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  suggestPolicy(memory: Memory): string {
    if (memory.strength >= 0.6 && memory.confidence >= 0.6 && memory.associations.length >= 5) {
      return "long_term_promotion";
    }
    if (memory.strength >= 0.6 && memory.confidence >= 0.6) {
      return "strict_retention";
    }
    return "standard_retention";
  }

  getRequiredStage(policy: MemoryPolicy): MemoryStage {
    if (policy.name === "long_term_promotion") return "LONG_TERM";
    if (policy.name === "strict_retention") return "CONSOLIDATED";
    return "SHORT_TERM";
  }
}
