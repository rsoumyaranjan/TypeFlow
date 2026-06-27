# Roadmap

Last updated: 2026-06-06

## Roadmap Strategy

Build the typing platform in controlled phases. Each phase should produce a reviewable artifact and should not depend on expensive services unless the founder approves.

## Phase 0: Foundation, Research, and Product Definition

Status: Active

Goal:
Create project operating structure, understand the market, validate user needs, compare free technology options, and define MVP scope.

Primary agents:
- AI Operating CEO / Product Owner
- Product Manager
- Competitor Researcher
- User Researcher
- Architect
- Scrum Master

Outputs:
- `AGENTS.md`
- `PROJECT_CHARTER.md`
- `DECISION_LOG.md`
- `ROADMAP.md`
- `SPRINT_NOTES.md`
- `COMPETITOR_RESEARCH.md`
- Competitor matrix
- User need assumptions
- Technology recommendation
- MVP scope proposal

Exit criteria:
- Founder approves MVP audience.
- Founder approves MVP feature scope.
- Architecture recommendation is documented.
- First development sprint is defined.

## MVP Scope Proposal: Phase 1

Status: Proposed for founder approval

Role owner:
- Product Manager

Supporting agents:
- Competitor Researcher
- UX Designer
- Architect
- Typing Engine Specialist
- QA Tester
- Data Privacy / Safety Reviewer

Inputs:
- `PROJECT_CHARTER.md`
- `COMPETITOR_RESEARCH.md`
- `DECISION_LOG.md`
- `SPRINT_NOTES.md`

### 1. Recommended Primary MVP Audience

Recommended audience:
- Individual adult and teen learners who already understand the keyboard basics and want practical typing improvement without accounts, classroom setup, or competitive pressure.

Primary use cases:
- Job seekers preparing for typing tests.
- Students and professionals who want faster, more accurate daily typing.
- Beginners moving from "I know the keys" to consistent touch typing.
- Writers and coders who may later need punctuation, numbers, symbols, and custom text practice.

Why this audience:
- Competitor research shows fast-test products such as Monkeytype and 10FastFingers are strong for instant testing, while Keybr is strong for adaptive weak-key practice and Typing.com/TypingClub are strong for school-style curriculum.
- The practical gap is a calm individual-first product that combines quick testing, one guided practice path, plain-language analytics, and local progress.
- This audience avoids Phase 1 privacy and administration complexity from school dashboards, student accounts, rosters, assignments, multiplayer, and public rankings.

Secondary audience for later:
- Teachers, classrooms, competitive typists, game-motivated students, and advanced coders.

### 2. Product Positioning

Recommended positioning:
- A calm, local-first typing improvement website that turns every test into one clear next practice action.

Positioning statement:
- For individuals who want to type faster and more accurately, this website provides a no-account typing test, clear results, targeted practice, and local progress tracking so users know exactly what to improve next.

Differentiation from competitors:
- Faster and simpler than school platforms for individual users.
- More guided than pure test tools.
- Less distracting than racing or cosmetic game loops.
- More privacy-friendly than account-first progress products in Phase 1.
- More explainable than score-only typing tests.

### 3. MVP Pages

Phase 1 should include:
- Home / Dashboard: Start a test, continue practice, see recent best and recent weak area.
- Typing Test: No-account timed test with keyboard-first controls.
- Results: WPM, raw WPM, accuracy, errors, duration, plain-language explanation, and one recommended next drill.
- Practice: Target missed words, slow words, or weak keys from the latest local session.
- Learn: A short guided beginner path, starting with home-row and finger-placement basics.
- Progress: Local session history, personal bests, simple trends, and weak areas.
- About / Privacy / Help: Explain calculations, local storage, privacy stance, and project status.

Phase 1 page principle:
- Each page must support a real workflow. Do not add marketing-only pages before the core experience works.

### 4. MVP Features

Core test:
- No-account quick start.
- Timed test presets, with 60 seconds as the default and at least one shorter preset.
- Common-word test source for Phase 1.
- Live typo feedback that remains readable and low-distraction.
- Restart and new-test controls.
- Keyboard-first interaction.

Metrics:
- WPM.
- Raw WPM.
- Accuracy.
- Error count.
- Duration.
- Personal best.
- Previous-session comparison when local history exists.
- Transparent calculation rules.

Guided improvement:
- Result page recommends one next action.
- Practice mode can use missed words, slow words, or weak keys from the latest session.
- Beginner drill path includes a small number of guided drills, not a full curriculum.

Local progress:
- Store recent sessions locally.
- Store personal bests locally.
- Store weak keys or weak words locally.
- Provide clear reset/delete local data control.
- Avoid account creation in Phase 1 unless founder overrides this recommendation.

Quality and accessibility:
- Responsive desktop and mobile layouts.
- Readable contrast and focus states.
- Input latency must feel immediate.
- Core calculation logic must be testable.
- The site should work with free/open-source tooling.

### 5. Features To Exclude From Phase 1

