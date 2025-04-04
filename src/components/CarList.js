"use client"

import { useState, useEffect } from "react"
import { Fuel, Settings, Tag } from "lucide-react"
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

        console.log("Fetching cars with booking data:", bookingData)

        // Format the date properly for LocalDateTime
        const formattedDateTime = `${bookingData.pickupDate}T${bookingData.pickupTime}:00`
        console.log("Formatted date time:", formattedDateTime)

        // Use HTTPS instead of HTTP since SSL is enabled on the server
        const response = await fetch(`https://localhost:8084/api/Cars?pickupDate=${formattedDateTime}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        console.log("API response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API error response:", errorText)
          throw new Error(`Failed to fetch available cars: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Fetched cars data:", data)
        setCars(data)
        setFilteredCars(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching cars:", err)

        // Fallback to mock data for development/testing
        const mockCars = [
          {
            idCar: 1,
            model: "Toyota Corolla",
            category: "sedan",
            price: 350,
            transmissionType: "Automatic",
            fuelType: "Gasoline",
            seatsNumber: 5,
            airConditioner: true,
            imageUrl: "/placeholder.svg?height=240&width=300",
          },
          {
            idCar: 2,
            model: "Honda Civic",
            category: "sedan",
            price: 380,
            transmissionType: "Automatic",
            fuelType: "Gasoline",
            seatsNumber: 5,
            airConditioner: true,
            imageUrl: "/placeholder.svg?height=240&width=300",
          },
          {
            idCar: 3,
            model: "Ford Explorer",
            category: "suv",
            price: 550,
            transmissionType: "Automatic",
            fuelType: "Diesel",
            seatsNumber: 7,
            airConditioner: true,
            imageUrl: "/placeholder.svg?height=240&width=300",
          },
        ]

        // Use mock data during development to test UI
        setCars(mockCars)
        setFilteredCars(mockCars)
        setLoading(false)

        // Also set error for debugging
        setError(`Failed to load available cars: ${err.message}. Using mock data instead.`)
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

      // Apply category filter
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
    // Save the selected car to sessionStorage for access on the details page
    sessionStorage.setItem("selectedCar", JSON.stringify(car))
    // Navigate using window.location
    window.location.href = `/car-details/${car.idCar || "default"}`
  }

  if (loading) {
    return <div className="loading">Loading available cars...</div>
  }

  if (error && !filteredCars.length) {
    return (
      <div className="error">
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => {
            setLoading(true)
            setError(null)
            // Retry fetching cars
            const fetchCars = async () => {
              try {
                const bookingData = JSON.parse(sessionStorage.getItem("bookingFormData") || "{}")

                if (!bookingData.pickupDate || !bookingData.pickupTime) {
                  setError("No booking information found")
                  setLoading(false)
                  return
                }

                const formattedDateTime = `${bookingData.pickupDate}T${bookingData.pickupTime}:00`

                const response = await fetch(`https://localhost:8084/api/Cars?pickupDate=${formattedDateTime}`)

                if (!response.ok) {
                  throw new Error("Failed to fetch available cars")
                }

                const data = await response.json()
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
          }}
        >
          Retry
        </button>
      </div>
    )
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
              <img src={car.imageUrl || "/placeholder.svg?height=240&width=300"} alt={car.model || "Car"} />
            </div>
            <div className="car-details">
              <h3 className="car-name">{car.model || "Unknown Model"}</h3>

              <div className="car-price-container">
                <span className="price">{car.price || 0}MAD</span>
                <span className="price-period">per day</span>
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

