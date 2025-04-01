import { Calendar, Clock, ArrowRight, MapPin } from "lucide-react"
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
    <div className="booking-summary">
      <div className="booking-content">
        <div className="booking-section pickup-section">
          <div className="section-label">Pick-up</div>
          <div className="section-content">
            <div className="location">
              <MapPin size={16} className="location-icon" />
              <span>{bookingData.pickupDetails}</span>
            </div>
            <div className="datetime">
              <Calendar size={14} />
              <span>{formatDate(bookingData.pickupDate)}</span>
              <span className="time-separator">•</span>
              <Clock size={14} />
              <span>{bookingData.pickupTime}</span>
            </div>
          </div>
        </div>

        <div className="booking-divider">
          <div className="arrow-circle">
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="booking-section dropoff-section">
          <div className="section-label">Drop-off</div>
          <div className="section-content">
            <div className="location">
              <MapPin size={16} className="location-icon" />
              <span>{bookingData.dropoffDetails}</span>
            </div>
            <div className="datetime">
              <Calendar size={14} />
              <span>{formatDate(bookingData.dropoffDate)}</span>
              <span className="time-separator">•</span>
              <Clock size={14} />
              <span>{bookingData.dropoffTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingSummary

