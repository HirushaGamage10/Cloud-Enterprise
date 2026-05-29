import { useState, useEffect } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
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
    const adminUsersJson = localStorage.getItem('admin_users');
    let adminUsersList: User[] = [{ username: 'admin', password: 'admin123' }];
    if (adminUsersJson) {
      try { adminUsersList = JSON.parse(adminUsersJson); } catch (err) {}
    }
    const matchedAdmin = adminUsersList.find((u) => u.username.toLowerCase() === cleanUsername && u.password === password);

    if (matchedAdmin) {
      onLogin('mock-jwt-admin', matchedAdmin.username);
      navigate('/admin');
    } else if (matchedUser) {
      onLogin('mock-jwt-token-12345', matchedUser.username);
      navigate('/');
    } else if (cleanUsername === 'passenger' && password === 'password123') {
      onLogin('mock-jwt-token-12345', 'passenger');
      navigate('/');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-up">
        <h3>Passenger Login</h3>
        <form onSubmit={handleLogin}>
          <input type="text" className="input-flat" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          
          <div className="pwd-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-flat" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="button" className="eye-icon-btn" onClick={() => setShowPassword(!showPassword)} title="Toggle Password Visibility">
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              )}
            </button>
          </div>

          {error && <div style={{ color: '#ef4444', margin: '10px 0', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
          <button type="submit" className="btn-book btn-auth">Login</button>
          <div style={{ marginTop: '20px' }}>
            <span style={{ color: 'var(--text-main)' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-up">
        <h3>Create Account</h3>
        <form onSubmit={handleRegister}>
          <input type="email" className="input-flat" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" className="input-flat" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          
          <div className="pwd-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-flat" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="button" className="eye-icon-btn" onClick={() => setShowPassword(!showPassword)} title="Toggle Password Visibility">
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              )}
            </button>
          </div>

          {error && <div style={{ color: '#ef4444', margin: '10px 0', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
          <button type="submit" className="btn-book btn-auth">Register Now</button>
          {success && <div style={{ marginTop: '15px', color: '#10b981', fontWeight: 600 }}>✅ Registration successful!</div>}
          <div style={{ marginTop: '20px' }}>
            <span style={{ color: 'var(--text-main)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const INITIAL_FLIGHTS = [
  { id: 'AL-101', code: 'AL-101', fromCode: 'LHR', fromCity: 'London', toCode: 'JFK', toCity: 'New York', duration: '8h 05m', status: 'On Time', gate: 'G4', time: '10:30 AM', seats: 150 },
  { id: 'AL-204', code: 'AL-204', fromCode: 'CDG', fromCity: 'Paris', toCode: 'HND', toCity: 'Tokyo', duration: '12h 40m', status: 'Boarding', gate: 'F12', time: '12:15 PM', seats: 45 },
  { id: 'AL-309', code: 'AL-309', fromCode: 'SIN', fromCity: 'Singapore', toCode: 'SYD', toCity: 'Sydney', duration: '7h 55m', status: 'Delayed', gate: 'T2', time: '14:45 PM', seats: 8 },
  { id: 'AL-512', code: 'AL-512', fromCode: 'DXB', fromCity: 'Dubai', toCode: 'LHR', toCity: 'London', duration: '7h 15m', status: 'In Air', gate: 'A1', time: '08:00 AM', seats: 210 }
];

const getFlightsDatabase = () => {
  const db = localStorage.getItem('database_flights');
  if (db) return JSON.parse(db);
  localStorage.setItem('database_flights', JSON.stringify(INITIAL_FLIGHTS));
  return INITIAL_FLIGHTS;
};

const DESTINATIONS = [
  { title: "Venice, Italy", rating: 4.8, img: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { title: "Maldives", rating: 4.9, img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { title: "Tokyo, Japan", rating: 4.7, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

// ----------------------------------------------------------------------
// HOME / BOOKING PAGE
// ----------------------------------------------------------------------

const API_BASE = 'https://h9arp53ktb.execute-api.eu-west-1.amazonaws.com';

function BookingPage({ username }: { username: string }) {
  const [flights, setFlights] = useState<any[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [cabinClass, setCabinClass] = useState('Economy');
  
  // Status states for third-party integrations
  const [status, setStatus] = useState<'idle' | 'payment' | 'immigration' | 'success' | 'error'>('idle');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    // Attempt to fetch live from API, fallback to localStorage
    const fetchFlights = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/flights`);
        if (!response.ok) throw new Error('API not available');
        const data = await response.json();
        
        // Map backend schema to frontend schema
        const mappedData = data.map((f: any) => ({
          id: f.flight_number,
          code: f.flight_number,
          fromCode: f.origin,
          fromCity: f.origin === 'LHR' ? 'London' : f.origin === 'CDG' ? 'Paris' : f.origin,
          toCode: f.destination,
          toCity: f.destination === 'JFK' ? 'New York' : f.destination === 'HND' ? 'Tokyo' : f.destination,
          duration: '8h 00m',
          status: 'On Time',
          gate: 'TBD',
          time: '10:00 AM',
          seats: f.available_seats,
          price: f.price
        }));
        
        setFlights(mappedData);
        if (mappedData.length > 0) setSelectedFlightId(mappedData[0].id);
      } catch (err) {
        console.warn('Falling back to local database for flights');
        const dbFlights = getFlightsDatabase();
        setFlights(dbFlights);
        if (dbFlights.length > 0) setSelectedFlightId(dbFlights[0].id);
      }
    };
    fetchFlights();
  }, []);

  const selectedFlight = flights.find(f => f.id === selectedFlightId);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight) return;
    
    // Simulate Third-Party Payment Gateway Integration
    setStatus('payment');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate Third-Party Immigration Authority Integration
    setStatus('immigration');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Proceed with actual booking (Try API, fallback to local)
    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const mockBooking = {
      passenger: username,
      flight: selectedFlight,
      date: travelDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      cabin: cabinClass,
      seat: `${Math.floor(Math.random() * 30) + 1}${['A', 'B', 'C', 'D', 'F'][Math.floor(Math.random() * 5)]}`,
      pnr: pnr,
      baggageId: `BAG-${pnr}`
    };

    try {
      const response = await fetch(`${API_BASE}/api/v1/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockBooking)
      });
      if (!response.ok) throw new Error('API Booking failed');
    } catch (err) {
      console.warn('API booking failed, using local database fallback message', err);
    }

    const existingBookings = JSON.parse(localStorage.getItem(`bookings_${username}`) || '[]');
    existingBookings.push(mockBooking);
    localStorage.setItem(`bookings_${username}`, JSON.stringify(existingBookings));
    
    const updatedFlights = flights.map(f => {
      if (f.id === selectedFlight.id) {
        return { ...f, seats: f.seats > 0 ? f.seats - 1 : 0 };
      }
      return f;
    });
    localStorage.setItem('database_flights', JSON.stringify(updatedFlights));
    setFlights(updatedFlights);

    setConfirmedBooking(mockBooking);
    setStatus('success');
  };

  return (
    <>
      <div className="hero-section animate-fade-up">
        <h2 className="hero-title">WHERE DO<br/>YOU WANT TO<br/>EXPLORE</h2>
        <p className="hero-subtitle">Discover the world with AeroLink. Unmatched comfort, luxury travel, and destinations that inspire.</p>
      </div>

      <div className="booking-bar-container animate-fade-up delay-1">
        <form onSubmit={handleBooking} className="glass-panel booking-bar">
          <div className="form-group-horiz">
            <label>Route</label>
            <select className="input-flat" value={selectedFlightId} onChange={(e) => setSelectedFlightId(e.target.value)}>
              {flights.map((flight) => (
                <option key={flight.id} value={flight.id}>
                  {flight.fromCity} ➔ {flight.toCity} ({flight.seats} seats left)
                </option>
              ))}
            </select>
          </div>
          <div className="form-group-horiz">
            <label>Travel Date</label>
            <input type="date" className="input-flat" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />
          </div>
          <div className="form-group-horiz">
            <label>Cabin</label>
            <select className="input-flat" value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First Class">First Class</option>
            </select>
          </div>
          <div className="form-group-horiz" style={{flex: '0 0 auto'}}>
            <button type="submit" className="btn-book" disabled={status !== 'idle' && status !== 'error'}>
              {status === 'payment' ? '💳 Authenticating Payment...' : 
               status === 'immigration' ? '🛂 Verifying Immigration...' :
               status === 'success' ? 'Booked Successfully' : 'Book Trip ➔'}
            </button>
          </div>
        </form>

        {status === 'success' && confirmedBooking && (
          <div className="boarding-pass animate-fade-up delay-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px' }}>AEROLINK BOARDING PASS</span>
              <span style={{ fontWeight: 800 }}>{confirmedBooking.cabin}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="airport-code">{confirmedBooking.flight.fromCode}</div>
                <div style={{color: 'var(--text-muted)'}}>{confirmedBooking.flight.fromCity}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '0 2rem' }}>
                <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>✈️</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', borderTop: '2px dashed var(--border)', width: '100%', textAlign: 'center', marginTop: '10px', paddingTop: '10px' }}>
                  {confirmedBooking.flight.duration}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="airport-code">{confirmedBooking.flight.toCode}</div>
                <div style={{color: 'var(--text-muted)'}}>{confirmedBooking.flight.toCity}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-glass)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>PASSENGER</span><div style={{fontWeight:800}}>{confirmedBooking.passenger}</div></div>
              <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>DATE</span><div style={{fontWeight:800}}>{confirmedBooking.date}</div></div>
              <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>SEAT/GATE</span><div style={{fontWeight:800}}>{confirmedBooking.seat} / {confirmedBooking.flight.gate}</div></div>
              <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>PNR</span><div style={{fontWeight:800}}>{confirmedBooking.pnr}</div></div>
              <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>BAGGAGE ID</span><div style={{fontWeight:800, color:'var(--primary)'}}>{confirmedBooking.baggageId}</div></div>
            </div>
            
            {/* Lambda Serverless Notification Toast */}
            <div className="lambda-toast animate-fade-up">
              <div className="lambda-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div className="lambda-text">
                <strong>Serverless Event Triggered!</strong>
                <p>AWS Lambda function automatically sent the booking confirmation email via Amazon SES.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="destinations-section animate-fade-up delay-3">
        <h3>Popular Destinations</h3>
        <div className="dest-grid">
          {DESTINATIONS.map((dest, i) => (
            <div key={i} className="dest-card">
              <img src={dest.img} alt={dest.title} />
              <div className="dest-info">
                <h4>{dest.title}</h4>
                <span>⭐ {dest.rating} Rating</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// FLIGHT STATUS PAGE
// ----------------------------------------------------------------------

function FlightStatusPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFlights(getFlightsDatabase());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return '#10b981';
      case 'Boarding': return '#3b82f6';
      case 'Delayed': return '#ef4444';
      case 'In Air': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const filteredFlights = flights.filter(f => 
    searchQuery === '' || 
    f.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.fromCity.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.toCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="inner-page-container animate-fade-up">
      <div className="inner-header">
        <h2>Flight Status</h2>
        <p>Real-time tracking of global AeroLink arrivals and departures.</p>
      </div>
      
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '3rem' }}>
          <input 
            type="text" 
            className="input-flat" 
            placeholder="Search by Flight ID or City..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredFlights.map(flight => (
            <div key={flight.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary)', width: '100px' }}>{flight.code}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>{flight.fromCity} ➔ {flight.toCity}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px', fontWeight: 600 }}>Scheduled: {flight.time} &nbsp;|&nbsp; Gate: {flight.gate} &nbsp;|&nbsp; Seats: {flight.seats}</div>
                </div>
              </div>
              <div style={{ padding: '8px 20px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 800, backgroundColor: `${getStatusColor(flight.status)}15`, color: getStatusColor(flight.status) }}>
                {flight.status}
              </div>
            </div>
          ))}
          {filteredFlights.length === 0 && (
             <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
               No flights found matching your search criteria.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// BAGGAGE TRACKING PAGE
// ----------------------------------------------------------------------

function BaggageTrackingPage() {
  const [baggageId, setBaggageId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [bagStatus, setBagStatus] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baggageId) return;
    setIsSearching(true);
    setError('');
    setBagStatus(null);

    setTimeout(() => {
      let foundBooking = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('bookings_')) {
          const userBookings = JSON.parse(localStorage.getItem(key) || '[]');
          const booking = userBookings.find((b: any) => b.baggageId === baggageId.toUpperCase());
          if (booking) {
            foundBooking = booking;
            break;
          }
        }
      }

      if (foundBooking) {
        setBagStatus({
          id: foundBooking.baggageId, 
          passenger: foundBooking.passenger, 
          flight: foundBooking.flight.code, 
          weight: `${(Math.random() * 10 + 15).toFixed(1)} kg`, 
          currentStage: Math.floor(Math.random() * 4), 
          lastUpdate: new Date().toLocaleTimeString(), 
          location: `${foundBooking.flight.fromCode} - Terminal Sorting`
        });
      } else {
        setError('Baggage ID not found in database. Please check your tag.');
      }
      setIsSearching(false);
    }, 1000);
  };

  const stages = ['Checked In', 'Security', 'Loaded', 'Carousel'];

  return (
    <div className="inner-page-container animate-fade-up">
      <div className="inner-header">
        <h2>Track Luggage</h2>
        <p>Locate your checked bags globally in real-time.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Baggage Tag Number</label>
            <input type="text" className="input-flat" placeholder="e.g. BAG-X7Y8Z9" value={baggageId} onChange={(e) => setBaggageId(e.target.value)} required />
          </div>
          {error && <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.95rem' }}>{error}</div>}
          <button type="submit" className="btn-book" disabled={isSearching} style={{ width: '100%' }}>
            {isSearching ? 'Locating...' : 'Track Luggage'}
          </button>
        </form>

        {bagStatus && (
          <div className="animate-fade-up delay-1" style={{ marginTop: '3rem', borderTop: '2px solid var(--border)', paddingTop: '3rem' }}>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--primary)' }}>Bag: {bagStatus.id}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '3rem' }}>
              <div><div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PASSENGER</div><div style={{ fontWeight: 800 }}>{bagStatus.passenger}</div></div>
              <div><div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>FLIGHT</div><div style={{ fontWeight: 800 }}>{bagStatus.flight}</div></div>
              <div><div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>WEIGHT</div><div style={{ fontWeight: 800 }}>{bagStatus.weight}</div></div>
              <div><div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>LOCATION</div><div style={{ fontWeight: 800 }}>{bagStatus.location}</div></div>
            </div>

            <div style={{ position: 'relative', marginTop: '2rem' }}>
              <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', height: '4px', background: 'var(--border)', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: '20px', left: '20px', width: `${(bagStatus.currentStage / 3) * 100}%`, height: '4px', background: 'var(--primary)', zIndex: 1, transition: 'width 1s ease' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                {stages.map((stage, index) => {
                  const isActive = index <= bagStatus.currentStage;
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-glass)', border: `3px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`, color: isActive ? 'white' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', boxShadow: isActive ? '0 0 15px rgba(0,82,204,0.4)' : 'none' }}>
                        {isActive && '✓'}
                      </div>
                      <span style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '12px', fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// PASSENGER CHECK-IN PAGE
// ----------------------------------------------------------------------

function CheckInPage() {
  const [pnr, setPnr] = useState('');
  const [lastName, setLastName] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr || !lastName) return;
    setIsCheckingIn(true);
    setError('');
    setCheckInStatus(null);

    // Simulated API Call
    await new Promise(resolve => setTimeout(resolve, 1500));

    let foundBooking = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('bookings_')) {
        const userBookings = JSON.parse(localStorage.getItem(key) || '[]');
        const booking = userBookings.find((b: any) => 
          b.pnr === pnr.toUpperCase() && b.passenger.toLowerCase().includes(lastName.toLowerCase())
        );
        if (booking) {
          foundBooking = booking;
          break;
        }
      }
    }

    if (foundBooking) {
      setCheckInStatus(foundBooking);
    } else {
      setError('Booking not found. Please verify your PNR and Last Name.');
    }
    setIsCheckingIn(false);
  };

  return (
    <div className="inner-page-container animate-fade-up">
      <div className="inner-header">
        <h2>Web Check-In</h2>
        <p>Complete your check-in securely and get your digital boarding pass.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>PNR / Booking Reference</label>
            <input type="text" className="input-flat" placeholder="e.g. X7Y8Z9" value={pnr} onChange={(e) => setPnr(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passenger Last Name</label>
            <input type="text" className="input-flat" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          {error && <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.95rem' }}>{error}</div>}
          <button type="submit" className="btn-book" disabled={isCheckingIn} style={{ width: '100%' }}>
            {isCheckingIn ? 'Verifying Details...' : 'Check In Now'}
          </button>
        </form>

        {checkInStatus && (
          <div className="animate-fade-up delay-1" style={{ marginTop: '3rem', borderTop: '2px solid var(--border)', paddingTop: '3rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>You're Checked In!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your boarding pass has been generated and sent to your registered email.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <div style={{ background: 'var(--bg-glass)', padding: '15px 30px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SEAT NUMBER</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{checkInStatus.seat}</div>
              </div>
              <div style={{ background: 'var(--bg-glass)', padding: '15px 30px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>GATE</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{checkInStatus.flight.gate}</div>
              </div>
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
  const [myBookings, setMyBookings] = useState<any[]>(() => {
    const bookingsJson = localStorage.getItem(`bookings_${username}`);
    if (bookingsJson) {
      try { return JSON.parse(bookingsJson); } catch (e) {}
    }
    return [];
  });

  const handleCancelBooking = (pnr: string, flightId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    // 1. Filter out the canceled booking
    const updatedBookings = myBookings.filter((b: any) => b.pnr !== pnr);
    setMyBookings(updatedBookings);
    localStorage.setItem(`bookings_${username}`, JSON.stringify(updatedBookings));

    // 2. Increment the seats of the flight in local storage database
    const dbFlights = JSON.parse(localStorage.getItem('database_flights') || '[]');
    const updatedFlights = dbFlights.map((f: any) => {
      if (f.id === flightId) {
        return { ...f, seats: f.seats + 1 };
      }
      return f;
    });
    localStorage.setItem('database_flights', JSON.stringify(updatedFlights));
  };

  return (
    <div className="inner-page-container animate-fade-up">
      <div className="inner-header">
        <h2>Welcome, {username}</h2>
        <p>Manage your trips, loyalty miles, and account preferences.</p>
      </div>

      <div className="profile-layout">
        <div className="glass-panel profile-sidebar">
          <div className="avatar-large">{username.substring(0, 2).toUpperCase()}</div>
          <h4 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{username}</h4>
          <span style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(255, 215, 0, 0.15)', color: '#b8860b', border: '1px solid rgba(255, 215, 0, 0.4)', borderRadius: '50px', fontWeight: 800, fontSize: '0.85rem', marginTop: '1rem', textTransform: 'uppercase' }}>
            Elite Executive
          </span>
          <div style={{ marginTop: '2.5rem', width: '100%', textAlign: 'left' }}>
            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-glass)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>LOYALTY BALANCE</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>84,300 <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Miles</span></div>
            </div>
            <div style={{ marginBottom: '1rem', padding: '0 10px' }}><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MEMBER ID</span><div style={{ fontWeight: 700 }}>AL-485763</div></div>
            <div style={{ padding: '0 10px' }}><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MEMBER SINCE</span><div style={{ fontWeight: 700 }}>May 2026</div></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '3rem' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, borderBottom: '2px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            Upcoming Trips
          </h3>
          
          {myBookings.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '3rem' }}>🌍</span>
              <p style={{ marginTop: '15px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem' }}>Your itinerary is empty.</p>
              <Link to="/"><button className="btn-book" style={{ marginTop: '20px' }}>Book a Flight</button></Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {myBookings.map((b: any, index: number) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  background: 'var(--bg-panel)', 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  
                  {/* Left Side (Main Ticket) */}
                  <div style={{ flex: '1', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '1rem' }}>
                      <span style={{ fontWeight: 900, color: 'var(--primary)', letterSpacing: '3px', fontSize: '1.2rem' }}>AEROLINK</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>UPCOMING FLIGHT</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{b.flight.fromCode}</div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{b.flight.fromCity}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '0 2rem' }}>
                        <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>✈️</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', borderTop: '2px dashed var(--border)', width: '100%', textAlign: 'center', marginTop: '10px', paddingTop: '10px' }}>
                          {b.flight.duration}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{b.flight.toCode}</div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{b.flight.toCity}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '1rem' }}>
                      <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>FLIGHT</span><div style={{fontWeight:800}}>{b.flight.code}</div></div>
                      <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>DATE</span><div style={{fontWeight:800}}>{b.date}</div></div>
                      <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>SEAT/GATE</span><div style={{fontWeight:800}}>{b.seat} / {b.flight.gate}</div></div>
                      <div><span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>CLASS</span><div style={{fontWeight:800}}>{b.cabin || 'Economy'}</div></div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
                      <Link to="/baggage" style={{ textDecoration: 'none' }}>
                        <button className="btn-book" style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                          Track Bags
                        </button>
                      </Link>
                      <button 
                        className="btn-cancel" 
                        onClick={() => handleCancelBooking(b.pnr, b.flight.id)}
                        style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        Cancel Flight
                      </button>
                    </div>
                  </div>

                  {/* Right Side (Stub & Barcode) */}
                  <div style={{ 
                    width: '280px', 
                    borderLeft: '2px dashed var(--border)', 
                    padding: '2rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.02)'
                  }}>
                    <div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>PASSENGER</span>
                        <div style={{fontWeight:900, fontSize: '1.2rem', color: 'var(--text-main)', textTransform: 'uppercase'}}>{b.passenger}</div>
                      </div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>PNR NUMBER</span>
                        <div style={{fontWeight:800, fontSize: '1.1rem', color: 'var(--primary)'}}>{b.pnr}</div>
                      </div>
                      <div>
                        <span style={{fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)'}}>BAGGAGE ID</span>
                        <div style={{fontWeight:800, fontSize: '1.1rem'}}>{b.baggageId || `BAG-${b.pnr}`}</div>
                      </div>
                    </div>
                    
                    {/* Simulated SVG Barcode */}
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                      <svg width="100%" height="50" preserveAspectRatio="none">
                        <rect x="0" y="0" width="4" height="50" fill="currentColor" />
                        <rect x="6" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="12" y="0" width="6" height="50" fill="currentColor" />
                        <rect x="22" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="28" y="0" width="8" height="50" fill="currentColor" />
                        <rect x="40" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="46" y="0" width="4" height="50" fill="currentColor" />
                        <rect x="54" y="0" width="6" height="50" fill="currentColor" />
                        <rect x="64" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="70" y="0" width="8" height="50" fill="currentColor" />
                        <rect x="82" y="0" width="4" height="50" fill="currentColor" />
                        <rect x="90" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="96" y="0" width="6" height="50" fill="currentColor" />
                        <rect x="106" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="112" y="0" width="4" height="50" fill="currentColor" />
                        <rect x="120" y="0" width="8" height="50" fill="currentColor" />
                        <rect x="132" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="138" y="0" width="6" height="50" fill="currentColor" />
                        <rect x="148" y="0" width="4" height="50" fill="currentColor" />
                        <rect x="156" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="162" y="0" width="8" height="50" fill="currentColor" />
                        <rect x="174" y="0" width="4" height="50" fill="currentColor" />
                        <rect x="182" y="0" width="6" height="50" fill="currentColor" />
                        <rect x="192" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="198" y="0" width="8" height="50" fill="currentColor" />
                        <rect x="210" y="0" width="2" height="50" fill="currentColor" />
                        <rect x="216" y="0" width="6" height="50" fill="currentColor" />
                        <rect x="226" y="0" width="4" height="50" fill="currentColor" />
                      </svg>
                      <div style={{ fontSize: '0.65rem', letterSpacing: '4px', marginTop: '4px', color: 'var(--text-muted)' }}>
                        {b.pnr}{b.flight.code.replace('-', '')}
                      </div>
                    </div>
                  </div>

                  {/* Cutout circles for realism */}
                  <div style={{ position: 'absolute', top: '-15px', right: '265px', width: '30px', height: '30px', borderRadius: '50%', background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}></div>
                  <div style={{ position: 'absolute', bottom: '-15px', right: '265px', width: '30px', height: '30px', borderRadius: '50%', background: 'var(--bg-main)', borderTop: '1px solid var(--border)' }}></div>
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
// ADMIN DASHBOARD PAGE
// ----------------------------------------------------------------------

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('flights');
  
  const [newFlight, setNewFlight] = useState({ code: '', fromCode: '', fromCity: '', toCode: '', toCity: '', duration: '', time: '', seats: 150 });
  const [flights, setFlights] = useState<any[]>(getFlightsDatabase());
  const [statusUpdate, setStatusUpdate] = useState({ flightId: '', status: 'On Time' });
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [searchPnr, setSearchPnr] = useState('');

  useEffect(() => {
    let bookings: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('bookings_')) {
        const userBookings = JSON.parse(localStorage.getItem(key) || '[]');
        bookings = [...bookings, ...userBookings];
      }
    }
    setAllBookings(bookings);
  }, []);

  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const flight = { ...newFlight, id: newFlight.code, status: 'On Time', gate: 'TBD', seats: Number(newFlight.seats) };
    const updatedFlights = [...flights, flight];
    localStorage.setItem('database_flights', JSON.stringify(updatedFlights));
    setFlights(updatedFlights);
    alert('Flight Added Successfully');
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusUpdate.flightId) return;
    const updatedFlights = flights.map(f => f.id === statusUpdate.flightId ? { ...f, status: statusUpdate.status } : f);
    localStorage.setItem('database_flights', JSON.stringify(updatedFlights));
    setFlights(updatedFlights);
    alert('Flight Status Updated');
  };

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUsersJson = localStorage.getItem('admin_users');
    let adminUsersList = [{ username: 'admin', password: 'admin123' }];
    if (adminUsersJson) {
      try { adminUsersList = JSON.parse(adminUsersJson); } catch (err) {}
    }
    if (adminUsersList.some(u => u.username.toLowerCase() === newAdmin.username.toLowerCase())) {
      alert('Admin username already exists!');
      return;
    }
    adminUsersList.push(newAdmin);
    localStorage.setItem('admin_users', JSON.stringify(adminUsersList));
    setNewAdmin({ username: '', password: '' });
    alert('New Admin Registered Successfully');
  };

  return (
    <div className="inner-page-container animate-fade-up">
      <div className="inner-header">
        <h2>AeroLink Admin Center</h2>
        <p>Manage flights, monitor check-ins, and control staff access.</p>
      </div>
      <div className="profile-layout">
        <div className="glass-panel profile-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
           <button onClick={() => setActiveTab('flights')} className={`btn-book ${activeTab!=='flights'?'btn-outline':''}`} style={{width:'100%'}}>Manage Flights</button>
           <button onClick={() => setActiveTab('checkins')} className={`btn-book ${activeTab!=='checkins'?'btn-outline':''}`} style={{width:'100%'}}>Passenger Check-Ins</button>
           <button onClick={() => setActiveTab('admins')} className={`btn-book ${activeTab!=='admins'?'btn-outline':''}`} style={{width:'100%'}}>Register Admin</button>
        </div>
        <div className="glass-panel" style={{ padding: '3rem', flex: 1 }}>
          {activeTab === 'flights' && (
            <div className="animate-fade-up">
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem' }}>Update Flight Status</h3>
              <form onSubmit={handleUpdateStatus} style={{ display: 'flex', gap: '15px', marginBottom: '4rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                   <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Select Flight</label>
                   <select className="input-flat" value={statusUpdate.flightId} onChange={e => setStatusUpdate({...statusUpdate, flightId: e.target.value})} required>
                     <option value="">Select...</option>
                     {flights.map(f => <option key={f.id} value={f.id}>{f.code} - {f.fromCity} to {f.toCity}</option>)}
                   </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                   <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status</label>
                   <select className="input-flat" value={statusUpdate.status} onChange={e => setStatusUpdate({...statusUpdate, status: e.target.value})}>
                     <option value="On Time">On Time</option>
                     <option value="Boarding">Boarding</option>
                     <option value="In Air">In Air</option>
                     <option value="Delayed">Delayed</option>
                     <option value="Cancelled">Cancelled</option>
                   </select>
                </div>
                <button type="submit" className="btn-book">Update</button>
              </form>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, borderTop: '2px solid var(--border)', paddingTop: '2.5rem', marginBottom: '2rem' }}>Add New Flight</h3>
              <form onSubmit={handleAddFlight} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Flight Code</label><input type="text" className="input-flat" placeholder="e.g. AL-999" value={newFlight.code} onChange={e => setNewFlight({...newFlight, code: e.target.value})} required /></div>
                <div><label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Scheduled Time</label><input type="text" className="input-flat" placeholder="e.g. 08:00 AM" value={newFlight.time} onChange={e => setNewFlight({...newFlight, time: e.target.value})} required /></div>
                <div><label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>From Airport Code</label><input type="text" className="input-flat" placeholder="e.g. LHR" value={newFlight.fromCode} onChange={e => setNewFlight({...newFlight, fromCode: e.target.value})} required /></div>
                <div><label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>From City</label><input type="text" className="input-flat" placeholder="e.g. London" value={newFlight.fromCity} onChange={e => setNewFlight({...newFlight, fromCity: e.target.value})} required /></div>
                <div><label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>To Airport Code</label><input type="text" className="input-flat" placeholder="e.g. JFK" value={newFlight.toCode} onChange={e => setNewFlight({...newFlight, toCode: e.target.value})} required /></div>
                <div><label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>To City</label><input type="text" className="input-flat" placeholder="e.g. New York" value={newFlight.toCity} onChange={e => setNewFlight({...newFlight, toCity: e.target.value})} required /></div>
                <div><label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Flight Duration</label><input type="text" className="input-flat" placeholder="e.g. 5h 30m" value={newFlight.duration} onChange={e => setNewFlight({...newFlight, duration: e.target.value})} required /></div>
                <div><label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Seat Capacity</label><input type="number" className="input-flat" placeholder="e.g. 150" value={newFlight.seats} onChange={e => setNewFlight({...newFlight, seats: Number(e.target.value)})} required /></div>
                <button type="submit" className="btn-book" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>Deploy New Flight</button>
              </form>
            </div>
          )}

          {activeTab === 'checkins' && (
             <div className="animate-fade-up">
               <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem' }}>Passenger PNR Lookup</h3>
               <div style={{ display: 'flex', gap: '20px', marginBottom: '3rem' }}>
                 <input 
                   type="text" 
                   className="input-flat" 
                   placeholder="Enter PNR to view details..." 
                   value={searchPnr} 
                   onChange={e => setSearchPnr(e.target.value)} 
                   style={{ flex: 1 }}
                 />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {searchPnr === '' ? (
                   <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                     <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem' }}>Enter a PNR number above to securely look up passenger check-in details.</p>
                   </div>
                 ) : (
                   <>
                     {allBookings.filter(b => b.pnr.toLowerCase().includes(searchPnr.toLowerCase())).map((b, i) => (
                        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', background: 'var(--bg-glass)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                            <div>
                              <div style={{fontWeight: 900, fontSize: '1.4rem'}}>{b.passenger}</div>
                              <div style={{fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px', fontWeight: 600}}>PNR: <span style={{color: 'var(--primary)', fontWeight: 800}}>{b.pnr}</span></div>
                            </div>
                            <div style={{textAlign: 'right', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
                              <div style={{fontSize: '0.85rem', fontWeight: 800, color: '#10b981'}}>Seat: {b.seat}</div>
                              <div style={{fontSize: '0.85rem', fontWeight: 800, color: '#10b981'}}>Bag ID: {b.baggageId}</div>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                            <div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>FLIGHT</span><div style={{ fontWeight: 800 }}>{b.flight.code}</div></div>
                            <div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ROUTE</span><div style={{ fontWeight: 800 }}>{b.flight.fromCode} ➔ {b.flight.toCode}</div></div>
                            <div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CABIN</span><div style={{ fontWeight: 800 }}>{b.cabin}</div></div>
                            <div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DATE</span><div style={{ fontWeight: 800 }}>{b.date}</div></div>
                          </div>
                        </div>
                     ))}
                     {allBookings.filter(b => b.pnr.toLowerCase().includes(searchPnr.toLowerCase())).length === 0 && (
                       <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                         <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem' }}>No passenger bookings found for this PNR.</p>
                       </div>
                     )}
                   </>
                 )}
               </div>
             </div>
          )}

          {activeTab === 'admins' && (
             <div className="animate-fade-up">
               <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem' }}>Register System Administrator</h3>
               <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Grant enterprise dashboard access to new operational staff.</p>
               <form onSubmit={handleRegisterAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                 <div>
                   <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Admin Username</label>
                   <input type="text" className="input-flat" placeholder="Enter unique username" value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} required />
                 </div>
                 <div>
                   <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Secure Password</label>
                   <input type="password" className="input-flat" placeholder="Enter password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required />
                 </div>
                 <button type="submit" className="btn-book" style={{ marginTop: '10px' }}>Authorize New Admin</button>
               </form>
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
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.3c-.2.5.1 1 .6 1.1l7.4 2.2-3.1 3.1-3.6-.9c-.4-.1-.8.1-1 .5L1.5 19c-.2.3.1.8.5.8l4.6.6 2.6 2.6c.3.3.8.3 1-.1l1.7-2.6c.3-.5 0-.9-.4-1l-1-.2 3.1-3.1 2.2 7.4c.1.5.7.8 1.1.6l3.3-1.2c.5-.2.8-.6.7-1.1z"></path>
            </svg>
            <h1>AeroLink</h1>
          </Link>
          <div className="nav-links">
            {token ? (
              <>
                {token === 'mock-jwt-admin' ? (
                  <NavLink to="/admin">Dashboard</NavLink>
                ) : (
                  <>
                    <NavLink to="/">Book</NavLink>
                    <NavLink to="/checkin">Check-In</NavLink>
                  </>
                )}
                <NavLink to="/flights">Status</NavLink>
                <NavLink to="/baggage">Baggage</NavLink>
                {token !== 'mock-jwt-admin' && <NavLink to="/profile">Profile</NavLink>}
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                  {theme === 'light' ? '☀️' : '🌙'}
                </button>
                <button onClick={handleLogout} className="btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/flights">Status</NavLink>
                <NavLink to="/login">Login</NavLink>
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                  {theme === 'light' ? '☀️' : '🌙'}
                </button>
                <Link to="/register"><button className="btn-book" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>Register</button></Link>
              </>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/flights" element={<FlightStatusPage />} />
            <Route path="/checkin" element={token ? <CheckInPage /> : <Navigate to="/login" />} />
            <Route path="/baggage" element={token ? <BaggageTrackingPage /> : <Navigate to="/login" />} />
            <Route path="/admin" element={token === 'mock-jwt-admin' ? <AdminDashboardPage /> : <Navigate to="/" />} />
            <Route path="/profile" element={token && token !== 'mock-jwt-admin' ? <ProfilePage username={username!} /> : <Navigate to="/login" />} />
            <Route path="/" element={token && token !== 'mock-jwt-admin' ? <BookingPage username={username!} /> : (token === 'mock-jwt-admin' ? <Navigate to="/admin" /> : <Navigate to="/login" />)} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
