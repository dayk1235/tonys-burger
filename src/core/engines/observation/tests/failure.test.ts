/**
 * @file failure.test.ts
 * @description Unit tests validating pipeline recovery, rejection gates, and failure detection.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { ObservationPipeline } from "../ObservationPipeline";
import { ObservationMetrics } from "../ObservationMetrics";
import { ObservationCategory } from "../ObservationTypes";
import { VerificationError, QualityThresholdViolation } from "../ObservationErrors";

test("Observation Pipeline — Rejects malformed input stimulus", async () => {
  const metrics = new ObservationMetrics();
  const pipeline = new ObservationPipeline(metrics);

  const malformedInput = {
    businessId: "", // will fail
    category: ObservationCategory.OPERATIONAL,
    source: { id: "pos_1", name: "POS 1", type: "POS", trustScore: 0.95 },
    payload: {}
  };

  await assert.rejects(async () => {
    await pipeline.processStimulus(malformedInput);
  }, VerificationError);
});

test("Observation Pipeline — Low confidence inputs trigger QualityThresholdViolation", async () => {
  const metrics = new ObservationMetrics();
  const pipeline = new ObservationPipeline(metrics);

  const lowQualityInput = {
    businessId: "biz_123",
    category: ObservationCategory.OPERATIONAL,
    // Source with extremely low trust score (0.01) triggers threshold violation
    source: { id: "faulty_sensor", name: "Faulty IOT Sensor", type: "IOT_SENSOR", trustScore: 0.01 },
    payload: { event: "grill_ping", temperatureCelsius: 22 },
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // stale by 48 hours
  };

  await assert.rejects(async () => {
    await pipeline.processStimulus(lowQualityInput);
  }, QualityThresholdViolation);
});
