// src/components/Curriculum.tsx

import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Lock, Award, Clock } from 'lucide-react';
import { getLessonHistory } from '../services/db';
import { lessons } from '../utils/lessonsData';

interface CurriculumProps {
  onSelectStage: (idx: number) => void;
}

const PHASES = [
  { code: 'foundation', label: 'Foundation' },
  { code: 'vertical', label: 'Vertical' },
  { code: 'coordination', label: 'Coordination' },
  { code: 'numbers', label: 'Numbers' },
  { code: 'symbols', label: 'Symbols' },
  { code: 'integration', label: 'Integration' },
  { code: 'specialist', label: 'Specialist' }
] as const;

const KEYBOARD_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

const getKeyColor = (key: string): string => {
  const k = key.toLowerCase();
  if (['1', 'q', 'a', 'z'].includes(k)) return '#ff6b81'; // pink
  if (['2', 'w', 's', 'x'].includes(k)) return '#54a0ff'; // blue
  if (['3', 'e', 'd', 'c'].includes(k)) return '#2ed573'; // green
  if (['4', '5', 'r', 't', 'f', 'g', 'v', 'b'].includes(k)) return '#ff9f43'; // orange
  if (['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'].includes(k)) return '#f1c40f'; // yellow
  if (['8', 'i', 'k', ','].includes(k)) return '#2ed573'; // green
  if (['9', 'o', 'l', '.'].includes(k)) return '#54a0ff'; // blue
  if (['0', 'p', ';', '/', '-'].includes(k)) return '#ff6b81'; // pink
  return 'var(--border)';
};

export const Curriculum: React.FC<CurriculumProps> = ({ onSelectStage }) => {
  const [activePhase, setActivePhase] = useState<typeof PHASES[number]['code']>('foundation');
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [lastCompletedId, setLastCompletedId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const PAGE_SIZE = 12;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getLessonHistory();
        const uniqueCompleted = new Set(history.map(attempt => attempt.lessonId));
        setCompletedLessonIds(uniqueCompleted);

        // Find highest completed stage ID to determine unlocked keys
        let maxCompleted = 0;
        uniqueCompleted.forEach(id => {
          if (id > maxCompleted) maxCompleted = id;
        });
        setLastCompletedId(maxCompleted);

        // Unlock next stage's keys.
        const nextStageIdx = Math.min(lessons.length - 1, maxCompleted);
        const activeUnlockedKeys = lessons[nextStageIdx]?.unlockedKeys || ['f', 'j'];
        setUnlockedKeys(activeUnlockedKeys);
      } catch (err) {
        console.error('Failed to load lesson history:', err);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [activePhase]);

  const filteredLessons = lessons
    .map((l, i) => ({ ...l, index: i }))
    .filter(l => l.phase === activePhase);

  // Compute progress for stats
  const totalInPhase = lessons.filter(l => l.phase === activePhase).length;
  const completedInPhase = lessons.filter(l => l.phase === activePhase && completedLessonIds.has(l.id)).length;

  const totalPages = Math.ceil(filteredLessons.length / PAGE_SIZE);
  const paginatedLessons = filteredLessons.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'key-intro': return '⌨️';
      case 'pair-drill': return '🔄';
      case 'word-drill': return '📝';
      case 'sentence': return '🔤';
      case 'paragraph': return '📖';
      case 'speed-run': return '⏱️';
      case 'accuracy-run': return '🎯';
      case 'rhythm': return '🎵';
      case 'adaptive': return '🔧';
      case 'cumulative': return '📚';
      case 'graduation': return '🎓';
      case 'specialist': return '💼';
      default: return '📄';
    }
  };

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen size={24} style={{ color: 'var(--accent)' }} />
        <h2>TypeFlow Touch-Typing Curriculum</h2>
      </div>

      {/* Keyboard Unlock Map */}
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h4 style={{ margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Your Keyboard Progress</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {unlockedKeys.filter(k => k.length === 1).length} / 52 keys unlocked
          </span>
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
          {KEYBOARD_ROWS.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem' }}>
              {row.map(key => {
                const isUnlocked = unlockedKeys.map(k => k.toLowerCase()).includes(key.toLowerCase());
                const color = getKeyColor(key);
                const isJustUnlocked = key.toLowerCase() === lessons[lastCompletedId]?.focusKeys[0]?.toLowerCase();
                return (
                  <div
                    key={key}
                    className={`key-btn ${isUnlocked ? 'key-unlocked' : 'key-locked'} ${isJustUnlocked ? 'key-just-unlocked' : ''}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      backgroundColor: isUnlocked ? color : 'var(--bg)',
                      color: isUnlocked ? '#0b0f19' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontSize: '0.9rem',
                      opacity: isUnlocked ? 1 : 0.25,
                      boxShadow: isJustUnlocked ? '0 0 10px var(--accent)' : 'none'
                    }}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p style={{ color: 'var(--text-dim)', margin: 0 }}>
        Select an unlocked stage below to begin training. Complete each stage to unlock the next chapter.
      </p>

      {/* Phase selectors */}
      <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
        {PHASES.map((phase) => (
          <button
            key={phase.code}
            className={`phase-tab ${activePhase === phase.code ? 'active' : ''}`}
            onClick={() => setActivePhase(phase.code)}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--border)',
              backgroundColor: activePhase === phase.code ? 'var(--accent)' : 'var(--bg-card)',
              color: activePhase === phase.code ? '#0b0f19' : 'var(--text-dim)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {phase.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Phase Progress: {completedInPhase} / {totalInPhase} stages completed
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-3" style={{ gap: '1rem', marginTop: '0.5rem' }}>
        {paginatedLessons.map((lesson) => {
          const isCompletedPast = completedLessonIds.has(lesson.id);
          const isUnlocked = lesson.index === 0 || completedLessonIds.has(lessons[lesson.index - 1].id);

          return (
            <button
              key={lesson.id}
              disabled={!isUnlocked}
              onClick={() => onSelectStage(lesson.index)}
              className="card flex-col"
              style={{
                padding: '1.25rem',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                border: '1px solid var(--border)',
                backgroundColor: isUnlocked ? 'var(--bg-card)' : 'rgba(15, 23, 42, 0.4)',
                textAlign: 'left',
                borderRadius: '0.5rem',
                gap: '0.5rem',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                opacity: isUnlocked ? 1 : 0.65
              }}
            >
              <div className="flex" style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  STAGE {String(lesson.id).padStart(3, '0')} {getLessonTypeIcon(lesson.type)}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {isCompletedPast && isUnlocked && (
                    <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  )}
                  {!isUnlocked && (
                    <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
              </div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
                {lesson.title.replace(/Stage \d+:\s*/, '')}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                {lesson.description}
              </p>

              {isUnlocked && (
                <div className="flex gap-4" style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span className="flex" style={{ alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={12} /> {lesson.estimatedMinutes} min
                  </span>
                  <span className="flex" style={{ alignItems: 'center', gap: '0.2rem' }}>
                    <Award size={12} /> +{lesson.xpReward} XP
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2" style={{ justifyContent: 'center', marginTop: '1.5rem', alignItems: 'center' }}>
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
