# TypeFlow — Full-Stack Visual, Security & Cloud Upgrade Prompt
## "Make TypeFlow Look & Feel Premium — Fix Security, Go Cloud, Add Life"

> **Who this is for**: A senior full-stack engineer with expertise in:
> React + TypeScript animation systems, CSS design systems, security auditing,
> free-tier cloud databases (Supabase / Firebase / PocketBase), and premium UI/UX design.
>
> **Mandate**: Read every file in the TypeFlow codebase. Audit it for visual quality,
> animation gaps, security vulnerabilities, missing cloud sync, and UI polish gaps.
> Deliver a complete upgrade plan with code-level specifics so the app feels like a
> **premium SaaS product**, not a student project.

---

## 0. Full Codebase Read — Required Before Any Recommendation

Read and understand these files completely:

| File | Critical things to note |
|------|------------------------|
| `src/index.css` (649 lines) | CSS variable tokens, 3 themes, animation keyframes, existing `.card`, `.btn` classes |
| `src/App.css` (185 lines) | ⚠️ CONTAINS VITE BOILERPLATE (`.hero`, `#next-steps`, `#spacer`, `.ticks`) — dead code |
| `src/App.tsx` (335 lines) | Theme switching (dark/light/sepia), routing, header nav, footer |
| `src/components/Login.tsx` (682 lines) | ⚠️ CRITICAL SECURITY ISSUE — password handling |
| `src/components/Auth.tsx` | Auth state management |
| `src/components/Dashboard.tsx` | Entry point — first impression |
| `src/components/TypingTest.tsx` | Core typing UX — caret, character feedback |
| `src/components/Results.tsx` | Post-test display — animations? |
| `src/components/Learn.tsx` (836 lines) | Lesson UI — finger overlay, keyboard heatmap |
| `src/components/ProgressView.tsx` (482 lines) | Charts, heatmap, phase rings |
| `src/components/Curriculum.tsx` | Stage map display |
| `src/components/SettingsMenu.tsx` | Theme picker, sound toggle |
| `src/components/About.tsx` | Info page |
| `src/services/db.ts` (447 lines) | Dexie IndexedDB — local-only, no cloud sync |
| `src/services/analytics.ts` | Key heatmap, best WPM computation |
| `src/utils/typingEngine.ts` (222 lines) | WPM engine, keystroke log |
| `package.json` | Only 4 runtime dependencies: dexie, lucide-react, react, react-router-dom |

---

## 1. CRITICAL SECURITY AUDIT — Fix These First

### 🚨 Security Issue #1 — Passwords Stored in localStorage (CRITICAL)

**Location**: `src/components/Login.tsx`

The login form has a full sign-up flow collecting `username`, `email`, `password`, `age`, `gender`.
Audit every line for:
- Is the password being stored in `localStorage` or `IndexedDB` in plain text?
- Is there any actual authentication backend, or is it purely local mock logic?
- The `rememberMe` feature stores `typeflow_remembered_user` in localStorage — what is stored exactly?
- Is `signUpPassword` compared to stored data — if so, where is the stored data?

**Expected finding**: The login is a UI-only mock — no real auth backend exists.

**Required fixes**:
1. If passwords are stored locally (plain text or hashed) → REMOVE immediately. LocalStorage is not secure.
2. If auth is mocked → add a clear `DEMO / COMING SOON` banner instead of a fake login form
3. If real auth is needed → implement via Supabase Auth (free tier) — see §4 below
4. Remove all password fields from local storage regardless of encoding

### 🚨 Security Issue #2 — No Content Security Policy

**Location**: `index.html`

Check `index.html` for:
- CSP headers (`<meta http-equiv="Content-Security-Policy">`)
- Subresource Integrity (SRI) on any CDN-loaded assets
- Any `dangerouslySetInnerHTML` usage in components

**Required fix**: Add a strict CSP meta tag to `index.html`.

### 🚨 Security Issue #3 — Vite Configuration Exposes Source Maps

**Location**: `vite.config.ts`

Check if `sourcemap: true` is enabled for production builds. Source maps expose your entire
source code to anyone using browser devtools.

**Required fix**: Set `build: { sourcemap: false }` for production.

### 🚨 Security Issue #4 — Dead Code in App.css

**Location**: `src/App.css` (lines 20–184)

