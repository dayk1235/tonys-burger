import { DecisionEngineMetrics } from "./DecisionContracts";

export class DecisionMetrics implements DecisionEngineMetrics {
  totalProposalsCreated = 0;
  acceptedProposals = 0;
  rejectedProposals = 0;
  archivedProposals = 0;
  activeProposals = 0;
  averageConfidence = 0;
  averageAlternativesPerProposal = 0;
  proposalsByStage: Record<string, number> = {};

  private confidenceSum = 0;
  private alternativesCountSum = 0;
  private totalCount = 0;

  recordCreated(alternativesCount: number, stage: string): void {
    this.totalProposalsCreated++;
    this.activeProposals++;
    this.alternativesCountSum += alternativesCount;
    this.averageAlternativesPerProposal = this.alternativesCountSum / this.totalProposalsCreated;
    this.proposalsByStage[stage] = (this.proposalsByStage[stage] || 0) + 1;
  }

  recordConfidence(confidence: number): void {
    this.confidenceSum += confidence;
    this.totalCount++;
    this.averageConfidence = this.confidenceSum / this.totalCount;
  }

  recordAccepted(): void {
    this.acceptedProposals++;
    this.activeProposals = Math.max(0, this.activeProposals - 1);
  }

  recordRejected(): void {
    this.rejectedProposals++;
    this.activeProposals = Math.max(0, this.activeProposals - 1);
  }

  recordArchived(): void {
    this.archivedProposals++;
    this.activeProposals = Math.max(0, this.activeProposals - 1);
  }

  recordStageChange(from: string, to: string): void {
    this.proposalsByStage[from] = Math.max(0, (this.proposalsByStage[from] || 0) - 1);
    this.proposalsByStage[to] = (this.proposalsByStage[to] || 0) + 1;
  }

  getSnapshot(): DecisionEngineMetrics {
    return {
      totalProposalsCreated: this.totalProposalsCreated,
      acceptedProposals: this.acceptedProposals,
      rejectedProposals: this.rejectedProposals,
      archivedProposals: this.archivedProposals,
      activeProposals: this.activeProposals,
      averageConfidence: this.averageConfidence,
      averageAlternativesPerProposal: this.averageAlternativesPerProposal,
      proposalsByStage: { ...this.proposalsByStage },
    };
  }

  reset(): void {
    this.totalProposalsCreated = 0;
    this.acceptedProposals = 0;
    this.rejectedProposals = 0;
    this.archivedProposals = 0;
    this.activeProposals = 0;
    this.averageConfidence = 0;
    this.averageAlternativesPerProposal = 0;
    this.proposalsByStage = {};
    this.confidenceSum = 0;
    this.alternativesCountSum = 0;
    this.totalCount = 0;
  }
}
