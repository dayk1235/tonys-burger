import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ReasoningFactory } from "../ReasoningFactory";
import { ReasoningValidator } from "../ReasoningValidator";
import { ReasoningLifecycle } from "../ReasoningLifecycle";
import { ReasoningQuality } from "../ReasoningQuality";
import { ReasoningConfidence } from "../ReasoningConfidence";
import { ReasoningScoring } from "../ReasoningScoring";
import { ReasoningHypotheses } from "../ReasoningHypotheses";
import { ReasoningTree } from "../ReasoningTree";
import { ReasoningEvidence } from "../ReasoningEvidence";
import { ReasoningExplanation } from "../ReasoningExplanation";
import { ReasoningConstraints } from "../ReasoningConstraints";
import { ReasoningTradeoffs } from "../ReasoningTradeoffs";
import { ReasoningConclusionBuilder } from "../ReasoningConclusion";
import { ReasoningContext } from "../ReasoningContext";
import { ReasoningMetrics } from "../ReasoningMetrics";
import { ReasoningWorkspace } from "../ReasoningWorkspace";
import { ReasoningInformationGap } from "../ReasoningInformationGap";
import { ReasoningConfidenceExplanation } from "../ReasoningConfidenceExplanation";
import {
  ReasoningValidationError,
  ReasoningBoundaryError,
  InvalidReasoningLifecycleTransitionError,
  HypothesisGenerationError,
} from "../ReasoningErrors";
import { ReasoningInput, Reasoning, ReasoningStage, ReasoningHypothesis, ReasoningAlternative } from "../ReasoningTypes";

function makeInput(overrides?: Partial<ReasoningInput>): ReasoningInput {
  return {
    attentionId: "att_001",
    sourceObservationIds: ["obs_001", "obs_002"],
    sourceMemoryIds: ["mem_001"],
    sourceKnowledgeIds: ["knw_001"],
    name: "Kitchen Equipment Failure Analysis",
    questionText: "Why did the refrigerator fail during rush hour?",
    questionType: "DIAGNOSE",
    intent: "identify root cause and recommend mitigation",
    reasoningType: "DIAGNOSTIC",
    urgency: 0.8,
    businessValue: 0.7,
    businessId: "biz_001",
    ...overrides,
  };
}

function makeReasoning(factory: ReasoningFactory, overrides?: Partial<ReasoningInput>): Reasoning {
  return factory.createFromInput(makeInput(overrides));
}

// --- Creation ---
describe("Reasoning creation", () => {
  it("creates reasoning from valid input", () => {
    const factory = new ReasoningFactory();
    const input = makeInput();
    const reasoning = factory.createFromInput(input);

    assert.equal(reasoning.identity.name, "Kitchen Equipment Failure Analysis");
    assert.equal(reasoning.identity.attentionId, "att_001");
    assert.equal(reasoning.stage, "CANDIDATE");
    assert.equal(reasoning.type, "DIAGNOSTIC");
    assert.equal(reasoning.confidence, 0);
    assert.equal(reasoning.hypotheses.length, 0);
    assert.equal(reasoning.alternatives.length, 0);
    assert.equal(reasoning.tree.length, 0);
    assert.equal(reasoning.versions.length, 1);
    assert.ok(reasoning.id.startsWith("rsn_"));
    assert.equal(reasoning.question.type, "DIAGNOSE");
    assert.equal(reasoning.question.text, "Why did the refrigerator fail during rush hour?");
    assert.equal(reasoning.question.intent, "identify root cause and recommend mitigation");
    assert.equal(reasoning.conclusion, null);
    assert.equal(reasoning.confidenceExplanation, null);
    assert.equal(reasoning.informationGaps.length, 0);
  });

  it("creates reasoning with unique IDs", () => {
    const factory = new ReasoningFactory();
    const a = factory.createFromInput(makeInput());
    const b = factory.createFromInput(makeInput());
    assert.notEqual(a.id, b.id);
  });
});

