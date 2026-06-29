import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { db } from '../services/db';

interface LoginProps {
  onAuthChange?: () => void;
}

interface UserRecord {
  username: string;
  email: string;
}

export const Login: React.FC<LoginProps> = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form States
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Sign Up Form States
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpVerifyPassword, setSignUpVerifyPassword] = useState('');
  const [signUpAge, setSignUpAge] = useState('');
  const [signUpGender, setSignUpGender] = useState('other');
  
  // Validation / Error States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Social Auth Mock Spinner
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Check for Remembered user
  useEffect(() => {
    const remembered = localStorage.getItem('typeflow_remembered_user');
    if (remembered) {
      setSignInIdentifier(remembered);
      setRememberMe(true);
    }
  }, []);

  // Helper to generate cool usernames
  const generateCoolUsername = () => {
    const prefixes = ['Type', 'Flow', 'Key', 'Wpm', 'Word', 'Finger', 'Cadence', 'Shift'];
    const suffixes = ['Champ', 'Hero', 'Wizard', 'Pro', 'Master', 'Racer', 'Runner', 'Zen'];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    setSignUpUsername(`${randomPrefix}${randomSuffix}_${randomNum}`);
    setErrorMsg('');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signInIdentifier.trim()) {
      setErrorMsg('Please enter username or email.');
      return;
    }

    // Retrieve users list
    const usersRaw = localStorage.getItem('typeflow_users_db');
    const users: UserRecord[] = usersRaw ? JSON.parse(usersRaw) : [];

    // Search user (no password requirements for mock local login profiles)
    const matchedUser = users.find(
      (u) => 
        u.username.toLowerCase() === signInIdentifier.trim().toLowerCase() ||
        u.email.toLowerCase() === signInIdentifier.trim().toLowerCase()
    );

    if (matchedUser) {
      // Login successful
      localStorage.setItem('typeflow_active_user', matchedUser.username);
      localStorage.setItem('typeflow_user_email', matchedUser.email);

      // Save default age/gender into Dexie/IndexedDB database profile
      db.userStats.get('current_user').then(stats => {
        const newStats = stats ? { ...stats, age: stats.age || '25', gender: stats.gender || 'other' } : {
          id: 'current_user',
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveTimestamp: 0,
          unlockedThemes: ['theme-dark', 'theme-light', 'theme-sepia'],
          activeTheme: 'theme-dark',
          age: '25',
          gender: 'other'
        };
        db.userStats.put(newStats);
      });

      if (rememberMe) {
        localStorage.setItem('typeflow_remembered_user', signInIdentifier.trim());
      } else {
        localStorage.removeItem('typeflow_remembered_user');
      }

      setSuccessMsg('Successfully signed in!');
      if (onAuthChange) onAuthChange();
      
      // Dispatch storage event to update header/other components
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setErrorMsg('Invalid username/email. Please try again.');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Field checks
    if (!signUpUsername.trim()) {
      setErrorMsg('Username is required.');
      return;
    }
    if (!signUpEmail.trim()) {
      setErrorMsg('Email is required.');
      return;
    }
    if (!signUpAge.trim() || isNaN(Number(signUpAge))) {
      setErrorMsg('Please enter a valid numeric age.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Unique checks
    const usersRaw = localStorage.getItem('typeflow_users_db');
    const users: UserRecord[] = usersRaw ? JSON.parse(usersRaw) : [];

    const usernameExists = users.some(
      (u) => u.username.toLowerCase() === signUpUsername.trim().toLowerCase()
    );
    if (usernameExists) {
      setErrorMsg('Username is already taken. Please choose another.');
      return;
    }

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === signUpEmail.trim().toLowerCase()
    );
    if (emailExists) {
      setErrorMsg('An account with this email already exists.');
      return;
    }

    // Save user without password, age, or gender in localStorage
    const newUser: UserRecord = {
      username: signUpUsername.trim(),
      email: signUpEmail.trim(),
    };

    users.push(newUser);
    localStorage.setItem('typeflow_users_db', JSON.stringify(users));

    // Sign them in directly
    localStorage.setItem('typeflow_active_user', newUser.username);
    localStorage.setItem('typeflow_user_email', newUser.email);

    // Save age and gender only in Dexie/IndexedDB database profile
    db.userStats.get('current_user').then(stats => {
      const newStats = stats ? { ...stats, age: signUpAge.trim(), gender: signUpGender } : {
        id: 'current_user',
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveTimestamp: 0,
        unlockedThemes: ['theme-dark', 'theme-light', 'theme-sepia'],
        activeTheme: 'theme-dark',
        age: signUpAge.trim(),
        gender: signUpGender
      };
      db.userStats.put(newStats);
    });

    setSuccessMsg('Account created successfully!');
    if (onAuthChange) onAuthChange();
    
    // Dispatch storage event
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Mock Social Login Action
  const handleSocialLogin = (platform: 'Google' | 'GitHub') => {
    setSocialLoading(platform);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      setSocialLoading(null);
      const mockUsername = `${platform}User_${Math.floor(100 + Math.random() * 900)}`;
      const mockEmail = `${mockUsername.toLowerCase()}@social-mock.com`;
      
      // Save in mock DB if needed
      const usersRaw = localStorage.getItem('typeflow_users_db');
      const users: UserRecord[] = usersRaw ? JSON.parse(usersRaw) : [];
      
      if (!users.some(u => u.username === mockUsername)) {
        users.push({
          username: mockUsername,
          email: mockEmail,
        });
        localStorage.setItem('typeflow_users_db', JSON.stringify(users));
      }

      // Log in
      localStorage.setItem('typeflow_active_user', mockUsername);
      localStorage.setItem('typeflow_user_email', mockEmail);

      // Save age and gender only in Dexie/IndexedDB database profile
      db.userStats.get('current_user').then(stats => {
        const newStats = stats ? { ...stats, age: '25', gender: 'other' } : {
          id: 'current_user',
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveTimestamp: 0,
          unlockedThemes: ['theme-dark', 'theme-light', 'theme-sepia'],
          activeTheme: 'theme-dark',
          age: '25',
          gender: 'other'
        };
        db.userStats.put(newStats);
      });

      setSuccessMsg(`Logged in via ${platform}!`);
      if (onAuthChange) onAuthChange();

      // Dispatch storage event
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        navigate('/');
      }, 800);
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
      alert(`[MOCK PASSWORD RECOVERY]\nA reset link has been dispatched to: ${forgotEmail}`);
    }, 1200);
  };

  return (
    <div className="flex-col" style={{ maxWidth: '440px', margin: '2rem auto', width: '100%', gap: '1.5rem' }}>
      
      {/* Header tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', width: '100%' }}>
        <button
          onClick={() => { setActiveTab('signin'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '1rem',
            background: 'none',
            border: 'none',
            color: activeTab === 'signin' ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '1.05rem',
            borderBottom: activeTab === 'signin' ? '2px solid var(--accent)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '1rem',
            background: 'none',
            border: 'none',
            color: activeTab === 'signup' ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '1.05rem',
            borderBottom: activeTab === 'signup' ? '2px solid var(--accent)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Alert Messaging */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          border: '1px solid rgba(244, 63, 94, 0.2)'
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: 'var(--success)',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <ShieldCheck size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Forms Content */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '-2.5rem' }}>
        {socialLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', gap: '1rem' }}>
            <div className="social-spinner" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Connecting to {socialLoading}...</span>
          </div>
        ) : (
          <>
            {/* Social buttons on Top - Compact Inline */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.25rem 0' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Continue with:</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleSocialLogin('Google')}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>
                  <span>Google</span>
                </button>
                <button
                  onClick={() => handleSocialLogin('GitHub')}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>

            {/* OR divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '0.15rem 0', gap: '0.5rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Or credentials</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            </div>

            {activeTab === 'signin' ? (
              /* SIGN IN FORM */
              <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex-col gap-1">
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>USERNAME OR EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      required
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      placeholder="Enter username or email"
                      style={{
                        padding: '0.55rem 0.55rem 0.55rem 2rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div className="flex-col gap-1">
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        padding: '0.55rem 0.55rem 0.55rem 2rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-dim)' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', backgroundColor: 'var(--accent)', color: 'var(--bg)' }}>
                  Sign In
                </button>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div className="flex-col gap-0.5">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>USERNAME</label>
                    <button
                      type="button"
                      onClick={generateCoolUsername}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontWeight: 500
                      }}
                    >
                      <Sparkles size={10} /> Auto-Generate
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      required
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      placeholder="Choose username"
                      style={{
                        padding: '0.5rem 0.5rem 0.5rem 2rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div className="flex-col gap-0.5">
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={{
                        padding: '0.5rem 0.5rem 0.5rem 2rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="flex-col gap-0.5">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>AGE</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="120"
                      value={signUpAge}
                      onChange={(e) => setSignUpAge(e.target.value)}
                      placeholder="Age"
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </div>

                  <div className="flex-col gap-0.5">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>GENDER</label>
                    <select
                      value={signUpGender}
                      onChange={(e) => setSignUpGender(e.target.value)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex-col gap-0.5">
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      style={{
                        padding: '0.5rem 0.5rem 0.5rem 2rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div className="flex-col gap-0.5">
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>VERIFY PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      value={signUpVerifyPassword}
                      onChange={(e) => setSignUpVerifyPassword(e.target.value)}
                      placeholder="Re-enter password"
                      style={{
                        padding: '0.5rem 0.5rem 0.5rem 2rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.35rem', padding: '0.5rem', backgroundColor: 'var(--accent)', color: 'var(--bg)', fontSize: '0.9rem' }}>
                  Register
                </button>
              </form>
            )}
          </>
        )}
      </div>

      {/* Forgot Password Recovery Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <form onSubmit={handleForgotSubmit} className="card" style={{ width: '100%', maxWidth: '380px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <KeyRound size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Reset Password</h3>
            </div>

            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
              Enter your registered email address and we'll send password recovery instructions.
            </p>

            <div className="flex-col gap-1">
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="registered-email@domain.com"
                style={{
                  padding: '0.65rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForgotModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
                disabled={forgotSent}
              >
                {forgotSent ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
