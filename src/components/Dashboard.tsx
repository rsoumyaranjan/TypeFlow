import React, { useState, useEffect } from 'react';
import { Play, Trophy, Keyboard, Zap, Sparkles, AlertTriangle } from 'lucide-react';
import { getTestHistory, getPersonalBests, type TypingTestSession, type PersonalBest } from '../services/db';
import { computeKeyAccuracyHeatmap, getBestWpmPerDuration } from '../services/analytics';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'test' | 'results' | 'practice' | 'progress' | 'about' | 'learn') => void;
  onStartPractice: (words: string[]) => void;
}

const PRACTICE_DICTIONARY = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there",
  "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no",
  "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then",
  "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well",
  "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "water", "call", "find", "long", "down",
  "day", "did", "get", "come", "made", "may", "part", "over", "new", "sound", "take", "only", "little", "work", "know", "place",
  "years", "live", "me", "back", "give", "most", "very", "after", "thing", "our", "just", "name", "good", "sentence", "man",
  "say", "great", "where", "help", "through", "much", "before", "line", "right", "too", "mean", "old", "any", "same", "tell",
  "boy", "follow", "came", "want", "show", "also", "around", "form", "three", "small", "end", "put", "home", "read", "hand",
  "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change",
  "went", "light", "kind", "off", "need", "house", "picture", "try", "again", "animal", "point", "mother", "world", "near"
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onStartPractice }) => {
  const [sessions, setSessions] = useState<TypingTestSession[]>([]);
  const [bests, setBests] = useState<PersonalBest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [touchTypeStatus, setTouchTypeStatus] = useState<'yes' | 'no' | 'unsure' | null>(null);
  const [onboardingAnswered, setOnboardingAnswered] = useState<boolean>(false);

  // Load database statistics on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const history = await getTestHistory();
        const pbList = await getPersonalBests();
        setSessions(history);
        setBests(pbList);

        // Load onboarding status
        const savedStatus = localStorage.getItem('typeflow_touchtype_status');
        const answered = localStorage.getItem('typeflow_onboarding_answered') === 'true';
        if (answered && savedStatus) {
          setTouchTypeStatus(savedStatus as 'yes' | 'no' | 'unsure');
          setOnboardingAnswered(true);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Compute peak WPM
  const bestWpmMap = getBestWpmPerDuration(bests);
  const maxWpm = Object.values(bestWpmMap).length > 0 ? Math.max(...Object.values(bestWpmMap)) : 0;

  // Compute overall best accuracy
  const maxAcc = sessions.length > 0 ? Math.max(...sessions.map((s) => s.accuracy)) : 0;

  // Identify Weak Key: lowest accuracy under 90% typed at least 3 times
  const keyStats = computeKeyAccuracyHeatmap(sessions);
  let weakKey: string | null = null;
  let lowestAcc = 100;

  for (const [key, stats] of Object.entries(keyStats)) {
    if (stats.total >= 3 && stats.accuracy < 90 && stats.accuracy < lowestAcc) {
      lowestAcc = stats.accuracy;
      weakKey = key;
    }
  }

  const handleStartWeakKeyDrill = () => {
    if (!weakKey) return;
    const filtered = PRACTICE_DICTIONARY.filter((w) => w.toLowerCase().includes((weakKey as string).toLowerCase())).slice(0, 15);
    const drillWords = filtered.length > 0 ? filtered : ["practice", "keyboard", "typing"];
    onStartPractice(drillWords);
  };

  const handleSelectOnboarding = (status: 'yes' | 'no' | 'unsure') => {
    setTouchTypeStatus(status);
    setOnboardingAnswered(true);
    localStorage.setItem('typeflow_touchtype_status', status);
    localStorage.setItem('typeflow_onboarding_answered', 'true');
  };

  const handleResetOnboarding = () => {
    setTouchTypeStatus(null);
    setOnboardingAnswered(false);
    localStorage.removeItem('typeflow_touchtype_status');
    localStorage.removeItem('typeflow_onboarding_answered');
  };

  if (loading) {
    return (
      <div className="flex-center flex-col" style={{ minHeight: '300px', gap: '1rem' }}>
        <div style={{ color: 'var(--accent)', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {/* Left Column: Hero, Onboarding & Dynamic Recommendations */}
      <div className="flex-col gap-6">
        {/* Welcome Hero (Compacted) */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #151b2d 0%, #0d213f 100%)', borderColor: 'rgba(14, 165, 233, 0.2)', padding: '1.25rem' }}>
          <h2 className="dashboard-hero-title">
            <Sparkles className="logo-icon" size={20} />
            Welcome back to TypeFlow
          </h2>
          <p className="card-desc dashboard-hero-desc" style={{ margin: 0 }}>
            Your calm, local-first touch-typing companion. Analyze speed, target weak keys, and build fluid muscle memory.
          </p>
        </div>

        {/* Onboarding Diagnostics Card */}
        <div className="card onboarding-card" style={{ padding: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.1rem', margin: 0 }}>
            <Keyboard size={18} className="logo-icon" />
            Interactive Onboarding Guide
          </h3>
          
          {!onboardingAnswered ? (
            <>
              <p className="card-desc" style={{ margin: 0, fontSize: '0.9rem' }}>
                We want to recommend the best starting point for you. **Do you touch type using all 10 fingers?**
              </p>
              <div className="onboarding-options">
                <button className="onboarding-btn" onClick={() => handleSelectOnboarding('yes')}>
                  Yes, I do
                </button>
                <button className="onboarding-btn" onClick={() => handleSelectOnboarding('no')}>
                  No / Not yet
                </button>
                <button className="onboarding-btn" onClick={() => handleSelectOnboarding('unsure')}>
                  Unsure
                </button>
              </div>
            </>
          ) : (
            <div className={`onboarding-recommendation ${touchTypeStatus === 'yes' ? 'recommend-test' : 'recommend-learn'}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text)' }}>
                  {touchTypeStatus === 'yes' ? 'Recommended Path: Baseline Speed Test' : 'Recommended Path: Finger Practice & Learn'}
                </strong>
                <button 
                  onClick={handleResetOnboarding}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Change Intention
                </button>
              </div>
              
              {touchTypeStatus === 'yes' ? (
                <>
                  <p style={{ margin: 0 }}>
                    Since you already practice touch typing, you can jump straight into a baseline speed test to evaluate your accuracy and spot specific weak keys.
                  </p>
                  <button className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => onNavigate('test')}>
                    <Play size={14} fill="currentColor" />
                    Start Speed Test
                  </button>
                </>
              ) : (
                <>
                  <p style={{ margin: 0 }}>
                    To avoid developing bad muscle habits, we highly recommend mastering the home row finger positions first. Take a look at our quick visual placement drills.
                  </p>
                  <button className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: 'var(--success)', color: '#fff' }} onClick={() => onNavigate('learn')}>
                    <Sparkles size={14} />
                    Go to Learn Page
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Recommendation Box based on Weak Key */}
        {weakKey ? (
          <div className="card" style={{ padding: '1.25rem', border: '1px solid rgba(244, 63, 94, 0.3)', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(244, 63, 94, 0.03) 100%)' }}>
            <h3 className="card-title" style={{ color: 'var(--danger)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
              <AlertTriangle size={18} className="logo-icon" />
              Targeted Key Recommendation
            </h3>
            <p className="card-desc" style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
              Your accuracy with key <strong style={{ color: 'var(--text)', textTransform: 'uppercase' }}>'{weakKey}'</strong> is <strong style={{ color: 'var(--danger)' }}>{Math.round(lowestAcc)}%</strong>. Try a targeted session to build clean accuracy.
            </p>
            <button 
              className="btn btn-danger"
              style={{ width: 'fit-content', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={handleStartWeakKeyDrill}
            >
              Practice Key '{weakKey.toUpperCase()}' Drill
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: '1.25rem', borderStyle: 'dashed' }}>
            <h3 className="card-title" style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
              <Zap size={18} className="logo-icon" style={{ color: 'var(--accent)' }} />
              No Active Recommendations
            </h3>
            <p className="card-desc" style={{ margin: 0, fontSize: '0.9rem' }}>
              Complete a timed typing test to receive personalized key practice suggestions.
            </p>
          </div>
        )}
      </div>

      {/* Right Column: Personal Bests & Shortcuts */}
      <div className="flex-col gap-6">
        {/* Quick Stats */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>
            <Trophy size={18} className="logo-icon" style={{ color: '#eab308' }} />
            Personal Bests
          </h3>
          <p className="card-desc" style={{ fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Your local record scores.</p>
          
          <div className="flex-col gap-3">
            <div className="flex" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Peak Speed</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text)' }}>
                {maxWpm > 0 ? `${Math.round(maxWpm)} WPM` : '--'}
              </strong>
            </div>
            <div className="flex" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Max Accuracy</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--success)' }}>
                {maxAcc > 0 ? `${Math.round(maxAcc)}%` : '--'}
              </strong>
            </div>
            <div className="flex" style={{ justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Weakest Key</span>
              <strong style={{ fontSize: '1.1rem', color: weakKey ? 'var(--danger)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                {weakKey || '--'}
              </strong>
            </div>
          </div>
        </div>

        {/* Shortcuts Reference */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
            <Keyboard size={18} className="logo-icon" />
            Quick Navigation
          </h3>
          <ul className="flex-col gap-2" style={{ listStyle: 'none', fontSize: '0.85rem' }}>
            <li className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Typing Test</span>
              <span className="shortcut-hint">Ctrl+Alt+T</span>
            </li>
            <li className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Dashboard</span>
              <span className="shortcut-hint">Ctrl+Alt+D</span>
            </li>
            <li className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Progress</span>
              <span className="shortcut-hint">Ctrl+Alt+P</span>
            </li>
            <li className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Learn Guide</span>
              <span className="shortcut-hint">Ctrl+Alt+L</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
