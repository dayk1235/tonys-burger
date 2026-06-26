import { Knowledge, Concept, GraphNode, GraphEdge } from "./KnowledgeTypes";
import { KnowledgeFactory } from "./KnowledgeFactory";

export interface AbstractionResult {
  readonly knowledge: Knowledge;
  readonly abstracted: boolean;
  readonly abstractionLevel: number;
}

export class KnowledgeAbstraction {
  constructor(private readonly factory: KnowledgeFactory) {}

  evaluateAbstraction(knowledge: Knowledge): AbstractionResult {
    const currentLevel = knowledge.abstractionLevel;
    const conceptCount = knowledge.concepts.length;
    const graphDensity = this.computeGraphDensity(knowledge);
    const versionCount = knowledge.versions.length;

    let newLevel = currentLevel;

    if (conceptCount >= 3 && graphDensity >= 0.4 && versionCount >= 2) {
      newLevel = Math.min(1, currentLevel + 0.2);
    }

    if (conceptCount >= 5 && graphDensity >= 0.6 && versionCount >= 3) {
      newLevel = Math.min(1, currentLevel + 0.3);
    }

    if (newLevel !== currentLevel) {
      const now = new Date().toISOString();
      const updated = this.factory.cloneWithTransition(knowledge, knowledge.stage, {
        abstractionLevel: newLevel,
        summary: `Abstraction level increased from ${currentLevel.toFixed(1)} to ${newLevel.toFixed(1)}`,
        metadata: {
          ...knowledge.metadata,
          totalDerivations: knowledge.metadata.totalDerivations + 1,
        },
      });

      return { knowledge: updated, abstracted: true, abstractionLevel: newLevel };
    }

    return { knowledge, abstracted: false, abstractionLevel: currentLevel };
  }

  abstract(knowledge: Knowledge): Knowledge {
    const result = this.evaluateAbstraction(knowledge);
    return result.knowledge;
  }

  private computeGraphDensity(knowledge: Knowledge): number {
    if (knowledge.graphNodes.length < 2) return 0;
    return Math.min(1, knowledge.graphEdges.length / knowledge.graphNodes.length);
  }
}
