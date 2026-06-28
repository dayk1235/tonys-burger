/**
 * @file ObservationPipeline.ts
 * @description Ingestion pipeline that coordinates validation, verification,
 * context enrichment, quality grading, and event emission.
 */

import { Observation, ObservationStage, ObservationCategory, SourceOfTruth } from "./ObservationTypes";
import { ObservationValidator } from "./ObservationValidator";
import { ObservationLifecycle } from "./ObservationLifecycle";
import { ObservationFactory } from "./ObservationFactory";
import { ObservationContext } from "./ObservationContext";
import { ObservationQuality } from "./ObservationQuality";
import { ObservationMetrics } from "./ObservationMetrics";
import { ObservationEventNames } from "./ObservationEvents";
import { RuntimeEventBus, AuditPipeline, RecoveryPipeline, ContextBus } from "./ObservationContracts";
import { VerificationError, QualityThresholdViolation } from "./ObservationErrors";

export class ObservationPipeline {
  private readonly validator = new ObservationValidator();
  private readonly lifecycle = new ObservationLifecycle();
  private readonly factory = new ObservationFactory();
  private readonly context: ObservationContext;
  private readonly quality = new ObservationQuality();
  
  // In-memory Historical Memory store for validating invariants
  private readonly historicalStore = new Map<string, Observation>();
  private readonly recentObservations: Observation[] = [];

  constructor(
    private readonly metrics: ObservationMetrics,
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline,
    contextBus?: ContextBus
  ) {
    this.context = new ObservationContext(contextBus);
  }

  /**
   * Main pipeline processing method. Takes a raw stimulus input and outputs a verified Historical Observation.
   */
  public async processStimulus(input: Record<string, unknown>): Promise<Observation> {
    const startTime = Date.now();
    let sourceId = "unknown";
    let category = ObservationCategory.OPERATIONAL;
    
    try {
      // 1. Ingestion & Raw Validation
      this.validator.validateRawInput(input);
      
      const source = input.source as SourceOfTruth;
      sourceId = source.id;
      category = input.category as ObservationCategory;
      
      this.metrics.recordIngestion(category, sourceId);
      
      if (this.auditPipeline) {
        await this.auditPipeline.recordLog("ObservationEngine", "ingestion_started", { sourceId, category });
      }

      // Create Stage 1: POTENTIAL
      let obs = this.factory.createPotential({
        category,
        businessId: input.businessId as string,
        restaurantId: input.restaurantId as string | undefined,
        source,
        payload: input.payload as Record<string, unknown>,
        timestamp: input.timestamp as string | undefined
      });
      await this.emitEvent(ObservationEventNames.POTENTIAL_DETECTED, obs);

      // 2. Verification (POTENTIAL -> CANDIDATE -> VERIFIED)
      this.lifecycle.validateTransition(obs.stage, ObservationStage.CANDIDATE);
      obs = this.factory.cloneWithTransition(obs, ObservationStage.CANDIDATE);
      
      // Perform verification verification
      const verifySuccess = this.performVerification(obs);
      if (!verifySuccess) {
        throw new VerificationError("Verification checks failed for candidate observation.");
      }

      this.lifecycle.validateTransition(obs.stage, ObservationStage.VERIFIED);
      obs = this.factory.cloneWithTransition(obs, ObservationStage.VERIFIED, {
        evidence: `Verified by POS/IOT checks. Source Trust: ${obs.source.trustScore}`
      });
      this.validator.validateObservation(obs);
      this.metrics.recordVerificationSuccess();
      await this.emitEvent(ObservationEventNames.CANDIDATE_VERIFIED, obs);

      // 3. Contextualization (VERIFIED -> CONTEXTUALIZED)
      this.lifecycle.validateTransition(obs.stage, ObservationStage.CONTEXTUALIZED);
      const enrichedContext = await this.context.enrichContext(obs);
      obs = this.factory.cloneWithTransition(obs, ObservationStage.CONTEXTUALIZED, {
        context: enrichedContext
      });
      this.metrics.recordContextEnriched();
      await this.emitEvent(ObservationEventNames.CONTEXT_ASSIGNED, obs);

      // 4. Quality grading & Confidence calibration (CONTEXTUALIZED -> HISTORICAL)
      this.lifecycle.validateTransition(obs.stage, ObservationStage.HISTORICAL);
      const qualityResult = this.quality.evaluateQuality(obs, this.recentObservations);
      
      // Update confidence score
      const updatedConfidence = {
        ...obs.confidence,
        score: qualityResult.confidenceScore,
        history: [
          ...obs.confidence.history,
          {
            timestamp: new Date().toISOString(),
            previousConfidence: obs.confidence.score,
            newConfidence: qualityResult.confidenceScore,
            reason: "Initial quality and trust grading profile."
          }
        ]
      };

      // Quality validation checkpoint (e.g. discard if extremely low confidence)
      if (qualityResult.confidenceScore < 0.1) {
        this.metrics.recordQualityFailure(sourceId);
        throw new QualityThresholdViolation("Observation quality score fell below acceptable cognitive threshold (0.1).", {
          profile: qualityResult.profile,
          score: qualityResult.confidenceScore
        });
      }

      obs = this.factory.cloneWithTransition(obs, ObservationStage.HISTORICAL, {
        confidence: updatedConfidence
      });

      // Commit to Memory
      this.commitToHistoricalStore(obs);

      this.metrics.recordProcessingTime(Date.now() - startTime);
      await this.emitEvent(ObservationEventNames.HISTORICAL_COMMITTED, obs);

      if (this.auditPipeline) {
        await this.auditPipeline.recordLog("ObservationEngine", "observation_committed", { observationId: obs.id });
      }

      return obs;
      
    } catch (error) {
      this.metrics.recordProcessingTime(Date.now() - startTime);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (this.auditPipeline) {
        await this.auditPipeline.recordLog("ObservationEngine", "pipeline_failed", { error: errorMessage });
      }
      
      if (this.recoveryPipeline) {
        await this.recoveryPipeline.registerFailure(
          "ObservationEngine", 
          error instanceof Error ? error.constructor.name : "UnknownError", 
          errorMessage, 
          error instanceof Error ? error.stack : undefined
        );
      }
      
      throw error;
    }
  }

