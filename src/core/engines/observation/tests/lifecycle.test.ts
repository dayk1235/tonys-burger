/**
 * @file lifecycle.test.ts
 * @description Unit tests for the Observation Lifecycle state machine.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { ObservationLifecycle } from "../ObservationLifecycle";
import { ObservationStage } from "../ObservationTypes";
import { InvalidLifecycleTransitionError } from "../ObservationErrors";

test("Observation Lifecycle — Allowed transitions progress forward", () => {
  const lifecycle = new ObservationLifecycle();
  
  // Valid transitions
  assert.doesNotThrow(() => {
    lifecycle.validateTransition(ObservationStage.POTENTIAL, ObservationStage.CANDIDATE);
    lifecycle.validateTransition(ObservationStage.CANDIDATE, ObservationStage.VERIFIED);
    lifecycle.validateTransition(ObservationStage.VERIFIED, ObservationStage.CONTEXTUALIZED);
    lifecycle.validateTransition(ObservationStage.CONTEXTUALIZED, ObservationStage.HISTORICAL);
    lifecycle.validateTransition(ObservationStage.HISTORICAL, ObservationStage.PATTERN_EVIDENCE);
    lifecycle.validateTransition(ObservationStage.PATTERN_EVIDENCE, ObservationStage.KNOWLEDGE_EVIDENCE);
    lifecycle.validateTransition(ObservationStage.KNOWLEDGE_EVIDENCE, ObservationStage.ARCHIVED);
    
    // Reactivation transition
    lifecycle.validateTransition(ObservationStage.ARCHIVED, ObservationStage.PATTERN_EVIDENCE);
  });
});

test("Observation Lifecycle — Regressions and skips throw errors", () => {
  const lifecycle = new ObservationLifecycle();
  
  // Backward transition (regression)
  assert.throws(() => {
    lifecycle.validateTransition(ObservationStage.VERIFIED, ObservationStage.CANDIDATE);
  }, InvalidLifecycleTransitionError);

  assert.throws(() => {
    lifecycle.validateTransition(ObservationStage.HISTORICAL, ObservationStage.POTENTIAL);
  }, InvalidLifecycleTransitionError);

  // Skipping stages
  assert.throws(() => {
    lifecycle.validateTransition(ObservationStage.POTENTIAL, ObservationStage.VERIFIED); // skipped Candidate
  }, InvalidLifecycleTransitionError);

  assert.throws(() => {
    lifecycle.validateTransition(ObservationStage.CANDIDATE, ObservationStage.CONTEXTUALIZED); // skipped Verified
  }, InvalidLifecycleTransitionError);
});

test("Observation Lifecycle — canTransition returns correct booleans", () => {
  const lifecycle = new ObservationLifecycle();
  
  assert.equal(lifecycle.canTransition(ObservationStage.POTENTIAL, ObservationStage.CANDIDATE), true);
  assert.equal(lifecycle.canTransition(ObservationStage.POTENTIAL, ObservationStage.VERIFIED), false);
  assert.equal(lifecycle.canTransition(ObservationStage.VERIFIED, ObservationStage.VERIFIED), true); // Identity transition
});
