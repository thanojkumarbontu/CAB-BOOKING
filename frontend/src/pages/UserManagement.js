import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/getusers/1');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await axios.put(`http://localhost:8000/useredit/${editingUser._id}`, formData);
        toast.success('User updated successfully!');
      } else {
        const response = await axios.post('http://localhost:8000/register', formData);
        if (response.data === "Account Created") {
          toast.success('User created successfully!');
        } else {
          toast.error(response.data);
          return;
        }
      }
      
      setShowAddForm(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/userdelete/${userId}`);
        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '' // Don't pre-fill password for security
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management">
      <div className="user-container">
        <div className="user-header">
          <h1>User Management</h1>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingUser(null);
              resetForm();
            }}
            className="add-user-btn"
          >
            Add New User
          </button>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Add/Edit User Form */}
        {showAddForm && (
          <div className="add-user-form">
            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUser}
                    placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                    minLength="6"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Summary */}
        <div className="users-summary">
          <div className="summary-card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="summary-card">
            <h3>Active Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="summary-card">
            <h3>New This Month</h3>
            <p>12</p>
          </div>
          <div className="summary-card">
            <h3>Total Bookings</h3>
            <p>156</p>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-grid">
            {filteredUsers.length === 0 ? (
              <div className="no-users">
                <h3>No users found</h3>
                <p>
                  {searchTerm 
                    ? 'Try adjusting your search criteria'
                    : 'Start by adding your first user!'
                  }
                </p>
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <div key={user._id || index} className="user-card">
                  <div className="user-header-card">
                    <div className="user-avatar">
                      {user.name?.charAt(0).toUpperCase() || '👤'}
                    </div>
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-details">
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{user.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className="status-badge status-active">Active</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Role:</span>
                      <span className="role-badge role-passenger">Passenger</span>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
