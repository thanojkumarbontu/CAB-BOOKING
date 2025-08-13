import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('🔍 Restored user from localStorage:', parsedUser);
      
      // VALIDATION: Check if user has valid ID format
      const userId = parsedUser.userId || parsedUser._id || parsedUser.id;
      const isValidId = userId && userId.length === 24 && /^[a-fA-F0-9]{24}$/.test(userId);
      
      if (!isValidId) {
        console.log('❌ Invalid user session detected, clearing...');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        console.log('✅ Valid user session restored');
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await axios.post('http://localhost:8000/login', {
        email,
        password,
        role
      });

      if (response.data.Status === 'Success') {
        const userData = response.data.user;
        
        console.log('🔍 Login response user data:', userData);
        console.log('🔍 User ID validation:', {
          userId: userData.userId,
          id: userData.id,
          _id: userData._id,
          isValid24Char: userData.userId?.length === 24,
          isHexFormat: /^[a-fA-F0-9]{24}$/.test(userData.userId || '')
        });
        
        // VALIDATION: Ensure we have a valid MongoDB ObjectId format
        const validUserId = userData.userId || userData._id || userData.id;
        const isValidObjectId = validUserId && validUserId.length === 24 && /^[a-fA-F0-9]{24}$/.test(validUserId);
        
        if (!isValidObjectId) {
          console.error('❌ Invalid ObjectId format received:', validUserId);
          return { success: false, message: 'Invalid user session received. Please try again.' };
        }
        
        console.log('✅ Valid ObjectId format received');
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.data.message || response.data };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const response = await axios.post('http://localhost:8000/register', {
        name,
        email,
        password,
        role
      });

      if (response.data === 'Account Created') {
        return { success: true, message: 'Account created successfully!' };
      } else {
        return { success: false, message: response.data };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    console.log('🚪 User logging out');
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
