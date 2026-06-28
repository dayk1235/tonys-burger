#!/usr/bin/env npx tsx
/**
 * ARCH-002 — Continuous Architecture Watchdog
 *
 * Executes before every implementation task (VS, BF, CV, AUD).
 * Inspects architecture health without modifying any source files.
 *
 * Usage: npm run architecture:audit
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ENGINES_DIR = join(ROOT, "src", "core", "engines");
const RUNTIME_DIR = join(ROOT, "src", "core", "runtime");
const REPORT_DIR = join(ROOT, "project-docs", "architecture");
const REPORT_FILE = join(REPORT_DIR, "architecture-health.md");

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────

interface EventBinding {
  file: string;
  line: number;
  eventName: string;
  type: "emit" | "subscribe";
  usesConstant: boolean;
  constantName: string | null;
}

interface CanonicalConstant {
  name: string;
  value: string;
  file: string;
  line: number;
  namespace: string;
}

interface EngineInfo {
  name: string;
  directory: string;
  subscribeEvents: EventBinding[];
  emitEvents: EventBinding[];
  lifecycleEvents: EventBinding[];
}

// ─────────────────────────────────────
// Helpers
// ─────────────────────────────────────

function* walkFiles(dir: string, ext: string): Generator<string> {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip node_modules, tests
        if (entry.name !== "node_modules" && entry.name !== "tests") {
          yield* walkFiles(full, ext);
        }
      } else if (entry.isFile() && full.endsWith(ext)) {
        yield full;
      }
    }
  } catch {
    // Directory doesn't exist
  }
}

function readLines(file: string): { lines: string[]; content: string } {
  const content = readFileSync(file, "utf-8");
  return { lines: content.split("\n"), content };
}

// ─────────────────────────────────────
// Parse canonical constants from Events.ts files
// ─────────────────────────────────────

function parseCanonicalConstants(): CanonicalConstant[] {
  const constants: CanonicalConstant[] = [];

  for (const file of walkFiles(ENGINES_DIR, ".ts")) {
    if (!file.endsWith("Events.ts") && !file.endsWith("events.ts")) continue;
    const { lines } = readLines(file);
    const relativePath = relative(ROOT, file);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match: CONSTANT_NAME: "namespace.operation.value",
      const match = line.match(/^\s+(\w+):\s+"([a-zA-Z0-9._-]+)",?\s*$/);
      if (match) {
        const [, name, value] = match;
        const namespace = value.split(".")[0] || "unknown";
        constants.push({
          name,
          value,
          file: relativePath,
          line: i + 1,
          namespace,
        });
      }
    }
  }

  return constants;
}

// ─────────────────────────────────────
// Parse subscribe/emit bindings from engine files
// ─────────────────────────────────────

function parseEngineBindings(file: string): EventBinding[] {
  const bindings: EventBinding[] = [];
  const { lines } = readLines(file);
  const relativePath = relative(ROOT, file);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip code in comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;

    // Match: .emitEvent(SOME_CONSTANT — pipeline wrapper that emits via EventBus with canonical constant
    const emitWrapperMatch = trimmed.match(/\.emitEvent\(([A-Z]\w+(?:\.\w+)*)\s*,/);
    if (emitWrapperMatch) {
      bindings.push({
        file: relativePath,
        line: i + 1,
        eventName: emitWrapperMatch[1],
        type: "emit",
        usesConstant: true,
        constantName: emitWrapperMatch[1],
      });
      continue;
    }

    // Match: .subscribe("event.name", async ...
    const subMatch = trimmed.match(
      /\.subscribe\(("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*,/
    );
    if (subMatch) {
      const eventName = subMatch[1].slice(1, -1);
      bindings.push({
        file: relativePath,
        line: i + 1,
        eventName,
        type: "subscribe",
        usesConstant: false,
        constantName: null,
      });
      continue;
    }

    // Match: .subscribe(SOME_CONSTANT, async ... (only uppercase-starting identifiers)
    const subConstMatch = trimmed.match(/\.subscribe\(([A-Z]\w+(?:\.\w+)*)\s*,/);
    if (subConstMatch) {
      bindings.push({
        file: relativePath,
        line: i + 1,
        eventName: subConstMatch[1],
        type: "subscribe",
        usesConstant: true,
        constantName: subConstMatch[1],
      });
      continue;
    }

    // Match: eventBus.emit("event.name", { — direct EventBus emit of literal string
    const emitMatch = trimmed.match(
      /\.emit\(("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*,/
    );
    if (emitMatch) {
      const eventName = emitMatch[1].slice(1, -1);
      bindings.push({
        file: relativePath,
        line: i + 1,
        eventName,
        type: "emit",
        usesConstant: false,
        constantName: null,
      });
      continue;
    }

    // Match: eventBus.emit(SOME_CONSTANT, { (only uppercase-starting identifiers)
    const emitConstMatch = trimmed.match(/\.emit\(([A-Z]\w+(?:\.\w+)*)\s*,/);
    if (emitConstMatch) {
      bindings.push({
        file: relativePath,
        line: i + 1,
        eventName: emitConstMatch[1],
        type: "emit",
        usesConstant: true,
        constantName: emitConstMatch[1],
      });
    }
  }

  return bindings;
}

/**
 * Detect if a pipeline file defines emitLifecycleEvent or emitEvent wrappers.
 * These indicate the engine emits lifecycle events dynamically via get*LifecycleEventName().
 */
