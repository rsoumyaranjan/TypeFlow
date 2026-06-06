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

Status: Proposed

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
| Review and approve MVP scope proposal | Founder + Product Manager | Proposed | Founder approves, rejects, or revises primary audience, positioning, pages, features, exclusions, and local-only persistence. |
| Draft MVP PRD | Product Manager | Proposed | PRD includes problem, audience, scope, user stories, acceptance criteria, success metrics, and non-goals. |
| Draft page map and core flow | UX Designer | Proposed | Flow covers Home/Dashboard to Typing Test to Results to Practice to Progress, plus Learn and About/Privacy/Help. |
| Define typing engine calculation rules | Typing Engine Specialist | Proposed | WPM, raw WPM, accuracy, errors, timing, restart, completion, and edge cases are testable and transparent. |
| Recommend local-first data shape | Data Engineer + Architect | Proposed | Session history, personal bests, weak areas, and local reset/delete behavior are defined. |
| Review privacy and safety posture | Data Privacy / Safety Reviewer | Proposed | Phase 1 avoids sensitive personal data, explains local storage, and includes clear data clearing behavior. |
| Compare free technology options | Architect | Proposed | Recommendation covers frontend stack, local persistence, hosting, testing, and future account path. |
| Draft QA plan | QA Tester | Proposed | Test plan covers calculations, core flow, keyboard input, accessibility, responsiveness, persistence, and regression checks. |
| Prepare Sprint 1 review | Scrum Master | Proposed | Review notes list completed, blocked, risks, decisions, and next implementation tasks. |

## Sprint 1 Definition Of Done

- Founder approval or revision is captured in `DECISION_LOG.md`.
- MVP PRD is ready for implementation handoff.
- UX flow and page inventory are approved for design/detail work.
- Typing engine rules are clear enough for tests before coding.
- Local data model and privacy posture are clear.
- Architecture recommendation is ready for founder approval.
- QA plan exists before implementation starts.

## Working Cadence

Recommended cycle:

- Sprint length: 1 week while the product is early.
- Founder review: after each sprint or major decision.
- Research update: before MVP scope approval.
- Build review: after each implemented feature set.
- QA review: before every publish.

## Immediate Founder Questions

These can be answered now or after the first research pass:

1. Who is the first MVP user: beginners, students, job seekers, professionals, coders, or competitive typists?
2. Should the first version store progress locally only, or should accounts be considered early?
3. Is the platform meant to feel more like a learning product, a fast practice tool, a game hub, or a data analytics showcase?
