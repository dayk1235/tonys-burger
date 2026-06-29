# GraphSync V2 — Evolution Roadmap

**From Index Synchronizer to Knowledge Synchronization Engine**

| Field | Value |
| :--- | :--- |
| **Document** | ROADMAP_V2 |
| **Status** | Strategic Vision |
| **Version** | 1.0.0 |
| **Applies To** | GraphSync v1.x → v7.x |
| **Audience** | Architects, implementers, project consumers |

---

## Preamble

### Why This Document Exists

GraphSync v1 is operational. It detects file changes, applies policies, and keeps the knowledge graph synchronized with the repository. It works.

But v1 has a fundamental limitation: **it operates on files, not on knowledge.**

A file changes. GraphSync reindexes. It does not know what that file *meant*. It does not know which concepts lived inside it. It does not know what other knowledge depended on those concepts. It treats all changes as equal — a typo fix and a conceptual redefinition trigger the same response.

This roadmap describes the evolution from a file-level synchronizer to a **knowledge-level synchronization engine** over seven major versions. Each version adds a layer of understanding. None of them add domain-specific intelligence. GraphSync remains domain-agnostic at every stage.

### The Invariant

> GraphSync must never know what it is synchronizing.

It must not know that a document describes a Restaurant, a Medical Protocol, or a Financial Regulation. It must know only that:
- Knowledge exists in units.
- Units depend on other units.
- Units change over time.
- Changes have semantic weight.
- Dependencies determine propagation.

Everything else belongs to plugins, adapters, and downstream consumers.

### How to Read This Document

Each version section describes:
- **Objective** — what the version achieves.
- **New Abstractions** — the concepts introduced.
- **Architectural Impact** — how existing components change.
- **Capabilities Added** — what the system can now do that it could not before.
- **What Remains Unchanged** — the invariants preserved across versions.

The versions are ordered. Each version depends on its predecessors. No version can be skipped.

---

## GraphSync v1 — File-Level Synchronization

**Status: Complete. This is the current state.**

### Objective

Detect changes to knowledge-bearing files and trigger full reindexes through a configurable backend.

### Architecture

```
[Repository] → FileWatcher → ChangeAnalyzer → PolicyEngine → Debouncer → SyncEngine → IndexProvider → [Graph]
```

### Core Abstractions

| Abstraction | Definition |
|-------------|------------|
| **Knowledge Source** | A named collection of file path patterns that define what constitutes "knowledge" for a project. A file either belongs to a source or it does not. |
| **Change Event** | A raw file-system notification: a file was added, changed, or deleted. Carries the file path and the type of change. |
| **Policy Decision** | A binary judgment: should this batch of changes trigger a reindex? Based on cooldowns, first-seen status, and source importance. |
| **Index Operation** | A full or filtered reindex of the entire repository through the configured provider. Supports `fast`, `moderate`, and `full` modes. |
| **Provider** | An abstract interface for knowledge graph backends. The SyncEngine never knows which provider is active. |
| **State** | Persistent operational record: last index timestamp, last commit, status, per-source health. Stored per project in `~/.graphsync/`. |

### Capabilities

- File watching via chokidar with configurable paths and ignore patterns.
- Change classification by Knowledge Source (not file extension).
- Policy-driven reindex decisions with cooldown enforcement.
- Debounced batching of rapid changes (default 2s window).
- Lock-based concurrency prevention.
- Queue of pending changes during active index.
- Persistent state across restarts.
- Provider abstraction (currently MCP and DryRun).

### Limits

1. **Granularity is file-level.** The system knows that `document.md` changed. It does not know *what* about the document changed — a typo versus a conceptual correction are indistinguishable.
2. **Reindex is always full-repo or full-source.** Even in `fast` mode, the provider scans the entire repository or source. There is no way to update only the affected knowledge.
3. **No dependency awareness.** The system does not know that changing `recipe.md` might invalidate `menu.md`. Every change is treated as independent.
4. **No semantic understanding.** A change to a definition and a change to formatting look identical to the policy engine.
5. **Single-project scope.** Each GraphSync instance manages exactly one project. Cross-project knowledge relationships are invisible.

---

## GraphSync v2 — Incremental Knowledge Synchronization

**Target: Next implementation cycle.**

### Objective

Replace full-source reindexes with targeted updates that synchronize only the knowledge units affected by a change.

