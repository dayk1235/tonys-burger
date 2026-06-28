import { ReasoningEngineMetrics } from "./ReasoningContracts";

export class ReasoningMetrics implements ReasoningEngineMetrics {
  totalCasesProcessed = 0;
  completedCases = 0;
  archivedCases = 0;
  activeCases = 0;
  averageDurationMs = 0;
  averageConfidence = 0;
  averageQualityScore = 0;
  averageHypothesesPerCase = 0;
  averageAlternativesPerCase = 0;
  casesByType: Record<string, number> = {};
  casesByStage: Record<string, number> = {};
  confidenceDistribution: Record<string, number> = {};
  totalHypothesesGenerated = 0;
  totalAlternativesGenerated = 0;
  totalConstraintsEvaluated = 0;
  totalInferencesPerformed = 0;

  private durationSum = 0;
  private confidenceSum = 0;
  private qualitySum = 0;
  private hypothesisSum = 0;
  private alternativeSum = 0;
  private totalCount = 0;

  recordCaseStarted(): void {
    this.totalCasesProcessed++;
    this.activeCases++;
  }

  recordCaseCompleted(durationMs: number): void {
    this.completedCases++;
    this.activeCases = Math.max(0, this.activeCases - 1);
    this.durationSum += durationMs;
    this.averageDurationMs = this.durationSum / this.completedCases;
  }

  recordArchived(): void {
    this.archivedCases++;
  }

  recordType(type: string): void {
    this.casesByType[type] = (this.casesByType[type] || 0) + 1;
  }

  recordStage(stage: string): void {
    this.casesByStage[stage] = (this.casesByStage[stage] || 0) + 1;
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;

    const level = confidence >= 0.9 ? "VERY_HIGH" : confidence >= 0.7 ? "HIGH" : confidence >= 0.4 ? "MODERATE" : confidence >= 0.2 ? "LOW" : "VERY_LOW";
    this.confidenceDistribution[level] = (this.confidenceDistribution[level] || 0) + 1;
  }

  recordQualityScore(score: number): void {
    this.qualitySum += score;
    this.averageQualityScore = this.qualitySum / this.totalCount;
  }

  recordHypotheses(count: number): void {
    this.totalHypothesesGenerated += count;
    this.hypothesisSum += count;
    this.averageHypothesesPerCase = this.hypothesisSum / (this.totalCasesProcessed || 1);
  }

  recordAlternatives(count: number): void {
    this.totalAlternativesGenerated += count;
    this.alternativeSum += count;
    this.averageAlternativesPerCase = this.alternativeSum / (this.totalCasesProcessed || 1);
  }

  recordConstraints(count: number): void {
    this.totalConstraintsEvaluated += count;
  }

  recordInference(): void {
    this.totalInferencesPerformed++;
  }

  getSnapshot(): ReasoningEngineMetrics {
    return {
      totalCasesProcessed: this.totalCasesProcessed,
      completedCases: this.completedCases,
      archivedCases: this.archivedCases,
      activeCases: this.activeCases,
      averageDurationMs: this.averageDurationMs,
      averageConfidence: this.averageConfidence,
      averageQualityScore: this.averageQualityScore,
      averageHypothesesPerCase: this.averageHypothesesPerCase,
      averageAlternativesPerCase: this.averageAlternativesPerCase,
      casesByType: { ...this.casesByType },
      casesByStage: { ...this.casesByStage },
      confidenceDistribution: { ...this.confidenceDistribution },
      totalHypothesesGenerated: this.totalHypothesesGenerated,
      totalAlternativesGenerated: this.totalAlternativesGenerated,
      totalConstraintsEvaluated: this.totalConstraintsEvaluated,
      totalInferencesPerformed: this.totalInferencesPerformed,
    };
  }

  reset(): void {
    this.totalCasesProcessed = 0;
    this.completedCases = 0;
    this.archivedCases = 0;
    this.activeCases = 0;
    this.averageDurationMs = 0;
    this.averageConfidence = 0;
    this.averageQualityScore = 0;
    this.averageHypothesesPerCase = 0;
    this.averageAlternativesPerCase = 0;
    this.casesByType = {};
    this.casesByStage = {};
    this.confidenceDistribution = {};
    this.totalHypothesesGenerated = 0;
    this.totalAlternativesGenerated = 0;
    this.totalConstraintsEvaluated = 0;
    this.totalInferencesPerformed = 0;
    this.durationSum = 0;
    this.confidenceSum = 0;
    this.qualitySum = 0;
    this.hypothesisSum = 0;
    this.alternativeSum = 0;
    this.totalCount = 0;
  }
}
