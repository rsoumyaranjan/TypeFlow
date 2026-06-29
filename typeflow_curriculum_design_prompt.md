# TypeFlow — Expert Curriculum Design & Engine Prompt
## "From Zero to 60+ WPM: Build the World's Best Typing Learning Curve"

> **Who this is for**: A senior curriculum designer + full-stack engineer with deep knowledge of
> EdTech pedagogy, cognitive science (spaced repetition, deliberate practice), typing platform
> market research, and React/TypeScript implementation.
>
> **Your mandate**: Read the entire TypeFlow codebase, run deep market research on every major
> competitor, and design the most comprehensive, engaging, scientifically-grounded typing curriculum
> ever built into a web app — from a 6-year-old school child picking up a keyboard for the first
> time to a professional aiming for 80+ WPM. Cover every key on the board. Make it stick.

---

## 0. Full Codebase Read — Required Before Any Design Work

Read these files completely before writing a single curriculum stage:

| File | What to understand |
|------|--------------------|
| `src/utils/lessonsData.ts` | Current 500-stage generator (it is a mechanical loop — not a real curriculum) |
| `src/utils/typingEngine.ts` | Engine: `handleKeyPress`, `handleBackspace`, `wpmTimeline`, `getNetWPM`, `getAccuracy`, `getMissedWords` |
| `src/components/Learn.tsx` (836 lines) | Full lesson UX: keyboard overlay, finger color map, graduation gate, hard-block error model |
| `src/services/db.ts` | `LessonAttempt` schema, `saveLessonAttempt`, `getLessonAttempts`, `UserStats` (xp/level/streak) |
| `src/components/ProgressView.tsx` | How curriculum progress rings are currently displayed |
| `src/components/Dashboard.tsx` | How the user re-enters the curriculum |
| `curriculum_design.md` | Previous 35-stage design (superseded — use as reference only) |
| `COMPETITOR_RESEARCH.md` | Full competitive matrix: Monkeytype, Keybr, TypingClub, TypeRacer, NitroType, 10FastFingers, TypeLit |
| `typeflow_product_enhancement_blueprint.md` | Existing gamification blueprint (XP formula, themes, streak system) |

**Existing engine capabilities you must use (not reinvent):**
- `wpmTimeline: number[]` — per-second WPM snapshots already emitted every 1000ms
- `errorLog: TypingError[]` — `{wordIndex, charIndex, expected, actual, timestamp}` per error
- `keystrokeLog: KeystrokeEvent[]` — `{key, target, wordIndex, charIndex, timestamp, deltaMs, status}`
- `getMissedWords()` — returns array of words typed incorrectly
- `UserStats` in IndexedDB: `{xp, level, currentStreak, longestStreak, lastActiveTimestamp, unlockedThemes}`
- XP formula: `round(WPM × (acc/100)² × dur/10)` — level = `floor(√(xp/100)) + 1`

---

## 1. Market Research Mandate

Before designing a single lesson, research these specific questions across competitors:

### 1A. Curriculum Architecture Research

| Question | Why it matters |
|----------|---------------|
| How many stages does TypingClub use and at what pacing does it introduce keys? | Benchmark for lesson granularity |
| What is Keybr's exact key-unlock algorithm? (Bayesian confidence, target WPM, error rate threshold) | Adaptive unlock reference |
| Does Typing.com separate "Beginner / Intermediate / Advanced" into measurable stage gates? | Multi-tier audience model |
| What word corpora does each platform use in early lessons? (pseudo-words vs real words) | Real-word vs. phonetic drill debate |
| At what stage does each platform introduce numbers, symbols, and Shift? | Key introduction order benchmark |
| Does any competitor teach `CapsLock`, `Tab`, `Backspace`, `Enter` as deliberate skill objects? | Gap identification |
| Does any competitor have a dedicated "Programmer Typing" track? | Niche opportunity |
| Does any competitor teach typing rhythm / metronome practice? | Unique differentiator check |

### 1B. Gamification & Retention Research

| Question | Why it matters |
|----------|---------------|
| How does Duolingo's streak system drive DAU (Daily Active Users)? | Gold standard retention reference |
| How does NitroType's car upgrade economy keep students logging in daily? | Game loop reference |
| What badge/star system does TypingClub use and at what thresholds? | Achievement granularity |
| How does Keybr's "confidence score" bar create a dopamine loop? | Progress bar psychology |
| What is the average lesson completion rate on TypingClub vs Keybr? (if public data exists) | Drop-off benchmark |
| Has any platform successfully combined structured curriculum + Monkeytype-style speed tests? | Hybrid product gap |

### 1C. Uniqueness Gap Audit

After your research, answer definitively: **What has NO competitor done well?**

Expected answers (verify or disprove each with evidence):
1. A curriculum that explicitly teaches finger-to-key muscle memory for `Backspace`, `Enter`, `Tab`, and `CapsLock` as first-class skills
2. Word drills that are 100% restricted to unlocked keys (dynamically generated, not static)
3. A "bigram mastery" mode (practicing the 50 most common English letter pairs — `th`, `he`, `in`, `er`, etc.)
4. A "typing rhythm" lesson using visual BPM metronome to cure erratic speed bursts
5. A dedicated career-track: "Job Interview Prep" (60 WPM certification-style test)
6. A dedicated career-track: "Programmer Speed" (symbols, brackets, camelCase, snake_case)
7. A no-frustration "Young Learner" mode with larger font, animal-themed words, and longer time limits
8. A "Parent & Child" mode where two people can race together on the same screen
9. A concept of "Typing DNA" — a personal fingerprint of your slowest key transitions shown as a chord diagram

---

## 2. Pedagogical Framework (Non-Negotiable Principles)

Every curriculum stage you design MUST honour all of the following cognitive science principles:

### 2A. Deliberate Practice Model (Anders Ericsson)
- Each stage targets ONE skill just outside the learner's comfort zone — not too easy, not impossible
- The stage ends when the learner can perform the skill consistently (not just once)
- No stage should feel like "random typing" — every character in the drill must have a reason

