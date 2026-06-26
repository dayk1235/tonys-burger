# 13 - REGISTRO DE DECISIONES Y TRAZABILIDAD (DECISION LOG)

Este documento es el registro maestro de cambios y decisiones técnicas del proyecto **Tony Burgers**. Su función es garantizar la transparencia y la trazabilidad a largo plazo.

---

## 1. Ley de Trazabilidad (Obligatorio)

### LAW_012 - DECISION TRACEABILITY
Toda decisión arquitectónica debe registrarse.
Registrar:
- fecha
- motivo
- impacto
- responsable

---

## 2. Plantilla Obligatoria para Nuevas Decisiones (ADR)

Cualquier agente que proponga un cambio arquitectónico o estructural relevante debe documentar la decisión utilizando estrictamente la siguiente plantilla dentro de este archivo:

```markdown
### [ADR-XXX] Título de la Decisión
*   **Fecha:** YYYY-MM-DD
*   **Responsable:** [Nombre del Agente / Arquitecto]
*   **Estado:** [Propuesto / Aprobado / Reemplazado por ADR-YYY]

#### A) Contexto y Motivo
[Explicar detalladamente por qué se requiere esta decisión técnica, qué problema resuelve y qué alternativas se evaluaron].

#### B) Decisión
[Detallar la solución técnica adoptada y las reglas de implementación asociadas].

#### C) Impacto
[Especificar el impacto técnico, de rendimiento, organizativo de archivos y en la seguridad del build].
```

---

## 3. Registro Histórico de Decisiones Aprobadas

### [ADR-001] Arquitectura Feature-Driven para src/components
*   **Fecha:** 2026-06-13
*   **Responsable:** Principal Software Architect (AI workflow)
*   **Estado:** Aprobado

#### A) Contexto y Motivo
El proyecto requiere escalar de forma limpia manteniendo separados los dominios de Menu, Carrito y Reservas. Organizar componentes en una sola carpeta `components` genérica causaría desorden visual y dificultad en el mantenimiento paralelo por parte de múltiples agentes.

#### B) Decisión
Se organiza el desarrollo bajo `src/components/features/[feature-name]` para encapsular los componentes de negocio de cada dominio. Se prohíbe explícitamente crear carpetas flotantes en `components` que no sigan la clasificación `ui/`, `common/` o `features/`.

#### C) Impacto
*   **Archivos:** Clasificación clara de componentes.
*   **Mantenibilidad:** Módulos altamente independientes y desacoplados.

---

### [ADR-002] Mocks Locales y Persistencia en LocalStorage
*   **Fecha:** 2026-06-13
*   **Responsable:** Principal Software Architect (AI workflow)
*   **Estado:** Aprobado

#### A) Contexto y Motivo
Fase inicial del proyecto Frontend-Only sin acceso a un servidor backend real. Se requiere probar flujos de usuario complejos de forma robusta.

#### B) Decisión
Se implementará un mock estructurado bajo `src/services/` utilizando datos estáticos y lógica que guarde el estado del carrito y de las reservas directamente en el `localStorage` del cliente.

#### C) Impacto
*   **Dependencias:** Cero dependencias adicionales (se usa API web nativa).
*   **Rendimiento:** Carga instantánea local, con retardos artificiales simulados para probar animaciones de carga.

---

### [ADR-003] Desarrollo Visual Custom basado en Tailwind CSS
*   **Fecha:** 2026-06-13
*   **Responsable:** Principal Software Architect (AI workflow)
*   **Estado:** Extended by ADR-004

#### A) Contexto y Motivo
Se busca una estética premium (efecto WOW) con micro-animaciones personalizadas y glassmorphism. El uso de UI Toolkits como Material UI dificulta la personalización profunda de los estilos e incrementa innecesariamente el peso del bundle.

#### B) Decisión
Construir toda la UI utilizando clases utilitarias de Tailwind CSS y reglas CSS nativas en `src/index.css`. Queda prohibida la instalación de UI Toolkits externos sin autorización.

#### C) Impacto
*   **Estilo:** Control absoluto y estética a medida.
*   **Rendimiento:** Bundle de estilos minimalista y optimizado.

