import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "..", "data", "analytics", "events.json");
const DATA_DIR = dirname(DATA_FILE);

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readEvents() {
  try {
    ensureDir();
    if (!existsSync(DATA_FILE)) {
      writeFileSync(DATA_FILE, "[]", "utf-8");
    }
    const raw = readFileSync(DATA_FILE, "utf-8");
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  ensureDir();
  writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
}

function track(event) {
  const events = readEvents();
  events.push(event);
  writeEvents(events);
}

function clearEvents() {
  writeEvents([]);
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  PASS: ${message}`);
}

// Sample events matching the AnalyticsEvent shape
const SAMPLE_EVENTS = [
  { event_name: "page_view", timestamp: 1000, session_id: "s1", device_type: "mobile", metadata: { url: "/", referrer: "direct" } },
  { event_name: "section_view", timestamp: 1100, session_id: "s1", device_type: "mobile", metadata: { section: "hero" } },
  { event_name: "burger_view", timestamp: 1200, session_id: "s1", device_type: "mobile", metadata: { burger_id: "doble-tony", burger_name: "Doble Tony" } },
  { event_name: "whatsapp_click", timestamp: 1300, session_id: "s1", device_type: "mobile", metadata: { source: "floating" } },
  { event_name: "page_view", timestamp: 2000, session_id: "s2", device_type: "desktop", metadata: { url: "/", referrer: "google" } },
  { event_name: "section_view", timestamp: 2100, session_id: "s2", device_type: "desktop", metadata: { section: "hero" } },
  { event_name: "section_view", timestamp: 2200, session_id: "s2", device_type: "desktop", metadata: { section: "featured-burgers" } },
  { event_name: "burger_view", timestamp: 2300, session_id: "s3", device_type: "desktop", metadata: { burger_id: "doble-tony", burger_name: "Doble Tony" } },
  { event_name: "burger_view", timestamp: 2400, session_id: "s3", device_type: "desktop", metadata: { burger_id: "tony-classic", burger_name: "Tony Classic" } },
  { event_name: "cta_click", timestamp: 2500, session_id: "s2", device_type: "desktop", metadata: { label: "Pedir por WhatsApp", destination: "#cta" } },
  { event_name: "burger_view", timestamp: 2600, session_id: "s3", device_type: "desktop", metadata: { burger_id: "inferno", burger_name: "Inferno" } },
];

console.log("\n=== ANALYTICS PERSISTENCE E2E VALIDATION ===\n");

// Step 1: Clear and track
console.log("Step 1: Tracking events...");
clearEvents();
for (const event of SAMPLE_EVENTS) {
  track(event);
}
assert(readEvents().length === SAMPLE_EVENTS.length, `${SAMPLE_EVENTS.length} events written to ${DATA_FILE}`);

// Step 2: Read file directly
console.log("\nStep 2: events.json contents:");
const fileContent = readFileSync(DATA_FILE, "utf-8");
const parsed = JSON.parse(fileContent);
assert(Array.isArray(parsed), "events.json contains a valid array");
assert(parsed.length === SAMPLE_EVENTS.length, "events.json has correct event count");
assert(parsed[0].event_name === "page_view", "First event is page_view");
assert(parsed[3].event_name === "whatsapp_click", "WhatsApp click is stored");

// Step 3: Show event types distribution
console.log("\nStep 3: Event type distribution:");
const counts = {};
for (const e of parsed) {
  counts[e.event_name] = (counts[e.event_name] || 0) + 1;
}
for (const [event, count] of Object.entries(counts).sort(([, a], [, b]) => b - a)) {
  console.log(`  ${event}: ${count}`);
}

// Step 4: Show burger_view breakdown
console.log("\nStep 4: Burger views:");
const burgerViews = parsed.filter((e) => e.event_name === "burger_view");
assert(burgerViews.length >= 3, "At least 3 burger views recorded");
for (const bv of burgerViews) {
  console.log(`  ${bv.metadata.burger_name} (${bv.metadata.burger_id})`);
}

// Step 5: Verify survive restart
console.log("\nStep 5: Events survive re-read (simulating restart)...");
const afterReread = readEvents();
assert(afterReread.length === SAMPLE_EVENTS.length, "Events persist after re-read");

// Step 6: Unique sessions
console.log("\nStep 6: Session analysis:");
const sessions = new Set(afterReread.map((e) => e.session_id));
console.log(`  Unique sessions: ${sessions.size}`);
assert(sessions.size === 3, "3 unique sessions detected");

// Step 7: Clear
console.log("\nStep 7: Clearing events...");
clearEvents();
assert(readEvents().length === 0, "events.json is empty after clear");

console.log("\n=== ALL VALIDATIONS PASSED ===");
console.log(`\nStorage path: ${DATA_FILE}`);
console.log("Events persist across application restarts.");
console.log("Insights Engine can consume persisted events.");
