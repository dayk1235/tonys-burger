import { Memory, MemoryStage, MemoryCategory, AssociationType } from "./MemoryTypes";
import { MemoryIndex } from "./MemoryIndex";

export interface SearchQuery {
  readonly text?: string;
  readonly category?: MemoryCategory;
  readonly stage?: MemoryStage;
  readonly minStrength?: number;
  readonly maxStrength?: number;
  readonly minConfidence?: number;
  readonly minActivation?: number;
  readonly associationType?: AssociationType;
  readonly associatedWith?: string;
  readonly evidenceId?: string;
  readonly patternId?: string;
  readonly tags?: readonly string[];
  readonly sortBy?: "strength" | "confidence" | "activation" | "recency" | "created";
  readonly sortDirection?: "asc" | "desc";
  readonly limit?: number;
  readonly offset?: number;
}

export interface SearchResult {
  readonly memories: Memory[];
  readonly totalCount: number;
  readonly returnedCount: number;
  readonly query: SearchQuery;
}

export class MemorySearch {
  constructor(private readonly index: MemoryIndex) {}

  search(query: SearchQuery): SearchResult {
    let results = this.index.getAll();

    if (query.text) {
      const lower = query.text.toLowerCase();
      results = results.filter(
        (m) =>
          m.identity.name.toLowerCase().includes(lower) ||
          m.summary.toLowerCase().includes(lower) ||
          m.description.toLowerCase().includes(lower) ||
          m.id.toLowerCase().includes(lower)
      );
    }

    if (query.category) {
      results = results.filter((m) => m.identity.category === query.category);
    }

    if (query.stage) {
      results = results.filter((m) => m.stage === query.stage);
    }

    if (query.minStrength !== undefined) {
      results = results.filter((m) => m.strength >= query.minStrength!);
    }

    if (query.maxStrength !== undefined) {
      results = results.filter((m) => m.strength <= query.maxStrength!);
    }

    if (query.minConfidence !== undefined) {
      results = results.filter((m) => m.confidence >= query.minConfidence!);
    }

    if (query.minActivation !== undefined) {
      results = results.filter((m) => m.activationScore >= query.minActivation!);
    }

    if (query.associationType) {
      results = results.filter((m) =>
        m.associations.some((a) => a.type === query.associationType)
      );
    }

    if (query.associatedWith) {
      results = results.filter((m) =>
        m.associations.some((a) => a.targetMemoryId === query.associatedWith)
      );
    }

    if (query.evidenceId) {
      results = results.filter((m) =>
        m.provenance.sourceEvidenceIds.includes(query.evidenceId!)
      );
    }

    if (query.patternId) {
      results = results.filter((m) => m.identity.patternId === query.patternId);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter((m) =>
        query.tags!.some((tag) => m.metadata.tags.includes(tag))
      );
    }

    const totalCount = results.length;

    if (query.sortBy) {
      results = [...results].sort((a, b) => {
        let cmp = 0;
        switch (query.sortBy) {
          case "strength": cmp = a.strength - b.strength; break;
          case "confidence": cmp = a.confidence - b.confidence; break;
          case "activation": cmp = a.activationScore - b.activationScore; break;
          case "recency": cmp = new Date(a.metadata.lastAccessedAt).getTime() - new Date(b.metadata.lastAccessedAt).getTime(); break;
          case "created": cmp = new Date(a.identity.createdAt).getTime() - new Date(b.identity.createdAt).getTime(); break;
        }
        return query.sortDirection === "desc" ? -cmp : cmp;
      });
    }

    const offset = query.offset || 0;
    const limit = query.limit || results.length;
    const paginated = results.slice(offset, offset + limit);

    return {
      memories: paginated,
      totalCount,
      returnedCount: paginated.length,
      query,
    };
  }

  findByTags(tags: string[], matchAll = false): Memory[] {
    const all = this.index.getAll();
    return all.filter((m) => {
      if (matchAll) {
        return tags.every((t) => m.metadata.tags.includes(t));
      }
      return tags.some((t) => m.metadata.tags.includes(t));
    });
  }

  findSimilar(memory: Memory, threshold = 0.5): Memory[] {
    const all = this.index.getAll();
    return all.filter((m) => {
      if (m.id === memory.id) return false;
      const categoryMatch = m.identity.category === memory.identity.category ? 1 : 0;
      const strengthMatch = 1 - Math.abs(m.strength - memory.strength);
      const confidenceMatch = 1 - Math.abs(m.confidence - memory.confidence);
      const similarity = categoryMatch * 0.4 + strengthMatch * 0.3 + confidenceMatch * 0.3;
      return similarity >= threshold;
    });
  }
}