### The Problem

In v1, every change triggers a full reindex of the source (or even the entire repo). Consider a project with 1,000 documents. Editing the formatting of one sentence in one document causes GraphSync to: (1) tell the provider to reindex the entire source, (2) wait for the provider to scan all 1,000 documents, (3) update the graph with changes that are, in reality, negligible.

This is wasteful. As the project grows, the cost grows linearly with the total number of files, not with the number of changed files.

### Solution: Knowledge Units

A **Knowledge Unit** is the smallest independently identifiable piece of knowledge in a document. It has identity, content, type, and provenance.

Examples across domains:
- A Restaurant School ontology document → each concept definition is a Knowledge Unit.
- A Medical Protocol document → each step in the protocol is a Knowledge Unit.
- A Financial Regulation document → each clause is a Knowledge Unit.
- A Software Architecture document → each decision record is a Knowledge Unit.

A Knowledge Unit is not a file. A file may contain many Knowledge Units. A change to a file may affect one, several, or all of its units.

### New Abstractions

| Abstraction | Definition |
|-------------|------------|
| **Knowledge Unit** | A node in the knowledge graph with identity, type, content hash, and dependencies. The atomic unit of synchronization. |
| **Knowledge Change** | A diff between two states of a Knowledge Unit. Describes what changed at the unit level, not the file level. |
| **Knowledge Fragment** | A subset of the knowledge graph that contains all units affected by a set of changes, plus their immediate dependencies. |
| **Change Set** | A collection of Knowledge Changes grouped by causality and time. |
| **Incremental Update** | A synchronization operation that processes only the units in a Change Set, not the entire graph. |

### Architectural Changes

**From v1:**
```
FileChanged → Classify → Decide → Debounce → Reindex entire source
```

**To v2:**
```
FileChanged → Parse → Extract Units → Diff → Identify Changes → Build Fragment → IncrementalUpdate
```

The pipeline grows a new middle section between change detection and synchronization. The SyncEngine no longer calls `index_repository`. It calls `update_fragment(knowledgeFragment)`.

The IndexProvider interface gains a new method:

```
updateFragment(fragment: KnowledgeFragment): Promise<UpdateResult>
```

The existing `index(options)` method remains for bootstrapping (first-time full index). All subsequent operations use `updateFragment`.

### Capabilities Added

- **Targeted updates.** Only changed units are sent to the provider. Unchanged units are never reprocessed.
- **Content-addressed identity.** Each unit is identified by a content hash. If the hash has not changed, the unit has not changed. No parsing needed.
- **Fragment scoping.** The system sends only the fragment of the graph that contains changes and their direct dependencies. The provider's work is proportional to the size of the change, not the size of the project.
- **Bootstrapping awareness.** The first index is still full. All subsequent indexes are incremental. The system tracks which units have been indexed and which are new.

### What This Enables

- Projects with 10,000+ documents can have near-instantaneous synchronization for small changes.
- Multiple rapid edits to the same unit are debounced and collapsed into a single update.
- A typo fix in one paragraph no longer triggers reprocessing of 1,000 unrelated documents.

### What Remains Unchanged

- The outer pipeline (FileWatcher, ChangeAnalyzer, PolicyEngine, Debouncer) remains the same.
- The EventBus, HealthService, MetricsRecorder, StateStore remain the same.
- The domain-agnostic principle remains: GraphSync does not interpret what a Knowledge Unit *means*. It only knows that units exist, have hashes, and can be diffed.

---

## GraphSync v3 — Dependency Graph

**Target: v3.x (after v2 is stable)**

### Objective

Construct and maintain a graph of dependencies between Knowledge Units, enabling impact analysis and intelligent update propagation.

### The Problem

In v2, when a Knowledge Unit changes, the system knows *which* unit changed. But it does not know *what depends on it*.

Consider:
- Document A defines the concept "Customer Lifetime Value."
- Document B uses "Customer Lifetime Value" in a formula.
- Document C explains a strategy based on that formula.

If Document A changes its definition of CLV, Documents B and C become potentially inconsistent. In v2, the system updates only Document A's unit. It has no way of knowing that B and C need attention.

### Solution: Dependency Graph

A **Dependency Graph** is a directed graph where nodes are Knowledge Units and edges represent dependency relationships. An edge from Unit X to Unit Y means "X depends on Y" or "Y is referenced by X."

