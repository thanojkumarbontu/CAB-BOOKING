import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Book Your Ride with Ease</h1>
          <p>Fast, reliable, and comfortable cab booking service at your fingertips</p>
          {user ? (
            <Link to="/book-ride" className="cta-button">
              Book Now
            </Link>
          ) : (
            <div className="cta-buttons">
              <Link to="/register" className="cta-button primary">
                Get Started
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
          )}
        </div>
        <div className="hero-image">
          <div className="car-animation">
            <div className="car">🚗</div>
            <div className="road"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose RideEase?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h3>Wide Selection</h3>
              <p>Choose from various car types including economy, premium, and luxury vehicles</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Quick Booking</h3>
              <p>Book your ride in seconds with our streamlined booking process</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Real-time Tracking</h3>
              <p>Track your driver's location in real-time for better convenience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>Multiple payment options with secure and encrypted transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Rated Drivers</h3>
              <p>All our drivers are verified and rated for your safety</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support for any assistance you need</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Book Your Ride</h3>
              <p>Enter your pickup and destination locations</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Choose Your Car</h3>
              <p>Select from available cars and drivers</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Track & Ride</h3>
              <p>Track your driver and enjoy your ride</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of satisfied customers who trust RideEase for their transportation needs</p>
          {user ? (
            <Link to="/book-ride" className="cta-button">
              Book Your Ride Now
            </Link>
          ) : (
            <Link to="/register" className="cta-button">
              Create Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 