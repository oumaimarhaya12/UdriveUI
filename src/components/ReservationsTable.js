"use client"
import { MapPin, Calendar, Car, CheckCircle, XCircle, XSquare, User } from "lucide-react"
import "../styles/dashboard.css"

const ReservationsTable = ({
  reservations,
  isLoading,
  activeTab,
  handleApproveReservation,
  handleRejectReservation,
  handleCancelReservation,
  formatDate,
}) => {
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

            return (
              <tr key={reservationId}>
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
                          className="confirm-button"
                          onClick={() => {
                            console.log("Confirm button clicked for ID:", reservationId)
                            handleApproveReservation(reservationId)
                          }}
                        >
                          <CheckCircle size={16} />
                          Confirm
                        </button>
                        <button
                          className="decline-button"
                          onClick={() => {
                            console.log("Decline button clicked for ID:", reservationId)
                            handleRejectReservation(reservationId)
                          }}
                        >
                          <XCircle size={16} />
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        className="cancel-button"
                        onClick={() => {
                          console.log("Cancel button clicked for ID:", reservationId)
                          handleCancelReservation(reservationId)
                        }}
                      >
                        <XSquare size={16} />
                        Cancel
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
