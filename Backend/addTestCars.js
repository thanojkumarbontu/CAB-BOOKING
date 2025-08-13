const mongoose = require('mongoose');
const Car = require('./db/car');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Cab-Booking')
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Test cars data
const testCars = [
  {
    drivername: "Rajesh Kumar",
    carname: "Toyota Innova",
    cartype: "SUV",
    carno: "MH-12-AB-1234",
    price: 2500
  },
  {
    drivername: "Amit Singh",
    carname: "Honda City",
    cartype: "Sedan",
    carno: "DL-01-CD-5678",
    price: 1800
  },
  {
    drivername: "Suresh Patel",
    carname: "Maruti Swift",
    cartype: "Hatchback",
    carno: "KA-02-EF-9012",
    price: 1200
  },
  {
    drivername: "Vikram Malhotra",
    carname: "Hyundai Creta",
    cartype: "SUV",
    carno: "TN-03-GH-3456",
    price: 2200
  },
  {
    drivername: "Deepak Sharma",
    carname: "Ford EcoSport",
    cartype: "SUV",
    carno: "AP-04-IJ-7890",
    price: 2000
  },
  {
    drivername: "Mohan Reddy",
    carname: "Tata Nexon",
    cartype: "Electric",
    carno: "TS-05-KL-2345",
    price: 2800
  }
];

// Function to add test cars
const addTestCars = async () => {
  try {
    // Clear existing cars
    await Car.deleteMany({});
    console.log("🗑️ Cleared existing cars");
    
    // Add new test cars
    const result = await Car.insertMany(testCars);
    console.log(`✅ Added ${result.length} test cars successfully!`);
    
    // Display added cars
    console.log("\n📋 Added Cars:");
    result.forEach((car, index) => {
      console.log(`${index + 1}. ${car.carname} - ${car.drivername} - ₹${car.price}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error adding test cars:", error);
    mongoose.connection.close();
  }
};

// Run the script
addTestCars(); 