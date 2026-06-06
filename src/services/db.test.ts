/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dexie from 'dexie';

// Mock Dexie
vi.mock('dexie', () => {
  const mockTests: any[] = [];
  const mockPersonalBests: any[] = [];
  const mockLessons: any[] = [];

  // Expose mock databases on globalThis so tests can read/modify them
  (globalThis as any).__mockTests = mockTests;
  (globalThis as any).__mockPersonalBests = mockPersonalBests;
  (globalThis as any).__mockLessons = mockLessons;

  const mockTestsTable = {
    add: vi.fn(async (item: any) => {
      const id = mockTests.length + 1;
      const newItem = { id, ...item };
      mockTests.push(newItem);
      return id;
    }),
    get: vi.fn(async (id: any) => mockTests.find(t => t.id === id)),
    clear: vi.fn(async () => {
      mockTests.length = 0;
    }),
    toArray: vi.fn(async () => [...mockTests]),
    bulkAdd: vi.fn(async (items: any[]) => {
      for (const item of items) {
        const id = mockTests.length + 1;
        mockTests.push({ id, ...item });
      }
    }),
    orderBy: vi.fn(() => ({
      reverse: vi.fn(() => ({
        limit: vi.fn((n: number) => ({
          toArray: vi.fn(async () => {
            return [...mockTests]
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, n);
          })
        })),
        toArray: vi.fn(async () => {
          return [...mockTests].sort((a, b) => b.timestamp - a.timestamp);
        })
      }))
    }))
  };

  const mockPersonalBestsTable = {
    get: vi.fn(async (duration: number) => mockPersonalBests.find(pb => pb.duration === duration)),
    put: vi.fn(async (item: any) => {
      const idx = mockPersonalBests.findIndex(pb => pb.duration === item.duration);
      if (idx !== -1) {
        mockPersonalBests[idx] = item;
      } else {
        mockPersonalBests.push(item);
      }
      return item.duration;
    }),
    clear: vi.fn(async () => {
      mockPersonalBests.length = 0;
    }),
    toArray: vi.fn(async () => [...mockPersonalBests]),
    bulkPut: vi.fn(async (items: any[]) => {
      for (const item of items) {
        const idx = mockPersonalBests.findIndex(pb => pb.duration === item.duration);
        if (idx !== -1) {
          mockPersonalBests[idx] = item;
        } else {
          mockPersonalBests.push(item);
        }
      }
    })
  };

  const mockLessonsTable = {
    add: vi.fn(async (item: any) => {
      const id = mockLessons.length + 1;
      const newItem = { id, ...item };
      mockLessons.push(newItem);
      return id;
    }),
    clear: vi.fn(async () => {
      mockLessons.length = 0;
    }),
    toArray: vi.fn(async () => [...mockLessons]),
    bulkAdd: vi.fn(async (items: any[]) => {
      for (const item of items) {
        const id = mockLessons.length + 1;
        mockLessons.push({ id, ...item });
      }
    }),
    orderBy: vi.fn((key: string) => ({
      reverse: vi.fn(() => ({
        toArray: vi.fn(async () => {
          if (key === 'completedAt') {
            return [...mockLessons].sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
          }
          return [...mockLessons];
        })
      })),
      uniqueKeys: vi.fn(async () => {
        if (key === 'lessonId') {
          const uniqueIds = Array.from(new Set(mockLessons.map(l => l.lessonId)));
          return uniqueIds.sort((a, b) => a - b);
        }
        return [];
      })
    }))
  };

  (globalThis as any).__mockTestsTable = mockTestsTable;
  (globalThis as any).__mockPersonalBestsTable = mockPersonalBestsTable;
  (globalThis as any).__mockLessonsTable = mockLessonsTable;

  return {
    default: class MockDexie {
      tests = mockTestsTable;
      personalBests = mockPersonalBestsTable;
      lessons = mockLessonsTable;
      version = vi.fn().mockReturnValue({
        stores: vi.fn()
      });
      transaction = vi.fn(async (...args: any[]) => {
        const cb = args[args.length - 1];
        return cb();
      });
      close = vi.fn();
      static delete = vi.fn();
    }
  };
});

// Polyfill localStorage for Node.js environment if needed
if (typeof (globalThis as any).localStorage === 'undefined') {
  let store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: 0
  } as any;
  Object.defineProperty((globalThis as any).localStorage, 'length', {
    get: () => Object.keys(store).length
  });
}