The file contains Vite scaffold boilerplate that was never cleaned up:
`.hero`, `#center`, `#next-steps`, `#docs`, `#spacer`, `.ticks`, `.framework`, `.vite`
None of these classes are used anywhere in the TypeFlow React components.

**Required fix**: Delete lines 20–184 from `App.css`. Keep only the `.counter` class if it's used.

### 🟡 Security Issue #5 — XSS Risk in Dynamic Text Rendering

Audit all components for any place where user-supplied text is rendered without sanitization.
Specifically check:
- The typing test word display (words come from static arrays — confirm no user input is rendered as HTML)
- Any `innerHTML` usage
- Any `eval()` or `Function()` constructor usage

---

## 2. FREE CLOUD DATABASE STRATEGY

### Current State
TypeFlow stores ALL data locally in IndexedDB via Dexie.js (`TypeFlowDB`):
- `tests` table: typing sessions
- `personalBests` table: WPM records
- `lessons` table: lesson completions
- `userStats` table: XP, level, streak, themes

**Problem**: Users lose all data if they clear browser storage. No cross-device sync. No account history.

### Recommended Free Cloud Stack

Research and recommend the BEST free option from this list for TypeFlow's needs:

| Option | Free Tier | Key Concern |
|--------|-----------|-------------|
| **Supabase** | 500MB DB, 50,000 MAU auth, unlimited API calls | ✅ Best choice — Postgres + Auth + Realtime |
| **Firebase (Firestore)** | 1GB storage, 50k reads/day, 20k writes/day | ⚠️ NoSQL, Google vendor lock-in |
| **PocketBase** | Self-hosted, free forever | ⚠️ Requires hosting (not truly free) |
| **Appwrite Cloud** | 75K MAU, 2GB storage | ✅ Good alternative, EU-hosted |
| **Neon (Postgres)** | 512MB, 10 projects | ✅ For DB-only (no auth) |
| **Turso (SQLite edge)** | 9GB, 500 DBs | ✅ Ultra-fast, edge-compatible |

**Recommendation to validate**:
Supabase is the recommended choice because:
1. Free tier covers ~10,000 users with zero cost
2. Built-in Auth (Google, GitHub, email/password)
3. Row Level Security (RLS) ensures users can only read their own data
4. TypeScript SDK (`@supabase/supabase-js`) is tiny (~50KB)
5. Real-time subscriptions for future multiplayer/leaderboard features

### Cloud Sync Architecture Design

Design a **hybrid sync model** — local-first with optional cloud backup:

```
Local IndexedDB (Dexie) ←→ Cloud (Supabase)
        ↑                           ↑
  Instant reads/writes        Background sync
  Works offline              Cross-device data
  No latency                 Account persistence
```

**Required deliverable**: Propose the exact Supabase schema (SQL):

```sql
-- Users table (managed by Supabase Auth)
-- sessions table
CREATE TABLE typing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  timestamp BIGINT NOT NULL,
  duration INTEGER NOT NULL,
  wpm DECIMAL(6,2) NOT NULL,
  raw_wpm DECIMAL(6,2) NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  errors_count INTEGER NOT NULL,
  words_count INTEGER NOT NULL,
  missed_words TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Row Level Security
ALTER TABLE typing_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own sessions"
  ON typing_sessions FOR ALL
  USING (auth.uid() = user_id);

-- [Design the rest: personal_bests, lesson_attempts, user_stats tables]
```

**Sync service to design** (`src/services/cloudSync.ts`):
```typescript
// Design this service — it should:
// 1. Check if user is authenticated (Supabase session)
// 2. On test completion: save to local Dexie first, then background-sync to Supabase
// 3. On login: pull cloud data and merge with local (handle conflicts by taking higher WPM)
// 4. Expose a useSyncStatus() hook for UI to show sync state
// 5. Work completely offline — never block the typing test for a network request
```

---

## 3. VISUAL DESIGN UPGRADE — Animations, Icons & Polish

### 3A. Animations Currently Missing (audit confirms these)

Research competitor animation standards (Monkeytype, Linear.app, Vercel dashboard) and implement:

#### Missing Animation #1 — Page Transition System
**Current state**: Pages switch instantly via React Router — no transition
**Fix**: Implement CSS `@keyframes fadeSlideIn` on `.main-content` on route change
```css
/* Add to index.css */
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.main-content {
  animation: pageEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```

