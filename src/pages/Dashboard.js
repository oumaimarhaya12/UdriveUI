"use client"

import { useState, useEffect } from "react"
import { useNavigate, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Sidebar from "../components/Sidebar"
import DashboardStats from "../components/DashboardStats"
import CarsManagement from "../components/cars/CarsManagement"
import ReservationsSection from "../components/ReservationsSection"
import SettingsSection from "../components/SettingsSection"
import ThemeToggle from "../components/ThemeToggle"
import "../styles/dashboard.css"

// Import the API directly
const API_BASE_URL = "https://localhost:8084"

// Helper function to handle API requests with proper error handling
const apiRequest = async (url, options = {}) => {
  // Get the token
  const token = localStorage.getItem("token")
  if (!token) {
    console.error("No token found in localStorage")
    throw new Error("Authentication required")
  }

  try {
    const fetchOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      credentials: "include",
    }

    console.log(`Making API request to: ${API_BASE_URL}${url}`)
    const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    // Check if the response is JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    }

    return await response.text()
  } catch (error) {
    console.error(`API request failed: ${error.message}`)
    throw error
  }
}

// Create a local api object for this component
const api = {
  getPendingReservations: async () => {
    try {
      const result = await apiRequest("/api/reservation/pendingReservations")
      return result || []
    } catch (error) {
      console.error("Error fetching pending reservations:", error)
      return []
    }
  },

  getConfirmedReservations: async () => {
    try {
      const result = await apiRequest("/api/reservation/confirmedReservations")
      return result || []
    } catch (error) {
      console.error("Error fetching confirmed reservations:", error)
      return []
    }
  },

  approveReservation: async (reservationId) => {
    try {
      // Ensure we're using the correct ID format
      const id = typeof reservationId === "object" ? reservationId.idReservation || reservationId.id : reservationId
      console.log(`Approving reservation with ID: ${id}`)

      const result = await apiRequest(`/api/reservation/validateReservation/${id}`, {
        method: "PUT",
      })
      return result
    } catch (error) {
      console.error(`Error approving reservation ${reservationId}:`, error)
      throw error
    }
  },

  rejectReservation: async (reservationId) => {
    try {
      // Not implemented in backend, use cancel instead
      return await api.cancelReservation(reservationId)
    } catch (error) {
      console.error(`Error rejecting reservation ${reservationId}:`, error)
      throw error
    }
  },

  cancelReservation: async (reservationId) => {
    try {
      // Ensure we're using the correct ID format
      const id = typeof reservationId === "object" ? reservationId.idReservation || reservationId.id : reservationId
      console.log(`Cancelling reservation with ID: ${id}`)

      const result = await apiRequest(`/api/reservation/cancelReservation/${id}`, {
        method: "PUT",
      })
      return result
    } catch (error) {
      console.error(`Error cancelling reservation ${reservationId}:`, error)
      throw error
    }
  },
}