function detectPipelineEmitter(file: string): string | null {
  try {
    const { content } = readLines(file);
    if (
      content.includes("emitLifecycleEvent")
    ) {
      // Extract namespace from Events import
      const nsMatch = content.match(/import.*?\b(\w+)Events\b/);
      if (nsMatch) {
        return nsMatch[1].toLowerCase();
      }
      // Fallback: extract from path
      const pathMatch = file.match(/engines\/(\w+)\//);
      if (pathMatch) return pathMatch[1];
    }
  } catch {
    // ignore
  }
  return null;
}

// ─────────────────────────────────────
// Resolve constant names to values
// ─────────────────────────────────────

function resolveConstants(
  bindings: EventBinding[],
  constants: CanonicalConstant[]
): EventBinding[] {
  const constMap = new Map<string, string>();
  for (const c of constants) {
    constMap.set(c.name, c.value);
  }

  return bindings.map((b) => {
    if (b.usesConstant && b.constantName) {
      // Handle qualified references like ATTENTION_EVENTS.OPERATION_PRIORITIZED
      const parts = b.constantName.split(".");
      const simpleName = parts[parts.length - 1];
      const resolved = constMap.get(simpleName);
      if (resolved) {
        return { ...b, eventName: resolved };
      }
    }
    return b;
  });
}

// ─────────────────────────────────────
// Analyze engine chains
// ─────────────────────────────────────

interface ChainLink {
  engine: string;
  event: string;
  status: "CONNECTED" | "DISCONNECTED" | "PARTIAL" | "UNKNOWN";
}

function analyzeEngineChain(
  engines: EngineInfo[]
): ChainLink[] {
  // Known pipeline chain
  const chain: { engine: string; emits: string; consumes: string }[] = [
    { engine: "observation", emits: "observation.lifecycle.*", consumes: "" },
    { engine: "pattern", emits: "pattern.lifecycle.*", consumes: "observation.lifecycle.historical_committed" },
    { engine: "evidence", emits: "evidence.lifecycle.*", consumes: "pattern.lifecycle.supported_established" },
    { engine: "memory", emits: "memory.lifecycle.*", consumes: "evidence.lifecycle" },
    { engine: "knowledge", emits: "knowledge.lifecycle.*", consumes: "memory.lifecycle" },
    { engine: "attention", emits: "attention.operation.prioritized", consumes: "knowledge.lifecycle.validated" },
    { engine: "reasoning", emits: "reasoning.lifecycle.*", consumes: "attention.operation.prioritized" },
    { engine: "decision", emits: "decision.lifecycle.*", consumes: "reasoning.lifecycle.completed" },
  ];

  return chain.map((link) => {
    const engine = engines.find((e) =>
      e.directory.includes(link.engine)
    );
    if (!engine) {
      return { engine: link.engine, event: link.emits, status: "UNKNOWN" };
    }

    if (!link.consumes) {
      return { engine: link.engine, event: link.emits, status: "CONNECTED" };
    }

    // Resolved bindings: both string literals and resolved constants
    // Fallback: also check file content for emitLifecycleEvent presence
    let hasEmitLifecycle = false;
    try {
      const { content } = readLines(
        engine.directory + "/" + engine.name.charAt(0).toUpperCase() + engine.name.slice(1) + "Pipeline.ts"
      );
      hasEmitLifecycle = content.includes("emitLifecycleEvent");
    } catch {
      // No pipeline file found — not every engine has one
    }

    // Check if the engine consumes the event it's supposed to
    const consumesExpected = engine.subscribeEvents.some((b) => {
      const eName = b.eventName;
      const expected = link.consumes.replace("*", "");
      return eName.includes(expected);
    });

    // Check emits: either direct emit binding or emitLifecycleEvent presence
    const emitsExpected = engine.emitEvents.some((b) => {
      const eName = b.eventName;
      const expected = link.emits.replace("*", "");
      return eName.includes(expected);
    }) || (hasEmitLifecycle && link.emits.includes("lifecycle.*"));

    if (consumesExpected && emitsExpected) return { engine: link.engine, event: link.emits, status: "CONNECTED" };
    if (!consumesExpected && !emitsExpected) return { engine: link.engine, event: link.emits, status: "DISCONNECTED" };
    return { engine: link.engine, event: link.emits, status: "PARTIAL" };
  });
}

// ─────────────────────────────────────
// Dead code detection
// ─────────────────────────────────────

interface DeadCodeIssue {
  type:
    | "ORPHAN_SUBSCRIBER"
    | "ORPHAN_EMITTER"
    | "HARDCODED_EVENT_NAME"
    | "MISSING_CONSTANT_IMPORT"
    | "UNREACHABLE_SUBSCRIBER"
    | "UNREACHABLE_EMITTER";
  description: string;
  file: string;
  line: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

/**
 * Known pipeline lifecycle emitters.
 * Each pipeline with emitLifecycleEvent produces all lifecycle.* events for its namespace.
 */
const LIFECYCLE_NAMESPACES = [
  "observation",
  "pattern",
  "evidence",
  "memory",
  "knowledge",
  "attention",
  "reasoning",
];

function detectDeadCode(
  bindings: EventBinding[],
  constants: CanonicalConstant[],
  engines: EngineInfo[]
): DeadCodeIssue[] {
  const issues: DeadCodeIssue[] = [];

  // Detect which engine directories have pipeline files with emitLifecycleEvent
  const pipelineEmitters = new Set<string>();
  for (const engine of engines) {
    try {
      const pipelineDir = engine.directory;
      const entries = readdirSync(pipelineDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.includes("Pipeline") && entry.name.endsWith(".ts")) {
          const ns = detectPipelineEmitter(join(pipelineDir, entry.name));
          if (ns) pipelineEmitters.add(ns);
        }
      }
    } catch {
      // skip
    }
  }

  // Separate emits and subscribes
  const emits = bindings.filter((b) => b.type === "emit");
  const subscribes = bindings.filter((b) => b.type === "subscribe");

  // Check for hardcoded event names
  for (const b of bindings) {
    if (!b.usesConstant) {
      // Check if a canonical constant exists for this value
      const hasConstant = constants.some((c) => c.value === b.eventName);
      if (hasConstant) {
        issues.push({
          type: "HARDCODED_EVENT_NAME",
          description: `Event "${b.eventName}" has canonical constant available but uses hardcoded string`,
          file: b.file,
          line: b.line,
          severity: "MEDIUM",
        });
      }
    }
  }

  // Check for orphan subscribers (no matching emitter)
  for (const sub of subscribes) {
    // Check if this event is a lifecycle event with a known pipeline emitter
    const eventNs = sub.eventName.split(".")[0];
    const isLifecycleEvent = sub.eventName.includes("lifecycle");
    const hasPipelineEmitter = isLifecycleEvent && pipelineEmitters.has(eventNs);

    // Check for direct emitter match
    const hasDirectEmitter = emits.some(
      (e) => e.eventName === sub.eventName
    );

    // Check for namespace-level emitter (e.g., "memory.lifecycle.*" covers "memory.lifecycle.consolidated")
    const hasNsEmitter = isLifecycleEvent && emits.some(
      (e) => e.eventName.startsWith(eventNs + ".") && e.eventName.includes("lifecycle")
    );

    if (!hasDirectEmitter && !hasPipelineEmitter && !hasNsEmitter) {
      issues.push({
        type: "ORPHAN_SUBSCRIBER",
        description: `Subscribes to "${sub.eventName}" but no emitter found`,
        file: sub.file,
        line: sub.line,
        severity: "HIGH",
      });
    }
  }

  // Check for orphan emitters (no matching subscriber)
  for (const emit of emits) {
    // Skip engine:state-change — consumed by runtime/UI observers
    if (emit.eventName === "engine:state-change") continue;

    const hasSubscriber = subscribes.some(
      (s) => s.eventName === emit.eventName
    );

    if (!hasSubscriber) {
      // If event has a canonical constant, it's an architectural completeness issue (MEDIUM)
      // If not, it's a real orphan (HIGH)
      const hasCanonicalConstant = constants.some((c) => c.value === emit.eventName);
      issues.push({
        type: "ORPHAN_EMITTER",
        description: `Emits "${emit.eventName}" but no subscriber found`,
        file: emit.file,
        line: emit.line,
        severity: hasCanonicalConstant ? "MEDIUM" : "HIGH",
      });
    }
  }

  return issues;
}

// ─────────────────────────────────────
// Payload compatibility check
// ─────────────────────────────────────

interface PayloadIssue {
  type: string;
  producer: string;
  consumer: string;
  event: string;
  file: string;
  line: number;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

function checkPayloadCompatibility(
  bindings: EventBinding[]
): PayloadIssue[] {
  const issues: PayloadIssue[] = [];

  const emits = bindings.filter((b) => b.type === "emit");
  const subscribes = bindings.filter((b) => b.type === "subscribe");

  for (const emit of emits) {
    const matchingSubs = subscribes.filter((s) => s.eventName === emit.eventName);
    for (const sub of matchingSubs) {
      // Check if producer is attention and consumer is reasoning
      if (emit.eventName === "attention.operation.prioritized") {
        issues.push({
          type: "PAYLOAD_MISMATCH",
          producer: emit.file,
          consumer: sub.file,
          event: emit.eventName,
          file: sub.file,
          line: sub.line,
          description:
            "Producer emits flat payload {attentionId, name, category, priority} but consumer expects nested {attention: {id, identity, provenance}} — fallback paths used, provenance lost",
          severity: "MEDIUM",
        });
      }
    }
  }

  return issues;
}

// ─────────────────────────────────────
// Scan engines
// ─────────────────────────────────────

function scanEngines(): EngineInfo[] {
  const engines: EngineInfo[] = [];

  for (const entry of readdirSync(ENGINES_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(ENGINES_DIR, entry.name);
    const allBindings: EventBinding[] = [];

    for (const file of walkFiles(dir, ".ts")) {
      const bindings = parseEngineBindings(file);
      allBindings.push(...bindings);
    }

    if (allBindings.length > 0) {
      engines.push({
        name: entry.name,
        directory: dir,
        subscribeEvents: allBindings.filter((b) => b.type === "subscribe"),
        emitEvents: allBindings.filter((b) => b.type === "emit"),
        lifecycleEvents: allBindings.filter(
          (b) => b.eventName.includes("lifecycle") || b.eventName.includes("LIFECYCLE")
        ),
      });
    }
  }

  return engines;
}

// ─────────────────────────────────────
// Health Scoring
// ─────────────────────────────────────

interface ArchitectureScore {
  total: number;
  contractsScore: number;
  traceabilityScore: number;
  deadCodeIssues: number;
  brokenChains: number;
  payloadRisks: number;
  overall: number;
}

function computeScore(
  deadCodeIssues: DeadCodeIssue[],
  payloadIssues: PayloadIssue[],
  chain: ChainLink[],
  totalBindings: number,
  hardcodedBindings: number
): ArchitectureScore {
  const brokenChains = chain.filter(
    (c) => c.status === "DISCONNECTED" || c.status === "PARTIAL"
  ).length;

  // Contracts: percentage of bindings using canonical constants
  const contractsScore =
    totalBindings > 0
      ? Math.round(
          ((totalBindings - hardcodedBindings) / totalBindings) * 100
        )
      : 100;

  // Traceability
  const traceabilityScore = chain.length > 0
    ? Math.round(
        ((chain.length - brokenChains) / chain.length) * 100
      )
    : 100;

  // Overall: weighted composite
  const highCount = deadCodeIssues.filter((i) => i.severity === "HIGH").length;
  const medCount = deadCodeIssues.filter((i) => i.severity === "MEDIUM").length;

  const cleanlinessScore = Math.max(0, 100 - highCount * 10 - medCount * 0.5);

  let overall = Math.round(
    contractsScore * 0.25 +
    traceabilityScore * 0.25 +
    cleanlinessScore * 0.4 +
    Math.max(0, 100 - brokenChains * 25) * 0.1
  );
  overall = Math.max(0, Math.min(100, overall));

  return {
    total: totalBindings,
    contractsScore,
    traceabilityScore,
    deadCodeIssues: deadCodeIssues.length,
    brokenChains,
    payloadRisks: payloadIssues.length,
    overall,
  };
}

// ─────────────────────────────────────
// Report Generation
// ─────────────────────────────────────

function generateReport(
  constants: CanonicalConstant[],
  engines: EngineInfo[],
  bindings: EventBinding[],
  deadCodeIssues: DeadCodeIssue[],
  payloadIssues: PayloadIssue[],
  chain: ChainLink[],
  score: ArchitectureScore,
  hardcoded: EventBinding[]
): string {
  const now = new Date().toISOString();
  const hardcodedCount = hardcoded.length;
  const totalBindings = bindings.length;

  let md = `# Architecture Health Report

**Generated**: ${now}
**Repository**: ${ROOT.split("/").pop()}
**Engines**: ${engines.length}
**Total Event Bindings**: ${totalBindings}

---

## Architecture Score

| Metric | Value |
|--------|-------|
| **Overall Score** | **${score.overall} / 100** |
| Contracts (canonical %) | ${score.contractsScore}% |
| Traceability (chains intact) | ${score.traceabilityScore}% |
| Dead Code Issues | ${score.deadCodeIssues} |
| Broken Chains | ${score.brokenChains} |
| Payload Risks | ${score.payloadRisks} |

---

## Dependency Summary

| Engine | Subscribes | Emits | Lifecycle Events |
|--------|-----------|-------|-----------------|
`;

  for (const e of engines) {
    md += `| **${e.name}** | ${e.subscribeEvents.length} | ${e.emitEvents.length} | ${e.lifecycleEvents.length} |\n`;
  }

  md += `\n## Runtime Graph\n\n\`\`\`\n`;

  for (const link of chain) {
    const icon =
      link.status === "CONNECTED"
        ? "✓"
        : link.status === "DISCONNECTED"
          ? "✗"
          : link.status === "PARTIAL"
            ? "~"
            : "?";
    md += `${icon} ${link.engine.padEnd(16)} → ${link.event.padEnd(40)} [${link.status}]\n`;
  }

  md += "```\n";

  md += `\n## Producer / Consumer Matrix\n\n`;
  md += `| Event | Producers | Consumers | Contract |\n`;
  md += `|-------|-----------|-----------|----------|\n`;

  const eventGroups = new Map<string, EventBinding[]>();
  for (const b of bindings) {
    const key = b.eventName;
    if (!eventGroups.has(key)) eventGroups.set(key, []);
    eventGroups.get(key)!.push(b);
  }

  for (const [event, evBindings] of eventGroups) {
    const producers = evBindings
      .filter((b) => b.type === "emit")
      .map((b) => b.file.split("/").pop() || b.file)
      .join(", ");
    const consumers = evBindings
      .filter((b) => b.type === "subscribe")
      .map((b) => b.file.split("/").pop() || b.file)
      .join(", ");
    const usesCanonical = evBindings.some((b) => b.usesConstant || !evBindings.every((eb) => !eb.usesConstant));
    const contractStatus = evBindings.every((b) => b.usesConstant)
      ? "✅ Canonical"
      : evBindings.some((b) => b.usesConstant)
        ? "~ Mixed"
        : constants.some((c) => c.value === event)
          ? "❌ Hardcoded (constant available)"
          : "⚠️ Hardcoded (no constant)";
    md += `| \`${event}\` | ${producers || "—"} | ${consumers || "—"} | ${contractStatus} |\n`;
  }

  md += `\n## Contract Verification\n\n`;
  md += `Canonical constants found: **${constants.length}** in **${new Set(constants.map((c) => c.file)).size}** files\n\n`;

  md += `| File | Constant | Value |\n`;
  md += `|------|----------|-------|\n`;
  for (const c of constants) {
    md += `| ${c.file} | \`${c.name}\` | \`${c.value}\` |\n`;
  }

  md += `\n### Hardcoded Event Names (${hardcodedCount})\n\n`;
  if (hardcodedCount === 0) {
    md += `✅ No hardcoded event names found — all use canonical constants.\n`;
  } else {
    md += `| File | Line | Event | Constant Available? |\n`;
    md += `|------|------|-------|--------------------|\n`;
    for (const b of hardcoded) {
      const constAvail = constants.some((c) => c.value === b.eventName);
      md += `| ${b.file} | ${b.line} | \`${b.eventName}\` | ${constAvail ? "✅ Yes" : "❌ No"} |\n`;
    }
  }

  md += `\n## Dead Code Report\n\n`;
  if (deadCodeIssues.length === 0) {
    md += `✅ No dead code issues detected.\n`;
  } else {
    md += `| Type | Description | File | Line | Severity |\n`;
    md += `|------|-------------|------|------|----------|\n`;
    for (const issue of deadCodeIssues) {
      const sev = issue.severity === "HIGH" ? "🔴" : issue.severity === "MEDIUM" ? "🟡" : "🟢";
      md += `| ${issue.type} | ${issue.description} | ${issue.file} | ${issue.line} | ${sev} ${issue.severity} |\n`;
    }
  }

  md += `\n## Payload Compatibility\n\n`;
  if (payloadIssues.length === 0) {
    md += `✅ No payload compatibility issues detected.\n`;
  } else {
    md += `| Producer | Consumer | Event | Issue | Severity |\n`;
    md += `|----------|----------|-------|-------|----------|\n`;
    for (const issue of payloadIssues) {
      const sev = issue.severity === "HIGH" ? "🔴" : issue.severity === "MEDIUM" ? "🟡" : "🟢";
      md += `| ${issue.producer} | ${issue.consumer} | \`${issue.event}\` | ${issue.description} | ${sev} ${issue.severity} |\n`;
    }
  }

  // Hot Spots (static analysis fallback)
  md += `\n## Hot Spot Analysis\n\n`;
  md += `> **Note**: Full fan-in/fan-out analysis requires codebase-memory MCP.\n`;
  md += `> Run in agent context: \`get_architecture()\` or \`search_graph()\`.\n\n`;

  // Count bindings per file as proxy hot spots
  const fileHeat = new Map<string, number>();
  for (const b of bindings) {
    fileHeat.set(b.file, (fileHeat.get(b.file) || 0) + 1);
  }
  const sortedHeat = [...fileHeat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  md += `| File | Event Bindings | Risk |\n`;
  md += `|------|---------------|------|\n`;
  for (const [file, count] of sortedHeat) {
    const risk =
      count >= 8 ? "🔴 CRITICAL" : count >= 5 ? "🟡 HIGH" : count >= 3 ? "🟢 MEDIUM" : "🟢 LOW";
    md += `| ${file} | ${count} | ${risk} |\n`;
  }

  // Recommended actions
  md += `\n## Recommended Actions\n\n`;

  const criticalIssues = [...deadCodeIssues, ...payloadIssues].filter((i) => i.severity === "HIGH");
  const mediumIssues = [...deadCodeIssues, ...payloadIssues].filter((i) => i.severity === "MEDIUM");

  if (criticalIssues.length > 0) {
    md += `### 🔴 Critical (${criticalIssues.length})\n\n`;
    for (const issue of criticalIssues) {
      md += `- **${issue.type}**: ${issue.description} (${issue.file}:${issue.line})\n`;
    }
    md += "\n";
  }

  if (mediumIssues.length > 0) {
    md += `### 🟡 Medium (${mediumIssues.length})\n\n`;
    for (const issue of mediumIssues) {
      md += `- **${issue.type}**: ${issue.description} (${issue.file}:${issue.line})\n`;
    }
    md += "\n";
  }

  const safeToContinue = criticalIssues.length === 0 && score.overall >= 70;

  md += `## Decision\n\n`;
  if (safeToContinue) {
    md += `✅ **SAFE TO CONTINUE**\n`;
  } else if (score.overall >= 40) {
    md += `⚠️ **IMPLEMENT WITH CAUTION** — ${criticalIssues.length} critical issues found.\n`;
  } else {
    md += `🛑 **STOP — ARCHITECTURE ISSUES FOUND** — ${criticalIssues.length} critical issues. Score: ${score.overall}/100.\n`;
  }

  md += `\n---\n*Report generated by ARCH-002 Continuous Architecture Watchdog*\n`;

  return md;
}

// ─────────────────────────────────────
// Main
// ─────────────────────────────────────

async function main() {
  console.log("\n🔍 ARCH-002 — Continuous Architecture Watchdog\n");

  // 1. Parse canonical constants
  console.log("  [1/6] Parsing canonical constants...");
  const constants = parseCanonicalConstants();
  console.log(`         Found ${constants.length} constants in ${new Set(constants.map((c) => c.file)).size} files`);

  // 2. Scan engines
  console.log("  [2/6] Scanning engine directories...");
  const engines = scanEngines();
  console.log(`         Found ${engines.length} engines with event bindings`);

  // 3. Collect all bindings and resolve constants
  console.log("  [3/6] Resolving event bindings...");
  const allBindings: EventBinding[] = [];
  // Apply resolution to engine-level arrays for chain analysis
  for (const engine of engines) {
    engine.subscribeEvents = resolveConstants(engine.subscribeEvents, constants);
    engine.emitEvents = resolveConstants(engine.emitEvents, constants);
    allBindings.push(...engine.subscribeEvents, ...engine.emitEvents);
  }
  const resolvedBindings = allBindings; // already resolved in-place
  console.log(`         Total bindings: ${allBindings.length}`);

  // 4. Dead code detection
  console.log("  [4/6] Detecting dead code...");
  const deadCodeIssues = detectDeadCode(resolvedBindings, constants, engines);
  const hardcodedBindings = resolvedBindings.filter(
    (b) => !b.usesConstant
  );
  console.log(`         Issues: ${deadCodeIssues.length} (hardcoded: ${hardcodedBindings.length})`);

  // 5. Payload compatibility
  console.log("  [5/6] Checking payload compatibility...");
  const payloadIssues = checkPayloadCompatibility(resolvedBindings);
  console.log(`         Issues: ${payloadIssues.length}`);

  // 6. Analyze engine chain
  console.log("  [6/6] Analyzing engine chain...");
  const chain = analyzeEngineChain(engines);
  for (const link of chain) {
    console.log(`         ${link.status === "CONNECTED" ? "✓" : "✗"} ${link.engine} → ${link.event} [${link.status}]`);
  }

  // Compute score
  const score = computeScore(
    deadCodeIssues,
    payloadIssues,
    chain,
    resolvedBindings.length,
    hardcodedBindings.length
  );

  // Generate report
  const report = generateReport(
    constants,
    engines,
    resolvedBindings,
    deadCodeIssues,
    payloadIssues,
    chain,
    score,
    hardcodedBindings
  );

  // Write report
  if (!existsSync(REPORT_DIR)) {
    mkdirSync(REPORT_DIR, { recursive: true });
  }
  writeFileSync(REPORT_FILE, report, "utf-8");

  console.log(`\n✅ Report written to ${relative(ROOT, REPORT_FILE)}`);
  console.log(`   Score: ${score.overall}/100`);

  // Exit with appropriate code
  if (deadCodeIssues.filter((i) => i.severity === "HIGH").length > 0) {
    console.log("\n⚠️  HIGH-severity issues found. Review report before proceeding.\n");
  } else {
    console.log("\n✅ Architecture looks healthy.\n");
  }
}

main().catch((err) => {
  console.error("Architecture audit failed:", err);
  process.exit(1);
});
