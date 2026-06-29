import Dexie, { type Table } from 'dexie';
import type { KeystrokeEvent } from '../utils/typingEngine';
import type { LessonTrack } from '../utils/lessonsData';

export interface TypingTestSession {
  id?: number;
  timestamp: number;
  duration: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errorsCount: number;
  wordsCount: number;
  keystrokeLog: KeystrokeEvent[];
  missedWords: string[];
  wpmTimeline?: number[];
  consistencyScore?: number;
}

export interface PersonalBest {
  duration: number; // Primary Key
  wpm: number;
  accuracy: number;
  timestamp: number;
}

export interface LessonAttempt {
  id?: number;
  lessonId: number;
  completedAt: Date;
  errorsCount: number;
  durationSeconds: number;
  wpm?: number;
  accuracy?: number;
  consistency?: number;
  passed?: boolean;
  xpEarned?: number;
}

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

export interface UserStats {
  id: string; // e.g. "current_user"
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveTimestamp: number;
  unlockedThemes: string[];
  activeTheme: string;
  selectedTrack?: LessonTrack;                // default: 'adult'
  streakShieldAvailable?: boolean;            // earned at 7-day streak
  streakShieldUsedDate?: number | null;
  dailyChallengeLastCompleted?: string | null; // ISO date string
  age?: string;
  gender?: string;
}

export class TypeFlowDB extends Dexie {
  tests!: Table<TypingTestSession, number>;
  personalBests!: Table<PersonalBest, number>;
  lessons!: Table<LessonAttempt, number>;
  userStats!: Table<UserStats, string>;
  badges!: Table<Badge, string>;
  dailyChallenges!: Table<DailyChallengeResult, number>;
  keystrokeHistory!: Table<KeystrokeHistory, number>;

  constructor() {
    super('TypeFlowDB');
    
    // Version 1 (Backwards compatibility)
    this.version(1).stores({
      tests: '++id, timestamp, duration, wpm, accuracy',
      personalBests: 'duration, wpm, timestamp'
    });

    // Version 2 (Adding lessons attempt tracking)
    this.version(2).stores({
      tests: '++id, timestamp, duration, wpm, accuracy',
      personalBests: 'duration, wpm, timestamp',
      lessons: '++id, lessonId, completedAt'
    });

    // Version 3 (Adding Gamification & Streaks)
    this.version(3).stores({
      tests: '++id, timestamp, duration, wpm, accuracy',
      personalBests: 'duration, wpm, timestamp',
      lessons: '++id, lessonId, completedAt',
      userStats: 'id'
    });

    // Version 4 (Expert suggestions data schemas: snapshots timeline, consistency index)
    this.version(4).stores({
      tests: '++id, timestamp, duration, wpm, accuracy, consistencyScore',
      personalBests: 'duration, wpm, timestamp',
      lessons: '++id, lessonId, completedAt',
      userStats: 'id'
    });

    // Version 5 (Badge collection, daily challenges, keystroke history)
    this.version(5).stores({
      tests: '++id, timestamp, duration, wpm, accuracy, consistencyScore',
      personalBests: 'duration, wpm, timestamp',
      lessons: '++id, lessonId, completedAt',
      userStats: 'id',
      badges: 'id, unlockedAt',
      dailyChallenges: '++id, challengeDate, timestamp',
      keystrokeHistory: '++id, lessonId, timestamp'
    }).upgrade(tx => {
      return tx.table('userStats').toCollection().modify(stats => {
        stats.selectedTrack = stats.selectedTrack || 'adult';
        stats.streakShieldAvailable = false;
        stats.streakShieldUsedDate = null;
        stats.dailyChallengeLastCompleted = null;
      });
    });
  }
}

export const db = new TypeFlowDB();

/**
 * Saves a completed typing test session.
 * Checks if the WPM exceeds the current personal best for the session's duration.
 * If it does (or if no PB exists yet), updates the personalBests table.
 */
export async function saveTestSession(session: Omit<TypingTestSession, 'id'>): Promise<number> {
  return db.transaction('rw', db.tests, db.personalBests, async () => {
    const id = await db.tests.add(session as TypingTestSession);
    const existingPb = await db.personalBests.get(session.duration);
    
    if (!existingPb || session.wpm > existingPb.wpm) {
      await db.personalBests.put({
        duration: session.duration,
        wpm: session.wpm,
        accuracy: session.accuracy,
        timestamp: session.timestamp
      });
    }
    
    return id;
  });
}