### 2B. Spaced Repetition (Ebbinghaus Forgetting Curve)
- Keys introduced in Stage N must reappear in Stages N+3, N+8, N+20
- Word drills always include a mix: 60% new-key focus, 30% previously learned keys, 10% high-frequency English n-grams
- Every 10th stage must be a "Cumulative Review" stage covering the last 20 learned keys

### 2C. Interleaving (Robert Bjork)
- After Phase 1, never practice a single key in isolation — always mix 3+ keys in a drill
- Word drills are more effective than pure character drills for long-term retention
- Alternate between accuracy-focused drills (no time pressure) and speed-focused drills (gentle timer)

### 2D. Motor Learning (Skill Chunking)
- Characters → pairs (bigrams) → short words → real words → sentences → paragraphs
- Do not rush to sentences. Premature sentence practice before key mastery creates inconsistent motor patterns
- Space and Backspace are motor skills too — teach them as first-class lessons, not afterthoughts

### 2E. Intrinsic Motivation (Self-Determination Theory)
- Autonomy: learner sees exactly which keys are unlocked and which are next — full curriculum map visible
- Competence: every stage should be completable in 3–7 minutes with genuine effort
- Relatedness: word drills use age-appropriate vocabulary (animals for kids, common words for teens/adults, code syntax for developers)

---

## 3. Audience Segmentation — Design Three Learning Tracks

The curriculum must serve three distinct audiences within ONE unified stage sequence. Do not build three separate apps. Build **one spine with contextual flavouring**.

### Track A: Young Learner (Ages 6–12)
- **Font size**: larger text in lesson display (CSS variable `--lesson-font-size`)
- **Word vocabulary**: animal names, colours, simple nouns (`cat`, `dog`, `red`, `run`, `sun`)
- **Time pressure**: none in early phases — completion-based, not timed
- **Gamification**: character mascot celebrates stage completions; stars not WPM
- **Visual hand guide**: prominent, colourful, cartoonish finger animations
- **Graduation gate**: 90% accuracy (not 98%) — forgiveness prevents frustration
- **Stage count displayed as**: "Level 3 of 10 in Home Row Kingdom" not "Stage 3 of 500"

### Track B: General Adult Learner (Ages 13–45)
- **Word vocabulary**: top 1000 most common English words (Oxford frequency list)
- **Time pressure**: gentle — 90-second windows in early phases
- **Gamification**: XP bar, level number, streak fire emoji, unlockable themes
- **Visual hand guide**: anatomically accurate but slim overlay, toggleable
- **Graduation gate**: 95% accuracy + 25 WPM minimum
- **Stage count displayed as**: progress bar with phase names

### Track C: Professional / Developer (Ages 18+)
- **Word vocabulary**: programming keywords, camelCase identifiers, CLI commands, bracket patterns
- **Time pressure**: strict — 60-second windows from Phase 3 onwards
- **Gamification**: "Efficiency Score" (WPM × accuracy²), unlockable IDE-themed colour schemes
- **Visual hand guide**: hidden by default (touch typist ethos)
- **Graduation gate**: 98% accuracy + 40 WPM minimum
- **Stage count displayed as**: "Lesson 47 / 200 — Intermediate Developer Track"

> **Implementation note**: Track is selected once at onboarding. It sets CSS class on root element
> and adjusts `graduationGate`, `timePressure`, `wordPool`, and `displayMode` config objects.
> The underlying `Lesson[]` array is the same — only the rendering and gate logic differ per track.

---

## 4. Full Curriculum Architecture — The Definitive 200-Stage Spine

> **Note on stage count**: The current codebase has a 500-stage generator but it pads stages 122–500
> with the same 7 sentences on loop (see `lessonsData.ts` line 122–145). This is not a curriculum.
> Design a genuine 200-stage curriculum where every stage has a deliberate, unique pedagogical purpose.
> 200 well-designed stages beat 500 mechanical ones. (Expand to 300 if research supports it.)

### Phase Architecture Overview

```
Phase 1: Anchor Foundation         [Stages 001–025]  ← Home Row + Space + Backspace
Phase 2: Vertical Reach            [Stages 026–065]  ← Top Row + Bottom Row keys
Phase 3: Rhythm & Coordination     [Stages 066–090]  ← Shift, CapsLock, bigrams, n-grams
Phase 4: Numbers Row               [Stages 091–115]  ← 1–0 with finger-column grouping
Phase 5: Symbols & Punctuation     [Stages 116–145]  ← All shift-symbols + punctuation
Phase 6: Real-World Integration    [Stages 146–175]  ← Sentences, paragraphs, speed runs
Phase 7: Specialist Tracks         [Stages 176–200]  ← Code, career prep, endurance
```

---

### PHASE 1: Anchor Foundation (Stages 001–025)

**Goal**: Build the home row anchor. The learner's fingers must know where to rest and how to return home after every keystroke. Cover `F J D K S L A ; G H Space Backspace`.

**Pedagogical order** (MUST follow this sequence — do NOT reorder):

