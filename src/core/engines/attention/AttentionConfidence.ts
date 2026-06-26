import { Attention, AttentionQualityProfile } from "./AttentionTypes";

export interface ConfidenceHistoryEntry {
  readonly timestamp: string;
  readonly previousValue: number;
  readonly newValue: number;
  readonly reason: string;
}

export class AttentionConfidence {
  private history: Map<string, ConfidenceHistoryEntry[]> = new Map();

  compute(attention: Attention, qualityProfile: AttentionQualityProfile): number {
    const baseConfidence = attention.scoringFactors.baseScore;
    const focusStability = qualityProfile.focusStability;
    const contextRelevance = attention.priorityFactors.contextRelevance;
    const traceability = qualityProfile.traceability;

    const raw = baseConfidence * 0.4 + focusStability * 0.2 + contextRelevance * 0.2 + traceability * 0.2;
    return Math.max(0.01, Math.min(0.99, raw));
  }

  computePriorityConfidence(attention: Attention): number {
    const factors = attention.priorityFactors;
    const definedCount = [
      factors.urgency, factors.importance, factors.risk, factors.opportunity,
      factors.businessValue, factors.humanValue, factors.temporalPressure,
      factors.contextRelevance, factors.goalAlignment, factors.resourceAvailability,
    ].filter((v) => v > 0).length;

    const completeness = definedCount / 10;
    const stability = attention.provenance.versionHistory.length > 1 ? 0.8 : 0.5;
    const sourceDiversity = Math.min(1, attention.provenance.sourceTypes.length / 3);

    return completeness * 0.4 + stability * 0.3 + sourceDiversity * 0.3;
  }

  recordHistory(attentionId: string, previousValue: number, newValue: number, reason: string): void {
    const entry: ConfidenceHistoryEntry = {
      timestamp: new Date().toISOString(),
      previousValue,
      newValue,
      reason,
    };
    const existing = this.history.get(attentionId) || [];
    existing.push(entry);
    this.history.set(attentionId, existing);
  }

  getHistory(attentionId: string): readonly ConfidenceHistoryEntry[] {
    return this.history.get(attentionId) || [];
  }
}
