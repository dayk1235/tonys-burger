import { Attention, AttentionBudget } from "./AttentionTypes";
import { AttentionValidator } from "./AttentionValidator";
import { AttentionBudgetExhaustedError } from "./AttentionErrors";

export interface AllocationResult {
  readonly attentionId: string;
  readonly allocation: number;
  readonly remainingBudget: number;
  readonly budgetConsumption: number;
  readonly totalAllocated: number;
}

export class AttentionAllocation {
  private budget: AttentionBudget = {
    total: 1.0,
    allocated: 0,
    available: 1.0,
    reserved: 0.1,
    maxPerItem: 0.5,
    starvationThreshold: 0.15,
  };

  private validator: AttentionValidator;

  constructor() {
    this.validator = new AttentionValidator();
  }

  getBudget(): AttentionBudget {
    return { ...this.budget };
  }

  configure(config: Partial<AttentionBudget>): void {
    this.budget = { ...this.budget, ...config };
    this.budget.available = this.budget.total - this.budget.allocated - this.budget.reserved;
  }

  allocate(attention: Attention, requestedAllocation: number): AllocationResult {
    this.validator.validateBudget(requestedAllocation, this.budget.available, this.budget.maxPerItem);

    const allocation = Math.min(requestedAllocation, this.budget.available, this.budget.maxPerItem);
    this.budget.allocated += allocation;
    this.budget.available = this.budget.total - this.budget.allocated - this.budget.reserved;

    return {
      attentionId: attention.id,
      allocation,
      remainingBudget: this.budget.available,
      budgetConsumption: allocation / this.budget.total,
      totalAllocated: this.budget.allocated,
    };
  }

  release(attention: Attention): AllocationResult {
    const deallocation = attention.allocation;
    this.budget.allocated = Math.max(0, this.budget.allocated - deallocation);
    this.budget.available = Math.min(
      this.budget.total - this.budget.reserved,
      this.budget.available + deallocation
    );

    return {
      attentionId: attention.id,
      allocation: 0,
      remainingBudget: this.budget.available,
      budgetConsumption: attention.budgetConsumption,
      totalAllocated: this.budget.allocated,
    };
  }

  reallocate(items: Attention[]): AllocationResult[] {
    const totalPriority = items.reduce((sum, item) => sum + item.priority, 0);

    if (totalPriority === 0) {
      return items.map((item) => ({
        attentionId: item.id,
        allocation: 0,
        remainingBudget: this.budget.available,
        budgetConsumption: 0,
        totalAllocated: this.budget.allocated,
      }));
    }

    this.budget.allocated = 0;

    const results: AllocationResult[] = [];
    for (const item of items) {
      const share = item.priority / totalPriority;
      const requested = share * (this.budget.total - this.budget.reserved);
      const allocation = Math.min(requested, this.budget.maxPerItem, this.budget.available);

      this.budget.allocated += allocation;
      this.budget.available = this.budget.total - this.budget.allocated - this.budget.reserved;

      results.push({
        attentionId: item.id,
        allocation,
        remainingBudget: this.budget.available,
        budgetConsumption: this.budget.total > 0 ? allocation / this.budget.total : 0,
        totalAllocated: this.budget.allocated,
      });
    }

    return results;
  }

  hasAvailableBudget(requested: number): boolean {
    return requested <= this.budget.available;
  }

  getUtilization(): number {
    if (this.budget.total === 0) return 0;
    return this.budget.allocated / this.budget.total;
  }

  reset(): void {
    this.budget = {
      total: 1.0,
      allocated: 0,
      available: 1.0,
      reserved: 0.1,
      maxPerItem: 0.5,
      starvationThreshold: 0.15,
    };
  }
}
