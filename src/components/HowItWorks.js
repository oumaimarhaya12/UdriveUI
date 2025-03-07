"use client"

import { useEffect, useRef } from "react"
import "../styles/HowItWorks.css"

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const stepsRef = useRef([])

  const steps = [
    {
      number: "1",
      mainText: "Enter Your Information",
      subText: "Fill in your details so we can prepare the perfect ride for you",
      icon: "form-icon",
    },
    {
      number: "2",
      mainText: "Choose Your Car",
      subText: "Browse our wide selection of vehicles and pick the one that suits your needs",
      icon: "car-icon",
    },
    {
      number: "3",
      mainText: "Confirm Your Booking",
      subText:
        "Submit your request. Our team will contact you shortly to confirm your booking and finalize the details",
      icon: "confirm-icon",
    },
    {
      number: "4",
      mainText: "Get Your Car Delivered & Pay on Delivery",
      subText:
        "Sit back and relax! We'll deliver the car to your preferred location. Payment is easy—just pay in cash when the car arrives",
      icon: "delivery-icon",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    stepsRef.current.forEach((step) => {
      if (step) {
        observer.observe(step)
      }
    })

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      stepsRef.current.forEach((step) => {
        if (step) {
          observer.unobserve(step)
        }
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="how-it-works-section">
      <div className="section-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
      </div>

      <h2 className="section-title">
        <span className="highlight">Your Journey</span>, Simplified—Here's How It Works!
      </h2>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} ref={(el) => (stepsRef.current[index] = el)} className={`step-card step-delay-${index}`}>
            <div className="step-number-wrapper">
              <div className="step-number">
                <span>{step.number}</span>
                <div className="pulse-ring"></div>
              </div>
              {index < steps.length - 1 && <div className="connector-line"></div>}
            </div>

            <div className="step-content">
              <div className={`step-icon ${step.icon}`}>
                <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {step.icon === "form-icon" && (
                    <>
                      <path
                        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 7H17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 12H17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 17H13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                  {step.icon === "car-icon" && (
                    <>
                      <path
                        d="M16 3H8L3 10H21L16 3Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.5 14.5H6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.5 14.5H20.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 10L4 17H20L21 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="7.5"
                        cy="17.5"
                        r="2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="16.5"
                        cy="17.5"
                        r="2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                  {step.icon === "confirm-icon" && (
                    <>
                      <path
                        d="M20 6L9 17L4 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                  {step.icon === "delivery-icon" && (
                    <>
                      <path
                        d="M3 4H15V16H3V4Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 8H19L21 10V16H15V8Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="7"
                        cy="19"
                        r="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="17"
                        cy="19"
                        r="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 19H5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 19H15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>
              </div>
              <div className="step-text">
                <h3 className="step-title">{step.mainText}</h3>
                <p className="step-description">{step.subText}</p>
              </div>
              <div className="step-hover-effect"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