```
[Doc A: CLV Definition] ← [Doc B: CLV Formula] ← [Doc C: Strategy]
```

When A changes, the system traverses the graph forward from A to find B and C, then marks them as potentially inconsistent.

### New Abstractions

| Abstraction | Definition |
|-------------|------------|
| **Dependency Edge** | A directed relationship between Knowledge Units. Types: `defines`, `references`, `extends`, `contradicts`, `exemplifies`. |
| **Dependency Graph** | The complete set of Dependency Edges across all Knowledge Units in the project. |
| **Invalidation Set** | The set of Knowledge Units that must be rechecked because a unit they depend on has changed. |
| **Impact Radius** | The distance (in edges) from a changed unit within which other units may be affected. Configurable per source. |
| **Dependency Provider** | An external component that extracts dependencies from Knowledge Units. Domain-specific. |

### Architectural Changes

The pipeline gains a new stage after change identification:

```
Extract Units → Diff → Resolve Dependencies → Build InvalidationSet → Build Fragment → Update
```

The **DependencyResolver** module:
- Receives a list of changed units.
- Queries the Dependency Graph for all units that depend on them.
- Computes the Invalidation Set within a configurable Impact Radius.
- Merges the changed units and invalidated units into the Knowledge Fragment.

The Dependency Graph itself is built during the initial full index and maintained incrementally. When a new unit is indexed, its dependencies are extracted and edges are created. When a unit is updated, its dependency edges are re-evaluated.

### Capabilities Added

- **Impact awareness.** The system knows that changing X affects Y and Z.
- **Propagation control.** The Impact Radius limits how far changes propagate. A change to a core definition (radius 3) affects more units than a change to a footnote (radius 0).
- **Consistency maintenance.** Downstream consumers can be notified that knowledge they depend on has changed.
- **Dependency querying.** External tools can ask "what depends on this?" without traversing documents themselves.

### What This Enables

- When a fundamental concept changes (e.g., "Customer" is redefined), all documents that reference or extend that concept are automatically flagged.
- Type-safe knowledge: if Document A defines an entity and Document B references a field that no longer exists, the system can detect the inconsistency.
- Version-aware synchronization: the Dependency Graph tracks which version of each dependency a unit was built against.

### Architectural Invariant

GraphSync does not extract dependencies itself. **Dependency extraction is delegated to a DependencyProvider plugin.** GraphSync stores the edges and traverses them. It does not interpret them.

This preserves domain agnosticism:
- A Restaurant School plugin extracts cross-references between ontology documents.
- A Medical plugin extracts protocol step dependencies.
- A Software plugin extracts architecture decision links.

GraphSync only knows: edges exist, edges have types, edges can be traversed.

---

## GraphSync v4 — Semantic Diff

**Target: v4.x (after v3 is stable)**

### Objective

Distinguish between different *kinds* of changes at the knowledge level. Not all changes are equal — a formatting fix, a definition refinement, and a conceptual reversal have dramatically different implications.

### The Problem

In v3, the system knows *what* changed (which units) and *what depends on it* (which units are affected). But it does not know *how* the change affects meaning.

A document changes. The diff shows that text was added and removed. But:
- Was this a *correction* (fixing an error in the previous version)?
- Was this a *refinement* (adding detail without changing the core meaning)?
- Was this a *redefinition* (changing the fundamental nature of a concept)?
- Was this a *formatting change* (no semantic impact at all)?

Each type of change has different implications for downstream consumers. A formatting change can be ignored. A redefinition may require all dependents to be re-evaluated.

### Solution: Semantic Change Classification

A **Semantic Diff** analyzes the difference between two versions of a Knowledge Unit and classifies the change along multiple dimensions:

1. **Scope:** Did the change affect a definition, an example, a reference, metadata, or formatting?
2. **Magnitude:** Is the change editorial (wording), structural (reorganization), or conceptual (meaning change)?
3. **Direction:** Did the change narrow the concept (more specific), broaden it (more general), or shift it (different meaning)?
4. **Impact:** Is the change internal to the unit (no external effect), referential (affects how others reference this unit), or foundational (affects all dependents)?

### New Abstractions

