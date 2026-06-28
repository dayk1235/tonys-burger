import { Reasoning, ReasoningTreeStep } from "./ReasoningTypes";

export class ReasoningTree {
  private currentStepId = 0;

  addStep(
    reasoning: Reasoning,
    stepType: string,
    description: string,
    parentId: string | null,
    hypothesisId: string | null,
    evidenceId: string | null,
    confidence: number
  ): ReasoningTreeStep {
    const id = `tree_${++this.currentStepId}_${Date.now()}`;
    const now = new Date().toISOString();

    const step: ReasoningTreeStep = {
      id, stepType, description, parentId,
      children: [], hypothesisId, evidenceId,
      confidence, timestamp: now,
    };

    return step;
  }

  buildTree(steps: readonly ReasoningTreeStep[]): ReasoningTreeStep[] {
    if (steps.length === 0) return [];

    const stepMap = new Map(steps.map((s) => [s.id, { ...s }]));

    for (const step of stepMap.values()) {
      if (step.parentId && stepMap.has(step.parentId)) {
        const parent = stepMap.get(step.parentId)!;
        parent.children = [...parent.children, step.id];
      }
    }

    return Array.from(stepMap.values());
  }

  findRoot(steps: readonly ReasoningTreeStep[]): ReasoningTreeStep | undefined {
    return steps.find((s) => s.parentId === null);
  }

  findPath(steps: readonly ReasoningTreeStep[], fromId: string, toId: string): ReasoningTreeStep[] {
    const adjacency = new Map<string, string[]>();
    for (const step of steps) {
      const neighbors = adjacency.get(step.id) || [];
      if (step.parentId) neighbors.push(step.parentId);
      neighbors.push(...step.children);
      adjacency.set(step.id, neighbors);
    }

    const visited = new Set<string>();
    const queue: { id: string; path: ReasoningTreeStep[] }[] = [];

    const startStep = steps.find((s) => s.id === fromId);
    if (!startStep) return [];

    queue.push({ id: fromId, path: [startStep] });
    visited.add(fromId);

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      if (id === toId) return path;

      const neighbors = adjacency.get(id) || [];
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          const neighborStep = steps.find((s) => s.id === neighborId);
          if (neighborStep) {
            queue.push({ id: neighborId, path: [...path, neighborStep] });
          }
        }
      }
    }

    return [];
  }

  getStepTypeDistribution(steps: readonly ReasoningTreeStep[]): Record<string, number> {
    const dist: Record<string, number> = {};
    for (const step of steps) {
      dist[step.stepType] = (dist[step.stepType] || 0) + 1;
    }
    return dist;
  }

  getDepth(steps: readonly ReasoningTreeStep[]): number {
    if (steps.length === 0) return 0;
    const root = this.findRoot(steps);
    if (!root) return 0;

    const computeDepth = (nodeId: string, depth: number, visited: Set<string>): number => {
      if (visited.has(nodeId)) return depth;
      visited.add(nodeId);

      const node = steps.find((s) => s.id === nodeId);
      if (!node || node.children.length === 0) return depth;

      return Math.max(...node.children.map((childId) => computeDepth(childId, depth + 1, visited)));
    };

    return computeDepth(root.id, 1, new Set());
  }

  getNodeCount(steps: readonly ReasoningTreeStep[]): number {
    return steps.length;
  }
}
