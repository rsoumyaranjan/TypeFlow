# TypeFlow V1 Release Notes

**Version**: 1.0.0  
**Release Date**: Pending QA sign-off  
**Branch**: `test` → `main` after QA approval  
**Deployed To**: Cloudflare Pages (free tier)

---

## What's Included in V1

### Pages Delivered
- **Dashboard** — Onboarding diagnostic (10-finger touch-typing question), compact 2/3 + 1/3 grid layout, personal bests, weak-key drill recommendation, keyboard shortcuts reference.
- **Typing Test** — Timed test with 15s / 30s / 60s presets. Live caret, correct/error coloring, blur-to-pause overlay, Tab+Enter to restart.
- **Results** — WPM, Raw WPM, Accuracy, Errors, Duration display. Recommended next practice action based on session data.
- **Practice** — Drill mode pre-loaded with missed words or weak keys from the latest session.
- **Learn** — 3-lesson interactive touch-typing course (Home Row, Index Extensions, Ring & Pinky) with a color-coded virtual keyboard guide. Lessons auto-save to IndexedDB on completion.
- **Progress** — Personal bests per duration, key accuracy heatmap, lesson curriculum checklist, session history table, export/import/reset data controls.
- **About** — Plain-language explanations of WPM formula, local-first privacy posture, and data clearing steps.

### Engine Features
- TypingEngine class with WPM, Raw WPM, Accuracy, keystroke event logging, backspace boundary enforcement.
- All calculations unit-tested (26/26 tests passing).

### Data & Privacy
- Local-first: all data stored in **IndexedDB** (Dexie.js v2 schema) — no server, no tracking.
- Export as JSON backup / Import from JSON backup / Reset & Delete database (Right to Be Forgotten).
- `localStorage` used only for onboarding preference (`typeflow_touchtype_status`).

### Themes
- Dark mode (default), Light mode, Sepia mode — cycled via the theme icon in the header.

### Routing
- React Router BrowserRouter with clean URLs (`/test`, `/learn`, `/progress`, etc.).
- `public/_redirects` ensures static hosting handles direct URL access without 404s.

### SEO
- Per-route dynamic `<title>` and `<meta name="description">` updates on navigation.

---

## Deployment Instructions (Cloudflare Pages)

1. **Connect GitHub repo** to Cloudflare Pages:
   - Go to [Cloudflare Pages Dashboard](https://pages.cloudflare.com/)
   - Click **Create Application** → **Connect to Git** → select `rsoumyaranjan/TypeFlow`
   - Select branch: **`main`**

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `18` (or `20`)

3. **Deploy** — Cloudflare will auto-build on every push to `main`.

4. **Verify routing** — Navigate to `/test` and refresh. Should load correctly (not 404).

---

## Known Limitations (V1)

- No user accounts or cloud sync — all data is browser-local.
- No multiplayer or leaderboards.
- Mobile typing test shows a warning banner (physical keyboard recommended).
- SEO meta tags are client-rendered — search engine crawlers that execute JavaScript will index correctly; static crawlers will see the base `index.html` description.

---

## Release Gate Checklist (QA Sign-Off Required)

- [ ] `npm run test` — 26/26 tests passing on `test` branch
- [ ] Onboarding flow tested (all 3 answers)
- [ ] Core typing loop tested (test → results → practice)
- [ ] Learn page lesson saving verified in IndexedDB
- [ ] Progress page checklist confirmed
- [ ] All 3 themes cycle correctly
- [ ] Page refresh on all routes — no 404s
- [ ] Browser tab titles correct per page
- [ ] Data export / import / reset verified
- [ ] Accessibility: keyboard focus and aria-labels spot-checked
- [ ] QA Tester formal approval issued
- [ ] Founder final approval
- [ ] `test` branch merged to `main`
- [ ] Cloudflare Pages deployment triggered
