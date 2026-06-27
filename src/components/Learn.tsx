import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, RotateCcw, ArrowRight, Keyboard, XCircle, Award } from 'lucide-react';
import { saveLessonAttempt, getLessonHistory } from '../services/db';
import { lessons } from '../utils/lessonsData';

interface LearnProps {
  onNavigate: (page: 'dashboard' | 'test' | 'results' | 'practice' | 'progress' | 'about') => void;
  onStartPractice?: (words: string[]) => void;
}

// Phase details for grouping
const PHASES = [
  { code: 'home-row', label: 'Home Row' },
  { code: 'extensions', label: 'Extensions' },
  { code: 'coordination', label: 'Coordination' },
  { code: 'numbers-symbols', label: 'Numbers & Symbols' },
  { code: 'advanced', label: 'Advanced' }
] as const;

// Color mapping for standard touch-typing fingers
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

const keyboardRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

// Helper to identify finger responsible for character
const getFingerInfo = (char: string | undefined): { hand: 'left' | 'right'; finger: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb'; color: string; name: string } | null => {
  if (!char) return null;
  const c = char.toLowerCase();
  
  if (['q', 'a', 'z', '1', '!'].includes(c)) {
    return { hand: 'left', finger: 'pinky', color: '#fda4af', name: 'Left Pinky' };
  }
  if (['w', 's', 'x', '2', '@'].includes(c)) {
    return { hand: 'left', finger: 'ring', color: '#fed7aa', name: 'Left Ring' };
  }
  if (['e', 'd', 'c', '3', '#'].includes(c)) {
    return { hand: 'left', finger: 'middle', color: '#fef08a', name: 'Left Middle' };
  }
  if (['r', 't', 'f', 'g', 'v', 'b', '4', '5', '$', '%'].includes(c)) {
    return { hand: 'left', finger: 'index', color: '#a7f3d0', name: 'Left Index' };
  }
  if (c === ' ') {
    return { hand: 'right', finger: 'thumb', color: '#cbd5e1', name: 'Right Thumb' };
  }
  if (['y', 'u', 'h', 'j', 'n', 'm', '6', '7', '^', '&'].includes(c)) {
    return { hand: 'right', finger: 'index', color: '#99f6e4', name: 'Right Index' };
  }
  if (['i', 'k', ',', '8', '*', '<'].includes(c)) {
    return { hand: 'right', finger: 'middle', color: '#bfdbfe', name: 'Right Middle' };
  }
  if (['o', 'l', '.', '9', '(', '>'].includes(c)) {
    return { hand: 'right', finger: 'ring', color: '#e9d5ff', name: 'Right Ring' };
  }
  if (['p', ';', '/', '0', ')', '-', '=', '+', '[', ']', '{', '}', '\\', '|', '\'', '"', '?', '_'].includes(c)) {
    return { hand: 'right', finger: 'pinky', color: '#fbcfe8', name: 'Right Pinky' };
  }

  // Shift checks for capitals
  if (char !== ' ' && char === char.toUpperCase() && char.match(/[A-Z]/)) {
    if (['Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', 'N', 'M'].includes(char)) {
      return { hand: 'left', finger: 'pinky', color: '#fda4af', name: 'Left Pinky (holding Shift)' };
    } else {
      return { hand: 'right', finger: 'pinky', color: '#fbcfe8', name: 'Right Pinky (holding Shift)' };
    }
  }

  return { hand: 'right', finger: 'pinky', color: '#fbcfe8', name: 'Right Pinky' };
};

