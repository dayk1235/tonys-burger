export type RuntimeState = "BOOTING" | "INITIALIZING" | "DISCOVERING" | "RESOLVING" | "READY" | "OPERATING" | "DEGRADED" | "STRESSED" | "RECOVERING" | "SHUTTING_DOWN" | "HALTED";

export type EngineLifecycleState = "INITIALIZED" | "REGISTERED" | "CONFIGURED" | "ACTIVATED" | "RUNNING" | "IDLE" | "SUSPENDED" | "DEGRADED" | "FAILING" | "RECOVERING" | "SHUTDOWN";

export type EngineClassification = "Perception" | "Understanding" | "Storage" | "Knowledge" | "Attention" | "Allocation" | "Processing" | "Expression" | "Decision" | "Validation" | "Learning" | "Prediction" | "Recommendation" | "Planning" | "Execution" | "Action" | "Meta" | "Constitutional";

export type PipelineStage = "OBSERVATION" | "PATTERN" | "EVIDENCE" | "MEMORY" | "KNOWLEDGE" | "ATTENTION" | "REASONING" | "DECISION" | "PLANNING" | "EXECUTION" | "LEARNING" | "PREDICTION" | "RECOMMENDATION" | "CONVERSATION" | "REFLECTION" | "COORDINATION" | "BUSINESS_PULSE" | "HUMAN_EXPERIENCE";

export type PriorityLevel = "CRITICAL" | "HIGH" | "NORMAL" | "LOW" | "BACKGROUND";

export type QualityState = "NORMAL" | "DEGRADED" | "CRITICAL";

export interface EngineIdentity {
  name: string;
  version: string;
  classification: EngineClassification;
  pipelinePosition: PipelineStage;
  purpose: string;
}

export interface ResourceProfile {
  memoryMB: number;
  maxLatencyMs: number;
  requiredStorageMB: number;
}

export interface EngineDependency {
  engineName: string;
  required: boolean;
  qualityThreshold?: number;
}

export interface EngineMetadata {
  identity: EngineIdentity;
  state: EngineLifecycleState;
  qualityState: QualityState;
  resourceProfile: ResourceProfile;
  dependencies: EngineDependency[];
  contractHash: string;
  registeredAt: string;
  lastActive: string;
  healthScore: number;
}

export interface ScheduledTask {
  id: string;
  engineName: string;
  intervalMs: number;
  lastRun: string;
  task: () => Promise<void>;
}

export interface RuntimeConfigurationOptions {
  engineScanPaths: string[];
  maxWorkingMemoryItems: number;
  workingMemoryTTLMs: number;
  eventHistoryLimit: number;
  schedulerCycleIntervalMs: number;
  healthCheckIntervalMs: number;
  auditRetentionMs: number;
  defaultRecoveryStrategy: RecoveryStrategy;
}

export type RecoveryStrategy = "RESTART" | "ROLLBACK" | "REINITIALIZE" | "DEGRADE" | "ESCALATE" | "HUMAN_INTERVENTION";

export interface FailureRecord {
  id: string;
  engineName: string;
  errorName: string;
  errorMessage: string;
  timestamp: string;
  severity: "CRITICAL" | "MAJOR" | "MINOR" | "WARNING";
  recovered: boolean;
  recoveryStrategy?: RecoveryStrategy;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  action: string;
  details: Record<string, unknown>;
}

export interface CognitiveEvent {
  id: string;
  type: string;
  source: string;
  target?: string;
  timestamp: string;
  payload: Record<string, unknown>;
  confidence?: number;
  ttl?: number;
  businessId?: string;
  correlationId?: string;
}

export interface WorkingMemoryEntry {
  id: string;
  source: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
  ttl: number;
  expiresAt: string;
}

export interface RuntimeMetricsSnapshot {
  activeEngineCount: number;
  totalEngineCount: number;
  eventsPublished: number;
  eventsDelivered: number;
  deadLetterCount: number;
  memoryUsageMB: number;
  auditRecordCount: number;
  failureCount: number;
  recoveryCount: number;
  uptimeMs: number;
  state: RuntimeState;
  totalErrors: number;
  errorsByEngine: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  lastErrorTimestamp: string;
}

export interface HealthStatus {
  status: "HEALTHY" | "DEGRADED" | "CRITICAL";
  engineStates: Record<string, EngineLifecycleState>;
  lastHealthCheck: string;
  failures: FailureRecord[];
  warnings: string[];
}
