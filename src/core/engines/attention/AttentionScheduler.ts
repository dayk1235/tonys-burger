import { Attention, AttentionStage } from "./AttentionTypes";
import { AttentionQueue } from "./AttentionQueue";
import { AttentionFocus } from "./AttentionFocus";
import { AttentionScoring } from "./AttentionScoring";

export interface SchedulerResult {
  readonly toFocus: Attention | undefined;
  readonly toMaintain: Attention | undefined;
  readonly toDefocus: Attention | undefined;
  readonly toDefer: Attention[];
  readonly toRelease: Attention[];
  readonly toReevaluate: Attention[];
  readonly aged: Attention[];
  readonly decayed: Attention[];
}

export class AttentionScheduler {
  private reevaluationIntervalMs = 5000;
  private decayRate = 0.02;
  private maxAge = 100;
  private lastReevaluation: Map<string, number> = new Map();
  private scoring: AttentionScoring;

  constructor() {
    this.scoring = new AttentionScoring();
  }

  schedule(
    queue: AttentionQueue,
    focus: AttentionFocus,
    focusedItem: Attention | undefined,
    maintainedItems: Attention[],
    deferredItems: Attention[],
    now: number
  ): SchedulerResult {
    const allItems = [
      ...queue.getAll(),
      ...(focusedItem ? [focusedItem] : []),
      ...maintainedItems,
      ...deferredItems,
    ].filter((item, index, self) => self.findIndex((i) => i.id === item.id) === index);

    const toRelease: Attention[] = [];
    const toDefer: Attention[] = [];
    const toReevaluate: Attention[] = [];
    const aged: Attention[] = [];
    const decayed: Attention[] = [];

    const focusState = focus.getState();

    for (const item of allItems) {
      const itemAge = item.age + 1;

      if (itemAge >= this.maxAge) {
        toRelease.push(item);
        aged.push(item);
        continue;
      }

      const lastReeval = this.lastReevaluation.get(item.id) || 0;
      if (now - lastReeval >= this.reevaluationIntervalMs) {
        toReevaluate.push(item);
      }

      if (item.metadata.decayCycles > 0) {
        decayed.push(item);
      }
    }

    const toFocus = queue.peek();

    return {
      toFocus,
      toMaintain: focusState.currentId
        ? allItems.find((a) => a.id === focusState.currentId)
        : undefined,
      toDefocus: focusedItem && !toFocus ? focusedItem : undefined,
      toDefer,
      toRelease,
      toReevaluate,
      aged,
      decayed,
    };
  }

  applyDecay(attention: Attention): Attention {
    const newDecayCycles = attention.metadata.decayCycles + 1;
    const decayFactor = 1 - (newDecayCycles * this.decayRate);

    const factorUpdates = {
      uncertainty: Math.min(1, attention.priorityFactors.uncertainty + 0.02),
      novelty: Math.max(0, attention.priorityFactors.novelty - 0.01),
    };

    return {
      ...attention,
      priorityFactors: {
        ...attention.priorityFactors,
        ...factorUpdates,
      },
      priority: Math.max(0, attention.priority * Math.max(0.3, decayFactor)),
      age: attention.age + 1,
      metadata: {
        ...attention.metadata,
        decayCycles: newDecayCycles,
      },
    };
  }

  applyStarvationBoost(attention: Attention, boostAmount: number): Attention {
    const newBoostCount = attention.metadata.starveBoostCount + 1;
    const boost = Math.min(0.3, boostAmount * newBoostCount);

    return {
      ...attention,
      priority: Math.min(1, attention.priority + boost),
      metadata: {
        ...attention.metadata,
        starveBoostCount: newBoostCount,
      },
    };
  }

  resetDecay(attention: Attention): Attention {
    return {
      ...attention,
      metadata: {
        ...attention.metadata,
        decayCycles: 0,
      },
    };
  }

  setReevaluationInterval(ms: number): void {
    this.reevaluationIntervalMs = Math.max(1000, ms);
  }

  setDecayRate(rate: number): void {
    this.decayRate = Math.max(0.001, Math.min(0.1, rate));
  }

  setMaxAge(age: number): void {
    this.maxAge = Math.max(10, age);
  }

  recordReevaluation(attentionId: string): void {
    this.lastReevaluation.set(attentionId, Date.now());
  }
}
