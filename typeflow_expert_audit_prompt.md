# TypeFlow — Expert Senior Engineer Audit Prompt

> **Audience**: Senior full-stack product engineer / growth-hacker with 8+ years of experience
> building high-retention EdTech / SaaS platforms (Duolingo, Monkeytype-level polish).
>
> **Task**: Perform a complete 360° audit of the TypeFlow codebase, conduct competitive market
> research, identify critical UX loopholes and engine gaps, and deliver next-level, production-ready
> improvement proposals — with a primary focus on the **Progress section** (space-efficiency,
> information density, and visual quality) and the **typing engine** (accuracy, latency, adaptivity).

---

## 0. Context — What TypeFlow Is

TypeFlow is a **local-first, no-account typing improvement platform** built with:
- **Stack**: React 18 + TypeScript + Vite
- **Persistence**: Dexie.js → IndexedDB (v3 schema: `tests`, `personalBests`, `lessons`, `userStats`)
- **Pages**: Dashboard · TypingTest · Practice · Learn (35-stage curriculum) · ProgressView · Results · About
- **Engine**: Custom `typingEngine.ts` in `src/utils/` — handles WPM, rawWPM, accuracy, keystroke logging
- **Gamification** (partial): XP formula `round(WPM × (acc/100)² × dur/10)`, level-up via `√(xp/100)+1`,
  daily streaks, theme unlocks — all stored locally
- **Analytics**: `computeKeyAccuracyHeatmap()` + `getBestWpmPerDuration()` in `src/services/analytics.ts`

Existing documentation:
- `PROJECT_CHARTER.md` — vision, audience, constraints
- `ROADMAP.md` — 7-phase plan (Phase 0–6 defined)
- `COMPETITOR_RESEARCH.md` — Monkeytype, Keybr, Typing.com benchmarked
- `typeflow_product_enhancement_blueprint.md` — previous enhancement pass (gamification, themes, cadence latency)
- `curriculum_design.md` — 35-stage curriculum logic

---

## 1. Your Research Mandate

### 1A. Deep Codebase Read (Required — Do Not Skip)
Read **every** source file before forming opinions:

| File | What to look for |
|------|-----------------|
| `src/components/ProgressView.tsx` (482 lines) | Space waste, missing metrics, chart primitives, data density |
| `src/components/TypingTest.tsx` | Engine integration, event loop, timing accuracy |
| `src/components/Learn.tsx` | Lesson state machine, graduation gating |
| `src/components/Dashboard.tsx` | Entry-point funnels, call-to-action gaps |
| `src/services/db.ts` | Schema gaps, missing indices, query performance |
| `src/services/analytics.ts` | What's tracked vs. what's missing |
| `src/utils/typingEngine.ts` | WPM calculation correctness, keystroke timing, error classification |
| `src/utils/lessonsData.ts` | Lesson corpus quality, phase balance |
| `src/index.css` + `src/App.css` | CSS variables, design token gaps, animation catalogue |
| `package.json` | Missing libraries that could unlock features cheaply |

### 1B. Competitor Market Research (Required)
Cross-check TypeFlow against the following platforms. For each, note:
- What the **Progress/Analytics section** looks like (information architecture, chart types used, space efficiency)
- Any **retention mechanic** that TypeFlow currently lacks
- Any **engine-level** differentiation that TypeFlow should copy or leapfrog

| Competitor | URL | Focus Area |
|-----------|-----|------------|
| Monkeytype | monkeytype.com | Chart density, per-second WPM graph, consistency score |
| Keybr | keybr.com | Adaptive algorithm, key-speed histogram, practice generation |
| TypeRush | typerush.net | Gamification, leaderboard hooks |
| 10FastFingers | 10fastfingers.com | High-score sharing, word-accuracy breakdown |
| Ratatype | ratatype.com | Progress dashboard, certificate system |
| NitroType | nitrotype.com | Retention mechanic: daily car upgrades, team leagues |
| Duolingo (reference) | duolingo.com | Streak UI, XP bar, hearts system — gold standard for retention loops |

---

## 2. Gap Analysis Framework

For each area below, you must deliver a **Before / After** table with:
- Current behaviour (cite the exact file + line number)
- The specific loophole or missed opportunity
- Severity: `P0 Critical` | `P1 High` | `P2 Medium` | `P3 Low`
- A concrete fix (code outline or algorithm description)

### 2A. Progress Section — Space & Information Density
The current `ProgressView.tsx` uses **482 lines** to render:
1. Level + streak badge
2. 3 high-score cards (15s / 30s / 60s)
3. A naive bar chart (last 10 sessions — `maxWpm 100px`)
4. A static 27-key heatmap
5. A 5-column curriculum phase ring grid
6. A 5-row recent sessions table
7. Data export / reset controls

