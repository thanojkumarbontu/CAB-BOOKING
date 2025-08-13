import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    axios.get(`http://localhost:9000/api/bookings/user/${user._id}`)
      .then(res => setBookings(res.data))
      .catch(err => console.error('Failed to fetch bookings:', err));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>My Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul>
            {bookings.map((booking, index) => (
              <li key={index}>
                <strong>Car:</strong> {booking.carModel} <br />
                <strong>Pickup:</strong> {booking.pickupLocation} <br />
                <strong>Drop:</strong> {booking.dropLocation} <br />
                <strong>Date:</strong> {new Date(booking.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Bookings;