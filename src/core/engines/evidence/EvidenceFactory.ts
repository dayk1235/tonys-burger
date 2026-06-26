import {
  Evidence,
  EvidenceStage,
  EvidenceCategory,
  EvidenceIdentity,
  SupportingRef,
  ContradictingRef,
  EvidenceQualityProfile,
  EvidenceVersion,
  EvidenceProvenance,
  EvidenceRelationship,
  EvidenceMetadata,
  EvidenceEvaluationRequest,
} from "./EvidenceTypes";

let idCounter = 0;

function generateId(): string {
  return `evd_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

function defaultQualityProfile(): EvidenceQualityProfile {
  return {
    strength: 0,
    coverage: 0,
    completeness: 0,
    consistency: 0,
    freshness: 0,
    reliability: 0,
    sourceDiversity: 0,
    traceability: 0,
    explainability: 0,
    contradictionResistance: 0,
    independence: 0,
  };
}

export class EvidenceFactory {
  createCandidate(
    request: EvidenceEvaluationRequest,
    description: string
  ): Evidence {
    const id = generateId();
    const now = new Date().toISOString();

    const identity: EvidenceIdentity = {
      id,
      name: `evidence_${request.patternName}`,
      patternId: request.patternId,
      patternName: request.patternName,
      category: request.patternCategory,
      classification: "STRENGTH",
      evaluatedAt: now,
    };

    const version: EvidenceVersion = {
      version: 1,
      timestamp: now,
      stage: "CANDIDATE",
      score: 0,
      confidence: 0,
      summary: `Evidence evaluation started for pattern "${request.patternName}"`,
    };

    const provenance: EvidenceProvenance = {
      sourceObservations: [...request.observations],
      sourcePatterns: [request.patternId],
      detectionTimeline: [now],
      evaluationHistory: [version],
    };

    return {
      id,
      identity,
      stage: "CANDIDATE",
      summary: `Evaluating evidence for pattern "${request.patternName}"`,
      description,
      score: 0,
      confidence: 0,
      supportingRefs: [],
      contradictingRefs: [],
      qualityProfile: defaultQualityProfile(),
      provenance,
      relationships: [],
      versions: [version],
      metadata: {
        totalObservationsEvaluated: request.observations.length,
        totalPatternsEvaluated: 1,
        uniqueSourceTypes: [...new Set(request.sourceTypes)],
        evaluationDurationMs: 0,
        tags: [],
        attributes: {},
      },
    };
  }

  cloneWithTransition(
    original: Evidence,
    targetStage: EvidenceStage,
    updates?: Partial<Omit<Evidence, "id" | "identity" | "stage">>
  ): Evidence {
    const now = new Date().toISOString();
    const lastVersion = original.versions[original.versions.length - 1];
    const newVersionNumber = lastVersion ? lastVersion.version + 1 : 1;
    const newVersion: EvidenceVersion = {
      version: newVersionNumber,
      timestamp: now,
      stage: targetStage,
      score: updates?.score ?? original.score,
      confidence: updates?.confidence ?? original.confidence,
      summary: updates?.summary ?? original.summary,
    };

    return {
      ...original,
      stage: targetStage,
      score: updates?.score ?? original.score,
      confidence: updates?.confidence ?? original.confidence,
      summary: updates?.summary ?? original.summary,
      description: updates?.description ?? original.description,
      supportingRefs: updates?.supportingRefs ?? original.supportingRefs,
      contradictingRefs: updates?.contradictingRefs ?? original.contradictingRefs,
      qualityProfile: updates?.qualityProfile ?? original.qualityProfile,
      provenance: {
        sourceObservations: updates?.provenance?.sourceObservations ?? original.provenance.sourceObservations,
        sourcePatterns: updates?.provenance?.sourcePatterns ?? original.provenance.sourcePatterns,
        detectionTimeline: [...original.provenance.detectionTimeline, now],
        evaluationHistory: updates?.provenance?.evaluationHistory ?? [...original.provenance.evaluationHistory, newVersion],
      },
      relationships: updates?.relationships ?? original.relationships,
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
