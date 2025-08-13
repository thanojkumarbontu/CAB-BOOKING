const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  selectedPickupState: String,
  selectedPickupCity: String,
  selectedDropState: String,
  selectedDropCity: String,
  pickupdate: String,
  pickuptime: String,
  dropdate: String,
  droptime: String,
  drivername: String,
  fare: String,
  carname: String,
  cartype: String,
  carno: String,
  price: String,
  
  // CRITICAL: User reference for filtering rides by user
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true // Make it required to ensure every booking has a user
  },
  userName: String,
  bookeddate: {
    type: String, 
    default: () => new Date().toLocaleDateString('hi-IN')
  },
  
  // Optional: Add status field for ride tracking
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'cancelled'],
    default: 'completed'
  }
});

module.exports = mongoose.model('mybookings', rideSchema);
