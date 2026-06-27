import React, { useState, useEffect } from 'react';
import { Sliders, Volume2, VolumeX } from 'lucide-react';

interface SettingsMenuProps {
  soundOn: boolean;
  setSoundOn: (soundOn: boolean) => void;
  onSettingsChange?: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ soundOn, setSoundOn, onSettingsChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [targetWpm, setTargetWpm] = useState(localStorage.getItem('typeflow_custom_target_wpm') || '25');
  const [targetAcc, setTargetAcc] = useState(localStorage.getItem('typeflow_custom_target_acc') || '98');

  useEffect(() => {
    const handleStorageChange = () => {
      setTargetWpm(localStorage.getItem('typeflow_custom_target_wpm') || '25');
      setTargetAcc(localStorage.getItem('typeflow_custom_target_acc') || '98');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleWpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTargetWpm(val);
    localStorage.setItem('typeflow_custom_target_wpm', val);
    if (onSettingsChange) onSettingsChange();
    window.dispatchEvent(new Event('storage'));
  };

  const handleAccChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTargetAcc(val);
    localStorage.setItem('typeflow_custom_target_acc', val);
    if (onSettingsChange) onSettingsChange();
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button
        className="icon-btn"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Open Settings & Targets"
        aria-label="Settings Menu"
      >
        <Sliders size={18} />
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '45px',
          right: '0px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          minWidth: '260px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Preferences & Targets
          </h4>

          {/* Sound Audio Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 500 }}>Sound Effects</span>
            <button
              className="icon-btn"
              onClick={() => setSoundOn(!soundOn)}
              title={soundOn ? "Mute sounds" : "Enable sounds"}
              aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', gap: '0.25rem' }}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{soundOn ? "ON" : "OFF"}</span>
            </button>
          </div>

          {/* Target Speed (WPM) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span>Target WPM</span>
              <strong style={{ color: 'var(--accent)' }}>{targetWpm} WPM</strong>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={targetWpm}
              onChange={handleWpmChange}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Target Accuracy (%) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span>Target Accuracy</span>
              <strong style={{ color: 'var(--success)' }}>{targetAcc}%</strong>
            </div>
            <input
              type="range"
              min="80"
              max="100"
              step="1"
              value={targetAcc}
              onChange={handleAccChange}
              style={{ width: '100%', accentColor: 'var(--success)', cursor: 'pointer' }}
            />
          </div>

          <button
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.35rem', fontSize: '0.8rem', marginTop: '0.25rem' }}
            onClick={() => setShowDropdown(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
