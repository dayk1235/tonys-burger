import { Knowledge, KnowledgeQualityProfile } from "./KnowledgeTypes";

export interface ConfidenceHistoryEntry {
  readonly timestamp: string;
  readonly previousValue: number;
  readonly newValue: number;
  readonly reason: string;
}

export class KnowledgeConfidence {
  private history: Map<string, ConfidenceHistoryEntry[]> = new Map();

  compute(
    knowledge: Knowledge,
    qualityProfile: KnowledgeQualityProfile
  ): number {
    const baseConfidence = this.computeBaseConfidence(qualityProfile);
    const versionStability = this.computeVersionStability(knowledge);
    const graphCoherence = this.computeGraphCoherence(knowledge);
    const derivationFactor = this.computeDerivationFactor(knowledge);

    const raw = (baseConfidence + graphCoherence * 0.1) * versionStability * derivationFactor;
    return Math.max(0.01, Math.min(0.99, raw));
  }

  recordHistory(
    knowledgeId: string,
    previousValue: number,
    newValue: number,
    reason: string
  ): void {
    const entry: ConfidenceHistoryEntry = {
      timestamp: new Date().toISOString(),
      previousValue,
      newValue,
      reason,
    };
    const existing = this.history.get(knowledgeId) || [];
    existing.push(entry);
    this.history.set(knowledgeId, existing);
  }

  getHistory(knowledgeId: string): readonly ConfidenceHistoryEntry[] {
    return this.history.get(knowledgeId) || [];
  }

  private computeBaseConfidence(profile: KnowledgeQualityProfile): number {
    const weights = {
      semanticConsistency: 0.20,
      integrity: 0.18,
      precision: 0.16,
      stability: 0.14,
      traceability: 0.12,
      coverage: 0.10,
      reusability: 0.10,
    };

    return (
      profile.semanticConsistency * weights.semanticConsistency +
      profile.integrity * weights.integrity +
      profile.precision * weights.precision +
      profile.stability * weights.stability +
      profile.traceability * weights.traceability +
      profile.coverage * weights.coverage +
      profile.reusability * weights.reusability
    );
  }

  private computeVersionStability(knowledge: Knowledge): number {
    if (knowledge.versions.length < 3) return 0.85;
    const recentConfidences = knowledge.versions.slice(-5).map((v) => v.confidence);
    const mean = recentConfidences.reduce((s, v) => s + v, 0) / recentConfidences.length;
    const variance = recentConfidences.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / recentConfidences.length;
    const stability = Math.max(0, 1 - Math.sqrt(variance) * 3);
    return Math.min(1, 0.7 + stability * 0.3);
  }

  private computeGraphCoherence(knowledge: Knowledge): number {
    if (knowledge.graphEdges.length < 2) return 0.5;
    const avgWeight =
      knowledge.graphEdges.reduce((s, e) => s + e.weight, 0) / knowledge.graphEdges.length;
    return avgWeight;
  }

  private computeDerivationFactor(knowledge: Knowledge): number {
    const derivations = knowledge.metadata.totalDerivations;
    if (derivations === 0) return 0.9;
    return Math.max(0.6, 1 - derivations * 0.02);
  }
}