export default function Dashboard() {
  const { signOut } = useAuth()
  const [apiError, setApiError] = useState(null)
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [pendingReservations, setPendingReservations] = useState([])
  const [confirmedReservations, setConfirmedReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "false" ? false : true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true" ? true : false,
  )

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
      document.documentElement.classList.add("dark-mode")
      document.documentElement.classList.remove("light-mode")
    } else {
      document.body.classList.add("light-mode")
      document.body.classList.remove("dark-mode")
      document.documentElement.classList.add("light-mode")
      document.documentElement.classList.remove("dark-mode")
    }
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed)
  }, [sidebarCollapsed])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    // Check token expiration
    const expiration = localStorage.getItem("tokenExpiration")
    if (expiration) {
      const expirationTime = Number.parseInt(expiration, 10)
      const currentTime = new Date().getTime()

      if (currentTime > expirationTime) {
        console.warn("Token has expired, redirecting to login")
        localStorage.removeItem("token")
        localStorage.removeItem("tokenExpiration")
        navigate("/login")
        return
      }
    }

    // Fetch data
    fetchReservations()
  }, [navigate])

  const fetchReservations = async () => {
    try {
      setIsLoading(true)
      setApiError(null)

      console.log("Fetching reservations data...")

      // Fetch pending reservations
      const pendingData = await api.getPendingReservations()
      setPendingReservations(pendingData || [])
      console.log("Pending reservations:", pendingData)

      // Fetch confirmed reservations
      const confirmedData = await api.getConfirmedReservations()
      setConfirmedReservations(confirmedData || [])
      console.log("Confirmed reservations:", confirmedData)
    } catch (error) {
      console.error("Error fetching reservations:", error)
      setApiError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveReservation = async (reservationId) => {
    try {
      setIsLoading(true)
      console.log("Approving reservation:", reservationId)

      // Call the API to approve the reservation
      await api.approveReservation(reservationId)

      // Find the reservation in the pending list
      const reservationToApprove = pendingReservations.find((res) => res.idReservation === reservationId)

      if (reservationToApprove) {
        // Update state (optimistic update)
        setPendingReservations(pendingReservations.filter((res) => res.idReservation !== reservationId))

        setConfirmedReservations([...confirmedReservations, { ...reservationToApprove, status: "Confirmed" }])

        console.log(`Reservation #${reservationId} has been confirmed`)
      }

      // Refresh data
      fetchReservations()
    } catch (error) {
      console.error("Error approving reservation:", error)
      setApiError(`Failed to approve reservation: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectReservation = async (reservationId) => {
    try {
      setIsLoading(true)
      console.log("Rejecting reservation:", reservationId)

      // Call the API to reject the reservation
      await api.rejectReservation(reservationId)

      // Update state (optimistic update)
      setPendingReservations(pendingReservations.filter((res) => res.idReservation !== reservationId))

      console.log(`Reservation #${reservationId} has been rejected`)

      // Refresh data
      fetchReservations()
    } catch (error) {
      console.error("Error rejecting reservation:", error)
      setApiError(`Failed to reject reservation: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelReservation = async (reservationId) => {
    try {
      setIsLoading(true)
      console.log("Cancelling reservation:", reservationId)

      // Call the API to cancel the reservation
      await api.cancelReservation(reservationId)

      // Update state (optimistic update)
      setConfirmedReservations(confirmedReservations.filter((res) => res.idReservation !== reservationId))

      console.log(`Reservation #${reservationId} has been cancelled`)

      // Refresh data
      fetchReservations()
    } catch (error) {
      console.error("Error cancelling reservation:", error)
      setApiError(`Failed to cancel reservation: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("tokenExpiration")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userEmail")

      if (signOut) {
        await signOut()
      }

      navigate("/login")
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
        {apiError && (
          <div className="api-error-banner">
            <p>{apiError}</p>
            <button onClick={() => setApiError(null)}>Dismiss</button>
          </div>
        )}

        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userRole={localStorage.getItem("userRole") || ""}
          handleSignOut={handleSignOut}
          collapsed={sidebarCollapsed}
          darkMode={darkMode}
          toggleSidebar={toggleSidebar}
        />

        <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <div className="top-actions">
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>

          <div className="content-wrapper">
            <Routes>
              <Route
                index
                element={
                  <DashboardStats
                    pendingCount={pendingReservations.length}
                    confirmedCount={confirmedReservations.length}
                    darkMode={darkMode}
                  />
                }
              />
              <Route path="cars" element={<CarsManagement darkMode={darkMode} />} />
              <Route
                path="reservations"
                element={
                  <ReservationsSection
                    pendingReservations={pendingReservations}
                    confirmedReservations={confirmedReservations}
                    isLoading={isLoading}
                    handleApproveReservation={handleApproveReservation}
                    handleRejectReservation={handleRejectReservation}
                    handleCancelReservation={handleCancelReservation}
                    formatDate={formatDate}
                    darkMode={darkMode}
                  />
                }
              />
              <Route path="settings" element={<SettingsSection darkMode={darkMode} />} />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
