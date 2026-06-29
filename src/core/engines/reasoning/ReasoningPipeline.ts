import {
  Reasoning,
  ReasoningStage,
  ReasoningInput,
  ReasoningOperation,
  ReasoningOperationResult,
  ReasoningHypothesis,
  ReasoningAlternative,
  InformationGapEntry,
} from "./ReasoningTypes";
import { REASONING_EVENTS, getReasoningLifecycleEventName } from "./ReasoningEvents";
import { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import { RuntimeErrorReporter } from "../../runtime/RuntimeErrorReporter";

import { ReasoningFactory } from "./ReasoningFactory";
import { ReasoningValidator } from "./ReasoningValidator";
import { ReasoningLifecycle } from "./ReasoningLifecycle";
import { ReasoningQuality } from "./ReasoningQuality";
import { ReasoningConfidence } from "./ReasoningConfidence";
import { ReasoningScoring } from "./ReasoningScoring";
import { ReasoningWorkspace } from "./ReasoningWorkspace";
import { ReasoningCase } from "./ReasoningCase";
import { ReasoningHypotheses } from "./ReasoningHypotheses";
import { ReasoningTree } from "./ReasoningTree";
import { ReasoningEvidence } from "./ReasoningEvidence";
import { ReasoningExplanation } from "./ReasoningExplanation";
import { ReasoningConstraints } from "./ReasoningConstraints";
import { ReasoningTradeoffs } from "./ReasoningTradeoffs";
import { ReasoningConclusionBuilder } from "./ReasoningConclusion";
import { ReasoningContext } from "./ReasoningContext";
import { ReasoningMetrics } from "./ReasoningMetrics";
import { ReasoningInformationGap } from "./ReasoningInformationGap";
import { ReasoningConfidenceExplanation } from "./ReasoningConfidenceExplanation";

export class ReasoningPipeline {
  readonly factory: ReasoningFactory;
  readonly validator: ReasoningValidator;
  readonly lifecycle: ReasoningLifecycle;
  readonly quality: ReasoningQuality;
  readonly confidence: ReasoningConfidence;
  readonly scoring: ReasoningScoring;
  readonly workspace: ReasoningWorkspace;
  readonly caseManager: ReasoningCase;
  readonly hypotheses: ReasoningHypotheses;
  readonly tree: ReasoningTree;
  readonly evidence: ReasoningEvidence;
  readonly explanation: ReasoningExplanation;
  readonly constraints: ReasoningConstraints;
  readonly tradeoffs: ReasoningTradeoffs;
  readonly conclusionBuilder: ReasoningConclusionBuilder;
  readonly context: ReasoningContext;
  readonly metrics: ReasoningMetrics;
  readonly informationGap: ReasoningInformationGap;
  readonly confidenceExplanation: ReasoningConfidenceExplanation;
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.factory = new ReasoningFactory();
    this.validator = new ReasoningValidator();
    this.lifecycle = new ReasoningLifecycle();
    this.quality = new ReasoningQuality();
    this.confidence = new ReasoningConfidence();
    this.scoring = new ReasoningScoring();
    this.workspace = new ReasoningWorkspace();
    this.caseManager = new ReasoningCase();
    this.hypotheses = new ReasoningHypotheses(this.factory);
    this.tree = new ReasoningTree();
    this.evidence = new ReasoningEvidence();
    this.explanation = new ReasoningExplanation();
    this.constraints = new ReasoningConstraints();
    this.tradeoffs = new ReasoningTradeoffs();
    this.conclusionBuilder = new ReasoningConclusionBuilder();
    this.context = new ReasoningContext();
    this.metrics = new ReasoningMetrics();
    this.informationGap = new ReasoningInformationGap();
    this.confidenceExplanation = new ReasoningConfidenceExplanation();
    this.errorReporter = new RuntimeErrorReporter("ReasoningPipeline", this.auditPipeline, this.recoveryPipeline);
  }

  async createCase(input: ReasoningInput): Promise<Reasoning> {
    const startTime = Date.now();
    this.metrics.recordCaseStarted();

    this.validator.validateInput(input);

    const reasoning = this.factory.createFromInput(input);
    this.workspace.create(reasoning);
    this.metrics.recordType(reasoning.type);
    this.metrics.recordStage(reasoning.stage);

    const activated = await this.executeActivation(reasoning);
    const withContext = await this.executeContextBuilding(activated);
    const withGaps = await this.executeInformationGapDetection(withContext);
    const withEvidence = await this.executeEvidenceGathering(withGaps);
    const withKnowledge = await this.executeKnowledgeRetrieval(withEvidence);
    const withHypotheses = await this.executeHypothesisGeneration(withKnowledge);
    const withAlternatives = await this.executeAlternativeGeneration(withHypotheses);
    const withConstraints = await this.executeConstraintEvaluation(withAlternatives);
    const withTradeoffs = await this.executeTradeoffEvaluation(withConstraints);
    const withConsistency = await this.executeConsistencyChecking(withTradeoffs);
    const withConfidence = await this.executeConfidenceAssessment(withConsistency);
    const withConfidenceExplanation = await this.executeConfidenceExplanation(withConfidence);
    const withConclusion = await this.executeConclusionBuilding(withConfidenceExplanation);
    const completed = await this.executeCompletion(withConclusion, startTime);

    return completed;
  }

  private async executeActivation(reasoning: Reasoning): Promise<Reasoning> {
    const updated = this.caseManager.transitionTo(reasoning, "ACTIVATED", {
      confidence: 0.1,
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "ACTIVATION", "Reasoning case activated", null, null, null, 1));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeContextBuilding(reasoning: Reasoning): Promise<Reasoning> {
    const contextResult = this.context.build(reasoning);
    const updated = this.caseManager.transitionTo(reasoning, "CONTEXT_BUILDING", {
      context: contextResult.context,
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "CONTEXT", "Context built", null, null, null, 0.8));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeInformationGapDetection(reasoning: Reasoning): Promise<Reasoning> {
    const gapResult = this.informationGap.analyze(reasoning);
    const updated = this.caseManager.transitionTo(reasoning, "INFORMATION_GAP_DETECTION", {
      informationGaps: gapResult.gaps as readonly InformationGapEntry[],
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "INFORMATION_GAP", `Detected ${gapResult.gaps.length} information gaps`, null, null, null, 0.7));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeEvidenceGathering(reasoning: Reasoning): Promise<Reasoning> {
    const evidenceResult = this.evidence.gather(reasoning);
    this.workspace.addEvidence(reasoning.id, ...evidenceResult.evidenceIds);

    const updated = this.caseManager.transitionTo(reasoning, "EVIDENCE_GATHERING", {
      provenance: {
        ...reasoning.provenance,
        sourceObservationIds: [...new Set([...reasoning.provenance.sourceObservationIds, ...evidenceResult.evidenceIds])] as readonly string[],
      } as typeof reasoning.provenance,
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "EVIDENCE", `Gathered ${evidenceResult.evidenceIds.length} evidence items`, null, null, null, evidenceResult.overallStrength));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeKnowledgeRetrieval(reasoning: Reasoning): Promise<Reasoning> {
    const updated = this.caseManager.transitionTo(reasoning, "KNOWLEDGE_RETRIEVAL");
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "KNOWLEDGE", "Knowledge retrieval complete", null, null, null, 0.7));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeHypothesisGeneration(reasoning: Reasoning): Promise<Reasoning> {
    const hypoResult = this.hypotheses.generate(reasoning);
    this.metrics.recordHypotheses(hypoResult.hypotheses.length);
    this.metrics.recordInference();

    const updated = this.caseManager.transitionTo(reasoning, "HYPOTHESIS_GENERATION", {
      hypotheses: hypoResult.hypotheses as readonly ReasoningHypothesis[],
      metadata: { ...reasoning.metadata, totalHypothesesGenerated: reasoning.metadata.totalHypothesesGenerated + hypoResult.hypotheses.length },
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "HYPOTHESIS", `Generated ${hypoResult.hypotheses.length} hypotheses`, null, null, null, 0.7));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeAlternativeGeneration(reasoning: Reasoning): Promise<Reasoning> {
    const altResult = this.hypotheses.generateAlternatives(reasoning);
    this.metrics.recordAlternatives(altResult.alternatives.length);

    const updated = this.caseManager.transitionTo(reasoning, "ALTERNATIVE_GENERATION", {
      alternatives: altResult.alternatives as readonly ReasoningAlternative[],
      metadata: { ...reasoning.metadata, totalAlternativesGenerated: reasoning.metadata.totalAlternativesGenerated + altResult.alternatives.length },
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "ALTERNATIVE", `Generated ${altResult.alternatives.length} alternatives`, null, null, null, 0.7));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeConstraintEvaluation(reasoning: Reasoning): Promise<Reasoning> {
    const constraintResult = this.constraints.evaluate(reasoning, reasoning.alternatives as ReasoningAlternative[]);
    this.metrics.recordConstraints(constraintResult.constraints.length);

    const updatedAlternatives = (reasoning.alternatives as ReasoningAlternative[]).map((alt) => ({
      ...alt,
      status: constraintResult.eliminatedAlternatives.includes(alt.id) ? "INFEASIBLE" as const : alt.status,
      constraintViolations: constraintResult.eliminatedAlternatives.includes(alt.id)
        ? [...alt.constraintViolations, ...constraintResult.constraints.filter((c) => c.eliminatesAlternativeIds.includes(alt.id)).map((c) => c.id)]
        : alt.constraintViolations,
    }));

    const updated = this.caseManager.transitionTo(reasoning, "CONSTRAINT_EVALUATION", {
      constraints: constraintResult.constraints as readonly import("./ReasoningTypes").ReasoningConstraint[],
      alternatives: updatedAlternatives as readonly import("./ReasoningTypes").ReasoningAlternative[],
      metadata: { ...reasoning.metadata, totalConstraintsEvaluated: reasoning.metadata.totalConstraintsEvaluated + constraintResult.constraints.length },
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "CONSTRAINT", `Evaluated ${constraintResult.constraints.length} constraints`, null, null, null, 0.8));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeTradeoffEvaluation(reasoning: Reasoning): Promise<Reasoning> {
    const feasibleAlts = (reasoning.alternatives as ReasoningAlternative[]).filter((a) => a.status !== "INFEASIBLE" && a.status !== "DISCARDED");
    const tradeoffResult = this.tradeoffs.evaluate(reasoning, feasibleAlts);

    const updated = this.caseManager.transitionTo(reasoning, "TRADEOFF_EVALUATION", {
      tradeoffs: tradeoffResult.tradeoffs as readonly import("./ReasoningTypes").ReasoningTradeoff[],
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "TRADEOFF", `Analyzed ${tradeoffResult.tradeoffs.length} tradeoffs`, null, null, null, 0.75));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeConsistencyChecking(reasoning: Reasoning): Promise<Reasoning> {
    const consistencyScore = this.scoring.scoreConsistency(reasoning.hypotheses as ReasoningHypothesis[]);

    const updated = this.caseManager.transitionTo(reasoning, "CONSISTENCY_CHECKING", {
      coherenceScore: consistencyScore,
    });
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "CONSISTENCY", `Consistency score: ${consistencyScore.toFixed(2)}`, null, null, null, consistencyScore));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeConfidenceAssessment(reasoning: Reasoning): Promise<Reasoning> {
    const evidenceStrength = this.evidence.evaluateHypothesisEvidence(reasoning, "all").strength;
    const knowledgeCoverage = reasoning.provenance.sourceKnowledgeIds.length > 0 ? Math.min(1, reasoning.provenance.sourceKnowledgeIds.length / 5) : 0.3;
    const hypothesisQuality = this.scoring.scoreConsistency(reasoning.hypotheses as ReasoningHypothesis[]);
    const consistencyScore = reasoning.coherenceScore;

    const confidenceProfile = this.confidence.compute(
      reasoning, evidenceStrength, knowledgeCoverage, hypothesisQuality, consistencyScore
    );

    const qualityResult = this.quality.evaluate(reasoning);

    const updated = this.caseManager.transitionTo(reasoning, "CONFIDENCE_ASSESSMENT", {
      confidence: confidenceProfile.calibratedConfidence,
      confidenceProfile: confidenceProfile,
      qualityProfile: qualityResult.profile,
      coherenceScore: consistencyScore,
    });

    this.metrics.recordConfidence(updated.confidence);
    this.metrics.recordQualityScore(qualityResult.qualityScore);
    this.metrics.recordStage(updated.stage);
    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "CONFIDENCE", `Confidence: ${updated.confidence.toFixed(2)}`, null, null, null, updated.confidence));
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeConfidenceExplanation(reasoning: Reasoning): Promise<Reasoning> {
    const explanation = this.confidence.generateExplanation(reasoning.confidenceProfile);
    const detailedExplanation = this.confidenceExplanation.explain(reasoning, reasoning.confidenceProfile);

    const updated = this.caseManager.transitionTo(reasoning, "CONFIDENCE_EXPLANATION", {
      confidenceExplanation: explanation,
    });

    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "CONFIDENCE_EXPLANATION", detailedExplanation.overallExplanation, null, null, null, explanation.calibratedConfidence));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeConclusionBuilding(reasoning: Reasoning): Promise<Reasoning> {
    const conclusionResult = this.conclusionBuilder.build(
      reasoning,
      reasoning.alternatives as ReasoningAlternative[],
      reasoning.tradeoffs as import("./ReasoningTypes").ReasoningTradeoff[],
      reasoning.constraints as import("./ReasoningTypes").ReasoningConstraint[],
      reasoning.hypotheses as ReasoningHypothesis[],
    );

    const updated = this.caseManager.transitionTo(reasoning, "CONCLUSION_BUILDING", {
      conclusion: conclusionResult.conclusion,
      metadata: {
        ...reasoning.metadata,
        totalHypothesesGenerated: reasoning.metadata.totalHypothesesGenerated,
      },
    });

    this.workspace.addTreeStep(reasoning.id, this.tree.addStep(reasoning, "CONCLUSION", "Conclusion built", null, null, null, conclusionResult.conclusion.confidence));
    this.metrics.recordStage(updated.stage);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  private async executeCompletion(reasoning: Reasoning, startTime: number): Promise<Reasoning> {
    const duration = Date.now() - startTime;
    this.metrics.recordCaseCompleted(duration);

    const updated = this.caseManager.transitionTo(reasoning, "COMPLETED");
    this.workspace.complete(reasoning.id);
    this.metrics.recordStage(updated.stage);

    await this.emitLifecycleEvent(updated);

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog("ReasoningEngine", "createCase", {
        reasoningId: updated.id,
        name: updated.identity.name,
        type: updated.type,
        durationMs: duration,
        confidence: updated.confidence,
      });
    }

    return updated;
  }

  async archiveCase(reasoning: Reasoning): Promise<Reasoning> {
    this.lifecycle.validateTransition(reasoning.stage, "ARCHIVED");
    const updated = this.factory.cloneWithTransition(reasoning, "ARCHIVED");
    this.metrics.recordArchived();
    this.metrics.recordStage(updated.stage);
    this.workspace.clear(reasoning.id);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  async retireCase(reasoning: Reasoning): Promise<Reasoning> {
    this.lifecycle.validateTransition(reasoning.stage, "RETIRED");
    const updated = this.factory.cloneWithTransition(reasoning, "RETIRED");
    this.metrics.recordStage(updated.stage);
    this.workspace.clear(reasoning.id);
    await this.emitLifecycleEvent(updated);
    return updated;
  }

  getExplanation(reasoning: Reasoning): ReturnType<ReasoningExplanation["buildChain"]> {
    return this.explanation.buildChain(reasoning);
  }

  getMetricsSnapshot() {
    return this.metrics.getSnapshot();
  }

  private async emitLifecycleEvent(reasoning: Reasoning): Promise<void> {
    const eventName = getReasoningLifecycleEventName(reasoning.stage);
    if (!eventName || !this.eventBus) return;
    try {
      let payload: Record<string, unknown>;
      if (reasoning.stage === "COMPLETED") {
        const reasoningData = {
          id: reasoning.id,
          identity: reasoning.identity,
          confidence: reasoning.confidence,
          integrity: reasoning.coherenceScore,
          alternatives: reasoning.alternatives,
          conclusion: reasoning.conclusion,
          question: reasoning.question,
          businessId: reasoning.identity.businessId,
          provenance: reasoning.provenance,
          metadata: reasoning.metadata,
        };
        payload = {
          entity: { reasoning: reasoningData },
          reasoning: reasoningData,
          operation: "COMPLETE",
          timestamp: new Date().toISOString(),
          version: reasoning.versions.length,
        };
      } else {
        const reasoningData = {
          id: reasoning.id,
          identity: reasoning.identity,
          confidence: reasoning.confidence,
          coherenceScore: reasoning.coherenceScore,
          qualityProfile: reasoning.qualityProfile,
          provenance: reasoning.provenance,
          context: reasoning.context,
          hypotheses: reasoning.hypotheses,
          alternatives: reasoning.alternatives,
          constraints: reasoning.constraints,
          tradeoffs: reasoning.tradeoffs,
          relationships: reasoning.relationships,
          metadata: reasoning.metadata,
        };
        payload = {
          entity: { reasoning: reasoningData },
          reasoning: reasoningData,
          operation: reasoning.stage as ReasoningOperation,
          timestamp: new Date().toISOString(),
          version: reasoning.versions.length,
        };
      }
      await this.eventBus.emit(eventName, payload);
    } catch (err) {
      await this.errorReporter.reportPipelineError("emitLifecycleEvent", err);
    }
  }
}
