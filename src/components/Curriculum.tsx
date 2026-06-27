import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Lock } from 'lucide-react';
import { getLessonHistory } from '../services/db';
import { lessons } from '../utils/lessonsData';

interface CurriculumProps {
  onSelectStage: (idx: number) => void;
}

const PHASES = [
  { code: 'home-row', label: 'Home Row' },
  { code: 'extensions', label: 'Extensions' },
  { code: 'coordination', label: 'Coordination' },
  { code: 'numbers-symbols', label: 'Numbers & Symbols' },
  { code: 'advanced', label: 'Advanced' }
] as const;

export const Curriculum: React.FC<CurriculumProps> = ({ onSelectStage }) => {
  const [activePhase, setActivePhase] = useState<typeof PHASES[number]['code']>('home-row');
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getLessonHistory();
        const uniqueCompleted = new Set(history.map(attempt => attempt.lessonId));
        setCompletedLessonIds(uniqueCompleted);
      } catch (err) {
        console.error('Failed to load lesson history:', err);
      }
    };
    loadHistory();
  }, []);

  const filteredLessons = lessons
    .map((l, i) => ({ ...l, index: i }))
    .filter(l => l.phase === activePhase);

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen size={24} style={{ color: 'var(--accent)' }} />
        <h2>TypeFlow Touch-Typing Curriculum</h2>
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

      {/* Grid List */}
      <div className="grid grid-cols-3" style={{ gap: '1rem', marginTop: '1rem' }}>
        {filteredLessons.map((lesson) => {
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
                  STAGE {lesson.id}
                </span>
                {isCompletedPast && isUnlocked && (
                  <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                )}
                {!isUnlocked && (
                  <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
                {lesson.title.replace(/Stage \d+:\s*/, '')}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                {lesson.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
