import { ContradictingRef, SupportingRef, ObservationDetail, EvidenceEvaluationRequest } from "./EvidenceTypes";
import { ContradictionError } from "./EvidenceErrors";

export interface ContradictionAnalysis {
  readonly hasContradiction: boolean;
  readonly contradictions: ContradictingRef[];
  readonly severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  readonly summary: string;
  readonly resolvable: boolean;
}

export class EvidenceContradictions {
  analyze(
    supporting: readonly SupportingRef[],
    contradictingIds: readonly string[],
    observations: readonly ObservationDetail[],
    request: EvidenceEvaluationRequest
  ): ContradictionAnalysis {
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const contradictions: ContradictingRef[] = [];
    const now = new Date().toISOString();

    for (const obsId of contradictingIds) {
      const obs = obsMap.get(obsId);
      if (!obs) continue;

      const contradiction: ContradictingRef = {
        observationId: obsId,
        patternId: request.patternId,
        weight: this.computeContradictionWeight(obs, supporting),
        severity: this.computeSeverity(obs, supporting),
        reason: `Observation ${obsId} contradicts pattern "${request.patternName}"`,
        capturedAt: obs.timestamp,
      };

      contradictions.push(contradiction);
    }

    const hasContradiction = contradictions.length > 0;
    const severity = this.computeOverallSeverity(contradictions);
    const resolvable = this.isResolvable(contradictions, supporting);

    return {
      hasContradiction,
      contradictions,
      severity,
      summary: hasContradiction
        ? `${contradictions.length} contradiction(s) found, severity: ${severity}`
        : "No contradictions detected",
      resolvable,
    };
  }

  detectDirectContradiction(
    obsA: ObservationDetail,
    obsB: ObservationDetail
  ): boolean {
    if (obsA.category !== obsB.category) return false;
    const payloadA = obsA.payload as Record<string, unknown>;
    const payloadB = obsB.payload as Record<string, unknown>;
    const numericKeys = Object.keys(payloadA).filter((k) => typeof payloadA[k] === "number");

    for (const key of numericKeys) {
      const valA = payloadA[key] as number;
      const valB = payloadB[key] as number;
      if (Math.abs(valA - valB) > Math.abs(valA) * 0.5 && (valA > 0) !== (valB > 0)) {
        return true;
      }
    }

    return false;
  }

  resolveContradiction(
    evidenceId: string,
    contradictionId: string,
    resolution: "ACCEPT_CONTRADICTION" | "DISMISS_CONTRADICTION" | "RE_EVALUATE"
  ): string {
    switch (resolution) {
      case "ACCEPT_CONTRADICTION":
        return `Contradiction ${contradictionId} accepted for evidence ${evidenceId}. Evidence score adjusted downward.`;
      case "DISMISS_CONTRADICTION":
        return `Contradiction ${contradictionId} dismissed for evidence ${evidenceId}. Insufficient weight to affect conclusion.`;
      case "RE_EVALUATE":
        return `Evidence ${evidenceId} marked for re-evaluation due to contradiction ${contradictionId}.`;
      default:
        return `No action taken for contradiction ${contradictionId}.`;
    }
  }

  private computeContradictionWeight(obs: ObservationDetail, supporting: readonly SupportingRef[]): number {
    const trustPenalty = 1 - obs.trustScore;
    const confPenalty = 1 - obs.confidence;
    const baseWeight = 0.3 + trustPenalty * 0.3 + confPenalty * 0.2;
    const supportingAvgWeight = supporting.length > 0
      ? supporting.reduce((s, r) => s + r.weight, 0) / supporting.length
      : 0.5;
    return Math.min(1, baseWeight * (1 + (1 - supportingAvgWeight)));
  }

  private computeSeverity(obs: ObservationDetail, supporting: readonly SupportingRef[]): ContradictingRef["severity"] {
    const weight = this.computeContradictionWeight(obs, supporting);
    if (weight >= 0.8) return "CRITICAL";
    if (weight >= 0.6) return "HIGH";
    if (weight >= 0.4) return "MEDIUM";
    return "LOW";
  }

  private computeOverallSeverity(contradictions: ContradictingRef[]): ContradictingRef["severity"] {
    if (contradictions.length === 0) return "LOW";
    const severities: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
    const maxSeverity = Math.max(...contradictions.map((c) => severities[c.severity]));
    const severityMap: Record<number, ContradictingRef["severity"]> = { 1: "LOW", 2: "MEDIUM", 3: "HIGH", 4: "CRITICAL" };
    return severityMap[maxSeverity] || "MEDIUM";
  }

  private isResolvable(contradictions: ContradictingRef[], supporting: readonly SupportingRef[]): boolean {
    if (contradictions.length === 0) return true;
    if (contradictions.length >= supporting.length && supporting.length > 0) return false;
    const highSeverity = contradictions.filter((c) => c.severity === "HIGH" || c.severity === "CRITICAL");
    return highSeverity.length < Math.ceil(supporting.length / 2);
  }
}
