import type { TypingTestSession, PersonalBest } from './db';

/**
 * Computes the typing accuracy for each lowercase alphabetical key (a-z)
 * across all completed sessions by analyzing the keystroke logs.
 * Returns a dictionary lookup mapping each key to its total attempts and accuracy percentage.
 */
export function computeKeyAccuracyHeatmap(
  sessions: TypingTestSession[]
): Record<string, { total: number; accuracy: number }> {
  const tempCounts: Record<string, { total: number; correct: number }> = {};

  const targetKeys = [
    ...'abcdefghijklmnopqrstuvwxyz1234567890-=[]\\;\',./'.split(''),
    ' ', 'backspace'
  ];

  for (const key of targetKeys) {
    tempCounts[key] = { total: 0, correct: 0 };
  }

  // Aggregate keystroke metrics from all session logs
  for (const session of sessions) {
    if (!session.keystrokeLog) continue;
    for (const event of session.keystrokeLog) {
      if (!event.target) continue;
      const key = event.target.toLowerCase();
      if (tempCounts[key] !== undefined) {
        tempCounts[key].total++;
        if (event.status === 'correct') {
          tempCounts[key].correct++;
        }
      }
    }
  }

  // Calculate the accuracy percentage for each key
  const heatmap: Record<string, { total: number; accuracy: number }> = {};
  for (const key of targetKeys) {
    const { total, correct } = tempCounts[key];
    heatmap[key] = {
      total,
      accuracy: total > 0 ? (correct / total) * 100 : 0
    };
  }

  return heatmap;
}

/**
 * Maps the raw PersonalBest database records array into a simple
 * duration-to-wpm lookup dictionary for clean UI rendering.
 */
export function getBestWpmPerDuration(bests: PersonalBest[]): Record<number, number> {
  const lookup: Record<number, number> = {};
  for (const pb of bests) {
    lookup[pb.duration] = pb.wpm;
  }
  return lookup;
}

/**
 * Calculates consistency index based on keystroke timeline intervals (coefficient of variation).
 */
export function computeConsistencyScore(timeline: number[]): number {
  if (timeline.length < 2) return 100;
  const mean = timeline.reduce((a, b) => a + b, 0) / timeline.length;
  if (mean === 0) return 100;
  const variance = timeline.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / timeline.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean;
  
  // Consistency is inverse of CV, clamped to [0, 100]%
  const score = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
  return isNaN(score) ? 100 : score;
}

/**
 * Calculates latency intervals between adjacent key presses.
 */
export function computeBigramLatencyMap(sessions: TypingTestSession[]): Record<string, number> {
  const latencies: Record<string, { totalMs: number; count: number }> = {};
  
  for (const session of sessions) {
    if (!session.keystrokeLog) continue;
    for (let i = 1; i < session.keystrokeLog.length; i++) {
      const prev = session.keystrokeLog[i - 1].target.toLowerCase();
      const curr = session.keystrokeLog[i].target.toLowerCase();
      if (!prev || !curr) continue;
      
      const bigram = `${prev}${curr}`;
      const delta = session.keystrokeLog[i].deltaMs || 0;
      if (delta <= 0 || delta > 3000) continue; // ignore pauses
      
      if (!latencies[bigram]) {
        latencies[bigram] = { totalMs: 0, count: 0 };
      }
      latencies[bigram].totalMs += delta;
      latencies[bigram].count += 1;
    }
  }

  const result: Record<string, number> = {};
  for (const [bigram, data] of Object.entries(latencies)) {
    result[bigram] = Math.round(data.totalMs / data.count);
  }
  return result;
}

/**
 * Computes percentage improvement rate between oldest and newest sessions.
 */
export function computeImprovementRate(sessions: TypingTestSession[]): number {
  if (sessions.length < 2) return 0;
  const sorted = [...sessions].sort((a, b) => a.timestamp - b.timestamp);
  const oldestWpm = sorted[0].wpm;
  const newestWpm = sorted[sorted.length - 1].wpm;
  if (oldestWpm === 0) return 0;
  return Math.round(((newestWpm - oldestWpm) / oldestWpm) * 100);
}

/**
 * Computes average duration (seconds) of typing test sessions.
 */
export function computeAverageSessionDuration(sessions: TypingTestSession[]): number {
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((acc, s) => acc + s.duration, 0);
  return Math.round(total / sessions.length);
}

