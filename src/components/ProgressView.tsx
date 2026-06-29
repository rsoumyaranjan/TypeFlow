/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import {
  getTestHistory,
  exportDataJSON,
  importDataJSON,
  resetDatabase,
  getLessonHistory,
  getBadges,
  type TypingTestSession,
  type LessonAttempt,
  type Badge
} from '../services/db';
import {
  computeKeyAccuracyHeatmap,
  computeConsistencyScore,
  computeImprovementRate,
  computeAverageSessionDuration
} from '../services/analytics';

// Import the full curriculum lesson metadata structure from the utilities module
import { lessons as LESSONS_LIST } from '../utils/lessonsData';

export const ProgressView = () => {
  const [sessions, setSessions] = useState<TypingTestSession[]>([]);
  const [lessonsHistory, setLessonsHistory] = useState<LessonAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [consistency, setConsistency] = useState<number>(0);
  const [improvementRate, setImprovementRate] = useState<number>(0);
  const [avgDuration, setAvgDuration] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<boolean[]>(Array(7).fill(false));

  const [userStats, setUserStats] = useState<any>(null);

  // Fetch data on mount
  const loadData = async () => {
    try {
      setLoading(true);
      const savedUser = localStorage.getItem('typeflow_active_user');
      setActiveUser(savedUser);

      const { db } = await import('../services/db');
      const stats = await db.userStats.get('current_user');
      setUserStats(stats);
      
      const history = await getTestHistory();
      const lessonHistory = await getLessonHistory();
      const earnedBadges = await getBadges();

      setSessions(history);
      setLessonsHistory(lessonHistory);
      setBadges(earnedBadges);

      // Evaluate active streak days for current week (Sun-Sat)
      const days = Array(7).fill(false);
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0,0,0,0);

      // Check test histories for this week
      history.forEach(session => {
        const d = new Date(session.timestamp);
        if (d >= startOfWeek) {
          days[d.getDay()] = true;
        }
      });
      // Check lesson histories for this week
      lessonHistory.forEach(lesson => {
        const d = new Date(lesson.completedAt);
        if (d >= startOfWeek) {
          days[d.getDay()] = true;
        }
      });
      setWeeklyActiveDays(days);
    } catch (err) {
      console.error('Failed to load local data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute key statistics and lookup map for best WPMs
  const keyStats = computeKeyAccuracyHeatmap(sessions);

  // Dynamic status mapping for keyboard layout keys
  const getKeyStatus = (char: string): 'good' | 'warn' | 'danger' | 'none' => {
    const key = char.toLowerCase();
    const stats = keyStats[key];

    if (!stats || stats.total === 0) return 'none';
    if (stats.total >= 5 && stats.accuracy >= 95) return 'good';
    if (stats.total >= 1 && stats.accuracy >= 80 && stats.accuracy < 95) return 'warn';
    if (stats.total >= 1 && stats.accuracy < 80) return 'danger';
    return 'none';
  };

  // Keyboard key visual styling
  const getKeyStyle = (status: 'good' | 'warn' | 'danger' | 'none') => {
    switch (status) {
      case 'good':
        return { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'var(--success)', color: 'var(--success)' };
      case 'warn':
        return { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'var(--warning)', color: 'var(--warning)' };
      case 'danger':
        return { backgroundColor: 'rgba(244, 63, 94, 0.15)', borderColor: 'var(--danger)', color: 'var(--danger)' };
      default:
        return { backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' };
    }
  };

  // Export database handler
  const handleExport = async () => {
    try {
      const jsonStr = await exportDataJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'typeflow_backup.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export typing history.');
    }
  };

  // Reset database handler
  const handleReset = async () => {
    if (window.confirm("Are you sure you want to delete all typing logs? This cannot be undone.")) {
      try {
        await resetDatabase();
        window.location.reload();
      } catch (err) {
        console.error('Reset failed:', err);
        alert('Failed to reset database.');
      }
    }
  };

  // Trigger file browser for importing
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Import file change handler
  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      try {
        await importDataJSON(content, 'overwrite');
        alert('Data backup imported successfully!');
        window.location.reload();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('Import failed:', err);
        alert(`Failed to import backup: ${errorMsg}`);
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (sessions.length > 0) {
      setConsistency(computeConsistencyScore(sessions.flatMap(s => s.keystrokeLog || []).map(k => k.deltaMs).filter(d => d > 0)));
      setImprovementRate(computeImprovementRate(sessions));
      setAvgDuration(computeAverageSessionDuration(sessions));
    }
  }, [sessions]);

  if (loading) {
    return (
      <div className="flex-center flex-col" style={{ minHeight: '300px', gap: '1rem' }}>
        <div style={{ color: 'var(--accent)', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
          Loading your progress data...
        </div>
      </div>
    );
  }

  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    [' ', 'backspace']
  ];

  return (
    <div className="flex-col gap-4" style={{ paddingBottom: '2rem', width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImportChange}
      />

      {showStreakModal && (
        <div className="flex-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 15, 25, 0.85)', zIndex: 1000, padding: '1rem' }}>
          <div className="card flex-col" style={{ maxWidth: '400px', width: '100%', padding: '1.5rem', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>🔥 Weekly Streak Activity</h3>
              <button 
                onClick={() => setShowStreakModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <p className="card-desc" style={{ fontSize: '0.8rem', margin: 0 }}>Days completed this calendar week:</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div key={day} className="flex-col flex-center" style={{ gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{day}</span>
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: weeklyActiveDays[idx] ? 'var(--warning)' : 'var(--bg-hover)',
                      border: `1px solid ${weeklyActiveDays[idx] ? 'var(--warning)' : 'var(--border)'}`,
                      color: weeklyActiveDays[idx] ? '#0b0f19' : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    {weeklyActiveDays[idx] ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Stats strip */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', width: '100%' }}>
        <div className="card flex-col flex-center" style={{ flex: 1, padding: '0.5rem 0.25rem', minHeight: '60px', background: 'linear-gradient(145deg, var(--bg-card), rgba(14, 165, 233, 0.05))', transition: 'transform 0.2s' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>XP LEVEL</span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--accent)', marginTop: '0.1rem' }}>
            Lvl {userStats?.level || 1}
          </strong>
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{userStats?.xp || 0} XP</span>
        </div>

        {activeUser && (
          <div 
            className="card flex-col flex-center" 
            onClick={() => setShowStreakModal(true)}
            style={{ flex: 1, padding: '0.5rem 0.25rem', minHeight: '60px', background: 'linear-gradient(145deg, var(--bg-card), rgba(245, 158, 11, 0.05))', transition: 'transform 0.2s', cursor: 'pointer', border: '1px solid rgba(245, 158, 11, 0.2)' }}
            title="Click to view weekly streak calendar"
          >
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>STREAK</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--warning)', marginTop: '0.1rem' }}>
              🔥 {userStats?.currentStreak || 1}
            </strong>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Best: {userStats?.longestStreak || 1}d</span>
          </div>
        )}

        <div className="card flex-col flex-center" style={{ flex: 1, padding: '0.5rem 0.25rem', minHeight: '60px', background: 'linear-gradient(145deg, var(--bg-card), rgba(16, 185, 129, 0.05))', transition: 'transform 0.2s' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>CONSISTENCY</span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--success)', marginTop: '0.1rem' }}>
            {consistency}%
          </strong>
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Pacing Index</span>
        </div>

        <div className="card flex-col flex-center" style={{ flex: 1, padding: '0.5rem 0.25rem', minHeight: '60px', background: 'linear-gradient(145deg, var(--bg-card), rgba(14, 165, 233, 0.05))', transition: 'transform 0.2s' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>IMPROVEMENT</span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--accent)', marginTop: '0.1rem' }}>
            {improvementRate >= 0 ? `+${improvementRate}` : improvementRate}%
          </strong>
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Speed Growth</span>
        </div>

        <div className="card flex-col flex-center" style={{ flex: 1, padding: '0.5rem 0.25rem', minHeight: '60px', background: 'linear-gradient(145deg, var(--bg-card), rgba(248, 250, 252, 0.02))', transition: 'transform 0.2s' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>AVG SESSION</span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--text)', marginTop: '0.1rem' }}>
            {avgDuration}s
          </strong>
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Duration</span>
        </div>
      </div>

      {/* SVG-based Sparkline Graph & Keyboard accuracy heatmap */}
      <div className="grid grid-cols-2 gap-4">
        {/* WPM Sparkline graph */}
        <div className="card flex-col" style={{ padding: '1rem' }}>
          <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>WPM Trend Sparkline</h3>
          <p className="card-desc" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>chronological typing speed graph</p>
          
          <div className="flex-center" style={{ height: '110px', width: '100%', marginTop: '0.25rem' }}>
            {sessions.length < 2 ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Complete 2 or more tests to trace sparkline</span>
            ) : (
              <svg width="100%" height="90" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {(() => {
                  const points = sessions.slice(0, 15).reverse();
                  const minVal = Math.min(...points.map(p => p.wpm));
                  const maxVal = Math.max(...points.map(p => p.wpm));
                  const range = maxVal - minVal || 1;
                  
                  const width = 300;
                  const step = width / (points.length - 1);
                  const coords = points.map((p, i) => {
                    const x = i * step;
                    const y = 80 - ((p.wpm - minVal) / range) * 70;
                    return { x, y, wpm: p.wpm };
                  });

                  const pathD = `M ${coords.map(c => `${c.x},${c.y}`).join(' L ')}`;
                  const areaD = `${pathD} L ${coords[coords.length - 1].x},90 L 0,90 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#sparklineGrad)" />
                      <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {coords.map((c, i) => (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r="3"
                          fill="var(--accent)"
                          stroke="var(--bg)"
                          strokeWidth="1"
                          style={{ cursor: 'pointer' }}
                        >
                          <title>{Math.round(c.wpm)} WPM</title>
                        </circle>
                      ))}
                    </>
                  );
                })()}
              </svg>
            )}
          </div>
        </div>

        {/* Keyboard Heatmap Grid */}
        <div className="card flex-col" style={{ padding: '1rem' }}>
          <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>47-Key Accuracy Heatmap</h3>
          <p className="card-desc" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>letters, numbers, space, and backspaces</p>
          
          <div className="flex-col gap-1" style={{ width: '100%', alignItems: 'center' }}>
            {keyboardRows.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1" style={{ justifyContent: 'center', width: '100%' }}>
                {row.map((char) => {
                  const status = getKeyStatus(char);
                  const style = getKeyStyle(status);
                  const isSpace = char === ' ';
                  const isBack = char === 'backspace';

                  return (
                    <div
                      key={char}
                      style={{
                        width: isSpace ? '90px' : isBack ? '55px' : '23px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.2rem',
                        border: '1px solid',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        cursor: 'help',
                        ...style
                      }}
                      title={
                        keyStats[char.toLowerCase()] 
                          ? `${char === ' ' ? 'Space' : char.toUpperCase()}: ${keyStats[char.toLowerCase()].total} hits, ${Math.round(keyStats[char.toLowerCase()].accuracy)}% accuracy`
                          : `${char === ' ' ? 'Space' : char.toUpperCase()}: No presses logged yet`
                      }
                    >
                      {char === ' ' ? 'Space' : isBack ? 'Back' : char}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum rings condensed progress rail */}
      <div className="card flex-col" style={{ padding: '1rem' }}>
        <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>Curriculum Module Milestones</h3>
        <p className="card-desc" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>stage completion percentages</p>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { code: 'foundation', label: 'Foundation' },
            { code: 'vertical', label: 'Vertical' },
            { code: 'coordination', label: 'Coordination' },
            { code: 'numbers', label: 'Numbers' },
            { code: 'symbols', label: 'Symbols' },
            { code: 'integration', label: 'Integration' },
            { code: 'specialist', label: 'Specialist' }
          ].map((phase) => {
            const phaseLessons = LESSONS_LIST.filter(l => l.phase === phase.code);
            const totalCount = phaseLessons.length;
            const completedCount = phaseLessons.filter(l => lessonsHistory.some(h => h.lessonId === l.id)).length;
            const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div 
                key={phase.code}
                className="card"
                style={{ 
                  flex: '1 0 110px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.5rem', 
                  backgroundColor: percentage === 100 ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)', 
                  borderColor: percentage === 100 ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)',
                  borderRadius: '0.35rem'
                }}
              >
                <div style={{ position: 'relative', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="11" cy="11" r="9" fill="transparent" stroke="var(--border)" strokeWidth="2.5" />
                    <circle 
                      cx="11" 
                      cy="11" 
                      r="9" 
                      fill="transparent" 
                      stroke={percentage === 100 ? 'var(--success)' : 'var(--accent)'} 
                      strokeWidth="2.5" 
                      strokeDasharray={2 * Math.PI * 9} 
                      strokeDashoffset={2 * Math.PI * 9 * (1 - percentage / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-col">
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {phase.label}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                    {percentage}% ({completedCount}/{totalCount})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge collection section */}
      <div className="card flex-col" style={{ padding: '1rem' }}>
        <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>Your Badges Collection</h3>
        <p className="card-desc" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Achievements unlocked in learning modules</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {[
            { id: 'home-row-master', name: '🏠 Home Row Master', req: 'Complete Stage 25' },
            { id: 'top-row-master', name: '⬆️ Top Row Master', req: 'Complete Stage 40' },
            { id: 'full-alphabet', name: '🔤 Alphabet Complete', req: 'Complete Stage 55' },
            { id: 'shift-shifter', name: '⬆️ Shift Shifter', req: 'Complete Stage 90' },
            { id: 'number-cruncher', name: '🔢 Number Cruncher', req: 'Complete Stage 115' },
            { id: 'symbol-master', name: '#️⃣ Symbol Master', req: 'Complete Stage 145' },
            { id: 'sixty-wpm', name: '🚀 60 WPM Club', req: 'First test >= 60 WPM' },
            { id: 'certified-typist', name: '📜 Certified Typist', req: 'Pass Stage 182' },
            { id: 'keyboard-ninja', name: '🥷 Keyboard Ninja', req: 'Pass Stage 192' },
            { id: 'typeflow-graduate', name: '🎓 TypeFlow Graduate', req: 'Complete Stage 200' },
          ].map(badgeSpec => {
            const isEarned = badges.some(b => b.id === badgeSpec.id);
            return (
              <div 
                key={badgeSpec.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  background: isEarned ? 'var(--bg-card)' : 'rgba(30, 41, 59, 0.1)', 
                  border: `1px solid ${isEarned ? 'var(--warning)' : 'var(--border)'}`, 
                  borderRadius: '10px', 
                  textAlign: 'center',
                  opacity: isEarned ? 1 : 0.4
                }}
              >
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {badgeSpec.name.split(' ')[0]}
                </span>
                <strong style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text)' }}>
                  {badgeSpec.name.replace(/^[^\s]+\s+/, '')}
                </strong>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {isEarned ? 'Unlocked' : badgeSpec.req}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="card" style={{ padding: '1rem' }}>
        <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>Recent Typing Sessions</h3>
        <p className="card-desc" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>performance details of your last 10 trials</p>
        
        <div style={{ overflowX: 'auto', maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '0.35rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-hover)', position: 'sticky', top: 0 }}>
                <th style={{ padding: '0.45rem 0.75rem' }}>Date</th>
                <th style={{ padding: '0.45rem 0.75rem' }}>Duration</th>
                <th style={{ padding: '0.45rem 0.75rem' }}>WPM</th>
                <th style={{ padding: '0.45rem 0.75rem' }}>Accuracy</th>
                <th style={{ padding: '0.45rem 0.75rem' }}>Consistency</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent typing tests completed.
                  </td>
                </tr>
              ) : (
                sessions.slice(0, 10).map((session, idx) => {
                  let tierColor = 'var(--text)';
                  if (session.wpm >= 60) tierColor = 'var(--success)';
                  else if (session.wpm >= 40) tierColor = 'var(--accent)';
                  else if (session.wpm >= 25) tierColor = 'var(--warning)';

                  return (
                    <tr key={session.id || idx} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.2)' }}>
                      <td style={{ padding: '0.45rem 0.75rem', color: 'var(--text-dim)' }}>
                        {new Date(session.timestamp).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.45rem 0.75rem' }}>{session.duration}s</td>
                      <td style={{ padding: '0.45rem 0.75rem', fontWeight: 700, color: tierColor }}>{Math.round(session.wpm)}</td>
                      <td style={{ padding: '0.45rem 0.75rem', color: 'var(--success)' }}>{Math.round(session.accuracy)}%</td>
                      <td style={{ padding: '0.45rem 0.75rem', color: 'var(--accent)' }}>{session.consistencyScore || 100}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsible accordion details elements */}
      <details className="card" style={{ borderColor: 'var(--border)', cursor: 'pointer', padding: '0.5rem 1rem' }}>
        <summary style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          ⚙️ Data &amp; Privacy Management Controls
        </summary>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={handleExport}>
            Export Database (JSON)
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={handleImportClick}>
            Import Backup File
          </button>
          <button className="btn btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={handleReset}>
            Reset IndexedDB
          </button>
        </div>
      </details>
    </div>
  );
};
