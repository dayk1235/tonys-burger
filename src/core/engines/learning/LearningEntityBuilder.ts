import {
  LearningInput,
  LearningEntity,
  LearningStage,
  ResultStatus,
} from "./LearningTypes";

export class LearningEntityBuilder {
  buildFromDecision(input: LearningInput): LearningEntity {
    const learningId = `learn-${input.decisionId}`;
    const now = input.timestamp;

    return {
      id: learningId,
      decisionId: input.decisionId,
      stage: "INITIATED",
      decisionLabel: input.decisionLabel,
      decisionOutcome: input.decisionOutcome,
      expectedResult: input.expectedResult,
      actualResult: input.actualResult,
      resultStatus: this.determineInitialStatus(input.actualResult),
      confidence: input.confidence,
      rationale: input.rationale,
      businessId: input.businessId,
      createdAt: now,
      updatedAt: now,
    };
  }

  advanceStage(entity: LearningEntity, newStage: LearningStage): LearningEntity {
    return {
      ...entity,
      stage: newStage,
      updatedAt: new Date().toISOString(),
    };
  }

  updateResultStatus(entity: LearningEntity, newStatus: ResultStatus): LearningEntity {
    return {
      ...entity,
      resultStatus: newStatus,
      updatedAt: new Date().toISOString(),
    };
  }

  updateActualResult(entity: LearningEntity, actualResult: string, newStatus: ResultStatus): LearningEntity {
    return {
      ...entity,
      actualResult,
      resultStatus: newStatus,
      updatedAt: new Date().toISOString(),
    };
  }

  private determineInitialStatus(actualResult: string): ResultStatus {
    if (actualResult === "PENDING" || actualResult === "") return "PENDING";
    return "PARTIALLY_ACHIEVED";
  }
}
