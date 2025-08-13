# RideEase - Cab Booking Frontend

A modern, responsive React frontend for the RideEase cab booking application. This application provides a seamless user experience for booking rides, managing profiles, and viewing ride history.

## Features

### User Features
- **User Authentication**: Register, login, and logout functionality
- **Dashboard**: Overview of user statistics and recent bookings
- **Book Ride**: Multi-step booking process with location selection and car choice
- **Ride History**: View and manage past bookings with filtering and search
- **Profile Management**: Update personal information and view account statistics

### Admin Features
- **Admin Dashboard**: Overview of platform statistics and recent activity
- **User Management**: View, search, and delete user accounts
- **Car Management**: Add, edit, and delete cars with driver information

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Real-time Updates**: Live data updates and notifications
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: User-friendly error messages and loading states

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **React Toastify**: Toast notifications for user feedback
- **CSS3**: Modern styling with Flexbox and Grid
- **Responsive Design**: Mobile-first approach

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Backend server running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (not recommended)

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── Login.js
│   │   ├── Login.css
│   │   ├── Register.js
│   │   ├── Register.css
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── BookRide.js
│   │   ├── BookRide.css
│   │   ├── RideHistory.js
│   │   ├── RideHistory.css
│   │   ├── Profile.js
│   │   ├── Profile.css
│   │   ├── AdminDashboard.js
│   │   ├── AdminDashboard.css
│   │   ├── CarManagement.js
│   │   ├── CarManagement.css
│   │   ├── UserManagement.js
│   │   └── UserManagement.css
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /login` - User login
- `POST /register` - User registration

### User Management
- `GET /getusers/:id` - Get all users (admin)
- `GET /getuser/:id` - Get specific user
- `PUT /useredit/:id` - Update user profile
- `DELETE /userdelete/:id` - Delete user (admin)

### Car Management
- `GET /cars/:id` - Get all cars
- `POST /cars` - Add new car (admin)
- `PUT /acaredit/:id` - Update car (admin)
- `DELETE /cardelete/:id` - Delete car (admin)

### Booking Management
- `GET /getrides/:userId` - Get user's bookings
- `POST /rides/:id` - Create new booking
- `DELETE /usercardelete/:id` - Delete booking

## Key Components

### Authentication Context
The `AuthContext` provides global state management for user authentication, including:
- User login/logout functionality
- User data persistence
- Protected route handling

### Navigation
The `Navbar` component provides:
- Responsive navigation menu
- Dynamic links based on authentication status
- User logout functionality

### Booking Flow
The `BookRide` component implements a 3-step booking process:
1. **Location Selection**: Pickup and drop-off locations
2. **Schedule Selection**: Date and time selection
3. **Car Selection**: Choose from available cars

## Styling

The application uses:
- **CSS Modules**: Component-specific styling
- **Flexbox & Grid**: Modern layout techniques
- **CSS Variables**: Consistent color scheme and spacing
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Enhanced user experience

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
