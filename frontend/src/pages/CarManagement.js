import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CarManagement.css';

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    drivername: '',
    carname: '',
    cartype: '',
    carno: '',
    price: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cars/all');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      if (editingCar) {
        await axios.put(`http://localhost:8000/acaredit/${editingCar._id}`, formData);
        toast.success('Car updated successfully!');
      } else {
        await axios.post('http://localhost:8000/cars', formDataToSend);
        toast.success('Car added successfully!');
      }
      
      setShowAddForm(false);
      setEditingCar(null);
      resetForm();
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error('Failed to save car');
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`http://localhost:8000/cardelete/${carId}`);
        toast.success('Car deleted successfully!');
        fetchCars();
      } catch (error) {
        console.error('Error deleting car:', error);
        toast.error('Failed to delete car');
      }
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      drivername: car.drivername || '',
      carname: car.carname || '',
      cartype: car.cartype || '',
      carno: car.carno || '',
      price: car.price || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      drivername: '',
      carname: '',
      cartype: '',
      carno: '',
      price: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="car-management">
      <div className="car-container">
        <div className="car-header">
          <h1>Car Management</h1>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingCar(null);
              resetForm();
            }}
            className="add-car-btn"
          >
            Add New Car
          </button>
        </div>

        {showAddForm && (
          <div className="add-car-form">
            <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Driver Name</label>
                  <input
                    type="text"
                    name="drivername"
                    value={formData.drivername}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Car Name</label>
                  <input
                    type="text"
                    name="carname"
                    value={formData.carname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Car Type</label>
                  <select
                    name="cartype"
                    value={formData.cartype}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Economy">Economy</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                    <option value="SUV">SUV</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Car Number</label>
                  <input
                    type="text"
                    name="carno"
                    value={formData.carno}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCar(null);
                    resetForm();
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingCar ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading cars...</div>
        ) : (
          <div className="cars-grid">
            {cars.map((car, index) => (
              <div key={index} className="car-card">
                <div className="car-image">
                  {car.carImage ? (
                    <img src={`http://localhost:8000/${car.carImage}`} alt={car.carname} />
                  ) : (
                    <div className="car-placeholder">🚗</div>
                  )}
                </div>
                <div className="car-details">
                  <h3>{car.carname}</h3>
                  <p className="car-type">{car.cartype}</p>
                  <p className="driver">Driver: {car.drivername}</p>
                  <p className="car-number">Car No: {car.carno}</p>
                  <p className="price">${car.price}</p>
                </div>
                <div className="car-actions">
                  <button
                    onClick={() => handleEdit(car)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarManagement; 