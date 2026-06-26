/**
 * @file recovery.test.ts
 * @description Unit tests for the engine's cognitive recovery, correction,
 * and deprecation mechanisms.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { ObservationPipeline } from "../ObservationPipeline";
import { ObservationMetrics } from "../ObservationMetrics";
import { ObservationCategory } from "../ObservationTypes";

test("Observation Pipeline — Supports deprecation and correction in place", async () => {
  const metrics = new ObservationMetrics();
  const pipeline = new ObservationPipeline(metrics);

  // Ingest original incorrect transaction observation
  const originalInput = {
    businessId: "biz_123",
    category: ObservationCategory.FINANCIAL,
    source: { id: "pos_1", name: "POS 1", type: "POS", trustScore: 0.95 },
    payload: { amount: 150, transactionId: "txn_99" },
    timestamp: new Date().toISOString()
  };

  const originalObs = await pipeline.processStimulus(originalInput);
  assert.equal(originalObs.isDeprecated, false);

  // Correcting: transaction was actually $120
  const correctedPayload = { amount: 120, transactionId: "txn_99" };
  const correctedObs = await pipeline.deprecateAndCorrect(
    originalObs.id,
    correctedPayload,
    "Keyboard entry mistake by server"
  );

  // Verify original was updated (copied in place per immutable rules)
  const finalOriginal = pipeline.getObservationById(originalObs.id)!;
  assert.equal(finalOriginal.isDeprecated, true);
  assert.equal(finalOriginal.deprecationReason, "Keyboard entry mistake by server");
  assert.equal(finalOriginal.correctedByObservationId, correctedObs.id);
  assert.equal(finalOriginal.confidence.score, 0.05); // Min confidence assigned

  // Verify corrected replacement
  assert.equal(correctedObs.isDeprecated, false);
  assert.equal(correctedObs.payload.amount, 120);
});
