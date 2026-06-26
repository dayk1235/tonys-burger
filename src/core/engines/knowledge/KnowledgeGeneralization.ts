import { Knowledge, KnowledgeStage, Concept, GraphNode, GraphEdge, GraphEdgeType } from "./KnowledgeTypes";
import { KnowledgeFactory } from "./KnowledgeFactory";
import { KnowledgeLifecycle } from "./KnowledgeLifecycle";
import { KnowledgeGeneralizationError } from "./KnowledgeErrors";

export interface GeneralizationResult {
  readonly knowledge: Knowledge;
  readonly generalized: boolean;
  readonly targetStage: KnowledgeStage;
  readonly newConcepts: Concept[];
}

export class KnowledgeGeneralization {
  constructor(
    private readonly factory: KnowledgeFactory,
    private readonly lifecycle: KnowledgeLifecycle
  ) {}

  generalize(knowledge: Knowledge, sourceKnowledges: Knowledge[]): GeneralizationResult {
    if (sourceKnowledges.length < 2) {
      throw new KnowledgeGeneralizationError(
        knowledge.id,
        "Need at least 2 source knowledges to generalize"
      );
    }

    const now = new Date().toISOString();
    const targetStage: KnowledgeStage = this.lifecycle.canTransition(knowledge.stage, "GENERALIZED")
      ? "GENERALIZED"
      : knowledge.stage;

    const generalizedConcepts = this.buildGeneralizedConcepts(knowledge, sourceKnowledges);
    const generalizedNodes = this.buildGeneralizedNodes(generalizedConcepts, knowledge.id);
    const generalizedEdges = this.buildGeneralizedEdges(generalizedNodes);

    const generalizedConfidence = Math.min(1,
      sourceKnowledges.reduce((s, k) => s + k.confidence, 0) / sourceKnowledges.length + 0.05
    );

    const generalizedFromIds = [
      ...knowledge.provenance.generalizedFromIds,
      ...sourceKnowledges.map((k) => k.id),
    ];

    const updated = this.factory.cloneWithTransition(knowledge, targetStage, {
      confidence: generalizedConfidence,
      abstractionLevel: Math.min(1, knowledge.abstractionLevel + 0.1),
      summary: `Generalized from ${sourceKnowledges.length} knowledge items`,
      concepts: [...knowledge.concepts, ...generalizedConcepts],
      graphNodes: [...knowledge.graphNodes, ...generalizedNodes],
      graphEdges: [...knowledge.graphEdges, ...generalizedEdges],
      provenance: {
        ...knowledge.provenance,
        generalizedFromIds,
      },
      metadata: {
        ...knowledge.metadata,
        generalizationCount: knowledge.metadata.generalizationCount + 1,
        totalDerivations: knowledge.metadata.totalDerivations + 1,
      },
    });

    return {
      knowledge: updated,
      generalized: true,
      targetStage,
      newConcepts: generalizedConcepts,
    };
  }

  canGeneralize(knowledge: Knowledge): boolean {
    return knowledge.provenance.sourceMemoryIds.length >= 2 && knowledge.confidence >= 0.5;
  }

  private buildGeneralizedConcepts(
    knowledge: Knowledge,
    sources: Knowledge[]
  ): Concept[] {
    const now = new Date().toISOString();
    const allNames = [knowledge.identity.name, ...sources.map((s) => s.identity.name)];

    const commonPrefix = this.findCommonPrefix(allNames);

    const generalized: Concept = {
      id: `concept_gen_${knowledge.id}_${now}`,
      name: commonPrefix || `Generalized_${knowledge.identity.category}`,
      description: `Generalized concept from ${allNames.length} sources: ${allNames.join(", ")}`,
      category: knowledge.identity.category,
      childConceptIds: sources.map((s) => `concept_${s.id}_main`),
      attributeNames: ["confidence", "integrity", "sourceCount"],
      createdAt: now,
    };

    return [generalized];
  }

  private buildGeneralizedNodes(concepts: Concept[], knowledgeId: string): GraphNode[] {
    const now = new Date().toISOString();
    return concepts.map((c) => ({
      id: `node_gen_${c.id}`,
      type: "HIERARCHY" as const,
      name: c.name,
      description: c.description,
      knowledgeId,
      createdAt: now,
      metadata: { conceptId: c.id, isGeneralized: true },
    }));
  }

  private buildGeneralizedEdges(nodes: GraphNode[]): GraphEdge[] {
    const now = new Date().toISOString();
    const edges: GraphEdge[] = [];

    for (const node of nodes) {
      edges.push({
        id: `edge_gen_${node.id}_${now}`,
        sourceId: node.id,
        targetId: node.id,
        type: "GENERALIZES",
        weight: 0.9,
        confidence: 0.8,
        provenance: [],
        discoveredAt: now,
      });
    }

    return edges;
  }

  private findCommonPrefix(names: string[]): string {
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];

    const parts = names.map((n) => n.split("_"));
    const common: string[] = [];

    for (let i = 0; i < parts[0].length; i++) {
      const word = parts[0][i];
      if (parts.every((p) => p[i] === word)) {
        common.push(word);
      } else {
        break;
      }
    }

    return common.join("_");
  }
}
