import {
  Knowledge,
  KnowledgeStage,
  KnowledgeCategory,
  KnowledgeIdentity,
  KnowledgeVersion,
  KnowledgeQualityProfile,
  KnowledgeProvenance,
  KnowledgeMetadata,
  KnowledgeInput,
  Concept,
  GraphNode,
  GraphEdge,
} from "./KnowledgeTypes";

let idCounter = 0;

function generateId(): string {
  return `knw_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

function defaultQualityProfile(): KnowledgeQualityProfile {
  return {
    semanticConsistency: 0,
    coverage: 0,
    precision: 0,
    explainability: 0,
    abstractionQuality: 0,
    generalizationQuality: 0,
    traceability: 0,
    stability: 0,
    novelty: 0,
    confidence: 0,
    integrity: 0,
    reusability: 0,
  };
}

export class KnowledgeFactory {
  createFromInput(input: KnowledgeInput, description: string): Knowledge {
    const id = generateId();
    const now = new Date().toISOString();

    const identity: KnowledgeIdentity = {
      id,
      name: input.name,
      category: input.category,
      memoryId: input.memoryId,
      patternId: input.patternId,
      evidenceIds: [...input.evidenceIds],
      createdAt: now,
    };

    const version: KnowledgeVersion = {
      version: 1,
      timestamp: now,
      stage: "CANDIDATE",
      confidence: input.confidence,
      integrity: input.integrity,
      summary: `Knowledge created from memory "${input.memoryId}"`,
    };

    const provenance: KnowledgeProvenance = {
      sourceMemoryIds: [input.memoryId],
      sourceEvidenceIds: [...input.evidenceIds],
      sourcePatternIds: [input.patternId],
      creationTimeline: [now],
      versionHistory: [version],
      generalizedFromIds: [],
      specializedFromIds: [],
    };

    const metadata: KnowledgeMetadata = {
      totalDerivations: 0,
      timesValidated: 0,
      lastValidatedAt: now,
      generalizationCount: 0,
      specializationCount: 0,
      sourceCount: input.evidenceIds.length + 1,
      tags: [],
      attributes: {},
    };

    return {
      id,
      identity,
      stage: "CANDIDATE",
      summary: `Knowledge from "${input.name}"`,
      description,
      confidence: input.confidence,
      integrity: input.integrity,
      semanticScore: 0,
      abstractionLevel: 0,
      concepts: [],
      graphNodes: [],
      graphEdges: [],
      qualityProfile: defaultQualityProfile(),
      provenance,
      versions: [version],
      metadata,
    };
  }

  cloneWithTransition(
    original: Knowledge,
    targetStage: KnowledgeStage,
    updates?: Partial<Omit<Knowledge, "id" | "identity" | "stage">>
  ): Knowledge {
    const now = new Date().toISOString();
    const lastVersion = original.versions[original.versions.length - 1];
    const newVersionNumber = lastVersion ? lastVersion.version + 1 : 1;
    const newVersion: KnowledgeVersion = {
      version: newVersionNumber,
      timestamp: now,
      stage: targetStage,
      confidence: updates?.confidence ?? original.confidence,
      integrity: updates?.integrity ?? original.integrity,
      summary: updates?.summary ?? original.summary,
    };

    return {
      ...original,
      stage: targetStage,
      confidence: updates?.confidence ?? original.confidence,
      integrity: updates?.integrity ?? original.integrity,
      semanticScore: updates?.semanticScore ?? original.semanticScore,
      abstractionLevel: updates?.abstractionLevel ?? original.abstractionLevel,
      summary: updates?.summary ?? original.summary,
      description: updates?.description ?? original.description,
      concepts: updates?.concepts ?? original.concepts,
      graphNodes: updates?.graphNodes ?? original.graphNodes,
      graphEdges: updates?.graphEdges ?? original.graphEdges,
      qualityProfile: updates?.qualityProfile ?? original.qualityProfile,
      provenance: {
        sourceMemoryIds: updates?.provenance?.sourceMemoryIds ?? original.provenance.sourceMemoryIds,
        sourceEvidenceIds: updates?.provenance?.sourceEvidenceIds ?? original.provenance.sourceEvidenceIds,
        sourcePatternIds: updates?.provenance?.sourcePatternIds ?? original.provenance.sourcePatternIds,
        creationTimeline: [...original.provenance.creationTimeline, now],
        versionHistory: updates?.provenance?.versionHistory ?? [...original.provenance.versionHistory, newVersion],
        generalizedFromIds: updates?.provenance?.generalizedFromIds ?? original.provenance.generalizedFromIds,
        specializedFromIds: updates?.provenance?.specializedFromIds ?? original.provenance.specializedFromIds,
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