```
Stage 001 — Introducing F (Left Index anchor)
  drill:  "f ff fff f ff fff f"
  focus:  Pure key recognition. No other keys.
  gate:   100% accuracy (only one key — zero tolerance)
  tip:    "Rest your left index finger on F. Feel the bump."

Stage 002 — Introducing J (Right Index anchor)
  drill:  "j jj jjj j jj jjj j"
  focus:  Right index anchor. Mirror of Stage 001.
  gate:   100% accuracy

Stage 003 — F + J Together (Index Pair)
  drill:  "fj jf fj jf fjfj jfjf f j fj jf"
  focus:  Alternating hands. First bilateral coordination exercise.
  gate:   98% accuracy

Stage 004 — Space Bar Introduction
  drill:  "f j f j f j f j"  (space between every key)
  focus:  Right thumb on spacebar. Return to home row after each space.
  gate:   98% accuracy
  tip:    "Your right thumb owns the spacebar."

Stage 005 — Introducing D (Left Middle finger)
  drill:  "d dd ddd d dd d ddd"
  gate:   100% accuracy

Stage 006 — Introducing K (Right Middle finger)
  drill:  "k kk kkk k kk k kkk"
  gate:   100% accuracy

Stage 007 — D + K + F + J Review
  drill:  "dk kd fd jk dj kf djkf"
  focus:  Four-key coordination, alternating hands
  gate:   97% accuracy

Stage 008 — First Word Drill (F, D, J, K keys only)
  words:  [auto-generated from letters f, d, j, k, space only]
  examples: "df kf dj dk fd" (pseudo-phonetic combinations)
  gate:   95% accuracy + at least 12 WPM

Stage 009 — Introducing S (Left Ring finger)
Stage 010 — Introducing L (Right Ring finger)
Stage 011 — S + L + Review (all 6 keys so far)
Stage 012 — Word Drill 2 (f, j, d, k, s, l) → "fads", "lads", "flask", "dads"

Stage 013 — Introducing A (Left Pinky)
Stage 014 — Introducing ; (Right Pinky — semicolon)
Stage 015 — Home Row Complete: A S D F + J K L ;
  drill:  "asdf jkl; asdf jkl; asdfjkl;"
  focus:  Full home row sweep. The most important stage in the curriculum.
  gate:   97% accuracy + 18 WPM
  reward: "🏠 Home Row Unlocked!" badge + 50 bonus XP

Stage 016 — Introducing G (Left Index inner stretch)
  tip:    "Stretch left index right — don't move your hand."

Stage 017 — Introducing H (Right Index inner stretch)
Stage 018 — G + H Pair Drill
  drill:  "gh hg gfhj fghj ghdf ghj"

Stage 019 — Word Drill 3: all home row keys
  words: "glad", "flag", "flash", "half", "dash", "has", "ask", "add", "all", "fall", "shall"
  note:  ONLY use words constructible from {a,s,d,f,g,h,j,k,l,;} — auto-validate this

Stage 020 — Backspace Introduction
  drill:  "fff [backspace] ff fff [backspace] ff"
  focus:  Controlled deletion. Right pinky reaches to Backspace without looking.
  gate:   Must complete without looking at keyboard (honour system + hand guide color change)

Stage 021 — Backspace Coordination Drill
  drill:  Intentional error correction exercise — the engine presents a word, user types it,
          then must delete and retype it twice
  gate:   Completion-based (no accuracy gate — the goal is Backspace muscle memory)

Stage 022 — Home Row Speed Run #1
  format: 60-second speed test, home row words only
  gate:   22 WPM + 95% accuracy
  reward: "First Speed Badge" + 75 XP

Stage 023 — Rhythm Drill #1 (Metronome at 60 BPM)
  format: Visual pulse on screen at 60 beats/min. Type one keystroke per beat.
  purpose: Cure erratic speed bursts. Build even cadence.
  gate:   Completion (no accuracy/speed gate on rhythm lessons)

Stage 024 — Home Row Word Sentences
  text:   "a flash of glad; a lad had a flask; ask all"
  format: Full sentence with punctuation (semicolons from home row)
  gate:   93% accuracy

Stage 025 — Phase 1 Graduation Test
  format: 90-second test using Phase 1 vocabulary only (200+ word pool)
  gate:   25 WPM + 93% accuracy
  reward: "Phase 1 Complete" badge, unlock Phase 2, +200 XP, theme unlock
```

---

### PHASE 2: Vertical Reach (Stages 026–065)

**Goal**: Teach all remaining letter keys by extending fingers from the home row. Introduce keys in symmetric pairs (one per hand per finger). After every 4 new keys, insert a word drill and a cumulative review.

**Key introduction order** (finger-column symmetric pairs):

```
Stage 026–028 → E and I   (Left Middle top, Right Middle top)
Stage 029–031 → R and U   (Left Index top, Right Index top)
Stage 032–034 → T and Y   (Left Index inner-top, Right Index inner-top)
Stage 035–037 → W and O   (Left Ring top, Right Ring top)
Stage 038–040 → Q and P   (Left Pinky top, Right Pinky top)

  [Milestone at Stage 040: All top row unlocked → "Top Row Master" badge + 150 XP]

Stage 041–043 → V and M   (Left Index bottom, Right Index bottom)
Stage 044–046 → C and ,   (Left Middle bottom, Right Middle bottom — comma is motor skill)
Stage 047–049 → X and .   (Left Ring bottom, Right Ring bottom — period taught here)
Stage 050–052 → Z and /   (Left Pinky bottom, Right Pinky bottom)
Stage 053–055 → B and N   (Left/Right Index inner-bottom)

  [Milestone at Stage 055: All letter keys unlocked → "Full Alphabet Unlocked" badge + 300 XP]
```

**Interspersed between key introductions** (every 4 new keys):

```
Stage 034 — Word Drill: e, r, t, i, u keys  → "fruit", "rude", "tire", "rule", "fur"
Stage 040 — Top Row Integration Drill        → all 26 letters, real common words
Stage 048 — Bottom Row Partial Drill         → v, c, b, m, n with top/home row mix
Stage 055 — Full Alphabet Word Drill         → top 50 most common English words
Stage 058 — Sentence Drill #1               → "the quick brown fox jumps over the lazy dog"
Stage 060 — Bigram Drill #1                 → th he in er an re on at es en (10 most common)
Stage 062 — Speed Run #2 (60 seconds)       → all letters, target 30 WPM
Stage 065 — Phase 2 Graduation Test         → 90 seconds, real common words, 32 WPM + 92% acc
```

**For each new key stage (example template — Stage 026: Introducing E)**:
```
title:       "Stage 026: Reach Up — The E Key"
description: "Left middle finger stretches UP from D to E. Return to D after each press."
drill:       "e ee eee ded ede dee de e e ee e"
focus_keys:  ['e']
tip:          "Stretch up — don't lift your hand. Middle finger up, then back to D."
visual_hand: Left middle finger glows + arrow pointing up
gate:        97% accuracy
XP reward:   15 XP
```

---

### PHASE 3: Rhythm, Coordination & Shift (Stages 066–090)