#### Missing Animation #2 — WPM Counter Roll-Up on Results
**Current state**: Results page shows final WPM as a static number
**Fix**: Animate the number from 0 → final value using `requestAnimationFrame`
```typescript
// Implement in Results.tsx
function useCountUp(target: number, duration: number = 800): number {
  // requestAnimationFrame loop from 0 to target over `duration` ms
}
```

#### Missing Animation #3 — XP Bar Fill Animation
**Current state**: Level/XP badge is just text: "Level 3 (247 XP)"
**Fix**: Add an animated progress bar that fills on mount

#### Missing Animation #4 — Streak Fire Animation
**Current state**: Streak shows as text "🔥 3 Day Streak"
**Fix**: The 🔥 emoji should pulse/scale when streak is ≥ 3 days

#### Missing Animation #5 — Badge/Achievement Toast
**Current state**: No badge unlock animation exists
**Fix**: Sliding toast from bottom-right: "🏆 Badge Unlocked: Home Row Master" — 3s then fades

#### Missing Animation #6 — Keyboard Key Press Feedback (Learn page)
**Current state**: The `.kb-key` CSS has `transition` but check if the `pop` keyframe is actually applied on correct keypress in `Learn.tsx`
**Fix**: Apply `.kb-key-active` class momentarily (80ms) on the correct key when pressed

#### Missing Animation #7 — Typing Caret Smooth Movement
**Current state**: Caret (`caret-indicator`) jumps between characters
**Fix**: Add `transition: left 0.05s ease, top 0.05s ease` to `.caret-indicator`

#### Missing Animation #8 — Card Entry Stagger on Dashboard
**Current state**: All dashboard cards appear simultaneously
**Fix**: Stagger card appearance with CSS `animation-delay`

#### Missing Animation #9 — Confetti on 60 WPM First Achievement
**Current state**: Nothing special happens at 60 WPM
**Fix**: Pure CSS/JS confetti burst (no external library) — 50 colored divs with random trajectories

#### Missing Animation #10 — Loading Skeleton Shimmer
**Current state**: Progress page shows plain text "Loading your progress data..."
**Fix**: Animated skeleton cards with gradient shimmer while IndexedDB loads

### 3B. Icon Audit & Upgrades

**Current icon library**: Lucide React v1.17.0 (already installed)

Audit every page and list which Lucide icons are used. Then for each icon, answer:
- Is this the most expressive icon for the context?
- Is the size appropriate (16px for inline, 20px for buttons, 24px for headings)?
- Are icons missing where they would improve scannability?

**Pages that likely need icon additions** (audit to confirm):

| Page | Current State | Suggested Addition |
|------|------------|-------------------|
| Dashboard | Some icons | Add icon to each stat card (Zap for WPM, Target for accuracy, Clock for duration) |
| Navigation | Text-only tabs | Consider adding small icons to nav tabs (House, TestTube, Dumbbell, BookOpen, ChartBar) |
| Results | Confirm icon coverage | Add Trophy for PB, TrendingUp for improvement |
| Curriculum map | Confirm stage icons | Lock icon for locked stages, CheckCircle2 for completed, PlayCircle for available |
| Settings | Check coverage | Add specific icons for each setting row |
| Footer | No icons | Add GitHub icon + social links |

**Specific Lucide icons to use** (reference these exact names):
```
Zap, Target, Clock, Trophy, TrendingUp, TrendingDown, 
Lock, Unlock, CheckCircle2, PlayCircle, Circle,
Flame, Star, Medal, Crown, Sparkles, Rocket,
Github, Twitter, Globe, Heart,
ChartLine, ChartBar, Activity, Gauge,
KeyboardIcon, Type, Hash, AtSign,
Shield, ShieldCheck, ShieldAlert,
ArrowUpRight, ArrowRight, ChevronRight,
Wifi, WifiOff, CloudUpload, CloudCheck
```

### 3C. Theme System Upgrade

**Current themes**: Dark (default) · Light · Sepia

**Issues found**:
1. The theme toggle button cycles dark→light→sepia→dark — not intuitive
2. Theme is not persisted in localStorage (resets on page refresh)
3. Only 3 themes while the DB schema supports `unlockedThemes: string[]`

**Required deliverables**:

#### Fix #1 — Theme Persistence
```typescript
// In App.tsx — load saved theme on mount
useEffect(() => {
  const savedTheme = localStorage.getItem('typeflow_theme') as 'dark' | 'light' | 'sepia' | null;
  if (savedTheme) setTheme(savedTheme);
}, []);

// Save on change
useEffect(() => {
  localStorage.setItem('typeflow_theme', theme);
  // ... existing class/variable setting logic
}, [theme]);
```

