import { Knowledge, GraphNode, GraphEdge, GraphNodeType, GraphEdgeType } from "./KnowledgeTypes";

export interface GraphQuery {
  readonly nodeType?: GraphNodeType;
  readonly edgeType?: GraphEdgeType;
  readonly minWeight?: number;
  readonly maxDepth?: number;
  readonly startNodeId?: string;
}

export interface GraphPath {
  readonly nodes: GraphNode[];
  readonly edges: GraphEdge[];
  readonly totalWeight: number;
  readonly nodeCount: number;
}

export class KnowledgeGraph {
  getNodes(knowledge: Knowledge): readonly GraphNode[] {
    return knowledge.graphNodes;
  }

  getEdges(knowledge: Knowledge): readonly GraphEdge[] {
    return knowledge.graphEdges;
  }

  getNodeById(knowledge: Knowledge, nodeId: string): GraphNode | undefined {
    return knowledge.graphNodes.find((n) => n.id === nodeId);
  }

  getEdgeById(knowledge: Knowledge, edgeId: string): GraphEdge | undefined {
    return knowledge.graphEdges.find((e) => e.id === edgeId);
  }

  getNodesByType(knowledge: Knowledge, type: GraphNodeType): GraphNode[] {
    return knowledge.graphNodes.filter((n) => n.type === type);
  }

  getEdgesByType(knowledge: Knowledge, type: GraphEdgeType): GraphEdge[] {
    return knowledge.graphEdges.filter((e) => e.type === type);
  }

  getNeighbors(knowledge: Knowledge, nodeId: string): GraphNode[] {
    const neighborIds = new Set<string>();
    for (const edge of knowledge.graphEdges) {
      if (edge.sourceId === nodeId) neighborIds.add(edge.targetId);
      if (edge.targetId === nodeId) neighborIds.add(edge.sourceId);
    }
    return knowledge.graphNodes.filter((n) => neighborIds.has(n.id));
  }

  findPath(
    knowledge: Knowledge,
    startNodeId: string,
    endNodeId: string,
    maxDepth = 5
  ): GraphPath | null {
    const visited = new Set<string>();
    const pathNodes: GraphNode[] = [];
    const pathEdges: GraphEdge[] = [];

    const dfs = (currentId: string, depth: number): boolean => {
      if (depth > maxDepth) return false;
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const currentNode = this.getNodeById(knowledge, currentId);
      if (!currentNode) return false;
      pathNodes.push(currentNode);

      if (currentId === endNodeId) return true;

      const outgoingEdges = knowledge.graphEdges.filter((e) => e.sourceId === currentId);
      for (const edge of outgoingEdges) {
        pathEdges.push(edge);
        if (dfs(edge.targetId, depth + 1)) return true;
        pathEdges.pop();
      }

      pathNodes.pop();
      return false;
    };

    if (!dfs(startNodeId, 0)) return null;

    const totalWeight = pathEdges.reduce((s, e) => s + e.weight, 0);

    return {
      nodes: pathNodes,
      edges: pathEdges,
      totalWeight,
      nodeCount: pathNodes.length,
    };
  }

  query(knowledge: Knowledge, query: GraphQuery): { nodes: GraphNode[]; edges: GraphEdge[] } {
    let nodes = [...knowledge.graphNodes];
    let edges = [...knowledge.graphEdges];

    if (query.nodeType) {
      nodes = nodes.filter((n) => n.type === query.nodeType);
    }

    if (query.edgeType) {
      edges = edges.filter((e) => e.type === query.edgeType);
    }

    if (query.minWeight !== undefined) {
      edges = edges.filter((e) => e.weight >= query.minWeight!);
    }

    if (query.startNodeId) {
      const reachable = this.getReachableNodes(knowledge, query.startNodeId, query.maxDepth || 5);
      const reachableIds = new Set(reachable.map((n) => n.id));
      nodes = nodes.filter((n) => reachableIds.has(n.id));
      edges = edges.filter(
        (e) => reachableIds.has(e.sourceId) && reachableIds.has(e.targetId)
      );
    }

    return { nodes, edges };
  }

  computeGraphStats(knowledge: Knowledge): {
    nodeCount: number;
    edgeCount: number;
    density: number;
    avgWeight: number;
    connectivity: number;
  } {
    const nodeCount = knowledge.graphNodes.length;
    const edgeCount = knowledge.graphEdges.length;

    const possibleEdges = nodeCount * (nodeCount - 1);
    const density = possibleEdges > 0 ? edgeCount / possibleEdges : 0;

    const avgWeight = edgeCount > 0
      ? knowledge.graphEdges.reduce((s, e) => s + e.weight, 0) / edgeCount
      : 0;

    const componentCount = this.countComponents(knowledge);
    const connectivity = componentCount > 0 ? 1 / componentCount : 0;

    return { nodeCount, edgeCount, density, avgWeight, connectivity };
  }

  private getReachableNodes(
    knowledge: Knowledge,
    startId: string,
    maxDepth: number
  ): GraphNode[] {
    const visited = new Set<string>();
    const reachable: GraphNode[] = [];
    const stack: Array<{ id: string; depth: number }> = [{ id: startId, depth: 0 }];

    while (stack.length > 0) {
      const { id, depth } = stack.pop()!;
      if (visited.has(id) || depth > maxDepth) continue;
      visited.add(id);

      const node = this.getNodeById(knowledge, id);
      if (node) reachable.push(node);

      for (const edge of knowledge.graphEdges) {
        if (edge.sourceId === id) {
          stack.push({ id: edge.targetId, depth: depth + 1 });
        }
        if (edge.targetId === id) {
          stack.push({ id: edge.sourceId, depth: depth + 1 });
        }
      }
    }

    return reachable;
  }

  private countComponents(knowledge: Knowledge): number {
    const visited = new Set<string>();
    let components = 0;

    for (const node of knowledge.graphNodes) {
      if (visited.has(node.id)) continue;
      components++;
      const stack = [node.id];
      while (stack.length > 0) {
        const id = stack.pop()!;
        if (visited.has(id)) continue;
        visited.add(id);
        for (const edge of knowledge.graphEdges) {
          if (edge.sourceId === id && !visited.has(edge.targetId)) {
            stack.push(edge.targetId);
          }
          if (edge.targetId === id && !visited.has(edge.sourceId)) {
            stack.push(edge.sourceId);
          }
        }
      }
    }

    return components || 1;
  }
}
