# TypeFlow Curriculum v2 — Developer Implementation Plan

> **Source Prompt**: [`typeflow_curriculum_design_prompt.md`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/typeflow_curriculum_design_prompt.md)
> **Current Curriculum**: [`curriculum_design.md`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/curriculum_design.md) (35-stage design doc, superseded)
> **Generated**: June 28, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Codebase State (Accurate)](#2-current-codebase-state-accurate)
3. [Current vs. Target Gap Analysis](#3-current-vs-target-gap-analysis)
4. [New Files to Create](#4-new-files-to-create)
5. [Files to Modify](#5-files-to-modify)
6. [Database Schema Migration](#6-database-schema-migration)
7. [Detailed Implementation Tasks](#7-detailed-implementation-tasks)
8. [TypeScript Interfaces (Complete, Compilable)](#8-typescript-interfaces-complete-compilable)
9. [UI/UX Changes](#9-uiux-changes)
10. [Implementation Priority](#10-implementation-priority)
11. [Testing & Verification Plan](#11-testing--verification-plan)

---

## 1. Executive Summary

The curriculum design prompt requires a **complete overhaul** from the current 500-stage mechanically-generated lesson system (where only ~115 stages are meaningful and ~385 are padding) to a **200-stage, track-aware, adaptive curriculum engine**. This touches **every layer** of the application.

| Layer | Scope of Change |
|-------|----------------|
| **Data** | Replace 500 mechanical stages → 200 deliberate stages with dynamic word generation |
| **Engine** | Add adaptive drill generation, metronome, consistency scoring as gate, track-aware lesson resolution |
| **Database** | Migrate schema v4 → v5: new tables for badges, daily challenges, keystroke history |
| **UI** | Track selection onboarding, keyboard unlock map, metronome UI, badge display, daily challenge widget, certificate generation |
| **Gamification** | Badges, streak shields, daily challenges, level name expansion, celebration animations |

**Files impacted**: 5 new files + 8 modified files (see §4 & §5).

---

## 2. Current Codebase State (Accurate)

> [!IMPORTANT]
> This section documents the **actual** current state of the code to prevent developer confusion.

### 2A. Tech Stack
- **React 19** + **TypeScript 6** + **Vite 8** + **Dexie 4** (IndexedDB)
- **react-router-dom 7** (real router with `Routes`, `Route`, `useNavigate`)
- **lucide-react** for icons
- **vitest** for unit tests, **Playwright** for E2E tests
- Only 3 runtime dependencies — **no new npm packages allowed**

### 2B. Current File Map

| File | Size | Purpose |
|------|------|---------|
| [`src/utils/lessonsData.ts`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/utils/lessonsData.ts) | 6.3 KB | `generateCurriculum()` → 500 stages (mechanical loop, not real curriculum) |
| [`src/utils/typingEngine.ts`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/utils/typingEngine.ts) | 6.3 KB | `TypingEngine` CLASS — used by `TypingTest.tsx` and `Practice.tsx` only |
| [`src/utils/soundManager.ts`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/utils/soundManager.ts) | 3.2 KB | Web Audio oscillator sounds |
| [`src/services/db.ts`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/services/db.ts) | 13.7 KB | Dexie DB v4 — tables: `tests`, `personalBests`, `lessons`, `userStats` |
| [`src/services/analytics.ts`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/services/analytics.ts) | 4.4 KB | Heatmap, consistency, improvement rate, bigram latency |
| [`src/components/Learn.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Learn.tsx) | 37.9 KB | Lesson UX — **has its own typing logic** (does NOT use `TypingEngine` class) |
| [`src/components/Curriculum.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Curriculum.tsx) | 4.8 KB | Stage browser grid with phase tabs and lock/unlock logic |
| [`src/components/Dashboard.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/Dashboard.tsx) | 15.6 KB | Home page with onboarding, weak key detection, stats |
| [`src/components/ProgressView.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/components/ProgressView.tsx) | 25.4 KB | Full analytics: heatmap, sparkline, milestones, data management |
| [`src/App.tsx`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/App.tsx) | 12.6 KB | React Router routing: `/`, `/test`, `/practice`, `/curriculum`, `/stage/:id`, `/progress`, etc. |

### 2C. Current Lesson Generation (What Must Be Replaced)

The current [`lessonsData.ts`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/src/utils/lessonsData.ts) works like this:

```
For each of 30 characters (home → top → bottom row):
  1. Create "Introducing X" stage (key repetition drill)
  2. Create "Space Coordination with X" stage
  3. Create "Review Drill" stage (if ≥2 chars completed)
  4. Create "Cumulative Word Drill" stage (if ≥3 chars completed)
→ Produces ~115 meaningful stages

Then pad to 500 with 7 rotating pangram sentences ("Speed Endurance Run")
→ 385 filler stages (identical content on loop)
```

**Critical issues**:
- `getDrillWords()` uses `Math.random()` → drills change on every page load (non-deterministic)
- No Shift/capital letter stages, no number stages, no symbol stages exist
- Phase `'numbers-symbols'` is **defined in the type but never used** — zero stages generate with it
- All word drills draw from a tiny pool of ~130 hardcoded words
- No graduation gates (no `minAccuracy`, `minWpm` in the `Lesson` interface)
- No XP rewards per stage, no badge unlocks, no coaching tips

### 2D. Current `Lesson` Interface

```typescript
// CURRENT — to be replaced
export interface Lesson {
  id: number;
  title: string;
  description: string;
  target: string;
  focusKeys: string[];
  phase: 'home-row' | 'extensions' | 'coordination' | 'numbers-symbols' | 'advanced';
}
```

### 2E. Current Database Schema (Dexie Version 4)

```typescript
// Tables: tests, personalBests, lessons, userStats
// Version 4 stores:
tests: '++id, timestamp, duration, wpm, accuracy, consistencyScore'
personalBests: 'duration, wpm, timestamp'
lessons: '++id, lessonId, completedAt'
userStats: 'id'
```

**Key interfaces**:
```typescript
interface LessonAttempt {
  id?: number;
  lessonId: number;       // links to Lesson.id
  completedAt: Date;
  errorsCount: number;
  durationSeconds: number;
}

interface UserStats {
  id: string;               // "current_user"
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveTimestamp: number;
  unlockedThemes: string[];
  activeTheme: string;
}
```

### 2F. Current Learn.tsx Architecture

> [!WARNING]
> `Learn.tsx` does **NOT** use the `TypingEngine` class. It has its own inline char-by-char typing logic with `window.addEventListener('keydown')`. Any changes to `typingEngine.ts` will NOT affect lessons.

**Key current features** (to keep):
- **Smart Block error mode**: cursor freezes on wrong key, must Backspace
- **Sliding viewport**: shows ~10 characters around cursor (EdClub-style box grid)
- **Virtual keyboard overlay**: finger-color-coded keys (Left Pinky=pink, Ring=blue, Middle=green, Index=orange, etc.)
- **SVG hand diagram**: animated finger glow on active finger
- **Graduation logic**: configurable via localStorage (`typeflow_custom_target_wpm`, `typeflow_custom_target_acc`), defaults to 25 WPM + 98% accuracy
- **Failed attempt hint**: after 2 failures, suggests lowering thresholds
- On graduation: calls `addXP()` + `updateDailyStreak()` + `saveLessonAttempt()`

### 2G. Current Routing (App.tsx)

| Route | Component |
|-------|-----------|
| `/` | `Dashboard` |
| `/test` | `TypingTest` |
| `/results` | `Results` |
| `/practice` | `Practice` |
| `/curriculum` | `Curriculum` |
| `/stage/:id` | `Learn` |
| `/progress` | `ProgressView` |
| `/about` | `About` |
| `/login` | `Login` |

### 2H. Existing Analytics Functions (analytics.ts — can reuse)

- `computeKeyAccuracyHeatmap(sessions)` — per-key accuracy
- `computeConsistencyScore(timeline)` — 100 - coefficient of variation
- `computeBigramLatencyMap(sessions)` — avg ms between adjacent key pairs
- `computeImprovementRate(sessions)` — % WPM change over time
- `computeAverageSessionDuration(sessions)` — mean duration

---

## 3. Current vs. Target Gap Analysis

### 3A. What Exists and Should Be Kept

| Capability | File | Status |
|-----------|------|--------|
| `TypingEngine` class (keypress, backspace, WPM, accuracy) | `typingEngine.ts` | ✅ Keep (used by TypingTest/Practice) |
| Learn.tsx own typing logic (smart block, keyboard, hands) | `Learn.tsx` | ✅ Keep & extend |
| `wpmTimeline: number[]` (per-second WPM snapshots) | `typingEngine.ts` | ✅ Keep |
| `keystrokeLog: KeystrokeEvent[]` | `typingEngine.ts` | ✅ Keep — feeds adaptive drills |
| `computeKeyAccuracyHeatmap`, `computeBigramLatencyMap` | `analytics.ts` | ✅ Keep — reuse for adaptive drills |
| XP formula: `wpm × (accuracy/100)² × (duration/10)` | `db.ts` | ✅ Keep |
| Level formula: `floor(√(xp/100)) + 1` | `db.ts` | ✅ Keep |
| Hard-block error model | `Learn.tsx` | ✅ Keep |
| Keyboard overlay with finger-color coding | `Learn.tsx` | ✅ Keep & extend |
| SVG hand diagram with finger glow | `Learn.tsx` | ✅ Keep & extend |
| Sound effects (key, error, success) | `soundManager.ts` | ✅ Keep |
| React Router navigation | `App.tsx` | ✅ Keep |
| Curriculum.tsx phase tabs + lock/unlock grid | `Curriculum.tsx` | ✅ Extend |
| ProgressView keyboard heatmap + sparkline | `ProgressView.tsx` | ✅ Extend |

### 3B. What Must Be Built (New)

| Feature | New/Modified File(s) | Priority |
|---------|---------------------|----------|
| 200-stage curriculum data | `lessonsData.ts` (REWRITE) | **P0** |
| Dynamic word generation engine | `wordEngine.ts` (NEW) | **P0** |
| Word corpus (7,000+ words) | `wordCorpus.ts` (NEW) | **P0** |
| Adaptive drill generator | `adaptiveDrillGenerator.ts` (NEW) | **P1** |
| Track-aware lesson resolver | `lessonEngine.ts` (NEW) | **P0** |
| Track selection onboarding | `App.tsx` + new route | **P0** |
| Badge system | `db.ts` + `Dashboard.tsx` + `ProgressView.tsx` | **P1** |
| Daily challenge system | `dailyChallenge.ts` (NEW) + `Dashboard.tsx` | **P2** |
| Metronome rhythm UI | `Learn.tsx` | **P1** |
| Consistency score as graduation gate | `Learn.tsx` + `lessonsData.ts` | **P1** |
| Certificate generation (HTML-to-canvas) | `certificateGenerator.ts` (NEW) | **P2** |
| Streak shield mechanic | `db.ts` | **P1** |
| Celebration animations (confetti, level-up) | `Learn.tsx` + CSS | **P1** |
| Keyboard unlock map (curriculum page) | `Curriculum.tsx` or `ProgressView.tsx` | **P1** |

### 3C. What Must Be Removed/Replaced

| Current | Replacement |
|---------|-------------|
| `generateCurriculum()` in `lessonsData.ts` — generates 500 stages via loop + padding | `LESSONS: Lesson[]` const array with 200 hand-crafted stages |
| `getDrillWords()` — random + tiny pool of ~130 words | `getDrillWords()` in new `wordEngine.ts` — deterministic, 7000+ word corpus, key-filtered |
| Simple `Lesson` interface (no gates, no XP, no tips) | Expanded `Lesson` interface with 12 fields |
| Graduation hardcoded to 25 WPM + 98% accuracy | Per-stage `LessonGraduationGate` with accuracy + WPM + consistency + maxErrors |
| Phase type `'numbers-symbols'` (never used) | Seven new phase types: foundation, vertical, coordination, numbers, symbols, integration, specialist |
| SEO text "500 Chapters" in `App.tsx` | Update to "200 Stages" |

---

## 4. New Files to Create

### 4A. `src/utils/wordCorpus.ts` — Word Database

**Purpose**: Embedded word corpus used by `wordEngine.ts` to generate drills dynamically.

**Requirements**:
- No external dependencies (pure TS `const` arrays)
- Must contain these categories:

```typescript
// src/utils/wordCorpus.ts

/** 500+ words: animals, colours, food, simple verbs, family, nature */
export const YOUNG_LEARNER_WORDS: string[] = [
  // Examples: "cat", "dog", "red", "run", "sun", "moon", "fish", "bird", "happy", "play"
  // Populate with REAL age-appropriate vocabulary (Oxford Reading Tree level)
];

/** Top 1000 most common English words (Oxford frequency list) */
export const COMMON_WORDS_1000: string[] = [
  // Examples: "the", "be", "to", "of", "and", "a", "in", "that", "have", "I"
];

/** Top 5000 English words (extends COMMON_WORDS_1000) — for Phases 5–6 */
export const COMMON_WORDS_5000: string[] = [];

/** 500+ formal/business vocabulary */
export const PROFESSIONAL_WORDS: string[] = [
  // Examples: "pursuant", "stakeholder", "deliverable", "implementation"
];

/** 200+ Python + JavaScript keywords */
export const PROGRAMMING_KEYWORDS: string[] = [
  // Examples: "def", "const", "return", "async", "import", "function", "class", "yield"
];

/** 100+ camelCase and snake_case identifiers */
export const CODE_IDENTIFIERS: string[] = [
  // Examples: "getUserData", "isActive", "parse_input", "max_retries"
];

/** 50+ terminal commands */
export const CLI_COMMANDS: string[] = [
  // Examples: "git push", "npm install", "cd ..", "ls -la", "mkdir src"
];

/** 100+ words with numbers */
export const NUMBER_EMBEDDED_WORDS: string[] = [
  // Examples: "step2", "v3.1", "form42", "room101", "level5"
];

/** 20+ pangram sentences (all 26 letters) */
export const PANGRAMS: string[] = [
  // Examples: "The quick brown fox jumps over the lazy dog"
];

// N-gram injection data (10% of every drill after Stage 020)
export const TOP_BIGRAMS = ['th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'es', 'en'] as const;
export const TOP_TRIGRAMS = ['the', 'and', 'ing', 'ion', 'tio', 'ent', 'ation', 'for', 'her', 'was'] as const;
export const SLOW_TRANSITION_PAIRS = ['qu', 'ck', 'bl', 'fr', 'sw', 'tw', 'gh', 'ph', 'wh', 'ch', 'sh'] as const;
export const FINGER_CROSSING_PAIRS = ['be', 'br', 've', 'vi', 'my', 'ny', 'by', 'gy', 'hy', 'ky'] as const;
```

**Developer Notes**:
- Populate each array with REAL words — do not auto-generate placeholder data
- Use reputable word frequency lists (e.g., Google Ngram, Oxford)
- Every word must be lowercase unless it's a proper noun in `PROFESSIONAL_WORDS`
- Total embedded size target: ~80–120 KB uncompressed (acceptable for a Vite bundle)
- No new npm dependencies — this is pure TS arrays

---

### 4B. `src/utils/wordEngine.ts` — Dynamic Word Filter

**Purpose**: Given a set of unlocked keys and a track, returns drill words that ONLY use those keys.

```typescript
// src/utils/wordEngine.ts

export type LessonTrack = 'young' | 'adult' | 'professional';

export interface WordPool {
  earlyWords: string[];     // 3-4 letter words
  midWords: string[];       // 5-7 letter words
  advancedWords: string[];  // 8+ letter words
  properNouns: string[];    // Capitalized names, places
  codeWords: string[];      // camelCase, snake_case, keywords
}

/**
 * Returns words that can be typed using ONLY the allowed character set.
 * 
 * @param allowedChars - All characters unlocked so far
 * @param focusChars - Keys introduced in THIS stage
 * @param count - Number of words to return
 * @param track - Vocabulary register ('young' | 'adult' | 'professional')
 * @returns Array of words, weighted: 60% focus-key words, 30% review words, 10% n-grams
 * 
 * CRITICAL RULE: Every returned word must contain ONLY characters from allowedChars.
 * Validate with: word.split('').every(ch => allowedChars.includes(ch))
 */
export function getDrillWords(
  allowedChars: string[],
  focusChars: string[],
  count: number,
  track: LessonTrack
): string[]

/**
 * Generates a drill string from word array, joining with spaces.
 * Optionally injects n-gram practice words (10% of total).
 */
export function generateDrillText(
  words: string[],
  injectNgrams: boolean,
  allowedChars: string[]
): string

/**
 * Filters the full corpus down to words using only allowedChars.
 * Caches results for performance (key: sorted allowed chars joined).
 */
export function filterWordsByKeys(
  corpus: string[],
  allowedChars: string[]
): string[]
```

**Implementation Notes**:
- The `getDrillWords` function is the HEART of the curriculum — it must be bulletproof
- Add runtime assertion: `if (result.some(w => !isValidForKeys(w, allowedChars))) throw Error`
- Cache filtered word lists per `allowedChars.sort().join('')` to avoid re-filtering on every call
- For early stages (< 6 keys unlocked), fall back to pseudo-word generation if real word pool < 10 words
- Pseudo-word generator: combine allowed chars into pronounceable 3–5 char combos
- Use a seeded random (or fixed seed per lessonId) to make drills deterministic per stage

---

### 4C. `src/utils/adaptiveDrillGenerator.ts` — Weakness Analysis

**Purpose**: Analyze past typing sessions to find the user's weakest keys and generate targeted drills.

```typescript
// src/utils/adaptiveDrillGenerator.ts

import type { KeystrokeEvent, TypingError } from './typingEngine';

export interface WeakSpot {
  key: string;
  errorRate: number;       // errors / total presses for this key
  avgLatencyMs: number;    // average deltaMs from keystrokeLog
  score: number;           // combined weakness score (higher = weaker)
}

/**
 * Analyses the last N sessions' keystroke logs to find the user's
 * 3 weakest keys (by combined error rate + latency score).
 * 
 * Algorithm:
 * 1. Aggregate all keystrokes across sessions
 * 2. For each unique key: calculate errorRate and avgLatencyMs
 * 3. Normalize both to 0-1 scale
 * 4. Combined score = 0.6 * normalizedErrorRate + 0.4 * normalizedLatency
 * 5. Return top 3 by score descending
 * 
 * NOTE: Requires ≥5 sessions of data. If fewer, return empty array
 * (adaptive lessons fall back to cumulative review)
 */
export function identifyWeakSpots(
  keystrokeLogs: KeystrokeEvent[][],
  errorLogs: TypingError[][]
): WeakSpot[]

/**
 * Generates a custom drill string targeting the given weak spots.
 * Mixes focus keys with their most common neighbor keys
 * to force problematic transitions.
 * 
 * @param weakSpots - Top 3 weak keys
 * @param unlockedKeys - All currently available keys  
 * @param wordCorpus - Available word pool
 * @param targetLength - Number of words in the drill (~45 words)
 */
export function generateAdaptiveDrill(
  weakSpots: WeakSpot[],
  unlockedKeys: string[],
  wordCorpus: string[],
  targetLength: number
): string

/**
 * Identifies the slowest bigram (two-key transition) from keystroke logs.
 * 
 * NOTE: Can reuse computeBigramLatencyMap from analytics.ts for raw data,
 * then find the max latency pair.
 */
export function findSlowestBigram(
  logs: KeystrokeEvent[]
): { bigram: string; avgMs: number } | null
```

---

### 4D. `src/utils/lessonEngine.ts` — Track-Aware Lesson Resolver

**Purpose**: Takes a raw `Lesson` definition and resolves it based on user's track, stats, and history.

```typescript
// src/utils/lessonEngine.ts

import type { Lesson, LessonTrack, LessonGraduationGate } from './lessonsData';
import type { UserStats } from '../services/db';
import type { KeystrokeEvent, TypingError } from './typingEngine';

export interface LessonEngineConfig {
  track: LessonTrack;
  currentStage: number;
  unlockedKeys: string[];
  userStats: UserStats;
  recentKeystrokeLogs?: KeystrokeEvent[][];  // For adaptive lessons
  recentErrorLogs?: TypingError[][];         // For adaptive lessons
}

export interface ResolvedLesson extends Lesson {
  resolvedTarget: string;              // Final drill text (never null)
  resolvedGate: LessonGraduationGate;  // Track-adjusted gate
  resolvedXp: number;                  // Streak-multiplied XP reward
}

/**
 * Resolves a lesson for the given track and user context.
 * 
 * Responsibilities:
 * 1. If lesson.target is null (adaptive lesson), generate content via adaptiveDrillGenerator
 * 2. If lesson.type is 'word-drill', regenerate drill words via wordEngine using track vocabulary
 * 3. Adjust graduation gate based on track:
 *    - Track 'young': accuracy × 0.95 (lower bar), remove WPM gate for Phase 1-2
 *    - Track 'adult': use gate as-is  
 *    - Track 'professional': accuracy × 1.03 (higher bar), WPM × 1.2
 * 4. Apply streak XP multiplier from UserStats
 */
export function resolveLesson(
  lesson: Lesson,
  config: LessonEngineConfig
): ResolvedLesson

/**
 * Returns track-specific display configuration for CSS and UI.
 */
export function getTrackConfig(track: LessonTrack): {
  fontSize: string;          // CSS variable value ('1.4rem' | '1.1rem' | '1rem')
  showHandGuide: boolean;    // Prominent for young, toggleable for adult, hidden for pro
  timePressure: boolean;     // false for young early phases
  displayMode: 'stars' | 'progress-bar' | 'efficiency-score';
  vocabularyPool: 'young' | 'common-1000' | 'professional';
}

/**
 * Calculates streak-multiplied XP.
 * 2-day: ×1.1, 7-day: ×1.25, 14-day: ×1.4, 30-day: ×1.5
 */
export function applyStreakMultiplier(baseXp: number, currentStreak: number): number
```

---

### 4E. `src/utils/dailyChallenge.ts` — Daily Challenge Generator (P2)

```typescript
// src/utils/dailyChallenge.ts

export interface DailyChallenge {
  id: string;                  // "2026-06-28"
  type: 'speed' | 'accuracy' | 'endurance' | 'symbol' | 'words';
  title: string;               // "60-Second Speed Burst"
  description: string;
  gate: { wpm?: number; accuracy?: number; duration?: number };
  xpReward: number;            // 100–500 XP
  bonusBadge?: string;
  content: string;             // The text to type
}

/**
 * Generates today's challenge deterministically from the date.
 * Rotation: Mon=Speed, Tue=Accuracy, Wed=Symbol, Thu=Endurance,
 * Fri=Words, Sat=Freestyle, Sun=Grand Review
 */
export function getTodaysChallenge(): DailyChallenge

/**
 * Check if today's challenge has already been completed.
 */
export function isChallengeCompleted(completedDate: string | null): boolean
```

---

## 5. Files to Modify

### 5A. `src/utils/lessonsData.ts` — FULL REWRITE

**Current**: 149 lines. `generateCurriculum()` returns 500 mechanical stages via loop + padding.

**Target**: Complete rewrite with:
1. New `Lesson` interface (expanded — see §8)
2. New `LessonType` union type (12 types)
3. New `LessonPhase` type (7 phases)
4. New `LessonGraduationGate` interface
5. `LESSONS: Lesson[]` — a **const** array of exactly **200 hand-crafted lesson definitions**
6. Keep exporting as `lessons` for backward compatibility: `export const lessons = LESSONS;`

**Critical backward compatibility note**:
> [!WARNING]  
> The `Curriculum.tsx` unlock logic checks if the **previous lesson's `id`** exists in the completed set. Lesson IDs must be sequential integers starting at 1. Existing users who have completed lessons 1–35 will retain their progress (those IDs still correspond to the first 35 stages).

**Phase Architecture** (200 stages, every stage must be unique and deliberate):

```
Phase 1: Anchor Foundation         [Stages 001–025]  ← Home Row + Space + Backspace
Phase 2: Vertical Reach            [Stages 026–065]  ← Top Row + Bottom Row keys
Phase 3: Rhythm & Coordination     [Stages 066–090]  ← Shift, CapsLock, bigrams, n-grams
Phase 4: Numbers Row               [Stages 091–115]  ← 1–0 with finger-column grouping
Phase 5: Symbols & Punctuation     [Stages 116–145]  ← All shift-symbols + punctuation
Phase 6: Real-World Integration    [Stages 146–175]  ← Sentences, paragraphs, speed runs
Phase 7: Specialist Tracks         [Stages 176–200]  ← Code, career prep, endurance
```

**For each stage, define ALL of these fields:**

```typescript
{
  id: 1,                    // Sequential 1-200
  phase: 'foundation',      // One of 7 phase types
  type: 'key-intro',        // One of 12 lesson types
  track: undefined,         // undefined = all tracks, or 'young'|'adult'|'professional'
  title: "Stage 001: Introducing F — Left Index Anchor",
  description: "Rest your left index finger on F. Feel the bump.",
  tip: "Rest your left index finger on F. Feel the bump.",
  target: "f ff fff f ff fff f",
  focusKeys: ['f'],
  unlockedKeys: ['f'],
  gate: { minAccuracy: 1.0 },     // Stage-specific gate
  xpReward: 15,
  badgeUnlock: undefined,          // or badge ID string
  metronomeBpm: undefined,         // or BPM number for rhythm lessons
  estimatedMinutes: 2
}
```

**Refer to the prompt's §4 for EXACT drill texts, gates, tips, and badge unlocks for all 200 stages.** The prompt has fully specified content for Phase 1 (25 stages), key introduction order for Phase 2 (40 stages), and detailed stage specs for Phases 3–7.

---

### 5B. `src/services/db.ts` — Schema Migration v4 → v5

**Current schema**: Version 4, tables: `tests`, `personalBests`, `lessons`, `userStats`

**Changes Required**:

1. **Add new tables**:
   - `badges` — Stores unlocked badges
   - `dailyChallenges` — Stores daily challenge completions
   - `keystrokeHistory` — Stores keystroke logs per lesson for adaptive analysis

2. **Extend `LessonAttempt` interface** (backward-compatible — new optional fields):
   - Add `wpm?: number`
   - Add `accuracy?: number`
   - Add `consistency?: number`
   - Add `passed?: boolean`
   - Add `xpEarned?: number`

3. **Extend `UserStats` interface**:
   - Add `selectedTrack?: LessonTrack` — user's chosen track (default: 'adult')
   - Add `streakShieldAvailable?: boolean` — earned at 7-day streak
   - Add `streakShieldUsedDate?: number | null`
   - Add `dailyChallengeLastCompleted?: string | null`

4. **Add new functions**:
   ```typescript
   // Badge CRUD
   saveBadge(badgeId: string, name: string): Promise<void>
   getBadges(): Promise<Badge[]>
   hasBadge(badgeId: string): Promise<boolean>
   
   // Keystroke history (for adaptive drills)
   saveKeystrokeHistory(lessonId: number, log: KeystrokeEvent[]): Promise<void>
   getRecentKeystrokeHistory(sessionCount: number): Promise<KeystrokeHistory[]>
   
   // Daily challenges
   saveDailyChallengeCompletion(result: DailyChallengeResult): Promise<void>
   getDailyChallengeCompletion(date: string): Promise<DailyChallengeResult | undefined>
   
   // Streak shield
   updateDailyStreakWithShield(): Promise<...>  // extend existing updateDailyStreak
   ```

5. **Version bump**: Add `this.version(5).stores({...})` with:
   ```javascript
   this.version(5).stores({
     tests: '++id, timestamp, duration, wpm, accuracy, consistencyScore',
     personalBests: 'duration, wpm, timestamp',
     lessons: '++id, lessonId, completedAt',
     userStats: 'id',
     badges: 'id, unlockedAt',                               // NEW
     dailyChallenges: '++id, challengeDate, timestamp',       // NEW
     keystrokeHistory: '++id, lessonId, timestamp'            // NEW
   }).upgrade(tx => {
     return tx.table('userStats').toCollection().modify(stats => {
       stats.selectedTrack = stats.selectedTrack || 'adult';
       stats.streakShieldAvailable = false;
       stats.streakShieldUsedDate = null;
       stats.dailyChallengeLastCompleted = null;
     });
   });
   ```

**New Interfaces to add to db.ts**:

```typescript
export interface Badge {
  id: string;           // e.g., 'home-row-master'
  name: string;         // e.g., '🏠 Home Row Master'
  unlockedAt: number;   // timestamp
}

export interface DailyChallengeResult {
  id?: number;
  challengeDate: string;    // "2026-06-28"
  type: 'speed' | 'accuracy' | 'endurance' | 'symbol' | 'words';
  wpm: number;
  accuracy: number;
  passed: boolean;
  xpEarned: number;
  timestamp: number;
}

export interface KeystrokeHistory {
  id?: number;
  lessonId: number;
  keystrokeLog: KeystrokeEvent[];
  timestamp: number;
}
```

---

### 5C. `src/components/Learn.tsx` — Major UI Overhaul

**Current**: 836 lines, handles single-format lessons with inline typing logic.

**Changes Required**:

1. **Track-aware rendering**:
   - Import `resolveLesson()` and `getTrackConfig()` from `lessonEngine.ts`
   - Apply CSS class `track-young` / `track-adult` / `track-professional` to root element
   - Adjust font size, hand guide visibility, and display mode per track

2. **12 lesson type renderers** — the component must handle each type differently:

   | Lesson Type | UI Behavior |
   |-------------|-------------|
   | `key-intro` | Single key highlight, finger glow on hand guide, coaching tip prominent |
   | `pair-drill` | Two keys highlighted, alternating hand animation |
   | `word-drill` | Standard typing area with dynamically generated words (from `wordEngine`) |
   | `sentence` | Sentence display with punctuation |
   | `paragraph` | Multi-sentence display, may need scroll support |
   | `speed-run` | Timer countdown visible, WPM displayed live during typing |
   | `accuracy-run` | Accuracy % displayed live, no timer pressure |
   | `rhythm` | **NEW**: Metronome visual pulse at `lesson.metronomeBpm` |
   | `adaptive` | **NEW**: Content generated at runtime by `adaptiveDrillGenerator`, shows "Targeting your weak keys: X, Y, Z" |
   | `cumulative` | Standard typing with "Review" badge visible |
   | `graduation` | Full test format: timer + WPM + accuracy + pass/fail gate |
   | `specialist` | Track-specific styling (code font for developer track) |

3. **Metronome component** (for `rhythm` lesson type):
   ```
   Visual: Pulsing circle that expands/contracts at BPM rate
   CSS: @keyframes pulse { 0% { scale(1) } 50% { scale(1.3) } 100% { scale(1) } }
   Duration: 60000 / bpm ms per cycle
   Position: Above the typing area, centered
   Text: "Match one keystroke to each pulse"
   ```

4. **Graduation gate expansion**:
   - Current: checks `accuracy >= threshold && wpm >= threshold`
   - New: also check `consistency >= minConsistency` (for rhythm lessons) and track `consecutiveErrors`
   - Results screen: show per-criterion pass/fail with ✅/❌ icons

5. **Celebration animations** on completion:
   - Stage complete: green ✅ + XP toast slide-up
   - Badge unlock: full-width animated gold banner ("🏆 Badge Unlocked: [Name]", 3s auto-dismiss)
   - Level up: full-screen flash + "LEVEL UP! → [Level Name]" + particle burst
   - 60 WPM first time: CSS confetti burst
   - Streak milestone (3/7/14/30): fire 🔥 emoji animation grows

6. **Lesson info header**: Show title, description, coaching tip, focus keys, gate requirements
7. **Handle `target: null`**: For adaptive lessons, call `generateAdaptiveDrill()` on mount

---

### 5D. `src/components/Curriculum.tsx` — Curriculum Browser Overhaul

**Current**: 121 lines, phase filter tabs, grid of stage cards with lock/unlock.

**Changes Required**:

1. **Phase tabs**: Update from 5 to 7 phases: Foundation, Vertical, Coordination, Numbers, Symbols, Integration, Specialist
2. **Keyboard unlock map** (top of curriculum page):
   - Full QWERTY keyboard visual
   - Locked keys: greyed out + lock icon
   - Unlocked keys: colored by finger assignment
   - Recently unlocked keys: glow animation
   - Determine unlocked keys from `LESSONS[highestUnlockedLesson].unlockedKeys`
3. **200 stage cards**: Add pagination or collapse by phase (10-20 cards visible at a time)
4. **Stage card info**: Show `estimatedMinutes`, `xpReward`, lesson type icon, badge icon if applicable
5. **Progress bar per phase**: Show "12/25 stages completed" for each phase

---

### 5E. `src/components/Dashboard.tsx` — Dashboard Enhancements

**Changes Required**:

1. **Track indicator**: Show selected track name/icon in hero section
2. **Daily challenge widget** (P2):
   - Card showing today's challenge type, title, description
   - "Start Challenge" button
   - If completed: show result + "Come back tomorrow"
3. **Badge showcase**: Display earned badges in a horizontal grid (first 6 + "See All" link)
4. **Streak shield indicator**: If `streakShieldAvailable`, show 🛡️ icon next to streak count
5. **Level names expansion** — extend existing level name map:
   ```
   Level 15: Speed Demon
   Level 20: Symbol Sorcerer
   Level 25: Code Slinger
   Level 30: TypeFlow Legend
   ```
6. **Consistency score**: Add to quick stats alongside WPM and Accuracy

---

### 5F. `src/components/ProgressView.tsx` — Progress Enhancements

**Changes Required**:

1. **Update curriculum module milestones**: 7 phases instead of current 5
2. **Badge collection section**: Grid of all 10 badges, earned = highlighted, unearned = show requirements
3. **Updated lesson count references**: Anywhere that counts or displays "500" → reflect new 200 count

---

### 5G. `src/App.tsx` — Routing & Onboarding

**Changes Required**:

1. **Track selection onboarding route** (e.g., `/onboarding`):
   - On first launch (no `UserStats.selectedTrack` in DB), redirect to onboarding
   - Three cards: Young Learner / General Adult / Professional Developer
   - Save selection to `UserStats` and redirect to `/curriculum`
2. **Pass track context**: Ensure Learn and Curriculum components can access selected track
3. **Update SEO metadata**: Change references from "500 Chapters" to "200 Stages"
4. **Add `/onboarding` route**

---

### 5H. `src/index.css` — CSS Additions

```css
/* Track-specific CSS variables */
.track-young {
  --lesson-font-size: 1.4rem;
  --hand-guide-opacity: 1;
  --accent-color: #FFB347;
}
.track-adult {
  --lesson-font-size: 1.1rem;
  --hand-guide-opacity: 0.7;
  --accent-color: #6C5CE7;
}
.track-professional {
  --lesson-font-size: 1rem;
  --hand-guide-opacity: 0;
  --accent-color: #00CEC9;
}

/* Metronome pulse animation */
@keyframes metronome-pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.4); opacity: 1; }
}
.metronome-dot {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--accent-color);
  animation: metronome-pulse var(--metronome-duration) ease-in-out infinite;
}

/* Celebration animations */
@keyframes badge-unlock-slide {
  0% { transform: translateY(-100%); opacity: 0; }
  10% { transform: translateY(0); opacity: 1; }
  90% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
}

@keyframes xp-toast-slide {
  0% { transform: translateY(100%); opacity: 0; }
  20% { transform: translateY(0); opacity: 1; }
  80% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

@keyframes level-up-flash {
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1.3); }
}

/* Keyboard unlock map */
.key-locked { opacity: 0.3; filter: grayscale(1); }
.key-unlocked { opacity: 1; filter: none; }
.key-just-unlocked {
  animation: key-glow 2s ease-out;
}
@keyframes key-glow {
  0% { box-shadow: 0 0 20px var(--accent-color); }
  100% { box-shadow: none; }
}
```

---

## 6. Database Schema Migration

### Current Schema (Version 4):
```javascript
this.version(4).stores({
  tests: '++id, timestamp, duration, wpm, accuracy, consistencyScore',
  personalBests: 'duration, wpm, timestamp',
  lessons: '++id, lessonId, completedAt',
  userStats: 'id'
});
```

### Target Schema (Version 5):
```javascript
this.version(5).stores({
  tests: '++id, timestamp, duration, wpm, accuracy, consistencyScore',
  personalBests: 'duration, wpm, timestamp',
  lessons: '++id, lessonId, completedAt',
  userStats: 'id',
  badges: 'id, unlockedAt',                                // NEW
  dailyChallenges: '++id, challengeDate, timestamp',        // NEW
  keystrokeHistory: '++id, lessonId, timestamp'             // NEW
}).upgrade(tx => {
  return tx.table('userStats').toCollection().modify(stats => {
    stats.selectedTrack = stats.selectedTrack || 'adult';
    stats.streakShieldAvailable = false;
    stats.streakShieldUsedDate = null;
    stats.dailyChallengeLastCompleted = null;
  });
});
```

### Migration Safety:
- Existing `lessons` table (LessonAttempts) remains untouched — lesson IDs 1–115 still valid
- No data loss — all existing test results and stats preserved
- New UserStats fields added with safe defaults via upgrade function
- New tables start empty

---

## 7. Detailed Implementation Tasks

### Task 1: Word Corpus & Engine (P0) — ~2 days

| Step | File | Action |
|------|------|--------|
| 1.1 | `src/utils/wordCorpus.ts` | **CREATE**. Populate all word arrays (see §4A). Minimum: 500 young learner + 1000 common + 200 programming + 100 code identifiers + 50 CLI + 20 pangrams + bigram/trigram arrays |
| 1.2 | `src/utils/wordEngine.ts` | **CREATE**. Implement `getDrillWords()`, `generateDrillText()`, `filterWordsByKeys()`. Add caching. Add pseudo-word fallback for early stages |
| 1.3 | — | **TEST**: Verify `getDrillWords` NEVER returns words with chars outside `allowedChars`. Test with only 2 keys unlocked (edge case) |

### Task 2: Lesson Data Rewrite (P0) — ~3 days

| Step | File | Action |
|------|------|--------|
| 2.1 | `src/utils/lessonsData.ts` | **FULL REWRITE**. Define new interfaces. Create `LESSONS` array with 200 stages. Export as `lessons` for backward compat |
| 2.2 | — | Phase 1 (001–025): Use EXACT drills from prompt §4 Phase 1 |
| 2.3 | — | Phase 2 (026–065): Follow key intro order from prompt. Use new-key stage template |
| 2.4 | — | Phase 3 (066–090): Shift, CapsLock, Enter, N-grams, rhythm, adaptive |
| 2.5 | — | Phase 4 (091–115): Number keys in finger-column pairs |
| 2.6 | — | Phase 5 (116–145): Symbols in 4 clusters (writing, math, brackets, code) |
| 2.7 | — | Phase 6 (146–175): Paragraphs, speed ladder, consistency, endurance |
| 2.8 | — | Phase 7 (176–200): 3 specialist sub-tracks |
| 2.9 | — | **VALIDATE**: Every ID unique 1–200, every word drill uses only `unlockedKeys`, every gate achievable in 3–10 min, `unlockedKeys` is monotonically growing |

### Task 3: Lesson Engine & Track System (P0) — ~2 days

| Step | File | Action |
|------|------|--------|
| 3.1 | `src/utils/lessonEngine.ts` | **CREATE**. Implement `resolveLesson()`, `getTrackConfig()`, `applyStreakMultiplier()` |
| 3.2 | `src/services/db.ts` | **MODIFY**. Add `selectedTrack` to UserStats. Bump schema to v5. Add badge/keystrokeHistory functions |
| 3.3 | `src/App.tsx` | **MODIFY**. Add `/onboarding` route. Redirect on first launch. Update SEO text |
| 3.4 | `src/components/Learn.tsx` | **MODIFY**. Import `resolveLesson()`. Apply track CSS class. Use resolved gate for graduation |
| 3.5 | `src/index.css` | **MODIFY**. Add `.track-young`, `.track-adult`, `.track-professional` CSS variables |

### Task 4: Learn.tsx Lesson Types (P0) — ~3 days

| Step | File | Action |
|------|------|--------|
| 4.1 | `Learn.tsx` | Add conditional rendering per `lesson.type` (12 types — see §5C.2 table) |
| 4.2 | `Learn.tsx` | Implement metronome component (visual pulse for `rhythm` type) |
| 4.3 | `Learn.tsx` | Expand graduation gate: add consistency check + maxConsecutiveErrors tracking |
| 4.4 | `Learn.tsx` | Update results screen: per-criterion pass/fail icons, badge unlock banner |
| 4.5 | `Learn.tsx` | Add lesson info header: title, description, tip, focus keys mini-strip, gate requirements |
| 4.6 | `Learn.tsx` | Handle `target: null` adaptive lessons (call `generateAdaptiveDrill` on mount) |

### Task 5: Database Migration (P0) — ~1 day

| Step | File | Action |
|------|------|--------|
| 5.1 | `db.ts` | Add `badges`, `dailyChallenges`, `keystrokeHistory` table declarations + Dexie stores |
| 5.2 | `db.ts` | Add Badge interface + `saveBadge()`, `getBadges()`, `hasBadge()` |
| 5.3 | `db.ts` | Add KeystrokeHistory interface + `saveKeystrokeHistory()`, `getRecentKeystrokeHistory()` |
| 5.4 | `db.ts` | Extend UserStats with `selectedTrack`, `streakShieldAvailable`, `streakShieldUsedDate` |
| 5.5 | `db.ts` | Add streak shield logic: modify `updateDailyStreak()` to check shield before resetting |

### Task 6: Curriculum.tsx & ProgressView.tsx (P1) — ~2 days

| Step | File | Action |
|------|------|--------|
| 6.1 | `Curriculum.tsx` | Update phase tabs: 7 phases instead of 5 |
| 6.2 | `Curriculum.tsx` | Add keyboard unlock map component at top of page |
| 6.3 | `Curriculum.tsx` | Add pagination/collapse for 200 stages. Show xpReward, estimatedMinutes, type icon on cards |
| 6.4 | `ProgressView.tsx` | Update curriculum milestone rings for 7 phases |
| 6.5 | `ProgressView.tsx` | Add badge collection section |

### Task 7: Adaptive Drill Generator (P1) — ~1 day

| Step | File | Action |
|------|------|--------|
| 7.1 | `adaptiveDrillGenerator.ts` | **CREATE**. Implement `identifyWeakSpots()`, `generateAdaptiveDrill()`, `findSlowestBigram()` |
| 7.2 | `Learn.tsx` | Wire: on lesson load, if `type === 'adaptive'` and `target === null`, call generator with recent history |
| 7.3 | `db.ts` | Ensure `saveKeystrokeHistory()` is called after each lesson completion in Learn.tsx |

### Task 8: Gamification — Badges & Celebrations (P1) — ~2 days

| Step | File | Action |
|------|------|--------|
| 8.1 | `Learn.tsx` | On completion: check `lesson.badgeUnlock`, call `saveBadge()` if not earned, trigger badge animation |
| 8.2 | `Learn.tsx` | Add XP toast animation (CSS slide-up from bottom-right) |
| 8.3 | `Learn.tsx` | Add level-up detection: compare level before/after `addXP()`, trigger full-screen flash |
| 8.4 | `Dashboard.tsx` | Add badge showcase (first 6 earned badges) |
| 8.5 | `Dashboard.tsx` | Extend level names to Level 30 |
| 8.6 | `Dashboard.tsx` | Add streak shield 🛡️ indicator |
| 8.7 | `index.css` | Add all celebration animation CSS (see §5H) |

### Task 9: Daily Challenge System (P2) — ~2 days

| Step | File | Action |
|------|------|--------|
| 9.1 | `src/utils/dailyChallenge.ts` | **CREATE**. Day-of-week rotation, deterministic challenge generation |
| 9.2 | `Dashboard.tsx` | Add daily challenge card widget |
| 9.3 | `db.ts` | Wire `saveDailyChallengeCompletion()` |

### Task 10: Certificate Generation (P2) — ~1 day

| Step | File | Action |
|------|------|--------|
| 10.1 | `src/utils/certificateGenerator.ts` | **CREATE**. Use `<canvas>` API to draw certificate with user name, WPM, accuracy, date. Export as PNG download |
| 10.2 | `Learn.tsx` | On Stage 182/200 completion, show "Download Certificate" button |

### Task 11: Typing DNA Visualization (P3) — ~2 days

| Step | File | Action |
|------|------|--------|
| 11.1 | `ProgressView.tsx` | After 10+ sessions, render SVG chord diagram of 5 slowest key transitions |
| 11.2 | `adaptiveDrillGenerator.ts` | Add function to compute all bigram transition speeds for chord diagram data |

---

## 8. TypeScript Interfaces (Complete, Compilable)

All new/modified interfaces required across the codebase:

```typescript
// ============================================================
// src/utils/lessonsData.ts — NEW Interfaces
// ============================================================

export type LessonTrack = 'young' | 'adult' | 'professional';

export type LessonType =
  | 'key-intro'       // Introducing 1-2 new keys
  | 'pair-drill'      // Bilateral coordination (two keys)
  | 'word-drill'      // Real or pseudo words using unlocked keys
  | 'sentence'        // Full sentences with punctuation
  | 'paragraph'       // Multi-sentence passages
  | 'speed-run'       // Timed WPM gate
  | 'accuracy-run'    // High accuracy gate (no speed pressure)
  | 'rhythm'          // Metronome/consistency training
  | 'adaptive'        // Engine-generated based on errorLog
  | 'cumulative'      // Review of all learned keys
  | 'graduation'      // Phase exit test
  | 'specialist';     // Career track content

export type LessonPhase =
  | 'foundation'      // Phase 1: Stages 001–025
  | 'vertical'        // Phase 2: Stages 026–065
  | 'coordination'    // Phase 3: Stages 066–090
  | 'numbers'         // Phase 4: Stages 091–115
  | 'symbols'         // Phase 5: Stages 116–145
  | 'integration'     // Phase 6: Stages 146–175
  | 'specialist';     // Phase 7: Stages 176–200

export interface LessonGraduationGate {
  minAccuracy: number;             // e.g., 0.95 (95%)
  minWpm?: number;                 // e.g., 25 (optional for some lesson types)
  minConsistency?: number;         // e.g., 0.70 (only for rhythm lessons)
  maxConsecutiveErrors?: number;   // e.g., 3
}

export interface Lesson {
  id: number;                      // Sequential 1-200
  phase: LessonPhase;
  type: LessonType;
  track?: LessonTrack;            // undefined = all tracks
  title: string;
  description: string;
  tip?: string;                    // Single coaching tip shown above drill
  target: string | null;           // null for adaptive lessons (generated at runtime)
  focusKeys: string[];
  unlockedKeys: string[];          // All keys available by this stage (monotonically growing)
  gate: LessonGraduationGate;
  xpReward: number;
  badgeUnlock?: string;            // Badge ID to award on completion
  metronomeBpm?: number;           // Only for rhythm lesson types
  estimatedMinutes: number;        // Display: "~3 min"
}


// ============================================================
// src/utils/wordEngine.ts — Interfaces
// ============================================================

export interface WordPool {
  earlyWords: string[];       // 3-4 letter words
  midWords: string[];         // 5-7 letter words
  advancedWords: string[];    // 8+ letter words
  properNouns: string[];      // Capitalized names, places
  codeWords: string[];        // camelCase, snake_case, keywords
}


// ============================================================
// src/utils/adaptiveDrillGenerator.ts — Interfaces
// ============================================================

export interface WeakSpot {
  key: string;
  errorRate: number;          // errors / total presses
  avgLatencyMs: number;       // average deltaMs from keystrokeLog
  score: number;              // combined weakness score (higher = weaker)
}


// ============================================================
// src/utils/lessonEngine.ts — Interfaces
// ============================================================

export interface LessonEngineConfig {
  track: LessonTrack;
  currentStage: number;
  unlockedKeys: string[];
  userStats: UserStats;
  recentKeystrokeLogs?: KeystrokeEvent[][];
  recentErrorLogs?: TypingError[][];
}

export interface ResolvedLesson extends Lesson {
  resolvedTarget: string;                  // Final drill text (never null)
  resolvedGate: LessonGraduationGate;      // Track-adjusted gate
  resolvedXp: number;                      // Streak-multiplied XP reward
}


// ============================================================
// src/services/db.ts — NEW Interfaces (add to existing file)
// ============================================================

export interface Badge {
  id: string;                 // e.g., 'home-row-master'
  name: string;               // e.g., '🏠 Home Row Master'
  unlockedAt: number;         // timestamp
}

export interface DailyChallengeResult {
  id?: number;
  challengeDate: string;      // "2026-06-28"
  type: 'speed' | 'accuracy' | 'endurance' | 'symbol' | 'words';
  wpm: number;
  accuracy: number;
  passed: boolean;
  xpEarned: number;
  timestamp: number;
}

export interface KeystrokeHistory {
  id?: number;
  lessonId: number;
  keystrokeLog: KeystrokeEvent[];
  timestamp: number;
}

// EXTENDED UserStats (add fields to existing interface):
export interface UserStats {
  id: string;                                  // "current_user"
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveTimestamp: number;
  unlockedThemes: string[];
  activeTheme: string;
  // --- NEW FIELDS ---
  selectedTrack?: LessonTrack;                // default: 'adult'
  streakShieldAvailable?: boolean;            // earned at 7-day streak
  streakShieldUsedDate?: number | null;
  dailyChallengeLastCompleted?: string | null; // ISO date string
}

// EXTENDED LessonAttempt (add optional fields for backward compat):
export interface LessonAttempt {
  id?: number;
  lessonId: number;
  completedAt: Date;
  errorsCount: number;
  durationSeconds: number;
  // --- NEW OPTIONAL FIELDS ---
  wpm?: number;
  accuracy?: number;
  consistency?: number;
  passed?: boolean;
  xpEarned?: number;
}


// ============================================================
// src/utils/dailyChallenge.ts — Interfaces
// ============================================================

export interface DailyChallenge {
  id: string;                  // "2026-06-28"
  type: 'speed' | 'accuracy' | 'endurance' | 'symbol' | 'words';
  title: string;
  description: string;
  gate: { wpm?: number; accuracy?: number; duration?: number };
  xpReward: number;
  bonusBadge?: string;
  content: string;             // The text to type
}
```

---

## 9. UI/UX Changes

### 9A. Track Selection Onboarding Flow

**When**: First app launch (no `UserStats.selectedTrack` in DB)
**Route**: `/onboarding`

```
┌─────────────────────────────────────────────────────┐
│              Welcome to TypeFlow! 🎹                │
│                                                     │
│    Choose your learning track:                      │
│                                                     │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐       │
│  │  🧒     │  │  👤      │  │  💻         │       │
│  │ Young   │  │ General  │  │ Professional│       │
│  │ Learner │  │ Adult    │  │ Developer   │       │
│  │         │  │          │  │             │       │
│  │ Ages    │  │ Ages     │  │ Ages 18+    │       │
│  │ 6-12    │  │ 13-45    │  │             │       │
│  │         │  │          │  │ Code syntax │       │
│  │ Animals │  │ Common   │  │ camelCase   │       │
│  │ & stars │  │ English  │  │ CLI cmds    │       │
│  │ no time │  │ XP+level │  │ Efficiency  │       │
│  │ pressure│  │ streaks  │  │ Score       │       │
│  │ 90% acc │  │ 95% acc  │  │ 98% acc     │       │
│  └─────────┘  └──────────┘  └─────────────┘       │
│                                                     │
│  You can change your track later in Settings.       │
└─────────────────────────────────────────────────────┘
```

---

### 9B. Metronome Visual Component

**When**: `lesson.type === 'rhythm'` and `lesson.metronomeBpm` is defined

```
          ● ← pulsing circle (CSS animation at BPM rate)
     "Match one keystroke to each pulse"
     
     BPM: [60] [80] [100] [120]
```

**Implementation**: Set `--metronome-duration: ${60000 / bpm}ms` as inline CSS variable, apply to `.metronome-dot`.

---

### 9C. Keyboard Unlock Map (Curriculum.tsx — top of page)

```
┌──────────────────────────────────────────────┐
│  Your Keyboard Progress                      │
│                                              │
│  ░Q░ ░W░ █E█ █R█ █T█   █Y█ █U█ █I█ ░O░ ░P░│
│  █A█ █S█ █D█ █F█ █G█   █H█ █J█ █K█ █L█ █;█│
│  ░Z░ ░X░ ░C░ ░V░ ░B░   ░N░ ░M░ ░,░ ░.░ ░/░│
│                                              │
│  █ = Unlocked    ░ = Locked    ✨ = New      │
│  26/52 keys unlocked                        │
└──────────────────────────────────────────────┘
```

**Implementation**:
- Determine `highestCompletedLesson` from DB
- Look up `LESSONS[highestLesson].unlockedKeys` to get unlocked key set
- Render QWERTY grid with `.key-locked` / `.key-unlocked` / `.key-just-unlocked` CSS classes

---

### 9D. Celebration Animations Summary

| Event | Animation | Duration | CSS Class / Implementation |
|-------|-----------|----------|---------------------------|
| Stage complete | Green ✅ fade-in + XP toast slide-up | 2s | `.xp-toast` with `xp-toast-slide` animation |
| Badge unlock | Full-width gold banner from top | 3s auto-dismiss | `.badge-banner` with `badge-unlock-slide` |
| Level up | Full-screen flash + text + particles | 3s | `.level-up-overlay` with `level-up-flash` |
| 60 WPM first time | CSS confetti (colored divs animated) | 4s | Pure CSS — 20-30 small `<div>`s with random animation |
| Streak milestone | Fire 🔥 emoji scale animation | 2s | Scale transform from 1→1.5→1 |

All pure CSS + JS triggers — **no animation library needed**.

---

### 9E. Daily Challenge Widget (Dashboard — P2)

```
┌────────────────────────────────────┐
│  📅 Daily Challenge — Thursday     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🏃 Endurance Run                  │
│  "Type for 5 minutes continuously" │
│                                    │
│  Goal: Complete the full 5 minutes │
│  Reward: +250 XP                   │
│                                    │
│  [ Start Challenge ]               │
└────────────────────────────────────┘
```

---

## 10. Implementation Priority

### P0 — Must Ship (v2 Launch) — ~11 dev days

| # | Task | Est. Days | Dependencies |
|---|------|-----------|-------------|
| 1 | Word Corpus + Word Engine | 2 | None |
| 2 | Lesson Data Rewrite (200 stages) | 3 | Word Engine |
| 3 | Lesson Engine (track resolver) | 2 | Lessons Data |
| 4 | DB Migration v4→v5 | 1 | None |
| 5 | Learn.tsx — 12 lesson type renderers + gates | 3 | Lesson Engine + DB |
| — | Track selection onboarding (App.tsx) | (incl.) | DB migration |

### P1 — Ship within 30 days — ~8 dev days

| # | Task | Est. Days | Dependencies |
|---|------|-----------|-------------|
| 6 | Adaptive Drill Generator | 1 | DB (keystroke history) |
| 7 | Metronome Component | 0.5 | Learn.tsx |
| 8 | Gamification (badges + celebrations) | 2 | DB (badges table) |
| 9 | Dashboard Enhancements | 1 | Badges |
| 10 | Curriculum.tsx overhaul (7 phases + keyboard map) | 2 | Lessons Data |
| 11 | ProgressView updates | 1 | Lessons Data |
| 12 | Streak Shield | 0.5 | DB |

### P2 — Ship within 90 days — ~5 dev days

| # | Task | Est. Days | Dependencies |
|---|------|-----------|-------------|
| 13 | Daily Challenge System | 2 | DB + Word Engine |
| 14 | Certificate Generator (HTML-to-Canvas) | 1 | Stage 182/200 |
| 15 | Young Learner polish (mascot, stars-not-WPM) | 2 | Track system |

### P3 — Future Backlog

| Task | Est. Days |
|------|-----------|
| Typing DNA Chord Diagram | 2 |
| Parent & Child Race Mode | 3 |
| Metronome audio tick | 0.5 |

**Total estimate**: ~24 dev days (P0+P1+P2)

---

## 11. Testing & Verification Plan

### 11A. Automated Checks

| Check | Criteria |
|-------|----------|
| Word filter integrity | `getDrillWords()` NEVER returns words with chars outside `allowedChars` |
| Lesson ID uniqueness | All 200 lesson IDs are unique sequential integers 1–200 |
| UnlockedKeys monotonic | `LESSONS[n].unlockedKeys` is always a superset of `LESSONS[n-1].unlockedKeys` |
| Gate achievability | Every `minAccuracy ≤ 1.0`, every `minWpm` is reasonable for the phase |
| Phase boundaries | Phase stages contiguous: foundation=1-25, vertical=26-65, coordination=66-90, etc. |
| Track gate adjustment | Young gates ≤ adult gates ≤ professional gates |
| DB migration | v4→v5 preserves all data, adds defaults for new fields |
| Adaptive fallback | Adaptive lessons with < 5 sessions of history fall back to cumulative review |
| No new npm deps | `package.json` dependencies unchanged |

### 11B. Manual Testing Checklist

- [ ] First launch → redirected to `/onboarding` → track selection works → saves to DB
- [ ] Second launch → goes straight to Dashboard (no onboarding)
- [ ] Complete Stage 001 → Stage 002 unlocks in Curriculum
- [ ] Complete Stage 025 → "🏠 Home Row Master" badge banner appears
- [ ] Rhythm lesson → metronome pulses at correct BPM
- [ ] Adaptive lesson (after 5+ completed lessons) → targets actual weak keys
- [ ] Stage 155 (first 60 WPM) → confetti animation triggers
- [ ] Stage 182 → "Download Certificate" button appears
- [ ] Stage 200 → "TypeFlow Graduate" badge + all themes unlocked
- [ ] 7-day streak → shield 🛡️ icon appears
- [ ] Break streak with shield available → streak preserved, shield consumed
- [ ] Switch track in Settings → gates, vocabulary, font size change
- [ ] Curriculum page → keyboard unlock map shows correct locked/unlocked keys
- [ ] ProgressView → badge collection shows earned/unearned badges
- [ ] Level up → full-screen animation + new level name
- [ ] Existing user with progress → migration preserves completed lessons 1-35

### 11C. Build Verification

```bash
# TypeScript strict mode — no errors
npx tsc --noEmit

# Run dev server — no console errors
npm run dev

# Run unit tests
npx vitest run

# Build production bundle — no failures
npm run build

# Run E2E tests (if Playwright configured)
npx playwright test
```

---

## Appendix A: Badge Catalogue

| Badge ID | Emoji | Name | Trigger | XP | Theme Unlock |
|----------|-------|------|---------|-----|-------------|
| `home-row-master` | 🏠 | Home Row Master | Complete Stage 025 | +200 | "Sepia" |
| `top-row-master` | ⬆️ | Top Row Master | Complete Stage 040 | +150 | — |
| `full-alphabet` | 🔤 | Alphabet Complete | Complete Stage 055 | +300 | "Forest" |
| `shift-shifter` | ⬆️ | Shift Shifter | Complete Stage 090 | +400 | "Neon" |
| `number-cruncher` | 🔢 | Number Cruncher | Complete Stage 115 | +300 | "Retro Terminal" |
| `symbol-master` | #️⃣ | Symbol Master | Complete Stage 145 | +500 | "Cyberpunk" |
| `sixty-wpm` | 🚀 | 60 WPM Club | First test ≥ 60 WPM (Stage 155) | +1000 | "Gold" |
| `certified-typist` | 📜 | Certified Typist | Pass Stage 182 | — | Certificate |
| `keyboard-ninja` | 🥷 | Keyboard Ninja | Pass Stage 192 | — | "Hacker" |
| `typeflow-graduate` | 🎓 | TypeFlow Graduate | Complete Stage 200 | — | All themes |

---

## Appendix B: File Change Summary

| File | Action | Est. Lines |
|------|--------|-----------|
| `src/utils/wordCorpus.ts` | **CREATE** | ~2,000–3,000 |
| `src/utils/wordEngine.ts` | **CREATE** | ~150–200 |
| `src/utils/adaptiveDrillGenerator.ts` | **CREATE** | ~120–150 |
| `src/utils/lessonEngine.ts` | **CREATE** | ~100–130 |
| `src/utils/dailyChallenge.ts` | **CREATE** (P2) | ~80–100 |
| `src/utils/lessonsData.ts` | **FULL REWRITE** | ~1,500–2,000 |
| `src/services/db.ts` | **MODIFY** | +150–200 |
| `src/components/Learn.tsx` | **MAJOR MODIFY** | +300–400 |
| `src/components/Curriculum.tsx` | **MODIFY** | +150–200 |
| `src/components/Dashboard.tsx` | **MODIFY** | +100–150 |
| `src/components/ProgressView.tsx` | **MODIFY** | +100–150 |
| `src/App.tsx` | **MODIFY** | +50–80 |
| `src/index.css` | **MODIFY** | +150–200 |

**Total new/modified code**: ~5,000–7,000 lines

---

## Appendix C: Key Constraints (from prompt §10)

- ✅ Every stage must have a unique `id` — no duplicate drill texts or purposes
- ✅ No stage is padding — every stage must have a clear pedagogical reason
- ✅ Word drills contain ONLY unlocked keys — validate against `unlockedKeys[]`
- ✅ No external libraries for curriculum content — word corpus in `wordCorpus.ts` as TS const
- ✅ All gates achievable in 3–10 minutes for target skill level
- ✅ Phase 1–2 content usable by a 7-year-old (Track A) without adult help
- ✅ Phase 7C content must challenge a developer at 50 WPM
- ✅ 200 is a quality target, not 500 filler stages
- ✅ All TypeScript must be strict-mode compatible — no `any` without justification
- ✅ No new npm dependencies

---

> **Note to Developer**: This plan derives from the full [`typeflow_curriculum_design_prompt.md`](file:///c:/Users/ATPLGCC0569/Downloads/TypeFlow-main/TypeFlow-main/typeflow_curriculum_design_prompt.md). Refer to that document for exact drill texts for all 200 stages, precise key introduction sequences, and the complete pedagogical rationale. This implementation plan translates those requirements into actionable code tasks with accurate file paths, interfaces, and priorities based on the **actual current codebase state**.
