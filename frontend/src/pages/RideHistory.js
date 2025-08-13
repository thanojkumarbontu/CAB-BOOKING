import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './RideHistory.css';

const RideHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) {
      console.error('❌ No user found');
      setLoading(false);
      return;
    }

    const userId = user.userId || user._id || user.id;
    
    console.log('🔍 User object:', user);
    console.log('🔍 Extracted userId:', userId);
    
    if (!userId) {
      console.error('❌ No valid user ID found');
      toast.error('Invalid user session. Please logout and login again.');
      setLoading(false);
      return;
    }

    // ENHANCED VALIDATION: Check ObjectId format
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    if (!objectIdRegex.test(userId)) {
      console.error('❌ Invalid ObjectId format:', userId);
      toast.error('Invalid user session format. Please logout and login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📡 Fetching rides for user:', userId);
      
      const response = await axios.get(`http://localhost:8000/getrides/${userId}`);
      
      console.log('✅ Successfully fetched bookings:', response.data.length);
      setBookings(response.data);
      
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      
      if (error.response?.status === 400) {
        const errorMsg = error.response.data.error;
        if (errorMsg?.includes('Invalid user ID format')) {
          toast.error('Invalid user session. Please logout and login again.');
          // Auto-clear invalid session
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error(errorMsg || 'Invalid request');
        }
      } else {
        toast.error('Failed to load ride history');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`http://localhost:8000/usercardelete/${bookingId}`);
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        toast.error('Failed to delete booking');
      }
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
        return 'green';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && (booking.status === 'completed' || !booking.status)) ||
                         (filter === 'ongoing' && booking.status === 'ongoing') ||
                         (filter === 'cancelled' && booking.status === 'cancelled');
    
    const matchesSearch = searchTerm === '' || 
                         booking.selectedPickupCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.selectedDropCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.drivername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.carname?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalSpent = bookings.reduce((sum, booking) => sum + (parseFloat(booking.fare) || 0), 0);

  if (loading) {
    return (
      <div className="ride-history">
        <div className="ride-history-container">
          <div className="loading">
            <h3>Loading your ride history...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ride-history">
        <div className="ride-history-container">
          <div className="error">
            <h3>⚠️ Please log in to view your ride history</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-history">
      <div className="ride-history-container">
        <div className="history-header">
          <h1>My Ride History</h1>
          <p>Showing rides for: <strong>{user.name}</strong></p>
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Rides</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">₹{totalSpent.toFixed(2)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {bookings.filter(booking => booking.status === 'ongoing').length}
            </div>
            <div className="stat-label">Active Rides</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by location, driver, or car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Rides ({bookings.length})
            </button>
            <button
              className={`filter-btn ${filter === 'ongoing' ? 'active' : ''}`}
              onClick={() => setFilter('ongoing')}
            >
              Ongoing ({bookings.filter(b => b.status === 'ongoing').length})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({bookings.filter(b => !b.status || b.status === 'completed').length})
            </button>
            <button
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="bookings-list">
            {filteredBookings.map((booking, index) => (
              <div key={booking._id} className="booking-item">
                <div className="booking-header">
                  <div className="booking-id">
                    <h3>Trip #{booking._id?.slice(-6) || index + 1}</h3>
                    <span className={`status ${getStatusColor(booking.status || 'completed')}`}>
                      {booking.status || 'completed'}
                    </span>
                  </div>
                  <div className="booking-actions">
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="delete-btn"
                      title="Delete booking"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="booking-content">
                  <div className="route-info">
                    <div className="location pickup">
                      <div className="location-icon">📍</div>
                      <div className="location-details">
                        <span className="location-label">From</span>
                        <span className="location-value">
                          {booking.selectedPickupCity}, {booking.selectedPickupState}
                        </span>
                      </div>
                    </div>
                    <div className="route-line"></div>
                    <div className="location drop">
                      <div className="location-icon">🎯</div>
                      <div className="location-details">
                        <span className="location-label">To</span>
                        <span className="location-value">
                          {booking.selectedDropCity}, {booking.selectedDropState}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="label">Driver:</span>
                        <span className="value">{booking.drivername}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Car:</span>
                        <span className="value">{booking.carname} ({booking.cartype})</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="label">Car Number:</span>
                        <span className="value">{booking.carno}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Fare:</span>
                        <span className="value fare">₹{booking.fare}</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="label">Pickup Date:</span>
                        <span className="value">{booking.pickupdate}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Pickup Time:</span>
                        <span className="value">{booking.pickuptime}</span>
                      </div>
                    </div>
                    {booking.bookeddate && (
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="label">Booked On:</span>
                          <span className="value">{booking.bookeddate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <div className="no-bookings-icon">🚗</div>
            <h3>No rides found</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t taken any rides yet. Start your journey by booking your first ride!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistory;
