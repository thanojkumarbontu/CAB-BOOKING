const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
require('./db/config')
const users = require('./db/user')
const Car = require('./db/car')
const mybookings = require('./db/Mybookings')
const multer = require('multer');

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
const app = express();
app.use(express.json())
app.use(cors(
  {
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
  }
))

// FIXED: Simplified ObjectId validation function
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(id).length === 24;
};

// FIXED: Login endpoint - ensure proper ObjectId is returned
app.post('/login', async (req, resp) => {
  const {email, password, role} = req.body;
  
  try {
    const user = await users.findOne({ email: email });
    
    if (!user) {
      return resp.json({Status: "Error", message: "User not found"});
    }
    
    if (user.password !== password) {
      return resp.json({Status: "Error", message: "Incorrect password"});
    }
    
    if (role === 'admin' && user.role !== 'admin') {
      return resp.json({Status: "Error", message: "Access denied. Admin credentials required."});
    }
    
    // CRITICAL FIX: Ensure we return the actual MongoDB _id as userId
    const userIdString = user._id.toString();
    console.log('✅ User found:', userIdString); // Debug log
    
    return resp.json({
      Status: "Success", 
      user: {
        userId: userIdString,        // Convert ObjectId to string
        id: userIdString,           // Convert ObjectId to string  
        _id: userIdString,          // Convert ObjectId to string
        name: user.name, 
        email: user.email,
        role: role,
        actualRole: user.role || 'user'
      }
    });
    
  } catch (err) {
    console.error('❌ Login error:', err);
    resp.json({Status: "Error", message: "Login failed"});
  }
});

// Register endpoint
app.post('/register', async (req, resp) => {
  const { name, email, password, role } = req.body;
  
  try {
    const existingUser = await users.findOne({email: email});
    if (existingUser) {
      return resp.json("Already have an account");
    }
    
    await users.create({ 
      email: email, 
      name: name, 
      password: password,
      role: role || 'user'
    });
    
    resp.json("Account Created");
  } catch (err) {
    console.error('❌ Registration error:', err);
    resp.json("Registration failed");
  }
});

// FIXED: Dashboard statistics endpoint
app.get('/api/admin/statistics', async (req, res) => {
  try {
    console.log('📊 Fetching dashboard statistics...');
    
    // Get counts
    const totalUsers = await users.countDocuments({ role: { $ne: 'admin' } });
    const totalCars = await Car.countDocuments();
    const totalBookings = await mybookings.countDocuments();
    
    // Get total revenue with error handling
    let totalRevenue = 0;
    try {
      const revenueResult = await mybookings.aggregate([
        {
          $addFields: {
            fareNumber: { 
              $convert: { 
                input: "$fare", 
                to: "double", 
                onError: 0 
              } 
            }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$fareNumber" }
          }
        }
      ]);
      
      totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    } catch (revenueError) {
      console.log('⚠️ Revenue calculation failed, using 0:', revenueError.message);
    }
    
    // Get recent bookings count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentBookings = await mybookings.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const statistics = {
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentBookings,
      averageBookingValue: totalBookings > 0 ? Math.round((totalRevenue / totalBookings) * 100) / 100 : 0,
      activeUsers: totalUsers,
      completedRides: totalBookings
    };

    console.log('✅ Dashboard statistics fetched successfully:', statistics);
    res.json(statistics);
    
  } catch (error) {
    console.error('❌ Error fetching dashboard statistics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard statistics',
      details: error.message 
    });
  }
});

// FIXED: Get recent activities for admin dashboard
app.get('/api/admin/recent-activities', async (req, res) => {
  try {
    console.log('📋 Fetching recent activities...');
    
    // Get last 10 bookings with basic info
    const recentBookings = await mybookings.find()
      .sort({ _id: -1 })
      .limit(10)
      .select('selectedPickupCity selectedDropCity userName fare bookeddate')
      .lean(); // Use lean() for better performance

    // Get recently registered users (last 5)
    const recentUsers = await users.find({ role: { $ne: 'admin' } })
      .sort({ _id: -1 })
      .limit(5)
      .select('name email')
      .lean(); // Use lean() for better performance

    console.log('✅ Recent activities fetched successfully');
    
    res.json({
      recentBookings,
      recentUsers
    });
    
  } catch (error) {
    console.error('❌ Error fetching recent activities:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent activities',
      details: error.message 
    });
  }
});

