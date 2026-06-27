# TypeFlow – Developer Action Plan (Derived from Expert Audit Prompt)

## Overview
This document translates the **TypeFlow Expert Senior Engineer Audit Prompt** into concrete, actionable code changes for the development team. It prioritises improvements that deliver the highest impact on user experience, performance, and market differentiation while respecting the project constraints.

---

## 1. Progress Section Redesign (`src/components/ProgressView.tsx`)
### 1.1 Layout Refactor
- **Goal**: Reduce vertical footprint to ≤ 60 % of current height.
- **Change**: Collapse level badge, streak, XP bar, and best‑WPM chips into a single *hero stats strip* (flex row, evenly spaced chips).
- **Implementation**:
  - Introduce a `HeroStats` sub‑component with CSS Grid `grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));`.
  - Replace three high‑score cards with a compact `BestScoresRow` (inline chips).
  - Convert the bar chart to a **dual‑axis sparkline** using pure SVG (no external libs).
  - Expand the keyboard heatmap to a full 47‑key layout (including numbers, punctuation, space, backspace).
  - Collapse phase rings into a horizontal progress rail (`flex` with `gap: 0.5rem`).
  - Replace the sessions table with a virtualised list (e.g., `react-window`) showing 10 rows, colour‑coded by performance tier.
  - Wrap data/export controls in a collapsible **Data & Privacy** accordion.

### 1.2 New Metrics
- Add **Consistency Score**, **Average Session Duration**, **Improvement Rate**, **Worst Bigram**, and a **Practice Suggestion Chip**.
- Compute these in `src/services/analytics.ts` and expose via a new hook `useProgressMetrics`.

### 1.3 Visual Enhancements
- Use CSS sub‑grid for fluid layout; micro‑animations on counters and ring fills.
- Add tooltip with numeric accuracy on heatmap keys (use `title` attribute or custom tooltip component).
- Implement a gradient shimmer skeleton while data loads.

### 1.4 Effort Estimate
- **XS** – Refactor layout skeleton, CSS updates.
- **S** – Implement hero stats strip & best‑scores row.
- **M** – Dual‑axis sparkline, virtualised session list, heatmap expansion.
- **L** – New metrics calculations, practice suggestion integration.

---

## 2. Typing Engine Enhancements (`src/utils/typingEngine.ts`)
### 2.1 Per‑Second Snapshot Emitter
- Add `WpmSnapshot` interface and an internal `setInterval` that pushes snapshots to `session.wpmTimeline` every 1000 ms.
- Export `onSnapshot` callback for UI consumption.

### 2.2 Consistency Score
- Implement `computeConsistencyScore` in `src/services/analytics.ts` (see prompt for reference implementation).
- Store the score in the session record for display in the Progress view.

### 2.3 Bigram Latency Heatmap
- Add `computeBigramLatencyMap(log: KeystrokeEvent[])` returning `Record<string, number>`.
- Use this map to render the extended keyboard heatmap and the **Worst Bigram** metric.

### 2.4 Error Classification Taxonomy
- Replace generic error count with `ClassifiedError` (substitution, insertion, omission, transposition).
- Update engine event logger to emit `ClassifiedError` objects.
- Propagate classification to analytics for adaptive drill generation.

### 2.5 Effort Estimate
- **S** – Snapshot emitter and interface.
- **M** – Consistency score function and DB schema update.
- **M** – Bigram latency algorithm.
- **L** – Full error classification integration.

---

## 3. Analytics Service (`src/services/analytics.ts`)
- Add functions:
  - `computeConsistencyScore`
  - `computeBigramLatencyMap`
  - `computeImprovementRate`
  - `computeAverageSessionDuration`
- Ensure all new metrics are stored in IndexedDB (extend schema version 4, additive migration only).
- Export a unified `useProgressMetrics` hook for UI consumption.
- **Effort**: **S** for each new function, **M** for schema migration.

---

## 4. UI/UX Polish
### 4.1 Animated Caret & Per‑Character Colour Transition
- Replace static caret (`|`) with an animated CSS caret (`animation: blink 1s steps(2) infinite`).
- Apply per‑character colour transition on correct/incorrect input using CSS `transition`.

### 4.2 Result Screen Animations
- Implement number counters that roll up using `requestAnimationFrame`.
- Add confetti animation on session completion (`canvas` based, < 15 KB).

### 4.3 Dark/Light Theme Persistence
- Ensure theme selection persists via IndexedDB (`userPrefs.theme`).
- Add CSS variables for dark mode (`--bg-dark`, `--accent-dark`).

### 4.4 Keyboard Shortcut Cheat‑Sheet
- Add a floating tooltip component reachable via `?` key, listing all shortcuts.

### 4.5 Effort Estimate
- **S** – Caret animation and colour transition.
- **M** – Result screen counters and confetti.
- **S** – Theme persistence.
- **S** – Cheat‑sheet component.

---

## 5. Retention & Engagement Hooks
- **Daily Challenge Quick‑Win**: Add a simple “Daily 30‑second sprint” on the Dashboard that awards XP.
- **Notification API**: Prompt users (once) to enable browser notifications for streak reminders.
- **Effort**: **XS** for daily challenge UI, **S** for notification permission flow.

---

## 6. Dependency & Constraint Checklist
- No new npm packages are introduced (all new UI components use vanilla React & CSS).
- All feature additions are offline‑first; data stored locally.
- DB schema changes are additive (version 4) and maintain backward compatibility.
- TypeScript strict mode is respected; explicit types are added for new interfaces.
- CSS changes use existing design token variables (`--accent`, `--bg`, `--border`, etc.).

---

## 7. Prioritised Implementation Backlog (ROI Order)
| Priority | Area | Change | Effort |
|---|---|---|---|
| 1 | Progress UI | Hero stats strip & compact layout | XS‑S |
| 2 | Engine | Per‑second snapshot & consistency score | S‑M |
| 3 | Analytics | New metric functions & DB migration | S‑M |
| 4 | UI Polish | Animated caret, colour transitions, result roll‑up | S‑M |
| 5 | Retention | Daily challenge UI, notification prompt | XS‑S |
| 6 | Engine | Bigram latency heatmap & error classification | M‑L |
| 7 | Progress UI | Virtualised session list, expanded heatmap | M‑L |

---

## 8. Open Questions for the Founder
- **Feature Scope**: Recommend triggering the *Worst Bigram* drill **on demand** (via a suggestion chip) rather than automatically after every session. This respects user flow, avoids fatigue, and aligns with best‑practice adaptive learning patterns.
- **Design Preference**: Adopt a **dark‑mode‑first** visual language (Neo‑brutalism aesthetic) with a high‑contrast palette, while providing a light‑mode toggle for user preference. Dark‑mode first matches current market trends for typing apps and reduces eye strain.
- **Release Cadence**: Proceed with a **single‑release rollout** as specified.

---

*Prepared from the expert audit prompt (June 2026). Use this as the concrete development brief for the next sprint.*
