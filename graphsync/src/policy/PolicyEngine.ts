import type { IndexMode } from '../config/types.js';

export interface PolicyDecision {
  reindex: boolean;
  mode: IndexMode;
  source: string;
  reason: string;
}

export interface PolicyOptions {
  defaultMode: IndexMode;
  modeBySource: Record<string, IndexMode>;
  cooldownSeconds: number;
}

export interface SourceCooldown {
  sourceId: string;
  lastIndexedAt: number;
}

export class PolicyEngine {
  private cooldowns: Map<string, number> = new Map();
  private firstSeen: Set<string> = new Set();

  constructor(private options: PolicyOptions) {}

  evaluate(
    source: string,
    hasFiles: boolean,
    isIgnored: boolean,
  ): PolicyDecision {
    if (!hasFiles) {
      return {
        reindex: false,
        mode: this.options.defaultMode,
        source,
        reason: 'no files to index',
      };
    }

    if (isIgnored) {
      return {
        reindex: false,
        mode: this.options.defaultMode,
        source,
        reason: 'file is in ignored pattern',
      };
    }

    if (this.isOnCooldown(source)) {
      return {
        reindex: false,
        mode: this.options.defaultMode,
        source,
        reason: `source '${source}' is on cooldown`,
      };
    }

    const mode = this.resolveMode(source);

    if (!this.firstSeen.has(source)) {
      this.firstSeen.add(source);
      return {
        reindex: true,
        mode: 'full' as IndexMode,
        source,
        reason: `first index for source '${source}'`,
      };
    }

    return {
      reindex: true,
      mode,
      source,
      reason: 'change detected in knowledge source',
    };
  }

  markIndexed(source: string): void {
    this.cooldowns.set(source, Date.now());
  }

  isOnCooldown(source: string): boolean {
    const last = this.cooldowns.get(source);
    if (!last) return false;
    return Date.now() - last < this.options.cooldownSeconds * 1000;
  }

  private resolveMode(source: string): IndexMode {
    return this.options.modeBySource[source] ?? this.options.defaultMode;
  }

  resetCooldowns(): void {
    this.cooldowns.clear();
  }
}
