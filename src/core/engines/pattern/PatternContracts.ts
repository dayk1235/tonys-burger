import { CognitiveEngine, EngineState } from "../observation/ObservationContracts";
import { Pattern } from "./PatternTypes";

export interface PatternDetectionSubscriber {
  onPatternDetected(pattern: Pattern): Promise<void>;
  onPatternUpdated(pattern: Pattern): Promise<void>;
  onPatternDeprecated(patternId: string, reason: string): Promise<void>;
}

export interface PatternQuery {
  findById(id: string): Promise<Pattern | undefined>;
  findByCategory(category: string): Promise<Pattern[]>;
  findByStage(stage: string): Promise<Pattern[]>;
  findByBusinessId(businessId: string): Promise<Pattern[]>;
  findActive(): Promise<Pattern[]>;
  search(query: string): Promise<Pattern[]>;
}

export interface PatternEngineMetrics {
  readonly totalPatternsDetected: number;
  readonly activePatternCount: number;
  readonly patternDiscoveryRate: number;
  readonly falsePositiveRate: number;
  readonly averageConfidence: number;
  readonly patternsByCategory: Record<string, number>;
  readonly patternsByStage: Record<string, number>;
  readonly trendsDetected: number;
  readonly anomaliesDetected: number;
  readonly correlationsFound: number;
  readonly sequencesDiscovered: number;
  readonly contradictionsResolved: number;
}
