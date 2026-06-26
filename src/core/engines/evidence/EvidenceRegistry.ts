import { Evidence, EvidenceEvaluationRequest } from "./EvidenceTypes";
import { EvidenceFactory } from "./EvidenceFactory";
import { EvidenceValidator } from "./EvidenceValidator";
import { EvidenceMemory } from "./EvidenceMemory";
import { DuplicateEvidenceError } from "./EvidenceErrors";
import { EvidenceSubscriber } from "./EvidenceContracts";

export interface EvidencePolicy {
  readonly name: string;
  readonly description: string;
  readonly minimumSupportingRefs: number;
  readonly minimumConfidence: number;
  readonly maximumContradictionRatio: number;
  readonly requireSourceDiversity: boolean;
  readonly reliabilityThreshold: number;
}

export class EvidenceRegistry {
  private readonly policies: Map<string, EvidencePolicy> = new Map();
  private readonly subscribers: EvidenceSubscriber[] = [];
  private readonly memory: EvidenceMemory;
  private readonly factory: EvidenceFactory;
  private readonly validator: EvidenceValidator;

  constructor(
    memory?: EvidenceMemory,
    factory?: EvidenceFactory,
    validator?: EvidenceValidator
  ) {
    this.memory = memory || new EvidenceMemory();
    this.factory = factory || new EvidenceFactory();
    this.validator = validator || new EvidenceValidator();
  }

  getMemory(): EvidenceMemory {
    return this.memory;
  }

  async registerEvidence(
    request: EvidenceEvaluationRequest,
    description: string
  ): Promise<Evidence> {
    this.validator.validateRequest(request);

    const existing = await this.memory.findByPatternId(request.patternId);
    if (existing.length > 0) {
      throw new DuplicateEvidenceError(request.patternId, existing[0].id);
    }

    const evidence = this.factory.createCandidate(request, description);
    await this.memory.store(evidence);

    for (const sub of this.subscribers) {
      await sub.onEvidenceCreated(evidence);
    }

    return evidence;
  }

  async updateEvidence(evidence: Evidence): Promise<void> {
    this.validator.validateEvidence(evidence);
    await this.memory.store(evidence);

    for (const sub of this.subscribers) {
      await sub.onEvidenceUpdated(evidence);
    }
  }

  async finalizeEvidence(evidenceId: string, stage: string): Promise<void> {
    const evidence = await this.memory.findById(evidenceId);
    if (!evidence) return;

    for (const sub of this.subscribers) {
      await sub.onEvidenceFinalized(evidenceId, stage);
    }
  }

  async getEvidence(id: string): Promise<Evidence | undefined> {
    return this.memory.findById(id);
  }

  async getEvidenceByPattern(patternId: string): Promise<Evidence[]> {
    return this.memory.findByPatternId(patternId);
  }

  registerPolicy(policy: EvidencePolicy): void {
    this.policies.set(policy.name, policy);
  }

  getPolicy(name: string): EvidencePolicy | undefined {
    return this.policies.get(name);
  }

  getAllPolicies(): EvidencePolicy[] {
    return Array.from(this.policies.values());
  }

  subscribe(subscriber: EvidenceSubscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: EvidenceSubscriber): void {
    const idx = this.subscribers.indexOf(subscriber);
    if (idx !== -1) {
      this.subscribers.splice(idx, 1);
    }
  }
}
