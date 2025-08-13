import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  if (!booking) {
    return (
      <div className="confirmation-container">
        <h2>No Booking Found</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <h2>Booking Confirmed!</h2>
      <div className="confirmation-box">
        <p><strong>Booking ID:</strong> {booking._id}</p>
        <p><strong>Cab:</strong> {booking.carName}</p>
        <p><strong>Driver:</strong> {booking.driverName || 'Assigned Soon'}</p>
        <p><strong>From:</strong> {booking.pickup}</p>
        <p><strong>To:</strong> {booking.drop}</p>
        <p><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</p>
      </div>
      <button onClick={() => navigate('/mybookings')}>Go to My Bookings</button>
    </div>
  );
};

export default BookingConfirmation;
