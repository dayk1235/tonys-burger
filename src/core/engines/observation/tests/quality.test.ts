/**
 * @file quality.test.ts
 * @description Unit tests for quality profiling and confidence rating.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { ObservationQuality } from "../ObservationQuality";
import { ObservationCategory, ObservationStage, Observation } from "../ObservationTypes";

const createBaseObservation = (id: string, timestamp: string, payload: Record<string, unknown>): Observation => ({
  id,
  stage: ObservationStage.CONTEXTUALIZED,
  category: ObservationCategory.OPERATIONAL,
  timestamp,
  captureTime: new Date().toISOString(),
  businessId: "biz_123",
  source: { id: "pos_1", name: "POS 1", type: "POS", trustScore: 0.95 },
  payload,
  evidence: "Manual input",
  confidence: { score: 0.5, history: [], sourceWeight: 0.95, freshnessWeight: 1, consistencyWeight: 1 },
  context: {
    spatial: { locationId: "loc_1", zone: "dining_room" },
    temporal: { timeOfDay: "12:00:00", dayOfWeek: "Monday", isHoliday: false, servicePeriod: "lunch", season: "spring" },
    behavior: { actionType: "none", observedImpact: "none" },
    operational: { staffingLevel: "optimal", inventoryAlertsCount: 0, activePromotions: [] },
    environmental: { localEventsNearRestaurant: [] }
  },
  relationships: { relatedObservations: [], supportedPatterns: [], supportedKnowledge: [], supportedRecommendations: [], associatedDecisions: [] },
  importance: 0.5,
  attentionScore: 0.5,
  isDeprecated: false
});

test("Observation Quality — Standalone observation grades high confidence", () => {
  const quality = new ObservationQuality();
  const obs = createBaseObservation("obs_1", new Date().toISOString(), { covers: 4 });
  
  const result = quality.evaluateQuality(obs);
  
  assert.ok(result.confidenceScore > 0.85); // High score for verified, fresh standalone
  assert.equal(result.profile.uniqueness, 1.0);
  assert.equal(result.profile.consistency, 1.0);
  assert.equal(result.profile.freshness, 1.0);
});

test("Observation Quality — Stale observations decay freshness score", () => {
  const quality = new ObservationQuality();
  
  // Create observation that occurred 5 hours ago (operational threshold is 30 mins)
  const occurrenceTime = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
  const obs = createBaseObservation("obs_1", occurrenceTime, { covers: 4 });
  
  const result = quality.evaluateQuality(obs);
  
  assert.ok(result.profile.freshness < 0.5); // decayed freshness
  assert.ok(result.confidenceScore < 0.80); // reduced overall confidence
});

test("Observation Quality — Identical observations trigger duplicate (uniqueness) penalty", () => {
  const quality = new ObservationQuality();
  const time = new Date().toISOString();
  
  const obs1 = createBaseObservation("obs_1", time, { covers: 4 });
  const obs2 = createBaseObservation("obs_2", time, { covers: 4 }); // exact duplicate payload, source, time
  
  const result = quality.evaluateQuality(obs2, [obs1]);
  
  assert.equal(result.profile.uniqueness, 0.1); // duplicate detected
  assert.ok(result.confidenceScore < 0.82);
});

test("Observation Quality — Conflicting financials trigger consistency penalty", () => {
  const quality = new ObservationQuality();
  const time = new Date().toISOString();
  
  const financial1: Observation = {
    ...createBaseObservation("f1", time, { amount: 150 }),
    category: ObservationCategory.FINANCIAL
  };
  
  const financial2: Observation = {
    ...createBaseObservation("f2", time, { amount: 200 }), // conflicting sale amount at the same time
    category: ObservationCategory.FINANCIAL
  };

  const result = quality.evaluateQuality(financial2, [financial1]);
  
  assert.equal(result.profile.consistency, 0.2); // contradiction detected
});
