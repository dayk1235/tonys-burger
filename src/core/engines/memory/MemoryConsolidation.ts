import { Memory, MemoryStage, MemoryVersion } from "./MemoryTypes";
import { MemoryFactory } from "./MemoryFactory";
import { MemoryLifecycle } from "./MemoryLifecycle";
import { MemoryMergeError } from "./MemoryErrors";

export interface ConsolidationResult {
  readonly memory: Memory;
  readonly consolidated: boolean;
  readonly targetStage: MemoryStage;
  readonly reason: string;
}

export class MemoryConsolidation {
  constructor(
    private readonly factory: MemoryFactory,
    private readonly lifecycle: MemoryLifecycle
  ) {}

  evaluateConsolidation(memory: Memory): ConsolidationResult {
    if (this.lifecycle.isConsolidated(memory.stage)) {
      return { memory, consolidated: false, targetStage: memory.stage, reason: "Already consolidated" };
    }

    const accessCount = memory.metadata.totalAccessCount;
    const versionCount = memory.versions.length;
    const strength = memory.strength;

    if (memory.stage === "SHORT_TERM" && accessCount >= 3 && strength >= 0.4) {
      const updated = this.consolidate(memory, "STABILIZING", "Sufficient access frequency and strength");
      return { memory: updated, consolidated: true, targetStage: "STABILIZING", reason: "Short-term memory promoted to stabilizing" };
    }

    if (memory.stage === "STABILIZING" && versionCount >= 2 && strength >= 0.5) {
      const updated = this.consolidate(memory, "CONSOLIDATED", "Stable across multiple versions");
      return { memory: updated, consolidated: true, targetStage: "CONSOLIDATED", reason: "Stabilizing memory consolidated" };
    }

    if (memory.stage === "CONSOLIDATED" && accessCount >= 10 && strength >= 0.6) {
      const updated = this.consolidate(memory, "LONG_TERM", "High access count and strength");
      return { memory: updated, consolidated: true, targetStage: "LONG_TERM", reason: "Consolidated memory promoted to long-term" };
    }

    if (memory.stage === "LONG_TERM" && memory.associations.length >= 5 && strength >= 0.7) {
      const updated = this.consolidate(memory, "SEMANTIC", "Rich association network and high strength");
      return { memory: updated, consolidated: true, targetStage: "SEMANTIC", reason: "Long-term memory promoted to semantic" };
    }

    return { memory, consolidated: false, targetStage: memory.stage, reason: "Does not meet consolidation criteria" };
  }

  merge(memories: Memory[]): Memory {
    if (memories.length < 2) {
      throw new MemoryMergeError(
        memories.map((m) => m.id),
        "Need at least 2 memories to merge"
      );
    }

    const primary = memories[0];
    const now = new Date().toISOString();

    const mergedStrength = Math.min(1, memories.reduce((s, m) => s + m.strength, 0) / memories.length + 0.1);
    const mergedConfidence = Math.min(1, memories.reduce((s, m) => s + m.confidence, 0) / memories.length);
    const mergedRecall = Math.min(1, memories.reduce((s, m) => s + m.recallScore, 0) / memories.length);

    const mergedProvenance = {
      ...primary.provenance,
      sourceEvidenceIds: [...new Set(memories.flatMap((m) => m.provenance.sourceEvidenceIds))],
      sourcePatternIds: [...new Set(memories.flatMap((m) => m.provenance.sourcePatternIds))],
      sourceObservationIds: [...new Set(memories.flatMap((m) => m.provenance.sourceObservationIds))],
      mergedFromIds: memories.map((m) => m.id),
    };

    const mergedAssociations = [
      ...primary.associations,
      ...memories.slice(1).flatMap((m) => m.associations.filter(
        (a) => !primary.associations.some((pa) => pa.targetMemoryId === a.targetMemoryId)
      )),
    ];

    const mergedAccessCount = memories.reduce((s, m) => s + m.metadata.totalAccessCount, 0);

    const updated = this.factory.cloneWithTransition(
      primary,
      primary.stage,
      {
        strength: mergedStrength,
        confidence: mergedConfidence,
        recallScore: mergedRecall,
        summary: `Merged ${memories.length} memories into one`,
        description: `Merged: ${memories.map((m) => m.identity.name).join(", ")}`,
        associations: mergedAssociations,
        provenance: mergedProvenance,
        metadata: {
          ...primary.metadata,
          totalAccessCount: mergedAccessCount,
          lastStrengthenedAt: now,
        },
      }
    );

    return updated;
  }

  canPromote(memory: Memory, target: MemoryStage): boolean {
    if (!this.lifecycle.canTransition(memory.stage, target)) return false;
    if (target === "STABILIZING") return memory.strength >= 0.4 && memory.metadata.totalAccessCount >= 3;
    if (target === "CONSOLIDATED") return memory.strength >= 0.5 && memory.versions.length >= 2;
    if (target === "LONG_TERM") return memory.strength >= 0.6 && memory.metadata.totalAccessCount >= 10;
    if (target === "SEMANTIC") return memory.strength >= 0.7 && memory.associations.length >= 5;
    return true;
  }

  private consolidate(memory: Memory, target: MemoryStage, reason: string): Memory {
    this.lifecycle.validateTransition(memory.stage, target);
    return this.factory.cloneWithTransition(memory, target, {
      summary: `Consolidated: ${reason}`,
    });
  }
}
