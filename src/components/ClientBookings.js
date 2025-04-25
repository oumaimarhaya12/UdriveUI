"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, MapPin, Car, AlertTriangle, CalendarIcon, Clock, CheckCircle, XCircle } from "lucide-react"
import "../styles/ClientBookings.css"

const ClientBookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  })

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return null
      }

      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join('')
      )

      const payload = JSON.parse(jsonPayload)
      console.log("JWT Payload:", payload) // Debug log
      
      // Check for different possible ID fields
      const userId = payload.id || payload.sub || payload.userId
      if (!userId) {
        throw new Error("No user ID found in token")
      }
      console.log(userId);
      return parseInt(userId) // Ensure it's a number
    } catch (error) {
      console.error("Error extracting user ID:", error)
      navigate("/login")
      return null
    }
  }

  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const userId = localStorage.getItem("userId")


      if (!userId) return

      console.log("Fetching bookings for user ID:", userId) // Debug log

      const response = await fetch(`https://localhost:8084/api/historique/client/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        let errorMessage = "Failed to fetch bookings"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          errorMessage = `${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("API Response:", data) // Debug log

      // Process the data to match our component's expected format
      const processedData = data.map((reservation) => ({
        id: reservation.idReservation,
        idReservation: reservation.idReservation,
        carModel: reservation.carModel || "Unknown Model",
        carBrand: reservation.carModel ? reservation.carModel.split(" ")[0] : "",
        pickupDate: reservation.pickupDate,
        dropoffDate: reservation.dropoffDate,
        pickupAdress: reservation.pickupAdress || "Not specified",
        dropoffAdress: reservation.dropoffAdress || "Not specified",
        price: reservation.price || 0,
        status: reservation.status,
      }))

      setBookings(processedData)
      setFilteredBookings(processedData)
    } catch (error) {
      console.error("Fetch error:", error)
      setError(error.message || "Failed to load your rentals. Please try again later.")
      
      // Clear any existing data when there's an error
      setBookings([])
      setFilteredBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    let filtered = [...bookings]

    // Apply status filter
    if (activeFilter === "upcoming") {
      filtered = filtered.filter(
        (booking) =>
          (booking.status === "Pending" || booking.status === "Confirmed") && 
          new Date(booking.pickupDate) > new Date()
      )
    } else if (activeFilter === "active") {
      const now = new Date()
      filtered = filtered.filter(
        (booking) =>
          booking.status === "Confirmed" && 
          new Date(booking.pickupDate) <= now && 
          new Date(booking.dropoffDate) >= now
      )
    } else if (activeFilter === "completed") {
      filtered = filtered.filter((booking) => booking.status === "Completed")
    } else if (activeFilter === "cancelled") {
      filtered = filtered.filter((booking) => 
        booking.status === "Canceled" || booking.status === "Declined"
      )
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)

      filtered = filtered.filter((booking) => {
        const pickupDate = new Date(booking.pickupDate)
        return pickupDate >= startDate && pickupDate <= endDate
      })
    }

    setFilteredBookings(filtered)
  }, [activeFilter, bookings, dateRange])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status, booking) => {
    switch (status) {
      case "Completed":
        return (
          <span className="status-badge completed">
            <CheckCircle size={14} className="status-icon" />
            Completed
          </span>
        )
      case "Canceled":
      case "Declined":
        return (
          <span className="status-badge cancelled">
            <XCircle size={14} className="status-icon" />
            {status === "Canceled" ? "Canceled" : "Declined"}
          </span>
        )
      case "Confirmed":
        const now = new Date()
        const pickupDate = new Date(booking?.pickupDate)
        const dropoffDate = new Date(booking?.dropoffDate)

        if (now >= pickupDate && now <= dropoffDate) {
          return (
            <span className="status-badge active">
              <Clock size={14} className="status-icon" />
              Active
            </span>
          )
        } else {
          return (
            <span className="status-badge upcoming">
              <Calendar size={14} className="status-icon" />
              Upcoming
            </span>
          )
        }
      case "Pending":
        return (
          <span className="status-badge upcoming">
            <Calendar size={14} className="status-icon" />
            Pending
          </span>
        )
      default:
        return (
          <span className="status-badge upcoming">
            <Calendar size={14} className="status-icon" />
            {status || "Unknown"}
          </span>
        )
    }
  }

  const determineStatus = (booking) => {
    if (!booking.status) return "Unknown"
    
    const status = booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()
    
    if (status === "Canceled" || status === "Declined") return "Canceled"
    if (status === "Completed") return "Completed"
    if (status === "Pending") return "Pending"

    if (status === "Confirmed") {
      const now = new Date()
      const pickupDate = new Date(booking.pickupDate)
      const dropoffDate = new Date(booking.dropoffDate)

      if (now < pickupDate) return "Upcoming"
      if (now >= pickupDate && now <= dropoffDate) return "Active"
    }

    return status
  }

  if (isLoading) {
    return (
      <div className="client-bookings-loading">
        <div className="loading-spinner"></div>
        <p>Loading your rentals...</p>
      </div>
    )
  }

  return (
    <div className="client-bookings-container">
      <div className="client-bookings-header">
        <div>
          <h1 className="client-bookings-title">My Rentals</h1>
          <p className="client-bookings-subtitle">
            View and manage your rental history, active bookings, and upcoming reservations
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All Rentals
        </button>
        <button
          className={`filter-tab ${activeFilter === "active" ? "active" : ""}`}
          onClick={() => setActiveFilter("active")}
        >
          Active
        </button>
        <button
          className={`filter-tab ${activeFilter === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveFilter("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`filter-tab ${activeFilter === "completed" ? "active" : ""}`}
          onClick={() => setActiveFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`filter-tab ${activeFilter === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveFilter("cancelled")}
        >
          Cancelled
        </button>

        <div className="date-filter">
          <div className="date-input-group">
            <label>From:</label>
            <input
              type="date"
              value={dateRange.start || ""}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label>To:</label>
            <input
              type="date"
              value={dateRange.end || ""}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="date-input"
            />
          </div>
          {(dateRange.start || dateRange.end) && (
            <button className="clear-dates-button" onClick={() => setDateRange({ start: null, end: null })}>
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <Calendar size={64} className="no-bookings-icon" />
          <h2>No rentals found</h2>
          <p>
            {dateRange.start || dateRange.end
              ? "No rentals match your date criteria. Try adjusting your filters."
              : activeFilter !== "all"
                ? `You don't have any ${activeFilter} rentals.`
                : "You haven't made any rentals yet."}
          </p>
          <button className="book-now-button" onClick={() => navigate("/car-selection")}>
            Rent a car now
          </button>
        </div>
      ) : (
        <div className="rentals-grid">
          {filteredBookings.map((booking) => {
            const status = booking.status || determineStatus(booking)

            return (
              <div key={booking.id} className="rental-card">
                <div className="rental-card-header">
                  <div className="car-model">
                    <Car size={20} className="car-icon" />
                    <h3>{`${booking.carBrand || ""} ${booking.carModel || "Unknown Car"}`}</h3>
                  </div>
                  {getStatusBadge(status, booking)}
                </div>

                <div className="rental-card-details">
                  <div className="rental-dates">
                    <CalendarIcon size={16} className="detail-icon" />
                    <div>
                      <div className="date-label">Pickup: {formatDate(booking.pickupDate)}</div>
                      <div className="date-label">Return: {formatDate(booking.dropoffDate)}</div>
                    </div>
                  </div>

                  <div className="rental-locations">
                    <MapPin size={16} className="detail-icon" />
                    <div>
                      <div className="location-label">From: {booking.pickupAdress || "Not specified"}</div>
                      <div className="location-label">To: {booking.dropoffAdress || "Not specified"}</div>
                    </div>
                  </div>
                </div>

                <div className="rental-price">
                  <span>Total: </span>
                  <span className="price-value">{booking.price}MAD</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ClientBookings