"use client"

import { useRef, useEffect, useState } from "react"
import { Mail, Phone, CreditCard, AlertCircle } from "lucide-react"
import "../styles/PaymentDetails.css"

const PaymentDetails = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const animateOnScroll = () => {
      if (!sectionRef.current) return

      const elements = sectionRef.current.querySelectorAll(".payment-section, .cancellation-section")
      const sectionTop = sectionRef.current.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (sectionTop < windowHeight * 0.8) {
        setIsVisible(true)
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add("animate")
          }, index * 200)
        })
      }
    }

    animateOnScroll() // Check on initial render
    window.addEventListener("scroll", animateOnScroll)

    return () => window.removeEventListener("scroll", animateOnScroll)
  }, [])

  return (
    <div className="payment-details-container" ref={sectionRef}>
      <div className="payment-section">
        <div className="payment-header">
          <CreditCard size={24} className="payment-icon" />
          <h3>Payment Details</h3>
        </div>
        <div className="payment-content">
          <p className="payment-text">No upfront payment is required. Simply pay in cash upon delivery.</p>
        </div>
      </div>

      <div className="cancellation-section">
        <div className="payment-header">
          <AlertCircle size={24} className="payment-icon" />
          <h3>Cancellation Policy</h3>
        </div>
        <div className="payment-content">
          <p className="payment-text">To cancel your reservation, get in touch with our team as soon as possible.</p>

          <div className="contact-details">
            <div className="contact-item">
              <Mail size={20} className="contact-icon" />
              <div className="contact-info">
                <span className="contact-label">Email</span>
                <a href="mailto:Udrive@gmail.com" className="contact-value">
                  Udrive@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-item">
              <Phone size={20} className="contact-icon" />
              <div className="contact-info">
                <span className="contact-label">Phone</span>
                <a href="tel:+212762639683" className="contact-value">
                  +212-762639683
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetails

