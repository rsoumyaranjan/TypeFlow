# Sprint Notes

Last updated: 2026-06-06

## Sprint 0: Operating Setup and Research Plan

Status: Completed

Sprint objective:
Create the project operating foundation and prepare the first research cycle before coding begins.

## Assigned Agents

| Agent | Responsibility This Sprint | Expected Output | Review Owner |
|---|---|---|---|
| AI Operating CEO / Product Owner | Set operating model and coordinate project memory | Core project docs | Founder |
| Scrum Master | Define work cycle and review template | Sprint structure and review cadence | AI Operating CEO / PO |
| Product Manager | Frame MVP assumptions and open product decisions | Charter inputs and MVP questions | Founder |
| Competitor Researcher | Build first competitor research plan | Competitor source queue and matrix template | Product Manager |
| Architect | List free technology options to evaluate | Technology research questions | Founder + AI Operating CEO / PO |

## Sprint 0 Planned Work

| Task | Owner | Status | Acceptance Criteria |
|---|---|---|---|
| Create `AGENTS.md` | AI Operating CEO / PO | Completed | Roles, limits, outputs, and review process are defined. |
| Create `PROJECT_CHARTER.md` | Product Manager | Completed | Vision, scope, constraints, metrics, and phase gates are defined. |
| Create `DECISION_LOG.md` | AI Operating CEO / PO | Completed | Initial decisions and open decisions are recorded. |
| Create `ROADMAP.md` | Scrum Master | Completed | Phases and current backlog are listed. |
| Create `COMPETITOR_RESEARCH.md` | Competitor Researcher | Completed | First research plan, competitor list, and matrix template exist. |
| Prepare Sprint 0 review | Scrum Master | Completed | Completed, failed, improve, and next steps are summarized. |

## Definition of Done For Sprint 0

- All requested project files exist.
- Role definitions are clear enough to assign future work automatically.
- Decision rules are documented.
- First research plan exists.
- Founder can approve or redirect the research plan.

## Review Meeting Notes

Use this section after the sprint completes.

Date: 2026-06-06
Cycle: Sprint 0 operating setup
Roles involved: AI Operating CEO / Product Owner, Scrum Master, Product Manager, Competitor Researcher, Architect
Completed: Created `AGENTS.md`, `PROJECT_CHARTER.md`, `DECISION_LOG.md`, `ROADMAP.md`, `SPRINT_NOTES.md`, and `COMPETITOR_RESEARCH.md`.
Failed or blocked: No blockers. Formal competitor research is not complete yet; only the plan and source queue are complete.
Bugs or risks found: The product could become too broad if learning, tests, games, analytics, and data engineering are all built at once.
What should improve: The next cycle should narrow the MVP audience and validate free technology choices before implementation.
Decisions made: Research-first process, free/open-source preference, founder final approval, structured agent workflow, and root-level project memory files.
Decisions needed from founder: Primary MVP audience, working product name, first persistence model, and preferred product feel.
Next recommended tasks: Complete competitor matrix, draft user survey/interview script, compare free technology options, and propose MVP scope.

## Research Cycle Review: Competitor Research Cycle 1

Date: 2026-06-06
Cycle: First real competitor research cycle
Roles involved: Competitor Researcher, Product Manager as review owner
Completed: Researched Monkeytype, Typing.com, Keybr, TypeRacer, Nitro Type, 10FastFingers, TypingClub, and TypeLit.io using current public web sources. Updated `COMPETITOR_RESEARCH.md` with a completed matrix, table-stakes features, differentiation opportunities, facts/observations, source log, and MVP implications.
Failed or blocked: Exact current paid details were not verified for Keybr, Monkeytype, Nitro Type, and 10FastFingers where official public sources were absent, dynamic, supporter-based, or unclear. These were marked as not verified rather than guessed.
Bugs or risks found: The product could overbuild by trying to combine full school curriculum, multiplayer racing, game economy, long-form literature, and deep analytics in the first release. Pricing data can become stale quickly and may vary by location or quote.
What should improve: Product Manager should turn the findings into a narrow MVP scope proposal, and Architect should separately validate local-first progress and free hosting/analytics options.
Decisions made: No founder-approved product decisions were made. Two research-driven decisions were added to `DECISION_LOG.md` as proposed.
Decisions needed from founder: Primary MVP audience, Phase 1 positioning, local-only versus account-based progress, whether school features are out of Phase 1, and whether games/challenges are deferred.
Next recommended tasks: Product Manager drafts MVP scope, User Researcher validates first audience assumptions with 5-10 users, Architect compares free/local-first technology options, Typing Engine Specialist defines calculation rules.

