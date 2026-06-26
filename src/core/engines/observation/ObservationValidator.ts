/**
 * @file ObservationValidator.ts
 * @description Invariant validator for observations. Enforces structure, temporal constraints,
 * and category-specific payload invariants.
 */

import { Observation, ObservationCategory } from "./ObservationTypes";
import { VerificationError, BoundaryValidationError } from "./ObservationErrors";

/**
 * Validator class that verifies observations and potential inputs against system invariants.
 */
export class ObservationValidator {
  
  /**
   * Validates a raw input stimulus structure before processing.
   * Enforces rejection gates.
   */
  public validateRawInput(input: Record<string, unknown>): void {
    if (!input) {
      throw new VerificationError("Raw input is null or undefined.");
    }
    
    // Check required raw fields
    if (typeof input.businessId !== "string" || !input.businessId.trim()) {
      throw new VerificationError("Missing or invalid businessId in input.");
    }
    
    if (typeof input.category !== "string" || !Object.values(ObservationCategory).includes(input.category as ObservationCategory)) {
      throw new VerificationError(`Missing or invalid category: ${input.category}`);
    }
    
    if (!input.payload || typeof input.payload !== "object") {
      throw new VerificationError("Missing or invalid payload in input.");
    }
    
    if (!input.source || typeof input.source !== "object") {
      throw new VerificationError("Missing or invalid source definition in input.");
    }
    
    const src = input.source as Record<string, unknown>;
    if (typeof src.id !== "string" || !src.id.trim()) {
      throw new VerificationError("Missing or invalid source id.");
    }
    if (typeof src.trustScore !== "number" || src.trustScore < 0 || src.trustScore > 1) {
      throw new VerificationError("Source trustScore must be a number between 0 and 1.");
    }
    
    // Enforce temporal invariant: timestamp cannot be in the future
    if (input.timestamp) {
      const timestamp = new Date(input.timestamp as string).getTime();
      const now = Date.now();
      if (isNaN(timestamp)) {
        throw new VerificationError("Invalid timestamp format.");
      }
      if (timestamp > now + 5000) { // Allow 5 seconds tolerance for clock skew
        throw new VerificationError("Occurrence timestamp cannot be in the future.");
      }
    }
    
    // Category-specific validation
    this.validateCategoryInvariants(input.category as ObservationCategory, input.payload as Record<string, unknown>);
  }

  /**
   * Validates structural invariants of a complete Observation object.
   */
  public validateObservation(observation: Observation): void {
    if (!observation.id) {
      throw new VerificationError("Observation identity must be assigned.");
    }
    if (!observation.timestamp) {
      throw new VerificationError("Observation timestamp is required.");
    }
    if (!observation.captureTime) {
      throw new VerificationError("Observation captureTime is required.");
    }
    if (observation.confidence.score <= 0 || observation.confidence.score >= 1) {
      throw new VerificationError("Confidence score must be strictly between 0 and 1 (non-zero and non-absolute).");
    }
    
    // Enforce cognitive boundary: ensure no opinions, predictions, or judgments exist in the payload as factual claims
    const payload = observation.payload;
    if (payload.opinion !== undefined || payload.prediction !== undefined || payload.judgment !== undefined) {
      throw new BoundaryValidationError("Observation payload must not contain interpretations, predictions, or judgments.");
    }
  }

  /**
   * Enforces specific invariants per observation category.
   */
  private validateCategoryInvariants(category: ObservationCategory, payload: Record<string, unknown>): void {
    switch (category) {
      case ObservationCategory.OPERATIONAL:
        // Must contain operational event indicator
        if (payload.event === undefined && payload.covers === undefined && payload.serviceTimeMinutes === undefined) {
          throw new VerificationError("Operational observations must define an event, covers count, or service time.");
        }
        break;
      case ObservationCategory.FINANCIAL:
        // Must contain amount, revenue or cost values
        if (typeof payload.revenue !== "number" && typeof payload.cost !== "number" && typeof payload.amount !== "number") {
          throw new VerificationError("Financial observations must contain numeric values for revenue, cost, or amount.");
        }
        break;
      case ObservationCategory.INVENTORY:
        // Must reference item and level
        if (typeof payload.itemSku !== "string" && typeof payload.itemId !== "string") {
          throw new VerificationError("Inventory observations must specify item SKU or ID.");
        }
        if (typeof payload.level !== "number" && typeof payload.quantityChange !== "number") {
          throw new VerificationError("Inventory observations must contain a level or quantityChange metric.");
        }
        break;
      case ObservationCategory.BEHAVIORAL:
        // Must track actions
        if (typeof payload.action !== "string") {
          throw new VerificationError("Behavioral observations must contain a string 'action' payload.");
        }
        break;
      default:
        break;
    }
  }
}
