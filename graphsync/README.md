# GraphSync

**Cognitive graph synchronization engine.**

GraphSync is a permanent piece of cognitive infrastructure. It watches your repository for changes to knowledge-bearing files, decides whether those changes warrant a reindex, and keeps your knowledge graph aligned with the current state of the project.

> The cognitive graph must converge toward the current state of the repository with minimal latency.

---

## Architecture

```
[Repository] → FileWatcher → ChangeAnalyzer → PolicyEngine → Debouncer → SyncEngine → IndexProvider → [Knowledge Graph]
                                      │                                                 │
                                      ▼                                                 ▼
                               StateStore (~/.graphsync/)                     ProviderRegistry
                                                                                  │
                                                                           ┌──────┴──────┐
                                                                           │ MCP  │ Incr │ ...
                                                                           │ Now  │ Fut  │
```

### Pipeline stages

| Stage | Responsibility |
|-------|----------------|
| **FileWatcher** | Watches configured paths using chokidar. Emits raw file events (add, change, unlink). |
| **ChangeAnalyzer** | Classifies each event by Knowledge Source. A file that does not belong to any source is ignored. |
| **PolicyEngine** | Decides whether the change warrants a reindex based on cooldowns, first-time status, and mode configuration. |
| **Debouncer** | Batches rapid changes into a single index operation (configurable window, default 2s). |
| **SyncEngine** | Orchestrates the full flow. Acquires a lock, calls the IndexProvider, updates persistent state, and processes the queue. |
| **IndexProvider** | Abstract interface for knowledge graph backends. Currently ships with `MCPIndexProvider` (JSON-RPC to codebase-memory-mcp) and `DryRunProvider`. |

### Key design decisions

- **No MCP coupling.** The SyncEngine depends only on the `IndexProvider` interface. The concrete implementation is resolved at startup by the `ProviderRegistry`. This makes GraphSync backend-agnostic.
- **Knowledge Sources, not file extensions.** Classification is done by source definition, not by extension. You declare what "knowledge" means for your project in `.graphsync.yml`.
- **State is strictly operational.** Only timestamps, statuses, and commit hashes are persisted. Nothing derivable or duplicated.
- **No unnecessary reindexes.** The PolicyEngine evaluates every batch against cooldowns, first-seen status, and source importance before triggering an index.
- **Multi-project ready.** State is isolated per project in `~/.graphsync/projects/<name>/`. Lockfiles prevent concurrent access.

---

## Installation

```bash
# Clone or copy the graphsync directory into your project
# or install as a standalone tool

cd graphsync
npm install
npm run build
npm link   # makes `graphsync` available globally
```

### Prerequisites

- **Node.js >= 18**
- **codebase-memory-mcp binary** (optional — falls back to dry-run mode if not configured)
- **fswatch** (macOS) or **inotify-tools** (Linux) — for the `graphsync start` watcher when running the Node.js version (chokidar is used directly, no OS-level tools needed)

---

## Quick Start

### 1. Create a `.graphsync.yml` in your project root

```yaml
version: 1
project: my-project

watch:
  paths:
    - docs/**
    - src/**
  ignore:
    - node_modules/**

knowledge_sources:
  - id: documentation
    label: "Documentation"
    paths:
      - docs/**
  - id: source-code
    label: "Source Code"
    paths:
      - src/**

indexing:
  default_mode: fast
  mode_by_source:
    documentation: fast
    source-code: moderate
  debounce_ms: 2000
  cooldown_seconds: 60

provider:
  type: mcp
  binary: ~/.local/bin/codebase-memory-mcp
  repo_path: .
  timeout_ms: 300000

state:
  dir: ~/.graphsync
```

### 2. Start GraphSync

```bash
graphsync start
```

This starts the file watcher and sync engine. It will run until you press Ctrl+C.

### 3. Check status

```bash
graphsync status
```

### 4. Inspect configuration and health

```bash
graphsync inspect
```

### 5. Trigger a manual index

```bash
graphsync index --mode moderate
graphsync index --mode fast --source documentation
```

---

## CLI Reference

| Command | Description |
|---------|-------------|
| `graphsync start` | Start the watcher and sync engine (foreground). |
| `graphsync stop` | Send SIGTERM to a running GraphSync instance. |
| `graphsync status` | Show current state: provider, last index, commits, pending. |
| `graphsync inspect` | Show knowledge sources, provider health, binary status. |
| `graphsync index` | Manually trigger an index (useful for CI or first setup). |

### Global options

| Option | Description |
|--------|-------------|
| `-c, --config <path>` | Path to `.graphsync.yml` (default: search cwd). |
| `--log-level <level>` | Log level: debug, info, warn, error. |
| `--no-pretty` | Disable pretty console logging (for production). |

---

## Configuration Reference