Exclude from Phase 1:
- User accounts, login, cloud sync, and profile pages.
- Teacher dashboards, classrooms, rosters, assignments, student reporting, and school privacy workflows.
- Multiplayer races, public leaderboards, leagues, seasons, and cosmetic economies.
- Paid subscriptions, ads, certificates, sponsored content, and monetization experiments.
- Full beginner curriculum with many lessons, grades, or standards alignment.
- Deep analytics dashboards, cohorts, exports, event pipelines, or external analytics services.
- AI tutoring that requires paid APIs.
- Native mobile apps.
- Imported books, EPUB/PDF/TXT upload, and long-form literature mode.
- Code typing, custom text, numbers, and punctuation as full modes unless the founder explicitly narrows the MVP toward coder/job-prep users.
- Public sharing and social features.

### 6. User Stories

Phase 1 user stories:
- As an individual learner, I want to start a typing test without signing up so I can try the product immediately.
- As a job seeker, I want a reliable 60-second typing test so I can estimate my test readiness.
- As a learner, I want WPM, raw WPM, accuracy, errors, and duration shown clearly so I understand my result.
- As a learner, I want the result page to recommend one drill so I know what to practice next.
- As a learner, I want to practice my missed words or weak keys so I can improve the part of typing that slowed me down.
- As a beginner, I want a short guided lesson path so I can build correct finger habits without a full school curriculum.
- As a returning user, I want local progress history so I can see whether I am improving without creating an account.
- As a privacy-conscious user, I want to know what is stored locally and be able to clear it.
- As a mobile or small-screen user, I want the interface to remain readable and usable even if serious typing practice is better on a physical keyboard.
- As the founder, I want the MVP to be buildable with free tools so the product can be validated before paid services.

### 7. Acceptance Criteria

Product acceptance:
- A first-time user can start a test from the home page in one click or one primary keyboard action.
- A completed test shows WPM, raw WPM, accuracy, errors, duration, and a clear recommendation.
- The recommended practice action is based on actual session data, even if the first rule is simple.
- A user can complete at least one practice drill after a test.
- A user can complete at least one beginner lesson or drill from the Learn page.
- Recent sessions and personal bests persist locally after refresh.
- A user can clear local progress data.
- The About / Help area explains metric formulas and local storage in plain language.

Quality acceptance:
- Typing calculations have repeatable test cases before release.
- Keyboard input does not visibly lag during normal use.
- Layout works on desktop and mobile viewports.
- Core controls have visible focus states.
- The MVP does not require paid infrastructure.
- The MVP does not collect sensitive personal data.

Out-of-scope acceptance:
- Phase 1 is still considered complete without accounts, cloud sync, multiplayer, classrooms, monetization, imported books, and deep analytics.

### 8. Success Metrics

MVP validation metrics:
- Test start rate from home page.
- Test completion rate.
- Percentage of users who start the recommended practice after results.
- Percentage of users who complete a practice drill.
- Repeat local sessions per returning user.
- WPM improvement across local sessions.
- Accuracy improvement across local sessions.
- Weak-key or missed-word reduction across local sessions.
- Percentage of users who view progress after completing a test.

Quality metrics:
- Calculation test pass rate.
- Input latency check passes on target browsers/devices.
- Core flow QA pass rate.
- Accessibility issues found and fixed.
- Page load speed under the selected free hosting approach.

Privacy and cost metrics:
- No account required for the core flow.
- No sensitive personal data collected in Phase 1.
- No paid services required to build or run the first MVP.

### 9. Open Decisions For The Founder

Founder approval is needed for:
- Primary MVP audience: approve individual adult/teen improvers as the first audience, or select another audience.
- Positioning: approve "calm, local-first typing improvement with next-practice recommendations."
- Phase 1 persistence: approve local-only progress for MVP, with accounts deferred.
- MVP page list: approve Home/Dashboard, Typing Test, Results, Practice, Learn, Progress, and About/Privacy/Help.
- MVP feature scope: approve quick test, metrics, recommendation, targeted practice, short beginner path, and local progress.
- Phase 1 exclusions: approve deferring accounts, classrooms, multiplayer, monetization, deep analytics, long-form imports, and full curriculum.
- Working product name: approve a temporary or final name before visual design.
- Game/challenge stance: approve no game loop in Phase 1, or define a very small personal challenge if desired.

### 10. Recommended Sprint 1 Scope

Recommended Sprint 1 objective:
- Convert the approved MVP scope into implementation-ready product, UX, typing-engine, data, and QA specifications without writing feature code.

Sprint 1 planned work:
- Product Manager: write the MVP PRD and final Phase 1 acceptance criteria.
- UX Designer: create the page map and core flow for test to results to practice to progress.
- Typing Engine Specialist: define WPM, raw WPM, accuracy, error, timing, restart, and completion rules with edge cases.
- Architect: recommend a free/local-first technology approach and local persistence shape.
- Data Engineer: define minimal local event/session data needed for progress and recommendations.
- Data Privacy / Safety Reviewer: review local storage, data clearing, and no-account privacy language.
- QA Tester: draft the calculation, flow, accessibility, responsiveness, and regression test plan.
- Scrum Master: prepare Sprint 1 review notes and founder approval checklist.

