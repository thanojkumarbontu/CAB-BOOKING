// frontend/src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin</h1>
      <p>Manage everything at a glance</p>

      <div className="dashboard-cards">
        <div className="card" onClick={() => navigate('/admin/riders')}>
          <h2>Rider Management</h2>
          <p>View and manage all registered riders</p>
        </div>
        <div className="card" onClick={() => navigate('/admin/drivers')}>
          <h2>Driver Management</h2>
          <p>Approve and manage driver profiles</p>
        </div>
        <div className="card" onClick={() => navigate('/admin/cabs')}>
          <h2>Cab Listings</h2>
          <p>Add, update, or remove cab details</p>
        </div>
        <div className="card" onClick={() => navigate('/admin/system')}>
          <h2>System Controls</h2>
          <p>Analytics, maintenance mode, and more</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
