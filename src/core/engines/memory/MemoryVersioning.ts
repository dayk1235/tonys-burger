import { Memory, MemoryVersion, MemoryStage } from "./MemoryTypes";

export interface VersionDiff {
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly strengthChange: number;
  readonly confidenceChange: number;
  readonly recallChange: number;
  readonly stageChange: string;
}

export class MemoryVersioning {
  getVersion(memory: Memory, versionNumber: number): MemoryVersion | undefined {
    return memory.versions.find((v) => v.version === versionNumber);
  }

  getLatestVersion(memory: Memory): MemoryVersion {
    return memory.versions[memory.versions.length - 1];
  }

  getVersionCount(memory: Memory): number {
    return memory.versions.length;
  }

  diff(memory: Memory, fromVersion: number, toVersion: number): VersionDiff | undefined {
    const from = this.getVersion(memory, fromVersion);
    const to = this.getVersion(memory, toVersion);
    if (!from || !to) return undefined;

    return {
      fromVersion,
      toVersion,
      strengthChange: to.strength - from.strength,
      confidenceChange: to.confidence - from.confidence,
      recallChange: to.recallScore - from.recallScore,
      stageChange: from.stage !== to.stage ? `${from.stage} → ${to.stage}` : "none",
    };
  }

  getVersionsByStage(memory: Memory, stage: MemoryStage): MemoryVersion[] {
    return memory.versions.filter((v) => v.stage === stage);
  }

  getVersionTimeline(memory: Memory): MemoryVersion[] {
    return [...memory.versions].sort((a, b) => a.version - b.version);
  }

  getRecentVersions(memory: Memory, count: number): MemoryVersion[] {
    return memory.versions.slice(-count);
  }

  hasStageTransitioned(memory: Memory, stage: MemoryStage): boolean {
    return memory.versions.some((v) => v.stage === stage);
  }

  computeStability(memory: Memory): number {
    if (memory.versions.length < 3) return 0.5;
    const recent = memory.versions.slice(-5);
    const strengths = recent.map((v) => v.strength);
    const mean = strengths.reduce((s, v) => s + v, 0) / strengths.length;
    const variance = strengths.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / strengths.length;
    return Math.max(0, Math.min(1, 1 - Math.sqrt(variance) * 2));
  }
}
