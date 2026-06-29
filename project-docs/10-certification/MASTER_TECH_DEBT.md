# MASTER TECH DEBT REGISTRY — Flow OS

**Date:** 2026-06-28

---

## REGISTRY

| ID | Severity | Area | Description | Impact | Est. Fix | Window |
|:--:|:--------:|:----:|-------------|:------:|:--------:|:------:|
| TDR-001 | CRITICAL | Infrastructure | No authentication/authorization — anyone can access all API routes and dashboard | All API endpoints are public; no user isolation | 2-3 weeks | Before production |
| TDR-002 | CRITICAL | Infrastructure | No database — all engine state is in-memory Map; lost on restart | Zero persistence of cognitive state; all learning/predictions/planning lost on restart | 4-6 weeks | Before production |
| TDR-003 | CRITICAL | Infrastructure | No external adapters implemented — 0 of 0 required delivery platform integrations | Cannot receive real orders; runtime `receive()` has no input path from external world | 4-8 weeks | Before production |
| TDR-004 | CRITICAL | Engines | Silent `catch {}` in all engine subscription handlers (6+ locations) | Engine failures are invisible; hard to debug; certification results unreliable | 1-2 days | Before certification |
| TDR-005 | HIGH | Infrastructure | No rate limiting on API routes | Vulnerable to DOS; no request throttling | 2-3 days | Before production |
| TDR-006 | HIGH | Infrastructure | WhatsApp number hardcoded in `config/business.ts` | Cannot change per environment; security risk | 1 hour | Before production |
| TDR-007 | HIGH | Testing | No frontend tests — 0 component or E2E tests | UI changes have no safety net; regressions invisible | 4-6 weeks | Before production |
| TDR-008 | HIGH | AttentionEngine | 6 test failures in attention.test.ts (priority, competition, queue) | Attention engine cannot be certified; broken behavior | 1-2 weeks | VS1-010 |
| TDR-009 | HIGH | EvidenceEngine | 0 test files — no integration or e2e validation | Evidence engine is a black box; cannot certify | 1 week | VS1-011 |
| TDR-010 | HIGH | PatternEngine | `PatternRelationships.buildRelationships()` never called — conflict infrastructure disconnected | Conflicting patterns coexist silently; cannot detect or resolve | 3-5 days | BF-014 |
| TDR-011 | HIGH | PatternEngine | No automatic WEAKENING detection — confidence only increases | Patterns never decay; stale evidence permanently held as relevant | 3-5 days | BF-015 |
| TDR-012 | HIGH | PatternEngine | Confidence history in-memory only — lost on restart | Cannot reconstruct pattern evolution after restart | 2-3 days | BF-016 |
| TDR-013 | MEDIUM | PatternEngine | `PatternMemory.businessIndex` declared but never populated | `findByBusinessId()` always returns empty | 1 day | Technical debt |
| TDR-014 | MEDIUM | Design System | `primitives/index.tsx` imports `@/lib/utils` for `cn()` | Breaks design system self-containment | 1 hour | Technical debt |
| TDR-015 | MEDIUM | Design System | Design tokens duplicated in `globals.css`, `constants/tokens.ts`, `design-system/tokens/` | Risk of token drift; 3 sources of truth | 2-3 days | Technical debt |
| TDR-016 | MEDIUM | Components | Mixed naming convention — PascalCase and kebab-case coexist | Inconsistent developer experience | 1 day | Technical debt |
| TDR-017 | MEDIUM | Components | No barrel exports in `components/sections/`, `components/ui/`, `components/features/chatbot/` | Components imported by direct file path | 1 day | Technical debt |
| TDR-018 | MEDIUM | Dashboard | 13 empty module directories | Confusing to new developers; dead scaffolding | 1 day | Technical debt |
| TDR-019 | MEDIUM | Dashboard | `app/dashboard/page.tsx` (318 lines) — inline utility functions | Testable functions embedded in page component | 1 day | Technical debt |
| TDR-020 | MEDIUM | Dashboard | 0 API implementations — all services are interface stubs | Dashboard has 52 components with no real data | 4-6 weeks | Product decision |
| TDR-021 | MEDIUM | LearningEngine | Subscribes to `decision.lifecycle.initiated` instead of `.committed` | Inconsistent with downstream pattern; may break if pipeline decouples | 1 day | VS1-013 follow-up |
| TDR-022 | LOW | RuntimeScheduler | No persistence or recovery of scheduled tasks | Tasks lost on restart | 2-3 days | Technical debt |
| TDR-023 | LOW | PatternEngine | 14 of 20 PatternCategory values have no detector | 70% of pattern space uncovered | 4-6 weeks | Future BFs |
| TDR-024 | LOW | PatternEngine | 9 of 14 DetectionMethod values unimplemented | 64% of detection methods unused | 4-6 weeks | Future BFs |
| TDR-025 | LOW | PatternEngine | Thresholds scattered across 6 files with no single reference | Hard to audit and configure | 1 day | Technical debt |
| TDR-026 | LOW | ObservationEngine | `ObservationPipeline.ts` (349 lines) — largest pipeline file | Complex pipeline hard to maintain | 1 week | Refactor |
| TDR-027 | LOW | PatternEngine | `PatternPipeline.ts` (400 lines) — largest engine file | Complex pipeline hard to maintain | 1 week | Refactor |
| TDR-028 | LOW | Infrastructure | No Docker/CI/CD/infra-as-code | No reproducible deployments | 1-2 weeks | Before production |
| TDR-029 | LOW | Documentation | No API documentation (OpenAPI/Swagger) | API consumers must read source code | 3-5 days | Technical debt |
| TDR-030 | LOW | Infrastructure | No monitoring/alerting (Sentry/OpenTelemetry) | Runtime failures invisible without logs | 3-5 days | Before production |

