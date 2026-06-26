import { MemoryEngineMetrics } from "./MemoryContracts";

export class MemoryMetrics implements MemoryEngineMetrics {
  totalMemoriesCreated = 0;
  consolidatedMemoryCount = 0;
  longTermMemoryCount = 0;
  forgottenMemoryCount = 0;
  archivedMemoryCount = 0;
  activeMemoryCount = 0;
  averageStrength = 0;
  averageConfidence = 0;
  averageRecallScore = 0;
  memoryByCategory: Record<string, number> = {};
  memoryByStage: Record<string, number> = {};
  totalAssociations = 0;
  mergesPerformed = 0;
  compressionsPerformed = 0;
  reactivationsPerformed = 0;

  private strengthSum = 0;
  private confidenceSum = 0;
  private recallSum = 0;
  private totalCount = 0;

  recordCreated(): void {
    this.totalMemoriesCreated++;
    this.activeMemoryCount++;
  }

  recordConsolidated(): void {
    this.consolidatedMemoryCount++;
  }

  recordLongTerm(): void {
    this.longTermMemoryCount++;
  }

  recordForgotten(): void {
    this.forgottenMemoryCount++;
    this.activeMemoryCount = Math.max(0, this.activeMemoryCount - 1);
  }

  recordArchived(): void {
    this.archivedMemoryCount++;
    this.activeMemoryCount = Math.max(0, this.activeMemoryCount - 1);
  }

  recordCategory(category: string): void {
    this.memoryByCategory[category] = (this.memoryByCategory[category] || 0) + 1;
  }

  recordStage(stage: string): void {
    this.memoryByStage[stage] = (this.memoryByStage[stage] || 0) + 1;
  }

  recordStrength(strength: number): void {
    this.strengthSum += strength;
    this.totalCount++;
    this.averageStrength = this.strengthSum / this.totalCount;
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordRecallScore(score: number): void {
    this.recallSum += score;
    this.averageRecallScore = this.recallSum / this.totalCount;
  }

  recordAssociations(count: number): void {
    this.totalAssociations += count;
  }

  recordMerge(): void {
    this.mergesPerformed++;
  }

  recordCompression(): void {
    this.compressionsPerformed++;
  }

  recordReactivation(): void {
    this.reactivationsPerformed++;
  }

  getSnapshot(): MemoryEngineMetrics {
    return {
      totalMemoriesCreated: this.totalMemoriesCreated,
      consolidatedMemoryCount: this.consolidatedMemoryCount,
      longTermMemoryCount: this.longTermMemoryCount,
      forgottenMemoryCount: this.forgottenMemoryCount,
      archivedMemoryCount: this.archivedMemoryCount,
      activeMemoryCount: this.activeMemoryCount,
      averageStrength: this.averageStrength,
      averageConfidence: this.averageConfidence,
      averageRecallScore: this.averageRecallScore,
      memoryByCategory: { ...this.memoryByCategory },
      memoryByStage: { ...this.memoryByStage },
      totalAssociations: this.totalAssociations,
      mergesPerformed: this.mergesPerformed,
      compressionsPerformed: this.compressionsPerformed,
      reactivationsPerformed: this.reactivationsPerformed,
    };
  }

  reset(): void {
    this.totalMemoriesCreated = 0;
    this.consolidatedMemoryCount = 0;
    this.longTermMemoryCount = 0;
    this.forgottenMemoryCount = 0;
    this.archivedMemoryCount = 0;
    this.activeMemoryCount = 0;
    this.averageStrength = 0;
    this.averageConfidence = 0;
    this.averageRecallScore = 0;
    this.memoryByCategory = {};
    this.memoryByStage = {};
    this.totalAssociations = 0;
    this.mergesPerformed = 0;
    this.compressionsPerformed = 0;
    this.reactivationsPerformed = 0;
    this.strengthSum = 0;
    this.confidenceSum = 0;
    this.recallSum = 0;
    this.totalCount = 0;
  }
}
