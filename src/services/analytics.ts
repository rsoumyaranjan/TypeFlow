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

  // Initialize the dictionary for all lowercase alphabetical keys a-z
  for (let i = 97; i <= 122; i++) {
    const char = String.fromCharCode(i);
    tempCounts[char] = { total: 0, correct: 0 };
  }

  // Aggregate keystroke metrics from all session logs
  for (const session of sessions) {
    if (!session.keystrokeLog) continue;
    for (const event of session.keystrokeLog) {
      if (!event.target) continue;
      const char = event.target.toLowerCase();
      // Only process standard alphabetical characters (a-z)
      if (char >= 'a' && char <= 'z' && char.length === 1) {
        tempCounts[char].total++;
        if (event.status === 'correct') {
          tempCounts[char].correct++;
        }
      }
    }
  }

  // Calculate the accuracy percentage for each key
  const heatmap: Record<string, { total: number; accuracy: number }> = {};
  for (let i = 97; i <= 122; i++) {
    const char = String.fromCharCode(i);
    const { total, correct } = tempCounts[char];
    heatmap[char] = {
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
