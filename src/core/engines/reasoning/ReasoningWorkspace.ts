import {
  Reasoning,
  ReasoningContextSnapshot,
  ReasoningHypothesis,
  ReasoningAlternative,
  ReasoningConstraint,
  ReasoningTradeoff,
  ReasoningConclusion,
  ReasoningTreeStep,
} from "./ReasoningTypes";

export interface ReasoningWorkspaceData {
  readonly reasoningId: string;
  context: ReasoningContextSnapshot;
  evidenceIds: string[];
  knowledgeIds: string[];
  hypotheses: ReasoningHypothesis[];
  alternatives: ReasoningAlternative[];
  constraints: ReasoningConstraint[];
  tradeoffs: ReasoningTradeoff[];
  conclusion: ReasoningConclusion | null;
  tree: ReasoningTreeStep[];
  isActive: boolean;
  readonly createdAt: string;
}

export class ReasoningWorkspace {
  private workspaces: Map<string, ReasoningWorkspaceData> = new Map();

  create(reasoning: Reasoning): ReasoningWorkspaceData {
    const data: ReasoningWorkspaceData = {
      reasoningId: reasoning.id,
      context: reasoning.context,
      evidenceIds: [],
      knowledgeIds: [],
      hypotheses: [],
      alternatives: [],
      constraints: [],
      tradeoffs: [],
      conclusion: null,
      tree: [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.workspaces.set(reasoning.id, data);
    return data;
  }

  get(reasoningId: string): ReasoningWorkspaceData | undefined {
    return this.workspaces.get(reasoningId);
  }

  updateHypotheses(reasoningId: string, hypotheses: ReasoningHypothesis[]): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.hypotheses = hypotheses;
  }

  updateAlternatives(reasoningId: string, alternatives: ReasoningAlternative[]): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.alternatives = alternatives;
  }

  updateConstraints(reasoningId: string, constraints: ReasoningConstraint[]): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.constraints = constraints;
  }

  updateTradeoffs(reasoningId: string, tradeoffs: ReasoningTradeoff[]): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.tradeoffs = tradeoffs;
  }

  updateConclusion(reasoningId: string, conclusion: ReasoningConclusion): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.conclusion = conclusion;
  }

  addTreeStep(reasoningId: string, step: ReasoningTreeStep): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.tree = [...ws.tree, step];
  }

  addEvidence(reasoningId: string, ...evidenceIds: string[]): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.evidenceIds = [...ws.evidenceIds, ...evidenceIds];
  }

  addKnowledge(reasoningId: string, ...knowledgeIds: string[]): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.knowledgeIds = [...ws.knowledgeIds, ...knowledgeIds];
  }

  complete(reasoningId: string): void {
    const ws = this.workspaces.get(reasoningId);
    if (ws) ws.isActive = false;
  }

  clear(reasoningId: string): void {
    this.workspaces.delete(reasoningId);
  }

  isActive(reasoningId: string): boolean {
    return this.workspaces.get(reasoningId)?.isActive ?? false;
  }

  getAllActive(): string[] {
    return Array.from(this.workspaces.entries())
      .filter(([, ws]) => ws.isActive)
      .map(([id]) => id);
  }

  count(): number {
    return this.workspaces.size;
  }
}
