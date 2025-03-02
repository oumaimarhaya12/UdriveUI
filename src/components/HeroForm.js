"use client"

import { useState, useEffect } from "react"
import "../styles/HeroForm.css"

const HeroForm = () => {
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [dropoffDate, setDropoffDate] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeInput, setActiveInput] = useState(null)
  const [minPickupDate, setMinPickupDate] = useState("")
  const [minDropoffDate, setMinDropoffDate] = useState("")
  const [dateError, setDateError] = useState("")

  // Set today's date as minimum date on component mount
  useEffect(() => {
    const today = new Date()
    const formattedToday = formatDateForInput(today)
    setMinPickupDate(formattedToday)
    setMinDropoffDate(formattedToday)
  }, [])

  // Format date as YYYY-MM-DD for input
  const formatDateForInput = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatAddress = (item) => {
    const parts = item.display_name.split(', ')
    // Find the most specific part (usually the first one) and Agadir
    const specificPart = parts[0]
    const agadirPart = parts.find(part => part.toLowerCase().includes('agadir'))
    
    // If the specific part already includes 'Agadir', just return it
    if (specificPart.toLowerCase().includes('agadir')) {
      return {
        id: item.place_id,
        address: specificPart
      }
    }
    
    // Otherwise, combine the specific part with Agadir
    return {
      id: item.place_id,
      address: agadirPart ? `${specificPart}, ${agadirPart}` : specificPart
    }
  }

  const searchLocations = async (query) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}+Agadir&limit=5&addressdetails=1`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch locations")
      }

      const data = await response.json()

      // Filter and format results to only include places in Agadir
      const agadirResults = data
        .filter((item) => item.display_name.toLowerCase().includes("agadir"))
        .map(formatAddress)

      setSuggestions(agadirResults)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
    }
  }

  const handleLocationChange = (e, isPickup) => {
    const value = e.target.value
    if (isPickup) {
      setPickupLocation(value)
    } else {
      setDropoffLocation(value)
    }
    searchLocations(value)
    setActiveInput(isPickup ? "pickup" : "dropoff")
  }

  const handleSelectLocation = (location) => {
    if (activeInput === "pickup") {
      setPickupLocation(location.address)
    } else {
      setDropoffLocation(location.address)
    }
    setShowSuggestions(false)
  }

  const handlePickupDateChange = (e) => {
    const selectedDate = e.target.value
    setPickupDate(selectedDate)
    
    // Update minimum drop-off date to be the same as pickup date
    setMinDropoffDate(selectedDate)
    
    // If dropoff date is now before pickup date, clear it
    if (dropoffDate && dropoffDate < selectedDate) {
      setDropoffDate("")
      setDateError("Drop-off date cannot be before pick-up date")
    } else {
      setDateError("")
    }
  }

  const handleDropoffDateChange = (e) => {
    const selectedDate = e.target.value
    
    // Validate that dropoff date is not before pickup date
    if (pickupDate && selectedDate < pickupDate) {
      setDateError("Drop-off date cannot be before pick-up date")
      return
    }
    
    setDropoffDate(selectedDate)
    setDateError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate) {
      setDateError("Please fill in all fields")
      return
    }
    
    if (dateError) {
      return
    }
    
    // Handle form submission
    console.log("Form submitted:", { pickupLocation, dropoffLocation, pickupDate, dropoffDate })
  }

  return (
    <div className="hero">
      {/* Hero Text */}
      <div className="hero-content">
        <h1 className="hero-title">Your Journey Starts with Udrive!</h1>
        <p className="hero-subtitle">
          Your freedom on four wheels—book, drive, and explore with ease.
        </p>
      </div>

      {/* Booking Form */}
      <div className="form-container">
        <h2 className="form-title">Book your car</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input 
              type="text" 
              placeholder="Pick-up Location" 
              className="form-input" 
              value={pickupLocation}
              onChange={(e) => handleLocationChange(e, true)}
              required
            />
            {showSuggestions && activeInput === "pickup" && (
              <div className="suggestions">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <div 
                      key={suggestion.id} 
                      className="suggestion-item"
                      onClick={() => handleSelectLocation(suggestion)}
                    >
                      {suggestion.address}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">No locations found</div>
                )}
              </div>
            )}
          </div>
          <div className="input-container">
            <input 
              type="text" 
              placeholder="Drop-off Location" 
              className="form-input" 
              value={dropoffLocation}
              onChange={(e) => handleLocationChange(e, false)}
              required
            />
            {showSuggestions && activeInput === "dropoff" && (
              <div className="suggestions">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <div 
                      key={suggestion.id} 
                      className="suggestion-item"
                      onClick={() => handleSelectLocation(suggestion)}
                    >
                      {suggestion.address}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">No locations found</div>
                )}
              </div>
            )}
          </div>
          <div className="date-inputs">
            <input 
              type="date" 
              className="form-input" 
              value={pickupDate}
              onChange={handlePickupDateChange}
              min={minPickupDate}
              placeholder="Pick-up Date"
              required
            />
            <input 
              type="date" 
              className="form-input" 
              value={dropoffDate}
              onChange={handleDropoffDateChange}
              min={minDropoffDate}
              placeholder="Drop-off Date"
              required
            />
          </div>
          {dateError && <div className="error-message">{dateError}</div>}
          <button type="submit" className="book-button">Book now</button>
        </form>
      </div>
    </div>
  )
}

export default HeroForm