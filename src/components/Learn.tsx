import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowRight, Keyboard, XCircle, Award } from 'lucide-react';
import { 
  saveLessonAttempt, 
  db, 
  addXP, 
  updateDailyStreak,
  saveBadge,
  hasBadge,
  saveKeystrokeHistory,
  type UserStats
} from '../services/db';
import { lessons } from '../utils/lessonsData';
import type { LessonTrack } from '../utils/lessonsData';
import { resolveLesson, getTrackConfig } from '../utils/lessonEngine';
import type { ResolvedLesson } from '../utils/lessonEngine';
import { computeConsistencyScore } from '../services/analytics';
import type { KeystrokeEvent, TypingError } from '../utils/typingEngine';

interface LearnProps {
  stageIndex: number;
  onBackToCurriculum: () => void;
  onNavigate: (page: 'dashboard' | 'test' | 'results' | 'practice' | 'progress' | 'about') => void;
  onStartPractice?: (words: string[]) => void;
  track: LessonTrack;
}

// Curriculum phase categories for grouping lessons
const PHASES = [
  { code: 'foundation', label: 'Foundation' },
  { code: 'vertical', label: 'Vertical' },
  { code: 'coordination', label: 'Coordination' },
  { code: 'numbers', label: 'Numbers' },
  { code: 'symbols', label: 'Symbols' },
  { code: 'integration', label: 'Integration' },
  { code: 'specialist', label: 'Specialist' }
] as const;

// Hex color mapping representing standard ten-finger touch-typing assignments
const fingerColors: Record<string, string> = {
  // Left Pinky (Rose)
  'q': '#fda4af', 'a': '#fda4af', 'z': '#fda4af', '1': '#fda4af', '!': '#fda4af',
  // Left Ring (Orange)
  'w': '#fed7aa', 's': '#fed7aa', 'x': '#fed7aa', '2': '#fed7aa', '@': '#fed7aa',
  // Left Middle (Yellow)
  'e': '#fef08a', 'd': '#fef08a', 'c': '#fef08a', '3': '#fef08a', '#': '#fef08a',
  // Left Index (Green)
  'r': '#a7f3d0', 't': '#a7f3d0', 'f': '#a7f3d0', 'g': '#a7f3d0', 'v': '#a7f3d0', 'b': '#a7f3d0', '4': '#a7f3d0', '5': '#a7f3d0', '$': '#a7f3d0', '%': '#a7f3d0',
  // Right Index (Teal)
  'y': '#99f6e4', 'u': '#99f6e4', 'h': '#99f6e4', 'j': '#99f6e4', 'n': '#99f6e4', 'm': '#99f6e4', '6': '#99f6e4', '7': '#99f6e4', '^': '#99f6e4', '&': '#99f6e4',
  // Right Middle (Blue)
  'i': '#bfdbfe', 'k': '#bfdbfe', ',': '#bfdbfe', '8': '#bfdbfe', '*': '#bfdbfe', '<': '#bfdbfe',
  // Right Ring (Purple)
  'o': '#e9d5ff', 'l': '#e9d5ff', '.': '#e9d5ff', '9': '#e9d5ff', '(': '#e9d5ff', '>': '#e9d5ff',
  // Right Pinky (Pink)
  'p': '#fbcfe8', ';': '#fbcfe8', '/': '#fbcfe8', '0': '#fbcfe8', ')': '#fbcfe8', '-': '#fbcfe8', '=': '#fbcfe8', '+': '#fbcfe8', '[': '#fbcfe8', ']': '#fbcfe8', '{': '#fbcfe8', '}': '#fbcfe8', '\\': '#fbcfe8', '|': '#fbcfe8', '\'': '#fbcfe8', '"': '#fbcfe8', '?': '#fbcfe8', '_': '#fbcfe8'
};

// Full QWERTY keyboard rows structure including numbers and symbols
const keyboardRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

/**
 * Identifies the exact finger responsible for hitting a given character.
 * Recommends Shift key overrides for capitalized characters.
 */
