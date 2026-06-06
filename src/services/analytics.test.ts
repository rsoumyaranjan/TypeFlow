import { describe, it, expect } from 'vitest';
import { computeKeyAccuracyHeatmap, getBestWpmPerDuration } from './analytics';
import type { TypingTestSession, PersonalBest } from './db';
import type { KeystrokeEvent } from '../utils/typingEngine';

describe('Analytics Utility Service', () => {
  describe('computeKeyAccuracyHeatmap', () => {
    it('returns all keys a-z initialized to zero for empty sessions', () => {
      const heatmap = computeKeyAccuracyHeatmap([]);
      
      // Verify all a-z keys are present with zero values
      expect(Object.keys(heatmap)).toHaveLength(26);
      for (let i = 97; i <= 122; i++) {
        const char = String.fromCharCode(i);
        expect(heatmap[char]).toEqual({ total: 0, accuracy: 0 });
      }
    });

    it('accurately aggregates keystrokes across sessions and handles case insensitivity', () => {
      const keystrokeLog1: KeystrokeEvent[] = [
        { key: 'a', target: 'a', status: 'correct', wordIndex: 0, charIndex: 0, timestamp: 100, deltaMs: 0 },
        { key: 'b', target: 'a', status: 'incorrect', wordIndex: 0, charIndex: 1, timestamp: 200, deltaMs: 100 },
        { key: 'A', target: 'A', status: 'correct', wordIndex: 0, charIndex: 2, timestamp: 300, deltaMs: 100 }, // uppercase target
        { key: ' ', target: ' ', status: 'correct', wordIndex: 0, charIndex: 3, timestamp: 400, deltaMs: 100 },  // non-alphabetic target
        { key: '1', target: '1', status: 'correct', wordIndex: 0, charIndex: 4, timestamp: 500, deltaMs: 100 },  // non-alphabetic target
      ];

      const keystrokeLog2: KeystrokeEvent[] = [
        { key: 'b', target: 'b', status: 'correct', wordIndex: 0, charIndex: 0, timestamp: 100, deltaMs: 0 },
        { key: 'c', target: 'b', status: 'incorrect', wordIndex: 0, charIndex: 1, timestamp: 200, deltaMs: 100 },
      ];

      const sessions: TypingTestSession[] = [
        {
          timestamp: 1000,
          duration: 15,
          wpm: 50,
          rawWpm: 55,
          accuracy: 90,
          errorsCount: 1,
          wordsCount: 15,
          keystrokeLog: keystrokeLog1,
          missedWords: []
        },
        {
          timestamp: 2000,
          duration: 30,
          wpm: 60,
          rawWpm: 62,
          accuracy: 95,
          errorsCount: 1,
          wordsCount: 20,
          keystrokeLog: keystrokeLog2,
          missedWords: []
        }
      ];

      const heatmap = computeKeyAccuracyHeatmap(sessions);

      // Verify 'a' accuracy: 2 correct out of 3 total attempts (a, a, A) -> 66.67%
      expect(heatmap['a'].total).toBe(3);
      expect(heatmap['a'].accuracy).toBeCloseTo(66.6667, 4);

      // Verify 'b' accuracy: 1 correct out of 2 total attempts (b, b) -> 50%
      expect(heatmap['b'].total).toBe(2);
      expect(heatmap['b'].accuracy).toBe(50.0);

      // Verify untyped keys like 'z' remain at zero
      expect(heatmap['z']).toEqual({ total: 0, accuracy: 0 });
    });
  });

  describe('getBestWpmPerDuration', () => {
    it('returns an empty object for empty personal bests list', () => {
      const result = getBestWpmPerDuration([]);
      expect(result).toEqual({});
    });

    it('maps personal best records array into a direct duration lookup map', () => {
      const pbs: PersonalBest[] = [
        { duration: 15, wpm: 72.5, accuracy: 98.0, timestamp: 100 },
        { duration: 60, wpm: 65.2, accuracy: 95.4, timestamp: 200 }
      ];

      const result = getBestWpmPerDuration(pbs);
      expect(result).toEqual({
        15: 72.5,
        60: 65.2
      });
    });
  });
});
