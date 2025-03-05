import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react'
import "../styles/BookingSummary.css"

const BookingSummary = () => {
  // Get booking data from sessionStorage
  const bookingData = JSON.parse(sessionStorage.getItem("bookingFormData") || "{}")

  if (!bookingData.pickupDetails) {
    return null // Don't render if no data is available
  }

  // Format dates for display
  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const options = { weekday: "short", month: "short", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  return (
    <div className="booking-summary-container">
      <div className="booking-summary-header">
        <h3>Booking Summary</h3>
      </div>

      <div className="booking-details-container">
        <div className="booking-location-container">
          <div className="pickup-location">
            <div className="location-icon pickup-icon">
              <MapPin size={16} />
            </div>
            <div className="location-details">
              <div className="location-label">Pick-up</div>
              <div className="location-value">{bookingData.pickupDetails}</div>
            </div>
          </div>

          <div className="location-arrow">
            <ArrowRight size={18} />
          </div>

          <div className="dropoff-location">
            <div className="location-icon dropoff-icon">
              <MapPin size={16} />
            </div>
            <div className="location-details">
              <div className="location-label">Drop-off</div>
              <div className="location-value">{bookingData.dropoffDetails}</div>
            </div>
          </div>
        </div>

        <div className="booking-time-container">
          <div className="booking-time-item">
            <div className="time-icon">
              <Calendar size={14} />
            </div>
            <div className="time-details">
              <div className="time-label">Pick-up Date</div>
              <div className="time-value">{formatDate(bookingData.pickupDate)}</div>
            </div>
          </div>

          <div className="booking-time-item">
            <div className="time-icon">
              <Clock size={14} />
            </div>
            <div className="time-details">
              <div className="time-label">Pick-up Time</div>
              <div className="time-value">{bookingData.pickupTime}</div>
            </div>
          </div>

          <div className="booking-time-item">
            <div className="time-icon">
              <Calendar size={14} />
            </div>
            <div className="time-details">
              <div className="time-label">Drop-off Date</div>
              <div className="time-value">{formatDate(bookingData.dropoffDate)}</div>
            </div>
          </div>

          <div className="booking-time-item">
            <div className="time-icon">
              <Clock size={14} />
            </div>
            <div className="time-details">
              <div className="time-label">Drop-off Time</div>
              <div className="time-value">{bookingData.dropoffTime}</div>
            </div>
          </div>
        </div>

        <div className="booking-duration">
          <div className="duration-label">Total Duration:</div>
          <div className="duration-value">
            {calculateDuration(
              bookingData.pickupDate,
              bookingData.pickupTime,
              bookingData.dropoffDate,
              bookingData.dropoffTime,
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate duration between pickup and dropoff
function calculateDuration(pickupDate, pickupTime, dropoffDate, dropoffTime) {
  if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
    return "N/A"
  }

  const pickup = new Date(`${pickupDate}T${pickupTime}`)
  const dropoff = new Date(`${dropoffDate}T${dropoffTime}`)

  const diffMs = dropoff - pickup
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h`
  } else {
    return `${diffHours}h`
  }
}

export default BookingSummary
