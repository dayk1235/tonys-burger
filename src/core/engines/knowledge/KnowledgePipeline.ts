import { Knowledge, KnowledgeStage, KnowledgeInput, KnowledgeOperationResult, KnowledgeCategory, GraphEdgeType } from "./KnowledgeTypes";
import { KNOWLEDGE_EVENTS, getKnowledgeLifecycleEventName } from "./KnowledgeEvents";
import { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import { RuntimeErrorReporter } from "../../runtime/RuntimeErrorReporter";

import { KnowledgeFactory } from "./KnowledgeFactory";
import { KnowledgeValidator } from "./KnowledgeValidator";
import { KnowledgeLifecycle } from "./KnowledgeLifecycle";
import { KnowledgeQuality } from "./KnowledgeQuality";
import { KnowledgeConfidence } from "./KnowledgeConfidence";
import { KnowledgeScoring } from "./KnowledgeScoring";
import { KnowledgeExtraction } from "./KnowledgeExtraction";
import { KnowledgeAbstraction } from "./KnowledgeAbstraction";
import { KnowledgeGeneralization } from "./KnowledgeGeneralization";
import { KnowledgeSpecialization } from "./KnowledgeSpecialization";
import { KnowledgeOntology } from "./KnowledgeOntology";
import { KnowledgeConcepts } from "./KnowledgeConcepts";
import { KnowledgeRelationships } from "./KnowledgeRelationships";
import { KnowledgeGraph } from "./KnowledgeGraph";
import { KnowledgeInferenceBoundaries } from "./KnowledgeInferenceBoundaries";
import { KnowledgeVersioning } from "./KnowledgeVersioning";
import { KnowledgeIndex } from "./KnowledgeIndex";
import { KnowledgeSearch } from "./KnowledgeSearch";
import { KnowledgeMetrics } from "./KnowledgeMetrics";
import { KnowledgePolicyEngine } from "./KnowledgePolicies";

export class KnowledgePipeline {
  readonly factory: KnowledgeFactory;
  readonly validator: KnowledgeValidator;
  readonly lifecycle: KnowledgeLifecycle;
  readonly quality: KnowledgeQuality;
  readonly confidence: KnowledgeConfidence;
  readonly scoring: KnowledgeScoring;
  readonly extraction: KnowledgeExtraction;
  readonly abstraction: KnowledgeAbstraction;
  readonly generalization: KnowledgeGeneralization;
  readonly specialization: KnowledgeSpecialization;
  readonly ontology: KnowledgeOntology;
  readonly concepts: KnowledgeConcepts;
  readonly relationships: KnowledgeRelationships;
  readonly graph: KnowledgeGraph;
  readonly boundaries: KnowledgeInferenceBoundaries;
  readonly versioning: KnowledgeVersioning;
  readonly index: KnowledgeIndex;
  readonly search: KnowledgeSearch;
  readonly metrics: KnowledgeMetrics;
  readonly policyEngine: KnowledgePolicyEngine;
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.factory = new KnowledgeFactory();
    this.validator = new KnowledgeValidator();
    this.lifecycle = new KnowledgeLifecycle();
    this.quality = new KnowledgeQuality();
    this.confidence = new KnowledgeConfidence();
    this.scoring = new KnowledgeScoring();
    this.ontology = new KnowledgeOntology();
    this.concepts = new KnowledgeConcepts();
    this.relationships = new KnowledgeRelationships();
    this.graph = new KnowledgeGraph();
    this.boundaries = new KnowledgeInferenceBoundaries();
    this.versioning = new KnowledgeVersioning();
    this.index = new KnowledgeIndex();
    this.search = new KnowledgeSearch(this.index);
    this.metrics = new KnowledgeMetrics();
    this.errorReporter = new RuntimeErrorReporter("KnowledgePipeline", this.auditPipeline, this.recoveryPipeline);
    this.policyEngine = new KnowledgePolicyEngine();

    this.extraction = new KnowledgeExtraction(this.factory, this.validator);
    this.abstraction = new KnowledgeAbstraction(this.factory);
    this.generalization = new KnowledgeGeneralization(this.factory, this.lifecycle);
    this.specialization = new KnowledgeSpecialization(this.factory, this.lifecycle);
  }

  async createKnowledge(input: KnowledgeInput, description: string): Promise<Knowledge> {
    const startTime = Date.now();
    this.metrics.recordCreated();

    this.validator.validateInput(input);

    const extractionResult = this.extraction.extract(input, description);
    this.metrics.recordExtraction();

    const knowledge = extractionResult.knowledge;
    const withConcepts = { ...knowledge, concepts: extractionResult.concepts };
    const withNodes = { ...withConcepts, graphNodes: extractionResult.graphNodes };
    const withEdges = { ...withNodes, graphEdges: extractionResult.graphEdges };

    const promoted = this.factory.cloneWithTransition(withEdges, "EXTRACTED", {
      summary: `Knowledge extracted from memory "${input.memoryId}"`,
    });

    const qualityResult = this.quality.evaluate(promoted);
    const confidenceValue = this.confidence.compute(promoted, qualityResult.profile);
    const scoreResult = this.scoring.evaluate(promoted);

    const updated = this.factory.cloneWithTransition(promoted, "EXTRACTED", {
      confidence: confidenceValue,
      semanticScore: scoreResult.semanticScore,
      integrity: scoreResult.integrity,
      qualityProfile: qualityResult.profile,
    });

    this.index.index(updated);
    this.metrics.recordCategory(updated.identity.category);
    this.metrics.recordStage(updated.stage);
    this.metrics.recordConfidence(updated.confidence);
    this.metrics.recordIntegrity(updated.integrity);
    this.metrics.recordConcepts(updated.concepts.length);
    this.metrics.recordGraphNodes(updated.graphNodes.length);
    this.metrics.recordGraphEdges(updated.graphEdges.length);

    await this.emitEvent(KNOWLEDGE_EVENTS.OPERATION_EXTRACTED, {
      entity: { knowledge: { ...updated } },
      knowledgeId: updated.id,
      name: updated.identity.name,
      category: updated.identity.category,
      stage: "EXTRACTED",
      confidence: updated.confidence,
      integrity: updated.integrity,
      operation: "EXTRACT",
      timestamp: new Date().toISOString(),
    });

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog("KnowledgeEngine", "createKnowledge", {
        knowledgeId: updated.id,
        memoryId: input.memoryId,
        patternId: input.patternId,
        category: input.category,
        durationMs: Date.now() - startTime,
      });
    }

    return updated;
  }

  async validateKnowledge(knowledge: Knowledge): Promise<Knowledge> {
    this.boundaries.validateSupported(knowledge);

    this.lifecycle.validateTransition(knowledge.stage, "VALIDATED");

    const qualityResult = this.quality.evaluate(knowledge);
    const confidenceValue = this.confidence.compute(knowledge, qualityResult.profile);
    const scoreResult = this.scoring.evaluate(knowledge);

    const updated = this.factory.cloneWithTransition(knowledge, "VALIDATED", {
      confidence: confidenceValue,
      integrity: scoreResult.integrity,
      semanticScore: scoreResult.semanticScore,
      qualityProfile: qualityResult.profile,
      metadata: {
        ...knowledge.metadata,
        timesValidated: knowledge.metadata.timesValidated + 1,
        lastValidatedAt: new Date().toISOString(),
      },
    });

    this.metrics.recordValidated();
    this.metrics.recordConfidence(confidenceValue);
    this.index.index(updated);

    await this.emitLifecycleEvent(updated);

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange("KnowledgeEngine", knowledge.stage, "VALIDATED");
    }

    return updated;
  }

  async generalizeKnowledge(knowledge: Knowledge, sources: Knowledge[]): Promise<Knowledge> {
    this.boundaries.guardGeneralization(sources.length + 1);

    const result = this.generalization.generalize(knowledge, sources);

    if (result.newConcepts.length > 0) {
      const enriched = {
        ...result.knowledge,
        concepts: [...result.knowledge.concepts, ...result.newConcepts],
      };

      const qualityResult = this.quality.evaluate(enriched);
      const confidenceValue = this.confidence.compute(enriched, qualityResult.profile);
      const scoreResult = this.scoring.evaluate(enriched);

      const updated = this.factory.cloneWithTransition(enriched, "GENERALIZED", {
        confidence: confidenceValue,
        integrity: scoreResult.integrity,
        semanticScore: scoreResult.semanticScore,
        abstractionLevel: Math.min(1, knowledge.abstractionLevel + 0.15),
        qualityProfile: qualityResult.profile,
      });

      this.metrics.recordGeneralization();
      this.metrics.recordConfidence(confidenceValue);
      this.metrics.recordAbstractionLevel(updated.abstractionLevel);
      this.metrics.recordConcepts(updated.concepts.length);
      this.index.index(updated);

      await this.emitEvent(KNOWLEDGE_EVENTS.OPERATION_GENERALIZED, {
        entity: { knowledge: { ...updated } },
        knowledgeId: updated.id,
        name: updated.identity.name,
        category: updated.identity.category,
        stage: "GENERALIZED",
        confidence: updated.confidence,
        integrity: updated.integrity,
        operation: "GENERALIZE",
        timestamp: new Date().toISOString(),
      });

      return updated;
    }

    return knowledge;
  }

  async specializeKnowledge(knowledge: Knowledge, attributeName: string, attributeValue: string): Promise<Knowledge> {
    this.boundaries.guardSpecialization(knowledge.abstractionLevel);

    const result = this.specialization.specialize(knowledge, attributeName, attributeValue);

    const qualityResult = this.quality.evaluate(result.knowledge);
    const confidenceValue = this.confidence.compute(result.knowledge, qualityResult.profile);

    const updated = this.factory.cloneWithTransition(result.knowledge, "SPECIALIZED", {
      confidence: confidenceValue,
      qualityProfile: qualityResult.profile,
    });

    this.metrics.recordSpecialization();
    this.metrics.recordConfidence(confidenceValue);
    this.metrics.recordConcepts(updated.concepts.length);
    this.index.index(updated);

    await this.emitEvent(KNOWLEDGE_EVENTS.OPERATION_SPECIALIZED, {
      entity: { knowledge: { ...updated } },
      knowledgeId: updated.id,
      name: updated.identity.name,
      category: updated.identity.category,
      stage: "SPECIALIZED",
      confidence: updated.confidence,
      integrity: updated.integrity,
      operation: "SPECIALIZE",
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async promoteToSemantic(knowledge: Knowledge): Promise<Knowledge> {
    this.lifecycle.validateTransition(knowledge.stage, "SEMANTIC");

    const abstractionResult = this.abstraction.evaluateAbstraction(knowledge);
    const qualityResult = this.quality.evaluate(abstractionResult.knowledge);
    const confidenceValue = this.confidence.compute(abstractionResult.knowledge, qualityResult.profile);

    const updated = this.factory.cloneWithTransition(abstractionResult.knowledge, "SEMANTIC", {
      confidence: confidenceValue,
      qualityProfile: qualityResult.profile,
      summary: `Knowledge promoted to semantic stage`,
    });

    this.metrics.recordConfidence(confidenceValue);
    this.metrics.recordStage(updated.stage);
    this.index.index(updated);

    await this.emitLifecycleEvent(updated);

    return updated;
  }

  async promoteToCanonical(knowledge: Knowledge): Promise<Knowledge> {
    this.lifecycle.validateTransition(knowledge.stage, "CANONICAL");

    const qualityResult = this.quality.evaluate(knowledge);
    const confidenceValue = this.confidence.compute(knowledge, qualityResult.profile);
    const scoreResult = this.scoring.evaluate(knowledge);

    const updated = this.factory.cloneWithTransition(knowledge, "CANONICAL", {
      confidence: confidenceValue,
      integrity: scoreResult.integrity,
      qualityProfile: qualityResult.profile,
      summary: `Knowledge promoted to canonical stage`,
    });

    this.metrics.recordCanonical();
    this.metrics.recordConfidence(confidenceValue);
    this.metrics.recordStage(updated.stage);
    this.index.index(updated);

    await this.emitLifecycleEvent(updated);

    return updated;
  }

  async deprecateKnowledge(knowledge: Knowledge): Promise<Knowledge> {
    this.lifecycle.validateTransition(knowledge.stage, "HISTORICAL");

    const updated = this.factory.cloneWithTransition(knowledge, "HISTORICAL", {
      confidence: Math.max(0.1, knowledge.confidence * 0.5),
      integrity: Math.max(0.1, knowledge.integrity * 0.5),
      summary: `Knowledge deprecated and moved to historical`,
    });

    this.metrics.recordDeprecated();
    this.index.index(updated);

    await this.emitEvent(KNOWLEDGE_EVENTS.OPERATION_DEPRECATED, {
      entity: { knowledge: { ...updated } },
      knowledgeId: updated.id,
      name: updated.identity.name,
      category: updated.identity.category,
      stage: "HISTORICAL",
      confidence: updated.confidence,
      integrity: updated.integrity,
      operation: "DEPRECATE",
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async archiveKnowledge(knowledge: Knowledge): Promise<Knowledge> {
    this.lifecycle.validateTransition(knowledge.stage, "ARCHIVED");

    const updated = this.factory.cloneWithTransition(knowledge, "ARCHIVED");

    this.metrics.recordArchived();
    this.index.index(updated);

    await this.emitLifecycleEvent(updated);

    return updated;
  }

  async linkConcepts(knowledge: Knowledge, sourceConceptId: string, targetConceptId: string, edgeType: GraphEdgeType, weight: number): Promise<Knowledge> {
    const sourceNode = knowledge.graphNodes.find(
      (n) => n.metadata && (n.metadata as Record<string, unknown>).conceptId === sourceConceptId
    );
    const targetNode = knowledge.graphNodes.find(
      (n) => n.metadata && (n.metadata as Record<string, unknown>).conceptId === targetConceptId
    );

    if (!sourceNode || !targetNode) return knowledge;

    const now = new Date().toISOString();
    const newEdge = {
      id: `edge_${sourceNode.id}_${targetNode.id}_${now}`,
      sourceId: sourceNode.id,
      targetId: targetNode.id,
      type: edgeType,
      weight,
      confidence: knowledge.confidence,
      provenance: [knowledge.id],
      discoveredAt: now,
    };

    const updated = this.factory.cloneWithTransition(knowledge, knowledge.stage, {
      graphEdges: [...knowledge.graphEdges, newEdge],
      metadata: {
        ...knowledge.metadata,
        totalDerivations: knowledge.metadata.totalDerivations + 1,
      },
    });

    this.metrics.recordGraphEdges(updated.graphEdges.length);
    this.index.index(updated);

    return updated;
  }

  getMetrics(): ReturnType<KnowledgeMetrics["getSnapshot"]> {
    return this.metrics.getSnapshot();
  }

  private async emitEvent(
    eventName: string,
    payload: Record<string, unknown>
  ): Promise<void> {
    if (!this.eventBus) return;
    try {
      await this.eventBus.emit(eventName, payload as unknown as Record<string, unknown>);
    } catch (err) {
      await this.errorReporter.reportPipelineError("emitEvent", err);
    }
  }

  private async emitLifecycleEvent(knowledge: Knowledge): Promise<void> {
    const eventName = getKnowledgeLifecycleEventName(knowledge.stage);
    if (!eventName) return;

    const operation = this.getKnowledgeOperation(knowledge.stage);
    await this.emitEvent(eventName, {
      entity: { knowledge: { ...knowledge } },
      knowledge: { ...knowledge },
      operation,
      timestamp: new Date().toISOString(),
      version: knowledge.versions.length,
    });
  }

  private getKnowledgeOperation(stage: KnowledgeStage): string {
    const map: Record<string, string> = {
      CANDIDATE: "CREATE",
      EXTRACTED: "EXTRACT",
      STRUCTURED: "STRUCTURE",
      VALIDATED: "VALIDATE",
      GENERALIZED: "GENERALIZE",
      SPECIALIZED: "SPECIALIZE",
      SEMANTIC: "SEMANTIC",
      CANONICAL: "CANONICAL",
      HISTORICAL: "ARCHIVE",
      ARCHIVED: "ARCHIVE",
    };
    return map[stage] || "UPDATE";
  }
}
