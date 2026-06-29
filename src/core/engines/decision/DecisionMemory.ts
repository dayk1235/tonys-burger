import { DecisionResult, DecisionStage } from "./DecisionTypes";
import { DecisionQuery } from "./DecisionContracts";

const ACTIVE_STAGES: DecisionStage[] = [
  "CANDIDATE", "CONTEXT_READY", "ALTERNATIVES_BUILT",
  "RISK_EVALUATED", "OPPORTUNITY_EVALUATED", "COST_EVALUATED",
  "HUMAN_IMPACT_EVALUATED", "REVERSIBILITY_EVALUATED",
  "CONFIDENCE_VERIFIED", "PROPOSAL_BUILT", "WAITING_HUMAN_REVIEW",
  "ACCEPTED", "MODIFIED",
];

const ARCHIVED_STAGES: DecisionStage[] = ["ARCHIVED", "RETIRED"];

export class DecisionMemory implements DecisionQuery {
  private items: Map<string, DecisionResult> = new Map();

  async store(decision: DecisionResult): Promise<void> {
    this.items.set(decision.id, decision);
  }

  async findById(id: string): Promise<DecisionResult | undefined> {
    return this.items.get(id);
  }

  async findActive(): Promise<DecisionResult[]> {
    return this.find((d) => ACTIVE_STAGES.includes(d.stage));
  }

  async findArchived(): Promise<DecisionResult[]> {
    return this.find((d) => ARCHIVED_STAGES.includes(d.stage));
  }

  async findByReasoningId(reasoningId: string): Promise<DecisionResult[]> {
    return this.find((d) => d.reasoningId === reasoningId);
  }

  async findAll(): Promise<DecisionResult[]> {
    return Array.from(this.items.values());
  }

  async find(predicate: (d: DecisionResult) => boolean): Promise<DecisionResult[]> {
    const results: DecisionResult[] = [];
    for (const item of this.items.values()) {
      if (predicate(item)) results.push(item);
    }
    return results;
  }

  count(): number {
    return this.items.size;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async clear(): Promise<void> {
    this.items.clear();
  }
}
