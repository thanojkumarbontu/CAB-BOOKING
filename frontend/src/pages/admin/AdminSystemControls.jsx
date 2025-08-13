// frontend/src/pages/admin/AdminSystemControls.jsx
import React, { useState } from 'react';
import './AdminSystemControls.css';

const AdminSystemControls = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const toggleMaintenance = () => {
    setMaintenanceMode(prev => !prev);
    alert(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="admin-system-controls">
      <h2>System Controls</h2>

      <div className="control-card">
        <h3>Maintenance Mode</h3>
        <p>Status: <strong>{maintenanceMode ? 'Enabled' : 'Disabled'}</strong></p>
        <button onClick={toggleMaintenance}>
          {maintenanceMode ? 'Disable' : 'Enable'}
        </button>
      </div>

      <div className="control-card">
        <h3>Analytics Overview</h3>
        <p>🚗 Total Rides: 123</p>
        <p>👤 Registered Users: 87</p>
        <p>💰 Total Revenue: ₹56,000</p>
      </div>

      <div className="control-card">
        <h3>Reset System (Demo Only)</h3>
        <button className="danger-btn" onClick={() => alert('System reset simulated.')}>
          Reset All Data
        </button>
      </div>
    </div>
  );
};

export default AdminSystemControls;
