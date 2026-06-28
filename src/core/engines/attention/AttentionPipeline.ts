import {
  Attention,
  AttentionStage,
  AttentionInput,
  AttentionOperation,
  AttentionOperationResult,
  AttentionPriorityFactors,
  EscalationLevel,
  SourceType,
  ContextSnapshot,
} from "./AttentionTypes";
import { RuntimeEventBus, AuditPipeline, RecoveryPipeline } from "../observation/ObservationContracts";
import { ATTENTION_EVENTS, getAttentionLifecycleEventName } from "./AttentionEvents";

import { AttentionFactory } from "./AttentionFactory";
import { AttentionValidator } from "./AttentionValidator";
import { AttentionLifecycle } from "./AttentionLifecycle";
import { AttentionQuality } from "./AttentionQuality";
import { AttentionConfidence } from "./AttentionConfidence";
import { AttentionScoring } from "./AttentionScoring";
import { AttentionPriority } from "./AttentionPriority";
import { AttentionFocus } from "./AttentionFocus";
import { AttentionCompetition } from "./AttentionCompetition";
import { AttentionAllocation } from "./AttentionAllocation";
import { AttentionContext } from "./AttentionContext";
import { AttentionGoals } from "./AttentionGoals";
import { AttentionUrgency } from "./AttentionUrgency";
import { AttentionRisk } from "./AttentionRisk";
import { AttentionOpportunity } from "./AttentionOpportunity";
import { AttentionInterruptions } from "./AttentionInterruptions";
import { AttentionPolicyEngine } from "./AttentionPolicies";
import { AttentionMetrics } from "./AttentionMetrics";
import { AttentionMemory } from "./AttentionMemory";
import { AttentionQueue } from "./AttentionQueue";
import { AttentionScheduler } from "./AttentionScheduler";

export class AttentionPipeline {
  readonly factory: AttentionFactory;
  readonly validator: AttentionValidator;
  readonly lifecycle: AttentionLifecycle;
  readonly quality: AttentionQuality;
  readonly confidence: AttentionConfidence;
  readonly scoring: AttentionScoring;
  readonly priority: AttentionPriority;
  readonly focus: AttentionFocus;
  readonly competition: AttentionCompetition;
  readonly allocation: AttentionAllocation;
  readonly context: AttentionContext;
  readonly goals: AttentionGoals;
  readonly urgency: AttentionUrgency;
  readonly risk: AttentionRisk;
  readonly opportunity: AttentionOpportunity;
  readonly interruptions: AttentionInterruptions;
  readonly policyEngine: AttentionPolicyEngine;
  readonly metrics: AttentionMetrics;
  readonly memory: AttentionMemory;
  readonly queue: AttentionQueue;
  readonly scheduler: AttentionScheduler;

  constructor(
    private readonly eventBus?: RuntimeEventBus,
    private readonly auditPipeline?: AuditPipeline,
    private readonly recoveryPipeline?: RecoveryPipeline
  ) {
    this.factory = new AttentionFactory();
    this.validator = new AttentionValidator();
    this.lifecycle = new AttentionLifecycle();
    this.quality = new AttentionQuality();
    this.confidence = new AttentionConfidence();
    this.scoring = new AttentionScoring();
    this.priority = new AttentionPriority();
    this.focus = new AttentionFocus();
    this.competition = new AttentionCompetition();
    this.allocation = new AttentionAllocation();
    this.context = new AttentionContext();
    this.goals = new AttentionGoals();
    this.urgency = new AttentionUrgency();
    this.risk = new AttentionRisk();
    this.opportunity = new AttentionOpportunity();
    this.interruptions = new AttentionInterruptions();
    this.policyEngine = new AttentionPolicyEngine();
    this.metrics = new AttentionMetrics();
    this.memory = new AttentionMemory();
    this.queue = new AttentionQueue();
    this.scheduler = new AttentionScheduler();
  }

