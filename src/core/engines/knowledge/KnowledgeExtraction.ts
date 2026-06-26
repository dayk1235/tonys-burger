import { Knowledge, KnowledgeInput, Concept, GraphNode, GraphEdge, GraphNodeType, GraphEdgeType } from "./KnowledgeTypes";
import { KnowledgeFactory } from "./KnowledgeFactory";
import { KnowledgeValidator } from "./KnowledgeValidator";
import { KnowledgeExtractionError } from "./KnowledgeErrors";

export interface ExtractionResult {
  readonly knowledge: Knowledge;
  readonly extracted: boolean;
  readonly concepts: Concept[];
  readonly graphNodes: GraphNode[];
  readonly graphEdges: GraphEdge[];
}

export class KnowledgeExtraction {
  constructor(
    private readonly factory: KnowledgeFactory,
    private readonly validator: KnowledgeValidator
  ) {}

  extract(input: KnowledgeInput, description: string): ExtractionResult {
    this.validator.validateInput(input);

    const knowledge = this.factory.createFromInput(input, description);
    const concepts = this.extractConcepts(knowledge);
    const graphNodes = this.buildGraphNodes(knowledge, concepts);
    const graphEdges = this.buildGraphEdges(graphNodes);

    return {
      knowledge,
      extracted: true,
      concepts,
      graphNodes,
      graphEdges,
    };
  }

  linkToMemory(knowledge: Knowledge, memoryId: string, memoryName: string): Knowledge {
    const existingMemoryIds = knowledge.provenance.sourceMemoryIds;
    if (existingMemoryIds.includes(memoryId)) return knowledge;

    const now = new Date().toISOString();
    return this.factory.cloneWithTransition(knowledge, knowledge.stage, {
      provenance: {
        ...knowledge.provenance,
        sourceMemoryIds: [...existingMemoryIds, memoryId],
        creationTimeline: [...knowledge.provenance.creationTimeline, now],
      },
      metadata: {
        ...knowledge.metadata,
        sourceCount: knowledge.metadata.sourceCount + 1,
      },
    });
  }

  private extractConcepts(knowledge: Knowledge): Concept[] {
    const now = new Date().toISOString();
    const name = knowledge.identity.name;
    const category = knowledge.identity.category;

    const mainConcept: Concept = {
      id: `concept_${knowledge.id}_main`,
      name,
      description: `Primary concept derived from knowledge "${name}"`,
      category,
      childConceptIds: [],
      attributeNames: ["confidence", "integrity"],
      createdAt: now,
    };

    return [mainConcept];
  }

  private buildGraphNodes(
    knowledge: Knowledge,
    concepts: Concept[]
  ): GraphNode[] {
    const now = new Date().toISOString();
    const nodes: GraphNode[] = [];

    for (const concept of concepts) {
      nodes.push({
        id: `node_${concept.id}`,
        type: "CONCEPT",
        name: concept.name,
        description: concept.description,
        knowledgeId: knowledge.id,
        createdAt: now,
        metadata: { conceptId: concept.id, category: concept.category },
      });
    }

    return nodes;
  }

  private buildGraphEdges(nodes: GraphNode[]): GraphEdge[] {
    const now = new Date().toISOString();
    const edges: GraphEdge[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        edges.push({
          id: `edge_${nodes[i].id}_${nodes[j].id}`,
          sourceId: nodes[i].id,
          targetId: nodes[j].id,
          type: "RELATED_TO",
          weight: 0.5,
          confidence: 0.5,
          provenance: [],
          discoveredAt: now,
        });
      }
    }

    return edges;
  }
}