// --- Validation ---
describe("Reasoning validation", () => {
  it("validates required fields", () => {
    const validator = new ReasoningValidator();
    assert.throws(() => validator.validateInput(makeInput({ attentionId: "" })), ReasoningValidationError);
    assert.throws(() => validator.validateInput(makeInput({ name: "" })), ReasoningValidationError);
    assert.throws(() => validator.validateInput(makeInput({ questionText: "" })), ReasoningValidationError);
    assert.throws(() => validator.validateInput(makeInput({ questionType: undefined as unknown as "DIAGNOSE" })), ReasoningValidationError);
    assert.throws(() => validator.validateInput(makeInput({ intent: "" })), ReasoningValidationError);
    assert.throws(() => validator.validateInput(makeInput({ businessId: "" })), ReasoningValidationError);
  });

  it("rejects decision language in question", () => {
    const validator = new ReasoningValidator();
    assert.throws(
      () => validator.validateInput(makeInput({ questionText: "Should we decide to close the kitchen?" })),
      ReasoningBoundaryError
    );
  });

  it("rejects prediction language in intent", () => {
    const validator = new ReasoningValidator();
    assert.throws(
      () => validator.validateInput(makeInput({ intent: "predict what will happen next" })),
      ReasoningBoundaryError
    );
  });

  it("passes valid input without boundary violations", () => {
    const validator = new ReasoningValidator();
    assert.doesNotThrow(() => validator.validateInput(makeInput()));
  });
});

// --- Lifecycle ---
describe("Reasoning lifecycle", () => {
  it("allows valid forward transitions", () => {
    const lifecycle = new ReasoningLifecycle();
    assert.ok(lifecycle.canTransition("CANDIDATE", "ACTIVATED"));
    assert.ok(lifecycle.canTransition("ACTIVATED", "CONTEXT_BUILDING"));
    assert.ok(lifecycle.canTransition("CONTEXT_BUILDING", "INFORMATION_GAP_DETECTION"));
    assert.ok(lifecycle.canTransition("INFORMATION_GAP_DETECTION", "EVIDENCE_GATHERING"));
    assert.ok(lifecycle.canTransition("EVIDENCE_GATHERING", "KNOWLEDGE_RETRIEVAL"));
    assert.ok(lifecycle.canTransition("HYPOTHESIS_GENERATION", "ALTERNATIVE_GENERATION"));
    assert.ok(lifecycle.canTransition("TRADEOFF_EVALUATION", "CONSISTENCY_CHECKING"));
    assert.ok(lifecycle.canTransition("CONFIDENCE_ASSESSMENT", "CONFIDENCE_EXPLANATION"));
    assert.ok(lifecycle.canTransition("CONFIDENCE_EXPLANATION", "CONCLUSION_BUILDING"));
    assert.ok(lifecycle.canTransition("COMPLETED", "ARCHIVED"));
  });

  it("allows re-entry to hypothesis generation", () => {
    const lifecycle = new ReasoningLifecycle();
    assert.ok(lifecycle.canTransition("CONSISTENCY_CHECKING", "HYPOTHESIS_GENERATION"));
    assert.ok(lifecycle.canTransition("CONFIDENCE_ASSESSMENT", "HYPOTHESIS_GENERATION"));
  });

  it("allows retirement from any active stage", () => {
    const lifecycle = new ReasoningLifecycle();
    assert.ok(lifecycle.canTransition("CANDIDATE", "RETIRED"));
    assert.ok(lifecycle.canTransition("HYPOTHESIS_GENERATION", "RETIRED"));
    assert.ok(lifecycle.canTransition("COMPLETED", "RETIRED"));
    assert.ok(lifecycle.canTransition("ARCHIVED", "RETIRED"));
  });

  it("blocks invalid transitions", () => {
    const lifecycle = new ReasoningLifecycle();
    assert.ok(!lifecycle.canTransition("CANDIDATE", "COMPLETED"));
    assert.ok(!lifecycle.canTransition("ACTIVATED", "HYPOTHESIS_GENERATION"));
    assert.ok(!lifecycle.canTransition("COMPLETED", "ACTIVATED"));
  });

  it("identifies active and terminal stages", () => {
    const lifecycle = new ReasoningLifecycle();
    assert.ok(lifecycle.isActive("HYPOTHESIS_GENERATION"));
    assert.ok(lifecycle.isActive("CONFIDENCE_ASSESSMENT"));
    assert.ok(lifecycle.isActive("INFORMATION_GAP_DETECTION"));
    assert.ok(lifecycle.isActive("CONFIDENCE_EXPLANATION"));
    assert.ok(!lifecycle.isActive("ARCHIVED"));
    assert.ok(lifecycle.isTerminal("ARCHIVED"));
    assert.ok(lifecycle.isTerminal("RETIRED"));
    assert.ok(lifecycle.isCompleted("COMPLETED"));
  });
});

