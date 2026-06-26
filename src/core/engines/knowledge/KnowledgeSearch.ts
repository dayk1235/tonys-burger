import { Knowledge, KnowledgeStage, KnowledgeCategory, GraphNodeType, GraphEdgeType } from "./KnowledgeTypes";
import { KnowledgeIndex } from "./KnowledgeIndex";

export interface SearchQuery {
  readonly text?: string;
  readonly category?: KnowledgeCategory;
  readonly stage?: KnowledgeStage;
  readonly minConfidence?: number;
  readonly maxConfidence?: number;
  readonly minIntegrity?: number;
  readonly minAbstraction?: number;
  readonly graphNodeType?: GraphNodeType;
  readonly graphEdgeType?: GraphEdgeType;
  readonly memoryId?: string;
  readonly patternId?: string;
  readonly tags?: readonly string[];
  readonly sortBy?: "confidence" | "integrity" | "abstraction" | "recency" | "created";
  readonly sortDirection?: "asc" | "desc";
  readonly limit?: number;
  readonly offset?: number;
}

export interface SearchResult {
  readonly knowledges: Knowledge[];
  readonly totalCount: number;
  readonly returnedCount: number;
  readonly query: SearchQuery;
}

export class KnowledgeSearch {
  constructor(private readonly index: KnowledgeIndex) {}

  search(query: SearchQuery): SearchResult {
    let results = this.index.getAll();

    if (query.text) {
      const lower = query.text.toLowerCase();
      results = results.filter(
        (k) =>
          k.identity.name.toLowerCase().includes(lower) ||
          k.summary.toLowerCase().includes(lower) ||
          k.description.toLowerCase().includes(lower) ||
          k.id.toLowerCase().includes(lower)
      );
    }

    if (query.category) {
      results = results.filter((k) => k.identity.category === query.category);
    }

    if (query.stage) {
      results = results.filter((k) => k.stage === query.stage);
    }

    if (query.minConfidence !== undefined) {
      results = results.filter((k) => k.confidence >= query.minConfidence!);
    }

    if (query.maxConfidence !== undefined) {
      results = results.filter((k) => k.confidence <= query.maxConfidence!);
    }

    if (query.minIntegrity !== undefined) {
      results = results.filter((k) => k.integrity >= query.minIntegrity!);
    }

    if (query.minAbstraction !== undefined) {
      results = results.filter((k) => k.abstractionLevel >= query.minAbstraction!);
    }

    if (query.graphNodeType) {
      results = results.filter((k) =>
        k.graphNodes.some((n) => n.type === query.graphNodeType)
      );
    }

    if (query.graphEdgeType) {
      results = results.filter((k) =>
        k.graphEdges.some((e) => e.type === query.graphEdgeType)
      );
    }

    if (query.memoryId) {
      results = results.filter((k) => k.identity.memoryId === query.memoryId);
    }

    if (query.patternId) {
      results = results.filter((k) => k.identity.patternId === query.patternId);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter((k) =>
        query.tags!.some((tag) => k.metadata.tags.includes(tag))
      );
    }

    const totalCount = results.length;

    if (query.sortBy) {
      results = [...results].sort((a, b) => {
        let cmp = 0;
        switch (query.sortBy) {
          case "confidence": cmp = a.confidence - b.confidence; break;
          case "integrity": cmp = a.integrity - b.integrity; break;
          case "abstraction": cmp = a.abstractionLevel - b.abstractionLevel; break;
          case "recency": cmp = new Date(a.metadata.lastValidatedAt).getTime() - new Date(b.metadata.lastValidatedAt).getTime(); break;
          case "created": cmp = new Date(a.identity.createdAt).getTime() - new Date(b.identity.createdAt).getTime(); break;
        }
        return query.sortDirection === "desc" ? -cmp : cmp;
      });
    }

    const offset = query.offset || 0;
    const limit = query.limit || results.length;
    const paginated = results.slice(offset, offset + limit);

    return {
      knowledges: paginated,
      totalCount,
      returnedCount: paginated.length,
      query,
    };
  }

  findSimilar(knowledge: Knowledge, threshold = 0.4): Knowledge[] {
    const all = this.index.getAll();
    return all.filter((k) => {
      if (k.id === knowledge.id) return false;
      const categoryMatch = k.identity.category === knowledge.identity.category ? 1 : 0;
      const confidenceMatch = 1 - Math.abs(k.confidence - knowledge.confidence);
      const conceptOverlap = this.computeConceptOverlap(k, knowledge);
      const similarity = categoryMatch * 0.3 + confidenceMatch * 0.3 + conceptOverlap * 0.4;
      return similarity >= threshold;
    });
  }

  private computeConceptOverlap(a: Knowledge, b: Knowledge): number {
    if (a.concepts.length === 0 || b.concepts.length === 0) return 0;
    const aNames = new Set(a.concepts.map((c) => c.name));
    const bNames = new Set(b.concepts.map((c) => c.name));
    const intersection = new Set([...aNames].filter((x) => bNames.has(x)));
    const union = new Set([...aNames, ...bNames]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
