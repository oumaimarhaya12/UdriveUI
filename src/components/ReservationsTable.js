"use client"
import { MapPin, Calendar, Car, CheckCircle, XCircle, XSquare, User } from "lucide-react"
import "../styles/dashboard.css"
import { useState } from "react"

// Add a check to prevent duplicate action handling
const ReservationsTable = ({
  reservations,
  isLoading,
  activeTab,
  handleApproveReservation,
  handleRejectReservation,
  handleCancelReservation,
  formatDate,
}) => {
  // Add state to track which reservations are being processed
  const [processingIds, setProcessingIds] = useState({})

  // Helper function to handle action with processing state
  const handleAction = async (id, actionFn) => {
    if (processingIds[id]) return // Prevent duplicate actions

    console.log(`Starting action for reservation ID: ${id}`)
    setProcessingIds((prev) => ({ ...prev, [id]: true }))

    try {
      const result = await actionFn(id)
      console.log(`Action result:`, result)

      if (result.success) {
        console.log(`Action completed successfully: ${result.message}`)
      } else {
        console.error(`Action failed: ${result.error}`)
      }
    } catch (error) {
      console.error(`Error during action:`, error)
    } finally {
      setProcessingIds((prev) => ({ ...prev, [id]: false }))
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading reservations...</p>
      </div>
    )
  }

  if (reservations.length === 0) {
    return (
      <div className="empty-state">
        <Calendar size={48} />
        <p>No {activeTab} reservations found.</p>
        <p className="empty-state-subtitle">
          {activeTab === "pending"
            ? "There are no pending reservations waiting for approval."
            : "There are no confirmed reservations at this time."}
        </p>
      </div>
    )
  }

  // Log the first reservation to see its structure (if available)
  if (reservations.length > 0) {
    console.log("First reservation structure:", JSON.stringify(reservations[0], null, 2))
  }

  // Debug the reservations data
  console.log("Reservations in table:", reservations)

  // Update the action buttons to use the new handler function
  return (
    <div className="table-container">
      <table className="reservations-table">
        <thead>
          <tr>
            <th>ID</th>
            {activeTab === "pending" && <th>Client</th>}
            <th>Vehicle</th>
            <th>From</th>
            <th>To</th>
            <th>Pickup</th>
            <th>Return</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => {
            // Debug each reservation
            console.log("Rendering reservation:", reservation)

            // Use either id or idReservation, whichever is available, or fall back to index
            const reservationId = reservation.id || reservation.idReservation || index + 1
            const isProcessing = processingIds[reservationId]

            return (
              <tr key={reservationId} className={isProcessing ? "processing" : ""}>
                <td>{reservationId}</td>
                {activeTab === "pending" && (
                  <td className="client-name">
                    <div className="client-info">
                      <User className="icon" />
                      <span>{reservation.clientName || "Unknown Client"}</span>
                    </div>
                  </td>
                )}
                <td>
                  <div className="vehicle-info">
                    <Car className="icon" />
                    <span>
                      {reservation.carBrand && reservation.carModel
                        ? `${reservation.carBrand} ${reservation.carModel}`
                        : reservation.carModel || reservation.carBrand || "Unknown Vehicle"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="location-info">
                    <MapPin className="icon" />
                    <span>{reservation.pickupAdress || "No pickup location"}</span>
                  </div>
                </td>
                <td>
                  <div className="location-info">
                    <MapPin className="icon" />
                    <span>{reservation.dropoffAdress || "No dropoff location"}</span>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <Calendar className="icon" />
                    <span>{reservation.pickupDate ? formatDate(reservation.pickupDate) : "Not specified"}</span>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <Calendar className="icon" />
                    <span>{reservation.dropoffDate ? formatDate(reservation.dropoffDate) : "Not specified"}</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    {activeTab === "pending" ? (
                      <>
                        <button
                          className={`confirm-button ${isProcessing ? "disabled" : ""}`}
                          onClick={() => {
                            console.log("Confirm button clicked for ID:", reservationId)
                            handleAction(reservationId, handleApproveReservation)
                          }}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <span className="loading-dot"></span> : <CheckCircle size={16} />}
                          {isProcessing ? "Processing..." : "Confirm"}
                        </button>
                        <button
                          className={`decline-button ${isProcessing ? "disabled" : ""}`}
                          onClick={() => handleAction(reservationId, handleRejectReservation)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <span className="loading-dot"></span> : <XCircle size={16} />}
                          {isProcessing ? "Processing..." : "Decline"}
                        </button>
                      </>
                    ) : (
                      <button
                        className={`cancel-button ${isProcessing ? "disabled" : ""}`}
                        onClick={() => handleAction(reservationId, handleCancelReservation)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <span className="loading-dot"></span> : <XSquare size={16} />}
                        {isProcessing ? "Processing..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ReservationsTable