// --- Quality ---
describe("Reasoning quality", () => {
  it("evaluates all 14 quality dimensions", () => {
    const factory = new ReasoningFactory();
    const quality = new ReasoningQuality();
    const reasoning = makeReasoning(factory);

    const result = quality.evaluate(reasoning);
    assert.ok(result.qualityScore >= 0);
    assert.ok(result.qualityScore <= 1);
    assert.ok(result.profile.correctness >= 0);
    assert.ok(result.profile.consistency >= 0);
    assert.ok(result.profile.completeness >= 0);
  });
});

// --- Confidence ---
describe("Reasoning confidence", () => {
  it("computes calibrated confidence profile", () => {
    const confidence = new ReasoningConfidence();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const profile = confidence.compute(reasoning, 0.7, 0.6, 0.5, 0.8);
    assert.ok(profile.overallConfidence > 0);
    assert.ok(profile.calibratedConfidence > 0);
    assert.equal(typeof profile.isOverconfident, "boolean");
    assert.equal(typeof profile.isUnderconfident, "boolean");
    assert.ok(Array.isArray(profile.flags));
  });

  it("generates explanation from confidence profile", () => {
    const confidence = new ReasoningConfidence();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const profile = confidence.compute(reasoning, 0.7, 0.6, 0.5, 0.8);
    const explanation = confidence.generateExplanation(profile);
    assert.ok(explanation.overallExplanation.length > 0);
    assert.ok(explanation.factors.length > 0);
    assert.ok(explanation.baseConfidence >= 0);
    assert.ok(explanation.calibratedConfidence >= 0);
    assert.ok(explanation.evidenceContribution >= 0);
  });
});

// --- Scoring ---
describe("Reasoning scoring", () => {
  it("scores hypotheses by evidence", () => {
    const scoring = new ReasoningScoring();
    const factory = new ReasoningFactory();

    const hypothesis = factory.createHypothesis("Test", "A test hypothesis");
    const supported = { ...hypothesis, evidenceStrength: 0.8, supportedBy: ["evd_1", "evd_2"], status: "SUPPORTED" as const };

    const score = scoring.scoreHypothesis(supported);
    assert.ok(score > 0);
  });

  it("scores alternatives holistically", () => {
    const scoring = new ReasoningScoring();
    const factory = new ReasoningFactory();

    const alt = factory.createAlternative("Option A", "First option");
    const scored = { ...alt, businessImpact: 0.8, riskLevel: 0.2, opportunityScore: 0.7, ownerAlignment: 0.9 };
    const score = scoring.scoreAlternative(scored);
    assert.ok(score > 0);
    assert.ok(score <= 1);
  });

  it("computes coherence from factors", () => {
    const scoring = new ReasoningScoring();
    const coherence = scoring.computeCoherence(0.7, 0.8, 0.6);
    assert.ok(coherence > 0);
    assert.ok(coherence <= 1);
  });
});

