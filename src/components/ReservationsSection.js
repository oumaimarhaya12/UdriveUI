"use client"

import { useState, useEffect } from "react"
import TabsComponent from "./TabsComponent"
import ReservationsTable from "./ReservationsTable"
import ReservationStats from "./ReservationStats"
import ReservationFilters from "./ReservationFilters"
import { RefreshCw, AlertCircle, CheckCircle, Bug } from "lucide-react"
import "../styles/dashboard.css"

const ReservationsSection = ({
  pendingReservations,
  confirmedReservations,
  isLoading,
  handleApproveReservation,
  handleRejectReservation,
  handleCancelReservation,
  formatDate,
  fetchReservations,
  testApiConnection,
  testValidateReservation,
  debugLogs,
}) => {
  const [activeTab, setActiveTab] = useState("pending")
  const [filteredPendingReservations, setFilteredPendingReservations] = useState(pendingReservations)
  const [filteredConfirmedReservations, setFilteredConfirmedReservations] = useState(confirmedReservations)
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    minPrice: null,
    maxPrice: null,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [apiTestResult, setApiTestResult] = useState(null)
  const [showApiTestResult, setShowApiTestResult] = useState(false)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [directTestId, setDirectTestId] = useState("")
  const [directTestResult, setDirectTestResult] = useState(null)

  // Apply filters whenever the original data or filters change
  useEffect(() => {
    // Filter pending reservations
    const filteredPending = pendingReservations.filter((reservation) => {
      // Date filtering
      if (filters.startDate && reservation.pickupDate) {
        const pickupDate = new Date(reservation.pickupDate)
        if (pickupDate < filters.startDate) return false
      }

      if (filters.endDate && reservation.dropoffDate) {
        const dropoffDate = new Date(reservation.dropoffDate)
        if (dropoffDate > filters.endDate) return false
      }

      // Price filtering (only for pending reservations)
      if (filters.minPrice !== null && reservation.price < filters.minPrice) return false
      if (filters.maxPrice !== null && reservation.price > filters.maxPrice) return false

      return true
    })

    setFilteredPendingReservations(filteredPending)

    // Filter confirmed reservations (only by date)
    const filteredConfirmed = confirmedReservations.filter((reservation) => {
      // Date filtering
      if (filters.startDate && reservation.pickupDate) {
        const pickupDate = new Date(reservation.pickupDate)
        if (pickupDate < filters.startDate) return false
      }

      if (filters.endDate && reservation.dropoffDate) {
        const dropoffDate = new Date(reservation.dropoffDate)
        if (dropoffDate > filters.endDate) return false
      }

      return true
    })

    setFilteredConfirmedReservations(filteredConfirmed)
  }, [pendingReservations, confirmedReservations, filters])

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
  }

  // Update the handleRefresh function to add a delay before refreshing
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchReservations()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 500) // Add a small delay to make the refresh animation visible
  }

  // Add these new functions to handle reservation actions with proper feedback
  const handleConfirmReservation = async (reservationId) => {
    console.log(`Starting confirmation process for reservation ID: ${reservationId}`)
    const result = await handleApproveReservation(reservationId)

    if (result.success) {
      // Success handling - you could add a toast notification here
      console.log(`✅ ${result.message}`)
    } else {
      // Error handling
      console.error(`❌ ${result.error}`)
    }

    return result
  }

  const handleDeclineReservation = async (reservationId) => {
    const result = await handleRejectReservation(reservationId)
    if (result.success) {
      // Success handling
      console.log(result.message)
    } else {
      // Error handling
      console.error(result.error)
    }
    return result
  }

  const handleCancelConfirmedReservation = async (reservationId) => {
    const result = await handleCancelReservation(reservationId)
    if (result.success) {
      // Success handling
      console.log(result.message)
    } else {
      // Error handling
      console.error(result.error)
    }
    return result
  }

  const handleTestApiConnection = async () => {
    setIsRefreshing(true)
    setShowApiTestResult(true)
    const result = await testApiConnection()
    setApiTestResult(result)

    // Auto-hide the result after 5 seconds
    setTimeout(() => {
      setShowApiTestResult(false)
    }, 5000)

    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }

  const handleDirectTest = async () => {
    if (!directTestId) {
      setDirectTestResult({
        success: false,
        error: "Please enter a reservation ID",
      })
      return
    }

    setIsRefreshing(true)
    const result = await testValidateReservation(directTestId)
    setDirectTestResult(result)
    setIsRefreshing(false)
  }

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
  ]

  return (
    <div className="reservations-section">
      <div className="modern-header">
        <h2>Reservations</h2>
        <div className="header-actions">
          <button className={`modern-refresh ${isRefreshing ? "refreshing" : ""}`} onClick={handleRefresh}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          {/* Debug button - remove in production */}
          <button className="api-test-button" onClick={handleTestApiConnection} title="Test API Connection">
            <span>Test API</span>
          </button>
          <button
            className="debug-button"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            title="Toggle Debug Panel"
          >
            <Bug size={16} />
            <span>Debug</span>
          </button>
        </div>
      </div>

      {/* Display API test result */}
      {showApiTestResult && apiTestResult && (
        <div className={`api-test-result ${apiTestResult.success ? "success" : "error"}`}>
          {apiTestResult.success ? (
            <div className="api-success">
              <CheckCircle size={16} />
              <span>{apiTestResult.message}</span>
            </div>
          ) : (
            <div className="api-error">
              <AlertCircle size={16} />
              <span>{apiTestResult.error}</span>
            </div>
          )}
        </div>
      )}

      {/* Debug Panel */}
      {showDebugPanel && (
        <div className="debug-panel">
          <h4>Debug Tools</h4>
          <div className="direct-test">
            <p>Test validateReservation endpoint directly:</p>
            <div className="direct-test-controls">
              <input
                type="text"
                placeholder="Reservation ID"
                value={directTestId}
                onChange={(e) => setDirectTestId(e.target.value)}
              />
              <button onClick={handleDirectTest}>Test</button>
            </div>
            {directTestResult && (
              <div className={`direct-test-result ${directTestResult.success ? "success" : "error"}`}>
                {directTestResult.success ? (
                  <pre>{JSON.stringify(directTestResult.data, null, 2)}</pre>
                ) : (
                  <p>Error: {directTestResult.error}</p>
                )}
              </div>
            )}
          </div>
          <h4>Recent Logs:</h4>
          <div className="debug-logs">
            {debugLogs.slice(-5).map((log, index) => (
              <div key={index} className="log-entry">
                <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="log-message">{log.message}</span>
                {log.data && <pre className="log-data">{log.data}</pre>}
              </div>
            ))}
          </div>
        </div>
      )}

      <ReservationStats pendingCount={pendingReservations.length} confirmedCount={confirmedReservations.length} />

      <div className="modern-controls">
        <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        <ReservationFilters onApplyFilters={handleApplyFilters} activeTab={activeTab} />
      </div>

      {activeTab === "pending" && (
        <>
          {filteredPendingReservations.length !== pendingReservations.length && (
            <div className="filter-indicator">
              Showing {filteredPendingReservations.length} of {pendingReservations.length} pending reservations
            </div>
          )}
          <ReservationsTable
            reservations={filteredPendingReservations}
            isLoading={isLoading}
            activeTab={activeTab}
            handleApproveReservation={handleConfirmReservation}
            handleRejectReservation={handleDeclineReservation}
            handleCancelReservation={handleCancelConfirmedReservation}
            formatDate={formatDate}
            testApiConnection={testApiConnection}
          />
        </>
      )}

      {activeTab === "confirmed" && (
        <>
          {filteredConfirmedReservations.length !== confirmedReservations.length && (
            <div className="filter-indicator">
              Showing {filteredConfirmedReservations.length} of {confirmedReservations.length} confirmed reservations
            </div>
          )}
          <ReservationsTable
            reservations={filteredConfirmedReservations}
            isLoading={isLoading}
            activeTab={activeTab}
            handleApproveReservation={handleConfirmReservation}
            handleRejectReservation={handleDeclineReservation}
            handleCancelReservation={handleCancelConfirmedReservation}
            formatDate={formatDate}
            testApiConnection={testApiConnection}
          />
        </>
      )}
    </div>
  )
}

export default ReservationsSection
