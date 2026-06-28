import {
  Reasoning,
  ReasoningStage,
  ReasoningIdentity,
  ReasoningVersion,
  ReasoningQualityProfile,
  ReasoningConfidenceProfile,
  ReasoningProvenance,
  ReasoningContextSnapshot,
  ReasoningRelationships,
  ReasoningMetadata,
  ReasoningInput,
  ReasoningHypothesis,
  ReasoningAlternative,
  ReasoningConstraint,
  ReasoningTradeoff,
  ReasoningConclusion,
  ReasoningTreeStep,
  ReasoningQuestion,
  QuestionType,
  ConfidenceLevel,
} from "./ReasoningTypes";

let idCounter = 0;

function generateId(): string {
  return `rsn_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

function conclusionId(): string {
  return `con_${Date.now()}_${idCounter}`;
}

function defaultQualityProfile(): ReasoningQualityProfile {
  return {
    correctness: 0, consistency: 0, completeness: 0, depth: 0,
    breadth: 0, creativity: 0, novelty: 0, explainability: 0,
    businessAlignment: 0, robustness: 0, efficiency: 0,
    ownerSatisfaction: 0, confidenceCalibration: 0, timeliness: 0,
  };
}

function defaultConfidenceProfile(): ReasoningConfidenceProfile {
  return {
    evidenceStrength: 0, knowledgeCoverage: 0, hypothesisQuality: 0,
    consistencyScore: 0, overallConfidence: 0, calibratedConfidence: 0,
    isOverconfident: false, isUnderconfident: false, flags: [],
  };
}

function defaultProvenance(input: ReasoningInput): ReasoningProvenance {
  const now = new Date().toISOString();
  return {
    attentionIds: [input.attentionId],
    sourceObservationIds: [...input.sourceObservationIds],
    sourceMemoryIds: [...input.sourceMemoryIds],
    sourceKnowledgeIds: [...input.sourceKnowledgeIds],
    creationTimeline: [now],
    versionHistory: [],
  };
}

function defaultContext(): ReasoningContextSnapshot {
  return {
    environment: "unknown", businessPhase: "idle", temporalContext: "normal",
    operationalState: "normal", loadLevel: 0.3, businessValue: 0,
    urgency: 0, ownerConcerns: [], capturedAt: new Date().toISOString(),
  };
}

function defaultRelationships(): ReasoningRelationships {
  return {
    parentCaseIds: [], childCaseIds: [], relatedAttentionIds: [],
    relatedObservationIds: [], relatedMemoryIds: [], relatedKnowledgeIds: [],
  };
}

export class ReasoningFactory {
  createFromInput(input: ReasoningInput): Reasoning {
    const id = generateId();
    const now = new Date().toISOString();

    const identity: ReasoningIdentity = {
      id,
      attentionId: input.attentionId,
      name: input.name,
      reasoningType: input.reasoningType,
      question: input.questionText,
      businessId: input.businessId,
      createdAt: now,
    };

    const question: ReasoningQuestion = {
      id: `q_${Date.now()}_${++idCounter}`,
      type: input.questionType,
      text: input.questionText,
      intent: input.intent,
      knownFacts: [],
      unknownFacts: [],
      assumptions: [],
      desiredConfidenceLevel: "MODERATE" as ConfidenceLevel,
      scope: "general",
      constraints: [],
      expectedOutput: "analysis",
      priority: 1,
      createdAt: now,
    };

    const version: ReasoningVersion = {
      version: 1, timestamp: now, stage: "CANDIDATE",
      confidence: 0, coherenceScore: 0, summary: `Reasoning case created: "${input.questionText}"`,
    };

    const provenance: ReasoningProvenance = {
      attentionIds: [input.attentionId],
      sourceObservationIds: [...input.sourceObservationIds],
      sourceMemoryIds: [...input.sourceMemoryIds],
      sourceKnowledgeIds: [...input.sourceKnowledgeIds],
      creationTimeline: [now],
      versionHistory: [version],
    };

    const metadata: ReasoningMetadata = {
      totalHypothesesGenerated: 0, totalAlternativesGenerated: 0,
      totalConstraintsEvaluated: 0, reEvaluationCount: 0, inferenceCount: 0,
      lastActiveAt: now, tags: [], attributes: {},
    };

    return {
      id,
      identity,
      stage: "CANDIDATE",
      type: input.reasoningType,
      question,
      confidence: 0,
      coherenceScore: 0,
      qualityProfile: defaultQualityProfile(),
      confidenceProfile: defaultConfidenceProfile(),
      confidenceExplanation: null,
      provenance,
      context: defaultContext(),
      informationGaps: [],
      hypotheses: [],
      alternatives: [],
      constraints: [],
      tradeoffs: [],
      conclusion: null,
      tree: [],
      relationships: defaultRelationships(),
      versions: [version],
      metadata,
    };
  }

  cloneWithTransition(
    original: Reasoning,
    targetStage: ReasoningStage,
    updates?: Partial<Omit<Reasoning, "id" | "identity" | "stage">>
  ): Reasoning {
    const now = new Date().toISOString();
    const lastVersion = original.versions[original.versions.length - 1];
    const newVersionNumber = lastVersion ? lastVersion.version + 1 : 1;
    const newVersion: ReasoningVersion = {
      version: newVersionNumber,
      timestamp: now,
      stage: targetStage,
      confidence: updates?.confidence ?? original.confidence,
      coherenceScore: updates?.coherenceScore ?? original.coherenceScore,
      summary: lastVersion?.summary ?? "",
    };

    return {
      ...original,
      stage: targetStage,
      type: updates?.type ?? original.type,
      question: updates?.question ?? original.question,
      confidence: updates?.confidence ?? original.confidence,
      coherenceScore: updates?.coherenceScore ?? original.coherenceScore,
      qualityProfile: updates?.qualityProfile ?? original.qualityProfile,
      confidenceProfile: updates?.confidenceProfile ?? original.confidenceProfile,
      confidenceExplanation: updates?.confidenceExplanation ?? original.confidenceExplanation,
      provenance: {
        attentionIds: updates?.provenance?.attentionIds ?? original.provenance.attentionIds,
        sourceObservationIds: updates?.provenance?.sourceObservationIds ?? original.provenance.sourceObservationIds,
        sourceMemoryIds: updates?.provenance?.sourceMemoryIds ?? original.provenance.sourceMemoryIds,
        sourceKnowledgeIds: updates?.provenance?.sourceKnowledgeIds ?? original.provenance.sourceKnowledgeIds,
        creationTimeline: [...original.provenance.creationTimeline, now],
        versionHistory: updates?.provenance?.versionHistory ?? [...original.provenance.versionHistory, newVersion],
      },
      context: updates?.context ?? original.context,
      informationGaps: updates?.informationGaps ?? original.informationGaps,
      hypotheses: updates?.hypotheses ?? original.hypotheses,
      alternatives: updates?.alternatives ?? original.alternatives,
      constraints: updates?.constraints ?? original.constraints,
      tradeoffs: updates?.tradeoffs ?? original.tradeoffs,
      conclusion: updates?.conclusion ?? original.conclusion,
      tree: updates?.tree ?? original.tree,
      relationships: updates?.relationships ?? original.relationships,
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

  createHypothesis(title: string, description: string): ReasoningHypothesis {
    return {
      id: `hyp_${Date.now()}_${++idCounter}`,
      title, description, evidenceStrength: 0, plausible: true,
      supportedBy: [], weakenedBy: [], status: "PENDING",
      createdAt: new Date().toISOString(),
    };
  }

  createAlternative(title: string, description: string): ReasoningAlternative {
    return {
      id: `alt_${Date.now()}_${++idCounter}`,
      title, description, businessImpact: 0, riskLevel: 0,
      costEstimate: 0, opportunityScore: 0, ownerAlignment: 0,
      constraintViolations: [], status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  }

  createConclusion(summary: string, narrative: string): ReasoningConclusion {
    return {
      id: conclusionId(), summary, narrative,
      preferredAlternativeId: null, confidence: 0,
      uncertaintyRanges: [], tradeoffHighlights: [],
      assumptions: [], unresolvedQuestions: [],
      timestamp: new Date().toISOString(),
    };
  }
}
