import { Memory, MemoryAssociation, MemoryCompressionStats, MemoryStage } from "./MemoryTypes";
import { MemoryFactory } from "./MemoryFactory";
import { MemoryCompressionError } from "./MemoryErrors";

export interface CompressionCandidate {
  readonly memory: Memory;
  readonly redundant: boolean;
  readonly duplicateOf?: string;
  readonly mergeCandidates: string[];
}

export class MemoryCompression {
  constructor(private readonly factory: MemoryFactory) {}

  compress(memory: Memory): { memory: Memory; stats: MemoryCompressionStats } {
    const originalSize = this.estimateSize(memory);
    const redundantEntries = this.findRedundantAssociations(memory);
    const redundantCount = redundantEntries.length;

    const cleanedAssociations = memory.associations.filter(
      (_, idx) => !redundantEntries.includes(idx)
    );

    const mergedCount = 0;
    const compressedAssociations = this.deduplicateAssociations(cleanedAssociations);

    const compressedMemory = {
      ...memory,
      associations: compressedAssociations,
    };

    const compressedSize = this.estimateSize(compressedMemory);
    const compressionRatio = originalSize > 0
      ? Math.min(1, compressedSize / originalSize)
      : 1;

    const now = new Date().toISOString();

    const stats: MemoryCompressionStats = {
      originalSize,
      compressedSize,
      compressionRatio,
      entriesMerged: mergedCount,
      redundantEntriesRemoved: redundantCount,
      compressedAt: now,
    };

    return { memory: { ...compressedMemory, compressionStats: stats }, stats };
  }

  findAndMarkRedundant(memories: Memory[]): CompressionCandidate[] {
    const candidates: CompressionCandidate[] = [];

    for (const memory of memories) {
      const duplicates: string[] = [];

      for (const other of memories) {
        if (other.id === memory.id) continue;
        if (this.isRedundant(memory, other)) {
          duplicates.push(other.id);
        }
      }

      candidates.push({
        memory,
        redundant: duplicates.length > 0,
        duplicateOf: duplicates.length > 0 ? duplicates[0] : undefined,
        mergeCandidates: duplicates,
      });
    }

    return candidates;
  }

  estimateCompressionBenefit(memories: Memory[]): {
    currentTotalSize: number;
    estimatedCompressedSize: number;
    estimatedReduction: number;
  } {
    const currentTotalSize = memories.reduce((s, m) => s + this.estimateSize(m), 0);
    const redundant = this.findAndMarkRedundant(memories);
    const redundantCount = redundant.filter((c) => c.redundant).length;
    const avgSize = currentTotalSize / memories.length;
    const estimatedCompressedSize = currentTotalSize - redundantCount * avgSize * 0.5;

    return {
      currentTotalSize,
      estimatedCompressedSize,
      estimatedReduction: currentTotalSize > 0
        ? (currentTotalSize - estimatedCompressedSize) / currentTotalSize
        : 0,
    };
  }

  private estimateSize(memory: Memory): number {
    let size = 0;
    size += memory.summary.length;
    size += memory.description.length;
    size += memory.associations.length * 100;
    size += memory.provenance.sourceEvidenceIds.length * 20;
    size += memory.provenance.sourcePatternIds.length * 20;
    size += memory.provenance.sourceObservationIds.length * 20;
    size += memory.versions.length * 50;
    size += memory.metadata.tags.length * 10;
    return size;
  }

  private findRedundantAssociations(memory: Memory): number[] {
    const redundantIndices: number[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < memory.associations.length; i++) {
      const key = `${memory.associations[i].targetMemoryId}:${memory.associations[i].type}`;
      if (seen.has(key)) {
        redundantIndices.push(i);
      }
      seen.add(key);
    }

    return redundantIndices;
  }

  private deduplicateAssociations(associations: readonly MemoryAssociation[]): MemoryAssociation[] {
    const seen = new Map<string, MemoryAssociation>();

    for (const assoc of associations) {
      const key = `${assoc.targetMemoryId}:${assoc.type}`;
      const existing = seen.get(key);
      if (existing) {
        seen.set(key, {
          ...existing,
          strength: Math.max(existing.strength, assoc.strength),
          weight: Math.max(existing.weight, assoc.weight),
          lastReinforcedAt: assoc.lastReinforcedAt > existing.lastReinforcedAt
            ? assoc.lastReinforcedAt
            : existing.lastReinforcedAt,
        });
      } else {
        seen.set(key, assoc);
      }
    }

    return [...seen.values()];
  }

  private isRedundant(a: Memory, b: Memory): boolean {
    if (a.identity.patternId !== b.identity.patternId) return false;
    const evidenceOverlap = a.provenance.sourceEvidenceIds.some((id) =>
      b.provenance.sourceEvidenceIds.includes(id)
    );
    const strengthClose = Math.abs(a.strength - b.strength) < 0.1;
    return evidenceOverlap && strengthClose;
  }
}