const getFingerInfo = (char: string | undefined): { hand: 'left' | 'right'; finger: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb'; color: string; name: string } | null => {
  if (!char) return null;
  const c = char.toLowerCase();
  if (['q', 'a', 'z', '1', '!'].includes(c)) return { hand: 'left', finger: 'pinky', color: '#fda4af', name: 'Left Pinky' };
  if (['w', 's', 'x', '2', '@'].includes(c)) return { hand: 'left', finger: 'ring', color: '#fed7aa', name: 'Left Ring' };
  if (['e', 'd', 'c', '3', '#'].includes(c)) return { hand: 'left', finger: 'middle', color: '#fef08a', name: 'Left Middle' };
  if (['r', 't', 'f', 'g', 'v', 'b', '4', '5', '$', '%'].includes(c)) return { hand: 'left', finger: 'index', color: '#a7f3d0', name: 'Left Index' };
  if (c === ' ') return { hand: 'right', finger: 'thumb', color: '#cbd5e1', name: 'Right Thumb' };
  if (['y', 'u', 'h', 'j', 'n', 'm', '6', '7', '^', '&'].includes(c)) return { hand: 'right', finger: 'index', color: '#99f6e4', name: 'Right Index' };
  if (['i', 'k', ',', '8', '*', '<'].includes(c)) return { hand: 'right', finger: 'middle', color: '#bfdbfe', name: 'Right Middle' };
  if (['o', 'l', '.', '9', '(', '>'].includes(c)) return { hand: 'right', finger: 'ring', color: '#e9d5ff', name: 'Right Ring' };
  if (['p', ';', '/', '0', ')', '-', '=', '+', '[', ']', '{', '}', '\\', '|', '\'', '"', '?', '_'].includes(c)) return { hand: 'right', finger: 'pinky', color: '#fbcfe8', name: 'Right Pinky' };

  if (char !== ' ' && char === char.toUpperCase() && char.match(/[A-Z]/)) {
    if (['Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', 'N', 'M'].includes(char)) return { hand: 'left', finger: 'pinky', color: '#fda4af', name: 'Left Pinky (holding Shift)' };
    return { hand: 'right', finger: 'pinky', color: '#fbcfe8', name: 'Right Pinky (holding Shift)' };
  }
  return { hand: 'right', finger: 'pinky', color: '#fbcfe8', name: 'Right Pinky' };
};

// Curriculum reward milestones and level information titles
const BADGE_NAMES: Record<string, string> = {
  'home-row-master': '🏠 Home Row Master',
  'top-row-master': '⬆️ Top Row Master',
  'full-alphabet': '🔤 Alphabet Complete',
  'shift-shifter': '⬆️ Shift Shifter',
  'number-cruncher': '🔢 Number Cruncher',
  'symbol-master': '#️⃣ Symbol Master',
  'sixty-wpm': '🚀 60 WPM Club',
  'certified-typist': '📜 Certified Typist',
  'keyboard-ninja': '🥷 Keyboard Ninja',
  'typeflow-graduate': '🎓 TypeFlow Graduate'
};

export function getLevelName(level: number): string {
  if (level >= 30) return 'TypeFlow Legend';
  if (level >= 25) return 'Code Slinger';
  if (level >= 20) return 'Symbol Sorcerer';
  if (level >= 15) return 'Speed Demon';
  if (level >= 10) return 'Word Smith';
  if (level >= 5) return 'Keyboard Apprentice';
  return 'Novice Typist';
}

/**
 * Play synthesizer audio cues using Web Audio API oscillators.
 * Cues have type 'key' (click), 'error' (buzz), or 'success' (arpeggio).
 */
const playSound = (type: 'key' | 'error' | 'success') => {
  const soundEnabled = localStorage.getItem('typeflow_sound_enabled') !== 'false';
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'key') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

/**
 * Interactive touch-typing guide tutorial component.
 * Allows users to learn lesson-by-lesson using a visual finger layout, error indicators, and graduation benchmarks.
 */
