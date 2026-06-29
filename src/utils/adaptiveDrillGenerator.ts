// src/utils/adaptiveDrillGenerator.ts

import type { KeystrokeEvent, TypingError } from './typingEngine';
import { filterWordsByKeys } from './wordEngine';

export interface WeakSpot {
  key: string;
  errorRate: number;       // errors / total presses for this key
  avgLatencyMs: number;    // average deltaMs from keystrokeLog
  score: number;           // combined weakness score (higher = weaker)
}

/**
 * Analyses the last N sessions' keystroke logs to find the user's
 * 3 weakest keys (by combined error rate + latency score).
 */
export function identifyWeakSpots(
  keystrokeLogs: KeystrokeEvent[][],
  _errorLogs: TypingError[][]
): WeakSpot[] {
  const keyStats = new Map<string, { total: number; errors: number; totalLatencyMs: number }>();
  
  for (const sessionLog of keystrokeLogs) {
    for (const event of sessionLog) {
      const key = event.target.toLowerCase();
      if (!key || key === ' ' || key.length > 1) continue;
      
      const stats = keyStats.get(key) || { total: 0, errors: 0, totalLatencyMs: 0 };
      stats.total += 1;
      if (event.status === 'incorrect') {
        stats.errors += 1;
      }
      stats.totalLatencyMs += event.deltaMs;
      keyStats.set(key, stats);
    }
  }

  // If fewer than 5 sessions of data, return empty array (adaptive falls back)
  if (keystrokeLogs.length < 5) {
    return [];
  }

  const list: { key: string; errorRate: number; avgLatencyMs: number }[] = [];
  let maxErrorRate = 0;
  let maxLatency = 0;

  for (const [key, stats] of keyStats.entries()) {
    if (stats.total === 0) continue;
    const errorRate = stats.errors / stats.total;
    const avgLatencyMs = stats.totalLatencyMs / stats.total;
    list.push({ key, errorRate, avgLatencyMs });
    
    if (errorRate > maxErrorRate) maxErrorRate = errorRate;
    if (avgLatencyMs > maxLatency) maxLatency = avgLatencyMs;
  }

  const scored: WeakSpot[] = list.map(item => {
    const normErrorRate = maxErrorRate > 0 ? item.errorRate / maxErrorRate : 0;
    const normLatency = maxLatency > 0 ? item.avgLatencyMs / maxLatency : 0;
    const score = 0.6 * normErrorRate + 0.4 * normLatency;
    return {
      key: item.key,
      errorRate: item.errorRate,
      avgLatencyMs: item.avgLatencyMs,
      score
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

/**
 * Generates a custom drill string targeting the given weak spots.
 */
export function generateAdaptiveDrill(
  weakSpots: WeakSpot[],
  unlockedKeys: string[],
  wordCorpus: string[],
  targetLength: number
): string {
  const weakKeys = weakSpots.map(w => w.key.toLowerCase());
  const allowedWords = filterWordsByKeys(wordCorpus, unlockedKeys);

  let targetWords = allowedWords.filter(word =>
    word.split('').some(ch => weakKeys.includes(ch.toLowerCase()))
  );

  if (targetWords.length < 10) {
    targetWords = allowedWords;
  }

  const result: string[] = [];
  let seed = targetLength + (weakKeys.length > 0 ? weakKeys[0].charCodeAt(0) : 42);
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const cleanUnlocked = unlockedKeys.filter(c => c !== ' ' && c !== ';');

  for (let i = 0; i < targetLength; i++) {
    if (targetWords.length > 0) {
      const idx = Math.floor(random() * targetWords.length);
      result.push(targetWords[idx]);
    } else {
      const wordLen = Math.floor(random() * 3) + 3;
      let w = '';
      for (let j = 0; j < wordLen; j++) {
        if (j % 2 === 0 && weakKeys.length > 0) {
          w += weakKeys[Math.floor(random() * weakKeys.length)];
        } else if (cleanUnlocked.length > 0) {
          w += cleanUnlocked[Math.floor(random() * cleanUnlocked.length)];
        } else {
          w += 'f';
        }
      }
      result.push(w);
    }
  }

  return result.join(' ');
}

/**
 * Identifies the slowest bigram (two-key transition) from keystroke logs.
 */
export function findSlowestBigram(
  logs: KeystrokeEvent[]
): { bigram: string; avgMs: number } | null {
  if (logs.length < 2) return null;
  
  const bigramTimes = new Map<string, { totalMs: number; count: number }>();
  
  for (let i = 1; i < logs.length; i++) {
    const prev = logs[i - 1].target.toLowerCase();
    const curr = logs[i].target.toLowerCase();
    
    if (prev === ' ' || curr === ' ' || prev.length > 1 || curr.length > 1) {
      continue;
    }
    
    const bigram = prev + curr;
    const stats = bigramTimes.get(bigram) || { totalMs: 0, count: 0 };
    stats.totalMs += logs[i].deltaMs;
    stats.count += 1;
    bigramTimes.set(bigram, stats);
  }

  let slowestBigram = '';
  let maxAvgMs = -1;

  for (const [bigram, stats] of bigramTimes.entries()) {
    if (stats.count === 0) continue;
    const avgMs = stats.totalMs / stats.count;
    if (avgMs > maxAvgMs) {
      maxAvgMs = avgMs;
      slowestBigram = bigram;
    }
  }

  if (!slowestBigram) return null;

  return {
    bigram: slowestBigram,
    avgMs: maxAvgMs
  };
}
