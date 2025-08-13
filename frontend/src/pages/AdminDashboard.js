import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ADDED: Import useAuth
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth(); // ADDED: Get user from context
  
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: 0,
    averageBookingValue: 0,
    activeUsers: 0,
    completedRides: 0
  });
  
  const [recentActivities, setRecentActivities] = useState({
    recentBookings: [],
    recentUsers: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ADDED: Check if user is admin before fetching data
    if (user && user.role === 'admin') {
      fetchDashboardData();
    } else if (user && user.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Fetching admin dashboard data...'); // Debug log

      // FIXED: Use proper admin statistics endpoint
      const statsResponse = await axios.get('http://localhost:8000/api/admin/statistics');
      console.log('✅ Statistics response:', statsResponse.data);
      setStatistics(statsResponse.data);

      // FIXED: Fetch real recent activities data
      try {
        const activitiesResponse = await axios.get('http://localhost:8000/api/admin/recent-activities');
        console.log('✅ Activities response:', activitiesResponse.data);
        setRecentActivities(activitiesResponse.data);
      } catch (activitiesError) {
        console.log('⚠️ Activities fetch failed, using empty data');
        setRecentActivities({ recentBookings: [], recentUsers: [] });
      }

      toast.success('Dashboard data loaded successfully!');

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      
      let errorMessage = 'Failed to load dashboard statistics';
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        if (error.response.status === 403) {
          errorMessage = 'Access denied. Admin privileges required.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error: ' + (error.response.data.error || 'Internal server error');
        } else {
          errorMessage = error.response.data.error || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error: Unable to connect to server';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Loading Admin Dashboard...</h3>
            <p>Please wait while we fetch your admin data.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h3>Dashboard Error</h3>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-btn">
              Try Again
            </button>
            
            {/* Debug info */}
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              background: '#f5f5f5', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              <strong>🔧 Debug Info:</strong>
              <br/>User: {user?.name || 'Not logged in'}
              <br/>Role: {user?.role || 'No role'}
              <br/>User ID: {user?.userId || 'No ID'}
              <br/>API Endpoint: http://localhost:8000/api/admin/statistics
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Access Denied</h3>
            <p>You need admin privileges to access this dashboard.</p>
            <Link to="/login" className="retry-btn">
              Login as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, <strong>{user?.name}</strong>! Manage your RideEase platform.</p>
          </div>
          <button onClick={handleRefresh} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>

        {/* UPDATED: Stats Overview with real data */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{statistics.totalUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <div className="stat-content">
              <h3>Total Cars</h3>
              <p className="stat-number">{statistics.totalCars}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Total Bookings</h3>
              <p className="stat-number">{statistics.totalBookings}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">₹{statistics.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>Recent Bookings</h3>
              <p className="stat-number">{statistics.recentBookings}</p>
              <span className="stat-subtitle">Last 30 days</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Average Booking</h3>
              <p className="stat-number">₹{statistics.averageBookingValue || 0}</p>
              <span className="stat-subtitle">Per ride</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/users" className="action-card">
              <div className="action-icon">👥</div>
              <h3>Manage Users</h3>
              <p>View and manage user accounts</p>
            </Link>
            <Link to="/admin/cars" className="action-card">
              <div className="action-icon">🚗</div>
              <h3>Manage Cars</h3>
              <p>Add, edit, or remove cars</p>
            </Link>
            <div className="action-card" onClick={handleRefresh}>
              <div className="action-icon">📊</div>
              <h3>View Reports</h3>
              <p>Generate and view reports</p>
            </div>
            <div className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Configure system settings</p>
            </div>
          </div>
        </div>

        {/* UPDATED: Recent Activity with real data */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {/* Recent Bookings */}
            {recentActivities.recentBookings.length > 0 && (
              <>
                <h3 style={{ marginBottom: '1rem', color: '#333' }}>Latest Bookings</h3>
                {recentActivities.recentBookings.slice(0, 3).map((booking, index) => (
                  <div key={booking._id || index} className="activity-item">
                    <div className="activity-icon">🚗</div>
                    <div className="activity-content">
                      <h4>New booking completed</h4>
                      <p>{booking.selectedPickupCity} → {booking.selectedDropCity}</p>
                      <span className="activity-time">
                        {booking.userName} • ₹{booking.fare} • {booking.bookeddate}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Recent Users */}
            {recentActivities.recentUsers.length > 0 && (
              <>
                <h3 style={{ marginBottom: '1rem', color: '#333', marginTop: '2rem' }}>New Users</h3>
                {recentActivities.recentUsers.slice(0, 3).map((newUser, index) => (
                  <div key={newUser._id || index} className="activity-item">
                    <div className="activity-icon">👤</div>
                    <div className="activity-content">
                      <h4>New user registered</h4>
                      <p>{newUser.name}</p>
                      <span className="activity-time">{newUser.email}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Fallback if no recent activity */}
            {recentActivities.recentBookings.length === 0 && recentActivities.recentUsers.length === 0 && (
              <div className="activity-item">
                <div className="activity-icon">📭</div>
                <div className="activity-content">
                  <h4>No recent activity</h4>
                  <p>No recent bookings or user registrations</p>
                  <span className="activity-time">Check back later</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