// Import the module under test after mocking dexie
import {
  db,
  saveTestSession,
  getTestHistory,
  getPersonalBests,
  exportDataJSON,
  importDataJSON,
  resetDatabase,
  saveLessonAttempt,
  getLessonHistory,
  getCompletedLessonsCount
} from './db';

// Force override tests, personalBests, and lessons on the db singleton instance
Object.defineProperty(db, 'tests', {
  get: () => (globalThis as any).__mockTestsTable,
  configurable: true,
  enumerable: true
});

Object.defineProperty(db, 'personalBests', {
  get: () => (globalThis as any).__mockPersonalBestsTable,
  configurable: true,
  enumerable: true
});

Object.defineProperty(db, 'lessons', {
  get: () => (globalThis as any).__mockLessonsTable,
  configurable: true,
  enumerable: true
});

// Import helper functions to interact with the mock arrays in globalThis
const getMockTests = (): any[] => (globalThis as any).__mockTests;
const getMockPersonalBests = (): any[] => (globalThis as any).__mockPersonalBests;
const getMockLessons = (): any[] => (globalThis as any).__mockLessons;

const setMockTests = (val: any[]) => {
  const tests = getMockTests();
  tests.length = 0;
  tests.push(...val);
};

const setMockPersonalBests = (val: any[]) => {
  const pbs = getMockPersonalBests();
  pbs.length = 0;
  pbs.push(...val);
};

const setMockLessons = (val: any[]) => {
  const lessons = getMockLessons();
  lessons.length = 0;
  lessons.push(...val);
};

