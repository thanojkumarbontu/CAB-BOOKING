import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>RideEase</h3>
          <p>Your trusted partner for safe and comfortable rides.</p>
          <div className="social-links">
            <a href="https://facebook.com" className="social-link">Facebook</a>
            <a href="https://twitter.com" className="social-link">Twitter</a>
            <a href="https://instagram.com" className="social-link">Instagram</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/book-ride">Book Ride</a></li>
            <li><a href="/ride-history">Ride History</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/safety">Safety</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>📧 support@rideease.com</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>📍 123 Main Street, City, State</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 RideEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 