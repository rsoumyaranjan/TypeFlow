// src/utils/dailyChallenge.ts

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

/**
 * Generates today's challenge deterministically from the date.
 * Rotation: Mon=Speed, Tue=Accuracy, Wed=Symbol, Thu=Endurance,
 * Fri=Words, Sat=Freestyle, Sun=Grand Review
 */
export function getTodaysChallenge(): DailyChallenge {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  let type: 'speed' | 'accuracy' | 'endurance' | 'symbol' | 'words';
  let title = '';
  let description = '';
  let gate: { wpm?: number; accuracy?: number; duration?: number } = {};
  let xpReward = 150;
  let content = '';

  switch (dayOfWeek) {
    case 1: // Monday: Speed Challenge
      type = 'speed';
      title = "Monday Speed Burst";
      description = "Push your typing speed limit for 60 seconds! Achieve at least 45 WPM with 95% accuracy.";
      gate = { wpm: 45, accuracy: 0.95, duration: 60 };
      xpReward = 200;
      content = "Developing high typing speed requires letting your fingers flow naturally without hesitation on common letter pairs.";
      break;

    case 2: // Tuesday: Accuracy Challenge
      type = 'accuracy';
      title = "Precision Tuesday";
      description = "Focus on zero mistakes. Get 99% accuracy in 60 seconds.";
      gate = { wpm: 25, accuracy: 0.99, duration: 60 };
      xpReward = 250;
      content = "Slow is smooth and smooth is fast. Prioritize hitting the correct key over rush to avoid building poor muscle habits.";
      break;

    case 3: // Wednesday: Symbol Drill
      type = 'symbol';
      title = "Symbol Wednesday";
      description = "Type code syntax and special characters. Achieve 30 WPM and 88% accuracy.";
      gate = { wpm: 30, accuracy: 0.88, duration: 90 };
      xpReward = 300;
      content = "const data = { id: 101, tags: ['new', 'alert'], value: 99.9 }; if (data.value > 50) { runTask(); }";
      break;

    case 4: // Thursday: Endurance Run
      type = 'endurance';
      title = "Endurance Thursday";
      description = "Maintain focus for a full 120-second continuous session. Goal: 35 WPM.";
      gate = { wpm: 35, accuracy: 0.92, duration: 120 };
      xpReward = 350;
      content = "Typing for longer intervals helps train mental endurance. Focus on a steady pace rather than quick bursts, keeping your posture upright and your wrists elevated slightly off the desk surface. This prevents fatigue and builds a long-term typing baseline.";
      break;

    case 5: // Friday: Words Burst
      type = 'words';
      title = "Word Flow Friday";
      description = "Type common words smoothly. Goal: 50 WPM.";
      gate = { wpm: 50, accuracy: 0.94, duration: 45 };
      xpReward = 200;
      content = "the people of the world need more clean water and green energy to live in peace and harmony with nature";
      break;

    case 6: // Saturday: Freestyle / Warmup
      type = 'words'; // Fallback to words type
      title = "Weekend Warmup";
      description = "Easy typing practice to keep your streak going. Goal: 30 WPM.";
      gate = { wpm: 30, accuracy: 0.90, duration: 60 };
      xpReward = 150;
      content = "Weekend is a great time to review the home row keys and relax while typing some pleasant paragraphs.";
      break;

    case 0: // Sunday: Grand Review
    default:
      type = 'endurance';
      title = "Sunday Grand Review";
      description = "A full review of letters, numbers, and symbols. Goal: 40 WPM, 93% accuracy.";
      gate = { wpm: 40, accuracy: 0.93, duration: 90 };
      xpReward = 400;
      content = "The quick brown fox jumps over the lazy dog! Step 2: verify email at user@example.com before stage 200 completion.";
      break;
  }

  return {
    id: dateStr,
    type,
    title,
    description,
    gate,
    xpReward,
    content
  };
}

/**
 * Check if today's challenge has already been completed.
 */
export function isChallengeCompleted(completedDate: string | null): boolean {
  if (!completedDate) return false;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  return completedDate === dateStr;
}
