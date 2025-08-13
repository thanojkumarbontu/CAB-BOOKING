const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); 
const bookingRoutes = require('./routes/bookings');
const carRoutes = require('./routes/cars');
const adminRoutes = require('./routes/admin');

const app = express(); 

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/Music-Player') 
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(() => {
        console.log("Error in connecting to MongoDB");
    });

// Use all routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cars', carRoutes);    
app.use('/api/admin', adminRoutes);  // ✅ This includes the GET /cars route for admin

app.get('/', (req, res) => {
    res.send('Welcome to the backend demo');
});

app.listen(9000, () => {
    console.log("Server is listening on port 9000");
});
