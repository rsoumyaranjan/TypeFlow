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
