"use client"

import { useState, useEffect } from "react"
import { Fuel, Settings, Tag, Users } from "lucide-react"
import "../styles/CarList.css"

const CarList = ({ filters }) => {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Get booking data from sessionStorage
        const bookingData = JSON.parse(sessionStorage.getItem("bookingFormData") || "{}")

        if (!bookingData.pickupDate || !bookingData.pickupTime) {
          setError("No booking information found")
          setLoading(false)
          return
        }

        const response = await fetch(
          `https://localhost:8084/api/client/GetCars?pickupDate=${bookingData.pickupDate}T${bookingData.pickupTime}`,
          {
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error("Failed to fetch available cars")
        }

        const data = await response.json()
        console.log("Fetched cars data:", data)
        setCars(data)
        setFilteredCars(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching cars:", err)
        setError("Failed to load available cars. Please try again later.")
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    if (!cars.length) return

    const applyFilters = () => {
      let result = [...cars]

      // Apply price filter
      if (filters?.priceRange) {
        result = result.filter((car) => {
          const price = car.price || 0
          return price >= filters.priceRange[0] && price <= filters.priceRange[1]
        })
      }

      // Apply fuel type filter
      if (filters?.fuelTypes && filters.fuelTypes.length > 0) {
        result = result.filter((car) => {
          const fuelType = (car.fuelType || "").toLowerCase()
          return filters.fuelTypes.some((type) => fuelType.includes(type))
        })
      }

      if (filters?.categories && filters.categories.length > 0) {
        result = result.filter((car) => {
          const category = (car.category || "").toLowerCase()
          return filters.categories.includes(category)
        })
      }

      setFilteredCars(result)
    }

    applyFilters()
  }, [cars, filters])

  const handleViewDetails = (car) => {
    sessionStorage.setItem("selectedCar", JSON.stringify(car))
    window.location.href = `/car-details/${car.idCar || "default"}`
  }

  const getCarImageSrc = (car) => {
    if (!car.imageData) {
      return "/placeholder.svg?height=300&width=600"
    }

    if (car.imageData.startsWith("http")) {
      return car.imageData
    }

    if (car.imageData.startsWith("data:image")) {
      return car.imageData
    }

    try {
      return `data:image/jpeg;base64,${car.imageData}`
    } catch (error) {
      console.error("Error formatting car image:", error)
      return "/placeholder.svg?height=240&width=300"
    }
  }

  if (loading) {
    return <div className="loading">Loading available cars...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (filteredCars.length === 0) {
    return (
      <div className="no-cars">
        No cars match your current filters. Try adjusting your filters or try a different date.
      </div>
    )
  }

  return (
    <div className="car-list-container">
      <div className="car-list-header">
        <h2>Available Cars</h2>
        <div className="car-count">{filteredCars.length} cars found</div>
      </div>

      <div className="car-list">
        {filteredCars.map((car, index) => (
          <div key={car.idCar || index} className="car-card">
            <div className="car-image">
              <img src={getCarImageSrc(car) || "/placeholder.svg"} alt={`${car.make || ""} ${car.model || "Car"}`} />
            </div>
            <div className="car-details">
              <div className="car-header">
                <h3 className="car-name">
                  <span className="car-make">{car.make || ""}</span>
                  <span className="car-model">{car.model || "Unknown Model"}</span>
                </h3>
                <div className="car-price-container">
                  <span className="price">{car.price || 0} MAD</span>
                  <span className="price-period">per day</span>
                </div>
              </div>

              <div className="car-specs-container">
                <div className="spec-item">
                  <Settings size={16} className="spec-icon" />
                  <span>{car.transmissionType || "Manual"}</span>
                </div>
                <div className="spec-item">
                  <Fuel size={16} className="spec-icon" />
                  <span>{car.fuelType || "Gasoline"}</span>
                </div>
                <div className="spec-item">
                  <Tag size={16} className="spec-icon" />
                  <span>{car.category || "Standard"}</span>
                </div>
                {car.seats && (
                  <div className="spec-item">
                    <Users size={16} className="spec-icon" />
                    <span>{car.seats} Seats</span>
                  </div>
                )}
              </div>

              <button className="view-details-btn" onClick={() => handleViewDetails(car)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarList
