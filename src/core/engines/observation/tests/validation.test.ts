/**
 * @file validation.test.ts
 * @description Unit tests for Observation validation, boundary validation, and invariants.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { ObservationValidator } from "../ObservationValidator";
import { ObservationCategory, ObservationStage } from "../ObservationTypes";
import { VerificationError, BoundaryValidationError } from "../ObservationErrors";

test("Observation Validator — Valid raw inputs pass validation", () => {
  const validator = new ObservationValidator();
  
  const validInput = {
    businessId: "biz_123",
    category: ObservationCategory.OPERATIONAL,
    source: {
      id: "pos_register_1",
      name: "Main Register",
      type: "POS",
      trustScore: 0.95
    },
    payload: {
      event: "sale_completed",
      covers: 2,
      serviceTimeMinutes: 12
    },
    timestamp: new Date().toISOString()
  };

  assert.doesNotThrow(() => {
    validator.validateRawInput(validInput);
  });
});

test("Observation Validator — Missing required fields throws VerificationError", () => {
  const validator = new ObservationValidator();

  assert.throws(() => {
    validator.validateRawInput({
      businessId: "", // Empty
      category: ObservationCategory.OPERATIONAL,
      source: { id: "pos", name: "POS", type: "POS", trustScore: 0.9 },
      payload: { event: "sale" }
    });
  }, VerificationError);

  assert.throws(() => {
    validator.validateRawInput({
      businessId: "biz_123",
      category: "INVALID_CAT", // Invalid
      source: { id: "pos", name: "POS", type: "POS", trustScore: 0.9 },
      payload: { event: "sale" }
    });
  }, VerificationError);

  assert.throws(() => {
    validator.validateRawInput({
      businessId: "biz_123",
      category: ObservationCategory.OPERATIONAL,
      source: { id: "pos", name: "POS", type: "POS", trustScore: 1.5 }, // Trust score > 1
      payload: { event: "sale" }
    });
  }, VerificationError);
});

test("Observation Validator — Future timestamps throw VerificationError", () => {
  const validator = new ObservationValidator();
  const futureTime = new Date(Date.now() + 60000).toISOString(); // 1 minute in future

  assert.throws(() => {
    validator.validateRawInput({
      businessId: "biz_123",
      category: ObservationCategory.OPERATIONAL,
      source: { id: "pos", name: "POS", type: "POS", trustScore: 0.9 },
      payload: { event: "sale" },
      timestamp: futureTime
    });
  }, VerificationError);
});

test("Observation Validator — Category invariants are enforced", () => {
  const validator = new ObservationValidator();

  // Financial category requires revenue, cost or amount
  assert.throws(() => {
    validator.validateRawInput({
      businessId: "biz_123",
      category: ObservationCategory.FINANCIAL,
      source: { id: "pos", name: "POS", type: "POS", trustScore: 0.9 },
      payload: { items: ["burger"] } // missing numeric revenue/cost/amount
    });
  }, VerificationError);

  // Inventory category requires itemsku/id and level/quantityChange
  assert.throws(() => {
    validator.validateRawInput({
      businessId: "biz_123",
      category: ObservationCategory.INVENTORY,
      source: { id: "pos", name: "POS", type: "POS", trustScore: 0.9 },
      payload: { status: "checked" } // missing SKU and levels
    });
  }, VerificationError);
});

test("Observation Validator — Cognitive boundaries reject interpretations/predictions", () => {
  const validator = new ObservationValidator();

  const mockObs = {
    id: "obs_1",
    stage: ObservationStage.VERIFIED,
    category: ObservationCategory.OPERATIONAL,
    timestamp: new Date().toISOString(),
    captureTime: new Date().toISOString(),
    businessId: "biz_123",
    source: { id: "pos", name: "POS", type: "POS" as const, trustScore: 0.9 },
    payload: {
      event: "sale",
      opinion: "The customer seemed very happy." // Cognitive Boundary Violation
    },
    evidence: "Receipt print",
    confidence: { score: 0.9, history: [], sourceWeight: 0.9, freshnessWeight: 1.0, consistencyWeight: 1.0 },
    context: {
      spatial: { locationId: "loc_1", zone: "kitchen" as const },
      temporal: { timeOfDay: "12:00:00", dayOfWeek: "Monday" as const, isHoliday: false, servicePeriod: "lunch" as const, season: "spring" as const },
      behavior: { actionType: "none", observedImpact: "none" },
      operational: { staffingLevel: "optimal" as const, inventoryAlertsCount: 0, activePromotions: [] },
      environmental: { localEventsNearRestaurant: [] }
    },
    relationships: { relatedObservations: [], supportedPatterns: [], supportedKnowledge: [], supportedRecommendations: [], associatedDecisions: [] },
    importance: 0.5,
    attentionScore: 0.5,
    isDeprecated: false
  };

  assert.throws(() => {
    validator.validateObservation(mockObs);
  }, BoundaryValidationError);
});
