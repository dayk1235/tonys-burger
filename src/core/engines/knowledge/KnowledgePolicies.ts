import { Knowledge, KnowledgeStage } from "./KnowledgeTypes";

export interface KnowledgePolicy {
  readonly name: string;
  readonly description: string;
  readonly minimumConfidence: number;
  readonly minimumIntegrity: number;
  readonly minimumSources: number;
  readonly requireValidated: boolean;
  readonly minAbstractionForCanonical: number;
  readonly maxAbstractionForExtraction: number;
}

export const DEFAULT_KNOWLEDGE_POLICIES: KnowledgePolicy[] = [
  {
    name: "standard_knowledge",
    description: "Standard policy for knowledge retention",
    minimumConfidence: 0.4,
    minimumIntegrity: 0.4,
    minimumSources: 1,
    requireValidated: false,
    minAbstractionForCanonical: 0.5,
    maxAbstractionForExtraction: 0.3,
  },
  {
    name: "canonical_promotion",
    description: "Criteria for promoting knowledge to canonical",
    minimumConfidence: 0.7,
    minimumIntegrity: 0.7,
    minimumSources: 3,
    requireValidated: true,
    minAbstractionForCanonical: 0.6,
    maxAbstractionForExtraction: 0.3,
  },
  {
    name: "extraction_validation",
    description: "Policy for validating new extractions",
    minimumConfidence: 0.4,
    minimumIntegrity: 0.4,
    minimumSources: 1,
    requireValidated: false,
    minAbstractionForCanonical: 0.5,
    maxAbstractionForExtraction: 0.5,
  },
];

export class KnowledgePolicyEngine {
  evaluate(knowledge: Knowledge, policy: KnowledgePolicy): {
    passed: boolean;
    failures: string[];
  } {
    const failures: string[] = [];

    if (knowledge.confidence < policy.minimumConfidence) {
      failures.push(`Confidence below threshold: ${knowledge.confidence.toFixed(2)} < ${policy.minimumConfidence}`);
    }

    if (knowledge.integrity < policy.minimumIntegrity) {
      failures.push(`Integrity below threshold: ${knowledge.integrity.toFixed(2)} < ${policy.minimumIntegrity}`);
    }

    if (knowledge.provenance.sourceMemoryIds.length < policy.minimumSources) {
      failures.push(`Insufficient source memories: ${knowledge.provenance.sourceMemoryIds.length} < ${policy.minimumSources}`);
    }

    if (policy.requireValidated && knowledge.stage !== "VALIDATED" && knowledge.stage !== "GENERALIZED" && knowledge.stage !== "SPECIALIZED" && knowledge.stage !== "SEMANTIC" && knowledge.stage !== "CANONICAL") {
      failures.push(`Knowledge not validated: current stage is ${knowledge.stage}`);
    }

    if (knowledge.abstractionLevel > policy.maxAbstractionForExtraction && policy.name === "extraction_validation") {
      failures.push(`Abstraction level too high for extraction: ${knowledge.abstractionLevel.toFixed(2)} > ${policy.maxAbstractionForExtraction}`);
    }

    if (knowledge.abstractionLevel < policy.minAbstractionForCanonical && policy.name === "canonical_promotion") {
      failures.push(`Abstraction level too low for canonical: ${knowledge.abstractionLevel.toFixed(2)} < ${policy.minAbstractionForCanonical}`);
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  suggestPolicy(knowledge: Knowledge): string {
    if (knowledge.confidence >= 0.7 && knowledge.integrity >= 0.7 && knowledge.provenance.sourceMemoryIds.length >= 3) {
      return "canonical_promotion";
    }
    if (knowledge.stage === "CANDIDATE" || knowledge.stage === "EXTRACTED") {
      return "extraction_validation";
    }
    return "standard_knowledge";
  }

  getRequiredStage(policy: KnowledgePolicy): KnowledgeStage {
    if (policy.name === "canonical_promotion") return "CANONICAL";
    if (policy.name === "extraction_validation") return "VALIDATED";
    return "STRUCTURED";
  }
}
