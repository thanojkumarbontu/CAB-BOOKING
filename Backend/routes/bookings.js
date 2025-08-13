const express = require('express');
const router = express.Router();
const Booking = require('../db/mybookings'); // Adjust path if needed

// ✅ Get all bookings for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ user: userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err });
  }
});
// ✅ Receive user feedback
router.post('/feedback', async (req, res) => {
  try {
    const { userId, feedback } = req.body;

    if (!userId || !feedback) {
      return res.status(400).json({ success: false, message: 'Missing userId or feedback' });
    }

    // You can optionally store it in DB if you have a Feedback model.
    console.log(`Feedback from User ${userId}: ${feedback}`);

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