| Abstraction | Definition |
|-------------|------------|
| **Semantic Change Class** | A category of change: `editorial`, `structural`, `conceptual`, `foundational`. |
| **Change Magnitude** | A measure of how much the meaning changed: `cosmetic`, `minor`, `moderate`, `major`, `breaking`. |
| **Semantic Diff Engine** | A component that compares two versions of a unit and produces a classified diff. |
| **Impact Policy** | A rule that maps Semantic Change Classes to propagation behaviors. |

### Architectural Changes

The pipeline inserts a classification stage between diff and dependency resolution:

```
Extract Units → Diff → ClassifyChange → [if cosmetic: skip propagation] → Resolve Dependencies
```

The Semantic Diff Engine is invoked for each changed Knowledge Unit. Its output feeds into the PolicyEngine, which now considers not just *whether* to reindex but *how far* to propagate:

```
if change.class === 'cosmetic':
    update only this unit
if change.class === 'editorial':
    update this unit + notify direct dependents
if change.class === 'conceptual':
    update this unit + invalidate all dependents within radius 2
if change.class === 'foundational':
    update this unit + invalidate all dependents within radius MAX
```

### Capabilities Added

- **Blind spot elimination.** The system no longer treats a formatting correction and a conceptual reversal as the same kind of event.
- **Proportional response.** The cost of synchronization matches the significance of the change. Cosmetic changes are cheap. Foundational changes are expensive.
- **Downstream filtering.** Consumers can filter notifications by change magnitude: "alert me only when a conceptual or foundational change affects my dependencies."

### What This Enables

- A documentation team can fix typos without triggering dependency re-evaluation across the entire project.
- When a core concept is redefined, all dependent teams are automatically notified with the correct urgency.
- The system can generate changelogs at the semantic level: "3 cosmetic changes, 2 minor refinements, 1 conceptual update."

### Separation of Concerns

The Semantic Diff Engine is **not** built into GraphSync core. It is provided by a plugin. GraphSync defines the interface:

```
interface SemanticDiffPlugin {
  diff(before: KnowledgeUnit, after: KnowledgeUnit): SemanticChange;
}
```

Different domains implement different diff strategies:
- A Markdown document plugin uses section parsing and vocabulary comparison.
- A structured data plugin uses schema comparison.
- A code plugin uses AST diffing.

GraphSync consumes the result. It does not produce it.

---

## GraphSync v5 — Live Knowledge Memory

**Target: v5.x (after v4 is stable)**

### Objective

Maintain a living, queryable history of the project's knowledge — not just the current state, but the trajectory of every unit, every dependency, and every decision.

### The Problem

In v4, the system can synchronize changes intelligently. But it has no *memory* of the past. It knows the current state of every Knowledge Unit. It does not know:
- What changed last week?
- Who changed this concept and why?
- Was this unit ever stable, or has it been in flux?
- Which units change most frequently?
- Is this project's knowledge converging or diverging over time?

Without memory, the system cannot learn from its own history. Every synchronization is an isolated event.

### Solution: Knowledge Timeline

A **Knowledge Timeline** records every change to every Knowledge Unit as an event in a temporal sequence. The timeline is not a log — it is a first-class data structure that can be queried, analyzed, and traversed.

### New Abstractions

| Abstraction | Definition |
|-------------|------------|
| **Knowledge Event** | A recorded change to a Knowledge Unit at a specific time, with the previous and new state, the Semantic Change Class, the trigger (file change, manual, batch), and the responsible agent. |
| **Knowledge Timeline** | A time-ordered sequence of Knowledge Events for a project. Immutable append-only. |
| **Unit History** | The subsequence of the timeline filtered to a single Knowledge Unit. Shows the evolution of one concept over time. |
| **Convergence Metric** | A measure of how stable a Knowledge Unit or source is over time. High frequency of changes indicates a volatile concept. |
| **Knowledge Snapshot** | The complete state of the knowledge graph at a specific point in time. Enables "what did we know on this date?" queries. |

### Architectural Changes

The SyncEngine gains a **History Recorder** that intercepts every completed update and writes a Knowledge Event to the timeline:

```
UpdateComplete → RecordEvent(timestamp, unit, before, after, class, trigger)
```

The timeline is stored in the project's state directory alongside `state.json`. It is a separate store — append-only, no modifications, no deletions. Old events can be pruned by retention policy but never rewritten.

The MetricsRecorder is extended to consume timeline data:
- Volatility scores per source.
- Average time between changes per unit.
- Dependency churn rate.

