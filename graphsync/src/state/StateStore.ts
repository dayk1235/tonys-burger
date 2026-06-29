import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from 'node:fs';
import { resolve } from 'node:path';
import type { IndexMode } from '../config/types.js';

export interface SourceState {
  status: 'healthy' | 'error' | 'pending';
  lastIndexedAt: string | null;
  lastMode: IndexMode | null;
}

export interface ProjectState {
  version: number;
  status: 'idle' | 'indexing' | 'error';
  provider: string;
  lastIndexedAt: string | null;
  lastCommit: string | null;
  lastMode: IndexMode | null;
  pendingChanges: number;
  knowledgeSources: Record<string, SourceState>;
}

export interface QueuedChange {
  timestamp: string;
  source: string;
  files: string[];
  mode: string;
}

export class StateStore {
  private baseDir: string;
  private projectDir: string;
  private statePath: string;
  private queuePath: string;
  private lockPath: string;

  constructor(stateDir: string, projectName: string) {
    this.baseDir = resolve(stateDir.replace(/^~/, process.env.HOME || ''));
    this.projectDir = resolve(this.baseDir, 'projects', projectName);
    this.statePath = resolve(this.projectDir, 'state.json');
    this.queuePath = resolve(this.projectDir, 'queue.json');
    this.lockPath = resolve(this.projectDir, 'lock');
  }

  ensureDirectories(): void {
    if (!existsSync(this.projectDir)) {
      mkdirSync(this.projectDir, { recursive: true });
    }
  }

  loadState(): ProjectState {
    if (!existsSync(this.statePath)) {
      return this.defaultState();
    }
    try {
      const raw = readFileSync(this.statePath, 'utf-8');
      return JSON.parse(raw) as ProjectState;
    } catch {
      return this.defaultState();
    }
  }

  saveState(state: ProjectState): void {
    this.ensureDirectories();
    writeFileSync(this.statePath, JSON.stringify(state, null, 2), 'utf-8');
  }

  loadQueue(): QueuedChange[] {
    if (!existsSync(this.queuePath)) {
      return [];
    }
    try {
      const raw = readFileSync(this.queuePath, 'utf-8');
      return JSON.parse(raw) as QueuedChange[];
    } catch {
      return [];
    }
  }

  saveQueue(queue: QueuedChange[]): void {
    this.ensureDirectories();
    writeFileSync(this.queuePath, JSON.stringify(queue, null, 2), 'utf-8');
  }

  enqueue(change: QueuedChange): void {
    const queue = this.loadQueue();
    queue.push(change);
    this.saveQueue(queue);
  }

  dequeue(): QueuedChange | null {
    const queue = this.loadQueue();
    if (queue.length === 0) return null;
    const change = queue.shift()!;
    this.saveQueue(queue);
    return change;
  }

  acquireLock(): boolean {
    if (existsSync(this.lockPath)) {
      const pid = parseInt(readFileSync(this.lockPath, 'utf-8').trim(), 10);
      if (!isNaN(pid)) {
        try {
          process.kill(pid, 0);
          return false;
        } catch {
          /* stale lock — clean it */
        }
      }
    }
    this.ensureDirectories();
    writeFileSync(this.lockPath, String(process.pid), 'utf-8');
    return true;
  }

  releaseLock(): void {
    try {
      if (existsSync(this.lockPath)) {
        unlinkSync(this.lockPath);
      }
    } catch {
      /* best effort */
    }
  }

  getProjectDir(): string {
    return this.projectDir;
  }

  private defaultState(): ProjectState {
    return {
      version: 1,
      status: 'idle',
      provider: 'unknown',
      lastIndexedAt: null,
      lastCommit: null,
      lastMode: null,
      pendingChanges: 0,
      knowledgeSources: {},
    };
  }
}
