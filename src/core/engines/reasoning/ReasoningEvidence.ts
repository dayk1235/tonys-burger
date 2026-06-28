import { Reasoning } from "./ReasoningTypes";
import { InsufficientEvidenceError } from "./ReasoningErrors";

export interface EvidenceItem {
  readonly id: string;
  readonly sourceType: string;
  readonly relevance: number;
  readonly strength: number;
  readonly supportsHypothesisId: string | null;
  readonly conflictsWithHypothesisId: string | null;
  readonly content: string;
}

export interface EvidenceGatheringResult {
  readonly evidenceIds: readonly string[];
  readonly relevanceScores: Record<string, number>;
  readonly conflicts: readonly string[];
  readonly overallStrength: number;
}

export class ReasoningEvidence {
  gather(reasoning: Reasoning): EvidenceGatheringResult {
    const evidenceIds: string[] = [];
    const relevanceScores: Record<string, number> = {};
    const conflicts: string[] = [];
    let strengthSum = 0;

    for (const obsId of reasoning.provenance.sourceObservationIds) {
      evidenceIds.push(obsId);
      const relevance = this.computeRelevance(obsId, reasoning.question);
      relevanceScores[obsId] = relevance;
      strengthSum += relevance;
    }

    for (const memId of reasoning.provenance.sourceMemoryIds) {
      evidenceIds.push(memId);
      const relevance = this.computeRelevance(memId, reasoning.question);
      relevanceScores[memId] = relevance;
      strengthSum += relevance;
    }

    for (const knwId of reasoning.provenance.sourceKnowledgeIds) {
      evidenceIds.push(knwId);
      const relevance = this.computeRelevance(knwId, reasoning.question);
      relevanceScores[knwId] = relevance;
      strengthSum += relevance;
    }

    evidenceIds.sort((a, b) => (relevanceScores[b] || 0) - (relevanceScores[a] || 0));

    const overallStrength = evidenceIds.length > 0
      ? Math.min(1, strengthSum / evidenceIds.length)
      : 0;

    return { evidenceIds, relevanceScores, conflicts, overallStrength };
  }

  checkSufficiency(reasoning: Reasoning): { sufficient: boolean; reason: string } {
    const evidenceCount =
      reasoning.provenance.sourceObservationIds.length +
      reasoning.provenance.sourceMemoryIds.length +
      reasoning.provenance.sourceKnowledgeIds.length;

    if (evidenceCount === 0) {
      return { sufficient: false, reason: "No evidence sources provided" };
    }
    if (evidenceCount === 1) {
      return { sufficient: false, reason: "Single evidence source — insufficient for robust reasoning" };
    }
    if (evidenceCount >= 5) {
      return { sufficient: true, reason: "Rich evidence base" };
    }
    return { sufficient: true, reason: `Sufficient evidence from ${evidenceCount} sources` };
  }

  evaluateHypothesisEvidence(
    reasoning: Reasoning,
    hypothesisId: string
  ): { supportingCount: number; conflictingCount: number; strength: number } {
    let supportingCount = 0;
    let conflictingCount = 0;

    for (const _obsId of reasoning.provenance.sourceObservationIds) {
      supportingCount++;
    }

    const total = supportingCount + conflictingCount;
    const strength = total > 0 ? supportingCount / total : 0;
    return { supportingCount, conflictingCount, strength };
  }

  private computeRelevance(_sourceId: string, _question: { text: string; type: string }): number {
    return 0.5 + Math.random() * 0.5;
  }
}
