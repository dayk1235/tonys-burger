import {
  Attention,
  AttentionStage,
  AttentionIdentity,
  AttentionVersion,
  AttentionPriorityFactors,
  AttentionQualityProfile,
  AttentionScoringFactors,
  AttentionProvenance,
  AttentionMetadata,
  AttentionInput,
} from "./AttentionTypes";

let idCounter = 0;

function generateId(): string {
  return `att_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

function defaultPriorityFactors(): AttentionPriorityFactors {
  return {
    urgency: 0,
    importance: 0,
    risk: 0,
    opportunity: 0,
    businessValue: 0,
    humanValue: 0,
    temporalPressure: 0,
    contextRelevance: 0,
    goalAlignment: 0,
    resourceAvailability: 0,
    uncertainty: 0,
    novelty: 0,
    confidence: 0,
  };
}

function defaultScoringFactors(): AttentionScoringFactors {
  return {
    baseScore: 0,
    urgencyScore: 0,
    importanceScore: 0,
    riskScore: 0,
    opportunityScore: 0,
    noveltyScore: 0,
    contextScore: 0,
    goalsScore: 0,
    temporalScore: 0,
    decayFactor: 1,
    boostFactor: 0,
    finalScore: 0,
  };
}

function defaultQualityProfile(): AttentionQualityProfile {
  return {
    priorityAccuracy: 0,
    focusStability: 0,
    allocationEfficiency: 0,
    contextAwareness: 0,
    goalAlignment: 0,
    riskSensitivity: 0,
    opportunityRecognition: 0,
    noveltyDetection: 0,
    explainability: 0,
    fairness: 0,
    confidence: 0,
    traceability: 0,
  };
}

export class AttentionFactory {
  createFromInput(input: AttentionInput): Attention {
    const id = generateId();
    const now = new Date().toISOString();

    const identity: AttentionIdentity = {
      id,
      name: input.name,
      category: input.category,
      sourceId: input.sourceId,
      sourceType: input.sourceType,
      sourceIds: [...input.sourceIds],
      createdAt: now,
    };

    const priorityFactors: AttentionPriorityFactors = {
      ...defaultPriorityFactors(),
      urgency: input.urgency,
      importance: input.importance,
      risk: input.risk,
      opportunity: input.opportunity,
      businessValue: input.businessValue,
      humanValue: input.humanValue,
    };

    const version: AttentionVersion = {
      version: 1,
      timestamp: now,
      stage: "CANDIDATE",
      priority: 0,
      allocation: 0,
      summary: `Attention candidate created from "${input.name}"`,
    };

    const provenance: AttentionProvenance = {
      sourceIds: [...input.sourceIds],
      sourceTypes: [input.sourceType],
      creationTimeline: [now],
      versionHistory: [version],
      escalationHistory: [],
      interruptionHistory: [],
    };

    const scoringFactors = defaultScoringFactors();
    scoringFactors.baseScore = input.urgency * 0.25 + input.importance * 0.25 + input.businessValue * 0.2 + input.humanValue * 0.15 + input.risk * 0.1 + input.opportunity * 0.05;

    const metadata: AttentionMetadata = {
      totalAllocations: 0,
      totalFocusDuration: 0,
      lastFocusAt: now,
      lastScoredAt: now,
      starveBoostCount: 0,
      decayCycles: 0,
      tags: [],
      attributes: {},
    };

    return {
      id,
      identity,
      stage: "CANDIDATE",
      priority: 0,
      priorityFactors,
      scoringFactors,
      allocation: 0,
      budgetConsumption: 0,
      age: 0,
      timesInterrupted: 0,
      timesRefocused: 0,
      escalationLevel: "NONE",
      qualityProfile: defaultQualityProfile(),
      provenance,
      versions: [version],
      metadata,
    };
  }

  cloneWithTransition(
    original: Attention,
    targetStage: AttentionStage,
    updates?: Partial<Omit<Attention, "id" | "identity" | "stage">> & { priorityFactors?: Partial<AttentionPriorityFactors> }
  ): Attention {
    const now = new Date().toISOString();
    const lastVersion = original.versions[original.versions.length - 1];
    const newVersionNumber = lastVersion ? lastVersion.version + 1 : 1;
    const newVersion: AttentionVersion = {
      version: newVersionNumber,
      timestamp: now,
      stage: targetStage,
      priority: updates?.priority ?? original.priority,
      allocation: updates?.allocation ?? original.allocation,
      summary: original.versions[original.versions.length - 1]?.summary ?? "",
    };

    return {
      ...original,
      stage: targetStage,
      priority: updates?.priority ?? original.priority,
      priorityFactors: updates?.priorityFactors
        ? { ...original.priorityFactors, ...updates.priorityFactors }
        : original.priorityFactors,
      scoringFactors: updates?.scoringFactors ?? original.scoringFactors,
      allocation: updates?.allocation ?? original.allocation,
      budgetConsumption: updates?.budgetConsumption ?? original.budgetConsumption,
      age: updates?.age ?? original.age,
      timesInterrupted: updates?.timesInterrupted ?? original.timesInterrupted,
      timesRefocused: updates?.timesRefocused ?? original.timesRefocused,
      escalationLevel: updates?.escalationLevel ?? original.escalationLevel,
      qualityProfile: updates?.qualityProfile ?? original.qualityProfile,
      provenance: {
        sourceIds: updates?.provenance?.sourceIds ?? original.provenance.sourceIds,
        sourceTypes: updates?.provenance?.sourceTypes ?? original.provenance.sourceTypes,
        creationTimeline: [...original.provenance.creationTimeline, now],
        versionHistory: updates?.provenance?.versionHistory ?? [...original.provenance.versionHistory, newVersion],
        escalationHistory: updates?.provenance?.escalationHistory ?? original.provenance.escalationHistory,
        interruptionHistory: updates?.provenance?.interruptionHistory ?? original.provenance.interruptionHistory,
      },
      versions: [...original.versions, newVersion],
      metadata: {
        ...original.metadata,
        ...updates?.metadata,
        tags: updates?.metadata?.tags ?? original.metadata.tags,
        attributes: {
          ...original.metadata.attributes,
          ...(updates?.metadata?.attributes as Record<string, unknown> ?? {}),
        },
      },
    };
  }
}
