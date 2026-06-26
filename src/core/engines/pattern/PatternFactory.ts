import {
  Pattern,
  PatternStage,
  PatternCategory,
  PatternIdentity,
  PatternEvidenceRef,
  PatternTemporalScope,
  PatternSpatialScope,
  PatternOperationalScope,
  PatternQualityProfile,
  PatternRelationship,
  PatternVersion,
  PatternMetadata,
  DetectionMethod,
} from "./PatternTypes";

let idCounter = 0;

function generateId(): string {
  return `pat_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

function defaultQualityProfile(): PatternQualityProfile {
  return {
    precision: 0,
    coverage: 0,
    novelty: 0,
    consistency: 0,
    persistence: 0,
    generalization: 0,
    predictiveValue: 0,
    explainability: 0,
    robustness: 0,
    falsePositiveProbability: 1,
    falseNegativeProbability: 1,
  };
}

function defaultTemporalScope(): PatternTemporalScope {
  return {
    firstObservedAt: new Date().toISOString(),
    lastObservedAt: new Date().toISOString(),
    frequencyPerHour: 0,
    intervals: [],
  };
}

function defaultSpatialScope(): PatternSpatialScope {
  return {
    zones: [],
    locations: [],
  };
}

function defaultOperationalScope(): PatternOperationalScope {
  return {
    servicePeriods: [],
    staffingLevels: [],
    activeDuringPromotions: [],
    businessContexts: [],
  };
}

export class PatternFactory {
  createPotential(
    name: string,
    category: PatternCategory,
    detectionMethod: DetectionMethod,
    summary: string,
    description: string,
    businessRelevance: string,
    originObservationIds: readonly string[]
  ): Pattern {
    const id = generateId();
    const now = new Date().toISOString();
    const version: PatternVersion = {
      version: 1,
      timestamp: now,
      stage: "POTENTIAL",
      confidence: 0,
      strength: 0,
      summary,
    };
    const identity: PatternIdentity = {
      id,
      name,
      category,
      detectedBy: detectionMethod,
      detectedAt: now,
    };
    const evidence: PatternEvidenceRef[] = originObservationIds.map((oid) => ({
      observationId: oid,
      role: "ORIGIN",
      weight: 1,
      capturedAt: now,
    }));

    return {
      id,
      identity,
      stage: "POTENTIAL",
      summary,
      description,
      businessRelevance,
      confidence: 0,
      strength: 0,
      novelty: 0,
      persistence: 0,
      recurrence: 0,
      evidence,
      originObservations: [...originObservationIds],
      supportingObservations: [],
      contradictingObservations: [],
      temporalScope: defaultTemporalScope(),
      spatialScope: defaultSpatialScope(),
      operationalScope: defaultOperationalScope(),
      qualityProfile: defaultQualityProfile(),
      relationships: [],
      versions: [version],
      metadata: {
        detectionCount: 0,
        lastDetectedAt: now,
        lastEvaluationAt: now,
        sourceEngines: [],
        tags: [],
        attributes: {},
      },
    };
  }

  cloneWithTransition(
    original: Pattern,
    targetStage: PatternStage,
    updates?: Partial<Omit<Pattern, "id" | "identity" | "stage">>
  ): Pattern {
    const now = new Date().toISOString();
    const lastVersion = original.versions[original.versions.length - 1];
    const newVersionNumber = lastVersion ? lastVersion.version + 1 : 1;
    const newVersion: PatternVersion = {
      version: newVersionNumber,
      timestamp: now,
      stage: targetStage,
      confidence: updates?.confidence ?? original.confidence,
      strength: updates?.strength ?? original.strength,
      summary: updates?.summary ?? original.summary,
    };

    return {
      ...original,
      stage: targetStage,
      confidence: updates?.confidence ?? original.confidence,
      strength: updates?.strength ?? original.strength,
      novelty: updates?.novelty ?? original.novelty,
      persistence: updates?.persistence ?? original.persistence,
      recurrence: updates?.recurrence ?? original.recurrence,
      summary: updates?.summary ?? original.summary,
      description: updates?.description ?? original.description,
      businessRelevance: updates?.businessRelevance ?? original.businessRelevance,
      evidence: updates?.evidence ?? original.evidence,
      originObservations: updates?.originObservations ?? original.originObservations,
      supportingObservations: updates?.supportingObservations ?? original.supportingObservations,
      contradictingObservations: updates?.contradictingObservations ?? original.contradictingObservations,
      temporalScope: updates?.temporalScope ?? original.temporalScope,
      spatialScope: updates?.spatialScope ?? original.spatialScope,
      operationalScope: updates?.operationalScope ?? original.operationalScope,
      qualityProfile: updates?.qualityProfile ?? original.qualityProfile,
      relationships: updates?.relationships ?? original.relationships,
      versions: [...original.versions, newVersion],
      metadata: {
        ...original.metadata,
        ...updates?.metadata,
        lastEvaluationAt: now,
        lastDetectedAt: updates?.metadata?.lastDetectedAt ?? original.metadata.lastDetectedAt,
        sourceEngines: updates?.metadata?.sourceEngines ?? original.metadata.sourceEngines,
        tags: updates?.metadata?.tags ?? original.metadata.tags,
        attributes: { ...original.metadata.attributes, ...(updates?.metadata?.attributes as Record<string, unknown> ?? {}) },
      },
    };
  }
}