  async createAttention(input: AttentionInput): Promise<Attention> {
    this.validator.validateInput(input);

    const attention = this.factory.createFromInput(input);
    this.memory.store(attention);
    this.metrics.recordCreated();
    this.metrics.recordCategory(attention.identity.category);
    this.metrics.recordStage(attention.stage);

    const observed = this.factory.cloneWithTransition(attention, "OBSERVED");

    const priorityResult = this.priority.compute(observed);
    const scoringResult = this.scoring.evaluate(observed);
    const qualityResult = this.quality.evaluate(observed);
    const confidenceValue = this.confidence.compute(observed, qualityResult.profile);
    const urgencyResult = this.urgency.evaluate(
      observed.priorityFactors.urgency,
      observed.priorityFactors.importance,
      observed.priorityFactors.risk,
      observed.priorityFactors.temporalPressure,
      observed.priorityFactors.businessValue,
      observed.priorityFactors.humanValue
    );
    const riskResult = this.risk.evaluate(
      observed.priorityFactors.risk,
      observed.priorityFactors.urgency,
      observed.priorityFactors.importance,
      observed.priorityFactors.uncertainty
    );
    const opportunityResult = this.opportunity.evaluate(
      observed.priorityFactors.opportunity,
      observed.priorityFactors.businessValue,
      observed.priorityFactors.humanValue,
      observed.priorityFactors.novelty,
      observed.priorityFactors.temporalPressure
    );
    const contextResult = this.context.computeRelevance(
      observed.identity.sourceType,
      observed.identity.category,
      observed.priorityFactors.urgency,
      observed.priorityFactors.importance
    );
    const goalResult = this.goals.computeAlignment(
      observed.identity.sourceType,
      observed.identity.category,
      observed.priorityFactors.urgency,
      observed.priorityFactors.importance
    );

    const scored = this.factory.cloneWithTransition(observed, "SCORED", {
      priority: priorityResult.priority,
      priorityFactors: priorityResult.factors as unknown as AttentionPriorityFactors,
      scoringFactors: scoringResult,
      qualityProfile: qualityResult.profile,
    });

    this.memory.store(scored);
    this.metrics.recordPriority(scored.priority);
    this.metrics.recordStage(scored.stage);

    const queueAllocation = Math.min(priorityResult.priority, this.allocation.getBudget().maxPerItem);
    const budgetResult = this.allocation.allocate(scored, queueAllocation);

    const queued = this.factory.cloneWithTransition(scored, "QUEUED", {
      allocation: budgetResult.allocation,
      budgetConsumption: budgetResult.budgetConsumption,
      priorityFactors: {
        ...scored.priorityFactors,
        contextRelevance: contextResult.relevance,
        goalAlignment: goalResult.alignmentScore,
      } as AttentionPriorityFactors,
    });

    this.memory.store(queued);
    this.metrics.recordStage(queued.stage);
    this.metrics.recordAllocation(queued.allocation);
    this.metrics.updateBudget(this.allocation.getBudget().total, this.allocation.getBudget().available);

    this.queue.enqueue(queued);

    await this.emitEvent(ATTENTION_EVENTS.OPERATION_PRIORITIZED, {
      attention: { ...queued },
      operation: "PRIORITIZE",
      timestamp: new Date().toISOString(),
      version: queued.versions.length,
    });

    if (this.auditPipeline) {
      await this.auditPipeline.recordLog("AttentionEngine", "createAttention", {
        attentionId: queued.id,
        sourceId: input.sourceId,
        sourceType: input.sourceType,
        category: input.category,
        priority: queued.priority,
        allocation: queued.allocation,
      });
    }

    return queued;
  }

  async tick(now: number = Date.now()): Promise<AttentionOperationResult> {
    const focusState = this.focus.getState();
    const focusedItem = focusState.currentId ? this.memory.retrieve(focusState.currentId) : undefined;
    const maintainedItems = this.memory.findByStage("MAINTAINED");
    const deferredItems = this.memory.findByStage("DEFERRED");

    const schedulerResult = this.scheduler.schedule(
      this.queue, this.focus, focusedItem, maintainedItems, deferredItems, now
    );

    for (const item of schedulerResult.toRelease) {
      await this.releaseAttention(item);
    }

    for (const item of schedulerResult.toReevaluate) {
      await this.reevaluate(item);
    }

    if (schedulerResult.decayed) {
      for (const item of schedulerResult.decayed) {
        const decayed = this.scheduler.applyDecay(item);
        this.memory.store(decayed);
      }
    }

    const interruption = this.interruptions.getHighestPriorityInterruption();
    if (interruption && focusedItem) {
      const evalResult = this.interruptions.evaluate(focusedItem, interruption);
      if (evalResult.accepted) {
        await this.interruptAttention(focusedItem, interruption.level);
        this.interruptions.resolve(interruption.id);
      }
    }

    const topCandidate = schedulerResult.toFocus;
    if (topCandidate && focusState.currentId !== topCandidate.id) {
      await this.focusOn(topCandidate);
    }

    return {
      success: true,
      attentionId: focusedItem?.id ?? "",
      operation: "FOCUS",
      timestamp: new Date().toISOString(),
      details: `Attention cycle completed: ${this.queue.size()} queued, ${this.memory.findActive().length} active`,
      metadata: {
        focusedId: focusState.currentId,
        queueSize: this.queue.size(),
        budgetUtilization: this.allocation.getUtilization(),
      },
    };
  }

