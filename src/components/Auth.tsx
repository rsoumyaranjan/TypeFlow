import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { db } from '../services/db';

interface AuthProps {
  onAuthChange?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile data
  const [userGender, setUserGender] = useState('other');
  const [userAge, setUserAge] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const syncUserState = () => {
    const savedUser = localStorage.getItem('typeflow_active_user');
    if (savedUser) {
      setUser(savedUser);
      setUserEmail(localStorage.getItem('typeflow_user_email') || '');
      db.userStats.get('current_user').then(stats => {
        if (stats) {
          setUserGender(stats.gender || 'other');
          setUserAge(stats.age || '');
        } else {
          setUserGender('other');
          setUserAge('');
        }
      }).catch(() => {
        setUserGender('other');
        setUserAge('');
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUserState();

    const handleStorage = () => {
      syncUserState();
    };

    const handleDocumentClick = () => {
      setShowDropdown(false);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('click', handleDocumentClick);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('typeflow_active_user');
    localStorage.removeItem('typeflow_user_email');
    setUser(null);
    setShowDropdown(false);
    
    if (onAuthChange) onAuthChange();
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };



  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            title={`Account: ${user}`}
            aria-label="Toggle user options"
          >
            <User size={18} />
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '0px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              padding: '0.5rem 0',
              minWidth: '160px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={(e) => { e.stopPropagation(); setShowProfileModal(true); setShowDropdown(false); }}
              >
                Profile Info
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.25rem 0' }} />
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Normal minimal user icon before logging in */
        <button 
          className="icon-btn" 
          onClick={(e) => {
            e.stopPropagation();
            navigate('/login');
          }}
          title="Login / Register"
          aria-label="Login page"
        >
          <User size={18} />
        </button>
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
          zIndex: 9999
        }}>
          <div className="card flex-col" style={{ width: '100%', maxWidth: '380px', padding: '2rem', gap: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Profile Info</h3>
            <div className="flex-col" style={{ gap: '0.5rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              <div><strong>Name:</strong> {user}</div>
              <div><strong>Age:</strong> {userAge}</div>
              <div><strong>Gender:</strong> {userGender.toUpperCase()}</div>
              <div><strong>Email:</strong> {userEmail}</div>
            </div>
            <button className="btn btn-secondary" style={{ marginTop: '0.75rem', width: '100%' }} onClick={() => setShowProfileModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
