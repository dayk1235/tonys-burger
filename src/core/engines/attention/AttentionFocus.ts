import { Attention, FocusState, AttentionStage } from "./AttentionTypes";

export interface FocusResult {
  readonly attentionId: string;
  readonly state: FocusState;
  readonly switched: boolean;
  readonly previousId: string | null;
}

export class AttentionFocus {
  private currentFocus: FocusState = {
    currentId: null,
    startedAt: null,
    duration: 0,
    persistenceScore: 1,
    contextSession: "",
    reFocusCount: 0,
  };

  private persistenceThreshold = 0.6;
  private maxFocusDuration = 30000;

  getState(): FocusState {
    return { ...this.currentFocus };
  }

  focus(attention: Attention, contextSession: string): FocusResult {
    const now = new Date().toISOString();
    const previousId = this.currentFocus.currentId;
    const switched = previousId !== null && previousId !== attention.id;

    if (switched) {
      this.currentFocus = {
        currentId: attention.id,
        startedAt: now,
        duration: 0,
        persistenceScore: this.computePersistenceScore(attention),
        contextSession,
        reFocusCount: attention.timesRefocused,
      };
    } else {
      this.currentFocus = {
        ...this.currentFocus,
        currentId: attention.id,
        startedAt: this.currentFocus.startedAt || now,
        persistenceScore: this.computePersistenceScore(attention),
        contextSession,
      };
    }

    return {
      attentionId: attention.id,
      state: { ...this.currentFocus },
      switched,
      previousId,
    };
  }

  defocus(): FocusResult {
    const previousId = this.currentFocus.currentId;
    this.currentFocus = {
      currentId: null,
      startedAt: null,
      duration: 0,
      persistenceScore: 1,
      contextSession: "",
      reFocusCount: 0,
    };

    return {
      attentionId: previousId ?? "",
      state: { ...this.currentFocus },
      switched: previousId !== null,
      previousId,
    };
  }

  shouldMaintain(attention: Attention): boolean {
    return this.currentFocus.currentId === attention.id &&
      this.currentFocus.persistenceScore >= this.persistenceThreshold;
  }

  shouldRelease(attention: Attention, elapsedMs: number): boolean {
    if (this.currentFocus.currentId !== attention.id) return false;
    if (elapsedMs >= this.maxFocusDuration) return true;
    if (attention.stage === "RELEASED") return true;
    return false;
  }

  computePersistenceScore(attention: Attention): number {
    const priorityScore = attention.priority;
    const importanceScore = attention.priorityFactors.importance;
    const urgencyScore = attention.priorityFactors.urgency;
    const riskScore = attention.priorityFactors.risk;

    return Math.min(1, priorityScore * 0.3 + importanceScore * 0.25 + urgencyScore * 0.25 + riskScore * 0.2);
  }

  updateDuration(elapsedMs: number): void {
    if (this.currentFocus.currentId) {
      this.currentFocus.duration += elapsedMs;
    }
  }

  shouldContextSwitch(currentSession: string, incomingSession: string): boolean {
    if (currentSession === incomingSession) return false;
    return this.currentFocus.persistenceScore < 0.5;
  }

  setPersistenceThreshold(threshold: number): void {
    this.persistenceThreshold = Math.max(0.1, Math.min(0.9, threshold));
  }

  setMaxFocusDuration(ms: number): void {
    this.maxFocusDuration = Math.max(1000, ms);
  }
}
