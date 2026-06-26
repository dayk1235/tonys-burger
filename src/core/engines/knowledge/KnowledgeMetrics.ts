import { KnowledgeEngineMetrics } from "./KnowledgeContracts";

export class KnowledgeMetrics implements KnowledgeEngineMetrics {
  totalKnowledgeCreated = 0;
  validatedKnowledgeCount = 0;
  canonicalKnowledgeCount = 0;
  deprecatedKnowledgeCount = 0;
  archivedKnowledgeCount = 0;
  activeKnowledgeCount = 0;
  averageConfidence = 0;
  averageIntegrity = 0;
  averageAbstractionLevel = 0;
  knowledgeByCategory: Record<string, number> = {};
  knowledgeByStage: Record<string, number> = {};
  totalGraphNodes = 0;
  totalGraphEdges = 0;
  totalConcepts = 0;
  generalizationsPerformed = 0;
  specializationsPerformed = 0;
  extractionsPerformed = 0;

  private confidenceSum = 0;
  private integritySum = 0;
  private abstractionSum = 0;
  private totalCount = 0;

  recordCreated(): void {
    this.totalKnowledgeCreated++;
    this.activeKnowledgeCount++;
  }

  recordValidated(): void {
    this.validatedKnowledgeCount++;
  }

  recordCanonical(): void {
    this.canonicalKnowledgeCount++;
  }

  recordDeprecated(): void {
    this.deprecatedKnowledgeCount++;
    this.activeKnowledgeCount = Math.max(0, this.activeKnowledgeCount - 1);
  }

  recordArchived(): void {
    this.archivedKnowledgeCount++;
    this.activeKnowledgeCount = Math.max(0, this.activeKnowledgeCount - 1);
  }

  recordCategory(category: string): void {
    this.knowledgeByCategory[category] = (this.knowledgeByCategory[category] || 0) + 1;
  }

  recordStage(stage: string): void {
    this.knowledgeByStage[stage] = (this.knowledgeByStage[stage] || 0) + 1;
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordIntegrity(integrity: number): void {
    this.integritySum += integrity;
    this.averageIntegrity = this.integritySum / this.totalCount;
  }

  recordAbstractionLevel(level: number): void {
    this.abstractionSum += level;
    this.averageAbstractionLevel = this.abstractionSum / this.totalCount;
  }

  recordGraphNodes(count: number): void {
    this.totalGraphNodes += count;
  }

  recordGraphEdges(count: number): void {
    this.totalGraphEdges += count;
  }

  recordConcepts(count: number): void {
    this.totalConcepts += count;
  }

  recordGeneralization(): void {
    this.generalizationsPerformed++;
  }

  recordSpecialization(): void {
    this.specializationsPerformed++;
  }

  recordExtraction(): void {
    this.extractionsPerformed++;
  }

  getSnapshot(): KnowledgeEngineMetrics {
    return {
      totalKnowledgeCreated: this.totalKnowledgeCreated,
      validatedKnowledgeCount: this.validatedKnowledgeCount,
      canonicalKnowledgeCount: this.canonicalKnowledgeCount,
      deprecatedKnowledgeCount: this.deprecatedKnowledgeCount,
      archivedKnowledgeCount: this.archivedKnowledgeCount,
      activeKnowledgeCount: this.activeKnowledgeCount,
      averageConfidence: this.averageConfidence,
      averageIntegrity: this.averageIntegrity,
      averageAbstractionLevel: this.averageAbstractionLevel,
      knowledgeByCategory: { ...this.knowledgeByCategory },
      knowledgeByStage: { ...this.knowledgeByStage },
      totalGraphNodes: this.totalGraphNodes,
      totalGraphEdges: this.totalGraphEdges,
      totalConcepts: this.totalConcepts,
      generalizationsPerformed: this.generalizationsPerformed,
      specializationsPerformed: this.specializationsPerformed,
      extractionsPerformed: this.extractionsPerformed,
    };
  }

  reset(): void {
    this.totalKnowledgeCreated = 0;
    this.validatedKnowledgeCount = 0;
    this.canonicalKnowledgeCount = 0;
    this.deprecatedKnowledgeCount = 0;
    this.archivedKnowledgeCount = 0;
    this.activeKnowledgeCount = 0;
    this.averageConfidence = 0;
    this.averageIntegrity = 0;
    this.averageAbstractionLevel = 0;
    this.knowledgeByCategory = {};
    this.knowledgeByStage = {};
    this.totalGraphNodes = 0;
    this.totalGraphEdges = 0;
    this.totalConcepts = 0;
    this.generalizationsPerformed = 0;
    this.specializationsPerformed = 0;
    this.extractionsPerformed = 0;
    this.confidenceSum = 0;
    this.integritySum = 0;
    this.abstractionSum = 0;
    this.totalCount = 0;
  }
}