### Capabilities Added

- **Historical queries.** "Show me all changes to the Customer entity definition in the last 30 days."
- **Stability analysis.** "Which parts of our knowledge graph change most frequently?"
- **Accountability.** "Who (which agent or user) triggered each change?"
- **Rollback awareness.** "What was the state of this unit before the breaking change?"
- **Trend detection.** "Is the overall knowledge base converging toward stability or diverging toward constant revision?"

### What This Enables

- Teams can see the evolution of their knowledge base over time.
- Unstable units can be flagged for review before they cause confusion.
- Historical snapshots enable "knowledge archaeology" — understanding why a concept exists in its current form.
- The timeline feeds into the Learning Engine (in Flow OS) to detect patterns of knowledge evolution.

### Storage Principle

The timeline is immutable. Events are written, never modified, never deleted. If a correction is needed, it is written as a new event that supersedes the previous one. The history always tells the truth — even if the truth is "we were wrong and then we corrected it."

---

## GraphSync v6 — Plugin Architecture

**Target: v6.x (after v5 is stable)**

### Objective

Formalize the plugin system that has been implicit since v2, making GraphSync extensible without modification to its core.

### The Problem

By v5, GraphSync has accumulated plugin points:
- IndexProviders (v1)
- DependencyProviders (v3)
- SemanticDiffPlugins (v4)
- Knowledge Unit parsers (v2, implicit)

Each of these is wired into the system at startup through configuration or code. The wiring is ad hoc. Adding a new plugin type requires modifying the startup sequence, the CLI, the config schema, and the documentation.

A project that wants to use GraphSync with a custom parser, a custom dependency extractor, and a custom diff engine needs to modify the core or fork it.

### Solution: Formal Plugin System

A **Plugin** is a self-contained module that registers one or more capabilities with GraphSync at startup. Plugins are discovered, loaded, and wired automatically.

### New Abstractions

| Abstraction | Definition |
|-------------|------------|
| **Plugin** | A module that implements the `GraphSyncPlugin` interface and registers capabilities. |
| **Plugin Registry** | A registry of all loaded plugins and their capabilities. Queried by the system when it needs a specific capability. |
| **Capability** | A named function that a plugin provides. Examples: `parse:knowledge-unit`, `extract:dependencies`, `diff:semantic`, `index:provider`. |
| **Plugin Descriptor** | Metadata about a plugin: name, version, capabilities, dependencies on other plugins. |

### Plugin Interface

```typescript
interface GraphSyncPlugin {
  name: string;
  version: string;
  capabilities: PluginCapability[];
  initialize(context: PluginContext): Promise<void>;
}

interface PluginCapability {
  type: 'parser' | 'dependency-provider' | 'semantic-diff' | 'index-provider' | 'analyzer' | 'extractor' | 'strategy';
  name: string;
  description: string;
}
```

### Architectural Changes

The startup sequence changes from:

```
LoadConfig → InstantiateProviders → Start
```

To:

```
LoadConfig → DiscoverPlugins → LoadPlugins → RegisterCapabilities → ResolveDependencies → Start
```

The Config system gains a `plugins` section:

```yaml
plugins:
  - name: @graphsync/plugin-markdown
    config:
      section_depth: 3
  - name: @graphsync/plugin-restaurant
    enabled: false
```

The ProviderRegistry evolves into a more general **CapabilityRegistry** that can resolve any capability type, not just IndexProviders.

### Capabilities Added

| Capability Type | Purpose | Examples |
|----------------|---------|---------|
| `parser` | Converts files into Knowledge Units | Markdown parser, YAML parser, Code parser |
| `dependency-provider` | Extracts dependency edges | Cross-reference extractor, import extractor |
| `semantic-diff` | Classifies changes semantically | Text diff, AST diff, Schema diff |
| `index-provider` | Sends updates to knowledge graph backends | MCP provider, Vector provider, File provider |
| `analyzer` | Analyzes knowledge structure | Vocabulary analyzer, Consistency checker |
| `extractor` | Extracts metadata from units | Frontmatter extractor, Tag extractor |
| `strategy` | Determines indexing strategy | Policy strategy, Cooldown strategy |

### What This Enables

