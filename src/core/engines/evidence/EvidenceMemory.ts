import { Evidence, EvidenceStage } from "./EvidenceTypes";
import { EvidenceQuery } from "./EvidenceContracts";

export class EvidenceMemory implements EvidenceQuery {
  private items: Map<string, Evidence> = new Map();

  async store(evidence: Evidence): Promise<void> {
    this.items.set(evidence.id, evidence);
  }

  async findById(id: string): Promise<Evidence | undefined> {
    return this.items.get(id);
  }

  async findByPatternId(patternId: string): Promise<Evidence[]> {
    const results: Evidence[] = [];
    for (const item of this.items.values()) {
      if (item.identity.patternId === patternId) {
        results.push(item);
      }
    }
    return results;
  }

  async findByCategory(category: string): Promise<Evidence[]> {
    const results: Evidence[] = [];
    for (const item of this.items.values()) {
      if (item.identity.category === category) {
        results.push(item);
      }
    }
    return results;
  }

  async findByStage(stage: EvidenceStage): Promise<Evidence[]> {
    const results: Evidence[] = [];
    for (const item of this.items.values()) {
      if (item.stage === stage) {
        results.push(item);
      }
    }
    return results;
  }

  async findValidated(): Promise<Evidence[]> {
    return this.findByStage("VALIDATED");
  }

  async findByBusinessId(businessId: string): Promise<Evidence[]> {
    const results: Evidence[] = [];
    for (const item of this.items.values()) {
      if (item.identity.businessId === businessId) {
        results.push(item);
      }
    }
    return results;
  }

  async findByReasoningId(reasoningId: string): Promise<Evidence[]> {
    const results: Evidence[] = [];
    for (const item of this.items.values()) {
      if (item.identity.reasoningId === reasoningId) {
        results.push(item);
      }
    }
    return results;
  }

  async search(query: string): Promise<Evidence[]> {
    const lower = query.toLowerCase();
    const results: Evidence[] = [];
    for (const item of this.items.values()) {
      if (
        item.id.toLowerCase().includes(lower) ||
        item.identity.name.toLowerCase().includes(lower) ||
        item.identity.patternName.toLowerCase().includes(lower) ||
        item.summary.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower)
      ) {
        results.push(item);
      }
    }
    return results;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async clear(): Promise<void> {
    this.items.clear();
  }

  count(): number {
    return this.items.size;
  }

  async find(
    predicate: (evidence: Evidence) => boolean
  ): Promise<Evidence[]> {
    const results: Evidence[] = [];
    for (const item of this.items.values()) {
      if (predicate(item)) {
        results.push(item);
      }
    }
    return results;
  }
}
