import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, RotateCcw, ArrowRight, Keyboard } from 'lucide-react';
import { saveLessonAttempt } from '../services/db';

interface LearnProps {
  onNavigate: (page: 'dashboard' | 'test' | 'results' | 'practice' | 'progress' | 'about') => void;
  onStartPractice?: (words: string[]) => void;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  target: string;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Lesson 1: Home Row Basics",
    description: "Master the resting home position: A S D F for the left hand and J K L ; for the right hand.",
    target: "aaa sss ddd fff jjj kkk lll ;;; asdf jkl; asdf jkl; a s d f j k l ;"
  },
  {
    id: 2,
    title: "Lesson 2: Index Finger Extensions",
    description: "Reinforce index finger extensions to hit G, H, R, U, T, Y, V, B, N, and M.",
    target: "fg hj ru ty vb nm rrr uuu ggg hhh vv bb nn mm ruth ruby hunt turn"
  },
  {
    id: 3,
    title: "Lesson 3: Ring & Pinky Reinforcements",
    description: "Stretch your outer fingers to control Q, W, O, P, Z, X, C, comma, and period.",
    target: "ws ol qa p; ed ik zx c. qqq www ooo ppp zzz xxx ccc quick zone power"
  }
];

// Color mapping for standard touch-typing fingers
const fingerColors: Record<string, string> = {
  // Left Pinky (Rose)
  'q': '#fda4af', 'a': '#fda4af', 'z': '#fda4af',
  // Left Ring (Orange)
  'w': '#fed7aa', 's': '#fed7aa', 'x': '#fed7aa',
  // Left Middle (Yellow)
  'e': '#fef08a', 'd': '#fef08a', 'c': '#fef08a',
  // Left Index (Green)
  'r': '#a7f3d0', 't': '#a7f3d0', 'f': '#a7f3d0', 'g': '#a7f3d0', 'v': '#a7f3d0', 'b': '#a7f3d0',
  // Right Index (Teal)
  'y': '#99f6e4', 'u': '#99f6e4', 'h': '#99f6e4', 'j': '#99f6e4', 'n': '#99f6e4', 'm': '#99f6e4',
  // Right Middle (Blue)
  'i': '#bfdbfe', 'k': '#bfdbfe', ',': '#bfdbfe',
  // Right Ring (Purple)
  'o': '#e9d5ff', 'l': '#e9d5ff', '.': '#e9d5ff',
  // Right Pinky (Pink)
  'p': '#fbcfe8', ';': '#fbcfe8', '/': '#fbcfe8'
};

const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

