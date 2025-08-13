const express = require('express');
const router = express.Router();
const Car = require('../db/car');
const User = require('../db/user');
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});
// GET all cars
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
});
router.post('/addcar', async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (error) {
    res.status(500).json({ message: "Error adding car", error });
  }
});
// UPDATE car
router.put('/updatecar/:id', async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id,req.body,{ new: true });
    res.json({ message: "Car updated successfully", updatedCar });
  } catch (error) {
    res.status(500).json({ message: "Error updating car", error });
  }
});

// ✅ DELETE car
router.delete('/deletecar/:id', async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ message: "Car deleted successfully", car: deletedCar });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error });
  }
});
// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

module.exports = router;
