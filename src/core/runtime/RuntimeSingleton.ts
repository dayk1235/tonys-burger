import { Runtime } from "./Runtime";
import { ObservationEngine } from "../engines/observation/ObservationEngine";
import { PatternEngine } from "../engines/pattern/PatternEngine";
import { MemoryEngine } from "../engines/memory/MemoryEngine";
import { KnowledgeEngine } from "../engines/knowledge/KnowledgeEngine";
import { AttentionEngine } from "../engines/attention/AttentionEngine";
import { ReasoningEngine } from "../engines/reasoning/ReasoningEngine";
import { DecisionEngine } from "../engines/decision/DecisionEngine";
import { EvidenceEngine } from "../engines/evidence/EvidenceEngine";
import { LearningEngine } from "../engines/learning/LearningEngine";
import { PredictionEngine } from "../engines/prediction/PredictionEngine";
import { RecommendationEngine } from "../engines/recommendation/RecommendationEngine";
import { PlanningEngine } from "../engines/planning/PlanningEngine";
import { ExecutionEngine } from "../engines/execution/ExecutionEngine";
import type { EngineManifestDefinition } from "./EngineManifest";
import type { EngineLifecycleState } from "./RuntimeTypes";

let instance: Runtime | null = null;
let initPromise: Promise<Runtime> | null = null;

/**
 * RuntimeSingleton — Single Runtime Instance
 *
 * Initializes Runtime once during application startup.
 * ObservationEngine, PatternEngine, MemoryEngine, KnowledgeEngine, AttentionEngine, ReasoningEngine, DecisionEngine, EvidenceEngine, LearningEngine, PredictionEngine, RecommendationEngine, PlanningEngine, and ExecutionEngine are registered as live cognitive engines.
 *
 * LAW_055 — Stable Contracts First: the singleton contract is stable.
 * LAW_057 — Vertical Integration: each task connects one additional layer.
 *
 * Once initialized, getRuntime() always returns the same instance.
 */

