// src/components/Onboarding.tsx

import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import type { LessonTrack } from '../utils/lessonsData';

interface OnboardingProps {
  onTrackSelected: (track: LessonTrack) => void;
}

export function Onboarding({ onTrackSelected }: OnboardingProps) {
  const navigate = useNavigate();

  const handleSelectTrack = async (track: LessonTrack) => {
    await db.transaction('rw', db.userStats, async () => {
      let stats = await db.userStats.get('current_user');
      if (!stats) {
        stats = {
          id: 'current_user',
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveTimestamp: 0,
          unlockedThemes: ['theme-dark', 'theme-light', 'theme-sepia'],
          activeTheme: 'theme-dark',
          selectedTrack: track,
          streakShieldAvailable: false,
          streakShieldUsedDate: null,
          dailyChallengeLastCompleted: null
        };
      } else {
        stats.selectedTrack = track;
      }
      await db.userStats.put(stats);
    });

    onTrackSelected(track);
    navigate('/curriculum');
  };

  return (
    <div className="onboarding-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Welcome to TypeFlow! 🎹</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: 'var(--text-dim)' }}>
        Choose your learning track to customize your touch-typing journey. You can change this later in Settings.
      </p>

      <div className="track-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Track A: Young Learner */}
        <div 
          className="track-card" 
          onClick={() => handleSelectTrack('young')}
          style={{
            background: 'var(--bg-card)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '2rem 1.5rem',
            cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧒</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Young Learner</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ages 6-12</p>
          <ul style={{ textAlign: 'left', fontSize: '0.9rem', paddingLeft: '1.2rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
            <li>Fun animal & nature vocabulary</li>
            <li>No time pressure in early stages</li>
            <li>90% accuracy graduation gate</li>
            <li>Stars-based feedback</li>
          </ul>
        </div>

        {/* Track B: General Adult */}
        <div 
          className="track-card" 
          onClick={() => handleSelectTrack('adult')}
          style={{
            background: 'var(--bg-card)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '2rem 1.5rem',
            cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>General Adult</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ages 13-45</p>
          <ul style={{ textAlign: 'left', fontSize: '0.9rem', paddingLeft: '1.2rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
            <li>1,000 common English words</li>
            <li>Standard time windows</li>
            <li>95% accuracy + 25 WPM gate</li>
            <li>Streaks & XP levelling</li>
          </ul>
        </div>

        {/* Track C: Professional */}
        <div 
          className="track-card" 
          onClick={() => handleSelectTrack('professional')}
          style={{
            background: 'var(--bg-card)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '2rem 1.5rem',
            cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Professional</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Developer Track</p>
          <ul style={{ textAlign: 'left', fontSize: '0.9rem', paddingLeft: '1.2rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
            <li>Programming keywords & camelCase</li>
            <li>Strict speed thresholds</li>
            <li>98% accuracy + 40 WPM gate</li>
            <li>Efficiency scores & themes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
