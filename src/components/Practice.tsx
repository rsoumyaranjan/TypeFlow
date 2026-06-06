/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle, Play, Info, ArrowRight, RotateCcw } from 'lucide-react';
import { TypingEngine } from '../utils/typingEngine';

interface PracticeProps {
  onNavigate: (page: 'dashboard' | 'test' | 'results' | 'practice' | 'progress' | 'about') => void;
  practiceWords: string[];
}

const FALLBACK_WORDS = [
  "practice", "makes", "perfect", "accuracy", "over", "speed", 
  "focus", "rhythm", "steady", "fingers", "positioning", "touchtyping"
];

export const Practice: React.FC<PracticeProps> = ({ onNavigate, practiceWords }) => {
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // States to hold replica of engine data for clean React rendering
  const [words, setWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  const engineRef = useRef<TypingEngine | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tabPressedRef = useRef<boolean>(false);

  // Initialize engineRef on mount or if null
  if (engineRef.current === null) {
    const initialWords = practiceWords && practiceWords.length > 0 ? practiceWords : FALLBACK_WORDS;
    engineRef.current = new TypingEngine(initialWords);
    setWords(initialWords);
  }

  const syncEngineState = () => {
    const engine = engineRef.current;
    if (!engine) return;

    setTypedWords([...engine.typedWords]);
    setCurrentWordIndex(engine.currentWordIndex);
    setCurrentCharIndex(engine.currentCharIndex);
    setAccuracy(Math.round(engine.getAccuracy()));
    setTotalKeystrokes(engine.totalKeystrokes);
  };

  // Re-initialize when practice words change
  useEffect(() => {
    setTimeout(() => {
      const listWords = practiceWords && practiceWords.length > 0 ? practiceWords : FALLBACK_WORDS;
      engineRef.current = new TypingEngine(listWords);

      setWords(listWords);
      setTypedWords([]);
      setCurrentWordIndex(0);
      setCurrentCharIndex(0);
      setAccuracy(100);
      setTotalKeystrokes(0);

      setIsCompleted(false);
      setIsFocused(true);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }, 0);
  }, [practiceWords]);

  const handleRestart = () => {
    const listWords = practiceWords && practiceWords.length > 0 ? practiceWords : FALLBACK_WORDS;
    engineRef.current = new TypingEngine(listWords);

    setWords(listWords);
    setTypedWords([]);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setAccuracy(100);
    setTotalKeystrokes(0);

    setIsCompleted(false);
    setIsFocused(true);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Keyboard shortcut listener for global Tab+Enter restart and Esc pause
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        tabPressedRef.current = true;
        return;
      }
      if (e.key === 'Enter' && tabPressedRef.current) {
        e.preventDefault();
        handleRestart();
        tabPressedRef.current = false;
        return;
      }
      tabPressedRef.current = false;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsFocused(false);
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [practiceWords]);

  const checkCompletion = () => {
    const engine = engineRef.current;
    if (!engine) return;

    const isLastWord = engine.currentWordIndex === engine.wordList.length - 1;
    const wordLength = engine.wordList[engine.currentWordIndex]?.length || 0;
    const isWordTyped = engine.currentCharIndex >= wordLength;

    if (engine.currentWordIndex >= engine.wordList.length || (isLastWord && isWordTyped)) {
      setIsCompleted(true);
      if (engine.endTime === null) {
        engine.endTime = Date.now();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const engine = engineRef.current;
    if (!engine || isCompleted) return;

    const key = e.key;

    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (key === 'Tab') return;

    if (key === 'Backspace') {
      e.preventDefault();
      engine.handleBackspace();
      syncEngineState();
      checkCompletion();
    } else if (key === ' ' || key.length === 1) {
      e.preventDefault();
      engine.handleKeyPress(key);
      syncEngineState();
      checkCompletion();
    }
  };

  const handleContainerClick = () => {
    if (isCompleted) return;
    setIsFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Render character visual highlights
  const renderWord = (word: string, wIndex: number) => {
    const typed = typedWords[wIndex] || '';
    const isCurrent = wIndex === currentWordIndex;
    const charSpans = [];

    const maxLen = Math.max(word.length, typed.length);
    for (let cIndex = 0; cIndex < maxLen; cIndex++) {
      const isCaret = isCurrent && cIndex === currentCharIndex;
      const targetChar = word[cIndex];
      const typedChar = typed[cIndex];

      let className = 'untyped';
      const charToRender = targetChar || typedChar;

      if (cIndex < typed.length) {
        if (targetChar && typedChar === targetChar) {
          className = 'correct';
        } else {
          className = 'incorrect';
        }
      }

      charSpans.push(
        <span key={cIndex} className={className} style={{ position: 'relative' }}>
          {isCaret && !isCompleted && <span className="caret-indicator caret-blink" />}
          {charToRender}
        </span>
      );
    }

    const isLastWord = wIndex === words.length - 1;
    const isCaretAtEnd = isCurrent && currentCharIndex >= maxLen;

    return (
      <span key={wIndex} className={`word ${isCurrent ? 'current' : ''}`}>
        {charSpans}
        {!isLastWord && (
          <span 
            className={wIndex < currentWordIndex ? 'correct' : 'untyped'} 
            style={{ position: 'relative' }}
          >
            {isCaretAtEnd && !isCompleted && <span className="caret-indicator caret-blink" />}
            &nbsp;
          </span>
        )}
        {isLastWord && isCaretAtEnd && (
          <span style={{ position: 'relative' }}>
            {isCaretAtEnd && !isCompleted && <span className="caret-indicator caret-blink" />}
            &nbsp;
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="flex-col gap-6">
      {/* Page Title */}
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <Award size={24} style={{ color: 'var(--accent)' }} />
        <h2>Practice Room</h2>
      </div>

      {isCompleted ? (
        /* SUCCESS / COMPLETION CARD */
        <div 
          className="card" 
          style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem', 
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.05) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success)'
          }}>
            <CheckCircle size={40} />
          </div>

          <div className="flex-col gap-2">
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>Drill Completed!</h3>
            <p style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '0 auto' }}>
              Excellent practice. Typing at your own pace allows your muscles to build accurate movement patterns.
            </p>
          </div>

          {/* Drill Performance Summary */}
          <div className="flex gap-6" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</span>
              <h4 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>{accuracy}%</h4>
            </div>
            <div style={{ height: '36px', width: '1px', backgroundColor: 'var(--border)', alignSelf: 'center' }}></div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Words Count</span>
              <h4 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>{words.length}</h4>
            </div>
            <div style={{ height: '36px', width: '1px', backgroundColor: 'var(--border)', alignSelf: 'center' }}></div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Keystrokes</span>
              <h4 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>{totalKeystrokes}</h4>
            </div>
          </div>

          {/* Completion CTAs */}
          <div className="flex gap-4" style={{ marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={handleRestart}>
              <RotateCcw size={16} />
              Repeat Drill
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('progress')}>
              View Progress
            </button>
            <button className="btn btn-primary" onClick={() => onNavigate('test')} style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}>
              Take A Test
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE DRILL UI */
        <>
          {/* Practice Panel Info */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', borderStyle: 'dashed', borderColor: 'var(--border)' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)' }}>
              <Info size={16} style={{ color: 'var(--accent)' }} />
              <span>
                Smart Practice: Drill containing <strong>{words.length} target words</strong>. Focus on clean spelling and high precision.
              </span>
            </p>
          </div>

          {/* Typing Card */}
          <div 
            className="card" 
            style={{ 
              minHeight: '200px', 
              position: 'relative', 
              cursor: 'text',
              border: isFocused ? '1px solid var(--accent)' : '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              boxShadow: isFocused ? '0 0 15px var(--accent-glow)' : 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={handleContainerClick}
          >
            {/* Hidden Input element to handle focus/blur and mobile keyboard */}
            <input
              ref={inputRef}
              type="text"
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-label="Practice typing input"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {/* Unfocused Pause Overlay */}
            {!isFocused && (
              <div className="flex-center flex-col" style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(11, 15, 25, 0.85)',
                backdropFilter: 'blur(3px)',
                zIndex: 10,
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: '0.75rem',
                animation: 'fadeIn 0.2s ease'
              }}
              onClick={handleContainerClick}
              >
                <Play size={32} style={{ color: 'var(--accent)', marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text)' }}>Drill Paused</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click inside this box or press any key to resume</p>
              </div>
            )}

            {/* Typing Console Feed */}
            <div 
              className="word-feed"
              style={{
                filter: isFocused ? 'none' : 'blur(4px)',
                transition: 'filter 0.2s'
              }}
            >
              {words.map((word, idx) => renderWord(word, idx))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="flex gap-4" style={{ alignItems: 'center' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={handleRestart}
              >
                <RotateCcw size={14} />
                Reset Drill
              </button>
              <span>
                Press <span className="shortcut-hint">Tab</span> + <span className="shortcut-hint">Enter</span> to restart instantly
              </span>
              <span>
                Press <span className="shortcut-hint">Esc</span> to pause
              </span>
            </div>

            <div style={{ color: 'var(--text-muted)' }}>
              Accuracy: <strong style={{ color: 'var(--text-dim)' }}>{accuracy}%</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
