import React from 'react';
import { ArrowRight, RotateCcw, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import type { TypingTestSession } from '../services/db';
import type { KeystrokeEvent } from '../utils/typingEngine';

interface ResultsProps {
  onNavigate: (page: 'dashboard' | 'test' | 'results' | 'practice' | 'progress' | 'about') => void;
  lastSessionData: Omit<TypingTestSession, 'id'> | null;
  onStartPractice: (words: string[]) => void;
}

// Fallback home row words
const HOME_ROW_WORDS = [
  "all", "ask", "fall", "sad", "lad", "lass", "fad", "salad", 
  "as", "add", "ala", "flas", "alf", "fads", "lads", "sash"
];

interface WordSpeedInfo {
  word: string;
  totalDuration: number;
}

export const Results: React.FC<ResultsProps> = ({ onNavigate, lastSessionData, onStartPractice }) => {
  
  // Reconstruct slow words from keystroke logs
  const getSlowWords = (log: KeystrokeEvent[]): string[] => {
    if (!log || log.length === 0) return [];
    
    // Group keystroke events by wordIndex
    const wordGroups: { [key: number]: KeystrokeEvent[] } = {};
    log.forEach((evt) => {
      if (wordGroups[evt.wordIndex] === undefined) {
        wordGroups[evt.wordIndex] = [];
      }
      wordGroups[evt.wordIndex].push(evt);
    });

    const wordInfos: WordSpeedInfo[] = [];
    Object.keys(wordGroups).forEach((idxStr) => {
      const idx = Number(idxStr);
      const evts = wordGroups[idx];
      // Sort by charIndex to ensure proper order
      evts.sort((a, b) => a.charIndex - b.charIndex);
      
      const wordText = evts.map((e) => e.target).join('');
      const totalDuration = evts.reduce((sum, e) => sum + e.deltaMs, 0);

      // Only count valid non-empty words
      if (wordText.trim().length > 0) {
        wordInfos.push({ word: wordText, totalDuration });
      }
    });

    // Sort by duration descending (slowest words first)
    wordInfos.sort((a, b) => b.totalDuration - a.totalDuration);
    
    // Return top 5 slowest words
    return wordInfos.slice(0, 5).map((wi) => wi.word);
  };

  // Generate dynamic analysis text
  const generateAnalysis = (data: Omit<TypingTestSession, 'id'>) => {
    const { wpm, accuracy, keystrokeLog } = data;
    
    let speedText: string;
    if (wpm < 30) {
      speedText = "You are currently building familiarity with key layouts. Consistent touch typing will quickly accelerate your speed.";
    } else if (wpm < 60) {
      speedText = "You type at a standard everyday speed. Developing a steady typing rhythm will help you break past 60 WPM.";
    } else {
      speedText = "Superb typing speed! Your finger cadence is quick and highly fluent.";
    }

    let accuracyText: string;
    if (accuracy >= 95) {
      accuracyText = " Your accuracy is exceptional, which is the perfect foundation for high-speed typing.";
    } else if (accuracy >= 85) {
      accuracyText = " Your accuracy is decent, but focusing on pressing keys precisely will boost both accuracy and flow.";
    } else {
      accuracyText = " Your accuracy fell below 85%. We highly recommend slowing down slightly to prevent cementing incorrect muscle memory.";
    }

    // Key errors analysis
    const errorMap: { [key: string]: number } = {};
    keystrokeLog.forEach((evt) => {
      if (evt.status === 'incorrect' && evt.target && evt.target.length === 1) {
        const char = evt.target.toLowerCase();
        errorMap[char] = (errorMap[char] || 0) + 1;
      }
    });

    const sortedErrors = Object.entries(errorMap).sort((a, b) => b[1] - a[1]);
    let keysText = "";
    if (sortedErrors.length > 0) {
      const topKeys = sortedErrors.slice(0, 3).map(([key]) => `'${key}'`).join(', ');
      keysText = ` You encountered the most difficulty with the keys: ${topKeys}.`;
    }

    return `${speedText}${accuracyText}${keysText}`;
  };

  // 1. Determine which case we are in for recommendations
  let recommendationWords: string[] = HOME_ROW_WORDS;
  let recommendationTitle = "Home Row Finger Placement Drill";
  let recommendationDesc = "Take a typing test to get personalized recommendations, or practice standard home-row finger placements right now.";
  let recommendationCTA = "Practice Home Row Keys";

  if (lastSessionData) {
    if (lastSessionData.missedWords && lastSessionData.missedWords.length > 0) {
      recommendationWords = lastSessionData.missedWords;
      recommendationTitle = "Practice Missed Words";
      recommendationDesc = `We've generated a custom spelling reinforcement drill targeting the ${lastSessionData.missedWords.length} words you misspelled during the test.`;
      recommendationCTA = `Practice Missed Words (${lastSessionData.missedWords.length})`;
    } else {
      const slowWords = getSlowWords(lastSessionData.keystrokeLog);
      if (slowWords.length > 0) {
        recommendationWords = slowWords;
        recommendationTitle = "Practice Slow Words";
        recommendationDesc = "Outstanding 100% accuracy run! We've analyzed your keystroke timings and compiled a drill with the words where your latency peaked.";
        recommendationCTA = "Practice Slow Words";
      }
    }
  }

  const handleCTAClick = () => {
    onStartPractice(recommendationWords);
  };

  // Formatted stats for displays
  const wpm = lastSessionData ? Math.round(lastSessionData.wpm) : 0;
  const accuracy = lastSessionData ? Math.round(lastSessionData.accuracy) : 100;
  const rawWpm = lastSessionData ? Math.round(lastSessionData.rawWpm) : 0;
  const errors = lastSessionData ? lastSessionData.errorsCount : 0;

  return (
    <div className="flex-col gap-6">
      {/* Page Title */}
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={24} style={{ color: 'var(--accent)' }} />
        <h2>Test Results</h2>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg-grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Net WPM</span>
          <h3 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>{wpm}</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Accuracy</span>
          <h3 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>{accuracy}%</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Raw WPM</span>
          <h3 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-dim)', marginTop: '0.25rem' }}>{rawWpm}</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Errors</span>
          <h3 style={{ fontSize: '3rem', fontWeight: 800, color: errors > 0 ? 'var(--danger)' : 'var(--text-muted)', marginTop: '0.25rem' }}>{errors}</h3>
        </div>
      </div>

      {/* Analysis and CTA Container */}
      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Dynamic Plain Language Analysis */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 className="card-title" style={{ color: 'var(--text)' }}>
            <AlertCircle size={20} style={{ color: 'var(--accent)' }} />
            Performance Analysis
          </h3>
          <p className="card-desc" style={{ fontSize: '1rem', lineHeight: '1.6', marginTop: '0.5rem', marginBottom: 0 }}>
            {lastSessionData ? (
              generateAnalysis(lastSessionData)
            ) : (
              "No recent typing test found. Take a full 15, 30, or 60-second typing test to analyze your keyboard speed and precision keys."
            )}
          </p>
        </div>

        {/* Smart Recommendation Card */}
        <div 
          className="card" 
          style={{ 
            border: '1px solid rgba(16, 185, 129, 0.3)', 
            background: 'linear-gradient(135deg, rgba(21, 27, 45, 0.8) 0%, rgba(16, 185, 129, 0.08) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 className="card-title" style={{ color: 'var(--success)' }}>
              <Sparkles size={20} style={{ color: 'var(--success)' }} />
              {recommendationTitle}
            </h3>
            <p className="card-desc" style={{ color: 'var(--text-dim)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              {recommendationDesc}
            </p>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: 'var(--success)', color: '#0b0f19', width: 'fit-content' }}
            onClick={handleCTAClick}
          >
            {recommendationCTA}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => onNavigate('test')}>
          <RotateCcw size={16} />
          Take Another Test
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('progress')}>
          View Progress Dashboard
        </button>
      </div>
    </div>
  );
};
