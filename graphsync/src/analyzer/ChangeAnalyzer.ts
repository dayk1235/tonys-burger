import { minimatch } from 'minimatch';
import { resolve } from 'node:path';
import type { KnowledgeSourceConfig } from '../config/types.js';
import type { FileChangedPayload } from '../bus/events.js';

export interface ClassifiedChange {
  source: string;
  files: FileChangedPayload[];
}

export class ChangeAnalyzer {
  private resolved: KnowledgeSourceConfig[];

  constructor(sources: KnowledgeSourceConfig[], cwd?: string) {
    if (cwd) {
      this.resolved = sources.map((s) => ({
        ...s,
        paths: s.paths.map((p) => resolve(cwd, p)),
      }));
    } else {
      this.resolved = sources;
    }
  }

  classify(change: FileChangedPayload): ClassifiedChange | null {
    for (const source of this.resolved) {
      for (const pattern of source.paths) {
        if (minimatch(change.path, pattern, { dot: true })) {
          return {
            source: source.id,
            files: [change],
          };
        }
      }
    }
    return null;
  }

  classifyBatch(changes: FileChangedPayload[]): Map<string, FileChangedPayload[]> {
    const grouped = new Map<string, FileChangedPayload[]>();

    for (const change of changes) {
      const classified = this.classify(change);
      if (classified) {
        const existing = grouped.get(classified.source) ?? [];
        existing.push(change);
        grouped.set(classified.source, existing);
      }
    }

    return grouped;
  }

  getSourceLabel(sourceId: string): string {
    return this.resolved.find((s) => s.id === sourceId)?.label ?? sourceId;
  }
}
