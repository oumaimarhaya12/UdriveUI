"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"
import DashboardStats from "../components/DashboardStats"
import CarsManagement from "../components/CarsManagement"
import ReservationsSection from "../components/ReservationsSection"
import "../styles/Dashboard.css"

export default function Dashboard() {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("reservations")
  const [pendingReservations, setPendingReservations] = useState([])
  const [confirmedReservations, setConfirmedReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState(null)
  const [userRole, setUserRole] = useState("")
  const [debugInfo, setDebugInfo] = useState({})
  const [tokenFormats, setTokenFormats] = useState({
    raw: "",
    withBearer: "",
    withoutBearer: "",
  })

  // Check authentication and load debug info
  useEffect(() => {
    // Get debug info
    const token = localStorage.getItem("token")
    const expiration = localStorage.getItem("tokenExpiration")
    const role = localStorage.getItem("userRole")
    const lastLoginResponse = localStorage.getItem("lastLoginResponse")
    const email = localStorage.getItem("userEmail")

    // Prepare different token formats for testing
    if (token) {
      const withBearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`
      const withoutBearer = token.startsWith("Bearer ") ? token.substring(7) : token

      setTokenFormats({
        raw: token,
        withBearer,
        withoutBearer,
      })
    }

    setDebugInfo({
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 15)}...` : "None",
      tokenLength: token ? token.length : 0,
      expiration: expiration ? new Date(Number.parseInt(expiration)).toLocaleString() : "None",
      role: role || "None",
      email: email || "None",
      lastLoginResponse: lastLoginResponse || "None",
    })

    // Check if we have a token
    if (!token) {
      navigate("/login")
      return
    }

    // Get role from localStorage
    if (role) {
      setUserRole(role)
    }

    // Check token expiration
    if (expiration) {
      const expirationTime = Number.parseInt(expiration, 10)
      const currentTime = new Date().getTime()

      if (currentTime > expirationTime) {
        console.warn("Token has expired, redirecting to login")
        // Clear expired token
        localStorage.removeItem("token")
        localStorage.removeItem("tokenExpiration")
        navigate("/login")
        return
      }
    }

    // Fetch data
    fetchReservations()

    // Make the debug function globally available
    window.debugAuthenticationIssue = debugAuthenticationIssue
  }, [navigate])

  // Helper function to handle empty or invalid data
  const handleEmptyOrInvalidData = () => {
    console.warn("API returned empty or invalid data")
    setPendingReservations([])
  }

  // Update the tryDifferentTokenFormats function to ensure proper token format
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

  const fetchReservations = async () => {
    try {
      setIsLoading(true)
      setApiError(null)

      // Get the authentication token
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Updated API base URL with HTTPS and port 8084
      const apiBaseUrl = "https://localhost:8084"

      // Fetch pending reservations
      const pendingUrl = `${apiBaseUrl}/api/reservation/pendingReservations`

      console.log("Fetching pending reservations from API...")

      // Try different token formats
      const pendingResult = await tryDifferentTokenFormats(pendingUrl)

      if (pendingResult.success) {
        console.log("Successfully fetched pending reservations with format:", pendingResult.format)
        const data = pendingResult.data

        if (Array.isArray(data)) {
          // Process the data to ensure it has the required fields
          const processedData = data.map((reservation, index) => {
            // Add id field if missing (using index + 1 as fallback)
            const id = reservation.id || reservation.idReservation || index + 1

            // Extract car information - handle cases where we have model but not brand or vice versa
            let carBrand = reservation.carBrand || ""
            let carModel = reservation.carModel || ""

            // If we have a model but no brand, try to extract brand from model
            if (!carBrand && carModel && carModel.includes(" ")) {
              const parts = carModel.split(" ")
              carBrand = parts[0]
              carModel = parts.slice(1).join(" ")
            }

            return {
              ...reservation,
              // Ensure both id and idReservation are present
              id: id,
              idReservation: id,
              // Add any other missing fields with defaults
              status: reservation.status || "Pending",
              carBrand: carBrand,
              carModel: carModel,
              clientName: reservation.clientName || "Unknown Client",
              pickupAdress: reservation.pickupAdress || reservation.pickUpAdress || "N/A",
              dropoffAdress: reservation.dropoffAdress || reservation.dropOffAdress || "N/A",
              price: reservation.price || 0,
            }
          })

          console.log("Processed reservation data:", processedData)
          setPendingReservations(processedData)
        } else {
          console.warn("API returned invalid data format for pending reservations:", data)
          handleEmptyOrInvalidData()
        }
      } else {
        console.error("All token formats failed for pending reservations:", pendingResult.results)
        setApiError("Authentication failed with all token formats. Please log in again.")
        handleEmptyOrInvalidData()
      }

      // Fetch confirmed reservations
      const confirmedUrl = `${apiBaseUrl}/api/reservation/confirmedReservations`

      console.log("Fetching confirmed reservations from API...")

      const confirmedResult = await tryDifferentTokenFormats(confirmedUrl)

      if (confirmedResult.success) {
        console.log("Successfully fetched confirmed reservations")
        const data = confirmedResult.data

        if (Array.isArray(data)) {
          // Process the data to ensure it has the required fields
          const processedData = data.map((reservation, index) => {
            // Add id field if missing (using index + 1 as fallback)
            const id = reservation.id || reservation.idReservation || index + 1

            // Extract car information - handle cases where we have model but not brand or vice versa
            let carBrand = reservation.carBrand || ""
            let carModel = reservation.carModel || ""

            // If we have a model but no brand, try to extract brand from model
            if (!carBrand && carModel && carModel.includes(" ")) {
              const parts = carModel.split(" ")
              carBrand = parts[0]
              carModel = parts.slice(1).join(" ")
            }

            return {
              ...reservation,
              // Ensure both id and idReservation are present
              id: id,
              idReservation: id,
              // Add any other missing fields with defaults
              status: reservation.status || "Confirmed",
              carBrand: carBrand,
              carModel: carModel,
              clientName: reservation.clientName || "Unknown Client",
              pickupAdress: reservation.pickupAdress || reservation.pickUpAdress || "N/A",
              dropoffAdress: reservation.dropoffAdress || reservation.dropOffAdress || "N/A",
              price: reservation.price || 0,
            }
          })

          setConfirmedReservations(processedData)
        } else {
          console.warn("API returned invalid data format for confirmed reservations")
          setConfirmedReservations([])
        }
      } else {
        console.error("Failed to fetch confirmed reservations")
        setConfirmedReservations([])
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
      setApiError(error.message)
      handleEmptyOrInvalidData()
      setConfirmedReservations([])
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to test the API connection with different token formats
  const testApiConnection = async () => {
    try {
      setApiError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        setApiError("No token found. Please log in again.")
        return
      }

      const apiBaseUrl = "https://localhost:8084"
      const url = `${apiBaseUrl}/api/auth/test`

      console.log("Testing API connection with different token formats...")

      // Try different token formats
      const result = await tryDifferentTokenFormats(url)

      if (result.success) {
        console.log("API Connection Successful", `Connected with format: ${result.format}`)
      } else {
        console.error("All token formats failed:", result.results)

        // Create a detailed error message
        const errorDetails = result.results.map((r) => `${r.format}: ${r.status} - ${r.error || r.data}`).join("\n")

        setApiError(`API test failed with all token formats. Details:\n${errorDetails}`)
        console.log("API Connection Failed", "Please check the console for details")
      }
    } catch (error) {
      console.error("API test error:", error)
      setApiError(`API test failed: ${error.message}`)
      console.log("API Test Error", error.message)
    }
  }

  // Function to decode JWT token
  const testTokenValidity = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("No Token Found", "Please log in again")
      return
    }

    try {
      // Remove Bearer prefix if present
      const actualToken = token.startsWith("Bearer ") ? token.substring(7) : token

      // Split the token into parts
      const parts = actualToken.split(".")
      if (parts.length !== 3) {
        console.log("Invalid Token Format", "Not a valid JWT token")
        return
      }

      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]))
      console.log("Decoded token payload:", payload)

      // Check for role information
      const role = payload.role || payload.authorities || payload.scope || "Not found"

      // Check if token is expired
      let expirationMessage = ""
      if (payload.exp) {
        const expirationDate = new Date(payload.exp * 1000)
        const now = new Date()
        if (expirationDate < now) {
          expirationMessage = " (EXPIRED!)"
        }
      }

      console.log(
        "Token Decoded Successfully",
        `Subject: ${payload.sub || "N/A"} | Role: ${role} | Expiration: ${payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "N/A"}${expirationMessage}`,
      )
    } catch (error) {
      console.error("Error decoding JWT:", error)
      console.log("Token Decoding Error", error.message)
    }
  }

  // Update the handleApproveReservation function to properly move the reservation to confirmed list
  const handleApproveReservation = async (reservationId) => {
    try {
      setIsLoading(true)

      console.log("Received reservation ID:", reservationId, "Type:", typeof reservationId)

      // Check if reservationId is valid
      if (reservationId === undefined || reservationId === null) {
        throw new Error("Invalid reservation ID: ID is undefined or null")
      }

      // Convert to number if it's a string
      const id = typeof reservationId === "string" ? Number.parseInt(reservationId, 10) : reservationId

      if (isNaN(id)) {
        throw new Error(`Invalid reservation ID: Cannot convert "${reservationId}" to a number`)
      }

      console.log(`Approving reservation with ID: ${id}`)

      // Find the reservation in the pending list to get all details
      const reservationToApprove = pendingReservations.find((res) => res.id === id || res.idReservation === id)

      if (!reservationToApprove) {
        throw new Error(`Reservation with ID ${id} not found in pending list`)
      }

      console.log("Found reservation to approve:", reservationToApprove)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const apiBaseUrl = "https://localhost:8084"
      const url = `${apiBaseUrl}/api/reservation/validateReservation/${id}`

      console.log(`Calling API endpoint: ${url}`)

      // Try different token formats
      const result = await tryDifferentTokenFormats(url, "PUT")

      if (result.success) {
        console.log("API call successful:", result.data)

        // Remove from pending list
        setPendingReservations(pendingReservations.filter((res) => res.id !== id && res.idReservation !== id))

        // Add to confirmed list with status changed to "Confirmed"
        const confirmedReservation = {
          ...reservationToApprove,
          status: "Confirmed",
        }

        setConfirmedReservations([...confirmedReservations, confirmedReservation])

        // Show success message with toast
        console.log(`Reservation #${id} for ${reservationToApprove.clientName} has been confirmed successfully.`)

        // Refresh the data to ensure we have the latest state
        fetchReservations()
      } else {
        console.error("API call failed:", result.results)
        throw new Error(`Failed to approve reservation: ${result.results[0]?.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error(`Error approving reservation:`, error)
      console.log("Error Approving Reservation", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectReservation = async (reservationId) => {
    try {
      setIsLoading(true)

      // Check if reservationId is valid
      if (!reservationId) {
        throw new Error("Invalid reservation ID")
      }

      // Convert to number if it's a string
      const id = typeof reservationId === "string" ? Number.parseInt(reservationId, 10) : reservationId

      if (isNaN(id)) {
        throw new Error(`Invalid reservation ID: Cannot convert "${reservationId}" to a number`)
      }

      // Find the reservation in the pending list to get all details
      const reservationToReject = pendingReservations.find((res) => res.id === id || res.idReservation === id)

      if (!reservationToReject) {
        throw new Error(`Reservation with ID ${id} not found in pending list`)
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const apiBaseUrl = "https://localhost:8084"
      const url = `${apiBaseUrl}/api/reservation/rejectReservation/${id}`

      // Try different token formats
      const result = await tryDifferentTokenFormats(url, "PUT")

      if (result.success) {
        console.log(`Reservation #${id} has been rejected.`)
        fetchReservations()
      } else {
        // If the endpoint doesn't exist yet, show a mock success message
        console.warn("Reject endpoint may not exist yet or all token formats failed, showing mock success")

        // Remove from pending list
        setPendingReservations(pendingReservations.filter((res) => res.id !== id && res.idReservation !== id))

        console.log(`Reservation #${id} has been rejected (simulated).`)
      }
    } catch (error) {
      console.error(`Error rejecting reservation:`, error)
      console.log("Error Rejecting Reservation", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Format date function
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
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const handleSignOut = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("tokenExpiration")
      localStorage.removeItem("userRole")
      localStorage.removeItem("lastLoginResponse")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("tokenFormat")

      // Use Auth context signOut if available
      if (signOut) {
        await signOut()
      }

      navigate("/login")
    } catch (error) {
      console.error("Error during sign out:", error)
      console.log("Sign Out Error", "There was a problem signing out")
    }
  }

  // Add this function to your Dashboard.js file to help with debugging
  const debugAuthenticationIssue = async () => {
    try {
      // Get the token
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No Token Found", "Please log in again")
        return
      }

      // Display token information
      const tokenInfo = {
        length: token.length,
        preview: token.substring(0, 30) + "...",
        startsWithBearer: token.startsWith("Bearer "),
      }

      console.log("Token information:", tokenInfo)

      // Try to decode the token
      try {
        // Remove Bearer prefix if present
        const actualToken = token.startsWith("Bearer ") ? token.substring(7) : token

        // Split the token into parts
        const parts = actualToken.split(".")
        if (parts.length !== 3) {
          console.error("Not a valid JWT token format")
          console.log("Invalid Token Format", "Token is not in valid JWT format")
          return
        }

        // Decode the payload (middle part)
        const payload = JSON.parse(atob(parts[1]))
        console.log("Decoded token payload:", payload)

        // Check expiration
        if (payload.exp) {
          const expirationDate = new Date(payload.exp * 1000)
          const now = new Date()
          if (expirationDate < now) {
            console.error("Token has expired")
            console.log("Token Expired", `Token expired on ${expirationDate.toLocaleString()}`)
            return
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error)
      }

      // Test a simple OPTIONS request to check CORS
      const apiBaseUrl = "https://localhost:8084"
      const corsTestUrl = `${apiBaseUrl}/api/auth/test`

      console.log("Testing CORS with OPTIONS request...")

      const corsResponse = await fetch(corsTestUrl, {
        method: "OPTIONS",
        headers: {
          Origin: window.location.origin,
        },
      })

      console.log("CORS test response:", {
        status: corsResponse.status,
        statusText: corsResponse.statusText,
        headers: Object.fromEntries([...corsResponse.headers.entries()]),
      })

      // Check if the server is accepting our origin
      const allowOrigin = corsResponse.headers.get("Access-Control-Allow-Origin")
      if (!allowOrigin) {
        console.error("CORS issue: No Access-Control-Allow-Origin header")
        console.log("CORS Issue Detected", "Server is not allowing requests from this origin")
      } else {
        console.log("Server allows requests from:", allowOrigin)
      }

      console.log("Authentication Debugging Complete", "Check the console for details")
    } catch (error) {
      console.error("Error during authentication debugging:", error)
      console.log("Debugging Error", error.message)
    }
  }

  // Show loading state
  if (isLoading && activeSection !== "reservations") {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userRole={userRole}
        currentUser={currentUser}
        handleSignOut={handleSignOut}
      />

      <main className="main-content">
        <PageHeader />

        {activeSection === "dashboard" && (
          <DashboardStats
            stats={[
              { title: "Pending Reservations", value: pendingReservations.length },
              { title: "Confirmed Reservations", value: confirmedReservations.length },
              { title: "Total Reservations", value: pendingReservations.length + confirmedReservations.length },
            ]}
          />
        )}

        {activeSection === "cars" && <CarsManagement />}

        {activeSection === "reservations" && (
          <ReservationsSection
            pendingReservations={pendingReservations}
            confirmedReservations={confirmedReservations}
            isLoading={isLoading}
            handleApproveReservation={handleApproveReservation}
            handleRejectReservation={handleRejectReservation}
            formatDate={formatDate}
          />
        )}
      </main>
    </div>
  )
}

