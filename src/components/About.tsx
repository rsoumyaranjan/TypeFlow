import React from 'react';
import { Info, Shield, HelpCircle, HardDrive } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="flex-col gap-6">
      {/* Page Header */}
      <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <Info size={24} style={{ color: 'var(--accent)' }} />
        <h2>About &amp; Privacy</h2>
      </div>

      <div className="grid grid-cols-2">
        {/* WPM and Accuracy formulas explanation */}
        <div className="card">
          <h3 className="card-title">
            <HelpCircle size={20} className="logo-icon" style={{ color: 'var(--accent)' }} />
            How metrics are calculated
          </h3>
          <p className="card-desc">We follow standard typing formulas to evaluate speed and accuracy:</p>
          
          <div className="flex-col gap-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--text)' }}>Words Per Minute (WPM)</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Calculated by taking the total number of characters typed correctly divided by 5 (standard word length), and then dividing by the test duration in minutes.
              </p>
              <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--bg)' }}>
                WPM = (Correct Characters / 5) / (Time in seconds / 60)
              </code>
            </div>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--text)' }}>Raw WPM</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Measures raw typing speed regardless of mistakes. Includes all typed characters (correct and incorrect) divided by 5.
              </p>
              <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--bg)' }}>
                Raw WPM = (Total Keystrokes / 5) / (Time in seconds / 60)
              </code>
            </div>

            <div>
              <strong style={{ color: 'var(--text)' }}>Accuracy</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Percentage of correct keystrokes relative to total input keystrokes.
              </p>
              <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--bg)' }}>
                Accuracy = (Correct Characters / Total Keystrokes) * 100
              </code>
            </div>
          </div>
        </div>

        {/* Privacy details */}
        <div className="card flex-col">
          <h3 className="card-title">
            <Shield size={20} className="logo-icon" style={{ color: 'var(--success)' }} />
            Our Privacy Promise
          </h3>
          <p className="card-desc">TypeFlow is built around a local-first engineering philosophy:</p>
          
          <div className="flex-col gap-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
              <HardDrive size={18} style={{ color: 'var(--accent)', marginTop: '0.25rem', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text)' }}>100% Client-Side Storage</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                  All history log objects and settings are saved inside your browser's IndexedDB (via Dexie.js) and LocalStorage. Your keyboard taps never leave this computer.
                </p>
              </div>
            </div>

            <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
              <Shield size={18} style={{ color: 'var(--success)', marginTop: '0.25rem', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text)' }}>Zero Accounts &amp; Zero Tracking</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                  No logins, no password manager syncs, and no tracking cookies. You are completely anonymous.
                </p>
              </div>
            </div>

            <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
              <Info size={18} style={{ color: 'var(--warning)', marginTop: '0.25rem', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text)' }}>Data Portability</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                  You can backup all session details by exporting a local JSON format dump, or wipe your entire browser storage cleanly at any point in the Progress tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
