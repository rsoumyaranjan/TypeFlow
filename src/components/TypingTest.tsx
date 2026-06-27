/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, AlertTriangle, Timer, Info } from 'lucide-react';
import { TypingEngine } from '../utils/typingEngine';
import { saveTestSession, type TypingTestSession } from '../services/db';

interface TypingTestProps {
  onNavigate: (page: 'dashboard' | 'test' | 'results' | 'practice' | 'progress' | 'about') => void;
  onTestComplete: (session: Omit<TypingTestSession, 'id'>) => void;
}

const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", 
  "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", 
  "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", 
  "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", 
  "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "are", "was", "were", "had", "been", "has", 
  "more", "write", "go", "see", "number", "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", 
  "oil", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part", "over", "new", "sound", "take", 
  "only", "little", "work", "know", "place", "years", "live", "me", "back", "give", "most", "very", "after", "thing", "our", "just", 
  "name", "good", "sentence", "man", "think", "say", "great", "where", "help", "through", "much", "before", "line", "right", "too", 
  "mean", "old", "any", "same", "tell", "boy", "follow", "came", "want", "show", "also", "around", "form", "three", "small", "end", 
  "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow"
];

function getRandomWords(count: number = 150): string[] {
  const shuffled = [...COMMON_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const TypingTest: React.FC<TypingTestProps> = ({ onTestComplete }) => {
  const [duration, setDuration] = useState<15 | 30 | 60>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // States to hold replica of engine data for clean React rendering
  const [words, setWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAcc, setLiveAcc] = useState(100);

  const engineRef = useRef<TypingEngine | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tabPressedRef = useRef<boolean>(false);

  // Initialize engineRef on mount
  if (engineRef.current === null) {
    const initialWords = getRandomWords(150);
    engineRef.current = new TypingEngine(initialWords);
    // Initialize states to match
    setWords(initialWords);
  }

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const syncEngineState = () => {
    const engine = engineRef.current;
    if (!engine) return;

    setTypedWords([...engine.typedWords]);
    setCurrentWordIndex(engine.currentWordIndex);
    setCurrentCharIndex(engine.currentCharIndex);
    setLiveAcc(Math.round(engine.getAccuracy()));

    const elapsed = duration - timeLeft;
    setLiveWpm(elapsed > 0 ? Math.round(engine.getNetWPM(elapsed)) : 0);
  };

  const handleRestart = (newDuration: number = duration) => {
    const newWords = getRandomWords(150);
    engineRef.current = new TypingEngine(newWords);

    setWords(newWords);
    setTypedWords([]);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setLiveWpm(0);
    setLiveAcc(100);

    setTimeLeft(newDuration);
    setTimerStarted(false);
    setIsFocused(true);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Re-run handleRestart when duration is changed
  useEffect(() => {
    setTimeout(() => {
      handleRestart(duration);
    }, 0);
  }, [duration]);

  const finishTest = async () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (engine.endTime === null) {
      engine.endTime = Date.now();
    }

    const sessionData: Omit<TypingTestSession, 'id'> = {
      timestamp: Date.now(),
      duration: duration,
      wpm: Math.round(engine.getNetWPM(duration) * 100) / 100,
      rawWpm: Math.round(engine.getRawWPM(duration) * 100) / 100,
      accuracy: Math.round(engine.getAccuracy() * 100) / 100,
      errorsCount: engine.getErrorsCount(),
      wordsCount: engine.currentWordIndex + 1,
      keystrokeLog: engine.keystrokeLog,
      missedWords: engine.getMissedWords(),
    };

    try {
      await saveTestSession(sessionData);
    } catch (err) {
      console.error('Failed to save session:', err);
    }

    onTestComplete(sessionData);
  };

  // Handle countdown interval
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (timerStarted && isFocused && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          const nextTime = prev - 1;
          if (nextTime <= 0) {
            if (intervalId) clearInterval(intervalId);
            finishTest();
            return 0;
          }
          // Update WPM calculation dynamically per clock tick
          const engine = engineRef.current;
          if (engine) {
            const elapsed = duration - nextTime;
            setLiveWpm(elapsed > 0 ? Math.round(engine.getNetWPM(elapsed)) : 0);
          }
          return nextTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerStarted, isFocused, timeLeft, duration]);

  // Global restart shortcuts and focus handling
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
  }, [duration]);

  // Capture input keydown handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const engine = engineRef.current;
    if (!engine || timeLeft <= 0) return;

    const key = e.key;

    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (key === 'Tab') return;

    if (key === 'Backspace') {
      e.preventDefault();
      engine.handleBackspace();
      if (!timerStarted && engine.startTime !== null) {
        setTimerStarted(true);
      }
      syncEngineState();
    } else if (key === ' ' || key.length === 1) {
      e.preventDefault();
      engine.handleKeyPress(key);
      if (!timerStarted && engine.startTime !== null) {
        setTimerStarted(true);
      }
      syncEngineState();
    }
  };

  const handleContainerClick = () => {
    setIsFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Render text helper
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
          {isCaret && <span className="caret-indicator caret-blink" />}
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
            {isCaretAtEnd && <span className="caret-indicator caret-blink" />}
            &nbsp;
          </span>
        )}
        {isLastWord && isCaretAtEnd && (
          <span style={{ position: 'relative' }}>
            <span className="caret-indicator caret-blink" />
            &nbsp;
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="flex-col gap-6">
      {/* Mobile Warning Alert */}
      {isMobile && (
        <div 
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--warning)',
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--warning)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.9rem' }}>
            Physical keyboard recommended. Click the container below to focus and show the virtual keyboard.
          </span>
        </div>
      )}

      {/* Control & Live Metrics Area */}
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Preset Selector */}
        <div className="flex gap-2" style={{ backgroundColor: 'var(--bg-card)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
          {([15, 30, 60] as const).map((time) => (
            <button
              key={time}
              className={`nav-tab ${duration === time ? 'active' : ''}`}
              style={{ borderRadius: '0.25rem', padding: '0.35rem 1rem' }}
              onClick={() => {
                setDuration(time);
                handleRestart(time);
              }}
              disabled={timerStarted}
              title={timerStarted ? "Cannot change time during a test" : `Set duration to ${time}s`}
            >
              {time}s
            </button>
          ))}
        </div>

        {/* Live Metrics Header */}
        <div className="flex gap-6" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Timer size={18} />
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{timeLeft}s</span>
          </div>
          <div>
            wpm: <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{liveWpm}</span>
          </div>
          <div>
            acc: <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{liveAcc}%</span>
          </div>
        </div>
      </div>

      {/* Typing Container */}
      <div 
        className="card" 
        style={{ 
          minHeight: '220px', 
          position: 'relative', 
          cursor: 'text',
          border: isFocused ? '1px solid var(--accent)' : '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          transition: 'all 0.2s ease',
          boxShadow: isFocused ? '0 0 20px var(--accent-glow)' : 'none'
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
          aria-label="Typing test input"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {/* Unfocused Blur Overlay */}
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
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text)' }}>Test Paused</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click inside this box or press any key to resume</p>
          </div>
        )}

        {/* Word Feed */}
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

      {/* Action Controls & Instructions */}
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="flex gap-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={() => handleRestart(duration)}
            title="Restart typing test"
          >
            <RotateCcw size={14} />
            Restart Test
          </button>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span className="shortcut-hint">Tab</span> + <span className="shortcut-hint">Enter</span> to restart instantly
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span className="shortcut-hint">Esc</span> to pause
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <Info size={14} />
          <span>Timer starts on the first valid keypress.</span>
        </div>
      </div>
    </div>
  );
};