Sprint 1 acceptance criteria:
- Founder-approved MVP PRD exists.
- Page map and core user flow are documented.
- Typing engine rules and test fixtures are documented.
- Local data model recommendation is documented.
- Architecture recommendation is ready for founder review.
- QA plan is ready before coding.
- Any architecture or coding work remains blocked until founder approves the required decisions.

## Phase 1: Core MVP Typing Experience

Goal:
Build the first usable multi-page typing website with a reliable typing test, targeted practice recommendation, and local progress summary.

Recommended pages:
- Home / dashboard
- Typing test
- Results
- Practice
- Learn
- Progress
- About / privacy / help

Core features:
- No-account quick start
- Timed test mode
- WPM, raw WPM, accuracy, errors, and duration
- Restart and new test controls
- Basic word source
- Result-based next-practice recommendation
- Missed-word, slow-word, or weak-key practice
- Short beginner drill path
- Local progress history
- Basic session summary

Primary agents:
- Product Manager
- UX Designer
- Architect
- Typing Engine Specialist
- Full-Stack Developer
- QA Tester

Exit criteria:
- Typing engine calculations are tested.
- Main user flow works on desktop and mobile.
- Local progress persists.
- QA review is complete.

## Phase 2: Learning and Practice System

Goal:
Add structured learning and targeted practice.

Candidate features:
- Beginner lesson path
- Home row and finger placement
- Weak-key drills
- Numbers and punctuation drills
- Custom text mode
- Code typing mode
- Recommendations after tests

Primary agents:
- Product Manager
- User Researcher
- UX Designer
- Typing Engine Specialist
- Data Engineer
- QA Tester

Exit criteria:
- Lessons are usable and measurable.
- Practice sessions produce meaningful progress signals.
- Users get a clear next recommendation.

## Phase 3: Analytics and Progress Tracking

Goal:
Turn typing sessions into useful insight.

Candidate features:
- Progress dashboard
- Per-key error and speed analysis
- Session history
- Personal bests
- Trend charts
- Exportable data
- Event tracking plan

Primary agents:
- Data Engineer
- Product Manager
- Architect
- Full-Stack Developer
- Data Privacy / Safety Reviewer
- QA Tester

Exit criteria:
- Metrics definitions are documented.
- Analytics are accurate and privacy-aware.
- Data can support future data engineering demos.

## Phase 4: Games and Engagement

Goal:
Add typing games that improve skill without distracting from learning.

Candidate features:
- Word survival game
- Accuracy challenge
- Timed streak mode
- Ghost replay
- Daily challenge
- Achievements

Primary agents:
- Product Manager
- UX Designer
- Full-Stack Developer
- QA Tester

Exit criteria:
- Games are fun, fast, and tied to skill goals.
- Replay loop is measurable.
- Game state does not break core typing accuracy.

## Phase 5: Accounts, Sharing, and Community

Goal:
Add optional identity and sharing only after core value is proven.

Candidate features:
- User accounts
- Cloud progress sync
- Public result pages
- Friend challenges
- Leaderboards
- Anti-cheat basics

Primary agents:
- Architect
- Data Privacy / Safety Reviewer
- Full-Stack Developer
- QA Tester
- DevOps / Publisher

Exit criteria:
- Privacy risks are reviewed.
- Authentication is stable.
- Abuse and anti-cheat risks are documented.

## Phase 6: Publishing and Growth

Goal:
Launch publicly and improve based on real usage.

Candidate features:
- SEO pages
- Performance optimization
- Accessibility audit
- Analytics review
- Public release notes
- Feedback form

Primary agents:
- DevOps / Publisher
- Product Manager
- QA Tester
- Data Engineer

Exit criteria:
- Founder approves public release.
- Deployment checklist passes.
- Feedback and analytics loop is active.

## Phase 7: Monetization and Advanced Data Use Cases

Goal:
Explore sustainable revenue and deeper analytics after product traction.

Candidate features:
- Premium analytics
- Classroom dashboards
- Team plans
- Data engineering case studies
- API or exports
- Sponsored content, if appropriate

Primary agents:
- Product Manager
- Data Engineer
- Architect
- Data Privacy / Safety Reviewer
- Founder

Exit criteria:
- Monetization is validated with users.
- Paid features do not damage free core experience.

## Current Priority Backlog

1. Founder review and approval of MVP scope proposal.
2. Define or approve working product name.
3. Interview or survey 5-10 potential users in the approved primary audience.
4. Compare free technology options.
5. Draft MVP page map and core user flow.
6. Define typing engine calculation rules.
7. Define local progress data shape and privacy notes.
8. Prepare implementation-ready Sprint 1 specifications after founder approval.
