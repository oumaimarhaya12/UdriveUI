"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import LoginForm from "./LoginForm"
import "../styles/LoginPage.css"
import pneuPurple from "../assets/pneuPurple.svg" // Import the SVG

const LoginPage = () => {
  const location = useLocation()

  useEffect(() => {
    // If there's no redirectAfterLogin in sessionStorage yet,
    // store the current path as the redirect destination
    if (!sessionStorage.getItem("redirectAfterLogin")) {
      // Get the previous page from the referrer if available
      const referrer = document.referrer

      if (referrer && referrer.includes(window.location.origin)) {
        // Extract the path from the referrer URL
        const referrerPath = new URL(referrer).pathname
        // Don't redirect back to login or signup pages
        if (referrerPath !== "/login" && referrerPath !== "/signup") {
          sessionStorage.setItem("redirectAfterLogin", referrerPath)
          console.log("Stored redirect path:", referrerPath)
        }
      }
    }
  }, [location])

  return (
    <div className="login-page">
      {/* Add the SVG as a direct img element for maximum control */}
      <img src={pneuPurple || "/placeholder.svg"} alt="" className="pneu-background" />

      <div className="login-content">
        <LoginForm />
      </div>

      <div className="login-page-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  )
}

export default LoginPage

