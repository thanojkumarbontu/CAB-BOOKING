const mongoose = require('mongoose');
const User = require('./db/user');

mongoose.connect('mongodb://127.0.0.1:27017/Cab-Booking')
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const createAdmin = async () => {
  try {
    const adminEmail = "varanasibadhrinadh@gmail.com"; // Your email
    
    // Check if THIS specific admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      // If user exists but is not admin, make them admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log("✅ Updated existing user to admin role!");
        console.log("📧 Email:", adminEmail);
        console.log("👤 Role: admin");
      } else {
        console.log("❌ This admin user already exists!");
        console.log("📧 Email:", adminEmail);
      }
      mongoose.connection.close();
      return;
    }
    
    // Create new admin user
    const admin = new User({
      name: "Badhrinadh",
      email: "varanasibadhrinadh@gmail.com",
      password: "123456",
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail); // Fixed the typo
    console.log("🔑 Password: 123456");
    console.log("👤 Role: admin");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    mongoose.connection.close();
  }
};

createAdmin();