- **Ecosystem.** Third-party developers can create plugins without modifying GraphSync core.
- **Composability.** A project can mix and match plugins: Markdown parser + Cross-reference dependency provider + MCP index provider.
- **Versioning.** Plugins declare their version and compatibility. The system can detect conflicts.
- **Discovery.** Plugins can be installed via npm (or equivalent) and auto-discovered.

### The Permanent Rule

> GraphSync core defines interfaces. Plugins provide implementations. The core never imports a plugin directly.

This rule ensures that the plugin system is not a backdoor for coupling. GraphSync remains domain-agnostic and provider-agnostic by construction. Domain intelligence lives in plugins. GraphSync orchestrates their interaction.

---

## GraphSync v7 — Distributed Knowledge Synchronization

**Target: v7.x (after v6 is stable)**

### Objective

Synchronize knowledge across multiple projects, enabling shared knowledge graphs, cross-project dependency resolution, and federated knowledge management.

### The Problem

By v6, a single project's knowledge is well-synchronized. But knowledge does not respect project boundaries:
- Flow OS Restaurant School depends on concepts defined in the Knowledge Framework (KFS).
- The Knowledge Framework depends on cognitive science concepts from a Learning School.
- A Business School depends on Restaurant School metrics.

Each of these may be separate projects, separate repositories, managed by separate teams. In v6, each runs its own GraphSync instance. They are islands. A change to KFS-001 does not propagate to RKS-001 because no cross-project dependency tracking exists.

### Solution: Multi-Project Graph

A **Multi-Project Graph** is a federated knowledge graph that spans multiple GraphSync instances. Each instance manages its own project graph. A synchronization layer connects them, sharing dependency information and propagating changes across boundaries.

### New Abstractions

| Abstraction | Definition |
|-------------|------------|
| **Workspace** | A collection of projects that share knowledge. Defined by a workspace configuration file that lists member projects and their roles. |
| **Multi-Project Graph** | The union of all Knowledge Graphs in a Workspace. Not a single physical graph — a virtual graph assembled on demand. |
| **Shared Knowledge** | Knowledge Units that are published by one project for consumption by others. Marked with a `published: true` flag. |
| **Cross-Project Dependency** | A dependency edge whose source and target reside in different projects. |
| **Knowledge Registry** | A registry of published Knowledge Units across projects. Enables discovery: "which projects define the concept X?" |
| **Federation Protocol** | The mechanism by which GraphSync instances exchange knowledge events. Agnostic to transport (local filesystem, network, message queue). |

### Architectural Changes

GraphSync gains an optional **Federation Layer**:

```
[Project A GraphSync] ↔ [Federation Protocol] ↔ [Project B GraphSync]
```

Each instance:
1. Publishes changes to its published Knowledge Units.
2. Subscribes to changes in other projects' published units that it depends on.
3. Receives cross-project invalidation events and processes them through its local pipeline.

The dependency resolution stage (v3) is extended to resolve cross-project edges:

```
DependencyResolver.resolve(unit) → local edges + remote edges (via Federation)
```

### What This Enables

- **Federated knowledge.** A change to KFS-001 in the Knowledge Framework project automatically propagates to RKS documents in the Restaurant project.
- **Centralized discovery.** A team can ask "which projects define or use concept X?" without cloning every repository.
- **Decentralized autonomy.** Each project owns its graph. No central server is required. Projects can publish selectively.
- **Offline resilience.** If Project B is offline, Project A continues to function. Dependencies are resolved when B becomes available.

### Federation Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Local** | Multiple projects on the same filesystem share a state directory. | Monorepo with multiple knowledge domains. |
| **Network** | GraphSync instances communicate over HTTP or message queues. | Distributed teams, CI/CD pipelines. |
| **Registry** | A central registry stores published units. Instances push/pull on demand. | Large organizations, open-source knowledge bases. |
| **P2P** | Instances discover each other and synchronize directly. | Fully decentralized knowledge management. |

### Architectural Invariant

The Federation Protocol is transport-agnostic. GraphSync defines a `FederationAdapter` interface:

```typescript
interface FederationAdapter {
  publish(events: KnowledgeEvent[]): Promise<void>;
  subscribe(callback: (event: KnowledgeEvent) => void): Promise<void>;
  query(query: FederationQuery): Promise<KnowledgeUnit[]>;
}
```

Local filesystem, HTTP, message queues, and P2P networks are all implementations of this interface. GraphSync core does not know which transport is in use.

