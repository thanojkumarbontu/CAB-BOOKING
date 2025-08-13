import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/bookings/${user._id}`);
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>My Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {bookings.map((booking, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '1rem',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                }}
              >
                <p><strong>Cab:</strong> {booking.carName}</p>
                <p><strong>Driver:</strong> {booking.driverName || 'Driver not assigned'}</p>
                <p><strong>Pickup:</strong> {booking.pickup}</p>
                <p><strong>Drop:</strong> {booking.drop}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {booking.status || 'Confirmed'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;
