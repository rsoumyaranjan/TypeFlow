import Dexie, { type Table } from 'dexie';
import type { KeystrokeEvent } from '../utils/typingEngine';

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
}

export class TypeFlowDB extends Dexie {
  tests!: Table<TypingTestSession, number>;
  personalBests!: Table<PersonalBest, number>;
  lessons!: Table<LessonAttempt, number>;

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
