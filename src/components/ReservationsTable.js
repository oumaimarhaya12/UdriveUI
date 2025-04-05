"use client"
import { MapPin, Calendar, Car, CheckCircle, XCircle } from "lucide-react"
import "../styles/ReservationsTable.css"

const ReservationsTable = ({
  reservations,
  isLoading,
  activeTab,
  handleApproveReservation,
  handleRejectReservation,
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

  // Debug the reservations data
  console.log("Reservations in table:", reservations)

  return (
    <div className="table-container">
      <table className="reservations-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Vehicle</th>
            <th>Pickup Date</th>
            <th>Return Date</th>
            <th>Pickup Location</th>
            <th>Return Location</th>
            <th>Price</th>
            {activeTab === "pending" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            // Debug each reservation
            console.log("Rendering reservation:", reservation)

            // Use either id or idReservation, whichever is available
            const reservationId = reservation.id || reservation.idReservation

            return (
              <tr key={reservationId}>
                <td>{reservationId}</td>
                <td className="client-name">{reservation.clientName}</td>
                <td>
                  <div className="vehicle-info">
                    <Car className="icon" />
                    <span>
                      {reservation.carBrand && reservation.carModel
                        ? `${reservation.carBrand} ${reservation.carModel}`
                        : reservation.carModel || reservation.carBrand || "Vehicle information not available"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <Calendar className="icon" />
                    <span>{formatDate(reservation.pickupDate)}</span>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <Calendar className="icon" />
                    <span>{formatDate(reservation.dropoffDate)}</span>
                  </div>
                </td>
                <td>
                  <div className="location-info">
                    <MapPin className="icon" />
                    <span>{reservation.pickupAdress}</span>
                  </div>
                </td>
                <td>
                  <div className="location-info">
                    <MapPin className="icon" />
                    <span>{reservation.dropoffAdress}</span>
                  </div>
                </td>
                <td className="price">{reservation.price.toFixed(2)} MAD</td>
                {activeTab === "pending" && (
                  <td>
                    <div className="action-buttons">
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
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ReservationsTable

