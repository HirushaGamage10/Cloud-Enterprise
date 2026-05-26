import { useState } from 'react';
import './App.css';

function App() {
  const [passengerName, setPassengerName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API Call to backend
    setTimeout(() => {
      setStatus('success');
      setPassengerName('');
      setFlightNumber('');
    }, 1500);
  };

  return (
    <div className="app-container">
      <nav className="navbar glass-panel">
        <div className="logo">
          <span className="logo-icon">✈️</span>
          <h1>AeroLink</h1>
        </div>
        <div className="nav-links">
          <a href="#">Flights</a>
          <a href="#">Check-in</a>
          <a href="#">Manage</a>
        </div>
      </nav>

      <main className="main-content">
        <div className="hero-section animate-fade-in">
          <h2 className="hero-title">Elevate Your Journey</h2>
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

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Processing...' : 'Confirm Booking'}
            </button>
            
            {status === 'success' && (
              <div className="success-message animate-fade-in">
                ✅ Booking confirmed successfully!
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
