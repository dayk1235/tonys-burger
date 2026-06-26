import { Memory, MemoryQualityProfile } from "./MemoryTypes";

export interface ConfidenceHistoryEntry {
  readonly timestamp: string;
  readonly previousValue: number;
  readonly newValue: number;
  readonly reason: string;
}

export class MemoryConfidence {
  private history: Map<string, ConfidenceHistoryEntry[]> = new Map();

  compute(
    memory: Memory,
    qualityProfile: MemoryQualityProfile
  ): number {
    const baseConfidence = this.computeBaseConfidence(qualityProfile);
    const strengthBoost = this.computeStrengthBoost(memory);
    const versionStability = this.computeVersionStability(memory);
    const decayFactor = this.computeDecayFactor(memory);

    const raw = (baseConfidence + strengthBoost) * versionStability * decayFactor;
    return Math.max(0.01, Math.min(0.99, raw));
  }

  recordHistory(memoryId: string, previousValue: number, newValue: number, reason: string): void {
    const entry: ConfidenceHistoryEntry = {
      timestamp: new Date().toISOString(),
      previousValue,
      newValue,
      reason,
    };
    const existing = this.history.get(memoryId) || [];
    existing.push(entry);
    this.history.set(memoryId, existing);
  }

  getHistory(memoryId: string): readonly ConfidenceHistoryEntry[] {
    return this.history.get(memoryId) || [];
  }

  private computeBaseConfidence(profile: MemoryQualityProfile): number {
    const weights = {
      retention: 0.18,
      consistency: 0.16,
      recall: 0.15,
      semanticStability: 0.13,
      precision: 0.12,
      coverage: 0.10,
      traceability: 0.08,
      freshness: 0.08,
    };

    return (
      profile.retention * weights.retention +
      profile.consistency * weights.consistency +
      profile.recall * weights.recall +
      profile.semanticStability * weights.semanticStability +
      profile.precision * weights.precision +
      profile.coverage * weights.coverage +
      profile.traceability * weights.traceability +
      profile.freshness * weights.freshness
    );
  }

  private computeStrengthBoost(memory: Memory): number {
    if (memory.strength < 0.3) return -0.05;
    if (memory.strength > 0.7) return 0.1;
    return 0;
  }

  private computeVersionStability(memory: Memory): number {
    if (memory.versions.length < 3) return 0.85;
    const recentStrengths = memory.versions.slice(-5).map((v) => v.strength);
    const mean = recentStrengths.reduce((s, v) => s + v, 0) / recentStrengths.length;
    const variance = recentStrengths.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / recentStrengths.length;
    const stability = Math.max(0, 1 - Math.sqrt(variance) * 3);
    return Math.min(1, 0.7 + stability * 0.3);
  }

  private computeDecayFactor(memory: Memory): number {
    const now = Date.now();
    const lastAccess = new Date(memory.metadata.lastAccessedAt).getTime();
    const daysSinceAccess = (now - lastAccess) / (1000 * 60 * 60 * 24);
    const decay = Math.max(0.5, 1 - daysSinceAccess * memory.metadata.decayRate);
    return decay;
  }
}
