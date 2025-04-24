import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import CarSelection from "./pages/CarSelection"
import CarDetailsPage from "./pages/CarDetails"
import LoginPage from "./components/LoginPage"
import SignupPage from "./components/SignupPage"
import Dashboard from "./pages/Dashboard"
import AuthTest from "./pages/AuthTest"
import BookingConfirmed from "./pages/BookingConfirmed"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"

// Import the main CSS file
import "./App.css"

// Create a wrapper component that provides the key
function RoutesWithKey() {
  const location = useLocation()
  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/car-selection" element={<CarSelection />} />
      <Route path="/car-details/:carId" element={<CarDetailsPage />} />
      <Route path="/booking-confirmed" element={<BookingConfirmed />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth-test" element={<AuthTest />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute adminOnly={true}>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <RoutesWithKey />
      </Router>
    </AuthProvider>
  )
}

export default App
