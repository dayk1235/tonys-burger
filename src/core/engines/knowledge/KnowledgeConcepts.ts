import { Knowledge, Concept } from "./KnowledgeTypes";

export class KnowledgeConcepts {
  findConceptsByCategory(knowledge: Knowledge, category: string): Concept[] {
    return knowledge.concepts.filter((c) => c.category === category);
  }

  findConceptByName(knowledge: Knowledge, name: string): Concept | undefined {
    return knowledge.concepts.find((c) => c.name === name);
  }

  findConceptById(knowledge: Knowledge, conceptId: string): Concept | undefined {
    return knowledge.concepts.find((c) => c.id === conceptId);
  }

  getRootConcepts(knowledge: Knowledge): Concept[] {
    return knowledge.concepts.filter((c) => !c.parentConceptId);
  }

  getLeafConcepts(knowledge: Knowledge): Concept[] {
    return knowledge.concepts.filter(
      (c) => c.childConceptIds.length === 0
    );
  }

  getConceptDepth(knowledge: Knowledge, conceptId: string): number {
    const concept = this.findConceptById(knowledge, conceptId);
    if (!concept) return -1;

    let depth = 0;
    let current = concept;

    while (current.parentConceptId) {
      depth++;
      const parent = this.findConceptById(knowledge, current.parentConceptId);
      if (!parent) break;
      current = parent;
    }

    return depth;
  }

  getChildren(knowledge: Knowledge, conceptId: string): Concept[] {
    const concept = this.findConceptById(knowledge, conceptId);
    if (!concept) return [];

    return concept.childConceptIds
      .map((id) => this.findConceptById(knowledge, id))
      .filter((c): c is Concept => c !== undefined);
  }

  getAncestors(knowledge: Knowledge, conceptId: string): Concept[] {
    const ancestors: Concept[] = [];
    let current = this.findConceptById(knowledge, conceptId);
    if (!current) return ancestors;

    while (current.parentConceptId) {
      const parent = this.findConceptById(knowledge, current.parentConceptId);
      if (!parent) break;
      ancestors.push(parent);
      current = parent;
    }

    return ancestors;
  }

  getDescendants(knowledge: Knowledge, conceptId: string): Concept[] {
    const descendants: Concept[] = [];
    const stack = [conceptId];

    while (stack.length > 0) {
      const id = stack.pop()!;
      const concept = this.findConceptById(knowledge, id);
      if (!concept) continue;

      for (const childId of concept.childConceptIds) {
        const child = this.findConceptById(knowledge, childId);
        if (child) {
          descendants.push(child);
          stack.push(childId);
        }
      }
    }

    return descendants;
  }

  computeConceptSimilarity(a: Concept, b: Concept): number {
    let score = 0;
    if (a.category === b.category) score += 0.4;

    const commonAttrs = a.attributeNames.filter((attr) => b.attributeNames.includes(attr));
    score += Math.min(0.3, commonAttrs.length * 0.1);

    if (a.parentConceptId === b.parentConceptId && a.parentConceptId !== undefined) {
      score += 0.3;
    }

    return Math.min(1, score);
  }
}
