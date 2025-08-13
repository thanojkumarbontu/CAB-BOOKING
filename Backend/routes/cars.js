const express = require('express');
const router = express.Router();
const Car = require('../db/car'); // Adjust the path if different

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

module.exports = router;
