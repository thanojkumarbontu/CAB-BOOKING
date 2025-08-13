import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async () => {
    if (!feedback) {
      alert('Please enter your feedback.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:9000/api/bookings/feedback', {
        userId: user?._id,
        feedback,
      });

      if (res.data.success) {
        alert('Thanks for your feedback!');
        setFeedback('');
      } else {
        alert('Something went wrong!');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Give Us Your Feedback</h2>
        <textarea
          placeholder="Write your experience here..."
          rows="5"
          cols="40"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
};

export default Feedback;
