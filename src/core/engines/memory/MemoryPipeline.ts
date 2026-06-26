import { Memory, MemoryStage, MemoryInput, MemoryOperation, MemoryOperationResult, MemoryCategory } from "./MemoryTypes";
import { MEMORY_EVENTS, getMemoryLifecycleEventName, getMemoryOperationEventName } from "./MemoryEvents";
import { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";

import { MemoryFactory } from "./MemoryFactory";
import { MemoryValidator } from "./MemoryValidator";
import { MemoryLifecycle } from "./MemoryLifecycle";
import { MemoryQuality } from "./MemoryQuality";
import { MemoryConfidence } from "./MemoryConfidence";
import { MemoryScoring } from "./MemoryScoring";
import { MemoryConsolidation } from "./MemoryConsolidation";
import { MemoryRetention } from "./MemoryRetention";
import { MemoryForgetting } from "./MemoryForgetting";
import { MemoryStrength } from "./MemoryStrength";
import { MemoryActivation } from "./MemoryActivation";
import { MemoryAssociations } from "./MemoryAssociations";
import { MemoryRelationships } from "./MemoryRelationships";
import { MemoryVersioning } from "./MemoryVersioning";
import { MemoryIndex } from "./MemoryIndex";
import { MemorySearch } from "./MemorySearch";
import { MemoryCompression } from "./MemoryCompression";
import { MemoryMetrics } from "./MemoryMetrics";
import { MemoryPolicyEngine } from "./MemoryPolicies";

export class MemoryPipeline {
  readonly factory: MemoryFactory;
  readonly validator: MemoryValidator;
  readonly lifecycle: MemoryLifecycle;
  readonly quality: MemoryQuality;
  readonly confidence: MemoryConfidence;
  readonly scoring: MemoryScoring;
  readonly consolidation: MemoryConsolidation;
  readonly retention: MemoryRetention;
  readonly forgetting: MemoryForgetting;
  readonly strength: MemoryStrength;
  readonly activation: MemoryActivation;
  readonly associations: MemoryAssociations;
  readonly relationships: MemoryRelationships;
  readonly versioning: MemoryVersioning;
  readonly index: MemoryIndex;
  readonly search: MemorySearch;
  readonly compression: MemoryCompression;
  readonly metrics: MemoryMetrics;
  readonly policyEngine: MemoryPolicyEngine;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.factory = new MemoryFactory();
    this.validator = new MemoryValidator();
    this.lifecycle = new MemoryLifecycle();
    this.quality = new MemoryQuality();
    this.confidence = new MemoryConfidence();
    this.scoring = new MemoryScoring();
    this.associations = new MemoryAssociations();
    this.relationships = new MemoryRelationships();
    this.versioning = new MemoryVersioning();
    this.index = new MemoryIndex();
    this.search = new MemorySearch(this.index);
    this.metrics = new MemoryMetrics();
    this.policyEngine = new MemoryPolicyEngine();

    this.consolidation = new MemoryConsolidation(this.factory, this.lifecycle);
    this.retention = new MemoryRetention();
    this.forgetting = new MemoryForgetting(this.factory, this.lifecycle);
    this.strength = new MemoryStrength();
    this.activation = new MemoryActivation();
    this.compression = new MemoryCompression(this.factory);
  }

  async createMemory(input: MemoryInput, description: string): Promise<Memory> {
    const startTime = Date.now();
    this.metrics.recordCreated();

    this.validator.validateInput(input);

    const memory = this.factory.createFromInput(input, description);
    this.index.index(memory);
    this.metrics.recordCategory(memory.identity.category);
    this.metrics.recordStage(memory.stage);
    this.metrics.recordStrength(memory.strength);
    this.metrics.recordConfidence(memory.confidence);

    await this.emitEvent(MEMORY_EVENTS.OPERATION_CREATED, {
      memoryId: memory.id,
      name: memory.identity.name,
      category: memory.identity.category,
      stage: "WORKING",
      strength: memory.strength,
      confidence: memory.confidence,
      recallScore: memory.recallScore,
      operation: "CREATE",
      timestamp: new Date().toISOString(),
    });

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog("MemoryEngine", "createMemory", {
        memoryId: memory.id,
        evidenceId: input.evidenceId,
        patternId: input.patternId,
        category: input.category,
        durationMs: Date.now() - startTime,
      });
    }

    return memory;
  }

  async consolidateMemory(memory: Memory): Promise<Memory> {
    const result = this.consolidation.evaluateConsolidation(memory);
    if (!result.consolidated) return memory;

    this.lifecycle.validateTransition(memory.stage, result.targetStage);
    this.metrics.recordConsolidated();
    this.metrics.recordStage(result.targetStage);

    const qualityResult = this.quality.evaluate(result.memory);
    const newConfidence = this.confidence.compute(result.memory, qualityResult.profile);
    const scoreResult = this.scoring.evaluate(result.memory);

    const updated = this.factory.cloneWithTransition(
      result.memory,
      result.targetStage,
      {
        qualityProfile: qualityResult.profile,
        confidence: newConfidence,
        recallScore: scoreResult.retentionScore,
        activationScore: scoreResult.activationScore,
        retentionScore: scoreResult.retentionScore,
      }
    );

    this.metrics.recordConfidence(newConfidence);
    this.index.index(updated);

    await this.emitLifecycleEvent(updated);

    if (this.auditPipeline) {
      await this.auditPipeline.recordStateChange("MemoryEngine", memory.stage, result.targetStage);
    }

    return updated;
  }

  async strengthenMemory(memory: Memory, amount: number): Promise<Memory> {
    const strengthened = this.strength.strengthen(memory, amount);
    const retentionApplied = this.retention.applyStrengthen(strengthened, amount);

    this.metrics.recordStrength(retentionApplied.strength);

    await this.emitEvent(MEMORY_EVENTS.OPERATION_STRENGTHENED, {
      memoryId: memory.id,
      name: memory.identity.name,
      category: memory.identity.category,
      stage: memory.stage,
      strength: retentionApplied.strength,
      confidence: retentionApplied.confidence,
      recallScore: retentionApplied.recallScore,
      operation: "STRENGTHEN",
      timestamp: new Date().toISOString(),
    });

    return retentionApplied;
  }

  async weakenMemory(memory: Memory, amount: number): Promise<Memory> {
    const weakened = this.strength.weaken(memory, amount);
    const retentionApplied = this.retention.applyWeaken(weakened, amount);

    this.metrics.recordStrength(retentionApplied.strength);

    await this.emitEvent(MEMORY_EVENTS.OPERATION_WEAKENED, {
      memoryId: memory.id,
      name: memory.identity.name,
      category: memory.identity.category,
      stage: memory.stage,
      strength: retentionApplied.strength,
      confidence: retentionApplied.confidence,
      recallScore: retentionApplied.recallScore,
      operation: "WEAKEN",
      timestamp: new Date().toISOString(),
    });

    return retentionApplied;
  }

  async forgetMemory(memory: Memory): Promise<Memory> {
    const forgotten = this.forgetting.forget(memory);
    this.index.index(forgotten);
    this.metrics.recordForgotten();

    await this.emitEvent(MEMORY_EVENTS.OPERATION_FORGOTTEN, {
      memoryId: memory.id,
      name: memory.identity.name,
      category: memory.identity.category,
      stage: "HISTORICAL",
      strength: forgotten.strength,
      confidence: forgotten.confidence,
      recallScore: forgotten.recallScore,
      operation: "FORGET",
      timestamp: new Date().toISOString(),
    });

    return forgotten;
  }

  async archiveMemory(memory: Memory): Promise<Memory> {
    const archived = this.forgetting.archive(memory);
    this.index.index(archived);
    this.metrics.recordArchived();

    await this.emitLifecycleEvent(archived);

    return archived;
  }

  async reactivateMemory(memory: Memory): Promise<Memory> {
    const reactivated = this.forgetting.reactivate(memory);
    this.index.index(reactivated);
    this.metrics.recordReactivation();

    await this.emitEvent(MEMORY_EVENTS.OPERATION_REACTIVATED, {
      memoryId: memory.id,
      name: memory.identity.name,
      category: memory.identity.category,
      stage: "SHORT_TERM",
      strength: reactivated.strength,
      confidence: reactivated.confidence,
      recallScore: reactivated.recallScore,
      operation: "REACTIVATE",
      timestamp: new Date().toISOString(),
    });

    return reactivated;
  }

  async compressMemory(memory: Memory): Promise<{ memory: Memory; stats: import("./MemoryTypes").MemoryCompressionStats }> {
    const result = this.compression.compress(memory);
    this.index.index(result.memory);
    this.metrics.recordCompression();

    await this.emitEvent(MEMORY_EVENTS.OPERATION_COMPRESSED, {
      memoryId: memory.id,
      name: memory.identity.name,
      category: memory.identity.category,
      stage: memory.stage,
      strength: result.memory.strength,
      confidence: result.memory.confidence,
      recallScore: result.memory.recallScore,
      operation: "COMPRESS",
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  async mergeMemories(memories: Memory[]): Promise<Memory> {
    const merged = this.consolidation.merge(memories);
    this.index.index(merged);
    this.metrics.recordMerge();

    for (const m of memories) {
      if (m.id !== merged.id) {
        this.index.remove(m.id);
      }
    }

    await this.emitEvent(MEMORY_EVENTS.OPERATION_MERGED, {
      memoryId: merged.id,
      name: merged.identity.name,
      category: merged.identity.category,
      stage: merged.stage,
      strength: merged.strength,
      confidence: merged.confidence,
      recallScore: merged.recallScore,
      operation: "MERGE",
      timestamp: new Date().toISOString(),
    });

    return merged;
  }

  async associateMemories(source: Memory, target: Memory, associationType: import("./MemoryTypes").AssociationType, strength: number): Promise<Memory> {
    const updated = this.associations.associate(source, target, associationType, strength);
    this.index.index(updated);
    this.metrics.recordAssociations(updated.associations.length);

    await this.emitEvent(MEMORY_EVENTS.OPERATION_ASSOCIATED, {
      memoryId: source.id,
      name: source.identity.name,
      category: source.identity.category,
      stage: source.stage,
      strength: updated.strength,
      confidence: updated.confidence,
      recallScore: updated.recallScore,
      operation: "ASSOCIATE",
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async detachMemory(source: Memory, targetId: string): Promise<Memory> {
    const updated = this.associations.detach(source, targetId);
    this.index.index(updated);

    await this.emitEvent(MEMORY_EVENTS.OPERATION_DETACHED, {
      memoryId: source.id,
      name: source.identity.name,
      category: source.identity.category,
      stage: source.stage,
      strength: updated.strength,
      confidence: updated.confidence,
      recallScore: updated.recallScore,
      operation: "DETACH",
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async tickDecay(memory: Memory): Promise<Memory> {
    const decayed = this.activation.decayActivation(memory);
    const retentionApplied = this.retention.applyDecay(decayed);

    if (this.forgetting.shouldForget(retentionApplied)) {
      return this.forgetMemory(retentionApplied);
    }

    return retentionApplied;
  }

  async processCycle(): Promise<void> {
    const allMemories = this.index.getAll();

    for (const memory of allMemories) {
      if (this.lifecycle.isTerminal(memory.stage)) continue;

      const decayed = await this.tickDecay(memory);
      this.index.index(decayed);

      const consolidationResult = this.consolidation.evaluateConsolidation(decayed);
      if (consolidationResult.consolidated) {
        await this.consolidateMemory(decayed);
      }
    }
  }

  getMetrics(): ReturnType<MemoryMetrics["getSnapshot"]> {
    return this.metrics.getSnapshot();
  }

  private async emitEvent(
    eventName: string,
    payload: import("./MemoryTypes").MemoryEventPayload
  ): Promise<void> {
    if (!this.eventBus) return;
    try {
      await this.eventBus.emit(eventName, payload as unknown as Record<string, unknown>);
    } catch {
      // swallow emit errors
    }
  }

  private async emitLifecycleEvent(memory: Memory): Promise<void> {
    const eventName = getMemoryLifecycleEventName(memory.stage);
    if (!eventName) return;

    await this.emitEvent(eventName, {
      memoryId: memory.id,
      name: memory.identity.name,
      category: memory.identity.category,
      stage: memory.stage,
      strength: memory.strength,
      confidence: memory.confidence,
      recallScore: memory.recallScore,
      operation: memory.stage === "ARCHIVED" ? "ARCHIVE" : "CONSOLIDATE",
      timestamp: new Date().toISOString(),
    });
  }
}
