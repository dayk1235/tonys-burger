import type { KnowledgeSourceConfig } from '../config/types.js';
import type { FileChangedPayload } from '../bus/events.js';
export interface ClassifiedChange {
    source: string;
    files: FileChangedPayload[];
}
export declare class ChangeAnalyzer {
    private resolved;
    constructor(sources: KnowledgeSourceConfig[], cwd?: string);
    classify(change: FileChangedPayload): ClassifiedChange | null;
    classifyBatch(changes: FileChangedPayload[]): Map<string, FileChangedPayload[]>;
    getSourceLabel(sourceId: string): string;
}
//# sourceMappingURL=ChangeAnalyzer.d.ts.map