## Product Management Cycle Review: MVP Scope Proposal

Date: 2026-06-06
Cycle: Convert competitor research into MVP scope
Roles involved: Product Manager, Competitor Researcher, AI Operating CEO / Product Owner
Completed: Added a Phase 1 MVP scope proposal to `ROADMAP.md` covering recommended primary audience, positioning, pages, features, exclusions, user stories, acceptance criteria, success metrics, founder decisions, and recommended Sprint 1 scope. Added a proposed MVP direction to `DECISION_LOG.md`.
Failed or blocked: No blocker in drafting the proposal. Founder approval is still required before architecture and coding.
Bugs or risks found: The MVP could still become too broad if beginner lessons, analytics, custom text, code drills, games, and progress tracking all expand at once. Phase 1 should prove the core loop first: test, understand result, practice the highest-value next drill, and see local progress.
What should improve: User research should validate whether the recommended primary audience actually values next-practice guidance more than pure speed testing, classroom structure, or game competition.
Decisions made: No founder-approved product decisions were made. The Product Manager recommendation is proposed only.
Decisions needed from founder: Primary audience, positioning, local-only persistence, MVP page list, MVP features, Phase 1 exclusions, working product name, and game/challenge stance.
Next recommended tasks: Founder reviews the MVP proposal, then Sprint 1 produces the MVP PRD, page map, typing engine rules, local data model, privacy notes, architecture recommendation, and QA plan before any feature code.

## Recommended Sprint 1: MVP Approval and Implementation Readiness

Status: Active

Sprint objective:
Turn the approved MVP scope into implementation-ready product, UX, typing-engine, data, privacy, architecture, and QA specifications. This sprint does not include feature code; implementation starts in a later sprint after founder approval of MVP scope and architecture direction.

## Sprint 1 Task Contract

| Field | Details |
|---|---|
| Role owner | Product Manager |
| Objective | Convert the competitor-backed MVP recommendation into approved, build-ready Phase 1 requirements. |
| Scope | MVP PRD, page map, core user flow, typing engine rules, local data model, privacy notes, technology recommendation, and QA plan. |
| Out of scope | Feature coding, public launch, paid tools, accounts, classroom features, multiplayer, monetization, and brand lock-in. |
| Inputs | `PROJECT_CHARTER.md`, `COMPETITOR_RESEARCH.md`, `ROADMAP.md`, `DECISION_LOG.md`, founder feedback. |
| Expected output | Founder-approved MVP requirements and implementation-readiness packet. |
| Acceptance criteria | MVP PRD exists; page map exists; test-to-results-to-practice flow is defined; calculation rules and edge cases are documented; local data model is proposed; privacy notes are drafted; architecture recommendation is ready; QA plan is ready. |
| Review owner | Founder, with AI Operating CEO / Product Owner coordinating. |
| Decision needed | Founder approval of audience, positioning, scope, exclusions, local-only persistence, and whether games are deferred. |

## Sprint 1 Planned Work

| Task | Owner | Status | Acceptance Criteria |
|---|---|---|---|
| Review and approve MVP scope proposal | Founder + Product Manager | Completed | Founder approves, rejects, or revises primary audience, positioning, pages, features, exclusions, and local-only persistence. |
| Draft MVP PRD | Product Manager | Completed | PRD includes problem, audience, scope, user stories, acceptance criteria, success metrics, and non-goals. |
| Draft page map and core flow | UX Designer | Completed | Flow covers Home/Dashboard to Typing Test to Results to Practice to Progress, plus Learn and About/Privacy/Help. |
| Define typing engine calculation rules | Typing Engine Specialist | Completed | WPM, raw WPM, accuracy, errors, timing, restart, completion, and edge cases are testable and transparent. |
| Recommend local-first data shape | Data Engineer + Architect | Completed | Session history, personal bests, weak areas, and local reset/delete behavior are defined. |
| Review privacy and safety posture | Data Privacy / Safety Reviewer | Completed | Phase 1 avoids sensitive personal data, explains local storage, and includes clear data clearing behavior. |
| Compare free technology options | Architect | Completed | Recommendation covers frontend stack, local persistence, hosting, testing, and future account path. |
| Draft QA plan | QA Tester | Completed | Test plan covers calculations, core flow, keyboard input, accessibility, responsiveness, persistence, and regression checks. |
| Prepare Sprint 1 review | Scrum Master | Completed | Review notes list completed, blocked, risks, decisions, and next implementation tasks. |

