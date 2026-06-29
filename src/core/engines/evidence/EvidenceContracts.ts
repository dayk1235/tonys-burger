import { Evidence } from "./EvidenceTypes";

export interface EvidenceSubscriber {
  onEvidenceCreated(evidence: Evidence): Promise<void>;
  onEvidenceUpdated(evidence: Evidence): Promise<void>;
  onEvidenceFinalized(evidenceId: string, stage: string): Promise<void>;
}

export interface EvidenceQuery {
  findById(id: string): Promise<Evidence | undefined>;
  findByPatternId(patternId: string): Promise<Evidence[]>;
  findByCategory(category: string): Promise<Evidence[]>;
  findByStage(stage: string): Promise<Evidence[]>;
  findValidated(): Promise<Evidence[]>;
  search(query: string): Promise<Evidence[]>;
  findByBusinessId(businessId: string): Promise<Evidence[]>;
  findByReasoningId(reasoningId: string): Promise<Evidence[]>;
}

export interface EvidenceEngineMetrics {
  readonly totalEvidenceCreated: number;
  readonly validatedEvidenceCount: number;
  readonly rejectedEvidenceCount: number;
  readonly activeEvidenceCount: number;
  readonly averageConfidence: number;
  readonly averageScore: number;
  readonly evidenceByCategory: Record<string, number>;
  readonly evidenceByStage: Record<string, number>;
  readonly contradictionsResolved: number;
  readonly sourcesEvaluated: number;
  readonly patternsEvaluated: number;
}