---

## Architectural Principles

These principles govern every version of GraphSync. They are inviolable.

### Domain Agnostic

GraphSync must never contain domain-specific logic. It must not know what a Restaurant, a Medical Protocol, a Financial Regulation, or a Software Architecture is. All domain intelligence lives in plugins.

**Why:** Domain coupling is irreversible. Once a system knows a domain, it cannot be used for other domains without modification. GraphSync is infrastructure. Infrastructure must be universal.

**How:** All domain interfaces (`KnowledgeUnit`, `SemanticChange`, `Dependency`) are abstract. Concrete implementations are provided by plugins. GraphSync orchestration code contains zero domain terms.

### Provider Agnostic

GraphSync must never depend on a specific knowledge graph backend. The `IndexProvider` interface is the only bridge. Backends can be local binaries, remote APIs, vector databases, or file systems.

**Why:** Backend technology evolves faster than synchronization logic. A dependency on a specific backend couples GraphSync to that backend's lifecycle, performance characteristics, and failure modes.

**How:** The `IndexProvider` interface defines the contract. `MCPIndexProvider` is one implementation among many. The `ProviderRegistry` resolves the active provider at startup. No code path checks `instanceof MCPIndexProvider`.

### Storage Agnostic

GraphSync must not depend on a specific storage engine for its state, timeline, or configuration. Configuration is currently YAML. State is currently JSON files. These can be replaced with SQLite, PostgreSQL, or any other store without changing the pipeline.

**Why:** Storage requirements evolve with scale. A single-project MVP uses JSON files. A multi-project enterprise deployment needs a database. The architecture must not force a migration path.

**How:** The `StateStore` interface abstracts persistence. The JSON implementation is the default. Alternative implementations (SQLite, PostgreSQL) implement the same interface.

### Transport Agnostic

GraphSync must not depend on a specific transport for federation, plugins, or provider communication. MCP uses stdio JSON-RPC. Federation may use HTTP, message queues, or shared filesystems.

**Why:** Transport coupling limits deployment options. A system that requires stdio cannot run as a network service. A system that requires HTTP cannot run in an air-gapped environment.

**How:** All transport dependencies are abstracted behind interfaces (`FederationAdapter`, `ProviderTransport`). Concrete implementations are selected by configuration.

### AI Agnostic

GraphSync must never depend on a specific AI model, embedding provider, or inference API. Semantic diff analysis, dependency extraction, and knowledge unit parsing may use AI — but the AI is a plugin, not a core dependency.

**Why:** AI models change rapidly. A dependency on GPT-4o today becomes a legacy constraint when GPT-5, Claude 4, or an open-source alternative offers better capabilities at lower cost. GraphSync must be able to switch without code changes.

**How:** AI capabilities are wrapped behind plugin interfaces. `SemanticDiffPlugin` can use AI or deterministic algorithms. GraphSync core does not know which.

### Language Agnostic

GraphSync is currently implemented in TypeScript. This is an implementation detail. The architecture must not assume that all plugins, adapters, or providers are written in TypeScript.

**Why:** A plugin ecosystem cannot require all contributors to use the same language. A Python developer writing a Medical Knowledge plugin should not need to learn TypeScript.

**How:** The plugin system communicates through well-defined interfaces. Plugins can be implemented in any language if they conform to the protocol. The federation protocol is transport-agnostic and language-agnostic by design.

---

## Design Principles

Every new capability must satisfy:

### Open/Closed Principle

Components are open for extension but closed for modification. Adding a new provider type, plugin capability, or federation mode should not require modifying existing components.

**Implementation:** All extension points are interfaces. New capabilities add new implementations of existing interfaces. No existing code is changed.

### Composition over Inheritance

Capabilities are composed from smaller, independent units rather than inherited from base classes.

**Implementation:** The SyncEngine composes FileWatcher, ChangeAnalyzer, PolicyEngine, Debouncer, and IndexProvider. It does not extend any of them.

### Interface First

Every capability is defined by an interface before any implementation is written. The interface is the contract. Implementations conform to it.

**Implementation:** `IndexProvider`, `SemanticDiffPlugin`, `DependencyProvider`, `FederationAdapter`. Each is an interface with at least one implementation before it is considered stable.

### Event Driven

