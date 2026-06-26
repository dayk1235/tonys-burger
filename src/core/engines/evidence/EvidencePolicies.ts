import { Evidence, EvidenceStage } from "./EvidenceTypes";
import { EvidencePolicy } from "./EvidenceRegistry";

export const DEFAULT_EVIDENCE_POLICIES: EvidencePolicy[] = [
  {
    name: "standard_validation",
    description: "Standard policy for pattern evidence validation",
    minimumSupportingRefs: 3,
    minimumConfidence: 0.5,
    maximumContradictionRatio: 0.3,
    requireSourceDiversity: true,
    reliabilityThreshold: 0.4,
  },
  {
    name: "strict_validation",
    description: "Strict policy requiring high-confidence, diverse evidence",
    minimumSupportingRefs: 5,
    minimumConfidence: 0.7,
    maximumContradictionRatio: 0.1,
    requireSourceDiversity: true,
    reliabilityThreshold: 0.6,
  },
  {
    name: "rapid_validation",
    description: "Relaxed policy for rapid validation of low-risk patterns",
    minimumSupportingRefs: 1,
    minimumConfidence: 0.3,
    maximumContradictionRatio: 0.5,
    requireSourceDiversity: false,
    reliabilityThreshold: 0.2,
  },
];

export class EvidencePolicyEngine {
  evaluate(evidence: Evidence, policy: EvidencePolicy): {
    passed: boolean;
    failures: string[];
  } {
    const failures: string[] = [];

    if (evidence.supportingRefs.length < policy.minimumSupportingRefs) {
      failures.push(
        `Insufficient supporting refs: need ${policy.minimumSupportingRefs}, have ${evidence.supportingRefs.length}`
      );
    }

    if (evidence.confidence < policy.minimumConfidence) {
      failures.push(
        `Confidence below threshold: ${evidence.confidence.toFixed(2)} < ${policy.minimumConfidence}`
      );
    }

    const totalRefs = evidence.supportingRefs.length + evidence.contradictingRefs.length;
    if (totalRefs > 0) {
      const contradictionRatio = evidence.contradictingRefs.length / totalRefs;
      if (contradictionRatio > policy.maximumContradictionRatio) {
        failures.push(
          `Contradiction ratio exceeds limit: ${contradictionRatio.toFixed(2)} > ${policy.maximumContradictionRatio}`
        );
      }
    }

    if (policy.requireSourceDiversity) {
      const sourceTypes = new Set(evidence.supportingRefs.map((r) => r.sourceType));
      if (sourceTypes.size < 2) {
        failures.push("Source diversity required but only one source type present");
      }
    }

    if (evidence.qualityProfile.reliability < policy.reliabilityThreshold) {
      failures.push(
        `Reliability below threshold: ${evidence.qualityProfile.reliability.toFixed(2)} < ${policy.reliabilityThreshold}`
      );
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  suggestPolicy(evidence: Evidence): string {
    if (evidence.contradictingRefs.length > evidence.supportingRefs.length) {
      return "strict_validation";
    }
    if (evidence.confidence > 0.7 && evidence.supportingRefs.length >= 5) {
      return "standard_validation";
    }
    if (evidence.supportingRefs.length < 2) {
      return "rapid_validation";
    }
    return "standard_validation";
  }

  getRequiredStage(policy: EvidencePolicy): EvidenceStage {
    if (policy.name === "strict_validation") return "VALIDATED";
    if (policy.name === "rapid_validation") return "WEIGHTED";
    return "VALIDATED";
  }
}