### `.graphsync.yml`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `version` | number | `1` | Config schema version. |
| `project` | string | **required** | Project name. Used for state isolation. |
| `watch.paths` | string[] | `[]` | Glob patterns to watch. |
| `watch.ignore` | string[] | `[]` | Glob patterns to ignore. |
| `knowledge_sources[].id` | string | **required** | Unique source identifier. |
| `knowledge_sources[].label` | string | required | Human-readable label. |
| `knowledge_sources[].paths` | string[] | required | Glob patterns for this source. |
| `indexing.default_mode` | `fast`/`moderate`/`full` | `fast` | Default index mode. |
| `indexing.mode_by_source` | object | `{}` | Per-source mode overrides. |
| `indexing.debounce_ms` | number | `2000` | Debounce window in ms. |
| `indexing.cooldown_seconds` | number | `60` | Min seconds between same-source indexes. |
| `provider.type` | string | `mcp` | Provider type (`mcp`, `dry-run`). |
| `provider.binary` | string | `undefined` | Path to MCP binary (required for `mcp`). |
| `provider.repo_path` | string | `.` | Repository path. |
| `provider.timeout_ms` | number | `300000` | Index timeout. |
| `state.dir` | string | `~/.graphsync` | State directory. |

---

## Providers

### MCPIndexProvider

Communicates with `codebase-memory-mcp` via JSON-RPC 2.0 over stdio. It spawns the binary, performs the MCP handshake, calls `index_repository`, and returns the result.

### DryRunProvider

Logs what it would do without actually indexing. Useful for testing and validation.

### Adding a new provider

Implement the `IndexProvider` interface:

```typescript
interface IndexProvider {
  readonly name: string;
  index(options: IndexOptions): Promise<IndexResult>;
  health(): Promise<HealthStatus>;
}
```

Register it in the `ProviderRegistry` at startup:

```typescript
registry.register('my-provider', new MyProvider());
registry.setActive('my-provider');
```

No changes to the SyncEngine or any other module are needed.

---

## State Directory Structure

```
~/.graphsync/
├── projects/
│   ├── my-project/
│   │   ├── state.json      # Operational state
│   │   ├── queue.json      # Pending changes during active index
│   │   └── lock            # PID-based lockfile
│   └── another-project/
│       ├── state.json
│       ├── queue.json
│       └── lock
└── logs/
    └── graphsync.log
```

### state.json

```json
{
  "version": 1,
  "status": "idle",
  "provider": "codebase-memory-mcp",
  "lastIndexedAt": "2026-06-28T18:40:22.000Z",
  "lastCommit": "a1b2c3d",
  "lastMode": "fast",
  "pendingChanges": 0,
  "knowledgeSources": {
    "documentation": {
      "status": "healthy",
      "lastIndexedAt": "2026-06-28T18:40:22.000Z",
      "lastMode": "fast"
    }
  }
}
```

---

## Project Structure

```
graphsync/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── .graphsync.yml.example
├── src/
│   ├── main.ts                        # CLI entry point
│   ├── cli/
│   │   ├── start.command.ts           # graphsync start
│   │   ├── stop.command.ts            # graphsync stop
│   │   ├── status.command.ts          # graphsync status
│   │   ├── inspect.command.ts         # graphsync inspect
│   │   └── index.command.ts           # graphsync index
│   ├── watcher/
│   │   └── FileWatcher.ts             # chokidar-based file watcher
│   ├── analyzer/
│   │   └── ChangeAnalyzer.ts          # Classifies changes by source
│   ├── policy/
│   │   ├── PolicyEngine.ts            # Decides if reindex is needed
│   │   └── Debouncer.ts              # Timer-based change batching
│   ├── sync/
│   │   ├── SyncEngine.ts              # Orchestrator
│   │   └── IndexProvider.ts           # Abstract provider interface
│   ├── providers/
│   │   ├── ProviderRegistry.ts        # Provider type → implementation
│   │   ├── MCPIndexProvider.ts        # JSON-RPC to codebase-memory-mcp
│   │   └── DryRunProvider.ts          # Testing provider
│   ├── state/
│   │   └── StateStore.ts              # ~/.graphsync/ manager
│   ├── config/
│   │   ├── Config.ts                  # YAML config loader
│   │   └── types.ts                   # Config type definitions
│   ├── health/
│   │   └── HealthService.ts           # Binary, provider, system health
│   ├── metrics/
│   │   ├── MetricsRecorder.ts         # Metrics interface
│   │   └── MetricsStore.ts            # In-memory metrics implementation
│   ├── bus/
│   │   ├── EventBus.ts                # Simple event emitter wrapper
│   │   └── events.ts                  # Event types and payloads
│   └── logger/
│       └── logger.ts                  # Pino-based structured logging
├── test/
│   ├── setup.ts
│   ├── Config.test.ts
│   ├── StateStore.test.ts
│   ├── ChangeAnalyzer.test.ts
│   ├── PolicyEngine.test.ts
│   ├── Debouncer.test.ts
│   ├── ProviderRegistry.test.ts
│   └── DryRunProvider.test.ts
└── dist/                              # Compiled output
```

---

## Future

GraphSync is designed for incremental indexing support from day one. When `codebase-memory-mcp` (or any provider) adds the ability to index specific files instead of the entire repository, the `IndexProvider` interface can be extended with file-level granularity. No changes to the pipeline, policy engine, or state management are required.

### Planned

- **IncrementalProvider** — uses `index_files` (or equivalent) when available
- **RemoteProvider** — syncs knowledge graphs across team members
- **Webhook mode** — receives file change notifications from CI/CD pipelines
- **Health dashboard** — visualized state and metrics

---

## License

GraphSync is infrastructure for cognitive systems.

Use it. Extend it. Keep your memory synchronized.
