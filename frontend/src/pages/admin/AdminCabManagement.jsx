import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCabManagement.css';

const AdminCabManagement = () => {
  const [cabs, setCabs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCab, setEditingCab] = useState(null);
  const [formData, setFormData] = useState({
    carName: '',
    carModel: '',
    carNumber: '',
    capacity: '',
    pricePerKm: '',
  });

  const fetchCabs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cars');
      setCabs(res.data);
    } catch (err) {
      console.error('Error fetching cabs:', err);
    }
  };

  useEffect(() => {
    fetchCabs();
  }, []);

  const handleOpenModal = (cab = null) => {
    setEditingCab(cab);
    setFormData(cab || {
      carName: '',
      carModel: '',
      carNumber: '',
      capacity: '',
      pricePerKm: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCab(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingCab) {
        await axios.put(`http://localhost:5000/api/cars/${editingCab._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/cars', formData);
      }
      handleCloseModal();
      fetchCabs();
    } catch (err) {
      console.error('Error saving cab:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cab?')) {
      try {
        await axios.delete(`http://localhost:5000/api/cars/${id}`);
        fetchCabs();
      } catch (err) {
        console.error('Error deleting cab:', err);
      }
    }
  };

  return (
    <div className="admin-cab-management">
      <h2>Cab Management</h2>
      <button onClick={() => handleOpenModal()} className="add-btn">Add New Cab</button>
      <table>
        <thead>
          <tr>
            <th>Car Name</th>
            <th>Model</th>
            <th>Number</th>
            <th>Capacity</th>
            <th>Price/Km</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cabs.map((cab) => (
            <tr key={cab._id}>
              <td>{cab.carName}</td>
              <td>{cab.carModel}</td>
              <td>{cab.carNumber}</td>
              <td>{cab.capacity}</td>
              <td>{cab.pricePerKm}</td>
              <td>
                <button onClick={() => handleOpenModal(cab)}>Edit</button>
                <button onClick={() => handleDelete(cab._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingCab ? 'Edit Cab' : 'Add Cab'}</h3>
            <input type="text" name="carName" placeholder="Car Name" value={formData.carName} onChange={handleChange} />
            <input type="text" name="carModel" placeholder="Model" value={formData.carModel} onChange={handleChange} />
            <input type="text" name="carNumber" placeholder="Car Number" value={formData.carNumber} onChange={handleChange} />
            <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} />
            <input type="number" name="pricePerKm" placeholder="Price per Km" value={formData.pricePerKm} onChange={handleChange} />
            <div className="modal-buttons">
              <button onClick={handleSubmit}>{editingCab ? 'Update' : 'Add'}</button>
              <button onClick={handleCloseModal} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCabManagement;
