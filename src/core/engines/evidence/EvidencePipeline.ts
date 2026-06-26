import { Evidence, EvidenceStage, EvidenceEvaluationRequest, EvidenceEvaluationResult, ObservationDetail, PatternDetail, EvidenceEventPayload } from "./EvidenceTypes";
import { EVIDENCE_EVENTS, getLifecycleEventName } from "./EvidenceEvents";
import { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";

import { EvidenceFactory } from "./EvidenceFactory";
import { EvidenceValidator } from "./EvidenceValidator";
import { EvidenceLifecycle } from "./EvidenceLifecycle";
import { EvidenceQuality } from "./EvidenceQuality";
import { EvidenceConfidence } from "./EvidenceConfidence";
import { EvidenceScoring } from "./EvidenceScoring";
import { EvidenceAggregation } from "./EvidenceAggregation";
import { EvidenceContradictions } from "./EvidenceContradictions";
import { EvidenceSources } from "./EvidenceSources";
import { EvidenceRelationships } from "./EvidenceRelationships";
import { EvidenceRegistry } from "./EvidenceRegistry";
import { EvidenceMetrics } from "./EvidenceMetrics";
import { EvidencePolicyEngine } from "./EvidencePolicies";
import { EvidenceMemory } from "./EvidenceMemory";

export class EvidencePipeline {
  readonly factory: EvidenceFactory;
  readonly validator: EvidenceValidator;
  readonly lifecycle: EvidenceLifecycle;
  readonly quality: EvidenceQuality;
  readonly confidence: EvidenceConfidence;
  readonly scoring: EvidenceScoring;
  readonly aggregation: EvidenceAggregation;
  readonly contradictions: EvidenceContradictions;
  readonly sources: EvidenceSources;
  readonly relationships: EvidenceRelationships;
  readonly registry: EvidenceRegistry;
  readonly metrics: EvidenceMetrics;
  readonly policyEngine: EvidencePolicyEngine;
  readonly memory: EvidenceMemory;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.memory = new EvidenceMemory();
    this.factory = new EvidenceFactory();
    this.validator = new EvidenceValidator();
    this.lifecycle = new EvidenceLifecycle();
    this.quality = new EvidenceQuality();
    this.confidence = new EvidenceConfidence();
    this.scoring = new EvidenceScoring();
    this.aggregation = new EvidenceAggregation();
    this.contradictions = new EvidenceContradictions();
    this.sources = new EvidenceSources();
    this.relationships = new EvidenceRelationships();
    this.policyEngine = new EvidencePolicyEngine();
    this.metrics = new EvidenceMetrics();
    this.registry = new EvidenceRegistry(this.memory, this.factory, this.validator);
  }

  async evaluate(
    request: EvidenceEvaluationRequest,
    observations: ObservationDetail[],
    pattern?: PatternDetail
  ): Promise<Evidence> {
    const startTime = Date.now();
    this.metrics.recordCreated();
    this.metrics.recordPatternsEvaluated(1);
    this.metrics.recordSourcesEvaluated(request.sourceTypes.length);
    this.metrics.recordCategory(request.patternCategory);

    await this.emitEvent(EVIDENCE_EVENTS.EVALUATION_STARTED, {
      evidenceId: "",
      patternId: request.patternId,
      patternName: request.patternName,
      stage: "CANDIDATE",
      score: 0,
      confidence: 0,
      supportingCount: request.supportingObservationIds.length,
      contradictingCount: request.contradictingObservationIds.length,
      timestamp: new Date().toISOString(),
    });

    try {
      this.validator.validateRequest(request);
      this.validator.validateObservations(observations);
      if (pattern) this.validator.validatePattern(pattern);

      const description = pattern
        ? `Evidence evaluation for pattern "${pattern.name}" (${pattern.stage})`
        : `Evidence evaluation for pattern "${request.patternName}"`;

      const evidence = await this.registry.registerEvidence(request, description);

      const evidenceWithRefs = await this.buildSupportingRefs(evidence, request, observations);

      const analysis = this.contradictions.analyze(
        evidenceWithRefs.supportingRefs,
        request.contradictingObservationIds,
        observations,
        request
      );

      const targetStage: EvidenceStage = analysis.hasContradiction ? "CONFLICTING" : "SUPPORTING";
      this.lifecycle.validateTransition(evidenceWithRefs.stage, targetStage);

      const profileResult = this.quality.evaluate(evidenceWithRefs, observations);

      const confidenceValue = this.confidence.compute(
        { ...evidenceWithRefs, qualityProfile: profileResult.profile },
        profileResult.profile,
        observations
      );

      this.metrics.recordConfidence(confidenceValue);

      const score = this.scoring.computeScore(
        { ...evidenceWithRefs, qualityProfile: profileResult.profile, confidence: confidenceValue },
        observations
      );

      this.metrics.recordScore(score);

      const contradictionsOrAnalysis = analysis.contradictions;

      const updatedEvidence = this.factory.cloneWithTransition(
        { ...evidenceWithRefs, qualityProfile: profileResult.profile },
        targetStage,
        {
          score,
          confidence: confidenceValue,
          summary: `Evidence evaluated: score=${score.toFixed(2)}, confidence=${confidenceValue.toFixed(2)}, stage=${targetStage}`,
          qualityProfile: profileResult.profile,
          contradictingRefs: contradictionsOrAnalysis,
          metadata: {
            ...evidence.metadata,
            evaluationDurationMs: Date.now() - startTime,
          },
        }
      );

      await this.registry.updateEvidence(updatedEvidence);
      this.metrics.recordStage(targetStage);

      const sourceProfiles = this.sources.analyze(observations);
      for (const obs of observations) {
        this.sources.recordSourceObservation(obs);
      }

      const aggregationResult = this.aggregation.aggregate(updatedEvidence, observations);

      const existingEvidence = await this.memory.findByPatternId(request.patternId);
      const rels = this.relationships.buildRelationships([
        updatedEvidence,
        ...existingEvidence.filter((e) => e.id !== updatedEvidence.id),
      ]);
      const withRelationships = this.factory.cloneWithTransition(
        updatedEvidence,
        targetStage,
        {
          relationships: rels,
        }
      );
      await this.registry.updateEvidence(withRelationships);

      await this.emitLifecycleEvent(withRelationships);

      await this.emitEvent(EVIDENCE_EVENTS.EVALUATION_COMPLETED, {
        evidenceId: withRelationships.id,
        patternId: request.patternId,
        patternName: request.patternName,
        stage: targetStage,
        score,
        confidence: confidenceValue,
        supportingCount: withRelationships.supportingRefs.length,
        contradictingCount: withRelationships.contradictingRefs.length,
        timestamp: new Date().toISOString(),
      });

      if (this.auditPipeline) {
        await this.auditPipeline.recordLog("EvidenceEngine", "evaluate", {
          evidenceId: withRelationships.id,
          patternId: request.patternId,
          stage: targetStage,
          score,
          confidence: confidenceValue,
          durationMs: Date.now() - startTime,
        });
      }

      return withRelationships;
    } catch (error) {
      this.metrics.recordRejected();

      await this.emitEvent(EVIDENCE_EVENTS.EVALUATION_FAILED, {
        evidenceId: "",
        patternId: request.patternId,
        patternName: request.patternName,
        stage: "REJECTED",
        score: 0,
        confidence: 0,
        supportingCount: request.supportingObservationIds.length,
        contradictingCount: request.contradictingObservationIds.length,
        timestamp: new Date().toISOString(),
      });

      if (this.recoveryPipeline && error instanceof Error) {
        await this.recoveryPipeline.registerFailure(
          "EvidenceEngine",
          error.name,
          error.message,
          error.stack
        );
      }

      throw error;
    }
  }

  async transition(evidence: Evidence, targetStage: EvidenceStage): Promise<Evidence> {
    this.lifecycle.validateTransition(evidence.stage, targetStage);

    const updated = this.factory.cloneWithTransition(evidence, targetStage);
    await this.registry.updateEvidence(updated);
    this.metrics.recordStage(targetStage);

    if (targetStage === "VALIDATED") {
      this.metrics.recordValidated();
    } else if (targetStage === "REJECTED") {
      this.metrics.recordRejected();
    }

    await this.emitLifecycleEvent(updated);

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange(
        "EvidenceEngine",
        evidence.stage,
        targetStage
      );
    }

    return updated;
  }

  async getMetrics(): Promise<ReturnType<EvidenceMetrics["getSnapshot"]>> {
    return this.metrics.getSnapshot();
  }

  private async buildSupportingRefs(
    evidence: Evidence,
    request: EvidenceEvaluationRequest,
    observations: ObservationDetail[]
  ): Promise<Evidence> {
    const obsMap = new Map(observations.map((o) => [o.id, o]));
    const supportingRefs = [];

    for (const obsId of request.supportingObservationIds) {
      const obs = obsMap.get(obsId);
      if (!obs) continue;

      const independence = this.sources.computeIndependence(
        evidence.supportingRefs as any,
        observations
      );
      const weight = Math.min(1, obs.trustScore * 0.4 + obs.confidence * 0.3 + request.patternStrength * 0.3);

      supportingRefs.push({
        observationId: obsId,
        patternId: request.patternId,
        weight,
        independence,
        sourceType: obs.sourceType,
        capturedAt: obs.timestamp,
      });
    }

    return {
      ...evidence,
      supportingRefs,
    };
  }

  private async emitEvent(
    eventName: string,
    payload: EvidenceEventPayload
  ): Promise<void> {
    if (!this.eventBus) return;
    try {
      await this.eventBus.emit(eventName, payload as unknown as Record<string, unknown>);
    } catch {
      // swallow emit errors
    }
  }

  private async emitLifecycleEvent(evidence: Evidence): Promise<void> {
    const eventName = getLifecycleEventName(evidence.stage);
    if (!eventName) return;

    await this.emitEvent(eventName, {
      evidenceId: evidence.id,
      patternId: evidence.identity.patternId,
      patternName: evidence.identity.patternName,
      stage: evidence.stage,
      score: evidence.score,
      confidence: evidence.confidence,
      supportingCount: evidence.supportingRefs.length,
      contradictingCount: evidence.contradictingRefs.length,
      timestamp: new Date().toISOString(),
    });
  }
}
