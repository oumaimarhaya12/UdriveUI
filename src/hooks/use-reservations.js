"use client"

import { useState, useCallback } from "react"

export function useReservations() {
  const [pendingReservations, setPendingReservations] = useState([])
  const [confirmedReservations, setConfirmedReservations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [debugLogs, setDebugLogs] = useState([])

  // Helper function to add debug logs
  const addDebugLog = useCallback((message, data = null) => {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data) : null,
    }
    console.log(`[${timestamp}] ${message}`, data || "")
    setDebugLogs((prev) => [...prev, logEntry])
  }, [])

  // Helper function to handle empty or invalid data
  const handleEmptyOrInvalidData = useCallback(() => {
    console.warn("API returned empty or invalid data")
    setPendingReservations([])
  }, [])

  // Format date function
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Not specified"
    try {
      // Check if the date is valid
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }

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
  }, [])

  // Try different token formats for API calls
  const tryDifferentTokenFormats = useCallback(async (url, method = "GET", body = null) => {
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
  }, [])

  const fetchReservations = useCallback(async () => {
    try {
      setIsLoading(true)
      setApiError(null)
      addDebugLog("Starting fetchReservations")

      // Get the authentication token
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Updated API base URL with HTTPS and port 8084
      const apiBaseUrl = "https://localhost:8084"

      // Fetch pending reservations
      const pendingUrl = `${apiBaseUrl}/api/reservation/pendingReservations`

      addDebugLog("Fetching pending reservations from API", { url: pendingUrl })

      // Try different token formats
      const pendingResult = await tryDifferentTokenFormats(pendingUrl)

      if (pendingResult.success) {
        addDebugLog("Successfully fetched pending reservations", { format: pendingResult.format })
        const data = pendingResult.data

        if (Array.isArray(data)) {
          // Process the data to ensure it has the required fields
          const processedData = data.map((reservation, index) => {
            // Add id field if missing (using index + 1 as fallback)
            const id =  reservation.idReservation 

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
              id: reservation.idReservation,
              idReservation: reservation.idReservation,
              status: reservation.status || "Pending",
              carBrand: carBrand,
              carModel: carModel,
              clientName: reservation.clientName || "Unknown Client",
              pickupAdress: reservation.pickupAdress || reservation.pickUpAdress || "N/A",
              dropoffAdress: reservation.dropoffAdress || reservation.dropOffAdress || "N/A",
              price: reservation.price || 0,
            }
          })

          addDebugLog("Processed pending reservation data", { count: processedData.length })
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
      const apiBaseUrl1 = "https://localhost:8084"
      const confirmedUrl = `${apiBaseUrl1}/api/reservation/confirmedReservations`

      addDebugLog("Fetching confirmed reservations from API", { url: confirmedUrl })

      const confirmedResult = await tryDifferentTokenFormats(confirmedUrl)

      if (confirmedResult.success) {
        addDebugLog("Successfully fetched confirmed reservations")
        const data = confirmedResult.data

        if (Array.isArray(data)) {
          // Process the data to ensure it has the required fields
          // Note: The API now returns ConfirmedReservationDTO objects which don't include client name or price
          const processedData = data.map((reservation, index) => {
            // Extract car information from the model if available
            let carBrand = ""
            let carModel = reservation.carModel || "Unknown Vehicle"

            // If we have a model that includes a brand (like "Renault Clio"), extract it
            if (carModel && carModel.includes(" ")) {
              const parts = carModel.split(" ")
              carBrand = parts[0]
              carModel = parts.slice(1).join(" ")
            }

            return {
              id: reservation.idReservation, 
              idReservation: reservation.idReservation,
              status: "Confirmed",
              carBrand: carBrand,
              carModel: carModel,
              // Note: Client information is not available in ConfirmedReservationDTO
              pickupAdress: reservation.pickUpAdress || "N/A",
              dropoffAdress: reservation.dropOffAdress || "N/A",
              pickupDate: reservation.pickUpDate || null,
              dropoffDate: reservation.dropOffDate || null,
              // Note: Price is not available in ConfirmedReservationDTO
            }
          })

          addDebugLog("Processed confirmed reservation data", { count: processedData.length })
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
  }, [handleEmptyOrInvalidData, tryDifferentTokenFormats, addDebugLog])

  const handleApproveReservation = useCallback(
    async (reservationId) => {
      try {
        setIsLoading(true)

        addDebugLog("=== Starting Reservation Approval Process ===")
        addDebugLog("Received reservation ID", { id: reservationId, type: typeof reservationId })

        // Check if reservationId is valid
        if (reservationId === undefined || reservationId === null) {
          throw new Error("Invalid reservation ID: ID is undefined or null")
        }

        // Convert to number if it's a string
        const id = typeof reservationId === "string" ? Number.parseInt(reservationId, 10) : reservationId

        if (isNaN(id)) {
          throw new Error(`Invalid reservation ID: Cannot convert "${reservationId}" to a number`)
        }

        addDebugLog(`Approving reservation with ID: ${id}`)

        // Find the reservation in the pending list to get all details
        const reservationToApprove = pendingReservations.find((res) => res.id === id || res.idReservation === id)

        if (!reservationToApprove) {
          throw new Error(`Reservation with ID ${id} not found in pending list`)
        }

        addDebugLog("Found reservation to approve", reservationToApprove)

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication required")
        }

        const apiBaseUrl = "https://localhost:8084"
        const url = `${apiBaseUrl}/api/reservation/validateReservation/${id}`

        addDebugLog(`Calling API endpoint`, { url, method: "PUT" })

        // Try different token formats
        const result = await tryDifferentTokenFormats(url, "PUT")

        if (result.success) {
          addDebugLog("API call successful", result.data)

          // Remove from pending list immediately
          setPendingReservations((prev) => prev.filter((res) => res.id !== id && res.idReservation !== id))

          // Add to confirmed list with status changed to "Confirmed"
          const confirmedReservation = {
            ...reservationToApprove,
            status: "Confirmed",
          }

          setConfirmedReservations((prev) => [...prev, confirmedReservation])

          // Show success message with toast
          addDebugLog(`Reservation #${id} for ${reservationToApprove.clientName} has been confirmed successfully.`)
          addDebugLog("=== Reservation Approval Process Completed Successfully ===")

          // Fetch reservations to ensure our state is in sync with the backend
          setTimeout(() => {
            fetchReservations()
          }, 1000)

          return { success: true, message: `Reservation #${id} confirmed successfully.` }
        } else {
          addDebugLog("API call failed", result.results, "error")
          addDebugLog("=== Reservation Approval Process Failed ===", null, "error")
          throw new Error(`Failed to approve reservation: ${result.results[0]?.error || "Unknown error"}`)
        }
      } catch (error) {
        console.error(`Error approving reservation:`, error)
        addDebugLog("Error Approving Reservation", { error: error.message }, "error")
        return { success: false, error: error.message }
      } finally {
        setIsLoading(false)
      }
    },
    [pendingReservations, tryDifferentTokenFormats, addDebugLog, fetchReservations],
  )

  const handleRejectReservation = useCallback(
    async (reservationId) => {
      try {
        setIsLoading(true)
        addDebugLog("Starting reservation rejection process", { id: reservationId })

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
        // Use the new declineReservation endpoint
        const url = `${apiBaseUrl}/api/reservation/declineReservation/${id}`

        addDebugLog("Calling decline API endpoint", { url, method: "PUT" })

        // Try different token formats
        const result = await tryDifferentTokenFormats(url, "PUT")

        if (result.success) {
          addDebugLog(`Reservation #${id} has been declined.`, result.data)

          // Remove from pending list immediately
          setPendingReservations((prev) => prev.filter((res) => res.id !== id && res.idReservation !== id))

          // Fetch reservations to ensure our state is in sync with the backend
          setTimeout(() => {
            fetchReservations()
          }, 1000)

          return { success: true, message: `Reservation #${id} declined successfully.` }
        } else {
          addDebugLog("API call failed", result.results, "error")
          throw new Error(`Failed to decline reservation: ${result.results[0]?.error || "Unknown error"}`)
        }
      } catch (error) {
        console.error(`Error declining reservation:`, error)
        addDebugLog("Error Declining Reservation", { error: error.message }, "error")
        return { success: false, error: error.message }
      } finally {
        setIsLoading(false)
      }
    },
    [pendingReservations, tryDifferentTokenFormats, addDebugLog, fetchReservations],
  )

  const handleCancelReservation = useCallback(
    async (reservationId) => {
      try {
        setIsLoading(true)
        addDebugLog("Starting reservation cancellation process", { id: reservationId })

        // Check if reservationId is valid
        if (reservationId === undefined || reservationId === null) {
          throw new Error("Invalid reservation ID: ID is undefined or null")
        }

        // Convert to number if it's a string
        const id = typeof reservationId === "string" ? Number.parseInt(reservationId, 10) : reservationId

        if (isNaN(id)) {
          throw new Error(`Invalid reservation ID: Cannot convert "${reservationId}" to a number`)
        }

        addDebugLog(`Canceling reservation with ID: ${id}`)

        // Find the reservation in the confirmed list to get all details
        const reservationToCancel = confirmedReservations.find((res) => res.id === id || res.idReservation === id)

        if (!reservationToCancel) {
          throw new Error(`Reservation with ID ${id} not found in confirmed list`)
        }

        addDebugLog("Found reservation to cancel", reservationToCancel)

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication required")
        }

        const apiBaseUrl = "https://localhost:8084"
        const url = `${apiBaseUrl}/api/reservation/cancelReservation/${id}`

        addDebugLog(`Calling API endpoint`, { url, method: "PUT" })

        // Try different token formats
        const result = await tryDifferentTokenFormats(url, "PUT")

        if (result.success) {
          addDebugLog("API call successful", result.data)

          // Remove from confirmed list immediately
          setConfirmedReservations((prev) => prev.filter((res) => res.id !== id && res.idReservation !== id))

          // Fetch reservations to ensure our state is in sync with the backend
          setTimeout(() => {
            fetchReservations()
          }, 1000)

          return { success: true, message: `Reservation #${id} canceled successfully.` }
        } else {
          addDebugLog("API call failed", result.results, "error")
          throw new Error(`Failed to cancel reservation: ${result.results[0]?.error || "Unknown error"}`)
        }
      } catch (error) {
        console.error(`Error canceling reservation:`, error)
        addDebugLog("Error Canceling Reservation", { error: error.message }, "error")
        return { success: false, error: error.message }
      } finally {
        setIsLoading(false)
      }
    },
    [confirmedReservations, tryDifferentTokenFormats, addDebugLog, fetchReservations],
  )

  // Debug authentication issues
  const debugAuthenticationIssue = useCallback(async () => {
    try {
      // Get the token
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No Token Found", "Please log in again")
        return { success: false, error: "No token found" }
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
          return { success: false, error: "Token is not in valid JWT format" }
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
            return { success: false, error: `Token expired on ${expirationDate.toLocaleString()}` }
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error)
        return { success: false, error: `Error decoding token: ${error.message}` }
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
        return { success: false, error: "CORS Issue: Server is not allowing requests from this origin" }
      } else {
        console.log("Server allows requests from:", allowOrigin)
      }

      return { success: true, message: "Authentication debugging complete. Check console for details." }
    } catch (error) {
      console.error("Error during authentication debugging:", error)
      return { success: false, error: `Debugging error: ${error.message}` }
    }
  }, [])

  // Add this function to test the API connection
  const testApiConnection = useCallback(async () => {
    try {
      const apiBaseUrl = "https://localhost:8084"
      const url = `${apiBaseUrl}/api/reservation/pendingReservations`

      console.log("Testing API connection to:", url)

      const result = await tryDifferentTokenFormats(url)

      if (result.success) {
        console.log("API connection test successful!")
        return { success: true, message: "API connection test successful" }
      } else {
        console.error("API connection test failed:", result.results)
        return { success: false, error: "API connection test failed" }
      }
    } catch (error) {
      console.error("Error testing API connection:", error)
      return { success: false, error: error.message }
    }
  }, [tryDifferentTokenFormats])

  // Add a direct API call function to test the validateReservation endpoint
  const testValidateReservation = useCallback(
    async (reservationId) => {
      try {
        addDebugLog("Testing validateReservation endpoint directly", { id: reservationId })

        const apiBaseUrl = "https://localhost:8084"
        const url = `${apiBaseUrl}/api/reservation/validateReservation/${reservationId}`

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No token found")
        }

        // Try a direct fetch with Bearer token
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })

        addDebugLog("Direct API call response", {
          status: response.status,
          statusText: response.statusText,
        })

        if (response.ok) {
          const data = await response.json()
          addDebugLog("Validation successful", data)
          return { success: true, data }
        } else {
          const errorText = await response.text()
          addDebugLog("Validation failed", { error: errorText }, "error")
          return { success: false, error: errorText }
        }
      } catch (error) {
        addDebugLog("Error in direct validation test", { error: error.message }, "error")
        return { success: false, error: error.message }
      }
    },
    [addDebugLog],
  )

  return {
    pendingReservations,
    confirmedReservations,
    isLoading,
    apiError,
    formatDate,
    fetchReservations,
    handleApproveReservation,
    handleRejectReservation,
    handleCancelReservation,
    debugAuthenticationIssue,
    testApiConnection,
    testValidateReservation,
    debugLogs,
  }
}