#### Fix #2 — Theme Picker UI (replace single toggle button)
Replace the single cycling icon button with a 3-option theme picker in `SettingsMenu.tsx`:
```
[🌙 Dark] [☀️ Light] [📜 Sepia]
```
Or a visual color swatch row — 3 circles with the theme's primary background color.

#### Fix #3 — 5 New Unlockable Themes (design the CSS tokens for each)

Design and implement these additional themes that get unlocked via XP/badges:

| Theme ID | Name | Palette Description | Unlock Condition |
|----------|------|---------------------|-----------------|
| `theme-cyberpunk` | **Neon Cyberpunk** | Deep black bg, magenta/cyan accents, grid lines | Level 5 + 3-day streak |
| `theme-forest` | **Forest Grove** | Deep green bg, lime accents, earthy tones | Complete 25 lessons |
| `theme-ocean` | **Deep Ocean** | Navy bg, teal accents, wave-gradient cards | 60 WPM first time |
| `theme-retro` | **Retro Terminal** | Pure black bg, green phosphor text, monospace everything | Reach Level 10 |
| `theme-rose` | **Rose Gold** | Warm pink-beige bg, gold accents, soft shadows | 7-day streak |

For EACH theme, specify the complete CSS variable block:
```css
.theme-cyberpunk {
  color-scheme: dark;
  --bg: #060010;
  --bg-card: #0d0020;
  --border: #2d0060;
  --text: #f0f0ff;
  --text-dim: #c084fc;
  --text-muted: #7c3aed;
  --accent: #f0abfc;        /* magenta */
  --accent-hover: #e879f9;
  --accent-glow: rgba(240, 171, 252, 0.2);
  --success: #22d3ee;       /* cyan */
  --warning: #fb923c;
  --danger: #f43f5e;
  /* Also define grid background pattern */
  background-image: linear-gradient(rgba(45, 0, 96, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(45, 0, 96, 0.3) 1px, transparent 1px);
  background-size: 30px 30px;
}
/* [Design the remaining 4 themes] */
```

#### Fix #4 — System Theme Auto-Detect
```typescript
// Detect OS dark/light preference on first visit
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!savedTheme) setTheme(prefersDark ? 'dark' : 'light');
```

### 3D. Premium UI Upgrades (Component-by-Component)

#### Dashboard
- Replace plain text hero section with a **glassmorphism hero card** with gradient border
- Add **animated typing speed stat** that counts up from 0 when the dashboard loads
- The "Start Typing Test" button should have a subtle **pulse ring animation** to draw the eye
- Add a **"Today's Challenge"** card with a glow border

#### Header / Navigation
- Current nav is a pill-shaped row — upgrade with **active tab glowing underline** instead of filled pill
- Logo `TypeFlow` text should have a **subtle shimmer animation** on hover
- Add a `Wifi` / `WifiOff` icon to show cloud sync status (online/offline)
- Nav tabs should show **small badge dots** for unread achievements

#### Typing Test
- The word display area should have a **subtle frosted-glass background** (`backdrop-filter: blur(8px)`)
- Words that have been correctly typed should fade to `var(--success)` instead of plain `var(--text)`
- Add a **"ghost cursor"** effect — a faint trailing blur behind the caret
- The timer countdown should **pulse red** in the last 10 seconds

#### Results Page
- All numbers (WPM, accuracy, errors) should **count up from 0** on page entry
- Add **confetti** for any result ≥ 60 WPM
- Add a **comparison indicator** vs personal best: `↑ +12 WPM vs your best`

#### Learn / Lesson Page
- The virtual keyboard should have **3D key press effect** (CSS `transform: translateY(2px)`) on keypress
- Show a **finger guide color legend** (Left Pinky = Rose, Left Ring = Orange, etc.) in a compact strip
- Correct keypress: `box-shadow: 0 0 12px var(--success)` flash on the key
- Error: `background: var(--danger-bg)` + shake animation on the lesson text area

#### Progress Page
- The bar chart is currently `maxHeight: 100px` (hardcoded) — replace with **SVG polyline chart**
- Phase completion rings should **animate filling** on page load (CSS `stroke-dashoffset` transition)
- Add a **"Your best week"** insight card (auto-computed from session history)