**Goal**: Introduce capitalization (both Shift keys), CapsLock, Enter key, and n-gram fluency drills. Fix erratic rhythm. Build coordinated both-hands typing.

```
Stage 066 — Left Shift Introduction
  drill:    "J K L U I O M N" (right-hand letters, using Left Shift)
  tip:      "Left pinky holds Shift. Right hand types the letter. Release Shift after."
  gate:     95% accuracy

Stage 067 — Right Shift Introduction
  drill:    "A S D F G Q W E R T V B" (left-hand letters, using Right Shift)
  gate:     95% accuracy

Stage 068 — Mixed Capitalization Drill
  drill:    Alternate caps and lowercase: "The cat sat. A dog ran. She fell."
  gate:     90% accuracy + 25 WPM

Stage 069 — Proper Nouns Drill
  drill:    "Alice Bob Carol David Emma Frank" (real capitalized names)
  purpose:  Shift in natural sentence context
  gate:     90% accuracy

Stage 070 — CapsLock Introduction
  drill:    "TYPE THIS IN CAPS then back to normal"
  purpose:  Teach CapsLock as deliberate toggle — locate key, press, type, toggle off
  gate:     Completion (no speed gate)

Stage 071 — Enter Key Introduction
  drill:    Multi-line typing — type a word, press Enter, type next word
  engine:   Add `Enter` as a recognized keystroke in the lesson engine
  gate:     Completion

Stage 072 — Rhythm Drill #2 (Metronome at 80 BPM)
  purpose:  Speed up cadence target from Phase 1's 60 BPM

Stage 073–078 — N-Gram Mastery Drills (6 dedicated stages)
  Stage 073: th, he, in, er → "the", "here", "inner", "her", "there"
  Stage 074: an, re, on, at → "and", "are", "on", "at", "rent", "ran"
  Stage 075: es, en, is, it → "is", "it", "his", "her", "this", "then"
  Stage 076: ou, io, ti, hi → "your", "our", "option", "high", "this"
  Stage 077: ea, st, le, ng → "eat", "east", "still", "long", "sting"
  Stage 078: Most common 100 English words timed drill (60 seconds)

Stage 079 — Pinky Power Left (Q A Z + Left Shift)
  purpose:  Weakest finger isolation training
  drill:    "qaz za qa az qaz zaq aqz"
  gate:     95% accuracy (pinky drills are harder — lower speed gate)

Stage 080 — Pinky Power Right (P ; / + Right Shift)
  drill:    "p; ;/ /; p/ ;p p;/ /;p"

Stage 081 — Ring Finger Independence Left (W S X)
Stage 082 — Ring Finger Independence Right (O L .)

Stage 083 — Full Sentence Flow #1
  text:     "She asked if the glass was half full or half empty."
  gate:     88% accuracy + 30 WPM

Stage 084 — Full Sentence Flow #2
  text:     "His quick brown jacket zipped over the sleeping fox."
  gate:     88% accuracy + 30 WPM

Stage 085 — Cumulative Review #1 (Stages 001–084)
  format:   200-word mixed vocabulary test, all letters + shift
  gate:     88% accuracy + 32 WPM + streak check

Stage 086 — Typing Rhythm Test (Consistency Score)
  format:   60-second test, measure stddev(wpmTimeline) / mean(wpmTimeline)
  gate:     Consistency score ≥ 70% (not just raw WPM)
  display:  Show consistency score prominently — "Your typing rhythm: 74% consistent"

Stage 087 — Personal Weakness Drill (Adaptive)
  format:   Engine reads errorLog from the last 5 sessions, finds top 3 error keys,
            generates a custom 45-word drill targeting those exact keys
  gate:     95% accuracy on the adaptive drill

Stage 088 — Speed Burst Training (15-second sprint)
  format:   15-second maximum-effort test — no accuracy gate, WPM only
  purpose:  Trains the learner to push their ceiling speed

Stage 089 — Accuracy Under Pressure (60-second high-accuracy)
  gate:     98% accuracy (any WPM)
  purpose:  Opposite of speed burst — precision training

Stage 090 — Phase 3 Graduation Test
  format:   90 seconds, capitalized sentences, target 38 WPM + 90% acc
  reward:   "Coordination Master" badge + 400 XP + 1 new theme unlocked
```

---

### PHASE 4: Numbers Row (Stages 091–115)

**Goal**: Teach all 10 number keys using the same finger-column-symmetric approach. Numbers are far harder than letters — the reach is longer and the keys are less practiced.

```
Key introduction order (finger column approach — never random):

Stage 091–093 → 4 and 7   (Left Index, Right Index — closest to home row)
Stage 094–096 → 3 and 8   (Left Middle, Right Middle)
Stage 097–099 → 5 and 6   (Left/Right Index inner stretch — hardest pair)
Stage 100–102 → 2 and 9   (Left Ring, Right Ring)
Stage 103–105 → 1 and 0   (Left Pinky, Right Pinky — longest reach)

  [Milestone at Stage 105: All number keys unlocked → "Number Cruncher" badge + 200 XP]

Stage 106 — Number Sequence Drills
  drills: "1234 5678 90 2468 13579 147 258 369"

Stage 107 — Phone Number Drill
  drills: "555-1234 800-555-0100 +91 98765 43210"
  purpose: Real-world context makes number memory stick

Stage 108 — Date & Year Drill
  drills: "01/01/2024 12/31/1999 2025-06-28 March 14 1879"

Stage 109 — Arithmetic Expression Drill
  drills: "2 + 3 = 5 10 - 4 = 6 7 × 8 = 56 100 / 4 = 25"

Stage 110 — Mixed Letter + Number Drill
  drills: "order 42 seat 7B room 101 level 3 score 9800"

Stage 111 — Number Row Speed Drill (30 seconds)
  gate:   25 WPM (numbers are slower — lower gate is fair)

Stage 112–113 — Cumulative Review (all letters + numbers)
  format: 90 seconds, mixed text with digits in sentences
  gate:   85% accuracy + 35 WPM

Stage 114 — Number Row Rhythm Drill (Metronome at 70 BPM)
  purpose: Numbers derail rhythm — rebuild cadence

Stage 115 — Phase 4 Graduation Test
  gate:   35 WPM + 88% accuracy + all numbers covered
  reward: "Number Row Conquered" badge + 300 XP
```

---

### PHASE 5: Symbols, Punctuation & Special Keys (Stages 116–145)

**Goal**: All shift-symbols, all punctuation. Taught in logical groups by finger and by real-world use-case context (writing, coding, math).

**The symbols are taught in 4 clusters (not randomly):**

```
Cluster A — Writing Punctuation (Stages 116–125)
  . , ? ! ' " : ;
  context: Sentences, dialogue, questions, lists

  Stage 116 — Period . and Comma ,  (already introduced in Phase 2 as letter-row keys — now in sentence context)
  Stage 117 — Question Mark ? (Right Shift + /)
  Stage 118 — Exclamation Mark ! (Right Shift + 1)
  Stage 119 — Apostrophe ' and Quotation Mark "
  Stage 120 — Colon : and Semicolon ; (Semicolon already known — colon is Shift+;)
  Stage 121 — Ellipsis practice "..." and em-dash "--"
  Stage 122 — Sentence Punctuation Drill
    text: "Wait — is that you? Yes, it's me! I said: 'Hello, world.'"
    gate: 85% accuracy
  Stage 123 — Dialogue Typing Drill
    text: "She said, 'I don't know.' He replied: 'Neither do I.'"
  Stage 124 — Paragraph Drill #1 (full punctuation, 3 sentences)
  Stage 125 — Writing Track Milestone Test
    gate: 38 WPM + 88% accuracy
    reward: "Prose Typist" badge + 200 XP

Cluster B — Math & Science Symbols (Stages 126–130)
  + - = _ * / ^ ~ %
  Stage 126 — Hyphen - and Underscore _ (right pinky column)
  Stage 127 — Equals = and Plus + (Shift+=)
  Stage 128 — Asterisk * (Shift+8) and Slash / (already known)
  Stage 129 — Percent % (Shift+5) and Caret ^ (Shift+6)
  Stage 130 — Math Expression Drill: "a + b = c x^2 + y^2 = z^2 100% correct"

Cluster C — Bracket & Structure Symbols (Stages 131–136)
  ( ) [ ] { } < >
  Stage 131 — Parentheses ( and ) — Shift+9 and Shift+0
  Stage 132 — Square Brackets [ and ]
  Stage 133 — Curly Braces { and } — Shift+[ and Shift+]
  Stage 134 — Angle Brackets < and > — Shift+, and Shift+.
  Stage 135 — Bracket Pairing Drill: "( ) { } [ ] ( [ { } ] )"
  Stage 136 — HTML Tag Drill: "<div> <span> <p> </div> </span>"

Cluster D — Code & Tech Symbols (Stages 137–145)
  @ # & | \ ` ~ $
  Stage 137 — At @ (Shift+2) and Hash # (Shift+3)
  Stage 138 — Ampersand & (Shift+7) and Pipe | (Shift+\)
  Stage 139 — Backslash \ and Tilde ~ (Shift+`)
  Stage 140 — Dollar $ (Shift+4) and Backtick ` 
  Stage 141 — Email Address Drill: "user@example.com admin@typeflow.io"
  Stage 142 — URL Drill: "https://typeflow.io/learn?stage=142&mode=pro"
  Stage 143 — Hashtag & Mention Drill: "#TypeFlow @typeflow 100% accuracy!"
  Stage 144 — Full Symbol Review (all symbols covered)
  Stage 145 — Phase 5 Graduation Test
    gate: 40 WPM + 85% accuracy (symbol tests are harder — fair gate)
    reward: "Symbol Master" badge + 500 XP + premium theme unlock
```

---

### PHASE 6: Real-World Integration (Stages 146–175)

**Goal**: Transition from individual key mastery to real-world typing fluency. Everything from phases 1–5 is now in play simultaneously. Introduce full paragraphs, reading comprehension typing, and first speed benchmarks.

```
Stage 146–150 — Paragraph Drills (5 unique passages, 3–5 sentences each)
  passage topics: Nature, Technology, History, Cooking, Travel
  gate: 40 WPM + 90% accuracy

Stage 151–155 — Speed Progression Ladder
  Stage 151: Target 40 WPM gate
  Stage 152: Target 45 WPM gate
  Stage 153: Target 50 WPM gate
  Stage 154: Target 55 WPM gate
  Stage 155: Target 60 WPM gate (the "Pro Threshold")
  reward at 155: "60 WPM Achieved!" — special animated celebration + 1000 XP + Gold badge

Stage 156–160 — Consistency Training
  format: 90-second tests where CONSISTENCY SCORE (not WPM) is the gate
  gate: Consistency ≥ 80%
  display: Real-time consistency gauge during typing

Stage 161–165 — Mixed Mode Drills
  Stage 161: Numbers in sentences ("Order #4782 ships on March 3.")
  Stage 162: URLs and emails in paragraphs
  Stage 163: Quoted speech + punctuation
  Stage 164: Lists with numbers and bullets
  Stage 165: Mixed everything — "a professional email"

Stage 166–170 — Endurance Runs
  Stage 166: 2-minute test
  Stage 167: 3-minute test
  Stage 168: 5-minute test
  Stage 169: 10-minute test
  Stage 170: 15-minute personal record attempt
  gate: No WPM gate — completion only. Track personal best.

Stage 171–175 — Weak Spot Elimination (Adaptive)
  Engine reads full errorLog + keystrokeLog from all sessions
  Identifies: slowest key, most errored key, worst bigram
  Generates 5 custom lessons targeting exactly those gaps
  gate: 95% accuracy on adaptive content
```

---

### PHASE 7: Specialist Tracks (Stages 176–200)

**Goal**: Career-specific and advanced use-case typing. Three parallel tracks — learner picks one (or all).

```
Track 7A: Career / Job Interview Prep (Stages 176–182)
  Stage 176: Typing test simulation (60-second, 200 most common words)
  Stage 177: Government typing test format (60 WPM standard)
  Stage 178: Data entry simulation (numbers + text, high accuracy emphasis)
  Stage 179: Form filling simulation (name, email, address, date formats)
  Stage 180: Cover letter speed typing (real cover letter text)
  Stage 181: Resume bullet points (numbers, action verbs, formatting)
  Stage 182: Certification Test Simulation
    gate: 60 WPM + 98% accuracy → awards "TypeFlow Certified Typist" badge

Track 7B: Developer / Programmer Speed (Stages 183–192)
  Stage 183: Python syntax drill  (def, if, for, print, import, return)
  Stage 184: JavaScript syntax drill (const, let, function, arrow =>, async/await)
  Stage 185: CamelCase drill (userFirstName, getItemById, isValidEmail)
  Stage 186: snake_case drill (get_user_name, is_valid, parse_date)
  Stage 187: HTML tag drill (<div class="wrapper"><p id="text">Hello</p></div>)
  Stage 188: CSS property drill (background-color: #0a0a0a; font-size: 1.5rem;)
  Stage 189: JSON drill ({"name": "Alice", "age": 30, "active": true})
  Stage 190: Terminal command drill (git commit -m "fix: button alignment" git push)
  Stage 191: RegEx pattern drill ([a-z0-9]+@[a-z]+\.[a-z]{2,})
  Stage 192: Developer Certification Test
    gate: 50 WPM + 95% accuracy on pure code text
    reward: "Keyboard Ninja" badge + "Hacker" theme unlock

Track 7C: Advanced Fluency (Stages 193–200)
  Stage 193: Pangrams mastery (sentences using all 26 letters)
  Stage 194: Tongue twister typing ("She sells seashells by the seashore")
  Stage 195: Prose endurance (classic literature — Pride & Prejudice opening)
  Stage 196: Poetry typing (structured verses, unusual punctuation)
  Stage 197: Speed ceiling attempt (personal best in 15-second burst)
  Stage 198: Consistency champion (10-minute test, consistency ≥ 85%)
  Stage 199: The Grand Review (30-minute comprehensive all-keys marathon)
  Stage 200: Final Graduation
    gate: 65 WPM + 95% accuracy
    reward: "TypeFlow Graduate" certificate, all themes unlocked, Hall of Fame entry (local)
```

---

## 5. Word Drill Engineering Specification

The word pools MUST be generated by the engine dynamically — not hardcoded static strings.

### 5A. Dynamic Word Filter Algorithm

```typescript
// REQUIRED — implement in src/utils/wordEngine.ts (new file)

export interface WordPool {
  earlyWords: string[];     // 3-4 letter words
  midWords: string[];       // 5-7 letter words
  advancedWords: string[];  // 8+ letter words
  properNouns: string[];    // Capitalized names, places
  codeWords: string[];      // camelCase, snake_case, keywords
}

/**
 * Returns words that can be typed using ONLY the allowed character set.
 * Weights: 60% focus keys, 30% review keys, 10% n-grams.
 */
export function getDrillWords(
  allowedChars: string[],         // All characters unlocked so far
  focusChars: string[],           // Keys introduced in THIS stage
  count: number,                  // Number of words to return
  track: 'young' | 'adult' | 'professional'  // Vocabulary register
): string[]
```

### 5B. Word Corpus Requirements

The word corpus must be embedded in `src/utils/wordCorpus.ts` (new file) and contain:

| Category | Minimum entries | Notes |
|----------|----------------|-------|
| Young Learner words (ages 6–10) | 500 | Animals, colours, food, simple verbs |
| Common English words (top 1000) | 1000 | Oxford frequency list |
| Common English words (top 5000) | 5000 | For Phases 5–6 |
| Professional / formal vocabulary | 500 | Resume, formal email, business |
| Programming keywords (Python + JS) | 200 | def, const, return, async, import |
| Code identifiers (camelCase) | 100 | getUserData, isActive, parseInput |
| CLI commands | 50 | git push, npm install, cd, ls |
| Number-embedded words | 100 | "step2", "v3.1", "form42" |
| Pangrams | 20 | All 26 letters in one sentence |

### 5C. N-Gram Injection (10% of every drill)

Every word drill after Stage 020 must inject at least 10% content from these bigrams and trigrams:

```
Top 10 English bigrams: th he in er an re on at es en
Top 10 English trigrams: the and ing ion tio ent ation for her was
Slow-transition pairs: qu ck bl fr sw tw gh ph wh ch sh
Finger-crossing transitions: be br ve vi my ny by gy hy ky
```

---

## 6. Gamification Design Specification

### 6A. Stage-Level Micro-Rewards (every stage)

```
Completion:          +10–50 XP (based on stage difficulty tier)
Perfect accuracy:    +20 bonus XP
Personal best WPM:   +30 bonus XP + animated "New PB!" toast
First attempt pass:  +15 bonus XP
Streak maintained:   multiplier applied (2-day: ×1.1, 7-day: ×1.25, 30-day: ×1.5)
```

### 6B. Phase-Level Achievements (unlocked once per phase)

| Badge ID | Name | Trigger | Reward |
|----------|------|---------|--------|
| `home-row-master` | 🏠 Home Row Master | Complete Phase 1 | +200 XP + "Sepia" theme |
| `full-alphabet` | 🔤 Alphabet Complete | All 26 letters unlocked | +300 XP + "Forest" theme |
| `shift-shifter` | ⬆️ Shift Shifter | Complete Phase 3 | +400 XP + "Neon" theme |
| `number-cruncher` | 🔢 Number Cruncher | Complete Phase 4 | +300 XP + "Retro Terminal" theme |
| `symbol-master` | # Symbol Master | Complete Phase 5 | +500 XP + "Cyberpunk" theme |
| `sixty-wpm` | 🚀 60 WPM Club | First test ≥ 60 WPM | +1000 XP + "Gold" theme + certificate |
| `certified-typist` | 📜 Certified Typist | Pass Stage 182 test | Certificate PDF + Hall of Fame |
| `keyboard-ninja` | 🥷 Keyboard Ninja | Pass Stage 192 test | "Hacker" theme |
| `typeflow-graduate` | 🎓 TypeFlow Graduate | Complete Stage 200 | All themes + Hall of Fame |

### 6C. Streak System Display (must be prominent — not a badge only)

```
Dashboard shows:
  🔥 [N] Day Streak   ← Large, fire animated emoji when ≥ 3 days
  Next milestone: 7 days → Streak Shield (protects 1 missed day)
  Streak Shield: earned at 7 days — absorbs one broken day silently

Streak mechanics:
  - Streak increments if the user completes ≥ 1 lesson or test per calendar day
  - Streak Shield: first earned at 7-day streak, can hold max 1 shield at a time
  - "Comeback Bonus": if streak was ≥ 14 and breaks, next login gives +50 bonus XP
```

### 6D. Level Display (XP Bar — must be visual progress bar, not just a number)

```
Dashboard XP strip:
  Level [N]  [███████░░░] 347 / 500 XP to Level [N+1]

Level names (not just numbers):
  Level 1:  Beginner
  Level 2:  Two-Finger Typist
  Level 3:  Hunt & Peck Graduate
  Level 4:  Home Row Student
  Level 5:  Touch Typer
  Level 6:  Rhythm Typer
  Level 7:  Speed Climber
  Level 8:  Accuracy Sniper
  Level 9:  Word Machine
  Level 10: Type Warrior
  Level 15: Speed Demon
  Level 20: Symbol Sorcerer
  Level 25: Code Slinger
  Level 30: TypeFlow Legend
```

### 6E. Daily Challenge System (new feature — not yet built)

```typescript
// One daily challenge per day — resets at midnight UTC
export interface DailyChallenge {
  id: string;              // "2026-06-28"
  type: 'speed' | 'accuracy' | 'endurance' | 'symbol' | 'words';
  title: string;           // "60-Second Speed Burst"
  description: string;     // "Type for 60 seconds and beat your personal best!"
  gate: { wpm?: number; accuracy?: number; duration?: number };
  xpReward: number;        // 100–500 XP
  bonusBadge?: string;     // Optional one-day badge
}

// Challenge types rotate daily:
// Mon: Speed Challenge (beat PB by 5 WPM)
// Tue: Accuracy Challenge (99% accuracy in 60 seconds)
// Wed: Symbol Drill (2-min symbol-heavy text)
// Thu: Endurance Run (5-minute continuous test)
// Fri: Word Burst (most words typed in 30 seconds)
// Sat: Freestyle (user's choice of mode, bonus XP for any completion)
// Sun: Grand Review (90-second test, all phases)
```

### 6F. Progress Celebration Animations (UI engineering spec)

```
Stage completion:  Green checkmark animates in + XP toast slides up from bottom right
Badge unlock:      Full-width animated banner: "🏆 Badge Unlocked: [Name]" — 3 second auto-dismiss
Level up:          Full-screen flash: "LEVEL UP! → [New Level Name]" + particle burst animation
60 WPM first time: Special confetti + sound (if sound enabled) + permanent "🚀" icon on profile
Streak milestone:  Fire emoji grows larger at 3/7/14/30 days + animated flame
```

---

## 7. Engine-Level Implementation Specification

### 7A. Lesson Data Schema (upgrade from current `Lesson` interface)

```typescript
// src/utils/lessonsData.ts — replace current Lesson interface with this

export type LessonTrack = 'young' | 'adult' | 'professional';
export type LessonType = 
  'key-intro' |      // Introducing 1-2 new keys
  'pair-drill' |     // Bilateral coordination (two keys)
  'word-drill' |     // Real or pseudo words using unlocked keys
  'sentence' |       // Full sentences with punctuation
  'paragraph' |      // Multi-sentence passages
  'speed-run' |      // Timed WPM gate
  'accuracy-run' |   // High accuracy gate (no speed pressure)
  'rhythm' |         // Metronome/consistency training
  'adaptive' |       // Engine-generated based on errorLog
  'cumulative' |     // Review of all learned keys
  'graduation' |     // Phase exit test
  'specialist';      // Career track content

export interface LessonGraduationGate {
  minAccuracy: number;      // e.g. 0.95 (95%)
  minWpm?: number;          // e.g. 25 (optional for some lesson types)
  minConsistency?: number;  // e.g. 0.70 (optional — only for rhythm lessons)
  maxConsecutiveErrors?: number;  // e.g. 3
}

export interface Lesson {
  id: number;
  phase: 'foundation' | 'vertical' | 'coordination' | 'numbers' | 'symbols' | 'integration' | 'specialist';
  type: LessonType;
  track?: LessonTrack;      // undefined = all tracks
  title: string;
  description: string;
  tip?: string;             // Single coaching tip shown above the drill
  target: string | null;    // null for adaptive lessons (generated at runtime)
  focusKeys: string[];
  unlockedKeys: string[];   // All keys available by this stage
  gate: LessonGraduationGate;
  xpReward: number;
  badgeUnlock?: string;     // Badge ID to award on completion
  metronomeBpm?: number;    // Only for rhythm lesson types
  estimatedMinutes: number; // Display to user: "~3 min"
}
```

### 7B. Adaptive Drill Generator

```typescript
// src/utils/adaptiveDrillGenerator.ts (new file)

import type { KeystrokeEvent, TypingError } from './typingEngine';

export interface WeakSpot {
  key: string;
  errorRate: number;       // errors / total presses
  avgLatencyMs: number;    // average deltaMs from keystrokeLog
}

/**
 * Analyses the last N sessions' keystroke logs to find the user's
 * 3 weakest keys (by combined error rate + latency score).
 */
export function identifyWeakSpots(
  keystrokeLogs: KeystrokeEvent[][],
  errorLogs: TypingError[][]
): WeakSpot[]

/**
 * Generates a custom drill string targeting the given weak spots.
 * The drill mixes focus keys with their most common neighbor keys
 * to force the problematic transitions to occur.
 */
export function generateAdaptiveDrill(
  weakSpots: WeakSpot[],
  unlockedKeys: string[],
  wordCorpus: string[],
  targetLength: number
): string

/**
 * Identifies the slowest bigram (two-key transition) from keystroke logs.
 */
export function findSlowestBigram(logs: KeystrokeEvent[]): { bigram: string; avgMs: number } | null
```

### 7C. Track-Aware Lesson Engine

```typescript
// src/utils/lessonEngine.ts (new file)

export interface LessonEngineConfig {
  track: LessonTrack;
  currentStage: number;
  unlockedKeys: string[];
  userStats: UserStats;
  recentSessions: TypingTestSession[];
}

/**
 * Returns the appropriate lesson object for the given stage,
 * with dynamic content generated (for adaptive lessons) or
 * track-adjusted gates applied.
 */
export function resolveLesson(
  lesson: Lesson,
  config: LessonEngineConfig
): ResolvedLesson

export interface ResolvedLesson extends Lesson {
  resolvedTarget: string;         // final drill text (never null)
  resolvedGate: LessonGraduationGate;  // track-adjusted gate
  resolvedXp: number;             // streak-multiplied XP
}
```

---

## 8. What No Competitor Has Done — Your Uniqueness Checklist

After market research, implement AT LEAST 3 of these that your research confirms are industry firsts:

| # | Unique Feature | Rationale |
|---|----------------|-----------|
| 1 | **Typing DNA Report** | After 10 sessions, show a visual chord diagram of the user's 5 slowest key transitions — a personal fingerprint. No competitor does this. |
| 2 | **Metronome Rhythm Mode** | A visual BPM pulse during drills — the cure for "burst typing" (fast on easy keys, slow on hard keys). No competitor implements this as a lesson type. |
| 3 | **Key-By-Key Unlock Map** | A full QWERTY keyboard displayed on the curriculum page where each key VISUALLY unlocks as the learner completes the stage introducing it. Game-like, motivating. |
| 4 | **Bigram Mastery Mode** | Dedicated lessons for the 50 most common English letter pairs — targeting the *transitions* between keys, not just individual keys. No competitor teaches bigrams explicitly. |
| 5 | **Young Learner Mode** | Animal-themed vocabulary, larger font, cartoonish finger guide, stars-not-WPM scoring — built into the same engine, not a separate product. |
| 6 | **Career Certification Test** | A Stage 182 test that generates a downloadable "TypeFlow Certified Typist" certificate (HTML-to-canvas, no server required). Local-first, zero-cost. |
| 7 | **Consistency Score as Primary Metric** | Show consistency score PROMINENTLY alongside WPM — not buried in analytics. Teach users that consistent 45 WPM beats erratic 60 WPM in real work. |
| 8 | **Daily Challenge Rotation** | A new challenge every calendar day — keeps even completed-curriculum users logging in. No competitor does daily contextual typing challenges. |

---

## 9. Deliverable Format

Return your design as a structured document with these sections:

```markdown
# TypeFlow Curriculum v2 — Expert Design Document

## 1. Market Research Findings
  - Competitor curriculum comparison table (stage counts, key intro order, gates)
  - Confirmed uniqueness gaps (what nobody else does)
  - Recommended differentiation strategy

## 2. Pedagogical Framework (your additions/revisions to §2 above)

## 3. Track Definitions (Young / Adult / Professional — with gate adjustments)

## 4. Full Stage-by-Stage Curriculum
  - Every stage: id, phase, type, title, description, drill text (or generation rule),
    focusKeys, gate, xpReward, tip, estimatedMinutes
  - Word drill pools: exact words for each drill (or generation algorithm)
  - N-gram injection table

## 5. Gamification Specification
  - Complete badge catalogue with trigger conditions
  - XP table per stage tier
  - Streak system rules
  - Daily challenge rotation

## 6. Engine Implementation Plan
  - New/modified files list
  - TypeScript interfaces (complete, compilable)
  - Adaptive drill algorithm pseudocode
  - Database schema changes (Dexie version 4 migration)

## 7. UI/UX Specification for Learn.tsx
  - Curriculum map page mockup description
  - Key unlock visual animation spec
  - Track selection onboarding flow
  - Metronome visual component spec
  - Hand guide per-phase visibility rules

## 8. Implementation Priority (ordered by learner impact)
  - P0: Must have for v2 launch
  - P1: Ship within 30 days of launch
  - P2: Ship within 90 days
  - P3: Future backlog

## 9. Open Questions for TypeFlow Founder
```

---

## 10. Constraints & Ground Rules

- **Every stage must have a unique `id`** — no two stages can have the same drill text or the same pedagogical purpose
- **No stage is padding** — if you can't articulate WHY this stage exists between the one before and after it, cut it
- **Word drills contain only unlocked keys** — the filter algorithm must be watertight (validate against `unlockedKeys: string[]`)
- **No external libraries for curriculum content** — word corpus goes in `src/utils/wordCorpus.ts` as a TypeScript const
- **All gates must be achievable in 3–10 minutes** for a learner at the target skill level — test every gate
- **Phase 1–2 content must be usable by a 7-year-old** (Track A) without adult help
- **Phase 7C content must challenge a developer who types 50 WPM** (Track C gates must push them)
- **The number 500 is a ceiling, not a target** — quality over quantity; 200 great stages beat 500 filler stages
- **All TypeScript must be strict-mode compatible** — no `any` without justification
- **No new npm dependencies** for word corpus or drill generation — pure TS arrays and algorithms

---

*This prompt was created for TypeFlow — codebase at `src/`, React 18 + TypeScript + Vite + Dexie.js.*
*Current engine: `typingEngine.ts` (222 lines) — already supports wpmTimeline, errorLog, keystrokeLog.*
*Current curriculum: `lessonsData.ts` (149 lines) — a mechanical loop generator, not a real curriculum.*
*Target: Replace the mechanical generator with a deliberate, research-backed, 200-stage curriculum.*
*Prepared: June 2026.*
