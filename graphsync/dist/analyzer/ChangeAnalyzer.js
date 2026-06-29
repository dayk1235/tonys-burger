import { minimatch } from 'minimatch';
import { resolve } from 'node:path';
export class ChangeAnalyzer {
    resolved;
    constructor(sources, cwd) {
        if (cwd) {
            this.resolved = sources.map((s) => ({
                ...s,
                paths: s.paths.map((p) => resolve(cwd, p)),
            }));
        }
        else {
            this.resolved = sources;
        }
    }
    classify(change) {
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
    classifyBatch(changes) {
        const grouped = new Map();
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
    getSourceLabel(sourceId) {
        return this.resolved.find((s) => s.id === sourceId)?.label ?? sourceId;
    }
}
//# sourceMappingURL=ChangeAnalyzer.js.map