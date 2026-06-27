# Typing Website Project Charter

Last updated: 2026-06-06

## Vision

Build a complete multi-page typing platform where learners, students, job seekers, writers, coders, and typing enthusiasts can learn, practice, test, play, track progress, and understand their typing data in one place.

## Mission

Create a practical typing website that combines:

- Structured learning
- Focused practice
- Timed typing tests
- Typing games
- Progress tracking
- Skill analytics
- Data engineering use cases
- Simple publishing and continuous improvement

## Founder Goal

The founder wants an organized, buildable product, not a random collection of pages. The project should move through research, planning, design, development, testing, review, publishing, and improvement.

## Target Users To Validate

Initial user groups to research:

- Beginners learning touch typing
- Students and teachers
- Job seekers preparing for typing tests
- Professionals who want faster daily typing
- Writers and note-takers
- Programmers practicing symbols, code, and commands
- Competitive typists who care about WPM, accuracy, and leaderboards
- Data learners who want real examples of event data and analytics

## Product Pillars

1. Learn: beginner lessons, finger placement, guided progression.
2. Practice: drills, weak keys, custom text, quotes, punctuation, numbers, code.
3. Test: timed tests, word-count tests, accuracy tests, certificates or result pages.
4. Play: typing games, challenges, races, streaks, achievements.
5. Track: progress history, personal bests, problem keys, session trends.
6. Analyze: dashboards, event data, exports, cohorts, skill insights.
7. Improve: recommendations based on user performance.

## Initial MVP Hypothesis

The first usable MVP should prove that users can:

1. Land on a clear multi-page typing platform.
2. Take a reliable typing test.
3. See WPM, accuracy, raw WPM, errors, and time.
4. Practice with at least one learning or drill mode.
5. Save local progress without requiring paid infrastructure.
6. Review basic analytics after a session.

## Scope

In scope:

- Multi-page website
- Typing test engine
- Practice modes
- Learning content
- Progress tracking
- Basic analytics
- Games roadmap
- Data model and event tracking plan
- Free/open-source technology evaluation
- Deployment plan

Out of scope for the first build phase:

- Paid subscriptions
- Real-money competitions
- Complex multiplayer
- School administration dashboards
- Sensitive student data collection
- Native mobile apps
- AI tutoring that requires paid APIs
- Enterprise-grade analytics stack

## Constraints

- Prefer free or open-source tools until the website earns money.
- Keep architecture understandable for a solo founder.
- Avoid collecting unnecessary personal data.
- Make the core typing experience fast and low-distraction.
- Design for keyboard-first interaction.
- Support responsive layouts.
- Keep progress useful even before accounts exist.
- Do not overbuild classroom, multiplayer, or monetization features before validation.

## Quality Bar

The site should be:

- Accurate: WPM, accuracy, and errors must be calculated consistently.
- Fast: typing input should feel immediate.
- Accessible: keyboard-first, readable contrast, clear focus states.
- Understandable: users should know what to do without reading a manual.
- Testable: calculation logic and key flows should have repeatable tests.
- Practical: each page should serve a real user workflow.

## Technology Principles

Initial preference:

- Static or lightweight frontend first.
- Local storage or simple database before complex backend.
- Open-source libraries where useful.
- Free hosting while traffic is small.
- Self-hostable analytics or privacy-friendly analytics.
- Avoid paid dependencies until there is revenue or clear founder approval.

Technology options to research before selection:

- Frontend: plain HTML/CSS/JS, React with Vite, Next.js, SvelteKit, Astro.
- Styling: CSS modules, Tailwind CSS, plain CSS variables.
- Backend: none at first, SQLite, PostgreSQL, Supabase, Firebase, PocketBase, Appwrite.
- Analytics: local event logs, Umami, PostHog Community, Plausible Community, custom dashboards.
- Hosting: GitHub Pages, Cloudflare Pages, Netlify, Vercel, Render, Railway, self-hosted VPS.
- Testing: Playwright, Vitest, Jest, Testing Library.

All free-tier claims must be verified before final technology approval because pricing and limits can change.

## Success Metrics

Product metrics to validate:

- Test completion rate
- Repeat practice sessions
- Average sessions per user
- Accuracy improvement over time
- WPM improvement over time
- Weak-key improvement
- Return usage after 1 day and 7 days
- Game replay rate
- Lesson completion rate

Engineering metrics:

- Page load speed
- Input latency
- Test pass rate
- Error-free deployment
- Accessibility issues found and fixed
- Data event completeness

## Phase Gates

Phase 0 can finish when:

- Core project documents exist.
- Competitor research plan exists.
- Initial product assumptions are listed.
- Technology research questions are listed.
- First sprint is defined.

Phase 1 can start when:

- Founder approves MVP scope.
- Typing engine requirements are clear.
- Architecture direction is selected.
- First page map and user flows are drafted.

## Founder Approval Needed Next

- Confirm primary audience for MVP.
- Confirm product name or temporary working name.
- Confirm whether the first version should be static/local-only or include accounts.
- Confirm tolerance for free hosted services with future paid tiers.

