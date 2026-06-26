import { Memory, MemoryInput } from "./MemoryTypes";
import { MemoryValidationError } from "./MemoryErrors";

export class MemoryValidator {
  validateInput(input: MemoryInput): void {
    if (!input.evidenceId || input.evidenceId.trim().length === 0) {
      throw new MemoryValidationError("evidenceId is required");
    }
    if (!input.patternId || input.patternId.trim().length === 0) {
      throw new MemoryValidationError("patternId is required");
    }
    if (!input.name || input.name.trim().length === 0) {
      throw new MemoryValidationError("name is required");
    }
    if (!input.businessId || input.businessId.trim().length === 0) {
      throw new MemoryValidationError("businessId is required");
    }
    if (input.strength < 0 || input.strength > 1) {
      throw new MemoryValidationError("strength must be in [0, 1]");
    }
    if (input.confidence < 0 || input.confidence > 1) {
      throw new MemoryValidationError("confidence must be in [0, 1]");
    }
    if (!input.observationIds || input.observationIds.length === 0) {
      throw new MemoryValidationError("at least one observationId is required");
    }
  }

  validateMemory(memory: Memory): void {
    if (!memory.id) {
      throw new MemoryValidationError("memory id is required");
    }
    if (memory.strength < 0 || memory.strength > 1) {
      throw new MemoryValidationError("memory strength must be in [0, 1]");
    }
    if (memory.confidence < 0 || memory.confidence > 1) {
      throw new MemoryValidationError("memory confidence must be in [0, 1]");
    }
    if (memory.recallScore < 0 || memory.recallScore > 1) {
      throw new MemoryValidationError("memory recallScore must be in [0, 1]");
    }
  }

  validateMemoryInput(input: Record<string, unknown>): MemoryInput {
    const evidence = input.evidence as Record<string, unknown> | undefined;
    if (!evidence) throw new MemoryValidationError("input must contain an evidence object");

    const identity = evidence.identity as Record<string, unknown> | undefined;
    const metadata = evidence.metadata as Record<string, unknown> | undefined;

    return {
      evidenceId: (evidence.id as string) || "",
      patternId: (identity?.patternId as string) || "",
      observationIds: [...((evidence.provenance as Record<string, unknown>)?.sourceObservations as string[] || [])],
      name: (identity?.patternName as string) || "",
      description: (evidence.description as string) || "",
      category: "SALES_PATTERN",
      strength: (evidence.score as number) || 0,
      confidence: (evidence.confidence as number) || 0,
      businessId: "",
    };
  }
}
