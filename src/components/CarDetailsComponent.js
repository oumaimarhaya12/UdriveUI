"use client"

import { useState, useEffect } from "react"
import { Fuel, Settings, Users, Wind, Tag, Car, DollarSign } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../styles/CarDetails.css"

// SVG gradient definition
const IconGradient = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#605ffa" />
        <stop offset="100%" stopColor="#9747FF" />
      </linearGradient>
    </defs>
  </svg>
)

const CarDetailsComponent = ({ carId }) => {
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingData, setBookingData] = useState(null)
  const [reservationLoading, setReservationLoading] = useState(false)
  const [reservationError, setReservationError] = useState(null)

  useEffect(() => {
    // Define fetchCarDetails inside useEffect to fix the dependency warning
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`https://localhost:8084/api/Cars/${carId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch car details")
        }

        const data = await response.json()
        setCar(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching car details:", err)
        setError("Failed to load car details. Please try again later.")
        setLoading(false)
      }
    }

    // Get the car data from sessionStorage if available
    const storedCar = sessionStorage.getItem("selectedCar")
    const storedBookingData = sessionStorage.getItem("bookingFormData")

    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData))
    }

    if (storedCar) {
      setCar(JSON.parse(storedCar))
      setLoading(false)
    } else {
      // If not in sessionStorage, fetch from API
      fetchCarDetails()
    }
  }, [carId]) // Now carId is the only dependency needed

  const calculateDays = () => {
    if (!bookingData) return 0

    const pickupDate = new Date(`${bookingData.pickupDate}T${bookingData.pickupTime}:00`)
    const dropoffDate = new Date(`${bookingData.dropoffDate}T${bookingData.dropoffTime}:00`)

    // Calculate the difference in milliseconds
    const diffTime = Math.abs(dropoffDate - pickupDate)

    // Convert to days and round up any partial day
    // 86400000 = 1000 * 60 * 60 * 24 (milliseconds in a day)
    return Math.ceil(diffTime / 86400000)
  }

  const calculateTotalPrice = () => {
    if (!car) return 0
    const days = calculateDays()
    return (car.price || 0) * days
  }
 
  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/booking-confirmed")
      navigate("/login")
      return
    }
  
    try {
      setReservationLoading(true)
      setReservationError(null)
  
      // Create the reservation data from actual bookingData rather than hardcoded values
      const reservationData = {
        puckUpAdress: bookingData?.pickupDetails || "Stains Paris, Paris",
        dropOffAdress: bookingData?.dropoffDetails || "Champs-Élysées, Paris",
        pickUpDate: bookingData?.pickupDate ? 
          ${bookingData.pickupDate}T${bookingData.pickupTime}:00 : 
          "2025-03-15T14:30:00",
        dropOffDate: bookingData?.dropoffDate ? 
          ${bookingData.dropoffDate}T${bookingData.dropoffTime}:00 : 
          "2025-03-20T18:00:00",
        idCar: car.id || carId,
        price: calculateTotalPrice(),
        token: token
      }
  
      console.log("Sending reservation data:", reservationData);
      
      // Check if your API is working with a test request
      const apiCheckResponse = await fetch("https://localhost:8084/api", {
        method: "GET",
        headers: { "Authorization": Bearer ${token} }
      }).catch(err => {
        console.error("API connectivity test failed:", err);
        throw new Error("Cannot connect to the reservation service. Please check your connection.");
      });
      
      // Make the actual reservation request
      const response = await fetch("https://localhost:8084/api/reservation/addreservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": Bearer ${token}
        },
        body: JSON.stringify(reservationData)
      });
  
      // Log the status and response for debugging
      console.log("Reservation response status:", response.status);
      const responseText = await response.text();
      console.log("Reservation response text:", responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        responseData = { message: responseText || "Server returned non-JSON response" };
      }
  
      if (!response.ok) {
        throw new Error(responseData.message || Request failed with status ${response.status});
      }
      
      // Success - navigate to confirmation page
      navigate("/booking-confirmed");
      
    } catch (err) {
      console.error("Reservation Error:", err);
      setReservationError(err.message || "Failed to create reservation. Please try again.");
      setReservationLoading(false);
    }
  }
    
  

  if (loading) {
    return <div className="loading">Loading car details...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!car) {
    return <div className="error">Car not found</div>
  }
  const getCarImageSrc = (car) => {
    if (!car.imageData) {
      return "/placeholder.svg?height=300&width=600"
    }
    
    if (car.imageData.startsWith('http')) {
      return car.imageData
    }
    
    if (car.imageData.startsWith('data:image')) {
      return car.imageData
    }
    
    try {
      return `data:image/jpeg;base64,${car.imageData}`
    } catch (error) {
      console.error("Error formatting car image:", error)
      return "/placeholder.svg?height=240&width=300"
    }
  }

  const days = calculateDays()

  // Custom icon style for gradient
  const iconStyle = { stroke: "url(#icon-gradient)" }

  return (
    <div className="car-details-page">
      <IconGradient />
      <div className="content-container">
        <div className="car-details-container">
          <div className="car-details-content">
            <div className="car-details-main">
              <div className="car-details-image">
                <img src={getCarImageSrc(car)} alt={car.model} />
              </div>

              <div className="car-details-info">
                <div>
                  <h1 className="car-details-name">{car.model}</h1>
                  <div className="car-details-category">{car.category}</div>

                  <div className="car-details-price">
                    <span className="price">{car.price}MAD</span>
                    <span className="price-period">per day</span>
                  </div>
                </div>

                <div className="car-attributes-section">
                  <h3>Car Details</h3>
                  <div className="car-attributes-grid">
                    <div className="attribute-item">
                      <Car className="attribute-icon" style={iconStyle} />
                      <div className="attribute-info">
                        <div className="attribute-label">Model</div>
                        <div className="attribute-value">{car.model}</div>
                      </div>
                    </div>

                    <div className="attribute-item">
                      <DollarSign className="attribute-icon" style={iconStyle} />
                      <div className="attribute-info">
                        <div className="attribute-label">Price</div>
                        <div className="attribute-value">{car.price} MAD/day</div>
                      </div>
                    </div>

                    <div className="attribute-item">
                      <Settings className="attribute-icon" style={iconStyle} />
                      <div className="attribute-info">
                        <div className="attribute-label">Transmission</div>
                        <div className="attribute-value">{car.transmissionType}</div>
                      </div>
                    </div>

                    <div className="attribute-item">
                      <Fuel className="attribute-icon" style={iconStyle} />
                      <div className="attribute-info">
                        <div className="attribute-label">Fuel Type</div>
                        <div className="attribute-value">{car.fuelType}</div>
                      </div>
                    </div>

                    <div className="attribute-item">
                      <Users className="attribute-icon" style={iconStyle} />
                      <div className="attribute-info">
                        <div className="attribute-label">Seats</div>
                        <div className="attribute-value">{car.seatsNumber} seats</div>
                      </div>
                    </div>

                    <div className="attribute-item">
                      <Wind className="attribute-icon" style={iconStyle} />
                      <div className="attribute-info">
                        <div className="attribute-label">Air Conditioning</div>
                        <div className="attribute-value">{car.airConditioner ? "Yes" : "No"}</div>
                      </div>
                    </div>

                    <div className="attribute-item">
                      <Tag className="attribute-icon" style={iconStyle} />
                      <div className="attribute-info">
                        <div className="attribute-label">Category</div>
                        <div className="attribute-value">{car.category}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {bookingData && (
              <div className="booking-summary-box">
                <h3>Price Summary</h3>
                <div className="price-summary">
                  <div className="price-row">
                    <span>Daily Rate:</span>
                    <span>{car.price} MAD</span>
                  </div>
                  <div className="price-row">
                    <span>Number of Days:</span>
                    <span>{days} days</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Price:</span>
                    <span>{calculateTotalPrice()} MAD</span>
                  </div>
                </div>
                <button 
                  className="confirm-btn" 
                  onClick={handleConfirmBooking}
                  disabled={reservationLoading}
                >
                  {reservationLoading ? "Processing..." : "Confirm Booking"}
                </button>
                {reservationError && (
                  <div className="error-message">{reservationError}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailsComponent