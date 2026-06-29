// src/utils/lessonsData.ts

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
  minWpm?: number;                 // e.g., 25
  minConsistency?: number;         // e.g., 0.70 (rhythm lessons)
  maxConsecutiveErrors?: number;   // e.g., 3
}

export interface Lesson {
  id: number;                      // Sequential 1-200
  phase: LessonPhase;
  type: LessonType;
  track?: LessonTrack;             // undefined = all tracks
  title: string;
  description: string;
  tip?: string;                    // Coaching tip
  target: string | null;           // null for adaptive lessons
  focusKeys: string[];
  unlockedKeys: string[];          // All keys available
  gate: LessonGraduationGate;
  xpReward: number;
  badgeUnlock?: string;            // Badge ID to award
  metronomeBpm?: number;           // Only for rhythm lessons
  estimatedMinutes: number;        // ~3 min
}

// Handcrafting the 200 stages
const rawLessons: Omit<Lesson, 'unlockedKeys'>[] = [
  // --- PHASE 1: ANCHOR FOUNDATION (Stages 001–025) ---
  {
    id: 1,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 001: Introducing F — Left Index Anchor",
    description: "Rest your left index finger on F. Feel the bump.",
    tip: "Rest your left index finger on F. Feel the bump.",
    target: "f ff fff f ff fff f",
    focusKeys: ['f'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 2,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 002: Introducing J — Right Index Anchor",
    description: "Rest your right index finger on J. Feel the bump.",
    tip: "Rest your right index finger on J. Feel the bump.",
    target: "j jj jjj j jj jjj j",
    focusKeys: ['j'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 3,
    phase: 'foundation',
    type: 'pair-drill',
    title: "Stage 003: F + J Together — Index Pair",
    description: "Alternating hands. First bilateral coordination exercise.",
    target: "fj jf fj jf fjfj jfjf f j fj jf",
    focusKeys: ['f', 'j'],
    gate: { minAccuracy: 0.98 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 4,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 004: Space Bar Introduction",
    description: "Right thumb on spacebar. Return to home row after space.",
    tip: "Your right thumb owns the spacebar.",
    target: "f j f j f j f j",
    focusKeys: ['f', 'j', ' '],
    gate: { minAccuracy: 0.98 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 5,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 005: Introducing D — Left Middle finger",
    description: "Press D with your left middle finger.",
    target: "d dd ddd d dd d ddd",
    focusKeys: ['d'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 6,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 006: Introducing K — Right Middle finger",
    description: "Press K with your right middle finger.",
    target: "k kk kkk k kk k kkk",
    focusKeys: ['k'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 7,
    phase: 'foundation',
    type: 'pair-drill',
    title: "Stage 007: D + K + F + J Review",
    description: "Four-key coordination, alternating hands.",
    target: "dk kd fd jk dj kf djkf",
    focusKeys: ['d', 'k', 'f', 'j'],
    gate: { minAccuracy: 0.97 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 8,
    phase: 'foundation',
    type: 'word-drill',
    title: "Stage 008: First Word Drill",
    description: "Drill combinations using letters F, D, J, K.",
    target: "df kf dj dk fd",
    focusKeys: ['f', 'd', 'j', 'k'],
    gate: { minAccuracy: 0.95, minWpm: 12 },
    xpReward: 25,
    estimatedMinutes: 3
  },
  {
    id: 9,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 009: Introducing S — Left Ring finger",
    description: "Press S with your left ring finger.",
    target: "s ss sss s ss s sss",
    focusKeys: ['s'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 10,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 010: Introducing L — Right Ring finger",
    description: "Press L with your right ring finger.",
    target: "l ll lll l ll l lll",
    focusKeys: ['l'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 11,
    phase: 'foundation',
    type: 'pair-drill',
    title: "Stage 011: S + L + Review",
    description: "Coordination with ring fingers.",
    target: "sl ls dk kd slks lskd",
    focusKeys: ['s', 'l'],
    gate: { minAccuracy: 0.97 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 12,
    phase: 'foundation',
    type: 'word-drill',
    title: "Stage 012: Word Drill 2",
    description: "Practice real home row words like dads, lads, flask.",
    target: "lads dads flask sad fall all shall",
    focusKeys: ['f', 'j', 'd', 'k', 's', 'l'],
    gate: { minAccuracy: 0.95, minWpm: 15 },
    xpReward: 25,
    estimatedMinutes: 3
  },
  {
    id: 13,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 013: Introducing A — Left Pinky",
    description: "Press A with your left pinky finger.",
    target: "a aa aaa a aa a aaa",
    focusKeys: ['a'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 14,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 014: Introducing ; — Right Pinky",
    description: "Press semicolon ; with your right pinky finger.",
    target: "; ;; ;;; ; ;; ; ;;;",
    focusKeys: [';'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 15,
    phase: 'foundation',
    type: 'cumulative',
    title: "Stage 015: Home Row Complete",
    description: "Sweep across all home row keys: A S D F J K L ;",
    target: "asdf jkl; asdf jkl; asdfjkl;",
    focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    gate: { minAccuracy: 0.97, minWpm: 18 },
    xpReward: 50,
    badgeUnlock: 'home-row-master',
    estimatedMinutes: 3
  },
  {
    id: 16,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 016: Introducing G — Left Index Stretch",
    description: "Stretch your left index finger right to G.",
    tip: "Stretch left index right — don't move your hand.",
    target: "g gg ggg fg gf fg g",
    focusKeys: ['g'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 17,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 017: Introducing H — Right Index Stretch",
    description: "Stretch your right index finger left to H.",
    target: "h hh hhh jh hj jh h",
    focusKeys: ['h'],
    gate: { minAccuracy: 1.0 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 18,
    phase: 'foundation',
    type: 'pair-drill',
    title: "Stage 018: G + H Pair Drill",
    description: "Master index finger stretches on both hands.",
    target: "gh hg gfhj fghj ghdf ghj",
    focusKeys: ['g', 'h'],
    gate: { minAccuracy: 0.96 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 19,
    phase: 'foundation',
    type: 'word-drill',
    title: "Stage 019: Word Drill 3 — Home Row Words",
    description: "Real words constructible from the home row.",
    target: "glad flag flash half dash has ask add all fall shall",
    focusKeys: ['g', 'h', 'a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    gate: { minAccuracy: 0.95, minWpm: 20 },
    xpReward: 25,
    estimatedMinutes: 3
  },
  {
    id: 20,
    phase: 'foundation',
    type: 'key-intro',
    title: "Stage 020: Backspace Introduction",
    description: "Reach your right pinky to Backspace without looking.",
    tip: "Your right pinky reaches to Backspace without looking.",
    target: "fff backspace ff fff backspace ff",
    focusKeys: ['backspace'],
    gate: { minAccuracy: 0.98 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 21,
    phase: 'foundation',
    type: 'pair-drill',
    title: "Stage 021: Backspace Coordination",
    description: "Intentional error correction exercise.",
    target: "sad error backspace sad glad error backspace glad",
    focusKeys: ['backspace'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 22,
    phase: 'foundation',
    type: 'speed-run',
    title: "Stage 022: Home Row Speed Run",
    description: "60-second speed test using home row words.",
    target: "glad flag half fall flask dash lads dads salad",
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    gate: { minAccuracy: 0.95, minWpm: 22 },
    xpReward: 75,
    estimatedMinutes: 3
  },
  {
    id: 23,
    phase: 'foundation',
    type: 'rhythm',
    title: "Stage 023: Rhythm Drill #1 (60 BPM)",
    description: "Type one key per visual pulse.",
    target: "f j d k s l a ; g h f j d k s l a ;",
    focusKeys: ['f', 'j', 'd', 'k', 's', 'l'],
    gate: { minAccuracy: 0.95, minConsistency: 0.70 },
    xpReward: 30,
    metronomeBpm: 60,
    estimatedMinutes: 2
  },
  {
    id: 24,
    phase: 'foundation',
    type: 'sentence',
    title: "Stage 024: Home Row Word Sentences",
    description: "Full sentences with home row punctuation.",
    target: "a flash of glad; a lad had a flask; ask all",
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    gate: { minAccuracy: 0.93 },
    xpReward: 30,
    estimatedMinutes: 3
  },
  {
    id: 25,
    phase: 'foundation',
    type: 'graduation',
    title: "Stage 025: Phase 1 Graduation Test",
    description: "Graduate home row foundation. Phase exit test.",
    target: "glad flag flash half dash has ask add all fall shall asdf jkl;",
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    gate: { minAccuracy: 0.93, minWpm: 25 },
    xpReward: 200,
    estimatedMinutes: 3
  },

  // --- PHASE 2: VERTICAL REACH (Stages 026–065) ---
  {
    id: 26,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 026: Reach Up — The E Key",
    description: "Left middle finger stretches UP to E. Return to D.",
    tip: "Middle finger up to E, then back to D.",
    target: "e ee eee ded ede dee de e e ee e",
    focusKeys: ['e'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 27,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 027: Reach Up — The I Key",
    description: "Right middle finger stretches UP to I. Return to K.",
    target: "i ii iii kik iki kii ki i i ii i",
    focusKeys: ['i'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 28,
    phase: 'vertical',
    type: 'pair-drill',
    title: "Stage 028: E + I Pair Drill",
    description: "Alternate middle finger vertical reaches.",
    target: "deei iki dede ikik eiei ieie deki",
    focusKeys: ['e', 'i'],
    gate: { minAccuracy: 0.96 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 29,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 029: Reach Up — The R Key",
    description: "Left index finger stretches UP to R. Return to F.",
    target: "r rr rrr frf rfr frr fr r r rr r",
    focusKeys: ['r'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 30,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 030: Reach Up — The U Key",
    description: "Right index finger stretches UP to U. Return to J.",
    target: "u uu uuu juj uju juu ju u u uu u",
    focusKeys: ['u'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 31,
    phase: 'vertical',
    type: 'pair-drill',
    title: "Stage 031: R + U Pair Drill",
    description: "Vertical index finger coordination.",
    target: "ru ur fur jur dru kru rud rud uru rur",
    focusKeys: ['r', 'u'],
    gate: { minAccuracy: 0.96 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 32,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 032: Reach Up — The T Key",
    description: "Left index stretches inner-UP to T.",
    target: "t tt ttt ftf tft ftt ft t t tt t",
    focusKeys: ['t'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 33,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 033: Reach Up — The Y Key",
    description: "Right index stretches inner-UP to Y.",
    target: "y yy yyy jyj yjy jyy jy y y yy y",
    focusKeys: ['y'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 34,
    phase: 'vertical',
    type: 'word-drill',
    title: "Stage 034: Word Drill — E, R, T, I, U",
    description: "Real words constructible with new keys.",
    target: "fruit rude tire rule fur tree red kid lake life",
    focusKeys: ['e', 'r', 't', 'i', 'u'],
    gate: { minAccuracy: 0.95, minWpm: 24 },
    xpReward: 25,
    estimatedMinutes: 3
  },
  {
    id: 35,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 035: Reach Up — The W Key",
    description: "Left ring finger UP to W.",
    target: "w ww www sws wsw sww sw w w ww w",
    focusKeys: ['w'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 36,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 036: Reach Up — The O Key",
    description: "Right ring finger UP to O.",
    target: "o oo ooo lol olo loo lo o o oo o",
    focusKeys: ['o'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 37,
    phase: 'vertical',
    type: 'pair-drill',
    title: "Stage 037: W + O Pair Drill",
    description: "Ring finger vertical coordination.",
    target: "wo ow sow low row tow who how two too",
    focusKeys: ['w', 'o'],
    gate: { minAccuracy: 0.96 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 38,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 038: Reach Up — The Q Key",
    description: "Left pinky UP to Q.",
    target: "q qq qqq aqa qaq aqq aq q q qq q",
    focusKeys: ['q'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 39,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 039: Reach Up — The P Key",
    description: "Right pinky UP to P.",
    target: "p pp ppp ;p; p;p ;pp ;p p p pp p",
    focusKeys: ['p'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 40,
    phase: 'vertical',
    type: 'cumulative',
    title: "Stage 040: Top Row Integration Drill",
    description: "Practice all top row and home row letters.",
    target: "queen quiet page pack park play plan write tool there they them",
    focusKeys: ['q', 'p', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o'],
    gate: { minAccuracy: 0.95, minWpm: 26 },
    xpReward: 50,
    badgeUnlock: 'top-row-master',
    estimatedMinutes: 3
  },
  {
    id: 41,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 041: Reach Down — The V Key",
    description: "Left index stretches DOWN to V.",
    target: "v vv vvv fvf vfv fvv fv v v vv v",
    focusKeys: ['v'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 42,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 042: Reach Down — The M Key",
    description: "Right index stretches DOWN to M.",
    target: "m mm mmm jmj mjm jmm jm m m mm m",
    focusKeys: ['m'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 43,
    phase: 'vertical',
    type: 'pair-drill',
    title: "Stage 043: V + M Pair Drill",
    description: "Coordinate index stretches down.",
    target: "vm mv fvjm jmvm vmv mvm vjm fmv",
    focusKeys: ['v', 'm'],
    gate: { minAccuracy: 0.96 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 44,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 044: Reach Down — The C Key",
    description: "Left middle stretches DOWN to C.",
    target: "c cc ccc dcd cdc dcc dc c c cc c",
    focusKeys: ['c'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 45,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 045: Reach Down — The Comma Key",
    description: "Right middle stretches DOWN to Comma ,",
    target: ", ,, ,,, k,k ,k, k,, k, , , ,, ,",
    focusKeys: [','],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 46,
    phase: 'vertical',
    type: 'pair-drill',
    title: "Stage 046: C + Comma Pair Drill",
    description: "Coordinate middle finger stretches down.",
    target: "c, ,c dc, k,c cc, ,,, dcd c,c",
    focusKeys: ['c', ','],
    gate: { minAccuracy: 0.96 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 47,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 047: Reach Down — The X Key",
    description: "Left ring stretches DOWN to X.",
    target: "x xx xxx sxs xsx sxx sx x x xx x",
    focusKeys: ['x'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 48,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 048: Reach Down — The Period Key",
    description: "Right ring stretches DOWN to Period .",
    target: ". .. ... l.l .l. l.. l. . . .. .",
    focusKeys: ['.'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 49,
    phase: 'vertical',
    type: 'pair-drill',
    title: "Stage 049: X + Period Pair Drill",
    description: "Coordinate ring finger reaches down.",
    target: "x. .x sx. l.x xx. ... sxs x.x",
    focusKeys: ['x', '.'],
    gate: { minAccuracy: 0.96 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 50,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 050: Reach Down — The Z Key",
    description: "Left pinky stretches DOWN to Z.",
    target: "z zz zzz zaz zaz azz az z z zz z",
    focusKeys: ['z'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 51,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 051: Reach Down — The Slash Key",
    description: "Right pinky stretches DOWN to Slash /",
    target: "/ // /// ;/; /;/ ;// ;/ / / // /",
    focusKeys: ['/'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 52,
    phase: 'vertical',
    type: 'pair-drill',
    title: "Stage 052: Z + Slash Pair Drill",
    description: "Coordinate pinky finger reaches down.",
    target: "z/ /z az/ ;/z zz/ /// zaz z/z",
    focusKeys: ['z', '/'],
    gate: { minAccuracy: 0.96 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 53,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 053: Reach Down — The B Key",
    description: "Left index stretches inner-DOWN to B.",
    target: "b bb bbb fbf bfb fbb fb b b bb b",
    focusKeys: ['b'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 54,
    phase: 'vertical',
    type: 'key-intro',
    title: "Stage 054: Reach Down — The N Key",
    description: "Right index stretches inner-DOWN to N.",
    target: "n nn nnn jnj njn jnn jn n n nn n",
    focusKeys: ['n'],
    gate: { minAccuracy: 0.97 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 55,
    phase: 'vertical',
    type: 'cumulative',
    title: "Stage 055: Full Alphabet Word Drill",
    description: "Unlock all letters. Play with top 50 common words.",
    target: "the quick brown fox jumps over the lazy dog class move clean box boy buy",
    focusKeys: ['b', 'n', 'c', 'v', 'm', 'x', 'z'],
    gate: { minAccuracy: 0.95, minWpm: 28 },
    xpReward: 100,
    badgeUnlock: 'full-alphabet',
    estimatedMinutes: 3
  },
  {
    id: 56,
    phase: 'vertical',
    type: 'word-drill',
    title: "Stage 056: Bottom Row Partial Drill",
    description: "Drill bottom row letters with home/top row mixes.",
    target: "very voice visit value view vote vent vast vest vivid vapor",
    focusKeys: ['v', 'm', 'c', 'x', 'z', 'b', 'n'],
    gate: { minAccuracy: 0.94, minWpm: 28 },
    xpReward: 25,
    estimatedMinutes: 3
  },
  {
    id: 57,
    phase: 'vertical',
    type: 'sentence',
    title: "Stage 057: Sentence Drill #1",
    description: "Symmetric alphabet test sentence.",
    target: "the quick brown fox jumps over the lazy dog.",
    focusKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    gate: { minAccuracy: 0.92 },
    xpReward: 30,
    estimatedMinutes: 3
  },
  {
    id: 58,
    phase: 'vertical',
    type: 'pair-drill',
    title: "Stage 058: Bigram Drill #1",
    description: "Most common English letter pairs: th, he, in, er, an, re.",
    target: "th he in er an re thhe iner anre",
    focusKeys: ['t', 'h', 'e', 'i', 'n', 'r', 'a'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 59,
    phase: 'vertical',
    type: 'word-drill',
    title: "Stage 059: Common Words Mix #1",
    description: "Top common words mixed in a flow.",
    target: "about other many then them these would make like into time has look",
    focusKeys: ['a', 'o', 'm', 't', 'h', 'w', 'l'],
    gate: { minAccuracy: 0.94, minWpm: 30 },
    xpReward: 25,
    estimatedMinutes: 3
  },
  {
    id: 60,
    phase: 'vertical',
    type: 'rhythm',
    title: "Stage 060: Rhythm Drill #2 (70 BPM)",
    description: "Match one keystroke per pulse at 70 BPM.",
    target: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
    focusKeys: ['a', 'b', 'c', 'd', 'e', 'f'],
    gate: { minAccuracy: 0.95, minConsistency: 0.70 },
    xpReward: 30,
    metronomeBpm: 70,
    estimatedMinutes: 2
  },
  {
    id: 61,
    phase: 'vertical',
    type: 'sentence',
    title: "Stage 061: Comma and Period Sentence",
    description: "Natural pauses using commas and periods.",
    target: "pack my box, with five dozen, liquor jugs.",
    focusKeys: [',', '.'],
    gate: { minAccuracy: 0.93 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 62,
    phase: 'vertical',
    type: 'speed-run',
    title: "Stage 062: Speed Run #2",
    description: "Varying words to push speed threshold.",
    target: "water call who oil find long down day did get come made may part only",
    focusKeys: ['w', 'c', 'o', 'f', 'l', 'd', 'g', 'm', 'p'],
    gate: { minAccuracy: 0.93, minWpm: 30 },
    xpReward: 75,
    estimatedMinutes: 3
  },
  {
    id: 63,
    phase: 'vertical',
    type: 'accuracy-run',
    title: "Stage 063: Accuracy Under Pressure",
    description: "High-precision drill. Take it slow.",
    target: "develop ocean warm free minute strong special mind behind clear tail",
    focusKeys: ['d', 'o', 'w', 'f', 'm', 's', 'p', 'b', 'c', 't'],
    gate: { minAccuracy: 0.98 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 64,
    phase: 'vertical',
    type: 'cumulative',
    title: "Stage 064: Alphabet Review",
    description: "Full review of all letters and simple punctuation.",
    target: "she went to see her friend. they read a book, had some tea, and went home.",
    focusKeys: ['s', 'w', 't', 'h', 'f', 'r', 'b', 'c', 'y', 'a', ',', '.'],
    gate: { minAccuracy: 0.94, minWpm: 30 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 65,
    phase: 'vertical',
    type: 'graduation',
    title: "Stage 065: Phase 2 Graduation Test",
    description: "Graduate Phase 2: Vertical Reach exit test.",
    target: "the quick brown fox jumps over the lazy dog. a quick movement of the enemy.",
    focusKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', ','],
    gate: { minAccuracy: 0.92, minWpm: 32 },
    xpReward: 250,
    estimatedMinutes: 3
  },

  // --- PHASE 3: RHYTHM, COORDINATION & SHIFT (Stages 066–090) ---
  {
    id: 66,
    phase: 'coordination',
    type: 'key-intro',
    title: "Stage 066: Left Shift Introduction",
    description: "Hold Left Shift with left pinky, type right-hand letters.",
    tip: "Left pinky holds Shift. Right hand types. Release after.",
    target: "J K L U I O M N J K L U I O M N",
    focusKeys: ['shift'],
    gate: { minAccuracy: 0.95 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 67,
    phase: 'coordination',
    type: 'key-intro',
    title: "Stage 067: Right Shift Introduction",
    description: "Hold Right Shift with right pinky, type left-hand letters.",
    target: "A S D F G Q W E R T V B A S D F G Q W E R T V B",
    focusKeys: ['shift'],
    gate: { minAccuracy: 0.95 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 68,
    phase: 'coordination',
    type: 'sentence',
    title: "Stage 068: Mixed Capitalization Drill",
    description: "Capitalize first letters of sentences.",
    target: "The cat sat. A dog ran. She fell. He left. We came.",
    focusKeys: ['shift'],
    gate: { minAccuracy: 0.90, minWpm: 25 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 69,
    phase: 'coordination',
    type: 'word-drill',
    title: "Stage 069: Proper Nouns Drill",
    description: "Shift in capitalized names.",
    target: "Alice Bob Carol David Emma Frank Grace Henry Ida Jack",
    focusKeys: ['shift'],
    gate: { minAccuracy: 0.90 },
    xpReward: 25,
    estimatedMinutes: 3
  },
  {
    id: 70,
    phase: 'coordination',
    type: 'key-intro',
    title: "Stage 070: CapsLock Introduction",
    description: "Locate and toggle CapsLock for full capitalized words.",
    tip: "Press CapsLock, type CAPS, press CapsLock again.",
    target: "TYPE THIS IN CAPS then back to normal",
    focusKeys: ['capslock'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 71,
    phase: 'coordination',
    type: 'key-intro',
    title: "Stage 071: Enter Key Introduction",
    description: "Press Enter with your right pinky to start a new line.",
    tip: "Use right pinky to reach for Enter.",
    target: "hello\nworld\nenter\nkey\ndrill",
    focusKeys: ['enter'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 72,
    phase: 'coordination',
    type: 'rhythm',
    title: "Stage 072: Rhythm Drill #3 (80 BPM)",
    description: "Speed up cadence target to 80 BPM.",
    target: "the quick brown fox jumps over the lazy dog",
    focusKeys: ['t', 'h', 'e', 'q', 'u', 'i', 'c', 'k'],
    gate: { minAccuracy: 0.95, minConsistency: 0.70 },
    xpReward: 30,
    metronomeBpm: 80,
    estimatedMinutes: 2
  },
  {
    id: 73,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 073: N-Gram Mastery — TH, HE, IN, ER",
    description: "Drill common bigrams in words.",
    target: "the here inner her there that this then",
    focusKeys: ['t', 'h', 'e', 'i', 'n', 'r'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 74,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 074: N-Gram Mastery — AN, RE, ON, AT",
    description: "Focus on transitional key pairs.",
    target: "and are on at rent ran hand stand band",
    focusKeys: ['a', 'n', 'r', 'e', 'o', 't'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 75,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 075: N-Gram Mastery — ES, EN, IS, IT",
    description: "Master fast finger transitions.",
    target: "is it his her this then best vest nest",
    focusKeys: ['e', 's', 'n', 'i', 't'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 76,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 076: N-Gram Mastery — OU, IO, TI, HI",
    description: "Inner and outer reaches coordinator.",
    target: "your our option high this action station question",
    focusKeys: ['o', 'u', 'i', 't', 'h'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 77,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 077: N-Gram Mastery — EA, ST, LE, NG",
    description: "End of Phase N-gram drills.",
    target: "eat east still long sting leaf clear least",
    focusKeys: ['e', 'a', 's', 't', 'l', 'g'],
    gate: { minAccuracy: 0.95 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 78,
    phase: 'coordination',
    type: 'speed-run',
    title: "Stage 078: Common 100 Words Test",
    description: "60-second test of common words.",
    target: "the of to and a in is it you that he was for on are",
    focusKeys: ['t', 'h', 'e', 'o', 'f', 'a', 'n', 'd', 'i', 's', 'w', 'y'],
    gate: { minAccuracy: 0.93, minWpm: 32 },
    xpReward: 75,
    estimatedMinutes: 3
  },
  {
    id: 79,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 079: Pinky Power Left (Q, A, Z, Left Shift)",
    description: "Strengthen your left hand pinky transitions.",
    target: "qaz za qa az qaz zaq aqz QA ZA",
    focusKeys: ['q', 'a', 'z', 'shift'],
    gate: { minAccuracy: 0.93 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 80,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 080: Pinky Power Right (P, Semicolon, Slash)",
    description: "Strengthen your right hand pinky transitions.",
    target: "p; ;/ /; p/ ;p p;/ /;p P; ;/ P/",
    focusKeys: ['p', ';', '/', 'shift'],
    gate: { minAccuracy: 0.93 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 81,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 081: Ring Finger Independence Left (W, S, X)",
    description: "Practice the WSX column transitions.",
    target: "wsx xsw sxx swx wsx sxx wsx xws",
    focusKeys: ['w', 's', 'x'],
    gate: { minAccuracy: 0.94 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 82,
    phase: 'coordination',
    type: 'pair-drill',
    title: "Stage 082: Ring Finger Independence Right (O, L, .)",
    description: "Practice the OL. column transitions.",
    target: "ol. .lo loo olo l.o ol. .ol l.o",
    focusKeys: ['o', 'l', '.'],
    gate: { minAccuracy: 0.94 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 83,
    phase: 'coordination',
    type: 'sentence',
    title: "Stage 083: Full Sentence Flow #1",
    description: "Typing capital letters naturally.",
    target: "She asked if the glass was half full or half empty.",
    focusKeys: ['shift'],
    gate: { minAccuracy: 0.90, minWpm: 30 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 84,
    phase: 'coordination',
    type: 'sentence',
    title: "Stage 084: Full Sentence Flow #2",
    description: "A full pangram with correct capitalization.",
    target: "His quick brown jacket zipped over the sleeping fox.",
    focusKeys: ['shift'],
    gate: { minAccuracy: 0.90, minWpm: 30 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 85,
    phase: 'coordination',
    type: 'cumulative',
    title: "Stage 085: Cumulative Review #1",
    description: "All letters and capitalization in play.",
    target: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen jugs.",
    focusKeys: ['shift'],
    gate: { minAccuracy: 0.92, minWpm: 32 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 86,
    phase: 'coordination',
    type: 'rhythm',
    title: "Stage 086: Typing Rhythm Test",
    description: "We gate you on your consistency score.",
    target: "consistency rhythm cadence pace smooth flow steady typing",
    focusKeys: ['c', 'o', 'n', 's', 'i', 't', 'e', 'y'],
    gate: { minAccuracy: 0.95, minConsistency: 0.70 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 87,
    phase: 'coordination',
    type: 'adaptive',
    title: "Stage 087: Personal Weakness Drill",
    description: "Custom stage generated on your weakest keys.",
    target: null, // Generated at runtime
    focusKeys: [],
    gate: { minAccuracy: 0.95 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 88,
    phase: 'coordination',
    type: 'speed-run',
    title: "Stage 088: Speed Burst Training",
    description: "15-second max effort. Speed ceiling training.",
    target: "run sprint fast speed fly ceiling max flash quick ready go",
    focusKeys: ['r', 'u', 'n', 's', 'p', 'i', 't', 'f', 'a'],
    gate: { minAccuracy: 0.88, minWpm: 35 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 89,
    phase: 'coordination',
    type: 'accuracy-run',
    title: "Stage 089: Accuracy Under Pressure",
    description: "60-second high-accuracy training.",
    target: "the core value is correct typing and proper positioning of hands",
    focusKeys: ['c', 'o', 'r', 'e', 'v', 'a', 'l', 'u'],
    gate: { minAccuracy: 0.98 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 90,
    phase: 'coordination',
    type: 'graduation',
    title: "Stage 090: Phase 3 Graduation Test",
    description: "Graduate Phase 3: Coordination and rhythm exit test.",
    target: "The quick brown fox jumps over the lazy dog. She sat quietly by the lake.",
    focusKeys: ['shift', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    gate: { minAccuracy: 0.90, minWpm: 38 },
    xpReward: 400,
    badgeUnlock: 'shift-shifter',
    estimatedMinutes: 3
  },

  // --- PHASE 4: NUMBERS ROW (Stages 091–115) ---
  {
    id: 91,
    phase: 'numbers',
    type: 'key-intro',
    title: "Stage 091: Introducing 4 and 7",
    description: "4 (left index reach up) and 7 (right index reach up).",
    tip: "Keep hands centered. Reach index fingers up to numbers.",
    target: "4 7 47 74 447 774 4 7 47",
    focusKeys: ['4', '7'],
    gate: { minAccuracy: 0.96 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 92,
    phase: 'numbers',
    type: 'key-intro',
    title: "Stage 092: Introducing 3 and 8",
    description: "3 (left middle reach up) and 8 (right middle reach up).",
    target: "3 8 38 83 338 883 3 8 38",
    focusKeys: ['3', '8'],
    gate: { minAccuracy: 0.96 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 93,
    phase: 'numbers',
    type: 'pair-drill',
    title: "Stage 093: Numbers coordination — 3, 4, 7, 8",
    description: "Alternate middle and index finger reaches.",
    target: "34 78 43 87 3478 8743 38 47",
    focusKeys: ['3', '4', '7', '8'],
    gate: { minAccuracy: 0.94 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 94,
    phase: 'numbers',
    type: 'key-intro',
    title: "Stage 094: Introducing 5 and 6",
    description: "5 (left index stretch up) and 6 (right index stretch up).",
    target: "5 6 56 65 556 665 5 6 56",
    focusKeys: ['5', '6'],
    gate: { minAccuracy: 0.96 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 95,
    phase: 'numbers',
    type: 'key-intro',
    title: "Stage 095: Introducing 2 and 9",
    description: "2 (left ring reach up) and 9 (right ring reach up).",
    target: "2 9 29 92 229 992 2 9 29",
    focusKeys: ['2', '9'],
    gate: { minAccuracy: 0.96 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 96,
    phase: 'numbers',
    type: 'pair-drill',
    title: "Stage 096: Numbers coordination — 2, 5, 6, 9",
    description: "Coordinate ring and inner index numbers.",
    target: "25 69 52 96 2569 9652 29 56",
    focusKeys: ['2', '5', '6', '9'],
    gate: { minAccuracy: 0.94 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 97,
    phase: 'numbers',
    type: 'key-intro',
    title: "Stage 097: Introducing 1 and 0",
    description: "1 (left pinky reach up) and 0 (right pinky reach up).",
    target: "1 0 10 01 110 001 1 0 10",
    focusKeys: ['1', '0'],
    gate: { minAccuracy: 0.96 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 98,
    phase: 'numbers',
    type: 'pair-drill',
    title: "Stage 098: Numbers coordination — 1, 0, 2, 9",
    description: "Pinky and ring finger vertical reaches.",
    target: "10 29 92 01 1029 9201 19 02",
    focusKeys: ['1', '0', '2', '9'],
    gate: { minAccuracy: 0.94 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 99,
    phase: 'numbers',
    type: 'cumulative',
    title: "Stage 099: Full Number Row Unlock",
    description: "Master all digits 1 2 3 4 5 6 7 8 9 0.",
    target: "12345 67890 13579 24680 09876 54321",
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    gate: { minAccuracy: 0.94, minWpm: 20 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 100,
    phase: 'numbers',
    type: 'word-drill',
    title: "Stage 100: Number Sequence Drills",
    description: "Simple digit combinations.",
    target: "1984 2001 1776 2024 1066 1492 9999",
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    gate: { minAccuracy: 0.92 },
    xpReward: 25,
    estimatedMinutes: 2
  },
  {
    id: 101,
    phase: 'numbers',
    type: 'word-drill',
    title: "Stage 101: Phone Number Drill",
    description: "Hyphenated phone number formats.",
    target: "555-1234 800-555-0100 911 999 112",
    focusKeys: ['-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    gate: { minAccuracy: 0.90 },
    xpReward: 25,
    estimatedMinutes: 2
  },
  {
    id: 102,
    phase: 'numbers',
    type: 'word-drill',
    title: "Stage 102: Date & Year Drill",
    description: "Slashed and hyphenated dates.",
    target: "01/01/2000 12/31/1999 2026-06-28 10/12/1492",
    focusKeys: ['/', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    gate: { minAccuracy: 0.90 },
    xpReward: 25,
    estimatedMinutes: 2
  },
  {
    id: 103,
    phase: 'numbers',
    type: 'word-drill',
    title: "Stage 103: Arithmetic Expression Drill",
    description: "Basic math operators with numbers.",
    target: "2 + 3 = 5 10 - 4 = 6 7 + 8 = 15 100 - 4 = 96",
    focusKeys: ['+', '=', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    gate: { minAccuracy: 0.92 },
    xpReward: 25,
    estimatedMinutes: 2
  },
  {
    id: 104,
    phase: 'numbers',
    type: 'word-drill',
    title: "Stage 104: Mixed Letter + Number Drill",
    description: "Words with embedded numbers.",
    target: "step2 room101 level5 stage200 page45 count10",
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    gate: { minAccuracy: 0.92, minWpm: 22 },
    xpReward: 25,
    estimatedMinutes: 3
  },
  {
    id: 105,
    phase: 'numbers',
    type: 'cumulative',
    title: "Stage 105: Numbers Integration Test",
    description: "Test combined letters and numbers.",
    target: "We had 2 cats, 3 dogs, and 12 birds in room 405.",
    focusKeys: ['1', '2', '3', '4', '5', 'c', 'd', 'b'],
    gate: { minAccuracy: 0.92, minWpm: 24 },
    xpReward: 100,
    badgeUnlock: 'number-cruncher',
    estimatedMinutes: 3
  },
  {
    id: 106,
    phase: 'numbers',
    type: 'speed-run',
    title: "Stage 106: Number Row Speed Drill",
    description: "30-second rapid numbers typing.",
    target: "123 456 789 000 987 654 321 555 777",
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    gate: { minAccuracy: 0.90, minWpm: 25 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 107,
    phase: 'numbers',
    type: 'rhythm',
    title: "Stage 107: Number Row Rhythm Drill",
    description: "Cadence training on numbers.",
    target: "1 2 3 4 5 6 7 8 9 0 0 9 8 7 6 5 4 3 2 1",
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    gate: { minAccuracy: 0.94, minConsistency: 0.70 },
    xpReward: 30,
    metronomeBpm: 60,
    estimatedMinutes: 2
  },
  {
    id: 108,
    phase: 'numbers',
    type: 'sentence',
    title: "Stage 108: Zip Code and Address Drill",
    description: "Natural address typing.",
    target: "123 Main St, Apartment 4B, Boston, MA 02115.",
    focusKeys: ['1', '2', '3', '4', '0', '5', ',', '.'],
    gate: { minAccuracy: 0.90 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 109,
    phase: 'numbers',
    type: 'sentence',
    title: "Stage 109: IP Address and Tech Spec Drill",
    description: "Typing technical numbers.",
    target: "IP: 192.168.1.1, Port: 8080. Version: 3.14.15.",
    focusKeys: ['1', '9', '2', '6', '8', '0', '.', ':'],
    gate: { minAccuracy: 0.90 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 110,
    phase: 'numbers',
    type: 'sentence',
    title: "Stage 110: Money and Decimals Drill",
    description: "Decimal currency syntax.",
    target: "He paid 19.99 for dinner and left a 3.50 tip.",
    focusKeys: ['1', '9', '3', '5', '0', '.'],
    gate: { minAccuracy: 0.90 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 111,
    phase: 'numbers',
    type: 'sentence',
    title: "Stage 111: Historical Dates Paragraph",
    description: "Typing numbers in a historical paragraph.",
    target: "The war ended in 1945. The nation was born in 1776. Next event in 2028.",
    focusKeys: ['1', '9', '4', '5', '7', '6', '2', '0', '8'],
    gate: { minAccuracy: 0.90, minWpm: 26 },
    xpReward: 35,
    estimatedMinutes: 3
  },
  {
    id: 112,
    phase: 'numbers',
    type: 'sentence',
    title: "Stage 112: Inventory Counting",
    description: "Typing lists of item counts.",
    target: "Box 1: 50 items. Box 2: 125 items. Box 3: 9 items.",
    focusKeys: ['1', '5', '0', '2', '9', '3'],
    gate: { minAccuracy: 0.90 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 113,
    phase: 'numbers',
    type: 'sentence',
    title: "Stage 113: Flight and Schedule Data",
    description: "Time formats and codes.",
    target: "Flight 704 departs at 10:45 AM. Gate 12. Seat 15C.",
    focusKeys: ['7', '0', '4', '1', '2', '5', ':'],
    gate: { minAccuracy: 0.90 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 114,
    phase: 'numbers',
    type: 'cumulative',
    title: "Stage 114: Comprehensive Numbers Review",
    description: "Practice all numbers with letters.",
    target: "Check items 1 to 10: 5 red, 8 blue, 2 green, 9 white.",
    focusKeys: ['1', '0', '5', '8', '2', '9'],
    gate: { minAccuracy: 0.92, minWpm: 28 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 115,
    phase: 'numbers',
    type: 'graduation',
    title: "Stage 115: Phase 4 Graduation Test",
    description: "Graduate Phase 4: Numbers row exit test.",
    target: "Order #4782 ships on March 3, 2026. Code: 9510.",
    focusKeys: ['4', '7', '8', '2', '3', '0', '2', '6', '9', '5', '1'],
    gate: { minAccuracy: 0.88, minWpm: 35 },
    xpReward: 300,
    estimatedMinutes: 3
  },

  // --- PHASE 5: SYMBOLS & PUNCTUATION (Stages 116–145) ---
  {
    id: 116,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 116: Question Mark ?",
    description: "Reach for Question Mark (Right Shift + /).",
    tip: "Use Left Shift + / for Question Mark.",
    target: "Is that you? Who is it? What happened?",
    focusKeys: ['?'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 117,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 117: Exclamation Mark !",
    description: "Reach for Exclamation (Right Shift + 1).",
    target: "Wow! Stop! That is great! Yes!",
    focusKeys: ['!'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 118,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 118: Apostrophe ' and Quote \"",
    description: "Apostrophe and Quotation Mark reaches.",
    target: "don't let's \"hello\" \"goodbye\" it's she's",
    focusKeys: ['\'', '"'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 119,
    phase: 'symbols',
    type: 'pair-drill',
    title: "Stage 119: Dialogue Writing",
    description: "Dialogues with quotes and questions.",
    target: "She asked: \"Why?\" He said: \"I don't know!\"",
    focusKeys: ['"', '\'', ':', '?'],
    gate: { minAccuracy: 0.90 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 120,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 120: Colon : and Semicolon ;",
    description: "Semicolon and Colon (Shift + ;).",
    target: "item: list; code: error; warning: low;",
    focusKeys: [':', ';'],
    gate: { minAccuracy: 0.95 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 121,
    phase: 'symbols',
    type: 'sentence',
    title: "Stage 121: Ellipsis and Em-dash",
    description: "Dashes and periods coordination.",
    target: "Wait... is that you? Yes -- it's me!",
    focusKeys: ['.', '-'],
    gate: { minAccuracy: 0.90 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 122,
    phase: 'symbols',
    type: 'sentence',
    title: "Stage 122: Dialogue Typing Drill",
    description: "Continuous dialogue practice.",
    target: "She said, \"I don't know.\" He replied: \"Neither do I!\"",
    focusKeys: ['"', ',', '.', ':', '!'],
    gate: { minAccuracy: 0.88 },
    xpReward: 30,
    estimatedMinutes: 3
  },
  {
    id: 123,
    phase: 'symbols',
    type: 'paragraph',
    title: "Stage 123: Punctuation Paragraph #1",
    description: "Continuous paragraph with rich punctuation.",
    target: "Is this it? Yes, indeed! Let's go: we have a long path ahead...",
    focusKeys: ['?', '!', '\'', ':', '.'],
    gate: { minAccuracy: 0.88, minWpm: 28 },
    xpReward: 40,
    estimatedMinutes: 3
  },
  {
    id: 124,
    phase: 'symbols',
    type: 'paragraph',
    title: "Stage 124: Punctuation Paragraph #2",
    description: "Dialogue paragraph.",
    target: "The guide asked, \"Are you ready?\" The group shouted: \"Yes!\"",
    focusKeys: ['"', ',', '?', ':', '!'],
    gate: { minAccuracy: 0.88, minWpm: 28 },
    xpReward: 40,
    estimatedMinutes: 3
  },
  {
    id: 125,
    phase: 'symbols',
    type: 'cumulative',
    title: "Stage 125: Prose Typist Milestone",
    description: "Complete Cluster A punctuation.",
    target: "Ask them: \"Who? When? Why?\" Don't wait; act now!",
    focusKeys: ['?', '!', '"', '\'', ':', ';'],
    gate: { minAccuracy: 0.92, minWpm: 30 },
    xpReward: 100,
    badgeUnlock: 'prose-typist',
    estimatedMinutes: 3
  },
  {
    id: 126,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 126: Hyphen - and Underscore _",
    description: "Reach for hyphen and underscore (Shift + -).",
    target: "word-drill class_name file-path snake_case",
    focusKeys: ['-', '_'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 127,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 127: Equals = and Plus +",
    description: "Equal and Plus (Shift + =).",
    target: "a + b = c; total = sum + tax; x = y + 10",
    focusKeys: ['=', '+'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 128,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 128: Asterisk * and slash /",
    description: "Asterisk (Shift + 8) and division slash.",
    target: "2 * 3 = 6; 100 / 4 = 25; count * rate = cost",
    focusKeys: ['*', '/'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 129,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 129: Percent % and Caret ^",
    description: "Percent (Shift + 5) and Caret (Shift + 6).",
    target: "100% correct; scale^2 = area; interest = 5%; 10^3 = 1000",
    focusKeys: ['%', '^'],
    gate: { minAccuracy: 0.90 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 130,
    phase: 'symbols',
    type: 'cumulative',
    title: "Stage 130: Math Expression Drill",
    description: "Math expressions review.",
    target: "y = m*x + b; rate = 5.5%; area = pi * r^2; a + b = c",
    focusKeys: ['+', '=', '*', '/', '%', '^'],
    gate: { minAccuracy: 0.90, minWpm: 25 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 131,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 131: Parentheses ( and )",
    description: "Parentheses reaches (Shift+9 and Shift+0).",
    target: "(hello) (world) call(arg) (x + y) * z",
    focusKeys: ['(', ')'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 132,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 132: Square Brackets [ and ]",
    description: "Square brackets reaches (right of P).",
    target: "array[0] [list] [item1, item2] [a, b, c]",
    focusKeys: ['[', ']'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 133,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 133: Curly Braces { and }",
    description: "Curly braces (Shift + [ and ]).",
    target: "{ data: 1 } { name: 'admin' } { return true; }",
    focusKeys: ['{', '}'],
    gate: { minAccuracy: 0.90 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 134,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 134: Angle Brackets < and >",
    description: "Angle brackets (Shift + , and .).",
    target: "a < b; y > x; <div>; <span>; <p> hello </p>",
    focusKeys: ['<', '>'],
    gate: { minAccuracy: 0.90 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 135,
    phase: 'symbols',
    type: 'pair-drill',
    title: "Stage 135: Bracket Pairing Drill",
    description: "Various nested brackets.",
    target: "( ) { } [ ] ( [ { } ] ) [ ( { } ) ]",
    focusKeys: ['(', ')', '[', ']', '{', '}'],
    gate: { minAccuracy: 0.90 },
    xpReward: 20,
    estimatedMinutes: 2
  },
  {
    id: 136,
    phase: 'symbols',
    type: 'word-drill',
    title: "Stage 136: HTML Tag Drill",
    description: "HTML markups coding.",
    target: "<div> <span> <p> <a> <ul> <li> <strong> </h1> </div>",
    focusKeys: ['<', '>', '/'],
    gate: { minAccuracy: 0.90, minWpm: 25 },
    xpReward: 25,
    estimatedMinutes: 2
  },
  {
    id: 137,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 137: At @ and Hash #",
    description: "@ (Shift+2) and # (Shift+3).",
    target: "@user #tag @admin #typeflow @example #learn",
    focusKeys: ['@', '#'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 138,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 138: Ampersand & and Pipe |",
    description: "& (Shift+7) and | (Shift+\\).",
    target: "a && b; x || y; data & mask; stream | filter",
    focusKeys: ['&', '|'],
    gate: { minAccuracy: 0.92 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 139,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 139: Backslash \\ and Tilde ~",
    description: "\\ and tilde ~ (Shift + `).",
    target: "C:\\path\\file.txt; ~user; home\\src; ~config",
    focusKeys: ['\\', '~'],
    gate: { minAccuracy: 0.90 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 140,
    phase: 'symbols',
    type: 'key-intro',
    title: "Stage 140: Dollar $ and Backtick `",
    description: "Dollar (Shift+4) and backtick (left of 1).",
    target: "$100; $price; `template ${val}`; $sum; `code`",
    focusKeys: ['$', '`'],
    gate: { minAccuracy: 0.90 },
    xpReward: 15,
    estimatedMinutes: 2
  },
  {
    id: 141,
    phase: 'symbols',
    type: 'word-drill',
    title: "Stage 141: Email Address Drill",
    description: "Emails formatting.",
    target: "user@example.com admin@typeflow.io support@test.org",
    focusKeys: ['@', '.'],
    gate: { minAccuracy: 0.92, minWpm: 28 },
    xpReward: 25,
    estimatedMinutes: 2
  },
  {
    id: 142,
    phase: 'symbols',
    type: 'word-drill',
    title: "Stage 142: URL Drill",
    description: "Web address formatting.",
    target: "https://typeflow.io/learn?stage=142&mode=pro",
    focusKeys: [':', '/', '?', '&', '=', '.'],
    gate: { minAccuracy: 0.88, minWpm: 28 },
    xpReward: 25,
    estimatedMinutes: 2
  },
  {
    id: 143,
    phase: 'symbols',
    type: 'sentence',
    title: "Stage 143: Hashtag & Mention Drill",
    description: "Social media formatting.",
    target: "Check #TypeFlow and follow @typeflow for 100% accuracy!",
    focusKeys: ['#', '@', '%', '!'],
    gate: { minAccuracy: 0.90 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 144,
    phase: 'symbols',
    type: 'cumulative',
    title: "Stage 144: Full Symbol Review",
    description: "Practice all symbol ranges.",
    target: "const res = (x + y) * 100; if (res > 50) return `Success: ${res}%`;",
    focusKeys: ['(', ')', '*', '+', '>', '`', '{', '}', '%', ';', '$'],
    gate: { minAccuracy: 0.88, minWpm: 30 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 145,
    phase: 'symbols',
    type: 'graduation',
    title: "Stage 145: Phase 5 Graduation Test",
    description: "Graduate Phase 5: Symbols and punctuation exit test.",
    target: "user@host:~$ git commit -m \"fix: bugs (issue #42)\" && git push",
    focusKeys: ['@', ':', '~', '$', '-', '"', '(', ')', '#', '&'],
    gate: { minAccuracy: 0.85, minWpm: 40 },
    xpReward: 500,
    badgeUnlock: 'symbol-master',
    estimatedMinutes: 3
  },

  // --- PHASE 6: REAL-WORLD INTEGRATION (Stages 146–175) ---
  {
    id: 146,
    phase: 'integration',
    type: 'paragraph',
    title: "Stage 146: Paragraph Drill — Nature",
    description: "Type paragraphs about ecosystems.",
    target: "Trees draw water from the soil and release oxygen into the air. Forests serve as crucial habitats for thousands of birds and animals.",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 40 },
    xpReward: 40,
    estimatedMinutes: 3
  },
  {
    id: 147,
    phase: 'integration',
    type: 'paragraph',
    title: "Stage 147: Paragraph Drill — Technology",
    description: "Type paragraphs about computers.",
    target: "Computers execute instructions using digital gates and binary logic. Modern processors handle billions of calculations every second.",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 40 },
    xpReward: 40,
    estimatedMinutes: 3
  },
  {
    id: 148,
    phase: 'integration',
    type: 'paragraph',
    title: "Stage 148: Paragraph Drill — History",
    description: "Type paragraphs about human history.",
    target: "Printing presses revolutionized reading in Europe during the fifteenth century. Books became affordable, spreading knowledge rapidly.",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 40 },
    xpReward: 40,
    estimatedMinutes: 3
  },
  {
    id: 149,
    phase: 'integration',
    type: 'paragraph',
    title: "Stage 149: Paragraph Drill — Cooking",
    description: "Type paragraphs about cooking recipes.",
    target: "Add three cups of flour, two eggs, and a pinch of salt. Mix ingredients smoothly before heating the pan to a medium temperature.",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 40 },
    xpReward: 40,
    estimatedMinutes: 3
  },
  {
    id: 150,
    phase: 'integration',
    type: 'paragraph',
    title: "Stage 150: Paragraph Drill — Travel",
    description: "Type paragraphs about traveling the world.",
    target: "Exploring ancient cities provides a deep view of our shared past. Wandering through busy markets exposes vibrant local cultures.",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 40 },
    xpReward: 40,
    estimatedMinutes: 3
  },
  {
    id: 151,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 151: Speed Progression — Target 40 WPM",
    description: "Speed ladder stage 1.",
    target: "the first step on the speed ladder requires comfortable and continuous typing flow",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 40 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 152,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 152: Speed Progression — Target 45 WPM",
    description: "Speed ladder stage 2.",
    target: "moving up to forty five words per minute requires faster transition times between key strikes",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 45 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 153,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 153: Speed Progression — Target 50 WPM",
    description: "Speed ladder stage 3.",
    target: "hitting fifty words per minute means your fingers are starting to memorize patterns automatically",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 50 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 154,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 154: Speed Progression — Target 55 WPM",
    description: "Speed ladder stage 4.",
    target: "pushing to fifty five words per minute requires strict posture and minimal hand movement off home row",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 55 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 155,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 155: Speed Progression — Target 60 WPM",
    description: "Speed ladder stage 5. Enter the pro speed league.",
    target: "congratulations on reaching the sixty words per minute threshold of high efficiency touch typing",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 60 },
    xpReward: 1000,
    badgeUnlock: 'sixty-wpm',
    estimatedMinutes: 3
  },
  {
    id: 156,
    phase: 'integration',
    type: 'rhythm',
    title: "Stage 156: Consistency Training #1",
    description: "Gated on 80% consistency score.",
    target: "smooth cadence gives better speed than fast bursts followed by long pauses",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minConsistency: 0.80 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 157,
    phase: 'integration',
    type: 'rhythm',
    title: "Stage 157: Consistency Training #2",
    description: "Maintain steady typing flow.",
    target: "keep your eyes on the screen and do not check your hands to maintain a steady tempo",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minConsistency: 0.80 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 158,
    phase: 'integration',
    type: 'rhythm',
    title: "Stage 158: Consistency Training #3",
    description: "Balance rhythm under letters.",
    target: "even key presses create a rhythm that helps the brain plan the next moves easily",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minConsistency: 0.80 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 159,
    phase: 'integration',
    type: 'rhythm',
    title: "Stage 159: Consistency Training #4",
    description: "Rhythm under capital letters.",
    target: "Shift keys should be pressed in time with the letter key to keep the rhythm smooth.",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minConsistency: 0.80 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 160,
    phase: 'integration',
    type: 'rhythm',
    title: "Stage 160: Consistency Training #5",
    description: "Final rhythm integration.",
    target: "Maintaining a perfect cadence is the true mark of a professional touch typist.",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minConsistency: 0.80 },
    xpReward: 55,
    estimatedMinutes: 2
  },
  {
    id: 161,
    phase: 'integration',
    type: 'sentence',
    title: "Stage 161: Numbers in Sentences",
    description: "Sentence integration with numbers.",
    target: "Order #4782 ships on March 3. We ordered 15 boxes.",
    focusKeys: ['#', '4', '7', '8', '2', '3', '1', '5'],
    gate: { minAccuracy: 0.92, minWpm: 40 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 162,
    phase: 'integration',
    type: 'sentence',
    title: "Stage 162: URLs and Emails in Sentences",
    description: "URL syntax in prose.",
    target: "Email us at support@typeflow.io or visit https://typeflow.io for help.",
    focusKeys: ['@', ':', '/', '.'],
    gate: { minAccuracy: 0.92, minWpm: 40 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 163,
    phase: 'integration',
    type: 'sentence',
    title: "Stage 163: Quoted Speech in Prose",
    description: "Dialogue syntax in prose.",
    target: "He turned and said: \"I don't believe in luck; I believe in practice!\"",
    focusKeys: ['"', '\'', ':', '!'],
    gate: { minAccuracy: 0.92, minWpm: 40 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 164,
    phase: 'integration',
    type: 'sentence',
    title: "Stage 164: Lists and Bullet Points",
    description: "Bulleted lists style typing.",
    target: "Required: 1) Laptop, 2) Charger, 3) Quiet room, and 4) Good focus.",
    focusKeys: ['1', '2', '3', '4', ')', ','],
    gate: { minAccuracy: 0.92, minWpm: 40 },
    xpReward: 30,
    estimatedMinutes: 2
  },
  {
    id: 165,
    phase: 'integration',
    type: 'paragraph',
    title: "Stage 165: A Professional Email",
    description: "Type a business email draft.",
    target: "Dear team, please review the project specs at our portal before Monday. Best regards.",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 40 },
    xpReward: 40,
    estimatedMinutes: 3
  },
  {
    id: 166,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 166: 2-Minute Endurance Run",
    description: "Longer typing interval. Maintain pace.",
    target: "To type efficiently for long periods, keep your back straight, feet flat on the floor, and your hands relaxed. Make sure your elbows form a ninety degree angle to the typing surface, which minimizes fatigue. Let the muscle memory in your fingers guide the motions without looking down.",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 40 },
    xpReward: 100,
    estimatedMinutes: 3
  },
  {
    id: 167,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 167: 3-Minute Endurance Run",
    description: "Pushing focus to 3 minutes.",
    target: "Consistency is key to typing speed. Fast bursts of writing are often followed by long pauses to correct errors, which ruins your average words per minute. Practice hitting every key accurately, even if it means slowing down. Speed is a natural result of correctness and will follow with time.",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 40 },
    xpReward: 120,
    estimatedMinutes: 4
  },
  {
    id: 168,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 168: 5-Minute Endurance Run",
    description: "5-minute continuous test.",
    target: "Touch typing is the ability to use muscle memory to find keys without looking at the keyboard. It was developed to allow typists to read text continuously while typing it, instead of looking back and forth. By keeping your eyes on the screen, you can catch typos as they happen and type much faster. It takes patience to build this skill, but it is worth the effort.",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 40 },
    xpReward: 150,
    estimatedMinutes: 6
  },
  {
    id: 169,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 169: 10-Minute Endurance Run",
    description: "10-minute continuous test.",
    target: "Touch typing is an essential skill in our modern digital society. Most careers require interacting with computers to write documents, code software, or communicate with team members. Learning to type without looking at the keys saves hours of time every week, allowing you to focus on the content of your thoughts rather than search for letters. Practice regularly to keep your skills sharp.",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 40 },
    xpReward: 200,
    estimatedMinutes: 11
  },
  {
    id: 170,
    phase: 'integration',
    type: 'speed-run',
    title: "Stage 170: 15-Minute Endurance Run",
    description: "15-minute comprehensive test.",
    target: "Touch typing dates back to the late nineteenth century when typewriters were introduced. Since then, keyboard layouts have changed, but the primary method remains the same: assigning each key to a specific finger. This minimizes hand movement and maximizes speed. Professional typists can exceed eighty words per minute with ease, and programmers use it to write code at lightning speeds. Make it a daily habit.",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 40 },
    xpReward: 250,
    estimatedMinutes: 16
  },
  {
    id: 171,
    phase: 'integration',
    type: 'adaptive',
    title: "Stage 171: Weak Spot Elimination #1",
    description: "Adaptive lesson targeting your slowest/most errored keys.",
    target: null,
    focusKeys: [],
    gate: { minAccuracy: 0.95 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 172,
    phase: 'integration',
    type: 'adaptive',
    title: "Stage 172: Weak Spot Elimination #2",
    description: "Adaptive lesson targeting your weakest areas.",
    target: null,
    focusKeys: [],
    gate: { minAccuracy: 0.95 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 173,
    phase: 'integration',
    type: 'adaptive',
    title: "Stage 173: Weak Spot Elimination #3",
    description: "Adaptive lesson targeting your weakest areas.",
    target: null,
    focusKeys: [],
    gate: { minAccuracy: 0.95 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 174,
    phase: 'integration',
    type: 'adaptive',
    title: "Stage 174: Weak Spot Elimination #4",
    description: "Adaptive lesson targeting your weakest areas.",
    target: null,
    focusKeys: [],
    gate: { minAccuracy: 0.95 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 175,
    phase: 'integration',
    type: 'graduation',
    title: "Stage 175: Phase 6 Graduation Test",
    description: "Graduate Phase 6: Real-World Integration exit test.",
    target: "The quick brown fox jumps over the lazy dog. Modern touch typists easily hit sixty words per minute with 98% accuracy.",
    focusKeys: [],
    gate: { minAccuracy: 0.92, minWpm: 45 },
    xpReward: 300,
    estimatedMinutes: 3
  },

  // --- PHASE 7: SPECIALIST TRACKS (Stages 176–200) ---
  // Sub-Track A: Career / Job Interview Prep
  {
    id: 176,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 176: Typing Test Simulation",
    description: "60-second, common 200 words standard test.",
    target: "the quick brown fox jumps over the lazy dog they will serve on the desk",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minWpm: 50 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 177,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 177: Government Typing Format",
    description: "60 WPM civil services standard test.",
    target: "Under the provisions of the civil service acts, applicants must prove typing speed.",
    focusKeys: [],
    gate: { minAccuracy: 0.98, minWpm: 60 },
    xpReward: 60,
    estimatedMinutes: 2
  },
  {
    id: 178,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 178: Data Entry Simulation",
    description: "Addresses, dates and names entry speed run.",
    target: "John Doe, 123 Elm St, Date: 05/12/2026, ID: 89432, WPM: 55.",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minWpm: 45 },
    xpReward: 60,
    estimatedMinutes: 2
  },
  {
    id: 179,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 179: Form Filling Simulation",
    description: "Quick fields typing practice.",
    target: "Name: Alice Smith, Email: alice@example.com, Phone: 555-0199, Zip: 90210.",
    focusKeys: [],
    gate: { minAccuracy: 0.96, minWpm: 45 },
    xpReward: 60,
    estimatedMinutes: 2
  },
  {
    id: 180,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 180: Cover Letter Speed Typing",
    description: "Write cover letter paragraph quickly.",
    target: "I am writing to express my interest in the Software Engineer position at your company.",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minWpm: 50 },
    xpReward: 60,
    estimatedMinutes: 2
  },
  {
    id: 181,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 181: Resume Bullet Points",
    description: "Action statements with numbers.",
    target: "Managed 5 developers, increased productivity by 25%, and saved $15k annually.",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minWpm: 50 },
    xpReward: 60,
    estimatedMinutes: 2
  },
  {
    id: 182,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 182: Certification Test Simulation",
    description: "Prove your Touch Typing proficiency! Earn Certificate.",
    target: "This document certifies that the typist is proficient in keyboard operations.",
    focusKeys: [],
    gate: { minAccuracy: 0.98, minWpm: 60 },
    xpReward: 300,
    badgeUnlock: 'certified-typist',
    estimatedMinutes: 3
  },

  // Sub-Track B: Developer / Programmer Speed
  {
    id: 183,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 183: Python Syntax Drill",
    description: "Common Python keywords.",
    target: "def calculate_sum(a, b):\n    return a + b\n\nfor i in range(10):\n    print(i)",
    focusKeys: ['def', 'return', ':', '_', '(', ')'],
    gate: { minAccuracy: 0.92, minWpm: 35 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 184,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 184: JavaScript Syntax Drill",
    description: "ES6 keywords and arrow functions.",
    target: "const getData = async (id) => {\n  const res = await fetch(`/api/user/${id}`);\n};",
    focusKeys: ['const', '=>', '{', '}', '`', '$'],
    gate: { minAccuracy: 0.92, minWpm: 35 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 185,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 185: CamelCase Drill",
    description: "CamelCase variables.",
    target: "userFirstName getItemById isValidEmail dbConnection apiResponse loadingState",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minWpm: 40 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 186,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 186: Snake_case Drill",
    description: "Snake case variables.",
    target: "get_user_name is_admin created_at updated_at error_message status_code",
    focusKeys: ['_'],
    gate: { minAccuracy: 0.95, minWpm: 40 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 187,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 187: HTML Tag nesting",
    description: "Nesting DOM nodes.",
    target: "<div class=\"wrapper\"><p id=\"text\">Hello World</p></div>",
    focusKeys: ['<', '>', '"', '=', '/'],
    gate: { minAccuracy: 0.92, minWpm: 35 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 188,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 188: CSS property declaration",
    description: "Stylesheet definitions.",
    target: "background-color: #0a0a0a; font-size: 1.5rem; border: 1px solid #fff;",
    focusKeys: [':', ';', '#', '-', '.'],
    gate: { minAccuracy: 0.92, minWpm: 35 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 189,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 189: JSON Data structure",
    description: "Key-value JSON serialization.",
    target: "{\"name\": \"Alice\", \"age\": 30, \"active\": true, \"roles\": [\"admin\"]}",
    focusKeys: ['{', '}', '[', ']', ':', '"', ','],
    gate: { minAccuracy: 0.92, minWpm: 35 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 190,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 190: Terminal command list",
    description: "Git and shell commands.",
    target: "git commit -m \"fix: bugs\" && git push origin main && npm run dev",
    focusKeys: ['-', '"', '&'],
    gate: { minAccuracy: 0.95, minWpm: 45 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 191,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 191: RegEx Pattern matching",
    description: "Match patterns brackets reaches.",
    target: "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/",
    focusKeys: ['^', '$', '[', ']', '{', '}', '+', '\\', '|', '?'],
    gate: { minAccuracy: 0.85, minWpm: 25 },
    xpReward: 60,
    estimatedMinutes: 2
  },
  {
    id: 192,
    phase: 'specialist',
    type: 'specialist',
    track: 'professional',
    title: "Stage 192: Developer Certification Test",
    description: "Write developer code. Earn Badge.",
    target: "const root = createRoot(document.getElementById('root')); root.render(<App />);",
    focusKeys: ['(', ')', '[', ']', '<', '>', '/', ';', '.'],
    gate: { minAccuracy: 0.95, minWpm: 50 },
    xpReward: 300,
    badgeUnlock: 'keyboard-ninja',
    estimatedMinutes: 3
  },

  // Sub-Track C: Advanced Fluency
  {
    id: 193,
    phase: 'specialist',
    type: 'specialist',
    title: "Stage 193: Pangrams Mastery",
    description: "Practice multiple pangrams to cover the alphabet.",
    target: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen jugs.",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minWpm: 55 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 194,
    phase: 'specialist',
    type: 'specialist',
    title: "Stage 194: Tongue Twisters typing",
    description: "Syllables coordination speed run.",
    target: "She sells seashells by the seashore. The shells she sells are surely seashells.",
    focusKeys: [],
    gate: { minAccuracy: 0.93, minWpm: 50 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 195,
    phase: 'specialist',
    type: 'specialist',
    title: "Stage 195: Classic Literature openings",
    description: "Pride and Prejudice classic text.",
    target: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minWpm: 50 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 196,
    phase: 'specialist',
    type: 'specialist',
    title: "Stage 196: Poetry verse typing",
    description: "Structured lines typing.",
    target: "Tyger! Tyger! burning bright\nIn the forests of the night,\nWhat immortal hand or eye\nCould frame thy fearful symmetry?",
    focusKeys: ['!', '?', ',', '\n'],
    gate: { minAccuracy: 0.94, minWpm: 50 },
    xpReward: 50,
    estimatedMinutes: 3
  },
  {
    id: 197,
    phase: 'specialist',
    type: 'specialist',
    title: "Stage 197: Speed ceiling attempt",
    description: "Rapid short text sprint.",
    target: "run as fast as your fingers can glide across the keys of your keyboard",
    focusKeys: [],
    gate: { minAccuracy: 0.90, minWpm: 65 },
    xpReward: 50,
    estimatedMinutes: 2
  },
  {
    id: 198,
    phase: 'specialist',
    type: 'specialist',
    title: "Stage 198: Consistency Champion",
    description: "Consistency gate level 85%.",
    target: "Maintaining a perfect speed across the entire text is the goal of this stage.",
    focusKeys: [],
    gate: { minAccuracy: 0.96, minConsistency: 0.85 },
    xpReward: 100,
    estimatedMinutes: 3
  },
  {
    id: 199,
    phase: 'specialist',
    type: 'specialist',
    title: "Stage 199: The Grand Review",
    description: "A comprehensive final marathon review.",
    target: "The quick brown fox jumps over the lazy dog! Step 2: verify email at user@example.com before stage 200 completion. const root = createRoot(document.getElementById('root'));",
    focusKeys: [],
    gate: { minAccuracy: 0.94, minWpm: 55 },
    xpReward: 200,
    estimatedMinutes: 5
  },
  {
    id: 200,
    phase: 'specialist',
    type: 'graduation',
    title: "Stage 200: Final Graduation",
    description: "Congratulations! Become a TypeFlow Graduate.",
    target: "We are proud of your dedication. You have successfully conquered touch typing on TypeFlow! Enjoy all unlocked themes.",
    focusKeys: [],
    gate: { minAccuracy: 0.95, minWpm: 65 },
    xpReward: 1000,
    badgeUnlock: 'typeflow-graduate',
    estimatedMinutes: 3
  }
];

// Helper to fill unlocked keys monotonically
function computeUnlockedKeys(): Lesson[] {
  const letters = ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', ';', 'g', 'h', 'backspace', 'enter'];
  const vertical = ['e', 'i', 'r', 'u', 't', 'y', 'w', 'o', 'q', 'p', 'v', 'm', 'c', ',', 'x', '.', 'z', '/', 'b', 'n'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'];
  const symbols = ['?', '!', '\'', '"', ':', '+', '=', '*', '%', '^', '(', ')', '[', ']', '{', '}', '<', '>', '@', '#', '&', '|', '\\', '~', '$', '`'];

  const results: Lesson[] = [];
  const currentKeys = new Set<string>();

  for (const raw of rawLessons) {
    // Add default keys based on stage progression
    if (raw.id <= 25) {
      // Phase 1 unlocks foundation keys sequentially
      raw.focusKeys.forEach(k => currentKeys.add(k.toLowerCase()));
      // Ensure space, backspace are included
      if (raw.id >= 4) currentKeys.add(' ');
      if (raw.id >= 20) currentKeys.add('backspace');
    } else if (raw.id <= 65) {
      // Phase 2 unlocks letters, period, comma, slash
      // Ensure all phase 1 are added
      letters.forEach(k => currentKeys.add(k));
      raw.focusKeys.forEach(k => currentKeys.add(k.toLowerCase()));
    } else if (raw.id <= 90) {
      // Phase 3 coordination keys
      letters.forEach(k => currentKeys.add(k));
      vertical.forEach(k => currentKeys.add(k));
      raw.focusKeys.forEach(k => currentKeys.add(k.toLowerCase()));
      currentKeys.add('shift');
      currentKeys.add('capslock');
      currentKeys.add('enter');
    } else if (raw.id <= 115) {
      // Phase 4 numbers row keys
      letters.forEach(k => currentKeys.add(k));
      vertical.forEach(k => currentKeys.add(k));
      currentKeys.add('shift');
      currentKeys.add('capslock');
      currentKeys.add('enter');
      numbers.forEach(k => currentKeys.add(k));
      raw.focusKeys.forEach(k => currentKeys.add(k.toLowerCase()));
    } else {
      // Phase 5, 6, 7 have all keys unlocked
      letters.forEach(k => currentKeys.add(k));
      vertical.forEach(k => currentKeys.add(k));
      currentKeys.add('shift');
      currentKeys.add('capslock');
      currentKeys.add('enter');
      numbers.forEach(k => currentKeys.add(k));
      symbols.forEach(k => currentKeys.add(k));
      raw.focusKeys.forEach(k => currentKeys.add(k.toLowerCase()));
    }

    results.push({
      ...raw,
      unlockedKeys: Array.from(currentKeys)
    });
  }

  return results;
}

export const LESSONS: Lesson[] = computeUnlockedKeys();
export const lessons = LESSONS;
export type { Lesson as LessonV2 };
