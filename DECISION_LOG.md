# Decision Log

Last updated: 2026-06-06

Use this file to record durable project decisions. Every important decision should include date, owner, options considered, rationale, and follow-up actions.

## Decision Template

| Date | Decision | Owner | Status | Options Considered | Rationale | Follow-up |
|---|---|---|---|---|---|---|
| YYYY-MM-DD |  |  | Proposed / Approved / Rejected / Superseded |  |  |  |

## Decisions

| Date | Decision | Owner | Status | Options Considered | Rationale | Follow-up |
|---|---|---|---|---|---|---|
| 2026-06-06 | Establish AI Operating CEO and Product Owner operating model. | Founder + AI Operating CEO / PO | Approved by request | Ad hoc building, single developer flow, structured agent operating model | Founder requested coordinated specialist-agent execution and durable project memory. | Maintain `AGENTS.md` and route future tasks by role. |
| 2026-06-06 | Create project memory files at the repository root. | AI Operating CEO / PO | Approved by request | Root docs, nested docs folder | Founder named specific files, so root placement keeps them visible and easy to update. | Keep files updated after every work cycle. |
| 2026-06-06 | Require research and planning before feature coding. | AI Operating CEO / PO | Approved by request | Code immediately, research first | Founder explicitly required market, competitor, user, free technology, and constraint understanding before coding. | Complete Phase 0 research before MVP implementation. |
| 2026-06-06 | Prefer free and open-source tools until revenue. | Founder + AI Operating CEO / PO | Approved by request | Paid SaaS first, free/open-source first | Founder required practical, low-cost execution until the website earns money. | Validate current free tiers during technology research. |
| 2026-06-06 | Treat founder as final approver for major product and business decisions. | Founder + AI Operating CEO / PO | Approved by request | AI final decisions, founder final decisions | Founder has final approval; AI coordinates and recommends. | Ask for approval at listed gates. |
| 2026-06-06 | Use competitor research to keep Phase 1 MVP individual-first: quick test, guided practice, basic lessons, and local progress; defer classroom dashboards, multiplayer races, deep game economy, and monetization. | Competitor Researcher + Product Manager | Proposed | Broad all-in-one MVP, school-first MVP, competitive-game-first MVP, individual-first MVP | Competitors win by focus. School, race, and game products require heavier privacy, account, moderation, reporting, and engagement systems than the first build should carry. | Product Manager should convert this into an MVP scope proposal for founder approval. |
| 2026-06-06 | Reverify competitor pricing immediately before using it for monetization or positioning decisions. | Competitor Researcher | Proposed | Store current observed prices now, verify later before decisions | Pricing pages were quote-based, localized, dynamic, or not clearly accessible for several competitors. Static pricing notes can become stale quickly. | Add pricing recheck to any future monetization research task. |
| 2026-06-06 | Recommend Phase 1 MVP as a calm, local-first typing improvement product for individual adult and teen improvers. | Product Manager | Proposed | School/curriculum-first, fast-test-only, game/race-first, coder/job-prep-first, individual improvement-first | Competitor research shows clear market segments. The strongest practical gap for a solo-founder MVP is combining no-account testing, plain-language results, one targeted next practice action, short beginner drills, and local progress without school, multiplayer, or monetization complexity. | Founder must approve or revise the MVP audience, positioning, page list, features, exclusions, and local-only persistence before architecture and coding. |

## Open Decisions

| Date Opened | Decision Needed | Recommended Owner | Why It Matters | Target Timing |
|---|---|---|---|---|
| 2026-06-06 | Primary MVP audience | Founder + Product Manager | Audience changes lessons, UX, analytics, games, and tone. | Before Phase 1 |
| 2026-06-06 | Working product name | Founder + Product Manager | Branding affects page copy and future publishing. | Before visual design |
| 2026-06-06 | First persistence model: local-only, account-based, or hybrid | Founder + Architect | Determines backend complexity and privacy scope. | Before development |
| 2026-06-06 | First technology stack | Founder + Architect | Determines build speed, hosting, and maintenance. | End of Phase 0 |
| 2026-06-06 | Initial monetization stance | Founder + Product Manager | Influences whether ads, premium features, or schools are avoided early. | Before public launch |
| 2026-06-06 | MVP positioning after competitor research: beginner-learning-first, fast-test-first, coder/job-prep-first, or game-first | Founder + Product Manager | Competitor findings show each direction changes tone, page map, lesson depth, analytics, and engagement features. | Before MVP PRD |
| 2026-06-06 | Should classroom/school features be explicitly out of Phase 1? | Founder + Product Manager + Privacy Reviewer | Typing.com, TypingClub, Nitro Type, and TypeRacer school products show classroom value, but accounts, reporting, student data, and safety controls add scope and privacy obligations. | Before Phase 1 |
| 2026-06-06 | Should Phase 1 include any game/challenge loop, or defer games until after core test and practice analytics are proven? | Founder + Product Manager | Nitro Type and TypeRacer show engagement value, but competitive systems can distract from the reliable typing engine and local progress MVP. | MVP scope review |
| 2026-06-06 | Approve or revise the Phase 1 MVP scope proposal in `ROADMAP.md`. | Founder + Product Manager | Architecture and coding should not begin until audience, positioning, pages, features, exclusions, and Sprint 1 direction are approved. | Before architecture and coding |
| 2026-06-06 | Approve local-only progress for Phase 1 or require early accounts. | Founder + Architect + Privacy Reviewer | Local-only progress keeps cost and privacy risk low, but accounts would change architecture, QA, and data privacy scope. | Before architecture and coding |
| 2026-06-06 | Approve Phase 1 no-game stance or request a small personal challenge loop. | Founder + Product Manager + UX Designer | Games can increase engagement but may distract from proving the core test to recommendation to practice loop. | Before MVP PRD |
