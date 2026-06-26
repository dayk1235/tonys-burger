import { Concept, GraphEdgeType, OntologyRelationship, KnowledgeCategory } from "./KnowledgeTypes";
import { KnowledgeOntologyError } from "./KnowledgeErrors";

export interface OntologyEntry {
  readonly conceptName: string;
  readonly category: KnowledgeCategory;
  readonly attributes: readonly string[];
  readonly parentConceptName?: string;
  readonly relationships: readonly { targetName: string; type: GraphEdgeType }[];
}

export class KnowledgeOntology {
  private entries: Map<string, OntologyEntry> = new Map();
  private relationships: OntologyRelationship[] = [];

  registerConcept(entry: OntologyEntry): void {
    if (this.entries.has(entry.conceptName)) {
      throw new KnowledgeOntologyError(`Concept "${entry.conceptName}" already registered`);
    }
    this.entries.set(entry.conceptName, entry);
  }

  getConcept(name: string): OntologyEntry | undefined {
    return this.entries.get(name);
  }

  hasConcept(name: string): boolean {
    return this.entries.has(name);
  }

  getAllConcepts(): OntologyEntry[] {
    return Array.from(this.entries.values());
  }

  addRelationship(rel: OntologyRelationship): void {
    this.relationships.push(rel);
  }

  getRelationships(): readonly OntologyRelationship[] {
    return this.relationships;
  }

  getRelationshipsForConcept(conceptId: string): OntologyRelationship[] {
    return this.relationships.filter(
      (r) => r.sourceConceptId === conceptId || r.targetConceptId === conceptId
    );
  }

  buildConceptHierarchy(concepts: Concept[]): Concept[] {
    const conceptMap = new Map(concepts.map((c) => [c.id, c]));
    const enriched: Concept[] = [];

    for (const concept of concepts) {
      const entry = this.entries.get(concept.name);
      if (entry?.parentConceptName) {
        const parent = concepts.find((c) => c.name === entry.parentConceptName);
        if (parent) {
          enriched.push({
            ...concept,
            parentConceptId: parent.id,
          });
          const parentIndex = enriched.findIndex((c) => c.id === parent.id);
          if (parentIndex !== -1) {
            enriched[parentIndex] = {
              ...enriched[parentIndex],
              childConceptIds: [...enriched[parentIndex].childConceptIds, concept.id],
            };
          }
          continue;
        }
      }
      enriched.push(concept);
    }

    return enriched;
  }

  findPath(
    sourceName: string,
    targetName: string,
    maxDepth = 5
  ): OntologyRelationship[] | null {
    const visited = new Set<string>();
    const path: OntologyRelationship[] = [];

    const dfs = (currentName: string, depth: number): boolean => {
      if (depth > maxDepth) return false;
      if (visited.has(currentName)) return false;
      visited.add(currentName);

      const entry = this.entries.get(currentName);
      if (!entry) return false;

      for (const rel of entry.relationships) {
        const relEntry = this.entries.get(rel.targetName);
        if (!relEntry) continue;

        const firstConcept = this.findConceptByName(currentName);
        const secondConcept = this.findConceptByName(rel.targetName);
        if (!firstConcept || !secondConcept) continue;

        const ontRel: OntologyRelationship = {
          sourceConceptId: firstConcept.id,
          targetConceptId: secondConcept.id,
          type: rel.type,
          strength: 0.5,
          discoveredAt: new Date().toISOString(),
          metadata: {},
        };

        path.push(ontRel);

        if (rel.targetName === targetName) return true;

        if (dfs(rel.targetName, depth + 1)) return true;
        path.pop();
      }

      return false;
    };

    return dfs(sourceName, 0) ? path : null;
  }

  getConceptCount(): number {
    return this.entries.size;
  }

  clear(): void {
    this.entries.clear();
    this.relationships = [];
  }

  private findConceptByName(name: string): Concept | undefined {
    for (const entry of this.entries.values()) {
      if (entry.conceptName === name) {
        return {
          id: `ont_${name}`,
          name,
          description: "",
          category: entry.category,
          childConceptIds: [],
          attributeNames: [],
          createdAt: new Date().toISOString(),
        };
      }
    }
    return undefined;
  }
}
