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
| 2026-06-06 | Use competitor research to keep Phase 1 MVP individual-first: quick test, guided practice, basic lessons, and local progress; defer classroom dashboards, multiplayer races, deep game economy, and monetization. | Competitor Researcher + Product Manager | Approved by Founder | Broad all-in-one MVP, school-first MVP, competitive-game-first MVP, individual-first MVP | Competitors win by focus. School, race, and game products require heavier privacy, account, moderation, reporting, and engagement systems than the first build should carry. | Product Manager should convert this into an MVP scope proposal for founder approval. |
| 2026-06-06 | Reverify competitor pricing immediately before using it for monetization or positioning decisions. | Competitor Researcher | Approved by Founder | Store current observed prices now, verify later before decisions | Pricing pages were quote-based, localized, dynamic, or not clearly accessible for several competitors. Static pricing notes can become stale quickly. | Add pricing recheck to any future monetization research task. |
| 2026-06-06 | Recommend Phase 1 MVP as a calm, local-first typing improvement product for individual adult and teen improvers. | Product Manager | Approved by Founder | School/curriculum-first, fast-test-only, game/race-first, coder/job-prep-first, individual improvement-first | Competitor research shows clear market segments. The strongest practical gap for a solo-founder MVP is combining no-account testing, plain-language results, one targeted next practice action, short beginner drills, and local progress without school, multiplayer, or monetization complexity. | Completed. MVP scope is locked in for Phase 1. |
| 2026-06-07 | Approve Phase 1 MVP scope: individual audience, calm recommendation-driven positioning, local-only persistence, and deferring multiplayer/games/schools. | Founder + Product Manager | Approved by Founder | Proposed Phase 1 scope vs larger scoped alternative | Simplifies development, matches the core value proposition (guided practice), and avoids expensive or complex infrastructure at launch. | Start Sprint 1 specification drafting. |
| 2026-06-07 | Approve working product name as **TypeFlow**. | Founder + Product Manager | Approved by Founder | TypeFlow, TypePath, KeyNudge, TypeClarity, TypingFocus | Simple, positive, and represents the calm rhythm of typing we want to build. | Apply to requirements and documentation. |
| 2026-06-07 | Approve technology stack: React + Vite + Dexie.js (IndexedDB) + Cloudflare Pages + Vitest + Playwright. | Founder + Architect | Approved by Founder | React+Vite vs Plain JS vs Next.js; LocalStorage vs IndexedDB | Provides scalable frontend framework, free hosting, asynchronous large local storage, and robust testing at zero cost. | Initialize project structure. |
| 2026-06-07 | Configure Git Remote Repository URL to `https://github.com/rsoumyaranjan/TypeFlow.git`. | Founder | Approved by Founder | Connecting local repo to remote origin | Enables automated backups and eventual CI/CD deployment. | Request user to run initial push due to local authentication. |
| 2026-06-07 | Evolve routing schema to BrowserRouter and implement static hosts rewrite rule in public/_redirects. | Founder + Architect | Approved by Founder | HashRouter vs BrowserRouter | BrowserRouter gives cleaner, standard URLs without the '#' hash prefix; rewrites solve refresh issues. | Place `_redirects` file in public/ and switch App.tsx main routing wrapper to BrowserRouter. |

## Open Decisions

| Date Opened | Decision Needed | Recommended Owner | Why It Matters | Target Timing |
|---|---|---|---|---|
| 2026-06-06 | Initial monetization stance | Founder + Product Manager | Influences whether ads, premium features, or schools are avoided early. | Before public launch |


