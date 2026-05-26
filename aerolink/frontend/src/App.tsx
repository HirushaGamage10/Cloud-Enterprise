import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import './App.css';

interface User {
  username: string;
  password?: string;
  email?: string;
}

// Helper to determine active link class
function NavLink({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? 'active-link' : ''} {...props}>
      {children}
    </Link>
  );
}

// Login Page Component
function LoginPage({ onLogin }: { onLogin: (token: string, username: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();

    // Check localStorage for registered users
    const registeredUsersJson = localStorage.getItem('registered_users');
    let usersList: User[] = [];
    if (registeredUsersJson) {
      try {
        usersList = JSON.parse(registeredUsersJson);
      } catch (err) {
        console.error("Error parsing registered users", err);
      }
    }

    // Attempt to match the user in localStorage
    const matchedUser = usersList.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.password === password
    );

    if (matchedUser) {
      onLogin('mock-jwt-token-12345', matchedUser.username);
      navigate('/');
    } else if (cleanUsername === 'passenger' && password === 'password123') {
      onLogin('mock-jwt-token-12345', 'passenger');
      navigate('/');
    } else {
      setError('Invalid username or password. (Use passenger / password123, or your registered account)');
    }
  };

  return (
    <div className="hero-section animate-fade-in" style={{ padding: '20px 0' }}>
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
          {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Register here</Link>
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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();

    if (cleanUsername.toLowerCase() === 'passenger') {
      setError('Cannot register with the reserved username "passenger".');
      return;
    }

    // Get existing users
    const registeredUsersJson = localStorage.getItem('registered_users');
    let usersList: User[] = [];
    if (registeredUsersJson) {
      try {
        usersList = JSON.parse(registeredUsersJson);
      } catch (err) {
        console.error("Error parsing registered users", err);
      }
    }

    // Check if user already exists
    const userExists = usersList.some(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (userExists) {
      setError('Username already exists. Please choose a different one.');
      return;
    }

    // Save new user
    const newUser: User = {
      username: cleanUsername,
      password: password,
      email: email
    };
    usersList.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(usersList));

    setError('');
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="hero-section animate-fade-in" style={{ padding: '20px 0' }}>
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
          {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register Account</button>
          
          {success && (
            <div className="success-message animate-fade-in" style={{ marginTop: '15px' }}>
              ✅ Registration successful! Redirecting to login...
            </div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Mock Flight List
const AVAILABLE_FLIGHTS = [
  { id: 'AL-101', code: 'AL-101', fromCode: 'LHR', fromCity: 'London', toCode: 'JFK', toCity: 'New York', duration: '8h 05m' },
  { id: 'AL-204', code: 'AL-204', fromCode: 'CDG', fromCity: 'Paris', toCode: 'HND', toCity: 'Tokyo', duration: '12h 40m' },
  { id: 'AL-309', code: 'AL-309', fromCode: 'SIN', fromCity: 'Singapore', toCode: 'SYD', toCity: 'Sydney', duration: '7h 55m' },
  { id: 'AL-512', code: 'AL-512', fromCode: 'DXB', fromCity: 'Dubai', toCode: 'LHR', toCity: 'London', duration: '7h 15m' },
];

// Booking Page Component
function BookingPage({ username }: { username: string }) {
  const [passengerName, setPassengerName] = useState(username);
  const [selectedFlightId, setSelectedFlightId] = useState(AVAILABLE_FLIGHTS[0].id);
  const [travelDate, setTravelDate] = useState('');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const selectedFlight = AVAILABLE_FLIGHTS.find(f => f.id === selectedFlightId);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call to EKS microservice
    setTimeout(() => {
      setStatus('success');
      setConfirmedBooking({
        passenger: passengerName,
        flight: selectedFlight,
        date: travelDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        cabin: cabinClass,
        seat: `${Math.floor(Math.random() * 30) + 1}${['A', 'B', 'C', 'D', 'F'][Math.floor(Math.random() * 5)]}`
      });
    }, 1200);
  };

  return (
    <>
      <div className="hero-section animate-fade-in">
        <h2 className="hero-title">Welcome back, {username}</h2>
        <p className="hero-subtitle">Book flights securely, manage schedules, and fly globally with AeroLink premium services.</p>
      </div>

      <div className="booking-card glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3>Book Your Flight</h3>
        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-group">
            <label>Passenger Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Passenger name"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Route & Flight</label>
            <select 
              className="input-field"
              value={selectedFlightId}
              onChange={(e) => setSelectedFlightId(e.target.value)}
            >
              {AVAILABLE_FLIGHTS.map((flight) => (
                <option key={flight.id} value={flight.id}>
                  {flight.code} - {flight.fromCity} ({flight.fromCode}) to {flight.toCity} ({flight.toCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Travel Date</label>
              <input 
                type="date" 
                className="input-field"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Cabin Class</label>
              <select 
                className="input-field"
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business Class">Business Class</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Securing Seat Booking...' : 'Book Flight Now'}
          </button>
        </form>

        {status === 'success' && confirmedBooking && (
          <div className="animate-fade-in">
            <div className="success-message">
              🎉 Booking confirmed successfully!
            </div>
            
            <div className="boarding-pass">
              <div className="pass-header">
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>AEROLINK BOARDING PASS</span>
                <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{confirmedBooking.cabin}</span>
              </div>
              <div className="pass-body">
                <div>
                  <div className="airport-code">{confirmedBooking.flight.fromCode}</div>
                  <div className="airport-name">{confirmedBooking.flight.fromCity}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '1.2rem' }}>✈️</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', width: '60px', textAlign: 'center', marginTop: '4px' }}>
                    {confirmedBooking.flight.duration}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="airport-code">{confirmedBooking.flight.toCode}</div>
                  <div className="airport-name">{confirmedBooking.flight.toCity}</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '1.5rem', borderTop: '1px dashed var(--border)', paddingTop: '1rem', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>PASSENGER</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{confirmedBooking.passenger}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>DATE</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{confirmedBooking.date}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>SEAT / GATE</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{confirmedBooking.seat} / G4</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Profile Page Component
function ProfilePage({ username }: { username: string }) {
  // Try to find user email from localStorage
  const registeredUsersJson = localStorage.getItem('registered_users');
  let email = 'passenger@aerolink.com';
  let tier = 'Frequent Flyer';
  let badgeStyle = 'badge-silver';
  let points = '15,250';
  let memberId = 'AL-998811';
  let memberSince = 'March 2024';

  if (registeredUsersJson) {
    try {
      const usersList: User[] = JSON.parse(registeredUsersJson);
      const userObj = usersList.find((u) => u.username.toLowerCase() === username.toLowerCase());
      if (userObj && userObj.email) {
        email = userObj.email;
        tier = 'Club Member';
        badgeStyle = 'badge-bronze';
        points = '2,500';
        memberId = `AL-${Math.floor(100000 + Math.random() * 900000)}`;
        memberSince = 'May 2026';
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Override details if logged in as the special gold user
  if (username.toLowerCase() === 'savindu') {
    tier = 'Elite Executive';
    badgeStyle = 'badge-gold';
    points = '84,300';
  }

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div className="hero-section" style={{ margin: '0 auto 2rem auto' }}>
        <h2 className="hero-title">Passenger Profile</h2>
        <p className="hero-subtitle">Review your membership tier, loyalty miles rewards, and personal details.</p>
      </div>

      <div className="profile-container">
        {/* Left Card: Avatar & Status */}
        <div className="profile-card">
          <div className="profile-avatar">
            {username.substring(0, 2).toUpperCase()}
          </div>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{username}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{email}</p>
          <span className={`profile-badge ${badgeStyle}`}>
            {tier}
          </span>
        </div>

        {/* Right Card: Account details */}
        <div className="profile-details">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
            Account Summary
          </h3>
          
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Loyalty Balance</span>
              <span className="detail-value" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 800 }}>
                {points} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Miles</span>
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Passenger ID</span>
              <span className="detail-value">{memberId}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">{memberSince}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Status Level</span>
              <span className="detail-value">{tier.split(' ')[0]}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Authorized Role</span>
              <span className="detail-value" style={{ color: '#10b981' }}>Standard Passenger</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Pre-Check Eligibility</span>
              <span className="detail-value">Eligible (TSA)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
          <Link to="/" className="logo">
            <span className="logo-icon">✈️</span>
            <h1>AeroLink</h1>
          </Link>
          <div className="nav-links">
            {token ? (
              <>
                <NavLink to="/">Book Flight</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', width: 'auto' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/profile" element={token ? <ProfilePage username={username!} /> : <Navigate to="/login" />} />
            <Route path="/" element={token ? <BookingPage username={username!} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