/**
 * Fetches completed typing tests sorted by timestamp descending.
 * Optional limit parameter to restrict the number of results returned.
 */
export async function getTestHistory(limit?: number): Promise<TypingTestSession[]> {
  const collection = db.tests.orderBy('timestamp').reverse();
  if (limit !== undefined) {
    return collection.limit(limit).toArray();
  }
  return collection.toArray();
}

/**
 * Fetches all personal best scores across all durations.
 */
export async function getPersonalBests(): Promise<PersonalBest[]> {
  return db.personalBests.toArray();
}

/**
 * Saves a completed lesson attempt.
 */
export async function saveLessonAttempt(attempt: Omit<LessonAttempt, 'id'>): Promise<number> {
  return db.lessons.add(attempt as LessonAttempt);
}

/**
 * Fetches lesson attempts history sorted by completion date descending.
 */
export async function getLessonHistory(): Promise<LessonAttempt[]> {
  return db.lessons.orderBy('completedAt').reverse().toArray();
}

/**
 * Fetches all attempts for a specific lesson.
 * Useful for checking historic scores and attempts for a specific lesson stage.
 */
export async function getLessonAttempts(lessonId: number): Promise<LessonAttempt[]> {
  return db.lessons.where('lessonId').equals(lessonId).toArray();
}

/**
 * Counts the number of unique lessons completed.
 */
export async function getCompletedLessonsCount(): Promise<number> {
  const uniqueIds = await db.lessons.orderBy('lessonId').uniqueKeys();
  return uniqueIds.length;
}

/**
 * Dumps the entire database contents (all tables) into a structured JSON string.
 * Strips auto-incremented 'id' fields from tests and lessons to match spec format.
 */
export async function exportDataJSON(): Promise<string> {
  const tests = await db.tests.toArray();
  const personalBests = await db.personalBests.toArray();
  const lessons = await db.lessons.toArray();

  const formattedTests = tests.map((t) => {
    const copy = { ...t };
    delete copy.id;
    return copy;
  });

  const formattedLessons = lessons.map((l) => {
    const copy = { ...l };
    delete copy.id;
    return copy;
  });

  const exportObj = {
    version: 1,
    exportTimestamp: Date.now(),
    personalBests,
    tests: formattedTests,
    lessons: formattedLessons
  };

  return JSON.stringify(exportObj, null, 2);
}

/**
 * Validates and imports a JSON string containing tests, personal bests, and optional lessons.
 * - In 'overwrite' mode: clears all tables before inserting new ones.
 * - In 'merge' mode: appends imported tests/lessons and recalculates personal bests.
 */
export async function importDataJSON(jsonStr: string, mode: 'merge' | 'overwrite'): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let importedData: any;
  try {
    importedData = JSON.parse(jsonStr);
  } catch (err) {
    throw new Error('Invalid JSON format', { cause: err });
  }

  // Schema validation
  if (
    !importedData ||
    typeof importedData !== 'object' ||
    typeof importedData.version !== 'number' ||
    !Array.isArray(importedData.tests) ||
    !Array.isArray(importedData.personalBests)
  ) {
    throw new Error('Invalid import data schema');
  }

  for (const test of importedData.tests) {
    if (
      typeof test.timestamp !== 'number' ||
      typeof test.duration !== 'number' ||
      typeof test.wpm !== 'number' ||
      typeof test.accuracy !== 'number' ||
      typeof test.rawWpm !== 'number' ||
      typeof test.errorsCount !== 'number' ||
      typeof test.wordsCount !== 'number' ||
      !Array.isArray(test.missedWords) ||
      !Array.isArray(test.keystrokeLog)
    ) {
      throw new Error('Invalid test record in import data');
    }
  }

  for (const pb of importedData.personalBests) {
    if (
      typeof pb.duration !== 'number' ||
      typeof pb.wpm !== 'number' ||
      typeof pb.accuracy !== 'number' ||
      typeof pb.timestamp !== 'number'
    ) {
      throw new Error('Invalid personal best record in import data');
    }
  }

  if (importedData.lessons) {
    if (!Array.isArray(importedData.lessons)) {
      throw new Error('Invalid import data schema: lessons must be an array');
    }
    for (const l of importedData.lessons) {
      if (
        typeof l.lessonId !== 'number' ||
        typeof l.errorsCount !== 'number' ||
        typeof l.durationSeconds !== 'number' ||
        !l.completedAt
      ) {
        throw new Error('Invalid lesson record in import data');
      }
    }
  }

  await db.transaction('rw', db.tests, db.personalBests, db.lessons, async () => {
    if (mode === 'overwrite') {
      await db.tests.clear();
      await db.personalBests.clear();
      await db.lessons.clear();

      if (importedData.tests.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const testsToInsert = importedData.tests.map((t: any) => {
          const copy = { ...t };
          delete copy.id;
          return copy;
        });
        await db.tests.bulkAdd(testsToInsert);
      }

      if (importedData.personalBests.length > 0) {
        await db.personalBests.bulkPut(importedData.personalBests);
      } else {
        await rebuildPersonalBestsFromTests();
      }

      if (importedData.lessons && importedData.lessons.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lessonsToInsert = importedData.lessons.map((l: any) => {
          const copy = { ...l };
          delete copy.id;
          copy.completedAt = new Date(l.completedAt);
          return copy;
        });
        await db.lessons.bulkAdd(lessonsToInsert);
      }
    } else {
      // merge mode
      if (importedData.tests.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const testsToInsert = importedData.tests.map((t: any) => {
          const copy = { ...t };
          delete copy.id;
          return copy;
        });
        await db.tests.bulkAdd(testsToInsert);
      }
      await rebuildPersonalBestsFromTests();

      if (importedData.lessons && importedData.lessons.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lessonsToInsert = importedData.lessons.map((l: any) => {
          const copy = { ...l };
          delete copy.id;
          copy.completedAt = new Date(l.completedAt);
          return copy;
        });
        await db.lessons.bulkAdd(lessonsToInsert);
      }
    }
  });
}

/**
 * Deletes the IndexedDB database completely and clears localStorage to comply
 * with Right to be Forgotten privacy regulations.
 */
export async function resetDatabase(): Promise<void> {
  localStorage.clear();
  await db.close();
  await Dexie.delete('TypeFlowDB');
}

/**
 * Internal helper to scan all tests in the database and rebuild the personalBests table.
 */
async function rebuildPersonalBestsFromTests(): Promise<void> {
  const allTests = await db.tests.toArray();
  const bestsMap = new Map<number, { wpm: number; accuracy: number; timestamp: number }>();

  for (const test of allTests) {
    const existing = bestsMap.get(test.duration);
    if (!existing || test.wpm > existing.wpm) {
      bestsMap.set(test.duration, {
        wpm: test.wpm,
        accuracy: test.accuracy,
        timestamp: test.timestamp
      });
    }
  }

  await db.personalBests.clear();
  const newBests: PersonalBest[] = Array.from(bestsMap.entries()).map(([duration, data]) => ({
    duration,
    wpm: data.wpm,
    accuracy: data.accuracy,
    timestamp: data.timestamp
  }));

  if (newBests.length > 0) {
    await db.personalBests.bulkPut(newBests);
  }
}

/**
 * Calculates experience points (XP) based on typing performance metrics.
 */
export function calculateXPEarned(wpm: number, accuracy: number, durationSeconds: number): number {
  const accuracyMultiplier = Math.pow(accuracy / 100, 2);
  const timeFactor = durationSeconds / 10;
  return Math.round(wpm * accuracyMultiplier * timeFactor);
}

/**
 * Adds XP to the user's statistics, level up check is performed dynamically.
 */
export async function addXP(amount: number): Promise<{ levelUp: boolean; newLevel: number; totalXp: number }> {
  return db.transaction('rw', db.userStats, async () => {
    let stats = await db.userStats.get('current_user');
    if (!stats) {
      stats = {
        id: 'current_user',
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveTimestamp: 0,
        unlockedThemes: ['theme-dark', 'theme-light', 'theme-sepia'],
        activeTheme: 'theme-dark'
      };
    }
    
    stats.xp += amount;
    
    // Level Up Threshold: Level = Math.floor(Math.sqrt(XP / 100)) + 1
    const calculatedLevel = Math.floor(Math.sqrt(stats.xp / 100)) + 1;
    const levelUp = calculatedLevel > stats.level;
    
    if (levelUp) {
      stats.level = calculatedLevel;
    }
    
    await db.userStats.put(stats);
    return { levelUp, newLevel: stats.level, totalXp: stats.xp };
  });
}

/**
 * Handles daily active streaks checks on completions.
 */
export async function updateDailyStreak(): Promise<{ currentStreak: number; streakUpdated: boolean; shieldUsed: boolean }> {
  return db.transaction('rw', db.userStats, async () => {
    let stats = await db.userStats.get('current_user');
    const now = new Date();
    
    // Normalize date to midnight for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (!stats) {
      stats = {
        id: 'current_user',
        xp: 0,
        level: 1,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveTimestamp: today,
        unlockedThemes: ['theme-dark', 'theme-light', 'theme-sepia'],
        activeTheme: 'theme-dark',
        selectedTrack: 'adult',
        streakShieldAvailable: false,
        streakShieldUsedDate: null,
        dailyChallengeLastCompleted: null
      };
      await db.userStats.put(stats);
      return { currentStreak: 1, streakUpdated: true, shieldUsed: false };
    }

    const lastActiveDate = new Date(stats.lastActiveTimestamp);
    const lastActiveMidnight = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate()).getTime();
    
    const diffMs = today - lastActiveMidnight;
    let newStreak = stats.currentStreak;
    let updated = false;
    let shieldUsed = false;

    if (diffMs === oneDayMs) {
      // Consecutive day active
      newStreak += 1;
      updated = true;
    } else if (diffMs > oneDayMs) {
      // Streak broken
      if (stats.streakShieldAvailable) {
        // Streak Shield protects!
        stats.streakShieldAvailable = false;
        stats.streakShieldUsedDate = today;
        newStreak += 1; // Preserve and increment streak
        shieldUsed = true;
        updated = true;
      } else {
        newStreak = 1;
        updated = true;
      }
    }

    // Earn streak shield at a 7-day streak
    if (newStreak >= 7 && !stats.streakShieldAvailable) {
      stats.streakShieldAvailable = true;
    }

    if (updated || stats.lastActiveTimestamp !== today) {
      stats.currentStreak = newStreak;
      stats.longestStreak = Math.max(stats.longestStreak, newStreak);
      stats.lastActiveTimestamp = today;
      await db.userStats.put(stats);
    }

    return { currentStreak: stats.currentStreak, streakUpdated: updated, shieldUsed };
  });
}

// --- BADGE CRUD ---
export async function saveBadge(badgeId: string, name: string): Promise<void> {
  await db.badges.put({
    id: badgeId,
    name,
    unlockedAt: Date.now()
  });

  // Automatically unlock a corresponding theme if applicable
  await db.transaction('rw', db.userStats, async () => {
    const stats = await db.userStats.get('current_user');
    if (stats) {
      let themeToUnlock = '';
      if (badgeId === 'home-row-master') themeToUnlock = 'theme-sepia';
      else if (badgeId === 'full-alphabet') themeToUnlock = 'theme-forest';
      else if (badgeId === 'shift-shifter') themeToUnlock = 'theme-neon';
      else if (badgeId === 'number-cruncher') themeToUnlock = 'theme-retro';
      else if (badgeId === 'symbol-master') themeToUnlock = 'theme-cyberpunk';
      else if (badgeId === 'sixty-wpm') themeToUnlock = 'theme-gold';
      else if (badgeId === 'keyboard-ninja') themeToUnlock = 'theme-hacker';

      if (themeToUnlock && !stats.unlockedThemes.includes(themeToUnlock)) {
        stats.unlockedThemes.push(themeToUnlock);
        await db.userStats.put(stats);
      }
    }
  });
}

export async function getBadges(): Promise<Badge[]> {
  return db.badges.toArray();
}

export async function hasBadge(badgeId: string): Promise<boolean> {
  const badge = await db.badges.get(badgeId);
  return !!badge;
}

// --- KEYSTROKE HISTORY (For adaptive analysis) ---
export async function saveKeystrokeHistory(lessonId: number, log: KeystrokeEvent[]): Promise<void> {
  await db.keystrokeHistory.add({
    lessonId,
    keystrokeLog: log,
    timestamp: Date.now()
  });
}

export async function getRecentKeystrokeHistory(sessionCount: number): Promise<KeystrokeHistory[]> {
  return db.keystrokeHistory.orderBy('timestamp').reverse().limit(sessionCount).toArray();
}

// --- DAILY CHALLENGES ---
export async function saveDailyChallengeCompletion(result: DailyChallengeResult): Promise<void> {
  await db.dailyChallenges.add(result);
  await db.transaction('rw', db.userStats, async () => {
    const stats = await db.userStats.get('current_user');
    if (stats) {
      stats.dailyChallengeLastCompleted = result.challengeDate;
      await db.userStats.put(stats);
    }
  });
}

export async function getDailyChallengeCompletion(date: string): Promise<DailyChallengeResult | undefined> {
  return db.dailyChallenges.where('challengeDate').equals(date).first();
}