export const Learn: React.FC<LearnProps> = ({ onNavigate }) => {
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [charPointer, setCharPointer] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  
  // Phase Filtering State
  const [activePhase, setActivePhase] = useState<typeof PHASES[number]['code']>('home-row');
  
  // History tracking for checks
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());

  // Graduation results
  const [finalStats, setFinalStats] = useState<{
    wpm: number;
    accuracy: number;
    graduated: boolean;
    duration: number;
  } | null>(null);

  const activeLesson = lessons[activeLessonIdx];
  const targetText = activeLesson.target;
  const currentTargetChar = targetText[charPointer];
  const isCompleted = charPointer >= targetText.length && targetText.length > 0;

  // Load history to show checkboxes
  const loadHistory = async () => {
    try {
      const history = await getLessonHistory();
      const uniqueCompleted = new Set(history.map(attempt => attempt.lessonId));
      setCompletedLessonIds(uniqueCompleted);
    } catch (err) {
      console.error('Failed to load lesson history:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [activeLessonIdx]);

  // Persist lesson attempt upon completion
  useEffect(() => {
    if (isCompleted && startTime && !finalStats) {
      const endTime = Date.now();
      const durationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));
      
      // Calculate Stats
      const finalWpm = Math.round((targetText.length / 5) / (durationSeconds / 60));
      const finalAccuracy = Math.round((targetText.length / (targetText.length + errorsCount)) * 100);
      const isGraduated = finalAccuracy >= 98 && finalWpm >= 25;

      setFinalStats({
        wpm: finalWpm,
        accuracy: finalAccuracy,
        graduated: isGraduated,
        duration: durationSeconds
      });

      const saveAttempt = async () => {
        try {
          await saveLessonAttempt({
            lessonId: activeLesson.id,
            completedAt: new Date(),
            errorsCount,
            durationSeconds
          });
          loadHistory();
        } catch (err) {
          console.error('Failed to save lesson attempt:', err);
        }
      };
      
      saveAttempt();
    }
  }, [isCompleted, startTime, errorsCount, activeLesson.id, finalStats]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Smart Block: Ignore keys if error is present, must press Backspace
      if (hasError) {
        if (e.key === 'Backspace') {
          setHasError(false);
        }
        return;
      }

      const key = e.key.toLowerCase();
      setPressedKey(key === ' ' ? 'space' : key);

      // Start timer on first keystroke of the lesson
      if (startTime === null) {
        setStartTime(Date.now());
      }

      // Process lesson keystroke
      const targetChar = currentTargetChar ? currentTargetChar.toLowerCase() : '';
      const pressed = e.key;

      if (pressed === ' ' && targetChar === ' ') {
        setCharPointer((prev) => prev + 1);
        setHasError(false);
      } else if (pressed.toLowerCase() === targetChar && pressed !== ' ') {
        setCharPointer((prev) => prev + 1);
        setHasError(false);
      } else {
        // Exclude helper/modifier triggers (like Shift, Alt, etc.)
        if (pressed.length === 1 || pressed === ' ') {
          setHasError(true);
          setErrorsCount((prev) => prev + 1);
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
  }, [charPointer, currentTargetChar, isCompleted, startTime, errorsCount, hasError]);

  const handleRestart = () => {
    setCharPointer(0);
    setHasError(false);
    setPressedKey(null);
    setStartTime(null);
    setErrorsCount(0);
    setFinalStats(null);
  };

  const handleNextLesson = () => {
    if (activeLessonIdx < lessons.length - 1) {
      const nextIdx = activeLessonIdx + 1;
      setActiveLessonIdx(nextIdx);
      setActivePhase(lessons[nextIdx].phase);
      setCharPointer(0);
      setHasError(false);
      setPressedKey(null);
      setStartTime(null);
      setErrorsCount(0);
      setFinalStats(null);
    }
  };

  const handleSelectLesson = (idx: number) => {
    setActiveLessonIdx(idx);
    setCharPointer(0);
    setHasError(false);
    setPressedKey(null);
    setStartTime(null);
    setErrorsCount(0);
    setFinalStats(null);
  };

  // Resolve custom keyboard styles based on finger map and interaction states
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
        boxShadow: `0 0 12px rgba(14, 165, 233, 0.4)`
      };
    }

    return {
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border)',
      color: 'var(--text-muted)'
    };
  };

  const activeFinger = getFingerInfo(currentTargetChar);
  const filteredLessons = lessons.map((l, i) => ({ ...l, index: i })).filter(l => l.phase === activePhase);

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '950px', margin: '0 auto' }}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .shake-element {
          animation: shake 0.3s ease-in-out;
        }
        .phase-tab {
          padding: 0.65rem 1.25rem;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 0.375rem;
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .phase-tab.active {
          background-color: var(--accent);
          color: #0b0f19;
          border-color: var(--accent);
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
      `}</style>

      {/* Page Title */}
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
        <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={24} style={{ color: 'var(--accent)' }} />
          <h2>Touch-Typing Academy ({activeLessonIdx + 1}/35)</h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Phase: {PHASES.find(p => p.code === activeLesson.phase)?.label}
        </span>
      </div>

      {/* Phase Selectors */}
      <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {PHASES.map((phase) => (
          <button
            key={phase.code}
            className={`phase-tab ${activePhase === phase.code ? 'active' : ''}`}
            onClick={() => setActivePhase(phase.code)}
          >
            {phase.label}
          </button>
        ))}
      </div>

      {/* Lesson Navigation Selector Cards */}
      <div className="grid grid-cols-3" style={{ gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', padding: '0.25rem', border: '1px solid var(--border)', borderRadius: '0.5rem', backgroundColor: 'rgba(9, 13, 22, 0.2)' }}>
        {filteredLessons.map((lesson) => {
          const isSelected = activeLessonIdx === lesson.index;
          const isCompletedPast = completedLessonIds.has(lesson.id);
          return (
            <button
              key={lesson.id}
              className="card"
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.05)' : 'var(--bg-card)',
                textAlign: 'left',
                outline: 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
              onClick={() => handleSelectLesson(lesson.index)}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: isSelected ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600 }}>
                  Stage {lesson.id}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                  {lesson.title.replace(/Stage \d+:\s*/, '')}
                </span>
              </div>
              {isCompletedPast && (
                <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {isCompleted && finalStats ? (
        /* SUCCESS COMPLETION PANEL */
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
                ? `Sensational! You cleared the QWERTY thresholds for Stage ${activeLesson.id}. You can now unlock the next stage.`
                : `You finished the typing buffer, but failed to meet graduation thresholds. You must achieve at least 25 WPM and 98% Accuracy.`}
            </p>
          </div>

          {/* Metrics Displays */}
          <div className="flex gap-6" style={{ justifyContent: 'center', width: '100%', margin: '1rem 0' }}>
            <div className="card flex-col flex-center" style={{ padding: '1rem', minWidth: '130px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Speed</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: finalStats.wpm >= 25 ? 'var(--success)' : 'var(--danger)' }}>
                {finalStats.wpm} <span style={{ fontSize: '0.85rem' }}>WPM</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Target: &ge; 25 WPM</span>
            </div>
            
            <div className="card flex-col flex-center" style={{ padding: '1rem', minWidth: '130px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Accuracy</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: finalStats.accuracy >= 98 ? 'var(--success)' : 'var(--danger)' }}>
                {finalStats.accuracy}%
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Target: &ge; 98%</span>
            </div>

            <div className="card flex-col flex-center" style={{ padding: '1rem', minWidth: '130px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Taken</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>
                {finalStats.duration}s
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Errors: {errorsCount}</span>
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
        /* INTERACTIVE TUTOR SHELL */
        <>
          {/* Active Lesson Prompt */}
          <div className="card flex-col" style={{ gap: '0.5rem' }}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {activeLesson.description}
              </span>
              {hasError && (
                <span className="flex" style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, alignItems: 'center', gap: '0.25rem' }}>
                  <XCircle size={14} /> Please press Backspace to clear error
                </span>
              )}
            </div>
            
            {/* Typing buffer screen */}
            <div 
              className={`shake-container ${hasError ? 'shake-element' : ''}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.55rem',
                lineHeight: '2.5rem',
                letterSpacing: '0.05em',
                padding: '1.25rem',
                backgroundColor: 'rgba(9, 13, 22, 0.4)',
                border: hasError ? '1px solid var(--danger)' : '1px solid var(--border)',
                borderRadius: '0.5rem',
                marginTop: '0.5rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                transition: 'border 0.2s ease'
              }}
            >
              {/* Correctly typed */}
              <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                {targetText.slice(0, charPointer)}
              </span>

              {/* Active character character */}
              <span 
                style={{ 
                  color: hasError ? '#ffffff' : 'var(--bg)', 
                  backgroundColor: hasError ? 'var(--danger)' : 'var(--accent)',
                  borderRadius: '2px',
                  padding: '0 2.5px',
                  boxShadow: hasError ? '0 0 10px var(--danger)' : '0 0 8px var(--accent)',
                  position: 'relative'
                }}
              >
                {currentTargetChar === ' ' ? '\u2423' : currentTargetChar}
              </span>

              {/* Untyped characters */}
              <span style={{ color: 'var(--text-dim)' }}>
                {targetText.slice(charPointer + 1)}
              </span>
            </div>
          </div>

          {/* Virtual Hands and Keyboard Overlay */}
          <div className="grid grid-cols-12" style={{ gap: '1.5rem' }}>
            
            {/* Keyboard guide column (7 cols) */}
            <div className="card flex-col flex-center col-span-8" style={{ gap: '0.75rem', padding: '1.5rem' }}>
              <div className="flex-col gap-2" style={{ width: '100%' }}>
                
                {/* Keyboard rows */}
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

                {/* Spacebar row */}
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

              {/* Color Legend Finger Markers */}
              <div className="flex gap-3" style={{ marginTop: '1rem', justifyContent: 'center', fontSize: '0.7rem', flexWrap: 'wrap', opacity: 0.85 }}>
                <span className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fda4af' }}></span> Pinkies
                </span>
                <span className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fed7aa' }}></span> Rings
                </span>
                <span className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fef08a' }}></span> Middles
                </span>
                <span className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a7f3d0' }}></span> L Index
                </span>
                <span className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#99f6e4' }}></span> R Index
                </span>
                <span className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#bfdbfe' }}></span> R Middle
                </span>
                <span className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e9d5ff' }}></span> R Ring
                </span>
                <span className="flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbcfe8' }}></span> R Pinky
                </span>
              </div>
            </div>

            {/* Hands & guidance column (4 cols) */}
            <div className="card flex-col flex-center col-span-4" style={{ gap: '1rem', padding: '1.5rem', justifyContent: 'space-between' }}>
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

              {/* Hands SVG representation */}
              <svg className="hands-svg" width="180" height="110" viewBox="0 0 180 110" style={{ display: 'block', margin: '0 auto' }}>
                {/* Left hand boundary */}
                <path d="M10,85 C10,75 25,65 40,65 C55,65 70,75 70,85" stroke="var(--border)" fill="none" strokeWidth="1.5" />
                {/* Left Fingers */}
                {/* Pinky */}
                <circle cx="15" cy="45" r="5" 
                  fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'pinky' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'left' && activeFinger?.finger === 'pinky' ? 'finger-pulse' : ''}
                />
                <line x1="15" y1="45" x2="20" y2="70" stroke="#475569" strokeWidth="1.5" />
                {/* Ring */}
                <circle cx="30" cy="30" r="5" 
                  fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'ring' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'left' && activeFinger?.finger === 'ring' ? 'finger-pulse' : ''}
                />
                <line x1="30" y1="30" x2="32" y2="67" stroke="#475569" strokeWidth="1.5" />
                {/* Middle */}
                <circle cx="48" cy="22" r="5" 
                  fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'middle' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'left' && activeFinger?.finger === 'middle' ? 'finger-pulse' : ''}
                />
                <line x1="48" y1="22" x2="46" y2="65" stroke="#475569" strokeWidth="1.5" />
                {/* Index */}
                <circle cx="65" cy="32" r="5" 
                  fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'index' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'left' && activeFinger?.finger === 'index' ? 'finger-pulse' : ''}
                />
                <line x1="65" y1="32" x2="58" y2="67" stroke="#475569" strokeWidth="1.5" />
                {/* Thumb */}
                <circle cx="80" cy="55" r="5" 
                  fill={activeFinger?.hand === 'left' && activeFinger?.finger === 'thumb' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'left' && activeFinger?.finger === 'thumb' ? 'finger-pulse' : ''}
                />
                <line x1="80" y1="55" x2="68" y2="75" stroke="#475569" strokeWidth="1.5" />

                {/* Right hand boundary */}
                <path d="M170,85 C170,75 155,65 140,65 C125,65 110,75 110,85" stroke="var(--border)" fill="none" strokeWidth="1.5" />
                {/* Right Fingers */}
                {/* Thumb */}
                <circle cx="100" cy="55" r="5" 
                  fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'thumb' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'right' && activeFinger?.finger === 'thumb' ? 'finger-pulse' : ''}
                />
                <line x1="100" y1="55" x2="112" y2="75" stroke="#475569" strokeWidth="1.5" />
                {/* Index */}
                <circle cx="115" cy="32" r="5" 
                  fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'index' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'right' && activeFinger?.finger === 'index' ? 'finger-pulse' : ''}
                />
                <line x1="115" y1="32" x2="122" y2="67" stroke="#475569" strokeWidth="1.5" />
                {/* Middle */}
                <circle cx="132" cy="22" r="5" 
                  fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'middle' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'right' && activeFinger?.finger === 'middle' ? 'finger-pulse' : ''}
                />
                <line x1="132" y1="22" x2="134" y2="65" stroke="#475569" strokeWidth="1.5" />
                {/* Ring */}
                <circle cx="150" cy="30" r="5" 
                  fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'ring' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'right' && activeFinger?.finger === 'ring' ? 'finger-pulse' : ''}
                />
                <line x1="150" y1="30" x2="148" y2="67" stroke="#475569" strokeWidth="1.5" />
                {/* Pinky */}
                <circle cx="165" cy="45" r="5" 
                  fill={activeFinger?.hand === 'right' && activeFinger?.finger === 'pinky' ? activeFinger.color : '#475569'} 
                  className={activeFinger?.hand === 'right' && activeFinger?.finger === 'pinky' ? 'finger-pulse' : ''}
                />
                <line x1="165" y1="45" x2="160" y2="70" stroke="#475569" strokeWidth="1.5" />
              </svg>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: '1.2rem' }}>
                Keep your fingers on <span style={{ color: 'var(--accent)', fontWeight: 600 }}>ASDF</span> and <span style={{ color: 'var(--accent)', fontWeight: 600 }}>JKL;</span> home rows.
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
