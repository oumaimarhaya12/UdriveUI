"use client"

import { useRef, useEffect } from "react"
import { Mail, Phone, CreditCard, AlertCircle } from "lucide-react"
import "../styles/PaymentDetails.css"

const PaymentDetails = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const animateOnScroll = () => {
      if (!sectionRef.current) return

      const elements = sectionRef.current.querySelectorAll(".info-card")
      const sectionTop = sectionRef.current.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (sectionTop < windowHeight * 0.8) {
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
    <div className="payment-info-container" ref={sectionRef}>
      <div className="info-card payment-card">
        <div className="card-icon">
          <CreditCard size={24} />
        </div>
        <h3>Payment Method</h3>
        <p>No upfront payment is required. Simply pay in cash upon delivery of the vehicle.</p>
      </div>

      <div className="info-card cancellation-card">
        <div className="card-icon">
          <AlertCircle size={24} />
        </div>
        <h3>Cancellation Policy</h3>
        <p>To cancel your reservation, contact our team:</p>
        <div className="contact-info">
          <a href="mailto:Udrive@gmail.com" className="contact-item">
            <div className="contact-icon-wrapper">
              <Mail size={16} />
            </div>
            <span className="contact-text">Udrive@gmail.com</span>
          </a>
          <a href="tel:+212762639683" className="contact-item">
            <div className="contact-icon-wrapper">
              <Phone size={16} />
            </div>
            <span className="contact-text">+212-762639683</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetails

