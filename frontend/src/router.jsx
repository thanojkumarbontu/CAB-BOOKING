import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/auth/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import BookingConfirmation from './pages/BookingConfirmation';
import Feedback from './pages/Feedback';
import Private from './components/Private';
import BookRide from './pages/BookRide';
import MyBookings from './pages/MyBookings'
import AdminRiderManagement from './pages/admin/AdminRiderManagement';
import AdminDriverManagement from './pages/admin/AdminDriverManagement';
import AdminSystemControls from './pages/admin/AdminSystemControls';
import AdminCabManagement from './pages/admin/AdminCabManagement';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path='/user/dashboard' element={<UserDashboard />} />
      <Route path='/admin/dashboard' element={<AdminDashboard />} />
      <Route path='/book-ride' element={<BookRide/>}/>
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/admin/riders" element={<AdminRiderManagement/>}/>
      <Route path="/admin/drivers" element={<AdminDriverManagement/>}/>
      <Route path="/admin/cabs" element={<AdminCabManagement/>}/>
      <Route path="/admin/system" element={<AdminSystemControls/>}/>
      <Route path="/confirmation" element={<BookingConfirmation />} />
      <Route path="/book" element={<Private><BookRide /></Private>} />
      <Route path="/feedback" element={<Private><Feedback /></Private>} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default Router;
