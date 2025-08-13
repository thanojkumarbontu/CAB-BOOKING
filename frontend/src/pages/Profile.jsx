import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert('Please login first');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('Logged out');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Welcome, {user.name} 👋</h2>
        <p>Email: {user.email}</p>
        <button onClick={handleLogout} style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#cc0000',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;