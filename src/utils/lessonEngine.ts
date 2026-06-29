// src/utils/lessonEngine.ts

import type { Lesson, LessonTrack, LessonGraduationGate } from './lessonsData';
import type { UserStats } from '../services/db';
import type { KeystrokeEvent, TypingError } from './typingEngine';
import { getDrillWords } from './wordEngine';
import { identifyWeakSpots, generateAdaptiveDrill } from './adaptiveDrillGenerator';
import { COMMON_WORDS_1000 } from './wordCorpus';

export interface LessonEngineConfig {
  track: LessonTrack;
  currentStage: number;
  unlockedKeys: string[];
  userStats: UserStats;
  recentKeystrokeLogs?: KeystrokeEvent[][];  // For adaptive lessons
  recentErrorLogs?: TypingError[][];         // For adaptive lessons
}

export interface ResolvedLesson extends Lesson {
  resolvedTarget: string;              // Final drill text (never null)
  resolvedGate: LessonGraduationGate;  // Track-adjusted gate
  resolvedXp: number;                  // Streak-multiplied XP reward
}

/**
 * Resolves a lesson for the given track and user context.
 */
export function resolveLesson(
  lesson: Lesson,
  config: LessonEngineConfig
): ResolvedLesson {
  let resolvedTarget = lesson.target;

  if (lesson.target === null) {
    const weakSpots = identifyWeakSpots(
      config.recentKeystrokeLogs || [],
      config.recentErrorLogs || []
    );
    if (weakSpots.length > 0) {
      resolvedTarget = generateAdaptiveDrill(weakSpots, lesson.unlockedKeys, COMMON_WORDS_1000, 45);
    } else {
      // Fall back to cumulative review using all unlocked keys
      const words = getDrillWords(lesson.unlockedKeys, [], 35, config.track);
      resolvedTarget = words.join(' ');
    }
  } else if (lesson.type === 'word-drill') {
    const words = getDrillWords(lesson.unlockedKeys, lesson.focusKeys, 35, config.track);
    resolvedTarget = words.join(' ');
  }

  // Adjust graduation gate based on track
  const resolvedGate = { ...lesson.gate };
  if (config.track === 'young') {
    resolvedGate.minAccuracy = Math.max(0.85, resolvedGate.minAccuracy * 0.95);
    if (lesson.phase === 'foundation' || lesson.phase === 'vertical') {
      delete resolvedGate.minWpm;
    }
  } else if (config.track === 'professional') {
    resolvedGate.minAccuracy = Math.min(1.0, resolvedGate.minAccuracy * 1.03);
    if (resolvedGate.minWpm !== undefined) {
      resolvedGate.minWpm = Math.round(resolvedGate.minWpm * 1.2);
    }
  }

  // Apply streak XP multiplier
  const resolvedXp = applyStreakMultiplier(lesson.xpReward, config.userStats.currentStreak);

  return {
    ...lesson,
    resolvedTarget: resolvedTarget || '',
    resolvedGate,
    resolvedXp
  };
}

/**
 * Returns track-specific display configuration for CSS and UI.
 */
export function getTrackConfig(track: LessonTrack): {
  fontSize: string;          // CSS variable value ('1.4rem' | '1.1rem' | '1rem')
  showHandGuide: boolean;    // Prominent for young, toggleable for adult, hidden for pro
  timePressure: boolean;     // false for young early phases
  displayMode: 'stars' | 'progress-bar' | 'efficiency-score';
  vocabularyPool: 'young' | 'common-1000' | 'professional';
} {
  if (track === 'young') {
    return {
      fontSize: '1.4rem',
      showHandGuide: true,
      timePressure: false,
      displayMode: 'stars',
      vocabularyPool: 'young'
    };
  } else if (track === 'professional') {
    return {
      fontSize: '1rem',
      showHandGuide: false,
      timePressure: true,
      displayMode: 'efficiency-score',
      vocabularyPool: 'professional'
    };
  } else {
    // adult
    return {
      fontSize: '1.1rem',
      showHandGuide: true,
      timePressure: true,
      displayMode: 'progress-bar',
      vocabularyPool: 'common-1000'
    };
  }
}

/**
 * Calculates streak-multiplied XP.
 * 2-day: ×1.1, 7-day: ×1.25, 14-day: ×1.4, 30-day: ×1.5
 */
export function applyStreakMultiplier(baseXp: number, currentStreak: number): number {
  let multiplier = 1.0;
  if (currentStreak >= 30) {
    multiplier = 1.5;
  } else if (currentStreak >= 14) {
    multiplier = 1.4;
  } else if (currentStreak >= 7) {
    multiplier = 1.25;
  } else if (currentStreak >= 2) {
    multiplier = 1.1;
  }
  return Math.round(baseXp * multiplier);
}
