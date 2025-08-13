import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings();
  }, [user.id]);

  const fetchRecentBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/getrides/${user.id}`);
      setRecentBookings(response.data.slice(0, 5)); // Get last 5 bookings
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load recent bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'ongoing':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 >Welcome back, {user?.name}!</h1>
            <p className="head">Ready for your next ride? Book now and travel with comfort.</p>
          </div>
          
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <div className="stat-content">
              <h3>Total Rides</h3>
              <p className="stat-number">{recentBookings.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <h3>Active Bookings</h3>
              <p className="stat-number">
                {recentBookings.filter(booking => booking.status === 'ongoing').length}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>Rating</h3>
              <p className="stat-number">4.8</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Spent</h3>
              <p className="stat-number">
                ${recentBookings.reduce((sum, booking) => sum + (parseFloat(booking.fare) || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-bookings">
          <div className="section-header">
            <h2>Recent Bookings</h2>
            <Link to="/ride-history" className="view-all">View All</Link>
          </div>

          {loading ? (
            <div className="loading">Loading recent bookings...</div>
          ) : recentBookings.length > 0 ? (
            <div className="bookings-grid">
              {recentBookings.map((booking, index) => (
                <div key={index} className="booking-card">
                  <div className="booking-header">
                    <h3>Ride #{index + 1}</h3>
                    <span className={`status ${getStatusColor(booking.status || 'completed')}`}>
                      {booking.status || 'completed'}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="label">From:</span>
                      <span className="value">{booking.selectedPickupCity}, {booking.selectedPickupState}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">To:</span>
                      <span className="value">{booking.selectedDropCity}, {booking.selectedDropState}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Driver:</span>
                      <span className="value">{booking.drivername}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Car:</span>
                      <span className="value">{booking.carname} ({booking.cartype})</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Fare:</span>
                      <span className="value">${booking.fare}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Date:</span>
                      <span className="value">{booking.pickupdate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bookings">
              <div className="no-bookings-icon">🚗</div>
              <h3>No bookings yet</h3>
              <p>Start your journey by booking your first ride!</p>
              <Link to="/book-ride" className="action-button primary">
                Book Your First Ride
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/book-ride" className="action-card">
              <div className="action-icon">🚗</div>
              <h3>Book a Ride</h3>
              <p>Find and book your next ride</p>
            </Link>
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Update Profile</h3>
              <p>Manage your account settings</p>
            </Link>
            <Link to="/ride-history" className="action-card">
              <div className="action-icon">📋</div>
              <h3>Ride History</h3>
              <p>View all your past rides</p>
            </Link>
            <div className="action-card">
              <div className="action-icon">📞</div>
              <h3>Support</h3>
              <p>Get help and contact us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 