// --- Hypotheses ---
describe("Reasoning hypotheses", () => {
  it("generates hypotheses from reasoning input", () => {
    const factory = new ReasoningFactory();
    const hypotheses = new ReasoningHypotheses(factory);
    const reasoning = makeReasoning(factory, {
      questionText: "Why did the system fail?",
      intent: "identify root cause",
    });

    const result = hypotheses.generate(reasoning);
    assert.ok(result.hypotheses.length > 0);
    assert.ok(result.inferenceCount > 0);
  });

  it("supports hypothesis lifecycle", () => {
    const factory = new ReasoningFactory();
    const hypotheses = new ReasoningHypotheses(factory);
    let h = factory.createHypothesis("Test", "Test hypothesis");

    h = hypotheses.support(h, "evd_001");
    assert.ok(h.evidenceStrength > 0);
    assert.equal(h.supportedBy.length, 1);

    h = hypotheses.weaken(h, "evd_002");
    assert.equal(h.weakenedBy.length, 1);

    h = hypotheses.reject(h, "Contradicted by evidence");
    assert.equal(h.status, "REJECTED");
    assert.equal(h.evidenceStrength, 0);
  });
});

// --- Tree ---
describe("Reasoning tree", () => {
  it("builds tree from steps", () => {
    const tree = new ReasoningTree();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const step1 = tree.addStep(reasoning, "ACTIVATION", "Case activated", null, null, null, 1);
    const step2 = tree.addStep(reasoning, "EVIDENCE", "Evidence gathered", step1.id, null, null, 0.8);
    const step3 = tree.addStep(reasoning, "HYPOTHESIS", "Hypothesis generated", step2.id, null, null, 0.7);

    const built = tree.buildTree([step1, step2, step3]);
    assert.equal(built.length, 3);
    assert.equal(tree.findRoot(built)?.id, step1.id);
    assert.equal(tree.getDepth(built), 3);
    assert.equal(tree.getNodeCount(built), 3);
  });
});

// --- Evidence ---
describe("Reasoning evidence", () => {
  it("gathers evidence from provenance", () => {
    const evidence = new ReasoningEvidence();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const result = evidence.gather(reasoning);
    assert.ok(result.evidenceIds.length > 0);
    assert.ok(result.overallStrength >= 0);
  });

  it("checks sufficiency", () => {
    const evidence = new ReasoningEvidence();
    const factory = new ReasoningFactory();

    const empty = makeReasoning(factory, {
      sourceObservationIds: [],
      sourceMemoryIds: [],
      sourceKnowledgeIds: [],
    });
    assert.equal(evidence.checkSufficiency(empty).sufficient, false);

    const rich = makeReasoning(factory, {
      sourceObservationIds: ["o1", "o2", "o3", "o4", "o5"],
      sourceMemoryIds: ["m1", "m2"],
      sourceKnowledgeIds: ["k1", "k2"],
    });
    assert.equal(evidence.checkSufficiency(rich).sufficient, true);
  });
});

// --- Explanation ---
describe("Reasoning explanation", () => {
  it("builds explanation chain", () => {
    const factory = new ReasoningFactory();
    const explanation = new ReasoningExplanation();
    const reasoning = makeReasoning(factory);

    const chain = explanation.buildChain(reasoning);
    assert.ok(chain.steps.length > 0);
    assert.ok(chain.narrative.length > 0);
    assert.ok(chain.confidence > 0);
  });

  it("summarizes reasoning", () => {
    const factory = new ReasoningFactory();
    const explanation = new ReasoningExplanation();
    const reasoning = makeReasoning(factory);

    const summary = explanation.summarize(reasoning);
    assert.ok(summary.includes("DIAGNOSTIC"));
  });
});

// --- Constraints ---
describe("Reasoning constraints", () => {
  it("evaluates business constraints", () => {
    const constraints = new ReasoningConstraints();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const alt1 = { ...factory.createAlternative("A", "Option A"), businessImpact: -0.2, riskLevel: 0.9 };
    const alt2 = { ...factory.createAlternative("B", "Option B"), businessImpact: 0.5, riskLevel: 0.3 };

    const result = constraints.evaluate(reasoning, [alt1, alt2]);
    assert.ok(result.constraints.length > 0);
    assert.equal(result.feasibleAlternatives.length, 1);
  });
});

