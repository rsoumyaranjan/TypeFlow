import React, { useState, useEffect } from 'react';
import { User, LogIn, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onAuthChange?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthChange }) => {
  const [user, setUser] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('other');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Stats for Settings
  const [userGender, setUserGender] = useState('other');
  const [userAge, setUserAge] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [targetWpmState, setTargetWpmState] = useState(localStorage.getItem('typeflow_custom_target_wpm') || '25');
  const [targetAccState, setTargetAccState] = useState(localStorage.getItem('typeflow_custom_target_acc') || '98');

  useEffect(() => {
    const savedUser = localStorage.getItem('typeflow_active_user');
    if (savedUser) {
      setUser(savedUser);
      setUserGender(localStorage.getItem('typeflow_user_gender') || 'other');
      setUserAge(localStorage.getItem('typeflow_user_age') || '');
      setUserEmail(localStorage.getItem('typeflow_user_email') || '');
    }
    setTargetWpmState(localStorage.getItem('typeflow_custom_target_wpm') || '25');
    setTargetAccState(localStorage.getItem('typeflow_custom_target_acc') || '98');
  }, [showLoginModal, showSettingsModal]);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !age.trim()) return;
    
    // Generate simple mock verification code
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(mockCode);
    alert(`[MOCK EMAIL SMTP SERVICE]\nTo: ${email}\nSubject: Verify TypeFlow Account\n\nYour verification code is: ${mockCode}`);
    setIsVerifying(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode === verificationCode) {
      localStorage.setItem('typeflow_active_user', name.trim());
      localStorage.setItem('typeflow_user_email', email.trim());
      localStorage.setItem('typeflow_user_age', age.trim());
      localStorage.setItem('typeflow_user_gender', gender);
      
      setUser(name.trim());
      setUserGender(gender);
      setUserAge(age.trim());
      setUserEmail(email.trim());

      setName('');
      setEmail('');
      setAge('');
      setIsVerifying(false);
      setShowLoginModal(false);
      if (onAuthChange) onAuthChange();
    } else {
      alert("Incorrect verification code. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('typeflow_active_user');
    localStorage.removeItem('typeflow_user_email');
    localStorage.removeItem('typeflow_user_age');
    localStorage.removeItem('typeflow_user_gender');
    setUser(null);
    setShowDropdown(false);
    if (onAuthChange) onAuthChange();
  };

  // Helper to determine gender icon emoji or styling
  const renderGenderIndicator = () => {
    if (userGender === 'male') return '👨';
    if (userGender === 'female') return '👩';
    return '👤';
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div 
            style={{ 
              width: '34px', 
              height: '34px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent)', 
              color: '#0b0f19',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.15rem',
              cursor: 'pointer',
              boxShadow: '0 0 10px var(--accent-glow)'
            }}
            onClick={() => setShowDropdown(!showDropdown)}
            title={`Account: ${user}`}
          >
            {renderGenderIndicator()}
          </div>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              padding: '0.5rem 0',
              minWidth: '150px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => { setShowProfileModal(true); setShowDropdown(false); }}
              >
                Profile Info
              </button>
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => { setShowSettingsModal(true); setShowDropdown(false); }}
              >
                Settings
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.25rem 0' }} />
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          className="btn btn-secondary" 
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }} 
          onClick={() => setShowLoginModal(true)}
        >
          <LogIn size={14} />
          <span>Login</span>
        </button>
      )}

      {showLoginModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease'
        }}>
          {!isVerifying ? (
            <form 
              onSubmit={handleCreateAccount}
              className="card flex-col" 
              style={{ 
                width: '100%', 
                maxWidth: '420px', 
                padding: '2rem', 
                gap: '1.25rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <User size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Create Account</h3>
              </div>

              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
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

              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>AGE</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter age"
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

              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>GENDER</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
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
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
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

              <div className="flex gap-3" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
                >
                  Verify Email
                </button>
              </div>
            </form>
          ) : (
            <form 
              onSubmit={handleVerify}
              className="card flex-col" 
              style={{ 
                width: '100%', 
                maxWidth: '380px', 
                padding: '2rem', 
                gap: '1.25rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Verify OTP</h3>
              </div>

              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                We sent a 6-digit confirmation code to your email. Enter it below to complete registration.
              </p>

              <div className="flex-col gap-1">
                <input
                  type="text"
                  required
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  placeholder="Enter code"
                  style={{
                    padding: '0.65rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    width: '100%',
                    textAlign: 'center',
                    letterSpacing: '0.5em'
                  }}
                />
              </div>

              <div className="flex gap-3" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsVerifying(false)}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ backgroundColor: 'var(--success)', color: '#ffffff' }}
                >
                  Submit Code
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {showProfileModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="card flex-col" style={{ width: '100%', maxWidth: '380px', padding: '2rem', gap: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Profile Info</h3>
            <div className="flex-col" style={{ gap: '0.5rem', fontSize: '0.9rem' }}>
              <div><strong>Name:</strong> {user}</div>
              <div><strong>Age:</strong> {userAge}</div>
              <div><strong>Gender:</strong> {userGender.toUpperCase()}</div>
              <div><strong>Email:</strong> {userEmail}</div>
            </div>
            <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => setShowProfileModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="card flex-col" style={{ width: '100%', maxWidth: '380px', padding: '2rem', gap: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Account Settings</h3>
            
            <div className="flex-col gap-2" style={{ margin: '0.5rem 0' }}>
              <div className="flex-col gap-1">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  TARGET SPEED (WPM): <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{targetWpmState}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={targetWpmState}
                  onChange={(e) => {
                    setTargetWpmState(e.target.value);
                    localStorage.setItem('typeflow_custom_target_wpm', e.target.value);
                    if (onAuthChange) onAuthChange();
                  }}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="flex-col gap-1" style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  TARGET ACCURACY (%): <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{targetAccState}%</span>
                </label>
                <input
                  type="range"
                  min="80"
                  max="100"
                  step="1"
                  value={targetAccState}
                  onChange={(e) => {
                    setTargetAccState(e.target.value);
                    localStorage.setItem('typeflow_custom_target_acc', e.target.value);
                    if (onAuthChange) onAuthChange();
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => setShowSettingsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
