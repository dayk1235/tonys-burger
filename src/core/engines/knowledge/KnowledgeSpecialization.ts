import { Knowledge, KnowledgeStage, Concept, GraphNode, GraphEdge } from "./KnowledgeTypes";
import { KnowledgeFactory } from "./KnowledgeFactory";
import { KnowledgeLifecycle } from "./KnowledgeLifecycle";

export interface SpecializationResult {
  readonly knowledge: Knowledge;
  readonly specialized: boolean;
  readonly targetStage: KnowledgeStage;
  readonly newConcepts: Concept[];
}

export class KnowledgeSpecialization {
  constructor(
    private readonly factory: KnowledgeFactory,
    private readonly lifecycle: KnowledgeLifecycle
  ) {}

  specialize(knowledge: Knowledge, attributeName: string, attributeValue: string): SpecializationResult {
    const now = new Date().toISOString();
    const targetStage: KnowledgeStage = this.lifecycle.canTransition(knowledge.stage, "SPECIALIZED")
      ? "SPECIALIZED"
      : knowledge.stage;

    const specializedConcepts = this.buildSpecializedConcepts(knowledge, attributeName, attributeValue);
    const specializedNodes = this.buildSpecializedNodes(specializedConcepts, knowledge.id);
    const specializedEdges = this.buildSpecializedEdges(specializedNodes, knowledge.graphNodes);

    const updated = this.factory.cloneWithTransition(knowledge, targetStage, {
      abstractionLevel: Math.max(0, knowledge.abstractionLevel - 0.1),
      summary: `Specialized on "${attributeName}=${attributeValue}"`,
      concepts: [...knowledge.concepts, ...specializedConcepts],
      graphNodes: [...knowledge.graphNodes, ...specializedNodes],
      graphEdges: [...knowledge.graphEdges, ...specializedEdges],
      provenance: {
        ...knowledge.provenance,
        specializedFromIds: [...knowledge.provenance.specializedFromIds, knowledge.id],
      },
      metadata: {
        ...knowledge.metadata,
        specializationCount: knowledge.metadata.specializationCount + 1,
        totalDerivations: knowledge.metadata.totalDerivations + 1,
        attributes: {
          ...knowledge.metadata.attributes,
          [attributeName]: attributeValue,
        },
      },
    });

    return {
      knowledge: updated,
      specialized: true,
      targetStage,
      newConcepts: specializedConcepts,
    };
  }

  canSpecialize(knowledge: Knowledge): boolean {
    return knowledge.abstractionLevel >= 0.3 && knowledge.concepts.length >= 1;
  }

  private buildSpecializedConcepts(
    knowledge: Knowledge,
    attributeName: string,
    attributeValue: string
  ): Concept[] {
    const now = new Date().toISOString();

    const specialized: Concept = {
      id: `concept_spec_${knowledge.id}_${now}`,
      name: `${knowledge.identity.name}_${attributeValue}`,
      description: `Specialization of "${knowledge.identity.name}" with ${attributeName}=${attributeValue}`,
      category: knowledge.identity.category,
      parentConceptId: knowledge.concepts[0]?.id,
      childConceptIds: [],
      attributeNames: [attributeName],
      createdAt: now,
    };

    return [specialized];
  }

  private buildSpecializedNodes(concepts: Concept[], knowledgeId: string): GraphNode[] {
    const now = new Date().toISOString();
    return concepts.map((c) => ({
      id: `node_spec_${c.id}`,
      type: "CONCEPT" as const,
      name: c.name,
      description: c.description,
      knowledgeId,
      createdAt: now,
      metadata: { conceptId: c.id, isSpecialized: true },
    }));
  }

  private buildSpecializedEdges(
    specializedNodes: GraphNode[],
    existingNodes: readonly GraphNode[]
  ): GraphEdge[] {
    const now = new Date().toISOString();
    const edges: GraphEdge[] = [];

    for (const specNode of specializedNodes) {
      for (const existingNode of existingNodes) {
        edges.push({
          id: `edge_spec_${specNode.id}_${existingNode.id}`,
          sourceId: specNode.id,
          targetId: existingNode.id,
          type: "SPECIALIZES",
          weight: 0.8,
          confidence: 0.7,
          provenance: [],
          discoveredAt: now,
        });
      }
    }

    return edges;
  }
}