---

### [ADR-004] Migración a Next.js 16 con shadcn/ui y GSAP
*   **Fecha:** 2026-06-13
*   **Responsable:** Buffy (Strategic Assistant)
*   **Estado:** Aprobado

#### A) Contexto y Motivo
El proyecto necesitaba una base técnica moderna para una landing page premium de restaurante. La pila anterior (Vite + React) carecía de SSR, SEO nativo y un ecosistema de componentes probado. Se evaluaron las siguientes alternativas:

1. **Remix:** Buena alternativa pero con menos soporte de la comunidad.
2. **Astro:** Excelente para contenido estático pero limitado para interactividad pesada.
3. **Next.js 16 (App Router):** Elegido por SSR/SSG nativo, App Router, ecosistema maduro y despliegue directo a Vercel.

#### B) Decisión
Se migra a la siguiente pila técnica:
- **Framework:** Next.js 16 con App Router
- **Styling:** Tailwind CSS v4 con tokens CSS personalizados
- **UI Library:** shadcn/ui (Radix primitives + Tailwind)
- **Animaciones:** GSAP con ScrollTrigger
- **Iconos:** Lucide React
- **Package Manager:** pnpm
- **Deploy:** Vercel

#### C) Impacto
*   **SSR/SEO:** Beneficio directo del renderizado del lado del servidor.
*   **Desarrollo:** shadcn/ui acelera la creación de componentes UI consistentes.
*   **Bundle:** Tailwind v4 + shadcn/ui resultan en bundles optimizados.
*   **Rendimiento:** Next.js Image Optimization, font optimization y lazy loading nativos.
*   **Migración:** Este ADR invalida y reemplaza ADR-003 (Tailwind + CSS custom).

---

### [ADR-005] Phase 5 Landing Assembly Activation
*   **Fecha:** 2026-06-13
*   **Responsable:** Senior Frontend Architect (AI workflow)
*   **Estado:** Aprobado

#### A) Contexto y Motivo
The Design System (Phase 3) deliverables are complete with 40+ UI Kit components. Core business feature components (Phase 4) are not required for the landing page skeleton, which only uses presentational UI Kit components with placeholder content. To avoid unnecessary delay, Phase 4 is deferred and Phase 5 (Page Assembly) is activated for the Landing Page Skeleton task (TASK-003A).

#### B) Decisión
- Phase 3 marked as completed
- Phase 4 marked as deferred (not a dependency for landing page)
- Phase 5 marked as active
- Landing page to be assembled using existing UI Kit components only
- No business logic, no animations, no integrations

#### C) Impacto
- Landing page structure can be delivered immediately
- UI Kit investment is immediately utilized
- Phase 4 deferred — future task required for business features
- ROADMAP.md, PROJECT_MEMORY.md, and ADR-005 updated

---

### [ADR-006] Knowledge First Chatbots
*   **Fecha:** 2026-06-13
*   **Responsable:** User (Project Owner)
*   **Estado:** Aprobado

#### A) Contexto y Motivo
All business chatbots in the ecosystem (TonyBot, Snacks911, future business assistants) need a sustainable architecture. Pre-written conversational responses become outdated, difficult to maintain, and do not scale across businesses. Structured business knowledge is reusable and can be transformed into conversational responses dynamically.

#### B) Decisión
All chatbots will be built from structured business knowledge rather than pre-written conversational responses. Principles: store facts not responses, store rules not scripts, store recommendations not conversations, generate responses at runtime. This architecture enables TonyBot, multi-business assistants, analytics, recommendation systems, and SaaS expansion without duplicating conversational content.

#### C) Impacto
- TonyBot will use structured knowledge, not scripts
- Same architecture reusable across businesses
- Enables analytics and recommendations from same knowledge base
- No conversational content duplication

---

### [ADR-007] Product Direction Lockdown
*   **Fecha:** 2026-06-13
*   **Responsable:** Product Architect (AI workflow)
*   **Estado:** Aprobado

