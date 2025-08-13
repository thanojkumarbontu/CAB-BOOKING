import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">RideEase</span>
          <span className="logo-subtitle">Cab Booking</span>
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {user ? (
            <>
              {user.role === 'admin' ? (
                // Admin Navigation
                <>
                  <Link to="/admin" className="nav-link">Admin Dashboard</Link>
                  <Link to="/admin/cars" className="nav-link">Car Management</Link>
                  <Link to="/admin/users" className="nav-link">User Management</Link>
                </>
              ) : (
                // User Navigation
                <>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/book-ride" className="nav-link">Book Ride</Link>
                  <Link to="/ride-history" className="nav-link">Ride History</Link>
                  <Link to="/profile" className="nav-link">Profile</Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