export const Learn: React.FC<LearnProps> = ({ stageIndex, onBackToCurriculum, onNavigate, track }) => {
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(stageIndex);
  const [charPointer, setCharPointer] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorsCount, setErrorsCount] = useState<number>(0);

  // Expanded track contexts & DB resolution
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentKeystrokeHistory, setRecentKeystrokeHistory] = useState<KeystrokeEvent[][]>([]);
  const [recentErrorHistory, setRecentErrorHistory] = useState<TypingError[][]>([]);
  const [resolvedLesson, setResolvedLesson] = useState<ResolvedLesson | null>(null);

  // Rhythm and gates tracking
  const [keystrokeLog, setKeystrokeLog] = useState<KeystrokeEvent[]>([]);
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState<number>(0);
  const [maxConsecutiveErrors, setMaxConsecutiveErrors] = useState<number>(0);

  // Live status meters
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveAcc, setLiveAcc] = useState<number>(100);

  // Celebrations
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; levelName: string } | null>(null);
  const [streakMilestone, setStreakMilestone] = useState<number | null>(null);

  // Graduation status results upon lesson completion
  const [finalStats, setFinalStats] = useState<{
    wpm: number;
    accuracy: number;
    consistency: number;
    graduated: boolean;
    duration: number;
  } | null>(null);

  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const isDefaultTarget = !localStorage.getItem('typeflow_custom_target_wpm') && !localStorage.getItem('typeflow_custom_target_acc');

  const activeLesson = lessons[activeLessonIdx];
  const targetText = resolvedLesson ? resolvedLesson.resolvedTarget : (activeLesson.target || '');
  const currentTargetChar = targetText[charPointer];
  const isCompleted = charPointer >= targetText.length && targetText.length > 0;

  // Refs for character pointer and start time to prevent stale closure issues in the keydown listener
  const charPointerRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    charPointerRef.current = charPointer;
  }, [charPointer]);

  useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);

  // Sync prop changes
  useEffect(() => {
    setActiveLessonIdx(stageIndex);
  }, [stageIndex]);

  // Load context from IndexedDB
  useEffect(() => {
    const fetchContext = async () => {
      const stats = await db.userStats.get('current_user');
      setUserStats(stats || null);

      const history = await db.keystrokeHistory.orderBy('timestamp').reverse().limit(5).toArray();
      const logs = history.map(h => h.keystrokeLog);
      setRecentKeystrokeHistory(logs);

      const errLogs = logs.map(log => 
          log.filter(k => k.status === 'incorrect').map(k => ({
            wordIndex: k.wordIndex,
            charIndex: k.charIndex,
            expected: k.target,
            actual: k.key,
            timestamp: k.timestamp
          }))
      );
      setRecentErrorHistory(errLogs);
    };
    fetchContext();
  }, [activeLessonIdx]);

  // Resolve lesson track variables
  useEffect(() => {
    if (!userStats) return;
    const rawLesson = lessons[activeLessonIdx];
    const config = {
      track: track || userStats.selectedTrack || 'adult',
      currentStage: rawLesson.id,
      unlockedKeys: rawLesson.unlockedKeys || [],
      userStats,
      recentKeystrokeLogs: recentKeystrokeHistory,
      recentErrorLogs: recentErrorHistory
    };
    const resolved = resolveLesson(rawLesson, config);
    setResolvedLesson(resolved);

    // Reset session states
    setCharPointer(0);
    setHasError(false);
    setStartTime(null);
    setErrorsCount(0);
    setFinalStats(null);
    setKeystrokeLog([]);
    setLastKeystrokeTime(null);
    setConsecutiveErrors(0);
    setMaxConsecutiveErrors(0);
    setLiveWpm(0);
    setLiveAcc(100);
  }, [activeLessonIdx, userStats, recentKeystrokeHistory, track]);

  // Live updates
  useEffect(() => {
    if (!startTime || isCompleted) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0) {
        setLiveWpm(Math.round((charPointer / 5) / (elapsed / 60)));
      }
      setLiveAcc(charPointer === 0 ? 100 : Math.round((charPointer / (charPointer + errorsCount)) * 100));
    }, 200);
    return () => clearInterval(interval);
  }, [startTime, charPointer, errorsCount, isCompleted]);

  // Max consecutive errors tracker
  useEffect(() => {
    if (consecutiveErrors > maxConsecutiveErrors) {
      setMaxConsecutiveErrors(consecutiveErrors);
    }
  }, [consecutiveErrors, maxConsecutiveErrors]);

  // Persist attempt & award XP/badges when completed
  useEffect(() => {
    if (isCompleted && startTime && !finalStats) {
      const endTime = Date.now();
      const durationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));
      
      const finalWpm = Math.round((targetText.length / 5) / (durationSeconds / 60));
      const finalAccuracy = Math.round((targetText.length / (targetText.length + errorsCount)) * 100);
      
      // Calculate consistency
      const intervals = keystrokeLog.map(k => k.deltaMs).filter(d => d > 0);
      const finalConsistency = computeConsistencyScore(intervals);

      // Gate check
      const gate = resolvedLesson ? resolvedLesson.resolvedGate : activeLesson.gate;
      const targetWpm = gate.minWpm !== undefined ? gate.minWpm : parseInt(localStorage.getItem('typeflow_custom_target_wpm') || '25');
      const targetAcc = gate.minAccuracy * 100;
      const targetConsistency = gate.minConsistency !== undefined ? gate.minConsistency * 100 : 0;

      const gateWpmPassed = gate.minWpm === undefined || finalWpm >= targetWpm;
      const gateAccPassed = finalAccuracy >= targetAcc;
      const gateConsistencyPassed = gate.minConsistency === undefined || finalConsistency >= targetConsistency;
      const gateErrorsPassed = gate.maxConsecutiveErrors === undefined || maxConsecutiveErrors <= gate.maxConsecutiveErrors;

      const isGraduated = gateWpmPassed && gateAccPassed && gateConsistencyPassed && gateErrorsPassed;

      if (!isGraduated) {
        setFailedAttempts(prev => prev + 1);
      } else {
        setFailedAttempts(0);
      }

      setFinalStats({
        wpm: finalWpm,
        accuracy: finalAccuracy,
        consistency: finalConsistency,
        graduated: isGraduated,
        duration: durationSeconds
      });

      const saveAttempt = async () => {
        try {
          // Save keystroke history for future adaptive drills
          await saveKeystrokeHistory(activeLesson.id, keystrokeLog);

          await saveLessonAttempt({
            lessonId: activeLesson.id,
            completedAt: new Date(),
            errorsCount,
            durationSeconds,
            wpm: finalWpm,
            accuracy: finalAccuracy,
            consistency: finalConsistency,
            passed: isGraduated,
            xpEarned: isGraduated ? (resolvedLesson?.resolvedXp || 15) : 0
          });

          if (isGraduated) {
            playSound('success');
            const xp = resolvedLesson ? resolvedLesson.resolvedXp : 15;
            const { levelUp, newLevel } = await addXP(xp);
            const { currentStreak, streakUpdated } = await updateDailyStreak();

            // Celebrations
            if (levelUp) {
              setLevelUpInfo({
                level: newLevel,
                levelName: getLevelName(newLevel)
              });
              setTimeout(() => setLevelUpInfo(null), 3000);
            }

            if (streakUpdated && [3, 7, 14, 30].includes(currentStreak)) {
              setStreakMilestone(currentStreak);
              setTimeout(() => setStreakMilestone(null), 3000);
            }

            if (finalWpm >= 60) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 4000);
            }

            // Award Badge
            let unlockedBadgeName = '';
            if (resolvedLesson?.badgeUnlock) {
              const hasIt = await hasBadge(resolvedLesson.badgeUnlock);
              if (!hasIt) {
                const name = BADGE_NAMES[resolvedLesson.badgeUnlock] || resolvedLesson.badgeUnlock;
                await saveBadge(resolvedLesson.badgeUnlock, name);
                unlockedBadgeName = name;
              }
            }

            if (finalWpm >= 60) {
              const hasIt = await hasBadge('sixty-wpm');
              if (!hasIt) {
                await saveBadge('sixty-wpm', '🚀 60 WPM Club');
                unlockedBadgeName = unlockedBadgeName || '🚀 60 WPM Club';
              }
            }

            if (unlockedBadgeName) {
              setUnlockedBadge(unlockedBadgeName);
              setTimeout(() => setUnlockedBadge(null), 3000);
            }
          } else {
            playSound('error');
          }
        } catch (err) {
          console.error('Failed to save attempt:', err);
        }
      };
      saveAttempt();
    }
  }, [isCompleted, startTime, errorsCount, activeLesson.id, finalStats, targetText.length, consecutiveErrors, keystrokeLog, maxConsecutiveErrors, resolvedLesson, activeLesson.gate]);

  // Handle keystrokes on the interactive keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (charPointerRef.current >= targetText.length) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (finalStats) {
            if (finalStats.graduated) {
              handleNextLesson();
            } else {
              handleRestart();
            }
          }
        }
        return;
      }

      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === ' ') e.preventDefault();

      const now = Date.now();
      const deltaMs = lastKeystrokeTime !== null ? now - lastKeystrokeTime : 0;

      if (hasError) {
        if (e.key === 'Backspace') {
          setHasError(false);
          setLastKeystrokeTime(now);
          setKeystrokeLog(prev => [...prev, {
            key: 'backspace',
            target: 'backspace',
            wordIndex: 0,
            charIndex: charPointerRef.current,
            timestamp: now,
            deltaMs,
            status: 'correct'
          }]);
          playSound('key');
        }
        return;
      }

      const key = e.key.toLowerCase();
      setPressedKey(key === ' ' ? 'space' : key);

      if (startTimeRef.current === null) {
        setStartTime(now);
      }

      const targetChar = targetText[charPointerRef.current];
      const pressed = e.key;

      const isCorrect = (pressed === ' ' && targetChar === ' ') || 
                        (pressed.toLowerCase() === (targetChar ? targetChar.toLowerCase() : '') && pressed !== ' ');

      if (isCorrect) {
        setCharPointer((prev) => prev + 1);
        setHasError(false);
        setConsecutiveErrors(0);
        setLastKeystrokeTime(now);
        setKeystrokeLog(prev => [...prev, {
          key: pressed,
          target: targetChar || '',
          wordIndex: 0,
          charIndex: charPointerRef.current,
          timestamp: now,
          deltaMs,
          status: 'correct'
        }]);
        playSound('key');
      } else {
        if (pressed.length === 1 || pressed === ' ') {
          setHasError(true);
          setErrorsCount((prev) => prev + 1);
          setConsecutiveErrors((prev) => prev + 1);
          setLastKeystrokeTime(now);
          setKeystrokeLog(prev => [...prev, {
            key: pressed,
            target: targetChar || '',
            wordIndex: 0,
            charIndex: charPointerRef.current,
            timestamp: now,
            deltaMs,
            status: 'incorrect'
          }]);
          playSound('error');
        }
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetText, hasError, finalStats, lastKeystrokeTime]);

  const handleRestart = () => {
    charPointerRef.current = 0;
    setCharPointer(0);
    setHasError(false);
    setPressedKey(null);
    setStartTime(null);
    setErrorsCount(0);
    setFinalStats(null);
    setKeystrokeLog([]);
    setLastKeystrokeTime(null);
    setConsecutiveErrors(0);
    setMaxConsecutiveErrors(0);
    setLiveWpm(0);
    setLiveAcc(100);
  };

  const handleNextLesson = () => {
    if (activeLessonIdx < lessons.length - 1) {
      const nextIdx = activeLessonIdx + 1;
      setActiveLessonIdx(nextIdx);
      charPointerRef.current = 0;
      setCharPointer(0);
      setHasError(false);
      setPressedKey(null);
      setStartTime(null);
      setErrorsCount(0);
      setFinalStats(null);
      setKeystrokeLog([]);
      setLastKeystrokeTime(null);
      setConsecutiveErrors(0);
      setMaxConsecutiveErrors(0);
      setLiveWpm(0);
      setLiveAcc(100);
    }
  };

  const getKeyStyle = (char: string) => {
    const key = char.toLowerCase();
    const color = fingerColors[key] || '#cbd5e1'; 
    const isPressed = pressedKey === key;
    const isTarget = currentTargetChar && currentTargetChar.toLowerCase() === key && !isCompleted;

    if (isPressed) {
      return {
        backgroundColor: color,
        borderColor: color,
        color: '#0b0f19',
        transform: 'scale(0.95)',
        boxShadow: `0 0 10px ${color}`
      };
    }

    if (isTarget) {
      return {
        backgroundColor: 'rgba(21, 27, 45, 0.6)',
        borderColor: color,
        borderWidth: '2px',
        color: 'var(--text)',
        animation: 'pulse 1.5s infinite alternate',
        boxShadow: `0 0 12px ${color}`
      };
    }

    return {
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border)',
      color: 'var(--text-dim)'
    };
  };

  const getSpacebarStyle = () => {
    const isPressed = pressedKey === 'space';
    const isTarget = currentTargetChar === ' ' && !isCompleted;
    const color = '#cbd5e1';

    if (isPressed) {
      return {
        backgroundColor: color,
        borderColor: color,
        color: '#0b0f19',
        transform: 'scale(0.98)',
        boxShadow: `0 0 10px ${color}`
      };
    }

    if (isTarget) {
      return {
        backgroundColor: 'rgba(21, 27, 45, 0.6)',
        borderColor: 'var(--accent)',
        borderWidth: '2px',
        color: 'var(--text)',
        animation: 'pulse 1.5s infinite alternate',
        boxShadow: '0 0 12px rgba(14, 165, 233, 0.4)'
      };
    }

    return {
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border)',
      color: 'var(--text-muted)'
    };
  };

  const activeFinger = getFingerInfo(currentTargetChar);
  const trackConfig = getTrackConfig(track);
  const lessonType = resolvedLesson?.type || activeLesson.type;
  const bpm = resolvedLesson?.metronomeBpm || activeLesson.metronomeBpm;

  // Simple Confetti Renderer
  const renderConfetti = () => {
    return (
      <div className="confetti-container" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = 2 + Math.random() * 2;
          const color = ['#ffb347', '#6c5ce7', '#00cec9', '#10b981', '#f43f5e'][Math.floor(Math.random() * 5)];
          return (
            <div
              key={i}
              className="confetti-piece"
              style={{
                position: 'absolute',
                top: '-10px',
                left: `${left}%`,
                width: '10px',
                height: '10px',
                backgroundColor: color,
                borderRadius: '50%',
                opacity: 0.8,
                animation: `fall ${duration}s linear ${delay}s infinite`
              }}
            />
          );
        })}
        <style>{`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
          }
        `}</style>
      </div>
    );
  };

  // Badge Banner Renderer
  const renderBadgeBanner = () => {
    return (
      <div 
        className="badge-banner"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #d4af37 0%, #f9e8a2 100%)',
          color: '#0b0f19',
          padding: '1rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontWeight: 'bold',
          animation: 'badge-unlock-slide 3s ease forwards'
        }}
      >
        <Award size={28} />
        <div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase' }}>New Badge Earned!</div>
          <div style={{ fontSize: '1.2rem' }}>{unlockedBadge}</div>
        </div>
      </div>
    );
  };

  // Level Up Overlay
  const renderLevelUpOverlay = () => {
    if (!levelUpInfo) return null;
    return (
      <div 
        className="level-up-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 15, 25, 0.9)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          animation: 'fadeIn 0.3s ease'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', color: '#ffb347', margin: '0 0 1rem 0' }}>LEVEL UP!</h1>
          <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Level {levelUpInfo.level}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>{levelUpInfo.levelName}</p>
        </div>
      </div>
    );
  };

  // Streak Milestone
  const renderStreakMilestone = () => {
    return (
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #f97316 0%, #facc15 100%)',
          color: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '10px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 'bold',
          animation: 'pop 0.3s ease'
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>🔥</span>
        <div>
          <div>Streak Milestone!</div>
          <div>{streakMilestone} Days Active</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex-col gap-6 track-${track}`} style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {showConfetti && renderConfetti()}
      {unlockedBadge && renderBadgeBanner()}
      {levelUpInfo && renderLevelUpOverlay()}
      {streakMilestone && renderStreakMilestone()}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.18); }
          100% { transform: scale(1.05); }
        }
        .shake-element {
          animation: shake 0.3s ease-in-out;
        }
        .hands-svg circle {
          transition: fill 0.3s ease, filter 0.3s ease;
        }
        .finger-pulse {
          animation: finger-glow 1.5s infinite alternate;
        }
        @keyframes finger-glow {
          0% { filter: drop-shadow(0 0 2px rgba(14, 165, 233, 0.4)); }
          100% { filter: drop-shadow(0 0 10px rgba(14, 165, 233, 0.9)); }
        }
        .track-young {
          --lesson-font-size: 1.4rem;
          --hand-guide-opacity: 1;
          --accent-color: #FFB347;
        }
        .track-adult {
          --lesson-font-size: 1.1rem;
          --hand-guide-opacity: 0.7;
          --accent-color: #6C5CE7;
        }
        .track-professional {
          --lesson-font-size: 1rem;
          --hand-guide-opacity: 0;
          --accent-color: #00CEC9;
        }
        .metronome-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-color, var(--accent));
          animation: metronome-pulse var(--metronome-duration) ease-in-out infinite;
        }
        @keyframes metronome-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes badge-unlock-slide {
          0% { transform: translate(-50%, -100%); opacity: 0; }
          10% { transform: translate(-50%, 0); opacity: 1; }
          90% { transform: translate(-50%, 0); opacity: 1; }
          100% { transform: translate(-50%, -100%); opacity: 0; }
        }
      `}</style>

      {/* Page Title with Navigation back button */}
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
        <div className="flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            onClick={onBackToCurriculum}
          >
            &larr; Back to Curriculum
          </button>
          <h2>Academy Stage {activeLesson.id}</h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Phase: {PHASES.find(p => p.code === activeLesson.phase)?.label}
        </span>
      </div>

      {/* Main Grid: Centered tutor card */}
      <div className="flex-col" style={{ width: '100%', maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Left Side: interactive typing screen */}
        <div className="flex-col gap-6" style={{ width: '100%' }}>
          {isCompleted && finalStats ? (
            /* STAGE RESULTS SCORECARD */
            <div 
              className="card flex-col flex-center"
              style={{
                padding: '3rem 2rem',
                border: finalStats.graduated ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                background: finalStats.graduated 
                  ? 'linear-gradient(135deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.04) 100%)' 
                  : 'linear-gradient(135deg, var(--bg-card) 0%, rgba(244, 63, 94, 0.04) 100%)',
                textAlign: 'center',
                gap: '1.5rem',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: finalStats.graduated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                color: finalStats.graduated ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {finalStats.graduated ? <Award size={36} /> : <XCircle size={36} />}
              </div>

              <div className="flex-col gap-1">
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {finalStats.graduated ? "Graduated Stage Successfully!" : "Graduation Stance Failed"}
                </h3>
                <p style={{ color: 'var(--text-dim)', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem' }}>
                  {finalStats.graduated 
                    ? `Sensational! You cleared the touch-typing thresholds for Stage ${activeLesson.id}.`
                    : `You finished typing, but failed to meet gates. Max consecutive errors limit: ${resolvedLesson?.resolvedGate.maxConsecutiveErrors || 'N/A'}.`}
                </p>
                {!finalStats.graduated && failedAttempts >= 2 && isDefaultTarget && (
                  <p style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.5rem' }}>
                    Tip: You can lower your target WPM &amp; accuracy settings in the Profile &gt; Settings panel.
                  </p>
                )}
              </div>

              {/* Score breakdown metrics cards */}
              <div className="flex gap-6" style={{ justifyContent: 'center', width: '100%', margin: '1rem 0' }}>
                <div className="card flex-col flex-center" style={{ padding: '1rem', minWidth: '130px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Speed</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>
                    {finalStats.wpm} <span style={{ fontSize: '0.85rem' }}>WPM</span>
                  </span>
                  {resolvedLesson?.resolvedGate.minWpm !== undefined && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Target: &ge; {resolvedLesson.resolvedGate.minWpm} WPM</span>
                  )}
                </div>
                
                <div className="card flex-col flex-center" style={{ padding: '1rem', minWidth: '130px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Accuracy</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>
                    {finalStats.accuracy}%
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Target: &ge; {Math.round(resolvedLesson ? resolvedLesson.resolvedGate.minAccuracy * 100 : 98)}%</span>
                </div>

                <div className="card flex-col flex-center" style={{ padding: '1rem', minWidth: '130px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consistency</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>
                    {finalStats.consistency}%
                  </span>
                  {resolvedLesson?.resolvedGate.minConsistency !== undefined && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Target: &ge; {resolvedLesson.resolvedGate.minConsistency * 100}%</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="btn btn-secondary" onClick={handleRestart}>
                  <RotateCcw size={16} />
                  Repeat Lesson
                </button>
                
                {finalStats.graduated ? (
                  activeLessonIdx < lessons.length - 1 ? (
                    <button className="btn btn-primary" onClick={handleNextLesson}>
                      Next Lesson
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => onNavigate('test')}>
                      Take A Typing Test
                      <Keyboard size={16} />
                    </button>
                  )
                ) : (
                  <button className="btn btn-primary" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                    Next Lesson (Locked)
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ACTIVE LESSON TYPING SCREEN */
            <div className="flex-col gap-6">
              {/* Dynamic Header based on 12 Lesson Types */}
              <div className="flex-col gap-3" style={{ width: '100%' }}>
                {lessonType === 'key-intro' && (
                  <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent)', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, color: 'var(--accent)' }}>Introducing: {resolvedLesson?.focusKeys.join(', ').toUpperCase()}</h3>
                    {resolvedLesson?.tip && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>{resolvedLesson.tip}</p>}
                  </div>
                )}
                {lessonType === 'pair-drill' && (
                  <div style={{ background: 'rgba(108, 92, 231, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid #6c5ce7', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, color: '#6c5ce7' }}>Bilateral Coordination Drill</h3>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Focus keys: {resolvedLesson?.focusKeys.join(' & ').toUpperCase()}</p>
                  </div>
                )}
                {lessonType === 'adaptive' && (
                  <div style={{ background: 'rgba(255, 179, 71, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid #ffb347', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, color: '#ffb347' }}>Targeted Adaptive Drill</h3>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Generating practice drill targeting your slowest and most error-prone keys.</p>
                  </div>
                )}
                {lessonType === 'cumulative' && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--success)', alignSelf: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>🔄 Cumulative Review</span>
                  </div>
                )}
                {lessonType === 'graduation' && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--danger)', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, color: 'var(--danger)' }}>🎓 Phase Exit Graduation Test</h3>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Clear all gate requirements to unlock the next phase.</p>
                  </div>
                )}
                {lessonType === 'rhythm' && bpm && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                    <div className="metronome-dot" style={{ '--metronome-duration': `${60000 / bpm}ms` } as React.CSSProperties}></div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Match one keystroke to each pulse ({bpm} BPM)</div>
                  </div>
                )}
              </div>

              {/* Active Lesson Prompt & Meters */}
              <div className="card flex-col" style={{ gap: '0.5rem' }}>
                <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {activeLesson.description}
                  </span>
                  <div className="flex gap-4" style={{ alignItems: 'center' }}>
                    {(lessonType === 'speed-run' || lessonType === 'graduation') && startTime && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>Live Speed: {liveWpm} WPM</span>
                    )}
                    {(lessonType === 'accuracy-run' || lessonType === 'graduation') && startTime && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>Live Accuracy: {liveAcc}%</span>
                    )}
                    {hasError && (
                      <span className="flex" style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, alignItems: 'center', gap: '0.25rem' }}>
                        <XCircle size={14} /> Press Backspace to clear error
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Typing viewport */}
                <div 
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    marginTop: '0.5rem',
                    padding: '0.25rem',
                    justifyContent: 'center'
                  }}
                >
                  {(() => {
                    const maxVisible = 10;
                    const half = Math.floor(maxVisible / 2);
                    let start = charPointer - half;
                    if (start < 0) start = 0;
                    let end = start + maxVisible;
                    if (end > targetText.length) {
                      end = targetText.length;
                      start = Math.max(0, end - maxVisible);
                    }

                    return targetText.slice(start, end).split('').map((char, relativeIdx) => {
                      const absoluteIdx = start + relativeIdx;
                      const isCorrect = absoluteIdx < charPointer;
                      const isActive = absoluteIdx === charPointer;
                      const isErrorActive = isActive && hasError;

                      let boxBg = 'var(--bg-card)';
                      let boxBorder = 'var(--border)';
                      let boxColor = 'var(--text-dim)';
                      let boxScale = '1';
                      let animationName = 'none';

                      if (isCorrect) {
                        boxBg = 'rgba(16, 185, 129, 0.15)';
                        boxBorder = 'var(--success)';
                        boxColor = 'var(--success)';
                        boxScale = '1.05';
                        animationName = 'pop 0.2s ease-out';
                      } else if (isErrorActive) {
                        boxBg = 'rgba(244, 63, 94, 0.2)';
                        boxBorder = 'var(--danger)';
                        boxColor = '#ffffff';
                        boxScale = '0.95';
                        animationName = 'shake 0.2s ease-in-out';
                      } else if (isActive) {
                        boxBg = 'rgba(14, 165, 233, 0.1)';
                        boxBorder = 'var(--accent)';
                        boxColor = 'var(--accent)';
                      }

                      return (
                        <div
                          key={absoluteIdx}
                          style={{
                            width: '46px',
                            height: '52px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '0.35rem',
                            border: `1px solid ${boxBorder}`,
                            backgroundColor: boxBg,
                            color: boxColor,
                            fontFamily: lessonType === 'specialist' ? 'Courier New, Courier, monospace' : 'var(--font-mono)',
                            fontSize: trackConfig.fontSize,
                            fontWeight: 700,
                            transform: `scale(${boxScale})`,
                            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            animation: animationName,
                            boxShadow: isActive ? '0 0 10px var(--accent-glow)' : 'none'
                          }}
                        >
                          {char === ' ' ? '\u2423' : char}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Virtual Hands and Keyboard Overlay */}
              <div className="grid grid-cols-12" style={{ gap: '1.5rem' }}>
                
                {/* Keyboard guide column (8 cols) */}
                <div className="card flex-col flex-center col-span-8" style={{ gap: '0.75rem', padding: '1.5rem' }}>
                  <div className="flex-col gap-2" style={{ width: '100%' }}>
                    {keyboardRows.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-1" style={{ justifyContent: 'center' }}>
                        {row.map((char) => {
                          const style = getKeyStyle(char);
                          return (
                            <div
                              key={char}
                              className="kb-key"
                              style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '0.35rem',
                                border: '1px solid',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                transition: 'all 0.15s ease',
                                ...style
                              }}
                            >
                              {char}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    <div className="flex" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
                      <div
                        className="kb-key"
                        style={{
                          width: '240px',
                          height: '38px',
                          borderRadius: '0.35rem',
                          border: '1px solid',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          transition: 'all 0.15s ease',
                          ...getSpacebarStyle()
                        }}
                      >
                        Space
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-3" style={{ marginTop: '1rem', justifyContent: 'center', fontSize: '0.7rem', flexWrap: 'wrap', opacity: 0.85 }}>
                    {[['#fda4af', 'Pinkies'], ['#fed7aa', 'Rings'], ['#fef08a', 'Middles'], ['#a7f3d0', 'L Index'], ['#99f6e4', 'R Index'], ['#bfdbfe', 'R Middle'], ['#e9d5ff', 'R Ring'], ['#fbcfe8', 'R Pinky']].map(([color, label]) => (
                      <span key={label} className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></span> {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hands & guidance column (4 cols) */}
                <div className="card flex-col flex-center col-span-4" style={{ gap: '1rem', padding: '1.5rem', justifyContent: 'space-between', opacity: 'var(--hand-guide-opacity, 1)' }}>
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Finger Guide
                    </span>
                    {activeFinger ? (
                      <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '1.05rem', color: activeFinger.color, textShadow: `0 0 8px ${activeFinger.color}33` }}>
                        {activeFinger.name}
                      </div>
                    ) : (
                      <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                        Strike Key
                      </div>
                    )}
                  </div>

                  {/* Hands SVG */}
                  <svg className="hands-svg" width="180" height="110" viewBox="0 0 180 110" style={{ display: 'block', margin: '0 auto' }}>
                    <path d="M10,85 C10,75 25,65 40,65 C55,65 70,75 70,85" stroke="var(--border)" fill="none" strokeWidth="1.5" />
                    <circle cx="15" cy="45" r="5" 
                      fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'pinky' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'left' && activeFinger?.finger === 'pinky' ? 'finger-pulse' : ''}
                    />
                    <line x1="15" y1="45" x2="20" y2="70" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="30" cy="30" r="5" 
                      fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'ring' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'left' && activeFinger?.finger === 'ring' ? 'finger-pulse' : ''}
                    />
                    <line x1="30" y1="30" x2="32" y2="67" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="48" cy="22" r="5" 
                      fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'middle' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'left' && activeFinger?.finger === 'middle' ? 'finger-pulse' : ''}
                    />
                    <line x1="48" y1="22" x2="46" y2="65" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="65" cy="32" r="5" 
                      fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'index' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'left' && activeFinger?.finger === 'index' ? 'finger-pulse' : ''}
                    />
                    <line x1="65" y1="32" x2="58" y2="67" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="80" cy="55" r="5" 
                      fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'thumb' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'left' && activeFinger?.finger === 'thumb' ? 'finger-pulse' : ''}
                    />
                    <line x1="80" y1="55" x2="68" y2="75" stroke="#475569" strokeWidth="1.5" />

                    <path d="M170,85 C170,75 155,65 140,65 C125,65 110,75 110,85" stroke="var(--border)" fill="none" strokeWidth="1.5" />
                    <circle cx="100" cy="55" r="5" 
                      fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'thumb' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'right' && activeFinger?.finger === 'thumb' ? 'finger-pulse' : ''}
                    />
                    <line x1="100" y1="55" x2="112" y2="75" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="115" cy="32" r="5" 
                      fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'index' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'right' && activeFinger?.finger === 'index' ? 'finger-pulse' : ''}
                    />
                    <line x1="115" y1="32" x2="122" y2="67" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="132" cy="22" r="5" 
                      fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'middle' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'right' && activeFinger?.finger === 'middle' ? 'finger-pulse' : ''}
                    />
                    <line x1="132" y1="22" x2="134" y2="65" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="150" cy="30" r="5" 
                      fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'ring' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'right' && activeFinger?.finger === 'ring' ? 'finger-pulse' : ''}
                    />
                    <line x1="150" y1="30" x2="148" y2="67" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="165" cy="45" r="5" 
                      fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'pinky' ? activeFinger.color : '#475569'} 
                      className={activeFinger?.hand === 'right' && activeFinger?.finger === 'pinky' ? 'finger-pulse' : ''}
                    />
                    <line x1="165" y1="45" x2="160" y2="70" stroke="#475569" strokeWidth="1.5" />
                  </svg>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: '1.2rem' }}>
                    Keep fingers on home row keys.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
