"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Truck, HeadphonesIcon, CreditCard } from "lucide-react"
import "../styles/PromoBanner.css"

const PromoBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Features to highlight in the banner based on provided motivations
  const features = [
    {
      icon: <Truck size={24} />,
      title: "Free Delivery",
      description: "We bring the car to you!",
    },
    {
      icon: <HeadphonesIcon size={24} />,
      title: "24/7 Support",
      description: "We're here to help! Anytime",
    },
    {
      icon: <CreditCard size={24} />,
      title: "Cash on Delivery",
      description: "No upfront payment required",
    },
  ]

  // Auto-rotate through slides
  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % features.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Handle manual navigation
  const goToSlide = (index) => {
    setActiveSlide(index)
  }

  return (
    <div className={`promo-banner ${isVisible ? "visible" : ""}`}>
      <div className="promo-content">
        <div className="promo-left">
          <div className="animated-car-container">
            <div className="car-silhouette">
              {/* Car body is defined in CSS with pseudo-elements */}
            </div>
            <div className="wheel wheel-front"></div>
            <div className="wheel wheel-back"></div>
            <div className="road">
              <div className="road-line"></div>
              <div className="road-line"></div>
              <div className="road-line"></div>
            </div>
          </div>
        </div>

        <div className="promo-right">
          <h3 className="promo-title">Why Choose Udrive?</h3>

          <div className="features-slider">
            {features.map((feature, index) => (
              <div key={index} className={`feature-slide ${index === activeSlide ? "active" : ""}`}>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-text">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="slide-indicators">
            {features.map((_, index) => (
              <button
                key={index}
                className={`slide-dot ${index === activeSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button className="promo-cta">
            Learn More <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromoBanner