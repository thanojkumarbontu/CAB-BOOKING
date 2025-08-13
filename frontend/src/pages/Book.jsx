import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Book = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    carId: '',
    pickupLocation: '',
    dropLocation: '',
    date: '',
  });

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch car list
    axios.get('http://localhost:9000/api/cars')
      .then(res => setCars(res.data))
      .catch(err => console.error('Failed to load cars:', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { carId, pickupLocation, dropLocation, date } = formData;

    if (!carId || !pickupLocation || !dropLocation || !date) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:9000/api/bookings', {
        userId: user._id,
        carId,
        pickupLocation,
        dropLocation,
        date
      });

      alert('Booking successful!');
      navigate('/bookings');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Book a Ride</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          
          <select name="carId" value={formData.carId} onChange={handleChange} required>
            <option value="">Select Car</option>
            {cars.map(car => (
              <option key={car._id} value={car._id}>
                {car.model} - {car.number}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="pickupLocation"
            placeholder="Pickup Location"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dropLocation"
            placeholder="Drop Location"
            value={formData.dropLocation}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Confirm Booking
          </button>
        </form>
      </div>
    </>
  );
};

export default Book;