"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import CarStatistics from "./CarStatistics"
import CarFilters from "./CarFilters"
import CarsTable from "./CarsTable"
import "../../styles/dashboard.css"

const CarsManagement = () => {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filters, setFilters] = useState({})

  // Try different token formats for API calls
  const tryDifferentTokenFormats = async (url, method = "GET", body = null) => {
    // Get the raw token
    const rawToken = localStorage.getItem("token")
    if (!rawToken) {
      return {
        success: false,
        results: [{ format: "No token", status: "Error", error: "No token found in localStorage" }],
      }
    }

    // Create different format versions
    const formats = [
      {
        name: "With Bearer prefix",
        token: `Bearer ${rawToken}`,
      },
      {
        name: "Without Bearer prefix",
        token: rawToken,
      },
      {
        name: "Raw token",
        token: rawToken,
      },
    ]

    const results = []

    for (const format of formats) {
      try {
        console.log(`Trying ${format.name}:`, format.token.substring(0, 20) + "...")

        const fetchOptions = {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: format.token,
          },
          credentials: "include",
        }

        // Add body if provided
        if (body) {
          fetchOptions.body = JSON.stringify(body)
        }

        const response = await fetch(url, fetchOptions)

        // Log the full response for debugging
        console.log(`Response for ${format.name}:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()]),
        })

        let responseData
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json()
        } else {
          responseData = await response.text()
        }

        const result = {
          format: format.name,
          status: response.status,
          success: response.ok,
          data: responseData,
        }

        results.push(result)
        console.log(`Result for ${format.name}:`, result)

        if (response.ok) {
          console.log(`Success with ${format.name}!`)
          // Save the successful format to localStorage for future use
          localStorage.setItem("tokenFormat", format.name === "With Bearer prefix" ? "withBearer" : "withoutBearer")
          return { success: true, format: format.name, data: result.data }
        }
      } catch (error) {
        console.error(`Error with ${format.name}:`, error)
        results.push({
          format: format.name,
          status: "Error",
          success: false,
          error: error.message,
        })
      }
    }

    return { success: false, results }
  }

  // Add this function after the tryDifferentTokenFormats function
  // Check token validity
  const checkTokenValidity = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      return { valid: false, error: "No token found" }
    }

    try {
      // Remove Bearer prefix if present
      const actualToken = token.startsWith("Bearer ") ? token.substring(7) : token

      // Split the token into parts
      const parts = actualToken.split(".")
      if (parts.length !== 3) {
        return { valid: false, error: "Invalid token format" }
      }

      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]))
      console.log("Decoded token payload:", payload)

      // Check if token is expired
      if (payload.exp) {
        const expirationDate = new Date(payload.exp * 1000)
        const now = new Date()
        if (expirationDate < now) {
          return { valid: false, error: "Token has expired" }
        }
      }

      // Check for role information
      const roles = payload.role || payload.roles || payload.authorities || []
      console.log("User roles from token:", roles)

      return { valid: true, payload, roles }
    } catch (error) {
      console.error("Error decoding token:", error)
      return { valid: false, error: "Error decoding token" }
    }
  }

  // Fetch cars from API
  const fetchCars = async () => {
    try {
      setIsRefreshing(true)
      setError(null)

      // Get the authentication token
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const apiBaseUrl = "https://localhost:8084"
      const url = `${apiBaseUrl}/api/car/getAllCars`

      // Try different token formats
      const result = await tryDifferentTokenFormats(url)

      if (result.success) {
        console.log("Successfully fetched cars:", result.data)
        setCars(result.data)
        setFilteredCars(result.data)
      } else {
        console.error("Failed to fetch cars:", result.results)
        setError("Failed to load cars. Please try again.")
      }
    } catch (error) {
      console.error("Error fetching cars:", error)
      setError(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  // Update the toggleCarAvailability function to include token validation
  // Replace the toggleCarAvailability function with this updated version
  const toggleCarAvailability = async (carId) => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if we have a valid car ID
      if (!carId) {
        throw new Error("Invalid car ID")
      }

      console.log(`Attempting to toggle availability for car: ${carId}`)

      // Validate token before making the request
      const tokenStatus = checkTokenValidity()
      if (!tokenStatus.valid) {
        console.error("Token validation failed:", tokenStatus.error)

        // Instead of showing an error, update the UI optimistically
        // This allows the user to continue using the interface even if the API call fails
        setCars((prevCars) =>
          prevCars.map((car) => {
            if (car.model === carId || car.idCar === carId) {
              console.log(`Optimistically updating car ${carId} status from ${car.status} to ${!car.status}`)
              return { ...car, status: !car.status }
            }
            return car
          }),
        )

        setFilteredCars((prevCars) =>
          prevCars.map((car) => {
            if (car.model === carId || car.idCar === carId) {
              return { ...car, status: !car.status }
            }
            return car
          }),
        )

        setIsLoading(false)
        setError(`Authentication issue: ${tokenStatus.error}. Status updated locally only.`)
        return
      }

      const apiBaseUrl = "https://localhost:8084"
      const url = `${apiBaseUrl}/api/car/SwitchCarStatus/${carId}`
      console.log(`Calling API endpoint: ${url}`)

      // Try different token formats
      const result = await tryDifferentTokenFormats(url, "PUT")

      if (result.success) {
        console.log("Successfully toggled car availability:", result.data)

        // Update the car status in the local state
        setCars((prevCars) =>
          prevCars.map((car) => {
            if (car.model === carId || car.idCar === carId) {
              return { ...car, status: !car.status }
            }
            return car
          }),
        )

        // Update filtered cars as well
        setFilteredCars((prevCars) =>
          prevCars.map((car) => {
            if (car.model === carId || car.idCar === carId) {
              return { ...car, status: !car.status }
            }
            return car
          }),
        )

        // Show success notification
        console.log(`Car status updated successfully for ${carId}`)
      } else {
        console.error("Failed to toggle car availability:", result.results)

        // Even if the API call fails, update the UI optimistically
        setCars((prevCars) =>
          prevCars.map((car) => {
            if (car.model === carId || car.idCar === carId) {
              console.log(`Optimistically updating car ${carId} status from ${car.status} to ${!car.status}`)
              return { ...car, status: !car.status }
            }
            return car
          }),
        )

        setFilteredCars((prevCars) =>
          prevCars.map((car) => {
            if (car.model === carId || car.idCar === carId) {
              return { ...car, status: !car.status }
            }
            return car
          }),
        )

        setError("API call failed, but status updated locally. Changes won't persist after refresh.")
      }
    } catch (error) {
      console.error("Error toggling car availability:", error)
      setError(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters to cars
  const applyFilters = (newFilters) => {
    setFilters(newFilters)

    const filtered = cars.filter((car) => {
      // Category filter
      if (newFilters.category && car.category !== newFilters.category) return false

      // Fuel type filter
      if (newFilters.fuelType && car.fuelType !== newFilters.fuelType) return false

      // Transmission filter
      if (newFilters.transmissionType && car.transmissionType !== newFilters.transmissionType) return false

      // Status filter
      if (newFilters.status !== undefined && car.status !== newFilters.status) return false

      // Price range filter
      if (newFilters.minPrice && car.price < newFilters.minPrice) return false
      if (newFilters.maxPrice && car.price > newFilters.maxPrice) return false

      return true
    })

    setFilteredCars(filtered)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({})
    setFilteredCars(cars)
  }

  // Load cars on component mount
  useEffect(() => {
    fetchCars()
  }, [])

  return (
    <div className="cars-management-section">
      <div className="modern-header">
        <h2>Cars Management</h2>
        <button className={`modern-refresh ${isRefreshing ? "refreshing" : ""}`} onClick={fetchCars}>
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <CarStatistics cars={cars} />

      <CarFilters cars={cars} filters={filters} onApplyFilters={applyFilters} onResetFilters={resetFilters} />

      <CarsTable
        cars={filteredCars}
        allCars={cars}
        isLoading={isLoading}
        error={error}
        onToggleAvailability={toggleCarAvailability}
        onRetry={fetchCars}
      />
    </div>
  )
}

export default CarsManagement
