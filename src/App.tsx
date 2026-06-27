import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Keyboard, Volume2, VolumeX, Moon, Sun, Palette } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TypingTest } from './components/TypingTest';
import { Results } from './components/Results';
import { Practice } from './components/Practice';
import { ProgressView } from './components/ProgressView';
import { About } from './components/About';
import { Learn } from './components/Learn';
import './App.css';
import type { TypingTestSession } from './services/db';

type Page = 'dashboard' | 'test' | 'results' | 'practice' | 'progress' | 'about' | 'learn';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState<'dark' | 'light' | 'sepia'>('dark');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [lastSession, setLastSession] = useState<Omit<TypingTestSession, 'id'> | null>(null);
  const [practiceWords, setPracticeWords] = useState<string[]>([]);

  // Map react-router paths to highlight header nav tabs
  const getActiveTab = (): Page => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    if (path === '/test' || path === '/results') return 'test';
    if (path === '/practice') return 'practice';
    if (path === '/learn') return 'learn';
    if (path === '/progress') return 'progress';
    if (path === '/about') return 'about';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  // Backward-compatible navigation handler for child components
  const handleNavigate = (page: Page) => {
    switch (page) {
      case 'dashboard': navigate('/'); break;
      case 'test': navigate('/test'); break;
      case 'results': navigate('/results'); break;
      case 'practice': navigate('/practice'); break;
      case 'progress': navigate('/progress'); break;
      case 'about': navigate('/about'); break;
      case 'learn': navigate('/learn'); break;
      default: navigate('/');
    }
  };

  // Global Keyboard Shortcut Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + Alt + Key
      if (e.ctrlKey && e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 't') {
          e.preventDefault();
          navigate('/test');
        } else if (key === 'd') {
          e.preventDefault();
          navigate('/');
        } else if (key === 'p') {
          e.preventDefault();
          navigate('/progress');
        } else if (key === 'l') {
          e.preventDefault();
          navigate('/learn');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  // Sync theme class to root body (for styling extensions)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.style.setProperty('--bg', '#f8fafc');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--border', '#e2e8f0');
      root.style.setProperty('--text', '#0f172a');
      root.style.setProperty('--text-dim', '#475569');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--bg-hover', '#f1f5f9');
    } else if (theme === 'sepia') {
      root.classList.add('theme-sepia');
      root.style.setProperty('--bg', '#f4ecd8');
      root.style.setProperty('--bg-card', '#fdf6e3');
      root.style.setProperty('--border', '#e4d3b2');
      root.style.setProperty('--text', '#433422');
      root.style.setProperty('--text-dim', '#5f4b32');
      root.style.setProperty('--text-muted', '#8c765c');
      root.style.setProperty('--bg-hover', '#eae0c8');
    } else {
      root.classList.add('theme-dark');
      root.style.setProperty('--bg', '#0b0f19');
      root.style.setProperty('--bg-card', '#151b2d');
      root.style.setProperty('--border', '#1e293b');
      root.style.setProperty('--text', '#f8fafc');
      root.style.setProperty('--text-dim', '#94a3b8');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--bg-hover', '#1e2640');
    }
  }, [theme]);

  // Dynamically update document title and description for SEO based on active route
  useEffect(() => {
    const path = location.pathname;
    let title = "TypeFlow — Calm, Local-First Typing";
    let description = "TypeFlow is a calm, local-first typing website that analyzes your performance, explains your results in plain language, and recommends targeted practice drills.";

    if (path === '/test') {
      title = "Typing Test — Measure WPM & Accuracy | TypeFlow";
      description = "Take a calm 15, 30, or 60-second typing speed test. Monitor your accuracy and errors, and get detailed recommendations.";
    } else if (path === '/results') {
      title = "Test Results — Performance Metrics | TypeFlow";
      description = "Analyze your typing test performance. View your speed (WPM), accuracy, and target specific weak keys.";
    } else if (path === '/practice') {
      title = "Practice Drills — Targeted Muscle Memory | TypeFlow";
      description = "Build typing speed and accuracy by practicing targeted drills on words you struggled with during typing tests.";
    } else if (path === '/learn') {
      title = "Learn Touch Typing — Home Row Finger Placements | TypeFlow";
      description = "Master touch-typing basics. Learn proper finger placement with home-row exercises and interactive keyboard guides.";
    } else if (path === '/progress') {
      title = "Your Typing Progress — Stats & Analytics | TypeFlow";
      description = "Track your typing test history, personal speed records, and view heatmaps of your keyboard accuracy.";
    } else if (path === '/about') {
      title = "About TypeFlow — Privacy & Local-First Typing";
      description = "Learn about TypeFlow's local-first architecture. We do not collect cookies or track personal data.";
    }

    document.title = title;
    
    // Update meta description tag dynamically for SEO indexers
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [location.pathname]);

  const handleStartPractice = (words: string[]) => {
    setPracticeWords(words);
    navigate('/practice');
  };

  return (
    <>
      {/* Navigation Header */}
      <header className="app-header">
        <button 
          className="logo-container" 
          onClick={() => navigate('/')}
          aria-label="Navigate to dashboard"
        >
          <div className="logo-icon">
            <Keyboard size={28} />
          </div>
          <span className="logo-text">TypeFlow</span>
        </button>

        <nav className="app-nav">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'test' ? 'active' : ''}`}
            onClick={() => navigate('/test')}
          >
            Test
          </button>
          <button 
            className={`nav-tab ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => navigate('/practice')}
          >
            Practice
          </button>
          <button 
            className={`nav-tab ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => navigate('/learn')}
          >
            Learn
          </button>
          <button 
            className={`nav-tab ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => navigate('/progress')}
          >
            Progress
          </button>
          <button 
            className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => navigate('/about')}
          >
            About
          </button>
        </nav>

        <div className="header-settings">
          {/* Sound Toggle */}
          <button 
            className="icon-btn" 
            onClick={() => setSoundOn(!soundOn)}
            title={soundOn ? "Mute sounds" : "Enable sounds"}
            aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Theme Toggle */}
          <button 
            className="icon-btn" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'sepia' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : theme === 'light' ? 'Sepia' : 'Dark'} theme`}
            aria-label="Toggle theme color"
          >
            {theme === 'dark' ? <Sun size={18} /> : theme === 'light' ? <Palette size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main View Container */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <Dashboard 
              onNavigate={handleNavigate} 
              onStartPractice={handleStartPractice} 
            />
          } />
          <Route path="/test" element={
            <TypingTest 
              onNavigate={handleNavigate} 
              onTestComplete={(session) => {
                setLastSession(session);
                navigate('/results');
              }} 
            />
          } />
          <Route path="/results" element={
            <Results 
              onNavigate={handleNavigate} 
              lastSessionData={lastSession} 
              onStartPractice={handleStartPractice} 
            />
          } />
          <Route path="/practice" element={
            <Practice 
              onNavigate={handleNavigate} 
              practiceWords={practiceWords} 
            />
          } />
          <Route path="/learn" element={
            <Learn 
              onNavigate={handleNavigate} 
            />
          } />
          <Route path="/progress" element={<ProgressView />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={
            <Dashboard 
              onNavigate={handleNavigate} 
              onStartPractice={handleStartPractice} 
            />
          } />
        </Routes>
      </main>

      {/* Persistent Footer */}
      <footer className="app-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span>&copy; {new Date().getFullYear()} TypeFlow. Local-first, open-source.</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Tip: Press <span className="shortcut-hint">Ctrl + Alt + t</span> for test, <span className="shortcut-hint">Ctrl + Alt + d</span> for dashboard, <span className="shortcut-hint">Ctrl + Alt + p</span> for progress.
          </span>
        </div>
      </footer>
    </>
  );
}

export default App;