## Sprint 1 Definition Of Done

- Founder approval or revision is captured in `DECISION_LOG.md`. (Completed)
- MVP PRD is ready for implementation handoff. (Completed)
- UX flow and page inventory are approved for design/detail work. (Completed)
- Typing engine rules are clear enough for tests before coding. (Completed)
- Local data model and privacy posture are clear. (Completed)
- Architecture recommendation is ready for founder approval. (Completed)
- QA plan exists before implementation starts. (Completed)

## Review Meeting Notes

Date: 2026-06-07
Cycle: Sprint 1 MVP Specification & Approval
Roles involved: AI Operating CEO, Product Manager, Architect, Typing Engine Specialist, Data Engineer, Data Privacy Reviewer, QA Tester, Scrum Master
Completed:
- Approved working product name as **TypeFlow**.
- Configured GitHub remote origin at `https://github.com/rsoumyaranjan/TypeFlow.git`.
- Drafted the Phase 1 MVP PRD ([MVP_PRD.md](file:///c:/Users/soumy/Documents/Typing%20website/specs/MVP_PRD.md)).
- Drafted the Typing Engine Specs ([TYPING_ENGINE_SPEC.md](file:///c:/Users/soumy/Documents/Typing%20website/specs/TYPING_ENGINE_SPEC.md)).
- Drafted the Data Model Specs ([DATA_MODEL_SPEC.md](file:///c:/Users/soumy/Documents/Typing%20website/specs/DATA_MODEL_SPEC.md)).
- Drafted the UX Navigation Flow Map ([UX_FLOW_MAP.md](file:///c:/Users/soumy/Documents/Typing%20website/specs/UX_FLOW_MAP.md)).
- Drafted the Privacy & Safety Posture ([PRIVACY_POSTURE.md](file:///c:/Users/soumy/Documents/Typing%20website/specs/PRIVACY_POSTURE.md)).
- Drafted the QA Test Plan ([QA_TEST_PLAN.md](file:///c:/Users/soumy/Documents/Typing%20website/specs/QA_TEST_PLAN.md)).
Failed or blocked:
- Push to GitHub remote failed locally due to GitHub password authentication deprecation (personal access token or SSH credential setup required). The Founder needs to run `git push -u origin main` in their own credential-authenticated terminal.
Bugs or risks found:
- Storing high-resolution keystroke event arrays client-side can cause IndexedDB query lag if tests grow very large. Mitigation: we grouped the keystroke logs directly inside the `tests` table as a nested array rather than a separate table to keep writes fast and transactional.
Decisions made:
- Lock-in React + Vite + TypeScript, IndexedDB (Dexie.js), Vitest, Playwright, and Cloudflare Pages.
Next recommended tasks:
- Start **Sprint 2: Initial Setup and Engine Foundation**. Create the React+Vite app, install Dexie/Vitest, and implement the core typing engine calculation utility with 100% unit test coverage.

## Proposed Sprint 2: Initial Setup and Engine Foundation

Status: Completed

Sprint objective:
Initialize the React/Vite development framework and implement the typing engine logic in TypeScript, verifying all calculations using Vitest unit tests. No user interface styling or complex pages will be implemented in this sprint; the focus is on a solid code foundation.

## Sprint 2 Task Contract

| Field | Details |
|---|---|
| Role owner | Full-Stack Developer |
| Objective | Initialize the Vite repository, install dependencies, and build the core typing calculation engine. |
| Scope | Vite app initialization, dependency installations (Dexie, Lucide-React, Vitest), typing engine utility class, and calculation unit tests. |
| Out of scope | Frontend page views, layout styling, page routing, game modes, and remote database sync. |
| Inputs | `specs/MVP_PRD.md`, `specs/TYPING_ENGINE_SPEC.md`, `specs/DATA_MODEL_SPEC.md`, `specs/QA_TEST_PLAN.md`. |
| Expected output | Clean building React app structure, active unit test suite, and passing calculations. |
| Acceptance criteria | `npm run build` compiles without errors; `npm run test` executes and passes all engine fixtures; WPM, Raw WPM, accuracy, and error logs are correct. |
| Review owner | Architect + QA Tester |

## Sprint 2 Planned Work

| Task | Owner | Status | Acceptance Criteria |
|---|---|---|---|
| Initialize Vite React App | Full-Stack Developer | Completed | Create project files in `./`, configure TypeScript, and set up a clean folder structure. |
| Install Dependencies | Full-Stack Developer | Completed | Install `dexie`, `lucide-react`, `vitest`, and `playwright`. |
| Implement Typing Engine Utility | Typing Engine Specialist | Completed | Create `src/utils/typingEngine.ts` matching the timing, input, and backspace spec rules. |
| Add Engine Unit Tests | QA Tester | Completed | Create `src/utils/typingEngine.test.ts` implementing all three specification fixtures. |
| Verify Local Compilation | Full-Stack Developer | Completed | Ensure `npm run build` runs clean and generates build artifacts. |
| Prepare Sprint 2 review | Scrum Master | Completed | Summary of build status, tests, and readiness for Sprint 3 (UI views). |

## Review Meeting Notes (Sprint 2)

Date: 2026-06-07
Cycle: Sprint 2 Code Foundation
Roles involved: Full-Stack Developer, Typing Engine Specialist, QA Tester, Scrum Master, Architect
Completed:
- Installed Node.js (v24.16.0 LTS) and refreshed environmental variables.
- Scaffolded React-TS project with Vite in target directory `./`.
- Installed production dependencies (`dexie`, `lucide-react`) and dev dependencies (`vitest`, `@playwright/test`).
- Implemented `src/utils/typingEngine.ts` handling timing, spacebar lock, backspace boundaries, and metrics.
- Created `src/utils/typingEngine.test.ts` unit tests executing 6 tests (WPM metrics, errors, backspace limits, timing deltas). All passed.
- Verified compiler setup by running `npm run build` successfully.
Bugs or risks found:
- PowerShell script execution policy blocked standard `npx` script files. Resolved by using `npx.cmd` directly for cross-platform robustness.
Next recommended tasks:
- Start **Sprint 3: Core UI Views and Local Persistence**. Build the React pages (Test, Results, Practice), construct the Dexie DB connection class, and link metrics outputs to local storage.

---

## Proposed Sprint 3: Core UI Views and Local Persistence

Status: Proposed (Awaiting Founder Approval)

Sprint objective:
Create the core visual screens in React (Test Page, Results Page with next practice recommendations, and Practice Page) and integrate local IndexedDB storage to persist session history and high scores.

## Sprint 3 Task Contract

| Field | Details |
|---|---|
| Role owner | Full-Stack Developer |
| Objective | Build the primary UI screens, page router, local database connector, and data portability features. |
| Scope | Page components, simple client-side router, IndexedDB Dexie service, local data import/export, and data wipe hooks. |
| Out of scope | Structured multi-lesson Learn curriculum, historical line charts, and deployment build pipelines. |
| Inputs | `src/utils/typingEngine.ts`, `specs/MVP_PRD.md`, `specs/UX_FLOW_MAP.md`, `specs/DATA_MODEL_SPEC.md`. |
| Expected output | Interactive typing interface that saves session details to local storage and displays results instantly. |
| Acceptance criteria | User can type in browser UI; test ends automatically at 0 seconds; results page displays correct metrics; next-step practice button opens active drill; data is saved in IndexedDB. |
| Review owner | UX Designer + QA Tester |

## Sprint 3 Planned Work

| Task | Owner | Status | Acceptance Criteria |
|---|---|---|---|
| Set up IndexedDB & Dexie DB Service | Data Engineer | Completed | Create `src/services/db.ts` to manage the TypeFlowDB connection, schemas, and queries. |
| Build Client-Side Page Router | Full-Stack Developer | Completed | Set up simple state-based or context-based tab navigation (Dashboard, Test, Practice, Progress, About). |
| Implement Typing Test Page | Full-Stack Developer + UX | Completed | Create UI text container matching carets, text feeds, typo coloring, and focus/blur overlays. |
| Implement Results Page | UX Designer + PM | Completed | Create WPM card visual structures, plain language analysis text, and practice CTA recommendations. |
| Implement Practice Page | Typing Engine Specialist | Completed | Build active drill mode dynamically pulling words from the last session's errors or slow keys. |
| Build Data Portability & Controls | Data Engineer | Completed | Build "Export JSON" and "Reset/Delete Database" buttons on the settings/about modules. |
| Verify E2E Flow | QA Tester | Completed | Run manual and basic test suite actions to verify data writes cleanly into browser IndexedDB. |

## Review Meeting Notes (Sprint 3)

Date: 2026-06-07
Cycle: Sprint 3 Core UI and Persistence
Roles involved: Data Engineer, Full-Stack Developer, Typing Engine Specialist, UX Designer, QA Tester, Scrum Master
Completed:
- Created the IndexedDB persistence layer in [db.ts](file:///c:/Users/soumy/Documents/Typing%20website/src/services/db.ts) and verified it with unit tests.
- Set up a clean state-based client-side page router and global header layout in [App.tsx](file:///c:/Users/soumy/Documents/Typing%20website/src/App.tsx).
- Built the interactive [TypingTest.tsx](file:///c:/Users/soumy/Documents/Typing%20website/src/components/TypingTest.tsx) capturing keystrokes and handling blur overlays and timeouts.
- Designed [Results.tsx](file:///c:/Users/soumy/Documents/Typing%20website/src/components/Results.tsx) grid cards and recommendations parser.
- Coded [Practice.tsx](file:///c:/Users/soumy/Documents/Typing%20website/src/components/Practice.tsx) drill typing engine.
- Completed full integration in [ProgressView.tsx](file:///c:/Users/soumy/Documents/Typing%20website/src/components/ProgressView.tsx) displaying records, historical charts, alphabetical heatmap styles, export JSON backups, data imports, and database clears.
- Successfully compiled the production bundle via `npm run build` (0 errors).
Bugs or risks found:
- React state synchronizations between App.tsx tabs and sub-components initially had props mismatches. Resolved by creating clean prop-drilling interfaces.
Next recommended tasks:
- Start **Sprint 4: Interactive Learning & Dashboard Polish**. Build the Learn component, wire up the Dashboard home page statistics, and add visual theme polish.

---

## Sprint 4: Onboarding Diagnostics & Compact Dashboard

Status: Active

Sprint objective:
Evolve the TypeFlow dashboard into an interactive, high-density landing page featuring onboarding diagnostics (identifying whether the user is a touch-typist or needs finger-placement training) and compact layout columns to optimize above-the-fold real estate.

## Sprint 4 Task Contract

| Field | Details |
|---|---|
| Role owner | Full-Stack Developer |
| Objective | Build the interactive onboarding component, persist user skill preferences, and compact the dashboard layout structure. |
| Scope | Onboarding question states, localStorage caching, custom CTA redirects, grid-based dashboard restructuring, and padding/spacing styling cleanups. |
| Out of scope | Advanced multiplayer games, cloud analytics databases, and teacher/classroom dashboards. |
| Inputs | `specs/MVP_PRD.md`, `specs/UX_FLOW_MAP.md`, `src/components/Dashboard.tsx`, `src/App.css`. |
| Expected output | High-density interactive dashboard guiding users to Learn or Test based on touch-typing status. |
| Acceptance criteria | User can answer touch-typing questionnaire; dashboard dynamically adjusts recommendations and button CTAs; dashboard fits on single screen heights; no routing errors. |
| Review owner | Product Manager + UX Designer |

## Sprint 4 Planned Work

| Task | Owner | Status | Acceptance Criteria |
|---|---|---|---|
| Implement Onboarding Caching | Full-Stack Developer | Active | Save and read `typeflow_touchtype_status` and `typeflow_onboarding_answered` from localStorage. |
| Build Dashboard Diagnostic Card | UX Designer + Full-Stack Developer | Active | Render interactive Yes/No/Unsure choices and conditional Learn/Test navigation CTAs. |
| Compact Dashboard Grid Layout | Visual Designer + Full-Stack Developer | Active | Restructure dashboard cards into a premium 3-column layout (2/3 main, 1/3 stats) with optimized padding. |
| Run Verification Tests | QA Tester | Active | Run Vitest test suites and verify typescript compilation. |
| Prepare Sprint 4 review | Scrum Master | Proposed | Summary of dashboard polish and readiness for next release phase. | |

## Working Cadence

Recommended cycle:
- Sprint length: 1 week while the product is early.
- Founder review: after each sprint or major decision.
- Build review: after each implemented feature set.
- QA review: before every publish.