#### A) Contexto y Motivo
The project completed the initial website build but lacked a long-term product vision beyond deployment. Multiple forward-looking decisions (ADR-006, conversion audit findings, TonyBot discussions, multi-business expansion) needed a unifying framework. Without a documented vision, the project risks roadmap drift — building features out of order or outside scope.

#### B) Decisión
Adopt the 8-phase product vision defined in `project-docs/08-product/PRODUCT_VISION.md`: Website → Conversion → Analytics → Insights → TonyBot → Knowledge Engine → Multi-Business → SaaS. Phase order is inviolable: data before automation, insights before AI, value before scale.

#### C) Impacto
- Permanent guard against roadmap drift
- Every future task must reference its product vision phase
- Explicitly excludes POS, ERP, inventory, accounting from scope
- Knowledge-first architecture (ADR-006) has natural home in Phases 5-6

### [GOVERNANCE-002] Product Reasoning Layer
*   **Fecha:** 2026-06-25
*   **Responsable:** Buffy (Chief Product Architect)
*   **Estado:** Aprobado

#### A) Contexto y Motivo
Restaurant OS has reached a new stage of maturity with a comprehensive set of vision, governance, and design documents. The agent was behaving as a code generator rather than a product-first architect. Every technical decision must first be justified as a product decision. Every product decision must first be justified as a business decision. A mandatory reasoning layer is required to enforce this discipline before every task.

#### B) Decisión
A new **Product Reasoning Layer** is introduced as a mandatory stage executed after the Boot Sequence and before implementation. The layer consists of 12 reasoning sections: Product Impact, Experience Impact, Cognitive Impact, Design Validation, Future Compatibility, Knowledge Impact, Risk Analysis, Alternatives Considered, Confidence Level, Technical Debt, Product Evolution, and Executive Summary. The agent persona is elevated to **Chief Product Architect of Restaurant OS**.

Files modified:
- `AGENTS.md` — New persona, Product Reasoning Layer, updated evaluation criteria and report format
- `project-docs/BOOT_SEQUENCE.md` — New STEP 10, updated Declaration and checklist
- `project-docs/02-development/TASK_WORKFLOW.md` — New FASE 1b (Product Reasoning Layer)
- `project-docs/05-reporting/CHANGE_REPORT_TEMPLATE.md` — Product Reasoning Layer added to report template
- `project-docs/03-memory/DECISION_LOG.md` — This entry
- `project-docs/03-memory/PROJECT_MEMORY.md` — Amendment added

#### C) Impacto
- Agents now think as Chief Product Architects before coding
- Every task now requires a 12-point product reasoning analysis before implementation
- Product quality, user confidence, and business reasoning become primary evaluation criteria
- Future reports will include the complete Product Reasoning Layer
- No code or architecture changes — only governance improvements
- All existing governance documents remain unchanged

---

### [ADR-008] Product Boundary Separation
*   **Fecha:** 2026-06-25
*   **Responsable:** Buffy (Chief Product Architect)
*   **Estado:** Aprobado

#### A) Contexto y Motivo
The repository now contains two different products that serve different business goals: Restaurant Experience and Restaurant OS. Keeping them inside one undifferentiated structure makes ownership ambiguous, increases cognitive load, and creates a long-term risk of cross-product drift. The system needs an explicit top-level boundary so future work can be assigned to the correct product without guessing.

#### B) Decisión
Introduce a top-level `apps/` boundary with separate module homes for:
- `apps/restaurant-experience/` — public website and customer-facing implementation
- `apps/restaurant-os/` — operational platform, intelligence, and owner tools

The shared layer remains centralized in existing reusable modules such as `src/design-system/`, `src/components/ui/`, `src/constants/`, `src/lib/`, and `src/localization/`. The running project keeps its current routes through `src/app/` as a compatibility layer.

#### C) Impacto
*   **Archivos:** New top-level product boundary and documentation scaffolding.
*   **Mantenibilidad:** Clearer ownership and lower risk of duplicated logic.
*   **Routing:** Existing URLs remain stable.
*   **Escalabilidad:** Future verticals can be added without changing Restaurant OS behavior.