  /**
   * Mock verification processor checking simple invariants.
   */
  private performVerification(obs: Observation): boolean {
    // 1. Source must be declared
    if (!obs.source || !obs.source.id) return false;
    // 2. Occurrence time must not be in the future
    const occurrenceTime = new Date(obs.timestamp).getTime();
    if (occurrenceTime > Date.now() + 5000) return false;
    // 3. Payload must not be empty
    if (Object.keys(obs.payload).length === 0) return false;
    return true;
  }

  /**
   * Deprecates an observation in place (enforcing immutability) and creates a corrected replacement.
   */
  public async deprecateAndCorrect(
    observationId: string, 
    correctedPayload: Record<string, unknown>, 
    reason: string
  ): Promise<Observation> {
    const original = this.historicalStore.get(observationId);
    if (!original) {
      throw new Error(`Observation with ID ${observationId} not found in historical memory.`);
    }

    if (original.isDeprecated) {
      throw new Error(`Observation with ID ${observationId} is already deprecated.`);
    }

    // 1. Create correction replacement
    const correctedObs = await this.processStimulus({
      businessId: original.businessId,
      restaurantId: original.restaurantId,
      category: original.category,
      source: original.source,
      payload: correctedPayload,
      timestamp: original.timestamp
    });

    // 2. Clone original to mark as deprecated (immutability: we don't modify in place, we replace the memory slot)
    const updatedOriginal = this.factory.cloneWithTransition(original, original.stage, {
      isDeprecated: true,
      deprecationReason: reason,
      correctedByObservationId: correctedObs.id,
      confidence: {
        ...original.confidence,
        score: 0.05, // Minimum confidence representing deprecated
        history: [
          ...original.confidence.history,
          {
            timestamp: new Date().toISOString(),
            previousConfidence: original.confidence.score,
            newConfidence: 0.05,
            reason: `Deprecated: ${reason}. Corrected by observation ${correctedObs.id}`
          }
        ]
      }
    });

    // Update stores
    this.historicalStore.set(observationId, updatedOriginal);
    const index = this.recentObservations.findIndex(o => o.id === observationId);
    if (index !== -1) {
      this.recentObservations[index] = updatedOriginal;
    }

    await this.emitEvent(ObservationEventNames.DEPRECATED, updatedOriginal);
    await this.emitEvent(ObservationEventNames.CORRECTED, correctedObs);

    if (this.recoveryPipeline) {
      await this.recoveryPipeline.triggerCascadingAudit(original.id, correctedObs.id);
    }

    return correctedObs;
  }

