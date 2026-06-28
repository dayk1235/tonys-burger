import {
  Pattern,
  PatternStage,
  PatternCategory,
  ObservationRef,
  PatternDetectionResult,
  PatternDefinition,
  DetectionMethod,
} from "./PatternTypes";

import { PatternLifecycle } from "./PatternLifecycle";
import { PatternFactory } from "./PatternFactory";
import { PatternValidator } from "./PatternValidator";
import { PatternQuality } from "./PatternQuality";
import { PatternConfidence } from "./PatternConfidence";
import { PatternScoring } from "./PatternScoring";
import { PatternCorrelation } from "./PatternCorrelation";
import { PatternTrend } from "./PatternTrend";
import { PatternAnomaly } from "./PatternAnomaly";
import { PatternSequence } from "./PatternSequence";
import { PatternRelationships } from "./PatternRelationships";
import { PatternRegistry } from "./PatternRegistry";
import { PatternMetrics } from "./PatternMetrics";
import { PatternEventNames } from "./PatternEvents";
import { InsufficientEvidenceError } from "./PatternErrors";

import { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";

export class PatternPipeline {
  readonly lifecycle = new PatternLifecycle();
  readonly factory = new PatternFactory();
  readonly validator = new PatternValidator();
  readonly quality = new PatternQuality();
  readonly confidence = new PatternConfidence();
  readonly scoring = new PatternScoring();
  readonly correlation = new PatternCorrelation();
  readonly trend = new PatternTrend();
  readonly anomaly = new PatternAnomaly();
  readonly sequence = new PatternSequence();
  readonly relationships = new PatternRelationships();
  readonly registry = new PatternRegistry();
  readonly metrics = new PatternMetrics();

  private recentObservations: ObservationRef[] = [];
  private readonly maxRecentObservations = 500;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {}

  async processObservation(observation: ObservationRef): Promise<Pattern[]> {
    const detectedPatterns: Pattern[] = [];
    this.addObservation(observation);

    const definitions = this.registry.getDefinitions();
    if (definitions.length === 0) return detectedPatterns;

    for (const def of definitions) {
      try {
        const result = def.evaluate(this.recentObservations);
        if (result.detected && result.confidence >= def.confidenceThreshold) {
          const existingPatterns = await this.registry.findPatternsByCategory(def.category);
          const pattern = await this.handleDetection(def, result, existingPatterns);
          if (pattern) {
            detectedPatterns.push(pattern);
          }
        }
      } catch {
        // skip definitions that fail
      }
    }

    await this.detectCorrelations();
    await this.detectTrends();
    await this.detectAnomalies();
    await this.detectSequences();

    return detectedPatterns;
  }

  private async handleDetection(
    def: PatternDefinition,
    result: PatternDetectionResult,
    existingPatterns: Pattern[]
  ): Promise<Pattern | undefined> {
    const existing = existingPatterns.find(
      (p) => p.identity.name === def.name && this.lifecycle.isActive(p.stage)
    );

    if (existing) {
      return this.updateExistingPattern(existing, def, result);
    }

    return this.createNewPattern(def, result);
  }

  private async createNewPattern(def: PatternDefinition, result: PatternDetectionResult): Promise<Pattern> {
    const pattern = this.factory.createPotential(
      def.name,
      def.category,
      def.detectionMethod,
      def.description,
      def.description,
      "Business pattern detected through observation analysis",
      result.evidence
    );

    const stage1 = this.factory.cloneWithTransition(pattern, "CANDIDATE", {
      confidence: result.confidence,
      strength: result.strength,
      novelty: result.novelty,
    });

    const qualityResult = this.quality.evaluate(stage1, this.recentObservations);
    const confidenceScore = this.confidence.compute(stage1, qualityResult.profile, this.recentObservations);
    this.confidence.recordHistory(stage1.id, result.confidence, confidenceScore, "initial detection");

    const stage2 = this.factory.cloneWithTransition(stage1, "EMERGING", {
      confidence: confidenceScore,
      qualityProfile: qualityResult.profile,
      strength: this.scoring.computeStrength(stage1, this.recentObservations),
      persistence: this.scoring.computePersistence(stage1),
      recurrence: this.scoring.computeRecurrence(stage1),
    });

    await this.registry.storePattern(stage2);

    this.metrics.recordDetection(def.category);
    this.metrics.recordConfidence(confidenceScore);

    await this.emitEvent(PatternEventNames.POTENTIAL_DETECTED, pattern);
    await this.emitEvent(PatternEventNames.EMERGING_CONFIRMED, stage2);

    return stage2;
  }

  private async updateExistingPattern(
    existing: Pattern,
    def: PatternDefinition,
    result: PatternDetectionResult
  ): Promise<Pattern> {
    const newEvidence = result.evidence.filter(
      (id) => !existing.evidence.some((e) => e.observationId === id)
    );
    if (newEvidence.length < def.minSupport && existing.versions.length > 1) {
      return existing;
    }

    const supportingIds = [
      ...existing.supportingObservations,
      ...newEvidence,
    ];
    const updated = this.factory.cloneWithTransition(existing, existing.stage === "STRENGTHENING" ? "VALIDATED" : "STRENGTHENING", {
      supportingObservations: supportingIds,
      strength: this.scoring.computeStrength(
        { ...existing, supportingObservations: supportingIds },
        this.recentObservations
      ),
      confidence: Math.min(0.99, existing.confidence + 0.05 * (1 - existing.confidence)),
      persistence: this.scoring.computePersistence(existing),
      recurrence: this.scoring.computeRecurrence(existing),
    });

    await this.registry.storePattern(updated);
    this.metrics.recordConfidence(updated.confidence);
    await this.emitEvent(PatternEventNames.PATTERN_UPDATED, updated);

    return updated;
  }

  private async detectCorrelations(): Promise<void> {
    const activePatterns = await this.registry.findActivePatterns();
    if (activePatterns.length < 2) return;

    const correlationResults = this.correlation.detect(this.recentObservations, 0.5);
    for (const result of correlationResults) {
      const correlationPattern = this.factory.createPotential(
        `correlation_${Date.now()}`,
        "CORRELATION",
        "CORRELATION_PEARSON",
        "Correlation detected between observation categories",
        "Statistical correlation between observation streams",
        "Cross-category relationship that may indicate business process coupling",
        result.evidence
      );
      const staged = this.factory.cloneWithTransition(correlationPattern, "CANDIDATE", {
        confidence: result.confidence,
        strength: result.strength,
        novelty: result.novelty,
      });
      await this.registry.storePattern(staged);
      this.metrics.recordCorrelationFound();
      this.metrics.recordDetection("CORRELATION");
      await this.emitEvent(PatternEventNames.CORRELATION_FOUND, staged);
    }
  }

  private async detectTrends(): Promise<void> {
    const trendResults = this.trend.findTrends(this.recentObservations);
    for (const result of trendResults) {
      const direction = result.metadata.direction as string;
      const existingTrends = await this.registry.findPatternsByCategory(
        direction === "POSITIVE" ? "POSITIVE_TREND" :
        direction === "NEGATIVE" ? "NEGATIVE_TREND" : "STABLE_TREND"
      );

      if (existingTrends.length > 0) continue;

      const trendPattern = this.factory.createPotential(
        `${direction.toLowerCase()}_trend_${Date.now()}`,
        direction === "POSITIVE" ? "POSITIVE_TREND" :
        direction === "NEGATIVE" ? "NEGATIVE_TREND" : "STABLE_TREND",
        "TREND_REGRESSION",
        `${direction} trend detected`,
        `A ${direction.toLowerCase()} trend was detected through linear regression analysis`,
        "Sustained directional change in operational metrics",
        result.evidence
      );
      const staged = this.factory.cloneWithTransition(trendPattern, "EMERGING", {
        confidence: result.confidence,
        strength: result.strength,
      });
      await this.registry.storePattern(staged);
      this.metrics.recordTrendDetected();
      this.metrics.recordDetection(direction === "POSITIVE" ? "POSITIVE_TREND" : "NEGATIVE_TREND");
      await this.emitEvent(PatternEventNames.TREND_DETECTED, staged);
    }
  }

  private async detectAnomalies(): Promise<void> {
    const anomalyResults = this.anomaly.findAnomalies(this.recentObservations);
    for (const result of anomalyResults) {
      const existingAnomalies = await this.registry.findPatternsByCategory("ANOMALY");
      const isDuplicate = existingAnomalies.some((p) =>
        result.evidence.some((id) => p.originObservations.includes(id))
      );
      if (isDuplicate) continue;

      const anomalyPattern = this.factory.createPotential(
        `anomaly_${Date.now()}`,
        "ANOMALY",
        "ANOMALY_ZSCORE",
        "Anomalous observation detected",
        "Statistical outlier detected in observation stream",
        "Deviation from expected operational patterns that may require attention",
        result.evidence
      );
      const staged = this.factory.cloneWithTransition(anomalyPattern, "CANDIDATE", {
        confidence: result.confidence,
        strength: result.strength,
        novelty: result.novelty,
      });
      await this.registry.storePattern(staged);
      this.metrics.recordAnomalyDetected();
      this.metrics.recordDetection("ANOMALY");
      await this.emitEvent(PatternEventNames.ANOMALY_DETECTED, staged);
    }
  }

  private async detectSequences(): Promise<void> {
    const sequenceResults = this.sequence.findRepeatedPairs(this.recentObservations);
    for (const result of sequenceResults) {
      const existingSeqs = await this.registry.findPatternsByCategory("SEQUENCE");
      const isDuplicate = existingSeqs.some((p) =>
        result.evidence.some((id) => p.originObservations.includes(id))
      );
      if (isDuplicate) continue;

      const seqPattern = this.factory.createPotential(
        `sequence_${Date.now()}`,
        "SEQUENCE",
        "SEQUENCE_MINING",
        "Repeated observation sequence detected",
        "Consistent temporal ordering of observations detected",
        "Recurring operational sequence that may indicate standard workflow",
        result.evidence
      );
      const staged = this.factory.cloneWithTransition(seqPattern, "CANDIDATE", {
        confidence: result.confidence,
        strength: result.strength,
        novelty: result.novelty,
      });
      await this.registry.storePattern(staged);
      this.metrics.recordSequenceDiscovered();
      this.metrics.recordDetection("SEQUENCE");
      await this.emitEvent(PatternEventNames.SEQUENCE_DISCOVERED, staged);
    }
  }

  async advancePattern(patternId: string, targetStage: PatternStage, updates?: Record<string, unknown>): Promise<Pattern> {
    const existing = await this.registry.getPattern(patternId);
    if (!existing) throw new Error(`Pattern ${patternId} not found`);

    this.lifecycle.validateTransition(existing.stage, targetStage);

    const updated = this.factory.cloneWithTransition(existing, targetStage, {
      ...(updates as Partial<Omit<Pattern, "id" | "identity" | "stage">>),
    });

    await this.registry.storePattern(updated);
    this.metrics.recordStageTransition(existing.stage, targetStage);

    const eventName = this.getEventNameForStage(targetStage);
    await this.emitEvent(eventName, updated);

    return updated;
  }

  async deprecatePattern(patternId: string, reason: string): Promise<Pattern> {
    const existing = await this.registry.getPattern(patternId);
    if (!existing) throw new Error(`Pattern ${patternId} not found`);

    this.lifecycle.validateTransition(existing.stage, "DEPRECATED");

    const deprecated = this.factory.cloneWithTransition(existing, "DEPRECATED", {
      summary: `[DEPRECATED] ${reason}`,
    });

    await this.registry.storePattern(deprecated);
    this.metrics.recordStageTransition(existing.stage, "DEPRECATED");
    await this.emitEvent(PatternEventNames.DEPRECATED, deprecated);

    return deprecated;
  }

  async getPattern(id: string): Promise<Pattern | undefined> {
    return this.registry.getPattern(id);
  }

  async getAllPatterns(): Promise<Pattern[]> {
    return this.registry.getAllPatterns();
  }

  registerDefinition(def: PatternDefinition): void {
    this.registry.registerDefinition(def);
  }

  getRecentObservations(): readonly ObservationRef[] {
    return this.recentObservations;
  }

  private addObservation(observation: ObservationRef): void {
    this.recentObservations.push(observation);
    if (this.recentObservations.length > this.maxRecentObservations) {
      this.recentObservations = this.recentObservations.slice(-this.maxRecentObservations);
    }
  }

  private async emitEvent(eventName: string, pattern: Pattern): Promise<void> {
    if (!this.eventBus) return;
    const operation = this.getPatternOperation(eventName);
    await this.eventBus.emit(eventName, {
      pattern: { ...pattern },
      operation,
      timestamp: new Date().toISOString(),
      version: pattern.versions.length,
    });
  }

  private getPatternOperation(eventName: string): string {
    const map: Record<string, string> = {
      [PatternEventNames.POTENTIAL_DETECTED]: "DETECT",
      [PatternEventNames.CANDIDATE_EVALUATED]: "EVALUATE",
      [PatternEventNames.EMERGING_CONFIRMED]: "CONFIRM",
      [PatternEventNames.SUPPORTED_ESTABLISHED]: "ESTABLISH",
      [PatternEventNames.VALIDATED_CONFIRMED]: "VALIDATE",
      [PatternEventNames.STRENGTHENING_OBSERVED]: "STRENGTHEN",
      [PatternEventNames.WEAKENING_OBSERVED]: "WEAKEN",
      [PatternEventNames.DEPRECATED]: "DEPRECATE",
      [PatternEventNames.HISTORICAL_ARCHIVED]: "ARCHIVE",
      [PatternEventNames.CORRELATION_FOUND]: "CORRELATE",
      [PatternEventNames.TREND_DETECTED]: "TREND",
      [PatternEventNames.ANOMALY_DETECTED]: "ANOMALY",
      [PatternEventNames.SEQUENCE_DISCOVERED]: "SEQUENCE",
      [PatternEventNames.PATTERN_UPDATED]: "UPDATE",
      [PatternEventNames.PATTERN_CONFLICT]: "CONFLICT",
      [PatternEventNames.PATTERN_MERGED]: "MERGE",
    };
    return map[eventName] || "UNKNOWN";
  }

  private getEventNameForStage(stage: PatternStage): string {
    const map: Record<string, string> = {
      POTENTIAL: PatternEventNames.POTENTIAL_DETECTED,
      CANDIDATE: PatternEventNames.CANDIDATE_EVALUATED,
      EMERGING: PatternEventNames.EMERGING_CONFIRMED,
      SUPPORTED: PatternEventNames.SUPPORTED_ESTABLISHED,
      VALIDATED: PatternEventNames.VALIDATED_CONFIRMED,
      STRENGTHENING: PatternEventNames.STRENGTHENING_OBSERVED,
      WEAKENING: PatternEventNames.WEAKENING_OBSERVED,
      DEPRECATED: PatternEventNames.DEPRECATED,
      HISTORICAL: PatternEventNames.HISTORICAL_ARCHIVED,
      ARCHIVED: PatternEventNames.HISTORICAL_ARCHIVED,
    };
    return map[stage] || PatternEventNames.PATTERN_UPDATED;
  }
}
