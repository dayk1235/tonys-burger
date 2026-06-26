import {
  Attention,
  AttentionInterruption,
  EscalationLevel,
  SourceType,
} from "./AttentionTypes";
import { AttentionInterruptionError } from "./AttentionErrors";

export interface InterruptionResult {
  readonly interruption: AttentionInterruption;
  readonly accepted: boolean;
  readonly preemptedId: string | null;
  readonly escalation: EscalationLevel;
}

export interface EscalationResult {
  readonly attentionId: string;
  readonly from: EscalationLevel;
  readonly to: EscalationLevel;
  readonly escalated: boolean;
}

export class AttentionInterruptions {
  private activeInterruptions: Map<string, AttentionInterruption> = new Map();
  private escalationLadder: EscalationLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  private static interruptionCounter = 0;

  createInterruption(
    sourceId: string,
    sourceType: SourceType,
    priority: number,
    reason: string,
    requiresImmediateAction: boolean
  ): AttentionInterruption {
    const level = this.computeEscalationLevel(priority);

    const interruption: AttentionInterruption = {
      id: `int_${Date.now()}_${++AttentionInterruptions.interruptionCounter}`,
      sourceId,
      sourceType,
      level,
      priority,
      reason,
      timestamp: new Date().toISOString(),
      requiresImmediateAction,
    };

    return interruption;
  }

  evaluate(attention: Attention, interruption: AttentionInterruption): InterruptionResult {
    const preemptedId = attention.stage === "FOCUSED" || attention.stage === "MAINTAINED"
      ? attention.id
      : null;

    const shouldInterrupt = this.shouldInterrupt(attention, interruption);

    if (shouldInterrupt) {
      this.activeInterruptions.set(interruption.id, interruption);
    }

    return {
      interruption,
      accepted: shouldInterrupt,
      preemptedId,
      escalation: shouldInterrupt ? interruption.level : "NONE",
    };
  }

  escalate(attention: Attention): EscalationResult {
    const currentLevel = attention.escalationLevel;
    const currentIndex = this.escalationLadder.indexOf(currentLevel);
    const nextIndex = Math.min(currentIndex + 1, this.escalationLadder.length - 1);
    const nextLevel = this.escalationLadder[nextIndex];

    if (nextLevel === currentLevel || currentLevel === "CRITICAL") {
      return {
        attentionId: attention.id,
        from: currentLevel,
        to: currentLevel,
        escalated: false,
      };
    }

    return {
      attentionId: attention.id,
      from: currentLevel,
      to: nextLevel,
      escalated: true,
    };
  }

  resolve(interruptionId: string): void {
    this.activeInterruptions.delete(interruptionId);
  }

  getActiveInterruptions(): AttentionInterruption[] {
    return Array.from(this.activeInterruptions.values());
  }

  getHighestPriorityInterruption(): AttentionInterruption | undefined {
    const active = this.getActiveInterruptions();
    if (active.length === 0) return undefined;
    active.sort((a, b) => b.priority - a.priority);
    return active[0];
  }

  clear(): void {
    this.activeInterruptions.clear();
  }

  private shouldInterrupt(attention: Attention, interruption: AttentionInterruption): boolean {
    if (interruption.requiresImmediateAction) return true;

    const attentionPriority = attention.priority;
    const interruptionPriority = interruption.priority;

    const priorityThreshold = 0.1;
    return interruptionPriority > attentionPriority + priorityThreshold;
  }

  private computeEscalationLevel(priority: number): EscalationLevel {
    if (priority >= 0.9) return "CRITICAL";
    if (priority >= 0.7) return "HIGH";
    if (priority >= 0.5) return "MEDIUM";
    if (priority >= 0.3) return "LOW";
    return "NONE";
  }
}
