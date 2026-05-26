import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';

// Login Page Component
function LoginPage({ onLogin }: { onLogin: (token: string, username: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'passenger' && password === 'password123') {
      // Mocking JWT returned from our /auth/login endpoint
      onLogin('mock-jwt-token-12345', username);
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="hero-section animate-fade-in" style={{ padding: '40px' }}>
      <div className="booking-card glass-panel" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h3>Passenger Login</h3>
        <form onSubmit={handleLogin} className="booking-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="passenger"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
            <a href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
}

// Register Page Component
function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="hero-section animate-fade-in" style={{ padding: '40px' }}>
      <div className="booking-card glass-panel" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h3>Create Passenger Account</h3>
        <form onSubmit={handleRegister} className="booking-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register Account</button>
          
          {success && (
            <div className="success-message animate-fade-in" style={{ marginTop: '15px' }}>
              ✅ Registration successful! Redirecting to login...
            </div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
            <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
}

// Booking Page Component
function BookingPage({ username }: { username: string }) {
  const [passengerName, setPassengerName] = useState(username);
  const [flightNumber, setFlightNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFlightNumber('');
    }, 1500);
  };

  return (
    <>
      <div className="hero-section animate-fade-in">
        <h2 className="hero-title">Welcome back, {username}</h2>
        <p className="hero-subtitle">Experience next-generation flight booking with real-time updates and global scalability.</p>
      </div>

      <div className="booking-card glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3>Book a Flight</h3>
        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-group">
            <label>Passenger Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="John Doe"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Flight Number</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="AL-1024"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Processing...' : 'Confirm Booking'}
          </button>
          {status === 'success' && (
            <div className="success-message animate-fade-in">
              ✅ Booking confirmed successfully!
            </div>
          )}
        </form>
      </div>
    </>
  );
}

// Main App Component
function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

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
        <nav className="navbar glass-panel">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
            <span className="logo-icon">✈️</span>
            <h1>AeroLink</h1>
          </div>
          <div className="nav-links">
            {token ? (
              <>
                <a href="#">Flights</a>
                <a href="#">Manage</a>
                <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/" element={token ? <BookingPage username={username!} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
