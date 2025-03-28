"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Check, Calendar, Clock, MapPin, AlertTriangle, Download, Printer, Phone, Mail, FileText, UserCheck, ArrowRight, CreditCard, Car } from 'lucide-react'
import Header from "../components/Header"
import Footer from "../components/footer"
import "../styles/BookingConfirmed.css"

const BookingConfirmed = () => {
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState(null)
  const [car, setCar] = useState(null)

  useEffect(() => {
    // Get booking data and car details from sessionStorage
    const storedBookingData = sessionStorage.getItem("bookingFormData")
    const storedCar = sessionStorage.getItem("selectedCar")
    
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData))
    }

    if (storedCar) {
      setCar(JSON.parse(storedCar))
    }
  }, [])

  const handleDownloadClick = () => {
    window.print()
  }

  const handlePrintClick = () => {
    window.print()
  }

  const handleBackToHome = () => {
    navigate("/")
  }

  // Format dates for display
  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const options = { weekday: "short", month: "short", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  if (!bookingData || !car) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading booking information...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Calculate days between pickup and dropoff
  const calculateDays = () => {
    if (!bookingData) return 0

    const pickupDate = new Date(`${bookingData.pickupDate}T${bookingData.pickupTime}:00`)
    const dropoffDate = new Date(`${bookingData.dropoffDate}T${bookingData.dropoffTime}:00`)

    // Calculate the difference in milliseconds
    const diffTime = Math.abs(dropoffDate - pickupDate)

    // Convert to days and round up any partial day
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const days = calculateDays()

  return (
    <div className="booking-confirmed-page">
      <Header />
      
      <div className="booking-confirmed-container">
        <div className="booking-success-header">
          <div className="success-icon">
            <Check size={32} />
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="thank-you-message">
            Thank you for choosing Udrive! Our team will contact you shortly to finalize the details.
          </p>
        </div>

        <div className="booking-confirmed-content">
          <div className="booking-confirmed-main">
            <div className="booking-details-section">
              <h2>Booking Details</h2>
              
              {/* Simplified Booking Summary */}
              <div className="booking-summary">
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
                    {days}d {bookingData.pickupTime !== bookingData.dropoffTime ? "and some hours" : ""}
                  </div>
                </div>
              </div>
              
              <div className="car-summary">
                <div className="car-image">
                  <img src={car.imageUrl || "/placeholder.svg?height=200&width=300"} alt={car.model} />
                </div>
                <div className="car-info">
                  <h3>{car.model}</h3>
                  <p className="car-category">{car.category}</p>
                  <div className="car-features">
                    <span>{car.transmissionType}</span>
                    <span>{car.fuelType}</span>
                    <span>{car.seatsNumber} seats</span>
                    <span>{car.airConditioner ? "A/C" : "No A/C"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="required-documents-section">
              <h2>Required Documents</h2>
              <div className="documents-container">
                <div className="document-item">
                  <div className="document-icon">
                    <FileText size={24} />
                  </div>
                  <div className="document-info">
                    <h4>Identity Card (CIN)</h4>
                    <p>Please bring a copy of your identity card when picking up your car</p>
                  </div>
                </div>
                
                <div className="document-item">
                  <div className="document-icon">
                    <UserCheck size={24} />
                  </div>
                  <div className="document-info">
                    <h4>Valid Driver's License</h4>
                    <p>Your driver's license must be valid for the entire rental period</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-verification">
                <AlertTriangle size={18} />
                <p>Ensure your contact information is correct so we can reach you.</p>
              </div>
            </div>

            <div className="payment-info-section">
              <h2>Payment Information</h2>
              <div className="payment-info-content">
                <div className="payment-info-icon">
                  <CreditCard size={32} />
                </div>
                <div className="payment-info-text">
                  <h4>No upfront payment is required</h4>
                  <p>Simply pay in cash upon delivery. We accept all major payment methods including credit cards and cash.</p>
                </div>
              </div>
              <div className="payment-methods-display">
                <div className="payment-icon visa"></div>
                <div className="payment-icon mastercard"></div>
                <div className="payment-icon amex"></div>
                <div className="payment-icon paypal"></div>
                <div className="payment-icon cash">
                  <span>CASH</span>
                </div>
              </div>
            </div>

            <div className="booking-actions">
              <button className="action-button download" onClick={handleDownloadClick}>
                <Download size={18} />
                <span>Download Confirmation</span>
              </button>
              <button className="action-button print" onClick={handlePrintClick}>
                <Printer size={18} />
                <span>Print Details</span>
              </button>
              <button className="action-button home" onClick={handleBackToHome}>
                <span>Back to Home</span>
              </button>
            </div>
          </div>

          <div className="booking-confirmed-sidebar">
            <div className="price-summary-card">
              <div className="price-summary-header">
                <Car size={20} />
                <h3>Rental Summary</h3>
              </div>
              <div className="price-summary">
                <div className="price-row">
                  <span>Daily Rate:</span>
                  <span>{car.price} MAD</span>
                </div>
                <div className="price-row">
                  <span>Number of Days:</span>
                  <span>{days} days</span>
                </div>
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>{car.price * days} MAD</span>
                </div>
                <div className="price-row">
                  <span>Insurance:</span>
                  <span>150 MAD</span>
                </div>
                <div className="price-row total">
                  <span>Total Price:</span>
                  <span>{car.price * days + 150} MAD</span>
                </div>
              </div>
            </div>

            <div className="cancellation-policy">
              <h3>Cancellation Policy</h3>
              <div className="cancellation-content">
                <div className="cancellation-icon">
                  <AlertTriangle size={24} />
                </div>
                <p className="cancellation-text">
                  To cancel your reservation, get in touch with our team as soon as possible.
                </p>
              </div>
            </div>

            <div className="customer-support">
              <h3>Need Help?</h3>
              <p>Our team will contact you as soon as possible to confirm your booking</p>
              <div className="support-contact">
                <div className="contact-icon">
                  <Phone size={18} />
                </div>
                <div className="contact-info">
                  <strong>Phone</strong>
                  <span>+212 522 123 456</span>
                </div>
              </div>
              <div className="support-contact">
                <div className="contact-icon">
                  <Mail size={18} />
                </div>
                <div className="contact-info">
                  <strong>Email</strong>
                  <span>support@udrive.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BookingConfirmed