**You must answer**: Can this same (or richer) information fit in **≤60% of current vertical space** without sacrificing clarity? Propose the exact layout refactor with grid / flexbox specs.

Questions to answer while auditing:
- Why does the bar chart have `maxHeight: 100px` hard-coded? Is this a rendering bug on tall viewports?
- The heatmap covers only 27 alpha keys — where are numbers, punctuation, `Space`, `Backspace`, `Shift`?
- Curriculum phase rings show `0 of N completed` but have no estimated time-to-complete — why not?
- The sessions table shows only 5 rows with no pagination or filter — when does it become useless?
- Level and streak live in a header badge — are they motivating enough or are they noise?
- There is zero **trend arrow** (↑↓) on WPM — the user cannot see if they are improving at a glance.

### 2B. Engine Accuracy & Timing Gaps
Audit `typingEngine.ts` against the Monkeytype measurement standard:

- **Standard WPM formula**: `(correct_chars / 5) / elapsed_minutes` — confirm TypeFlow matches this
- **Raw WPM**: should include corrected characters — confirm implementation
- **Per-second WPM graph data**: does the engine emit per-second snapshots? (Monkeytype does, TypeFlow appears not to)
- **Consistency Score**: `stddev(per_second_wpm) / mean_wpm * 100` — is this computed anywhere?
- **Keystroke latency log**: `KeystrokeEvent[]` is stored — is the bigram (key-transition) latency indexed and exposed in analytics?
- **Error classification**: does the engine distinguish between *substitution* (wrong key), *insertion* (extra key), *omission* (missed key)? This matters for adaptive drills.
- **Backspace penalty model**: currently users must backspace errors — does this penalise rawWPM correctly?

### 2C. Adaptive Learning Engine Gaps
The 35-lesson curriculum graduates on `errorCount < 2` or similar — check the exact gate in `Learn.tsx`.

- Does the engine know *which specific bigrams* a learner is slow on (not just which keys)?
- After a test in `TypingTest.tsx`, does the system route the user to a targeted practice drill for their worst key? (Blueprint suggests it should — is it wired up?)
- Is lesson selection ever re-ordered based on historical accuracy, or is it always sequential?
- Does the Practice page receive the actual `missedWords` array from the last session, or does it use a fresh random set?

### 2D. Retention & Engagement Loops
Inventory the current retention hooks:
- Daily streak (stored in `userStats.currentStreak`) — **is it displayed prominently on the Dashboard?**
- XP / Level — is there a visual XP progress bar to next level, or just a number?
- Theme unlocks — are they actually functional (CSS class switching) or placeholder?
- Daily challenge — exists in roadmap Phase 4, not yet built — is there a quick-win version possible now?
- Notifications / reminders — zero browser Notification API usage currently — is this intentional?

### 2E. UI/Visual Quality Gap vs. Competitors
Monkeytype standard checklist — confirm TypeFlow has:
- [ ] Smooth animated caret (TypeFlow has static `|` caret — confirm)
- [ ] Per-character colour transition on correct/incorrect (not just static class swap)
- [ ] Word-level highlight or underline on current word
- [ ] Animated result screen (number counters rolling up on completion)
- [ ] Responsive chart with hover tooltip (TypeFlow bar chart has `title` tooltip only)
- [ ] Dark/light/custom theme switcher that persists across sessions
- [ ] Keyboard shortcut cheatsheet visible at a glance

---

## 3. Progress Section Redesign Brief

Based on your gap analysis, deliver a **complete redesign specification** for `ProgressView.tsx`:

### 3A. Layout Architecture
Propose a new layout that achieves **higher information density in less vertical space**. You must:
1. Combine the level badge, streak, XP bar, and WPM best into a single **hero stats strip** (one row, full width, 5-6 KPI chips)
2. Replace the 3 separate high-score cards with a **compact best-score row** or a side-by-side inline display
3. Upgrade the bar chart to a **dual-axis sparkline**: WPM line + accuracy line overlay (no external library — pure SVG)
4. Expand the keyboard heatmap to include **number row + punctuation + spacebar** (full 47-key layout)
5. Collapse the curriculum phase rings into a **horizontal progress rail** with phase names + percentage inline
6. Replace the sessions table with a **virtualised compact log** (show 10 rows, colour-coded by performance tier)
7. Keep data controls in a **collapsible "Data & Privacy" accordion** (hidden by default)

### 3B. New Metrics to Surface
Add these computed analytics that are not currently displayed:
- **Consistency Score** `%` (stddev-based — see §2B)
- **Average session duration** across all tests
- **Improvement rate**: WPM delta between first 5 sessions and last 5 sessions
- **Worst bigram**: the key-pair with the highest average latency (requires cadence data from engine)
- **Practice suggestion chip**: "Your weakest key is `P` — [Start Drill →]" — a CTA derived from heatmap data