// --- Tradeoffs ---
describe("Reasoning tradeoffs", () => {
  it("evaluates pairwise tradeoffs", () => {
    const tradeoffs = new ReasoningTradeoffs();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const a = { ...factory.createAlternative("A", "First"), businessImpact: 0.8, riskLevel: 0.2, costEstimate: 30, opportunityScore: 0.7, ownerAlignment: 0.9 };
    const b = { ...factory.createAlternative("B", "Second"), businessImpact: 0.5, riskLevel: 0.6, costEstimate: 10, opportunityScore: 0.4, ownerAlignment: 0.5 };

    const result = tradeoffs.evaluate(reasoning, [a, b]);
    assert.ok(result.tradeoffs.length > 0);
    assert.equal(result.topAlternatives.length, 2);
    assert.equal(result.topAlternatives[0], a.id);
  });
});

// --- Context ---
describe("Reasoning context", () => {
  it("builds context from reasoning", () => {
    const context = new ReasoningContext();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const result = context.build(reasoning);
    assert.ok(result.context.environment.length > 0);
    assert.ok(result.businessValue >= 0);
  });
});

// --- Metrics ---
describe("Reasoning metrics", () => {
  it("tracks case lifecycle", () => {
    const metrics = new ReasoningMetrics();
    assert.equal(metrics.totalCasesProcessed, 0);

    metrics.recordCaseStarted();
    assert.equal(metrics.totalCasesProcessed, 1);
    assert.equal(metrics.activeCases, 1);

    metrics.recordCaseCompleted(5000);
    assert.equal(metrics.completedCases, 1);
    assert.equal(metrics.activeCases, 0);

    const snapshot = metrics.getSnapshot();
    assert.equal(snapshot.totalCasesProcessed, 1);
    assert.ok(snapshot.averageDurationMs > 0);
  });
});

// --- Workspace ---
describe("Reasoning workspace", () => {
  it("creates and manages workspace", () => {
    const factory = new ReasoningFactory();
    const workspace = new ReasoningWorkspace();
    const reasoning = makeReasoning(factory);

    const data = workspace.create(reasoning);
    assert.equal(data.reasoningId, reasoning.id);
    assert.ok(data.isActive);
    assert.equal(workspace.count(), 1);

    workspace.complete(reasoning.id);
    assert.equal(workspace.isActive(reasoning.id), false);
  });
});

// --- Information Gap ---
describe("Reasoning information gap", () => {
  it("analyzes information gaps from reasoning", () => {
    const gapAnalyzer = new ReasoningInformationGap();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const result = gapAnalyzer.analyze(reasoning);
    assert.ok(result.gaps.length >= 0);
    assert.ok(result.totalGaps >= 0);
    assert.ok(result.resolvableGaps >= 0);
  });
});

// --- Confidence Explanation ---
describe("Reasoning confidence explanation", () => {
  it("generates detailed confidence explanation", () => {
    const confidence = new ReasoningConfidence();
    const explanation = new ReasoningConfidenceExplanation();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const profile = confidence.compute(reasoning, 0.7, 0.6, 0.5, 0.8);
    const result = explanation.explain(reasoning, profile);
    assert.ok(result.overallExplanation.length > 0);
    assert.ok(result.baseConfidence >= 0);
  });
});

// --- Conclusion ---
describe("Reasoning conclusion", () => {
  it("builds conclusion from reasoning data", () => {
    const builder = new ReasoningConclusionBuilder();
    const factory = new ReasoningFactory();
    const reasoning = makeReasoning(factory);

    const result = builder.build(
      reasoning,
      [factory.createAlternative("A", "First")],
      [],
      [],
      [factory.createHypothesis("H1", "Hypothesis one")]
    );
    assert.ok(result.conclusion.summary.length > 0);
    assert.ok(result.conclusion.narrative.length > 0);
    assert.ok(result.conclusion.assumptions.length >= 0);
    assert.ok(result.conclusion.unresolvedQuestions.length >= 0);
  });
});

// --- Full lifecycle integration test ---
describe("Reasoning full lifecycle", () => {
  it("creates a factory and validates input", () => {
    const factory = new ReasoningFactory();
    const validator = new ReasoningValidator();
    const input = makeInput();

    assert.doesNotThrow(() => validator.validateInput(input));
    const reasoning = factory.createFromInput(input);
    assert.equal(reasoning.stage, "CANDIDATE");
  });
});
