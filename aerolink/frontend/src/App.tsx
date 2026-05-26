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

// ----------------------------------------------------------------------
// LOGIN & REGISTER PAGES
// ----------------------------------------------------------------------

function LoginPage({ onLogin }: { onLogin: (token: string, username: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
            <input type="text" className="input-field" placeholder="passenger" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="input-field" placeholder="password123" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
    const registeredUsersJson = localStorage.getItem('registered_users');
    let usersList: User[] = [];
    if (registeredUsersJson) {
      try { usersList = JSON.parse(registeredUsersJson); } catch (err) {}
    }
    if (usersList.some((u) => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      setError('Username already exists. Please choose a different one.');
      return;
    }
    usersList.push({ username: cleanUsername, password: password, email: email });
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
            <input type="email" className="input-field" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="input-field" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register Account</button>
          {success && <div className="success-message animate-fade-in" style={{ marginTop: '15px' }}>✅ Registration successful! Redirecting to login...</div>}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const AVAILABLE_FLIGHTS = [
  { id: 'AL-101', code: 'AL-101', fromCode: 'LHR', fromCity: 'London', toCode: 'JFK', toCity: 'New York', duration: '8h 05m', status: 'On Time', gate: 'G4', time: '10:30 AM' },
  { id: 'AL-204', code: 'AL-204', fromCode: 'CDG', fromCity: 'Paris', toCode: 'HND', toCity: 'Tokyo', duration: '12h 40m', status: 'Boarding', gate: 'F12', time: '12:15 PM' },
  { id: 'AL-309', code: 'AL-309', fromCode: 'SIN', fromCity: 'Singapore', toCode: 'SYD', toCity: 'Sydney', duration: '7h 55m', status: 'Delayed', gate: 'T2', time: '14:45 PM' },
  { id: 'AL-512', code: 'AL-512', fromCode: 'DXB', fromCity: 'Dubai', toCode: 'LHR', toCity: 'London', duration: '7h 15m', status: 'In Air', gate: 'A1', time: '08:00 AM' },
  { id: 'AL-882', code: 'AL-882', fromCode: 'JFK', fromCity: 'New York', toCode: 'LAX', toCity: 'Los Angeles', duration: '6h 10m', status: 'Scheduled', gate: 'B7', time: '18:20 PM' }
];

// ----------------------------------------------------------------------
// BOOKING PAGE
// ----------------------------------------------------------------------

function BookingPage({ username }: { username: string }) {
  const [passengerName, setPassengerName] = useState(username);
  const [selectedFlightId, setSelectedFlightId] = useState(AVAILABLE_FLIGHTS[0].id);
  const [travelDate, setTravelDate] = useState('');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const selectedFlight = AVAILABLE_FLIGHTS.find(f => f.id === selectedFlightId);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      const mockBooking = {
        passenger: passengerName,
        flight: selectedFlight,
        date: travelDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        cabin: cabinClass,
        seat: `${Math.floor(Math.random() * 30) + 1}${['A', 'B', 'C', 'D', 'F'][Math.floor(Math.random() * 5)]}`,
        pnr: Math.random().toString(36).substring(2, 8).toUpperCase()
      };
      setConfirmedBooking(mockBooking);
      
      // Save booking to localStorage so we can manage it later
      const existingBookings = JSON.parse(localStorage.getItem(`bookings_${username}`) || '[]');
      existingBookings.push(mockBooking);
      localStorage.setItem(`bookings_${username}`, JSON.stringify(existingBookings));
    }, 1200);
  };

  return (
    <>
      <div className="hero-section animate-fade-in">
        <h2 className="hero-title">Where to next, {username}?</h2>
        <p className="hero-subtitle">Book flights securely and manage your journey globally with AeroLink premium services.</p>
      </div>

      <div className="booking-card glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3>Book Your Flight</h3>
        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-group">
            <label>Passenger Name</label>
            <input type="text" className="input-field" placeholder="Passenger name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Select Route & Flight</label>
            <select className="input-field" value={selectedFlightId} onChange={(e) => setSelectedFlightId(e.target.value)}>
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
              <input type="date" className="input-field" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Cabin Class</label>
              <select className="input-field" value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}>
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
            <div className="success-message">🎉 Booking confirmed successfully!</div>
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
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{confirmedBooking.seat} / {confirmedBooking.flight.gate}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PNR RECORD LOCATOR: </span>
                <span style={{ fontWeight: 800 }}>{confirmedBooking.pnr}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// FLIGHT STATUS PAGE (Flight Service)
// ----------------------------------------------------------------------

function FlightStatusPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return '#10b981';
      case 'Boarding': return '#3b82f6';
      case 'Delayed': return '#ef4444';
      case 'In Air': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div className="hero-section" style={{ margin: '0 auto 2rem auto' }}>
        <h2 className="hero-title">Flight Status Tracker</h2>
        <p className="hero-subtitle">Real-time arrival and departure information.</p>
      </div>
      
      <div className="profile-details animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          <input type="text" className="input-field" placeholder="Search flight (e.g. AL-204) or city" />
          <button className="btn-primary" style={{ width: 'auto' }}>Search</button>
        </div>

        <div className="flight-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {AVAILABLE_FLIGHTS.map(flight => (
            <div key={flight.id} className="flight-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface-hover)' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', width: '80px' }}>{flight.code}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{flight.fromCity} ➔ {flight.toCity}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Scheduled: {flight.time} | Gate: {flight.gate}</div>
                </div>
              </div>
              <div style={{ padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, backgroundColor: `${getStatusColor(flight.status)}20`, color: getStatusColor(flight.status), border: `1px solid ${getStatusColor(flight.status)}40` }}>
                {flight.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// BAGGAGE TRACKING PAGE (Baggage Service)
// ----------------------------------------------------------------------

function BaggageTrackingPage({ username }: { username: string }) {
  const [baggageId, setBaggageId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [bagStatus, setBagStatus] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baggageId) return;
    setIsSearching(true);
    setTimeout(() => {
      setBagStatus({
        id: baggageId.toUpperCase(),
        passenger: username,
        flight: 'AL-101',
        weight: '23.4 kg',
        currentStage: 2, // 0: Check-in, 1: Security, 2: Loaded, 3: Claim
        lastUpdate: new Date().toLocaleTimeString(),
        location: 'London Heathrow (LHR) - Terminal 5 Baggage Sorting'
      });
      setIsSearching(false);
    }, 1000);
  };

  const stages = ['Checked In', 'Security Cleared', 'Loaded on Aircraft', 'Ready at Carousel'];

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div className="hero-section" style={{ margin: '0 auto 2rem auto' }}>
        <h2 className="hero-title">Track Your Baggage</h2>
        <p className="hero-subtitle">Locate your checked luggage in real-time across the globe.</p>
      </div>

      <div className="profile-details animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Baggage Tag Number</label>
            <input type="text" className="input-field" placeholder="e.g. BAG-889922" value={baggageId} onChange={(e) => setBaggageId(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={isSearching}>
            {isSearching ? 'Locating...' : 'Track Luggage'}
          </button>
        </form>

        {bagStatus && (
          <div className="animate-fade-in" style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Tag: {bagStatus.id}</h4>
            <div className="details-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
              <div className="detail-item"><span className="detail-label">Passenger</span><span className="detail-value">{bagStatus.passenger}</span></div>
              <div className="detail-item"><span className="detail-label">Flight</span><span className="detail-value">{bagStatus.flight}</span></div>
              <div className="detail-item"><span className="detail-label">Weight</span><span className="detail-value">{bagStatus.weight}</span></div>
              <div className="detail-item"><span className="detail-label">Last Location</span><span className="detail-value" style={{ fontSize: '0.9rem' }}>{bagStatus.location}</span></div>
            </div>

            <div style={{ position: 'relative', marginTop: '1rem' }}>
              <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', height: '4px', background: 'var(--border)', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: '15px', left: '15px', width: `${(bagStatus.currentStage / 3) * 100}%`, height: '4px', background: 'var(--primary)', zIndex: 1, transition: 'width 1s ease' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                {stages.map((stage, index) => {
                  const isActive = index <= bagStatus.currentStage;
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: isActive ? 'var(--primary)' : 'var(--surface)', border: `3px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`, color: isActive ? 'white' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', boxShadow: isActive ? '0 0 10px rgba(14,165,233,0.4)' : 'none' }}>
                        {isActive && '✓'}
                      </div>
                      <span style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '8px', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Last updated: {bagStatus.lastUpdate}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// PROFILE PAGE
// ----------------------------------------------------------------------

function ProfilePage({ username }: { username: string }) {
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
    } catch (err) {}
  }

  if (username.toLowerCase() === 'savindu') {
    tier = 'Elite Executive';
    badgeStyle = 'badge-gold';
    points = '84,300';
  }

  // Load booked flights from local storage
  const bookingsJson = localStorage.getItem(`bookings_${username}`);
  let myBookings = [];
  if (bookingsJson) {
    try { myBookings = JSON.parse(bookingsJson); } catch (e) {}
  }

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div className="hero-section" style={{ margin: '0 auto 2rem auto' }}>
        <h2 className="hero-title">Passenger Profile</h2>
        <p className="hero-subtitle">Review your membership tier, loyalty miles rewards, and personal details.</p>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">{username.substring(0, 2).toUpperCase()}</div>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{username}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{email}</p>
          <span className={`profile-badge ${badgeStyle}`}>{tier}</span>
        </div>

        <div className="profile-details">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
            Account Summary
          </h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Loyalty Balance</span>
              <span className="detail-value" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 800 }}>{points} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Miles</span></span>
            </div>
            <div className="detail-item"><span className="detail-label">Passenger ID</span><span className="detail-value">{memberId}</span></div>
            <div className="detail-item"><span className="detail-label">Member Since</span><span className="detail-value">{memberSince}</span></div>
            <div className="detail-item"><span className="detail-label">Status Level</span><span className="detail-value">{tier.split(' ')[0]}</span></div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', marginTop: '3rem', color: 'var(--text-main)' }}>
            My Upcoming Trips
          </h3>
          
          {myBookings.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-hover)', borderRadius: 'var(--radius)' }}>
              <span style={{ fontSize: '2rem' }}>🏝️</span>
              <p style={{ marginTop: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>No upcoming trips booked yet.</p>
              <Link to="/"><button className="btn-primary" style={{ marginTop: '15px', width: 'auto', padding: '8px 20px' }}>Book a Flight</button></Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myBookings.map((b: any, index: number) => (
                <div key={index} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{b.flight.fromCity} ➔ {b.flight.toCity}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{b.date} • {b.flight.code} • PNR: {b.pnr}</div>
                  </div>
                  <Link to="/baggage"><button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}>Track Bags</button></Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN APP COMPONENT
// ----------------------------------------------------------------------

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
                <NavLink to="/flights">Flight Status</NavLink>
                <NavLink to="/baggage">Track Bags</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', width: 'auto', marginLeft: '10px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/flights">Flight Status</NavLink>
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
            <Route path="/flights" element={<FlightStatusPage />} />
            <Route path="/baggage" element={token ? <BaggageTrackingPage username={username!} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={token ? <ProfilePage username={username!} /> : <Navigate to="/login" />} />
            <Route path="/" element={token ? <BookingPage username={username!} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