  async focusOn(attention: Attention): Promise<Attention> {
    this.lifecycle.validateTransition(attention.stage, "FOCUSED");

    this.queue.remove(attention.id);

    const focusResult = this.focus.focus(attention, this.context.getCurrentContext().environment);
    this.metrics.recordFocused();
    this.competition.recordActivation(attention.id);

    if (focusResult.switched) {
      this.metrics.recordContextSwitch();
    }

    const updated = this.factory.cloneWithTransition(attention, "FOCUSED", {
      timesRefocused: focusResult.state.reFocusCount,
    });

    this.memory.store(updated);
    this.metrics.recordStage(updated.stage);

    await this.emitEvent(ATTENTION_EVENTS.OPERATION_FOCUSED, {
      attentionId: updated.id,
      name: updated.identity.name,
      category: updated.identity.category,
      stage: "FOCUSED",
      priority: updated.priority,
      allocation: updated.allocation,
      operation: "FOCUS",
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async defocus(): Promise<void> {
    const focusState = this.focus.getState();
    if (!focusState.currentId) return;

    const focusedItem = this.memory.retrieve(focusState.currentId);
    if (!focusedItem) return;

    this.focus.defocus();

    const released = this.factory.cloneWithTransition(focusedItem, "RELEASED");
    this.memory.store(released);
    this.allocation.release(released);
    this.metrics.recordReleased();
    this.metrics.recordStage(released.stage);

    this.metrics.updateBudget(this.allocation.getBudget().total, this.allocation.getBudget().available);

    await this.emitEvent(ATTENTION_EVENTS.OPERATION_DEFOCUSED, {
      attentionId: released.id,
      name: released.identity.name,
      category: released.identity.category,
      stage: "RELEASED",
      priority: released.priority,
      allocation: 0,
      operation: "DEFOCUS",
      timestamp: new Date().toISOString(),
    });
  }

  async interruptAttention(attention: Attention, level: EscalationLevel): Promise<Attention> {
    this.lifecycle.validateTransition(attention.stage, "INTERRUPTED");

    this.focus.defocus();
    this.metrics.recordInterrupted();
    this.metrics.recordEscalation();

    if (level !== "NONE") {
      const escalationResult = this.interruptions.escalate(attention);
      if (escalationResult.escalated) {
        this.metrics.recordEscalation();
      }
    }

    const updated = this.factory.cloneWithTransition(attention, "INTERRUPTED", {
      timesInterrupted: attention.timesInterrupted + 1,
      escalationLevel: this.interruptions.escalate(attention).to,
      allocation: 0,
    });

    this.allocation.release(updated);
    this.memory.store(updated);
    this.metrics.recordStage(updated.stage);
    this.metrics.updateBudget(this.allocation.getBudget().total, this.allocation.getBudget().available);

    await this.emitEvent(ATTENTION_EVENTS.OPERATION_INTERRUPTED, {
      attentionId: updated.id,
      name: updated.identity.name,
      category: updated.identity.category,
      stage: "INTERRUPTED",
      priority: updated.priority,
      allocation: 0,
      operation: "INTERRUPT",
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async deferAttention(attention: Attention): Promise<Attention> {
    this.lifecycle.validateTransition(attention.stage, "DEFERRED");

    this.queue.remove(attention.id);

    const updated = this.factory.cloneWithTransition(attention, "DEFERRED", {
      allocation: 0,
    });

    this.allocation.release(updated);
    this.memory.store(updated);
    this.metrics.recordDeferred();
    this.metrics.recordStage(updated.stage);
    this.metrics.updateBudget(this.allocation.getBudget().total, this.allocation.getBudget().available);

    await this.emitEvent(ATTENTION_EVENTS.LIFECYCLE_DEFERRED, {
      attentionId: updated.id,
      name: updated.identity.name,
      category: updated.identity.category,
      stage: "DEFERRED",
      priority: updated.priority,
      allocation: 0,
      operation: "SUSPEND",
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async releaseAttention(attention: Attention): Promise<Attention> {
    this.lifecycle.validateTransition(attention.stage, "RELEASED");

    this.queue.remove(attention.id);

    const updated = this.factory.cloneWithTransition(attention, "RELEASED", {
      allocation: 0,
    });

    this.allocation.release(updated);
    this.memory.store(updated);
    this.metrics.recordReleased();
    this.metrics.recordAge(updated.age);
    this.metrics.recordStage(updated.stage);
    this.metrics.updateBudget(this.allocation.getBudget().total, this.allocation.getBudget().available);

    await this.emitEvent(ATTENTION_EVENTS.OPERATION_RELEASED, {
      attentionId: updated.id,
      name: updated.identity.name,
      category: updated.identity.category,
      stage: "RELEASED",
      priority: updated.priority,
      allocation: 0,
      operation: "RELEASE",
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async archiveAttention(attention: Attention): Promise<Attention> {
    this.lifecycle.validateTransition(attention.stage, "ARCHIVED");

    this.queue.remove(attention.id);

    const updated = this.factory.cloneWithTransition(attention, "ARCHIVED", {
      allocation: 0,
    });

    this.allocation.release(updated);
    this.memory.store(updated);
    this.metrics.recordArchived();
    this.metrics.recordStage(updated.stage);
    this.metrics.updateBudget(this.allocation.getBudget().total, this.allocation.getBudget().available);

    await this.emitLifecycleEvent(updated);

    return updated;
  }

  async reevaluate(attention: Attention): Promise<Attention> {
    this.scheduler.recordReevaluation(attention.id);

    const priorityResult = this.priority.recomputeForQueued(attention, attention.age * 1000);
    const scoringResult = this.scoring.evaluate(attention);
    const qualityResult = this.quality.evaluate(attention);

    const updated = this.factory.cloneWithTransition(attention, attention.stage, {
      priority: priorityResult.priority,
      priorityFactors: priorityResult.factors as unknown as AttentionPriorityFactors,
      scoringFactors: scoringResult,
      qualityProfile: qualityResult.profile,
    });

    this.memory.store(updated);
    this.metrics.recordPriority(updated.priority);

    if (updated.stage === "QUEUED") {
      this.queue.reorder();
    }

    return updated;
  }

  submitInterruption(
    sourceId: string,
    sourceType: SourceType,
    priority: number,
    reason: string,
    requiresImmediateAction: boolean
  ): void {
    const interruption = this.interruptions.createInterruption(
      sourceId, sourceType, priority, reason, requiresImmediateAction
    );
    this.interruptions.evaluate(
      this.memory.findFocused() ?? this.queue.peek() ?? this.factory.createFromInput({
        sourceId: "", sourceType: "RUNTIME_EVENT", sourceIds: [],
        name: "dummy", category: "GENERAL",
        urgency: 0, importance: 0, risk: 0, opportunity: 0,
        businessValue: 0, humanValue: 0, businessId: "",
      }),
      interruption
    );
  }

  getMetricsSnapshot() {
    return this.metrics.getSnapshot();
  }

  setContextGoal(goal: { id: string; name: string; priority: number; active: boolean; category: string }): void {
    this.goals.addGoal({ ...goal, metadata: {} });
  }

  updateContext(context: Partial<ContextSnapshot>): void {
    this.context.updateContext(context);
  }

  private async emitEvent(eventName: string, payload: Record<string, unknown>): Promise<void> {
    if (!this.eventBus) return;
    try {
      await this.eventBus.emit(eventName, payload);
    } catch {
      // swallow
    }
  }

  private async emitLifecycleEvent(attention: Attention): Promise<void> {
    const eventName = getAttentionLifecycleEventName(attention.stage);
    if (!eventName) return;
    const operation = attention.stage === "ARCHIVED" ? "ARCHIVE" : "RELEASE";
    await this.emitEvent(eventName, {
      attention: { ...attention },
      operation,
      timestamp: new Date().toISOString(),
      version: attention.versions.length,
    });
  }
}
