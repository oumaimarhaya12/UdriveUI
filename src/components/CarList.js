"use client"

import { useState, useEffect } from "react"
import { Fuel, Calendar, Settings } from "lucide-react"
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
          `http://localhost:8084/api/Cars?pickupDate=${bookingData.pickupDate}T${bookingData.pickupTime}`,
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
          const price = car.pricePerDay || car.price || car.dailyRate || 0
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

      // Apply category filter
      if (filters?.categories && filters.categories.length > 0) {
        result = result.filter((car) => {
          const category = getCarCategory(car).toLowerCase()
          return filters.categories.includes(category)
        })
      }

      setFilteredCars(result)
    }

    applyFilters()
  }, [cars, filters])

  // Function to get car category based on car model or other properties
  const getCarCategory = (car) => {
    // This is a placeholder. You should implement logic based on your data
    const compactCars = ["clio", "polo", "fiesta", "corsa"]
    const suvCars = ["qashqai", "tucson", "sportage", "rav4"]
    const luxuryCars = ["mercedes", "bmw", "audi", "lexus"]

    const model = (car.model || "").toLowerCase()

    if (compactCars.some((compact) => model.includes(compact))) return "compact"
    if (suvCars.some((suv) => model.includes(suv))) return "suv"
    if (luxuryCars.some((luxury) => model.includes(luxury))) return "luxury"

    return "standard" // Default category
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
          <div key={car.id || index} className="car-card">
            <div className="car-image">
              <img src={car.imageUrl || "/placeholder.svg?height=180&width=300"} alt={car.model || "Car"} />
            </div>
            <div className="car-details">
              <h3 className="car-name">{car.model || "Model"}</h3>

              <div className="car-price-container">
                <span className="price">{car.pricePerDay || car.price || car.dailyRate || 0}MAD</span>
                <span className="price-period">per day</span>
              </div>

              <div className="car-specs-container">
                <div className="spec-item">
                  <Calendar size={16} className="spec-icon" />
                  <span>{car.year || "2023"}</span>
                </div>
                <div className="spec-item">
                  <Settings size={16} className="spec-icon" />
                  <span>{car.transmission || "Manual"}</span>
                </div>
                <div className="spec-item">
                  <Fuel size={16} className="spec-icon" />
                  <span>{car.fuelType || "Gasoline"}</span>
                </div>
              </div>

              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarList

