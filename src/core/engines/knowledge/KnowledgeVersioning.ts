import { Knowledge, KnowledgeVersion, KnowledgeStage } from "./KnowledgeTypes";

export interface VersionDiff {
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly confidenceChange: number;
  readonly integrityChange: number;
  readonly stageChange: string;
  readonly conceptCountChange: number;
}

export class KnowledgeVersioning {
  getVersion(knowledge: Knowledge, versionNumber: number): KnowledgeVersion | undefined {
    return knowledge.versions.find((v) => v.version === versionNumber);
  }

  getLatestVersion(knowledge: Knowledge): KnowledgeVersion {
    return knowledge.versions[knowledge.versions.length - 1];
  }

  getVersionCount(knowledge: Knowledge): number {
    return knowledge.versions.length;
  }

  diff(knowledge: Knowledge, fromVersion: number, toVersion: number): VersionDiff | undefined {
    const from = this.getVersion(knowledge, fromVersion);
    const to = this.getVersion(knowledge, toVersion);
    if (!from || !to) return undefined;

    return {
      fromVersion,
      toVersion,
      confidenceChange: to.confidence - from.confidence,
      integrityChange: to.integrity - from.integrity,
      stageChange: from.stage !== to.stage ? `${from.stage} → ${to.stage}` : "none",
      conceptCountChange: 0,
    };
  }

  getVersionsByStage(knowledge: Knowledge, stage: KnowledgeStage): KnowledgeVersion[] {
    return knowledge.versions.filter((v) => v.stage === stage);
  }

  getVersionTimeline(knowledge: Knowledge): KnowledgeVersion[] {
    return [...knowledge.versions].sort((a, b) => a.version - b.version);
  }

  getRecentVersions(knowledge: Knowledge, count: number): KnowledgeVersion[] {
    return knowledge.versions.slice(-count);
  }

  hasStageTransitioned(knowledge: Knowledge, stage: KnowledgeStage): boolean {
    return knowledge.versions.some((v) => v.stage === stage);
  }

  computeStability(knowledge: Knowledge): number {
    if (knowledge.versions.length < 3) return 0.5;
    const recent = knowledge.versions.slice(-5);
    const confidences = recent.map((v) => v.confidence);
    const mean = confidences.reduce((s, v) => s + v, 0) / confidences.length;
    const variance = confidences.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / confidences.length;
    return Math.max(0, Math.min(1, 1 - Math.sqrt(variance) * 2));
  }
}