describe('TypeFlow local database layer', () => {
  beforeEach(() => {
    setMockTests([]);
    setMockPersonalBests([]);
    setMockLessons([]);
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('saveTestSession', () => {
    it('saves the test session and creates a personal best if none exists', async () => {
      const session = {
        timestamp: 1000,
        duration: 15,
        wpm: 50.0,
        rawWpm: 55.0,
        accuracy: 95.0,
        errorsCount: 2,
        wordsCount: 15,
        keystrokeLog: [],
        missedWords: []
      };

      const id = await saveTestSession(session);
      expect(id).toBe(1);
      expect(getMockTests()).toHaveLength(1);
      expect(getMockTests()[0].wpm).toBe(50.0);

      // Verify personal best was created
      expect(getMockPersonalBests()).toHaveLength(1);
      expect(getMockPersonalBests()[0]).toEqual({
        duration: 15,
        wpm: 50.0,
        accuracy: 95.0,
        timestamp: 1000
      });
    });

    it('updates personal best if new WPM is higher', async () => {
      // Setup existing personal best
      setMockPersonalBests([{ duration: 15, wpm: 45.0, accuracy: 90.0, timestamp: 500 }]);

      const session = {
        timestamp: 1000,
        duration: 15,
        wpm: 50.0,
        rawWpm: 55.0,
        accuracy: 95.0,
        errorsCount: 2,
        wordsCount: 15,
        keystrokeLog: [],
        missedWords: []
      };

      await saveTestSession(session);
      expect(getMockPersonalBests()[0].wpm).toBe(50.0);
      expect(getMockPersonalBests()[0].timestamp).toBe(1000);
    });

    it('does not update personal best if new WPM is lower', async () => {
      // Setup existing personal best
      setMockPersonalBests([{ duration: 15, wpm: 60.0, accuracy: 90.0, timestamp: 500 }]);

      const session = {
        timestamp: 1000,
        duration: 15,
        wpm: 50.0,
        rawWpm: 55.0,
        accuracy: 95.0,
        errorsCount: 2,
        wordsCount: 15,
        keystrokeLog: [],
        missedWords: []
      };

      await saveTestSession(session);
      expect(getMockPersonalBests()[0].wpm).toBe(60.0);
      expect(getMockPersonalBests()[0].timestamp).toBe(500);
    });
  });

  describe('getTestHistory', () => {
    it('returns test history sorted descending by timestamp', async () => {
      setMockTests([
        { id: 1, timestamp: 100, duration: 15, wpm: 40 },
        { id: 2, timestamp: 300, duration: 15, wpm: 60 },
        { id: 3, timestamp: 200, duration: 15, wpm: 50 }
      ]);

      const history = await getTestHistory();
      expect(history[0].timestamp).toBe(300);
      expect(history[1].timestamp).toBe(200);
      expect(history[2].timestamp).toBe(100);
    });

    it('limits results if limit parameter is provided', async () => {
      setMockTests([
        { id: 1, timestamp: 100, duration: 15, wpm: 40 },
        { id: 2, timestamp: 300, duration: 15, wpm: 60 },
        { id: 3, timestamp: 200, duration: 15, wpm: 50 }
      ]);

      const history = await getTestHistory(2);
      expect(history).toHaveLength(2);
      expect(history[0].timestamp).toBe(300);
      expect(history[1].timestamp).toBe(200);
    });
  });

  describe('getPersonalBests', () => {
    it('returns all personal bests', async () => {
      const pbs = [
        { duration: 15, wpm: 60, accuracy: 95, timestamp: 100 },
        { duration: 30, wpm: 55, accuracy: 90, timestamp: 200 }
      ];
      setMockPersonalBests(pbs);

      const result = await getPersonalBests();
      expect(result).toHaveLength(2);
      expect(result).toEqual(pbs);
    });
  });

  describe('saveLessonAttempt', () => {
    it('saves a lesson attempt successfully', async () => {
      const attempt = {
        lessonId: 1,
        completedAt: new Date(2000),
        errorsCount: 3,
        durationSeconds: 120
      };

      const id = await saveLessonAttempt(attempt);
      expect(id).toBe(1);
      expect(getMockLessons()).toHaveLength(1);
      expect(getMockLessons()[0]).toEqual({ id: 1, ...attempt });
    });
  });

  describe('getLessonHistory', () => {
    it('returns lesson attempts sorted by completedAt descending', async () => {
      setMockLessons([
        { id: 1, lessonId: 1, completedAt: new Date('2026-06-01T10:00:00Z'), errorsCount: 1, durationSeconds: 60 },
        { id: 2, lessonId: 2, completedAt: new Date('2026-06-03T10:00:00Z'), errorsCount: 2, durationSeconds: 80 },
        { id: 3, lessonId: 3, completedAt: new Date('2026-06-02T10:00:00Z'), errorsCount: 0, durationSeconds: 50 }
      ]);

      const history = await getLessonHistory();
      expect(history).toHaveLength(3);
      expect(history[0].id).toBe(2);
      expect(history[1].id).toBe(3);
      expect(history[2].id).toBe(1);
    });
  });

  describe('getCompletedLessonsCount', () => {
    it('returns the count of unique lessons completed', async () => {
      setMockLessons([
        { id: 1, lessonId: 1, completedAt: new Date(), errorsCount: 1, durationSeconds: 60 },
        { id: 2, lessonId: 1, completedAt: new Date(), errorsCount: 2, durationSeconds: 80 },
        { id: 3, lessonId: 2, completedAt: new Date(), errorsCount: 0, durationSeconds: 50 }
      ]);

      const count = await getCompletedLessonsCount();
      expect(count).toBe(2);
    });
  });

  describe('exportDataJSON', () => {
    it('dumps the database into a formatted JSON string stripping test and lesson ids', async () => {
      setMockTests([
        { id: 123, timestamp: 100, duration: 15, wpm: 40, rawWpm: 42, accuracy: 95, errorsCount: 1, wordsCount: 10, keystrokeLog: [], missedWords: [] }
      ]);
      setMockPersonalBests([
        { duration: 15, wpm: 40, accuracy: 95, timestamp: 100 }
      ]);
      setMockLessons([
        { id: 456, lessonId: 1, completedAt: new Date(100), errorsCount: 0, durationSeconds: 60 }
      ]);

      const jsonStr = await exportDataJSON();
      const parsed = JSON.parse(jsonStr);

      expect(parsed.version).toBe(1);
      expect(parsed.exportTimestamp).toBeDefined();
      expect(parsed.personalBests).toEqual(getMockPersonalBests());
      expect(parsed.tests[0]).toEqual({
        timestamp: 100,
        duration: 15,
        wpm: 40,
        rawWpm: 42,
        accuracy: 95,
        errorsCount: 1,
        wordsCount: 10,
        keystrokeLog: [],
        missedWords: []
      });
      expect(parsed.tests[0].id).toBeUndefined();

      expect(parsed.lessons[0]).toEqual({
        lessonId: 1,
        completedAt: new Date(100).toISOString(),
        errorsCount: 0,
        durationSeconds: 60
      });
      expect(parsed.lessons[0].id).toBeUndefined();
    });
  });

  describe('importDataJSON', () => {
    const validImportObj = {
      version: 1,
      personalBests: [
        { duration: 15, wpm: 70, accuracy: 98, timestamp: 500 }
      ],
      tests: [
        {
          timestamp: 500,
          duration: 15,
          wpm: 70,
          rawWpm: 72,
          accuracy: 98,
          errorsCount: 1,
          wordsCount: 20,
          keystrokeLog: [],
          missedWords: []
        }
      ],
      lessons: [
        {
          lessonId: 1,
          completedAt: new Date(500).toISOString(),
          errorsCount: 0,
          durationSeconds: 60
        }
      ]
    };

    it('throws error for invalid JSON string', async () => {
      await expect(importDataJSON('invalid-json', 'merge')).rejects.toThrow('Invalid JSON format');
    });

    it('throws error for invalid schema structure', async () => {
      const invalidObj = { version: 1 };
      await expect(importDataJSON(JSON.stringify(invalidObj), 'merge')).rejects.toThrow('Invalid import data schema');
    });

    it('overwrites database in overwrite mode', async () => {
      setMockTests([
        { id: 99, timestamp: 100, duration: 15, wpm: 40, rawWpm: 42, accuracy: 95, errorsCount: 1, wordsCount: 10, keystrokeLog: [], missedWords: [] }
      ]);
      setMockPersonalBests([
        { duration: 15, wpm: 40, accuracy: 95, timestamp: 100 }
      ]);
      setMockLessons([
        { id: 88, lessonId: 2, completedAt: new Date(100), errorsCount: 1, durationSeconds: 50 }
      ]);

      await importDataJSON(JSON.stringify(validImportObj), 'overwrite');

      expect(getMockTests()).toHaveLength(1);
      expect(getMockTests()[0].wpm).toBe(70);
      expect(getMockTests()[0].id).not.toBe(99);
      expect(getMockPersonalBests()).toHaveLength(1);
      expect(getMockPersonalBests()[0].wpm).toBe(70);

      expect(getMockLessons()).toHaveLength(1);
      expect(getMockLessons()[0].lessonId).toBe(1);
      expect(getMockLessons()[0].completedAt).toBeInstanceOf(Date);
      expect(getMockLessons()[0].completedAt.getTime()).toBe(500);
    });

    it('merges database and rebuilds personal bests in merge mode', async () => {
      setMockTests([
        { id: 1, timestamp: 100, duration: 15, wpm: 50, rawWpm: 52, accuracy: 95, errorsCount: 1, wordsCount: 10, keystrokeLog: [], missedWords: [] }
      ]);
      setMockPersonalBests([
        { duration: 15, wpm: 50, accuracy: 95, timestamp: 100 }
      ]);
      setMockLessons([
        { id: 88, lessonId: 2, completedAt: new Date(100), errorsCount: 1, durationSeconds: 50 }
      ]);

      await importDataJSON(JSON.stringify(validImportObj), 'merge');

      expect(getMockTests()).toHaveLength(2);
      expect(getMockTests()[0].wpm).toBe(50);
      expect(getMockTests()[1].wpm).toBe(70);
      expect(getMockPersonalBests()).toHaveLength(1);
      expect(getMockPersonalBests()[0].wpm).toBe(70);

      expect(getMockLessons()).toHaveLength(2);
      expect(getMockLessons()[0].lessonId).toBe(2);
      expect(getMockLessons()[1].lessonId).toBe(1);
      expect(getMockLessons()[1].completedAt).toBeInstanceOf(Date);
      expect(getMockLessons()[1].completedAt.getTime()).toBe(500);
    });

    it('recalculates correct personal bests even if imported personalBests array is empty', async () => {
      setMockTests([]);
      setMockPersonalBests([]);

      const objWithoutPbs = {
        version: 1,
        personalBests: [],
        tests: [
          {
            timestamp: 500,
            duration: 15,
            wpm: 70,
            rawWpm: 72,
            accuracy: 98,
            errorsCount: 1,
            wordsCount: 20,
            keystrokeLog: [],
            missedWords: []
          }
        ]
      };

      await importDataJSON(JSON.stringify(objWithoutPbs), 'overwrite');
      expect(getMockPersonalBests()).toHaveLength(1);
      expect(getMockPersonalBests()[0].wpm).toBe(70);
    });
  });

  describe('resetDatabase', () => {
    it('clears localStorage and deletes IndexedDB database', async () => {
      localStorage.setItem('typeflow_theme', 'light');
      expect(localStorage.getItem('typeflow_theme')).toBe('light');

      const closeSpy = vi.spyOn(db, 'close');
      const deleteSpy = vi.spyOn(Dexie, 'delete');

      await resetDatabase();

      expect(localStorage.getItem('typeflow_theme')).toBeNull();
      expect(closeSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith('TypeFlowDB');
    });
  });
});