export const Learn: React.FC<LearnProps> = ({ onNavigate }) => {
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [charPointer, setCharPointer] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorsCount, setErrorsCount] = useState<number>(0);

  const activeLesson = lessons[activeLessonIdx];
  const targetText = activeLesson.target;
  const currentTargetChar = targetText[charPointer];
  const isCompleted = charPointer >= targetText.length && targetText.length > 0;

  // Persist lesson attempt upon completion
  useEffect(() => {
    if (isCompleted && startTime) {
      const endTime = Date.now();
      const durationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));
      
      const saveAttempt = async () => {
        try {
          await saveLessonAttempt({
            lessonId: activeLesson.id,
            completedAt: new Date(),
            errorsCount,
            durationSeconds
          });
        } catch (err) {
          console.error('Failed to save lesson attempt:', err);
        }
      };
      
      saveAttempt();
    }
  }, [isCompleted, startTime, errorsCount, activeLesson.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

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
  }, [charPointer, currentTargetChar, isCompleted, startTime, errorsCount]);

  const handleRestart = () => {
    setCharPointer(0);
    setHasError(false);
    setPressedKey(null);
    setStartTime(null);
    setErrorsCount(0);
  };

  const handleNextLesson = () => {
    if (activeLessonIdx < lessons.length - 1) {
      setActiveLessonIdx((prev) => prev + 1);
      setCharPointer(0);
      setHasError(false);
      setPressedKey(null);
      setStartTime(null);
      setErrorsCount(0);
    }
  };

  const handleSelectLesson = (idx: number) => {
    setActiveLessonIdx(idx);
    setCharPointer(0);
    setHasError(false);
    setPressedKey(null);
    setStartTime(null);
    setErrorsCount(0);
  };

  // Resolve custom keyboard styles based on finger map and interaction states
  const getKeyStyle = (char: string) => {
    const key = char.toLowerCase();
    const color = fingerColors[key] || '#cbd5e1'; // Fallback to slate-200 equivalent
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
        boxShadow: `0 0 12px rgba(14, 165, 233, 0.4)`
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
    const color = '#64748b'; // thumbs color

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

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Title */}
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen size={24} style={{ color: 'var(--accent)' }} />
        <h2>Touch-Typing Guide</h2>
      </div>

      {/* Lesson Navigation Selector Cards */}
      <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
        {lessons.map((lesson, idx) => (
          <button
            key={lesson.id}
            className="card"
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              border: activeLessonIdx === idx ? '1px solid var(--accent)' : '1px solid var(--border)',
              backgroundColor: activeLessonIdx === idx ? 'rgba(14, 165, 233, 0.05)' : 'var(--bg-card)',
              textAlign: 'left',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleSelectLesson(idx)}
          >
            <span style={{ fontSize: '0.8rem', color: activeLessonIdx === idx ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Lesson {idx + 1}
            </span>
            <h4 style={{ fontSize: '1.05rem', margin: '0.25rem 0', color: 'var(--text)' }}>
              {lesson.title.split(': ')[1]}
            </h4>
          </button>
        ))}
      </div>

      {isCompleted ? (
        /* SUCCESS COMPLETION PANEL */
        <div 
          className="card flex-col flex-center"
          style={{
            padding: '3rem 2rem',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.04) 100%)',
            textAlign: 'center',
            gap: '1.5rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={36} />
          </div>

          <div className="flex-col gap-1">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Lesson Completed Successfully!</h3>
            <p style={{ color: 'var(--text-dim)', maxWidth: '480px', margin: '0 auto', fontSize: '0.95rem' }}>
              You've completed the spelling targets for this lesson. Repeat the drill to build muscle fluid memory or advance to the next set.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="btn btn-secondary" onClick={handleRestart}>
              <RotateCcw size={16} />
              Repeat Lesson
            </button>
            {activeLessonIdx < lessons.length - 1 ? (
              <button className="btn btn-primary" onClick={handleNextLesson}>
                Next Lesson
                <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => onNavigate('test')}>
                Take A Typing Test
                <Keyboard size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* INTERACTIVE TUTOR SHELL */
        <>
          {/* Active Lesson Prompt */}
          <div className="card flex-col" style={{ gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeLesson.description}</span>
            
            {/* Typing buffer screen */}
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.55rem',
                lineHeight: '2.5rem',
                letterSpacing: '0.05em',
                padding: '1rem',
                backgroundColor: 'rgba(9, 13, 22, 0.4)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                marginTop: '0.5rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}
            >
              {/* Correctly typed */}
              <span style={{ color: 'var(--text-muted)' }}>
                {targetText.slice(0, charPointer)}
              </span>

              {/* Active character character */}
              <span 
                style={{ 
                  color: hasError ? 'var(--danger)' : 'var(--bg)', 
                  backgroundColor: hasError ? 'rgba(244, 63, 94, 0.2)' : 'var(--accent)',
                  borderRadius: '2px',
                  padding: '0 2px',
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

          {/* Interactive virtual keyboard guide */}
          <div className="card flex-col flex-center" style={{ gap: '0.5rem', padding: '2rem 1.5rem' }}>
            <div className="flex-col gap-2" style={{ width: '100%', maxWidth: '650px' }}>
              
              {/* Keyboard rows */}
              {keyboardRows.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-2" style={{ justifyContent: 'center' }}>
                  {row.map((char) => {
                    const style = getKeyStyle(char);
                    return (
                      <div
                        key={char}
                        className="kb-key"
                        style={{
                          width: '42px',
                          height: '42px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '0.35rem',
                          border: '1px solid',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
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
                    height: '40px',
                    borderRadius: '0.35rem',
                    border: '1px solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    ...getSpacebarStyle()
                  }}
                >
                  Space
                </div>
              </div>
            </div>

            {/* Color Legend Finger Markers */}
            <div className="flex gap-4" style={{ marginTop: '1.75rem', justifyContent: 'center', fontSize: '0.75rem', flexWrap: 'wrap' }}>
              <span className="flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fda4af' }}></span> Pinkies
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fed7aa' }}></span> Rings
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fef08a' }}></span> Middles
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a7f3d0' }}></span> L Index
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#99f6e4' }}></span> R Index
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#bfdbfe' }}></span> R Middle
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e9d5ff' }}></span> R Ring
              </span>
              <span className="flex" style={{ alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fbcfe8' }}></span> R Pinky
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
