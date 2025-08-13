import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './BookRide.css';

const BookRide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickupState: '',
    pickupCity: '',
    dropState: '',
    dropCity: '',
    pickupDate: '',
    pickupTime: '',
    dropDate: '',
    dropTime: '',
    selectedCar: null
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cars/all');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to load available cars');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCarSelect = (car) => {
    setBookingData(prev => ({
      ...prev,
      selectedCar: car
    }));
  };

  const nextStep = () => {
    if (step === 1 && (!bookingData.pickupState || !bookingData.pickupCity || !bookingData.dropState || !bookingData.dropCity)) {
      toast.error('Please fill in all location details');
      return;
    }
    if (step === 2 && (!bookingData.pickupDate || !bookingData.pickupTime || !bookingData.dropDate || !bookingData.dropTime)) {
      toast.error('Please fill in all schedule details');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleBooking = async () => {
    if (!bookingData.selectedCar) {
      toast.error('Please select a car');
      return;
    }

    setLoading(true);
    try {
      const bookingPayload = {
        pickupState: bookingData.pickupState,
        pickupCity: bookingData.pickupCity,
        dropState: bookingData.dropState,
        dropCity: bookingData.dropCity,
        pickupDate: bookingData.pickupDate,
        pickupTime: bookingData.pickupTime,
        dropDate: bookingData.dropDate,
        dropTime: bookingData.dropTime,
        drivername: bookingData.selectedCar.drivername,
        carname: bookingData.selectedCar.carname,
        cartype: bookingData.selectedCar.cartype,
        carno: bookingData.selectedCar.carno,
        fare: bookingData.selectedCar.price,
        userId: user.userId,
        userName: user.name,
        bookeddate: new Date().toISOString().split('T')[0]
      };

      const response = await axios.post('http://localhost:8000/bookings', bookingPayload);
      
      if (response.data === "Booking Created") {
        toast.success('Booking created successfully!');
        navigate('/ride-history');
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const cities = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur'],
    'Delhi': ['New Delhi', 'Old Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Vellore', 'Tiruchirappalli'],
    'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Adilabad', 'Khammam'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Ghaziabad'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kadapa'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Yamunanagar', 'Rohtak', 'Hisar'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Durg', 'Bilaspur', 'Korba', 'Jagdalpur'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur'],
    'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Kullu', 'Dharamshala', 'Bilaspur'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Mormugao'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul', 'Senapati'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar', 'Belonia', 'Khowai'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Lachung', 'Pelling'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Bomdila', 'Tezu', 'Ziro']
  };

  return (
    <div className="book-ride">
      <div className="container">
        <h1>Book Your Ride</h1>
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Location</span>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Schedule</span>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Car & Confirm</span>
          </div>
        </div>

        {/* Step 1: Location Selection */}
        {step === 1 && (
          <div className="booking-step">
            <h2>Select Pickup and Drop Locations</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Pickup State</label>
                <select
                  name="pickupState"
                  value={bookingData.pickupState}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Pickup City</label>
                <select
                  name="pickupCity"
                  value={bookingData.pickupCity}
                  onChange={handleInputChange}
                  required
                  disabled={!bookingData.pickupState}
                >
                  <option value="">Select City</option>
                  {bookingData.pickupState && cities[bookingData.pickupState]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Drop State</label>
                <select
                  name="dropState"
                  value={bookingData.dropState}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Drop City</label>
                <select
                  name="dropCity"
                  value={bookingData.dropCity}
                  onChange={handleInputChange}
                  required
                  disabled={!bookingData.dropState}
                >
                  <option value="">Select City</option>
                  {bookingData.dropState && cities[bookingData.dropState]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="step-actions">
              <button onClick={nextStep} className="btn-primary">
                Next: Schedule
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Schedule Selection */}
        {step === 2 && (
          <div className="booking-step">
            <h2>Select Pickup and Drop Schedule</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Pickup Date</label>
                <input
                  type="date"
                  name="pickupDate"
                  value={bookingData.pickupDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Pickup Time</label>
                <input
                  type="time"
                  name="pickupTime"
                  value={bookingData.pickupTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Drop Date</label>
                <input
                  type="date"
                  name="dropDate"
                  value={bookingData.dropDate}
                  onChange={handleInputChange}
                  min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Drop Time</label>
                <input
                  type="time"
                  name="dropTime"
                  value={bookingData.dropTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="step-actions">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button onClick={nextStep} className="btn-primary">
                Next: Select Car
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Car Selection and Confirmation */}
        {step === 3 && (
          <div className="booking-step">
            <h2>Select Your Car and Confirm Booking</h2>
            
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>From:</strong> {bookingData.pickupCity}, {bookingData.pickupState}
                </div>
                <div className="summary-item">
                  <strong>To:</strong> {bookingData.dropCity}, {bookingData.dropState}
                </div>
                <div className="summary-item">
                  <strong>Pickup:</strong> {bookingData.pickupDate} at {bookingData.pickupTime}
                </div>
                <div className="summary-item">
                  <strong>Drop:</strong> {bookingData.dropDate} at {bookingData.dropTime}
                </div>
              </div>
            </div>

            <div className="cars-grid">
              <h3>Available Cars</h3>
              
              {cars.map(car => (
                <div
                  key={car._id}
                  className={`car-card ${bookingData.selectedCar?._id === car._id ? 'selected' : ''}`}
                  onClick={() => handleCarSelect(car)}
                >
                  <div className="car-image">
                    {car.carImage ? (
                      <img src={`http://localhost:8000/${car.carImage}`} alt={car.carname} />
                    ) : (
                      <div className="car-placeholder">🚗</div>
                    )}
                  </div>
                  <div className="car-details">
                    <h4>{car.carname}</h4>
                    <p><strong>Type:</strong> {car.cartype}</p>
                    <p><strong>Driver:</strong> {car.drivername}</p>
                    <p><strong>Number:</strong> {car.carno}</p>
                    <p className="car-price">₹{car.price}</p>
                  </div>
                </div>
              ))}
             
            </div>

            {bookingData.selectedCar && (
              <div className="selected-car-summary">
                <h3>Selected Car</h3>
                <div className="selected-car">
                  <div className="car-info">
                    <h4>{bookingData.selectedCar.carname}</h4>
                    <p>{bookingData.selectedCar.cartype} • {bookingData.selectedCar.drivername}</p>
                    <p className="total-fare">Total Fare: ₹{bookingData.selectedCar.price}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="step-actions">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button 
                onClick={handleBooking} 
                className="btn-primary"
                disabled={!bookingData.selectedCar || loading}
              >
                {loading ? 'Creating Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRide; 