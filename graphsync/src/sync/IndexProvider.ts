import type { IndexMode } from '../config/types.js';

export interface IndexOptions {
  repoPath: string;
  mode: IndexMode;
  source?: string;
  files?: string[];
  signal?: AbortSignal;
}

export interface IndexResult {
  success: boolean;
  durationMs: number;
  nodesCreated?: number;
  edgesCreated?: number;
  error?: string;
  mode: IndexMode;
}

export interface HealthStatus {
  available: boolean;
  version?: string;
  lastContact?: Date;
  error?: string;
}

export interface IndexProvider {
  readonly name: string;
  index(options: IndexOptions): Promise<IndexResult>;
  health(): Promise<HealthStatus>;
}