#### Footer
- Current footer is just copyright text
- Upgrade to 3-column footer: Brand · Quick Links · Status (sync indicator)

---

## 4. PREMIUM LOOK & FEEL — Make It NOT Feel Like a Basic Website

### What "Basic Website" Means for TypeFlow (Fix All of These)

After researching Monkeytype, Linear.app, Vercel Dashboard, and Duolingo — here are the specific
signals that make TypeFlow feel like a student project:

| Signal | Current Issue | Premium Fix |
|--------|--------------|-------------|
| **Background** | Flat `#0b0f19` dark color | Add subtle radial gradient or noise texture |
| **Card borders** | Uniform `1px solid var(--border)` | Add gradient borders on featured cards |
| **Typography scale** | Single font size for body text | Establish clear typographic scale (xs/sm/base/lg/xl/2xl) |
| **Spacing** | Mixed hardcoded px + rem values | Enforce 8-point spacing grid throughout |
| **Button hover** | Simple color change | Add `box-shadow` glow on primary buttons |
| **Empty states** | Plain text messages | Illustrated empty states with actionable CTAs |
| **Loading states** | Plain "Loading..." text | Skeleton shimmer cards |
| **Scroll behavior** | Default | Add `scroll-behavior: smooth` globally |
| **Selection color** | Browser default (blue) | `::selection { background: var(--accent-glow); }` |
| **Focus rings** | `:focus-visible` exists but may be inconsistent | Audit every interactive element |
| **App.css bloat** | Contains dead Vite scaffold code | Delete lines 20–184 completely |

### Premium Design Tokens to Add

Add these missing CSS variables to `:root` in `index.css`:

```css
:root {
  /* Missing tokens to add */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 20px var(--accent-glow);

  --transition-fast: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-base: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
}
```

### Glassmorphism Card Variant

```css
/* Add to index.css */
.card-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
}

/* Gradient border card */
.card-gradient-border {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
}
.card-gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--accent), transparent 60%);
  z-index: -1;
}
```

### Background Texture

```css
/* Add to body in index.css */
body {
  background-color: var(--bg);
  background-image: radial-gradient(
    ellipse 80% 50% at 50% -20%,
    rgba(14, 165, 233, 0.08),
    transparent
  );
}
```

---

## 5. ACCESSIBILITY & PERFORMANCE AUDIT

### Accessibility Issues to Find and Fix

- [ ] All images/SVGs have `alt` attributes
- [ ] All interactive elements have unique `id` attributes
- [ ] Color contrast ratio ≥ 4.5:1 for all text (use browser devtools to check)
- [ ] No information conveyed by color alone (heatmap keys — do they have text labels?)
- [ ] Keyboard navigation: can you Tab through the entire app without a mouse?
- [ ] ARIA roles on the nav, header, main, footer elements
- [ ] `role="progressbar"` + `aria-valuenow` on XP bar and phase rings
- [ ] Screen reader text for the emoji-based streak/badge displays
- [ ] The typing test — can it be started with keyboard only (no mouse click required)?

### Performance Issues to Find and Fix

- [ ] Are Google Fonts loaded with `display=swap`? (check `index.html`)
- [ ] Is `Inter` + `Outfit` being loaded — if not, these fonts aren't rendering as intended
- [ ] The `generateCurriculum()` function in `lessonsData.ts` runs on module load — should it be memoized?
- [ ] `ProgressView.tsx` loads ALL test history from IndexedDB on mount — should be paginated
- [ ] Are any components doing expensive re-renders on every keystroke? (Typing test is performance-critical)

---

## 6. MARKET RESEARCH REQUIRED

Before designing any visual improvement, research these specific questions:

### 6A. Animation Benchmarks
- What animations does **Monkeytype** use on its results screen? (WPM counter? Chart animation?)
- What does **Duolingo's** lesson completion animation look like? (the character celebration, the XP bar fill)
- What does **Linear.app's** page transition feel like? (their brand standard for SaaS polish)
- What animations does **Vercel's dashboard** use for data loading? (skeleton cards?)

### 6B. Theme/Visual Benchmarks
- Does **Monkeytype** support custom themes? How many built-in themes? (reportedly 100+)
- What is **Keybr's** visual style — minimalist, dark, what fonts?
- What does **NitroType's** UI look like — how do they use game-like visuals without feeling cheap?

### 6C. Free Cloud DB Benchmarks
- What database does **Monkeytype** use for user accounts? (They are open source — check GitHub)
- What does **TypingClub** use for school account management?
- Has any typing platform successfully implemented Supabase? Any case studies?

