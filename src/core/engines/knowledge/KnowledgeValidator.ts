import { Knowledge, KnowledgeInput } from "./KnowledgeTypes";
import { KnowledgeValidationError } from "./KnowledgeErrors";

export class KnowledgeValidator {
  validateInput(input: KnowledgeInput): void {
    if (!input.memoryId || input.memoryId.trim().length === 0) {
      throw new KnowledgeValidationError("memoryId is required");
    }
    if (!input.patternId || input.patternId.trim().length === 0) {
      throw new KnowledgeValidationError("patternId is required");
    }
    if (!input.name || input.name.trim().length === 0) {
      throw new KnowledgeValidationError("name is required");
    }
    if (!input.businessId || input.businessId.trim().length === 0) {
      throw new KnowledgeValidationError("businessId is required");
    }
    if (input.confidence < 0 || input.confidence > 1) {
      throw new KnowledgeValidationError("confidence must be in [0, 1]");
    }
    if (input.integrity < 0 || input.integrity > 1) {
      throw new KnowledgeValidationError("integrity must be in [0, 1]");
    }
    if (!input.evidenceIds || input.evidenceIds.length === 0) {
      throw new KnowledgeValidationError("at least one evidenceId is required");
    }
  }

  validateKnowledge(knowledge: Knowledge): void {
    if (!knowledge.id) {
      throw new KnowledgeValidationError("knowledge id is required");
    }
    if (knowledge.confidence < 0 || knowledge.confidence > 1) {
      throw new KnowledgeValidationError("knowledge confidence must be in [0, 1]");
    }
    if (knowledge.integrity < 0 || knowledge.integrity > 1) {
      throw new KnowledgeValidationError("knowledge integrity must be in [0, 1]");
    }
  }

  validateKnowledgeInput(input: Record<string, unknown>): KnowledgeInput {
    const memory = input.memory as Record<string, unknown> | undefined;
    if (!memory) throw new KnowledgeValidationError("input must contain a memory object");

    const identity = memory.identity as Record<string, unknown> | undefined;
    const provenance = memory.provenance as Record<string, unknown> | undefined;

    return {
      memoryId: (memory.id as string) || "",
      patternId: (identity?.patternId as string) || "",
      evidenceIds: [...((provenance?.sourceEvidenceIds as string[]) || [])],
      name: (identity?.name as string) || "",
      description: (memory.description as string) || "",
      category: (identity?.category as KnowledgeInput["category"]) || "GENERAL",
      confidence: (memory.confidence as number) || 0,
      integrity: (memory.integrity as number) ?? ((memory.confidence as number) || 0),
      businessId: (input.businessId as string) || "",
    };
  }
}
