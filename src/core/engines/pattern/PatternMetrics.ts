import { PatternCategory, PatternStage } from "./PatternTypes";
import { PatternEngineMetrics } from "./PatternContracts";

export class PatternMetrics implements PatternEngineMetrics {
  totalPatternsDetected = 0;
  activePatternCount = 0;
  patternDiscoveryRate = 0;
  falsePositiveRate = 0;
  averageConfidence = 0;
  patternsByCategory: Record<string, number> = {};
  patternsByStage: Record<string, number> = {};
  trendsDetected = 0;
  anomaliesDetected = 0;
  correlationsFound = 0;
  sequencesDiscovered = 0;
  contradictionsResolved = 0;

  private totalConfidenceSum = 0;
  private confidenceCount = 0;
  private falsePositives = 0;
  private totalDetections = 0;

  recordDetection(category: string): void {
    this.totalPatternsDetected++;
    this.totalDetections++;
    this.incrementCategory(category);
  }

  recordFalsePositive(): void {
    this.falsePositives++;
    this.totalDetections++;
    this.falsePositiveRate = this.totalDetections > 0
      ? this.falsePositives / this.totalDetections
      : 0;
  }

  recordConfidence(confidence: number): void {
    this.totalConfidenceSum += confidence;
    this.confidenceCount++;
    this.averageConfidence = this.confidenceCount > 0
      ? this.totalConfidenceSum / this.confidenceCount
      : 0;
  }

  recordStageTransition(from: PatternStage, to: PatternStage): void {
    this.incrementStage(to);
    if (from === "DEPRECATED" && to !== "ARCHIVED") {
      this.contradictionsResolved++;
    }
  }

  recordTrendDetected(): void {
    this.trendsDetected++;
  }

  recordAnomalyDetected(): void {
    this.anomaliesDetected++;
  }

  recordCorrelationFound(): void {
    this.correlationsFound++;
  }

  recordSequenceDiscovered(): void {
    this.sequencesDiscovered++;
  }

  updateActiveCounts(stageCounts: Record<string, number>): void {
    const activeStages: PatternStage[] = ["EMERGING", "SUPPORTED", "VALIDATED", "STRENGTHENING"];
    this.activePatternCount = activeStages.reduce(
      (sum, stage) => sum + (stageCounts[stage] || 0), 0
    );
    this.patternsByStage = { ...stageCounts };
  }

  getSnapshot(): PatternEngineMetrics {
    return {
      totalPatternsDetected: this.totalPatternsDetected,
      activePatternCount: this.activePatternCount,
      patternDiscoveryRate: this.patternDiscoveryRate,
      falsePositiveRate: this.falsePositiveRate,
      averageConfidence: this.averageConfidence,
      patternsByCategory: { ...this.patternsByCategory },
      patternsByStage: { ...this.patternsByStage },
      trendsDetected: this.trendsDetected,
      anomaliesDetected: this.anomaliesDetected,
      correlationsFound: this.correlationsFound,
      sequencesDiscovered: this.sequencesDiscovered,
      contradictionsResolved: this.contradictionsResolved,
    };
  }

  reset(): void {
    this.totalPatternsDetected = 0;
    this.activePatternCount = 0;
    this.patternDiscoveryRate = 0;
    this.falsePositiveRate = 0;
    this.averageConfidence = 0;
    this.patternsByCategory = {};
    this.patternsByStage = {};
    this.trendsDetected = 0;
    this.anomaliesDetected = 0;
    this.correlationsFound = 0;
    this.sequencesDiscovered = 0;
    this.contradictionsResolved = 0;
    this.totalConfidenceSum = 0;
    this.confidenceCount = 0;
    this.falsePositives = 0;
    this.totalDetections = 0;
  }

  private incrementCategory(category: string): void {
    this.patternsByCategory[category] = (this.patternsByCategory[category] || 0) + 1;
  }

  private incrementStage(stage: string): void {
    this.patternsByStage[stage] = (this.patternsByStage[stage] || 0) + 1;
  }
}