### 6D. Icon Standards
- What icon library does **Monkeytype** use? (check GitHub source)
- What icon size standards does **Linear.app** use? (their design system is public)

---

## 7. DELIVERABLE FORMAT

Return your findings as this structured document:

```markdown
# TypeFlow — Visual, Security & Cloud Audit Report
## Date: [date]

## 🚨 Critical Security Fixes (P0 — Fix Before Anything Else)
  Table: Issue | File | Line | Severity | Fix

## ☁️ Cloud Database Recommendation
  - Chosen provider + justification
  - Complete Supabase schema (SQL, ready to run)
  - cloudSync.ts service design (TypeScript interfaces + pseudocode)
  - Migration plan: local-only → hybrid local+cloud

## 🎨 Animation Implementation Plan
  - Each animation: name, file to edit, CSS/TS code snippet, effort estimate

## 🖼️ Icon Additions
  - Per-page icon audit table: page | current icons | missing icons | Lucide name

## 🎨 Theme System Upgrade
  - Complete CSS for 5 new themes (every variable)
  - Theme persistence fix (code)
  - Theme picker UI component

## 💎 Premium UI Upgrades (Component-by-Component)
  - Per component: current state | specific fix | code snippet | effort

## ♿ Accessibility Fixes
  - Checklist with file + line references for each issue

## ⚡ Performance Fixes
  - Each optimization with before/after impact estimate

## 📋 Implementation Priority
  P0 (security, this week) | P1 (cloud + animations, 2 weeks) | P2 (themes + polish, 1 month)

## ❓ Open Questions for TypeFlow Founder
  - Do you want Supabase Auth or keep local-only with optional sign-in?
  - Which new themes should be implemented first?
  - Should the social auth (Google/GitHub) be wired to Supabase or remain a mock?
```

Each code change MUST include:
- Exact file path and line number range being modified
- Complete TypeScript/CSS snippet (not pseudocode)
- Effort estimate: `XS` (< 30min) · `S` (30min–2h) · `M` (2–6h) · `L` (1–2 days) · `XL` (3+ days)

---

## 8. NON-NEGOTIABLE CONSTRAINTS

- **No paid services** — Supabase free tier only. Verify the free tier limits before recommending.
- **No breaking changes** to the existing Dexie schema (v1–v3). Cloud sync is additive.
- **No new npm packages** unless absolutely necessary and under 30KB gzip.
  - Exception: `@supabase/supabase-js` (~50KB) is approved for cloud sync
  - Exception: A confetti library ONLY if it's < 5KB and pure CSS/JS
- **TypeScript strict mode** must remain passing — no `any` without justification
- **The app must work 100% offline** — cloud sync is enhancement, not requirement
- **Existing CSS variable token names must not change** (components reference them everywhere)
  - Only ADD new tokens, never rename or remove existing ones
- **Mobile responsiveness must be maintained** — test every change at 375px viewport width
- **The typing engine must not be touched** for visual changes — keep `typingEngine.ts` pure
- **Google Fonts** (`Inter` + `Outfit`) are already declared in CSS — confirm they are loaded in `index.html`

---

## 9. QUICK WINS (Implement These First — Under 30 Minutes Each)

After your full audit, identify and implement these immediately:

1. **Delete dead code** in `App.css` lines 20–184 (Vite boilerplate)
2. **Add theme persistence** to `localStorage` in `App.tsx`
3. **Add `scroll-behavior: smooth`** to `html` in `index.css`
4. **Add `::selection` styling** matching the accent colour
5. **Add `font-display: swap`** to Google Fonts import (check `index.html`)
6. **Fix the CSP meta tag** in `index.html`
7. **Add `aria-label`** to every icon-only button (they only have `title` attributes currently)
8. **Add background gradient** to `body` (subtle radial glow from top)
9. **Add `sourcemap: false`** to `vite.config.ts` for production
10. **Add `<meta name="theme-color">** to `index.html` for mobile browser chrome colouring

---

*This prompt was created for TypeFlow — codebase at `src/`, React 19 + TypeScript + Vite + Dexie.js.*
*Stack: React Router v7, Lucide React v1.17, Vitest, Playwright.*
*Current runtime dependencies: dexie, lucide-react, react, react-dom, react-router-dom (5 packages).*
*Date: June 2026.*
