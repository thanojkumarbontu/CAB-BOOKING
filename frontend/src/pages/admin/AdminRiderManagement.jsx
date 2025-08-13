// frontend/src/pages/admin/AdminRiderManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminRiderManagement.css';

const AdminRiderManagement = () => {
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/riders');
      setRiders(response.data);
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  const deleteRider = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/riders/${id}`);
      setRiders(riders.filter(rider => rider._id !== id));
    } catch (error) {
      console.error('Error deleting rider:', error);
    }
  };

  return (
    <div className="admin-rider-management">
      <h2>Rider Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {riders.map(rider => (
            <tr key={rider._id}>
              <td>{rider.name}</td>
              <td>{rider.email}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteRider(rider._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRiderManagement;