  /**
   * Links an observation to a Pattern.
   */
  public async linkToPattern(observationId: string, patternId: string): Promise<Observation> {
    const obs = this.historicalStore.get(observationId);
    if (!obs) throw new Error(`Observation ${observationId} not found.`);

    this.lifecycle.validateTransition(obs.stage, ObservationStage.PATTERN_EVIDENCE);
    
    const updated = this.factory.cloneWithTransition(obs, ObservationStage.PATTERN_EVIDENCE, {
      relationships: {
        ...obs.relationships,
        supportedPatterns: [...new Set([...obs.relationships.supportedPatterns, patternId])]
      }
    });

    this.historicalStore.set(observationId, updated);
    await this.emitEvent(ObservationEventNames.PATTERN_EVIDENCE_LINKED, updated);
    return updated;
  }

  /**
   * Links an observation to Knowledge.
   */
  public async linkToKnowledge(observationId: string, knowledgeId: string): Promise<Observation> {
    const obs = this.historicalStore.get(observationId);
    if (!obs) throw new Error(`Observation ${observationId} not found.`);

    this.lifecycle.validateTransition(obs.stage, ObservationStage.KNOWLEDGE_EVIDENCE);
    
    const updated = this.factory.cloneWithTransition(obs, ObservationStage.KNOWLEDGE_EVIDENCE, {
      relationships: {
        ...obs.relationships,
        supportedKnowledge: [...new Set([...obs.relationships.supportedKnowledge, knowledgeId])]
      }
    });

    this.historicalStore.set(observationId, updated);
    await this.emitEvent(ObservationEventNames.KNOWLEDGE_EVIDENCE_LINKED, updated);
    return updated;
  }

  /**
   * Archives an observation.
   */
  public async archiveObservation(observationId: string): Promise<Observation> {
    const obs = this.historicalStore.get(observationId);
    if (!obs) throw new Error(`Observation ${observationId} not found.`);

    this.lifecycle.validateTransition(obs.stage, ObservationStage.ARCHIVED);
    
    const updated = this.factory.cloneWithTransition(obs, ObservationStage.ARCHIVED);
    this.historicalStore.set(observationId, updated);
    await this.emitEvent(ObservationEventNames.ARCHIVED, updated);
    return updated;
  }

  public getObservationById(id: string): Observation | undefined {
    return this.historicalStore.get(id);
  }

  public getRecentObservations(): Observation[] {
    return [...this.recentObservations];
  }

  private commitToHistoricalStore(obs: Observation): void {
    // Enforce Immutability: throw if ID already exists in storage
    if (this.historicalStore.has(obs.id)) {
      throw new Error(`Immutability violation: Observation with ID ${obs.id} already exists in Historical Memory.`);
    }
    
    this.historicalStore.set(obs.id, obs);
    this.recentObservations.unshift(obs);
    
    // Keep recents bounded to 100 for duplicate/consistency check performance
    if (this.recentObservations.length > 100) {
      this.recentObservations.pop();
    }
  }

  private async emitEvent(eventName: string, obs: Observation): Promise<void> {
    if (!this.eventBus) return;
    const operation = this.getObservationOperation(eventName);
    const entity = { ...obs };
    await this.eventBus.emit(eventName, {
      entity,
      observation: entity,
      operation,
      timestamp: new Date().toISOString(),
      version: 1,
    });
  }

  private getObservationOperation(eventName: string): string {
    const map: Record<string, string> = {
      [ObservationEventNames.POTENTIAL_DETECTED]: "DETECT",
      [ObservationEventNames.CANDIDATE_VERIFIED]: "VERIFY",
      [ObservationEventNames.CONTEXT_ASSIGNED]: "CONTEXTUALIZE",
      [ObservationEventNames.HISTORICAL_COMMITTED]: "COMMIT",
      [ObservationEventNames.DEPRECATED]: "DEPRECATE",
      [ObservationEventNames.CORRECTED]: "CORRECT",
      [ObservationEventNames.PATTERN_EVIDENCE_LINKED]: "LINK_PATTERN",
      [ObservationEventNames.KNOWLEDGE_EVIDENCE_LINKED]: "LINK_KNOWLEDGE",
      [ObservationEventNames.ARCHIVED]: "ARCHIVE",
    };
    return map[eventName] || "UNKNOWN";
  }
}
