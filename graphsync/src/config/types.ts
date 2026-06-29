export interface KnowledgeSourceConfig {
  id: string;
  label: string;
  paths: string[];
}

export interface IndexingConfig {
  default_mode: IndexMode;
  mode_by_source?: Record<string, IndexMode>;
  debounce_ms: number;
  cooldown_seconds: number;
}

export type IndexMode = 'fast' | 'moderate' | 'full';

export interface ProviderConfig {
  type: string;
  binary?: string;
  repo_path?: string;
  timeout_ms?: number;
}

export interface GraphSyncConfig {
  version: number;
  project: string;
  watch: {
    paths: string[];
    ignore: string[];
  };
  knowledge_sources: KnowledgeSourceConfig[];
  indexing: IndexingConfig;
  provider: ProviderConfig;
  state: {
    dir: string;
  };
}
