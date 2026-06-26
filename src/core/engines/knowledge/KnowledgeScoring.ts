import { Knowledge } from "./KnowledgeTypes";

export class KnowledgeScoring {
  computeSemanticScore(knowledge: Knowledge): number {
    const conceptRichness = Math.min(1, knowledge.concepts.length / 5);
    const graphConnectivity = this.computeGraphConnectivity(knowledge);
    const abstractionBonus = knowledge.abstractionLevel;

    return Math.max(0, Math.min(1,
      conceptRichness * 0.35 + graphConnectivity * 0.35 + abstractionBonus * 0.3
    ));
  }

  computeIntegrity(knowledge: Knowledge): number {
    const provenanceDepth = Math.min(1,
      (knowledge.provenance.sourceMemoryIds.length +
        knowledge.provenance.sourceEvidenceIds.length +
        knowledge.provenance.sourcePatternIds.length) / 15
    );
    const versionStability = knowledge.versions.length >= 3 ? 0.9 : 0.5 + knowledge.versions.length * 0.15;
    const graphCoherence = this.computeGraphCoherence(knowledge);

    return Math.max(0, Math.min(1,
      provenanceDepth * 0.4 + versionStability * 0.3 + graphCoherence * 0.3
    ));
  }

  computeGeneralizationPotential(knowledge: Knowledge): number {
    const sourceDiversity = Math.min(1, knowledge.provenance.sourceMemoryIds.length / 5);
    const confidenceLevel = knowledge.confidence;
    const conceptCount = Math.min(1, knowledge.concepts.length / 3);

    return Math.max(0, Math.min(1,
      sourceDiversity * 0.4 + confidenceLevel * 0.35 + conceptCount * 0.25
    ));
  }

  computeSpecializationPotential(knowledge: Knowledge): number {
    const abstractionLevel = knowledge.abstractionLevel;
    const graphDensity = this.computeGraphDensity(knowledge);
    const conceptDepth = knowledge.concepts.some((c) => c.parentConceptId) ? 0.8 : 0.2;

    return Math.max(0, Math.min(1,
      abstractionLevel * 0.4 + graphDensity * 0.3 + conceptDepth * 0.3
    ));
  }

  evaluate(knowledge: Knowledge): {
    semanticScore: number;
    integrity: number;
    generalizationPotential: number;
    specializationPotential: number;
  } {
    return {
      semanticScore: this.computeSemanticScore(knowledge),
      integrity: this.computeIntegrity(knowledge),
      generalizationPotential: this.computeGeneralizationPotential(knowledge),
      specializationPotential: this.computeSpecializationPotential(knowledge),
    };
  }

  private computeGraphConnectivity(knowledge: Knowledge): number {
    if (knowledge.graphNodes.length < 2) return 0;
    const edgeCount = knowledge.graphEdges.length;
    const possibleEdges = knowledge.graphNodes.length * (knowledge.graphNodes.length - 1);
    return possibleEdges > 0 ? Math.min(1, edgeCount / possibleEdges * 2) : 0;
  }

  private computeGraphCoherence(knowledge: Knowledge): number {
    if (knowledge.graphEdges.length === 0) return 0.5;
    return knowledge.graphEdges.reduce((s, e) => s + e.weight, 0) / knowledge.graphEdges.length;
  }

  private computeGraphDensity(knowledge: Knowledge): number {
    if (knowledge.graphNodes.length < 2) return 0;
    return Math.min(1, knowledge.graphEdges.length / knowledge.graphNodes.length);
  }
}