const OBSERVATION_MANIFEST: EngineManifestDefinition = {
  name: "ObservationEngine",
  version: "1.0.0",
  classification: "Perception",
  pipelinePosition: "OBSERVATION",
  purpose: "Perception engine that ingests raw environmental stimulus and produces verified observations.",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 10 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const PATTERN_MANIFEST: EngineManifestDefinition = {
  name: "PatternEngine",
  version: "1.0.0",
  classification: "Understanding",
  pipelinePosition: "PATTERN",
  purpose: "Understanding engine that detects patterns, trends, anomalies, and correlations from observations.",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 150, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const MEMORY_MANIFEST: EngineManifestDefinition = {
  name: "MemoryEngine",
  version: "1.0.0",
  classification: "Storage",
  pipelinePosition: "MEMORY",
  purpose: "Storage engine that creates, consolidates, and retrieves memories from confirmed observations.",
  dependencies: [],
  resourceProfile: { memoryMB: 128, maxLatencyMs: 200, requiredStorageMB: 50 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const KNOWLEDGE_MANIFEST: EngineManifestDefinition = {
  name: "KnowledgeEngine",
  version: "1.0.0",
  classification: "Knowledge",
  pipelinePosition: "KNOWLEDGE",
  purpose: "Knowledge engine that extracts, validates, and structures knowledge from consolidated memories.",
  dependencies: [],
  resourceProfile: { memoryMB: 128, maxLatencyMs: 300, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const ATTENTION_MANIFEST: EngineManifestDefinition = {
  name: "AttentionEngine",
  version: "1.0.0",
  classification: "Attention",
  pipelinePosition: "ATTENTION",
  purpose: "Attention engine that prioritizes, allocates focus, and manages interruptions across the cognitive pipeline.",
  dependencies: [],
  resourceProfile: { memoryMB: 64, maxLatencyMs: 100, requiredStorageMB: 20 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const REASONING_MANIFEST: EngineManifestDefinition = {
  name: "ReasoningEngine",
  version: "1.0.0",
  classification: "Processing",
  pipelinePosition: "REASONING",
  purpose: "Reasoning engine that analyzes, evaluates tradeoffs, generates hypotheses, and builds conclusions from attention inputs.",
  dependencies: [],
  resourceProfile: { memoryMB: 256, maxLatencyMs: 500, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const DECISION_MANIFEST: EngineManifestDefinition = {
  name: "DecisionEngine",
  version: "1.0.0",
  classification: "Decision",
  pipelinePosition: "DECISION",
  purpose: "Decision engine that evaluates alternatives, assesses risk, and builds constitutional proposals for owner review.",
  dependencies: [],
  resourceProfile: { memoryMB: 256, maxLatencyMs: 500, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const EVIDENCE_MANIFEST: EngineManifestDefinition = {
  name: "EvidenceEngine",
  version: "1.0.0",
  classification: "Validation",
  pipelinePosition: "EVIDENCE",
  purpose: "Evidence engine that validates, weights, and evaluates evidence supporting observations and patterns.",
  dependencies: [],
  resourceProfile: { memoryMB: 128, maxLatencyMs: 300, requiredStorageMB: 50 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const LEARNING_MANIFEST: EngineManifestDefinition = {
  name: "LearningEngine",
  version: "1.0.0",
  classification: "Learning",
  pipelinePosition: "LEARNING",
  purpose: "Learning engine that analyzes decision outcomes and derives patterns to improve future reasoning.",
  dependencies: [],
  resourceProfile: { memoryMB: 256, maxLatencyMs: 500, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const PREDICTION_MANIFEST: EngineManifestDefinition = {
  name: "PredictionEngine",
  version: "1.0.0",
  classification: "Prediction",
  pipelinePosition: "PREDICTION",
  purpose: "Prediction engine that generates forecasts using learned patterns and contextual data.",
  dependencies: [],
  resourceProfile: { memoryMB: 256, maxLatencyMs: 500, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const RECOMMENDATION_MANIFEST: EngineManifestDefinition = {
  name: "RecommendationEngine",
  version: "1.0.0",
  classification: "Recommendation",
  pipelinePosition: "RECOMMENDATION",
  purpose: "Recommendation engine that transforms predictions into structured, actionable recommendations.",
  dependencies: [],
  resourceProfile: { memoryMB: 256, maxLatencyMs: 500, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const PLANNING_MANIFEST: EngineManifestDefinition = {
  name: "PlanningEngine",
  version: "1.0.0",
  classification: "Planning",
  pipelinePosition: "PLANNING",
  purpose: "Planning engine that transforms recommendations into structured, step-by-step execution plans.",
  dependencies: [],
  resourceProfile: { memoryMB: 256, maxLatencyMs: 500, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

const EXECUTION_MANIFEST: EngineManifestDefinition = {
  name: "ExecutionEngine",
  version: "1.0.0",
  classification: "Execution",
  pipelinePosition: "EXECUTION",
  purpose: "Execution engine that dispatches and monitors cognitive system actions — the final stage of the cognitive pipeline.",
  dependencies: [],
  resourceProfile: { memoryMB: 256, maxLatencyMs: 500, requiredStorageMB: 100 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};

export async function initRuntime(): Promise<Runtime> {
  if (instance) return instance;

  if (!initPromise) {
    initPromise = (async () => {
      const runtime = new Runtime();

      const observationEngine = new ObservationEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
        runtime.contextBus,
      );

      const patternEngine = new PatternEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const memoryEngine = new MemoryEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const knowledgeEngine = new KnowledgeEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const attentionEngine = new AttentionEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const reasoningEngine = new ReasoningEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const decisionEngine = new DecisionEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const evidenceEngine = new EvidenceEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const learningEngine = new LearningEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const predictionEngine = new PredictionEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const recommendationEngine = new RecommendationEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const planningEngine = new PlanningEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      const executionEngine = new ExecutionEngine(
        runtime.eventBus,
        runtime.auditPipeline,
        runtime.recoveryPipeline,
      );

      await runtime.registerEngine("ObservationEngine", observationEngine, OBSERVATION_MANIFEST);
      await observationEngine.start();
      runtime.engineRegistry.updateState("ObservationEngine", observationEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("PatternEngine", patternEngine, PATTERN_MANIFEST);
      await patternEngine.start();
      runtime.engineRegistry.updateState("PatternEngine", patternEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("MemoryEngine", memoryEngine, MEMORY_MANIFEST);
      await memoryEngine.start();
      runtime.engineRegistry.updateState("MemoryEngine", memoryEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("KnowledgeEngine", knowledgeEngine, KNOWLEDGE_MANIFEST);
      await knowledgeEngine.start();
      runtime.engineRegistry.updateState("KnowledgeEngine", knowledgeEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("AttentionEngine", attentionEngine, ATTENTION_MANIFEST);
      await attentionEngine.start();
      runtime.engineRegistry.updateState("AttentionEngine", attentionEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("ReasoningEngine", reasoningEngine, REASONING_MANIFEST);
      await reasoningEngine.start();
      runtime.engineRegistry.updateState("ReasoningEngine", reasoningEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("DecisionEngine", decisionEngine, DECISION_MANIFEST);
      await decisionEngine.start();
      runtime.engineRegistry.updateState("DecisionEngine", decisionEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("EvidenceEngine", evidenceEngine, EVIDENCE_MANIFEST);
      await evidenceEngine.start();
      runtime.engineRegistry.updateState("EvidenceEngine", evidenceEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("LearningEngine", learningEngine, LEARNING_MANIFEST);
      await learningEngine.start();
      runtime.engineRegistry.updateState("LearningEngine", learningEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("PredictionEngine", predictionEngine, PREDICTION_MANIFEST);
      await predictionEngine.start();
      runtime.engineRegistry.updateState("PredictionEngine", predictionEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("RecommendationEngine", recommendationEngine, RECOMMENDATION_MANIFEST);
      await recommendationEngine.start();
      runtime.engineRegistry.updateState("RecommendationEngine", recommendationEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("PlanningEngine", planningEngine, PLANNING_MANIFEST);
      await planningEngine.start();
      runtime.engineRegistry.updateState("PlanningEngine", planningEngine.getState() as EngineLifecycleState);

      await runtime.registerEngine("ExecutionEngine", executionEngine, EXECUTION_MANIFEST);
      await executionEngine.start();
      runtime.engineRegistry.updateState("ExecutionEngine", executionEngine.getState() as EngineLifecycleState);

      await runtime.start();

      instance = runtime;
      return runtime;
    })();
  }

  return initPromise;
}

export async function getRuntime(): Promise<Runtime> {
  if (instance) return instance;
  return initRuntime();
}
