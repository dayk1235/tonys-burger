import { DecisionStage, DecisionAlternative } from "./DecisionTypes";

export interface DecisionSubscriber {
  onProposalCreated(proposalId: string, alternatives: readonly DecisionAlternative[]): Promise<void>;
  onProposalStageChanged(proposalId: string, from: DecisionStage, to: DecisionStage): Promise<void>;
  onProposalAccepted(proposalId: string): Promise<void>;
  onProposalRejected(proposalId: string): Promise<void>;
  onProposalArchived(proposalId: string): Promise<void>;
}

export interface DecisionQuery {
  findById(id: string): Promise<unknown>;
  findActive(): Promise<unknown[]>;
  findArchived(): Promise<unknown[]>;
  findByReasoningId(reasoningId: string): Promise<unknown[]>;
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
