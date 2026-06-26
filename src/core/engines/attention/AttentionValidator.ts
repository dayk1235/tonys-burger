import { Attention, AttentionInput } from "./AttentionTypes";
import { AttentionValidationError } from "./AttentionErrors";

export class AttentionValidator {
  validateInput(input: AttentionInput): void {
    if (!input.sourceId || input.sourceId.trim().length === 0) {
      throw new AttentionValidationError("sourceId is required");
    }
    if (!input.name || input.name.trim().length === 0) {
      throw new AttentionValidationError("name is required");
    }
    if (!input.businessId || input.businessId.trim().length === 0) {
      throw new AttentionValidationError("businessId is required");
    }
    if (input.urgency < 0 || input.urgency > 1) {
      throw new AttentionValidationError("urgency must be in [0, 1]");
    }
    if (input.importance < 0 || input.importance > 1) {
      throw new AttentionValidationError("importance must be in [0, 1]");
    }
    if (input.risk < 0 || input.risk > 1) {
      throw new AttentionValidationError("risk must be in [0, 1]");
    }
    if (input.opportunity < 0 || input.opportunity > 1) {
      throw new AttentionValidationError("opportunity must be in [0, 1]");
    }
    if (input.businessValue < 0 || input.businessValue > 1) {
      throw new AttentionValidationError("businessValue must be in [0, 1]");
    }
    if (input.humanValue < 0 || input.humanValue > 1) {
      throw new AttentionValidationError("humanValue must be in [0, 1]");
    }
    if (!input.sourceIds || input.sourceIds.length === 0) {
      throw new AttentionValidationError("at least one sourceId is required");
    }
  }

  validateAttention(attention: Attention): void {
    if (!attention.id) {
      throw new AttentionValidationError("attention id is required");
    }
    if (attention.priority < 0 || attention.priority > 1) {
      throw new AttentionValidationError("priority must be in [0, 1]");
    }
    if (attention.allocation < 0 || attention.allocation > 1) {
      throw new AttentionValidationError("allocation must be in [0, 1]");
    }
  }

  validateBudget(allocation: number, available: number, maxPerItem: number): void {
    if (allocation < 0 || allocation > 1) {
      throw new AttentionValidationError("allocation must be in [0, 1]");
    }
    if (allocation > available) {
      throw new AttentionValidationError(`allocation ${allocation.toFixed(3)} exceeds available budget ${available.toFixed(3)}`);
    }
    if (allocation > maxPerItem) {
      throw new AttentionValidationError(`allocation ${allocation.toFixed(3)} exceeds max per item ${maxPerItem.toFixed(3)}`);
    }
  }
}
