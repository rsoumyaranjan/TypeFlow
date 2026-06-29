# TypeFlow — Visual, Security & Cloud Upgrade: Developer Implementation Plan

> **Source Prompt**: [`typeflow_visual_security_cloud_prompt.md`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/typeflow_visual_security_cloud_prompt.md)
> **Codebase Audit Date**: June 29, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [🚨 Critical Security Fixes (P0)](#2--critical-security-fixes-p0)
3. [☁️ Cloud Database Strategy](#3-️-cloud-database-strategy)
4. [🎨 Animation Implementation Plan](#4--animation-implementation-plan)
5. [🖼️ Icon Additions](#5-️-icon-additions)
6. [🎨 Theme System Upgrade](#6--theme-system-upgrade)
7. [💎 Premium UI Upgrades](#7--premium-ui-upgrades)
8. [♿ Accessibility Fixes](#8--accessibility-fixes)
9. [⚡ Performance Fixes](#9--performance-fixes)
10. [📋 Implementation Priority & Effort Estimates](#10--implementation-priority--effort-estimates)
11. [❓ Open Questions for TypeFlow Founder](#11--open-questions-for-typeflow-founder)

---

## 1. Executive Summary

The audit of the TypeFlow codebase reveals **40 actionable findings** across 5 categories:

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| 🚨 Security | 2 | 1 | 5 | 1 | **9** |
| 🎨 Visual/Animation | 0 | 0 | 11 | 6 | **17** |
| ☁️ Cloud | 0 | 2 | 0 | 0 | **2** |
| ♿ Accessibility | 0 | 0 | 5 | 1 | **6** |
| ⚡ Performance | 0 | 0 | 0 | 2 | **2** |

**The #1 priority is the security fix**: passwords are stored in `localStorage` in **plain text**. This must be fixed before any visual or cloud work.

---

## 2. 🚨 Critical Security Fixes (P0)

> [!CAUTION]
> These issues must be fixed IMMEDIATELY — before any other work begins.

### Issue #1: Passwords Stored in localStorage in PLAIN TEXT

**Severity**: 🚨 CRITICAL
**File**: [`src/components/Login.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Login.tsx)
**Effort**: `M` (2-6h)

**Current Code** (Lines 168-178):
```typescript
// ❌ CRITICAL — Password saved as plain text in localStorage
const newUser: UserRecord = {
  username: signUpUsername.trim(),
  email: signUpEmail.trim(),
  password: signUpPassword,         // ← PLAIN TEXT PASSWORD!
  age: signUpAge.trim(),
  gender: signUpGender,
};
users.push(newUser);
localStorage.setItem('typeflow_users_db', JSON.stringify(users));
```

**Current Code** (Lines 80-84):
```typescript
// ❌ CRITICAL — Plain text password comparison
const matchedUser = users.find(
  (u) =>
    (u.username.toLowerCase() === signInIdentifier.trim().toLowerCase() ||
     u.email.toLowerCase() === signInIdentifier.trim().toLowerCase()) &&
    u.password === signInPassword    // ← PLAIN TEXT COMPARISON!
);
```

**Current Code** (Lines 89-92):
```typescript
// ❌ PII stored in plain localStorage
localStorage.setItem('typeflow_active_user', matchedUser.username);
localStorage.setItem('typeflow_user_email', matchedUser.email);
localStorage.setItem('typeflow_user_age', matchedUser.age);     // ← PII
localStorage.setItem('typeflow_user_gender', matchedUser.gender); // ← PII
```

**Required Fix — Option A (Recommended if keeping local auth for now)**:
1. **Remove all password fields** from localStorage storage entirely
2. **Remove the `password` field** from `UserRecord` interface
3. Replace the login form with a **username-only profile selector** (no password needed for a local-only app)
4. **Remove** `typeflow_user_age` and `typeflow_user_gender` from localStorage — store these in IndexedDB `UserStats` table only (not directly exposed in localStorage)
5. Add a clear **"Local Profile — No server, no password"** label

**Required Fix — Option B (If implementing real cloud auth via Supabase)**:
1. Replace the entire `Login.tsx` with a Supabase Auth UI
2. Use `@supabase/supabase-js` for email/password auth + Google/GitHub OAuth
3. Remove ALL `typeflow_users_db` localStorage usage
4. Remove ALL `typeflow_user_*` localStorage keys except `typeflow_active_user` (store only the Supabase user ID)

**Code to DELETE from Login.tsx regardless of chosen option**:
```typescript
// DELETE these localStorage operations:
localStorage.setItem('typeflow_users_db', JSON.stringify(users));  // L178
localStorage.setItem('typeflow_user_age', matchedUser.age);        // L91
localStorage.setItem('typeflow_user_gender', matchedUser.gender);  // L92
```

**Mock social login** (Lines 197-231) must also be either:
- Removed entirely and replaced with a "Coming Soon" badge, OR
- Wired to real Supabase OAuth providers

---

### Issue #2: No Content Security Policy

**Severity**: 🟡 MEDIUM
**File**: [`index.html`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/index.html)
**Effort**: `XS` (<30min)

**Current**: No CSP meta tag at all (only 18 lines in file).

**Required Fix** — Add to `<head>` in `index.html`:
```html
<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self'; 
           style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
           font-src 'self' https://fonts.gstatic.com; 
           img-src 'self' data:; 
           connect-src 'self' https://*.supabase.co;">

<!-- Mobile browser chrome colour -->
<meta name="theme-color" content="#0b0f19">
```

**Notes**:
- `'unsafe-inline'` is needed for the inline CSS variable overrides in `App.tsx` theme switcher
- Add `https://*.supabase.co` to `connect-src` only when Supabase is integrated
- The `theme-color` should match `--bg` for the default dark theme

---

### Issue #3: Vite Sourcemap Not Explicitly Disabled

**Severity**: 🟢 LOW (Vite defaults to `false` for prod)
**File**: [`vite.config.ts`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/vite.config.ts)
**Effort**: `XS` (<30min)

**Current** (8 lines, no build config):
```typescript
export default defineConfig({
  plugins: [react()],
})
```

**Required Fix**:
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,  // Explicitly disable for production
  },
})
```

---

### Issue #4: Dead Vite Boilerplate in App.css

**Severity**: 🟡 MEDIUM
**File**: [`src/App.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/App.css)
**Effort**: `XS` (<30min)

**Current**: 185 lines. Lines 1-18 (`.counter` class) are used by `About.tsx`. Lines 20-184 are **dead Vite scaffold code**.

**Required Fix**: Delete lines 20-184 entirely. The remaining file should be:
```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}
```

---

### Issue #5 (NEW): CSS Bug — `.social-spinner` Uses camelCase Property

**Severity**: 🟡 MEDIUM (renders incorrectly)
**File**: [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css) (~line 614-621)
**Effort**: `XS` (<30min)

**Current Code**:
```css
.social-spinner {
  borderRadius: 50%;  /* ❌ camelCase — this is JSX syntax, NOT valid CSS */
}
```

**Fix**: Change to valid CSS:
```css
.social-spinner {
  border-radius: 50%;  /* ✅ Valid CSS */
}
```

---

### Issue #6 (NEW): `@keyframes fadeIn` Referenced But Never Defined

**Severity**: 🟡 MEDIUM (animations silently fail)
**File**: [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css)
**Effort**: `XS` (<30min)

**Finding**: Multiple components reference `animation: fadeIn 0.3s ease` but the `@keyframes fadeIn` rule **does not exist** in any CSS file. The animations fail silently (elements appear instantly).

**Fix** — add to `index.css`:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

---

### Issue #7 (NEW): Tab Key Hijacked — Breaks Keyboard Navigation

**Severity**: 🟡 MEDIUM (Accessibility)
**File**: [`src/components/TypingTest.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/TypingTest.tsx) (~line 186-189)
**Effort**: `XS` (<30min)

**Current Code**:
```typescript
// Tab key is preventDefault()'d — blocks ALL keyboard navigation
if (e.key === 'Tab') {
  e.preventDefault();
}
```

**Fix**: Only prevent Tab when the typing test is actively running:
```typescript
if (e.key === 'Tab' && isTestActive) {
  e.preventDefault();
}
```

---

### Issue #8 (NEW): No Password Length Enforcement

**Severity**: 🟡 MEDIUM (if auth is kept)
**File**: [`src/components/Login.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Login.tsx) (~line 128-135)
**Effort**: `XS` (<30min)

**Finding**: The sign-up form placeholder says "Minimum 6 characters" but there is NO actual validation enforcing this. The code only checks `if (!signUpPassword)` (is non-empty).

**Fix** (if keeping password auth):
```typescript
if (signUpPassword.length < 6) {
  setErrorMsg('Password must be at least 6 characters.');
  return;
}
```

**Better fix**: Remove passwords entirely (see Issue #1 Option A).

---

## 3. ☁️ Cloud Database Strategy

### Current State
- **100% local** — all data in IndexedDB via Dexie.js
- No network calls, no cloud sync, no cross-device data
- Users lose everything if they clear browser storage
- Auth is completely mocked (see §2 Issue #1)

### Recommended Cloud Provider: **Supabase (Free Tier)**

| Feature | Supabase Free Tier | TypeFlow Needs |
|---------|-------------------|----------------|
| Database | 500MB Postgres | ✅ More than enough for typing stats |
| Auth | 50,000 MAU | ✅ Generous |
| API calls | Unlimited | ✅ |
| Realtime | Included | ✅ For future multiplayer/leaderboards |
| SDK size | ~50KB gzip | ✅ Within constraint (<30KB rule has exception for Supabase) |

### Supabase Schema (Complete SQL)

**New file needed**: `supabase/schema.sql` (or docs/schema.sql)

```sql
-- ============================================================
-- TypeFlow Cloud Schema — Supabase Postgres
-- ============================================================

-- Typing Sessions
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
  wpm_timeline DECIMAL(6,2)[] DEFAULT '{}',
  consistency_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE typing_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own sessions" ON typing_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON typing_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Personal Bests
CREATE TABLE personal_bests (
  user_id UUID REFERENCES auth.users NOT NULL,
  duration INTEGER NOT NULL,
  wpm DECIMAL(6,2) NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY (user_id, duration)
);

ALTER TABLE personal_bests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own PBs" ON personal_bests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users upsert own PBs" ON personal_bests
  FOR ALL USING (auth.uid() = user_id);

-- Lesson Attempts
CREATE TABLE lesson_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  errors_count INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  wpm DECIMAL(6,2),
  accuracy DECIMAL(5,2),
  consistency DECIMAL(5,2),
  passed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lesson_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own lesson attempts" ON lesson_attempts
  FOR ALL USING (auth.uid() = user_id);

-- User Stats (XP, Level, Streak)
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_timestamp BIGINT DEFAULT 0,
  unlocked_themes TEXT[] DEFAULT ARRAY['theme-dark', 'theme-light', 'theme-sepia'],
  active_theme TEXT DEFAULT 'theme-dark',
  selected_track TEXT DEFAULT 'adult',
  streak_shield_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX idx_sessions_user_timestamp ON typing_sessions(user_id, timestamp DESC);
CREATE INDEX idx_lessons_user_lesson ON lesson_attempts(user_id, lesson_id);
```

### Cloud Sync Service Design

**New file**: `src/services/cloudSync.ts`

```typescript
// src/services/cloudSync.ts

import { createClient } from '@supabase/supabase-js';
import { db, type TypingTestSession, type LessonAttempt, type UserStats } from './db';

// Environment variables (set in .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

/**
 * Sync architecture: LOCAL-FIRST with background cloud push.
 * 
 * Write path:
 *   1. Save to Dexie (instant, offline-capable)
 *   2. Queue for cloud sync (background, non-blocking)
 *   3. Push to Supabase when online
 * 
 * Read path:
 *   1. Always read from Dexie (instant)
 *   2. On login: pull cloud data and merge into Dexie
 *   3. Conflict resolution: keep the higher WPM / more recent timestamp
 */

/** Check if user is authenticated with Supabase */
export async function isAuthenticated(): Promise<boolean>

/** Sign in with email/password via Supabase Auth */
export async function signIn(email: string, password: string): Promise<void>

/** Sign in with OAuth (Google/GitHub) via Supabase Auth */
export async function signInWithOAuth(provider: 'google' | 'github'): Promise<void>

/** Sign up with email/password */
export async function signUp(email: string, password: string): Promise<void>

/** Sign out — clears Supabase session, keeps local data */
export async function signOut(): Promise<void>

/** 
 * Background sync: push local Dexie data to Supabase.
 * Called after each test/lesson completion.
 * MUST be non-blocking — never delay the typing test.
 */
export async function pushToCloud(session: TypingTestSession): Promise<void>

/**
 * On login: pull ALL user data from Supabase and merge into local Dexie.
 * Conflict: if same test exists (by timestamp), keep the one with higher WPM.
 */
export async function pullFromCloud(): Promise<void>

/**
 * React hook for components to display sync status.
 */
export function useSyncStatus(): { status: SyncStatus; lastSynced: Date | null }
```

### Migration Plan: Local-Only → Hybrid

| Phase | What Happens | User Experience |
|-------|-------------|-----------------|
| **Phase 1** (current) | Dexie-only, no cloud | Works offline, no account needed |
| **Phase 2** (add Supabase) | Supabase SDK added, auth wired, cloudSync.ts created | "Sign in to sync across devices" — optional prompt |
| **Phase 3** (hybrid live) | Every save goes to Dexie first, then background-pushes to Supabase | Seamless — app works identically offline |
| **Phase 4** (pull on login) | On sign-in, cloud data merges into local Dexie | Multi-device support active |

### New Dependencies Required

```bash
npm install @supabase/supabase-js
# Size: ~50KB gzip — approved per prompt constraints
```

### New Environment Variables

```env
# .env.local (not committed to git)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 4. 🎨 Animation Implementation Plan

### Animation #1: Page Transition System

**File to edit**: [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css)
**Current state**: Pages switch instantly — no transition
**Effort**: `XS` (<30min)

**Add to `index.css`**:
```css
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Apply to the main content wrapper rendered by App.tsx */
.page-content {
  animation: pageEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```

**File to edit**: [`src/App.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/App.tsx)
**Change**: Wrap each `<Route>` component's content in a `<div className="page-content" key={location.pathname}>` so React re-mounts and replays the animation on each route change.

---

### Animation #2: WPM Counter Roll-Up (Results Page)

**File to edit**: [`src/components/Results.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Results.tsx)
**Current state**: WPM shown as static number
**Effort**: `S` (30min-2h)

**Add this hook to `Results.tsx`**:
```typescript
function useCountUp(target: number, duration: number = 800): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const startTime = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return current;
}
```

**Usage**: Replace `{result.wpm}` with `{useCountUp(result.wpm)}` for WPM, accuracy, and errors display.

---

### Animation #3: XP Bar Fill Animation

**File to edit**: [`src/components/Dashboard.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Dashboard.tsx)
**Current state**: XP shown as text: "Level 3 (247 XP)"
**Effort**: `S` (30min-2h)

**Add animated progress bar**:
```tsx
// In Dashboard.tsx — replace static XP text with:
<div className="xp-bar-container">
  <div className="xp-bar-label">
    Level {stats.level} — {stats.xp} / {nextLevelXp} XP
  </div>
  <div className="xp-bar-track">
    <div 
      className="xp-bar-fill" 
      style={{ width: `${(stats.xp / nextLevelXp) * 100}%` }}
    />
  </div>
</div>
```

**Add to `index.css`**:
```css
.xp-bar-track {
  width: 100%;
  height: 8px;
  background: var(--bg-hover);
  border-radius: var(--radius-full, 9999px);
  overflow: hidden;
}
.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-hover));
  border-radius: inherit;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

### Animation #4: Streak Fire Pulse

**File to edit**: [`src/components/Dashboard.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Dashboard.tsx)
**Current state**: Static text "🔥 3 Day Streak"
**Effort**: `XS` (<30min)

**Add to `index.css`**:
```css
@keyframes firePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.streak-fire {
  display: inline-block;
  animation: firePulse 1.5s ease-in-out infinite;
}
.streak-fire.streak-small { font-size: 1.2rem; }
.streak-fire.streak-medium { font-size: 1.5rem; }  /* ≥7 days */
.streak-fire.streak-large { font-size: 2rem; }      /* ≥14 days */
```

**In Dashboard.tsx**: Wrap the fire emoji:
```tsx
<span className={`streak-fire ${stats.currentStreak >= 14 ? 'streak-large' : stats.currentStreak >= 7 ? 'streak-medium' : 'streak-small'}`}>
  🔥
</span>
```

---

### Animation #5: Badge/Achievement Toast

**File to edit**: [`src/components/Learn.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Learn.tsx) + [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css)
**Current state**: No badge unlock animation exists
**Effort**: `S` (30min-2h)

**Add to `index.css`**:
```css
@keyframes toastSlideIn {
  0%   { transform: translateX(120%); opacity: 0; }
  10%  { transform: translateX(0); opacity: 1; }
  90%  { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(120%); opacity: 0; }
}
.achievement-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--accent);
  border-radius: var(--radius-lg, 0.75rem);
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), 0 0 20px var(--accent-glow);
  animation: toastSlideIn 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.achievement-toast .toast-icon { font-size: 1.5rem; }
.achievement-toast .toast-text { font-weight: 600; color: var(--text); }
```

**In Learn.tsx** — add state + conditional render:
```tsx
const [toastMessage, setToastMessage] = useState<string | null>(null);

// On badge unlock:
setToastMessage('🏆 Badge Unlocked: Home Row Master');
setTimeout(() => setToastMessage(null), 3600);

// Render:
{toastMessage && (
  <div className="achievement-toast">
    <span className="toast-icon">🏆</span>
    <span className="toast-text">{toastMessage}</span>
  </div>
)}
```

---

### Animation #6: Keyboard Key Press Feedback (Learn.tsx)

**File to edit**: [`src/components/Learn.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Learn.tsx)
**Current state**: `.kb-key` has `transition` property but needs to verify `pop` keyframe activation on correct keypress
**Effort**: `XS` (<30min)

**Required fix**: Ensure the keyboard key gets a temporary `.kb-key-active` class for 80ms on correct keypress:
```css
/* Add to index.css or Learn.tsx inline styles */
.kb-key-active {
  transform: translateY(2px) scale(0.95);
  box-shadow: 0 0 12px var(--success);
  background: var(--success) !important;
  color: var(--bg) !important;
  transition: all 0.05s ease;
}
```

**In Learn.tsx** — on correct keypress handler, set the pressed key ID, clear after 80ms:
```typescript
setPressedKey(key);
setTimeout(() => setPressedKey(null), 80);
```

---

### Animation #7: Smooth Caret Movement (TypingTest)

**File to edit**: [`src/components/TypingTest.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/TypingTest.tsx) CSS
**Current state**: Caret has `transition: left 0.08s ease` — already partially smooth
**Effort**: `XS` (<30min)

**Enhancement**: Use `transform: translateX()` instead of `left` for GPU-accelerated movement:
```css
.caret-indicator {
  transition: transform 0.06s ease;
  will-change: transform;
}
```

---

### Animation #8: Card Entry Stagger (Dashboard)

**File to edit**: [`src/components/Dashboard.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Dashboard.tsx)
**Current state**: All cards appear simultaneously
**Effort**: `S` (30min-2h)

**Add to `index.css`**:
```css
@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.stagger-card {
  opacity: 0;
  animation: cardFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.stagger-card:nth-child(1) { animation-delay: 0.05s; }
.stagger-card:nth-child(2) { animation-delay: 0.10s; }
.stagger-card:nth-child(3) { animation-delay: 0.15s; }
.stagger-card:nth-child(4) { animation-delay: 0.20s; }
.stagger-card:nth-child(5) { animation-delay: 0.25s; }
.stagger-card:nth-child(6) { animation-delay: 0.30s; }
```

**In Dashboard.tsx**: Add `className="stagger-card"` to each stat/action card.

---

### Animation #9: Confetti on 60 WPM

**File to edit**: [`src/components/Results.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Results.tsx)
**Current state**: Nothing special at 60 WPM
**Effort**: `M` (2-6h)

**Pure CSS/JS confetti** — no library needed:
```typescript
// Add to Results.tsx
function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 2,
    color: ['#f43f5e', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'][i % 5],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
```

**CSS**:
```css
.confetti-container {
  position: fixed; inset: 0; pointer-events: none; z-index: 9999; overflow: hidden;
}
@keyframes confettiFall {
  0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
.confetti-piece {
  position: absolute;
  top: -10px;
  width: 8px; height: 12px;
  border-radius: 2px;
  animation: confettiFall 2.5s ease-in forwards;
}
```

**Trigger**: `{result.wpm >= 60 && <Confetti />}`

---

### Animation #10: Loading Skeleton Shimmer (ProgressView)

**File to edit**: [`src/components/ProgressView.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/ProgressView.tsx)
**Current state**: Plain text "Loading your progress data..."
**Effort**: `S` (30min-2h)

**Replace with skeleton cards**:
```tsx
// In ProgressView.tsx — loading state
if (isLoading) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-text" />
          <div className="skeleton-line skeleton-text short" />
        </div>
      ))}
    </div>
  );
}
```

**CSS** (existing `@keyframes shimmer` in index.css can be reused):
```css
.skeleton-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
}
.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 0.75rem;
}
.skeleton-title { width: 60%; height: 18px; }
.skeleton-text { width: 100%; }
.skeleton-text.short { width: 40%; }
```

---

## 5. 🖼️ Icon Additions

### Per-Page Icon Audit

| Page | Component | Current Icons | Missing / Recommended Additions |
|------|-----------|--------------|--------------------------------|
| **Dashboard** | `Dashboard.tsx` | Some stat icons | Add `Zap` for WPM card, `Target` for accuracy, `Clock` for duration, `Flame` for streak, `Trophy` for PB |
| **Navigation** | `App.tsx` header | Text-only nav tabs | Add small icons: `House` (Dashboard), `Timer` (Test), `Dumbbell` (Practice), `BookOpen` (Learn), `ChartBar` (Progress), `Info` (About) |
| **Results** | `Results.tsx` | Minimal | Add `Trophy` for PB indicator, `TrendingUp`/`TrendingDown` for comparison vs best, `Sparkles` for 60+ WPM |
| **Curriculum** | `Curriculum.tsx` | `Lock`, `CheckCircle2` | Confirm coverage. Add `PlayCircle` for available (unlocked but not completed) stages |
| **Settings** | `SettingsMenu.tsx` | `Moon`/`Sun`/`Palette` for theme | Add `Volume2`/`VolumeX` for sound, `Shield` for security |
| **Footer** | Inline in `App.tsx` | None | Add `Github` icon + link, `Heart` icon |
| **Learn** | `Learn.tsx` | Keyboard icons | Add `Gauge` for WPM display, `Target` for accuracy, `Activity` for consistency |
| **Header** | `App.tsx` | `Keyboard` logo icon | Add `Wifi`/`WifiOff` for cloud sync status indicator (when Supabase is integrated) |
| **Progress** | `ProgressView.tsx` | Some chart icons | Add `Medal` for milestones, `Crown` for highest WPM |

**All icons use the existing `lucide-react` library** — no new dependency needed.

### Recommended Icon Import Block

```typescript
// Add to relevant components as needed:
import { 
  Zap, Target, Clock, Trophy, TrendingUp, TrendingDown,
  Lock, Unlock, CheckCircle2, PlayCircle, Circle,
  Flame, Star, Medal, Crown, Sparkles, Rocket,
  Github, Heart, Globe,
  ChartLine, Activity, Gauge,
  Shield, ShieldCheck,
  Wifi, WifiOff, CloudUpload, CloudCheck,
  House, Timer, Dumbbell, BookOpen, ChartBar, Info,
  Volume2, VolumeX
} from 'lucide-react';
```

### Icon Size Standards (follow these consistently):

| Context | Size | Example |
|---------|------|---------|
| Inline with text | 16px | Stat labels, breadcrumbs |
| Buttons | 20px | Nav tabs, action buttons |
| Section headings | 24px | Card headers, page titles |
| Hero / decorative | 32-48px | Dashboard hero, empty states |

---

## 6. 🎨 Theme System Upgrade

### Fix #1: Theme Persistence to localStorage

**File to edit**: [`src/App.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/App.tsx)
**Current state**: Theme resets on page refresh (no localStorage persistence)
**Effort**: `XS` (<30min)

**Change the theme initialization** (line 27):
```typescript
// BEFORE:
const [theme, setTheme] = useState<'dark' | 'light' | 'sepia'>('dark');

// AFTER:
const [theme, setTheme] = useState<string>(() => {
  const saved = localStorage.getItem('typeflow_theme');
  if (saved && ['dark', 'light', 'sepia', 'cyberpunk', 'forest', 'ocean', 'retro', 'rose'].includes(saved)) {
    return saved;
  }
  // Auto-detect OS preference on first visit
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});
```

**Add persistence** — after the existing theme `useEffect` (around line 137):
```typescript
useEffect(() => {
  localStorage.setItem('typeflow_theme', theme);
}, [theme]);
```

---

### Fix #2: Theme Picker UI (Replace Cycling Button)

**File to edit**: [`src/components/SettingsMenu.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/SettingsMenu.tsx)
**Current state**: Single button cycles dark→light→sepia→dark
**Effort**: `S` (30min-2h)

**Replace with a visual theme selector row**:
```tsx
<div className="theme-picker">
  {[
    { id: 'dark', icon: '🌙', label: 'Dark' },
    { id: 'light', icon: '☀️', label: 'Light' },
    { id: 'sepia', icon: '📜', label: 'Sepia' },
    // Unlockable themes (grey out if locked):
    { id: 'cyberpunk', icon: '💜', label: 'Neon', locked: !unlockedThemes.includes('theme-cyberpunk') },
    { id: 'forest', icon: '🌲', label: 'Forest', locked: !unlockedThemes.includes('theme-forest') },
    { id: 'ocean', icon: '🌊', label: 'Ocean', locked: !unlockedThemes.includes('theme-ocean') },
    { id: 'retro', icon: '🖥️', label: 'Retro', locked: !unlockedThemes.includes('theme-retro') },
    { id: 'rose', icon: '🌹', label: 'Rose', locked: !unlockedThemes.includes('theme-rose') },
  ].map(t => (
    <button
      key={t.id}
      className={`theme-swatch ${theme === t.id ? 'active' : ''} ${t.locked ? 'locked' : ''}`}
      onClick={() => !t.locked && onThemeChange(t.id)}
      disabled={t.locked}
      title={t.locked ? `Unlock: ${t.unlockHint}` : t.label}
      aria-label={`${t.label} theme`}
    >
      <span>{t.icon}</span>
      <span className="theme-swatch-label">{t.label}</span>
      {t.locked && <Lock size={12} />}
    </button>
  ))}
</div>
```

---

### Fix #3: 5 New Unlockable Themes (Complete CSS)

**File to edit**: [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css)
**Effort**: `M` (2-6h)

**Add after the existing `.theme-dark` block (line 66)**:

```css
/* ============================================================
   UNLOCKABLE THEMES
   ============================================================ */

/* 🟣 Neon Cyberpunk — Unlock: Level 5 + 3-day streak */
.theme-cyberpunk {
  color-scheme: dark;
  --bg: #060010;
  --bg-card: #0d0020;
  --bg-hover: #1a0040;
  --border: #2d0060;
  --text: #f0f0ff;
  --text-dim: #c084fc;
  --text-muted: #7c3aed;
  --accent: #f0abfc;
  --accent-hover: #e879f9;
  --accent-glow: rgba(240, 171, 252, 0.2);
  --success: #22d3ee;
  --warning: #fb923c;
  --danger: #f43f5e;
  --danger-bg: rgba(244, 63, 94, 0.15);
}
/* Cyberpunk grid background — apply to body when active */
.theme-cyberpunk body,
.theme-cyberpunk #root {
  background-image: 
    linear-gradient(rgba(45, 0, 96, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45, 0, 96, 0.3) 1px, transparent 1px);
  background-size: 30px 30px;
}

/* 🌲 Forest Grove — Unlock: Complete 25 lessons */
.theme-forest {
  color-scheme: dark;
  --bg: #0a1a0f;
  --bg-card: #122118;
  --bg-hover: #1a3222;
  --border: #234430;
  --text: #e8f5e9;
  --text-dim: #81c784;
  --text-muted: #4caf50;
  --accent: #66bb6a;
  --accent-hover: #81c784;
  --accent-glow: rgba(102, 187, 106, 0.15);
  --success: #a5d6a7;
  --warning: #ffb74d;
  --danger: #ef5350;
  --danger-bg: rgba(239, 83, 80, 0.12);
}

/* 🌊 Deep Ocean — Unlock: First 60 WPM */
.theme-ocean {
  color-scheme: dark;
  --bg: #05101a;
  --bg-card: #0a1929;
  --bg-hover: #0d2137;
  --border: #1a3a5c;
  --text: #e0f2fe;
  --text-dim: #7dd3fc;
  --text-muted: #38bdf8;
  --accent: #06b6d4;
  --accent-hover: #22d3ee;
  --accent-glow: rgba(6, 182, 212, 0.15);
  --success: #34d399;
  --warning: #fbbf24;
  --danger: #fb7185;
  --danger-bg: rgba(251, 113, 133, 0.12);
}

/* 🖥️ Retro Terminal — Unlock: Reach Level 10 */
.theme-retro {
  color-scheme: dark;
  --bg: #000000;
  --bg-card: #0a0a0a;
  --bg-hover: #141414;
  --border: #1a1a1a;
  --text: #00ff41;
  --text-dim: #00cc33;
  --text-muted: #009926;
  --accent: #00ff41;
  --accent-hover: #33ff66;
  --accent-glow: rgba(0, 255, 65, 0.12);
  --success: #00ff41;
  --warning: #ffff00;
  --danger: #ff0040;
  --danger-bg: rgba(255, 0, 64, 0.12);
  --font-sans: 'Consolas', 'Courier New', Courier, monospace;
  --font-heading: 'Consolas', 'Courier New', Courier, monospace;
}

/* 🌹 Rose Gold — Unlock: 7-day streak */
.theme-rose {
  color-scheme: light;
  --bg: #fdf2f4;
  --bg-card: #fff5f7;
  --bg-hover: #fce7eb;
  --border: #f5c6ce;
  --text: #4a1d2e;
  --text-dim: #8b4a5e;
  --text-muted: #b56b7f;
  --accent: #d4a574;
  --accent-hover: #c4956a;
  --accent-glow: rgba(212, 165, 116, 0.15);
  --success: #34d399;
  --warning: #f59e0b;
  --danger: #ef4444;
  --danger-bg: rgba(239, 68, 68, 0.1);
}
```

### Fix #4: System Theme Auto-Detect

Already included in Fix #1 above — the `useState` initializer checks `matchMedia`.

---

## 7. 💎 Premium UI Upgrades

### 7A. Missing CSS Design Tokens

**File to edit**: [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css) — `:root` block (line 1-26)
**Effort**: `XS` (<30min)

**Add these tokens after line 15** (`--warning` line):
```css
  /* Radius tokens */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadow tokens */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px var(--accent-glow);

  /* Transition tokens */
  --transition-fast: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-base: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  /* Font size scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
```

---

### 7B. Global Polish (Quick Wins)

**File to edit**: [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css)
**Effort**: `XS` (<30min) per item

```css
/* 1. Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* 2. Selection colour */
::selection {
  background: var(--accent-glow);
  color: var(--text);
}

/* 3. Body background gradient (subtle radial glow from top) */
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

### 7C. Glassmorphism & Gradient Border Cards

**File to edit**: [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css)
**Effort**: `S` (30min-2h)

```css
/* Glassmorphism card variant */
.card-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-xl);
}

/* Gradient border card */
.card-gradient-border {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.card-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, var(--accent), transparent 60%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

**Usage**: Apply `card-glass` to the Dashboard hero card, `card-gradient-border` to the "Start Typing Test" CTA card.

---

### 7D. Per-Component Premium Upgrades

| Component | Current State | Premium Fix | Effort |
|-----------|-------------|-------------|--------|
| **Dashboard hero** | Plain text | Glassmorphism hero card with gradient border | `S` |
| **"Start Test" button** | Standard button | Add pulse ring animation: `box-shadow: 0 0 0 0 var(--accent-glow)` with pulsing keyframe | `XS` |
| **Navigation tabs** | Filled pill on active | Glowing underline instead of filled background (or keep pills, add glow) | `S` |
| **Logo "TypeFlow"** | Static gradient text | Add subtle shimmer on hover (CSS gradient animation) | `XS` |
| **Typing test word area** | Plain `var(--bg-card)` background | Frosted glass: `backdrop-filter: blur(8px); background: rgba(var(--bg-card-rgb), 0.7)` | `XS` |
| **Timer countdown** | Static styling | Pulse red (`color: var(--danger); animation: pulse`) in last 10 seconds | `XS` |
| **Progress phase rings** | Appear at final value | Animate `stroke-dashoffset` from full to target on mount with CSS transition | `S` |
| **Footer** | Copyright text only | 3-column layout: Brand · Quick Links · Sync Status | `S` |
| **Empty states** | Plain text messages | Illustrated SVG + "Nothing here yet — start a test!" CTA | `M` |

---

### 7E. "Start Test" Button Pulse Animation

```css
@keyframes pulseRing {
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(14, 165, 233, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
}
.btn-pulse {
  animation: pulseRing 2s infinite;
}
```

### 7F. Logo Shimmer on Hover

```css
.logo-text:hover {
  background-size: 200% auto;
  animation: logoShimmer 1.5s linear infinite;
}
@keyframes logoShimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
```

---

## 8. ♿ Accessibility Fixes

### Fix #1: Add `aria-label` to all icon-only buttons

**File**: [`src/App.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/App.tsx) (header area, ~lines 250-270)
**Effort**: `XS` (<30min)

```tsx
// Theme button — BEFORE:
<button title="Toggle theme" className="icon-btn" onClick={cycleTheme}>

// AFTER:
<button title="Toggle theme" aria-label="Toggle theme" className="icon-btn" onClick={cycleTheme}>

// Sound button — BEFORE:
<button title="Toggle sound" className="icon-btn" onClick={() => setSoundOn(!soundOn)}>

// AFTER:
<button title="Toggle sound" aria-label={soundOn ? "Mute sound effects" : "Enable sound effects"} className="icon-btn" onClick={() => setSoundOn(!soundOn)}>
```

Apply to ALL icon-only buttons throughout the app (Settings gear, nav shortcuts, etc.).

---

### Fix #2: Semantic HTML tags (`<nav>`, `<main>`)

**File**: [`src/App.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/App.tsx)
**Effort**: `XS` (<30min)

```tsx
// BEFORE (navigation):
<div className="app-nav">

// AFTER:
<nav className="app-nav" aria-label="Main navigation">

// BEFORE (main content area):
<div className="main-content">

// AFTER:
<main className="main-content">
```

---

### Fix #3: Progress bar ARIA attributes

**Files**: [`Dashboard.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Dashboard.tsx), [`ProgressView.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/ProgressView.tsx)
**Effort**: `XS` (<30min)

```tsx
// XP progress bar:
<div 
  className="xp-bar-track"
  role="progressbar"
  aria-valuenow={stats.xp}
  aria-valuemin={0}
  aria-valuemax={nextLevelXp}
  aria-label={`Experience points: ${stats.xp} of ${nextLevelXp}`}
>

// Phase completion ring:
<svg role="progressbar" aria-valuenow={completedPercent} aria-valuemax={100}>
```

---

### Fix #4: Keyboard heatmap text labels

**File**: [`src/components/ProgressView.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/ProgressView.tsx)
**Effort**: `S` (30min-2h)

Add accuracy percentage text below each key on the keyboard heatmap:
```tsx
<div className="heatmap-key">
  <span className="key-letter">{key}</span>
  <span className="key-accuracy">{accuracy}%</span>  {/* ← ADD THIS */}
</div>
```

---

### Fix #5: Unique IDs for interactive elements

**All component files**
**Effort**: `S` (30min-2h)

Add unique `id` attributes to key interactive elements for testing and accessibility:
```tsx
<button id="btn-start-test">Start Typing Test</button>
<button id="btn-continue-learning">Continue Learning</button>
<input id="input-typing-test" />
<nav id="main-nav">
```

---

## 9. ⚡ Performance Fixes

### Fix #1: Paginate ProgressView test history

**File**: [`src/components/ProgressView.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/ProgressView.tsx)
**Current state**: `getTestHistory()` loads ALL sessions on mount
**Effort**: `S` (30min-2h)

**Fix**: Add a `limit` parameter:
```typescript
// In ProgressView.tsx — on mount:
const sessions = await getTestHistory(50); // Load last 50 only

// Add "Load More" button at bottom of history table:
<button onClick={() => loadMore()} className="btn-secondary">Load More</button>
```

---

### Fix #2: Optimize TypingTest re-renders

**File**: [`src/components/TypingTest.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/TypingTest.tsx)
**Current state**: Full component re-render on every keystroke
**Effort**: `M` (2-6h)

**Fix**: Extract the word display into a `React.memo` child component:
```typescript
const WordDisplay = React.memo(({ words, currentIndex, typedChars }: WordDisplayProps) => {
  // Only re-renders when word-level state changes
  return (
    <div className="word-display">
      {words.map((word, i) => (
        <Word key={i} word={word} index={i} currentIndex={currentIndex} typedChars={typedChars} />
      ))}
    </div>
  );
});
```

---

## 10. 📋 Implementation Priority & Effort Estimates

### P0 — Fix This Week (Security — CRITICAL)

| # | Task | File(s) | Effort | Impact |
|---|------|---------|--------|--------|
| 1 | Remove plain-text passwords from localStorage | `Login.tsx` | `M` | 🚨 Security |
| 2 | Remove PII (age, gender) from localStorage | `Login.tsx` | `XS` | 🚨 Security |
| 3 | Delete dead Vite boilerplate in App.css | `App.css` | `XS` | 🟡 Cleanup |
| 4 | Add CSP meta tag to index.html | `index.html` | `XS` | 🟡 Security |
| 5 | Add theme-color meta tag | `index.html` | `XS` | 🟢 Mobile |
| 6 | Explicitly set sourcemap: false in vite.config | `vite.config.ts` | `XS` | 🟢 Security |
| 7 | Add `aria-label` to icon-only buttons | `App.tsx` | `XS` | 🟡 Accessibility |
| 8 | Add `<nav>` and `<main>` semantic tags | `App.tsx` | `XS` | 🟡 Accessibility |
| 7 | Theme persistence to localStorage | `App.tsx` | `XS` | 🟡 UX |
| 8 | Add `scroll-behavior: smooth` + `::selection` + body gradient | `index.css` | `XS` | 🟢 Polish |
| 9 | Fix `.social-spinner` camelCase CSS bug | `index.css` | `XS` | 🟡 Bug |
| 10 | Add missing `@keyframes fadeIn` definition | `index.css` | `XS` | 🟡 Bug |
| 11 | Fix Tab key hijacking in TypingTest | `TypingTest.tsx` | `XS` | 🟡 Accessibility |

**Subtotal: ~1 day** for all P0 items

---

### P1 — Ship Within 2 Weeks (Visual + Animations + Icons)

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 11 | Add missing CSS design tokens (radius, shadow, transition, font-size) | `index.css` | `XS` |
| 12 | Page transition animation | `index.css` + `App.tsx` | `XS` |
| 13 | WPM counter roll-up animation | `Results.tsx` | `S` |
| 14 | XP bar fill animation | `Dashboard.tsx` + `index.css` | `S` |
| 15 | Streak fire pulse animation | `Dashboard.tsx` + `index.css` | `XS` |
| 16 | Badge/achievement toast | `Learn.tsx` + `index.css` | `S` |
| 17 | Card entry stagger | `Dashboard.tsx` + `index.css` | `S` |
| 18 | Keyboard key press feedback (3D press) | `Learn.tsx` + `index.css` | `XS` |
| 19 | Loading skeleton shimmer | `ProgressView.tsx` + `index.css` | `S` |
| 20 | Glassmorphism + gradient border card classes | `index.css` | `S` |
| 21 | Dashboard hero upgrade (glass card) | `Dashboard.tsx` | `S` |
| 22 | "Start Test" pulse animation | `index.css` | `XS` |
| 23 | Logo shimmer on hover | `index.css` | `XS` |
| 24 | Timer red pulse in last 10s | `TypingTest.tsx` + `index.css` | `XS` |
| 25 | Phase ring animate on mount | `ProgressView.tsx` | `S` |
| 26 | Confetti on 60+ WPM | `Results.tsx` + `index.css` | `M` |
| 27 | Icon additions across all pages | Multiple | `S` |
| 28 | Theme picker UI (replace cycling button) | `SettingsMenu.tsx` | `S` |
| 29 | 5 new unlockable theme CSS blocks | `index.css` | `M` |
| 30 | Progress bar ARIA attributes | `Dashboard.tsx`, `ProgressView.tsx` | `XS` |
| 31 | Keyboard heatmap text labels | `ProgressView.tsx` | `S` |
| 32 | Footer upgrade (3-column) | `App.tsx` | `S` |

**Subtotal: ~8-10 dev days**

---

### P2 — Ship Within 1 Month (Cloud + Advanced Polish)

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 33 | Install `@supabase/supabase-js` | `package.json` | `XS` |
| 34 | Create Supabase project + run schema SQL | Supabase dashboard | `S` |
| 35 | Build `cloudSync.ts` service | `src/services/cloudSync.ts` (NEW) | `L` |
| 36 | Replace mocked Login.tsx with Supabase Auth | `Login.tsx` (REWRITE) | `L` |
| 37 | Add sync status indicator (Wifi/WifiOff) to header | `App.tsx` | `S` |
| 38 | Implement background sync on test/lesson completion | `db.ts` + `cloudSync.ts` | `M` |
| 39 | Implement pull-from-cloud on login | `cloudSync.ts` | `M` |
| 40 | Typing test frosted-glass background | `TypingTest.tsx` + `index.css` | `XS` |
| 41 | ProgressView pagination | `ProgressView.tsx` | `S` |
| 42 | TypingTest render optimization (React.memo) | `TypingTest.tsx` | `M` |
| 43 | Unique IDs on all interactive elements | Multiple | `S` |

**Subtotal: ~10-12 dev days**

---

### Complete Effort Summary

| Priority | Items | Total Effort |
|----------|-------|-------------|
| **P0** (Security + Quick Wins) | 10 items | ~1 day |
| **P1** (Visual + Animations) | 22 items | ~8-10 days |
| **P2** (Cloud + Performance) | 11 items | ~10-12 days |
| **Total** | **43 items** | **~20-23 dev days** |

---

## 11. ❓ Open Questions for TypeFlow Founder

1. **Auth strategy**: Do you want to keep a local profile system (no passwords, just username selector) or go full Supabase Auth (email/password + Google/GitHub OAuth)?

2. **Password urgency**: Should the plain-text password code be deleted immediately with a simple "Coming Soon" banner, or should we implement Supabase Auth in the same pass?

3. **Theme priority**: Which of the 5 new themes should be implemented first? (Cyberpunk and Retro Terminal are most visually distinctive)

4. **Confetti library**: The prompt allows a confetti library <5KB. Should we use pure CSS (more control, ~0KB) or a tiny library like `canvas-confetti` (~3KB, more impressive)?

5. **Cloud migration timeline**: Should Supabase integration be P1 (2 weeks) or P2 (1 month)? The auth security fix is P0 regardless.

6. **Mobile responsiveness**: The prompt requires testing at 375px viewport. Should we do a dedicated mobile pass as part of P1 or P2?

7. **Google Fonts**: The fonts `Inter` and `Outfit` ARE correctly loaded in `index.html` with `display=swap`. However, the Google Fonts link has no SRI hash — should we add one? (It may break if Google updates the CSS file.)

8. **Existing user data**: When removing the fake auth system, should the code attempt to migrate any existing `typeflow_users_db` localStorage data, or simply delete it with a notification to users?

---

## Appendix: File Change Summary

| File | Action | Lines Changed |
|------|--------|--------------|
| [`src/components/Login.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Login.tsx) | **REWRITE** (P0 security + P2 Supabase) | ~682 lines |
| [`src/App.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/App.css) | **DELETE** lines 20-184 | -165 lines |
| [`index.html`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/index.html) | **ADD** CSP + theme-color meta tags | +5 lines |
| [`vite.config.ts`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/vite.config.ts) | **ADD** build.sourcemap: false | +3 lines |
| [`src/index.css`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/index.css) | **ADD** tokens, themes, animations | +300-400 lines |
| [`src/App.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/App.tsx) | **MODIFY** theme persistence, semantic HTML, page transitions | +30-50 lines |
| [`src/components/Results.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Results.tsx) | **MODIFY** count-up animation, confetti | +80-100 lines |
| [`src/components/Dashboard.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Dashboard.tsx) | **MODIFY** XP bar, streak fire, card stagger, icons | +60-80 lines |
| [`src/components/Learn.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Learn.tsx) | **MODIFY** achievement toast, key press feedback | +40-60 lines |
| [`src/components/ProgressView.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/ProgressView.tsx) | **MODIFY** skeleton loader, ring animation, pagination, heatmap labels | +60-80 lines |
| [`src/components/SettingsMenu.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/SettingsMenu.tsx) | **MODIFY** theme picker UI | +40-60 lines |
| [`src/components/TypingTest.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/TypingTest.tsx) | **MODIFY** caret smoothing, timer pulse, React.memo | +30-50 lines |
| `src/services/cloudSync.ts` | **NEW** (P2) | ~200-250 lines |
| `supabase/schema.sql` | **NEW** (P2) | ~80 lines |
| `.env.local` | **NEW** (P2) | 2 lines |
