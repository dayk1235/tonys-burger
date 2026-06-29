import { DecisionStage, DecisionAlternative, DecisionResult, AlternativeEvaluation } from "./DecisionTypes";

export interface DecisionSubscriber {
  onProposalCreated(proposalId: string, alternatives: readonly DecisionAlternative[]): Promise<void>;
  onProposalStageChanged(proposalId: string, from: DecisionStage, to: DecisionStage): Promise<void>;
  onProposalAccepted(proposalId: string): Promise<void>;
  onProposalRejected(proposalId: string): Promise<void>;
  onProposalArchived(proposalId: string): Promise<void>;
}

export interface DecisionQuery {
  findById(id: string): Promise<DecisionResult | undefined>;
  findActive(): Promise<DecisionResult[]>;
  findArchived(): Promise<DecisionResult[]>;
  findByReasoningId(reasoningId: string): Promise<DecisionResult[]>;
  findAll(): Promise<DecisionResult[]>;
}

export interface DecisionEvaluatorContract {
  evaluateAlternatives(alternatives: readonly DecisionAlternative[]): {
    evaluations: AlternativeEvaluation[];
    selectedAlternativeId: string | null;
    selectedLabel: string;
    bestScore: number;
  };
  computeConfidence(reasoningConfidence: number, bestAlternativeScore: number): number;
  generateRationale(evaluations: AlternativeEvaluation[], selectedAlternativeId: string | null, selectedLabel: string): string;
}

export interface DecisionEngineMetrics {
  readonly totalProposalsCreated: number;
  readonly acceptedProposals: number;
  readonly rejectedProposals: number;
  readonly archivedProposals: number;
  readonly activeProposals: number;
  readonly averageConfidence: number;
  readonly averageAlternativesPerProposal: number;
  readonly proposalsByStage: Record<string, number>;
}
