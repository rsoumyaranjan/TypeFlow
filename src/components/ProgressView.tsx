/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, Download, Trash2, ShieldAlert, Award, Upload, CheckCircle, RotateCcw } from 'lucide-react';
import {
  getTestHistory,
  getPersonalBests,
  exportDataJSON,
  importDataJSON,
  resetDatabase,
  getLessonHistory,
  type TypingTestSession,
  type PersonalBest,
  type LessonAttempt
} from '../services/db';
import { computeKeyAccuracyHeatmap, getBestWpmPerDuration } from '../services/analytics';

const LESSONS_LIST = [
  { id: 1, title: "Lesson 1: Home Row Basics", description: "Master home row position keys: A S D F and J K L ;" },
  { id: 2, title: "Lesson 2: Index Extensions", description: "Reinforce index extensions: G, H, R, U, T, Y, V, B, N, M" },
  { id: 3, title: "Lesson 3: Ring & Pinky", description: "Stretch outer fingers to hit: Q, W, O, P, Z, X, C, comma, period" }
];

export const ProgressView = () => {
  const [sessions, setSessions] = useState<TypingTestSession[]>([]);
  const [bests, setBests] = useState<PersonalBest[]>([]);
  const [lessonsHistory, setLessonsHistory] = useState<LessonAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard layout rows for the heatmap visual
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  // Fetch data on mount
  const loadData = async () => {
    try {
      setLoading(true);
      const history = await getTestHistory();
      const pbList = await getPersonalBests();
      const lessonHistory = await getLessonHistory();
      setSessions(history);
      setBests(pbList);
      setLessonsHistory(lessonHistory);
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
  const bestWpmMap = getBestWpmPerDuration(bests);

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
    // Clear input so same file can be selected again
    e.target.value = '';
  };

  // Prepare data for the history bar chart (last 10 tests in chronological order)
  const chartSessions = sessions.slice(0, 10).reverse();
  const maxWpm = chartSessions.length > 0 ? Math.max(...chartSessions.map((s) => s.wpm), 60) : 100;

  if (loading) {
    return (
      <div className="flex-center flex-col" style={{ minHeight: '300px', gap: '1rem' }}>
        <div style={{ color: 'var(--accent)', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
          Loading your progress data...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col gap-6">
      {/* Hidden file input for backup imports */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImportChange}
      />

      {/* Page Header */}
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <BarChart2 size={24} style={{ color: 'var(--accent)' }} />
        <h2>Progress &amp; Analytics</h2>
      </div>

      {/* High Scores Banner */}
      <div className="grid grid-cols-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--accent)' }}>
            <Award size={24} />
          </div>
          <div className="flex-col">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>15s Record</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {bestWpmMap[15] !== undefined ? `${Math.round(bestWpmMap[15])} WPM` : '-- WPM'}
            </span>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--success)' }}>
            <Award size={24} />
          </div>
          <div className="flex-col">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>30s Record</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {bestWpmMap[30] !== undefined ? `${Math.round(bestWpmMap[30])} WPM` : '-- WPM'}
            </span>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--warning)' }}>
            <Award size={24} />
          </div>
          <div className="flex-col">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>60s Record</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {bestWpmMap[60] !== undefined ? `${Math.round(bestWpmMap[60])} WPM` : '-- WPM'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Graph & Keyboard Grid */}
      <div className="grid grid-cols-2">
        {/* Performance Chart */}
        <div className="card flex-col">
          <h3 className="card-title">WPM History</h3>
          <p className="card-desc">Your typing speed trends over the last 10 sessions.</p>
          
          <div className="flex-col" style={{ flexGrow: 1, minHeight: '180px', padding: '1rem 0' }}>
            {chartSessions.length === 0 ? (
              <div className="flex-center" style={{ 
                flexGrow: 1, 
                border: '1px dashed var(--border)', 
                borderRadius: '0.5rem',
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(9, 13, 22, 0.3)',
                fontSize: '0.9rem',
                height: '100%'
              }}>
                No typing tests completed yet. Take a test to view progress trends!
              </div>
            ) : (
              <div className="flex" style={{ height: '100%', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem', paddingBottom: '0.5rem' }}>
                {chartSessions.map((session, idx) => {
                  const heightPct = (session.wpm / maxWpm) * 100;
                  return (
                    <div key={session.id || idx} className="flex-col" style={{ flexGrow: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem' }}>
                        {Math.round(session.wpm)}
                      </span>
                      <div 
                        style={{
                          width: '100%',
                          maxHeight: '100px',
                          height: `${heightPct}%`,
                          backgroundColor: 'rgba(14, 165, 233, 0.2)',
                          border: '1px solid var(--accent)',
                          borderRadius: '2px 2px 0 0',
                          transition: 'height 0.3s ease'
                        }}
                        title={`WPM: ${Math.round(session.wpm)}, Acc: ${Math.round(session.accuracy)}% (${session.duration}s)`}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        #{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Heatmap Grid */}
        <div className="card flex-col">
          <h3 className="card-title">Key Accuracy Heatmap</h3>
          <p className="card-desc">Identify which letters trigger the most typos or keystroke lag.</p>
          
          <div className="flex-col gap-2" style={{ marginTop: '0.5rem', alignItems: 'center' }}>
            {keyboardRows.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1" style={{ justifyContent: 'center', width: '100%' }}>
                {row.map((char) => {
                  const status = getKeyStatus(char);
                  const style = getKeyStyle(status);
                  return (
                    <div
                      key={char}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.25rem',
                        border: '1px solid',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        ...style
                      }}
                      title={
                        keyStats[char.toLowerCase()] 
                          ? `${char.toUpperCase()} key: ${keyStats[char.toLowerCase()].total} presses, ${Math.round(keyStats[char.toLowerCase()].accuracy)}% accuracy`
                          : undefined
                      }
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Heatmap Legend */}
          <div className="flex gap-4" style={{ marginTop: '1.5rem', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span className="flex" style={{ alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span> Accurate (acc &ge; 95%, n &ge; 5)
            </span>
            <span className="flex" style={{ alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span> Warning (80% &le; acc &lt; 95%)
            </span>
            <span className="flex" style={{ alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></span> High Error (acc &lt; 80%)
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Progress Checklist */}
      <div className="card flex-col">
        <h3 className="card-title">Touch-Typing Curriculum Progress</h3>
        <p className="card-desc">Checklist of lessons completed to build standard touch-typing habits.</p>
        <div className="grid grid-cols-3" style={{ marginTop: '1rem', gap: '1rem' }}>
          {LESSONS_LIST.map((lesson) => {
            const attempts = lessonsHistory.filter((h) => h.lessonId === lesson.id);
            const isCompleted = attempts.length > 0;
            const bestAttempt = isCompleted
              ? attempts.reduce((best, curr) => curr.errorsCount < best.errorsCount ? curr : best, attempts[0])
              : null;

            return (
              <div
                key={lesson.id}
                className="flex-col card"
                style={{
                  padding: '1.25rem',
                  backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-card)',
                  borderColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'var(--border)',
                  gap: '0.25rem'
                }}
              >
                <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{lesson.title}</h4>
                  {isCompleted ? (
                    <span style={{ color: 'var(--success)' }} title="Completed">
                      <CheckCircle size={20} fill="rgba(16, 185, 129, 0.1)" />
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }} title="Not completed">
                      <RotateCcw size={20} style={{ opacity: 0.5 }} />
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '0.25rem 0 0.75rem 0', minHeight: '2.5rem' }}>
                  {lesson.description}
                </p>
                {isCompleted && bestAttempt ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="flex-col gap-0.5">
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Completed!</span>
                    <span>Attempts: {attempts.length}</span>
                    <span>Best: {bestAttempt.errorsCount} errors ({bestAttempt.durationSeconds}s)</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not completed yet</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="card">
        <h3 className="card-title">Recent Sessions History</h3>
        <p className="card-desc">Details of your 5 most recent typing test sessions.</p>
        
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.75rem 1rem' }}>WPM</th>
                <th style={{ padding: '0.75rem 1rem' }}>Accuracy</th>
                <th style={{ padding: '0.75rem 1rem' }}>Errors</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent typing tests. Complete a test to see your history here!
                  </td>
                </tr>
              ) : (
                sessions.slice(0, 5).map((session, idx) => (
                  <tr key={session.id || idx} style={{ borderBottom: idx < 4 ? '1px solid rgba(30, 41, 59, 0.4)' : 'none' }}>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)' }}>
                      {new Date(session.timestamp).toLocaleDateString()} {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--accent)' }}>{session.duration}s</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{Math.round(session.wpm)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--success)', fontWeight: 600 }}>
                      {Math.round(session.accuracy * 10) / 10}%
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: session.errorsCount > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {session.errorsCount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data portability and privacy controls */}
      <div className="card" style={{ borderColor: 'var(--border)' }}>
        <h3 className="card-title">
          <ShieldAlert size={20} className="logo-icon" style={{ color: 'var(--warning)' }} />
          Local Data Control &amp; Privacy
        </h3>
        <p className="card-desc">
          All typing session details are stored locally inside your browser's IndexedDB database. We never upload your keystrokes or analytics to remote servers. You have complete control over your data.
        </p>
        <div className="flex gap-4" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExport} title="Download database backup file">
            <Download size={16} />
            Export History (JSON)
          </button>
          <button className="btn btn-secondary" onClick={handleImportClick} title="Import database backup file">
            <Upload size={16} />
            Import Backup (JSON)
          </button>
          <button className="btn btn-danger" onClick={handleReset} title="Clear database and settings">
            <Trash2 size={16} />
            Reset &amp; Delete Database
          </button>
        </div>
      </div>
    </div>
  );
};