---

## DEBT DISTRIBUTION

| Area | Count | Critical | High | Medium | Low | Total Est. |
|------|:-----:|:--------:|:----:|:------:|:---:|:----------:|
| Infrastructure | 7 | 3 | 2 | 0 | 2 | 12-20 weeks |
| Engines (Pattern) | 6 | 0 | 4 | 0 | 2 | 6-10 weeks |
| Engines (Attention) | 1 | 0 | 1 | 0 | 0 | 1-2 weeks |
| Engines (Evidence) | 1 | 0 | 1 | 0 | 0 | 1 week |
| Engines (Learning) | 1 | 0 | 0 | 1 | 0 | 1 day |
| Engines (Observation) | 1 | 0 | 0 | 0 | 1 | 1 week |
| Design System | 2 | 0 | 0 | 2 | 0 | 2-3 days |
| Components | 2 | 0 | 0 | 2 | 0 | 2 days |
| Dashboard | 3 | 0 | 0 | 3 | 0 | 4-6 weeks |
| Testing | 1 | 0 | 1 | 0 | 0 | 4-6 weeks |
| Documentation | 1 | 0 | 0 | 0 | 1 | 3-5 days |
| **TOTAL** | **30** | **3** | **9** | **8** | **10** | **30-54 weeks** |

---

## CRITICAL DEBT (Must Fix Before Production)

| Priority | TDR | Item | Blocking |
|:--------:|:---:|------|:--------:|
| P0 | 001 | No authentication | Production cannot have public API access |
| P0 | 002 | No database | All cognitive state ephemeral |
| P0 | 003 | No external adapters | Cannot receive real orders |
| P0 | 004 | Silent catch {} | Debugging impossible; certification unreliable |

---

## DEBT INTRODUCED IN VS1 TASKS

| Task | Debt | TDR |
|:----:|------|:---:|
| VS1-012 Decision | None | — |
| VS1-013 Learning | Subscribe to initiated vs committed | 021 |
| VS1-014 Prediction | None | — |
| VS1-015 Recommendation | None | — |
| VS1-016 Planning | businessId missing from event payload (FIXED) | — |
| VS1-017 Execution | None | — |

---

## TECHNICAL DEBT RATIO

| Metric | Value |
|--------|:-----:|
| Total TRDs | 30 |
| Critical | 3 (10%) |
| High | 9 (30%) |
| Medium | 8 (27%) |
| Low | 10 (33%) |
| Estimated effort (CRITICAL) | 10-16 weeks |
| Estimated effort (HIGH) | 19-30 weeks |
| Estimated effort (Total) | 30-54 weeks |
| Lines of code | ~45,000 |
| Debt density | 0.67 debt items / 1,000 LOC |
