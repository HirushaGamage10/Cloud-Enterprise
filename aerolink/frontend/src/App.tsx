import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import './App.css';

interface User {
  username: string;
  password?: string;
  email?: string;
}

// ----------------------------------------------------------------------
// HOOKS & UTILS
// ----------------------------------------------------------------------

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function NavLink({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? 'active-link' : ''} {...props}>
      {children}
    </Link>
  );
}

// ----------------------------------------------------------------------
// AUTH PAGES (LOGIN / REGISTER WITH EYE ICON)
// ----------------------------------------------------------------------

function LoginPage({ onLogin }: { onLogin: (token: string, username: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();
    const registeredUsersJson = localStorage.getItem('registered_users');
    let usersList: User[] = [];
    if (registeredUsersJson) {
      try { usersList = JSON.parse(registeredUsersJson); } catch (err) {}
    }
    const matchedUser = usersList.find((u) => u.username.toLowerCase() === cleanUsername && u.password === password);
    
    if (matchedUser || (cleanUsername === 'passenger' && password === 'password123')) {
      onLogin('mock-jwt-token-12345', matchedUser ? matchedUser.username : 'passenger');
      navigate('/');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3>Passenger Login</h3>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>USERNAME</label>
            <input type="text" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>PASSWORD</label>
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
          <button type="submit" className="btn-primary btn-full">Sign In</button>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (cleanUsername.toLowerCase() === 'passenger') {
      setError('Cannot register with the reserved username.');
      return;
    }
    const registeredUsersJson = localStorage.getItem('registered_users');
    let usersList: User[] = [];
    if (registeredUsersJson) {
      try { usersList = JSON.parse(registeredUsersJson); } catch (err) {}
    }
    if (usersList.some((u) => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      setError('Username already exists.');
      return;
    }
    usersList.push({ username: cleanUsername, password: password, email: email });
    localStorage.setItem('registered_users', JSON.stringify(usersList));
    setError('');
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3>Create Account</h3>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>EMAIL ADDRESS</label>
            <input type="email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>USERNAME</label>
            <input type="text" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>PASSWORD</label>
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
          <button type="submit" className="btn-primary btn-full">Register Now</button>
          {success && <div style={{ marginTop: '1rem', color: '#10b981', fontWeight: 700, textAlign: 'center' }}>✅ Registration successful!</div>}
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// HOME / BOOKING PAGE WITH SCROLL ANIMATIONS
// ----------------------------------------------------------------------

function HomePage() {
  useScrollReveal();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-subtitle">READY TAKE-OFF</div>
        <h2 className="hero-title">CONVENIENT ONLINE<br/>FLIGHT BOOKING SERVICES</h2>
        <img 
          src="https://plus.unsplash.com/premium_photo-1679758629910-3331a90c5fa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="3D Airplane Floating" 
          className="floating-plane reveal" 
          style={{ borderRadius: '20px', height: '400px', objectFit: 'cover' }}
        />
      </div>

      {/* Booking Bar (Pill Shape) */}
      <div className="booking-bar-wrapper reveal">
        <form className="booking-bar" onSubmit={(e) => e.preventDefault()}>
          <div className="bb-item">
            <span className="bb-label">From</span>
            <select className="bb-input">
              <option>Tokyo, Japan</option>
              <option>London, UK</option>
              <option>New York, USA</option>
            </select>
          </div>
          <div className="bb-item">
            <span className="bb-label">To</span>
            <select className="bb-input">
              <option>Berlin, Germany</option>
              <option>Paris, France</option>
              <option>Dubai, UAE</option>
            </select>
          </div>
          <div className="bb-item">
            <span className="bb-label">Departure</span>
            <input type="date" className="bb-input" defaultValue="2026-10-11" />
          </div>
          <div className="bb-item">
            <span className="bb-label">Return</span>
            <input type="date" className="bb-input" defaultValue="2026-12-15" />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '16px', borderRadius: '50%', width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px' }}>
            🔍
          </button>
        </form>
      </div>

      {/* Section 1: Top Flight Deals */}
      <section className="content-section reveal">
        <h3 className="section-title">TOP FLIGHT DEALS</h3>
        <p className="section-subtitle">Discover top flight deals for elite travel experiences at unprecedented prices.</p>
        
        <div className="card-grid">
          <div className="deal-card">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80" alt="Luxury Travel" className="deal-img"/>
            <div className="deal-content">
              <h4>Luxury Travel and Airlines</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Comfort and exclusivity for discerning travelers.</p>
              <button className="btn-primary" style={{ marginTop: '15px', padding: '8px 20px', fontSize: '0.85rem' }}>Learn More</button>
            </div>
          </div>
          <div className="deal-card">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" alt="Hotel Bookings" className="deal-img"/>
            <div className="deal-content">
              <h4>Hotel Bookings ↗</h4>
            </div>
          </div>
          <div className="deal-card">
            <img src="https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=600&q=80" alt="Domestic" className="deal-img"/>
            <div className="deal-content">
              <h4>Book Domestic ↗</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Popular Airlines */}
      <section className="content-section reveal" style={{ backgroundColor: 'var(--bg-panel)' }}>
        <h3 className="section-title">MOST POPULAR AIRLINES</h3>
        <p className="section-subtitle">The world's leading airlines offer top-notch service.</p>
        <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', padding: '1rem 0', paddingBottom: '2rem' }}>
          <img src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=300&h=200" alt="Airline 1" style={{ borderRadius: '16px', minWidth: '300px' }} />
          <img src="https://images.unsplash.com/photo-1518983838421-496c16110f03?auto=format&fit=crop&w=300&h=200" alt="Airline 2" style={{ borderRadius: '16px', minWidth: '300px' }} />
          <img src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=300&h=200" alt="Airline 3" style={{ borderRadius: '16px', minWidth: '300px' }} />
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN APP COMPONENT
// ----------------------------------------------------------------------

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (newToken: string, user: string) => {
    setToken(newToken);
    setUsername(user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <span className="logo-icon">✈️</span>
            <h1>AeroLink</h1>
          </Link>
          <div className="nav-links">
            <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {token ? (
              <>
                <NavLink to="/">Flights</NavLink>
                <NavLink to="/">Hotel</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <button onClick={handleLogout} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/">Flights</NavLink>
                <NavLink to="/">Hotel</NavLink>
                <Link to="/login"><button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>Sign In</button></Link>
              </>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/" element={<HomePage />} />
            {/* Fallback routing for profile so it doesnt crash if they click */}
            <Route path="/profile" element={token ? <div className="inner-header"><div className="panel"><h2>Profile</h2><p>Logged in as {username}</p></div></div> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
