import { Memory, MemoryQualityProfile } from "./MemoryTypes";

const WEIGHTS = {
  retention: 0.12,
  recall: 0.12,
  precision: 0.10,
  consistency: 0.10,
  coverage: 0.08,
  traceability: 0.08,
  compressionEfficiency: 0.06,
  associationStrength: 0.08,
  semanticStability: 0.08,
  freshness: 0.08,
  explainability: 0.05,
  confidence: 0.05,
};

export class MemoryQuality {
  evaluate(memory: Memory): { profile: MemoryQualityProfile; qualityScore: number } {
    const retention = this.gradeRetention(memory);
    const recall = this.gradeRecall(memory);
    const precision = this.gradePrecision(memory);
    const consistency = this.gradeConsistency(memory);
    const coverage = this.gradeCoverage(memory);
    const traceability = this.gradeTraceability(memory);
    const compressionEfficiency = this.gradeCompressionEfficiency(memory);
    const associationStrength = this.gradeAssociationStrength(memory);
    const semanticStability = this.gradeSemanticStability(memory);
    const freshness = this.gradeFreshness(memory);
    const explainability = this.gradeExplainability(memory);
    const confidence = memory.confidence;

    const profile: MemoryQualityProfile = {
      retention, recall, precision, consistency, coverage, traceability,
      compressionEfficiency, associationStrength, semanticStability,
      freshness, explainability, confidence,
    };

    const qualityScore =
      retention * WEIGHTS.retention +
      recall * WEIGHTS.recall +
      precision * WEIGHTS.precision +
      consistency * WEIGHTS.consistency +
      coverage * WEIGHTS.coverage +
      traceability * WEIGHTS.traceability +
      compressionEfficiency * WEIGHTS.compressionEfficiency +
      associationStrength * WEIGHTS.associationStrength +
      semanticStability * WEIGHTS.semanticStability +
      freshness * WEIGHTS.freshness +
      explainability * WEIGHTS.explainability +
      confidence * WEIGHTS.confidence;

    return { profile, qualityScore: Math.max(0.01, Math.min(0.99, qualityScore)) };
  }

  private gradeRetention(memory: Memory): number {
    return memory.retentionScore;
  }

  private gradeRecall(memory: Memory): number {
    return memory.recallScore;
  }

  private gradePrecision(memory: Memory): number {
    if (memory.versions.length === 0) return 0.5;
    const scoreVariance = this.computeScoreVariance(memory);
    return Math.max(0.1, 1 - scoreVariance);
  }

  private gradeConsistency(memory: Memory): number {
    if (memory.versions.length < 2) return 0.8;
    const recentConfidences = memory.versions.slice(-3).map((v) => v.confidence);
    const mean = recentConfidences.reduce((s, v) => s + v, 0) / recentConfidences.length;
    const variance = recentConfidences.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / recentConfidences.length;
    return Math.max(0.1, 1 - Math.sqrt(variance) * 2);
  }

  private gradeCoverage(memory: Memory): number {
    const sourceCount =
      memory.provenance.sourceEvidenceIds.length +
      memory.provenance.sourcePatternIds.length +
      memory.provenance.sourceObservationIds.length;
    return Math.min(1, sourceCount / 10);
  }

  private gradeTraceability(memory: Memory): number {
    let score = 0;
    if (memory.provenance.sourceEvidenceIds.length > 0) score += 0.2;
    if (memory.provenance.sourcePatternIds.length > 0) score += 0.2;
    if (memory.provenance.sourceObservationIds.length > 0) score += 0.2;
    if (memory.provenance.versionHistory.length > 1) score += 0.2;
    if (memory.provenance.creationTimeline.length > 1) score += 0.2;
    return score;
  }

  private gradeCompressionEfficiency(memory: Memory): number {
    if (!memory.compressionStats) return 0.5;
    return memory.compressionStats.compressionRatio;
  }

  private gradeAssociationStrength(memory: Memory): number {
    if (memory.associations.length === 0) return 0;
    const avgStrength = memory.associations.reduce((s, a) => s + a.strength, 0) / memory.associations.length;
    const density = Math.min(1, memory.associations.length / 10);
    return avgStrength * 0.6 + density * 0.4;
  }

  private gradeSemanticStability(memory: Memory): number {
    if (memory.versions.length < 3) return 0.7;
    const recentStrengths = memory.versions.slice(-5).map((v) => v.strength);
    const mean = recentStrengths.reduce((s, v) => s + v, 0) / recentStrengths.length;
    const variance = recentStrengths.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / recentStrengths.length;
    return Math.max(0.1, 1 - Math.sqrt(variance) * 3);
  }

  private gradeFreshness(memory: Memory): number {
    const now = Date.now();
    const lastAccess = new Date(memory.metadata.lastAccessedAt).getTime();
    const ageHours = (now - lastAccess) / (1000 * 60 * 60);
    if (ageHours <= 1) return 1;
    if (ageHours <= 24) return 0.9;
    if (ageHours <= 168) return 0.7;
    if (ageHours <= 720) return 0.4;
    return 0.1;
  }

  private gradeExplainability(memory: Memory): number {
    let score = 0;
    if (memory.summary.length > 20) score += 0.3;
    if (memory.description.length > 30) score += 0.3;
    if (memory.metadata.tags.length > 0) score += 0.2;
    if (memory.associations.length > 0) score += 0.2;
    return Math.min(1, score);
  }

  private computeScoreVariance(memory: Memory): number {
    const scores = memory.versions.map((v) => v.strength);
    if (scores.length < 2) return 0;
    const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
    const variance = scores.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / scores.length;
    return Math.min(1, Math.sqrt(variance));
  }
}
