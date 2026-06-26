import { EvidenceEngineMetrics } from "./EvidenceContracts";

export class EvidenceMetrics implements EvidenceEngineMetrics {
  totalEvidenceCreated = 0;
  validatedEvidenceCount = 0;
  rejectedEvidenceCount = 0;
  activeEvidenceCount = 0;
  averageConfidence = 0;
  averageScore = 0;
  evidenceByCategory: Record<string, number> = {};
  evidenceByStage: Record<string, number> = {};
  contradictionsResolved = 0;
  sourcesEvaluated = 0;
  patternsEvaluated = 0;

  private confidenceSum = 0;
  private scoreSum = 0;
  private totalCount = 0;

  recordCreated(): void {
    this.totalEvidenceCreated++;
    this.activeEvidenceCount++;
  }

  recordValidated(): void {
    this.validatedEvidenceCount++;
    this.activeEvidenceCount = Math.max(0, this.activeEvidenceCount - 1);
  }

  recordRejected(): void {
    this.rejectedEvidenceCount++;
    this.activeEvidenceCount = Math.max(0, this.activeEvidenceCount - 1);
  }

  recordCategory(category: string): void {
    this.evidenceByCategory[category] = (this.evidenceByCategory[category] || 0) + 1;
  }

  recordStage(stage: string): void {
    this.evidenceByStage[stage] = (this.evidenceByStage[stage] || 0) + 1;
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordScore(score: number): void {
    this.scoreSum += score;
    this.averageScore = this.scoreSum / this.totalCount;
  }

  recordContradictionResolved(): void {
    this.contradictionsResolved++;
  }

  recordSourcesEvaluated(count: number): void {
    this.sourcesEvaluated += count;
  }

  recordPatternsEvaluated(count: number): void {
    this.patternsEvaluated += count;
  }

  getSnapshot(): EvidenceEngineMetrics {
    return {
      totalEvidenceCreated: this.totalEvidenceCreated,
      validatedEvidenceCount: this.validatedEvidenceCount,
      rejectedEvidenceCount: this.rejectedEvidenceCount,
      activeEvidenceCount: this.activeEvidenceCount,
      averageConfidence: this.averageConfidence,
      averageScore: this.averageScore,
      evidenceByCategory: { ...this.evidenceByCategory },
      evidenceByStage: { ...this.evidenceByStage },
      contradictionsResolved: this.contradictionsResolved,
      sourcesEvaluated: this.sourcesEvaluated,
      patternsEvaluated: this.patternsEvaluated,
    };
  }

  reset(): void {
    this.totalEvidenceCreated = 0;
    this.validatedEvidenceCount = 0;
    this.rejectedEvidenceCount = 0;
    this.activeEvidenceCount = 0;
    this.averageConfidence = 0;
    this.averageScore = 0;
    this.evidenceByCategory = {};
    this.evidenceByStage = {};
    this.contradictionsResolved = 0;
    this.sourcesEvaluated = 0;
    this.patternsEvaluated = 0;
    this.confidenceSum = 0;
    this.scoreSum = 0;
    this.totalCount = 0;
  }
}
