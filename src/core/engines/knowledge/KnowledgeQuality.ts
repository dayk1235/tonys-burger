import { Knowledge, KnowledgeQualityProfile } from "./KnowledgeTypes";

const WEIGHTS = {
  semanticConsistency: 0.12,
  coverage: 0.10,
  precision: 0.10,
  explainability: 0.08,
  abstractionQuality: 0.10,
  generalizationQuality: 0.08,
  traceability: 0.08,
  stability: 0.08,
  novelty: 0.06,
  confidence: 0.08,
  integrity: 0.06,
  reusability: 0.06,
};

export class KnowledgeQuality {
  evaluate(knowledge: Knowledge): { profile: KnowledgeQualityProfile; qualityScore: number } {
    const semanticConsistency = this.gradeSemanticConsistency(knowledge);
    const coverage = this.gradeCoverage(knowledge);
    const precision = this.gradePrecision(knowledge);
    const explainability = this.gradeExplainability(knowledge);
    const abstractionQuality = this.gradeAbstractionQuality(knowledge);
    const generalizationQuality = this.gradeGeneralizationQuality(knowledge);
    const traceability = this.gradeTraceability(knowledge);
    const stability = this.gradeStability(knowledge);
    const novelty = this.gradeNovelty(knowledge);
    const confidence = knowledge.confidence;
    const integrity = knowledge.integrity;
    const reusability = this.gradeReusability(knowledge);

    const profile: KnowledgeQualityProfile = {
      semanticConsistency, coverage, precision, explainability,
      abstractionQuality, generalizationQuality, traceability,
      stability, novelty, confidence, integrity, reusability,
    };

    const qualityScore =
      semanticConsistency * WEIGHTS.semanticConsistency +
      coverage * WEIGHTS.coverage +
      precision * WEIGHTS.precision +
      explainability * WEIGHTS.explainability +
      abstractionQuality * WEIGHTS.abstractionQuality +
      generalizationQuality * WEIGHTS.generalizationQuality +
      traceability * WEIGHTS.traceability +
      stability * WEIGHTS.stability +
      novelty * WEIGHTS.novelty +
      confidence * WEIGHTS.confidence +
      integrity * WEIGHTS.integrity +
      reusability * WEIGHTS.reusability;

    return { profile, qualityScore: Math.max(0.01, Math.min(0.99, qualityScore)) };
  }

  private gradeSemanticConsistency(knowledge: Knowledge): number {
    if (knowledge.graphEdges.length < 2) return 0.7;
    const consistentEdges = knowledge.graphEdges.filter((e) => e.weight > 0.3);
    return consistentEdges.length / knowledge.graphEdges.length;
  }

  private gradeCoverage(knowledge: Knowledge): number {
    const sourceCount =
      knowledge.provenance.sourceMemoryIds.length +
      knowledge.provenance.sourceEvidenceIds.length +
      knowledge.provenance.sourcePatternIds.length;
    return Math.min(1, sourceCount / 12);
  }

  private gradePrecision(knowledge: Knowledge): number {
    if (knowledge.versions.length < 2) return 0.6;
    const recentConfidences = knowledge.versions.slice(-3).map((v) => v.confidence);
    const mean = recentConfidences.reduce((s, v) => s + v, 0) / recentConfidences.length;
    const variance = recentConfidences.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / recentConfidences.length;
    return Math.max(0.1, 1 - Math.sqrt(variance) * 2);
  }

  private gradeExplainability(knowledge: Knowledge): number {
    let score = 0;
    if (knowledge.summary.length > 20) score += 0.25;
    if (knowledge.description.length > 50) score += 0.25;
    if (knowledge.concepts.length > 0) score += 0.25;
    if (knowledge.metadata.tags.length > 0) score += 0.25;
    return score;
  }

  private gradeAbstractionQuality(knowledge: Knowledge): number {
    return knowledge.abstractionLevel;
  }

  private gradeGeneralizationQuality(knowledge: Knowledge): number {
    if (knowledge.metadata.generalizationCount === 0) return 0;
    return Math.min(1, knowledge.metadata.generalizationCount * 0.15);
  }

  private gradeTraceability(knowledge: Knowledge): number {
    let score = 0;
    if (knowledge.provenance.sourceMemoryIds.length > 0) score += 0.2;
    if (knowledge.provenance.sourceEvidenceIds.length > 0) score += 0.2;
    if (knowledge.provenance.sourcePatternIds.length > 0) score += 0.2;
    if (knowledge.provenance.versionHistory.length > 1) score += 0.2;
    if (knowledge.provenance.creationTimeline.length > 1) score += 0.2;
    return score;
  }

  private gradeStability(knowledge: Knowledge): number {
    if (knowledge.versions.length < 3) return 0.6;
    const recentConfidences = knowledge.versions.slice(-5).map((v) => v.confidence);
    const mean = recentConfidences.reduce((s, v) => s + v, 0) / recentConfidences.length;
    const variance = recentConfidences.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / recentConfidences.length;
    return Math.max(0.1, 1 - Math.sqrt(variance) * 3);
  }

  private gradeNovelty(knowledge: Knowledge): number {
    if (knowledge.versions.length <= 1) return 0.8;
    const derivations = knowledge.metadata.totalDerivations;
    return Math.max(0.1, 1 - derivations * 0.05);
  }

  private gradeReusability(knowledge: Knowledge): number {
    if (knowledge.concepts.length === 0) return 0;
    const conceptBreadth = Math.min(1, knowledge.concepts.length / 5);
    const graphDensity = knowledge.graphEdges.length > 0
      ? Math.min(1, knowledge.graphEdges.length / knowledge.graphNodes.length)
      : 0;
    return conceptBreadth * 0.5 + graphDensity * 0.5;
  }
}