### 3C. Visual Upgrade Specification
For the redesigned Progress section:
- Use **CSS Grid subgrid** or **auto-fill columns** to make the layout fluid without fixed breakpoints
- Add **micro-animations**: stat counters animate from 0 on mount; ring fills animate; bar chart columns grow upward
- The heatmap keys should show **a numeric accuracy tooltip on hover**, not just a title attribute
- Apply a **gradient shimmer** loading skeleton while data loads from IndexedDB (replace current plain text loader)
- Colour palette should follow the existing CSS variable system (`--accent`, `--success`, `--warning`, `--danger`)

---

## 4. Engine Improvement Proposals

Based on your audit of `typingEngine.ts`, deliver:

### 4A. Per-Second Snapshot Emitter
Add a per-second WPM snapshot system so the chart can show speed over time during a test:

```typescript
// Proposed interface addition to typingEngine.ts
export interface WpmSnapshot {
  elapsedSeconds: number;
  wpm: number;
  accuracy: number;
}
// Engine should emit a new snapshot every 1000ms via setInterval
// Stored as wpmTimeline: WpmSnapshot[] in the session record
```

### 4B. Consistency Score Calculation
Add to `src/services/analytics.ts`:

```typescript
export function computeConsistencyScore(timeline: WpmSnapshot[]): number {
  if (timeline.length < 2) return 100;
  const wpmValues = timeline.map(s => s.wpm);
  const mean = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;
  const variance = wpmValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / wpmValues.length;
  const stdDev = Math.sqrt(variance);
  // Consistency = 100 - coefficient_of_variation
  return Math.max(0, Math.round(100 - (stdDev / mean) * 100));
}
```

### 4C. Bigram Latency Heatmap
The `keystrokeLog: KeystrokeEvent[]` already stores individual key timestamps. Propose the exact
algorithm to derive bigram latency from this array and expose it in `analytics.ts` as
`computeBigramLatencyMap(log: KeystrokeEvent[]): Record<string, number>`.

### 4D. Error Classification Taxonomy
Current engine logs errors as a count. Propose upgrading to:
```typescript
export type ErrorType = 'substitution' | 'insertion' | 'omission' | 'transposition';
export interface ClassifiedError {
  index: number;        // character position in source text
  expected: string;
  typed: string;
  errorType: ErrorType;
  timestamp: number;
}
```
Explain how this feeds the adaptive drill generator: substitution errors → same-finger neighbour drills,
transpositions → bigram reversal drills, omissions → hand-alternation drills.

---

## 5. Market Differentiation Recommendations

After reviewing competitors, answer:

1. **What is the single feature that would most differentiate TypeFlow** from Monkeytype (which already wins on raw speed testing)?
2. **What is the Duolingo-equivalent "hearts" mechanism** TypeFlow could implement in its curriculum to increase lesson completion without frustrating learners?
3. **What local-first feature** exists nowhere in the competitor landscape that TypeFlow could own as a USP (e.g., offline-capable, zero-telemetry adaptive drills)?
4. **What is the fastest path to first-time user "aha moment"** — the moment a new visitor understands TypeFlow's value? Is the current Dashboard page achieving this within 10 seconds?
5. **Which two competitors' Progress sections** should TypeFlow most closely study and why?

---

## 6. Deliverable Format

Return your findings as a structured markdown document with the following sections:

```
# TypeFlow Expert Audit — [Date]

## Executive Summary (≤200 words)
## Critical Gaps (P0–P1 items only, tabular)
## Progress Section — Before/After Layout Spec
## Engine Gap Analysis & Fix Specs
## Market Research Findings (5 answers from §5)
## Prioritised Implementation Backlog (ordered by ROI)
## Open Questions for the Founder
```

Each proposed code change must:
- Reference the exact file and line number being changed
- Include a minimal working TypeScript/TSX/CSS snippet (not pseudocode)
- Estimate implementation effort: `XS` (< 1h) · `S` (1–3h) · `M` (3–8h) · `L` (1–3 days) · `XL` (3+ days)

---

## 7. Constraints (Do Not Violate)

- **No new npm dependencies** unless the benefit is extraordinary and the package is < 20 KB gzip
- **No backend / cloud services** — all features must work offline via IndexedDB
- **No breaking changes** to the existing DB schema versions 1–3; propose version 4 as an additive migration
- **TypeScript strict mode** must remain satisfied — no `any` casts without justification
- CSS changes must use the existing design token variables (`--accent`, `--bg`, `--border`, etc.)
- The XP / level / streak system already exists in `db.ts` — **do not reinvent it, extend it**
- Progress section redesign must remain **a single page component** — no new routes

---

*This prompt was prepared for the TypeFlow project at commit state: June 2026.*
*Codebase location: `src/` — React + TypeScript + Vite + Dexie.js + Lucide React icons.*
