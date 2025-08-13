import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1>Welcome to RideEase{user?.name ? `, ${user.name}` : ''}!</h1>
        <p>Book your cab with ease and comfort.</p>

        <div className="home-actions">
          <Link to="/bookings" className="home-btn">📅 My Bookings</Link>
           <Link to="/book-ride" className="home-btn">🚕 Book a Ride</Link>
          <Link to="/profile" className="home-btn">👤 My Profile</Link>
          <button onClick={handleLogout} className="home-btn logout">🚪 Logout</button>
        </div>
      </div>
    </>
  );
};

export default Home;