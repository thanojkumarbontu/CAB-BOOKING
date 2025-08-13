import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import PrivateRoute from '../components/PrivateRoute'; // ✅
import MyBookings from '../pages/MyBookings';
import Bookings from '../pages/Bookings'; 
import BookRide from '../pages/BookRide';
const Router = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/bookings" element={<MyBookings />} />
    <Route path="/book" element={<Bookings />} />
    <Route path="/book-ride" element={<BookRide />} />
    {/* ✅ Protect Home */}
    <Route
      path="/home"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />

    {/* ✅ Protect Profile */}
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default Router;