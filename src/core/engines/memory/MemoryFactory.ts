import {
  Memory,
  MemoryStage,
  MemoryCategory,
  MemoryIdentity,
  MemoryVersion,
  MemoryQualityProfile,
  MemoryProvenance,
  MemoryAssociation,
  MemoryMetadata,
  MemoryInput,
  MemoryCompressionStats,
} from "./MemoryTypes";

let idCounter = 0;

function generateId(): string {
  return `mem_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

function defaultQualityProfile(): MemoryQualityProfile {
  return {
    retention: 0,
    recall: 0,
    precision: 0,
    consistency: 0,
    coverage: 0,
    traceability: 0,
    compressionEfficiency: 0,
    associationStrength: 0,
    semanticStability: 0,
    freshness: 0,
    explainability: 0,
    confidence: 0,
  };
}

export class MemoryFactory {
  createFromInput(input: MemoryInput, description: string): Memory {
    const id = generateId();
    const now = new Date().toISOString();

    const identity: MemoryIdentity = {
      id,
      name: input.name,
      category: input.category,
      evidenceId: input.evidenceId,
      patternId: input.patternId,
      observationIds: [...input.observationIds],
      createdAt: now,
    };

    const version: MemoryVersion = {
      version: 1,
      timestamp: now,
      stage: "WORKING",
      strength: input.strength,
      confidence: input.confidence,
      recallScore: 0,
      summary: `Memory created from evidence "${input.evidenceId}"`,
    };

    const provenance: MemoryProvenance = {
      sourceEvidenceIds: [input.evidenceId],
      sourcePatternIds: [input.patternId],
      sourceObservationIds: [...input.observationIds],
      creationTimeline: [now],
      versionHistory: [version],
      consolidatedFromIds: [],
      mergedFromIds: [],
    };

    const metadata: MemoryMetadata = {
      totalAccessCount: 0,
      lastAccessedAt: now,
      lastStrengthenedAt: now,
      decayRate: 0.1,
      tags: [],
      attributes: {},
    };

    return {
      id,
      identity,
      stage: "WORKING",
      summary: `Memory for pattern "${input.name}"`,
      description,
      strength: input.strength,
      confidence: input.confidence,
      recallScore: 0,
      activationScore: 0.5,
      retentionScore: 0.5,
      associations: [],
      qualityProfile: defaultQualityProfile(),
      provenance,
      versions: [version],
      metadata,
    };
  }

  cloneWithTransition(
    original: Memory,
    targetStage: MemoryStage,
    updates?: Partial<Omit<Memory, "id" | "identity" | "stage">>
  ): Memory {
    const now = new Date().toISOString();
    const lastVersion = original.versions[original.versions.length - 1];
    const newVersionNumber = lastVersion ? lastVersion.version + 1 : 1;
    const newVersion: MemoryVersion = {
      version: newVersionNumber,
      timestamp: now,
      stage: targetStage,
      strength: updates?.strength ?? original.strength,
      confidence: updates?.confidence ?? original.confidence,
      recallScore: updates?.recallScore ?? original.recallScore,
      summary: updates?.summary ?? original.summary,
    };

    return {
      ...original,
      stage: targetStage,
      strength: updates?.strength ?? original.strength,
      confidence: updates?.confidence ?? original.confidence,
      recallScore: updates?.recallScore ?? original.recallScore,
      activationScore: updates?.activationScore ?? original.activationScore,
      retentionScore: updates?.retentionScore ?? original.retentionScore,
      summary: updates?.summary ?? original.summary,
      description: updates?.description ?? original.description,
      associations: updates?.associations ?? original.associations,
      qualityProfile: updates?.qualityProfile ?? original.qualityProfile,
      compressionStats: updates?.compressionStats ?? original.compressionStats,
      provenance: {
        sourceEvidenceIds: updates?.provenance?.sourceEvidenceIds ?? original.provenance.sourceEvidenceIds,
        sourcePatternIds: updates?.provenance?.sourcePatternIds ?? original.provenance.sourcePatternIds,
        sourceObservationIds: updates?.provenance?.sourceObservationIds ?? original.provenance.sourceObservationIds,
        creationTimeline: [...original.provenance.creationTimeline, now],
        versionHistory: updates?.provenance?.versionHistory ?? [...original.provenance.versionHistory, newVersion],
        consolidatedFromIds: updates?.provenance?.consolidatedFromIds ?? original.provenance.consolidatedFromIds,
        mergedFromIds: updates?.provenance?.mergedFromIds ?? original.provenance.mergedFromIds,
      },
      versions: [...original.versions, newVersion],
      metadata: {
        ...original.metadata,
        ...updates?.metadata,
        tags: updates?.metadata?.tags ?? original.metadata.tags,
        attributes: { ...original.metadata.attributes, ...(updates?.metadata?.attributes as Record<string, unknown> ?? {}) },
      },
    };
  }
}
