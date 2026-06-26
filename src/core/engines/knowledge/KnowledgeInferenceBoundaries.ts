import { Knowledge, KnowledgeStage } from "./KnowledgeTypes";
import { KnowledgeBoundaryError } from "./KnowledgeErrors";

export class KnowledgeInferenceBoundaries {
  validateNoPrediction(knowledge: Knowledge): boolean {
    return !["SEMANTIC", "CANONICAL"].includes(knowledge.stage);
  }

  validateNoDecision(knowledge: Knowledge): boolean {
    return knowledge.stage !== "CANDIDATE";
  }

  validateNoPlanning(knowledge: Knowledge): boolean {
    return knowledge.integrity < 0.9;
  }

  validateNoReasoning(knowledge: Knowledge): boolean {
    return knowledge.concepts.length <= 5;
  }

  validateNoInvention(knowledge: Knowledge): boolean {
    return knowledge.provenance.sourceMemoryIds.length > 0;
  }

  validateSupported(knowledge: Knowledge): void {
    if (knowledge.provenance.sourceMemoryIds.length === 0) {
      throw new KnowledgeBoundaryError(
        "Knowledge has no source memory; it invents unsupported facts"
      );
    }
    if (knowledge.provenance.sourceEvidenceIds.length === 0) {
      throw new KnowledgeBoundaryError(
        "Knowledge has no source evidence; it cannot be verified"
      );
    }
  }

  validateBoundaries(knowledge: Knowledge): { passed: boolean; failures: string[] } {
    const failures: string[] = [];

    if (!this.validateNoInvention(knowledge)) {
      failures.push("Knowledge invents facts without source memories");
    }

    if (knowledge.confidence > 0.95 && !this.validateNoPrediction(knowledge)) {
      failures.push("Knowledge has high confidence but stage suggests prediction");
    }

    if (knowledge.abstractionLevel > 0.8 && knowledge.provenance.sourceMemoryIds.length < 3) {
      failures.push("High abstraction with insufficient source variety risks invention");
    }

    if (knowledge.stage === "CANONICAL" && knowledge.metadata.timesValidated < 2) {
      failures.push("Canonical knowledge requires multiple validations");
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  guardExtraction(memory: { stage: string; strength: number; confidence: number }): void {
    if (memory.stage !== "CONSOLIDATED" && memory.stage !== "LONG_TERM" && memory.stage !== "SEMANTIC") {
      throw new KnowledgeBoundaryError(
        `Cannot extract knowledge from memory in stage "${memory.stage}"; only consolidated/long-term/semantic`
      );
    }
    if (memory.strength < 0.4) {
      throw new KnowledgeBoundaryError(
        `Cannot extract knowledge from memory with strength ${memory.strength.toFixed(2)}; minimum 0.4`
      );
    }
    if (memory.confidence < 0.4) {
      throw new KnowledgeBoundaryError(
        `Cannot extract knowledge from memory with confidence ${memory.confidence.toFixed(2)}; minimum 0.4`
      );
    }
  }

  guardGeneralization(sourceCount: number): void {
    if (sourceCount < 2) {
      throw new KnowledgeBoundaryError(
        `Cannot generalize from ${sourceCount} sources; need at least 2`
      );
    }
  }

  guardSpecialization(abstractionLevel: number): void {
    if (abstractionLevel < 0.2) {
      throw new KnowledgeBoundaryError(
        "Cannot specialize knowledge with abstraction level below 0.2"
      );
    }
  }
}