Components communicate through events, not direct calls. The EventBus is the nervous system of GraphSync.

**Implementation:** FileWatcher emits `FileChanged`. Debouncer emits `BatchReady`. SyncEngine emits `IndexStarted`, `IndexFinished`, `IndexFailed`. Components subscribe to events they care about and ignore the rest.

### Incremental Processing

Every operation processes only the delta since the last operation. Full processing is reserved for bootstrapping and recovery.

**Implementation:** v2 introduces Knowledge Units and Fragments. v3 introduces Invalidation Sets. v4 introduces Semantic Change classes. Each version moves further from bulk processing toward delta processing.

### Low Coupling

Components know about interfaces, not implementations. The SyncEngine knows `IndexProvider`, not `MCPIndexProvider`. The PluginRegistry knows `GraphSyncPlugin`, not `MarkdownPlugin`.

**Implementation:** Dependency injection through constructors. No static singletons. No global state (except logger, which is an acknowledged trade-off).

### High Cohesion

Each component has one responsibility and owns it completely. The FileWatcher watches files. The PolicyEngine makes decisions. The SyncEngine orchestrates.

**Implementation:** If a component cannot be described in a single sentence, it is doing too much. Split it.

---

## Version Compatibility

| From \ To | v1 | v2 | v3 | v4 | v5 | v6 | v7 |
|-----------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| v1 | — | Full | Full | Full | Full | Full | Full |
| v2 | — | — | 1.x → 2.x | 2.x | 2.x | 2.x | 2.x |
| v3 | — | — | — | 1.x → 2.x | 2.x | 2.x | 2.x |
| v4 | — | — | — | — | 1.x → 2.x | 2.x | 2.x |
| v5 | — | — | — | — | — | 1.x → 2.x | 2.x |
| v6 | — | — | — | — | — | — | 1.x → 2.x |
| v7 | — | — | — | — | — | — | — |

**Legend:**
- **Full** = All configuration and state must be rebuilt. Breaking change.
- **1.x → 2.x** = In-place migration path exists. Provider implementations may need updates.
- **2.x** = Backward compatible within major version.

### Migration Philosophy

- v1→v2 is the only breaking change. Everything after v2 is additive.
- The v1→v2 break is justified because the core abstraction changes from files to units.
- After v2, every version extends interfaces without removing existing methods.
- Old providers continue to work in new versions (they just lack new capabilities).

---

## Project-Consumer Relationship

GraphSync is infrastructure. It does not belong to any domain.

```
┌─────────────────────────────────────────────────────────────┐
│                     GraphSync Core                           │
│  Domain-agnostic. Provider-agnostic. Storage-agnostic.       │
│  Transport-agnostic. AI-agnostic. Language-agnostic.         │
│                                                              │
│  Interfaces: IndexProvider, Plugin, DependencyProvider,      │
│              SemanticDiff, FederationAdapter                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
    ┌────────────────┐ ┌──────┐ ┌────────────┐
    │  Flow OS       │ │ScopeX│ │ Future     │
    │  (Consumer)    │ │(Consumer)│ │(Consumer)  │
    │                │ │      │ │            │
    │ Restaurant P.  │ │Med   │ │ Finance P. │
    │ Medical P.     │ │Plugin│ │ Legal P.   │
    │ MCP Provider   │ │ ...  │ │ ...        │
    └────────────────┘ └──────┘ └────────────┘
```

- **Flow OS** uses GraphSync to keep its Restaurant Knowledge School, Business School, and future Schools synchronized with their source documents.
- **ScopeX** uses GraphSync with a different set of plugins — a Medical domain plugin, a different parser, a different dependency extractor.
- **Any future project** uses GraphSync with the plugins it needs.

GraphSync does not change between consumers. Only the plugins change.

---

## Future Beyond v7

The roadmap stops at v7 because beyond distributed synchronization, the next capabilities are no longer about synchronization. They are about:

- **Knowledge Synthesis** — generating new knowledge from existing units.
- **Knowledge Validation** — verifying consistency across the graph.
- **Knowledge Reasoning** — drawing inferences from graph structure.

These belong to a different system. GraphSync's responsibility ends where thinking begins.

GraphSync synchronizes.
GraphSync does not think.

---

*End of ROADMAP_V2*

*GraphSync is infrastructure. Infrastructure does not belong to any domain. It belongs to every domain.*
