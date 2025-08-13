// frontend/src/pages/BookRide.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const BookRide = () => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [carModel, setCarModel] = useState('');
  const navigate = useNavigate();

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login first');
      return;
    }

    try {
      const res = await axios.post('http://localhost:9000/api/bookings', {
        userId: user._id,
        pickupLocation: pickup,
        dropLocation: drop,
        carModel: carModel,
        date: new Date().toISOString()
      });

      navigate('/confirmation', {
        state: {
          cab: res.data.carModel,
          driver: res.data.driverName || 'Driver not assigned',
          bookingId: res.data._id,
          date: res.data.date
        }
      });
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Book a Ride</h2>
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Drop Location"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Car Model"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
        />
        <br />
        <button onClick={handleBooking}>Book Ride</button>
      </div>
    </>
  );
};

export default BookRide;
