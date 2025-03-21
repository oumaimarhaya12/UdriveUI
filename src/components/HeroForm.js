"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/HeroForm.css"

const HeroForm = () => {
  const navigate = useNavigate()
  const [pickupDetails, setPickupDetails] = useState("")
  const [dropoffDetails, setDropoffDetails] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [dropoffDate, setDropoffDate] = useState("")
  const [dropoffTime, setDropoffTime] = useState("")
  const [minPickupDate, setMinPickupDate] = useState("")
  const [minDropoffDate, setMinDropoffDate] = useState("")
  const [dateError, setDateError] = useState("")
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)
  
  const pickupInputRef = useRef(null)
  const dropoffInputRef = useRef(null)
  const pickupSuggestionsRef = useRef(null)
  const dropoffSuggestionsRef = useRef(null)

  // Popular locations in Agadir
  const popularLocations = [
    "Agadir Al Massira Airport",
    "Agadir Beach",
    "Souk El Had d'Agadir",
    "Marina d'Agadir",
    "Agadir City Center",
    "Agadir Bus Station",
    "Taghazout Beach",
    "Tamraght Beach"
  ]

  const fetchAvailableCars = async () => {
    if (!pickupDate) return
    try {
      const response = await fetch(`http://localhost:8084/api/Cars?pickupDate=${pickupDate}T${pickupTime}`)
      console.log(`http://localhost:8084/api/Cars?pickupDate=${pickupDate}T${pickupTime}`)
      if (response.ok) {
        const result = await response.json()
        console.log(result)
      } else {
        console.log("No available cars ")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error)
    }
  }

  useEffect(() => {
    // Set tomorrow as the minimum pickup date (can't select today)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const formattedTomorrow = formatDateForInput(tomorrow)
    setMinPickupDate(formattedTomorrow)
    setMinDropoffDate(formattedTomorrow)

    // Load saved form data from sessionStorage if available
    const savedFormData = sessionStorage.getItem("bookingFormData")
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData)
      setPickupDetails(parsedData.pickupDetails || "")
      setDropoffDetails(parsedData.dropoffDetails || "")
      setPickupDate(parsedData.pickupDate || "")
      setPickupTime(parsedData.pickupTime || "")
      setDropoffDate(parsedData.dropoffDate || "")
      setDropoffTime(parsedData.dropoffTime || "")
    }

    // Add click outside listener to close dropdowns
    const handleClickOutside = (event) => {
      if (pickupSuggestionsRef.current && !pickupSuggestionsRef.current.contains(event.target) && 
          pickupInputRef.current && !pickupInputRef.current.contains(event.target)) {
        setShowPickupSuggestions(false)
      }
      
      if (dropoffSuggestionsRef.current && !dropoffSuggestionsRef.current.contains(event.target) && 
          dropoffInputRef.current && !dropoffInputRef.current.contains(event.target)) {
        setShowDropoffSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0]
  }

  const handlePickupDateChange = (e) => {
    const selectedDate = e.target.value
    setPickupDate(selectedDate)
    
    // Update minimum dropoff date to be at least one day after pickup
    const pickupDateObj = new Date(selectedDate)
    const nextDay = new Date(pickupDateObj)
    nextDay.setDate(pickupDateObj.getDate() + 1)
    const formattedNextDay = formatDateForInput(nextDay)
    setMinDropoffDate(formattedNextDay)

    // Clear dropoff date if it's now invalid
    if (dropoffDate && new Date(dropoffDate) <= pickupDateObj) {
      setDropoffDate("")
      setDateError("Drop-off date must be at least one day after pick-up date")
    } else {
      setDateError("")
    }
  }

  const handleDropoffDateChange = (e) => {
    const selectedDate = e.target.value
    const pickupDateObj = new Date(pickupDate)
    const dropoffDateObj = new Date(selectedDate)
    
    // Check if dropoff date is at least one day after pickup
    const timeDiff = dropoffDateObj.getTime() - pickupDateObj.getTime()
    const dayDiff = timeDiff / (1000 * 3600 * 24)
    
    if (dayDiff < 1) {
      setDateError("Drop-off date must be at least one day after pick-up date")
      return
    }

    setDropoffDate(selectedDate)
    setDateError("")
  }

  const handlePickupLocationChange = (e) => {
    setPickupDetails(e.target.value)
    setShowPickupSuggestions(true)
  }

  const handleDropoffLocationChange = (e) => {
    setDropoffDetails(e.target.value)
    setShowDropoffSuggestions(true)
  }

  const handleSelectPickupLocation = (location) => {
    setPickupDetails(location)
    setShowPickupSuggestions(false)
  }

  const handleSelectDropoffLocation = (location) => {
    setDropoffDetails(location)
    setShowDropoffSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!pickupDetails || !dropoffDetails || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime) {
      setDateError("Please fill in all fields")
      return
    }

    if (dateError) {
      return
    }

    // Validate that pickup and dropoff dates are not the same day
    const pickupDateObj = new Date(pickupDate)
    const dropoffDateObj = new Date(dropoffDate)
    const timeDiff = dropoffDateObj.getTime() - pickupDateObj.getTime()
    const dayDiff = timeDiff / (1000 * 3600 * 24)
    
    if (dayDiff < 1) {
      setDateError("Drop-off date must be at least one day after pick-up date")
      return
    }

    // Create an object with all the form data
    const formData = {
      pickupDetails,
      dropoffDetails,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
    }

    // Save the form data to sessionStorage
    sessionStorage.setItem("bookingFormData", JSON.stringify(formData))

    console.log("Form submitted:", formData)

    // Fetch available cars
    fetchAvailableCars()

    // Navigate to the car selection page
    navigate("/car-selection")
  }

  // Filter locations based on input
  const filteredPickupLocations = popularLocations.filter(location => 
    location.toLowerCase().includes(pickupDetails.toLowerCase())
  )
  
  const filteredDropoffLocations = popularLocations.filter(location => 
    location.toLowerCase().includes(dropoffDetails.toLowerCase())
  )

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Your Journey Starts with Udrive!</h1>
        <p className="hero-subtitle">Your freedom on four wheels—book, drive, and explore with ease.</p>
      </div>

      <div className="form-container">
        <h2 className="form-title">Book now</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Pick-up Location</label>
            <div className="location-input-container">
              <input
                type="text"
                placeholder="Enter pick-up Address in Agadir"
                className="form-input"
                value={pickupDetails}
                onChange={handlePickupLocationChange}
                onFocus={() => setShowPickupSuggestions(true)}
                ref={pickupInputRef}
                required
              />
              {showPickupSuggestions && filteredPickupLocations.length > 0 && (
                <div className="location-suggestions" ref={pickupSuggestionsRef}>
                  {filteredPickupLocations.map((location, index) => (
                    <div 
                      key={index} 
                      className="location-suggestion-item"
                      onClick={() => handleSelectPickupLocation(location)}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Drop-off Location</label>
            <div className="location-input-container">
              <input
                type="text"
                placeholder="Enter drop-off Address in Agadir"
                className="form-input"
                value={dropoffDetails}
                onChange={handleDropoffLocationChange}
                onFocus={() => setShowDropoffSuggestions(true)}
                ref={dropoffInputRef}
                required
              />
              {showDropoffSuggestions && filteredDropoffLocations.length > 0 && (
                <div className="location-suggestions" ref={dropoffSuggestionsRef}>
                  {filteredDropoffLocations.map((location, index) => (
                    <div 
                      key={index} 
                      className="location-suggestion-item"
                      onClick={() => handleSelectDropoffLocation(location)}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Pick-up Date & Time</label>
            <div className="date-time-wrapper">
              <input
                type="date"
                className="form-input date-input"
                value={pickupDate}
                onChange={handlePickupDateChange}
                min={minPickupDate}
                required
              />
              <select
                className="form-input time-input"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {`${i.toString().padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Drop-off Date & Time</label>
            <div className="date-time-wrapper">
              <input
                type="date"
                className="form-input date-input"
                value={dropoffDate}
                onChange={handleDropoffDateChange}
                min={minDropoffDate}
                required
              />
              <select
                className="form-input time-input"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {`${i.toString().padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {dateError && <div className="error-message">{dateError}</div>}
          <button type="submit" className="book-button">
            Book now
          </button>
        </form>
      </div>
    </div>
  )
}

export default HeroForm