// FIXED: Get rides endpoint with robust ObjectId validation
app.get('/getrides/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  console.log('📍 Received userId:', userId, 'Type:', typeof userId, 'Length:', userId?.length);
  
  // Validate userId parameter
  if (!userId) {
    console.log('❌ No userId provided');
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // Check if userId is a valid ObjectId format
  if (!isValidObjectId(userId)) {
    console.log('❌ Invalid ObjectId format:', userId);
    return res.status(400).json({ 
      error: 'Invalid user ID format',
      details: 'User ID must be a valid MongoDB ObjectId (24 hex characters)',
      received: userId,
      suggestion: 'Please logout and login again to get a valid session'
    });
  }
  
  try {
    console.log('✅ Valid ObjectId, fetching rides for user:', userId);
    
    // Query using string userId (mongoose will convert automatically)
    const userRides = await mybookings.find({ 
      userId: userId 
    }).sort({ 
      bookeddate: -1,
      _id: -1
    }).lean(); // Use lean() for better performance
    
    console.log(`✅ Found ${userRides.length} rides for user: ${userId}`);
    
    res.json(userRides);
  } catch (error) {
    console.error('❌ Error fetching user rides:', error);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// FIXED: Bookings endpoint with proper ObjectId validation
app.post('/bookings', async (req, res) => {
  const { 
    pickupState, pickupCity, dropState, dropCity, 
    pickupDate, pickupTime, dropDate, dropTime, 
    drivername, carname, cartype, carno, fare, 
    userId, userName, bookeddate 
  } = req.body;

  // Validate userId
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required for booking' });
  }

  if (!isValidObjectId(userId)) {
    console.error('❌ Invalid userId for booking:', userId);
    return res.status(400).json({ 
      error: 'Invalid user ID format',
      details: 'User ID must be a valid MongoDB ObjectId'
    });
  }

  try {
    const book = new mybookings({
      selectedPickupState: pickupState,
      selectedPickupCity: pickupCity,
      selectedDropState: dropState,
      selectedDropCity: dropCity,
      pickupdate: pickupDate,
      pickuptime: pickupTime,
      dropdate: dropDate,
      droptime: dropTime,
      drivername,
      carname,
      cartype,
      carno,
      fare,
      userId,
      userName,
      bookeddate: bookeddate || new Date().toLocaleDateString('hi-IN')
    });

    await book.save();
    console.log('✅ Booking created for user:', userId);
    res.status(201).json({ message: "Booking Created", bookingId: book._id });
  } catch (err) {
    console.error('❌ Booking creation error:', err);
    res.status(400).json({ error: 'Failed to create booking' });
  }
});

// FIXED: Alternative endpoint for MyBookings with validation
app.get('/api/bookings/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ 
      error: 'Invalid user ID format',
      details: 'User ID must be a valid MongoDB ObjectId'
    });
  }
  
  try {
    console.log('📡 Fetching bookings for user ID:', userId);
    
    const userBookings = await mybookings.find({ 
      userId: userId 
    }).sort({ 
      bookeddate: -1,
      _id: -1
    }).lean();
    
    // Map the data to match MyBookings.jsx expectations
    const mappedBookings = userBookings.map(booking => ({
      _id: booking._id,
      carName: booking.carname,
      driverName: booking.drivername,
      pickup: `${booking.selectedPickupCity}, ${booking.selectedPickupState}`,
      drop: `${booking.selectedDropCity}, ${booking.selectedDropState}`,
      date: booking.bookeddate,
      status: booking.status || 'Confirmed',
      fare: booking.fare,
      pickupDate: booking.pickupdate,
      pickupTime: booking.pickuptime,
      carType: booking.cartype,
      carNo: booking.carno
    }));
    
    console.log(`✅ Found ${mappedBookings.length} bookings for user: ${userId}`);
    
    res.json(mappedBookings);
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Users endpoints
app.get('/getusers/:id', async (req, res) => {
  try {
   const allUsers = await users.find();
   res.status(200).json(allUsers);
 } catch (error) {
   console.error('Error fetching users:', error);
   res.status(500).json({error: 'Internal server error'});
   }
});

app.get('/getuser/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await users.findById(id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/useredit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await users.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
    }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/userdelete/:id', async (req, res) => {
  const {id} = req.params;
  try {
    await users.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Car endpoints
app.post('/cars', upload.single('carImage'), async (req, res) => {
  const { drivername, carname, cartype, carno, price } = req.body;
  const carImage = req.file?.path;
  
  try {
    const car = new Car({drivername, carname, cartype, carno, carImage, price});
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create car' });
  }
});

app.get('/cars/:id', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/cars/all', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/car/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const car = await Car.findById(id);
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/acar/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const car = await Car.findById(id);
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/acaredit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const updatedCar = await Car.findByIdAndUpdate(id, {
      drivername: req.body.drivername,
      carname: req.body.carname,
      cartype: req.body.cartype,
      carno: req.body.carno,
      price: req.body.price
    }, { new: true });
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/cardelete/:id', async (req, res) => {
  const {id} = req.params;
  try {
    await Car.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete booking
app.delete('/usercardelete/:id', async (req, res) => {
  const {id} = req.params;
  
  try {
    const deletedBooking = await mybookings.findByIdAndDelete(id);
    
    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    console.log('✅ Deleted booking:', id);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoints
app.get('/api/admin/riders', async (req, res) => {
  try {
    const riders = await users.find();
    res.json(riders);
  } catch (error) {
    console.error('Error fetching riders:', error);
    res.status(500).json({ error: 'Failed to fetch riders' });
  }
});

app.delete('/api/admin/riders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await users.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting rider:', error);
    res.status(500).json({ error: 'Failed to delete rider' });
  }
});

app.get('/api/admin/bookings', async (req, res) => {
  try {
    const allBookings = await mybookings.find().sort({ bookeddate: -1 });
    res.json(allBookings);
  } catch (error) {
    console.error('Error fetching all bookings for admin:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.listen(8000, () => {
 console.log("listening at 8000")
})
