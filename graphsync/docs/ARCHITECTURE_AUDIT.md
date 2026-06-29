# GraphSync — Architecture Audit & Extraction Plan

**Version:** 1.0.0  
**Audit Date:** 2026-06-29  
**Status:** Complete (Analysis Only — No Changes Applied)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Dependency Map](#2-dependency-map)
3. [Coupling Analysis](#3-coupling-analysis)
4. [Configuration Audit](#4-configuration-audit)
5. [Build System Audit](#5-build-system-audit)
6. [Persistent State Audit](#6-persistent-state-audit)
7. [Provider Layer Audit](#7-provider-layer-audit)
8. [Architecture Evaluation](#8-architecture-evaluation)
9. [Public API Surface](#9-public-api-surface)
10. [Risk Analysis](#10-risk-analysis)
11. [Extraction Plan](#11-extraction-plan)
12. [Proposed Repository Structure](#12-proposed-repository-structure)
13. [Migration Checklist](#13-migration-checklist)
14. [Post-Extraction Roadmap](#14-post-extraction-roadmap)

---

## 1. Executive Summary

GraphSync is structurally ready for extraction. After a complete audit of its 24 source files, 8 test files, and all configuration:

- **Zero external references exist from Flow OS into GraphSync.** No file outside `graphsync/` imports, depends on, or references GraphSync in any way. Extraction risk from the consumer side is **zero**.
- **Zero domain coupling exists in source code.** No TypeScript source file contains restaurant, menu, product, RKS, Tony Burgers, or any domain-specific term. All domain coupling is in `.graphsync.yml` — configuration, not code.
- **GraphSync has its own complete build system** (package.json, tsconfig, vitest, tsx). No shared infrastructure with Flow OS.
- **Persistent state lives at `~/.graphsync/`** — fully independent of the repository. No files or paths depend on Flow OS directory structure.
- **`@modelcontextprotocol/sdk` is a declared but unused dependency.** It should be removed.

The total extraction effort is estimated at **low complexity** — primarily moving files and publishing a package. No architectural changes are required to achieve independence.

### Key Numbers

| Metric | Value |
| :--- | :--- |
| Source files | 24 (across 13 modules) |
| Test files | 8 (30 tests, all passing) |
| Runtime dependencies | 8 (1 unused) |
| Dev dependencies | 4 |
| Domain coupling in code | **0** references |
| Cross-project imports | **0** (in or out) |
| State dependency on Flow OS | **0** |
| Extraction risk level | **LOW** |

---

## 2. Dependency Map

### 2.1 Source Files Dependency Graph

```
main.ts
  ├── commander (npm)
  ├── picocolors (npm)
  ├── logger/logger.ts
  ├── config/Config.ts
  ├── cli/start.command.ts
  ├── cli/stop.command.ts
  ├── cli/status.command.ts
  ├── cli/inspect.command.ts
  └── cli/index.command.ts

cli/start.command.ts
  ├── picocolors (npm)
  ├── config/Config.ts
  ├── logger/logger.ts
  ├── bus/EventBus.ts
  ├── providers/ProviderRegistry.ts
  ├── providers/MCPIndexProvider.ts
  ├── providers/DryRunProvider.ts
  ├── health/HealthService.ts
  ├── metrics/MetricsStore.ts
  ├── watcher/FileWatcher.ts
  ├── analyzer/ChangeAnalyzer.ts
  ├── policy/PolicyEngine.ts
  ├── policy/Debouncer.ts
  ├── sync/SyncEngine.ts
  ├── state/StateStore.ts
  └── node:path

cli/stop.command.ts
  ├── picocolors (npm)
  ├── node:fs
  └── node:path

cli/status.command.ts
  ├── picocolors (npm)
  ├── config/Config.ts
  ├── state/StateStore.ts
  └── logger/logger.ts

cli/inspect.command.ts
  ├── picocolors (npm)
  ├── config/Config.ts
  ├── providers/ProviderRegistry.ts
  ├── providers/MCPIndexProvider.ts
  ├── providers/DryRunProvider.ts
  ├── health/HealthService.ts
  └── logger/logger.ts

cli/index.command.ts
  ├── picocolors (npm)
  ├── config/Config.ts
  ├── providers/ProviderRegistry.ts
  ├── providers/MCPIndexProvider.ts
  ├── providers/DryRunProvider.ts
  ├── state/StateStore.ts
  └── logger/logger.ts

sync/SyncEngine.ts
  ├── bus/EventBus.ts
  ├── bus/events.ts
  ├── sync/IndexProvider.ts
  ├── providers/ProviderRegistry.ts
  ├── analyzer/ChangeAnalyzer.ts
  ├── policy/PolicyEngine.ts
  ├── policy/Debouncer.ts
  ├── state/StateStore.ts
  ├── metrics/MetricsRecorder.ts
  ├── config/types.ts
  ├── logger/logger.ts
  └── node:path

sync/IndexProvider.ts
  └── config/types.ts

providers/MCPIndexProvider.ts
  ├── sync/IndexProvider.ts
  ├── logger/logger.ts
  ├── node:child_process
  ├── node:path
  └── node:readline

providers/DryRunProvider.ts
  ├── sync/IndexProvider.ts
  └── logger/logger.ts

providers/ProviderRegistry.ts
  └── sync/IndexProvider.ts

watcher/FileWatcher.ts
  ├── chokidar (npm)
  ├── bus/EventBus.ts
  ├── bus/events.ts
  ├── logger/logger.ts
  └── node:path

analyzer/ChangeAnalyzer.ts
  ├── minimatch (npm)
  ├── config/types.ts
  ├── bus/events.ts
  └── node:path

policy/PolicyEngine.ts
  └── config/types.ts

policy/Debouncer.ts
  ├── bus/EventBus.ts
  ├── bus/events.ts
  └── logger/logger.ts

state/StateStore.ts
  ├── config/types.ts
  └── node:fs / node:path

health/HealthService.ts
  ├── sync/IndexProvider.ts
  ├── providers/ProviderRegistry.ts
  └── node:fs / node:path

metrics/MetricsStore.ts
  └── metrics/MetricsRecorder.ts

metrics/MetricsRecorder.ts
  └── (pure interfaces)

config/Config.ts
  ├── js-yaml (npm)
  ├── config/types.ts
  └── node:fs / node:path

logger/logger.ts
  ├── pino (npm)
  ├── pino-pretty (npm, transport)
  ├── node:path
  └── node:fs

bus/EventBus.ts
  └── node:events
```

### 2.2 Cross-Project Dependencies

| Direction | References | Status |
| :--- | :--- | :--- |
| Flow OS → GraphSync | **0** references | Clean |
| GraphSync → Flow OS | **0** references | Clean |
| GraphSync → Workspace | **0** references | Clean |
| Workspace → GraphSync | **0** references | Clean |

**Conclusion:** GraphSync has zero coupling to Flow OS at the source code level.

### 2.3 Dead Dependencies

| Package | Declared In | Used In | Verdict |
| :--- | :--- | :--- | :--- |
| `@modelcontextprotocol/sdk` | package.json (dependencies) | Nowhere | **DEAD** — MCPIndexProvider uses raw JSON-RPC over stdio, never imports the SDK |

---

## 3. Coupling Analysis

### 3.1 Source Code Domain Scan

Scanned all 24 `.ts` files in `graphsync/src/` for domain-specific terms:

| Term | Occurrences | Classification | Verdict |
| :--- | :--- | :--- | :--- |
| `restaurant` | **0** | domain | Clean |
| `menu` | **0** | domain | Clean |
| `product` | **0** | domain | Clean |
| `RKS` | **0** | domain | Clean |
| `tony` | **0** | domain | Clean |
| `burgers` | **0** | domain | Clean |
| `school` | **0** | domain | Clean |
| `cognitive` | **0** | domain | Clean |
| `flow` | **0** | infrastructure | Clean |
| `mcp` | 17 | infrastructure | OK — provider name |
| `codebase-memory-mcp` | 4 | infrastructure | OK — binary name |
| `graphsync` | 59 | infrastructure | OK — self-reference |

**Conclusion:** Zero domain terms in source code. All domain references exist only in:

- `.graphsync.yml` (configuration — stays with Flow OS)
- `.graphsync.yml.example` (example — stays in repo)
- `README.md` (documentation — stays in repo)
- `ROADMAP_V2.md` (internal planning — stays in repo)

### 3.2 Coupling to Flow OS Infrastructure

| Artifact | Coupling | Details |
| :--- | :--- | :--- |
| File structure | None | `graphsync/` is a top-level directory, fully self-contained |
| Monorepo workspace | None | `pnpm-workspace.yaml` does not include `graphsync/` |
| ESLint config | None | Root `eslint.config.mjs` does not cover `graphsync/` |
| Root tsconfig | None | `graphsync/tsconfig.json` is completely independent |
| Root package.json | None | No scripts or dependencies reference `graphsync` |
| Root .gitignore | Partial | `graphsync/dist/` is NOT ignored globally (would need adding) |
| CI/CD | None | No workflows or scripts reference `graphsync` |

---

## 4. Configuration Audit

### 4.1 `package.json` — Belongs to GraphSync

```
name:            "graphsync"                      →  Own
version:         "1.0.0"                           →  Own
type:            "module"                           →  Own
bin:             { graphsync: "./dist/main.js" }    →  Own
scripts:         build, start, dev, test, lint     →  Own
dependencies:    8 packages (1 dead)                →  Own
devDependencies: 4 packages                         →  Own
```

**No shared configuration with Flow OS.** GraphSync is fully self-contained.

**Action:**
- Remove `@modelcontextprotocol/sdk` from dependencies (unused)
- Pin `@types/node` to the same major version as Flow OS to avoid type conflicts in a monorepo
- Add `prepublishOnly`, `prepack` scripts for npm publishing

### 4.2 `tsconfig.json` — Belongs to GraphSync

| Option | Value | Assessment |
| :--- | :--- | :--- |
| target | ES2022 | OK |
| module | ESNext | OK |
| moduleResolution | bundler | OK for package consumers |
| outDir | dist | OK |
| rootDir | src | OK |
| declaration | true | Required for package consumers |
| declarationMap | true | OK |
| sourceMap | true | OK |

**Changes needed for extraction:**
- Consider `moduleResolution: "node16"` for better compatibility with Node.js ESM consumers
- Add `"exports"` map in package.json for proper subpath exports

### 4.3 `vitest.config.ts` — Belongs to GraphSync

Fully independent. No shared test infrastructure with Flow OS.

### 4.4 `.graphsync.yml` — Stays WITH Flow OS

This is the consumer's configuration file. It contains:

- `project: tony-burgers` — Flow OS identifier
- `restaurant-school`, `foundations`, `governance` — Flow OS knowledge sources
- `repo_path: ..` — path relative to Flow OS directory structure
- `graphsync/**` in ignore list — references GraphSync's own directory

**After extraction**, Flow OS keeps its own `.graphsync.yml`. GraphSync will provide a default config in its package or document how to create one.

### 4.5 `.graphsync.yml.example` — Stays WITH Flow OS (or goes with GraphSync docs)

The example config is generic enough to serve as documentation. It should move to `graphsync/docs/` or the extracted repo's documentation.

### 4.6 Environment Configuration

**None found.** GraphSync does not use `.env` files. It reads configuration exclusively from `.graphsync.yml`.

---

## 5. Build System Audit

### 5.1 Current Build Pipeline

```
npm run build    →  tsc                    →  dist/
npm run start    →  node dist/main.js
npm run dev      →  tsx src/main.ts
npm test         →  vitest run
npm run lint     →  tsc --noEmit
```

### 5.2 Binary Distribution

```json
"bin": {
  "graphsync": "./dist/main.js"
}
```

`dist/main.js` is the compiled entry point. Shebang `#!/usr/bin/env node` is in `src/main.ts` but must be preserved in the output.

### 5.3 CLI Commands (5 total)

| Command | File | Description |
| :--- | :--- | :--- |
| `graphsync start` | `cli/start.command.ts` | Watcher + sync engine |
| `graphsync stop` | `cli/stop.command.ts` | PID-based stop |
| `graphsync status` | `cli/status.command.ts` | Current state display |
| `graphsync inspect` | `cli/inspect.command.ts` | Config + health display |
| `graphsync index` | `cli/index.command.ts` | Manual index trigger |

### 5.4 Proposed Build for Independent Package

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/main.ts",
    "test": "vitest run",
    "lint": "tsc --noEmit",
    "prepublishOnly": "npm run build",
    "prepack": "npm run build"
  }
}
```

**Changes from current:**
- No changes needed — already standalone

**Considerations for npm publishing:**
- Set `"private": false`
- Add `"publishConfig": { "access": "public" }`
- Add `"files": ["dist", "README.md", "LICENSE"]`
- Add `"engines": { "node": ">=18" }`
- Add `"license": "MIT"` (or chosen license)
- Add `"repository"`, `"homepage"`, `"bugs"` fields

---

## 6. Persistent State Audit

### 6.1 State Location

```
~/.graphsync/
├── projects/
│   └── <project-name>/
│       ├── state.json
│       ├── queue.json
│       └── lock
└── logs/
    └── graphsync.log
```

### 6.2 Flow OS Dependency Analysis

| Path Component | Flow OS Dependent? | Notes |
| :--- | :--- | :--- |
| `~/.graphsync/` | **No** | Uses `os.homedir()`, fully portable |
| `projects/<name>/` | **No** | `<name>` comes from config (`project` field) |
| `state.json` | **No** | All fields are operational (timestamps, statuses, commit hashes) |
| `queue.json` | **No** | Purely operational queue |
| `lock` | **No** | PID-based, OS-portable |

### 6.3 `state.json` Schema Independence

```typescript
interface ProjectState {
  version: number;            // schema version
  status: string;             // "idle" | "indexing" | "error"
  provider: string;           // provider name (e.g. "codebase-memory-mcp")
  lastIndexedAt: string|null; // ISO timestamp
  lastCommit: string|null;    // git commit hash
  lastMode: IndexMode|null;   // "fast" | "moderate" | "full"
  pendingChanges: number;     // queue length
  knowledgeSources: Record<string, SourceState>;  // per-source state
}
```

**No domain-specific fields.** The `knowledgeSources` record is keyed by source ID from config (which could be domain-specific), but the values are purely operational (status, timestamps, mode).

### 6.4 State Portability

State is fully portable. Extracting GraphSync:
- **Existing state remains untouched** at `~/.graphsync/projects/<name>/`
- **The extracted package reads the same format** — no migration needed
- **Multiple projects from multiple repos** can coexist in the same `~/.graphsync/projects/` directory

**Risk:** LOW — no state migration required.

---

## 7. Provider Layer Audit

### 7.1 Interface Decoupling

```typescript
interface IndexProvider {
  readonly name: string;
  index(options: IndexOptions): Promise<IndexResult>;
  health(): Promise<HealthStatus>;
}
```

**Assessment:** The `IndexProvider` interface is fully decoupled from SyncEngine. No implementation details leak into the orchestrator.

### 7.2 Current Providers

| Provider | Type | Communication | Dependencies |
| :--- | :--- | :--- | :--- |
| `MCPIndexProvider` | Real | JSON-RPC 2.0 over stdio | `node:child_process` |
| `DryRunProvider` | Test | In-memory | None |

### 7.3 ProviderRegistry Coupling

```typescript
class ProviderRegistry {
  register(type: string, provider: IndexProvider): void;
  setActive(type: string): void;
  getActive(): IndexProvider | null;
}
```

**Assessment:** ProviderRegistry is a simple registry with no knowledge of provider internals. It is fully decoupled.

### 7.4 MCPIndexProvider Binary Dependency

The `MCPIndexProvider` spawns an external binary (`codebase-memory-mcp`). This binary is:
- Not part of GraphSync
- Not part of npm dependencies
- Expected at a path provided in `.graphsync.yml`

**After extraction:** The MCP binary remains an external dependency. GraphSync only needs to know its path. No change required.

### 7.5 Provider Extensibility

A future provider (e.g., `IncrementalProvider`, `RemoteProvider`, `ScopeXProvider`) can be implemented by:
1. Implementing the `IndexProvider` interface
2. Registering in `ProviderRegistry` at startup
3. No changes to `SyncEngine` or any pipeline component

**Assessment:** Trivially extensible. No decoupling work needed.

---

## 8. Architecture Evaluation

### 8.1 Module Assessment

| Module | Hidden Dependencies? | Flow OS Coupling? | Extraction Ready? |
| :--- | :--- | :--- | :--- |
| `bus/EventBus.ts` | None | None | ✅ Ready |
| `bus/events.ts` | None | None | ✅ Ready |
| `config/Config.ts` | None | None¹ | ✅ Ready (minor) |
| `config/types.ts` | None | None | ✅ Ready |
| `watcher/FileWatcher.ts` | None | None | ✅ Ready |
| `analyzer/ChangeAnalyzer.ts` | None | None | ✅ Ready |
| `policy/PolicyEngine.ts` | None | None | ✅ Ready |
| `policy/Debouncer.ts` | None | None | ✅ Ready |
| `sync/SyncEngine.ts` | `git rev-parse` command | Implicit² | ⚠️ Minor |
| `sync/IndexProvider.ts` | None | None | ✅ Ready |
| `providers/*.ts` | MCP binary³ | None | ✅ Ready |
| `state/StateStore.ts` | None | None | ✅ Ready |
| `health/HealthService.ts` | None | None | ✅ Ready |
| `metrics/*.ts` | None | None | ✅ Ready |
| `logger/logger.ts` | None | None | ✅ Ready |
| `cli/*.command.ts` | None | None | ✅ Ready |

**Notes:**

1. **Config.ts** hardcodes search paths for `.graphsync.yml` — this is correct behavior for a standalone tool but may need documentation about where the config file lives when GraphSync is extracted.

2. **SyncEngine.ts** (line 231) calls `git rev-parse --short HEAD` via `execSync`. This assumes a Git repository exists. In non-Git contexts, it gracefully returns `null`. This is an implicit repo dependency but is handled gracefully. **No change needed** — it's a best-effort feature that degrades well.

3. **MCPIndexProvider.ts** requires an external binary. This is expected and documented. No change needed.

### 8.2 Implicit Dependencies

| Dependency | Location | Nature | Risk |
| :--- | :--- | :--- | :--- |
| Git installation | `SyncEngine.ts:231` | Optional (`execSync` fallible) | LOW |
| codebase-memory-mcp binary | `MCPIndexProvider.ts` | Required for MCP provider | MEDIUM |
| Filesystem write access to `~/.graphsync/` | `StateStore.ts` | Required | LOW |

### 8.3 Architecture Diagram (As-Is)

```
┌─────────────────────────────────────────────────────────────┐
│                     GraphSync Package                        │
│                                                              │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  main.ts  │→ │ CLI Commands │  │  Config.ts   │           │
│  │  (entry)  │  │  (5 cmds)    │  │  (YAML load) │           │
│  └──────────┘  └──────┬───────┘  └──────────────┘           │
│                        │                                     │
│  ┌─────────────────────┼─────────────────────────────────┐   │
│  │  Pipeline            │                                 │   │
│  │                     ▼                                 │   │
│  │  ┌───────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ FileWatcher│→ │ChangeAnalyzer│→ │ PolicyEngine │   │   │
│  │  │ (chokidar)│  │ (minimatch)  │  │ (cooldowns)  │   │   │
│  │  └───────────┘  └──────────────┘  └──────┬───────┘   │   │
│  │                                           ▼           │   │
│  │                                     ┌──────────┐     │   │
│  │                                     │ Debouncer│     │   │
│  │                                     │ (2s)     │     │   │
│  │                                     └────┬─────┘     │   │
│  │                                          ▼           │   │
│  │                                     ┌──────────┐     │   │
│  │                                     │SyncEngine│     │   │
│  │                                     │ (orchest) │     │   │
│  │                                     └────┬─────┘     │   │
│  └─────────────────────────────────────────┼───────────┘   │
│                                            ▼               │
│  ┌──────────────────────────────────────────────────┐       │
│  │  ProviderRegistry                                │       │
│  │  ┌──────────────┐  ┌───────────────────────┐     │       │
│  │  │ MCPIndexProv │  │ DryRunProvider        │     │       │
│  │  │ (JSON-RPC)   │  │ (in-memory mock)      │     │       │
│  │  └──────┬───────┘  └───────────────────────┘     │       │
│  └─────────┼────────────────────────────────────────┘       │
│            ▼                                                 │
│    ┌──────────────┐                                         │
│    │ codebase-    │  (external binary, not in package)       │
│    │ memory-mcp   │                                         │
│    └──────────────┘                                         │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ EventBus │  │StateStore│  │HealthSvc │  │ Metrics  │    │
│  │ (events) │  │(~/.gsync)│  │(bin/health│  │(in-mem)  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Logger (pino) — stdout + file (~/.cache/graphsync)│     │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Public API Surface

Defined for the extracted package. Not implemented.

### 9.1 CLI

```
graphsync [command] [options]

Commands:
  start     Start the watcher and sync engine
  stop      Stop a running instance (PID-based)
  status    Show current state
  inspect   Show config and health
  index     Manually trigger an index

Global Options:
  -c, --config <path>    Config file path
  --log-level <level>    debug | info | warn | error
  --no-pretty            Disable pretty logging

Start Options:
  --cooldown <seconds>   Override cooldown (for testing)

Index Options:
  -m, --mode <mode>      fast | moderate | full
  -s, --source <source>  Source to index
```

### 9.2 Programmatic API

```typescript
// Primary entry point
import { createGraphSync } from 'graphsync';

// Configuration
import { loadConfig, GraphSyncConfig } from 'graphsync/config';

// Pipeline (low-level use)
import { FileWatcher } from 'graphsync/watcher';
import { ChangeAnalyzer } from 'graphsync/analyzer';
import { PolicyEngine } from 'graphsync/policy';
import { Debouncer } from 'graphsync/policy';
import { SyncEngine } from 'graphsync/sync';
import { EventBus } from 'graphsync/bus';

// State
import { StateStore, ProjectState } from 'graphsync/state';

// Providers
import { IndexProvider, IndexOptions, IndexResult } from 'graphsync/provider';
import { MCPIndexProvider } from 'graphsync/providers/mcp';
import { DryRunProvider } from 'graphsync/providers/dry-run';
import { ProviderRegistry } from 'graphsync/providers';

// Utilities
import { HealthService } from 'graphsync/health';
import { MetricsStore } from 'graphsync/metrics';
import { createLogger } from 'graphsync/logger';
```

### 9.3 Provider API (for implementers)

```typescript
import { IndexProvider, IndexOptions, IndexResult, HealthStatus } from 'graphsync/provider';

class MyCustomProvider implements IndexProvider {
  readonly name = 'my-custom';

  async index(options: IndexOptions): Promise<IndexResult> {
    // Implement indexing logic
    return { success: true, durationMs: 0, mode: options.mode };
  }

  async health(): Promise<HealthStatus> {
    return { available: true, version: '1.0', lastContact: new Date() };
  }
}
```

### 9.4 Events API (for hooks/plugins)

```typescript
import { EventBus, GraphSyncEvent } from 'graphsync/bus';

const bus = new EventBus();

bus.on(GraphSyncEvent.IndexStarted, (payload) => { /* ... */ });
bus.on(GraphSyncEvent.IndexFinished, (payload) => { /* ... */ });
bus.on(GraphSyncEvent.IndexFailed, (payload) => { /* ... */ });
```

### 9.5 Configuration API

```typescript
// Define a .graphsync.yml and load it:
const config = loadConfig('/path/to/.graphsync.yml');

// Or construct programmatically:
const config: GraphSyncConfig = {
  version: 1,
  project: 'my-project',
  watch: { paths: ['docs/**'], ignore: ['node_modules/**'] },
  knowledge_sources: [
    { id: 'docs', label: 'Documentation', paths: ['docs/**'] }
  ],
  indexing: { default_mode: 'fast', debounce_ms: 2000, cooldown_seconds: 60 },
  provider: { type: 'mcp', binary: '/path/to/binary', repo_path: '.', timeout_ms: 300000 },
  state: { dir: '~/.graphsync' },
};
```

### 9.6 Package Exports Map (proposed)

```json
{
  "exports": {
    ".": {
      "types": "./dist/main.d.ts",
      "default": "./dist/main.js"
    },
    "./config": {
      "types": "./dist/config/types.d.ts",
      "default": "./dist/config/Config.js"
    },
    "./watcher": {
      "types": "./dist/watcher/FileWatcher.d.ts",
      "default": "./dist/watcher/FileWatcher.js"
    },
    "./analyzer": {
      "types": "./dist/analyzer/ChangeAnalyzer.d.ts",
      "default": "./dist/analyzer/ChangeAnalyzer.js"
    },
    "./policy": {
      "types": "./dist/policy/PolicyEngine.d.ts",
      "default": "./dist/policy/PolicyEngine.js"
    },
    "./sync": {
      "types": "./dist/sync/SyncEngine.d.ts",
      "default": "./dist/sync/SyncEngine.js"
    },
    "./provider": {
      "types": "./dist/sync/IndexProvider.d.ts",
      "default": "./dist/sync/IndexProvider.js"
    },
    "./providers": {
      "types": "./dist/providers/ProviderRegistry.d.ts",
      "default": "./dist/providers/ProviderRegistry.js"
    },
    "./providers/mcp": {
      "types": "./dist/providers/MCPIndexProvider.d.ts",
      "default": "./dist/providers/MCPIndexProvider.js"
    },
    "./providers/dry-run": {
      "types": "./dist/providers/DryRunProvider.d.ts",
      "default": "./dist/providers/DryRunProvider.js"
    },
    "./state": {
      "types": "./dist/state/StateStore.d.ts",
      "default": "./dist/state/StateStore.js"
    },
    "./health": {
      "types": "./dist/health/HealthService.d.ts",
      "default": "./dist/health/HealthService.js"
    },
    "./metrics": {
      "types": "./dist/metrics/MetricsStore.d.ts",
      "default": "./dist/metrics/MetricsStore.js"
    },
    "./logger": {
      "types": "./dist/logger/logger.d.ts",
      "default": "./dist/logger/logger.js"
    },
    "./bus": {
      "types": "./dist/bus/EventBus.d.ts",
      "default": "./dist/bus/EventBus.js"
    }
  }
}
```

---

## 10. Risk Analysis

### 10.1 Risk Register

| # | Risk | Category | Impact | Likelihood | Level | Mitigation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| R01 | `.graphsync.yml` hardcodes `project: tony-burgers` and domain-specific sources | Config | Medium | High | **MEDIUM** | Flow OS keeps its own `.graphsync.yml` after extraction. The file is NOT part of the package. |
| R02 | `SyncEngine` calls `git rev-parse` — fails in non-Git contexts | Implicit Dependency | Low | Medium | **LOW** | Already gracefully handled with `try/catch` → returns `null`. Document this behavior. |
| R03 | `stop.command.ts` hardcodes `~/.graphsync` as state dir | Config | Low | Medium | **LOW** | Should respect the config's `state.dir`. Currently ignores config entirely. Minor bug, easy fix. |
| R04 | MCP binary path is in config — may reference Flow OS paths | Config | Medium | Medium | **MEDIUM** | The binary path (`~/.local/bin/codebase-memory-mcp`) is user-specific, not Flow-OS-specific. No action needed. |
| R05 | Relative imports (`../`) break if directory structure changes | Code | High | Low | **MEDIUM** | All imports stay within `graphsync/src/`. The structure is stable. No `../../` patterns exist. Low risk during move if structure preserved. |
| R06 | `graphsync/dist/` is not in Flow OS `.gitignore` | Repo | Low | Low | **LOW** | Not a risk during extraction but should be added to Flow OS's `.gitignore` after extraction. |
| R07 | `@modelcontextprotocol/sdk` is installed but unused | Dependency | Low | High | **LOW** | Remove before publishing. Currently wastes install time and space. |
| R08 | Pino logger writes to `~/.cache/graphsync/` — path hardcoded in `main.ts:30` | Config | Low | Low | **LOW** | Acceptable for a CLI tool. Document that `logDir` can be configured. |
| R09 | `vitest.config.ts` references `test/` with relative paths | Build | Low | Low | **LOW** | Standard for standalone project. No change needed. |
| R10 | Extracted GraphSync package may have different `node_modules` tree | Build | Medium | Medium | **MEDIUM** | Flow OS uses pnpm; GraphSync uses npm. After extraction, each manages its own deps. No conflict. |

### 10.2 Risk Summary

| Level | Count |
| :--- | :--- |
| CRITICAL | 0 |
| HIGH | 0 |
| MEDIUM | 4 |
| LOW | 6 |

**No CRITICAL or HIGH risks identified.** The extraction can be performed with confidence.

---

## 11. Extraction Plan

### Phase 1: Preparation (No Code Changes)

**Duration:** 1 session  
**Risk:** None — analysis only

1. ✅ [COMPLETE] Audit complete — this document serves as Phase 1 output
2. Remove unused dependency `@modelcontextprotocol/sdk` from `graphsync/package.json`
3. Add `graphsync/dist` to Flow OS root `.gitignore` (so dist doesn't get committed during transition)
4. Notify any developers using GraphSync that the extraction is planned (none, based on audit)

### Phase 2: Physical Separation

**Duration:** 1-2 sessions  
**Risk:** LOW (file moves only, no logic changes)

1. Create new repository at `github.com/<org>/graphsync` (or desired location)
2. Copy (not move) all files from `graphsync/` to the new repo root:
   - `src/` (all 24 files)
   - `test/` (all 8 files)
   - `docs/` (ROADMAP_V2.md)
   - `package.json`
   - `tsconfig.json`
   - `vitest.config.ts`
   - `README.md`
   - `.graphsync.yml.example`
   - `package-lock.json`
3. **Do NOT copy** these (stay with Flow OS):
   - `.graphsync.yml` — belongs to Flow OS
   - `dist/` — will be rebuilt
   - `node_modules/` — will be reinstalled
4. Update `package.json` for publishing:
   - Set `"private": false`
   - Add `"publishConfig": { "access": "public" }`
   - Add `"files": ["dist", "README.md", "LICENSE"]`
   - Add `"engines": { "node": ">=18" }`
   - Add `"license": "MIT"`
   - Add repository, homepage, bugs URLs
   - Remove `@modelcontextprotocol/sdk`
5. Create `LICENSE` file
6. Add `.gitignore` for the new repo
7. Commit and push to the new repository

### Phase 3: Validation

**Duration:** 1 session  
**Risk:** LOW (testing only)

1. In the new repository:
   - Run `npm install`
   - Run `npm run build` (must succeed with no errors)
   - Run `npm test` (all 30 tests must pass)
   - Run `npm link` or test the CLI directly
2. Create a minimal test project with a `.graphsync.yml` and verify:
   - `graphsync start` launches and indexes
   - `graphsync status` shows state
   - `graphsync index --mode fast` works
   - File changes trigger reindex
3. Publish to npm registry:
   - `npm publish` (or `npm publish --access public`)

### Phase 4: Consumption from Flow OS

**Duration:** 1 session  
**Risk:** LOW (additive change only)

1. In Flow OS:
   - Remove `graphsync/` directory (or keep as a symlink for backward compat)
   - Add `graphsync` as a dependency: `npm install graphsync` or `pnpm add graphsync`
   - Create a new `.graphsync.yml` at Flow OS root (not in `graphsync/` subdirectory)
   - The state directory `~/.graphsync/projects/tony-burgers/` is automatically reused
2. Verify:
   - `npx graphsync start` works from Flow OS root
   - `npx graphsync status` shows correct state (should show previous index)

### Phase 5: Independent Publication

**Duration:** Ongoing  
**Risk:** None (extraction already complete)

1. Set up CI/CD for the new repo:
   - GitHub Actions: `npm test` on push, `npm publish` on tags
2. Set up issue templates, contribution guide
3. Monitor for initial bug reports
4. Proceed with ROADMAP_V2 phases as the project grows

---

## 12. Proposed Repository Structure

### 12.1 Extracted GraphSync Repository

```
graphsync/
├── .github/
│   └── workflows/
│       ├── ci.yml            # test on push
│       └── publish.yml       # npm publish on tag
├── src/
│   ├── main.ts
│   ├── cli/
│   │   ├── start.command.ts
│   │   ├── stop.command.ts
│   │   ├── status.command.ts
│   │   ├── inspect.command.ts
│   │   └── index.command.ts
│   ├── watcher/
│   │   └── FileWatcher.ts
│   ├── analyzer/
│   │   └── ChangeAnalyzer.ts
│   ├── policy/
│   │   ├── PolicyEngine.ts
│   │   └── Debouncer.ts
│   ├── sync/
│   │   ├── SyncEngine.ts
│   │   └── IndexProvider.ts
│   ├── providers/
│   │   ├── ProviderRegistry.ts
│   │   ├── MCPIndexProvider.ts
│   │   └── DryRunProvider.ts
│   ├── state/
│   │   └── StateStore.ts
│   ├── config/
│   │   ├── Config.ts
│   │   └── types.ts
│   ├── health/
│   │   └── HealthService.ts
│   ├── metrics/
│   │   ├── MetricsRecorder.ts
│   │   └── MetricsStore.ts
│   ├── bus/
│   │   ├── EventBus.ts
│   │   └── events.ts
│   └── logger/
│       └── logger.ts
├── test/
│   ├── setup.ts
│   ├── Config.test.ts
│   ├── StateStore.test.ts
│   ├── ChangeAnalyzer.test.ts
│   ├── PolicyEngine.test.ts
│   ├── Debouncer.test.ts
│   ├── ProviderRegistry.test.ts
│   └── DryRunProvider.test.ts
├── docs/
│   └── ROADMAP_V2.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── LICENSE
├── .gitignore
└── .npmrc
```

### 12.2 Flow OS After Extraction (what remains)

```
tony-burgers/
├── graphsync/                    ← REMOVED (replaced by npm dependency)
├── project-docs/...
├── src/...
├── .graphsync.yml                ← STAYS (Flow OS config)
├── package.json                  ← ADD "graphsync" dependency
└── .gitignore                    ← ADD /graphsync/dist (or whole graphsync/)
```

---

## 13. Migration Checklist

### Pre-Extraction (Phase 1)

- [x] Architecture audit complete
- [x] Dependency map generated
- [x] Coupling analysis complete
- [x] Risk analysis complete
- [ ] Remove `@modelcontextprotocol/sdk` from `graphsync/package.json`
- [ ] Add `graphsync/dist` to Flow OS `.gitignore`
- [ ] Create `graphsync/docs/ARCHITECTURE_AUDIT.md` (this document)
- [ ] Confirm with team: no ongoing GraphSync-dependent work

### Separation (Phase 2)

- [ ] Create new GitHub repository
- [ ] Copy source files (not dist, node_modules, .graphsync.yml)
- [ ] Update `package.json` for publishing
- [ ] Create `LICENSE`
- [ ] Create `.gitignore` for new repo
- [ ] Push to new repository
- [ ] Create npm package (`npm publish`)

### Validation (Phase 3)

- [ ] `npm install` succeeds in new repo
- [ ] `npm run build` succeeds (0 errors)
- [ ] `npm test` — all 30 tests pass
- [ ] `graphsync start` works end-to-end
- [ ] `graphsync status` displays correctly
- [ ] File change triggers reindex
- [ ] npm package listed on registry

### Flow OS Integration (Phase 4)

- [ ] `npm uninstall @modelcontextprotocol/sdk` from Flow OS (was never imported)
- [ ] `pnpm add graphsync` (or `npm install graphsync`)
- [ ] Remove `graphsync/` directory from Flow OS
- [ ] Verify `npx graphsync status` shows previous state
- [ ] Verify `npx graphsync start` works
- [ ] Update any scripts that reference `node graphsync/dist/main.js`
- [ ] Update documentation referencing GraphSync local paths
- [ ] Commit and deploy

### Post-Extraction (Phase 5)

- [ ] Set up GitHub Actions CI
- [ ] Set up npm publish automation
- [ ] Archive old GraphSync documentation in Flow OS
- [ ] Announce extraction to team

---

## 14. Post-Extraction Roadmap

After extraction, GraphSync can evolve independently:

### v1.1 — Cleanup Release

- Remove `@modelcontextprotocol/sdk` from dependencies
- Fix `stop` command to respect `state.dir` from config
- Add proper package `exports` map
- Add `.npmrc` with `registry` config
- Add `engines` field to `package.json`

### v1.2 — Programmatic API Stabilization

- Export proper subpath entrypoints (as defined in §9.6)
- Add TypeScript declarations for all exports
- Add JSDoc to all public interfaces
- Add a `createGraphSync()` convenience function
- Write API documentation

### v1.3 — Testing & CI

- Add GitHub Actions CI (lint, test, build)
- Add integration tests (end-to-end with DryRunProvider)
- Add code coverage reporting
- Add `husky` or `simple-git-hooks` for pre-commit

### v2.0+ — Incremental Indexing

- Implement file-level index in `IndexProvider` interface
- Add `IncrementalProvider` that sends only changed files
- Deprecate full-reindex mode for hot paths
- See `ROADMAP_V2.md` for full strategic vision

---

*End of Architecture Audit — Analysis Complete, No Changes Applied.*
