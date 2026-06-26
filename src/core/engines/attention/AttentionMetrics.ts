import { AttentionEngineMetrics } from "./AttentionContracts";

export class AttentionMetrics implements AttentionEngineMetrics {
  totalAttentionCreated = 0;
  focusedCount = 0;
  maintainedCount = 0;
  interruptedCount = 0;
  deferredCount = 0;
  releasedCount = 0;
  archivedCount = 0;
  activeAttentionCount = 0;
  averagePriority = 0;
  averageAllocation = 0;
  averageAge = 0;
  attentionByCategory: Record<string, number> = {};
  attentionByStage: Record<string, number> = {};
  totalInterruptions = 0;
  totalEscalations = 0;
  totalStarvationBoosts = 0;
  totalContextSwitches = 0;
  budgetUtilization = 0;
  budgetTotal = 1.0;
  budgetAvailable = 1.0;

  private prioritySum = 0;
  private allocationSum = 0;
  private ageSum = 0;
  private totalCount = 0;

  recordCreated(): void {
    this.totalAttentionCreated++;
    this.activeAttentionCount++;
  }

  recordFocused(): void {
    this.focusedCount++;
  }

  recordMaintained(): void {
    this.maintainedCount++;
  }

  recordInterrupted(): void {
    this.interruptedCount++;
    this.totalInterruptions++;
  }

  recordDeferred(): void {
    this.deferredCount++;
  }

  recordReleased(): void {
    this.releasedCount++;
    this.activeAttentionCount = Math.max(0, this.activeAttentionCount - 1);
  }

  recordArchived(): void {
    this.archivedCount++;
    this.activeAttentionCount = Math.max(0, this.activeAttentionCount - 1);
  }

  recordCategory(category: string): void {
    this.attentionByCategory[category] = (this.attentionByCategory[category] || 0) + 1;
  }

  recordStage(stage: string): void {
    this.attentionByStage[stage] = (this.attentionByStage[stage] || 0) + 1;
  }

  recordPriority(priority: number): void {
    this.prioritySum += priority;
    this.totalCount++;
    this.averagePriority = this.prioritySum / this.totalCount;
  }

  recordAllocation(allocation: number): void {
    this.allocationSum += allocation;
    this.averageAllocation = this.allocationSum / this.totalCount;
  }

  recordAge(age: number): void {
    this.ageSum += age;
    this.averageAge = this.ageSum / this.totalCount;
  }

  recordEscalation(): void {
    this.totalEscalations++;
  }

  recordStarvationBoost(): void {
    this.totalStarvationBoosts++;
  }

  recordContextSwitch(): void {
    this.totalContextSwitches++;
  }

  updateBudget(total: number, available: number): void {
    this.budgetTotal = total;
    this.budgetAvailable = available;
    this.budgetUtilization = total > 0 ? (total - available) / total : 0;
  }

  getSnapshot(): AttentionEngineMetrics {
    return {
      totalAttentionCreated: this.totalAttentionCreated,
      focusedCount: this.focusedCount,
      maintainedCount: this.maintainedCount,
      interruptedCount: this.interruptedCount,
      deferredCount: this.deferredCount,
      releasedCount: this.releasedCount,
      archivedCount: this.archivedCount,
      activeAttentionCount: this.activeAttentionCount,
      averagePriority: this.averagePriority,
      averageAllocation: this.averageAllocation,
      averageAge: this.averageAge,
      attentionByCategory: { ...this.attentionByCategory },
      attentionByStage: { ...this.attentionByStage },
      totalInterruptions: this.totalInterruptions,
      totalEscalations: this.totalEscalations,
      totalStarvationBoosts: this.totalStarvationBoosts,
      totalContextSwitches: this.totalContextSwitches,
      budgetUtilization: this.budgetUtilization,
      budgetTotal: this.budgetTotal,
      budgetAvailable: this.budgetAvailable,
    };
  }

  reset(): void {
    this.totalAttentionCreated = 0;
    this.focusedCount = 0;
    this.maintainedCount = 0;
    this.interruptedCount = 0;
    this.deferredCount = 0;
    this.releasedCount = 0;
    this.archivedCount = 0;
    this.activeAttentionCount = 0;
    this.averagePriority = 0;
    this.averageAllocation = 0;
    this.averageAge = 0;
    this.attentionByCategory = {};
    this.attentionByStage = {};
    this.totalInterruptions = 0;
    this.totalEscalations = 0;
    this.totalStarvationBoosts = 0;
    this.totalContextSwitches = 0;
    this.budgetUtilization = 0;
    this.budgetTotal = 1.0;
    this.budgetAvailable = 1.0;
    this.prioritySum = 0;
    this.allocationSum = 0;
    this.ageSum = 0;
    this.totalCount = 0;
  }
}
